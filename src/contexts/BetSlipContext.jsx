// Context do "cupom" de apostas (bet slip), no estilo dos sites de bet.
// Guarda as seleções que o usuário foi clicando nas odds, antes de confirmar.
// Regra: uma seleção por evento (clicar em outro palpite do mesmo jogo troca).
import { createContext, useContext, useState, useCallback } from "react";

const BetSlipContext = createContext();

export function BetSlipProvider({ children }) {
  // Cada seleção: { key, eventId, pick, odd, teamA, teamB, pickLabel, sport }.
  const [selections, setSelections] = useState([]);

  // Adiciona/remove uma seleção (toggle). Como só vale 1 por evento,
  // clicar num palpite diferente do mesmo jogo substitui o anterior.
  const toggleSelection = useCallback((sel) => {
    setSelections((prev) => {
      const same = prev.find((s) => s.key === sel.key);
      if (same) return prev.filter((s) => s.key !== sel.key);
      const semMesmoEvento = prev.filter((s) => s.eventId !== sel.eventId);
      return [...semMesmoEvento, sel];
    });
  }, []);

  const removeSelection = useCallback((key) => {
    setSelections((prev) => prev.filter((s) => s.key !== key));
  }, []);

  const clearSlip = useCallback(() => setSelections([]), []);

  // Diz se um palpite específico está no cupom (para destacar o botão de odd).
  const isSelected = useCallback(
    (eventId, pick) =>
      selections.some((s) => s.eventId === eventId && s.pick === pick),
    [selections],
  );

  return (
    <BetSlipContext.Provider
      value={{
        selections,
        toggleSelection,
        removeSelection,
        clearSlip,
        isSelected,
      }}
    >
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  return useContext(BetSlipContext);
}
