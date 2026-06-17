// Chamadas de API relacionadas a apostas e movimentações.

import api from "./api";

// Cria uma nova aposta no banco.
export async function createBet(betData) {
  const response = await api.post("/bets", betData);
  return response.data;
}

// Busca as apostas de um usuário específico (usado no histórico, depois).
export async function getBetsByUser(userId) {
  const response = await api.get("/bets", {
    params: { userId },
  });
  return response.data;
}

// Registra uma movimentação financeira fictícia (entrada ou saída de saldo).
// É a base do nosso extrato (a funcionalidade extra).
export async function createTransaction(transactionData) {
  const response = await api.post("/transactions", transactionData);
  return response.data;
}

// Busca todas as apostas de um evento específico (usado na liquidação)
export async function getBetsByEvent(eventId) {
  const responde = await api.get("/bets", {
    params: { eventId },
  });
  return responde.data;
}

// Atualiza uma aposta (status e retorno) após a liquidação
export async function updateBet(id, changes) {
  const response = await api.patch(`/bets/${id}`, changes);
  return response.data;
}
