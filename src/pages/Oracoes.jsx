import { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import RosaryGuide from '../components/RosaryGuide';
import SaoBentoSection from '../components/SaoBentoSection';
import Candle from '../components/anim/Candle';
import { AmenButton } from '../components/anim/AnimatedIcons';
import { LoadMoreButton } from '../components/LoadMore';
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

const categories = ['Todas', 'Diárias', 'Marianas', 'Santos', 'Sacramentais', 'Terço'];

const SECTIONS = [
  { id: 'terco', label: 'Terço Tradicional' },
  { id: 'nordico', label: 'Terço Nórdico' },
  { id: 'oracoes', label: 'Orações' },
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
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeIntention, setActiveIntention] = useState(null);
  const [activeMoment, setActiveMoment] = useState(null);
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    return prayers.filter((p) => {
      const saintName = p.saint ? getSaint(p.saint)?.name ?? '' : '';
      const matchesCategory = activeCategory === 'Todas' || p.category === activeCategory;
      const matchesIntention = !activeIntention || p.intentions?.includes(activeIntention);
      const matchesMoment = !activeMoment || p.moments?.includes(activeMoment);
      const matchesQuery = normalizeText(`${p.category} ${p.title} ${p.text} ${saintName}`).includes(q);
      return matchesCategory && matchesIntention && matchesMoment && matchesQuery;
    });
  }, [query, activeCategory, activeIntention, activeMoment]);

  // Com busca ou filtro ativo, mostra todas as orações encontradas.
  const isFiltering =
    query.trim() !== '' || activeCategory !== 'Todas' || activeIntention !== null || activeMoment !== null;
  const { listed: listedPrayers, remaining, showMore } = useLoadMore(filtered, PRAYERS_PAGE_SIZE, {
    showAll: isFiltering,
  });

  // Santos ligados à intenção escolhida aparecem em destaque.
  const intentionSaints = activeIntention ? saints.filter((s) => s.intentions.includes(activeIntention)) : [];

  // A aba Santos mudou para a Escola da Fé.
  if (searchParams.get('secao') === 'santos') return <Navigate to="/home/escola-da-fe?secao=santos" replace />;

  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Um caminho de oração</span>
          <h1 className="section-title">Terço e Orações</h1>
        </div>
        <div className="candles">
          <Candle />
          <Candle />
          <Candle />
        </div>
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

            <SaoBentoSection />

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

            <div className="faq-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="intention-filter">
              <p className="intention-filter-title">Quando rezar?</p>
              <div className="intention-filter-list">
                {moments.map((m) => (
                  <button
                    key={m.id}
                    className={`intention-chip ${activeMoment === m.id ? 'active' : ''}`}
                    onClick={() => setActiveMoment(activeMoment === m.id ? null : m.id)}
                    aria-pressed={activeMoment === m.id}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="intention-filter">
              <p className="intention-filter-title">Para que você quer rezar?</p>
              <div className="intention-filter-list">
                {intentions.map((i) => (
                  <button
                    key={i.id}
                    className={`intention-chip ${activeIntention === i.id ? 'active' : ''}`}
                    onClick={() => setActiveIntention(activeIntention === i.id ? null : i.id)}
                    aria-pressed={activeIntention === i.id}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            </div>

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

            {filtered.length === 0 && (
              <p className="lead" style={{ textAlign: 'center', marginTop: '2rem' }}>
                Nenhuma oração encontrada.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
