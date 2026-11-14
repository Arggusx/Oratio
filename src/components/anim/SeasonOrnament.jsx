import { useSeason } from '../../utils/useSeasonTheme';
import { seasonDisplay } from '../../data/seasonDecor';

// Coroa do Advento: três velas roxas e uma rosa (3º domingo), acesas conforme a semana.
function AdventWreath({ week }) {
  const candles = [
    { x: 34, color: '#7A5A9E' },
    { x: 52, color: '#7A5A9E' },
    { x: 70, color: '#D98BA8' },
    { x: 88, color: '#7A5A9E' },
  ];
  // Ordem tradicional de acender: 1ª roxa, 2ª roxa, a rosa no 3º domingo, a última roxa.
  const order = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-advento">
      <ellipse cx="60" cy="80" rx="48" ry="12" className="wreath" />
      {[...Array(14)].map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return <ellipse key={i} cx={60 + 44 * Math.cos(a)} cy={80 + 10 * Math.sin(a)} rx="7" ry="3.5" className="leaf" transform={`rotate(${(a * 180) / Math.PI} ${60 + 44 * Math.cos(a)} ${80 + 10 * Math.sin(a)})`} />;
      })}
      {candles.map((c, i) => {
        const lit = order.indexOf(i) < week;
        return (
          <g key={c.x}>
            <rect x={c.x - 5} y={42} width="10" height="36" rx="2" fill={c.color} />
            {lit && <path className="flame" style={{ '--i': i }} d={`M${c.x} 26c4 6 5 10 0 15-5-5-4-9 0-15z`} />}
          </g>
        );
      })}
    </svg>
  );
}

function BethlehemStar() {
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-natal">
      <g className="star-rays">
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="60" y1="40" x2={60 + 40 * Math.cos((i * Math.PI) / 6)} y2={40 + 40 * Math.sin((i * Math.PI) / 6)} />
        ))}
      </g>
      <path className="star" d="M60 18l5 16 16 6-16 6-5 16-5-16-16-6 16-6z" />
      <path className="tail" d="M60 62 Q58 80 52 96" />
    </svg>
  );
}

function CrossOfThorns() {
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-quaresma">
      <path className="cross draw" pathLength="1" d="M60 8v86M38 30h44" />
      <ellipse className="thorns draw" pathLength="1" cx="60" cy="30" rx="18" ry="7" />
      <path className="thorns draw" pathLength="1" d="M45 25l-4-3M52 23l-1-4M68 23l1-4M75 25l4-3M48 36l-3 3M72 36l3 3" />
    </svg>
  );
}

function Calvary() {
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-triduo">
      <path className="hill" d="M4 96 Q60 60 116 96z" />
      <path className="cross draw" pathLength="1" d="M60 18v58M46 32h28" />
    </svg>
  );
}

// Ostensório: hóstia branca que pulsa, com raios girando devagar.
function Monstrance() {
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-corpus">
      <g className="rays">
        <path d="M60 8v10M60 70v10M24 44h10M86 44h10M34.5 18.5l7 7M78.5 62.5l7 7M34.5 69.5l7-7M78.5 25.5l7-7" />
      </g>
      <circle className="frame" cx="60" cy="44" r="22" />
      <circle className="host" cx="60" cy="44" r="12" />
      <path className="mark" d="M60 38v12M54 43h12" />
      <path className="stand" d="M60 66v22M50 90h20" />
    </svg>
  );
}

// Coroa de Nossa Senhora Aparecida com as doze estrelas girando em volta.
function CrownOfStars() {
  const stars = [...Array(12)].map((_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return [60 + 44 * Math.cos(a), 52 + 44 * Math.sin(a)];
  });
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-aparecida">
      <g className="ring">
        {stars.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y - 8}l2 6 6 2-6 2-2 6-2-6-6-2 6-2z`} />
        ))}
      </g>
      <g className="crown">
        <path className="crown-body" d="M40 62l-4-22 12 10 12-18 12 18 12-10-4 22z" />
        <rect className="crown-base" x="36" y="62" width="48" height="8" rx="2" />
        <circle className="gem" cx="60" cy="56" r="3" />
        <circle className="gem" cx="48" cy="58" r="2" />
        <circle className="gem" cx="72" cy="58" r="2" />
      </g>
    </svg>
  );
}

// Três santos com auréola, o do meio à frente; flutuam devagar, um de cada vez.
function Saints() {
  const saints = [
    { x: 28, top: 44, head: 48, r: 7.5, halo: 11, body: 'M14 96c0-18 6-28 14-28s14 10 14 28z' },
    { x: 92, top: 44, head: 48, r: 7.5, halo: 11, body: 'M78 96c0-18 6-28 14-28s14 10 14 28z' },
    { x: 60, top: 30, head: 35, r: 9.5, halo: 14, body: 'M42 96c0-22 7-36 18-36s18 14 18 36z' },
  ];
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-santos">
      {saints.map((s, i) => (
        <g key={s.x} className="saint" style={{ '--i': i }}>
          <circle className="halo" cx={s.x} cy={s.top} r={s.halo} />
          <path className="robe" d={s.body} />
          <circle className="robe" cx={s.x} cy={s.head} r={s.r} />
        </g>
      ))}
    </svg>
  );
}

function EmptyTomb() {
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-pascoa">
      <g className="sun-rays">
        {[...Array(10)].map((_, i) => {
          const a = Math.PI + (i * Math.PI) / 9;
          return <line key={i} x1={60 + 22 * Math.cos(a)} y1={70 + 22 * Math.sin(a)} x2={60 + 46 * Math.cos(a)} y2={70 + 46 * Math.sin(a)} />;
        })}
      </g>
      <circle className="sun" cx="60" cy="70" r="16" />
      <path className="tomb" d="M24 96V72a20 20 0 0 1 40 0v24z" />
      <path className="tomb-door" d="M36 96V78a8 8 0 0 1 16 0v18z" />
      <circle className="stone" cx="82" cy="86" r="11" />
      <path className="lily" d="M100 96V70M100 70c-6-4-8-10-4-14 2 4 4 6 4 14 0-8 2-10 4-14 4 4 2 10-4 14z" />
    </svg>
  );
}

function PentecostDove() {
  return (
    <svg viewBox="0 0 120 100" className="season-svg season-pentecostes">
      <g className="dove-body">
        <path className="dove" d="M30 52c14-10 34-12 50-6 6 2 10 0 13-4 2 3 2 7 0 10-4 4-10 6-16 6-10 0-20 3-27 8l-10-1 5-4c-6-2-11-5-15-9z" />
        <path className="dove-wing" d="M60 47C56 34 48 26 36 22c5 10 8 18 13 28z" />
      </g>
      {[22, 48, 74, 100].map((x, i) => (
        <path key={x} className="tongue" style={{ '--i': i }} d={`M${x} 88c5 6 6 10 0 12-6-2-5-6 0-12z`} transform={`translate(0 -16)`} />
      ))}
    </svg>
  );
}

/**
 * Enfeite do tempo litúrgico (ou do dia especial) na página inicial: muda sozinho com o calendário.
 * No Tempo Comum, fora dos dias especiais, não aparece nada (o site usa o visual padrão).
 */
export default function SeasonOrnament() {
  const season = useSeason();
  const { theme, adventWeek, feast } = season;

  const art =
    {
      'corpus-christi': <Monstrance />,
      aparecida: <CrownOfStars />,
      'todos-os-santos': <Saints />,
    }[feast] ??
    {
      advento: <AdventWreath week={adventWeek} />,
      natal: <BethlehemStar />,
      quaresma: <CrossOfThorns />,
      triduo: <Calvary />,
      pascoa: <EmptyTomb />,
      pentecostes: <PentecostDove />,
    }[theme];
  if (!art) return null;

  const { label, note } = seasonDisplay(season);

  return (
    <aside className="season-banner" aria-label={label}>
      <span className="season-art" aria-hidden="true">
        {art}
      </span>
      <span className="season-text">
        <strong>
          {label}
          {theme === 'advento' && adventWeek > 0 && ` · ${adventWeek}ª semana`}
        </strong>
        <span>{note}</span>
      </span>
    </aside>
  );
}
