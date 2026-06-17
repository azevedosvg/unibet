// Histórico de apostas do jogador logado.
// Mostra todas as apostas com o confronto, o palpite, o valor, a odd e o status.
// Permite filtrar por status (todas, pendentes, ganhas, perdidas).

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getBetsByUser } from "../services/betService";
import { getEvents } from "../services/eventService";

function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lista de apostas do jogador.
  const [bets, setBets] = useState([]);
  // Lista de eventos (para cruzar e mostrar o nome do confronto).
  const [events, setEvents] = useState([]);
  // Filtro de status selecionado. "all" mostra todas.
  const [filter, setFilter] = useState("all");

  // Carrega apostas e eventos ao abrir a tela.
  useEffect(() => {
    async function loadData() {
      // Busca em paralelo: as apostas do usuário e todos os eventos.
      // Promise.all dispara as duas chamadas ao mesmo tempo e espera ambas,
      // o que é mais rápido do que uma depois da outra.
      const [userBets, allEvents] = await Promise.all([
        getBetsByUser(user.id),
        getEvents(),
      ]);
      setBets(userBets);
      setEvents(allEvents);
    }
    loadData();
  }, [user.id]);

  // Dado um eventId, encontra o evento correspondente para exibir o confronto.
  function getEventLabel(eventId) {
    // .find() retorna o primeiro evento cujo id bate, ou undefined se não achar.
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return "Evento removido";
    return `${ev.teamA} x ${ev.teamB}`;
  }

  // Traduz o palpite (código interno) para texto legível.
  function getPickLabel(bet) {
    const ev = events.find((e) => e.id === bet.eventId);
    if (!ev) return bet.pick;
    if (bet.pick === "A") return ev.teamA;
    if (bet.pick === "B") return ev.teamB;
    return "Empate";
  }

  // Traduz o status (código interno) para texto em português.
  function getStatusLabel(status) {
    if (status === "pending") return "Pendente";
    if (status === "won") return "Ganhou";
    if (status === "lost") return "Perdeu";
    return status;
  }

  // Aplica o filtro: se "all", mostra todas; senão, só as do status escolhido.
  const filteredBets =
    filter === "all" ? bets : bets.filter((b) => b.status === filter);

  return (
    <div>
      <header>
        <h1>Meu histórico de apostas</h1>
        <button onClick={() => navigate("/dashboard")}>Voltar</button>
      </header>

      {/* Botões de filtro por status */}
      <div className="history-filters">
        <button onClick={() => setFilter("all")}>Todas</button>
        <button onClick={() => setFilter("pending")}>Pendentes</button>
        <button onClick={() => setFilter("won")}>Ganhas</button>
        <button onClick={() => setFilter("lost")}>Perdidas</button>
      </div>

      <section>
        {filteredBets.length === 0 ? (
          <p>Nenhuma aposta encontrada.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Confronto</th>
                <th>Palpite</th>
                <th>Valor</th>
                <th>Odd</th>
                <th>Status</th>
                <th>Retorno</th>
              </tr>
            </thead>
            <tbody>
              {filteredBets.map((bet) => (
                <tr key={bet.id}>
                  <td>{getEventLabel(bet.eventId)}</td>
                  <td>{getPickLabel(bet)}</td>
                  <td>U$ {bet.amount}</td>
                  <td>{bet.oddAtBet?.toFixed(2)}</td>
                  <td>{getStatusLabel(bet.status)}</td>
                  {/* Mostra o retorno só se a aposta foi ganha. */}
                  <td>{bet.status === "won" ? `U$ ${bet.payout}` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default History;
