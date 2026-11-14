import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, ExternalLink, Feather, Lock, PlayCircle } from 'lucide-react';
import {
  canticos,
  getCantico,
  hasLyrics,
  hasPage,
  searchLinks,
  LICENSE_LABELS,
  momentLabel,
  seasonLabel,
} from '../data/canticos';

const LANGUAGE_NAMES = { la: 'latim', pt: 'português' };

/** Até quatro outros cânticos para o mesmo momento da Missa, primeiro os que têm letra. */
function relatedTo(cantico) {
  return canticos
    .filter((c) => c.id !== cantico.id && c.moments.some((m) => cantico.moments.includes(m)))
    .sort((a, b) => Number(hasLyrics(b)) - Number(hasLyrics(a)))
    .slice(0, 4);
}

export default function Cantico() {
  const { id } = useParams();
  const cantico = getCantico(id);

  if (!cantico || !hasPage(cantico)) return <Navigate to="/home/canticos" replace />;

  const { lyrics, translation } = cantico;
  const withLyrics = hasLyrics(cantico);
  const related = relatedTo(cantico);
  const links = withLyrics ? null : searchLinks(cantico);

  return (
    <main className="page cantico-page">
      <Link to="/home/canticos" className="saint-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Todos os cânticos
      </Link>

      <header className="cantico-hero">
        <span className="eyebrow">{cantico.moments.map(momentLabel).join(' · ')}</span>
        <h1 className="section-title" lang={cantico.language}>
          {cantico.title}
        </h1>
        {cantico.subtitle && <p className="cantico-hero-subtitle">{cantico.subtitle}</p>}
        <p className="saint-hero-meta">
          <span>
            <Feather size={15} aria-hidden="true" />
            {cantico.author}
          </span>
          {cantico.era && (
            <span>
              <Clock size={15} aria-hidden="true" />
              {cantico.era}
            </span>
          )}
        </p>
        <span className="cantico-card-seasons">
          {cantico.seasons.map((s) => (
            <span key={s} className="cantico-season-tag">
              {seasonLabel(s)}
            </span>
          ))}
        </span>
      </header>

      <p className="saint-bio">{cantico.about}</p>

      {!withLyrics && (
        <section className="saint-section" aria-labelledby="cantico-onde">
          <h2 id="cantico-onde" className="saint-section-title">
            Onde encontrar a letra
          </h2>
          <p className="cantico-note">
            <Lock size={14} aria-hidden="true" /> Este cântico tem direitos autorais, por isso a letra não está
            publicada aqui. {cantico.licenseNote}
          </p>
          <p className="saint-bio">{cantico.whereToFind}</p>
          <div className="cantico-search-links">
            <a href={links.listen} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <PlayCircle size={18} aria-hidden="true" />
              Ouvir no YouTube
            </a>
            <a href={links.lyrics} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <ExternalLink size={18} aria-hidden="true" />
              Buscar a letra
            </a>
          </div>
        </section>
      )}

      {withLyrics && (
      <section className="saint-section" aria-labelledby="cantico-letra">
        <h2 id="cantico-letra" className="saint-section-title">
          Letra
        </h2>
        {cantico.lyricsNote && <p className="cantico-note">{cantico.lyricsNote}</p>}

        <div className={`cantico-lyrics ${translation ? 'has-translation' : ''}`}>
          {translation && (
            <div className="cantico-lyrics-head" aria-hidden="true">
              <span>Original em {LANGUAGE_NAMES[cantico.language] ?? cantico.language}</span>
              <span>Tradução</span>
            </div>
          )}
          {lyrics.map((stanza, i) => (
            <div key={i} className="cantico-stanza-row">
              <p className="cantico-stanza" lang={cantico.language}>
                {stanza}
              </p>
              {translation?.[i] && (
                <p className="cantico-stanza is-translation" lang="pt-BR">
                  {translation[i]}
                </p>
              )}
            </div>
          ))}
        </div>

        {translation && (
          <p className="cantico-note">
            {cantico.translationNote ?? 'Tradução livre feita para o Oratio, para ajudar a rezar com o texto.'}
          </p>
        )}
      </section>
      )}

      <section className="saint-section" aria-labelledby="cantico-fonte">
        <h2 id="cantico-fonte" className="saint-section-title">
          Origem e licença
        </h2>
        <dl className="cantico-facts">
          <div>
            <dt>Autor ou origem</dt>
            <dd>{cantico.author}</dd>
          </div>
          <div>
            <dt>Fonte</dt>
            <dd>{cantico.source}</dd>
          </div>
          <div>
            <dt>Licença</dt>
            <dd>
              {LICENSE_LABELS[cantico.license]}. {cantico.licenseNote}
            </dd>
          </div>
        </dl>
      </section>

      {related.length > 0 && (
        <section className="saint-section" aria-labelledby="cantico-relacionados">
          <h2 id="cantico-relacionados" className="saint-section-title">
            Para o mesmo momento
          </h2>
          <ul className="card-list cantico-related">
            {related.map((c) => (
              <li key={c.id}>
                <Link to={`/home/canticos/${c.id}`} className="cantico-related-link">
                  <BookOpen size={18} aria-hidden="true" />
                  <span>
                    <strong lang={c.language}>{c.title}</strong>
                    {c.subtitle && <small>{c.subtitle}</small>}
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
