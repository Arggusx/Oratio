import { useSeason } from '../../utils/useSeasonTheme';
import { daysUntilEaster } from '../../utils/liturgicalCalendar';

const STAR = 'M12 2l1.8 7.2L21 12l-7.2 2.8L12 22l-1.8-7.2L3 12l7.2-2.8z';

function Lily() {
  return (
    <svg viewBox="0 0 84 84" className="photo-art photo-lily">
      <path className="stem" d="M42 80V38" />
      <path className="petal" d="M42 40c-10-8-14-20-6-28 4 8 6 14 6 28 0-14 2-20 6-28 8 8 4 20-6 28z" />
      <path className="petal side" d="M42 40c-8 2-16-2-20-10 8-2 14 2 20 10zM42 40c8 2 16-2 20-10-8-2-14 2-20 10z" />
      <path className="leaf" d="M42 48c-6 6-14 8-20 6M42 48c6 6 14 8 20 6" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 96 96" className="photo-art photo-star">
      <path className="rays" d="M48 48V6M48 48h42M48 48v42M48 48H6M48 48l30-30M48 48l30 30M48 48L18 78M48 48L18 18" />
      <path className="star" d="M48 22l5 18 18 5-18 5-5 18-5-18-18-5 18-5z" />
    </svg>
  );
}

function Flames() {
  const flame = 'c6 10 14 16 14 28a14 14 0 0 1-28 0c0-6 3-10 6-13 0 6 3 9 6 9-2-8 0-16 2-24z';
  return (
    <svg viewBox="0 0 120 60" className="photo-art photo-flames">
      {[20, 60, 100].map((x, i) => (
        <path key={x} className="flame" style={{ '--i': i }} d={`M${x} ${i === 1 ? 4 : 10}${flame}`} />
      ))}
    </svg>
  );
}

function Candle() {
  return (
    <svg viewBox="0 0 40 88" className="photo-art photo-candle">
      <path className="flame" d="M20 6c5 8 9 12 9 20a9 9 0 0 1-18 0c0-5 3-8 5-11 0 5 2 7 4 7-1-6 0-11 0-16z" />
      <path className="core" d="M20 22c2 3 4 5 4 8a4 4 0 0 1-8 0c0-3 2-5 4-8z" />
      <rect className="wax" x="12" y="34" width="16" height="48" rx="2" />
    </svg>
  );
}

function Host() {
  return (
    <svg viewBox="0 0 88 88" className="photo-art photo-host">
      <path className="rays" d="M44 4v12M44 72v12M4 44h12M72 44h12M15.7 15.7l8.5 8.5M63.8 63.8l8.5 8.5M15.7 72.3l8.5-8.5M63.8 24.2l8.5-8.5" />
      <circle className="host" cx="44" cy="44" r="16" />
      <path className="mark" d="M44 35v18M35 44h18" />
    </svg>
  );
}

function StarRing() {
  return (
    <svg viewBox="0 0 92 92" className="photo-art photo-ring">
      <g className="ring">
        {[...Array(12)].map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={46 + 36 * Math.cos(a)} cy={46 + 36 * Math.sin(a)} r="2.6" />;
        })}
      </g>
      <path className="center" transform="translate(28 28) scale(1.5)" d={STAR} />
    </svg>
  );
}

function Halo() {
  return (
    <svg viewBox="0 0 88 88" className="photo-art photo-halo">
      <path className="rays" d="M44 2v10M44 76v10M2 44h10M76 44h10M14.3 14.3l7 7M66.7 66.7l7 7M14.3 73.7l7-7M66.7 21.3l7-7" />
      <circle className="halo" cx="44" cy="44" r="20" />
      <circle className="inner" cx="44" cy="44" r="12" />
    </svg>
  );
}

function LentCountdown() {
  const days = daysUntilEaster();
  return (
    <span className="photo-badge">
      <span className="photo-badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M12 3v18M6 9h12" />
        </svg>
      </span>
      {days === 1 ? 'Falta 1 dia para a Páscoa' : `Faltam ${days} dias para a Páscoa`}
    </span>
  );
}

/**
 * Enfeite no canto da foto do terço na página inicial, conforme o tempo litúrgico ou o dia especial.
 * No Tríduo, a foto ganha também um véu roxo. No Tempo Comum e no Advento, nada aparece.
 */
export default function SeasonPhotoOrnament() {
  const { theme, feast } = useSeason();

  const art =
    { 'corpus-christi': <Host />, aparecida: <StarRing />, 'todos-os-santos': <Halo /> }[feast] ??
    { pascoa: <Lily />, natal: <Star />, pentecostes: <Flames />, triduo: <Candle /> }[theme];

  if (theme === 'quaresma') {
    return (
      <div className="hero-photo-ornament">
        <LentCountdown />
      </div>
    );
  }
  if (!art) return null;

  return (
    <>
      {theme === 'triduo' && <span className="hero-photo-veil" aria-hidden="true" />}
      <div className="hero-photo-ornament" aria-hidden="true">
        {art}
      </div>
    </>
  );
}
