import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Lock, Play, RotateCcw } from 'lucide-react';
import { getTrail, trails } from '../data/trails';
import { journey, planDayToday, useJourney } from '../utils/journeyStore';

/** Bolinhas de progresso de uma trilha (uma por etapa). */
export function TrailSteps({ trail, plan }) {
  return (
    <ol className="novena-beads is-sm" aria-label={`${plan?.done.length ?? 0} de ${trail.steps.length} etapas`}>
      {trail.steps.map((_, i) => (
        <li key={i} className={`novena-bead ${plan?.done.includes(i + 1) ? 'is-done' : ''}`} />
      ))}
    </ol>
  );
}

function TrailList() {
  const { trails: plans } = useJourney();
  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Escola da Fé</span>
          <h1 className="section-title">Trilhas da fé</h1>
        </div>
      </div>
      <p className="lead">
        Uma etapa curta por dia, com algo para viver depois. A etapa seguinte abre no dia seguinte, para dar tempo de
        rezar o que você aprendeu.
      </p>
      <div className="novena-list">
        {trails.map((t) => (
          <Link key={t.id} to={`/home/trilhas/${t.id}`} className="novena-card">
            <span className="novena-card-text">
              <strong>{t.title}</strong>
              <span>
                {t.steps.length} dias · {t.intro}
              </span>
            </span>
            {plans[t.id] ? <TrailSteps trail={t} plan={plans[t.id]} /> : <ArrowRight size={18} aria-hidden="true" />}
          </Link>
        ))}
      </div>
    </main>
  );
}

function TrailPage({ trail }) {
  const { trails: plans } = useJourney();
  const plan = plans[trail.id];
  const today = planDayToday(plan);
  const finished = plan?.done.length === trail.steps.length;

  return (
    <main className="page novena-page">
      <Link to="/home/trilhas" className="saint-back-link">
        <ArrowLeft size={16} />
        Todas as trilhas
      </Link>
      <span className="eyebrow">Trilha</span>
      <h1 className="section-title">{trail.title}</h1>
      <p className="lead">{trail.intro}</p>

      <section className="novena-progress" aria-label="Seu progresso nesta trilha">
        {plan ? (
          <>
            <TrailSteps trail={trail} plan={plan} />
            <p>
              {finished
                ? 'Trilha concluída. Parabéns pelo caminho!'
                : `${plan.done.length} de ${trail.steps.length} etapas concluídas.`}
            </p>
            <button type="button" className="filter-clear-link" onClick={() => journey.stopPlan('trails', trail.id)}>
              <RotateCcw size={14} aria-hidden="true" /> Recomeçar do zero
            </button>
          </>
        ) : (
          <button type="button" className="btn" onClick={() => journey.startPlan('trails', trail.id)}>
            <Play size={16} aria-hidden="true" />
            Começar esta trilha
          </button>
        )}
      </section>

      <ol className="novena-days">
        {trail.steps.map((step, i) => {
          const day = i + 1;
          const done = plan?.done.includes(day);
          // Sem começar, todas ficam visíveis; depois de começar, uma etapa abre por dia.
          const locked = plan && day > today && !done;
          return (
            <li key={step.title} className={`novena-day ${done ? 'is-done' : ''} ${locked ? 'is-locked' : ''}`}>
              <span className="novena-day-number">{day}º dia</span>
              <h3>{step.title}</h3>
              {locked ? (
                <p className="trail-locked">
                  <Lock size={14} aria-hidden="true" /> Abre {day - today === 1 ? 'amanhã' : `em ${day - today} dias`}.
                </p>
              ) : (
                <>
                  <p>{step.text}</p>
                  <p className="trail-today">
                    <strong>Para hoje:</strong> {step.today}
                  </p>
                  {plan && (
                    <button
                      type="button"
                      className={`journey-mark ${done ? 'is-done' : ''}`}
                      onClick={() => journey.togglePlanDay('trails', trail.id, day)}
                      aria-pressed={done}
                    >
                      <Check size={15} aria-hidden="true" />
                      {done ? 'Etapa concluída' : 'Concluí esta etapa'}
                    </button>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}

export default function Trilhas() {
  const { id } = useParams();
  if (!id) return <TrailList />;
  const trail = getTrail(id);
  if (!trail) return <Navigate to="/home/trilhas" replace />;
  return <TrailPage trail={trail} />;
}
