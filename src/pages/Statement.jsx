// Extrato de movimentações do jogador (FUNCIONALIDADE EXTRA).
// Mostra cada entrada/saída de saldo em ordem cronológica, com o saldo acumulado calculado linha a linha, como um extrato bancário.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTransactionsByUser } from "../services/betService";

function Statement() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lista de movimentações já com o saldo acumulado calculado.
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function loadStatement() {
      // Busca as movimentações do jogador em ordem cronológica.
      const transactions = await getTransactionsByUser(user.id);

      // Calcula o saldo acumulado linha a linha.
      // running guarda o saldo que vai se acumulando conforme percorremos.
      let running = 0;
      const withBalance = transactions.map((t) => {
        // Soma o valor da movimentação ao acumulado (valores já têm sinal:
        // apostas são negativas, prêmios e bônus são positivos).
        running = running + t.value;
        // Devolve a movimentação + o saldo acumulado naquele ponto.
        return { ...t, runningBalance: running };
      });

      setRows(withBalance);
    }

    loadStatement();
  }, [user.id]);

  // Traduz o tipo de movimentação (código interno) para texto em português.
  function getTypeLabel(type) {
    if (type === "bet") return "Aposta";
    if (type === "prize") return "Prêmio";
    if (type === "bonus") return "Bônus";
    return type;
  }

  // Formata a data ISO para um formato legível (dd/mm/aaaa hh:mm).
  function formatDate(isoDate) {
    const d = new Date(isoDate);
    // toLocaleString com "pt-BR" formata na convenção brasileira.
    return d.toLocaleString("pt-BR");
  }

  return (
    <div>
      <header>
        <h1>Extrato de movimentações</h1>
        <button onClick={() => navigate("/dashboard")}>Voltar</button>
      </header>

      <section>
        {rows.length === 0 ? (
          <p>Nenhuma movimentação registrada ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Saldo acumulado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.date)}</td>
                  <td>{getTypeLabel(row.type)}</td>
                  <td>{row.description}</td>
                  {/* Valor com cor conforme entrada (verde) ou saída (vermelho). */}
                  <td
                    className={
                      row.value >= 0 ? "profit-positive" : "profit-negative"
                    }
                  >
                    {row.value >= 0 ? "+" : ""}U$ {row.value.toFixed(2)}
                  </td>
                  <td>U$ {row.runningBalance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Statement;
