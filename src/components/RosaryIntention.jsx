import { Link } from 'react-router-dom';
import { ArrowRight, Gift, HandHeart, Heart } from 'lucide-react';
import FilterPanel from './FilterPanel';
import { MAX_INTENTIONS, decadePlan, rosaryIntentions } from '../data/rosaryIntentions';

const OPTIONS = rosaryIntentions.map((i) => ({ id: i.id, label: i.short }));

/**
 * Intenções do terço, atrás de um botão como o dos filtros: a pessoa escolhe uma ou mais
 * (até cinco) e o próprio roteiro muda (oferecimento, pedido de cada dezena e orações finais).
 * Embaixo do botão fica só um resumo de qual intenção acompanha cada dezena.
 */
export default function RosaryIntention({ selected, onChange }) {
  const plan = decadePlan(selected);

  return (
    <div className="rosary-intention">
      <FilterPanel
        label="Intenções"
        title="Rezar por intenções"
        applyLabel="Usar no terço"
        groups={[
          {
            id: 'intencoes',
            label: 'Por que você quer rezar?',
            hint: `Escolha até ${MAX_INTENTIONS}. Cada intenção acompanha uma ou mais dezenas, e o roteiro do terço muda com ela.`,
            multiple: true,
            max: MAX_INTENTIONS,
            options: OPTIONS,
          },
        ]}
        values={{ intencoes: selected.map((i) => i.id) }}
        onApply={(v) => onChange(v.intencoes)}
      />

      {selected.length > 0 && (
        <div className="rosary-intention-card">
          <h4>Seu terço de hoje</h4>
          <ol className="rosary-intention-plan">
            {plan.map((d, i) => (
              <li key={i}>
                <span className="rosary-intention-plan-n">{i + 1}ª dezena</span>
                <span>{d.intention.short}</span>
              </li>
            ))}
          </ol>
          <p className="rosary-intention-how">
            O oferecimento (passo 2) já traz {selected.length > 1 ? 'as suas intenções' : 'a sua intenção'}, cada dezena
            mostra um pedido sugerido e o último passo termina com a oração de cada santo.
          </p>

          {selected.map((it) => (
            <details key={it.id} className="rosary-intention-details">
              <summary>Dicas para rezar: {it.short}</summary>
              <p>{it.about}</p>
              <dl className="rosary-intention-tips">
                <div>
                  <dt>
                    <Gift size={15} aria-hidden="true" />
                    Ofereça
                  </dt>
                  <dd>{it.tips.offer}</dd>
                </div>
                <div>
                  <dt>
                    <Heart size={15} aria-hidden="true" />
                    Agradeça
                  </dt>
                  <dd>{it.tips.thank}</dd>
                </div>
                <div>
                  <dt>
                    <HandHeart size={15} aria-hidden="true" />
                    Peça
                  </dt>
                  <dd>{it.tips.ask}</dd>
                </div>
              </dl>
              {it.saintSlug && (
                <Link to={`/home/santos/${it.saintSlug}`} className="mysteries-all-link">
                  Conheça {it.saint}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
