// Permite cadastrar novos eventos e listar os já existentes.

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService";

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
  // type vai diferenciar mensagem de sucesso e de erro (melhora na estilização)
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" ou "error"

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

    // Validações antes de enviar para a API
    // 1) Os dois lados não podem ser o mesmo time
    // .trim() para remover espaços nas pontas; .toLowerCase() para ignorar maiúsculas/minúsculas
    // Logo, "Brasil" e "brasil" são tratados como iguais
    if (teamA.trim().toLowerCase() === teamB.trim().toLowerCase()) {
      setMessageType("error");
      setMessage("Os dois lados não podem ser o mesmo time.");
      return; // interrompe -- não envia para a API
    }

    // 2) A data não pode estar no passado
    // Comparo a data escolhida com a data de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0); // zera o horário para comparar só o dia
    const selectedDate = new Date(date + "T00:00:00"); // interpreta como data local

    if (selectedDate < today) {
      setMessageType("error");
      setMessage("A data do evento não pode estar no passado.");
      return;
    }

    // Passou nas validações, entra para a API
    try {
      await createEvent({ teamA, teamB, sport, date });

      setMessageType("success");
      setMessage("Evento cadastrado com sucesso!");

      // Limpa os campos do formulário após cadastro
      setTeamA("");
      setTeamB("");
      setSport("");
      setDate("");

      // Recarrega a lista para o evento novo aparecer
      loadEvents();
    } catch (err) {
      setMessageType("error");
      setMessage("Erro ao cadastrar evento. Tente novamente.");
    }
  }

  // Encerra as apostas de um evento: muda o status de "open" para "closed".
  // PATCH envia só o campo status: o resto do evento continua intacto
  async function handleCloseBets(id) {
    await updateEvent(id, { status: "closed" });
    loadEvents(); // recarrega a lista para refletir o novo status
  }

  // Reabre as apostas de um evento (volta de 'closed' para 'open')
  // Útil se o admin encerrour por engano.
  async function handleReopenBets(id) {
    await updateEvent(id, { status: "open" });
    loadEvents();
  }

  // Exclui um evento. Pede confirmação antes, porque é uma ação irreversível.
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este evento? Esta ação é irreversível.",
    );
    if (!confirmed) return; // Se o admin cancelar, não faz nada

    await deleteEvent(id);
    loadEvents();
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
        {message && (
          <p className={messageType === "error" ? "msg-error" : "msg-success"}>
            {message}
          </p>
        )}
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    {ev.teamA} x {ev.teamB}
                  </td>
                  <td>{ev.sport}</td>
                  <td>{ev.date}</td>
                  <td>{ev.status}</td>
                  <td>
                    {/* Os botões mudam conforme o status atual do evento. */}

                    {/* Evento aberto: pode encerrar as apostas. */}
                    {ev.status === "open" && (
                      <button onClick={() => handleCloseBets(ev.id)}>
                        Encerrar apostas
                      </button>
                    )}

                    {/* Evento encerrado: pode reabrir (mas não se já foi liquidado). */}
                    {ev.status === "closed" && (
                      <button onClick={() => handleReopenBets(ev.id)}>
                        Reabrir apostas
                      </button>
                    )}

                    {/* Evento liquidado: não há mais ações de aposta, só informa. */}
                    {ev.status === "settled" && <span>Finalizado</span>}

                    {/* Excluir está sempre disponível. */}
                    <button onClick={() => handleDelete(ev.id)}>Excluir</button>
                  </td>
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
