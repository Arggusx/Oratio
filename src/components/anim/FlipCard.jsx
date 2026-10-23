import { useState } from 'react';

/**
 * Cartão que vira em 3D: frente e verso. No computador vira ao passar o mouse;
 * no celular, ao tocar. O cartão fica com a altura da face mais alta.
 */
export default function FlipCard({ front, back, label, className = '' }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`fx-flip ${flipped ? 'is-flipped' : ''} ${className}`}
      onClick={() => setFlipped(!flipped)}
      aria-pressed={flipped}
      aria-label={label}
    >
      <span className="fx-flip-inner">
        <span className="fx-flip-face fx-flip-front">{front}</span>
        <span className="fx-flip-face fx-flip-back">{back}</span>
      </span>
    </button>
  );
}
