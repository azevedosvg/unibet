import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getEvents } from "../services/eventService";
import { getBetsByUser } from "../services/betService";
import { formatMoney } from "../utils/format";
import EventCard from "../components/EventCard";
import Sidebar from "../components/Sidebar";

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bets, setBets] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents();
      setEvents(data.filter((ev) => ev.status === "open"));
    }
    loadEvents();
  }, []);

  useEffect(() => {
    async function loadBets() {
      const data = await getBetsByUser(user.id);
      setBets(data);
    }
    loadBets();
  }, [user.id]);

  // Cálculo das estatísticas
  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalWon = bets
    .filter((bet) => bet.status === "won")
    .reduce((sum, bet) => sum + bet.payout, 0);
  const pendingCount = bets.filter((bet) => bet.status === "pending").length;
  const settledBet = bets
    .filter((bet) => bet.status === "won" || bet.status === "lost")
    .reduce((sum, bet) => sum + bet.amount, 0);
  const profit = totalWon - settledBet;

  // A barra lateral leva à Home filtrada por esporte (navegação global).
  function goToSport(name) {
    navigate(name === "Todos" ? "/" : `/?sport=${encodeURIComponent(name)}`);
  }

  const profitPositive = profit >= 0;

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 flex gap-6">
      {/* Barra lateral de categorias (só no desktop). */}
      <Sidebar
        active={null}
        onSelect={goToSport}
        className="hidden lg:block w-60 shrink-0 sticky top-20 self-start"
      />

      {/* Coluna de conteúdo. */}
      <div className="flex-1 min-w-0">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-1">
          Sua banca
        </p>
        <div className="flex items-end gap-3 mb-2">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono leading-none break-all">
            {formatMoney(user?.balance)}
          </h1>
        </div>
        {/* Lucro com ícone e cor conforme positivo/negativo. */}
        <div
          className={`flex items-center gap-1.5 font-bold ${profitPositive ? "text-win" : "text-loss"}`}
        >
          {profitPositive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span className="font-mono">
            {profitPositive ? "+" : "-"}
            {formatMoney(Math.abs(profit))} no total
          </span>
        </div>
        {/* Linha dourada decorativa, curta (não simétrica). */}
        <div className="w-16 h-0.5 bg-gold-gradient mt-4 rounded-full" />
      </motion.div>

      {/* Stats em linha com separadores */}
      <div className="flex items-center gap-4 sm:gap-6 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted">
            Apostado
          </p>
          <p className="text-lg font-bold font-mono">{formatMoney(totalBet)}</p>
        </div>
        <div className="w-px h-8 bg-line" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted">
            Abertas
          </p>
          <p className="text-lg font-bold font-mono text-gold">
            {pendingCount}
          </p>
        </div>
        <div className="w-px h-8 bg-line" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted">
            Ganhas
          </p>
          <p className="text-lg font-bold font-mono text-win">
            {bets.filter((b) => b.status === "won").length}
          </p>
        </div>
      </div>

      {/* Feed de mesas abertas */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold tracking-widest uppercase">
          Mesas abertas
        </h2>
        <span className="text-xs text-muted">{events.length} jogos</span>
      </div>

      {events.length === 0 ? (
        <p className="text-muted py-8 text-center">
          Nenhuma mesa aberta no momento.
        </p>
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
          {events.map((ev, index) => (
            <EventCard key={ev.id} event={ev} index={index} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default UserDashboard;
