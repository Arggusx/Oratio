import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { prayers } from '../../data/prayers';
import { getLiturgicalSeason } from '../../utils/liturgicalCalendar';

const TYPE_MS = 22;

/** Escolhe a oração conforme a hora do dia (e o Regina Caeli no lugar do Ângelus no Tempo Pascal). */
function prayerForNow(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 11) return { id: 'oracao-da-manha', moment: 'Manhã' };
  if (h >= 11 && h < 14) {
    return getLiturgicalSeason(date) === 'pascoa'
      ? { id: 'regina-caeli', moment: 'Meio-dia' }
      : { id: 'angelus', moment: 'Meio-dia' };
  }
  if (h >= 14 && h < 18) return { id: 'oracao-ao-espirito-santo', moment: 'Tarde' };
  if (h >= 18 && h < 22) return { id: 'oracao-da-noite', moment: 'Noite' };
  return { id: 'oracao-antes-de-dormir', moment: 'Antes de dormir' };
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * "Oração para agora": uma folha de papel em que a oração do momento do dia vai sendo
 * escrita por uma pena. Quem pede menos movimento vê o texto inteiro de uma vez.
 */
export default function PrayerNow() {
  const { prayer, moment } = useMemo(() => {
    const pick = prayerForNow();
    return { prayer: prayers.find((p) => p.id === pick.id), moment: pick.moment };
  }, []);
  const text = prayer?.text ?? '';
  const [chars, setChars] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (chars >= text.length) return undefined;
    const t = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
    return () => clearTimeout(t);
  }, [chars, text.length]);

  if (!prayer) return null;
  const writing = chars < text.length;

  return (
    <section className="prayer-now" aria-labelledby="prayer-now-title">
      <header className="prayer-now-head">
        <span className="eyebrow">Oração para agora · {moment}</span>
        <h2 id="prayer-now-title" className="prayer-now-title">
          {prayer.title}
        </h2>
      </header>

      <div className="prayer-paper">
        {/* o texto completo fica disponível para leitores de tela desde o início */}
        <p className="sr-only">{text}</p>
        <p className="prayer-paper-text" aria-hidden="true">
          {text.slice(0, chars)}
          {writing && (
            <span className="prayer-quill">
              <svg viewBox="0 0 40 40" width="30" height="30" focusable="false">
                <path className="prayer-quill-feather" d="M6 34C10 22 20 8 36 3c-3 12-12 24-26 28z" />
                <path className="prayer-quill-rib" d="M6 34L30 9" />
                <path className="prayer-quill-tip" d="M4 37l3-4" />
              </svg>
            </span>
          )}
        </p>
      </div>

      <div className="prayer-now-actions">
        <button type="button" className="fx-small-btn" onClick={() => setChars(0)} disabled={writing}>
          <RotateCcw size={15} aria-hidden="true" />
          Escrever de novo
        </button>
        <Link to="/home/oracoes?secao=oracoes" className="prayer-now-link">
          Ver todas as orações
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
