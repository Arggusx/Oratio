import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Search } from 'lucide-react';
import { saints, intentions, formatFeast } from '../data/saints';
import { saintImages } from '../data/imageCredits';
import { normalizeText } from '../utils/liturgicalCalendar';
import { LoadMoreButton } from './LoadMore';
import FilterPanel from './FilterPanel';
import { useLoadMore } from '../utils/useLoadMore';

// Quantos santos aparecem antes do botão "Ver mais".
const PAGE_SIZE = 12;

/** Retrato do santo num medalhão; sem imagem livre disponível, mostra a inicial do nome. */
export function SaintInitial({ saint, large = false }) {
  const image = saintImages[saint.slug];
  const letter = saint.name.replace(/^(São|Santa|Santo)\s/, '').charAt(0);
  return (
    <span className={`saint-initial ${large ? 'is-large' : ''} ${image ? 'has-image' : ''}`} aria-hidden="true">
      {image ? (
        <img
          src={image.src}
          width={image.width}
          height={image.height}
          alt=""
          loading="lazy"
          decoding="async"
          style={image.position ? { objectPosition: image.position } : undefined}
        />
      ) : (
        letter
      )}
    </span>
  );
}

/**
 * Busca, filtro por intenção e cartões dos santos. Cada cartão é um link para a
 * página do santo, e o rodapé do cartão deixa isso explícito.
 * Usado na página /home/santos e na aba "Santos" de Terço e Orações.
 */
export default function SaintsDirectory() {
  const [query, setQuery] = useState('');
  const [activeIntention, setActiveIntention] = useState(null);

  const searched = useMemo(() => {
    const q = normalizeText(query);
    return saints.filter((s) => normalizeText(`${s.name} ${s.title} ${s.patronOf.join(' ')}`).includes(q));
  }, [query]);
  const shown = useMemo(
    () => searched.filter((s) => !activeIntention || s.intentions.includes(activeIntention)),
    [searched, activeIntention]
  );

  // Com busca ou filtro ativo, mostra todos os resultados de uma vez.
  const isFiltering = query.trim() !== '' || activeIntention !== null;
  const { listed, remaining, showMore } = useLoadMore(shown, PAGE_SIZE, { showAll: isFiltering });

  return (
    <div className="saints-directory">
      <div className="search-wrapper" style={{ marginTop: '1.5rem' }}>
        <Search size={16} className="search-icon" />
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar santo ou padroeiro de… (ex.: viagens, olhos)"
          aria-label="Buscar santo ou padroeiro"
        />
      </div>

      <FilterPanel
        groups={[{ id: 'intention', label: 'Para que você quer rezar?', options: intentions }]}
        values={{ intention: activeIntention }}
        onApply={(v) => setActiveIntention(v.intention)}
        countResults={(draft) => searched.filter((s) => !draft.intention || s.intentions.includes(draft.intention)).length}
      />

      <div className="saints-grid">
        {listed.map((s, index) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min((index % PAGE_SIZE) * 0.03, 0.3) }}
          >
            <Link to={`/home/santos/${s.slug}`} className="saint-card">
              <span className="saint-card-main">
                <SaintInitial saint={s} />
                <span className="saint-card-body">
                  <strong>{s.name}</strong>
                  <span className="saint-card-title">{s.title}</span>
                  <span className="saint-card-feast">
                    <CalendarDays size={13} aria-hidden="true" />
                    {formatFeast(s.feast)}
                  </span>
                  <span className="saint-card-patron">Padroeiro(a): {s.patronOf.slice(0, 2).join(', ')}</span>
                </span>
              </span>
              <span className="saint-card-cta">
                Ver história e orações
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <LoadMoreButton remaining={remaining} onClick={showMore} label="Ver mais santos" />

      {shown.length === 0 && (
        <p className="lead" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Nenhum santo encontrado.
        </p>
      )}
    </div>
  );
}
