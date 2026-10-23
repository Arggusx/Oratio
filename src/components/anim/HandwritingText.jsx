/** Frase escrita "à mão": o contorno das letras é traçado e depois preenchido. */
/* O texto real fica num <h1> visível só para leitores de tela; este SVG é decorativo. */
export default function HandwritingText() {
  return (
    <svg className="fx-hand" viewBox="0 0 400 150" aria-hidden="true" focusable="false">
      <text className="fx-hand-line" x="2" y="60" style={{ '--d': '0s' }}>
        Reze com calma.
      </text>
      <text className="fx-hand-line" x="2" y="132" style={{ '--d': '1.6s' }}>
        Viva com fé.
      </text>
    </svg>
  );
}
