import { Link } from 'react-router-dom';
import { saints } from '../../data/saints';
import { SaintInitial } from '../SaintsDirectory';
import { useJourney } from '../../utils/journeyStore';

/**
 * Coleção de santos: como um álbum de figurinhas. Os guardados aparecem em cores; os outros ficam
 * em sombra, convidando a conhecer a história deles.
 */
export default function SaintCollection() {
  const { saints: collected } = useJourney();
  const ordered = [...saints].sort((a, b) => Number(collected.includes(b.slug)) - Number(collected.includes(a.slug)));

  return (
    <section className="journey-card" aria-labelledby="collection-title">
      <header className="journey-card-head">
        <h2 id="collection-title">Coleção de santos</h2>
        <p>
          Leia a história de um santo e toque em <strong>Guardar na coleção</strong> na página dele. Você já guardou{' '}
          {collected.length} de {saints.length}.
        </p>
      </header>
      <ul className="collection-grid">
        {ordered.map((s) => {
          const has = collected.includes(s.slug);
          return (
            <li key={s.slug}>
              <Link to={`/home/santos/${s.slug}`} className={`collection-card ${has ? 'is-collected' : ''}`}>
                <SaintInitial saint={s} />
                <span>{has ? s.name : 'Ainda não guardado'}</span>
                {!has && <span className="sr-only">{s.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
