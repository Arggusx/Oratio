import { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import RosaryGuide from '../components/RosaryGuide';
import SaoBentoSection from '../components/SaoBentoSection';
import ConfessionGuide from '../components/ConfessionGuide';
import Candle from '../components/anim/Candle';
import { AmenButton } from '../components/anim/AnimatedIcons';
import { LoadMoreButton } from '../components/LoadMore';
import FilterPanel from '../components/FilterPanel';
import { useLoadMore } from '../utils/useLoadMore';
import { traditionalRosaryData, nordicRosaryData } from '../data/rosaryData';
import { prayers, moments } from '../data/prayers';
import { saints, intentions, getSaint } from '../data/saints';
import { normalizeText } from '../utils/liturgicalCalendar';

function PrayerAccordion({ prayer, isOpen, onToggle }) {
  const saint = prayer.saint ? getSaint(prayer.saint) : null;

  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`}>
      <button className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <small className="prayer-badge">{prayer.category}</small>
          <span>{prayer.title}</span>
        </span>
        <ChevronDown size={18} className="accordion-icon" />
      </button>
      <div className="accordion-content">
        <div>
          <div className="accordion-body">
            <p className="prayer-accordion-text" dangerouslySetInnerHTML={{ __html: prayer.text }} />
            {prayer.latin && (
              <p className="prayer-accordion-latin" lang="la">
                <strong>Em latim:</strong> {prayer.latin}
              </p>
            )}
            {prayer.note && <p className="prayer-accordion-note">{prayer.note}</p>}
            <AmenButton />
            {saint && (
              <Link to={`/home/santos/${saint.slug}`} className="prayer-saint-link">
                Conheça {saint.name}
                <ChevronRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quantas orações aparecem antes do botão "Ver mais".
const PRAYERS_PAGE_SIZE = 10;

const categories = ['Diárias', 'Marianas', 'Santos', 'Sacramentais', 'Terço'];

const filterGroups = [
  { id: 'category', label: 'Categoria', options: categories.map((c) => ({ id: c, label: c })) },
  { id: 'moment', label: 'Quando rezar?', options: moments },
  { id: 'intention', label: 'Para que você quer rezar?', options: intentions },
];

function matchesFilters(p, { category, moment, intention }) {
  return (
    (!category || p.category === category) &&
    (!moment || p.moments?.includes(moment)) &&
    (!intention || p.intentions?.includes(intention))
  );
}

const SECTIONS = [
  { id: 'terco', label: 'Terço Tradicional' },
  { id: 'nordico', label: 'Terço Nórdico' },
  { id: 'oracoes', label: 'Orações' },
  { id: 'confissao', label: 'Confissão' },
];

// Auréola sobre uma figura: ícone do cartão que leva à aba Santos.
function HaloIcon() {
  return (
    <svg className="feature-card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <ellipse cx="24" cy="9.5" rx="9" ry="3" className="halo" />
      <circle cx="24" cy="19" r="6" className="figure" />
      <path d="M12 42c0-8 5.4-13.5 12-13.5S36 34 36 42" className="figure" />
      <path d="M24 31v8M20.5 34.5h7" className="figure" />
    </svg>
  );
}

export default function Oracoes() {
  // A aba fica na URL (?secao=oracoes) para poder ser compartilhada.
  const [searchParams, setSearchParams] = useSearchParams();
  const section = SECTIONS.some((s) => s.id === searchParams.get('secao')) ? searchParams.get('secao') : 'terco';
  const setSection = (id) => {
    setSearchParams(id === 'terco' ? {} : { secao: id }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ category: null, moment: null, intention: null });
  const [openId, setOpenId] = useState(null);

  // A busca vale também para a contagem que aparece no botão "Aplicar filtros".
  const searched = useMemo(() => {
    const q = normalizeText(query);
    return prayers.filter((p) => {
      const saintName = p.saint ? getSaint(p.saint)?.name ?? '' : '';
      return normalizeText(`${p.category} ${p.title} ${p.text} ${saintName}`).includes(q);
    });
  }, [query]);
  const filtered = useMemo(() => searched.filter((p) => matchesFilters(p, filters)), [searched, filters]);

  // Com busca ou filtro ativo, mostra todas as orações encontradas.
  const isFiltering = query.trim() !== '' || Object.values(filters).some(Boolean);
  const { listed: listedPrayers, remaining, showMore } = useLoadMore(filtered, PRAYERS_PAGE_SIZE, {
    showAll: isFiltering,
  });

  // Santos ligados à intenção escolhida aparecem em destaque.
  const intentionSaints = filters.intention ? saints.filter((s) => s.intentions.includes(filters.intention)) : [];

  // A aba Santos mudou para a Escola da Fé.
  if (searchParams.get('secao') === 'santos') return <Navigate to="/home/escola-da-fe?secao=santos" replace />;

  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Um caminho de oração</span>
          <h1 className="section-title">Terço e Orações</h1>
        </div>
        <Candle />
      </div>
      <p className="lead">
        Aprenda a rezar passo a passo, escolha sua devoção ou consulte orações tradicionais.
      </p>

      <div className="subnav-segmented" role="tablist" aria-label="Seções de Terço e Orações">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={section === s.id}
            className={section === s.id ? 'active' : ''}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="prayer-layout-refactored">
        {section === 'terco' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <RosaryGuide layoutData={traditionalRosaryData} />
          </motion.div>
        )}

        {section === 'nordico' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <RosaryGuide layoutData={nordicRosaryData} />
          </motion.div>
        )}

        {section === 'oracoes' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="prayers-search-section"
          >
            {/* ── Destaque: leva à aba Santos ── */}
            <Link to="/home/escola-da-fe?secao=santos" className="feature-card">
              <HaloIcon />
              <span className="feature-card-text">
                <span className="feature-card-eyebrow">Santos e intercessores</span>
                <strong>Conheça a história de cada santo</strong>
                <span>
                  {saints.length} santos, cada um com uma página própria: vida, data da festa e orações
                </span>
              </span>
              <ArrowRight size={20} className="feature-card-arrow" aria-hidden="true" />
            </Link>

            {/* ── Busca e filtros ── */}
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                className="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar uma oração por nome, santo, palavra ou categoria..."
                aria-label="Buscar oração"
              />
            </div>

            <FilterPanel
              groups={filterGroups}
              values={filters}
              onApply={setFilters}
              countResults={(draft) => searched.filter((p) => matchesFilters(p, draft)).length}
            />

            {intentionSaints.length > 0 && (
              <p className="intention-saints">
                Santos invocados para isso:{' '}
                {intentionSaints.map((s, idx) => (
                  <span key={s.slug}>
                    {idx > 0 && ', '}
                    <Link to={`/home/santos/${s.slug}`}>{s.name}</Link>
                  </span>
                ))}
              </p>
            )}

            <div className="prayers-accordion-list">
              {listedPrayers.map((prayer) => (
                <PrayerAccordion
                  key={prayer.id}
                  prayer={prayer}
                  isOpen={openId === prayer.id}
                  onToggle={() => setOpenId(openId === prayer.id ? null : prayer.id)}
                />
              ))}
            </div>

            <LoadMoreButton remaining={remaining} onClick={showMore} label="Ver mais orações" />

            {/* São Bento vem depois da lista, para a busca ficar logo no começo da aba. */}
            <SaoBentoSection />

            {filtered.length === 0 && (
              <p className="lead" style={{ textAlign: 'center', marginTop: '2rem' }}>
                Nenhuma oração encontrada.
              </p>
            )}
          </motion.div>
        )}
        {section === 'confissao' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <ConfessionGuide
              header={
                <header className="rosary-header">
                  <h2 className="rosary-title">Exame de consciência</h2>
                  <p className="rosary-intro">
                    Prepare-se para a confissão: reze, marque o que se aplica a você e leve a lista com você.
                  </p>
                </header>
              }
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}
