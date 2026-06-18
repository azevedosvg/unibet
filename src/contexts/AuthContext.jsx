// Usa a context API para que qualquer componente acesse o usuário logado, sem precisar receber essa informação via props
import { createContext, useContext, useState, useEffect } from "react";
import { login as loginRequest, getUserById } from "../services/userService";
import { grantDailyBonusIfEligible } from "../services/bonusService";

// 1: Criando o contexto (canal por onde os dados vão trafegar)
const AuthContext = createContext();

// Chave usada no localStorage para persistir a sessão entre recarregamentos.
const STORAGE_KEY = "unibet:user";

// 2: Provider (envolve o app e disponibiliza os dados, tudo que estiver dentro dele, consegue ler o usuário logado)
export function AuthProvider({ children }) {
  // Guarda o usuário autenticado, null = ninguém logado ainda.
  // Inicializa lendo o localStorage: se já havia uma sessão, ela sobrevive ao F5.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // Sempre que o usuário mudar, espelha no localStorage (ou limpa, no logout).
  // É isso que mantém a sessão viva ao recarregar a página.
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Função de login: recebe email e senha, consulta a API via service, e se encontrar o usuário, guarda no estado global
  async function signIn(email, password) {
    const foundUser = await loginRequest(email, password);

    // Se a API não retornou ninguém, as credenciais estão erradas.
    if (!foundUser) {
      throw new Error("E-Mail ou senha inválidos");
    }

    // Concede o bônus diário se for o primeiro login do dia.
    // A função devolve o usuário com saldo atualizado (ou o mesmo, se já recebeu).
    const userWithBonus = await grantDailyBonusIfEligible(foundUser);

    // Guarda o usuário (já com o bônus, se houve) no estado global.
    setUser(userWithBonus);
    return userWithBonus; // devolve para a tela de login decidir para onde redirecionar
  }

  // Função de logout: apenas zera o usuário do estado (o useEffect limpa o localStorage)
  function signOut() {
    setUser(null);
  }

  // Re-busca o usuário atual na API e atualiza o estado global.
  // Usado para refletir mudanças feitas fora desta sessão — por exemplo, quando
  // o admin liquida um evento e credita o prêmio: ao voltar para a banca, o
  // jogador vê o saldo já atualizado, sem precisar deslogar e logar de novo.
  async function refreshUser() {
    if (!user) return;
    const fresh = await getUserById(user.id);
    setUser(fresh);
  }

  // 3: Disponibiliza o estado (user), o setter (setUser, usado ao atualizar o saldo após uma aposta) e as ações (signIn, signOut, refreshUser) para todos os componentes filhos através do 'value'
  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4: Hook customizado: atalho para os componentes consumirem o contexto. Ao invés de importar useContext + AuthContext toda vez, o componente chama apenas useAuth().
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
