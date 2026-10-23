import { useMemo } from 'react';
import { addDays, getLiturgicalSeason, makeDate } from '../../utils/liturgicalCalendar';

const COLORS = {
  advento: '#7A5A9E',
  natal: '#E2C97E',
  quaresma: '#7A5A9E',
  triduo: '#B23A2E',
  pascoa: '#F1E3B8',
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

const R = 80;
const C = 2 * Math.PI * R;

/** Anel do ano litúrgico: cada tempo se desenha na sua cor, e um ponto marca o dia de hoje. */
export default function LiturgicalYearRing() {
  const today = new Date();
  const year = today.getFullYear();

  const { segments, todayFraction } = useMemo(() => {
    const start = makeDate(year, 1, 1);
    const days = (makeDate(year + 1, 1, 1) - start) / 86400000;
    const list = [];
    for (let i = 0; i < days; i++) {
      const season = getLiturgicalSeason(addDays(start, i));
      const last = list[list.length - 1];
      if (last && last.season === season) last.length++;
      else list.push({ season, start: i, length: 1 });
    }
    const dayIndex = Math.floor((today - start) / 86400000);
    return {
      segments: list.map((s) => ({ ...s, from: s.start / days, size: s.length / days })),
      todayFraction: dayIndex / days,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const angle = todayFraction * 2 * Math.PI - Math.PI / 2;
  const season = getLiturgicalSeason(today);

  return (
    <div className="fx-ring-wrap">
      <svg viewBox="0 0 220 220" width="220" height="220" aria-label={`Ano litúrgico: hoje é ${LABELS[season]}`}>
        <g transform="rotate(-90 110 110)">
          {segments.map((s, i) => (
            <circle
              key={`${s.season}-${s.start}`}
              className="fx-ring-seg"
              cx="110"
              cy="110"
              r={R}
              stroke={COLORS[s.season]}
              strokeDasharray={`${s.size * C} ${C}`}
              strokeDashoffset={-s.from * C}
              style={{ '--d': `${i * 0.25}s`, '--len': s.size * C }}
            />
          ))}
        </g>
        <circle className="fx-ring-today" cx={110 + R * Math.cos(angle)} cy={110 + R * Math.sin(angle)} r="7" />
        <text className="fx-ring-label" x="110" y="104" textAnchor="middle">
          {LABELS[season]}
        </text>
        <text className="fx-ring-sub" x="110" y="124" textAnchor="middle">
          {today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
        </text>
      </svg>
      <ul className="fx-ring-legend">
        {['advento', 'natal', 'quaresma', 'triduo', 'pascoa', 'comum'].map((k) => (
          <li key={k}>
            <span style={{ background: COLORS[k] }} />
            {LABELS[k]}
          </li>
        ))}
      </ul>
    </div>
  );
}
