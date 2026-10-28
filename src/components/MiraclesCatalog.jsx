import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import { eucharisticMiracles, ERAS, RECOGNITION } from '../data/eucharisticMiracles';
import { LoadMoreButton } from './LoadMore';
import { useLoadMore } from '../utils/useLoadMore';
import FilterPanel from './FilterPanel';

const PAGE_SIZE = 6;

const byYear = [...eucharisticMiracles].sort((a, b) => a.year - b.year);

const countries = Object.entries(
  byYear.reduce((acc, m) => ({ ...acc, [m.country]: (acc[m.country] ?? 0) + 1 }), {})
).sort(([a], [b]) => a.localeCompare(b, 'pt-BR'));

const filterGroups = [
  { id: 'country', label: 'País', options: countries.map(([name, count]) => ({ id: name, label: `${name} (${count})` })) },
  { id: 'era', label: 'Época', options: ERAS.map((e) => ({ id: e.id, label: e.label })) },
];

function matchesFilters(m, { country, era }) {
  const eraTest = ERAS.find((e) => e.id === era)?.test;
  return (!country || m.country === country) && (!eraTest || eraTest(m.year));
}

/** Catálogo de milagres eucarísticos, no espírito da exposição de São Carlo Acutis. */
export default function MiraclesCatalog() {
  const [filters, setFilters] = useState({ country: null, era: null });

  const shown = useMemo(() => byYear.filter((m) => matchesFilters(m, filters)), [filters]);

  const { listed, remaining, showMore } = useLoadMore(shown, PAGE_SIZE, {
    showAll: Object.values(filters).some(Boolean),
  });

  return (
    <section className="miracles-section" aria-labelledby="miracles-title">
      <header className="miracles-intro">
        <h2 id="miracles-title" className="mass-intro-title">Milagres eucarísticos pelo mundo</h2>
        <p>
          Ainda adolescente, <Link to="/home/santos/sao-carlo-acutis">São Carlo Acutis</Link> pesquisou e reuniu
          numa exposição os milagres eucarísticos reconhecidos pela Igreja ao redor do mundo, para ajudar as
          pessoas a crer que Jesus está realmente presente na Eucaristia. Aqui estão alguns dos mais conhecidos.
        </p>
        <blockquote className="miracles-quote">
          “Quanto mais recebermos a Eucaristia, mais nos tornaremos semelhantes a Jesus.”
          <cite>— São Carlo Acutis</cite>
        </blockquote>
      </header>

      <FilterPanel
        groups={filterGroups}
        values={filters}
        onApply={setFilters}
        countResults={(draft) => byYear.filter((m) => matchesFilters(m, draft)).length}
      />

      <p className="miracles-count" aria-live="polite">
        {shown.length === 1 ? '1 milagre' : `${shown.length} milagres`}
      </p>

      <div className="miracles-grid">
        {listed.map((m, index) => (
          <motion.article
            key={m.id}
            className="miracle-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min((index % PAGE_SIZE) * 0.03, 0.3) }}
          >
            <div className="miracle-card-top">
              <span className="miracle-year">{m.yearLabel}</span>
              <span className={`miracle-recognition is-${m.recognition}`}>{RECOGNITION[m.recognition]}</span>
            </div>
            <h3>{m.place}</h3>
            <p className="miracle-country">{m.country}</p>
            <p className="miracle-summary">{m.summary}</p>
            <p className="miracle-where">
              <MapPin size={14} aria-hidden="true" />
              <span>{m.whereToSee}</span>
            </p>
            {m.link && (
              <a className="miracle-link" href={m.link} target="_blank" rel="noopener noreferrer">
                Ver fotos e detalhes na exposição de Carlo
                <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
          </motion.article>
        ))}
        {shown.length === 0 && <p className="lead">Nenhum milagre deste país nesta época.</p>}
      </div>

      <LoadMoreButton remaining={remaining} onClick={showMore} label="Ver mais milagres" />

      <footer className="miracles-footer">
        <p>
          A fé na presença real de Jesus na Eucaristia não depende de milagres: eles são sinais que Deus concede
          para fortalecer a fé, e nenhum católico é obrigado a crer em um milagre específico. Mesmo quando a
          Igreja aprova a devoção, ela apenas declara que nada ali se opõe à fé.
        </p>
        <a
          className="miracles-external"
          href="https://www.miracolieucaristici.org/pr/Liste/list.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver a exposição completa de Carlo Acutis
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
