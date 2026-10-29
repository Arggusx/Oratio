import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MapPinCheck } from 'lucide-react';
import { eucharisticMiracles } from '../../data/eucharisticMiracles';
import { miracleMapRegions } from '../../data/miracleMapRegions';
import { journey, useJourney } from '../../utils/journeyStore';
import GameIntro from '../GameIntro';

const project = (region, [lat, lng]) => ({ x: (lng - region.lng0) * region.k, y: (region.lat1 - lat) * region.k });

const inRegion = (region, [lat, lng]) => {
  const { x, y } = project(region, [lat, lng]);
  return x >= 0 && x <= region.width && y >= 0 && y <= region.height;
};

/**
 * Mapa de peregrinação: os continentes e as fronteiras desenhados (Natural Earth) e, por cima, um alfinete para
 * cada milagre eucarístico do catálogo. Os visitados acendem; um toque mostra o milagre.
 */
export default function MiracleMap() {
  const { miracles: visited } = useJourney();
  const [selected, setSelected] = useState(null);
  const current = eucharisticMiracles.find((m) => m.id === selected);

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
          'Cada alfinete é um lugar onde aconteceu um milagre eucarístico.',
          'Toque num alfinete para ler o que aconteceu ali e onde as relíquias estão hoje.',
          'Marque como visitado depois de ler, ou abra as fotos da exposição de São Carlo Acutis: o alfinete acende no mapa.',
        ]}
      />

      <div className="miracle-maps">
        {Object.entries(miracleMapRegions).map(([id, region]) => (
          <figure key={id} className="miracle-map">
            <svg viewBox={`0 0 ${region.width} ${region.height}`} role="group" aria-label={`Milagres: ${region.label}`}>
              <rect className="map-sea" width={region.width} height={region.height} />
              <path className="map-land" d={region.land} />
              <path className="map-borders" d={region.borders} />
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
                      <circle className="map-pin-hit" r="11" />
                      <circle className="map-pin-ring" r="7" />
                      <path className="map-pin-drop" d="M0 0c-4-5-6-8-6-11a6 6 0 0 1 12 0c0 3-2 6-6 11z" />
                      <circle className="map-pin-dot" cy="-11" r="2.2" />
                    </g>
                  );
                })}
            </svg>
            <figcaption>{region.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="map-info" aria-live="polite">
        {current ? (
          <article className="map-info-card">
            <span className="miracle-year">{current.yearLabel}</span>
            <h3>
              {current.place} <small>({current.country})</small>
            </h3>
            <p>{current.summary}</p>
            <p className="miracle-where">
              <MapPin size={14} aria-hidden="true" />
              <span>{current.whereToSee}</span>
            </p>
            <div className="map-info-actions">
              <button
                type="button"
                className={`miracle-visit ${visited.includes(current.id) ? 'is-done' : ''}`}
                onClick={() => journey.markMiracle(current.id, !visited.includes(current.id))}
                aria-pressed={visited.includes(current.id)}
              >
                <MapPinCheck size={14} aria-hidden="true" />
                {visited.includes(current.id) ? 'Visitado' : 'Marcar como visitado'}
              </button>
              <Link to="/home/escola-da-fe" className="map-info-link">
                Ver o catálogo
              </Link>
            </div>
          </article>
        ) : (
          <p className="map-hint">Toque num alfinete para ver o milagre.</p>
        )}
      </div>

      <p className="map-credit">Mapa: Natural Earth (domínio público).</p>
    </section>
  );
}
