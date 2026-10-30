import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Flag,
  Flower2,
  Footprints,
  Library,
  Map as MapIcon,
  PartyPopper,
  Stamp,
  Sunrise,
  Zap,
} from 'lucide-react';
import PrayedTodayButton from '../components/PrayedTodayButton';
import GameIntro from '../components/GameIntro';
import TrailIsland from '../components/TrailIsland';
import { novenas } from '../data/novenas';
import { trails } from '../data/trails';
import { completedIslands, islandProgress } from '../utils/islandProgress';

import SaintCollection from '../components/journey/SaintCollection';
import MiracleMap, { MapDrawing } from '../components/journey/MiracleMap';
import SpiritualBouquet, { BouquetVase } from '../components/journey/SpiritualBouquet';
import Passport from '../components/journey/Passport';
import { AvatarFrame } from '../components/journey/Rewards';
import { DiaryCandle, MiniBeads, MiniCandles, MiniRose, MiniStamps } from '../components/journey/GamePreviews';
import { allFrames, islandRewards } from '../data/rewards';
import { journey, prayerWeeks, todayKey, useJourney } from '../utils/journeyStore';
import { saints } from '../data/saints';
import { completeMonths as litMonths } from '../data/saintMonths';
import { eucharisticMiracles } from '../data/eucharisticMiracles';

// Os jogos da Jornada, na ordem da barra de jogos. "to" leva para outra página; os outros abrem aqui mesmo.
const GAMES = [
  { id: 'diario', label: 'Caminho de oração', short: 'Caminho', Icon: Sunrise, color: '#E3A23A' },
  { id: 'missoes', label: 'Missões', short: 'Missões', Icon: Flag, color: '#C8402A' },
  { id: 'buque', label: 'Buquê espiritual', short: 'Buquê', Icon: Flower2, color: '#C2486A' },
  { id: 'trilhas', label: 'Trilhas da fé', short: 'Trilhas', Icon: Footprints, color: '#5E8C63', to: '/home/trilhas' },
  { id: 'quiz', label: 'Desafio aleatório', short: 'Desafio', Icon: Zap, color: '#D98B2B', to: '/home/quiz/aleatorio' },
  { id: 'colecao', label: 'Santos do ano', short: 'Santos', Icon: Library, color: '#7A5A9E' },
  { id: 'mapa', label: 'Mapa dos milagres', short: 'Mapa', Icon: MapIcon, color: '#4F7BB5' },
  { id: 'passaporte', label: 'Passaporte do Peregrino', short: 'Passaporte', Icon: Stamp, color: '#8C6A3F' },
];
const SECTIONS = GAMES.filter((g) => !g.to);
const game = (id) => GAMES.find((g) => g.id === id);

const weekdayInitials = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const dayLabel = (date) => date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

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

/** Cartão de uma missão: as contas com o progresso salvo e o que fazer em seguida. */
function MissionCard({ kicker, title, color, beads, status, hint, to, cta, quick }) {
  return (
    <li className="mission-card" style={{ '--mission': color }}>
      <span className="mission-card-kicker">{kicker}</span>
      <strong>{title}</strong>
      <span className="mission-beads" aria-label={status}>
        {beads.map((b, i) => (
          <span key={i} className={`mission-bead ${b.done ? 'is-done' : ''} ${b.now ? 'is-now' : ''} ${b.quiz ? 'is-quiz' : ''}`} />
        ))}
      </span>
      <small className="mission-card-status">{status}</small>
      {hint && <small className="mission-card-hint">{hint}</small>}
      <span className="mission-card-actions">
        {quick}
        <Link to={to} className="fx-small-btn">
          {cta}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </span>
    </li>
  );
}

/**
 * Missões: um cartão para cada novena e cada ilha, com as contas mostrando o progresso salvo.
 * Tudo fica nesta tela; só sai daqui quando a pessoa escolhe o que quer fazer.
 */
function Missions() {
  const state = useJourney();
  const plans = state.novenas;

  return (
    <section className="journey-card" aria-labelledby="missions-title">
      <header className="journey-card-head">
        <h2 id="missions-title">Missões</h2>
        <p>Suas novenas e ilhas num só lugar. As contas mostram o que você já fez; escolha por onde seguir.</p>
      </header>

      <GameIntro
        id="missoes"
        steps={[
          'Cada cartão é uma missão: uma novena (nove dias de oração) ou uma ilha das trilhas.',
          'As contas acesas mostram o que você já fez; a conta com borda é a próxima.',
          'Nas novenas começadas, marque o dia rezado aqui mesmo. Para ler o dia ou seguir na ilha, toque no botão do cartão.',
        ]}
      />

      <h3 className="mission-group-title">Novenas</h3>
      <ul className="card-list mission-cards">
        {novenas.map((n) => {
          const plan = plans[n.id];
          const done = plan?.done ?? [];
          const nextDay = [1, 2, 3, 4, 5, 6, 7, 8, 9].find((d) => !done.includes(d));
          return (
            <MissionCard
              key={n.id}
              kicker="Nove dias"
              title={n.title}
              color="#C8963E"
              beads={Array.from({ length: 9 }, (_, i) => ({ done: done.includes(i + 1), now: plan && i + 1 === nextDay }))}
              status={!plan ? 'Ainda não começou' : nextDay ? `${done.length} de 9 dias` : 'Novena concluída'}
              hint={plan && nextDay ? `${nextDay}º dia: ${n.days[nextDay - 1][0]}` : n.when}
              to={`/home/novenas/${n.id}`}
              cta={!plan ? 'Começar' : nextDay ? 'Ler o dia' : 'Ver a novena'}
              quick={
                plan &&
                nextDay && (
                  <button type="button" className="journey-mark" onClick={() => journey.togglePlanDay('novenas', n.id, nextDay)}>
                    <Check size={14} aria-hidden="true" /> Rezei o {nextDay}º dia
                  </button>
                )
              }
            />
          );
        })}
      </ul>

      <h3 className="mission-group-title">Ilhas</h3>
      <ul className="card-list mission-cards">
        {trails.map((t) => {
          const progress = islandProgress(t, state);
          return (
            <MissionCard
              key={t.id}
              kicker="Ilha"
              title={t.title}
              color={t.color}
              beads={progress.stops.map((st, i) => ({
                done: progress.isDone(st),
                now: progress.started && i === progress.nextIndex,
                quiz: st.kind === 'quiz',
              }))}
              status={
                progress.complete
                  ? 'Ilha concluída'
                  : progress.started
                    ? `${progress.done} de ${progress.total} paradas`
                    : 'Ainda não começou'
              }
              hint={progress.nextTitle ? `Próxima: ${progress.nextTitle}` : t.short}
              to={`/home/trilhas/${t.id}`}
              cta={progress.complete ? 'Ver a ilha' : progress.started ? 'Continuar' : 'Começar'}
            />
          );
        })}
      </ul>
    </section>
  );
}

/**
 * O destaque do topo: a coisa mais importante para continuar (como "continue de onde parou").
 * Primeiro a ilha em andamento, depois a novena em andamento, depois a próxima ilha a começar.
 */
function continueItem(state) {
  const trail = trails.find((t) => state.trails[t.id] && !islandProgress(t, state).complete);
  if (trail) {
    const p = islandProgress(trail, state);
    return {
      to: `/home/trilhas/${trail.id}`,
      kicker: 'Continue de onde parou',
      title: trail.title,
      detail: `Próxima parada: ${p.nextTitle}`,
      cta: 'Continuar',
      color: trail.color,
      icon: trail.icon,
      done: p.done,
      total: p.total,
    };
  }
  const novena = novenas.find((n) => state.novenas[n.id] && state.novenas[n.id].done.length < 9);
  if (novena) {
    const done = state.novenas[novena.id].done.length;
    return {
      to: `/home/novenas/${novena.id}`,
      kicker: 'Sua novena',
      title: novena.title,
      detail: `${done + 1}º dia: ${novena.days[done][0]}`,
      cta: 'Rezar o dia',
      color: '#C8963E',
      icon: 'lirio',
      done,
      total: 9,
    };
  }
  const next = trails.find((t) => !islandProgress(t, state).complete);
  if (next) {
    return {
      to: `/home/trilhas/${next.id}`,
      kicker: 'Comece uma ilha',
      title: next.title,
      detail: next.short,
      cta: 'Começar',
      color: next.color,
      icon: next.icon,
      done: 0,
      total: islandProgress(next, state).total,
    };
  }
  return {
    to: '/home/quiz/aleatorio',
    kicker: 'Todas as ilhas concluídas',
    title: 'Desafio aleatório',
    detail: 'Perguntas de todas as ilhas, no assunto e na dificuldade que você escolher.',
    cta: 'Jogar',
    color: '#D98B2B',
    icon: 'coroa',
  };
}

/** A lista "Para hoje": o terço do dia (marcado quando rezado) e o dia de cada novena em andamento. */
function todayList(state, skip) {
  const items = [
    {
      to: '/home/oracoes',
      title: 'Rezar o terço de hoje',
      hint: 'No fim, toque em “Marcar terço de hoje”',
      done: state.prayedDays.includes(todayKey()),
    },
  ];
  for (const n of novenas) {
    const plan = state.novenas[n.id];
    const to = `/home/novenas/${n.id}`;
    if (plan && plan.done.length < 9 && to !== skip) {
      items.push({ to, title: `${n.title}: ${plan.done.length + 1}º dia`, hint: n.days[plan.done.length][0] });
    }
  }
  return items.slice(0, 3);
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
};

/** Medalhão do peregrino: saudação, nome (opcional), números do caminho e a moldura escolhida. */
function ProfileCard() {
  const state = useJourney();
  const { name, frame } = state.profile;
  const islands = completedIslands(state);
  const earned = ['simples', ...islands.map((t) => islandRewards[t.id].frame.id)];
  const month = todayKey().slice(0, 7);
  const [editing, setEditing] = useState(false);

  const stats = [
    { value: state.prayedDays.filter((d) => d.startsWith(month)).length, label: 'velas neste mês' },
    { value: `${islands.length}/${trails.length}`, label: 'ilhas concluídas' },
    { value: state.saints.length, label: 'santos guardados' },
    { value: state.miracles.length, label: 'milagres visitados' },
  ];

  return (
    <section className="journey-profile" aria-label="Seu medalhão">
      <div className="journey-profile-top">
        <AvatarFrame frameId={frame} name={name} size={84} />
        <div className="journey-profile-body">
          <small className="journey-hello">{greeting()},</small>
          {editing ? (
            <input
              className="search"
              defaultValue={name}
              maxLength={24}
              placeholder="Seu nome (opcional)"
              aria-label="Seu nome"
              autoFocus
              onBlur={(e) => {
                journey.setProfile({ name: e.target.value.trim() });
                setEditing(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            />
          ) : (
            <button type="button" className="journey-profile-name" onClick={() => setEditing(true)}>
              {name || 'Peregrino'} <small>editar</small>
            </button>
          )}
        </div>
      </div>

      <dl className="journey-stats">
        {stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="journey-frames-box">
        <small>Molduras · uma por ilha concluída</small>
        <div className="journey-frames" role="group" aria-label="Escolher moldura">
          {allFrames.map((f) => {
            const has = earned.includes(f.id);
            const trail = trails.find((t) => islandRewards[t.id]?.frame.id === f.id);
            return (
              <button
                key={f.id}
                type="button"
                className={`journey-frame ${frame === f.id ? 'is-active' : ''}`}
                disabled={!has}
                onClick={() => journey.setProfile({ frame: f.id })}
                title={has ? f.name : `Conclua a ilha "${trail?.title}" para ganhar`}
                aria-label={has ? `Usar ${f.name}` : `${f.name}: conclua a ilha ${trail?.title}`}
                aria-pressed={frame === f.id}
              >
                <AvatarFrame frameId={f.id} size={36} />
              </button>
            );
          })}
        </div>
      </div>

      <Link to="/comunidade" className="journey-profile-community">
        Quem está rezando com você <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </section>
  );
}

/** O cartão grande do topo, com a ilha (ou a novena) desenhada e as contas do progresso. */
function ContinueCard({ item }) {
  return (
    <Link to={item.to} className="journey-continue" style={{ '--game': item.color }}>
      <span className="journey-continue-art" aria-hidden="true">
        <TrailIsland icon={item.icon} color={item.color} />
      </span>
      <span className="journey-continue-body">
        <span className="eyebrow">{item.kicker}</span>
        <strong>{item.title}</strong>
        <small>{item.detail}</small>
        {item.total > 0 && (
          <span className="journey-continue-progress">
            <MiniBeads total={item.total} done={item.done} color={item.color} />
            <small>
              {item.done} de {item.total}
            </small>
          </span>
        )}
        <span className="journey-continue-cta">
          {item.cta} <ArrowRight size={16} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

function TodayList({ items }) {
  const left = items.filter((i) => !i.done).length;
  return (
    <section className="journey-today" aria-labelledby="today-title">
      <header>
        <h2 id="today-title">Para hoje</h2>
        <small>{left === 0 ? 'tudo feito' : `${items.length - left} de ${items.length} feito`}</small>
      </header>
      <ol>
        {items.map((a) => (
          <li key={a.to + a.title} className={a.done ? 'is-done' : ''}>
            <Link to={a.to}>
              <span className="journey-today-check" aria-hidden="true">
                {a.done && <Check size={14} />}
              </span>
              <span>
                <strong>{a.title}</strong>
                <small>{a.done ? 'Feito hoje. Que Deus abençoe!' : a.hint}</small>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
      {left === 0 && (
        <p className="journey-today-done">
          <PartyPopper size={16} aria-hidden="true" /> Tudo feito por hoje. Se quiser, siga num dos jogos abaixo.
        </p>
      )}
    </section>
  );
}

/** Cartão de um jogo. Abre a seção aqui na Jornada ou, quando o jogo tem página própria, leva até ela. */
function GameTile({ id, onOpen, className = '', status, children }) {
  const g = game(id);
  const inner = (
    <>
      <span className="game-tile-head">
        <span className="journey-game-icon" aria-hidden="true">
          <g.Icon size={20} />
        </span>
        <span className="game-tile-text">
          <strong>{g.label}</strong>
          <small>{status}</small>
        </span>
      </span>
      {children && <span className="game-tile-preview">{children}</span>}
    </>
  );
  const props = { className: `game-tile ${className}`, style: { '--game': g.color } };
  return g.to ? (
    <Link to={g.to} {...props}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={() => onOpen(id)} {...props}>
      {inner}
    </button>
  );
}

/** Uma prateleira de jogos, com título e um jeito próprio de arrumar os cartões. */
function Shelf({ title, hint, layout, children }) {
  return (
    <section className={`game-shelf is-${layout}`} aria-label={title}>
      <header>
        <h2>{title}</h2>
        <small>{hint}</small>
      </header>
      <div className="game-shelf-grid">{children}</div>
    </section>
  );
}

/**
 * Tela inicial da Jornada.
 * No PC: o destaque e "Para hoje" à esquerda, o medalhão fixo à direita, e as prateleiras de jogos embaixo.
 * No celular: tudo em uma coluna, começando pelo medalhão com a saudação.
 */
function JourneyHome({ onOpen }) {
  const state = useJourney();
  const hero = continueItem(state);
  const islandsDone = completedIslands(state).map((t) => t.id);
  const activeNovena = novenas.find((n) => state.novenas[n.id] && state.novenas[n.id].done.length < 9);
  const novenaDone = activeNovena ? state.novenas[activeNovena.id].done.length : 0;
  const startedIslands = trails.filter((t) => state.trails[t.id]).length;
  const quizDone = Object.values(state.quizLevels ?? {}).reduce((n, levels) => n + levels.length, 0);
  const completeMonths = litMonths(state.saints);
  const lastBouquet = state.bouquets[0];

  return (
    <div className="journey-hub">
      <div className="journey-hub-side">
        <ProfileCard />
      </div>

      <div className="journey-hub-main">
        <ContinueCard item={hero} />
        <TodayList items={todayList(state, hero.to)} />
      </div>

      <div className="journey-hub-shelves">
        <Shelf title="Rezar" hint="O seu dia a dia de oração" layout="rows">
          <GameTile
            id="diario"
            onOpen={onOpen}
            status={state.prayedDays.includes(todayKey()) ? 'Vela de hoje acesa' : 'Acenda a vela de hoje'}
          >
            <MiniCandles prayedDays={state.prayedDays} />
          </GameTile>
          <GameTile
            id="missoes"
            onOpen={onOpen}
            status={activeNovena ? `${activeNovena.title} · dia ${novenaDone + 1}` : 'Novenas e ilhas num só lugar'}
          >
            {activeNovena ? (
              <MiniBeads total={9} done={novenaDone} color="#C8963E" />
            ) : (
              <span className="game-tile-count">
                {novenas.length} novenas · {trails.length} ilhas
              </span>
            )}
          </GameTile>
          <GameTile
            id="buque"
            onOpen={onOpen}
            status={lastBouquet ? `Último para ${lastBouquet.to}` : 'Ofereça orações por alguém'}
          >
            <span className="game-tile-vase">
              <BouquetVase items={lastBouquet?.items ?? { tercos: 1, missas: 1, avemarias: 1 }} caption={false} />
            </span>
          </GameTile>
        </Shelf>

        <Shelf title="Aprender" hint="Ilhas com etapas curtas e quiz" layout="feature">
          <GameTile
            id="trilhas"
            className="is-big"
            status={`${islandsDone.length} de ${trails.length} ilhas concluídas${startedIslands ? ` · ${startedIslands} começadas` : ''}`}
          >
            <span className="game-tile-islands">
              {trails.map((t) => (
                <span key={t.id} title={t.title}>
                  <TrailIsland
                    icon={t.icon}
                    color={t.color}
                    state={islandsDone.includes(t.id) ? 'done' : state.trails[t.id] ? 'current' : 'locked'}
                  />
                </span>
              ))}
            </span>
            <span className="game-tile-cta">
              Ver as ilhas <ArrowRight size={14} aria-hidden="true" />
            </span>
          </GameTile>
          <GameTile
            id="quiz"
            className="is-bolt"
            status={quizDone ? `${quizDone} quizzes das ilhas já feitos` : 'Perguntas de todas as ilhas'}
          >
            <span className="game-tile-chips" aria-hidden="true">
              <span>Fácil</span>
              <span>Médio</span>
              <span>Difícil</span>
            </span>
            <span className="game-tile-cta">
              Jogar <ArrowRight size={14} aria-hidden="true" />
            </span>
          </GameTile>
        </Shelf>

        <Shelf title="Colecionar" hint="Lembranças do caminho" layout="bento">
          <GameTile
            id="mapa"
            onOpen={onOpen}
            className="is-wide"
            status={`${state.miracles.length} de ${eucharisticMiracles.length} lugares visitados`}
          >
            <span className="game-tile-map">
              <MapDrawing visited={state.miracles} selected={null} onSelect={() => {}} interactive={false} />
            </span>
          </GameTile>
          <GameTile
            id="colecao"
            onOpen={onOpen}
            status={`${state.saints.length} de ${saints.length} santos · ${completeMonths.length} vitrais`}
          >
            <MiniRose complete={completeMonths} />
          </GameTile>
          <GameTile id="passaporte" onOpen={onOpen} status={`${islandsDone.length} de ${trails.length} carimbos`}>
            <MiniStamps done={islandsDone} />
          </GameTile>
        </Shelf>
      </div>
    </div>
  );
}

/** Barra com todos os jogos, para trocar de um para outro sem voltar à tela inicial. */
function GameSwitcher({ current, onOpen }) {
  const navRef = useRef(null);
  // No celular a barra rola para o lado: deixa o jogo aberto no meio dela.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector('.is-active');
    if (active) nav.scrollLeft = active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.clientWidth) / 2;
  }, [current]);

  return (
    <nav ref={navRef} className="game-switcher" aria-label="Jogos da Jornada">
      {GAMES.map((g) => {
        const content = (
          <>
            <g.Icon size={15} aria-hidden="true" /> {g.short}
          </>
        );
        return g.to ? (
          <Link key={g.id} to={g.to} style={{ '--game': g.color }}>
            {content}
          </Link>
        ) : (
          <button
            key={g.id}
            type="button"
            style={{ '--game': g.color }}
            className={current === g.id ? 'is-active' : ''}
            aria-current={current === g.id ? 'page' : undefined}
            onClick={() => onOpen(g.id)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

/**
 * Jornada: o progresso pessoal de oração e de estudo, guardado só neste aparelho.
 * Abre numa tela inicial com o que fazer hoje e as prateleiras de jogos; cada jogo abre aqui mesmo,
 * com a barra de jogos em cima para trocar e "← Jornada" para voltar.
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
          <GameSwitcher current={section.id} onOpen={open} />
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
            {section.id === 'passaporte' && <Passport />}
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
          <p className="lead">O que fazer hoje e o seu caminho até aqui. Fica tudo só neste aparelho, sem pontos e sem ranking.</p>
          <JourneyHome onOpen={open} />
        </>
      )}
    </main>
  );
}
