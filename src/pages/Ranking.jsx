// Classificação dos jogadores por lucro acumulado.
// Calcula o lucro de cada jogador a partir das apostas liquidadas
// e ordena do melhor para o pior. Cumpre o requisito de "ranking fictício".

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../services/userService";
import { getAllBets } from "../services/betService";

function Ranking() {
  const navigate = useNavigate();

  // Lista final já processada: jogadores com seus lucros, ordenados.
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function buildRanking() {
      // Busca usuários e apostas em paralelo.
      const [users, bets] = await Promise.all([getAllUsers(), getAllBets()]);

      // Considera apenas jogadores (exclui o admin).
      const players = users.filter((u) => u.role === "user");

      // Para cada jogador, calcula o lucro a partir das apostas dele.
      const withProfit = players.map((player) => {
        // Apostas deste jogador.
        const playerBets = bets.filter((b) => b.userId === player.id);

        // Total ganho em prêmios (apostas vencedoras).
        const won = playerBets
          .filter((b) => b.status === "won")
          .reduce((sum, b) => sum + b.payout, 0);

        // Total apostado em apostas já liquidadas (ganhas ou perdidas).
        const settledBet = playerBets
          .filter((b) => b.status === "won" || b.status === "lost")
          .reduce((sum, b) => sum + b.amount, 0);

        // Lucro = prêmios - apostado (nas já resolvidas).
        const profit = won - settledBet;

        // Devolve um objeto novo com os dados do jogador + o lucro calculado.
        return {
          id: player.id,
          name: player.name,
          balance: player.balance,
          profit,
        };
      });

      // Ordena do maior lucro para o menor.
      // sort com (a, b) => b.profit - a.profit ordena decrescente:
      // se o resultado é positivo, b vem antes de a.
      withProfit.sort((a, b) => b.profit - a.profit);

      setRanking(withProfit);
    }

    buildRanking();
  }, []);

  return (
    <div>
      <header>
        <h1>Ranking de jogadores</h1>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </header>

      <section>
        {ranking.length === 0 ? (
          <p>Nenhum jogador para exibir.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Saldo</th>
                <th>Lucro / Prejuízo</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((player, index) => (
                <tr key={player.id}>
                  {/* index começa em 0, então +1 para a posição começar em 1. */}
                  <td>{index + 1}º</td>
                  <td>{player.name}</td>
                  <td>U$ {player.balance}</td>
                  <td
                    className={
                      player.profit >= 0 ? "profit-positive" : "profit-negative"
                    }
                  >
                    {player.profit >= 0 ? "+" : ""}U$ {player.profit.toFixed(2)}
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

export default Ranking;
