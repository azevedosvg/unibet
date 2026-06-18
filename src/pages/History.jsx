import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getBetsByUser } from "../services/betService";
import { getEvents } from "../services/eventService";
import { formatMoney } from "../utils/format";
import Badge from "../components/ui/Badge";

function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bets, setBets] = useState([]);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      const [userBets, allEvents] = await Promise.all([
        getBetsByUser(user.id),
        getEvents(),
      ]);
      setBets(userBets);
      setEvents(allEvents);
    }
    loadData();
  }, [user.id]);

  function getEventLabel(eventId) {
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return "Evento removido";
    return `${ev.teamA} x ${ev.teamB}`;
  }
  function getPickLabel(bet) {
    const ev = events.find((e) => e.id === bet.eventId);
    if (!ev) return bet.pick;
    if (bet.pick === "A") return ev.teamA;
    if (bet.pick === "B") return ev.teamB;
    return "Empate";
  }
  function statusBadge(status) {
    if (status === "pending") return <Badge variant="gold">Pendente</Badge>;
    if (status === "won") return <Badge variant="win">Ganhou</Badge>;
    if (status === "lost") return <Badge variant="loss">Perdeu</Badge>;
    return null;
  }

  const filteredBets =
    filter === "all" ? bets : bets.filter((b) => b.status === filter);

  // Filtros disponíveis (gera os botões dinamicamente).
  const filters = [
    { key: "all", label: "Todas" },
    { key: "pending", label: "Pendentes" },
    { key: "won", label: "Ganhas" },
    { key: "lost", label: "Perdidas" },
  ];

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-1">Meu histórico</h1>
      <p className="text-sm text-muted mb-6">Todas as suas apostas</p>

      {/* Filtros: chips que destacam o ativo em dourado. */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors
              ${
                filter === f.key
                  ? "bg-gold text-bg border-gold font-bold"
                  : "bg-surface text-muted border-line hover:border-gold/40"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredBets.length === 0 ? (
        <p className="text-muted py-8 text-center">
          Nenhuma aposta encontrada.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredBets.map((bet, index) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{getEventLabel(bet.eventId)}</p>
                <p className="text-xs text-muted mt-0.5">
                  Palpite: {getPickLabel(bet)} · Odd {bet.oddAtBet?.toFixed(2)}
                </p>
                <p className="text-sm font-mono mt-1">
                  {formatMoney(bet.amount)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {statusBadge(bet.status)}
                {bet.status === "won" && (
                  <span className="text-win font-mono font-bold text-sm">
                    +{formatMoney(bet.payout)}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
