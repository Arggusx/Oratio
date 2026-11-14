import { useEffect, useRef, useState } from 'react';
import { Check, Link2, MessageCircle, Share2 } from 'lucide-react';
import './ShareButton.css';

const SITE_URL = 'https://www.oratiodaily.com';

/**
 * Botão de compartilhar. No celular abre o compartilhamento do próprio aparelho (WhatsApp, Telegram...);
 * onde isso não existe, mostra um menu pequeno com WhatsApp e "copiar link".
 * Sem `path`, compartilha a página atual; com `path="/"`, o site.
 */
export default function ShareButton({ title, text, path, label = 'Compartilhar', variant = 'ghost' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const boxRef = useRef(null);

  const url = `${SITE_URL}${path ?? window.location.pathname}`;
  const message = text ? `${text} ${url}` : url;

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // a pessoa fechou a janela de compartilhar
      }
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Navegadores antigos: seleciona um campo temporário e copia.
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`share ${open ? 'is-open' : ''}`} ref={boxRef}>
      <button type="button" className={`share-btn share-btn-${variant}`} onClick={share} aria-expanded={open} aria-haspopup="true">
        <Share2 size={16} aria-hidden="true" />
        <span>{label}</span>
      </button>
      {open && (
        <div className="share-menu" role="menu">
          <a
            role="menuitem"
            className="share-option"
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
          <button role="menuitem" type="button" className="share-option" onClick={copy}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
            {copied ? 'Link copiado' : 'Copiar link'}
          </button>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copiado' : ''}
      </span>
    </div>
  );
}
