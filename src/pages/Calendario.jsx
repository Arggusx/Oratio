import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, X, CalendarDays } from 'lucide-react';
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
// Ordem de prioridade da cor principal do dia.
const TYPE_PRIORITY = ['santo', 'feriado', 'solenidade', 'facultativo', 'domingo'];

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

  const toggleType = (type) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
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
      <span className="eyebrow">Ano litúrgico</span>
      <h1 className="section-title">Calendário Católico</h1>
      <p className="lead">
        Domingos de preceito, dias santos de guarda, principais celebrações da Igreja e feriados nacionais do Brasil.
      </p>

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
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            className={`calendar-legend-item ${activeTypes.has(type) ? 'active' : ''}`}
            style={{ '--type-color': EVENT_TYPES[type].color }}
            onClick={() => toggleType(type)}
            aria-pressed={activeTypes.has(type)}
          >
            <span className="calendar-legend-dot" />
            {EVENT_TYPES[type].label}
          </button>
        ))}
        {activeTypes.size !== ALL_TYPES.length && (
          <button className="calendar-legend-reset" onClick={() => setActiveTypes(new Set(ALL_TYPES))}>
            Mostrar todas
          </button>
        )}
      </div>

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
                    onClick={() => setSelectedKey(r.key)}
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

      <section className="calendar-day-panel" aria-live="polite">
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
                  const mainType = TYPE_PRIORITY.find((t) => types.includes(t));
                  const dimmed = normalizedQuery && !visible;

                  return (
                    <button
                      key={key}
                      className={[
                        'calendar-day',
                        mainType ? 'is-marked' : '',
                        key === todayKey ? 'is-today' : '',
                        key === selectedKey ? 'is-selected' : '',
                        dimmed ? 'is-dimmed' : '',
                      ].join(' ')}
                      style={mainType ? { '--type-color': EVENT_TYPES[mainType].color } : undefined}
                      onClick={() => setSelectedKey(key)}
                      aria-label={`${day} de ${monthName}${visible ? `: ${visible.map((e) => e.name).join(', ')}` : ''}`}
                      title={visible ? visible.map((e) => e.name).join('\n') : undefined}
                    >
                      <span className="calendar-day-number">{day}</span>
                      {types.length > 1 && (
                        <span className="calendar-day-dots">
                          {types
                            .filter((t) => t !== mainType)
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
