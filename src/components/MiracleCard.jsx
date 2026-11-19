import { motion } from 'framer-motion';
import { ExternalLink, MapPin, MapPinCheck } from 'lucide-react';
import { journey } from '../utils/journeyStore';
import { JORNADA_ATIVA } from '../utils/features';
import { RECOGNITION } from '../data/eucharisticMiracles';

/**
 * O cartão de um milagre: o nome, o lugar, o que aconteceu, onde ver e "Marcar no meu mapa".
 * "anchor" dá ao cartão o id #milagre-<id> (só o catálogo usa; o painel do globo não, para não repetir o id).
 */
export default function MiracleCard({ miracle: m, visited, delay = 0, featured = false, anchor = true }) {
  const seen = visited.includes(m.id);
  return (
    <motion.article
      id={anchor ? `milagre-${m.id}` : undefined}
      className={`miracle-card ${featured ? 'is-focused' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="miracle-card-top">
        <span className="miracle-year">{m.yearLabel}</span>
        <span className={`miracle-recognition is-${m.recognition}`}>{RECOGNITION[m.recognition]}</span>
      </div>
      <h3>{m.name}</h3>
      <p className="miracle-country">
        {m.place} · {m.country}
      </p>
      <p className="miracle-summary">{m.summary}</p>
      <p className="miracle-where">
        <MapPin size={14} aria-hidden="true" />
        <span>{m.whereToSee}</span>
      </p>
      {m.link && (
        <a
          className="miracle-link"
          href={m.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => journey.markMiracle(m.id)}
        >
          Ver fotos e detalhes na exposição de Carlo
          <ExternalLink size={14} aria-hidden="true" />
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      )}
      {/* Marca o milagre no mapa da Jornada (também acontece ao abrir as fotos). Sem a Jornada, o mapa não aparece. */}
      {JORNADA_ATIVA && (
        <button
          type="button"
          className={`miracle-visit ${seen ? 'is-done' : ''}`}
          onClick={() => journey.markMiracle(m.id, !seen)}
          aria-pressed={seen}
        >
          <MapPinCheck size={14} aria-hidden="true" />
          {seen ? 'No seu mapa' : 'Marcar no meu mapa'}
        </button>
      )}
    </motion.article>
  );
}
