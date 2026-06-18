import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Wallet, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { getEventById, updateEvent } from "../services/eventService";
import { updateUser } from "../services/userService";
import { createBet, createTransaction } from "../services/betService";
import { useOdds } from "../hooks/useOdds";
import { formatMoney } from "../utils/format";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function BetScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [event, setEvent] = useState(null);
  const [pick, setPick] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { oddA, oddB, oddDraw } = useOdds(event);

  useEffect(() => {
    async function loadEvent() {
      const data = await getEventById(id);
      setEvent(data);
    }
    loadEvent();
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Carregando evento...</p>
      </div>
    );
  }

  // Trava de segurança: se o evento não está aberto (encerrado ou já liquidado),
  // ninguém pode apostar — nem chegando aqui direto pela URL /bet/:id.
  if (event.status !== "open") {
    return (
      <div className="max-w-lg mx-auto py-6 sm:py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="flex flex-col items-center text-center bg-surface border border-line rounded-2xl p-8">
          <div className="w-14 h-14 rounded-full bg-surface2 flex items-center justify-center mb-4">
            <Lock size={24} className="text-gold" />
          </div>
          <h1 className="text-xl font-bold mb-1">Apostas encerradas</h1>
          <p className="text-sm text-muted mb-6">
            {event.teamA} × {event.teamB} não está mais aceitando apostas.
          </p>
          <Button variant="gold" onClick={() => navigate("/dashboard")}>
            Voltar para as mesas
          </Button>
        </div>
      </div>
    );
  }

  function getSelectedOdd() {
    if (pick === "A") return oddA;
    if (pick === "B") return oddB;
    if (pick === "Draw") return oddDraw;
    return 0;
  }

  const estimatedReturn = (Number(amount) * getSelectedOdd()).toFixed(2);

  async function handleConfirm() {
    setMessage("");
    const value = Number(amount);
    if (!pick) {
      setMessage("Escolha um palpite antes de apostar.");
      return;
    }
    if (!value || value <= 0) {
      setMessage("Informe um valor válido para a aposta.");
      return;
    }
    if (value < 10) {
      setMessage("A aposta mínima é U$ 10.");
      return;
    }
    if (value > user.balance) {
      setMessage("Saldo insuficiente para esta aposta.");
      return;
    }

    setLoading(true);
    try {
      const poolField =
        pick === "A" ? "poolA" : pick === "B" ? "poolB" : "poolDraw";
      const oddAtBet = getSelectedOdd();
      const newBalance = user.balance - value;
      await updateUser(user.id, { balance: newBalance });
      const newPoolValue = (event[poolField] || 0) + value;
      await updateEvent(event.id, { [poolField]: newPoolValue });
      await createBet({
        userId: user.id,
        eventId: event.id,
        pick,
        amount: value,
        oddAtBet,
        status: "pending",
        payout: 0,
      });
      await createTransaction({
        userId: user.id,
        type: "bet",
        value: -value,
        description: `Aposta em ${event.teamA} x ${event.teamB}`,
        date: new Date().toISOString(),
      });
      setUser({ ...user, balance: newBalance });
      showToast("Aposta registrada com sucesso!", "success");
      navigate("/dashboard");
    } catch {
      setMessage("Erro ao registrar a aposta. Tente novamente.");
      setLoading(false);
    }
  }

  // Lista dos palpites para gerar os botões de seleção dinamicamente.
  // Esportes sem empate (tênis, MMA, F1...) não mostram a opção "Empate".
  const options = event.hasDraw
    ? [
        { key: "A", label: event.teamA, odd: oddA },
        { key: "Draw", label: "Empate", odd: oddDraw },
        { key: "B", label: event.teamB, odd: oddB },
      ]
    : [
        { key: "A", label: event.teamA, odd: oddA },
        { key: "B", label: event.teamB, odd: oddB },
      ];

  return (
    <div className="max-w-lg lg:max-w-xl mx-auto py-6 sm:py-8">
      {/* Topo: voltar + saldo */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line">
          <Wallet size={14} className="text-gold" />
          <span className="text-sm font-mono font-bold">
            {formatMoney(user.balance)}
          </span>
        </div>
      </div>

      {/* Confronto */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <span className="text-xs uppercase tracking-wider text-gold font-bold">
          {event.sport} · {event.date}
        </span>
        <h1 className="text-3xl font-bold mt-1">
          {event.teamA} × {event.teamB}
        </h1>
      </motion.div>

      {/* Seleção do palpite */}
      <p className="text-xs uppercase tracking-wider text-muted mb-3">
        Escolha seu palpite
      </p>
      <div
        className={`grid gap-3 mb-8 ${event.hasDraw ? "grid-cols-3" : "grid-cols-2"}`}
      >
        {options.map((opt) => {
          const selected = pick === opt.key;
          return (
            <motion.button
              key={opt.key}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPick(opt.key)}
              className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all duration-200
                ${
                  selected
                    ? "bg-gold/10 border-gold"
                    : "bg-surface border-line hover:border-gold/40"
                }`}
            >
              <span
                className={`text-xs mb-1 truncate max-w-full px-1 ${selected ? "text-gold" : "text-muted"}`}
              >
                {opt.label}
              </span>
              <span
                className={`text-xl font-bold font-mono ${selected ? "text-gold" : "text-ink"}`}
              >
                {opt.odd.toFixed(2)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Valor da aposta */}
      <Input
        label="Valor da aposta (U$)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Mínimo U$ 10"
        min="10"
        className="mb-6"
      />

      {/* Prévia do retorno: card que só aparece com palpite + valor */}
      {pick && Number(amount) > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between p-5 rounded-2xl bg-surface border border-gold/30 mb-6"
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              Retorno estimado
            </p>
            <p className="text-2xl font-bold font-mono text-gold">
              {formatMoney(estimatedReturn)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Odd</p>
            <p className="font-mono font-bold">{getSelectedOdd().toFixed(2)}</p>
          </div>
        </motion.div>
      )}

      {/* Mensagem de erro */}
      {message && <p className="text-loss text-sm mb-4">{message}</p>}

      {/* Ações */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          variant="gold"
          onClick={handleConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Check size={18} />
          {loading ? "Confirmando..." : "Confirmar aposta"}
        </Button>
      </div>
    </div>
  );
}

export default BetScreen;
