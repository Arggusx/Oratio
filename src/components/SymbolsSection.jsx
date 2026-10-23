import { motion } from 'framer-motion';
import FlipCard from './anim/FlipCard';
import { symbols } from '../data/symbols';
import { LoadMoreButton } from './LoadMore';
import { useLoadMore } from '../utils/useLoadMore';

const PAGE_SIZE = 6;

export default function SymbolsSection() {
  const { listed, remaining, showMore } = useLoadMore(symbols, PAGE_SIZE);

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
        {listed.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min((index % PAGE_SIZE) * 0.04, 0.4) }}
          >
            {/* Cartão que vira: imagem e nome na frente, significado no verso */}
            <FlipCard
              className="symbol-flip"
              front={
                <>
                  <img src={s.image} alt="" loading="lazy" />
                  <strong>{s.name}</strong>
                  <small>Toque para ver o significado</small>
                </>
              }
              back={
                <>
                  <strong>{s.name}</strong>
                  <span className="symbol-flip-text">{s.text}</span>
                  {s.extra && <span className="symbol-extra">{s.extra}</span>}
                  {s.ref && (
                    <span className="symbol-ref">
                      “{s.ref.quote}” <cite>({s.ref.cite})</cite>
                    </span>
                  )}
                </>
              }
            />
          </motion.div>
        ))}
      </div>

      <LoadMoreButton remaining={remaining} onClick={showMore} label="Ver mais símbolos" />
    </section>
  );
}
