// Mostra um resumo (saldo, total apostado, pendentes, lucro/prejuízo)
// e a lista de eventos disponíveis para apostar, com odds calculadas ao vivo.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEvents } from "../services/eventService";
import { getBetsByUser } from "../services/betService";
import { useOdds } from "../hooks/useOdds";
import OddBadge from "../components/OddBadge";

// Componente auxiliar: renderiza UMA linha de evento com suas odds.
// Separados num componente próprio porque o hook useOdds precisa ser chamado uma vez por evento, e hooks não podem ser chamados dentro de loops.
function EventRow({ event, onBet }) {
  // Calcula as odds DESTE evento a partir dos seus pools.
  const { oddA, oddB, oddDraw } = useOdds(event);

  return (
    <div className="event-card">
      <div className="event-info">
        <strong>
          {event.teamA} x {event.teamB}
        </strong>
        <span>
          {" "}
          · {event.sport} · {event.date}
        </span>
      </div>

      <div className="event-odds">
        {/* Um selo de odd para cada lado. O clique leva à tela de aposta. */}
        <OddBadge
          label={event.teamA}
          odd={oddA}
          onClick={() => onBet(event.id)}
        />
        <OddBadge
          label="Empate"
          odd={oddDraw}
          onClick={() => onBet(event.id)}
        />
        <OddBadge
          label={event.teamB}
          odd={oddB}
          onClick={() => onBet(event.id)}
        />
      </div>
    </div>
  );
}

function UserDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Estado com a lista de eventos vinda da API.
  const [events, setEvents] = useState([]);

  // Apostas do jogador, para calcular o resumo (estatísticas).
  const [bets, setBets] = useState([]);

  // Busca os eventos ao abrir a tela.
  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents();
      // Mostra apenas eventos abertos para apostas.
      // .filter() cria um novo array só com os que passam na condição.
      const openEvents = data.filter((ev) => ev.status === "open");
      setEvents(openEvents);
    }
    loadEvents();
  }, []);

  // Carrega as apostas do jogador ao abrir a tela.
  useEffect(() => {
    async function loadBets() {
      const data = await getBetsByUser(user.id);
      setBets(data);
    }
    loadBets();
  }, [user.id]);

  // Leva o jogador para a tela de aposta do evento escolhido.
  function handleBet(eventId) {
    navigate(`/bet/${eventId}`);
  }

  // Cálculo a partir das apostas

  // Total apostado: soma o valor de todas as apostas.
  // reduce() percorre o array acumulando um valor. Começa em 0 e vai somando bet.amount.
  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);

  // Total recebido em prêmios: soma os payouts das apostas ganhas.
  const totalWon = bets
    .filter((bet) => bet.status === "won")
    .reduce((sum, bet) => sum + bet.payout, 0);

  // Quantidade de apostas ainda pendentes.
  const pendingCount = bets.filter((bet) => bet.status === "pending").length;

  // Lucro/prejuízo: o que ganhou em prêmios menos o que apostou (já resolvido).
  // Considera só apostas já liquidadas (ganhas ou perdidas), não as pendentes,
  // porque uma aposta pendente ainda pode virar prêmio.
  const settledBet = bets
    .filter((bet) => bet.status === "won" || bet.status === "lost")
    .reduce((sum, bet) => sum + bet.amount, 0);
  const profit = totalWon - settledBet;

  return (
    <div>
      <header>
        <h1>Eventos disponíveis</h1>
        <p>
          Olá, {user?.name} · Saldo: U$ {user?.balance}
        </p>
        <button onClick={() => navigate("/history")}>Meu histórico</button>
        <button onClick={() => navigate("/ranking")}>Ranking</button>
        <button onClick={() => navigate("/statement")}>Extrato</button>
        <button onClick={signOut}>Sair</button>
      </header>

      {/* Painel de resumo do jogador */}
      <section className="dashboard-summary">
        <div className="summary-card">
          <span>Saldo atual</span>
          <strong>U$ {user?.balance}</strong>
        </div>
        <div className="summary-card">
          <span>Total apostado</span>
          <strong>U$ {totalBet}</strong>
        </div>
        <div className="summary-card">
          <span>Apostas pendentes</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="summary-card">
          <span>Lucro / Prejuízo</span>
          {/* Mostra com sinal e classe diferente conforme positivo ou negativo. */}
          <strong
            className={profit >= 0 ? "profit-positive" : "profit-negative"}
          >
            {profit >= 0 ? "+" : ""}U$ {profit.toFixed(2)}
          </strong>
        </div>
      </section>

      {/* Lista de eventos disponíveis */}
      <section>
        <h2>Eventos abertos</h2>
        {/* Caso não haja eventos abertos */}
        {events.length === 0 ? (
          <p>Nenhum evento aberto para apostas no momento.</p>
        ) : (
          // Renderiza uma linha para cada evento aberto.
          events.map((ev) => (
            <EventRow key={ev.id} event={ev} onBet={handleBet} />
          ))
        )}
      </section>
    </div>
  );
}

export default UserDashboard;
