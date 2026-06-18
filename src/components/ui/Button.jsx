// Botão reutilizável do design system Uni Bet.
// Em vez de repetir classes do Tailwind em cada tela, centralizo o estilo aqui.
// Aceita "variantes" (gold, ghost, danger) para os diferentes usos.

import { motion } from "framer-motion";

// Mapa de variantes: cada chave é um estilo visual diferente.
// Assim a tela só diz <Button variant="gold"> e não precisa saber as classes.
const variants = {
  // Dourado preenchido: ação principal (Entrar, Apostar, Confirmar).
  gold: "bg-gold-gradient text-bg font-bold hover:brightness-110",
  // Contorno: ação secundária (Voltar, Cancelar).
  ghost: "bg-surface2 text-ink border border-line hover:border-gold/50",
  // Vermelho: ações destrutivas ou de perda (Excluir, Sair).
  danger: "bg-surface2 text-loss border border-loss/30 hover:bg-loss/10",
};

// Props:
// - children: o conteúdo do botão (texto, ícone)
// - variant: qual estilo usar (padrão: "gold")
// - className: classes extras opcionais que a tela queira adicionar
// - ...rest: qualquer outra prop (onClick, type, disabled) repassada ao <button>
function Button({ children, variant = "gold", className = "", ...rest }) {
  return (
    // motion.button é a versão animada do <button> (Framer Motion).
    <motion.button
      // whileTap: animação ao clicar — encolhe levemente (feedback tátil).
      whileTap={{ scale: 0.96 }}
      // Classes base + as da variante escolhida + as extras da tela.
      className={`
        px-5 py-2.5 rounded-xl text-sm font-sans
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export default Button;
