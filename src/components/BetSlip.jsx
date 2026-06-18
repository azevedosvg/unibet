// Cupom de apostas (bet slip), no estilo dos sites de bet.
// Botão flutuante no canto que abre um painel lateral com as seleções.
// Cada seleção tem seu valor; ao confirmar, registra todas de uma vez.
// Pede login só na confirmação (a pessoa pode montar o cupom deslogada).
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Ticket, X, Trash2, Check } from "lucide-react";
import { useBetSlip } from "../contexts/BetSlipContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { placeBet } from "../services/bettingService";
import { formatMoney } from "../utils/format";
import Button from "./ui/Button";

function BetSlip() {
  const { selections, removeSelection, clearSlip } = useBetSlip();
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [stakes, setStakes] = useState({});
  const [placing, setPlacing] = useState(false);

  const count = selections.length;

  // Totais do cupom (soma das apostas e do retorno potencial).
  const totalStake = selections.reduce(
    (sum, s) => sum + (Number(stakes[s.key]) || 0),
    0,
  );
  const totalReturn = selections.reduce(
    (sum, s) => sum + (Number(stakes[s.key]) || 0) * s.odd,
    0,
  );

  function setStake(key, value) {
    setStakes((prev) => ({ ...prev, [key]: value }));
  }

  async function handleConfirm() {
    // Login só é exigido aqui, na hora de confirmar (a ação).
    if (!user) {
      showToast("Entre na sua conta para confirmar o cupom.", "info");
      setOpen(false);
      navigate("/login");
      return;
    }
    if (user.role !== "user") {
      showToast("Administrador não realiza apostas.", "error");
      return;
    }
    // Cada seleção precisa de um valor mínimo de U$ 10.
    for (const s of selections) {
      const amt = Number(stakes[s.key]);
      if (!amt || amt < 10) {
        showToast("Cada aposta precisa de no mínimo U$ 10.", "error");
        return;
      }
    }
    if (totalStake > user.balance) {
      showToast("Saldo insuficiente para este cupom.", "error");
      return;
    }

    setPlacing(true);
    try {
      // Registra cada seleção em sequência, abatendo do saldo a cada uma.
      let running = { ...user };
      for (const s of selections) {
        const newBalance = await placeBet({
          user: running,
          eventId: s.eventId,
          pick: s.pick,
          amount: Number(stakes[s.key]),
          oddAtBet: s.odd,
          teamA: s.teamA,
          teamB: s.teamB,
        });
        running = { ...running, balance: newBalance };
      }
      setUser(running);
      showToast(
        `${count} aposta${count > 1 ? "s" : ""} confirmada${count > 1 ? "s" : ""}! Boa sorte.`,
        "success",
      );
      clearSlip();
      setStakes({});
      setOpen(false);
    } catch {
      showToast("Erro ao confirmar o cupom. Tente novamente.", "error");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      {/* Botão flutuante: aparece quando há seleções no cupom. */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2
                       bg-gold-gradient text-bg font-bold px-5 py-3 rounded-full
                       shadow-lg shadow-gold/20 hover:brightness-110"
          >
            <Ticket size={20} />
            Cupom
            <span className="bg-bg/20 rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {count}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Painel lateral do cupom. */}
      <AnimatePresence>
        {open && (
          <>
            {/* Fundo escurecido. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60"
            />
            {/* Drawer da direita. */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm
                         bg-surface border-l border-line flex flex-col"
            >
              {/* Cabeçalho. */}
              <div className="flex items-center justify-between p-5 border-b border-line">
                <div className="flex items-center gap-2">
                  <Ticket size={18} className="text-gold" />
                  <h2 className="font-bold">Cupom de apostas</h2>
                  <span className="text-xs text-muted">({count})</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface2 text-muted"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Lista de seleções (rolável). */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {selections.map((s) => {
                  const stake = Number(stakes[s.key]) || 0;
                  return (
                    <div
                      key={s.key}
                      className="bg-surface2 border border-line rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-gold font-bold">
                            {s.sport}
                          </p>
                          <p className="text-sm font-bold truncate">
                            {s.teamA} × {s.teamB}
                          </p>
                          <p className="text-xs text-muted">
                            Palpite:{" "}
                            <span className="text-ink">{s.pickLabel}</span> · Odd{" "}
                            <span className="font-mono text-gold">
                              {s.odd.toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => removeSelection(s.key)}
                          className="p-1 rounded hover:bg-loss/10 text-loss shrink-0"
                          title="Remover"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="10"
                          value={stakes[s.key] || ""}
                          onChange={(e) => setStake(s.key, e.target.value)}
                          placeholder="Valor (mín. 10)"
                          className="w-32 px-3 py-1.5 rounded-lg bg-bg border border-line text-sm
                                     focus:outline-none focus:border-gold"
                        />
                        <span className="text-xs text-muted ml-auto">
                          Retorno{" "}
                          <span className="font-mono text-win">
                            {formatMoney(stake * s.odd)}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rodapé: totais + ações. */}
              <div className="border-t border-line p-4 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Total apostado</span>
                  <span className="font-mono font-bold">
                    {formatMoney(totalStake)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Retorno potencial</span>
                  <span className="font-mono font-bold text-win">
                    {formatMoney(totalReturn)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      clearSlip();
                      setStakes({});
                    }}
                    className="flex items-center gap-1.5 !px-3"
                  >
                    <Trash2 size={16} /> Limpar
                  </Button>
                  <Button
                    variant="gold"
                    onClick={handleConfirm}
                    disabled={placing}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    {placing ? "Confirmando..." : "Confirmar cupom"}
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default BetSlip;
