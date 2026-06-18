import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Gift } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getTransactionsByUser } from "../services/betService";
import { formatMoney } from "../utils/format";

function Statement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function loadStatement() {
      const transactions = await getTransactionsByUser(user.id);
      let running = 0;
      const withBalance = transactions.map((t) => {
        running = running + t.value;
        return { ...t, runningBalance: running };
      });
      setRows(withBalance);
    }
    loadStatement();
  }, [user.id]);

  function formatDate(isoDate) {
    return new Date(isoDate).toLocaleString("pt-BR");
  }

  // Ícone e rótulo conforme o tipo de movimentação.
  function typeInfo(type) {
    if (type === "bet")
      return {
        label: "Aposta",
        icon: <ArrowUpRight size={16} className="text-loss" />,
      };
    if (type === "prize")
      return {
        label: "Prêmio",
        icon: <ArrowDownLeft size={16} className="text-win" />,
      };
    if (type === "bonus")
      return { label: "Bônus", icon: <Gift size={16} className="text-gold" /> };
    return { label: type, icon: null };
  }

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-1">Extrato</h1>
      <p className="text-sm text-muted mb-6">Suas movimentações</p>

      {rows.length === 0 ? (
        <p className="text-muted py-8 text-center">
          Nenhuma movimentação registrada ainda.
        </p>
      ) : (
        <div className="bg-surface border border-line rounded-2xl overflow-hidden">
          {rows.map((row, index) => {
            const info = typeInfo(row.type);
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center justify-between p-4 border-b border-line last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {/* Ícone do tipo dentro de um círculo. */}
                  <div className="w-9 h-9 rounded-full bg-surface2 flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{info.label}</p>
                    <p className="text-xs text-muted">{row.description}</p>
                    <p className="text-[10px] text-muted/80 font-mono">
                      {formatDate(row.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p
                    className={`font-mono font-bold ${row.value >= 0 ? "text-win" : "text-loss"}`}
                  >
                    {row.value >= 0 ? "+" : "-"}
                    {formatMoney(Math.abs(row.value))}
                  </p>
                  <p className="text-xs text-muted font-mono">
                    Saldo: {formatMoney(row.runningBalance)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Statement;
