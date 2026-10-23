import { useId, useState } from 'react';

/**
 * Vela com a chama tremulando. Clicando, ela se apaga (sobe uma fumacinha);
 * clicando de novo, acende outra vez.
 */
export default function Candle({ className = '' }) {
  const [lit, setLit] = useState(true);
  const gradientId = `flame-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <button
      type="button"
      className={`candle ${lit ? 'is-lit' : 'is-out'} ${className}`}
      onClick={() => setLit(!lit)}
      aria-label={lit ? 'Apagar a vela' : 'Acender a vela'}
      title={lit ? 'Apagar a vela' : 'Acender a vela'}
    >
      <svg viewBox="0 0 40 96" width="34" height="82" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="45%" stopColor="#FFC94D" />
            <stop offset="100%" stopColor="#E8742A" />
          </radialGradient>
        </defs>
        <circle className="candle-glow" cx="20" cy="24" r="16" />
        <g className="candle-flame">
          <path d="M20 8c5 7 8 12 8 17a8 8 0 0 1-16 0c0-5 3-10 8-17z" fill={`url(#${gradientId})`} />
          <path className="candle-flame-core" d="M20 18c2 3 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4 3-7z" />
        </g>
        <g className="candle-smoke">
          <path d="M20 30c-3-4 3-6 0-10s3-6 0-10" />
        </g>
        <path className="candle-wick" d="M20 30v5" />
        <rect className="candle-body" x="11" y="34" width="18" height="52" rx="3" />
        <path className="candle-drip" d="M13 34h14v6c-1 2-3 2-3 0v-2c-1 4-4 4-4 0v-1c-1 3-4 3-4 0z" />
        <rect className="candle-base" x="6" y="84" width="28" height="6" rx="3" />
      </svg>
    </button>
  );
}
