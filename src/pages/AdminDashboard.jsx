import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Lock, Unlock, Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService";
import { settleEvent } from "../services/settlementService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";

function AdminDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [hasDraw, setHasDraw] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  async function loadEvents() {
    const data = await getEvents();
    setEvents(data);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setMessage("");
    if (teamA.trim().toLowerCase() === teamB.trim().toLowerCase()) {
      setMessageType("error");
      setMessage("Os dois lados não podem ser o mesmo time.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date + "T00:00:00");
    if (selectedDate < today) {
      setMessageType("error");
      setMessage("A data do evento não pode estar no passado.");
      return;
    }
    try {
      await createEvent({ teamA, teamB, sport, date, hasDraw });
      setMessageType("success");
      setMessage("Evento cadastrado com sucesso!");
      setTeamA("");
      setTeamB("");
      setSport("");
      setDate("");
      setHasDraw(false);
      loadEvents();
    } catch {
      setMessageType("error");
      setMessage("Erro ao cadastrar evento. Tente novamente.");
    }
  }

  async function handleCloseBets(id) {
    await updateEvent(id, { status: "closed" });
    loadEvents();
  }
  async function handleReopenBets(id) {
    await updateEvent(id, { status: "open" });
    loadEvents();
  }
  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
    await deleteEvent(id);
    loadEvents();
  }
  async function handleSettle(id, winningSide) {
    if (
      !window.confirm(
        "Confirmar o resultado? Isso vai pagar os vencedores e não pode ser desfeito.",
      )
    )
      return;
    await settleEvent(id, winningSide);
    loadEvents();
  }

  // Helper: traduz o status para um Badge colorido.
  function statusBadge(status) {
    if (status === "open")
      return (
        <Badge variant="win" dot>
          Aberto
        </Badge>
      );
    if (status === "closed") return <Badge variant="gold">Encerrado</Badge>;
    if (status === "settled")
      return <Badge variant="neutral">Finalizado</Badge>;
    return null;
  }

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto py-6 sm:py-8">
      {/* Título do painel (logo e sair ficam no header global). */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Painel do administrador</h1>
        <p className="text-xs text-muted mt-1">Bem-vindo, {user?.name}</p>
      </div>

      {/* Formulário de cadastro */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-surface border border-line rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-5">
          <Plus size={18} className="text-gold" />
          <h2 className="font-bold">Cadastrar novo evento</h2>
        </div>
        <form onSubmit={handleCreate}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Time / Lado A"
              type="text"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              placeholder="Ex: Brasil"
              required
            />
            <Input
              label="Time / Lado B"
              type="text"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              placeholder="Ex: Argentina"
              required
            />
            <Input
              label="Esporte"
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="Ex: Futebol"
              required
            />
            <Input
              label="Data do evento"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          {/* Empate: esportes como futebol têm; tênis, MMA, F1 etc. não. */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={hasDraw}
              onChange={(e) => setHasDraw(e.target.checked)}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-sm text-muted">
              Permite empate (futebol, etc.)
            </span>
          </label>
          <Button
            type="submit"
            variant="gold"
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Cadastrar evento
          </Button>
          {message && (
            <p
              className={`text-sm mt-3 ${messageType === "error" ? "text-loss" : "text-win"}`}
            >
              {message}
            </p>
          )}
        </form>
      </motion.div>

      {/* Lista de eventos */}
      <h2 className="text-sm font-bold tracking-widest uppercase mb-4">
        Eventos cadastrados
      </h2>

      {events.length === 0 ? (
        <p className="text-muted py-8 text-center">
          Nenhum evento cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {events.map((ev, index) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-surface border border-line rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold">
                    {ev.teamA} × {ev.teamB}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {ev.sport} · {ev.date}
                  </p>
                </div>
                {statusBadge(ev.status)}
              </div>

              {/* Ações conforme o status */}
              <div className="flex flex-wrap items-center gap-2">
                {ev.status === "open" && (
                  <Button
                    variant="ghost"
                    onClick={() => handleCloseBets(ev.id)}
                    className="flex items-center gap-1.5 !py-1.5 !text-xs"
                  >
                    <Lock size={14} /> Encerrar apostas
                  </Button>
                )}

                {ev.status === "closed" && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => handleReopenBets(ev.id)}
                      className="flex items-center gap-1.5 !py-1.5 !text-xs"
                    >
                      <Unlock size={14} /> Reabrir
                    </Button>
                    <span className="text-xs text-muted ml-1">Vencedor:</span>
                    <Button
                      variant="gold"
                      onClick={() => handleSettle(ev.id, "A")}
                      className="!py-1.5 !text-xs"
                    >
                      {ev.teamA}
                    </Button>
                    {/* Só oferece "Empate" quando o evento realmente admite empate. */}
                    {ev.hasDraw && (
                      <Button
                        variant="gold"
                        onClick={() => handleSettle(ev.id, "Draw")}
                        className="!py-1.5 !text-xs"
                      >
                        Empate
                      </Button>
                    )}
                    <Button
                      variant="gold"
                      onClick={() => handleSettle(ev.id, "B")}
                      className="!py-1.5 !text-xs"
                    >
                      {ev.teamB}
                    </Button>
                  </>
                )}

                {ev.status === "settled" && (
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <Trophy size={14} className="text-gold" />
                    Resultado:{" "}
                    {ev.result === "A"
                      ? ev.teamA
                      : ev.result === "B"
                        ? ev.teamB
                        : "Empate"}
                  </span>
                )}

                <button
                  onClick={() => handleDelete(ev.id)}
                  className="ml-auto p-1.5 rounded-lg hover:bg-loss/10 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} className="text-loss" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
