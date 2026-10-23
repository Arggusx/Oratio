import { useState } from 'react';

/** Bíblia aberta cujas páginas viram sozinhas de tempos em tempos; um clique vira mais uma. */
export default function BibleFlip() {
  const [flips, setFlips] = useState(0);

  return (
    <button
      type="button"
      className="bible"
      onClick={() => setFlips((n) => n + 1)}
      aria-label="Virar a página da Bíblia"
      title="Virar a página"
    >
      <svg viewBox="0 0 96 64" width="84" height="56" aria-hidden="true" focusable="false">
        <path className="bible-cover" d="M4 14h88v42H4z" />
        <path className="bible-page bible-page-left" d="M48 18C38 12 22 12 10 16v36c12-4 28-4 38 2z" />
        <path className="bible-page bible-page-right" d="M48 18c10-6 26-6 38-2v36c-12-4-28-4-38 2z" />
        <g className="bible-lines">
          <path d="M16 24c8-2 18-2 26 1M16 30c8-2 18-2 26 1M16 36c8-2 18-2 26 1M16 42c8-2 18-2 26 1" />
          <path d="M54 25c8-3 18-3 26-1M54 31c8-3 18-3 26-1M54 37c8-3 18-3 26-1M54 43c8-3 18-3 26-1" />
        </g>
        {/* página que vira: a chave muda a cada clique para reiniciar a animação */}
        <path key={flips} className={`bible-turning ${flips ? 'is-manual' : ''}`} d="M48 18c10-6 26-6 38-2v36c-12-4-28-4-38 2z" />
        <path className="bible-ribbon" d="M50 54l2 9 3-5 3 5 1-10" />
        <path className="bible-cross" d="M70 4v8M66 8h8" />
      </svg>
    </button>
  );
}
