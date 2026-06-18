// Selo reutilizável do design system.
// Usado para: status de aposta, tags de esporte, indicador "AO VIVO".
// Pequeno, colorido, com variantes semânticas.

// Mapa de variantes: cada uma tem sua cor de fundo e texto.
// Uso cores com opacidade baixa no fundo (/15) e a cor cheia no texto, criando aquele visual de "etiqueta translúcida" moderno.
const variants = {
  gold: "bg-gold/15 text-gold border-gold/30",
  live: "bg-live/15 text-live border-live/30",
  win: "bg-win/15 text-win border-win/30",
  loss: "bg-loss/15 text-loss border-loss/30",
  neutral: "bg-surface2 text-muted border-line",
};

// Props:
// - children: o texto do selo
// - variant: a cor/significado (padrão: neutral)
// - dot: se true, mostra uma bolinha colorida antes do texto (ex: "● AO VIVO")
// - className: classes extras opcionais
function Badge({ children, variant = "neutral", dot = false, className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full border
        text-xs font-bold uppercase tracking-wide font-sans
        ${variants[variant]}
        ${className}
      `}
    >
      {/* Bolinha opcional: usa currentColor para herdar a cor do texto do selo. */}
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export default Badge;
