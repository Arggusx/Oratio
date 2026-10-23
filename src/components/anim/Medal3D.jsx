import { useState } from 'react';
import SaoBentoMedal from '../SaoBentoMedal';

/** Medalha de São Bento girando em falso 3D (frente com a cruz, verso com o santo). Clique para virar. */
export default function Medal3D({ size = 170 }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="fx-coin-scene" style={{ '--coin': `${size}px` }}>
      <button
        type="button"
        className={`fx-coin ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
        aria-label={flipped ? 'Mostrar o lado da cruz' : 'Mostrar o lado de São Bento'}
      >
        <span className="fx-coin-face fx-coin-front">
          <SaoBentoMedal size={size} />
        </span>
        <span className="fx-coin-face fx-coin-back">
          <svg viewBox="0 0 120 136" width={size} height={Math.round(size * 1.135)} aria-hidden="true">
            <defs>
              <radialGradient id="fx-bronze" cx="40%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#F3D58B" />
                <stop offset="60%" stopColor="#C8963E" />
                <stop offset="100%" stopColor="#8A6224" />
              </radialGradient>
              <path id="fx-back-ring" d="M22 68a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
            </defs>
            <rect x="56" y="2" width="8" height="12" rx="3" fill="#A87432" />
            <circle cx="60" cy="68" r="56" fill="url(#fx-bronze)" stroke="#8A6224" strokeWidth="2" />
            <circle cx="60" cy="68" r="47" fill="none" stroke="#8A6224" strokeWidth="1" opacity="0.6" />
            <text fontSize="6.4" fill="#5E4214" letterSpacing="0.6" fontFamily="serif">
              <textPath href="#fx-back-ring">EIUS IN OBITU NOSTRO PRÆSENTIA MUNIAMUR</textPath>
            </text>
            {/* São Bento estilizado: capuz, hábito, cruz e o livro da Regra */}
            <circle cx="60" cy="52" r="8" fill="#F1D9A6" stroke="#5E4214" strokeWidth="1" />
            <path d="M50 54c0-8 4-13 10-13s10 5 10 13" fill="none" stroke="#5E4214" strokeWidth="1.6" />
            <path d="M47 92c1-14 5-26 13-30 8 4 12 16 13 30z" fill="#7A5232" stroke="#5E4214" strokeWidth="1" />
            <path d="M44 58v34M40 64h8" stroke="#5E4214" strokeWidth="2" strokeLinecap="round" />
            <rect x="63" y="70" width="9" height="11" rx="1" fill="#B23A2E" stroke="#5E4214" strokeWidth="0.8" />
          </svg>
        </span>
      </button>
      <span className="fx-coin-shadow" aria-hidden="true" />
    </div>
  );
}
