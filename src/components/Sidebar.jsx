// Barra lateral de categorias, no estilo dos sites de aposta.
// Lista "Todos", "Ao vivo" e cada esporte (com contagem de eventos), além de
// seções extras mockadas (promoções, bônus, suporte) e um card de bônus.
// Aparece só no desktop (lg+); no mobile a Home usa chips horizontais.
import { useMemo, useState, useEffect } from "react";
import {
  LayoutGrid,
  Radio,
  Goal,
  Target,
  CircleDot,
  Volleyball,
  Swords,
  Gamepad2,
  Car,
  Trophy,
  Percent,
  Gift,
  Sparkles,
  Headphones,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { getEvents } from "../services/eventService";
import Button from "./ui/Button";

// Ícone de cada esporte (com fallback para o troféu).
const sportIcons = {
  Futebol: Goal,
  Basquete: Target,
  Tênis: CircleDot,
  Vôlei: Volleyball,
  MMA: Swords,
  eSports: Gamepad2,
  "Fórmula 1": Car,
};

// Um item clicável da barra lateral.
function SideItem({ icon: Icon, label, count, active, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
        ${
          active
            ? "bg-surface2 text-gold font-semibold"
            : "text-muted hover:text-ink hover:bg-surface"
        }`}
    >
      <Icon size={17} className={accent} />
      <span className="flex-1 text-left truncate">{label}</span>
      {count != null && (
        <span className="text-xs font-mono text-muted">{count}</span>
      )}
    </button>
  );
}

// Título de seção da barra.
function SectionTitle({ children }) {
  return (
    <p className="px-3 mt-5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted/80">
      {children}
    </p>
  );
}

function Sidebar({ active, onSelect, className = "" }) {
  const { mockFeature } = useToast();
  // A barra busca os próprios eventos (assim funciona em qualquer lugar,
  // inclusive no drawer do header) só para contar por categoria.
  const [events, setEvents] = useState([]);
  useEffect(() => {
    getEvents().then((data) =>
      setEvents(data.filter((ev) => ev.status === "open")),
    );
  }, []);

  // Conta eventos por esporte (e total / ao vivo) para mostrar ao lado do nome.
  const { sportList, liveCount } = useMemo(() => {
    const counts = {};
    events.forEach((ev) => {
      counts[ev.sport] = (counts[ev.sport] || 0) + 1;
    });
    return {
      sportList: Object.keys(counts).map((name) => ({
        name,
        count: counts[name],
      })),
      liveCount: events.filter((ev) => ev.live).length,
    };
  }, [events]);

  return (
    <aside className={`${className}`}>
      <nav className="bg-surface/60 border border-line rounded-2xl p-2">
        {/* Destaques */}
        <SectionTitle>Destaques</SectionTitle>
        <SideItem
          icon={LayoutGrid}
          label="Todos os eventos"
          count={events.length}
          active={active === "Todos"}
          onClick={() => onSelect("Todos")}
        />
        <SideItem
          icon={Radio}
          label="Ao vivo"
          count={liveCount}
          accent="text-live"
          active={active === "Ao vivo"}
          onClick={() => onSelect("Ao vivo")}
        />

        {/* Esportes */}
        <SectionTitle>Esportes</SectionTitle>
        {sportList.map((s) => (
          <SideItem
            key={s.name}
            icon={sportIcons[s.name] || Trophy}
            label={s.name}
            count={s.count}
            active={active === s.name}
            onClick={() => onSelect(s.name)}
          />
        ))}

        {/* Mais (tudo mockado) */}
        <SectionTitle>Mais</SectionTitle>
        <SideItem icon={Percent} label="Promoções" onClick={mockFeature} />
        <SideItem icon={Gift} label="Bônus" onClick={mockFeature} />
        <SideItem icon={Sparkles} label="Cassino" onClick={mockFeature} />
        <SideItem icon={Headphones} label="Suporte (SAC)" onClick={mockFeature} />
      </nav>

      {/* Card de bônus (mockado). */}
      <div className="mt-3 bg-gold/5 border border-gold/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Gift size={16} className="text-gold" />
          <p className="text-sm font-bold">Bônus de boas-vindas</p>
        </div>
        <p className="text-xs text-muted mb-3">
          Ganhe U$ 1.000 fictícios ao criar sua conta e aposte sem risco.
        </p>
        <Button
          variant="gold"
          onClick={mockFeature}
          className="w-full flex items-center justify-center gap-1.5 !py-2 !text-xs"
        >
          Resgatar agora <ChevronRight size={14} />
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
