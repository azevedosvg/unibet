// Tela onde o jogador faz uma aposta em um evento.
// Fluxo: escolhe o palpite, digita o valor, vê a prévia do retorno, confirma.
// A confirmação executa a "transação": debita saldo, soma no pool, cria a aposta e registra a movimentação.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEventById, updateEvent } from "../services/eventService";
import { updateUser } from "../services/userService";
import { createBet, createTransaction } from "../services/betService";
import { useOdds } from "../hooks/useOdds";
import OddBadge from "../components/OddBadge";

function BetScreen() {
  // useParams lê os parâmetros da URL. Como a rota é "/bet/:id",
  // useParams() devolve { id: "3" } quando a URL é /bet/3.
  const { id } = useParams();
  const navigate = useNavigate();

  // Pega o usuário logado e a função de atualizar o contexto.
  // setUser vai servir para refletir o novo saldo na tela após apostar.
  const { user, setUser } = useAuth();

  // Estados da tela.
  const [event, setEvent] = useState(null);       // o evento carregado da API
  const [pick, setPick] = useState("");            // o palpite escolhido: "A", "B" ou "Draw"
  const [amount, setAmount] = useState("");        // o valor apostado (texto do input)
  const [message, setMessage] = useState("");      // feedback de erro
  const [loading, setLoading] = useState(false);   // trava o botão durante o envio

  // Calcula as odds do evento carregado.
  const { oddA, oddB, oddDraw } = useOdds(event);

  // Carrega o evento pelo id da URL quando a tela abre.
  useEffect(() => {
    async function loadEvent() {
      const data = await getEventById(id);
      setEvent(data);
    }
    loadEvent();
  }, [id]); // se o id mudar, recarrega

  // Enquanto o evento não chegou, mostra um aviso de carregando.
  if (!event) {
    return <p>Carregando evento...</p>;
  }

  // Descobre a odd correspondente ao palpite escolhido (para a prévia).
  function getSelectedOdd() {
    if (pick === "A") return oddA;
    if (pick === "B") return oddB;
    if (pick === "Draw") return oddDraw;
    return 0;
  }

  // Calcula o retorno estimado: valor apostado × odd do palpite.
  // Number(amount) converte o texto do input em número.
  const estimatedReturn = (Number(amount) * getSelectedOdd()).toFixed(2);

  // Executa a aposta quando o jogador confirma.
  async function handleConfirm() {
    setMessage("");

    const value = Number(amount);

    // Validações
    if (!pick) {
      setMessage("Escolha um palpite antes de apostar.");
      return;
    }
    if (!value || value <= 0) {
      setMessage("Informe um valor válido para a aposta.");
      return;
    }
    if (value < 10) {
      setMessage("A aposta mínima é U$ 10.");
      return;
    }
    if (value > user.balance) {
      setMessage("Saldo insuficiente para esta aposta.");
      return;
    }

    setLoading(true);

    try {
      // Mapeia o palpite para o campo de pool correspondente no evento.
      const poolField =
        pick === "A" ? "poolA" : pick === "B" ? "poolB" : "poolDraw";

      // A "odd no momento": guardamos quanto a odd valia quando o jogador apostou.
      // Fica bonito no histórico mostrar a odd da hora vs. a final.
      const oddAtBet = getSelectedOdd();

      //  A TRANSAÇÃO (vários passos que, juntos, formam uma aposta)

      // 1) Debita o valor do saldo do jogador.
      const newBalance = user.balance - value;
      await updateUser(user.id, { balance: newBalance });

      // 2) Soma o valor ao pool do lado escolhido (atualiza o mercado).
      const newPoolValue = (event[poolField] || 0) + value;
      await updateEvent(event.id, { [poolField]: newPoolValue });

      // 3) Cria o registro da aposta.
      await createBet({
        userId: user.id,
        eventId: event.id,
        pick,                  // "A", "B" ou "Draw"
        amount: value,
        oddAtBet,              // odd registrada no momento da aposta
        status: "pending",     // ainda não foi liquidada
        payout: 0,             // retorno só é definido na liquidação
      });

      // 4) Registra a movimentação (base do extrato).
      await createTransaction({
        userId: user.id,
        type: "bet",
        value: -value,         // negativo: saiu da carteira
        description: `Aposta em ${event.teamA} x ${event.teamB}`,
        date: new Date().toISOString(),
      });

      // Atualiza o usuário no contexto para o saldo novo aparecer na tela.
      setUser({ ...user, balance: newBalance });

      // Volta para a lista de eventos.
      navigate("/dashboard");
    } catch (err) {
      setMessage("Erro ao registrar a aposta. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div>
      <header>
        <h1>Fazer aposta</h1>
        <p>Saldo disponível: U$ {user.balance}</p>
      </header>

      <section>
        <h2>{event.teamA} x {event.teamB}</h2>
        <p>{event.sport} · {event.date}</p>

        {/* Escolha do palpite: cada selo marca um lado. */}
        <div className="bet-options">
          <OddBadge
            label={event.teamA}
            odd={oddA}
            onClick={() => setPick("A")}
            selected={pick === "A"}
          />
          <OddBadge
            label="Empate"
            odd={oddDraw}
            onClick={() => setPick("Draw")}
            selected={pick === "Draw"}
          />
          <OddBadge
            label={event.teamB}
            odd={oddB}
            onClick={() => setPick("B")}
            selected={pick === "B"}
          />
        </div>

        {/* Valor da aposta */}
        <div>
          <label>Valor da aposta (U$)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Mínimo U$ 10"
            min="10"
          />
        </div>

        {/* Prévia do retorno: só aparece se há palpite e valor. */}
        {pick && Number(amount) > 0 && (
          <p>
            Retorno estimado: <strong>U$ {estimatedReturn}</strong>
          </p>
        )}

        {/* Mensagem de erro */}
        {message && <p className="msg-error">{message}</p>}

        {/* Botões */}
        <button onClick={handleConfirm} disabled={loading}>
          {loading ? "Confirmando..." : "Confirmar aposta"}
        </button>
        <button onClick={() => navigate("/dashboard")}>Cancelar</button>
      </section>
    </div>
  );
}

export default BetScreen;