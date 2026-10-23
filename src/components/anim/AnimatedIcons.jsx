import { useEffect, useRef, useState } from 'react';

/** Ícone de copiar que, ao concluir, vira um "certo" desenhado. */
export function CopyCheckIcon({ done, size = 16 }) {
  return (
    <svg className={`fx-copycheck ${done ? 'is-done' : ''}`} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g className="fx-copycheck-copy">
        <rect x="8" y="8" width="11" height="12" rx="2" />
        <path d="M5 15V5a1 1 0 0 1 1-1h9" />
      </g>
      <path className="fx-copycheck-check" d="M5 12.5l4.5 4.5L19 7" pathLength="1" />
    </svg>
  );
}

/** Pombinha que levanta voo quando "fly" muda para verdadeiro (ex.: feedback enviado). */
export function DoveIcon({ fly, size = 22 }) {
  return (
    <svg className={`fx-dove-icon ${fly ? 'is-flying' : ''}`} viewBox="0 0 28 24" width={size} height={size} aria-hidden="true">
      <path d="M3 14c5-4 12-5 18-3 2 .6 3.5 0 4.5-1.5.8 1 .8 2.4 0 3.4-1.3 1.4-3.4 2-5.3 2-3.6 0-7 1-9.6 2.8l-3.6-.4 1.8-1.4C6 16 4 15.4 3 14z" />
      <path d="M14 12C12.6 7.4 10 4 5.6 2.6c1.8 3.4 2.6 6.8 4.6 10.2z" />
    </svg>
  );
}

/** Botão "Amém" ao fim de uma oração: o coração pulsa e pequenas cruzes sobem. */
export function AmenButton() {
  const [on, setOn] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const fire = () => {
    setOn(false);
    requestAnimationFrame(() => setOn(true));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), 1200);
  };

  return (
    <button type="button" className={`fx-amen ${on ? 'is-on' : ''}`} onClick={fire}>
      <span className="fx-amen-burst" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 10 10" width="10" height="10" style={{ '--i': i }}>
            <path d="M5 0.5v9M0.5 4h9" />
          </svg>
        ))}
      </span>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="fx-amen-heart">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
      Amém
    </button>
  );
}
