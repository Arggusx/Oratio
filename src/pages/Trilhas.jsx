import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle, X } from 'lucide-react';
import IslandPath from '../components/IslandPath';
import GameIntro from '../components/GameIntro';
import TrailIsland from '../components/TrailIsland';
import { getTrail, trails } from '../data/trails';
import { islandProgress } from '../utils/islandProgress';
import { islandRewards } from '../data/rewards';
import { RewardReveal } from '../components/journey/Rewards';
import { LEVELS } from '../data/quizBank';
import { journey, useJourney } from '../utils/journeyStore';

function TrailProgress({ trail, progress }) {
  return (
    <span className="trail-card-progress">
      <span className="year-bar">
        <span style={{ width: `${(progress.done / progress.total) * 100}%`, background: trail.color }} />
      </span>
      <small>
        {progress.done}/{progress.total}
      </small>
    </span>
  );
}

/** "Escolha uma ilha": cada trilha é uma ilha. A que está em andamento fica em destaque. */
function TrailList() {
  const state = useJourney();
  const progress = Object.fromEntries(trails.map((t) => [t.id, islandProgress(t, state)]));
  const inProgress = trails.find((t) => progress[t.id].started && progress[t.id].done < progress[t.id].total);
  const featured = inProgress ?? trails.find((t) => !progress[t.id].started) ?? trails[0];
  const others = trails.filter((t) => t.id !== featured.id);
  const featuredProgress = progress[featured.id];

  return (
    <main className="page">
      <span className="eyebrow">Trilhas da fé · {trails.length} ilhas</span>
      <h1 className="section-title">
        Escolha uma <span className="trail-title-accent">ilha</span>
      </h1>
      <p className="lead">
        Cada assunto é uma ilha. No caminho há etapas curtas para ler e paradas de quiz que ficam mais difíceis, até o
        desafio final. A próxima parada abre quando você conclui a atual.
      </p>

      <Link to={`/home/trilhas/${featured.id}`} className="trail-card is-featured" style={{ '--trail': featured.color }}>
        <span className="trail-card-art">
          <TrailIsland icon={featured.icon} color={featured.color} />
        </span>
        <span className="trail-card-body">
          <span className="trail-chip">{inProgress ? 'Em andamento' : 'Comece por aqui'}</span>
          <strong>{featured.title}</strong>
          <span className="trail-card-desc">{featured.short}</span>
          <TrailProgress trail={featured} progress={featuredProgress} />
          <span className="btn trail-card-cta">
            {featuredProgress.started ? 'Continuar' : 'Começar'}
            {featuredProgress.nextTitle && ` · ${featuredProgress.nextTitle}`}
          </span>
        </span>
      </Link>

      <h2 className="trail-section-title">Outras ilhas</h2>
      <div className="trail-grid">
        {others.map((t) => (
          <Link key={t.id} to={`/home/trilhas/${t.id}`} className="trail-card" style={{ '--trail': t.color }}>
            <span className="trail-card-art">
              <TrailIsland icon={t.icon} color={t.color} />
            </span>
            <strong>{t.title}</strong>
            <span className="trail-card-desc">{t.short}</span>
            <TrailProgress trail={t} progress={progress[t.id]} />
          </Link>
        ))}
      </div>

      <Link to="/home/quiz/aleatorio" className="trail-random-link">
        <Shuffle size={16} aria-hidden="true" />
        Desafio aleatório: misture as perguntas de todas as ilhas
      </Link>
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
  const navigate = useNavigate();
  const state = useJourney();
  const plans = state.trails;
  const plan = plans[trail.id];
  const done = plan?.done ?? [];
  const [open, setOpen] = useState(null);
  const [justUnlocked, setJustUnlocked] = useState(null);
  const islandRefs = useRef([]);
  // O caminho mistura as etapas de leitura com as paradas de quiz (fácil, médio, difícil e desafio final).
  const { stops, isDone, nextIndex: current, complete: finished } = islandProgress(trail, state);
  const next = trails.find((t) => t.id !== trail.id && !plans[t.id]);
  const closeSheet = useCallback(() => setOpen(null), []);
  // Recompensa da ilha: aparece uma vez, quando a ilha é concluída.
  const reward = islandRewards[trail.id];
  const rewardId = `ilha:${trail.id}`;
  const showReward = finished && reward && !state.rewardsSeen.includes(rewardId);
  const closeReward = useCallback(() => journey.markRewardSeen(rewardId), [rewardId]);

  const openStop = (i) => {
    const st = stops[i];
    if (!plan) journey.startPlan('trails', trail.id);
    if (st.kind === 'quiz') navigate(`/home/trilhas/${trail.id}/quiz/${st.level}`);
    else setOpen(st.index);
  };

  const complete = () => {
    const day = open + 1;
    if (!done.includes(day)) journey.togglePlanDay('trails', trail.id, day);
    setOpen(null);
    // Leva a pessoa até a parada que acabou de abrir, com um brilho rápido.
    const nextStop = stops.findIndex((st) => st.kind === 'lesson' && st.day === day) + 1;
    if (nextStop < stops.length) {
      setJustUnlocked(nextStop);
      setTimeout(() => islandRefs.current[nextStop]?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 150);
      setTimeout(() => setJustUnlocked(null), 1800);
    }
  };

  return (
    <main className="page trail-page" style={{ '--trail': trail.color }}>
      <header className="trail-head">
        <div>
          <span className="eyebrow">
            Ilha · {stops.filter(isDone).length}/{stops.length} paradas
          </span>
          <h1>{trail.title}</h1>
        </div>
        <Link to="/home/trilhas" className="fx-small-btn">
          <ArrowLeft size={16} aria-hidden="true" /> Ilhas
        </Link>
      </header>
      <p className="trail-hint">{trail.intro}</p>

      <GameIntro
        id="trilha"
        steps={[
          'Toque na ilha que está brilhando para abrir a etapa. Leia, faça o "Para hoje" e toque em "Concluí esta etapa".',
          'Pelo caminho há paradas de quiz (o ponto de interrogação) sobre o assunto da ilha: fácil, médio, difícil e o desafio final.',
          'Cada parada só abre depois da anterior. A sugestão é avançar uma etapa por dia, com calma.',
        ]}
      />

      <IslandPath
        color={trail.color}
        heroIcon={trail.icon}
        stops={stops.map((st, i) => {
          const state = isDone(st) ? 'done' : i === current ? 'current' : 'locked';
          const level = st.kind === 'quiz' ? LEVELS.find((l) => l.id === st.level) : null;
          const label = level ? `Quiz · ${level.size} perguntas` : `Etapa ${String(st.day).padStart(2, '0')}`;
          return {
            key: level ? `quiz-${level.id}` : st.step.title,
            icon: level ? level.icon : st.step.icon,
            title: level ? level.title : st.step.title,
            state,
            kicker: state === 'current' ? (plan ? 'Continuar aqui' : 'Começar aqui') : label,
          };
        })}
        onSelect={openStop}
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

      {showReward && (
        <RewardReveal
          trail={trail}
          reward={reward}
          onClose={closeReward}
          onUseFrame={() => journey.setProfile({ frame: reward.frame.id })}
        />
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
