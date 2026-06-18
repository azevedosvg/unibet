// Porteiro que protege rotas privadas
// Verifica se há usuário logado e se o perfil dele tem permissão pra acessar a rota

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Props:
// children: o conteúdo (a página) que será protegida
// allowedRole: o perfil exigido para acessar ("admin" ou "user")
function ProtectedRoute({ children, allowedRole }) {
  // Pega o usuário logado do contexto global de autenticação
  const { user } = useAuth();

  // 1 > Ninguêm logado? Manda para o login
  // O usuário só existe no estado enquanto a sessão está ativa
  // se ele recarregar a página, o estado zera e cai aqui
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2 > Está logado, mas com o perfil errado para essa rota?
  // Ex: jogador tentando abrir /admin. Redireciona para o painel dele
  if (allowedRole && user.role !== allowedRole) {
    // Descobre a área própria do perfil: admin vai pro painel admin, o resto pro dashboard do jogador
    const ownArea = user.role === "admin" ? "/admin" : "/dashboard";
    // Manda cada perfil de volta para a sua própria área
    return <Navigate to={ownArea} replace />;
  }

  // 3) Passou nas duas checagens: está logado e com o perfil certo.
  // Libera o acesso à página.
  return children;
}

export default ProtectedRoute;
