// Ter um único cliente configurado mantém a URL base em um lugar só
import axios from "axios";

// Todas as requisições pra essa API vão apontar pra essa URL
const api = axios.create({
  baseURL: "http://localhost:3000", // > endereço que o json server escuta
});

export default api;
