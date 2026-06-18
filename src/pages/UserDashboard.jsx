import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  History,
  Trophy,
  Receipt,
  Coins,
  Ticket,
  Target,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getEvents } from "../services/eventService";
import { getBetsByUser } from "../services/betService";
import { getUserById } from "../services/userService";
import { formatMoney } from "../utils/format";
import EventCard from "../components/EventCard";
import Sidebar from "../components/Sidebar";

// Atalho rápido do card de saldo (Histórico, Ranking, Extrato).
function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
                 bg-surface2 border border-line text-ink
                 hover:border-gold/50 hover:text-gold transition-colors"
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

// Card de estatística reutilizado no grid de resumo da banca.
function StatCard({ icon: Icon, label, value, sub, tint, iconColor, valueColor, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      className="bg-surface border border-line rounded-2xl p-4 sm:p-5"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tint}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className={`text-xl font-bold font-mono ${valueColor || "text-ink"}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function UserDashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bets, setBets] = useState([]);

  // Ao abrir a banca, re-busca o saldo atual na API. Assim, se o admin liquidou
  // um evento e creditou um prêmio enquanto o jogador estava em outra tela, o
  // saldo aqui (e no cabeçalho global) aparece já atualizado.
  useEffect(() => {
    async function syncBalance() {
      const fresh = await getUserById(user.id);
      setUser(fresh);
    }
    syncBalance();
    // Sincroniza apenas pelo id; setUser é estável.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

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

  // Cálculo das estatísticas da banca.
  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const wonBets = bets.filter((bet) => bet.status === "won");
  const lostBets = bets.filter((bet) => bet.status === "lost");
  const pendingBets = bets.filter((bet) => bet.status === "pending");
  const pendingStake = pendingBets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalWon = wonBets.reduce((sum, bet) => sum + bet.payout, 0);
  const settledCount = wonBets.length + lostBets.length;
  const settledBet = wonBets
    .concat(lostBets)
    .reduce((sum, bet) => sum + bet.amount, 0);
  const profit = totalWon - settledBet;
  const profitPositive = profit >= 0;
  const winRate =
    settledCount > 0 ? Math.round((wonBets.length / settledCount) * 100) : 0;

  // A barra lateral leva à Home filtrada por esporte (navegação global).
  function goToSport(name) {
    navigate(name === "Todos" ? "/" : `/?sport=${encodeURIComponent(name)}`);
  }

  const stats = [
    {
      label: "Total apostado",
      value: formatMoney(totalBet),
      sub: `${bets.length} apostas`,
      icon: Coins,
      tint: "bg-gold/10",
      iconColor: "text-gold",
    },
    {
      label: "Em jogo",
      value: formatMoney(pendingStake),
      sub: `${pendingBets.length} abertas`,
      icon: Ticket,
      tint: "bg-live/10",
      iconColor: "text-live",
    },
    {
      label: "Aproveitamento",
      value: `${winRate}%`,
      sub: `${wonBets.length}V · ${lostBets.length}D`,
      icon: Target,
      tint: "bg-gold/10",
      iconColor: "text-gold",
    },
    {
      label: "Retorno total",
      value: formatMoney(totalWon),
      sub: `${profitPositive ? "+" : "-"}${formatMoney(Math.abs(profit))} de lucro`,
      icon: Trophy,
      tint: profitPositive ? "bg-win/10" : "bg-loss/10",
      iconColor: profitPositive ? "text-win" : "text-loss",
      valueColor: profitPositive ? "text-win" : "text-loss",
    },
  ];

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
        {/* Card de saldo em destaque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 mb-5"
        >
          {/* Brilho decorativo do gradiente primário. */}
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-gold-gradient opacity-20 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface2 border border-line text-[11px] uppercase tracking-wider text-muted">
              <Wallet size={13} className="text-gold" /> Sua banca
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-mono leading-none break-all mt-4">
              {formatMoney(user?.balance)}
            </h1>

            <div
              className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold
                ${profitPositive ? "bg-win/10 text-win" : "bg-loss/10 text-loss"}`}
            >
              {profitPositive ? (
                <TrendingUp size={15} />
              ) : (
                <TrendingDown size={15} />
              )}
              <span className="font-mono">
                {profitPositive ? "+" : "-"}
                {formatMoney(Math.abs(profit))}
              </span>
              <span className="font-sans font-medium opacity-80">no total</span>
            </div>

            {/* Atalhos rápidos */}
            <div className="flex flex-wrap gap-2 mt-6">
              <QuickAction
                icon={History}
                label="Histórico"
                onClick={() => navigate("/history")}
              />
              <QuickAction
                icon={Trophy}
                label="Ranking"
                onClick={() => navigate("/ranking")}
              />
              <QuickAction
                icon={Receipt}
                label="Extrato"
                onClick={() => navigate("/statement")}
              />
            </div>
          </div>
        </motion.div>

        {/* Grid de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {stats.map((s, i) => (
            <StatCard key={s.label} index={i} {...s} />
          ))}
        </div>

        {/* Feed de mesas abertas */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-widest uppercase">
            Mesas abertas
          </h2>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface2 border border-line text-xs text-muted">
            {events.length} jogos
          </span>
        </div>

        {events.length === 0 ? (
          <p className="text-muted py-8 text-center">
            Nenhuma mesa aberta no momento.
          </p>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
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
