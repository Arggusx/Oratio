import { useSeason } from '../../utils/useSeasonTheme';

const LABELS = {
  advento: 'Tempo do Advento',
  natal: 'Tempo do Natal',
  quaresma: 'Tempo da Quaresma',
  triduo: 'Tríduo Pascal',
  pascoa: 'Tempo Pascal',
  pentecostes: 'Domingo de Pentecostes',
};

const NOTES = {
  advento: 'Preparamos o coração para a vinda do Senhor.',
  natal: 'O Verbo se fez carne e habitou entre nós.',
  quaresma: 'Quarenta dias de oração, jejum e caridade.',
  triduo: 'Paixão, morte e ressurreição do Senhor.',
  pascoa: 'Cristo ressuscitou! Aleluia!',
  pentecostes: 'Vinde, Espírito Santo!',
};

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
      <path className="cross" d="M60 18v58M46 32h28" />
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
      <path className="dove" d="M30 52c14-10 34-12 50-6 6 2 10 0 13-4 2 3 2 7 0 10-4 4-10 6-16 6-10 0-20 3-27 8l-10-1 5-4c-6-2-11-5-15-9z" />
      <path className="dove-wing" d="M60 47C56 34 48 26 36 22c5 10 8 18 13 28z" />
      {[22, 48, 74, 100].map((x, i) => (
        <path key={x} className="tongue" style={{ '--i': i }} d={`M${x} 88c5 6 6 10 0 12-6-2-5-6 0-12z`} transform={`translate(0 -16)`} />
      ))}
    </svg>
  );
}

/**
 * Enfeite do tempo litúrgico na página inicial: muda sozinho com o calendário.
 * No Tempo Comum não aparece nada (o site usa o visual padrão).
 */
export default function SeasonOrnament() {
  const { theme, adventWeek } = useSeason();
  if (!LABELS[theme]) return null;

  const art = {
    advento: <AdventWreath week={adventWeek} />,
    natal: <BethlehemStar />,
    quaresma: <CrossOfThorns />,
    triduo: <Calvary />,
    pascoa: <EmptyTomb />,
    pentecostes: <PentecostDove />,
  }[theme];

  return (
    <aside className="season-banner" aria-label={LABELS[theme]}>
      <span className="season-art" aria-hidden="true">
        {art}
      </span>
      <span className="season-text">
        <strong>
          {LABELS[theme]}
          {theme === 'advento' && adventWeek > 0 && ` · ${adventWeek}ª semana`}
        </strong>
        <span>{NOTES[theme]}</span>
      </span>
    </aside>
  );
}
