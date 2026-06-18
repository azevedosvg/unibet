// Botões de login social (Google, Facebook, Apple).
// São apenas VISUAIS (mockados): ao clicar, disparam o aviso padrão de
// "funcionalidade em desenvolvimento". Existem para dar cara de site real.
// Os ícones são SVGs inline (o lucide-react não traz logos de marca).

// Logo "G" colorido oficial do Google.
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.6 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.6 5.6C41.4 35.8 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

// Logo "f" do Facebook.
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"
      />
    </svg>
  );
}

// Logo da Apple.
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#F5F0E8"
        d="M16.4 12.7c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.4 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.5 2 1-.1 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.7-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-3.1zM14.3 6.2c.6-.7 1-1.6.9-2.6-.8 0-1.8.6-2.4 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.4-1.2z"
      />
    </svg>
  );
}

// Lista dos provedores para gerar os botões dinamicamente.
const providers = [
  { name: "Google", icon: <GoogleIcon /> },
  { name: "Facebook", icon: <FacebookIcon /> },
  { name: "Apple", icon: <AppleIcon /> },
];

// onClick: ação ao clicar (no nosso caso, o aviso de funcionalidade mockada).
function SocialButtons({ onClick }) {
  return (
    <div className="flex flex-col gap-2.5">
      {providers.map((p) => (
        <button
          key={p.name}
          type="button"
          onClick={onClick}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl
                     bg-surface2 border border-line text-sm text-ink
                     hover:border-gold/40 transition-colors"
        >
          {p.icon}
          Entrar com {p.name}
        </button>
      ))}
    </div>
  );
}

export default SocialButtons;
