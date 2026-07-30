import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, Check, ChevronDown, Info, Search, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function VerseOfTheDay() {
  // State for Verse of the Day API call
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state for reflection tab, tooltip, copy button
  const [showReflection, setShowReflection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Search Bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Fetch Verse of the Day from API
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
      // Fallback data if API is offline
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

  // Handle outside click for search dropdown & tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Copy reference and verse text to clipboard
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

  // Search logic (mock / local filter over common verses & chapter format)
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

    // Simulate search results for demonstration & quick biblical navigation
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

    // If query matches a standard pattern like "Gênesis 1" or "João 1:1" not in static list
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
    <motion.section
      className="verse-of-the-day-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* ── Card Header with Eyebrow, Info Badge & Search ── */}
      <div className="verse-card-header">
        <div className="verse-badge-container">
          <span className="eyebrow verse-eyebrow">
            <Sparkles size={15} className="sparkle-icon" /> Versículo do Dia
          </span>

          {/* Info Icon with Tooltip */}
          <div
            className="verse-info-wrapper"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            tabIndex={0}
            role="button"
            aria-label="Informações sobre o Versículo do Dia"
          >
            <Info size={16} className="info-icon" />
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  className="verse-tooltip"
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Exibe um versículo bíblico diferente a cada dia, seguindo a ordem canônica da Bíblia (de Gênesis a Apocalipse).
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Bar */}
        <div className="verse-search-wrapper" ref={searchRef}>
          <div className="verse-search-input-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar livro, capítulo ou versículo..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
              className="verse-search-input"
            />
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showSearchDropdown && (
              <motion.ul
                className="verse-search-dropdown"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                {isSearching ? (
                  <li className="search-status">Buscando...</li>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <li
                      key={idx}
                      className="search-item"
                      onClick={() => selectSearchResult(item)}
                    >
                      <strong className="search-item-ref">{item.reference}</strong>
                      <span className="search-item-text">{item.text}</span>
                    </li>
                  ))
                ) : (
                  <li className="search-status">Nenhum resultado encontrado</li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main Content Block (Loading / Error / Data) ── */}
      {loading ? (
        <div className="verse-skeleton-body">
          <div className="skeleton" style={{ width: '40%', height: '1.8rem', margin: '1rem auto' }} />
          <div className="skeleton" style={{ width: '90%', height: '1.2rem', margin: '0.5rem auto' }} />
          <div className="skeleton" style={{ width: '75%', height: '1.2rem', margin: '0.5rem auto' }} />
        </div>
      ) : (
        <>
          {error && (
            <div className="verse-api-notice">
              <AlertCircle size={14} />
              <span>Modo offline ativado (usando versículo diário de contingência).</span>
              <button onClick={fetchVerseOfTheDay} className="btn-retry" title="Tentar novamente">
                <RefreshCw size={13} />
              </button>
            </div>
          )}

          {/* Reference Header */}
          <h2 className="verse-reference">{data?.reference}</h2>

          {/* Verse Text */}
          <blockquote className="verse-text">
            &ldquo;{data?.text}&rdquo;
          </blockquote>

          {/* Share / Copy Button */}
          <div className="verse-actions">
            <button
              className={`btn-verse-action ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copiar referência e versículo"
            >
              {copied ? (
                <>
                  <Check size={16} /> Copiado!
                </>
              ) : (
                <>
                  <Copy size={16} /> Compartilhar / Copiar
                </>
              )}
            </button>

            {data?.reflection && (
              <button
                className={`btn-verse-action btn-reflection-toggle ${showReflection ? 'active' : ''}`}
                onClick={() => setShowReflection(!showReflection)}
              >
                Reflexão do Dia
                <motion.div
                  animate={{ rotate: showReflection ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>
            )}
          </div>

          {/* Expandable Reflection Section */}
          <AnimatePresence>
            {showReflection && data?.reflection && (
              <motion.div
                className="verse-reflection-box"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="verse-reflection-content">
                  <h4>Reflexão & Meditação</h4>
                  <p>{data.reflection}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.section>
  );
}
