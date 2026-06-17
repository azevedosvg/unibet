// hook customizado que calcula as odds de um evt a partir das pools de apostas (sistema pari-mutuel)

// conceito central da unibet: a odd não é fixada por ninguém.
// ela nasce do volume apostado em cada lado. quanto mais gente aposta num lado, menor a odd dele; quanto menos gente, maior.

// taxa da casa: 5% do total fica retido (fica de fora do pagamento)
// isso torna o sistema realista -- as casas de aposta sempre retém uma fatia

const HOUSE_EDGE = 0.95; // 0.95 = devolve 95%, retem 5%

// odd padrao usada quando um lado ainda nao recebeu nenhuma aposta
// evita divisao por 0 e da um numero de partida na tela
const DEFAULT_ODD = 2.0;

// recebe um evt e devolve um obj com as odds de cada lado
// nao e um hook que usa useState ou useEffect, e um hook de calculo
// uma funcao reutilizavel de logica que centraliza a regra das odds num lugar so
export default function useOdds(event) {
    // protecao: se o evt ainda nao chegou (null), devolve odds padrao
    if (!event) {
        return { oddA: DEFAULT_ODD, oddB: DEFAULT_ODD, oddDraw: DEFAULT_ODD };
    }

    // le os pools do evt. o "|| 0" garante 0 caso o campo venha indefinido
    const poolA = event.poolA || 0;
    const poolB = event.poolB || 0;
    const poolDraw = event.poolDraw || 0;

    // pool total = soma de tudo que foi apostado no evt
    const totalPool = poolA + poolB + poolDraw;

    // funcao interna que calcula a odd de um lado
    // recebe o pool daquele lado e aplica a formula pari-mutuel
    function calculateOdd(sidepool) {
        // se ngm apostou no evt todo, ou nesse lado, usa a odd padrao
        if (totalPool === 0 || sidePool === 0) {
            return DEFAULT_ODD;
        }
        
        // for
    }
}

