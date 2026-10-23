import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bug, CheckCircle2, Lightbulb, Loader2, MessageCircle, MessageSquareHeart, Send, Sparkles, X } from 'lucide-react';
import { DoveIcon } from './anim/AnimatedIcons';

const FORMSPREE_URL = 'https://formspree.io/f/mqapqejd';
const MAX_LENGTH = 2000;
const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]):not([tabindex="-1"])';

// Tipos de mensagem: cada um muda a dica e o exemplo do campo de texto.
const TYPES = [
  {
    id: 'bug',
    label: 'Reportar um erro',
    Icon: Bug,
    hint: 'Conte o que aconteceu, o que você esperava que acontecesse e, se lembrar, o passo a passo para o erro aparecer.',
    placeholder: 'Ex.: Na página de Leituras, ao tocar em "Salmo", o texto não aparece no celular.',
  },
  {
    id: 'melhoria',
    label: 'Sugerir melhoria',
    Icon: Lightbulb,
    hint: 'Algo que já existe e poderia ficar mais claro, bonito ou fácil de usar.',
    placeholder: 'Ex.: Seria bom aumentar a letra das orações no modo escuro.',
  },
  {
    id: 'funcionalidade',
    label: 'Nova funcionalidade',
    Icon: Sparkles,
    hint: 'Uma ideia de algo novo que ajudaria na sua vida de oração.',
    placeholder: 'Ex.: Um lembrete diário para rezar o terço no horário que eu escolher.',
  },
  {
    id: 'outro',
    label: 'Outro assunto',
    Icon: MessageSquareHeart,
    hint: 'Elogios, dúvidas, pedidos de conteúdo ou qualquer outra mensagem.',
    placeholder: 'Escreva sua mensagem...',
  },
];

export default function Feedback() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const triggerRef = useRef(null);
  const boxRef = useRef(null);
  const textareaRef = useRef(null);

  const current = TYPES.find((t) => t.id === type);

  const close = () => setOpen(false);

  // Depois de um envio, a próxima abertura começa com o formulário limpo.
  const openModal = () => {
    if (status === 'sent') {
      setStatus('idle');
      setMessage('');
      setEmail('');
    }
    setOpen(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;
    setStatus('sending');

    const data = new FormData(e.currentTarget);
    try {
      // Envio sem sair do site: o Formspree responde em JSON quando recebe Accept: application/json.
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('sent');
    } catch (err) {
      console.error('Falha ao enviar feedback:', err);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <div className="feedback">
        <button ref={triggerRef} className="btn" onClick={openModal} aria-haspopup="dialog">
          <MessageCircle size={16} />
          <span>Feedback</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="feedback-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            aria-describedby="feedback-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              className="feedback-modal"
              ref={boxRef}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            >
              <button className="feedback-close" onClick={close} aria-label="Fechar">
                <X size={20} />
              </button>

              {status === 'sent' ? (
                <div className="feedback-success" role="status">
                  <span className="feedback-success-dove">
                    <CheckCircle2 size={44} className="feedback-success-icon" />
                    <DoveIcon fly size={30} />
                  </span>
                  <h2 id="feedback-title" className="feedback-title">Mensagem enviada!</h2>
                  <p id="feedback-description" className="feedback-subtitle">
                    Obrigado por ajudar a melhorar o Oratio. Toda mensagem é lida com carinho
                    {email ? ' e, se for preciso, respondemos no e-mail que você informou.' : '.'}
                  </p>
                  <button className="btn" onClick={close}>
                    Fechar
                  </button>
                </div>
              ) : (
                <>
                  <header className="feedback-header">
                    <span className="feedback-header-icon" aria-hidden="true">
                      <MessageSquareHeart size={22} />
                    </span>
                    <div>
                      <h2 id="feedback-title" className="feedback-title">Fale com a gente</h2>
                      <p id="feedback-description" className="feedback-subtitle">
                        Encontrou um erro, tem uma ideia ou quer sugerir uma novidade? Toda mensagem é lida.
                      </p>
                    </div>
                  </header>

                  <form onSubmit={handleSubmit}>
                    <fieldset className="feedback-types">
                      <legend className="feedback-label">Sobre o que é a sua mensagem?</legend>
                      <div className="feedback-types-grid">
                        {TYPES.map(({ id, label, Icon }) => (
                          <label key={id} className={`feedback-type ${type === id ? 'is-active' : ''}`}>
                            <input
                              type="radio"
                              name="tipo"
                              value={label}
                              checked={type === id}
                              onChange={() => setType(id)}
                            />
                            <Icon size={18} aria-hidden="true" />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label htmlFor="feedback-message" className="feedback-label">
                      Sua mensagem
                    </label>
                    <p className="feedback-hint" id="feedback-hint">
                      {current.hint}
                    </p>
                    <textarea
                      id="feedback-message"
                      ref={textareaRef}
                      name="message"
                      required
                      maxLength={MAX_LENGTH}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={current.placeholder}
                      aria-describedby="feedback-hint feedback-counter"
                    />
                    <p className="feedback-counter" id="feedback-counter" aria-live="polite">
                      {message.length}/{MAX_LENGTH}
                    </p>

                    <label htmlFor="feedback-email" className="feedback-label">
                      Seu e-mail <span className="feedback-optional">(opcional, só se quiser resposta)</span>
                    </label>
                    <input
                      id="feedback-email"
                      className="feedback-input"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@exemplo.com"
                    />

                    {/* Ajuda a localizar erros: só o endereço da página, sem dados pessoais. */}
                    <input type="hidden" name="pagina" value={location.pathname + location.search} />
                    {/* Honeypot: campo invisível que só robôs preenchem; o Formspree descarta esses envios. */}
                    <input type="text" name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                    {status === 'error' && (
                      <p className="feedback-error" role="alert">
                        Não foi possível enviar agora. Verifique sua conexão e tente de novo.
                      </p>
                    )}

                    <p className="feedback-privacy-note">
                      Junto com a mensagem, enviamos o endereço da página em que você está, para facilitar a
                      correção de erros. Não inclua dados pessoais sensíveis. Ao enviar, você concorda com a nossa{' '}
                      <Link to="/privacidade" onClick={close}>
                        Política de Privacidade
                      </Link>
                      .
                    </p>

                    <div className="feedback-actions">
                      <button type="button" className="btn-block-action" onClick={close}>
                        Cancelar
                      </button>
                      <button className="btn" type="submit" disabled={!message.trim() || status === 'sending'}>
                        {status === 'sending' ? (
                          <>
                            <Loader2 size={16} className="feedback-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Enviar mensagem
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
