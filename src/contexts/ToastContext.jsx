// Context de notificações (toast) global.
// Centraliza as mensagens flutuantes do app: sucesso de uma aposta, avisos e,
// principalmente, o aviso padrão das funcionalidades apenas visuais (mockadas).
import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

// 1: Cria o canal do context.
const ToastContext = createContext();

// 2: Provider que guarda a lista de toasts e renderiza a pilha na tela.
export function ToastProvider({ children }) {
  // Cada toast é { id, message, tone }. tone controla a cor (info/success/error).
  const [toasts, setToasts] = useState([]);

  // Mostra um toast novo e agenda a remoção automática depois de 3s.
  const showToast = useCallback((message, tone = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Atalho para as funcionalidades mockadas (apenas visuais, sem lógica real).
  const mockFeature = useCallback(
    () => showToast("Funcionalidade visual — em desenvolvimento 🚧", "info"),
    [showToast],
  );

  // Cor da barra lateral do toast conforme o tom.
  function toneColor(tone) {
    if (tone === "success") return "border-l-win";
    if (tone === "error") return "border-l-loss";
    return "border-l-gold";
  }

  return (
    <ToastContext.Provider value={{ showToast, mockFeature }}>
      {children}

      {/* Pilha de toasts: fixa na base no mobile, canto inferior em telas maiores. */}
      <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`flex items-center gap-2.5 w-full max-w-sm
                bg-surface2 border border-line border-l-4 ${toneColor(toast.tone)}
                rounded-xl px-4 py-3 shadow-lg shadow-black/40`}
            >
              <Info size={18} className="text-gold shrink-0" />
              <p className="text-sm text-ink">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// 3: Hook de atalho para os componentes dispararem toasts.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext);
}
