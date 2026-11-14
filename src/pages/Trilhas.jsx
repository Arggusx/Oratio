import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, RotateCcw, Shuffle, X } from 'lucide-react';
import IslandPath from '../components/IslandPath';
import GameIntro from '../components/GameIntro';
import TrailIsland from '../components/TrailIsland';
import { getTrail, trails } from '../data/trails';
import { islandProgress } from '../utils/islandProgress';
import { islandRewards } from '../data/rewards';
import { RewardReveal } from '../components/journey/Rewards';
import { LEVELS } from '../data/quizLevels';
import { journey, useJourney } from '../utils/journeyStore';
import { JORNADA_ATIVA } from '../utils/features';

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
      {/* As trilhas são abertas pela Jornada ou, sem ela, pela Escola da Fé: o "voltar" leva para lá. */}
      {JORNADA_ATIVA ? (
        <Link to="/jornada" className="saint-back-link page-back-link">
          <ChevronLeft size={16} aria-hidden="true" />
          Jornada
        </Link>
      ) : (
        <Link to="/home/escola-da-fe" className="saint-back-link page-back-link">
          <ChevronLeft size={16} aria-hidden="true" />
          Escola da Fé
        </Link>
      )}
      <span className="eyebrow">{trails.length} ilhas · quiz católico</span>
      <h1 className="section-title">
        Trilhas da fé: escolha uma <span className="trail-title-accent">ilha</span>
      </h1>
      <p className="lead">
        Cada assunto é uma ilha. A primeira parada do caminho explica tudo o que você vai aprender; as outras são
        quizzes, cada um mais difícil que o anterior, até o desafio final. A próxima parada abre quando você conclui a
        atual.
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

/**
 * O estudo da ilha: a primeira parada do caminho. Explica, de uma vez, todos os assuntos que os quizzes
 * vão perguntar, cada um com uma sugestão para viver no dia a dia.
 */
function StudySheet({ trail, done, onComplete, onClose }) {
  const dialogRef = useRef(null);

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
          <span className="novena-day-number">Estudo da ilha · {trail.steps.length} assuntos</span>
          <h2 id="trail-sheet-title">{trail.title}</h2>
        </div>
        <button type="button" className="filter-sheet-close" onClick={() => dialogRef.current?.close()} aria-label="Fechar">
          <X size={20} />
        </button>
      </header>
      <div className="filter-sheet-body">
        <p className="trail-study-intro">{trail.intro} Os quizzes do caminho perguntam sobre tudo o que está aqui.</p>
        <ol className="trail-study">
          {trail.steps.map((step, i) => (
            <li key={step.title}>
              <span className="trail-study-number" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p className="trail-sheet-text">{step.text}</p>
                <p className="trail-today">
                  <strong>Para viver:</strong> {step.today}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <footer className="filter-sheet-foot">
        {done ? (
          <span className="trail-sheet-done">
            <Check size={16} aria-hidden="true" /> Estudo concluído
          </span>
        ) : (
          <button type="button" className="btn filter-sheet-apply" onClick={onComplete}>
            <Check size={16} aria-hidden="true" />
            Concluí o estudo
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
  // O caminho: o estudo da ilha e, depois, os quizzes do mais fácil ao desafio final.
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
          'A primeira parada é o estudo da ilha: ele explica todos os assuntos do caminho. Leia com calma e toque em "Concluí o estudo".',
          'As outras paradas são quizzes (o ponto de interrogação) sobre esse estudo. Cada um é mais difícil que o anterior, até o desafio final.',
          'Cada parada só abre depois da anterior. Errou? Volte ao estudo quando quiser e jogue de novo.',
        ]}
      />

      <IslandPath
        color={trail.color}
        heroIcon={trail.icon}
        stops={stops.map((st, i) => {
          const state = isDone(st) ? 'done' : i === current ? 'current' : 'locked';
          const level = st.kind === 'quiz' ? LEVELS.find((l) => l.id === st.level) : null;
          const label = level ? `Quiz · ${level.size} perguntas` : `${trail.steps.length} assuntos`;
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

      {/* Carimbo e moldura são da Jornada: sem ela, a janela de recompensa não aparece. */}
      {JORNADA_ATIVA && showReward && (
        <RewardReveal
          trail={trail}
          reward={reward}
          onClose={closeReward}
          onUseFrame={() => journey.setProfile({ frame: reward.frame.id })}
        />
      )}

      {open !== null && (
        <StudySheet
          trail={trail}
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
