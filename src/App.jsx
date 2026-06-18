import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BetSlip from "./components/BetSlip";

function App() {
  // Header, Footer e o cupom aparecem em todo o app, menos na tela de login
  // (que tem sua própria identidade visual de página cheia).
  const { pathname } = useLocation();
  const hideChrome = pathname === "/login";

  // Layout em coluna: header no topo, conteúdo flexível e footer embaixo.
  // O main carrega o padding lateral mobile-first (px-4 / sm:px-6).
  return (
    <div className="min-h-screen flex flex-col">
      {/* Camada de fundo fixa: foto de esporte escurecida + overlay + brilhos coloridos.
          Fica atrás de tudo (-z-10) e não rola com a página. */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-bg">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.28]"
          style={{ backgroundImage: "url(/img/bg-sport.jpg)" }}
        />
        {/* Overlay escuro (mais forte embaixo) para manter o texto legível. */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg/95" />
        {/* Brilhos coloridos da paleta. */}
        <div className="absolute -top-32 -left-24 w-[42rem] h-[32rem] rounded-full bg-gold/15 blur-[130px]" />
        <div className="absolute -top-10 right-0 w-[36rem] h-[30rem] rounded-full bg-live/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 w-[40rem] h-[30rem] rounded-full bg-loss/10 blur-[130px]" />
      </div>

      {!hideChrome && <Header />}
      <main className="flex-1 px-4 sm:px-6">
        <AppRoutes />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BetSlip />}
    </div>
  );
}

export default App;
