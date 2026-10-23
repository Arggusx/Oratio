/** Pequenas cruzes douradas que brilham e somem, espalhadas no fundo de uma seção. */
const STARS = [
  { x: 6, y: 18, s: 9, d: 0 },
  { x: 18, y: 72, s: 6, d: 1.2 },
  { x: 31, y: 8, s: 7, d: 2.1 },
  { x: 44, y: 88, s: 5, d: 0.6 },
  { x: 52, y: 22, s: 8, d: 2.8 },
  { x: 63, y: 64, s: 6, d: 1.7 },
  { x: 74, y: 12, s: 10, d: 0.3 },
  { x: 86, y: 46, s: 7, d: 2.4 },
  { x: 94, y: 80, s: 6, d: 1 },
  { x: 40, y: 50, s: 5, d: 3.2 },
];

export default function TwinkleCrosses() {
  return (
    <div className="twinkles" aria-hidden="true">
      {STARS.map((st) => (
        <svg
          key={`${st.x}-${st.y}`}
          viewBox="0 0 10 10"
          width={st.s * 2}
          height={st.s * 2}
          style={{ left: `${st.x}%`, top: `${st.y}%`, animationDelay: `${st.d}s` }}
          focusable="false"
        >
          <path d="M5 0.5v9M0.5 5h9" />
        </svg>
      ))}
    </div>
  );
}
