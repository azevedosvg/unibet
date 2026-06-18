// Campo de formulário reutilizável do design system.
// Junta o rótulo (label) + o campo num componente só, com estilo consistente.
// Usado no login e na tela de aposta.

// Props:
// - label: o texto do rótulo acima do campo (ex: "E-mail")
// - className: classes extras opcionais para o container
// - append: nó opcional renderizado dentro do campo, à direita (ex: o olho da senha)
// - ...rest: todas as props do input nativo (type, value, onChange, placeholder...)
function Input({ label, className = "", append, ...rest }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* O rótulo só aparece se foi passado (alguns inputs podem não ter). */}
      {label && (
        <label className="text-xs uppercase tracking-wide text-muted font-sans">
          {label}
        </label>
      )}
      {/* Wrapper relativo para posicionar o "append" (ícone/botão) sobre o campo. */}
      <div className="relative">
        <input
          // Classes do campo: fundo escuro, borda sutil, e foco dourado.
          // pr-11 abre espaço à direita quando há um "append" (ex: olho da senha).
          className={`
            w-full px-4 py-3 rounded-xl font-sans
            bg-bg border border-line text-ink
            placeholder:text-muted/70
            focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20
            transition-all duration-200
            ${append ? "pr-11" : ""}
          `}
          {...rest}
        />
        {/* Conteúdo opcional à direita do campo, centralizado verticalmente. */}
        {append && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {append}
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
