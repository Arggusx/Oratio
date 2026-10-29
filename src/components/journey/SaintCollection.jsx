import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saints, formatFeast } from '../../data/saints';
import { SaintInitial } from '../SaintsDirectory';
import { useJourney } from '../../utils/journeyStore';
import GameIntro from '../GameIntro';

const month = String(new Date().getMonth() + 1).padStart(2, '0');
const MONTH_NAME = new Date().toLocaleDateString('pt-BR', { month: 'long' });

const FILTERS = [
  { id: 'mes', label: `Festas de ${MONTH_NAME}`, test: (s) => s.feast.startsWith(month) },
  { id: 'todos', label: 'Todos', test: () => true },
  { id: 'guardados', label: 'Guardados', test: (s, has) => has },
  { id: 'faltam', label: 'Faltam', test: (s, has) => !has },
];

/** Uma carta do álbum: na frente o retrato (ou a sombra), no verso a festa e do que é padroeiro. */
function SaintCard({ saint, collected }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <li className={`collection-card ${collected ? 'is-collected' : ''} ${flipped ? 'is-flipped' : ''}`}>
      <button
        type="button"
        className="collection-card-inner"
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
        aria-label={`${saint.name}${collected ? ', guardado' : ''}. Virar a carta`}
      >
        <span className="collection-face is-front">
          <SaintInitial saint={saint} />
          <strong>{collected ? saint.name : '???'}</strong>
          <small>{formatFeast(saint.feast)}</small>
        </span>
        <span className="collection-face is-back">
          <strong>{saint.name}</strong>
          <small>Festa: {formatFeast(saint.feast)}</small>
          <small>Padroeiro: {saint.patronOf.slice(0, 2).join(', ')}</small>
        </span>
      </button>
      <Link to={`/home/santos/${saint.slug}`} className="collection-card-link">
        {collected ? 'Reler' : 'Conhecer'}
      </Link>
    </li>
  );
}

/**
 * Coleção de santos: um álbum de cartas. As guardadas aparecem em cores; as outras ficam em sombra até a pessoa
 * ler a história do santo e tocar em "Guardar na coleção". As cartas viram para mostrar a festa e o padroeiro.
 */
export default function SaintCollection() {
  const { saints: collected } = useJourney();
  const monthSaints = saints.filter((s) => s.feast.startsWith(month));
  const [filter, setFilter] = useState(monthSaints.length ? 'mes' : 'todos');
  const test = FILTERS.find((f) => f.id === filter).test;
  const shown = saints.filter((s) => test(s, collected.includes(s.slug)));
  const monthDone = monthSaints.filter((s) => collected.includes(s.slug)).length;

  return (
    <section className="journey-card" aria-labelledby="collection-title">
      <header className="journey-card-head">
        <h2 id="collection-title">Coleção de santos</h2>
        <p>
          Seu álbum tem <strong>{collected.length}</strong> de {saints.length} santos.
          {monthSaints.length > 0 && ` Neste mês, ${monthDone} de ${monthSaints.length} santos com festa em ${MONTH_NAME}.`}
        </p>
      </header>

      <GameIntro
        id="colecao"
        steps={[
          'Cada santo é uma carta do álbum. As que você ainda não guardou ficam em sombra.',
          'Toque em "Conhecer", leia a história do santo e, na página dele, toque em "Guardar na coleção".',
          'Toque numa carta para virá-la e ver a festa e do que o santo é padroeiro.',
          'Dica: comece pelos santos que a Igreja celebra neste mês.',
        ]}
      />

      <div className="filter-group-options collection-filters" role="group" aria-label="Mostrar">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`intention-chip ${filter === f.id ? 'active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="calendar-empty">Nenhum santo aqui ainda.</p>
      ) : (
        <ul className="collection-grid">
          {shown.map((s) => (
            <SaintCard key={s.slug} saint={s} collected={collected.includes(s.slug)} />
          ))}
        </ul>
      )}
    </section>
  );
}
