// Lista os eventos disponíveis para apostar, com as odds calculadas ao vivo.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEvents } from "../services/eventService";
import { useOdds } from "../hooks/useOdds";
import OddBadge from "../components/OddBadge";

// Componente auxiliar: renderiza UMA linha de evento com suas odds.
// Separamos num componente próprio porque o hook useOdds precisa ser chamado uma vez por evento, e cada evento tem suas próprias odds.
function EventRow({ event, onBet }) {
  // Calcula as odds DESTE evento a partir dos seus pools.
  const { oddA, oddB, oddDraw } = useOdds(event);

  return (
    <div className="event-card">
      <div className="event-info">
        <strong>{event.teamA} x {event.teamB}</strong>
        <span> · {event.sport} · {event.date}</span>
      </div>

      <div className="event-odds">
        {/* Um selo de odd para cada lado. O clique leva à tela de aposta. */}
        <OddBadge label={event.teamA} odd={oddA} onClick={() => onBet(event.id)} />
        <OddBadge label="Empate" odd={oddDraw} onClick={() => onBet(event.id)} />
        <OddBadge label={event.teamB} odd={oddB} onClick={() => onBet(event.id)} />
      </div>
    </div>
  );
}

function UserDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Estado com a lista de eventos vinda da API.
  const [events, setEvents] = useState([]);

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

  // Leva o jogador para a tela de aposta do evento escolhido.
  // (a tela de aposta será criada no próximo passo)
  function handleBet(eventId) {
    navigate(`/bet/${eventId}`);
  }

  return (
    <div>
      <header>
        <h1>Eventos disponíveis</h1>
        <p>Olá, {user?.name} · Saldo: U$ {user?.balance}</p>
        <button onClick={signOut}>Sair</button>
      </header>

      <section>
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