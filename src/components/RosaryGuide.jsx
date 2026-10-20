import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Calendar, HeartHandshake } from 'lucide-react';
import { getTodayMysteryKey } from '../utils/liturgicalCalendar';
import {
  closingPrayers,
  SIGN_OF_THE_CROSS,
  HOLY_SPIRIT_INVOCATION,
  OUR_FATHER,
  GLORY_BE,
  FATIMA_PRAYER,
  THANKSGIVING,
  HAIL_HOLY_QUEEN,
  ORDINAL_WORDS,
} from '../data/rosaryData';

const MYSTERY_ADJECTIVE = {
  gozosos: 'gozoso',
  luminosos: 'luminoso',
  dolorosos: 'doloroso',
  gloriosos: 'glorioso',
};

const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

function Collapse({ isOpen, children, className }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className={className}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Lista dos 5 mistérios do conjunto escolhido, como devem ser anunciados. */
function MysteryAnnouncements({ mysteryKey, mystery, isToday }) {
  return (
    <div className="mystery-announcements" style={{ '--accent': mystery.color }}>
      <p className="mystery-announcements-title">
        {isToday ? (
          <>
            Hoje, {WEEKDAYS[new Date().getDay()]}, rezam-se os <strong>{mystery.title}</strong>:
          </>
        ) : (
          <>
            Você escolheu os <strong>{mystery.title}</strong>:
          </>
        )}
      </p>
      <ol>
        {mystery.mysteries.map((m, i) => (
          <li key={m.id}>
            <span className="announcement-number">{i + 1}ª dezena</span>
            <span>
              “No {ORDINAL_WORDS[i]} mistério {MYSTERY_ADJECTIVE[mysteryKey]}, contemplamos {lowerFirst(m.text)}”
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ClosingPrayers() {
  const [openId, setOpenId] = useState(null);

  return (
    <section className="closing-prayers">
      <div className="section-subtitle-wrapper">
        <HeartHandshake size={18} />
        <h3 className="timeline-heading">Depois do terço</h3>
      </div>
      <p className="timeline-subtext">
        Orações opcionais que podem ser rezadas ao final, conforme a sua devoção e o tempo disponível.
      </p>

      <div className="closing-prayers-list">
        {closingPrayers.map((prayer) => {
          const isOpen = openId === prayer.id;
          return (
            <div key={prayer.id} className={`closing-prayer-item ${isOpen ? 'is-open' : ''}`}>
              <button
                className="closing-prayer-trigger"
                onClick={() => setOpenId(isOpen ? null : prayer.id)}
                aria-expanded={isOpen}
              >
                <span>
                  <strong>{prayer.title}</strong>
                  <small>{prayer.description}</small>
                </span>
                <ChevronDown size={18} className={`arrow-icon ${isOpen ? 'rotated' : ''}`} />
              </button>
              <Collapse isOpen={isOpen}>
                <p className="prayer-full-text closing-prayer-text">{prayer.text}</p>
              </Collapse>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function NordicTimeline({ mystery }) {
  const [openDecades, setOpenDecades] = useState(() => new Set());

  const toggleDecade = (id) => {
    setOpenDecades((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allOpen = openDecades.size === mystery.mysteries.length;

  return (
    <div className="nordic-full-timeline">
      {/* ABERTURA */}
      <motion.article className="rosary-step-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="step-bead-indicator">
          <span className="bead-number">✦</span>
          <span className="bead-line" />
        </div>
        <div className="step-main-content">
          <div className="step-tags">
            <span className="bead-tag">Cruz</span>
            <span className="action-tag">Abertura</span>
          </div>
          <h4 className="step-action-title">Sinal da Cruz e Invocação do Espírito Santo</h4>
          <p className="step-summary">Coloque-se na presença de Deus e peça a luz do Espírito Santo.</p>
          <div className="prayer-full-text" style={{ marginTop: '0.6rem' }}>
            {SIGN_OF_THE_CROSS}
            {'\n\n'}
            {HOLY_SPIRIT_INVOCATION}
            {'\n\n'}
            <em>“Abri, Senhor, os meus lábios para louvar o vosso Santo Nome e purificai o meu coração de todos os pensamentos vãos e distraídos.”</em>
          </div>
        </div>
      </motion.article>

      <div className="nordic-decades-toolbar">
        <span>{mystery.title} · 5 dezenas</span>
        <button
          type="button"
          className="step-expand-btn"
          onClick={() =>
            setOpenDecades(allOpen ? new Set() : new Set(mystery.mysteries.map((m) => m.id)))
          }
        >
          {allOpen ? 'Recolher todas' : 'Expandir todas'}
        </button>
      </div>

      {/* AS 5 DEZENAS, CADA UMA RECOLHÍVEL */}
      {mystery.mysteries.map((m, mIdx) => {
        const isOpen = openDecades.has(m.id);
        return (
          <motion.div
            key={m.id}
            className={`nordic-mystery-block ${isOpen ? 'is-open' : ''}`}
            style={{ '--accent': mystery.color }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: mIdx * 0.05 }}
          >
            <button
              type="button"
              className="nordic-mystery-header nordic-mystery-toggle"
              onClick={() => toggleDecade(m.id)}
              aria-expanded={isOpen}
            >
              <span className="nordic-mystery-header-text">
                <span className="mystery-badge-number">{mIdx + 1}ª Dezena</span>
                <span className="nordic-mystery-title">{m.name}</span>
                <span className="nordic-meditation-text">{m.text}</span>
                <span className="nordic-clause-preview">Cláusula: {m.clause}</span>
              </span>
              <ChevronDown size={20} className={`arrow-icon ${isOpen ? 'rotated' : ''}`} />
            </button>

            <Collapse isOpen={isOpen}>
              <div className="nordic-step-sequence">
                <div className="nordic-substep">
                  <span className="substep-label">Conta Grande</span>
                  <strong className="substep-title">Pai Nosso</strong>
                  <p className="substep-text">{OUR_FATHER}</p>
                </div>

                <div className="nordic-substep">
                  <span className="substep-label">10 Contas Pequenas</span>
                  <strong className="substep-title">10 Ave-Marias com Cláusula</strong>
                  <div className="nordic-ave-marias-list">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="nordic-ave-maria-item">
                        <span className="ave-num">{i + 1}.</span>
                        <p className="ave-text">
                          Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus,
                          <strong className="clause-highlight"> {m.clause} </strong>
                          Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="nordic-substep">
                  <span className="substep-label">Fecho da Dezena</span>
                  <strong className="substep-title">Glória ao Pai e Jaculatória</strong>
                  <p className="substep-text">
                    {GLORY_BE}
                    <br />
                    <br />
                    {FATIMA_PRAYER}
                  </p>
                </div>
              </div>
            </Collapse>
          </motion.div>
        );
      })}

      {/* CONCLUSÃO */}
      <motion.article className="rosary-step-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="step-bead-indicator">
          <span className="bead-number">✦</span>
        </div>
        <div className="step-main-content">
          <div className="step-tags">
            <span className="bead-tag">Medalha</span>
            <span className="action-tag">Conclusão</span>
          </div>
          <h4 className="step-action-title">Agradecimento e Salve-Rainha</h4>
          <p className="step-summary">Ao terminar as cinco dezenas, agradeça a Nossa Senhora e encerre com a Salve-Rainha e o Sinal da Cruz.</p>
          <div className="prayer-full-text" style={{ marginTop: '0.6rem' }}>
            <strong>Agradecimento</strong>
            {'\n'}
            {THANKSGIVING}
            {'\n\n'}
            <strong>Salve-Rainha</strong>
            {'\n'}
            {HAIL_HOLY_QUEEN}
            {'\n\n'}
            {SIGN_OF_THE_CROSS}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function RosaryGuide({ layoutData }) {
  const [openStepId, setOpenStepId] = useState(null);

  // Mistério selecionado (inicia com o do dia atual)
  const defaultMysteryKey = useMemo(() => getTodayMysteryKey(), []);
  const [activeMysteryKey, setActiveMysteryKey] = useState(defaultMysteryKey);

  const toggleStep = (id) => {
    setOpenStepId((prev) => (prev === id ? null : id));
  };

  const currentMystery = layoutData.mysteriesList[activeMysteryKey];
  const isToday = activeMysteryKey === defaultMysteryKey;

  return (
    <div className="rosary-guide-container">
      {/* 1. CABEÇALHO INFORMATIVO */}
      <header className="rosary-header">
        <h2 className="rosary-title">{layoutData.title}</h2>
        <p className="rosary-intro">{layoutData.introduction}</p>
      </header>

      {/* 2. SELETOR DE MISTÉRIOS POR BOTÕES */}
      <section className="rosary-mysteries-selector-section">
        <div className="selector-top-info">
          <div className="section-subtitle-wrapper">
            <Sparkles size={18} className="icon-sparkle" />
            <h3 className="mysteries-heading">Contemplação dos Mistérios</h3>
          </div>

          {isToday && (
            <span className="today-badge">
              <Calendar size={13} />
              Mistério Recomendado para Hoje
            </span>
          )}
        </div>

        <div className="mystery-buttons-pill">
          {Object.entries(layoutData.mysteriesList).map(([key, item]) => (
            <button
              key={key}
              className={`mystery-tab-btn ${activeMysteryKey === key ? 'active' : ''}`}
              style={{ '--accent': item.color, '--bg': item.bg }}
              onClick={() => setActiveMysteryKey(key)}
            >
              <span className="mystery-btn-title">{item.title}</span>
              {defaultMysteryKey === key && <span className="today-dot" title="Mistério do dia" />}
            </button>
          ))}
        </div>
      </section>

      {/* 3. GUIA PASSO A PASSO COMPLETO */}
      <section className="rosary-timeline-section">
        <h3 className="timeline-heading">Roteiro Passo a Passo do {layoutData.title}</h3>
        <p className="timeline-subtext">Siga as etapas sequenciais abaixo para a recitação completa:</p>

        {layoutData.id === 'nordico' ? (
          <NordicTimeline key={activeMysteryKey} mystery={currentMystery} />
        ) : (
          <div className="rosary-steps-timeline">
            {layoutData.steps.map((step, index) => {
              const isOpen = openStepId === step.id;
              return (
                <motion.article
                  key={step.id}
                  className={`rosary-step-card ${isOpen ? 'is-open' : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="step-bead-indicator">
                    <span className="bead-number">{index + 1}</span>
                    <span className="bead-line" />
                  </div>

                  <div className="step-main-content">
                    <div className="step-top-bar">
                      <div className="step-tags">
                        <span className="bead-tag">{step.bead}</span>
                        {step.beadBadge && <span className="action-tag">{step.beadBadge}</span>}
                      </div>
                    </div>

                    <h4 className="step-action-title">{step.action}</h4>
                    <p className="step-summary">{step.summary}</p>

                    {step.showMysteries && (
                      <MysteryAnnouncements
                        mysteryKey={activeMysteryKey}
                        mystery={currentMystery}
                        isToday={isToday}
                      />
                    )}

                    {step.prayerText && (
                      <div className="step-expand-wrapper">
                        <button
                          className="step-expand-btn"
                          onClick={() => toggleStep(step.id)}
                          aria-expanded={isOpen}
                        >
                          <span>{isOpen ? 'Ocultar Oração' : 'Ver Texto da Oração'}</span>
                          <ChevronDown size={18} className={`arrow-icon ${isOpen ? 'rotated' : ''}`} />
                        </button>

                        <Collapse isOpen={isOpen} className="step-prayer-box">
                          <p className="prayer-full-text">{step.prayerText}</p>
                        </Collapse>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. ORAÇÕES PARA DEPOIS DO TERÇO */}
      <ClosingPrayers />

      {/* GUIA ILUSTRATIVO DE POSIÇÃO DAS CONTAS */}
      <div className="rosary-visual-guide">
        <h4>Guia Visual de Posição das Contas</h4>
        <img
          className="terco-guide-img"
          src="/img2/passo-a-passo-como-rezar-o-terco.webp"
          width="607"
          height="885"
          loading="lazy"
          alt="Guia visual ilustrado para rezar o terço"
        />
      </div>
    </div>
  );
}
