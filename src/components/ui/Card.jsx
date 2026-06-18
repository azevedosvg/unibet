// Contâiner de superfície reutilizável do design system.
// É a "caixa" padrão que envolve conteúdos: stats, eventos, seções.
// Centraliza o visual (fundo, borda, arredondamento) num lugar só.

import { motion } from "framer-motion";

// Props:
// - children: o conteúdo dentro do card
// - className: classes extras opcionais (a tela pode ajustar tamanho, etc.)
// - hover: se true, o card reage ao passar o mouse (sobe levemente)
// - ...rest: outras props repassadas (onClick, etc.)
function Card({ children, className = "", hover = false, ...rest }) {
  return (
    <motion.div
      // Se hover=true, aplica a animação de subir 2px ao passar o mouse.
      whileHover={hover ? { y: -2 } : undefined}
      className={`
        bg-surface border border-line rounded-2xl
        transition-colors duration-200
        ${hover ? "hover:border-gold/30 cursor-pointer" : ""}
        ${className}
      `}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default Card;
