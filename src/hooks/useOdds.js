// Hook customizado que calcula as odds de um evento a partir dos pools de apostas (sistema pari-mutuel).

// Conceito central do Uni Bet: a odd NÃO é fixada por ninguém.
// Ela nasce do volume apostado em cada lado. Quanto mais gente aposta num lado, menor a odd dele (paga menos); quanto menos gente, maior.

// Taxa da casa: 5% do total fica retido (fica de fora do pagamento).
// É o que torna o sistema realista — casas de aposta sempre retêm uma fatia.
const HOUSE_EDGE = 0.95; // 0.95 = devolve 95%, retém 5%

// Odd padrão usada quando um lado ainda não recebeu nenhuma aposta.
// Evita divisão por zero e dá um número de partida na tela.
const DEFAULT_ODD = 2.0;

// Recebe um evento e devolve um objeto com as odds de cada lado.
// Não é um hook que usa useState/useEffect — é um "hook de cálculo":
// uma função reutilizável de lógica, que centraliza a regra das odds num lugar só.
export function useOdds(event) {
  // Proteção: se o evento ainda não chegou (null), devolve odds padrão.
  if (!event) {
    return { oddA: DEFAULT_ODD, oddB: DEFAULT_ODD, oddDraw: DEFAULT_ODD };
  }

  // Lê os pools do evento. O "|| 0" garante 0 caso o campo venha indefinido.
  const poolA = event.poolA || 0;
  const poolB = event.poolB || 0;
  const poolDraw = event.poolDraw || 0;

  // Pool total = soma de tudo que foi apostado no evento.
  const totalPool = poolA + poolB + poolDraw;

  // Função interna que calcula a odd de UM lado.
  // Recebe o pool daquele lado e aplica a fórmula pari-mutuel.
  function calculateOdd(sidePool) {
    // Se ninguém apostou no evento todo, ou nesse lado, usa a odd padrão.
    if (totalPool === 0 || sidePool === 0) {
      return DEFAULT_ODD;
    }
    // Fórmula: (pool total com a taxa da casa descontada) / pool do lado.
    const odd = (totalPool * HOUSE_EDGE) / sidePool;
    // Arredonda para 2 casas decimais (ex: 1.8 em vez de 1.79999).
    return Math.round(odd * 100) / 100;
  }

  // Calcula e devolve as três odds de uma vez.
  return {
    oddA: calculateOdd(poolA),
    oddB: calculateOdd(poolB),
    oddDraw: calculateOdd(poolDraw),
  };
}