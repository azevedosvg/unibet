import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import BetScreen from "../pages/BetScreen";
import History from "../pages/History";
import Ranking from "../pages/Ranking";
import ProtectedRoute from "./ProtectedRoute";
import Statement from "../pages/Statement";

function AppRoutes() {
  return (
    <Routes>
      {/* Rota raiz, redireciona para o login. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Tela de login (rota pública). */}
      <Route path="/login" element={<Login />} />

      {/* Painel do admin: só perfil "admin". */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Painel do jogador: só perfil "user". */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Tela de aposta de um evento específico. */}
      <Route
        path="/bet/:id"
        element={
          <ProtectedRoute allowedRole="user">
            <BetScreen />
          </ProtectedRoute>
        }
      />

      {/* Histórico de apostas do jogador. */}
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRole="user">
            <History />
          </ProtectedRoute>
        }
      />

      {/* Ranking de jogadores. */}
      <Route
        path="/ranking"
        element={
          <ProtectedRoute allowedRole="user">
            <Ranking />
          </ProtectedRoute>
        }
      />

      {/* Extrato de movimentações do jogador (funcionalidade extra). */}
      <Route
        path="/statement"
        element={
          <ProtectedRoute allowedRole="user">
            <Statement />
          </ProtectedRoute>
        }
      />

      {/* Rota coringa: qualquer URL inexistente cai no login. */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
