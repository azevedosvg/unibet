// Lógica do bônus diário fictício.
// Regra: o jogador ganha U$200 no primeiro login de cada dia.

import { updateUser } from "./userService";
import { createTransaction } from "./betService";

// Valor fixo do bônus diário.
const DAILY_BONUS = 200;

// Verifica se o usuário já recebeu bônus hoje; se não, concede.
// Recebe o usuário e devolve o usuário atualizado (com saldo novo, se ganhou).
export async function grantDailyBonusIfEligible(user) {
  // Admin não recebe bônus.
  if (user.role !== "user") return user;

  // Pega a data de hoje no formato "AAAA-MM-DD" (só o dia, sem hora).
  // toISOString() dá algo como "2026-06-17T14:30:00Z"; split("T")[0] pega só "2026-06-17".
  const today = new Date().toISOString().split("T")[0];

  // Se a data do último bônus já é hoje, ele já recebeu. Não faz nada.
  if (user.lastBonus === today) {
    return user;
  }

  // É o primeiro login do dia: concede o bônus.
  const newBalance = user.balance + DAILY_BONUS;

  // Atualiza saldo e a data do último bônus no banco.
  await updateUser(user.id, { balance: newBalance, lastBonus: today });

  // Registra a movimentação do bônus (entra na carteira → valor positivo).
  await createTransaction({
    userId: user.id,
    type: "bonus",
    value: DAILY_BONUS,
    description: "Bônus diário de login",
    date: new Date().toISOString(),
  });

  // Devolve o usuário com os dados atualizados, para o contexto refletir.
  return { ...user, balance: newBalance, lastBonus: today };
}
