import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useJourney } from '../utils/journeyStore';
import { eucharisticMiracles, ERAS } from '../data/eucharisticMiracles';
import MiracleCard from './MiracleCard';
import MiracleGlobePreview from './miracles/MiracleGlobePreview';

// O globo 3D (globe.gl + three.js) só é baixado quando alguém abre.
const MiracleGlobe = lazy(() => import('./miracles/MiracleGlobe'));
import { LoadMoreButton } from './LoadMore';
import { useLoadMore } from '../utils/useLoadMore';
import FilterPanel from './FilterPanel';

const PAGE_SIZE = 6;

const byYear = [...eucharisticMiracles].sort((a, b) => a.year - b.year);

const countries = Object.entries(
  byYear.reduce((acc, m) => ({ ...acc, [m.country]: (acc[m.country] ?? 0) + 1 }), {})
).sort(([a], [b]) => a.localeCompare(b, 'pt-BR'));

const filterGroups = [
  { id: 'country', label: 'País', options: countries.map(([name]) => ({ id: name, label: name })) },
  { id: 'era', label: 'Época', options: ERAS.map((e) => ({ id: e.id, label: e.label })) },
];

function matchesFilters(m, { country, era }) {
  const eraTest = ERAS.find((e) => e.id === era)?.test;
  return (!country || m.country === country) && (!eraTest || eraTest(m.year));
}

/**
 * Catálogo de milagres eucarísticos, no espírito da exposição de São Carlo Acutis.
 * "focusId" vem do mapa da Jornada: esse milagre abre em destaque no topo, antes da lista.
 */
export default function MiraclesCatalog({ focusId = null }) {
  const { miracles: visited } = useJourney();
  const [filters, setFilters] = useState({ country: null, era: null });
  const focused = byYear.find((m) => m.id === focusId);
  const [globeOpen, setGlobeOpen] = useState(false);
  const globeButton = useRef(null);

  const closeGlobe = () => {
    setGlobeOpen(false);
    // Devolve o foco ao cartão que abriu o globo.
    requestAnimationFrame(() => globeButton.current?.querySelector('button')?.focus());
  };

  const shown = useMemo(() => byYear.filter((m) => matchesFilters(m, filters)), [filters]);

  const { listed, remaining, showMore } = useLoadMore(shown, PAGE_SIZE, {
    showAll: Object.values(filters).some(Boolean),
  });

  // Vindo do mapa, a página começa no milagre escolhido.
  useEffect(() => {
    if (focused) document.getElementById('milagre-aberto')?.scrollIntoView({ block: 'start' });
  }, [focused]);

  return (
    <section className="miracles-section" aria-labelledby="miracles-title">
      {focused && (
        <section id="milagre-aberto" className="miracle-focus" aria-label={`Milagre escolhido no mapa: ${focused.name}`}>
          <span className="eyebrow">Escolhido no mapa</span>
          <MiracleCard miracle={focused} visited={visited} featured />
          <a href="#miracles-title" className="miracle-focus-more">
            Ver todos os milagres
          </a>
        </section>
      )}

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

      <div ref={globeButton}>
        <MiracleGlobePreview onOpen={() => setGlobeOpen(true)} visitedCount={visited.length} />
      </div>
      {/* Portal no <body>: a página anima com transform, o que prenderia o position: fixed do globo. */}
      {globeOpen &&
        createPortal(
          <Suspense
            fallback={
              <div className="globe-overlay">
                <div className="globe-loading" role="status">
                  Preparando o globo…
                </div>
              </div>
            }
          >
            <MiracleGlobe onClose={closeGlobe} />
          </Suspense>,
          document.body
        )}

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
        {listed
          .filter((m) => m.id !== focused?.id)
          .map((m, index) => (
            <MiracleCard key={m.id} miracle={m} visited={visited} delay={Math.min((index % PAGE_SIZE) * 0.03, 0.3)} />
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
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </footer>
    </section>
  );
}
