import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { rosaryLoop, rosaryPendant } from '../../utils/rosaryShape';

/**
 * Terço interativo do passo a passo: o terço se monta ao aparecer; tocar numa parte mostra,
 * ao lado, o que rezar nela. "Anterior" e "Próximo" percorrem o terço na ordem da oração.
 *
 * Passos do terço tradicional → partes:
 *   0–2 cruz (Sinal da Cruz, oferecimento, Creio) · 3 conta grande (Pai-Nosso)
 *   4 três contas pequenas · 5 conta grande (Glória) · 6 as dezenas · 7 a medalha (Salve-Rainha)
 */
const CX = 120;
const PART_OF_STEP = ['cruz', 'cruz', 'cruz', 'pai', 'aves', 'gloria', 'dezenas', 'medalha'];

export default function RosaryExplorer({ steps, activeIndex, onOpenStep }) {
  const [picked, setPicked] = useState(null);
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAssembled(true), 400);
    return () => clearTimeout(t);
  }, []);

  const { loop, pendant } = useMemo(
    () => ({
      loop: rosaryLoop({ cx: CX, top: 14, bottom: 206, width: 176, gap: 15 }),
      pendant: rosaryPendant({ cx: CX, top: 214, step: 16 }),
    }),
    []
  );

  // Sem escolha no terço, acompanha o passo aberto na lista (ou começa pela cruz).
  const current = picked ?? Math.max(activeIndex, 0);
  const step = steps[current];
  const currentPart = PART_OF_STEP[current];
  const partDone = (part) => PART_OF_STEP.slice(0, current + 1).includes(part);
  const cls = (part) => `rosary-x-part ${partDone(part) ? 'is-done' : ''} ${currentPart === part ? 'is-current' : ''}`;
  const pick = (part) => setPicked(PART_OF_STEP.indexOf(part));

  const p = Object.fromEntries(pendant.beads.map((b) => [b.id, b]));

  return (
    <section className="rosary-x" aria-label="Terço interativo">
      <div className={`rosary-x-figure fx-assembly ${assembled ? '' : 'is-exploded'}`}>
        <svg viewBox="0 0 240 320" role="group" aria-label="Toque numa parte do terço">
          <path className="rosary-x-string" d={`M${CX} ${loop.medal.y + 10}V${pendant.cross.y}`} />

          {/* dezenas: a área de toque é uma faixa larga e invisível ao longo do laço */}
          <g className={`${cls('dezenas')} fx-part`} style={{ '--dx': '0px', '--dy': '-36px', '--i': 5 }} onClick={() => pick('dezenas')}>
            <path className="rosary-x-hit-stroke" d={loop.d} />
            <path className="rosary-x-string" d={loop.d} />
            {loop.beads.map((b) => (
              <circle key={b.order} className="rosary-x-bead" cx={b.x} cy={b.y} r={b.large ? 6.2 : 4} />
            ))}
          </g>

          <g className={`${cls('medalha')} fx-part`} style={{ '--dx': '0px', '--dy': '26px', '--i': 4 }} onClick={() => pick('medalha')}>
            <circle className="rosary-x-hit" cx={CX} cy={loop.medal.y + 2} r="15" />
            <circle className="rosary-x-medal" cx={CX} cy={loop.medal.y + 2} r="9.5" />
            <path className="rosary-x-mark" d={`M${CX} ${loop.medal.y - 3}v10M${CX - 4} ${loop.medal.y + 1}h8`} />
          </g>

          <g className={`${cls('gloria')} fx-part`} style={{ '--dx': '-60px', '--dy': '-6px', '--i': 3 }} onClick={() => pick('gloria')}>
            <circle className="rosary-x-hit" cx={CX} cy={p.gloria.y} r="11" />
            <circle className="rosary-x-bead" cx={CX} cy={p.gloria.y} r="6.2" />
          </g>

          <g className={`${cls('aves')} fx-part`} style={{ '--dx': '60px', '--dy': '14px', '--i': 2 }} onClick={() => pick('aves')}>
            <rect className="rosary-x-hit" x={CX - 12} y={p['ave-1'].y - 8} width="24" height={p['ave-3'].y - p['ave-1'].y + 16} rx="10" />
            {['ave-1', 'ave-2', 'ave-3'].map((id) => (
              <circle key={id} className="rosary-x-bead" cx={CX} cy={p[id].y} r="4" />
            ))}
          </g>

          <g className={`${cls('pai')} fx-part`} style={{ '--dx': '-60px', '--dy': '16px', '--i': 1 }} onClick={() => pick('pai')}>
            <circle className="rosary-x-hit" cx={CX} cy={p.pai.y} r="11" />
            <circle className="rosary-x-bead" cx={CX} cy={p.pai.y} r="6.2" />
          </g>

          <g className={`${cls('cruz')} fx-part`} style={{ '--dx': '0px', '--dy': '40px', '--i': 0 }} onClick={() => pick('cruz')}>
            <rect className="rosary-x-hit" x={CX - 18} y={pendant.cross.y - 6} width="36" height="48" rx="6" />
            <path className="rosary-x-cross" d={`M${CX} ${pendant.cross.y}v36M${CX - 12} ${pendant.cross.y + 11}h24`} />
          </g>
        </svg>
      </div>

      <div className="rosary-x-info" aria-live="polite">
        <span className="rosary-x-count">
          Passo {current + 1} de {steps.length}
        </span>
        <span className="rosary-x-tags">
          <span className="bead-tag">{step.bead}</span>
          {step.beadBadge && <span className="action-tag">{step.beadBadge}</span>}
        </span>
        <h4>{step.action}</h4>
        <p>{step.summary}</p>

        <div className="rosary-x-actions">
          <button type="button" className="fx-small-btn" onClick={() => setPicked(Math.max(current - 1, 0))} disabled={current === 0}>
            <ChevronLeft size={16} aria-hidden="true" />
            Anterior
          </button>
          <button
            type="button"
            className="fx-small-btn"
            onClick={() => setPicked(Math.min(current + 1, steps.length - 1))}
            disabled={current === steps.length - 1}
          >
            Próximo
            <ChevronRight size={16} aria-hidden="true" />
          </button>
          <button type="button" className="rosary-x-open" onClick={() => onOpenStep(step.id)}>
            <BookOpen size={16} aria-hidden="true" />
            Ver a oração deste passo
          </button>
        </div>
        <p className="rosary-x-hint">Toque numa parte do terço para ver o que rezar nela.</p>
      </div>
    </section>
  );
}
