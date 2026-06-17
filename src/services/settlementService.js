// Lógica de liquidação de um evento.
// Concentramos toda a regra aqui para o painel do admin só precisar chamá-la.

import { getEventById, updateEvent } from "./eventService";
import { getUserById, updateUser } from "./userService";
import { getBetsByEvent, updateBet, createTransaction } from "./betService";

// Mesmas constantes do useOdds: precisam bater para a odd final
// ser coerente com a que o jogador via na tela.
const HOUSE_EDGE = 0.95;

// Função principal: liquida um evento dado o lado vencedor.
// winningSide é "A", "B" ou "Draw" (o palpite que venceu).
export async function settleEvent(eventId, winningSide) {
  // 1) Carrega o evento atualizado da API (pools congelados no estado atual).
  const event = await getEventById(eventId);

  // 2) Calcula a odd FINAL do lado vencedor, usando os pools fechados.
  const totalPool =
    (event.poolA || 0) + (event.poolB || 0) + (event.poolDraw || 0);

  // Descobre qual pool corresponde ao lado vencedor.
  const winningPool =
    winningSide === "A"
      ? event.poolA
      : winningSide === "B"
        ? event.poolB
        : event.poolDraw;

  // Odd final: total (com taxa da casa) dividido pelo pool vencedor.
  // Se ninguém apostou no lado vencedor, a odd fica 0 (ninguém recebe).
  const finalOdd = winningPool > 0 ? (totalPool * HOUSE_EDGE) / winningPool : 0;

  // 3) Busca todas as apostas desse evento.
  const bets = await getBetsByEvent(eventId);

  // 4) Percorre cada aposta e decide: ganhou ou perdeu.
  // Usamos um laço for...of porque há chamadas de API (await) dentro.
  for (const bet of bets) {
    // Só processa apostas ainda pendentes (evita pagar duas vezes).
    if (bet.status !== "pending") continue;

    if (bet.pick === winningSide) {
      // Aposta vencedora
      // Retorno = valor apostado × odd final, arredondado a 2 casas.
      const payout = Math.round(bet.amount * finalOdd * 100) / 100;

      // Atualiza a aposta: marca como ganha e registra o retorno.
      await updateBet(bet.id, { status: "won", payout });

      // Credita o retorno no saldo do jogador.
      // Buscamos o usuário atualizado para não sobrescrever saldo errado.
      const player = await getUserById(bet.userId);
      await updateUser(bet.userId, { balance: player.balance + payout });

      // Registra a movimentação do prêmio (entra na carteira → valor positivo).
      await createTransaction({
        userId: bet.userId,
        type: "prize",
        value: payout,
        description: `Prêmio: ${event.teamA} x ${event.teamB}`,
        date: new Date().toISOString(),
      });
    } else {
      // -Aposta perdedora
      // O dinheiro já saiu na hora da aposta; aqui só marcamos como perdida.
      await updateBet(bet.id, { status: "lost", payout: 0 });
    }
  }

  // 5) Marca o evento como liquidado e guarda o resultado.
  await updateEvent(eventId, { status: "settled", result: winningSide });
}
