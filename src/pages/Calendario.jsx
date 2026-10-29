import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, X, CalendarDays } from 'lucide-react';
import { getSaint } from '../data/saints';
import Bell from '../components/anim/Bell';
import LiturgicalYearRing from '../components/anim/LiturgicalYearRing';
import LiturgicalCycles from '../components/LiturgicalCycles';
import {
  EVENT_TYPES,
  MONTH_NAMES,
  WEEKDAY_SHORT,
  getYearEvents,
  getLiturgicalSeason,
  makeDate,
  toKey,
  fromKey,
  normalizeText,
} from '../utils/liturgicalCalendar';

const ALL_TYPES = Object.keys(EVENT_TYPES);

// Dias de preceito (Missa obrigatória) são marcados com uma cruz, sem cor,
// independentemente do tipo de celebração.
const PRECEPT_TYPES = ['domingo', 'santo'];
// A cor de fundo mostra o tipo de celebração, nesta ordem de prioridade.
const FILL_PRIORITY = ['solenidade', 'festaSanto', 'feriado', 'facultativo'];

const LEGEND = [
  { id: 'preceito', types: PRECEPT_TYPES, label: 'Dia de preceito (Missa obrigatória)', isPrecept: true },
  ...FILL_PRIORITY.map((t) => ({ id: t, types: [t], label: EVENT_TYPES[t].label, color: EVENT_TYPES[t].color })),
];

const SEASON_LABEL = {
  advento: 'Tempo do Advento',
  natal: 'Tempo do Natal',
  quaresma: 'Tempo da Quaresma',
  triduo: 'Tríduo Pascal',
  pascoa: 'Tempo Pascal',
  comum: 'Tempo Comum',
};

const longDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const shortDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

function TypeBadges({ types }) {
  return (
    <span className="calendar-type-badges">
      {types.map((t) => (
        <span key={t} className="calendar-type-badge" style={{ '--type-color': EVENT_TYPES[t].color }}>
          {EVENT_TYPES[t].label}
        </span>
      ))}
    </span>
  );
}

export default function Calendario() {
  const todayKey = toKey(new Date());
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeTypes, setActiveTypes] = useState(() => new Set(ALL_TYPES));
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const panelRef = useRef(null);

  // Ao escolher um dia, sobe até o painel com as informações dele, no topo da página.
  const selectDay = (key) => {
    setSelectedKey(key);
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const events = useMemo(() => getYearEvents(year), [year]);
  const normalizedQuery = normalizeText(query.trim());

  // Eventos visíveis de cada dia, já aplicando legenda e busca.
  const visibleByDay = useMemo(() => {
    const map = new Map();
    for (const [key, list] of events) {
      const visible = list
        .map((e) => ({ ...e, types: e.types.filter((t) => activeTypes.has(t)) }))
        .filter((e) => e.types.length > 0)
        .filter((e) => !normalizedQuery || normalizeText(e.name).includes(normalizedQuery));
      if (visible.length > 0) map.set(key, visible);
    }
    return map;
  }, [events, activeTypes, normalizedQuery]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return [...visibleByDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([key, list]) => list.map((e) => ({ key, ...e })));
  }, [visibleByDay, normalizedQuery]);

  const isLegendActive = (item) => item.types.every((t) => activeTypes.has(t));

  const toggleLegend = (item) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      const active = item.types.every((t) => next.has(t));
      item.types.forEach((t) => (active ? next.delete(t) : next.add(t)));
      return next;
    });
  };

  const changeYear = (delta) => {
    const nextYear = year + delta;
    setYear(nextYear);
    setSelectedKey(nextYear === new Date().getFullYear() ? todayKey : `${nextYear}-01-01`);
  };

  const selectedDate = fromKey(selectedKey);
  const selectedEvents = events.get(selectedKey) ?? [];

  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Ano litúrgico</span>
          <h1 className="section-title">Calendário Católico</h1>
        </div>
        <Bell />
      </div>
      <p className="lead">
        Domingos de preceito, dias santos de guarda, principais celebrações da Igreja e feriados nacionais do Brasil.
      </p>

      <LiturgicalCycles />

      <div className="calendar-toolbar">
        <div className="calendar-year-nav">
          <button className="calendar-icon-btn" onClick={() => changeYear(-1)} aria-label="Ano anterior">
            <ChevronLeft size={18} />
          </button>
          <strong className="calendar-year">{year}</strong>
          <button className="calendar-icon-btn" onClick={() => changeYear(1)} aria-label="Próximo ano">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="search-wrapper calendar-search">
          <Search size={16} className="search-icon" />
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por nome (ex.: Páscoa, Aparecida, Natal)"
            aria-label="Pesquisar datas por nome"
          />
          {query && (
            <button className="calendar-clear-search" onClick={() => setQuery('')} aria-label="Limpar pesquisa">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="calendar-legend" role="group" aria-label="Filtrar por legenda">
        {LEGEND.map((item) => (
          <button
            key={item.id}
            className={`calendar-legend-item ${isLegendActive(item) ? 'active' : ''} ${item.isPrecept ? 'is-precept' : ''}`}
            style={item.color ? { '--type-color': item.color } : undefined}
            onClick={() => toggleLegend(item)}
            aria-pressed={isLegendActive(item)}
          >
            {item.isPrecept ? (
              <span className="calendar-legend-cross" aria-hidden="true">✝</span>
            ) : (
              <span className="calendar-legend-dot" />
            )}
            {item.label}
          </button>
        ))}
        {activeTypes.size !== ALL_TYPES.length && (
          <button className="calendar-legend-reset" onClick={() => setActiveTypes(new Set(ALL_TYPES))}>
            Mostrar todas
          </button>
        )}
      </div>

      <p className="calendar-legend-help">
        A <strong>cruz (✝)</strong> marca os dias de preceito: todos os domingos e os dias santos de guarda,
        em que a participação na Missa é obrigatória. A <strong>cor de fundo</strong> indica o tipo de celebração, e os{' '}
        <strong>pontinhos</strong> mostram outras marcações no mesmo dia. O anel dourado indica o dia de hoje.
      </p>

      {normalizedQuery ? (
        <section className="calendar-results" aria-live="polite">
          <h2 className="calendar-panel-title">
            {searchResults.length} resultado{searchResults.length === 1 ? '' : 's'} para “{query.trim()}” em {year}
          </h2>
          {searchResults.length === 0 ? (
            <p className="calendar-empty">Nenhuma data encontrada. Verifique os filtros da legenda ou tente outro nome.</p>
          ) : (
            <ul className="calendar-results-list">
              {searchResults.map((r) => (
                <li key={`${r.key}-${r.name}`}>
                  <button
                    className={`calendar-result ${selectedKey === r.key ? 'active' : ''}`}
                    onClick={() => selectDay(r.key)}
                  >
                    <span className="calendar-result-date">{shortDate.format(fromKey(r.key))}</span>
                    <span className="calendar-result-name">{r.name}</span>
                    <TypeBadges types={r.types} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {/* Anel do ano litúrgico: cada tempo na sua cor e um ponto no dia de hoje */}
      <div className="calendar-year-ring">
        <LiturgicalYearRing />
      </div>

      <section className="calendar-day-panel" aria-live="polite" ref={panelRef}>
        <div className="calendar-day-panel-head">
          <CalendarDays size={18} />
          <h2 className="calendar-panel-title">{longDate.format(selectedDate)}</h2>
        </div>
        <p className="calendar-season">{SEASON_LABEL[getLiturgicalSeason(selectedDate)]}</p>
        {selectedEvents.length === 0 ? (
          <p className="calendar-empty">Nenhuma celebração especial marcada para este dia.</p>
        ) : (
          <ul className="calendar-day-events">
            {selectedEvents.map((e) => (
              <li key={e.name}>
                <strong>{e.name}</strong>
                <TypeBadges types={e.types} />
                {e.note && <p>{e.note}</p>}
                {e.saints?.map((slug) => (
                  <Link key={slug} to={`/home/santos/${slug}`} className="prayer-saint-link">
                    Conheça {getSaint(slug)?.name}
                    <ChevronRight size={15} />
                  </Link>
                ))}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="calendar-grid">
        {MONTH_NAMES.map((monthName, monthIndex) => {
          const firstDay = makeDate(year, monthIndex + 1, 1);
          const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
          const blanks = firstDay.getDay();

          return (
            <motion.section
              key={monthName}
              className="calendar-month"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: monthIndex * 0.02 }}
              aria-label={`${monthName} de ${year}`}
            >
              <h3 className="calendar-month-title">{monthName}</h3>
              <div className="calendar-weekdays" aria-hidden="true">
                {WEEKDAY_SHORT.map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
              <div className="calendar-days">
                {Array.from({ length: blanks }, (_, i) => (
                  <span key={`b${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const key = toKey(makeDate(year, monthIndex + 1, day));
                  const visible = visibleByDay.get(key);
                  const types = visible ? [...new Set(visible.flatMap((e) => e.types))] : [];
                  const isPrecept = types.some((t) => PRECEPT_TYPES.includes(t));
                  const fillTypes = FILL_PRIORITY.filter((t) => types.includes(t));
                  const mainType = fillTypes[0];
                  const dimmed = normalizedQuery && !visible;

                  return (
                    <button
                      key={key}
                      className={[
                        'calendar-day',
                        mainType ? 'is-marked' : '',
                        isPrecept ? 'is-precept' : '',
                        key === todayKey ? 'is-today' : '',
                        key === selectedKey ? 'is-selected' : '',
                        dimmed ? 'is-dimmed' : '',
                      ].join(' ')}
                      style={mainType ? { '--type-color': EVENT_TYPES[mainType].color } : undefined}
                      onClick={() => selectDay(key)}
                      aria-label={`${day} de ${monthName}${isPrecept ? ' (dia de preceito)' : ''}${visible ? `: ${visible.map((e) => e.name).join(', ')}` : ''}`}
                      data-tip={visible ? visible.map((e) => e.name).join(' · ') : undefined}
                    >
                      {isPrecept && (
                        <span className="calendar-day-cross" aria-hidden="true">
                          ✝
                        </span>
                      )}
                      <span className="calendar-day-number">{day}</span>
                      {fillTypes.length > 1 && (
                        <span className="calendar-day-dots">
                          {fillTypes
                            .slice(1)
                            .map((t) => (
                              <span key={t} style={{ background: EVENT_TYPES[t].color }} />
                            ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>


      <p className="calendar-footnote">
        Datas conforme o calendário litúrgico da CNBB. Solenidades transferidas para o domingo no Brasil (Epifania,
        Ascensão, São Pedro e São Paulo, Assunção e Todos os Santos) aparecem na data em que são celebradas. Feriados
        estaduais e municipais não estão incluídos.
      </p>
    </main>
  );
}
