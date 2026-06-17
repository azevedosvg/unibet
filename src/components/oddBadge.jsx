// Selo visual que exibe a odd de um lado de um evento.
// É um componente "burro" (apresentação pura): só recebe dados via props
// e mostra na tela. Toda a lógica de cálculo fica no hook useOdds, não aqui.
// Por ser genérico, é reutilizado na listagem e na tela de aposta.

// Props:
// - label: o texto do lado (ex: "Brasil", "Empate", "Argentina")
// - odd: o valor numérico da odd já calculada (ex: 1.85)
// - onClick: função opcional, chamada quando o usuário clica no selo
//            (na tela de aposta, clicar escolhe o palpite)
// - selected: booleano opcional, indica se este selo está escolhido
function OddBadge({ label, odd, onClick, selected }) {
  return (
    <button
      type="button"
      onClick={onClick}
      // A className muda se o selo está selecionado.
      className={selected ? "odd-badge odd-badge-selected" : "odd-badge"}
    >
      {/* Nome do lado */}
      <span className="odd-badge-label">{label}</span>
      {/* Valor da odd, formatado com 2 casas decimais */}
      <span className="odd-badge-value">{odd.toFixed(2)}</span>
    </button>
  );
}

export default OddBadge;