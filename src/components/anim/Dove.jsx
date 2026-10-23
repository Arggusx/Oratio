/** Pomba do Espírito Santo que atravessa o topo da página de tempos em tempos, batendo as asas. */
export default function Dove({ second = false }) {
  return (
    <div className={`dove-flight ${second ? 'is-second' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 72 44" width="84" height="51" focusable="false">
        <g className="dove">
          {/* asa de trás */}
          <path className="dove-wing dove-wing-back" d="M34 20C30 10 22 4 12 3c6 6 9 12 14 19z" />
          {/* corpo e cauda */}
          <path
            className="dove-body"
            d="M14 26c8-6 22-8 34-5 5 1 9 0 12-3 2 2 2 5 0 7-3 3-8 4-12 4-8 0-16 2-22 6l-8-1 4-3c-4 0-6-2-8-5z"
          />
          <circle className="dove-eye" cx="57" cy="21.5" r="0.9" />
          <path className="dove-beak" d="M61 21.6l4 1-4 1.2z" />
          {/* asa da frente */}
          <path className="dove-wing dove-wing-front" d="M36 22C33 11 27 3 17 0c4 8 6 15 10 23z" />
        </g>
      </svg>
    </div>
  );
}
