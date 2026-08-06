import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, Info, Search, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function VerseOfTheDay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showReflection, setShowReflection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  const fetchVerseOfTheDay = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_ORACAO || 'https://daily-prayer-api.vercel.app';
      const response = await fetch(`${baseUrl}/api/verse-of-the-day`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Erro ao buscar versículo do dia:', err);
      setData({
        reference: 'Gênesis 1:1',
        text: 'No princípio, Deus criou o céu e a terra.',
        reflection: 'Este versículo nos lembra da soberania de Deus sobre a criação. Ele é o início de todas as coisas e nos convida a renovar nossa fé a cada dia.'
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerseOfTheDay();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (!data) return;
    const textToCopy = `"${data.text}" - ${data.reference}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);

    const mockVerses = [
      { reference: 'João 3:16', text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...', book: 'João', chapter: 3, verse: 16 },
      { reference: 'Salmos 23:1', text: 'O Senhor é o meu pastor; nada me faltará.', book: 'Salmos', chapter: 23, verse: 1 },
      { reference: 'Gênesis 1:1', text: 'No princípio, Deus criou o céu e a terra.', book: 'Gênesis', chapter: 1, verse: 1 },
      { reference: 'Filipenses 4:13', text: 'Tudo posso naquele que me fortalece.', book: 'Filipenses', chapter: 4, verse: 13 },
      { reference: 'Provérbios 3:5', text: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.', book: 'Provérbios', chapter: 3, verse: 5 },
      { reference: 'Romanos 8:28', text: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus...', book: 'Romanos', chapter: 8, verse: 28 },
      { reference: 'Jeremias 29:11', text: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor...', book: 'Jeremias', chapter: 29, verse: 11 },
      { reference: 'Mateus 6:33', text: 'Buscai em primeiro lugar o Reino de Deus e a sua justiça...', book: 'Mateus', chapter: 6, verse: 33 },
    ];

    const qLower = query.toLowerCase();
    const filtered = mockVerses.filter(
      (item) =>
        item.reference.toLowerCase().includes(qLower) ||
        item.text.toLowerCase().includes(qLower) ||
        item.book.toLowerCase().includes(qLower)
    );

    if (filtered.length === 0) {
      filtered.push({
        reference: query,
        text: `Leitura sugerida para "${query}". Explore o capítulo e os versículos na íntegra.`,
        book: query.split(' ')[0] || query,
      });
    }

    setSearchResults(filtered);
    setIsSearching(false);
  };

  const selectSearchResult = (item) => {
    setData({
      reference: item.reference,
      text: item.text,
      reflection: item.reflection || `Reflexão meditativa inspirada em ${item.reference}. Reserve este momento para contemplar a Palavra de Deus.`
    });
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  return (
    <article className="verse-card">
      <div className="verse-card-header">
        <div className="verse-eyebrow-container">
          <span className="eyebrow verse-eyebrow">
            Versículo do Dia
          </span>
          <div className="info-tooltip-wrapper">
            <button
              type="button"
              className="info-icon-btn"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label="Sobre a seleção do versículo"
            >
              <Info size={14} />
            </button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  className="tooltip-box"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <p>Versículo diário atualizado para meditação e contemplação espiritual.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="verse-search-container" ref={searchRef}>
          <div className="verse-search-input-wrapper">
            <Search size={15} className="verse-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
              placeholder="Buscar livro, cap ou versículo (ex: Salmos 23)"
              className="verse-search-input"
            />
          </div>

          <AnimatePresence>
            {showSearchDropdown && (
              <motion.div
                className="verse-search-dropdown"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
              >
                {isSearching ? (
                  <div className="dropdown-loading">Buscando...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="dropdown-results-list">
                    {searchResults.map((item, idx) => (
                      <li
                        key={idx}
                        className="dropdown-result-item"
                        onClick={() => selectSearchResult(item)}
                      >
                        <strong className="result-ref">{item.reference}</strong>
                        <span className="result-snippet">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="dropdown-no-results">Nenhum resultado encontrado</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <div className="verse-api-notice">
          <AlertCircle size={14} />
          <span>Exibindo mensagem contemplativa do dia.</span>
          <button onClick={fetchVerseOfTheDay} className="btn-retry" title="Tentar novamente">
            <RefreshCw size={13} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="verse-skeleton-body">
          <div className="skeleton" style={{ width: '40%', height: '1.8rem', marginBottom: '1rem' }} />
          <div className="skeleton" style={{ width: '90%', height: '3.5rem', marginBottom: '1.5rem' }} />
          <div className="skeleton" style={{ width: '30%', height: '2rem' }} />
        </div>
      ) : data ? (
        <div className="verse-content-wrapper">
          <h2 className="verse-reference">{data.reference}</h2>
          
          <blockquote className="verse-quote">
            &ldquo;{data.text}&rdquo;
          </blockquote>

          <div className="verse-actions">
            <button
              className={`btn-verse-action ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copiar versículo para compartilhar"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            {data.reflection && (
              <button
                className={`btn-verse-action btn-reflection-toggle ${showReflection ? 'active' : ''}`}
                onClick={() => setShowReflection(!showReflection)}
                aria-expanded={showReflection}
              >
                <Sparkles size={16} />
                <span>Interpretação & Reflexão</span>
                <ChevronDown size={16} className={`chevron-icon ${showReflection ? 'rotated' : ''}`} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showReflection && data.reflection && (
              <motion.div
                className="verse-reflection-box"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="reflection-inner">
                  <h4>Reflexão do Dia</h4>
                  <p>{data.reflection}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : null}
    </article>
  );
}
