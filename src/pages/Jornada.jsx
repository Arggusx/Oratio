import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  Flag,
  Flower2,
  Footprints,
  Library,
  Lightbulb,
  Map as MapIcon,
  Orbit,
  PartyPopper,
  Sunrise,
} from 'lucide-react';
import PrayedTodayButton from '../components/PrayedTodayButton';
import GameIntro from '../components/GameIntro';
import { NovenaBeads } from './Novenas';
import { novenas } from '../data/novenas';
import { trails, trailStops } from '../data/trails';
import { LEVELS } from '../data/quizBank';

/** Próxima parada de uma ilha (etapa ou quiz) e o progresso, considerando as duas coisas. */
function nextStop(trail, trailPlans, quizLevels) {
  const lessons = trailPlans[trail.id]?.done ?? [];
  const passed = quizLevels?.[trail.id] ?? [];
  const stops = trailStops(trail);
  const isDone = (st) => (st.kind === 'lesson' ? lessons.includes(st.day) : passed.includes(st.level));
  const next = stops.find((st) => !isDone(st));
  return {
    done: stops.filter(isDone).length,
    total: stops.length,
    title: next ? (next.kind === 'lesson' ? next.step.title : LEVELS.find((l) => l.id === next.level).title) : null,
  };
}
import { TrailSteps } from './Trilhas';
import SaintCollection from '../components/journey/SaintCollection';
import MiracleMap from '../components/journey/MiracleMap';
import SpiritualBouquet from '../components/journey/SpiritualBouquet';
import YearJourney from '../components/journey/YearJourney';
import { prayerWeeks, todayKey, useJourney } from '../utils/journeyStore';
import { saints } from '../data/saints';
import { eucharisticMiracles } from '../data/eucharisticMiracles';

const SECTIONS = [
  { id: 'diario', label: 'Diário' },
  { id: 'missoes', label: 'Missões' },
  { id: 'colecao', label: 'Coleção' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'buque', label: 'Buquê' },
  { id: 'ano', label: 'Ano' },
];

const weekdayInitials = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const dayLabel = (date) => date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

/** Vela do caminho de oração: acesa (rezou), com estrela (graça), apagada ou ainda por vir. */
function DiaryCandle({ status }) {
  return (
    <svg viewBox="0 0 20 32" className="diary-candle" aria-hidden="true" focusable="false">
      {status === 'prayed' && <ellipse className="diary-candle-halo" cx="10" cy="8" rx="9" ry="9" />}
      {status === 'prayed' && <path className="diary-candle-flame" d="M10 2c3 4 4 6 0 10-4-4-3-6 0-10z" />}
      {status === 'grace' && <path className="diary-candle-star" d="M10 3l1.6 3.4 3.6.4-2.7 2.4.8 3.6L10 11l-3.3 1.8.8-3.6-2.7-2.4 3.6-.4z" />}
      <path className="diary-candle-wick" d="M10 12v3" />
      <rect className="diary-candle-body" x="6" y="15" width="8" height="15" rx="1.5" />
    </svg>
  );
}

/** Diário de oração: as últimas semanas, com uma vela acesa em cada dia rezado e uma graça por semana. */
function PrayerDiary() {
  const { prayedDays } = useJourney();
  const weeks = prayerWeeks(prayedDays);

  return (
    <section className="journey-card" aria-labelledby="diary-title">
      <header className="journey-card-head">
        <h2 id="diary-title">Caminho de oração</h2>
        <p>Cada dia em que você reza o terço acende uma vela. Seis semanas de caminho, sempre recomeçando.</p>
      </header>

      <GameIntro
        id="diario"
        steps={[
          'Reze o terço e, no fim, toque em "Marcar terço de hoje" (ou aqui embaixo).',
          'A vela do dia acende. As velas formam o seu caminho das últimas seis semanas.',
          'Faltou um dia? Em cada semana, uma graça (a estrelinha) cobre um dia vazio. Não há castigo: o caminho continua.',
        ]}
      />

      <div className="diary-grid" role="table" aria-label="Dias rezados nas últimas semanas">
        <div className="diary-row diary-head" role="row">
          {weekdayInitials.map((d, i) => (
            <span key={i} role="columnheader">
              {d}
            </span>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week.sunday.toISOString()} className="diary-row" role="row">
            {week.days.map((day) => (
              <span
                key={day.key}
                role="cell"
                className={`diary-day is-${day.status} ${day.isToday ? 'is-today' : ''}`}
                title={dayLabel(day.date)}
                aria-label={`${dayLabel(day.date)}: ${
                  { prayed: 'rezou', grace: 'coberto por uma graça', empty: 'sem marcação', future: 'ainda não chegou' }[
                    day.status
                  ]
                }`}
              >
                <DiaryCandle status={day.status} />
              </span>
            ))}
          </div>
        ))}
      </div>

      <ul className="diary-legend" aria-hidden="true">
        <li>
          <DiaryCandle status="prayed" /> Rezou
        </li>
        <li>
          <DiaryCandle status="grace" /> Graça
        </li>
        <li>
          <DiaryCandle status="empty" /> Sem marcação
        </li>
      </ul>

      <PrayedTodayButton />
    </section>
  );
}

/** Missões: novenas (e, mais adiante, trilhas) em andamento, cada uma com o seu progresso. */
function Missions() {
  const { novenas: plans, trails: trailPlans } = useJourney();
  const active = novenas.filter((n) => plans[n.id]);
  const activeTrails = trails.filter((t) => trailPlans[t.id]);
  const others = novenas.filter((n) => !plans[n.id]);

  return (
    <section className="journey-card" aria-labelledby="missions-title">
      <header className="journey-card-head">
        <h2 id="missions-title">Missões</h2>
        <p>Novenas e trilhas que você começou. Cada conta acende quando você marca o dia.</p>
      </header>

      <GameIntro
        id="missoes"
        steps={[
          'Uma missão é uma novena (nove dias de oração) ou uma ilha das trilhas.',
          'Comece uma novena na página dela e marque cada dia rezado: as nove contas vão acendendo.',
          'Aqui você vê o que está em andamento e volta direto para o dia ou a parada seguinte.',
        ]}
      />

      {active.length + activeTrails.length === 0 ? (
        <p className="calendar-empty">Nenhuma novena ou trilha em andamento.</p>
      ) : (
        <ul className="mission-list">
          {active.map((n) => (
            <li key={n.id}>
              <Link to={`/home/novenas/${n.id}`} className="mission-item">
                <span>
                  <strong>{n.title}</strong>
                  <small>{plans[n.id].done.length} de 9 dias</small>
                </span>
                <NovenaBeads plan={plans[n.id]} size="sm" />
              </Link>
            </li>
          ))}
          {activeTrails.map((t) => (
            <li key={t.id}>
              <Link to={`/home/trilhas/${t.id}`} className="mission-item">
                <span>
                  <strong>{t.title}</strong>
                  <small>
                    {trailPlans[t.id].done.length} de {t.steps.length} etapas
                  </small>
                </span>
                <TrailSteps trail={t} plan={trailPlans[t.id]} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {others.length > 0 && (
        <p className="mission-more">
          Começar outra:{' '}
          {others.map((n, i) => (
            <span key={n.id}>
              {i > 0 && ' · '}
              <Link to={`/home/novenas/${n.id}`}>{n.title.replace('Novena ', '')}</Link>
            </span>
          ))}{' '}
          <Link to="/home/novenas" aria-label="Ver todas as novenas">
            <ArrowRight size={14} />
          </Link>
        </p>
      )}
      <p className="mission-more">
        Trilhas: <Link to="/home/trilhas">ver todas</Link>
      </p>
    </section>
  );
}

/** Próximas ações do dia (no máximo três): o que fazer agora, sem precisar procurar. */
function todayActions({ prayedDays, novenas: novenaPlans, trails: trailPlans, quizLevels }) {
  const actions = [];
  if (!prayedDays.includes(todayKey())) {
    actions.push({ to: '/home/oracoes', title: 'Rezar o terço de hoje', hint: 'No fim, toque em “Marcar terço de hoje”' });
  }
  for (const n of novenas) {
    const plan = novenaPlans[n.id];
    if (plan && plan.done.length < 9) {
      actions.push({ to: `/home/novenas/${n.id}`, title: `${n.title}: ${plan.done.length + 1}º dia`, hint: n.days[plan.done.length][0] });
    }
  }
  for (const t of trails) {
    const next = trailPlans[t.id] && nextStop(t, trailPlans, quizLevels);
    if (next?.title) {
      actions.push({ to: `/home/trilhas/${t.id}`, title: `${t.title}: próxima parada`, hint: next.title });
    }
  }
  if (actions.length < 3 && !Object.keys(trailPlans).length) {
    actions.push({ to: `/home/trilhas/${trails[0].id}`, title: `Começar a ilha “${trails[0].title}”`, hint: 'Etapas curtas e quiz' });
  }
  return actions.slice(0, 3);
}

/** Os "jogos" da Jornada, cada um com um desenho, uma cor e o estado atual em uma linha. */
function games(state) {
  const activeNovena = novenas.find((n) => state.novenas[n.id] && state.novenas[n.id].done.length < 9);
  const activeTrail = trails.find((t) => state.trails[t.id] && nextStop(t, state.trails, state.quizLevels).title);
  const trailProgress = activeTrail && nextStop(activeTrail, state.trails, state.quizLevels);
  const quizDone = Object.values(state.quizLevels ?? {}).reduce((n, levels) => n + levels.length, 0);
  return [
    {
      id: 'diario',
      title: 'Caminho de oração',
      Icon: Sunrise,
      color: '#E3A23A',
      status: state.prayedDays.includes(todayKey()) ? 'Dia de hoje aceso' : 'Acenda o dia de hoje',
    },
    {
      id: 'missoes',
      title: 'Missões',
      Icon: Flag,
      color: '#C8402A',
      status: activeNovena
        ? `${activeNovena.title} · dia ${state.novenas[activeNovena.id].done.length + 1}`
        : 'Comece uma novena',
    },
    {
      id: 'trilhas',
      to: activeTrail ? `/home/trilhas/${activeTrail.id}` : '/home/trilhas',
      title: 'Trilhas da fé',
      Icon: Footprints,
      color: '#5E8C63',
      status: activeTrail
        ? `${trailProgress.done} de ${trailProgress.total} paradas`
        : 'Caminho de ilhas',
    },
    {
      id: 'colecao',
      title: 'Coleção de santos',
      Icon: Library,
      color: '#7A5A9E',
      status: `${state.saints.length} de ${saints.length} guardados`,
    },
    {
      id: 'mapa',
      title: 'Mapa dos milagres',
      Icon: MapIcon,
      color: '#4F7BB5',
      status: `${state.miracles.length} de ${eucharisticMiracles.length} visitados`,
    },
    {
      id: 'quiz',
      to: '/home/quiz/aleatorio',
      title: 'Desafio aleatório',
      Icon: Lightbulb,
      color: '#D98B2B',
      status: quizDone ? `${quizDone} quizzes das ilhas feitos` : 'Perguntas de todas as ilhas',
    },
    {
      id: 'buque',
      title: 'Buquê espiritual',
      Icon: Flower2,
      color: '#C2486A',
      status: state.bouquets.length ? `${state.bouquets.length} buquê(s) montado(s)` : 'Ofereça orações por alguém',
    },
    {
      id: 'ano',
      title: 'O ano como jornada',
      Icon: Orbit,
      color: '#3F6B45',
      status: 'O anel se preenche',
    },
  ];
}

/** Tela inicial da Jornada: "Para hoje" e os cartões de cada jogo. */
function JourneyHome({ onOpen }) {
  const state = useJourney();
  const actions = todayActions(state);

  return (
    <>
      <section className="journey-today" aria-labelledby="today-title">
        <h2 id="today-title">Para hoje</h2>
        {actions.length === 0 ? (
          <p className="journey-today-done">
            <PartyPopper size={18} aria-hidden="true" /> Tudo feito por hoje. Que Deus abençoe o seu dia!
          </p>
        ) : (
          <ol>
            {actions.map((a) => (
              <li key={a.to + a.title}>
                <Link to={a.to}>
                  <span>
                    <strong>{a.title}</strong>
                    <small>{a.hint}</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <h2 className="journey-games-title">Seus jogos</h2>
      <ul className="journey-games">
        {games(state).map((g) => {
          const content = (
            <>
              <span className="journey-game-icon" style={{ '--game': g.color }} aria-hidden="true">
                <g.Icon size={26} />
              </span>
              <strong>{g.title}</strong>
              <small>{g.status}</small>
            </>
          );
          return (
            <li key={g.id}>
              {g.to ? (
                <Link to={g.to} className="journey-game" style={{ '--game': g.color }}>
                  {content}
                </Link>
              ) : (
                <button type="button" className="journey-game" style={{ '--game': g.color }} onClick={() => onOpen(g.id)}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/**
 * Jornada: o progresso pessoal de oração e de estudo, guardado só neste aparelho.
 * Abre numa tela inicial com o que fazer hoje e os "jogos"; cada jogo abre por cima, com "← Jornada" para voltar.
 * Nada de pontos nem ranking: as luzes, a coleção e o mapa são lembranças do caminho.
 */
export default function Jornada() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = SECTIONS.find((s) => s.id === searchParams.get('secao'));
  const open = (id) => {
    setSearchParams({ secao: id });
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="page journey-page">
      {section ? (
        <>
          <button type="button" className="saint-back-link journey-back" onClick={() => setSearchParams({})}>
            <ChevronLeft size={16} aria-hidden="true" />
            Jornada
          </button>
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {section.id === 'diario' && <PrayerDiary />}
            {section.id === 'missoes' && <Missions />}
            {section.id === 'colecao' && <SaintCollection />}
            {section.id === 'mapa' && <MiracleMap />}
            {section.id === 'buque' && <SpiritualBouquet />}
            {section.id === 'ano' && <YearJourney />}
          </motion.div>
        </>
      ) : (
        <>
          <div className="page-title-row">
            <div>
              <span className="eyebrow">Sua peregrinação</span>
              <h1 className="section-title">Jornada</h1>
            </div>
          </div>
          <p className="lead">
            O que fazer hoje e o seu caminho até aqui. Fica tudo só neste aparelho, sem pontos e sem ranking.
          </p>
          <JourneyHome onOpen={open} />
          <Link to="/comunidade" className="community-inline is-block">
            Veja quem está rezando com você e o mural de intenções na Comunidade
          </Link>
        </>
      )}
    </main>
  );
}
