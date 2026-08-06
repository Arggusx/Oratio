import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Calendar } from 'lucide-react';

// Helper para detectar o mistério do dia atual baseado no dia da semana
function getTodayMysteryKey() {
  const day = new Date().getDay(); // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  switch (day) {
    case 1: // Segunda
    case 6: // Sábado
      return 'gozosos';
    case 2: // Terça
    case 5: // Sexta
      return 'dolorosos';
    case 4: // Quinta
      return 'luminosos';
    case 3: // Quarta
    case 0: // Domingo
    default:
      return 'gloriosos';
  }
}

export default function RosaryGuide({ layoutData }) {
  const [openStepId, setOpenStepId] = useState(null);
  
  // Mistério selecionado (inicia com o do dia atual)
  const defaultMysteryKey = useMemo(() => getTodayMysteryKey(), []);
  const [activeMysteryKey, setActiveMysteryKey] = useState(defaultMysteryKey);

  const toggleStep = (id) => {
    setOpenStepId(prev => (prev === id ? null : id));
  };

  const currentMystery = layoutData.mysteriesList ? layoutData.mysteriesList[activeMysteryKey] : null;

  return (
    <div className="rosary-guide-container">
      {/* 1. CABEÇALHO INFORMATIVO */}
      <header className="rosary-header">
        <h2 className="rosary-title">{layoutData.title}</h2>
        <p className="rosary-intro">{layoutData.introduction}</p>
      </header>

      {/* 2. SELETOR DE MISTÉRIOS POR BOTÕES */}
      {layoutData.mysteriesList && (
        <section className="rosary-mysteries-selector-section">
          <div className="selector-top-info">
            <div className="section-subtitle-wrapper">
              <Sparkles size={18} className="icon-sparkle" />
              <h3 className="mysteries-heading">
                Contemplação dos Mistérios
              </h3>
            </div>
            
            {activeMysteryKey === defaultMysteryKey && (
              <span className="today-badge">
                <Calendar size={13} />
                Mistério Recomendado para Hoje
              </span>
            )}
          </div>

          {/* BOTÕES DE MISTÉRIO */}
          <div className="mystery-buttons-pill">
            {Object.entries(layoutData.mysteriesList).map(([key, item]) => {
              const isActive = activeMysteryKey === key;
              const isToday = defaultMysteryKey === key;
              return (
                <button
                  key={key}
                  className={`mystery-tab-btn ${isActive ? 'active' : ''}`}
                  style={{
                    '--accent': item.color,
                    '--bg': item.bg
                  }}
                  onClick={() => setActiveMysteryKey(key)}
                >
                  <span className="mystery-btn-title">{item.title}</span>
                  {isToday && <span className="today-dot" title="Mistério do dia" />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. GUIA PASSO A PASSO COMPLETO */}
      <section className="rosary-timeline-section">
        <h3 className="timeline-heading">Roteiro Passo a Passo do {layoutData.title}</h3>
        <p className="timeline-subtext">Siga as etapas sequenciais abaixo para a recitação completa:</p>

        {/* SE FOR TERÇO NÓRDICO, EXIBE AS 5 DEZENAS DETALHADAS COM AS CLÁUSULAS INTEGRADAS */}
        {layoutData.id === 'nordico' && currentMystery ? (
          <div className="nordic-full-timeline">
            {/* ORAÇÃO INICIAL NÓRDICA */}
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
                <h4 className="step-action-title">Invocação Inicial</h4>
                <p className="step-summary">Sinal da Cruz e oração inicial de purificação dos lábios e coração.</p>
                <div className="prayer-full-text" style={{ marginTop: '0.6rem' }}>
                  Em nome do Pai, do Filho e do Espírito Santo. Amém.<br /><br />
                  <em>"Abri, Senhor, os meus lábios para louvar o vosso Santo Nome e purificai o meu coração de todos os pensamentos vãos e distraídos."</em>
                </div>
              </div>
            </motion.article>

            {/* AS 5 DEZENAS DO MISTÉRIO SELECIONADO COM AS AVE-MARIAS E CLÁUSULAS */}
            {currentMystery.mysteries.map((m, mIdx) => (
              <motion.div
                key={m.id}
                className="nordic-mystery-block"
                style={{ '--accent': currentMystery.color }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: mIdx * 0.05 }}
              >
                <div className="nordic-mystery-header">
                  <span className="mystery-badge-number">{mIdx + 1}ª Dezena</span>
                  <h4 className="nordic-mystery-title">{m.name}</h4>
                  <p className="nordic-meditation-text">{m.text}</p>
                </div>

                <div className="nordic-step-sequence">
                  {/* Pai Nosso */}
                  <div className="nordic-substep">
                    <span className="substep-label">Conta Grande</span>
                    <strong className="substep-title">Pai Nosso</strong>
                    <p className="substep-text">Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso Reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.</p>
                  </div>

                  {/* 10 Ave Marias com Cláusula Nórdica Integrada */}
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

                  {/* Glória ao Pai */}
                  <div className="nordic-substep">
                    <span className="substep-label">Fecho da Dezena</span>
                    <strong className="substep-title">Glória ao Pai</strong>
                    <p className="substep-text">Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* SE FOR TERÇO TRADICIONAL */
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

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              className="step-prayer-box"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="prayer-full-text">{step.prayerText}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* GUIA ILUSTRATIVO DE POSIÇÃO DAS CONTAS */}
      <div className="rosary-visual-guide">
        <h4>Guia Visual de Posição das Contas</h4>
        <img
          className="terco-guide-img"
          src="/img2/passo-a-passo-como-rezar-o-terco.png"
          alt="Guia visual ilustrado para rezar o terço"
        />
      </div>
    </div>
  );
}


