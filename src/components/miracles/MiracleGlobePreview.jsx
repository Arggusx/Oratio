import { Globe2, ArrowRight } from 'lucide-react';
import { eucharisticMiracles } from '../../data/eucharisticMiracles';
import { JORNADA_ATIVA } from '../../utils/features';

/* Posição de um milagre na textura equirretangular (em % da largura de uma cópia e da altura). */
const dots = eucharisticMiracles.map((m) => ({
  id: m.id,
  left: ((m.coords[1] + 180) / 360) * 100,
  top: ((90 - m.coords[0]) / 180) * 100,
}));

const countryCount = new Set(eucharisticMiracles.map((m) => m.country)).size;

/** Carrega o código do globo antes do clique (ao passar o mouse ou focar), para abrir mais rápido. */
const preloadMiracleGlobe = () => import('./MiracleGlobe');

/**
 * Cartão de entrada do globo. Não usa WebGL: é a textura do globo correndo dentro de um círculo,
 * com os pontos dos milagres por cima. O globo 3D de verdade só é baixado no clique.
 */
export default function MiracleGlobePreview({ onOpen, visitedCount = 0 }) {
  return (
    <button
      type="button"
      className="globe-preview"
      onClick={onOpen}
      onPointerEnter={preloadMiracleGlobe}
      onFocus={preloadMiracleGlobe}
      aria-haspopup="dialog"
    >
      <span className="globe-preview-sphere" aria-hidden="true">
        <span className="globe-preview-strip">
          {[0, 1].map((copy) => (
            <span key={copy} className="globe-preview-map">
              {dots.map((d) => (
                <span key={d.id} className="globe-preview-dot" style={{ left: `${d.left}%`, top: `${d.top}%` }} />
              ))}
            </span>
          ))}
        </span>
        <span className="globe-preview-shade" />
      </span>

      <span className="globe-preview-text">
        <span className="globe-preview-eyebrow">
          <Globe2 size={14} aria-hidden="true" />
          Globo 3D
        </span>
        <strong>Veja os milagres no globo</strong>
        <span>
          {eucharisticMiracles.length} milagres em {countryCount} países. Gire, aproxime e busque por milagre ou por
          lugar.
          {JORNADA_ATIVA && visitedCount > 0 &&` Você já marcou ${visitedCount}.`}
        </span>
        <span className="globe-preview-cta">
          Abrir o globo
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
