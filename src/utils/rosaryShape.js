/**
 * Formato do terço desenhado em SVG: um laço alongado, mais largo no alto e afunilando
 * até a medalha (não um círculo), com as contas distribuídas por igual ao longo dele.
 *
 * Ordem das contas no laço, saindo da medalha e subindo pelo lado direito:
 * 10 Ave-Marias, 1 conta grande, 10, grande, 10, grande, 10, grande, 10 (= 54 contas).
 */
const LOOP_ORDER = [];
for (let d = 0; d < 5; d++) {
  for (let i = 0; i < 10; i++) LOOP_ORDER.push({ large: false, decade: d });
  if (d < 4) LOOP_ORDER.push({ large: true, decade: d + 1 });
}

export function rosaryLoop({ cx, top, bottom, width, gap = 16, samples = 360 }) {
  const cy = (top + bottom) / 2;
  const B = (bottom - top) / 2;
  const A = width / 2;

  // Parte de baixo (junto da medalha), sobe pela direita, passa pelo alto e desce pela esquerda.
  const point = (u) => {
    const t = Math.PI - 2 * Math.PI * u;
    const narrow = 0.48 + 0.52 * ((1 + Math.cos(t)) / 2); // 1 no alto, ~0,5 embaixo
    const wobble = 0.07 * Math.sin(2 * t); // leve assimetria, como um terço de verdade
    return { x: cx + A * Math.sin(t) * narrow + A * wobble, y: cy - B * Math.cos(t) };
  };

  const pts = Array.from({ length: samples + 1 }, (_, i) => point(i / samples));
  const lengths = [0];
  for (let i = 1; i < pts.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = lengths[lengths.length - 1];

  const at = (s) => {
    let i = lengths.findIndex((l) => l >= s);
    if (i <= 0) return pts[0];
    const f = (s - lengths[i - 1]) / (lengths[i] - lengths[i - 1]);
    return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f };
  };

  const usable = total - 2 * gap;
  const beads = LOOP_ORDER.map((b, i) => ({ ...at(gap + (usable * (i + 0.5)) / LOOP_ORDER.length), ...b, order: i }));

  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('') + 'Z';
  return { d, beads, medal: { x: cx, y: bottom }, total };
}

/** Pingente abaixo da medalha: conta grande, 3 pequenas, conta grande e a cruz. */
export function rosaryPendant({ cx, top, step = 14 }) {
  return {
    beads: [
      { x: cx, y: top + step, large: true, id: 'gloria' },
      { x: cx, y: top + step * 2, large: false, id: 'ave-1' },
      { x: cx, y: top + step * 2.75, large: false, id: 'ave-2' },
      { x: cx, y: top + step * 3.5, large: false, id: 'ave-3' },
      { x: cx, y: top + step * 4.5, large: true, id: 'pai' },
    ],
    cross: { x: cx, y: top + step * 5.6 },
  };
}
