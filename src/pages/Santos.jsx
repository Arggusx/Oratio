import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronRight, Search } from 'lucide-react';
import { saints, intentions, formatFeast } from '../data/saints';
import { normalizeText } from '../utils/liturgicalCalendar';

export function SaintInitial({ saint, large = false }) {
  const letter = saint.name.replace(/^(São|Santa|Santo)\s/, '').charAt(0);
  return (
    <span className={`saint-initial ${large ? 'is-large' : ''}`} aria-hidden="true">
      {letter}
    </span>
  );
}

export default function Santos() {
  const [query, setQuery] = useState('');
  const [activeIntention, setActiveIntention] = useState(null);

  const shown = useMemo(() => {
    const q = normalizeText(query);
    return saints.filter((s) => {
      const matchesIntention = !activeIntention || s.intentions.includes(activeIntention);
      const matchesQuery = normalizeText(`${s.name} ${s.title} ${s.patronOf.join(' ')}`).includes(q);
      return matchesIntention && matchesQuery;
    });
  }, [query, activeIntention]);

  return (
    <main className="page">
      <span className="eyebrow">Intercessores</span>
      <h1 className="section-title">Santos</h1>
      <p className="lead">
        Conheça a história de alguns santos, a data em que a Igreja os celebra e as orações para pedir sua
        intercessão.
      </p>

      <div className="search-wrapper" style={{ marginTop: '1.5rem' }}>
        <Search size={16} className="search-icon" />
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar santo ou padroeiro de… (ex.: viagens, olhos)"
        />
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

      <div className="saints-grid">
        {shown.map((s, index) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
          >
            <Link to={`/home/santos/${s.slug}`} className="saint-card">
              <SaintInitial saint={s} />
              <span className="saint-card-body">
                <strong>{s.name}</strong>
                <span className="saint-card-title">{s.title}</span>
                <span className="saint-card-feast">
                  <CalendarDays size={13} />
                  {formatFeast(s.feast)}
                </span>
                <span className="saint-card-patron">Padroeiro(a): {s.patronOf.slice(0, 2).join(', ')}</span>
              </span>
              <ChevronRight size={18} className="saint-card-arrow" />
            </Link>
          </motion.div>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="lead" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Nenhum santo encontrado.
        </p>
      )}
    </main>
  );
}
