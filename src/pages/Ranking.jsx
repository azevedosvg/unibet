import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { getAllUsers } from "../services/userService";
import { getAllBets } from "../services/betService";
import { formatMoney } from "../utils/format";

function Ranking() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function buildRanking() {
      const [users, bets] = await Promise.all([getAllUsers(), getAllBets()]);
      const players = users.filter((u) => u.role === "user");
      const withProfit = players.map((player) => {
        const playerBets = bets.filter((b) => b.userId === player.id);
        const won = playerBets
          .filter((b) => b.status === "won")
          .reduce((sum, b) => sum + b.payout, 0);
        const settledBet = playerBets
          .filter((b) => b.status === "won" || b.status === "lost")
          .reduce((sum, b) => sum + b.amount, 0);
        return {
          id: player.id,
          name: player.name,
          balance: player.balance,
          profit: won - settledBet,
        };
      });
      withProfit.sort((a, b) => b.profit - a.profit);
      setRanking(withProfit);
    }
    buildRanking();
  }, []);

  // Cor da medalha conforme a posição (ouro, prata, bronze).
  function medalColor(index) {
    if (index === 0) return "text-gold";
    if (index === 1) return "text-muted";
    if (index === 2) return "text-gold-dark";
    return "text-line";
  }

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-gold" size={28} />
        <h1 className="text-2xl font-bold">Ranking</h1>
      </div>

      {ranking.length === 0 ? (
        <p className="text-muted py-8 text-center">
          Nenhum jogador para exibir.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {ranking.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border
                ${
                  index === 0
                    ? "bg-gold/5 border-gold/40"
                    : "bg-surface border-line"
                }`}
            >
              {/* Posição com medalha para o top 3. */}
              <div className="flex items-center justify-center w-10">
                {index < 3 ? (
                  <Medal className={medalColor(index)} size={24} />
                ) : (
                  <span className="text-muted font-mono font-bold">
                    {index + 1}º
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{player.name}</p>
                <p className="text-xs text-muted">
                  Saldo: {formatMoney(player.balance)}
                </p>
              </div>

              <span
                className={`font-mono font-bold text-right ${player.profit >= 0 ? "text-win" : "text-loss"}`}
              >
                {player.profit >= 0 ? "+" : "-"}
                {formatMoney(Math.abs(player.profit))}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ranking;
