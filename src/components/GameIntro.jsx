import { useState } from 'react';
import { CircleHelp, X } from 'lucide-react';
import { journey, useJourney } from '../utils/journeyStore';

/**
 * "Como funciona": a explicação de um jogo. Aparece aberta na primeira visita; depois fica guardada
 * atrás do botão "?" e pode ser aberta de novo quando a pessoa quiser.
 *
 * steps: lista de frases curtas, na ordem em que a pessoa joga.
 */
export default function GameIntro({ id, title = 'Como funciona', steps, note }) {
  const { seenIntros } = useJourney();
  const firstTime = !seenIntros.includes(id);
  const [open, setOpen] = useState(firstTime);

  const close = () => {
    setOpen(false);
    journey.markIntroSeen(id);
  };

  if (!open) {
    return (
      <button type="button" className="game-intro-toggle" onClick={() => setOpen(true)}>
        <CircleHelp size={16} aria-hidden="true" /> {title}
      </button>
    );
  }

  return (
    <section className="game-intro" aria-label={title}>
      <header>
        <strong>
          <CircleHelp size={18} aria-hidden="true" /> {title}
        </strong>
        <button type="button" className="filter-sheet-close" onClick={close} aria-label="Fechar explicação">
          <X size={18} />
        </button>
      </header>
      <ol>
        {steps.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ol>
      {note && <p className="game-intro-note">{note}</p>}
      <button type="button" className="btn game-intro-ok" onClick={close}>
        Entendi, vamos lá
      </button>
    </section>
  );
}
