import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { saints, formatFeast } from '../../data/saints';
import { GLASS, MONTHS, completeMonths, saintsOf } from '../../data/saintMonths';
import { SaintInitial } from '../SaintsDirectory';
import { journey, useJourney } from '../../utils/journeyStore';
import GameIntro from '../GameIntro';

const monthName = (m) => new Date(2026, Number(m) - 1, 1).toLocaleDateString('pt-BR', { month: 'long' });
const thisMonth = String(new Date().getMonth() + 1).padStart(2, '0');

/** A rosácea: uma pétala de vitral para cada mês; acende quando todos os santos do mês foram guardados. */
function RoseWindow({ complete, onOpen }) {
  const petals = MONTHS.map((m, i) => {
    const a0 = ((i - 3) / 12) * Math.PI * 2;
    const a1 = ((i - 2) / 12) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const p = (r, a) => `${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`;
    const d = `M${p(30, a0)} L${p(86, a0)} A86 86 0 0 1 ${p(86, a1)} L${p(30, a1)} A30 30 0 0 0 ${p(30, a0)}z`;
    const lit = complete.includes(m);
    return (
      <g
        key={m}
        className={`rose-petal ${lit ? 'is-lit' : ''} ${m === thisMonth ? 'is-now' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={`${monthName(m)}: ${lit ? 'vitral aceso' : 'vitral apagado'}`}
        onClick={() => onOpen(m)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(m)}
        style={{ '--glass': GLASS[i] }}
      >
        <path d={d} />
        <circle cx={100 + 58 * Math.cos(am)} cy={100 + 58 * Math.sin(am)} r="9" className="rose-jewel" />
        <text x={100 + 58 * Math.cos(am)} y={100 + 58 * Math.sin(am) + 3.5} className="rose-label">
          {i + 1}
        </text>
      </g>
    );
  });

  return (
    <figure className="rose-window">
      <svg viewBox="0 0 200 200" aria-label={`Rosácea: ${complete.length} de 12 vitrais acesos`}>
        <circle cx="100" cy="100" r="94" className="rose-frame" />
        {petals}
        <circle cx="100" cy="100" r="30" className="rose-center" />
        <path d="M100 82v36M88 94h24" className="rose-cross" />
      </svg>
      <figcaption>
        {complete.length} de 12 vitrais acesos. Toque num mês para ver os santos dele.
      </figcaption>
    </figure>
  );
}

/** Uma carta do mês: retrato (ou sombra) na frente, festa e padroeiro no verso. */
function SaintCard({ saint, collected }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <li className={`collection-card ${collected ? 'is-collected' : ''} ${flipped ? 'is-flipped' : ''}`}>
      <button
        type="button"
        className="collection-card-inner"
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
        aria-label={`${saint.name}${collected ? ', guardado' : ''}. Virar a carta`}
      >
        <span className="collection-face is-front">
          <SaintInitial saint={saint} />
          <strong>{collected ? saint.name : '???'}</strong>
          <small>{formatFeast(saint.feast)}</small>
        </span>
        <span className="collection-face is-back">
          <strong>{saint.name}</strong>
          <small>Festa: {formatFeast(saint.feast)}</small>
          <small>Padroeiro: {saint.patronOf.slice(0, 2).join(', ')}</small>
        </span>
      </button>
      <Link to={`/home/santos/${saint.slug}`} className="collection-card-link">
        {collected ? 'Reler' : 'Conhecer e guardar'}
      </Link>
    </li>
  );
}

/** Janela de um mês: as cartas dos santos que a Igreja celebra nele. */
function MonthSheet({ month, collected, onClose }) {
  const dialogRef = useRef(null);
  const list = saintsOf(month);
  const done = list.filter((s) => collected.includes(s.slug)).length;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const onClick = (e) => e.target === dialog && dialog.close();
    dialog?.addEventListener('click', onClick);
    dialog?.addEventListener('close', onClose);
    return () => {
      dialog?.removeEventListener('click', onClick);
      dialog?.removeEventListener('close', onClose);
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className="filter-sheet month-sheet" aria-labelledby="month-title">
      <header className="filter-sheet-head">
        <div>
          <span className="novena-day-number">
            {done} de {list.length} guardados
          </span>
          <h2 id="month-title">Santos de {monthName(month)}</h2>
        </div>
        <button type="button" className="filter-sheet-close" onClick={() => dialogRef.current?.close()} aria-label="Fechar">
          <X size={20} />
        </button>
      </header>
      <div className="filter-sheet-body">
        <p className="month-sheet-hint">
          Leia a história de cada santo e toque em “Guardar na coleção” na página dele. Com todos guardados, o vitral de{' '}
          {monthName(month)} acende na rosácea.
        </p>
        <ul className="collection-grid card-list">
          {list.map((s) => (
            <SaintCard key={s.slug} saint={s} collected={collected.includes(s.slug)} />
          ))}
        </ul>
      </div>
    </dialog>
  );
}

/** Revelação: um vitral acabou de acender. */
function GlassReveal({ month, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, [onClose]);
  const i = Number(month) - 1;
  return (
    <dialog ref={dialogRef} className="reward-reveal" style={{ '--trail': GLASS[i] }} aria-labelledby="glass-title">
      <div className="reward-rays" aria-hidden="true" />
      <span className="eyebrow">Vitral aceso</span>
      <h2 id="glass-title">Os santos de {monthName(month)}</h2>
      <p>Você guardou todos os santos que a Igreja celebra em {monthName(month)}. Uma parte da rosácea agora brilha.</p>
      <div className="glass-piece" style={{ '--glass': GLASS[i] }} aria-hidden="true" />
      <button type="button" className="btn" onClick={() => dialogRef.current?.close()}>
        Ver a rosácea
      </button>
    </dialog>
  );
}

/**
 * Santos do ano: cada mês é um cartão com os santos celebrados nele. Guardar todos os santos de um mês acende
 * o vitral daquele mês na rosácea, uma recompensa diferente da das ilhas.
 */
export default function SaintCollection() {
  const state = useJourney();
  const collected = state.saints;
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  const complete = completeMonths(collected);
  const reveal = complete.find((m) => !state.rewardsSeen.includes(`vitral:${m}`));
  const closeReveal = useCallback(() => reveal && journey.markRewardSeen(`vitral:${reveal}`), [reveal]);
  // O mês atual vem primeiro; depois os seguintes, dando a volta no ano.
  const ordered = [...MONTHS.slice(Number(thisMonth) - 1), ...MONTHS.slice(0, Number(thisMonth) - 1)];

  return (
    <section className="journey-card" aria-labelledby="collection-title">
      <header className="journey-card-head">
        <h2 id="collection-title">Santos do ano</h2>
        <p>
          Seu álbum tem <strong>{collected.length}</strong> de {saints.length} santos e{' '}
          <strong>{complete.length}</strong> de 12 vitrais acesos.
        </p>
      </header>

      <GameIntro
        id="colecao"
        steps={[
          'Cada mês é um cartão com os santos que a Igreja celebra nele. O mês atual vem primeiro.',
          'Abra um mês, leia a história de cada santo e toque em "Guardar na coleção" na página dele.',
          'Guardou todos os santos de um mês? O vitral daquele mês acende na rosácea, a janela redonda das catedrais.',
        ]}
      />

      <RoseWindow complete={complete} onOpen={setOpen} />

      <ul className="month-cards card-list">
        {ordered.map((m) => {
          const list = saintsOf(m);
          const done = list.filter((s) => collected.includes(s.slug)).length;
          const lit = complete.includes(m);
          return (
            <li key={m}>
              <button
                type="button"
                className={`month-card ${lit ? 'is-lit' : ''} ${m === thisMonth ? 'is-now' : ''}`}
                style={{ '--glass': GLASS[Number(m) - 1] }}
                onClick={() => setOpen(m)}
              >
                <span className="month-card-head">
                  <small>{m === thisMonth ? 'Neste mês' : 'Festas de'}</small>
                  <strong>{monthName(m)}</strong>
                </span>
                <span className="month-card-faces" aria-hidden="true">
                  {list.slice(0, 4).map((s) => (
                    <span key={s.slug} className={collected.includes(s.slug) ? 'is-collected' : ''}>
                      <SaintInitial saint={s} />
                    </span>
                  ))}
                  {list.length > 4 && <span className="month-card-more">+{list.length - 4}</span>}
                </span>
                <span className="novena-beads is-sm" aria-hidden="true">
                  {list.map((s) => (
                    <span key={s.slug} className={`novena-bead ${collected.includes(s.slug) ? 'is-done' : ''}`} />
                  ))}
                </span>
                <small className="month-card-status">
                  {lit ? 'Vitral aceso' : `${done} de ${list.length} ${list.length === 1 ? 'santo' : 'santos'}`}
                </small>
              </button>
            </li>
          );
        })}
      </ul>

      {open && <MonthSheet month={open} collected={collected} onClose={close} />}
      {reveal && !open && <GlassReveal month={reveal} onClose={closeReveal} />}
    </section>
  );
}
