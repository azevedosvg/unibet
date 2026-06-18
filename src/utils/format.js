// Funções utilitárias de formatação reutilizáveis em todas as telas.

// Formata um número como moeda fictícia do Uni Bet (U$ com 2 casas e separador de milhar).
// Ex: 1200 -> "U$ 1.200,00". Usa o locale pt-BR só para os separadores.
export function formatMoney(value) {
  const number = Number(value) || 0;
  return `U$ ${number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
