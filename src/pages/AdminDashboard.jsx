// Permite cadastrar novos eventos e listar os já existentes.

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getEvents, createEvent } from "../services/eventService";

function AdminDashboard() {
  // signOut vem do contexto: usado no botão de sair.
  const { signOut, user } = useAuth();

  // Estado da lista de evento
  // Guarda os eventos vindos da API. Começa como array vazio.
  const [events, setEvents] = useState([]);

  // Estados do formulário de cadastro (componentes controlados)
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");

  // Mensagem de feedback para o admin (sucesso ou erro do cadastro).
  const [message, setMessage] = useState("");

  // Função que busca os eventos na API e atualiza o estado.
  // Deixo separada para poder chamá-la tanto ao abrir a tela, quanto depois de cadastrar um evento novo (para a lista atualizar).
  async function loadEvents() {
    const data = await getEvents();
    setEvents(data);
  }

  // useEffect roda código em momentos específicos do ciclo de vida do componente.
  // Com o array vazio [] no final, ele roda UMA vez, logo quando a tela aparece.
  // Uso para carregar os eventos assim que o painel abre.
  useEffect(() => {
    loadEvents();
  }, []);

  // Função chamada ao enviar o formulário de cadastro.
  async function handleCreate(event) {
    event.preventDefault(); // impede o recarregamento padrão do formulário
    setMessage("");

    try {
      // Monta o objeto com os dados do formulário e envia ao service.
      // O service completa com status "open", pools zerados, etc.
      await createEvent({ teamA, teamB, sport, date });

      setMessage("Evento cadastrado com sucesso!");

      // Limpa os campos do formulário após o cadastro.
      setTeamA("");
      setTeamB("");
      setSport("");
      setDate("");

      // Recarrega a lista para o evento novo aparecer.
      loadEvents();
    } catch (err) {
      setMessage("Erro ao cadastrar evento. Tente novamente.");
    }
  }

  return (
    <div>
      {/* Cabeçalho com saudação e botão de sair */}
      <header>
        <h1>Painel do Administrador</h1>
        <p>Olá, {user?.name}</p>
        <button onClick={signOut}>Sair</button>
      </header>

      {/* Formulário de cadastro de evento */}
      <section>
        <h2>Cadastrar novo evento</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label>Time / Lado A</label>
            <input
              type="text"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              placeholder="Ex: Brasil"
              required
            />
          </div>

          <div>
            <label>Time / Lado B</label>
            <input
              type="text"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              placeholder="Ex: Argentina"
              required
            />
          </div>

          <div>
            <label>Esporte</label>
            <input
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="Ex: Futebol"
              required
            />
          </div>

          <div>
            <label>Data do evento</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit">Cadastrar evento</button>
        </form>

        {/* Mensagem de feedback (só aparece se houver texto) */}
        {message && <p>{message}</p>}
      </section>

      {/* Lista dos eventos já cadastrados */}
      <section>
        <h2>Eventos cadastrados</h2>

        {/* Se não houver eventos, mostra um aviso. */}
        {events.length === 0 ? (
          <p>Nenhum evento cadastrado ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Confronto</th>
                <th>Esporte</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Percorre o array de eventos e gera uma linha para cada um. */}
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    {ev.teamA} x {ev.teamB}
                  </td>
                  <td>{ev.sport}</td>
                  <td>{ev.date}</td>
                  <td>{ev.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
