import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles, Calendar, HeartHandshake, ListOrdered } from 'lucide-react';
import { getTodayMysteryKey } from '../utils/liturgicalCalendar';
import {
  MAX_INTENTIONS,
  buildOffering,
  closingPrayerIds,
  decadePlan,
  getRosaryIntention,
} from '../data/rosaryIntentions';
import { prayers } from '../data/prayers';
import RosaryExplorer from './anim/RosaryExplorer';
import RosaryCheck from './RosaryCheck';
import RosaryIntention from './RosaryIntention';
import PrayedTodayButton from './PrayedTodayButton';
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

// Passos marcados como rezados: valem só para o dia e ficam só neste aparelho.
const CHECKS_PREFIX = 'oratio:terco-passos:';
const todayKey = () => CHECKS_PREFIX + new Date().toLocaleDateString('sv-SE');

function loadChecks() {
  try {
    // Limpa as marcações de dias anteriores.
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CHECKS_PREFIX) && k !== todayKey())
      .forEach((k) => localStorage.removeItem(k));
    return new Set(JSON.parse(localStorage.getItem(todayKey()) ?? '[]'));
  } catch {
    return new Set();
  }
}

function useDailyChecks() {
  const [done, setDone] = useState(loadChecks);
  const setStepDone = useCallback((id, value) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      try {
        localStorage.setItem(todayKey(), JSON.stringify([...next]));
      } catch {
        // Sem armazenamento (aba anônima), a marcação vale só enquanto a página está aberta.
      }
      return next;
    });
  }, []);
  const clear = useCallback(() => {
    setDone(new Set());
    try {
      localStorage.removeItem(todayKey());
    } catch {
      // idem
    }
  }, []);
  return { done, setStepDone, clear };
}

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
      <p className="mystery-announcements-tip">
        Depois de anunciar, acrescente um pedido só para aquela dezena: “Ofereço esta dezena por…”
      </p>
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

  // A lista de passos fica recolhida: o terço desenhado já mostra cada oração.
  const [listOpen, setListOpen] = useState(false);
  const { done, setStepDone, clear } = useDailyChecks();

  const toggleStep = (id) => {
    setOpenStepId((prev) => (prev === id ? null : id));
  };

  // "Ver o roteiro" no terço: abre a lista no passo e rola até ele, depois que ela aparece.
  const openStepFromBead = (id) => {
    setListOpen(true);
    setOpenStepId(id);
    setTimeout(() => {
      document.getElementById(`passo-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  };
  // Intenções escolhidas (opcionais, até cinco): ficam no endereço (?intencao=saude,familia)
  // para o terço personalizado poder ser compartilhado.
  const [searchParams, setSearchParams] = useSearchParams();
  const intentionParam = searchParams.get('intencao') ?? '';
  const selectedIntentions = useMemo(
    () =>
      layoutData.id === 'nordico'
        ? []
        : [...new Set(intentionParam.split(','))].map(getRosaryIntention).filter(Boolean).slice(0, MAX_INTENTIONS),
    [intentionParam, layoutData.id]
  );
  const setIntentions = (ids) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (ids.length) next.set('intencao', ids.join(','));
        else next.delete('intencao');
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
  const plan = useMemo(() => decadePlan(selectedIntentions), [selectedIntentions]);

  // Com intenções, o oferecimento (passo 2) é o delas e o último passo ganha a oração de cada santo.
  const steps = useMemo(() => {
    if (!layoutData.steps || !selectedIntentions.length) return layoutData.steps;
    // Uma oração por santo: Família e Trabalho, por exemplo, são as duas de São José,
    // e duas orações a ele seguidas pareceriam repetição.
    const seenSaints = new Set();
    const closingIds = selectedIntentions.flatMap((it) => {
      if (seenSaints.has(it.saint)) return [];
      seenSaints.add(it.saint);
      return closingPrayerIds(it);
    });
    const closing = closingIds
      .map((id) => prayers.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => `Pelas suas intenções, ${p.title}:\n${p.text}`)
      .join('\n\n');
    const last = layoutData.steps.length - 1;
    return layoutData.steps.map((step, i) => {
      if (step.id === 'step-2') return { ...step, prayerText: buildOffering(selectedIntentions) };
      if (i === last && closing) return { ...step, prayerText: `${step.prayerText}\n\n${closing}` };
      return step;
    });
  }, [layoutData.steps, selectedIntentions]);

  const activeStepIndex = steps?.findIndex((s) => s.id === openStepId) ?? -1;

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

        {/* Os mistérios saíram do menu principal: este link leva à página com os quatro grupos. */}
        <Link to="/home/misterio" className="mysteries-all-link">
          Ver os quatro grupos de mistérios lado a lado
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      {/* 3. GUIA PASSO A PASSO COMPLETO */}
      <section className="rosary-timeline-section">
        <h3 className="timeline-heading">Roteiro Passo a Passo do {layoutData.title}</h3>
        <p className="timeline-subtext">
          {layoutData.id === 'nordico'
            ? 'Siga as etapas sequenciais abaixo para a recitação completa:'
            : 'Toque numa parte do terço ou use “Próximo”: a oração de cada passo aparece ao lado, sem precisar rolar a página.'}
        </p>

        {layoutData.id === 'nordico' ? (
          <NordicTimeline key={activeMysteryKey} mystery={currentMystery} />
        ) : (
          <>
            {/* Intenções opcionais: o roteiro abaixo muda com elas. */}
            <RosaryIntention selected={selectedIntentions} onChange={setIntentions} />

            <RosaryExplorer
              steps={steps}
              decadePlan={plan}
              activeIndex={activeStepIndex}
              onOpenStep={openStepFromBead}
              mysteryKey={activeMysteryKey}
              mystery={currentMystery}
              done={done}
              onSetDone={setStepDone}
            />

            <div className="rosary-list-toggle-row">
              <button
                type="button"
                className="btn btn-secondary rosary-list-toggle"
                onClick={() => setListOpen((v) => !v)}
                aria-expanded={listOpen}
                aria-controls="roteiro-em-lista"
              >
                <ListOrdered size={18} aria-hidden="true" />
                {listOpen ? 'Esconder o roteiro em lista' : 'Ver o roteiro em lista'}
                <ChevronDown size={18} aria-hidden="true" className={`arrow-icon ${listOpen ? 'rotated' : ''}`} />
              </button>
              {done.size > 0 && (
                <button type="button" className="rosary-checks-clear" onClick={clear}>
                  {done.size === 1 ? 'Desmarcar o passo rezado' : `Desmarcar os ${done.size} passos rezados`}
                </button>
              )}
            </div>

            <Collapse isOpen={listOpen}>
            <div className="rosary-steps-timeline" id="roteiro-em-lista">
              {steps.map((step, index) => {
                const isOpen = openStepId === step.id;
                return (
                  <motion.article
                    key={step.id}
                    id={`passo-${step.id}`}
                    className={`rosary-step-card ${isOpen ? 'is-open' : ''} ${done.has(step.id) ? 'is-done' : ''}`}
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
                        <RosaryCheck
                          checked={done.has(step.id)}
                          onChange={(v) => setStepDone(step.id, v)}
                          label="Rezei"
                        />
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
            </Collapse>
          </>
        )}
      </section>

      {/* Fim do terço: um toque discreto para marcar o dia (e acendê-lo na Jornada, quando ligada). */}
      <PrayedTodayButton showLink />

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
