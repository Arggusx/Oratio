import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import NordicModal from '../components/NordicModal';
import { prayers } from '../data/prayers';
import { steps } from '../data/stapsRosary';

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
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMystery, setSelectedMystery] = useState(null);

  const openNordicModal = (type) => {
    setSelectedMystery(type);
    setModalOpen(true);
  };

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
      <h1 className="section-title">Terço e orações</h1>
      <p className="lead">
        Reze passo a passo ou encontre uma oração para o momento presente.
      </p>

      <div className="subnav" style={{ marginTop: '1.5rem' }}>
        <button
          className={section === 'terco' ? 'active' : ''}
          onClick={() => setSection('terco')}
        >
          Como rezar o terço
        </button>
        <button
          className={section === 'nordico' ? 'active' : ''}
          onClick={() => setSection('nordico')}
        >
          Rosário Nórdico
        </button>
        <button
          className={section === 'oracoes' ? 'active' : ''}
          onClick={() => setSection('oracoes')}
        >
          Orações tradicionais
        </button>
      </div>

      <div className="prayer-layout">
        {section === 'terco' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
                O terço, passo a passo
              </h2>
              {steps.map(([title, content], i) => (
                <Accordion
                  key={title}
                  title={`${i + 1}. ${title}`}
                  isOpen={openIdx === `step-${i}`}
                  onToggle={() => setOpenIdx(openIdx === `step-${i}` ? null : `step-${i}`)}
                >
                  {content}
                </Accordion>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                className="terco-guide-img"
                src="/img2/passo-a-passo-como-rezar-o-terco.png"
                alt="Guia visual para rezar o terço"
              />
            </motion.div>
          </>
        )}

        {section === 'nordico' && (
          <motion.div
            style={{ gridColumn: '1 / -1' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <section className="oracoes-block block-nordico" style={{ margin: 0 }}>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>Rosário das Cláusulas (Nórdico)</h2>
              <p className="lead" style={{ marginBottom: '2rem' }}>Oração contínua com uma meditação específica inserida na Ave Maria.</p>
              <div className="mini-card-grid">
                <button className="mini-card" style={{'--accent': '#73B894'}} onClick={() => openNordicModal('gozosos')}>
                  Mistérios Gozosos
                </button>
                <button className="mini-card" style={{'--accent': '#D4B86A'}} onClick={() => openNordicModal('luminosos')}>
                  Mistérios Luminosos
                </button>
                <button className="mini-card" style={{'--accent': '#D27D7D'}} onClick={() => openNordicModal('dolorosos')}>
                  Mistérios Dolorosos
                </button>
                <button className="mini-card" style={{'--accent': '#8AA8D0'}} onClick={() => openNordicModal('gloriosos')}>
                  Mistérios Gloriosos
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {section === 'oracoes' && (
          <motion.div
            style={{ gridColumn: '1 / -1' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                className="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar uma oração..."
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

            {filtered.map(([category, name, text], i) => (
              <Accordion
                key={name}
                title={name}
                badge={category}
                isOpen={openIdx === `prayer-${i}`}
                onToggle={() => setOpenIdx(openIdx === `prayer-${i}` ? null : `prayer-${i}`)}
              >
                {text}
              </Accordion>
            ))}

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
      
      <NordicModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        mysteryType={selectedMystery} 
      />
    </main>
  );
}
