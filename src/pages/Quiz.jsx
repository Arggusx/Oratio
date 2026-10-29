import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Shuffle, XCircle } from 'lucide-react';
import GameIntro from '../components/GameIntro';
import { LEVELS, QUIZ_TOPICS, buildRound } from '../data/quizBank';
import { getTrail, trailStops } from '../data/trails';
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
                ? 'Concluído! A próxima parada do caminho abriu.'
                : `Para seguir no caminho, acerte pelo menos ${pass}. Tente de novo: as perguntas mudam de ordem.`}
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

/**
 * Uma parada de quiz dentro de uma trilha: perguntas do assunto da ilha, no nível daquela parada.
 * Só abre quando a parada anterior do caminho foi concluída.
 */
function TrailQuizPage({ trail, level }) {
  const navigate = useNavigate();
  const { trails: plans, quizLevels } = useJourney();
  const [seed, setSeed] = useState(0);
  const round = useMemo(
    () => buildRound({ topic: trail.quizTopic, level: level.id, size: level.size, mixed: level.mixed }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trail.id, level.id, seed]
  );

  // A parada anterior no caminho precisa estar concluída.
  const stops = trailStops(trail);
  const position = stops.findIndex((st) => st.kind === 'quiz' && st.level === level.id);
  const before = stops[position - 1];
  const passed = quizLevels[trail.id] ?? [];
  const lessonsDone = plans[trail.id]?.done ?? [];
  const unlocked =
    !before || (before.kind === 'lesson' ? lessonsDone.includes(before.day) : passed.includes(before.level));
  if (!unlocked) return <Navigate to={`/home/trilhas/${trail.id}`} replace />;

  return (
    <main className="page quiz-page" style={{ '--trail': trail.color }}>
      <header className="trail-head">
        <div>
          <span className="eyebrow">{trail.title}</span>
          <h1>{level.title}</h1>
        </div>
        <Link to={`/home/trilhas/${trail.id}`} className="fx-small-btn">
          <ArrowLeft size={16} aria-hidden="true" /> Ilha
        </Link>
      </header>
      <GameIntro
        id="quiz"
        steps={[
          'Pelo caminho da ilha há quatro paradas de quiz: fácil, médio, difícil e o desafio final, que mistura tudo.',
          'Cada pergunta tem quatro alternativas. Depois de responder, aparece a explicação, acertando ou não.',
          'Acerte pelo menos 3 de 4 (ou 5 de 6 no desafio final) para seguir no caminho.',
          'Errou? É só jogar de novo: as perguntas e as alternativas mudam de ordem, e nada se perde.',
        ]}
      />
      <QuizRound
        key={seed}
        round={round}
        color={trail.color}
        pass={level.pass}
        onPassed={() => journey.passQuizLevel(trail.id, level.id)}
        onRestart={() => setSeed(seed + 1)}
        exitTo={`/home/trilhas/${trail.id}`}
        exitLabel="Voltar à ilha"
        nextAction={
          <button type="button" className="btn" onClick={() => navigate(`/home/trilhas/${trail.id}`)}>
            Continuar o caminho
            <ArrowRight size={16} aria-hidden="true" />
          </button>
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
    const chosen = topics.length ? topics : QUIZ_TOPICS.map((t) => t.id);
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
              {QUIZ_TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`intention-chip ${topics.includes(t.id) ? 'active' : ''}`}
                  aria-pressed={topics.includes(t.id)}
                  onClick={() => toggleTopic(t.id)}
                >
                  {t.label}
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

/** Rotas do quiz: /home/trilhas/:id/quiz/:level (parada de quiz numa ilha) e /home/quiz/aleatorio. */
export default function Quiz() {
  const { id, level: levelId } = useParams();
  if (!id) return <RandomQuizPage />;
  const trail = getTrail(id);
  const level = LEVELS.find((l) => String(l.id) === levelId);
  if (!trail || !level) return <Navigate to="/home/trilhas" replace />;
  return <TrailQuizPage trail={trail} level={level} />;
}
