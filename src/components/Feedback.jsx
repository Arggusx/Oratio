import { MessageCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]):not([tabindex="-1"])';

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const boxRef = useRef(null);
  const textareaRef = useRef(null);

  // Ao abrir: foco no campo, Esc fecha e o Tab fica preso dentro do modal.
  // Ao fechar: o foco volta para o botão que abriu.
  useEffect(() => {
    if (!open) return undefined;
    const trigger = triggerRef.current;
    textareaRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !boxRef.current) return;
      const items = [...boxRef.current.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <div className="feedback">
        <button ref={triggerRef} className="btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
          <MessageCircle size={16} />
          <span>Feedback</span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          aria-describedby="feedback-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="modal-box" ref={boxRef}>
            <div className="modal-header">
              <div>
                <h2 id="feedback-title" className="section-title" style={{ fontSize: '1.6rem', margin: 0 }}>
                  Sua voz importa
                </h2>
                <p id="feedback-description" className="lead" style={{ marginTop: '0.4rem' }}>
                  Conte-nos como tornar este momento de oração ainda melhor.
                </p>
              </div>
              <button className="menu-toggle" onClick={() => setOpen(false)} aria-label="Fechar">
                <X size={22} />
              </button>
            </div>

            <form action="https://formspree.io/f/mqapqejd" method="POST">
              <label htmlFor="feedback-message" className="sr-only">
                Sua sugestão
              </label>
              <textarea
                id="feedback-message"
                ref={textareaRef}
                name="message"
                required
                placeholder="Escreva sua sugestão..."
              />
              {/* Honeypot: campo invisível que só robôs preenchem; o Formspree descarta esses envios. */}
              <input type="text" name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <p className="feedback-privacy-note">
                Não inclua dados pessoais sensíveis. Ao enviar, você concorda com a nossa{' '}
                <Link to="/privacidade" onClick={() => setOpen(false)}>
                  Política de Privacidade
                </Link>
                .
              </p>
              <div className="modal-actions">
                <button className="btn" type="submit">
                  Enviar mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
