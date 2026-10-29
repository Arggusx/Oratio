import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import PrayedTodayButton from '../components/PrayedTodayButton';
import { NovenaBeads } from './Novenas';
import { novenas } from '../data/novenas';
import { trails } from '../data/trails';
import { TrailSteps } from './Trilhas';
import SaintCollection from '../components/journey/SaintCollection';
import MiracleMap from '../components/journey/MiracleMap';
import SpiritualBouquet from '../components/journey/SpiritualBouquet';
import YearJourney from '../components/journey/YearJourney';
import { prayerWeeks, useJourney } from '../utils/journeyStore';

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

/**
 * Jornada: o progresso pessoal de oração e de estudo, guardado só neste aparelho.
 * Nada de pontos nem ranking: as luzes, a coleção e o mapa são lembranças do caminho.
 */
export default function Jornada() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = SECTIONS.some((s) => s.id === searchParams.get('secao')) ? searchParams.get('secao') : 'diario';
  const setSection = (id) => setSearchParams(id === 'diario' ? {} : { secao: id }, { replace: true });

  return (
    <main className="page journey-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Sua peregrinação</span>
          <h1 className="section-title">Jornada</h1>
        </div>
      </div>
      <p className="lead">
        Acompanhe seu caminho: os dias de oração, as missões em andamento e o que você já descobriu. Fica tudo só
        neste aparelho, sem pontos e sem ranking.
      </p>

      {SECTIONS.length > 1 && (
        <div className="subnav-segmented" role="tablist" aria-label="Seções da Jornada">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={section === s.id}
              className={section === s.id ? 'active' : ''}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {section === 'diario' && <PrayerDiary />}
        {section === 'missoes' && <Missions />}
        {section === 'colecao' && <SaintCollection />}
        {section === 'mapa' && <MiracleMap />}
        {section === 'buque' && <SpiritualBouquet />}
        {section === 'ano' && <YearJourney />}
      </motion.div>
    </main>
  );
}
