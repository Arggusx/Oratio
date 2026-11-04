import { trails } from '../../data/trails';
import { prayerWeeks } from '../../utils/journeyStore';
import { GLASS, MONTHS } from '../../data/saintMonths';

/** Vela do caminho de oração: acesa (rezou), com estrela (graça), apagada ou ainda por vir. */
export function DiaryCandle({ status }) {
  return (
    <svg viewBox="0 0 20 32" className="diary-candle" aria-hidden="true" focusable="false">
      {status === 'prayed' && <ellipse className="diary-candle-halo" cx="10" cy="8" rx="9" ry="9" />}
      {status === 'prayed' && <path className="diary-candle-flame" d="M10 2c3 4 4 6 0 10-4-4-3-6 0-10z" />}
      {status === 'grace' && <path className="diary-candle-star" d="M10 3l1.6 3.4 3.6.4-2.7 2.4.8 3.6L10 11l-3.3 1.8.8-3.6-2.7-2.4 3.6-.4z" />}
      <path className="diary-candle-wick" d="M10 12v3" />
      <rect className="diary-candle-body" x="6" y="15" width="8" height="15" rx="1.5" />
    </svg>
  );
}

/** As sete velas desta semana, para o cartão do Caminho de oração. */
export function MiniCandles({ prayedDays }) {
  const [week] = prayerWeeks(prayedDays, 1);
  return (
    <span className="mini-candles" aria-hidden="true">
      {week.days.map((d) => (
        <span key={d.key} className={`diary-day is-${d.status} ${d.isToday ? 'is-today' : ''}`}>
          <DiaryCandle status={d.status} />
        </span>
      ))}
    </span>
  );
}

/** Contas de progresso (novena ou ilha), em tamanho pequeno. */
export function MiniBeads({ total, done, color }) {
  return (
    <span className="mini-beads" style={{ '--mission': color }} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`mission-bead ${i < done ? 'is-done' : ''} ${i === done ? 'is-now' : ''}`} />
      ))}
    </span>
  );
}

/** A rosácea em miniatura: as pétalas dos meses completos acesas. */
export function MiniRose({ complete }) {
  const p = (r, a) => `${50 + r * Math.cos(a)} ${50 + r * Math.sin(a)}`;
  return (
    <svg viewBox="0 0 100 100" className="mini-rose" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="47" className="mini-rose-frame" />
      {MONTHS.map((m, i) => {
        const a0 = ((i - 3) / 12) * Math.PI * 2 + 0.03;
        const a1 = ((i - 2) / 12) * Math.PI * 2 - 0.03;
        return (
          <path
            key={m}
            className={complete.includes(m) ? 'is-lit' : ''}
            style={{ '--glass': GLASS[i] }}
            d={`M${p(15, a0)} L${p(43, a0)} A43 43 0 0 1 ${p(43, a1)} L${p(15, a1)} A15 15 0 0 0 ${p(15, a0)}z`}
          />
        );
      })}
      <circle cx="50" cy="50" r="12" className="mini-rose-center" />
    </svg>
  );
}

/** Os carimbos do passaporte em miniatura: um círculo por ilha, colorido quando carimbado. */
export function MiniStamps({ done }) {
  return (
    <span className="mini-stamps" aria-hidden="true">
      {trails.map((t, i) => (
        <span
          key={t.id}
          className={done.includes(t.id) ? 'is-stamped' : ''}
          style={{ '--stamp': t.color, '--tilt': `${(i % 3) * 6 - 6}deg` }}
        />
      ))}
    </span>
  );
}
