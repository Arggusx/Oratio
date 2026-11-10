import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Lock, Music, Search } from 'lucide-react';
import {
  canticos,
  canticoSeasons,
  fitsSeason,
  hasPage,
  massMoments,
  momentLabel,
  seasonFromTheme,
  seasonLabel,
} from '../data/canticos';
import { normalizeText } from '../utils/liturgicalCalendar';
import { useLoadMore } from '../utils/useLoadMore';
import { useSeason } from '../utils/useSeasonTheme';
import FilterPanel from '../components/FilterPanel';
import { LoadMoreButton } from '../components/LoadMore';
import Angel from '../components/anim/Angel';

// Quantos cânticos aparecem antes do botão "Ver mais".
const PAGE_SIZE = 12;

const momentOrder = (c) => massMoments.findIndex((m) => m.id === c.moments[0]);

// Na ordem da Missa: da entrada ao canto final; dentro de cada momento, por título.
const sorted = [...canticos].sort(
  (a, b) => momentOrder(a) - momentOrder(b) || a.title.localeCompare(b.title, 'pt-BR')
);

const matches = (c, { moment, season }) => (!moment || c.moments.includes(moment)) && fitsSeason(c, season);

// Os cartões são funções de renderização (e não componentes com props), como nas outras listas do site.
function cardHead(cantico) {
  return (
    <span className="cantico-card-body">
      <span className="cantico-card-moments">{cantico.moments.map(momentLabel).join(' · ')}</span>
      <strong className="cantico-card-title" lang={cantico.language}>
        {cantico.title}
      </strong>
      {cantico.subtitle && <span className="cantico-card-subtitle">{cantico.subtitle}</span>}
      <span className="cantico-card-author">{cantico.author}</span>
      <span className="cantico-card-seasons">
        {cantico.seasons.map((s) => (
          <span key={s} className="cantico-season-tag">
            {seasonLabel(s)}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Cântico protegido: o cartão não abre uma página, só mostra onde encontrar a letra. */
function protectedCard(cantico, open, toggle) {
  const detailsId = `cantico-${cantico.id}-onde`;
  return (
    <article className={`cantico-card is-protected ${open ? 'is-open' : ''}`}>
      {cardHead(cantico)}
      <div id={detailsId} className="cantico-card-details" hidden={!open}>
        <p>{cantico.about}</p>
        <p>
          <strong>Onde encontrar:</strong> {cantico.whereToFind}
        </p>
        <p className="cantico-card-license">
          <Lock size={13} aria-hidden="true" />
          {cantico.licenseNote}
        </p>
      </div>
      <button type="button" className="cantico-card-cta" onClick={toggle} aria-expanded={open} aria-controls={detailsId}>
        {open ? 'Fechar' : 'Onde encontrar a letra'}
        <ChevronDown size={16} aria-hidden="true" className={`arrow-icon ${open ? 'rotated' : ''}`} />
      </button>
    </article>
  );
}

function openCard(cantico) {
  return (
    <Link to={`/home/canticos/${cantico.id}`} className="cantico-card">
      {cardHead(cantico)}
      <span className="cantico-card-cta">
        {cantico.translation ? 'Letra e tradução' : 'Ler a letra'}
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}

export default function Canticos() {
  const { theme } = useSeason();
  const todaySeason = canticoSeasons.some((s) => s.id === seasonFromTheme(theme)) ? seasonFromTheme(theme) : null;

  const [query, setQuery] = useState('');
  // O tempo litúrgico de hoje já vem escolhido; a pessoa pode tirar ou trocar no painel.
  const [filters, setFilters] = useState({ moment: null, season: todaySeason });
  // Cartão protegido aberto (mostra onde encontrar a letra); um de cada vez.
  const [openId, setOpenId] = useState(null);

  const searched = useMemo(() => {
    const q = normalizeText(query.trim());
    return sorted.filter((c) => normalizeText(`${c.title} ${c.subtitle ?? ''}`).includes(q));
  }, [query]);
  const shown = useMemo(() => searched.filter((c) => matches(c, filters)), [searched, filters]);

  // Com busca, mostra todos os resultados; com filtros, a lista ainda pode ser longa e segue com "Ver mais".
  const { listed, remaining, showMore } = useLoadMore(shown, PAGE_SIZE, { showAll: query.trim() !== '' });

  return (
    <main className="page canticos-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Música sacra</span>
          <h1 className="section-title">Cânticos da Missa</h1>
        </div>
        <Angel />
      </div>
      <p className="lead">
        Cânticos para cada momento da Missa, da entrada ao canto final, com os tempos do ano em que cabem melhor.
        Os hinos antigos têm a letra completa e a tradução; os demais trazem o autor e onde encontrar a letra.
      </p>

      <div className="search-wrapper" style={{ marginTop: '1.5rem' }}>
        <Search size={16} className="search-icon" />
        <input
          className="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pelo título (ex.: Salve Regina, Te Deum)"
          aria-label="Buscar cântico pelo título"
        />
      </div>

      <FilterPanel
        groups={[
          { id: 'moment', label: 'Momento da Missa', options: massMoments },
          { id: 'season', label: 'Tempo litúrgico', options: canticoSeasons },
        ]}
        values={filters}
        onApply={setFilters}
        countResults={(draft) => searched.filter((c) => matches(c, draft)).length}
      />

      <p className="canticos-count" aria-live="polite">
        {shown.length === 1 ? '1 cântico' : `${shown.length} cânticos`}
        {filters.season && filters.season === todaySeason && ` para o tempo de hoje (${seasonLabel(todaySeason)})`}
      </p>

      <ul className="card-list canticos-list">
        {listed.map((c, index) => (
          <motion.li
            key={c.id}
            className="cantico-card-item"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min((index % PAGE_SIZE) * 0.03, 0.3) }}
          >
            {hasPage(c)
              ? openCard(c)
              : protectedCard(c, openId === c.id, () => setOpenId(openId === c.id ? null : c.id))}
          </motion.li>
        ))}
      </ul>

      <LoadMoreButton remaining={remaining} onClick={showMore} label="Ver mais cânticos" />

      {shown.length === 0 && (
        <p className="lead canticos-empty">
          Nenhum cântico encontrado. Tente outro título ou tire um dos filtros.
        </p>
      )}

      <aside className="canticos-note">
        <Music size={20} aria-hidden="true" />
        <div>
          <h2>Por que alguns cânticos não têm letra?</h2>
          <p>
            A maior parte dos cânticos católicos brasileiros tem autor vivo ou editora com os direitos da obra.
            Por respeito a eles, publicamos a letra só de textos em domínio público: hinos latinos antigos, cantos
            gregorianos e salmos em tradução feita aqui. Para os demais, indicamos onde encontrar a letra e a
            partitura. As fontes estão nos <Link to="/creditos">créditos</Link>.
          </p>
        </div>
      </aside>
    </main>
  );
}
