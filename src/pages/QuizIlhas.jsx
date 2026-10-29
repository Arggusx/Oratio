import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Shuffle, XCircle } from 'lucide-react';
import IslandPath from '../components/IslandPath';
import GameIntro from '../components/GameIntro';
import TrailIsland from '../components/TrailIsland';
import { LEVELS, buildRound, getQuizIsland, quizIslands } from '../data/quizBank';
import { journey, useJourney } from '../utils/journeyStore';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Uma partida: pergunta por pergunta, com a explicação logo depois de responder e a revisão no fim. */
function QuizRound({ round, color, pass, onRestart, onPassed, exitTo, exitLabel, nextAction }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const finished = answers.length === round.length && picked === null;
  const correct = answers.filter((a) => a.right).length;
  const q = round[index];

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers([...answers, { q, picked: i, right: i === q.answer }]);
  };

  const next = () => {
    if (index + 1 < round.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    setPicked(null);
    const total = answers.filter((a) => a.right).length;
    if (pass === undefined || total >= pass) onPassed?.(total);
  };

  if (finished) {
    const passed = pass === undefined || correct >= pass;
    const wrong = answers.filter((a) => !a.right);
    return (
      <section className="quiz-result" style={{ '--trail': color }}>
        <div className="quiz-score">
          <strong>
            {correct}/{round.length}
          </strong>
          <span>
            {pass === undefined
              ? 'acertos'
              : passed
                ? 'Nível concluído! O próximo nível abriu.'
                : `Para abrir o próximo nível, acerte pelo menos ${pass}. Tente de novo: as perguntas mudam de ordem.`}
          </span>
        </div>

        {wrong.length > 0 && (
          <div className="quiz-review">
            <h2>Para revisar</h2>
            <ul>
              {wrong.map((a) => (
                <li key={a.q.q}>
                  <strong>{a.q.q}</strong>
                  <span className="quiz-review-answer">Resposta: {a.q.a}</span>
                  <span>{a.q.why}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="quiz-result-actions">
          {passed && nextAction}
          <button type="button" className={passed ? 'fx-small-btn' : 'btn'} onClick={onRestart}>
            <RotateCcw size={15} aria-hidden="true" /> Jogar de novo
          </button>
          <Link to={exitTo} className="fx-small-btn">
            <ArrowLeft size={15} aria-hidden="true" /> {exitLabel}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-game" style={{ '--trail': color }} aria-live="polite">
      <div className="quiz-progress" aria-hidden="true">
        {round.map((_, i) => (
          <span
            key={i}
            className={
              i < answers.length ? (answers[i].right ? 'is-right' : 'is-wrong') : i === index ? 'is-now' : ''
            }
          />
        ))}
      </div>
      <p className="quiz-count">
        Pergunta {index + 1} de {round.length} · {['', 'fácil', 'médio', 'difícil'][q.level]}
      </p>
      <h2 className="quiz-question">{q.q}</h2>

      <div className="quiz-options">
        {q.options.map((option, i) => {
          const state = picked === null ? '' : i === q.answer ? 'is-right' : i === picked ? 'is-wrong' : 'is-dim';
          return (
            <button
              key={option}
              type="button"
              className={`quiz-option ${state}`}
              onClick={() => choose(i)}
              disabled={picked !== null}
            >
              <span className="quiz-letter" aria-hidden="true">
                {LETTERS[i]}
              </span>
              <span>{option}</span>
              {state === 'is-right' && <CheckCircle2 size={18} aria-hidden="true" />}
              {state === 'is-wrong' && <XCircle size={18} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className={`quiz-why ${picked === q.answer ? 'is-right' : 'is-wrong'}`} role="status">
          <strong>{picked === q.answer ? 'Isso mesmo!' : `Quase. A resposta é: ${q.a}.`}</strong>
          <p>{q.why}</p>
          <button type="button" className="btn quiz-next" onClick={next}>
            {index + 1 < round.length ? 'Próxima pergunta' : 'Ver resultado'}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

/** A ilha de um assunto: os níveis como paradas, do fácil ao desafio final. */
function QuizIslandPage({ island }) {
  const navigate = useNavigate();
  const { quizLevels } = useJourney();
  const passed = quizLevels[island.id] ?? [];
  const current = LEVELS.findIndex((l) => !passed.includes(l.id));

  return (
    <main className="page trail-page" style={{ '--trail': island.color }}>
      <header className="trail-head">
        <div>
          <span className="eyebrow">
            Quiz · {passed.length}/{LEVELS.length} níveis
          </span>
          <h1>{island.title}</h1>
        </div>
        <Link to="/home/trilhas" className="fx-small-btn">
          <ArrowLeft size={16} aria-hidden="true" /> Ilhas
        </Link>
      </header>

      <GameIntro
        id="quiz"
        steps={[
          'Cada ilha tem quatro níveis: fácil, médio, difícil e um desafio final que mistura tudo.',
          'Em cada pergunta há quatro alternativas. Depois de responder, aparece a explicação, acertando ou não.',
          'Acerte pelo menos 3 de 4 (ou 5 de 6 no desafio final) para abrir o próximo nível.',
          'Errou? É só jogar de novo: as perguntas e as alternativas mudam de ordem, e nada se perde.',
        ]}
      />

      <IslandPath
        color={island.color}
        heroIcon={island.icon}
        stops={LEVELS.map((level, i) => {
          const state = passed.includes(level.id) ? 'done' : i === current ? 'current' : 'locked';
          return {
            key: level.id,
            icon: level.icon,
            title: level.title,
            state,
            kicker: state === 'current' ? 'Jogar agora' : `Nível ${level.id} · ${level.size} perguntas`,
          };
        })}
        onSelect={(i) => navigate(`/home/quiz/${island.id}/${LEVELS[i].id}`)}
      />
    </main>
  );
}

/** Um nível de uma ilha, em tela própria. */
function QuizLevelPage({ island, level }) {
  const navigate = useNavigate();
  const { quizLevels } = useJourney();
  const [seed, setSeed] = useState(0);
  const round = useMemo(
    () => buildRound({ topic: island.id, level: level.id, size: level.size, mixed: level.mixed }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [island.id, level.id, seed]
  );
  const unlocked = level.id === 1 || (quizLevels[island.id] ?? []).includes(level.id - 1);
  if (!unlocked) return <Navigate to={`/home/quiz/${island.id}`} replace />;
  const nextLevel = LEVELS.find((l) => l.id === level.id + 1);

  return (
    <main className="page quiz-page" style={{ '--trail': island.color }}>
      <header className="trail-head">
        <div>
          <span className="eyebrow">
            {island.title} · Nível {level.id}
          </span>
          <h1>{level.title}</h1>
        </div>
        <Link to={`/home/quiz/${island.id}`} className="fx-small-btn">
          <ArrowLeft size={16} aria-hidden="true" /> Ilha
        </Link>
      </header>
      <QuizRound
        key={seed}
        round={round}
        color={island.color}
        pass={level.pass}
        onPassed={() => journey.passQuizLevel(island.id, level.id)}
        onRestart={() => setSeed(seed + 1)}
        exitTo={`/home/quiz/${island.id}`}
        exitLabel="Voltar à ilha"
        nextAction={
          nextLevel ? (
            <button type="button" className="btn" onClick={() => navigate(`/home/quiz/${island.id}/${nextLevel.id}`)}>
              Próximo nível: {nextLevel.title}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <Link to="/home/trilhas" className="btn">
              Escolher outra ilha
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )
        }
      />
    </main>
  );
}

const DIFFICULTIES = [
  { id: 'misto', label: 'Misto' },
  { id: 1, label: 'Fácil' },
  { id: 2, label: 'Médio' },
  { id: 3, label: 'Difícil' },
];

/** Desafio aleatório: a pessoa escolhe os assuntos, a dificuldade e o tamanho da partida. */
function RandomQuizPage() {
  const [topics, setTopics] = useState([]);
  const [difficulty, setDifficulty] = useState('misto');
  const [size, setSize] = useState(10);
  const [round, setRound] = useState(null);
  const [seed, setSeed] = useState(0);

  const start = () => {
    const chosen = topics.length ? topics : quizIslands.map((i) => i.id);
    const parts = chosen.flatMap((topic) =>
      buildRound({ topic, level: difficulty === 'misto' ? null : difficulty, size: 99, mixed: difficulty === 'misto' })
    );
    // Embaralha as perguntas de todos os assuntos juntos e corta no tamanho escolhido.
    const mixed = parts.sort(() => Math.random() - 0.5).slice(0, size);
    setRound(mixed);
    setSeed(seed + 1);
  };

  const toggleTopic = (id) => setTopics((list) => (list.includes(id) ? list.filter((t) => t !== id) : [...list, id]));

  return (
    <main className="page quiz-page" style={{ '--trail': '#B84A13' }}>
      <header className="trail-head">
        <div>
          <span className="eyebrow">Quiz</span>
          <h1>Desafio aleatório</h1>
        </div>
        <Link to="/home/trilhas" className="fx-small-btn">
          <ArrowLeft size={16} aria-hidden="true" /> Ilhas
        </Link>
      </header>

      {round ? (
        <QuizRound
          key={seed}
          round={round}
          color="#B84A13"
          onRestart={start}
          exitTo="/home/quiz/aleatorio"
          exitLabel="Mudar a partida"
          nextAction={null}
        />
      ) : (
        <section className="quiz-setup">
          <GameIntro
            id="quiz-aleatorio"
            steps={[
              'Escolha um ou mais assuntos, ou deixe nenhum marcado para misturar todos.',
              'Escolha a dificuldade e quantas perguntas quer responder.',
              'As perguntas e as alternativas vêm sorteadas a cada partida. No fim, você revisa o que errou.',
            ]}
          />
          <fieldset className="filter-group">
            <legend>Assuntos</legend>
            <div className="filter-group-options">
              {quizIslands.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  className={`intention-chip ${topics.includes(i.id) ? 'active' : ''}`}
                  aria-pressed={topics.includes(i.id)}
                  onClick={() => toggleTopic(i.id)}
                >
                  {i.title.replace(/^Ilha (da|do|dos|de) /, '')}
                </button>
              ))}
            </div>
            <small className="quiz-setup-note">{topics.length ? `${topics.length} escolhido(s)` : 'Todos os assuntos'}</small>
          </fieldset>
          <fieldset className="filter-group">
            <legend>Dificuldade</legend>
            <div className="filter-group-options">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`intention-chip ${difficulty === d.id ? 'active' : ''}`}
                  aria-pressed={difficulty === d.id}
                  onClick={() => setDifficulty(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="filter-group">
            <legend>Perguntas</legend>
            <div className="filter-group-options">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`intention-chip ${size === n ? 'active' : ''}`}
                  aria-pressed={size === n}
                  onClick={() => setSize(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
          <button type="button" className="btn quiz-start" onClick={start}>
            <Shuffle size={16} aria-hidden="true" /> Começar
          </button>
        </section>
      )}
    </main>
  );
}

export default function QuizIlhas() {
  const { island: islandId, level: levelId } = useParams();
  if (islandId === 'aleatorio') return <RandomQuizPage />;
  const island = getQuizIsland(islandId);
  if (!island) return <Navigate to="/home/trilhas" replace />;
  if (!levelId) return <QuizIslandPage island={island} />;
  const level = LEVELS.find((l) => String(l.id) === levelId);
  if (!level) return <Navigate to={`/home/quiz/${island.id}`} replace />;
  return <QuizLevelPage island={island} level={level} />;
}

/** Cartões das ilhas de quiz, na tela "Escolha uma ilha". */
export function QuizIslandCards() {
  const { quizLevels } = useJourney();
  return (
    <>
      <h2 className="trail-section-title">Ilhas de quiz</h2>
      <p className="trail-hint">Teste o que você sabe, do fácil ao desafio final, ou monte uma partida aleatória.</p>
      <div className="trail-grid">
        <Link to="/home/quiz/aleatorio" className="trail-card is-random" style={{ '--trail': '#B84A13' }}>
          <span className="trail-card-art">
            <TrailIsland icon="estrela" color="#B84A13" />
          </span>
          <strong>Desafio aleatório</strong>
          <span className="trail-card-desc">Escolha os assuntos, a dificuldade e quantas perguntas.</span>
        </Link>
        {quizIslands.map((i) => {
          const done = (quizLevels[i.id] ?? []).length;
          return (
            <Link key={i.id} to={`/home/quiz/${i.id}`} className="trail-card" style={{ '--trail': i.color }}>
              <span className="trail-card-art">
                <TrailIsland icon={i.icon} color={i.color} />
              </span>
              <strong>{i.title}</strong>
              <span className="trail-card-desc">{i.short}</span>
              <span className="trail-card-progress">
                <span className="year-bar">
                  <span style={{ width: `${(done / LEVELS.length) * 100}%`, background: i.color }} />
                </span>
                <small>
                  {done}/{LEVELS.length}
                </small>
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
