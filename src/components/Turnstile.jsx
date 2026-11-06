import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from '../utils/turnstile';

/**
 * Widget do Cloudflare Turnstile (verificação anti-robô sem quebra-cabeça).
 * No modo "interaction-only" ele só aparece quando a Cloudflare desconfia do acesso; na maioria das
 * vezes a pessoa nem vê. Sem VITE_TURNSTILE_SITE_KEY o componente não renderiza nada e o envio segue
 * sem token (a API também deixa passar enquanto não tiver a chave secreta).
 */
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise = null;

function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Turnstile não carregou'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

const currentTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

const Turnstile = forwardRef(function Turnstile({ onToken, action }, ref) {
  const boxRef = useRef(null);
  const widgetRef = useRef(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  // Cada token vale para um envio só: depois de enviar, o formulário pede um novo.
  useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current(null);
      if (widgetRef.current != null) window.turnstile?.reset(widgetRef.current);
    },
  }));

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined;
    let alive = true;
    loadScript()
      .then((turnstile) => {
        if (!alive || !boxRef.current) return;
        widgetRef.current = turnstile.render(boxRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action,
          theme: currentTheme(),
          language: 'pt-br',
          appearance: 'interaction-only',
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));
    return () => {
      alive = false;
      if (widgetRef.current != null) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [action]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={boxRef} className="turnstile-box" />;
});

export default Turnstile;
