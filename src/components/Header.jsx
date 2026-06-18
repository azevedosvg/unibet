// Cabeçalho global do app. Aparece em todas as telas (menos no login).
// - Deslogado: botões "Entrar" e "Criar conta".
// - Jogador logado: navegação (Início, Banca, Histórico, Ranking, Extrato) + saldo.
// - Admin logado: atalho para o painel + sair.
// Responsivo: no desktop mostra ícone + texto; no mobile, só os ícones.
// No mobile, um botão ☰ abre a barra lateral de esportes como drawer.
import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Wallet,
  History,
  Trophy,
  Receipt,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { formatMoney } from "../utils/format";
import Logo from "./ui/Logo";
import Sidebar from "./Sidebar";

// Um item de navegação: ícone sempre, texto só no desktop (lg+).
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${
          active
            ? "text-gold bg-surface"
            : "text-muted hover:text-ink hover:bg-surface"
        }`}
    >
      <Icon size={18} />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  const { mockFeature } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filtro de esporte ativo (lido da URL), para destacar na sidebar do drawer.
  const activeSport = searchParams.get("sport") || "Todos";

  // Itens de navegação do jogador logado.
  const playerNav = [
    { icon: Home, label: "Início", to: "/" },
    { icon: LayoutDashboard, label: "Banca", to: "/dashboard" },
    { icon: History, label: "Histórico", to: "/history" },
    { icon: Trophy, label: "Ranking", to: "/ranking" },
    { icon: Receipt, label: "Extrato", to: "/statement" },
  ];

  // Seleciona um esporte no drawer: vai para a Home filtrada e fecha o drawer.
  function selectSport(name) {
    navigate(name === "Todos" ? "/" : `/?sport=${encodeURIComponent(name)}`);
    setDrawerOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Esquerda: botão de menu (mobile) + marca. */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
            title="Esportes"
          >
            <Menu size={20} />
          </button>
          <button onClick={() => navigate("/")} className="shrink-0">
            <Logo size={30} />
          </button>
        </div>

        {/* Navegação à direita, conforme o estado de autenticação. */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          {!user && (
            <>
              <NavItem
                icon={Home}
                label="Início"
                active={pathname === "/"}
                onClick={() => navigate("/")}
              />
              {/* Entrar (real) e Criar conta (mockado). */}
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                           text-ink border border-line hover:border-gold/50 transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
              <button
                onClick={mockFeature}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold
                           bg-gold-gradient text-bg hover:brightness-110 transition-all"
              >
                <UserPlus size={18} />
                <span className="hidden sm:inline">Criar conta</span>
              </button>
            </>
          )}

          {user && user.role === "user" && (
            <>
              {playerNav.map((item) => (
                <NavItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.to}
                  onClick={() => navigate(item.to)}
                />
              ))}
              {/* Saldo (escondido no mobile para não apertar a barra). */}
              <div className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-full bg-surface border border-line">
                <Wallet size={14} className="text-gold" />
                <span className="text-sm font-mono font-bold">
                  {formatMoney(user.balance)}
                </span>
              </div>
              <button
                onClick={signOut}
                title="Sair"
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-loss hover:bg-loss/10 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <NavItem
                icon={LayoutDashboard}
                label="Painel"
                active={pathname === "/admin"}
                onClick={() => navigate("/admin")}
              />
              <button
                onClick={signOut}
                title="Sair"
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-loss hover:bg-loss/10 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Drawer da barra lateral de esportes (mobile). */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85%]
                         bg-bg border-r border-line overflow-y-auto p-3"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <Logo size={28} />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-muted hover:bg-surface"
                >
                  <X size={18} />
                </button>
              </div>
              <Sidebar active={activeSport} onSelect={selectSport} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
