// Desenho do buquê espiritual: as ofertas, a posição de cada flor no vaso e a imagem para compartilhar.
// O mesmo desenho aparece no formulário, no cartão, na Jornada e na imagem (PNG) que a pessoa envia.

// O que se pode oferecer num buquê espiritual. Cada oferta vira uma flor de uma cor no vaso.
export const OFFERINGS = [
  { id: 'tercos', one: 'terço', many: 'terços', color: '#C2486A' },
  { id: 'missas', one: 'Missa', many: 'Missas', color: '#F2C14E' },
  { id: 'comunhoes', one: 'comunhão', many: 'comunhões', color: '#FFFDF9' },
  { id: 'misericordia', one: 'Terço da Misericórdia', many: 'Terços da Misericórdia', color: '#E8643C' },
  { id: 'avemarias', one: 'Ave-Maria', many: 'Ave-Marias', color: '#6E8FD6' },
  { id: 'visitas', one: 'visita ao Santíssimo', many: 'visitas ao Santíssimo', color: '#E9C46A' },
  { id: 'sacrificios', one: 'sacrifício', many: 'sacrifícios', color: '#9B7BC4' },
];

// Acima disso o vaso não ganha mais flores (a contagem continua nas fitas do cartão).
export const MAX_FLOWERS = 30;

const NECK = { x: 80, y: 114 };
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/**
 * Posição de cada flor. As flores se arrumam numa copa redonda (como as sementes de um girassol)
 * que cresce com a quantidade, e ficam menores quando são muitas: nunca saem do desenho.
 */
export function flowerLayout(items) {
  const colors = OFFERINGS.flatMap((o) => Array.from({ length: items[o.id] ?? 0 }, () => o.color)).slice(0, MAX_FLOWERS);
  const n = colors.length;
  const step = Math.min(15, 52 / Math.sqrt(Math.max(n, 1)));
  const radius = step * Math.sqrt(n);
  const cy = 98 - radius * 0.78;
  const size = Math.min(1, step / 13);
  const flowers = colors.map((color, i) => {
    const r = step * Math.sqrt(i + 0.5);
    const a = i * GOLDEN - Math.PI / 2;
    const x = 80 + r * Math.cos(a);
    const y = cy + r * 0.78 * Math.sin(a);
    const stem = `M${NECK.x} ${NECK.y}Q${80 + (x - 80) * 0.25} ${(NECK.y + y) / 2} ${x.toFixed(1)} ${y.toFixed(1)}`;
    return { x, y, color, stem, i };
  });
  // As do centro por cima das de fora.
  return { flowers, heads: [...flowers].reverse(), size };
}

const petal = (x, y, s) =>
  [0, 72, 144, 216, 288].map((a) => ({
    cx: x,
    cy: y - 8 * s,
    rx: 5.5 * s,
    ry: 9 * s,
    transform: `rotate(${a} ${x.toFixed(1)} ${y.toFixed(1)})`,
  }));
export { petal };

/** O vaso em SVG puro (com as cores escritas), para virar imagem no compartilhar. */
export function vaseSvg(items, size = 640) {
  const { flowers, heads, size: s } = flowerLayout(items);
  const stems = flowers.map((f) => `<path d="${f.stem}" fill="none" stroke="#5E8C63" stroke-width="2"/>`).join('');
  const blooms = heads
    .map(
      (f) =>
        petal(f.x, f.y, s)
          .map((p) => `<ellipse cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" rx="${p.rx}" ry="${p.ry}" fill="${f.color}" stroke="rgba(58,42,34,.18)" stroke-width=".5" transform="${p.transform}"/>`)
          .join('') + `<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="${(4.2 * s).toFixed(1)}" fill="#E3B55A"/>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 170" width="${size}" height="${(size * 170) / 160}">${stems}${LEAVES}${blooms}<path d="M54 118h52l-8 44H62z" fill="#B88A5A"/><path d="M50 112h60v8H50z" fill="#9A6B47"/></svg>`;
}

// Duas folhas saindo da boca do vaso.
export const LEAVES_D = ['M74 113c-12-2-20-9-24-18 10 1 19 7 24 18z', 'M86 113c12-2 20-9 24-18-10 1-19 7-24 18z'];
const LEAVES = LEAVES_D.map((d) => `<path d="${d}" fill="#78A97D"/>`).join('');

export const describeOfferings = (items) =>
  OFFERINGS.filter((o) => items[o.id] > 0).map((o) => ({
    ...o,
    label: `${items[o.id]} ${items[o.id] === 1 ? o.one : o.many}`,
  }));

export const bouquetDate = (created) =>
  new Date(`${created}T12:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- Imagem do cartão (PNG) ---------- */

const W = 1080;
const PAD = 90;
const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = 'Inter, system-ui, sans-serif';

function wrap(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of String(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Ramo de enfeite num canto do cartão (folhas e três florzinhas).
function corner(ctx, x, y, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.rotate(Math.PI);
  const dot = (cx, cy, r, color) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };
  ctx.fillStyle = '#78A97D';
  ctx.beginPath();
  ctx.ellipse(70, 64, 26, 14, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5E8C63';
  ctx.beginPath();
  ctx.ellipse(44, 70, 18, 10, 1.1, 0, Math.PI * 2);
  ctx.fill();
  dot(64, 44, 13, '#C2486A');
  dot(98, 34, 9, '#E9C46A');
  dot(36, 102, 9, '#9B7BC4');
  ctx.restore();
}

/** Desenha o cartão do buquê numa imagem PNG, pronta para enviar pelo WhatsApp, Instagram etc. */
export async function bouquetImage(b) {
  await Promise.all([
    document.fonts?.load(`600 72px ${SERIF}`),
    document.fonts?.load(`italic 500 44px ${SERIF}`),
    document.fonts?.load(`700 26px ${SANS}`),
  ]).catch(() => {});

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = 3200; // cortado no fim, na altura certa
  // 'ctx' mede os textos aqui; no fim passa a apontar para a imagem final, onde os passos guardados desenham.
  let ctx = canvas.getContext('2d');
  const inner = W - PAD * 2;
  let y = 130;
  const ops = []; // o fundo é desenhado depois, quando a altura é conhecida

  const text = (str, font, color, lineHeight, opts = {}) => {
    ctx.font = font;
    const lines = wrap(ctx, str, opts.width ?? inner);
    for (const line of lines) {
      const at = y;
      ops.push(() => {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        if ('letterSpacing' in ctx) ctx.letterSpacing = opts.spacing ?? '0px';
        ctx.fillText(line, W / 2, at);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      });
      y += lineHeight;
    }
  };

  text('BUQUÊ ESPIRITUAL', `700 26px ${SANS}`, '#B84A13', 70, { spacing: '6px' });
  text(`para ${b.to}`, `600 84px ${SERIF}`, '#3A2A22', 92);
  if (b.intention) text(b.intention, `italic 500 40px ${SERIF}`, '#6B5A4E', 50);

  // O vaso
  const vase = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(vaseSvg(b.items, 640))}`);
  const vaseTop = y - 10;
  ops.push(() => ctx.drawImage(vase, (W - 520) / 2, vaseTop, 520, 552));
  y += 590;

  text('Ofereço a Deus por você', `500 44px ${SERIF}`, '#6B5A4E', 76);

  // As fitas, uma por oferta, quebrando em linhas centralizadas
  ctx.font = `600 28px ${SANS}`;
  const pills = describeOfferings(b.items).map((o) => ({ ...o, w: ctx.measureText(o.label).width + 84 }));
  const rows = [];
  for (const p of pills) {
    const row = rows[rows.length - 1];
    if (row && row.w + 14 + p.w <= inner) {
      row.items.push(p);
      row.w += 14 + p.w;
    } else rows.push({ items: [p], w: p.w });
  }
  y -= 40;
  for (const row of rows) {
    const top = y;
    let x = (W - row.w) / 2;
    for (const p of row.items) {
      const at = x;
      ops.push(() => {
        roundRect(ctx, at, top, p.w, 60, 30);
        // Cores muito claras (a comunhão é branca) ganham uma borda bege, para a fita não sumir no fundo.
        const light = parseInt(p.color.slice(1, 3), 16) + parseInt(p.color.slice(3, 5), 16) + parseInt(p.color.slice(5, 7), 16) > 690;
        ctx.fillStyle = light ? '#FFFFFF' : `${p.color}26`;
        ctx.fill();
        ctx.strokeStyle = light ? '#D9C9B4' : `${p.color}AA`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(at + 34, top + 30, 10, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = `600 28px ${SANS}`;
        ctx.fillStyle = '#3A2A22';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.label, at + 56, top + 31);
      });
      x += p.w + 14;
    }
    y += 74;
  }
  y += 50;

  if (b.message) {
    text(`“${b.message}”`, `italic 500 46px ${SERIF}`, '#3A2A22', 58, { width: inner - 40 });
    y += 20;
  }
  if (b.from) text(`Com carinho, ${b.from}`, `600 32px ${SANS}`, '#6B5A4E', 56);
  text(bouquetDate(b.created), `400 26px ${SANS}`, '#8C7A6B', 60);
  y += 10;
  text('Oratio Daily', `600 30px ${SERIF}`, '#B84A13', 40);
  const height = Math.round(y + 50);

  // Agora o fundo, a moldura, os enfeites e, por cima, tudo o que foi medido.
  const out = document.createElement('canvas');
  out.width = W;
  out.height = height;
  const o = out.getContext('2d');
  const paint = (c) => {
    c.fillStyle = '#FFFBF4';
    c.fillRect(0, 0, W, height);
    const glow = (x, gy, r, color) => {
      const g = c.createRadialGradient(x, gy, 0, x, gy, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(255,251,244,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, W, height);
    };
    glow(W / 2, 330, 620, 'rgba(247,214,224,.75)');
    glow(0, height, 520, 'rgba(233,196,106,.25)');
    glow(W, height, 520, 'rgba(155,123,196,.2)');
    roundRect(c, 14, 14, W - 28, height - 28, 44);
    c.strokeStyle = '#D9A86B';
    c.lineWidth = 3;
    c.stroke();
    roundRect(c, 34, 34, W - 68, height - 68, 32);
    c.strokeStyle = 'rgba(200,150,62,.45)';
    c.lineWidth = 2;
    c.stroke();
  };
  paint(o);
  corner(o, 20, 20, false);
  corner(o, W - 20, height - 20, true);
  ctx = o;
  ops.forEach((step) => step());
  return new Promise((resolve) => out.toBlob(resolve, 'image/png'));
}
