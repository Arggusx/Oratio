import { useId } from 'react';

/* ============================================================
   Ícones ilustrados da seção "O que fazer na Missa".
   Desenhados em SVG (48×48) no estilo dourado das artes originais.
   ============================================================ */

const GOLD_LIGHT = '#F2CD7A';
const GOLD = '#D4A345';
const GOLD_DARK = '#9C6F22';

function IconBase({ children, title }) {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" role="img" aria-label={title} className="mass-icon">
      <defs>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GOLD_LIGHT} />
          <stop offset="0.55" stopColor={GOLD} />
          <stop offset="1" stopColor={GOLD_DARK} />
        </linearGradient>
      </defs>
      {children(`url(#gold-${id})`)}
    </svg>
  );
}

export function IhsIcon() {
  return (
    <IconBase title="Monograma IHS">
      {(gold) => (
        <>
          <path d="M24 4v14M19 8.5h10" stroke={gold} strokeWidth="2.6" strokeLinecap="round" />
          <text
            x="24"
            y="38"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontWeight="700"
            fontSize="19"
            fill={gold}
            stroke={GOLD_DARK}
            strokeWidth="0.4"
          >
            IHS
          </text>
        </>
      )}
    </IconBase>
  );
}

export function MaryIcon() {
  return (
    <IconBase title="Nossa Senhora">
      {(gold) => (
        <>
          {/* manto */}
          <path d="M24 13 C17 17 13 30 12 43 Q24 46 36 43 C35 30 31 17 24 13Z" fill="#2E4C80" stroke={gold} strokeWidth="1.6" />
          <path d="M24 17 C20 21 18 31 18 41 M24 17 C28 21 30 31 30 41" stroke={gold} strokeWidth="0.9" fill="none" opacity="0.8" />
          {/* rosto */}
          <circle cx="24" cy="16" r="3.2" fill="#6B4630" />
          {/* coroa */}
          <path d="M18.5 12 L19.5 5.5 L22 9 L24 4 L26 9 L28.5 5.5 L29.5 12Z" fill={gold} stroke={GOLD_DARK} strokeWidth="0.6" />
          <circle cx="24" cy="4" r="1" fill={GOLD_LIGHT} />
        </>
      )}
    </IconBase>
  );
}

export function SaintIcon() {
  return (
    <IconBase title="Santo">
      {(gold) => (
        <>
          <circle cx="24" cy="13" r="9" fill="none" stroke={gold} strokeWidth="2.4" />
          <circle cx="24" cy="14" r="5" fill="#E2B48C" />
          <path d="M20 12 Q24 7 28 12" fill="#5A3A22" />
          <path d="M12 44 C12 30 17 22 24 22 C31 22 36 30 36 44Z" fill="#8A5A34" stroke={gold} strokeWidth="1.4" />
          <path d="M24 22 V44" stroke={gold} strokeWidth="1.2" />
          <path d="M20 30 h8" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
    </IconBase>
  );
}

export function TrinityIcon() {
  // Triquetra: três "vesicas" entrelaçadas dentro de um círculo.
  const lens = (ax, ay, bx, by) => `M${ax} ${ay} A17 17 0 0 1 ${bx} ${by} A17 17 0 0 1 ${ax} ${ay}Z`;
  return (
    <IconBase title="Santíssima Trindade">
      {(gold) => (
        <>
          <circle cx="24" cy="26" r="10.5" fill="none" stroke={gold} strokeWidth="2" />
          <g fill="none" stroke={gold} strokeWidth="2.6" strokeLinejoin="round">
            <path d={lens(24, 8, 8.4, 35)} />
            <path d={lens(8.4, 35, 39.6, 35)} />
            <path d={lens(39.6, 35, 24, 8)} />
          </g>
        </>
      )}
    </IconBase>
  );
}

export function OpenBookIcon() {
  return (
    <IconBase title="Livro aberto">
      {(gold) => (
        <>
          <path d="M5 13 Q15 9 24 14 Q33 9 43 13 V38 Q33 34 24 39 Q15 34 5 38Z" fill="#FBF3E2" stroke={gold} strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 14 V39" stroke={GOLD_DARK} strokeWidth="1.4" />
          <path d="M9 18 Q15 16 20 18 M9 23 Q15 21 20 23 M9 28 Q15 26 20 28" stroke="#C9B48E" strokeWidth="1.2" fill="none" />
          <path d="M33.5 17 V32 M29 21.5 H38" stroke={gold} strokeWidth="2.6" strokeLinecap="round" />
        </>
      )}
    </IconBase>
  );
}

export function AltarIcon() {
  return (
    <IconBase title="Altar">
      {(gold) => (
        <>
          {/* vela */}
          <rect x="33" y="10" width="3.5" height="10" rx="1" fill="#FBF3E2" stroke={gold} strokeWidth="1" />
          <path d="M34.75 4 C33 7 34 8.5 34.75 9.5 C35.5 8.5 36.5 7 34.75 4Z" fill="#F59E0B" />
          {/* cruz */}
          <path d="M18 9 V20 M14.5 12.5 H21.5" stroke={gold} strokeWidth="2.4" strokeLinecap="round" />
          {/* mesa e toalha */}
          <rect x="6" y="20" width="36" height="5" rx="1.5" fill="#FBF3E2" stroke={gold} strokeWidth="1.6" />
          <path d="M8 25 V40 H40 V25" fill="#E9DCC3" stroke={gold} strokeWidth="1.6" />
          <path d="M8 29 Q11 32 14 29 Q17 32 20 29 Q23 32 26 29 Q29 32 32 29 Q35 32 38 29 Q39 30 40 29" stroke={GOLD_DARK} strokeWidth="1" fill="none" />
          <path d="M24 31 V38 M21 34 H27" stroke={gold} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </IconBase>
  );
}

export function ScrollIcon() {
  return (
    <IconBase title="Pergaminho">
      {(gold) => (
        <>
          <path d="M12 9 H36 V39 H12Z" fill="#F4E4C1" stroke={gold} strokeWidth="1.6" />
          <rect x="8" y="5" width="32" height="6" rx="3" fill="#E6CB92" stroke={gold} strokeWidth="1.6" />
          <rect x="8" y="37" width="32" height="6" rx="3" fill="#E6CB92" stroke={gold} strokeWidth="1.6" />
          <path d="M24 15 V32 M18.5 20 H29.5" stroke="#7A4E1E" strokeWidth="2.6" strokeLinecap="round" />
        </>
      )}
    </IconBase>
  );
}

export function SacredHeartIcon() {
  return (
    <IconBase title="Coração em chamas">
      {(gold) => (
        <>
          <path d="M24 17 C21.5 12.5 23 8.5 24 4 C25.5 8 28 11.5 24 17Z" fill="#F97316" />
          <path d="M24 15 C23 12.5 23.6 10.5 24 9 C24.8 11 25.5 12.5 24 15Z" fill="#FDE68A" />
          <path
            d="M24 43 C11 34 7 26 11 20.5 C14.5 15.5 20.5 16.5 24 21 C27.5 16.5 33.5 15.5 37 20.5 C41 26 37 34 24 43Z"
            fill={gold}
            stroke={GOLD_DARK}
            strokeWidth="1.2"
          />
          <path d="M16 23 C17 21 19 20.5 20.5 21" stroke={GOLD_LIGHT} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </>
      )}
    </IconBase>
  );
}

export function GospelBookIcon() {
  return (
    <IconBase title="Evangeliário">
      {(gold) => (
        <>
          <rect x="11" y="6" width="26" height="34" rx="2.5" fill="#7A3E1D" stroke={gold} strokeWidth="1.6" />
          <path d="M14 40 V43 H37 V9" stroke="#F4E4C1" strokeWidth="2" fill="none" />
          <path d="M24 13 V30 M18.5 18.5 H29.5" stroke={gold} strokeWidth="2.6" strokeLinecap="round" />
          {/* estola */}
          <path d="M30 6 L34 6 L38 44 L34 46Z" fill="#3F7A3A" stroke={gold} strokeWidth="0.8" />
          <path d="M33 38 h4" stroke={gold} strokeWidth="1" />
        </>
      )}
    </IconBase>
  );
}

export function MonstranceIcon() {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const long = i % 2 === 0;
    const r1 = 8;
    const r2 = long ? 15 : 12.5;
    return (
      <line
        key={i}
        x1={24 + r1 * Math.cos(a)}
        y1={17 + r1 * Math.sin(a)}
        x2={24 + r2 * Math.cos(a)}
        y2={17 + r2 * Math.sin(a)}
      />
    );
  });
  return (
    <IconBase title="Ostensório com o Santíssimo">
      {(gold) => (
        <>
          <g stroke={gold} strokeWidth="1.8" strokeLinecap="round">{rays}</g>
          <circle cx="24" cy="17" r="7" fill={gold} />
          <circle cx="24" cy="17" r="4.6" fill="#FFFBF0" />
          <path d="M22.5 31 H25.5 L26 37 H22Z" fill={gold} />
          <ellipse cx="24" cy="38.5" rx="5" ry="1.6" fill={gold} />
          <path d="M15 44 Q24 37.5 33 44Z" fill={gold} stroke={GOLD_DARK} strokeWidth="0.6" />
        </>
      )}
    </IconBase>
  );
}

export function RadiantCrossIcon() {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
    return (
      <line key={i} x1={24 + 10 * Math.cos(a)} y1={19 + 10 * Math.sin(a)} x2={24 + 17 * Math.cos(a)} y2={19 + 17 * Math.sin(a)} />
    );
  });
  return (
    <IconBase title="Cruz">
      {(gold) => (
        <>
          <g stroke={gold} strokeWidth="1.4" strokeLinecap="round" opacity="0.85">{rays}</g>
          <path
            d="M21.5 4 H26.5 V13 H35 V18 H26.5 V44 H21.5 V18 H13 V13 H21.5Z"
            fill="#8A5A34"
            stroke={gold}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </>
      )}
    </IconBase>
  );
}
