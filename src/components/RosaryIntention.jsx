import { Link } from 'react-router-dom';
import { ArrowRight, Gift, HandHeart, Heart, Target, X } from 'lucide-react';
import { rosaryIntentions } from '../data/rosaryIntentions';

/**
 * "Rezar por uma intenção": a pessoa escolhe o que quer pedir e o terço passa a vir
 * personalizado (oferecimento próprio, uma sugestão por dezena e a oração ao santo no fim).
 * É opcional; sem escolha, o terço segue o roteiro de sempre.
 */
export default function RosaryIntention({ intention, onChange }) {
  return (
    <section className="rosary-intention" aria-labelledby="rosary-intention-title">
      <div className="section-subtitle-wrapper">
        <Target size={18} aria-hidden="true" />
        <h3 id="rosary-intention-title" className="mysteries-heading">
          Rezar por uma intenção
        </h3>
        <span className="rosary-intention-optional">opcional</span>
      </div>
      <p className="timeline-subtext">
        Escolha o que você quer pedir: o terço vem com um oferecimento próprio, uma sugestão para cada dezena e, no fim,
        a oração ao santo dessa intenção.
      </p>

      <div className="rosary-intention-chips" role="group" aria-label="Intenções">
        {rosaryIntentions.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rosary-intention-chip ${intention?.id === item.id ? 'active' : ''}`}
            aria-pressed={intention?.id === item.id}
            onClick={() => onChange(intention?.id === item.id ? null : item.id)}
          >
            {item.short}
          </button>
        ))}
      </div>

      {intention && (
        <div className="rosary-intention-card">
          <div className="rosary-intention-card-head">
            <h4>{intention.title}</h4>
            <button type="button" className="rosary-intention-clear" onClick={() => onChange(null)}>
              <X size={15} aria-hidden="true" />
              Tirar a intenção
            </button>
          </div>
          <p>{intention.about}</p>

          <dl className="rosary-intention-tips">
            <div>
              <dt>
                <Gift size={15} aria-hidden="true" />
                Ofereça
              </dt>
              <dd>{intention.tips.offer}</dd>
            </div>
            <div>
              <dt>
                <Heart size={15} aria-hidden="true" />
                Agradeça
              </dt>
              <dd>{intention.tips.thank}</dd>
            </div>
            <div>
              <dt>
                <HandHeart size={15} aria-hidden="true" />
                Peça
              </dt>
              <dd>{intention.tips.ask}</dd>
            </div>
          </dl>

          <p className="rosary-intention-how">
            No passo 2, o oferecimento já vem com a sua intenção. Em cada dezena aparece uma sugestão de pedido, e no
            último passo entra a oração a {intention.closingLabel ?? intention.saint}.
          </p>

          {intention.saintSlug && (
            <Link to={`/home/santos/${intention.saintSlug}`} className="mysteries-all-link">
              Conheça {intention.saint}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
