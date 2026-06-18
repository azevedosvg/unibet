import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { BetSlipProvider } from "./contexts/BetSlipContext";
import App from "./App";
import "./index.css";

// A ORDEM de aninhamento importa:
// - BrowserRouter por fora: habilita o sistema de rotas em toda a aplicação.
// - AuthProvider em volta do App: disponibiliza o usuário logado a todas as telas.
// - ToastProvider: disponibiliza as notificações flutuantes para todas as telas.
// - App por dentro: contém as rotas, que agora têm acesso tanto ao router quanto ao auth.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <BetSlipProvider>
            <App />
          </BetSlipProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
