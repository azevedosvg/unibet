// Card de um evento esportivo, reutilizável na Home (público) e no Dashboard.
// Clicar numa odd adiciona/remove o palpite do cupom (bet slip), destacando-o.
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { useOdds } from "../hooks/useOdds";
import { useBetSlip } from "../contexts/BetSlipContext";

function EventCard({ event, index = 0 }) {
  const { oddA, oddB, oddDraw } = useOdds(event);
  const { toggleSelection, isSelected } = useBetSlip();

  // Monta as opções de palpite. Esportes sem empate (tênis, MMA, F1...)
  // não mostram a coluna "Empate" — fica mais realista.
  const options = event.hasDraw
    ? [
        { key: "A", label: event.teamA, odd: oddA },
        { key: "Draw", label: "Empate", odd: oddDraw },
        { key: "B", label: event.teamB, odd: oddB },
      ]
    : [
        { key: "A", label: event.teamA, odd: oddA },
        { key: "B", label: event.teamB, odd: oddB },
      ];

  // Adiciona/remove o palpite clicado no cupom.
  function pick(opt) {
    toggleSelection({
      key: `${event.id}-${opt.key}`,
      eventId: event.id,
      pick: opt.key,
      odd: opt.odd,
      teamA: event.teamA,
      teamB: event.teamB,
      pickLabel: opt.label,
      sport: event.sport,
    });
  }

  return (
    // Cada card entra com animação escalonada (delay baseado no índice).
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-surface border border-line rounded-2xl p-4 sm:p-5
                 hover:border-gold/30 transition-colors"
    >
      {/* Topo: esporte + (ao vivo) e data. */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-gold font-bold">
            {event.sport}
          </span>
          {event.live && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-live">
              <Radio size={11} className="animate-pulse" /> Ao vivo
            </span>
          )}
        </div>
        <span className="text-xs text-muted font-mono">{event.date}</span>
      </div>

      {/* Confronto. */}
      <p className="text-base font-bold mb-3">
        {event.teamA} <span className="text-muted">×</span> {event.teamB}
      </p>

      {/* Botões de odd (1 por palpite disponível). Destaca os que estão no cupom. */}
      <div className="flex gap-2">
        {options.map((opt) => {
          const selected = isSelected(event.id, opt.key);
          return (
            <button
              key={opt.key}
              onClick={() => pick(opt)}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl border transition-colors duration-200
                ${
                  selected
                    ? "bg-gold/15 border-gold"
                    : "bg-surface2 border-line hover:border-gold/50"
                }`}
            >
              <span
                className={`text-[10px] truncate max-w-full ${selected ? "text-gold" : "text-muted"}`}
              >
                {opt.label}
              </span>
              <span
                className={`text-sm font-bold font-mono ${selected ? "text-gold" : "text-ink"}`}
              >
                {opt.odd.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default EventCard;
