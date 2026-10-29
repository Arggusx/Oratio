import { useState } from 'react';
import { Link } from 'react-router-dom';
import { eucharisticMiracles } from '../../data/eucharisticMiracles';
import { useJourney } from '../../utils/journeyStore';

// Dois recortes do mapa (latitude e longitude), onde estão os milagres do catálogo.
const REGIONS = [
  { id: 'americas', label: 'Américas', lat: [-40, 25], lng: [-110, -50] },
  { id: 'europa', label: 'Europa', lat: [37, 55], lng: [-11, 26] },
];

const W = 300;
const H = 220;

function project(region, [lat, lng]) {
  const x = ((lng - region.lng[0]) / (region.lng[1] - region.lng[0])) * W;
  const y = ((region.lat[1] - lat) / (region.lat[1] - region.lat[0])) * H;
  return { x, y };
}

const inRegion = (region, [lat, lng]) =>
  lat >= region.lat[0] && lat <= region.lat[1] && lng >= region.lng[0] && lng <= region.lng[1];

/** Mapa de peregrinação: os milagres eucarísticos visitados no catálogo aparecem acesos. */
export default function MiracleMap() {
  const { miracles: visited } = useJourney();
  const [selected, setSelected] = useState(null);
  const current = eucharisticMiracles.find((m) => m.id === selected);

  return (
    <section className="journey-card" aria-labelledby="map-title">
      <header className="journey-card-head">
        <h2 id="map-title">Mapa dos milagres</h2>
        <p>
          Cada milagre eucarístico que você visita no catálogo da Escola da Fé acende no mapa, como numa peregrinação.
          Você já visitou {visited.length} de {eucharisticMiracles.length}.
        </p>
      </header>

      <div className="miracle-maps">
        {REGIONS.map((region) => (
          <figure key={region.id} className="miracle-map">
            <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Milagres: ${region.label}`}>
              {/* Paralelos e meridianos a cada 10 graus */}
              <g className="map-grid">
                {Array.from({ length: 20 }, (_, i) => {
                  const lng = Math.ceil(region.lng[0] / 10) * 10 + i * 10;
                  if (lng > region.lng[1]) return null;
                  const { x } = project(region, [region.lat[0], lng]);
                  return <line key={`v${lng}`} x1={x} x2={x} y1="0" y2={H} />;
                })}
                {Array.from({ length: 20 }, (_, i) => {
                  const lat = Math.ceil(region.lat[0] / 10) * 10 + i * 10;
                  if (lat > region.lat[1]) return null;
                  const { y } = project(region, [lat, region.lng[0]]);
                  return <line key={`h${lat}`} x1="0" x2={W} y1={y} y2={y} />;
                })}
              </g>
              {eucharisticMiracles
                .filter((m) => inRegion(region, m.coords))
                .map((m) => {
                  const { x, y } = project(region, m.coords);
                  const seen = visited.includes(m.id);
                  return (
                    <g
                      key={m.id}
                      className={`map-pin ${seen ? 'is-visited' : ''} ${selected === m.id ? 'is-selected' : ''}`}
                      transform={`translate(${x} ${y})`}
                      tabIndex={0}
                      role="button"
                      aria-label={`${m.place}, ${m.country}${seen ? ', visitado' : ''}`}
                      onClick={() => setSelected(m.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(m.id)}
                    >
                      <circle className="map-pin-hit" r="12" />
                      <circle className="map-pin-dot" r={seen ? 5 : 4} />
                    </g>
                  );
                })}
            </svg>
            <figcaption>{region.label}</figcaption>
          </figure>
        ))}
      </div>

      <p className="map-info" aria-live="polite">
        {current ? (
          <>
            <strong>
              {current.place} ({current.country})
            </strong>{' '}
            · {current.yearLabel} · {visited.includes(current.id) ? 'visitado' : 'ainda não visitado'}.{' '}
            <Link to="/home/escola-da-fe">Ver no catálogo</Link>
          </>
        ) : (
          'Toque num ponto para ver o milagre.'
        )}
      </p>
    </section>
  );
}
