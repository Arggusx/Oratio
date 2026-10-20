import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import RosaryGuide from '../components/RosaryGuide';
import SaoBentoSection from '../components/SaoBentoSection';
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

const categories = ['Todas', 'Diárias', 'Marianas', 'Santos', 'Sacramentais', 'Terço'];

export default function Oracoes() {
  const [section, setSection] = useState('terco');
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

  // Santos ligados à intenção escolhida aparecem em destaque.
  const intentionSaints = activeIntention ? saints.filter((s) => s.intentions.includes(activeIntention)) : [];

  return (
    <main className="page">
      <span className="eyebrow">Um caminho de oração</span>
      <h1 className="section-title">Terço e Orações</h1>
      <p className="lead">
        Aprenda a rezar passo a passo, escolha sua devoção ou consulte orações tradicionais.
      </p>

      <div className="subnav-segmented">
        <button className={section === 'terco' ? 'active' : ''} onClick={() => setSection('terco')}>
          Terço Tradicional
        </button>
        <button className={section === 'nordico' ? 'active' : ''} onClick={() => setSection('nordico')}>
          Terço Nórdico
        </button>
        <button className={section === 'oracoes' ? 'active' : ''} onClick={() => setSection('oracoes')}>
          Orações
        </button>
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
            <SaoBentoSection />

            {/* ── Santos e intercessores ── */}
            <section className="saints-strip" aria-labelledby="saints-strip-title">
              <div className="saints-strip-head">
                <h2 id="saints-strip-title" className="saints-strip-title">Santos e intercessores</h2>
                <Link to="/home/santos" className="prayer-saint-link">
                  Ver todos
                  <ChevronRight size={15} />
                </Link>
              </div>
              <div className="saints-strip-list">
                {saints.map((s) => (
                  <Link key={s.slug} to={`/home/santos/${s.slug}`} className="saint-chip">
                    <span className="saint-chip-initial" aria-hidden="true">{s.name.replace(/^(São|Santa|Santo)\s/, '').charAt(0)}</span>
                    <span>{s.name}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Busca e filtros ── */}
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                className="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar uma oração por nome, santo, palavra ou categoria..."
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
              {filtered.map((prayer) => (
                <PrayerAccordion
                  key={prayer.id}
                  prayer={prayer}
                  isOpen={openId === prayer.id}
                  onToggle={() => setOpenId(openId === prayer.id ? null : prayer.id)}
                />
              ))}
            </div>

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
