// Molduras animadas do medalhão da Jornada: SVG puro com animação SMIL (<animate>, <animateTransform>,
// <animateMotion>), sem animação em CSS nem JavaScript. Quem anima é o próprio navegador.
//
// Cada moldura tem duas camadas:
//   tras   → fica atrás do avatar (o anel, os raios, as partículas);
//   frente → fica na frente do avatar (selos, ícones, brilhos).
// Todas usam viewBox="-40 -40 180 180": o anel ocupa o espaço 0..100 e o avatar fica em 8..92 (centro 50,50,
// raio 42). A sobra (-40..0 e 100..140) é para o que sai do anel: estrelas, raios, peixes.
//
// Truque do traço que corre pelo anel: pathLength="100" deixa o tracejado em porcentagem. Assim
// stroke-dasharray="14 86" é 14% visível e 86% vazio, e animar o stroke-dashoffset faz o traço correr.

const C = 50; // centro do anel
const RING = 46.5; // raio do meio do anel (que vai de 43 a 50)

// Ponto a "deg" graus contados do alto, no sentido do relógio.
const at = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(C + r * Math.cos(a)).toFixed(2), +(C + r * Math.sin(a)).toFixed(2)];
};

const ring = (color, accent) =>
  `<circle cx="50" cy="50" r="${RING}" fill="none" stroke="${color}" stroke-width="7"/>` +
  `<circle cx="50" cy="50" r="49.6" fill="none" stroke="${accent}" stroke-opacity=".55" stroke-width=".9"/>` +
  `<circle cx="50" cy="50" r="43.3" fill="none" stroke="${accent}" stroke-opacity=".75" stroke-width=".8"/>`;

// Traço luminoso correndo pelo anel.
const runner = (accent, dur, dash = '14 86', width = 3) =>
  `<circle cx="50" cy="50" r="${RING}" fill="none" stroke="${accent}" stroke-width="${width}" stroke-linecap="round" ` +
  `pathLength="100" stroke-dasharray="${dash}" transform="rotate(-90 50 50)">` +
  `<animate attributeName="stroke-dashoffset" from="0" to="-100" dur="${dur}" repeatCount="indefinite"/></circle>`;

// Selo redondo embaixo do anel (frente), onde vai o ícone de cada moldura.
const badge = (color, accent, r = 11.5) =>
  `<circle cx="50" cy="100" r="${r}" fill="${color}" stroke="${accent}" stroke-width="1.6"/>`;

const star = (x, y, R, r) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 ? r : R;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    return `${(x + rad * Math.cos(a)).toFixed(2)} ${(y + rad * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
};

const sparkle = (x, y, s = 5) =>
  `M${x} ${y - s}l${s * 0.28} ${s * 0.72} ${s * 0.72} ${s * 0.28}-${s * 0.72} ${s * 0.28}-${s * 0.28} ${s * 0.72}-${s * 0.28}-${s * 0.72}-${s * 0.72}-${s * 0.28} ${s * 0.72}-${s * 0.28}z`;

/* ---------- Simples: brilho correndo pelo anel ---------- */
function simples(c, a) {
  return {
    tras: ring(c, a) + runner(a, '7s', '10 90', 2.6),
  };
}

/* ---------- Altar (Missa): raios pulsando, cruzes no anel e o cálice com a hóstia ---------- */
function missa(c, a) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const [x1, y1] = at(53, i * 22.5);
    const [x2, y2] = at(i % 2 ? 60 : 65, i * 22.5);
    return `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
  }).join('');
  const crosses = Array.from({ length: 8 }, (_, i) => {
    const deg = 22.5 + i * 45;
    const [x, y] = at(RING, deg);
    return `<path d="M${x} ${y - 2.6}v5.2M${x - 1.9} ${y - 0.9}h3.8" transform="rotate(${deg} ${x} ${y})"/>`;
  }).join('');
  return {
    tras:
      `<g stroke="${a}" stroke-width="1.8" stroke-linecap="round">${rays}` +
      `<animate attributeName="opacity" values=".25;.9;.25" dur="3.2s" repeatCount="indefinite"/></g>` +
      ring(c, a) +
      runner(a, '4.2s', '12 88', 2) +
      `<g fill="none" stroke="#5A3A12" stroke-width="2" stroke-linecap="round">${crosses}</g>`,
    frente:
      badge(c, a) +
      `<circle cx="50" cy="93" r="5" fill="${a}" opacity="0">` +
      `<animate attributeName="opacity" values="0;.7;0" dur="2.6s" repeatCount="indefinite"/></circle>` +
      `<circle cx="50" cy="93" r="2.7" fill="#FFFBF0"><animate attributeName="r" values="2.5;3.1;2.5" dur="2.6s" repeatCount="indefinite"/></circle>` +
      `<path d="M44.6 96.4h10.8c0 4.4-2.5 6.8-5.4 6.8s-5.4-2.4-5.4-6.8z" fill="#FFFBF0"/>` +
      `<path d="M50 103.2v3.3M46.6 106.8h6.8" stroke="#FFFBF0" stroke-width="1.5" stroke-linecap="round"/>`,
  };
}

/* ---------- Coroa de Doze Estrelas (Maria): estrelas girando e piscando em sequência, a lua aos pés ---------- */
function maria(c, a) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const [x, y] = at(57, i * 30);
    return (
      `<path d="${star(x, y, 4.3, 1.8)}" fill="${a}" opacity=".35">` +
      `<animate attributeName="opacity" values=".35;1;.35" dur="3.6s" begin="${(i * 0.3).toFixed(1)}s" repeatCount="indefinite"/></path>`
    );
  }).join('');
  return {
    tras:
      `<g>${stars}<animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="60s" repeatCount="indefinite"/></g>` +
      ring(c, a) +
      runner(a, '5s', '8 92', 2),
    frente:
      badge(c, a, 10.5) +
      `<circle cx="49" cy="100" r="6.4" fill="${a}"/>` +
      `<circle cx="52.6" cy="98" r="5.6" fill="${c}"><animate attributeName="cx" values="52.6;53.4;52.6" dur="4s" repeatCount="indefinite"/></circle>`,
  };
}

/* ---------- Sete Sinais (Sacramentos): sete segmentos acendem um a um, com sete bolinhas ---------- */
function sacramentos(c, a) {
  const seg = 100 / 7;
  const segments = Array.from(
    { length: 7 },
    (_, i) =>
      `<circle cx="50" cy="50" r="${RING}" fill="none" stroke="${a}" stroke-width="4.2" pathLength="100" ` +
      `stroke-dasharray="${(seg - 2).toFixed(2)} ${(100 - seg + 2).toFixed(2)}" stroke-dashoffset="${(-(i * seg) - 1).toFixed(2)}" ` +
      `transform="rotate(-90 50 50)" opacity=".18">` +
      `<animate attributeName="opacity" values=".18;1;1;.18" keyTimes="0;.08;.7;1" dur="7s" begin="${i}s" repeatCount="indefinite"/></circle>`,
  ).join('');
  const dots = Array.from({ length: 7 }, (_, i) => {
    const [x, y] = at(57, i * (360 / 7) + seg * 1.8);
    return (
      `<circle cx="${x}" cy="${y}" r="1.6" fill="${a}">` +
      `<animate attributeName="r" values="1.6;3;1.6" dur="7s" begin="${i}s" repeatCount="indefinite"/></circle>`
    );
  }).join('');
  return {
    tras: ring(c, a) + segments + dots,
    frente:
      `<circle cx="50" cy="100" r="10.5" fill="none" stroke="${a}" stroke-width="1">` +
      `<animate attributeName="r" values="10.5;16" dur="2.4s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values=".8;0" dur="2.4s" repeatCount="indefinite"/></circle>` +
      badge(c, a, 10.5) +
      `<text x="50" y="104.6" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="13" font-weight="700" fill="#FFFBF0">7</text>`,
  };
}

/* ---------- Palavra (Bíblia): o traço preenche o anel, Alfa e Ômega e a Bíblia virando a página ---------- */
function biblia(c, a) {
  const right = 'M50 96q5-2 10 0v10q-5-2-10 0z';
  const middle = 'M50 95q.5-1 1 0v12q-.5-1-1 0z';
  const left = 'M50 96q-5-2-10 0v10q5-2 10 0z';
  return {
    tras:
      ring(c, a) +
      `<circle cx="50" cy="50" r="${RING}" fill="none" stroke="#5A4128" stroke-width=".9" stroke-dasharray="1.6 2.4" opacity=".7"/>` +
      `<circle cx="50" cy="50" r="${RING}" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" pathLength="100" transform="rotate(-90 50 50)" stroke-dasharray="0 100">` +
      `<animate attributeName="stroke-dasharray" values="0 100;100 0;100 0" keyTimes="0;.75;1" dur="7s" repeatCount="indefinite"/></circle>` +
      `<g font-family="Cormorant Garamond, Georgia, serif" font-size="17" font-weight="700" fill="${c}" text-anchor="middle">` +
      `<text x="-9" y="56">Α</text><text x="109" y="56">Ω</text>` +
      `<animate attributeName="opacity" values=".55;1;.55" dur="4s" repeatCount="indefinite"/></g>`,
    frente:
      badge(c, a, 12) +
      `<path d="${left}" fill="#FFFBF0"/><path d="${right}" fill="#F4E9D4"/>` +
      `<path d="${right}" fill="#FFFBF0" stroke="${c}" stroke-width=".4">` +
      `<animate attributeName="d" values="${right};${right};${middle};${left};${left}" keyTimes="0;.45;.6;.75;1" dur="4.5s" repeatCount="indefinite"/></path>` +
      `<path d="M50 96v10" stroke="${c}" stroke-width=".7"/>`,
  };
}

/* ---------- Auréola dos Santos: raios dourados girando, halo pulsando e brilhos que aparecem ---------- */
function santos(c, a) {
  const rays = Array.from({ length: 24 }, (_, i) => {
    const [x1, y1] = at(53, i * 15);
    const [x2, y2] = at(i % 2 ? 59 : 66, i * 15);
    return `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
  }).join('');
  const sparkles = [
    [90, 12, 0],
    [8, 20, 1.2],
    [94, 86, 2.4],
  ]
    .map(
      ([x, y, b]) =>
        `<path d="${sparkle(x, y, 5.5)}" fill="${a}" opacity="0">` +
        `<animate attributeName="opacity" values="0;1;0" dur="3.6s" begin="${b}s" repeatCount="indefinite"/></path>`,
    )
    .join('');
  return {
    tras:
      `<circle cx="50" cy="50" r="64" fill="${a}" opacity=".1"><animate attributeName="opacity" values=".06;.24;.06" dur="4s" repeatCount="indefinite"/></circle>` +
      `<g stroke="${a}" stroke-width="1.7" stroke-linecap="round">${rays}` +
      `<animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="40s" repeatCount="indefinite"/></g>` +
      ring(c, a) +
      runner(a, '6s', '6 44', 2),
    frente: sparkles,
  };
}

/* ---------- Peixe (Símbolos): a água corre no anel, peixes nadam em volta e o Ichthys se desenha ---------- */
function simbolos(c, a) {
  const orbit = 'M50 -7a57 57 0 1 1 0 114a57 57 0 1 1 0-114';
  const fish = [0, 3, 6]
    .map(
      (b) =>
        `<g><path d="M5 0q-5-5-9 0q4 5 9 0zM-4 0l-3.2-2.6v5.2z" fill="${a}"/>` +
        `<animateMotion path="${orbit}" dur="9s" begin="-${b}s" rotate="auto" repeatCount="indefinite"/></g>`,
    )
    .join('');
  return {
    tras:
      fish +
      ring(c, a) +
      `<circle cx="50" cy="50" r="${RING}" fill="none" stroke="${a}" stroke-width="1.4" stroke-dasharray="4 3">` +
      `<animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.8s" repeatCount="indefinite"/></circle>`,
    frente:
      badge(c, a, 11) +
      `<path d="M41 96.6q9 8 18 0M41 103.4q9-8 18 0" fill="none" stroke="#FFFBF0" stroke-width="1.6" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100">` +
      `<animate attributeName="stroke-dashoffset" values="100;0;0" keyTimes="0;.45;1" dur="4s" repeatCount="indefinite"/></path>`,
  };
}

const builders = { simples, missa, maria, sacramentos, biblia, santos, simbolos };

/** As camadas (trás e frente) de cada moldura, já com as cores. Record<id da moldura, { tras, frente }>. */
export function buildFrameLayers(frames) {
  return Object.fromEntries(frames.map((f) => [f.id, (builders[f.id] ?? simples)(f.color, f.accent)]));
}
