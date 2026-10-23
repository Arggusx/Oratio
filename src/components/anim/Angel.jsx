import { useState } from 'react';

/** Anjinho que flutua, pisca e bate as asas; ao ser clicado, dá uma voltinha. */
export default function Angel() {
  const [spin, setSpin] = useState(0);

  return (
    <button type="button" className="angel" onClick={() => setSpin((n) => n + 1)} aria-label="Brincar com o anjinho">
      <svg key={spin} viewBox="0 0 80 80" width="64" height="64" aria-hidden="true" focusable="false" className={spin ? 'is-spinning' : ''}>
        <g className="angel-float">
          <ellipse className="angel-halo" cx="40" cy="12" rx="11" ry="3.5" />
          <path className="angel-wing angel-wing-left" d="M30 36C18 26 8 30 6 40c8-2 14 2 24 6z" />
          <path className="angel-wing angel-wing-right" d="M50 36c12-10 22-6 24 4-8-2-14 2-24 6z" />
          <path className="angel-robe" d="M30 38c-4 10-7 22-8 32h36c-1-10-4-22-8-32z" />
          <circle className="angel-face" cx="40" cy="27" r="10" />
          <path className="angel-hair" d="M30 25c1-7 6-10 10-10s9 3 10 10c-3-3-6-4-10-4s-7 1-10 4z" />
          <g className="angel-eyes">
            <ellipse cx="36.4" cy="28" rx="1.1" ry="1.5" />
            <ellipse cx="43.6" cy="28" rx="1.1" ry="1.5" />
          </g>
          <circle className="angel-cheek" cx="33.5" cy="31" r="1.6" />
          <circle className="angel-cheek" cx="46.5" cy="31" r="1.6" />
          <path className="angel-smile" d="M37.5 32q2.5 2 5 0" />
        </g>
      </svg>
    </button>
  );
}
