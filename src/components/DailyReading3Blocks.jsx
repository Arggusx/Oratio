import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Copy, Check, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, AlertCircle,
  Feather, Scroll, Mail, RotateCcw, CalendarDays,
} from 'lucide-react';
import { addDays, fromKey, toKey } from '../utils/liturgicalCalendar';

const API_BASE = import.meta.env.VITE_API_ORACAO || 'https://daily-prayer-api.vercel.app';
const START_KEY = 'oratio:leitura-inicio';
const CACHE_PREFIX = 'oratio:leitura-cache:';

const fallbackReadings = [
  {
    id: 'at_historia',
    titulo_categoria: 'Antigo Testamento',
    icon: Scroll,
    referencia: 'Isaías 40:28-31',
    tempo_estimado: '~3 min',
    texto: 'Acaso não sabes, ou não ouviste? O Senhor é o Deus eterno, o Criador dos confins da terra; ele não se cansa nem se fatiga, e a sua inteligência é insondável. Dá força ao cansado e multiplica as forças ao que não tem nenhum vigor. Os jovens se cansam e se fatigam, e os moços cambaleiam e caem, mas os que esperam no Senhor renovam as suas forças, sobem com asas como águias, correm e não se cansam, caminham e não se fatigam.',
    reflexao: 'A força humana é limitada, mas a confiança em Deus nos renova diariamente. Diante dos desafios, esperar no Senhor nos concede o vigor espiritual necessário para seguir sem desanimar.'
  },
  {
    id: 'poesia_sabedoria',
    titulo_categoria: 'Poesia & Sabedoria',
    icon: Feather,
    referencia: 'Salmos 23:1-4',
    tempo_estimado: '~2 min',
    texto: 'O Senhor é o meu pastor; nada me faltará. Ele me faz descansar em verdes pastagens e me guia suavemente a águas tranquilas. Refrigera a minha alma e me guia pelas veredas da justiça por amor do seu nome. Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.',
    reflexao: 'Mesmo nos caminhos mais escuros e incertos, a presença amorosa de Deus é nossa proteção constante. Descansar sob seu cuidado traz paz profunda à alma.'
  },
  {
    id: 'cartas_epistolas',
    titulo_categoria: 'Cartas & Epístolas',
    icon: Mail,
    referencia: 'Filipenses 4:6-7',
    tempo_estimado: '~2 min',
    texto: 'Não andeis ansiosos por coisa alguma; antes, em tudo, sejam os vossos pedidos conhecidos diante de Deus pela oração e pela súplica, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e as vossas mentes em Cristo Jesus.',
    reflexao: 'A oração confiante e a gratidão são os remédios de Deus contra a ansiedade. Entregar nossas preocupações traz uma paz superior a qualquer compreensão humana.'
  }
];

const dayLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

// localStorage pode estar indisponível (modo privado, bloqueio de cookies).
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // ignora: a leitura funciona sem persistência
  }
}

function daysBetweenKeys(fromK, toK) {
  return Math.round((fromKey(toK) - fromKey(fromK)) / 86_400_000);
}

/**
 * Qual consulta fazer para um dia:
 * - leitura pessoal (após "recomeçar"): ?seq=N, onde N é o dia da jornada do leitor;
 * - dias passados da leitura geral: ?date=AAAA-MM-DD;
 * - hoje na leitura geral: sem parâmetros.
 */
function buildQuery(dateKey, todayKey, startKey) {
  if (startKey && dateKey >= startKey) {
    return `seq=${daysBetweenKeys(startKey, dateKey) + 1}`;
  }
  if (dateKey !== todayKey) return `date=${dateKey}`;
  return '';
}

function normalizeReadings(result) {
  const readingsArray = result?.readings || (Array.isArray(result) ? result : null);
  if (!Array.isArray(readingsArray)) return [];
  return readingsArray.filter(
    (b) => !(b.titulo_categoria || b.categoria || '').toLowerCase().includes('evangelho')
  );
}

export default function DailyReading3Blocks() {
  const todayKey = toKey(new Date());
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [startKey, setStartKey] = useState(() => readStorage(START_KEY));
  const [confirmReset, setConfirmReset] = useState(false);

  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ok'); // 'ok' | 'fallback' | 'not-found'
  const [copiedId, setCopiedId] = useState(null);
  const [expandedTextId, setExpandedTextId] = useState(null);
  const [expandedInterpretationId, setExpandedInterpretationId] = useState(null);

  const requestIdRef = useRef(0);

  const query = buildQuery(selectedKey, todayKey, startKey);
  const journeyDay = startKey && selectedKey >= startKey ? daysBetweenKeys(startKey, selectedKey) + 1 : null;

  const fetchDailyReadings = useCallback(async () => {
    // Ignora respostas de um dia que o leitor já deixou para trás.
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestId === requestIdRef.current;
    const cacheKey = CACHE_PREFIX + (query || `hoje:${todayKey}`);
    const cached = readStorage(cacheKey);
    let hasCache = false;

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.length > 0) {
          setReadings(parsed);
          setStatus('ok');
          setLoading(false);
          hasCache = true;
        }
      } catch {
        writeStorage(cacheKey, null);
      }
    }
    if (!hasCache) setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/daily-reading${query ? `?${query}` : ''}`);
      if (!isCurrent()) return;
      if (response.status === 404) {
        setReadings([]);
        setStatus('not-found');
        return;
      }
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const fresh = normalizeReadings(await response.json());
      if (!isCurrent()) return;
      if (fresh.length === 0) throw new Error('Resposta sem leituras.');

      setReadings(fresh);
      setStatus('ok');
      writeStorage(cacheKey, JSON.stringify(fresh));
    } catch (err) {
      console.error('Erro ao buscar leitura diária em 3 blocos:', err);
      if (isCurrent() && !hasCache) {
        setReadings(fallbackReadings);
        setStatus('fallback');
      }
    } finally {
      if (isCurrent()) setLoading(false);
    }
  }, [query, todayKey]);

  useEffect(() => {
    setExpandedTextId(null);
    setExpandedInterpretationId(null);
    fetchDailyReadings();
  }, [fetchDailyReadings]);

  const goToDay = (key) => {
    if (!key) return;
    setSelectedKey(key > todayKey ? todayKey : key);
  };

  const restartJourney = () => {
    writeStorage(START_KEY, todayKey);
    setStartKey(todayKey);
    setSelectedKey(todayKey);
    setConfirmReset(false);
  };

  const backToGeneral = () => {
    writeStorage(START_KEY, null);
    setStartKey(null);
    setConfirmReset(false);
  };

  const handleCopyBlock = async (item) => {
    const categoria = item.titulo_categoria || item.categoria || '';
    const textToCopy = `[${categoria}] ${item.referencia}\n"${item.texto}"`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id || categoria);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Erro ao copiar bloco:', err);
    }
  };

  const getCategoryIcon = (id, categoria) => {
    const key = (id || categoria || '').toLowerCase();
    if (key.includes('poesia') || key.includes('sabedoria')) return Feather;
    if (key.includes('carta') || key.includes('epistola')) return Mail;
    return Scroll;
  };

  const isToday = selectedKey === todayKey;

  return (
    <section className="daily-reading-section">
      <div className="daily-reading-header">
        <div className="daily-reading-title-box">
          <span className="eyebrow verse-eyebrow">Leitura Diária</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', margin: '0.2rem 0 0.4rem' }}>
            A Palavra em Três Momentos
          </h2>
          <p className="lead" style={{ fontSize: '0.95rem', margin: 0 }}>
            Uma jornada de contemplação diária pelo Antigo Testamento, Sabedoria e Epístolas.
          </p>
        </div>
      </div>

      {/* ── Navegação entre dias (nunca para o futuro) ── */}
      <div className="reading-day-nav">
        <div className="reading-day-controls">
          <button
            className="calendar-icon-btn"
            onClick={() => goToDay(toKey(addDays(fromKey(selectedKey), -1)))}
            aria-label="Dia anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <label className="reading-day-picker">
            <CalendarDays size={15} />
            <span className="reading-day-label">{isToday ? 'Hoje' : dayLabel.format(fromKey(selectedKey))}</span>
            <input
              type="date"
              value={selectedKey}
              max={todayKey}
              onChange={(e) => goToDay(e.target.value)}
              aria-label="Escolher o dia da leitura"
            />
          </label>

          <button
            className="calendar-icon-btn"
            onClick={() => goToDay(toKey(addDays(fromKey(selectedKey), 1)))}
            disabled={isToday}
            aria-label="Próximo dia"
          >
            <ChevronRight size={18} />
          </button>

          {!isToday && (
            <button className="btn-block-action" onClick={() => setSelectedKey(todayKey)}>
              Voltar para hoje
            </button>
          )}
        </div>

        <div className="reading-journey">
          {startKey ? (
            <>
              <span className="reading-journey-badge">
                {journeyDay ? `Sua leitura · dia ${journeyDay}` : 'Leitura geral (antes do recomeço)'}
              </span>
              <button className="btn-block-action" onClick={backToGeneral}>
                Voltar à leitura geral
              </button>
            </>
          ) : confirmReset ? (
            <span className="reading-journey-confirm">
              Recomeçar do Gênesis 1, Jó 1 e Romanos 1 a partir de hoje?
              <button className="btn-block-action active" onClick={restartJourney}>Sim, recomeçar</button>
              <button className="btn-block-action" onClick={() => setConfirmReset(false)}>Cancelar</button>
            </span>
          ) : (
            <button className="btn-block-action" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} />
              <span>Recomeçar a leitura</span>
            </button>
          )}
        </div>
      </div>

      {startKey && (
        <p className="reading-journey-note">
          Você está fazendo a leitura no seu próprio ritmo desde {dayLabel.format(fromKey(startKey))}. O progresso fica
          salvo neste navegador.
        </p>
      )}

      {status === 'fallback' && (
        <div className="verse-api-notice" style={{ marginTop: '1rem' }}>
          <AlertCircle size={14} />
          <span>Não foi possível carregar a leitura agora. Exibindo leituras contemplativas recomendadas.</span>
          <button onClick={fetchDailyReadings} className="btn-retry" title="Tentar novamente">
            <RefreshCw size={13} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="reading-blocks-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="reading-card-skeleton">
              <div className="skeleton" style={{ width: '40%', height: '1.2rem', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ width: '60%', height: '1.6rem', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ width: '100%', height: '4rem', marginBottom: '1rem' }} />
            </div>
          ))}
        </div>
      ) : status === 'not-found' ? (
        <div className="reading-not-found">
          <p>Não há leituras registradas para este dia.</p>
          <button className="btn-block-action" onClick={() => setSelectedKey(todayKey)}>Ver a leitura de hoje</button>
        </div>
      ) : (
        <>
          <p className="daily-reading-intro">
            Leituras breves para levar a Palavra com você, mesmo quando não for possível carregar a Bíblia.
            Reserve alguns minutos, acolha cada trecho e deixe sua interpretação iluminar o seu dia.
          </p>

          <div className="reading-blocks-grid">
            {readings.map((item, index) => {
              const categoriaNome = item.titulo_categoria || item.categoria || 'Leitura';
              const blockKey = `reading-${index}-${item.id || item.referencia || categoriaNome}`;
              const IconComponent = item.icon || getCategoryIcon(item.id, categoriaNome);
              const isCopied = copiedId === (item.id || categoriaNome);
              const isTextExpanded = expandedTextId === blockKey;
              const isInterpretationExpanded = expandedInterpretationId === blockKey;
              const interpretacao = item.interpretacao || item['interpretação'] || item.interpretation || item.reflexao || item['reflexão'];

              const isLongText = (item.texto || '').length > 140;
              const displayedText = isLongText && !isTextExpanded
                ? `${item.texto.slice(0, 140)}...`
                : item.texto;

              return (
                <motion.article
                  key={blockKey}
                  className="reading-block-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.12 }}
                >
                  <div className="reading-block-top">
                    <div className="reading-category-pill">
                      <IconComponent size={14} className="category-icon" />
                      <span>{categoriaNome}</span>
                    </div>
                  </div>

                  <h3 className="reading-block-ref">{item.referencia}</h3>

                  <blockquote className={`reading-block-text ${isTextExpanded ? 'is-expanded' : ''}`}>
                    &ldquo;{displayedText}&rdquo;
                    {isLongText && (
                      <button
                        type="button"
                        onClick={() => setExpandedTextId((prev) => (prev === blockKey ? null : blockKey))}
                        className="btn-read-more-inline"
                      >
                        {isTextExpanded ? ' (Ler menos)' : ' (Ler mais)'}
                      </button>
                    )}
                  </blockquote>

                  {interpretacao ? (
                    <div
                      className={`block-interpretation ${isInterpretationExpanded ? 'is-expanded' : ''}`}
                      aria-label={`Interpretação de ${item.referencia}`}
                    >
                      <button
                        type="button"
                        className="block-interpretation-toggle"
                        onClick={() =>
                          setExpandedInterpretationId((prev) => (prev === blockKey ? null : blockKey))
                        }
                        aria-expanded={isInterpretationExpanded}
                      >
                        <strong>Interpretação</strong>
                        <ChevronDown size={18} className={isInterpretationExpanded ? 'is-expanded' : ''} aria-hidden="true" />
                      </button>
                      <div className="block-interpretation-content">
                        <p>{interpretacao}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="block-interpretation-pending">
                      A interpretação deste trecho ainda está sendo preparada. Leia com calma e deixe a Palavra falar.
                    </p>
                  )}

                  <div className="reading-block-actions">
                    <button
                      className={`btn-block-action ${isCopied ? 'copied' : ''}`}
                      onClick={() => handleCopyBlock(item)}
                      title="Copiar trecho"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </>
      )}

      <div className="gospel-banner-footer">
        <div className="gospel-banner-content">
          <BookOpen size={20} className="gospel-banner-icon" />
          <div>
            <strong>Deseja fazer a leitura do Evangelho do Dia?</strong>
            <p>Acesse a Liturgia Diária completa com Homilia e Salmo Responsorial.</p>
          </div>
        </div>
        <Link to="/home/leituras" className="btn btn-gospel-banner">
          Ir para o Evangelho
          <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
