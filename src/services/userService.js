// Todas as chamas de API relacionadas a usuários vão ficar aqui
import api from "./api";

// Autenticando um usuário por email + senha
export async function login(email, password) {
  // Montando a requisição. O axios transforma "params" em ?email=...&password=...
  const response = await api.get("/users", {
    params: { email, password },
  });

  // response.data é o array de resultados
  // Login correto retrona exatamente um usuário. Login errado retorna array vazio
  // Retorno o primeiro elemento, ou null se ninguém bateu com o filtro
  return response.data[0] || null;
}

// Busca um único usuário pelo id (usado depois pra atualizar dados)
export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// Atualiza um registro de usuário (PATCH altera só os campos enviados, preservando o resto).
// Depois, uso isso para atualizar o saldo após uma aposta ou um prêmio.
export async function updateUser(id, changes) {
  const response = await api.patch(`/users/${id}`, changes);
  return response.data;
}

// Busca todos os usuários (usado no ranking).
export async function getAllUsers() {
  const response = await api.get("/users");
  return response.data;
}
