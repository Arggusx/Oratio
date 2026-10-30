import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Expand, MapPin, MapPinCheck, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { eucharisticMiracles } from '../../data/eucharisticMiracles';
import { miracleMapRegions } from '../../data/miracleMapRegions';
import { journey, useJourney } from '../../utils/journeyStore';
import GameIntro from '../GameIntro';

const MAP = miracleMapRegions.mundo;
const FULL = { x: 0, y: 0, w: MAP.width, h: MAP.height };
const MAX_ZOOM = 8;

const project = ([lat, lng]) => ({ x: (lng - MAP.lng0) * MAP.k, y: (MAP.lat1 - lat) * MAP.k });

/** O desenho do mapa com os alfinetes. "scale" mantém os alfinetes do mesmo tamanho em qualquer zoom. */
export function MapDrawing({ view = FULL, visited, selected, onSelect, scale = 1, interactive = true }) {
  return (
    <svg
      viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
      preserveAspectRatio="xMidYMid meet"
      role={interactive ? 'group' : 'img'}
      aria-label="Mapa dos milagres eucarísticos"
    >
      <rect className="map-sea" x={-MAP.width} y={-MAP.height} width={MAP.width * 3} height={MAP.height * 3} />
      <path className="map-land" d={MAP.land} />
      <path className="map-borders" d={MAP.borders} />
      {eucharisticMiracles.map((m) => {
        const { x, y } = project(m.coords);
        const seen = visited.includes(m.id);
        return (
          <g
            key={m.id}
            className={`map-pin ${seen ? 'is-visited' : ''} ${selected === m.id ? 'is-selected' : ''}`}
            transform={`translate(${x} ${y}) scale(${scale})`}
            {...(interactive && {
              tabIndex: 0,
              role: 'button',
              'aria-label': `${m.place}, ${m.country}${seen ? ', visitado' : ''}`,
              onClick: (e) => {
                e.stopPropagation();
                onSelect(m.id);
              },
              onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onSelect(m.id),
            })}
          >
            <circle className="map-pin-hit" r="13" />
            <circle className="map-pin-ring" r="8" />
            <path className="map-pin-drop" d="M0 0c-5-6-8-10-8-14a8 8 0 0 1 16 0c0 4-3 8-8 14z" />
            <circle className="map-pin-dot" cy="-14" r="3" />
          </g>
        );
      })}
    </svg>
  );
}

/** Cartão do milagre escolhido, com "Marcar como visitado". */
function MiracleInfo({ miracle, visited, onClose }) {
  const seen = visited.includes(miracle.id);
  return (
    <article className="map-info-card">
      {onClose && (
        <button type="button" className="filter-sheet-close map-info-close" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>
      )}
      <span className="miracle-year">{miracle.yearLabel}</span>
      <h3>
        {miracle.place} <small>({miracle.country})</small>
      </h3>
      <p>{miracle.summary}</p>
      <p className="miracle-where">
        <MapPin size={14} aria-hidden="true" />
        <span>{miracle.whereToSee}</span>
      </p>
      <div className="map-info-actions">
        <button
          type="button"
          className={`miracle-visit ${seen ? 'is-done' : ''}`}
          onClick={() => journey.markMiracle(miracle.id, !seen)}
          aria-pressed={seen}
        >
          <MapPinCheck size={14} aria-hidden="true" />
          {seen ? 'Visitado' : 'Marcar como visitado'}
        </button>
        <Link to="/home/escola-da-fe" className="map-info-link">
          Ver o catálogo
        </Link>
      </div>
    </article>
  );
}

/**
 * O mapa aberto em tela cheia: arrastar para se mover, roda do mouse ou pinça para aproximar,
 * e os botões + e − para quem prefere tocar.
 */
function MapViewer({ visited, onClose }) {
  const dialogRef = useRef(null);
  const svgBox = useRef(null);
  const pointers = useRef(new Map());
  const last = useRef(null);
  const [view, setView] = useState(FULL);
  const [selected, setSelected] = useState(null);
  const current = eucharisticMiracles.find((m) => m.id === selected);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, [onClose]);

  // Aproxima ou afasta mantendo fixo o ponto (fx, fy), em coordenadas do mapa.
  const zoomAt = useCallback((factor, fx, fy) => {
    setView((v) => {
      const w = Math.min(FULL.w, Math.max(FULL.w / MAX_ZOOM, v.w / factor));
      const h = (w / FULL.w) * FULL.h;
      const cx = fx ?? v.x + v.w / 2;
      const cy = fy ?? v.y + v.h / 2;
      const x = cx - ((cx - v.x) / v.w) * w;
      const y = cy - ((cy - v.y) / v.h) * h;
      return clamp({ x, y, w, h });
    });
  }, []);

  const clamp = (v) => ({
    ...v,
    x: Math.min(Math.max(v.x, -v.w * 0.25), FULL.w - v.w * 0.75),
    y: Math.min(Math.max(v.y, -v.h * 0.25), FULL.h - v.h * 0.75),
  });

  // Converte um ponto da tela para o mapa.
  const toMap = (clientX, clientY, v = view) => {
    const r = svgBox.current.getBoundingClientRect();
    const scale = Math.max(v.w / r.width, v.h / r.height);
    const offX = (r.width * scale - v.w) / 2;
    const offY = (r.height * scale - v.h) / 2;
    return { x: v.x - offX + (clientX - r.left) * scale, y: v.y - offY + (clientY - r.top) * scale, scale };
  };

  // Ao escolher um alfinete, o mapa se centraliza nele (um pouco acima, para o cartão não cobrir).
  const select = (id) => {
    setSelected(id);
    const { x, y } = project(eucharisticMiracles.find((m) => m.id === id).coords);
    setView((v) => clamp({ ...v, x: x - v.w / 2, y: y - v.h / 3 }));
  };

  const onWheel = (e) => {
    e.preventDefault();
    const p = toMap(e.clientX, e.clientY);
    zoomAt(e.deltaY < 0 ? 1.25 : 0.8, p.x, p.y);
  };

  // A roda do mouse precisa de um ouvinte não passivo para não rolar a página por trás.
  useEffect(() => {
    const el = svgBox.current;
    el?.addEventListener('wheel', onWheel, { passive: false });
    return () => el?.removeEventListener('wheel', onWheel);
  });

  const onPointerDown = (e) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
    last.current = null;
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const list = [...pointers.current.values()];

    if (list.length === 2) {
      // Pinça: a distância entre os dedos controla o zoom.
      const dist = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y);
      if (last.current) {
        const mid = toMap((list[0].x + list[1].x) / 2, (list[0].y + list[1].y) / 2);
        zoomAt(dist / last.current, mid.x, mid.y);
      }
      last.current = dist;
      return;
    }

    const { scale } = toMap(e.clientX, e.clientY);
    setView((v) => clamp({ ...v, x: v.x - (e.clientX - prev.x) * scale, y: v.y - (e.clientY - prev.y) * scale }));
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    last.current = null;
  };

  return (
    <dialog ref={dialogRef} className="map-viewer" aria-label="Mapa dos milagres">
      <div
        ref={svgBox}
        className="map-viewer-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <MapDrawing
          view={view}
          visited={visited}
          selected={selected}
          onSelect={select}
          scale={Math.max(0.35, view.w / FULL.w)}
        />
      </div>

      <div className="map-viewer-controls">
        <button type="button" onClick={() => zoomAt(1.5)} aria-label="Aproximar">
          <Plus size={18} />
        </button>
        <button type="button" onClick={() => zoomAt(1 / 1.5)} aria-label="Afastar">
          <Minus size={18} />
        </button>
        <button type="button" onClick={() => setView(FULL)} aria-label="Ver o mapa inteiro">
          <RotateCcw size={16} />
        </button>
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Fechar o mapa">
          <X size={18} />
        </button>
      </div>

      <p className="map-viewer-hint">Arraste para se mover · roda do mouse ou pinça para aproximar · toque num alfinete</p>

      {current && (
        <div className="map-viewer-info">
          <MiracleInfo miracle={current} visited={visited} onClose={() => setSelected(null)} />
        </div>
      )}
    </dialog>
  );
}

/**
 * Mapa de peregrinação: um cartão grande com o mapa inteiro. "Abrir o mapa" leva para a tela cheia,
 * onde dá para se mover e aproximar, com um alfinete em cada milagre (os visitados acendem).
 */
export default function MiracleMap() {
  const { miracles: visited } = useJourney();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <section className="journey-card" aria-labelledby="map-title">
      <header className="journey-card-head">
        <h2 id="map-title">Mapa dos milagres</h2>
        <p>
          Uma peregrinação pelos lugares onde a Igreja reconhece milagres eucarísticos. Você já visitou{' '}
          <strong>
            {visited.length} de {eucharisticMiracles.length}
          </strong>
          .
        </p>
      </header>

      <GameIntro
        id="mapa"
        steps={[
          'Toque em "Abrir o mapa" para vê-lo em tela cheia. Arraste para se mover e use a roda do mouse, a pinça ou os botões + e − para aproximar.',
          'Cada alfinete é um lugar onde aconteceu um milagre eucarístico. Toque nele para ler o que aconteceu ali.',
          'Depois de ler, toque em "Marcar como visitado": o alfinete acende em dourado.',
        ]}
      />

      <button type="button" className="map-card" onClick={() => setOpen(true)}>
        <MapDrawing view={FULL} visited={visited} selected={null} onSelect={() => {}} interactive={false} />
        <span className="map-card-cta">
          <Expand size={16} aria-hidden="true" /> Abrir o mapa
        </span>
      </button>

      <p className="map-credit">Mapa: Natural Earth (domínio público).</p>

      {open && <MapViewer visited={visited} onClose={close} />}
    </section>
  );
}
