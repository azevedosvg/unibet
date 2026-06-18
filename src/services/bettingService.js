// Coloca uma aposta no sistema, reaproveitando as mesmas regras da tela de aposta.
// Usado pelo cupom (bet slip) para confirmar cada seleção.
import { getEventById, updateEvent } from "./eventService";
import { updateUser } from "./userService";
import { createBet, createTransaction } from "./betService";

// Debita o saldo, soma o valor ao pool do palpite, cria a aposta e a transação.
// Recebe o usuário atual + os dados da seleção; devolve o novo saldo.
export async function placeBet({
  user,
  eventId,
  pick,
  amount,
  oddAtBet,
  teamA,
  teamB,
}) {
  // Busca o evento atualizado para somar ao pool sem sobrescrever valores.
  const event = await getEventById(eventId);
  const poolField =
    pick === "A" ? "poolA" : pick === "B" ? "poolB" : "poolDraw";

  const newBalance = user.balance - amount;
  await updateUser(user.id, { balance: newBalance });
  await updateEvent(eventId, { [poolField]: (event[poolField] || 0) + amount });
  await createBet({
    userId: user.id,
    eventId,
    pick,
    amount,
    oddAtBet,
    status: "pending",
    payout: 0,
  });
  await createTransaction({
    userId: user.id,
    type: "bet",
    value: -amount,
    description: `Aposta em ${teamA} x ${teamB}`,
    date: new Date().toISOString(),
  });
  return newBalance;
}
