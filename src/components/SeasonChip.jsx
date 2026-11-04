import { Link } from 'react-router-dom';
import { useSeason } from '../utils/useSeasonTheme';

// Nome e cor litúrgica de cada tempo (a cor é a dos paramentos do dia).
const SEASONS = {
  advento: { label: 'Advento', short: 'Advento', color: 'roxo' },
  natal: { label: 'Tempo do Natal', short: 'Natal', color: 'branco' },
  quaresma: { label: 'Quaresma', short: 'Quaresma', color: 'roxo' },
  triduo: { label: 'Tríduo Pascal', short: 'Tríduo', color: 'vermelho' },
  pascoa: { label: 'Tempo Pascal', short: 'Páscoa', color: 'branco' },
  pentecostes: { label: 'Pentecostes', short: 'Pentecostes', color: 'vermelho' },
  comum: { label: 'Tempo Comum', short: 'Comum', color: 'verde' },
};

/** Etiqueta do tempo litúrgico de hoje, no topo de todas as páginas. Leva ao calendário. */
export default function SeasonChip() {
  const { theme } = useSeason();
  const season = SEASONS[theme] ?? SEASONS.comum;
  return (
    <Link
      to="/home/calendario"
      className={`season-chip season-chip-${season.color}`}
      title={`Hoje: ${season.label}. Ver o calendário litúrgico`}
    >
      <span className="season-chip-dot" aria-hidden="true" />
      {/* No celular cabe só o nome curto; o completo fica para leitores de tela e telas largas. */}
      <span className="season-chip-full">{season.label}</span>
      <span className="season-chip-short" aria-hidden="true">{season.short}</span>
    </Link>
  );
}
