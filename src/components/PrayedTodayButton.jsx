import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { journey, todayKey, useJourney } from '../utils/journeyStore';

/** "Marcar terço de hoje": acende o dia no caminho de oração da Jornada. */
export default function PrayedTodayButton({ showLink = false }) {
  const { prayedDays } = useJourney();
  const done = prayedDays.includes(todayKey());

  return (
    <div className="journey-mark-row">
      <button
        type="button"
        className={`journey-mark ${done ? 'is-done' : ''}`}
        onClick={journey.togglePrayedToday}
        aria-pressed={done}
      >
        <Check size={16} aria-hidden="true" />
        {done ? 'Terço de hoje marcado' : 'Marcar terço de hoje'}
      </button>
      {showLink && done && (
        <Link to="/jornada" className="journey-mark-link">
          Ver na Jornada
        </Link>
      )}
    </div>
  );
}
