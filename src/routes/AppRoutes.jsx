import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Rota raiz, redireciona para o login. */}
      {/* `replace` troca a entrada no histórico em vez de empilhar, então o botão "voltar" do navegador não volta para "/" vazio. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Tela de login, acessível por /login */}
      <Route path="/login" element={<Login />} />

      {/* Painéis */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* Rota coringa: Qualquer URL inexistente cai no login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
