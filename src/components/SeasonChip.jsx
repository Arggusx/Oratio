import { Link } from 'react-router-dom';
import { useSeason } from '../utils/useSeasonTheme';
import { seasonDisplay } from '../data/seasonDecor';

/** Etiqueta do tempo litúrgico de hoje (ou do dia especial), no topo de todas as páginas. Leva ao calendário. */
export default function SeasonChip() {
  const season = seasonDisplay(useSeason());
  const label = season.chipLabel ?? season.label;
  return (
    <Link
      to="/home/calendario"
      className={`season-chip season-chip-${season.color}`}
      title={`Hoje: ${label}. Ver o calendário litúrgico`}
    >
      <span className="season-chip-dot" aria-hidden="true" />
      {/* No celular cabe só o nome curto; o completo fica para leitores de tela e telas largas. */}
      <span className="season-chip-full">{label}</span>
      <span className="season-chip-short" aria-hidden="true">{season.short}</span>
    </Link>
  );
}
