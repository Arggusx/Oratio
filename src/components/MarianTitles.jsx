import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin } from 'lucide-react';
import { marianTitles, MARIAN_TYPES } from '../data/marianTitles';
import { marianImages } from '../data/imageCredits';
import ImageCredit from './ImageCredit';
import { LoadMoreButton } from './LoadMore';
import { useLoadMore } from '../utils/useLoadMore';

const ALL = 'todos';
const PAGE_SIZE = 6;

const TYPE_HELP = {
  dogma: 'verdades sobre Maria que a Igreja proclamou solenemente e todo católico professa',
  aparicao: 'lugares onde ela se manifestou e a Igreja reconheceu',
  devocao: 'momentos da sua vida ou formas como o povo experimenta o seu cuidado',
};

/** "Uma só Maria, muitos títulos": explica que os títulos são da mesma Mãe de Jesus. */
export default function MarianTitles() {
  const [type, setType] = useState(ALL);

  const shown = useMemo(() => marianTitles.filter((t) => type === ALL || t.type === type), [type]);
  const { listed, remaining, showMore } = useLoadMore(shown, PAGE_SIZE, { showAll: type !== ALL });

  return (
    <section className="miracles-section" aria-labelledby="marian-title">
      <header className="miracles-intro">
        <h2 id="marian-title" className="mass-intro-title">Uma só Maria, muitos títulos</h2>
        <p>
          Nossa Senhora Aparecida, de Fátima, de Lourdes, das Graças… não são várias “Marias”: é sempre a mesma
          Maria de Nazaré, a Mãe de Jesus. Cada título destaca um aspecto da sua vida e da sua missão, lembra um
          lugar onde ela se manifestou ou expressa como um povo sente a sua proteção.
        </p>
        <p>
          Por isso as imagens são tão diferentes: o rosto, a cor da pele e as roupas acompanham a cultura de cada
          lugar e a forma como ela se apresentou. Em Guadalupe ela aparece com traços mestiços; a imagem de
          Aparecida é escura; em Lourdes, veste branco e azul. Mudam os títulos e as imagens, mas a pessoa é uma
          só.
        </p>
      </header>

      <ul className="marian-types">
        {Object.entries(MARIAN_TYPES).map(([id, label]) => (
          <li key={id}>
            <span className={`marian-type-tag is-${id}`}>{label}</span>
            {TYPE_HELP[id]}
          </li>
        ))}
      </ul>

      <div className="miracles-filter" role="group" aria-label="Tipo de título">
        <span className="miracles-filter-label">Mostrar</span>
        <div className="miracles-filter-list">
          {[[ALL, `Todos (${marianTitles.length})`], ...Object.entries(MARIAN_TYPES)].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`category ${type === id ? 'active' : ''}`}
              aria-pressed={type === id}
              onClick={() => setType(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="miracles-grid">
        {listed.map((t, index) => (
          <motion.article
            key={t.id}
            className={`miracle-card ${marianImages[t.id] ? 'has-image' : ''}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min((index % PAGE_SIZE) * 0.03, 0.3) }}
          >
            {marianImages[t.id] && (
              <img
                className="marian-card-image"
                src={marianImages[t.id].src}
                width={marianImages[t.id].width}
                height={marianImages[t.id].height}
                alt={`Imagem de ${t.title}`}
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="miracle-card-top">
              <span className={`marian-type-tag is-${t.type}`}>{MARIAN_TYPES[t.type]}</span>
            </div>
            <h3>{t.title}</h3>
            <p className="miracle-summary">{t.text}</p>
            <div className="marian-meta">
              {t.feast && (
                <p className="miracle-where">
                  <CalendarDays size={14} aria-hidden="true" />
                  <span>{t.feast}</span>
                </p>
              )}
              <p className="miracle-where">
                <MapPin size={14} aria-hidden="true" />
                <span>{t.origin}</span>
              </p>
            </div>
            <ImageCredit image={marianImages[t.id]} />
          </motion.article>
        ))}
      </div>

      <LoadMoreButton remaining={remaining} onClick={showMore} label="Ver mais títulos" />

      <footer className="miracles-footer">
        <p>
          A Igreja honra Maria com uma veneração especial, mas a adoração é devida somente a Deus. Todo título de
          Nossa Senhora aponta para Jesus: como em Caná, ela continua dizendo “Fazei tudo o que ele vos disser”
          (Jo 2,5).
        </p>
      </footer>
    </section>
  );
}
