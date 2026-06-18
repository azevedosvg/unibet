/** @type {import('tailwindcss').Config} */
// tailwind.config.js — configuração do Tailwind com a identidade visual do Uni Bet.

export default {
  // content: diz ao Tailwind QUAIS arquivos ele deve "varrer" procurando classes usadas.
  // Ele só gera o CSS das classes que encontrar nesses arquivos (mantém o bundle pequeno).
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // todos os .js e .jsx dentro de src e subpastas
  ],
  theme: {
    extend: {
      // Paleta colorida e moderna: base índigo-violeta com acentos vibrantes.
      // (O token "gold" virou o ACENTO PRIMÁRIO — agora violeta, não mais dourado —
      //  para reaproveitar todas as classes text-gold/bg-gold/border-gold já existentes.)
      colors: {
        bg: "#0E0E1A", // fundo base (índigo bem escuro)
        surface: "#16172A", // superfície de cartões
        surface2: "#1F2040", // superfície elevada
        line: "#30315A", // bordas (índigo, mais visíveis/marcadas)
        ink: "#F6F6FD", // texto principal (branco frio, quase puro)
        muted: "#C2C3E6", // texto secundário (lavanda claro, bem mais legível)
        gold: {
          DEFAULT: "#8B7CFF", // acento primário (violeta) -> text-gold/bg-gold
          light: "#B6ABFF", // violeta claro -> text-gold-light
          dark: "#6A5AE0", // violeta escuro -> text-gold-dark
        },
        win: "#34D399", // esmeralda (ganho)
        loss: "#FB5577", // rosa-vermelho (perda)
        live: "#22D3EE", // ciano (ao vivo)
      },
      // Bordas menos arredondadas — visual mais "produto", menos bolha.
      borderRadius: {
        lg: "0.5rem",
        xl: "0.65rem",
        "2xl": "0.85rem",
        "3xl": "1.1rem",
      },
      // Fontes customizadas (uma mono para números, uma sans para texto).
      // Space Grotesk dá um ar moderno/geométrico ao app; JetBrains Mono nos números.
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
      // Gradiente primário reutilizável (violeta -> rosa) -> bg-gold-gradient
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #9D8CFF 0%, #8B5CF6 45%, #E0539B 100%)",
      },
    },
  },
  plugins: [],
};
