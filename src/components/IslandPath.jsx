import { Check, Lock } from 'lucide-react';
import TrailIsland from './TrailIsland';

const STEP_Y = 175; // distância vertical entre as paradas, em px
const HERO_H = 230; // espaço da ilha grande no topo

/**
 * Caminho de ilhas: a ilha grande no topo e as paradas descendo, uma à esquerda e outra à direita,
 * ligadas por uma estrada que fica acesa até a parada atual. Usado nas trilhas e nas ilhas de quiz.
 *
 * stops: [{ key, icon, title, kicker, state: 'done' | 'current' | 'locked' }]
 */
export default function IslandPath({ color, heroIcon, stops, onSelect, justUnlocked = null, stopRefs }) {
  const total = stops.length;
  const points = stops.map((_, i) => ({ x: i % 2 === 0 ? 30 : 70, y: HERO_H + i * STEP_Y + 80 }));
  const height = HERO_H + (total - 1) * STEP_Y + 200;
  const roadPath = [`M50 ${HERO_H - 20}`, `C50 ${HERO_H + 30} ${points[0].x} ${HERO_H + 20} ${points[0].x} ${points[0].y}`]
    .concat(
      points.slice(1).map((p, i) => {
        const prev = points[i];
        const midY = (prev.y + p.y) / 2;
        return `C${prev.x} ${midY} ${p.x} ${midY} ${p.x} ${p.y}`;
      })
    )
    .join(' ');
  const current = stops.findIndex((s) => s.state === 'current');
  const litUntil = current === -1 ? total - 1 : current;

  return (
    <div className="trail-map" style={{ height, '--trail': color }}>
      <svg className="trail-road" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={roadPath} vectorEffect="non-scaling-stroke" />
        <path
          className="is-lit"
          d={roadPath}
          vectorEffect="non-scaling-stroke"
          pathLength="1"
          style={{ strokeDasharray: `${(litUntil + 1) / (total + 0.4)} 1` }}
        />
      </svg>

      <div className="trail-hero">
        <TrailIsland icon={heroIcon} color={color} />
      </div>

      <ol className="trail-islands">
        {stops.map((stop, i) => {
          const status = { done: 'concluída', current: 'próxima', locked: 'trancada' }[stop.state];
          return (
            <li
              key={stop.key}
              ref={(el) => stopRefs && (stopRefs.current[i] = el)}
              className={`trail-stop is-${stop.state} ${i % 2 === 0 ? 'is-left' : 'is-right'} ${
                justUnlocked === i ? 'is-new' : ''
              }`}
              style={{ top: points[i].y, '--i': i }}
            >
              <button
                type="button"
                className="trail-stop-island"
                onClick={() => onSelect(i)}
                disabled={stop.state === 'locked'}
                aria-label={`${stop.title} (${status})`}
              >
                <span className="trail-island-float">
                  <TrailIsland icon={stop.icon} state={stop.state} color={color} />
                </span>
                {stop.state === 'done' && (
                  <span className="trail-badge is-done" aria-hidden="true">
                    <Check size={14} />
                  </span>
                )}
                {stop.state === 'locked' && (
                  <span className="trail-badge is-locked" aria-hidden="true">
                    <Lock size={12} />
                  </span>
                )}
              </button>
              <span className="trail-stop-label" aria-hidden="true">
                <small>{stop.kicker}</small>
                <strong>{stop.title}</strong>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
