import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { todayKey, useJourney } from '../utils/journeyStore';
import { getTodayMysteryKey } from '../utils/liturgicalCalendar';
import { MYSTERY_TITLES } from '../data/mysteryTitles';
import { useSeason } from '../utils/useSeasonTheme';
import { seasonTodayItem } from '../data/seasonDecor';

/** Santo cuja festa é hoje, se houver. A lista de santos é baixada à parte, para não pesar no início. */
function useSaintOfToday() {
  const [saint, setSaint] = useState(null);
  useEffect(() => {
    let alive = true;
    const mmdd = todayKey().slice(5);
    import('../data/saints').then(({ saints }) => {
      if (alive) setSaint(saints.find((s) => s.feast === mmdd) ?? null);
    });
    return () => {
      alive = false;
    };
  }, []);
  return saint;
}

/**
 * "Para hoje" na página inicial: o terço, a leitura do dia, o item do tempo litúrgico ou do dia
 * especial (Regina Caeli na Páscoa, jejum nas Cinzas...) e, quando houver, o santo do dia.
 */
export default function HomeToday() {
  const { prayedDays } = useJourney();
  const saint = useSaintOfToday();
  const seasonItem = seasonTodayItem(useSeason());
  const prayed = prayedDays.includes(todayKey());

  const items = [
    {
      key: 'terco',
      to: '/home/oracoes',
      title: 'Rezar o terço',
      hint: prayed ? 'Feito hoje. Que Deus abençoe!' : MYSTERY_TITLES[getTodayMysteryKey()],
      done: prayed,
    },
    { key: 'leitura', href: '#leitura-do-dia', title: 'Leitura do dia', hint: '3 trechos breves · 5 a 10 min' },
  ];
  if (seasonItem) items.push({ key: 'tempo', season: true, ...seasonItem });
  if (saint) items.push({ key: 'santo', to: `/home/santos/${saint.slug}`, title: 'Santo do dia', hint: saint.name });

  return (
    <section className="home-today" aria-labelledby="home-today-title">
      <h2 id="home-today-title">Para hoje</h2>
      <ul>
        {items.map((item) => {
          const inner = (
            <>
              <span className="home-today-check" aria-hidden="true">
                {item.done && <Check size={14} strokeWidth={3} />}
              </span>
              <span className="home-today-text">
                <strong>{item.title}</strong>
                <small>{item.hint}</small>
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </>
          );
          return (
            <li key={item.key} className={[item.done && 'is-done', item.season && 'is-season'].filter(Boolean).join(' ')}>
              {item.to ? <Link to={item.to}>{inner}</Link> : <a href={item.href}>{inner}</a>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
