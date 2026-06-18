import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import SocialButtons from "../components/ui/SocialButtons";
import { ChipIcon } from "../components/ui/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { mockFeature } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // Se o usuário veio de uma ação (ex: tentou apostar), volta para lá após logar.
  const redirectTo = location.state?.redirectTo;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedUser = await signIn(email, password);
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate(redirectTo || "/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Container geral. No mobile empilha (coluna); no desktop (lg) vira duas
    // colunas lado a lado: marca grande à esquerda, login à direita.
    // (o padding lateral vem do wrapper global em App.jsx — mobile-first).
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 py-8 relative overflow-hidden">
      {/* Brilho dourado radial decorativo no fundo (atrás de tudo). */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 lg:left-1/3 w-[500px] h-[400px]
                      bg-gold/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* COLUNA ESQUERDA: bloco da marca, com animação de entrada (fade + slide). */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center relative z-10"
      >
        {/* Emblema: ficha de cassino dourada com brilho ao redor.
            Cresce bastante no desktop (duas ChipIcon: uma para mobile, outra maior para lg). */}
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 lg:w-44 lg:h-44 rounded-full bg-surface border-2 border-gold/40
                        flex items-center justify-center mb-5 lg:mb-7
                        shadow-[0_0_50px_rgba(139,124,255,0.35)]"
        >
          <ChipIcon size={60} className="lg:hidden" />
          <ChipIcon size={108} className="hidden lg:block" />
        </div>
        {/* Wordmark dourado da marca (bem grande no desktop). */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-[0.15em] bg-gold-gradient bg-clip-text text-transparent">
          UNIBET
        </h1>
        <p className="text-gold/80 text-sm lg:text-base tracking-[0.3em] uppercase mt-2 lg:mt-3">
          A bolsa de palpites
        </p>
      </motion.div>

      {/* COLUNA DIREITA: card de login + usuários de teste. */}
      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center relative z-10">
      {/* Card do formulário, com animação de entrada (fade + slide de baixo). */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full bg-surface border border-line rounded-3xl p-7 sm:p-8"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-5 text-center">
          Bem-vindo de volta
        </h2>

        {/* onSubmit captura clique no botão e Enter. */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
          <Input
            label="Senha"
            // O tipo alterna entre "password" e "text" conforme o olho clicado.
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            required
            // Olho para mostrar/ocultar a senha (funcionalidade real).
            append={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="p-2 text-muted hover:text-gold transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Link "esqueci a senha" (apenas visual/mockado). */}
          <button
            type="button"
            onClick={mockFeature}
            className="self-end -mt-1 text-xs text-muted hover:text-gold transition-colors"
          >
            Esqueci minha senha
          </button>

          {/* Mensagem de erro com leve animação ao aparecer. */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-loss text-sm"
            >
              {error}
            </motion.p>
          )}

          {/* Botão dourado, ocupando a largura toda, com ícone. */}
          <Button
            type="submit"
            variant="gold"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-2"
          >
            <LogIn size={18} />
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Divisor "ou" entre o login normal e o login social. */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs text-muted uppercase tracking-wider">ou</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Login social (Google, Facebook, Apple) — apenas visual/mockado. */}
        <SocialButtons onClick={mockFeature} />

        {/* Chamada para criar conta (apenas visual/mockado). */}
        <p className="text-center text-sm text-muted mt-6">
          Não tem conta?{" "}
          <button
            type="button"
            onClick={mockFeature}
            className="text-gold font-bold hover:underline"
          >
            Criar conta
          </button>
        </p>
      </motion.div>

      {/* Usuários de teste, no rodapé do card. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-muted/80 text-xs font-mono">
          admin@unibet.com · joao@unibet.com · senha 123
        </p>
      </motion.div>
      </div>
    </div>
  );
}

export default Login;
