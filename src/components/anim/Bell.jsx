import { useEffect, useRef, useState } from 'react';

/** Sino que balança de tempos em tempos; ao ser clicado, badala e solta ondas de som. */
export default function Bell() {
  const [ringing, setRinging] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const ring = () => {
    setRinging(false);
    // reinicia a animação mesmo com cliques seguidos
    requestAnimationFrame(() => setRinging(true));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setRinging(false), 1600);
  };

  return (
    <button type="button" className={`bell ${ringing ? 'is-ringing' : ''}`} onClick={ring} aria-label="Tocar o sino">
      <svg viewBox="0 0 64 72" width="56" height="63" aria-hidden="true" focusable="false">
        <g className="bell-waves">
          <path d="M8 26a26 26 0 0 0 0 20" />
          <path d="M2 22a34 34 0 0 0 0 28" />
          <path d="M56 26a26 26 0 0 1 0 20" />
          <path d="M62 22a34 34 0 0 1 0 28" />
        </g>
        <g className="bell-swing">
          <path className="bell-hanger" d="M32 4v6" />
          <circle className="bell-ring" cx="32" cy="12" r="3" />
          <path className="bell-body" d="M32 14c-9 0-14 7-14 16 0 8-2 13-6 17h40c-4-4-6-9-6-17 0-9-5-16-14-16z" />
          <path className="bell-rim" d="M10 47h44v4H10z" />
          <circle className="bell-clapper" cx="32" cy="56" r="4" />
          <path className="bell-shine" d="M24 24c-1 3-2 8-2 13" />
        </g>
      </svg>
    </button>
  );
}
