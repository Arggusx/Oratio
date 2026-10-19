import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import RosaryGuide from '../components/RosaryGuide';
import SaoBentoSection from '../components/SaoBentoSection';
import { traditionalRosaryData, nordicRosaryData } from '../data/rosaryData';
import { prayers } from '../data/prayers';

function Accordion({ title, badge, children, isOpen, onToggle }) {
  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`}>
      <button className="accordion-trigger" onClick={onToggle}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          {badge && <small className="prayer-badge">{badge}</small>}
          <span>{title}</span>
        </span>
        <ChevronDown size={18} className="accordion-icon" />
      </button>
      <div className="accordion-content">
        <div>
          <p className="accordion-body" style={{ whiteSpace: 'pre-wrap' }}>{children}</p>
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
  const [openIdx, setOpenIdx] = useState(null);

  const filtered = useMemo(() => {
    return prayers.filter(([cat, name, text]) => {
      const matchesCategory = activeCategory === 'Todas' || cat === activeCategory;
      const matchesQuery = `${cat} ${name} ${text}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <main className="page">
      <span className="eyebrow">Um caminho de oração</span>
      <h1 className="section-title">Terço e Orações</h1>
      <p className="lead">
        Aprenda a rezar passo a passo, escolha sua devoção ou consulte orações tradicionais.
      </p>

      {/* 1. NAVEGAÇÃO SUPERIOR (BARRA DE ESCOLHA / TABS) */}
      <div className="subnav-segmented">
        <button
          className={section === 'terco' ? 'active' : ''}
          onClick={() => setSection('terco')}
        >
          Terço Tradicional
        </button>
        <button
          className={section === 'nordico' ? 'active' : ''}
          onClick={() => setSection('nordico')}
        >
          Terço Nórdico
        </button>
        <button
          className={section === 'oracoes' ? 'active' : ''}
          onClick={() => setSection('oracoes')}
        >
          Orações
        </button>
      </div>

      <div className="prayer-layout-refactored">
        {/* TAB 1: TERÇO TRADICIONAL */}
        {section === 'terco' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <RosaryGuide layoutData={traditionalRosaryData} />
          </motion.div>
        )}

        {/* TAB 2: TERÇO NÓRDICO */}
        {section === 'nordico' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <RosaryGuide layoutData={nordicRosaryData} />
          </motion.div>
        )}

        {/* TAB 3: ORAÇÕES TRADICIONAIS */}
        {section === 'oracoes' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="prayers-search-section"
          >
            <SaoBentoSection />

            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                className="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar uma oração por nome, palavra ou categoria..."
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

            <div className="prayers-accordion-list">
              {filtered.map(([category, name, text], i) => (
                <Accordion
                  key={name}
                  title={name}
                  badge={category}
                  isOpen={openIdx === `prayer-${i}`}
                  onToggle={() => setOpenIdx(openIdx === `prayer-${i}` ? null : `prayer-${i}`)}
                >
                  <span dangerouslySetInnerHTML={{ __html: text }} />
                </Accordion>
              ))}
            </div>

            {filtered.length === 0 && (
              <p
                className="lead"
                style={{ textAlign: 'center', marginTop: '2rem' }}
              >
                Nenhuma oração encontrada.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}

