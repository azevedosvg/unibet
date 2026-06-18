// Logotipo do Uni Bet: ficha de cassino (SVG) + wordmark dourado.
// Componente reutilizável usado no login e nos cabeçalhos das telas.
import { useId } from "react";

// A ficha de pôquer desenhada em SVG, com o gradiente dourado da marca.
// size controla a largura/altura em pixels.
export function ChipIcon({ size = 40, className = "" }) {
  // id ÚNICO por instância: evita IDs de gradiente duplicados na página
  // (que faziam o url(#...) não resolver e a ficha renderizar toda preta).
  const gradId = "chipGold-" + useId().replace(/:/g, "");
  const fill = `url(#${gradId})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9D8CFF" />
          <stop offset="45%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#E0539B" />
        </linearGradient>
      </defs>
      {/* corpo da ficha */}
      <circle cx="32" cy="32" r="30" fill={fill} />
      {/* 8 entalhes escuros arredondados na borda (efeito de ficha de cassino) */}
      <g fill="#0E0E1A">
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" />
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" transform="rotate(45 32 32)" />
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" transform="rotate(90 32 32)" />
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" transform="rotate(135 32 32)" />
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" transform="rotate(180 32 32)" />
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" transform="rotate(225 32 32)" />
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" transform="rotate(270 32 32)" />
        <rect x="29.5" y="2.5" width="5" height="7" rx="2.5" transform="rotate(315 32 32)" />
      </g>
      {/* disco central escuro + anel dourado em volta */}
      <circle cx="32" cy="32" r="22" fill="#0E0E1A" />
      <circle cx="32" cy="32" r="22" fill="none" stroke={fill} strokeWidth="1.6" />
      {/* espada central */}
      <g transform="translate(17,17.6) scale(1.25)">
        <path
          fill={fill}
          d="M12 2C9 7 4 9 4 13.5C4 16 6 17.5 8 17.5C9 17.5 10 17 10.5 16.3C10.4 18.5 9.6 20 8.5 21H15.5C14.4 20 13.6 18.5 13.5 16.3C14 17 15 17.5 16 17.5C18 17.5 20 16 20 13.5C20 9 15 7 12 2Z"
        />
      </g>
    </svg>
  );
}

// Logo completo: ficha + wordmark "UNIBET" em dourado.
// Props:
// - size: tamanho da ficha (o texto acompanha proporcionalmente)
// - showText: se false, mostra só a ficha
// - className: classes extras para o container
function Logo({ size = 36, showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <ChipIcon size={size} />
      {showText && (
        <span
          className="font-bold tracking-[0.18em] bg-gold-gradient bg-clip-text text-transparent leading-none"
          style={{ fontSize: size * 0.5 }}
        >
          UNIBET
        </span>
      )}
    </div>
  );
}

export default Logo;
