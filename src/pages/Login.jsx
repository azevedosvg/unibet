import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado para mostrar mensagem de erro (ex: senha errada). Vazio = sem erro.
  const [error, setError] = useState("");

  // Estado de carregamento: desabilita o botão enquanto a API responde, evitando que o usuário clique várias vezes.
  const [loading, setLoading] = useState(false);

  // signIn vem do AuthContext (faz o login e guarda o usuário global).
  const signIn = useAuth().signIn;

  // hook do React Router para redirecionar via código.
  const navigate = useNavigate();

  async function handleSubmit(event) {
    // Evitar o comportamento padrão do HTML de recarregar a página inteira
    event.preventDefault();

    setError(""); // limpar erros anteriores
    setLoading(true); // ativa o estado de carregando

    try {
      // Chama o login do contexto. Se as credenciais baterem, retorna o usuário
      const loggedUser = await signIn(email, password);

      // Redireciona conforme o perfil
      // admin vai para o painel administrativo, jogador vai para o painel de usuário
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Se o login lançou erro (credenciais inválidas), mostra mensagem de erro
      setError(err.message);
    } finally {
      // finally roda sempre, dando certo ou errado, desliga o "carregando"
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h1>Uni Bet</h1>
      <p>Entre com sua conta para apostar</p>

      {/* onSubmit no formulário captura tanto o clique no botão quanto o Enter. */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail</label>
          <input
            type="email"
            value={email} // valor controlado pelo estado
            onChange={(e) => setEmail(e.target.value)} // atualiza o estado a cada tecla
            placeholder="seu@email.com"
            required // validação nativa do HTML: campo obrigatório
          />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            required
          />
        </div>

        {/* A mensagem de erro só aparece se houver texto em `error`. */}
        {error && <p className="error-message">{error}</p>}

        {/* O botão fica desabilitado enquanto carrega, e o texto muda. */}
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default Login;
