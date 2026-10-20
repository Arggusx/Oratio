import { motion } from 'framer-motion';
import { symbols } from '../data/symbols';

export default function SymbolsSection() {
  return (
    <section className="symbols-section">
      <header className="mass-intro">
        <h2 className="mass-intro-title">Símbolos cristãos</h2>
        <p>
          Desde os primeiros séculos, os cristãos usam sinais para expressar a fé. Conheça o significado dos
          símbolos que encontramos nas igrejas, nas orações e na arte cristã.
        </p>
      </header>

      <div className="symbols-grid">
        {symbols.map((s, index) => (
          <motion.article
            key={s.id}
            className="symbol-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
          >
            <div className="symbol-image">
              <img src={s.image} alt="" loading="lazy" />
            </div>
            <div className="symbol-body">
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              {s.extra && <p className="symbol-extra">{s.extra}</p>}
              {s.ref && (
                <blockquote className="symbol-ref">
                  “{s.ref.quote}” <cite>({s.ref.cite})</cite>
                </blockquote>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
