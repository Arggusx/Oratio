import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Play, RotateCcw } from 'lucide-react';
import { getNovena, novenas } from '../data/novenas';
import { getSaint } from '../data/saints';
import { journey, planDayToday, useJourney } from '../utils/journeyStore';
import { plural, useCommunityStats } from '../utils/community';

/** Nove contas que acendem conforme os dias rezados; a de hoje fica marcada. */
export function NovenaBeads({ plan, size = 'md' }) {
  const today = planDayToday(plan);
  return (
    <ol className={`novena-beads is-${size}`} aria-label={`${plan?.done.length ?? 0} de 9 dias rezados`}>
      {Array.from({ length: 9 }, (_, i) => {
        const day = i + 1;
        const done = plan?.done.includes(day);
        return (
          <li key={day} className={`novena-bead ${done ? 'is-done' : ''} ${plan && day === today ? 'is-today' : ''}`}>
            <span className="sr-only">
              Dia {day}: {done ? 'rezado' : 'por rezar'}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function NovenaList() {
  const { novenas: plans } = useJourney();
  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Nove dias de oração</span>
          <h1 className="section-title">Novenas</h1>
        </div>
      </div>
      <p className="lead">
        Uma novena é a oração feita por nove dias seguidos por uma intenção. Escolha uma, comece hoje e acompanhe o
        seu progresso na Jornada.
      </p>
      <div className="novena-list">
        {novenas.map((n) => (
          <Link key={n.id} to={`/home/novenas/${n.id}`} className="novena-card">
            <span className="novena-card-text">
              <strong>{n.title}</strong>
              <span>{n.when}</span>
            </span>
            {plans[n.id] ? <NovenaBeads plan={plans[n.id]} size="sm" /> : <ArrowRight size={18} aria-hidden="true" />}
          </Link>
        ))}
      </div>
    </main>
  );
}

function NovenaPage({ novena }) {
  const { novenas: plans } = useJourney();
  const plan = plans[novena.id];
  const today = planDayToday(plan);
  const saint = novena.saint ? getSaint(novena.saint) : null;
  const finished = plan?.done.length === 9;
  const stats = useCommunityStats();
  const together = stats?.novenas[novena.id] ?? 0;

  return (
    <main className="page novena-page">
      <Link to="/home/novenas" className="saint-back-link">
        <ArrowLeft size={16} />
        Todas as novenas
      </Link>
      <span className="eyebrow">Novena</span>
      <h1 className="section-title">{novena.title}</h1>
      <p className="lead">{novena.intro}</p>
      <p className="novena-when">{novena.when}</p>
      {saint && (
        <Link to={`/home/santos/${saint.slug}`} className="prayer-saint-link">
          Conheça {saint.name}
          <ArrowRight size={15} />
        </Link>
      )}

      {together > 0 && (
        <p className="community-inline is-block">
          {plural(together, 'pessoa está fazendo', 'pessoas estão fazendo')} esta novena com você.{' '}
          {!plan && 'Comece hoje e reze junto.'}
        </p>
      )}

      <section className="novena-progress" aria-label="Seu progresso nesta novena">
        {plan ? (
          <>
            <NovenaBeads plan={plan} />
            <p>
              {finished
                ? 'Novena concluída. Que Deus atenda o seu pedido!'
                : `${plan.done.length} de 9 dias rezados${today >= 1 && today <= 9 ? ` · hoje é o ${today}º dia` : ''}.`}
            </p>
            <button type="button" className="filter-clear-link" onClick={() => journey.stopPlan('novenas', novena.id)}>
              <RotateCcw size={14} aria-hidden="true" /> Recomeçar do zero
            </button>
          </>
        ) : (
          <button type="button" className="btn" onClick={() => journey.startPlan('novenas', novena.id)}>
            <Play size={16} aria-hidden="true" />
            Começar esta novena
          </button>
        )}
      </section>

      <section className="novena-prayer">
        <h2 className="saint-section-title">Oração de todos os dias</h2>
        <p className="prayer-full-text">{novena.prayer}</p>
      </section>

      <ol className="novena-days">
        {novena.days.map(([title, text], i) => {
          const day = i + 1;
          const done = plan?.done.includes(day);
          return (
            <li key={title} className={`novena-day ${done ? 'is-done' : ''} ${plan && day === today ? 'is-today' : ''}`}>
              <span className="novena-day-number">{day}º dia</span>
              <h3>{title}</h3>
              <p>{text}</p>
              {plan && (
                <button
                  type="button"
                  className={`journey-mark ${done ? 'is-done' : ''}`}
                  onClick={() => journey.togglePlanDay('novenas', novena.id, day)}
                  aria-pressed={done}
                >
                  <Check size={15} aria-hidden="true" />
                  {done ? 'Dia rezado' : 'Rezei este dia'}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}

export default function Novenas() {
  const { id } = useParams();
  if (!id) return <NovenaList />;
  const novena = getNovena(id);
  if (!novena) return <Navigate to="/home/novenas" replace />;
  return <NovenaPage novena={novena} />;
}
