// Usa a context API para que qualquer componente acesse o usuário logado, sem precisar receber essa informação via props
import { createContext, useContext, useState } from "react";
import { login as loginRequest } from "../services/userService";

// 1: Criando o contexto (canal por onde os dados vão trafegar)
const AuthContext = createContext();

// 2: Provider (envolve o app e disponibiliza os dados, tudo que estiver dentro dele, consegue ler o usuário logado)
export function AuthProvider({ children }) {
  // Guarda o usuário autenticado, null = ninguém logado ainda
  const [user, setUser] = useState(null);

  // Função de login: recebe email e senha, consulta a API via service, e se encontrar o usuário, guarda no estado global
  async function signIn(email, password) {
    const foundUser = await loginRequest(email, password);

    // Se a API não retornou ninguém, as credenciais estão erradas.
    if (!foundUser) {
      throw new Error("E-Mail ou senha inválidos");
    }

    // Login válido: guarda o usuário no estado global
    setUser(foundUser);
    return foundUser; // devolve para a tela de login decidir para onde redirecionar
  }

  // Função de logout: apenas zera o usuário do estado
  function signOut() {
    setUser(null);
  }

  // 3: Disponibiliza o estado (user) e as ações (signIn, signOut) para todos os componentes filhos através do 'value'
  return (
    <AuthContext.provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.provider>
  );
}

// 4: Hook customizado: atalho para os componentes consumirem o contexto. Ao invés de importar useContext + AuthContext toda vez, o componente chama apenas useAuth().
export function useAuth() {
  return useContext(AuthContext);
}
