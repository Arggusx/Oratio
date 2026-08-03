import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Copy, Check, ChevronRight, Sparkles, RefreshCw, AlertCircle, Feather, Scroll, Mail } from 'lucide-react';

/* ── Fallback data for the 3 Reading Blocks (excluding Gospels) ── */
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

export default function DailyReading3Blocks() {
  const [readings, setReadings] = useState([]);
  const [totalEstimatedTime, setTotalEstimatedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedTextId, setExpandedTextId] = useState(null);

  // Fetch daily reading 3 blocks from backend API (/api/daily-reading)
  const fetchDailyReadings = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_ORACAO || 'https://daily-prayer-api.vercel.app';
      const response = await fetch(`${baseUrl}/api/daily-reading`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const result = await response.json();

      if (result.total_estimated_time) {
        setTotalEstimatedTime(result.total_estimated_time);
      }

      const readingsArray = result.readings || (Array.isArray(result) ? result : null);

      if (readingsArray && Array.isArray(readingsArray) && readingsArray.length > 0) {
        const filtered = readingsArray.filter(
          (b) => !(b.titulo_categoria || b.categoria || '').toLowerCase().includes('evangelho')
        );
        setReadings(filtered.length > 0 ? filtered : fallbackReadings);
      } else {
        setReadings(fallbackReadings);
      }
    } catch (err) {
      console.error('Erro ao buscar leitura diária em 3 blocos:', err);
      setReadings(fallbackReadings);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReadings();
  }, []);

  // Copy reference & text of a specific block
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

  const toggleTextExpand = (id) => {
    setExpandedTextId((prev) => (prev === id ? null : id));
  };

  const getCategoryIcon = (id, categoria) => {
    const key = (id || categoria || '').toLowerCase();
    if (key.includes('poesia') || key.includes('sabedoria')) return Feather;
    if (key.includes('carta') || key.includes('epistola')) return Mail;
    return Scroll;
  };

  return (
    <section className="daily-reading-section">
      {/* ── Section Header ── */}
      <div className="daily-reading-header">
        <div className="daily-reading-title-box">
          <span className="eyebrow verse-eyebrow">
            <Sparkles size={16} className="sparkle-icon" /> Leitura Diária ({totalEstimatedTime || '5 a 10 min'})
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', margin: '0.2rem 0 0.4rem' }}>
            A Palavra em Três Momentos
          </h2>
          <p className="lead" style={{ fontSize: '0.95rem', margin: 0 }}>
            Uma jornada de contemplação diária pelo Antigo Testamento, Sabedoria e Epístolas.
          </p>
        </div>


        <Link to="/home/leituras" className="gospel-link-badge">
          <span>Ver também o Evangelho de hoje</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      {error && (
        <div className="verse-api-notice" style={{ marginTop: '1rem' }}>
          <AlertCircle size={14} />
          <span>Exibindo leituras contemplativas recomendadas para hoje.</span>
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
      ) : (
        <>
          <p className="daily-reading-intro">
            Leituras breves para levar a Palavra com você, mesmo quando não for possível carregar a Bíblia.
            Reserve alguns minutos, acolha cada trecho e deixe sua interpretação iluminar o seu dia.
          </p>

          {/* ── 3 Blocks Grid ── */}
          <div className="reading-blocks-grid">
            {readings.map((item, index) => {
              const categoriaNome = item.titulo_categoria || item.categoria || 'Leitura';
              // A API pode repetir ou omitir `id`; o índice mantém cada cartão independente.
              const blockKey = `reading-${index}-${item.id || item.referencia || categoriaNome}`;
              const IconComponent = item.icon || getCategoryIcon(item.id, categoriaNome);
              const tempoLeitura = item.tempo_estimado || item.tempoEstimado || '~2 min';
              const isCopied = copiedId === (item.id || categoriaNome);
              const isTextExpanded = expandedTextId === blockKey;
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
                {/* Block Header */}
                <div className="reading-block-top">
                  <div className="reading-category-pill">
                    <IconComponent size={14} className="category-icon" />
                    <span>{categoriaNome}</span>
                  </div>

                  <span className="reading-time-badge" title="Tempo estimado de leitura">
                    <Clock size={13} /> {tempoLeitura}
                  </span>
                </div>

                {/* Reference & Text */}
                <h3 className="reading-block-ref">{item.referencia}</h3>

                <blockquote className="reading-block-text">
                  &ldquo;{displayedText}&rdquo;
                  {isLongText && (
                    <button
                      onClick={() => toggleTextExpand(blockKey)}
                      className="btn-read-more-inline"
                    >
                      {isTextExpanded ? ' (Ler menos)' : ' (Ler mais)'}
                    </button>
                  )}
                </blockquote>

                {interpretacao && (
                  <div className="block-interpretation" aria-label={`Interpretação de ${item.referencia}`}>
                    <strong>Interpretação</strong>
                    <p>{interpretacao}</p>
                  </div>
                )}

                {/* Actions */}
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


      {/* ── Footer Link Banner to Evangelho Page ── */}
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
