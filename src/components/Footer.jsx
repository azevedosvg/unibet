// Rodapé global do app. Colunas de links são apenas visuais (mockadas):
// ao clicar, disparam o aviso de "funcionalidade em desenvolvimento".
// Traz também os créditos do trabalho acadêmico.
import { useToast } from "../contexts/ToastContext";
import Logo from "./ui/Logo";

// Ícones de redes sociais como SVG inline (o lucide-react não traz logos de marca).
// Usam currentColor para herdar a cor do botão (e o dourado no hover).
function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.6l-5.17-6.76L4.8 22H1.54l8.02-9.17L1.5 2h6.77l4.67 6.18L18.244 2Z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H8v-2.88h2.5V9.8c0-2.46 1.46-3.82 3.7-3.82 1.07 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54v1.85H16l-.44 2.88h-2.06v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-3.5-.44-5.17a2.78 2.78 0 0 0-1.95-1.96C18.88 4.43 12 4.43 12 4.43s-6.88 0-8.6.44A2.78 2.78 0 0 0 1.44 6.83C1 8.5 1 12 1 12s0 3.5.44 5.17a2.78 2.78 0 0 0 1.96 1.96c1.72.44 8.6.44 8.6.44s6.88 0 8.6-.44a2.78 2.78 0 0 0 1.95-1.96C23 15.5 23 12 23 12Zm-13 3.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

// Colunas de links do rodapé (todos mockados).
const columns = [
  {
    title: "Esportes",
    links: ["Futebol", "Basquete", "Tênis", "eSports", "MMA"],
  },
  {
    title: "Plataforma",
    links: ["Como funciona", "Bônus", "Ranking", "Promoções"],
  },
  {
    title: "Suporte",
    links: ["Central de ajuda", "Fale conosco (SAC)", "Jogo responsável", "FAQ"],
  },
  {
    title: "Legal",
    links: ["Termos de uso", "Privacidade", "Cookies", "Regulamento"],
  },
];

const socials = [InstagramIcon, XIcon, FacebookIcon, YoutubeIcon];

function Footer() {
  const { mockFeature } = useToast();

  return (
    <footer className="border-t border-line bg-surface/40 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Topo: marca + colunas de links. */}
        <div className="grid gap-8 md:grid-cols-5">
          {/* Bloco da marca. */}
          <div className="md:col-span-1">
            <Logo size={28} />
            <p className="text-xs text-muted mt-3 leading-relaxed">
              A bolsa de palpites. Odds que nascem do volume de apostas.
            </p>
            {/* Redes sociais (mockadas). */}
            <div className="flex gap-2 mt-4">
              {socials.map((Icon, i) => (
                <button
                  key={i}
                  onClick={mockFeature}
                  className="w-8 h-8 rounded-lg bg-surface2 border border-line
                             flex items-center justify-center text-muted
                             hover:text-gold hover:border-gold/40 transition-colors"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Colunas de links. */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={mockFeature}
                      className="text-sm text-muted hover:text-gold transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Linha divisória. */}
        <div className="h-px bg-line my-7" />

        {/* Aviso fictício + créditos do trabalho. */}
        <div className="flex flex-col gap-3 text-xs text-muted/70">
          <p>
            +18 · Plataforma fictícia, sem dinheiro real, criada para fins
            exclusivamente acadêmicos.
          </p>
          <p className="text-muted">
            Desenvolvido por{" "}
            <span className="text-ink font-medium">
              Gabriel de Azevedo Silva
            </span>{" "}
            e{" "}
            <span className="text-ink font-medium">
              Paulo Victor Rodrigues Moraes
            </span>
            . Disciplina: Desenvolvimento Web Front-End · Professor: Christien
            Lana Rachid.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
