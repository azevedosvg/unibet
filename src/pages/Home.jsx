// Home pública: qualquer pessoa pode navegar pelos eventos e ver as odds.
// A exigência de login só acontece ao tentar APOSTAR (ação) — aí manda pro
// login e volta para a aposta depois de entrar.
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, TrendingUp, Gift, Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { getEvents } from "../services/eventService";
import EventCard from "../components/EventCard";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";

function Home() {
  const { user } = useAuth();
  const { mockFeature } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  // O filtro de esporte vive na URL (?sport=...), assim o drawer do header
  // consegue filtrar a Home a partir de qualquer página.
  const sport = searchParams.get("sport") || "Todos";
  function selectSport(name) {
    setSearchParams(name === "Todos" ? {} : { sport: name });
  }

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents();
      // Na vitrine pública só aparecem eventos abertos para apostas.
      setEvents(data.filter((ev) => ev.status === "open"));
    }
    loadEvents();
  }, []);

  // Lista de filtros para os chips do mobile (Todos, Ao vivo e cada esporte).
  const sports = useMemo(() => {
    const unique = [...new Set(events.map((ev) => ev.sport))];
    return ["Todos", "Ao vivo", ...unique];
  }, [events]);

  // Aplica o filtro selecionado (categoria de esporte, "Ao vivo" ou "Todos").
  const filtered = useMemo(() => {
    if (sport === "Todos") return events;
    if (sport === "Ao vivo") return events.filter((ev) => ev.live);
    return events.filter((ev) => ev.sport === sport);
  }, [events, sport]);
  const liveEvents = events.filter((ev) => ev.live);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 flex gap-6">
      {/* Barra lateral de categorias (só no desktop). */}
      <Sidebar
        active={sport}
        onSelect={selectSport}
        className="hidden lg:block w-60 shrink-0 sticky top-20 self-start"
      />

      {/* Coluna de conteúdo. */}
      <div className="flex-1 min-w-0">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-10 mb-8"
      >
        <div className="absolute -top-20 -right-10 w-80 h-80 bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold mb-3">
            <TrendingUp size={14} /> Odds dinâmicas ao vivo
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-3">
            Seu palpite vale mais na{" "}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              bolsa de palpites
            </span>
          </h1>
          <p className="text-muted mb-6">
            As odds nascem do volume apostado em cada lado. Quanto menos gente no
            seu palpite, maior o retorno. Tudo fictício, só pela emoção.
          </p>
          {/* CTA muda conforme o usuário estar logado ou não. */}
          {user && user.role === "user" ? (
            <Button
              variant="gold"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <TrendingUp size={18} /> Ir para minha banca
            </Button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="gold"
                onClick={() => navigate("/login")}
                className="flex items-center gap-2"
              >
                Entrar e apostar
              </Button>
              <Button variant="ghost" onClick={mockFeature}>
                Criar conta grátis
              </Button>
            </div>
          )}
        </div>
      </motion.section>

      {/* DESTAQUES rápidos. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        <div className="flex items-center gap-3 bg-surface border border-line rounded-2xl p-4">
          <Radio size={20} className="text-live" />
          <div>
            <p className="text-lg font-bold font-mono">{liveEvents.length}</p>
            <p className="text-xs text-muted">ao vivo agora</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-surface border border-line rounded-2xl p-4">
          <Gift size={20} className="text-gold" />
          <div>
            <p className="text-lg font-bold font-mono">U$ 200</p>
            <p className="text-xs text-muted">bônus diário</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-surface border border-line rounded-2xl p-4 col-span-2 sm:col-span-1">
          <Trophy size={20} className="text-gold" />
          <div>
            <p className="text-lg font-bold font-mono">{events.length}</p>
            <p className="text-xs text-muted">mesas abertas</p>
          </div>
        </div>
      </div>

      {/* FILTRO DE ESPORTES (chips) — só no mobile; no desktop usa a sidebar. */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        {sports.map((s) => (
          <button
            key={s}
            onClick={() => selectSport(s)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors
              ${
                sport === s
                  ? "bg-gold text-bg border-gold font-bold"
                  : "bg-surface text-muted border-line hover:border-gold/40"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* GRADE DE EVENTOS. */}
      {filtered.length === 0 ? (
        <p className="text-muted py-10 text-center">
          Nenhum evento disponível para este esporte.
        </p>
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((ev, index) => (
            <EventCard key={ev.id} event={ev} index={index} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default Home;
