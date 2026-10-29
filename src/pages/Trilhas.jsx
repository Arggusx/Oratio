import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Lock, RotateCcw, X } from 'lucide-react';
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
        Caminhos de ilhas, uma etapa em cada, com algo para viver depois. A próxima ilha abre quando você conclui a
        atual; a sugestão é fazer uma por dia.
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

// Deslocamento lateral de cada ilha (em % da largura do caminho): desce em ziguezague, como uma estrada.
const ZIGZAG = [0, 22, 32, 22, 0, -22, -32, -22];
const STEP_Y = 150; // distância vertical entre as ilhas, em px

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
 * A trilha como um caminho de ilhas flutuantes em ziguezague. Só a próxima ilha está aberta:
 * a seguinte libera quando a atual é concluída.
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
  // A ilha atual é a primeira ainda não concluída.
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
    // Leva a pessoa até a ilha que acabou de abrir, com um brilho rápido.
    if (day < total) {
      setJustUnlocked(day);
      setTimeout(() => islandRefs.current[day]?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 150);
      setTimeout(() => setJustUnlocked(null), 1800);
    }
  };

  const height = (total - 1) * STEP_Y + 170;
  const points = trail.steps.map((_, i) => ({ x: 50 + ZIGZAG[i % ZIGZAG.length], y: i * STEP_Y + 70 }));
  const roadPath = points
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y}`;
      const prev = points[i - 1];
      const midY = (prev.y + p.y) / 2;
      return `C${prev.x} ${midY} ${p.x} ${midY} ${p.x} ${p.y}`;
    })
    .join(' ');

  return (
    <main className="page novena-page trail-page">
      <Link to="/home/trilhas" className="saint-back-link">
        <ArrowLeft size={16} />
        Todas as trilhas
      </Link>
      <span className="eyebrow">Trilha</span>
      <h1 className="section-title">{trail.title}</h1>
      <p className="lead">{trail.intro}</p>
      <p className="trail-hint">
        {plan
          ? `${done.length} de ${total} etapas concluídas. A sugestão é fazer uma por dia.`
          : 'Toque na primeira ilha para começar. A próxima abre quando você concluir a atual.'}
      </p>

      <div className="trail-map" style={{ height }}>
        {/* Estrada pontilhada que liga as ilhas */}
        <svg className="trail-road" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={roadPath} vectorEffect="non-scaling-stroke" />
        </svg>

        <ol className="trail-islands">
          {trail.steps.map((step, i) => {
            const isDone = done.includes(i + 1);
            const state = isDone ? 'done' : i === current ? 'current' : 'locked';
            const p = points[i];
            const status = { done: 'concluída', current: 'próxima', locked: 'trancada' }[state];
            return (
              <li
                key={step.title}
                ref={(el) => (islandRefs.current[i] = el)}
                className={`trail-island is-${state} ${justUnlocked === i ? 'is-new' : ''}`}
                style={{ left: `${p.x}%`, top: p.y, '--i': i }}
              >
                <button
                  type="button"
                  onClick={() => openStep(i)}
                  disabled={state === 'locked'}
                  aria-label={`Etapa ${i + 1}: ${step.title} (${status})`}
                >
                  <span className="trail-island-float">
                    <TrailIsland icon={step.icon} state={state} />
                  </span>
                  {state === 'done' && (
                    <span className="trail-badge is-done" aria-hidden="true">
                      <Check size={14} />
                    </span>
                  )}
                  {state === 'locked' && (
                    <span className="trail-badge is-locked" aria-hidden="true">
                      <Lock size={12} />
                    </span>
                  )}
                  {state === 'current' && (
                    <span className="trail-bubble" aria-hidden="true">
                      {plan ? 'Continuar' : 'Começar'}
                    </span>
                  )}
                </button>
                <span className="trail-island-label" aria-hidden="true">
                  <small>{i + 1}º dia</small>
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {finished && (
        <section className="novena-progress trail-finish">
          <p>
            <strong>Trilha concluída!</strong> Que o que você aprendeu continue dando frutos na sua oração.
          </p>
          {next && (
            <Link to={`/home/trilhas/${next.id}`} className="btn">
              Próxima trilha: {next.title}
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
