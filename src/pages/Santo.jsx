import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChevronDown, Copy, Check } from 'lucide-react';
import { getSaint, formatFeast, intentionLabel } from '../data/saints';
import { prayers } from '../data/prayers';
import SaoBentoSection from '../components/SaoBentoSection';
import { SaintInitial } from './Santos';

function SaintPrayer({ prayer, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${prayer.title}\n\n${prayer.text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar oração:', err);
    }
  };

  return (
    <article className={`saint-prayer ${open ? 'is-open' : ''}`}>
      <button className="saint-prayer-trigger" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>
          <strong>{prayer.title}</strong>
          {prayer.intentions?.length > 0 && (
            <span className="saint-prayer-tags">
              {prayer.intentions.map((id) => (
                <span key={id} className="intention-tag">{intentionLabel(id)}</span>
              ))}
            </span>
          )}
        </span>
        <ChevronDown size={18} className={`arrow-icon ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className="saint-prayer-body">
          <p className="prayer-full-text">{prayer.text}</p>
          {prayer.latin && (
            <p className="prayer-accordion-latin" lang="la">
              <strong>Em latim:</strong> {prayer.latin}
            </p>
          )}
          {prayer.note && <p className="prayer-accordion-note">{prayer.note}</p>}
          <button className={`btn-block-action ${copied ? 'copied' : ''}`} onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copiada' : 'Copiar oração'}</span>
          </button>
        </div>
      )}
    </article>
  );
}

export default function Santo() {
  const { slug } = useParams();
  const saint = getSaint(slug);

  if (!saint) return <Navigate to="/home/santos" replace />;

  // Oração principal primeiro, depois as orações por intenção.
  const saintPrayers = prayers
    .filter((p) => p.saint === saint.slug)
    .sort((a, b) => Number(Boolean(b.main)) - Number(Boolean(a.main)));

  return (
    <main className="page saint-page">
      <Link to="/home/santos" className="saint-back-link">
        <ArrowLeft size={16} />
        Todos os santos
      </Link>

      <header className="saint-hero">
        <SaintInitial saint={saint} large />
        <div>
          <span className="eyebrow">{saint.title}</span>
          <h1 className="section-title">{saint.name}</h1>
          <p className="saint-hero-meta">
            <span>
              <CalendarDays size={15} />
              Festa: {formatFeast(saint.feast)}
            </span>
            {saint.lifespan && <span>{saint.lifespan}</span>}
          </p>
        </div>
      </header>

      <section className="saint-section">
        <p className="saint-bio">{saint.bio}</p>

        <div className="saint-patron">
          <h2>Padroeiro(a) de</h2>
          <ul>
            {saint.patronOf.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {saint.hasMedal && (
        <section className="saint-section">
          <SaoBentoSection showSaintLink={false} />
        </section>
      )}

      <section className="saint-section">
        <h2 className="saint-section-title">Orações</h2>
        <div className="saint-prayers">
          {saintPrayers
            // A Oração de São Bento já aparece completa na seção da medalha.
            .filter((p) => !(saint.hasMedal && p.latin))
            .map((p, i) => (
              <SaintPrayer key={p.id} prayer={p} defaultOpen={i === 0} />
            ))}
        </div>
      </section>
    </main>
  );
}
