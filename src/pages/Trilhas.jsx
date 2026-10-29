import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import IslandPath from '../components/IslandPath';
import { QuizIslandCards } from './QuizIlhas';
import TrailIsland from '../components/TrailIsland';
import { getTrail, trails } from '../data/trails';
import { journey, useJourney } from '../utils/journeyStore';

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

function TrailProgress({ trail, plan }) {
  const done = plan?.done.length ?? 0;
  return (
    <span className="trail-card-progress">
      <span className="year-bar">
        <span style={{ width: `${(done / trail.steps.length) * 100}%`, background: trail.color }} />
      </span>
      <small>
        {done}/{trail.steps.length}
      </small>
    </span>
  );
}

/** "Escolha uma ilha": cada trilha é uma ilha. A que está em andamento fica em destaque. */
function TrailList() {
  const { trails: plans } = useJourney();
  const inProgress = trails.find((t) => plans[t.id] && plans[t.id].done.length < t.steps.length);
  const featured = inProgress ?? trails.find((t) => !plans[t.id]) ?? trails[0];
  const others = trails.filter((t) => t.id !== featured.id);
  const featuredPlan = plans[featured.id];
  const nextStep = featured.steps.find((_, i) => !featuredPlan?.done.includes(i + 1));

  return (
    <main className="page">
      <span className="eyebrow">Trilhas e quizzes</span>
      <h1 className="section-title">
        Escolha uma <span className="trail-title-accent">ilha</span>
      </h1>
      <p className="lead">
        Cada trilha é uma ilha, com uma etapa curta em cada parada. A próxima abre quando você conclui a atual; a
        sugestão é fazer uma por dia.
      </p>

      <Link to={`/home/trilhas/${featured.id}`} className="trail-card is-featured" style={{ '--trail': featured.color }}>
        <span className="trail-card-art">
          <TrailIsland icon={featured.icon} color={featured.color} />
        </span>
        <span className="trail-card-body">
          <span className="trail-chip">{inProgress ? 'Em andamento' : 'Comece por aqui'}</span>
          <strong>{featured.title}</strong>
          <span className="trail-card-desc">{featured.short}</span>
          <TrailProgress trail={featured} plan={featuredPlan} />
          <span className="btn trail-card-cta">
            {featuredPlan ? 'Continuar' : 'Começar'}
            {nextStep && ` · ${nextStep.title}`}
          </span>
        </span>
      </Link>

      <h2 className="trail-section-title">Trilhas da fé</h2>
      <div className="trail-grid">
        {others.map((t) => (
          <Link key={t.id} to={`/home/trilhas/${t.id}`} className="trail-card" style={{ '--trail': t.color }}>
            <span className="trail-card-art">
              <TrailIsland icon={t.icon} color={t.color} />
            </span>
            <strong>{t.title}</strong>
            <span className="trail-card-desc">{t.short}</span>
            <TrailProgress trail={t} plan={plans[t.id]} />
          </Link>
        ))}
      </div>

      <QuizIslandCards />
    </main>
  );
}

/** Janela de uma etapa: o texto, o "para hoje" e o botão de concluir. */
function StepSheet({ trail, index, done, onComplete, onClose }) {
  const dialogRef = useRef(null);
  const step = trail.steps[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const onClick = (e) => e.target === dialog && dialog.close();
    dialog?.addEventListener('click', onClick);
    dialog?.addEventListener('close', onClose);
    return () => {
      dialog?.removeEventListener('click', onClick);
      dialog?.removeEventListener('close', onClose);
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className="filter-sheet trail-sheet" aria-labelledby="trail-sheet-title">
      <header className="filter-sheet-head">
        <div>
          <span className="novena-day-number">
            Etapa {index + 1} de {trail.steps.length}
          </span>
          <h2 id="trail-sheet-title">{step.title}</h2>
        </div>
        <button type="button" className="filter-sheet-close" onClick={() => dialogRef.current?.close()} aria-label="Fechar">
          <X size={20} />
        </button>
      </header>
      <div className="filter-sheet-body">
        <p className="trail-sheet-text">{step.text}</p>
        <p className="trail-today">
          <strong>Para hoje:</strong> {step.today}
        </p>
      </div>
      <footer className="filter-sheet-foot">
        {done ? (
          <span className="trail-sheet-done">
            <Check size={16} aria-hidden="true" /> Etapa concluída
          </span>
        ) : (
          <button type="button" className="btn filter-sheet-apply" onClick={onComplete}>
            <Check size={16} aria-hidden="true" />
            Concluí esta etapa
          </button>
        )}
      </footer>
    </dialog>
  );
}

/**
 * A trilha: a ilha grande no topo e as paradas descendo, uma à esquerda e outra à direita.
 * Só a próxima parada está aberta; a seguinte libera quando a atual é concluída.
 */
function TrailPage({ trail }) {
  const { trails: plans } = useJourney();
  const plan = plans[trail.id];
  const done = plan?.done ?? [];
  const [open, setOpen] = useState(null);
  const [justUnlocked, setJustUnlocked] = useState(null);
  const islandRefs = useRef([]);
  const total = trail.steps.length;
  const finished = done.length === total;
  // A parada atual é a primeira ainda não concluída.
  const current = trail.steps.findIndex((_, i) => !done.includes(i + 1));
  const next = trails.find((t) => t.id !== trail.id && plans[t.id]?.done.length !== t.steps.length);
  const closeSheet = useCallback(() => setOpen(null), []);

  const openStep = (i) => {
    if (!plan) journey.startPlan('trails', trail.id);
    setOpen(i);
  };

  const complete = () => {
    const day = open + 1;
    if (!done.includes(day)) journey.togglePlanDay('trails', trail.id, day);
    setOpen(null);
    // Leva a pessoa até a parada que acabou de abrir, com um brilho rápido.
    if (day < total) {
      setJustUnlocked(day);
      setTimeout(() => islandRefs.current[day]?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 150);
      setTimeout(() => setJustUnlocked(null), 1800);
    }
  };

  return (
    <main className="page trail-page" style={{ '--trail': trail.color }}>
      <header className="trail-head">
        <div>
          <span className="eyebrow">
            Trilha · {done.length}/{total} etapas
          </span>
          <h1>{trail.title}</h1>
        </div>
        <Link to="/home/trilhas" className="fx-small-btn">
          <ArrowLeft size={16} aria-hidden="true" /> Ilhas
        </Link>
      </header>
      <p className="trail-hint">{trail.intro}</p>

      <IslandPath
        color={trail.color}
        heroIcon={trail.icon}
        stops={trail.steps.map((step, i) => {
          const state = done.includes(i + 1) ? 'done' : i === current ? 'current' : 'locked';
          return {
            key: step.title,
            icon: step.icon,
            title: step.title,
            state,
            kicker:
              state === 'current' ? (plan ? 'Continuar aqui' : 'Começar aqui') : `Etapa ${String(i + 1).padStart(2, '0')}`,
          };
        })}
        onSelect={openStep}
        justUnlocked={justUnlocked}
        stopRefs={islandRefs}
      />

      {finished && (
        <section className="novena-progress trail-finish">
          <p>
            <strong>Trilha concluída!</strong> Que o que você aprendeu continue dando frutos na sua oração.
          </p>
          {next && (
            <Link to={`/home/trilhas/${next.id}`} className="btn">
              Próxima ilha: {next.title}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </section>
      )}

      {plan && (
        <button type="button" className="filter-clear-link trail-restart" onClick={() => journey.stopPlan('trails', trail.id)}>
          <RotateCcw size={14} aria-hidden="true" /> Recomeçar a trilha do zero
        </button>
      )}

      {open !== null && (
        <StepSheet
          trail={trail}
          index={open}
          done={done.includes(open + 1)}
          onComplete={complete}
          onClose={closeSheet}
        />
      )}
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
