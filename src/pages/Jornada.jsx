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
  Sparkles,
  Sunrise,
} from 'lucide-react';
import PrayedTodayButton from '../components/PrayedTodayButton';
import { NovenaBeads } from './Novenas';
import { novenas } from '../data/novenas';
import { trails } from '../data/trails';
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

/** Diário de oração: as últimas semanas, com os dias rezados acesos e uma graça por semana. */
function PrayerDiary() {
  const { prayedDays } = useJourney();
  const weeks = prayerWeeks(prayedDays);

  return (
    <section className="journey-card" aria-labelledby="diary-title">
      <header className="journey-card-head">
        <h2 id="diary-title">Caminho de oração</h2>
        <p>
          Cada dia em que você reza o terço acende uma luz. Faltou um dia? Em cada semana, uma <strong>graça</strong>{' '}
          cobre um dia vazio: o caminho continua.
        </p>
      </header>

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
                {day.status === 'grace' && <Sparkles size={12} aria-hidden="true" />}
              </span>
            ))}
          </div>
        ))}
      </div>

      <ul className="diary-legend" aria-hidden="true">
        <li>
          <span className="diary-day is-prayed" /> Rezou
        </li>
        <li>
          <span className="diary-day is-grace">
            <Sparkles size={10} />
          </span>{' '}
          Graça
        </li>
        <li>
          <span className="diary-day is-empty" /> Sem marcação
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
function todayActions({ prayedDays, novenas: novenaPlans, trails: trailPlans }) {
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
    const plan = trailPlans[t.id];
    if (plan && plan.done.length < t.steps.length) {
      const step = t.steps.find((_, i) => !plan.done.includes(i + 1));
      actions.push({ to: `/home/trilhas/${t.id}`, title: `${t.title}: próxima ilha`, hint: step.title });
    }
  }
  if (actions.length < 3 && !Object.keys(trailPlans).length) {
    actions.push({ to: `/home/trilhas/${trails[0].id}`, title: `Começar a trilha “${trails[0].title}”`, hint: 'Uma ilha por dia' });
  }
  return actions.slice(0, 3);
}

/** Os "jogos" da Jornada, cada um com um desenho, uma cor e o estado atual em uma linha. */
function games(state) {
  const activeNovena = novenas.find((n) => state.novenas[n.id] && state.novenas[n.id].done.length < 9);
  const activeTrail = trails.find((t) => state.trails[t.id] && state.trails[t.id].done.length < t.steps.length);
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
        ? `${state.trails[activeTrail.id].done.length} de ${activeTrail.steps.length} ilhas`
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
      to: '/home/trilhas',
      title: 'Ilhas de quiz',
      Icon: Lightbulb,
      color: '#D98B2B',
      status: quizDone ? `${quizDone} níveis concluídos` : '6 ilhas, do fácil ao desafio',
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
