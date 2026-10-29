import { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { quizzes } from '../data/quizzes';
import { journey } from '../utils/journeyStore';

/** Quiz curto no fim de cada aba da Escola da Fé: a explicação aparece logo depois de responder. */
export default function Quiz({ topic, title = 'Teste o que você aprendeu' }) {
  const questions = quizzes[topic] ?? [];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return null;
  const q = questions[index];

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      journey.saveQuiz(topic, questions.length, correct);
      setFinished(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setFinished(false);
  };

  return (
    <section className="quiz" aria-labelledby={`quiz-${topic}`}>
      <h2 id={`quiz-${topic}`} className="quiz-title">
        {title}
      </h2>

      {finished ? (
        <div className="quiz-end">
          <p>
            Você acertou <strong>{correct}</strong> de {questions.length}.{' '}
            {correct === questions.length ? 'Muito bem!' : 'Leia de novo as explicações e tente outra vez.'}
          </p>
          <button type="button" className="fx-small-btn" onClick={restart}>
            <RotateCcw size={15} aria-hidden="true" /> Refazer
          </button>
        </div>
      ) : (
        <>
          <p className="quiz-count">
            Pergunta {index + 1} de {questions.length}
          </p>
          <p className="quiz-question">{q.q}</p>
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
                  aria-pressed={picked === i}
                >
                  {state === 'is-right' && <CheckCircle2 size={16} aria-hidden="true" />}
                  {state === 'is-wrong' && <XCircle size={16} aria-hidden="true" />}
                  {option}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="quiz-why" role="status">
              <strong>{picked === q.answer ? 'Isso mesmo!' : 'Quase.'}</strong> {q.why}
              <button type="button" className="btn quiz-next" onClick={next}>
                {index + 1 < questions.length ? 'Próxima pergunta' : 'Ver resultado'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
