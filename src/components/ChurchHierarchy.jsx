import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { brazilFacts, churchLevels, hierarchy } from '../data/hierarchy';

/**
 * Figura de cada degrau: um busto com o solidéu (ou a veste) na cor de quem é.
 * O brilho do Papa gira com SMIL, a animação do próprio SVG, sem JavaScript.
 */
function RankFigure({ rank }) {
  const ref = useRef(null);
  // Quem prefere menos movimento vê o desenho parado.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) ref.current?.pauseAnimations?.();
  }, []);

  const cap = ['papa', 'cardeal', 'arcebispo', 'bispo'].includes(rank.id);
  const robe = { papa: '#F4EFE3', cardeal: '#B3261E', arcebispo: '#2B2724', bispo: '#2B2724', padre: '#2B2724', diacono: '#FFFBF4', religiosos: '#6B4F3A', leigos: '#5E8C63' }[rank.id];

  return (
    <svg ref={ref} className="rank-figure" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {rank.id === 'papa' && (
        <g className="rank-rays">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M32 4v7" transform={`rotate(${i * 30} 32 24)`} />
          ))}
          <animateTransform attributeName="transform" type="rotate" from="0 32 24" to="360 32 24" dur="24s" repeatCount="indefinite" />
        </g>
      )}
      <path className="rank-robe" d="M10 62c0-14 9-22 22-22s22 8 22 22z" fill={robe} />
      {rank.id === 'diacono' && <path d="M22 44l22 18h-7L18 46z" fill={rank.color} />}
      {['bispo', 'arcebispo', 'cardeal'].includes(rank.id) && (
        <path d="M24 42c3 3 13 3 16 0l-1 4c-4 2-10 2-14 0z" fill={rank.color} opacity=".9" />
      )}
      {['padre', 'bispo', 'arcebispo'].includes(rank.id) && <rect x="29" y="40" width="6" height="4" rx="1" fill="#FFFBF4" />}
      {rank.id === 'religiosos' && <path d="M17 34c0-12 7-19 15-19s15 7 15 19c-4-5-9-7-15-7s-11 2-15 7z" fill={robe} />}
      <circle cx="32" cy="26" r="11" className="rank-face" />
      {cap && (
        <path d="M22 22a10 10 0 0 1 20 0c-3-1.6-6.5-2.4-10-2.4s-7 .8-10 2.4z" fill={rank.color} stroke="rgba(0,0,0,.25)" strokeWidth=".6">
          {rank.id === 'papa' && <animate attributeName="opacity" values="1;.75;1" dur="3s" repeatCount="indefinite" />}
        </path>
      )}
      {rank.id === 'arcebispo' && <path d="M32 48v12M27 52h10M28 56h8" stroke="#E3B55A" strokeWidth="1.6" strokeLinecap="round" />}
      {(rank.id === 'bispo' || rank.id === 'cardeal') && <path d="M32 48v10M28 52h8" stroke="#E3B55A" strokeWidth="1.6" strokeLinecap="round" />}
    </svg>
  );
}

/**
 * Quem é quem na Igreja: a hierarquia do Papa aos leigos, em degraus que se alargam como uma pirâmide,
 * como a Igreja se organiza e o que é próprio da Igreja no Brasil.
 */
export default function ChurchHierarchy() {
  return (
    <section className="hierarchy" aria-labelledby="hierarchy-title">
      <header className="miracles-intro">
        <h2 id="hierarchy-title" className="mass-intro-title">
          Quem é quem na Igreja
        </h2>
        <p>
          Papa, cardeal, bispo, padre, diácono… Cada um tem uma missão diferente, e todos existem para servir o povo de
          Deus. O sacramento da Ordem tem só três graus: <strong>bispo, padre e diácono</strong>. Os outros nomes são
          títulos ou funções.
        </p>
      </header>

      <ol className="hierarchy-ladder">
        {hierarchy.map((rank, i) => (
          <motion.li
            key={rank.id}
            className="hierarchy-step"
            style={{ '--rank': rank.color, '--step': i }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
          >
            <RankFigure rank={rank} />
            <div className="hierarchy-step-body">
              <div className="hierarchy-step-head">
                <h3>{rank.title}</h3>
                {rank.order && <span className="hierarchy-order">Ordem · {rank.order}</span>}
              </div>
              <p>{rank.what}</p>
              <dl className="hierarchy-facts">
                <div>
                  <dt>Como chamar</dt>
                  <dd>{rank.address}</dd>
                </div>
                <div>
                  <dt>Cor</dt>
                  <dd>
                    <span className="hierarchy-swatch" aria-hidden="true" />
                    {rank.colorName}
                  </dd>
                </div>
              </dl>
              {rank.note && <p className="hierarchy-note">{rank.note}</p>}
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="hierarchy-extra">
        <section className="hierarchy-box" aria-labelledby="hierarchy-org">
          <h3 id="hierarchy-org">Como a Igreja se organiza</h3>
          <ol className="hierarchy-levels">
            {churchLevels.map((level) => (
              <li key={level.title}>
                <strong>{level.title}</strong>
                <small>{level.who}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className="hierarchy-box is-brazil" aria-labelledby="hierarchy-brazil">
          <h3 id="hierarchy-brazil">A Igreja no Brasil</h3>
          <dl className="hierarchy-brazil">
            {brazilFacts.map((fact) => (
              <div key={fact.title}>
                <dt>{fact.title}</dt>
                <dd>{fact.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </section>
  );
}
