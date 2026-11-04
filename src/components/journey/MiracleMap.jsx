import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Expand, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { eucharisticMiracles } from '../../data/eucharisticMiracles';
import { miracleMapRegions } from '../../data/miracleMapRegions';
import { useJourney } from '../../utils/journeyStore';
import GameIntro from '../GameIntro';

const MAP = miracleMapRegions.mundo;
const FULL = { x: 0, y: 0, w: MAP.width, h: MAP.height };
const MAX_ZOOM = 8;
// Quanto o dedo ou o mouse pode andar e ainda contar como toque (e não como arrastar o mapa).
const TAP_SLOP = 6;

const project = ([lat, lng]) => ({ x: (lng - MAP.lng0) * MAP.k, y: (MAP.lat1 - lat) * MAP.k });

/** Endereço do milagre no catálogo da Escola da Fé (o catálogo abre e rola até ele). */
const miracleHref = (id) => `/home/escola-da-fe?milagre=${id}`;

/**
 * O desenho do mapa com os alfinetes. "scale" mantém os alfinetes do mesmo tamanho em qualquer zoom.
 * "onHover" recebe o milagre e o alfinete quando o mouse passa por cima (ou o teclado foca), e null ao sair.
 */
export function MapDrawing({ view = FULL, visited, selected, onSelect, onHover, scale = 1, interactive = true }) {
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
              role: 'link',
              'aria-label': `${m.place}, ${m.country}${seen ? ', visitado' : ''}. Abrir no catálogo`,
              onClick: (e) => {
                e.stopPropagation();
                onSelect(m.id);
              },
              onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onSelect(m.id),
              onPointerEnter: (e) => e.pointerType === 'mouse' && onHover?.(m, e.currentTarget),
              onPointerLeave: () => onHover?.(null),
              onFocus: (e) => onHover?.(m, e.currentTarget),
              onBlur: () => onHover?.(null),
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

/**
 * O mapa aberto em tela cheia: arrastar para se mover, roda do mouse ou pinça para aproximar,
 * e os botões + e − para quem prefere tocar. Passar o mouse num alfinete mostra o nome do milagre;
 * tocar nele leva até o milagre no catálogo da Escola da Fé.
 */
function MapViewer({ visited, onClose }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const svgBox = useRef(null);
  const zoomInRef = useRef(null);
  const pointers = useRef(new Map());
  const last = useRef(null);
  const dragged = useRef(false);
  const start = useRef(null);
  const [view, setView] = useState(FULL);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    // Foco inicial no "+": sem isso o navegador foca o primeiro alfinete e o nome dele já abre sozinho.
    zoomInRef.current?.focus();
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

  // Tocar num alfinete (sem ter arrastado o mapa) leva até o milagre no catálogo.
  const open = (id) => {
    if (dragged.current) return;
    dialogRef.current?.close();
    navigate(miracleHref(id));
  };

  // O nome fica numa etiqueta logo acima do alfinete.
  const showName = (miracle, pin) => {
    if (!miracle) return setHover(null);
    const box = svgBox.current.getBoundingClientRect();
    const r = pin.getBoundingClientRect();
    setHover({ miracle, x: r.left + r.width / 2 - box.left, y: r.top - box.top });
  };

  const onWheel = (e) => {
    e.preventDefault();
    setHover(null);
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
    start.current = { x: e.clientX, y: e.clientY };
    dragged.current = false;
    last.current = null;
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const list = [...pointers.current.values()];
    if (!dragged.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > TAP_SLOP) {
      dragged.current = true;
      setHover(null);
      // Só prende o ponteiro quando vira arrasto, para o clique no alfinete continuar chegando nele.
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (!dragged.current) return;

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
          selected={hover?.miracle.id}
          onSelect={open}
          onHover={showName}
          scale={Math.max(0.35, view.w / FULL.w)}
        />
        {hover && (
          <span className="map-tooltip" style={{ left: hover.x, top: hover.y }} role="tooltip">
            <strong>{hover.miracle.place}</strong>
            <small>
              {hover.miracle.country} · {hover.miracle.yearLabel}
            </small>
          </span>
        )}
      </div>

      <div className="map-viewer-controls">
        <button ref={zoomInRef} type="button" onClick={() => zoomAt(1.5)} aria-label="Aproximar">
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

      <p className="map-viewer-hint">
        Arraste para se mover · roda do mouse ou pinça para aproximar · toque num alfinete para ler o milagre
      </p>
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
          'Cada alfinete é um lugar onde aconteceu um milagre eucarístico. Passe o mouse para ver o nome; toque nele para ler a história no catálogo.',
          'No catálogo, toque em "Marcar no meu mapa": o alfinete acende em dourado.',
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
