// Mesmo padrão do userService: os componentes chamam essas funções
// Nunca o axios diretamente. Mantém a lógica de API separada da interface

import api from "./api";

// Busca todos os eventos. usado na listagem do admin e do jogador
export async function getEvents() {
  const response = await api.get("/events");
  return response.data; // array com os eventos
}

// Busca um evento específico pelo id (usado na tela de aposta, por ex.)
export async function getEventById(id) {
  const response = await api.get(`/events/${id}`);
  return response.data;
}

// Cria um novo evento. Recebe os dados do formulário e completa com os campos que todo evento novo precisa ter por padrão
export async function createEvent(data) {
  // POST cria um registro novo; o json-server gera o id automaticamente
  // Espalho os dados do formulário e forçamos os valores iniciais
  // todo evento nasce "aberto", sem resultado e com os pools zerados
  const response = await api.post("/events", {
    ...eventData,
    status: "open", // aberto para apostas assim que é criado
    result: "", // ainda sem resultado
    poolA: 0, // bolão do time A começa zerado
    poolB: 0, // bolão do time B começa zerado
    poolDraw: 0, // bolão do empate começa zerado
  });
  return response.data;
}

// Atualiza um evento existente (PATCH muda só os campos enviados)
// Vou usar para abrir/encerrar apostas e para registrar o resultado
export async function updateEvent(id, changes) {
  const response = await api.patch(`/events/${id}`, changes);
  return response.data;
}

// Remove um evento pelo id. Usado se o admin quiser excluir um cadastro errado
export async function deleteEvent(id) {
  const response = await api.delete(`/events/${id}`);
  return response.data;
}
