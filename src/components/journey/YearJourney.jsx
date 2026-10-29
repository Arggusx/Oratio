import { useMemo } from 'react';
import { addDays, getLiturgicalSeason, makeDate, toKey } from '../../utils/liturgicalCalendar';
import { useJourney } from '../../utils/journeyStore';

const COLORS = {
  advento: '#7A5A9E',
  natal: '#E2C97E',
  quaresma: '#7A5A9E',
  triduo: '#B23A2E',
  pascoa: '#E9C46A',
  comum: '#5E8C63',
};

const LABELS = {
  advento: 'Advento',
  natal: 'Natal',
  quaresma: 'Quaresma',
  triduo: 'Tríduo Pascal',
  pascoa: 'Tempo Pascal',
  comum: 'Tempo Comum',
};

const R = 84;

/**
 * O ano como jornada: o anel do calendário vai se preenchendo, um tracinho na cor do tempo
 * litúrgico para cada dia em que a pessoa rezou o terço.
 */
export default function YearJourney() {
  const { prayedDays } = useJourney();
  const year = new Date().getFullYear();

  const { days, bySeason } = useMemo(() => {
    const prayed = new Set(prayedDays);
    const start = makeDate(year, 1, 1);
    const total = Math.round((makeDate(year + 1, 1, 1) - start) / 86400000);
    const list = [];
    const seasons = {};
    for (let i = 0; i < total; i++) {
      const date = addDays(start, i);
      const season = getLiturgicalSeason(date);
      const done = prayed.has(toKey(date));
      seasons[season] = seasons[season] ?? { days: 0, prayed: 0 };
      seasons[season].days++;
      if (done) seasons[season].prayed++;
      list.push({ i, total, season, done });
    }
    return { days: list, bySeason: seasons };
  }, [prayedDays, year]);

  const prayedCount = days.filter((d) => d.done).length;

  return (
    <section className="journey-card" aria-labelledby="year-title">
      <header className="journey-card-head">
        <h2 id="year-title">O ano como jornada</h2>
        <p>Cada dia rezado acende um tracinho no anel, na cor do tempo litúrgico. Aos poucos, o ano se preenche.</p>
      </header>

      <div className="year-journey">
        <svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label={`${prayedCount} dias de oração em ${year}`}>
          <circle cx="110" cy="110" r={R} className="year-base" />
          {days.map((d) => {
            const a = (d.i / d.total) * 2 * Math.PI - Math.PI / 2;
            const inner = R - 9;
            const outer = R + 9;
            return (
              <line
                key={d.i}
                x1={110 + inner * Math.cos(a)}
                y1={110 + inner * Math.sin(a)}
                x2={110 + outer * Math.cos(a)}
                y2={110 + outer * Math.sin(a)}
                stroke={d.done ? COLORS[d.season] : 'currentColor'}
                className={d.done ? 'year-day is-done' : 'year-day'}
              />
            );
          })}
          <text x="110" y="106" textAnchor="middle" className="fx-ring-label">
            {prayedCount}
          </text>
          <text x="110" y="126" textAnchor="middle" className="fx-ring-sub">
            {prayedCount === 1 ? 'dia de oração' : 'dias de oração'} em {year}
          </text>
        </svg>

        <ul className="year-seasons">
          {Object.keys(LABELS)
            .filter((k) => bySeason[k])
            .map((k) => (
              <li key={k}>
                <span className="year-season-name">
                  <span className="year-swatch" style={{ background: COLORS[k] }} />
                  {LABELS[k]}
                </span>
                <span className="year-bar">
                  <span style={{ width: `${(bySeason[k].prayed / bySeason[k].days) * 100}%`, background: COLORS[k] }} />
                </span>
                <small>
                  {bySeason[k].prayed} de {bySeason[k].days} dias
                </small>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
