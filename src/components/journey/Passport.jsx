import { Link } from 'react-router-dom';
import { trails } from '../../data/trails';
import { islandRewards } from '../../data/rewards';
import { completedIslands } from '../../utils/islandProgress';
import { useJourney } from '../../utils/journeyStore';
import GameIntro from '../GameIntro';
import { Stamp } from './Rewards';

/**
 * Passaporte do Peregrino: como a credencial de quem faz o Caminho de Santiago, recebe um carimbo
 * a cada ilha concluída. Cada carimbo também libera uma moldura para o medalhão da Jornada.
 */
export default function Passport() {
  const state = useJourney();
  const done = completedIslands(state).map((t) => t.id);

  return (
    <section className="journey-card passport" aria-labelledby="passport-title">
      <header className="journey-card-head">
        <h2 id="passport-title">Passaporte do Peregrino</h2>
        <p>
          {done.length === 0
            ? 'Ainda sem carimbos. Conclua uma ilha das trilhas para ganhar o primeiro.'
            : `${done.length} de ${trails.length} ilhas carimbadas.`}
        </p>
      </header>

      <GameIntro
        id="passaporte"
        steps={[
          'Os peregrinos do Caminho de Santiago carimbam a credencial em cada parada. Aqui, cada ilha concluída ganha um carimbo.',
          'Uma ilha está concluída quando você termina todas as etapas e passa no desafio final.',
          'Cada carimbo libera uma moldura nova para o seu medalhão, no topo da Jornada.',
        ]}
      />

      <div className="passport-pages">
        {trails.map((t) => (
          <Link key={t.id} to={`/home/trilhas/${t.id}`} className="passport-slot">
            <Stamp trail={t} reward={islandRewards[t.id]} stamped={done.includes(t.id)} />
          </Link>
        ))}
      </div>
    </section>
  );
}
