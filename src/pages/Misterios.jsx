import { motion } from 'framer-motion';
import { mysteriesData } from '../data/mysteries';
import Candle from '../components/anim/Candle';

const mysteries = Object.values(mysteriesData);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.45,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

export default function Misterios() {
  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Santo Terço</span>
          <h1 className="section-title">Mistérios para cada dia</h1>
        </div>
        <Candle />
      </div>
      <p className="lead">
        Conheça, estude e contemple a história por trás de cada dia de oração.
      </p>

      <section className="card-grid h-scroll" aria-label="Os quatro grupos de mistérios" tabIndex={0}>
        {mysteries.map((mystery, i) => (
          <motion.article
            className="mystery-card"
            style={{ '--accent': mystery.color, '--bg-soft': mystery.bg }}
            key={mystery.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mystery-card-header">
              <h2>{mystery.title}</h2>
              <div className="subtitle">
                <span>{mystery.day} {mystery.extraDay && `· ${mystery.extraDay}`}</span>
                <span className="dot" />
              </div>
            </div>
            
            <div className="mystery-content">
              <ol>
                {mystery.mysteries.map((m) => (
                  <li key={m.id}><strong>{m.id}º</strong> {m.text}</li>
                ))}
              </ol>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
