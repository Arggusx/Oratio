import { BookOpen } from 'lucide-react';
import { getLiturgicalCycle } from '../utils/liturgicalCalendar';

const CYCLES = [
  {
    id: 'A',
    gospel: 'Mateus',
    symbol: 'o homem',
    text: 'Escrito para cristãos vindos do judaísmo, mostra Jesus como o Messias prometido, que cumpre as Escrituras e ensina como o novo Moisés.',
  },
  {
    id: 'B',
    gospel: 'Marcos',
    symbol: 'o leão',
    text: 'O Evangelho mais curto e direto, centrado nas ações de Jesus. Como é breve, no verão do Ano B a Igreja intercala o capítulo 6 de João, o discurso do Pão da Vida.',
  },
  {
    id: 'C',
    gospel: 'Lucas',
    symbol: 'o touro',
    text: 'O Evangelho da misericórdia: traz as parábolas do filho pródigo e do bom samaritano e destaca os pobres, as mulheres e a oração.',
  },
];

// Os grandes trechos de Mateus que guiam os domingos do Tempo Comum no Ano A.
const MATTHEW_PATH = [
  ['Sermão da Montanha', 'Mt 5–7', 'as bem-aventuranças, o sal da terra e a luz do mundo, o Pai-Nosso.'],
  ['Missão dos apóstolos', 'Mt 10', 'Jesus envia os Doze e os prepara para as dificuldades.'],
  ['Parábolas do Reino', 'Mt 13', 'o semeador, o joio e o trigo, o tesouro escondido e a pérola.'],
  ['Vida da comunidade', 'Mt 18', 'a correção fraterna e o perdão “setenta vezes sete”.'],
  ['Fim dos tempos', 'Mt 24–25', 'as virgens prudentes, os talentos e o Juízo Final, lido na Solenidade de Cristo Rei.'],
];

const dayMonth = (date) => date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Os três anos (A, B e C) das leituras de domingo e o ciclo dos dias de semana, com o ano em curso em destaque. */
export default function LiturgicalCycles() {
  const cycle = getLiturgicalCycle();
  const current = CYCLES.find((c) => c.id === cycle.sunday);
  const next = CYCLES[(CYCLES.indexOf(current) + 1) % 3];

  return (
    <section className="cycles" aria-labelledby="cycles-title">
      <header className="cycles-head">
        <BookOpen size={20} aria-hidden="true" />
        <div>
          <h2 id="cycles-title" className="calendar-panel-title">Ciclos de leituras</h2>
          <p>
            Para que os fiéis ouçam a maior parte da Bíblia, as leituras dos domingos seguem um ciclo de três anos,
            cada um guiado por um Evangelho. João aparece todos os anos, sobretudo na Quaresma e no Tempo Pascal.
          </p>
        </div>
      </header>

      <div className="cycles-grid">
        {CYCLES.map((c) => (
          <article key={c.id} className={`cycle-card ${c.id === current.id ? 'is-current' : ''}`}>
            <span className="cycle-letter" aria-hidden="true">{c.id}</span>
            <div>
              <h3>
                Ano {c.id} · {c.gospel}
                {c.id === current.id && <span className="cycle-badge">Este ano</span>}
              </h3>
              <p>{c.text}</p>
              <small>Símbolo do evangelista: {c.symbol}</small>
            </div>
          </article>
        ))}
      </div>

      <p className="cycles-now">
        O ano litúrgico {cycle.liturgicalYear} começou em {dayMonth(cycle.start)}. Os domingos seguem o{' '}
        <strong>Ano {current.id}</strong> e os dias de semana, o <strong>Ano {cycle.weekday}</strong> (ano
        {cycle.weekday === 'II' ? ' par' : ' ímpar'}). Em {dayMonth(cycle.nextStart)}, 1º Domingo do Advento, começa
        o Ano {next.id}, com o Evangelho de {next.gospel}.
      </p>

      {current.id === 'A' && (
        <div className="cycles-matthew">
          <h3>O caminho de Mateus nos domingos do Tempo Comum</h3>
          <p>
            No Ano A, o Evangelho de Mateus é lido quase em sequência, domingo após domingo. Ele se organiza em cinco
            grandes discursos de Jesus, que formam o roteiro do ano:
          </p>
          <ol>
            {MATTHEW_PATH.map(([title, ref, text]) => (
              <li key={ref}>
                <strong>{title}</strong> <span className="cycles-ref">({ref})</span>: {text}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
