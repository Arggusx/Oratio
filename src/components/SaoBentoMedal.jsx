import { useId } from 'react';

/* ============================================================
   Medalha de São Bento (lado da cruz), desenhada em SVG.
   Anel externo: V.R.S.N.S.M.V.S.M.Q.L.I.V.B, com PAX no alto.
   Cruz: C.S.S.M.L. (vertical) e N.D.S.M.D. (horizontal).
   Ângulos: C.S.P.B.
   ============================================================ */

const CENTER_X = 60;
const CENTER_Y = 68;
const RING_RADIUS = 44;

// Ponto no anel a partir de um ângulo medido do topo, em sentido horário.
function ringPoint(degrees) {
  const rad = (degrees * Math.PI) / 180;
  return [CENTER_X + RING_RADIUS * Math.sin(rad), CENTER_Y - RING_RADIUS * Math.cos(rad)];
}

export default function SaoBentoMedal({ size = 76 }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bronze = `bronze-${id}`;
  const rim = `rim-${id}`;
  const ringPath = `ring-${id}`;

  // O anel de letras começa logo à direita do PAX e termina logo à esquerda.
  const [x1, y1] = ringPoint(24);
  const [x2, y2] = ringPoint(336);
  const arcLength = RING_RADIUS * ((312 * Math.PI) / 180);

  const letterStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 700,
    fill: '#4A2F12',
  };

  return (
    <svg
      viewBox="0 0 120 128"
      width={size}
      height={(size * 128) / 120}
      role="img"
      aria-label="Medalha de São Bento"
      className="sao-bento-medal"
    >
      <defs>
        <radialGradient id={bronze} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#F1D199" />
          <stop offset="0.45" stopColor="#C9944B" />
          <stop offset="1" stopColor="#7A5222" />
        </radialGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6DDA8" />
          <stop offset="0.5" stopColor="#A87638" />
          <stop offset="1" stopColor="#5E3D17" />
        </linearGradient>
        <path
          id={ringPath}
          d={`M${x1.toFixed(2)} ${y1.toFixed(2)} A${RING_RADIUS} ${RING_RADIUS} 0 1 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`}
        />
      </defs>

      {/* argola */}
      <circle cx="60" cy="8" r="6" fill="none" stroke={`url(#${rim})`} strokeWidth="3" />

      {/* corpo da medalha */}
      <circle cx={CENTER_X} cy={CENTER_Y} r="55" fill={`url(#${rim})`} />
      <circle cx={CENTER_X} cy={CENTER_Y} r="51.5" fill={`url(#${bronze})`} stroke="#6B4519" strokeWidth="0.8" />
      <circle cx={CENTER_X} cy={CENTER_Y} r="36" fill="none" stroke="#6B4519" strokeWidth="1.4" />

      {/* PAX e anel de letras */}
      <text x="60" y="27.5" textAnchor="middle" fontSize="8.5" letterSpacing="1" style={letterStyle}>
        PAX
      </text>
      <text fontSize="7" style={letterStyle}>
        <textPath href={`#${ringPath}`} textLength={arcLength.toFixed(1)} lengthAdjust="spacing">
          V·R·S·N·S·M·V·S·M·Q·L·I·V·B
        </textPath>
      </text>

      {/* cruz */}
      <g fill="#E8C484" stroke="#6B4519" strokeWidth="1">
        <rect x="53" y="33" width="14" height="70" rx="2" />
        <rect x="25" y="61" width="70" height="14" rx="2" />
      </g>
      <circle cx="60" cy="68" r="7.5" fill="#E8C484" stroke="#6B4519" strokeWidth="1" />

      {/* C.S.S.M.L. na vertical (o S central é compartilhado com a horizontal) */}
      <g fontSize="7.5" textAnchor="middle" style={letterStyle}>
        <text x="60" y="42">C</text>
        <text x="60" y="52">S</text>
        <text x="60" y="71">S</text>
        <text x="60" y="88">M</text>
        <text x="60" y="98">L</text>
        {/* N.D.S.M.D. na horizontal */}
        <text x="31.5" y="71">N</text>
        <text x="42" y="71">D</text>
        <text x="78" y="71">M</text>
        <text x="88.5" y="71">D</text>
      </g>

      {/* C.S.P.B. nos quatro ângulos */}
      {[
        ['C', 41, 49],
        ['S', 79, 49],
        ['P', 41, 87],
        ['B', 79, 87],
      ].map(([letter, cx, cy]) => (
        <g key={letter}>
          <circle cx={cx} cy={cy} r="8" fill="none" stroke="#6B4519" strokeWidth="1.2" />
          <text x={cx} y={cy + 3.2} textAnchor="middle" fontSize="9.5" style={letterStyle}>
            {letter}
          </text>
        </g>
      ))}
    </svg>
  );
}
