import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Rota raiz, redireciona para o login. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Tela de login, acessível por /login */}
      <Route path="/login" element={<Login />} />

      {/* Painel do admin: protegido, só perfil "admin" entra. */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Painel do jogador: protegido, só perfil "user" entra. */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Rota coringa: Qualquer URL inexistente cai no login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
