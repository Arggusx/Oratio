/** Logo que se desenha: auréola, cruz e livro aberto em traço dourado; depois surge o nome. */
export default function LogoDraw({ size = 200, showName = true }) {
  const height = showName ? size * 1.1 : size * 0.86;
  return (
    <svg
      className="fx-logo"
      viewBox={showName ? '0 0 200 220' : '20 8 160 172'}
      width={size}
      height={height}
      aria-hidden="true"
      focusable="false"
    >
      <circle className="fx-draw" style={{ '--d': '0s', '--t': '1.2s' }} cx="100" cy="88" r="70" pathLength="1" />
      <path className="fx-draw" style={{ '--d': '0.9s', '--t': '0.7s' }} d="M100 34v92" pathLength="1" />
      <path className="fx-draw" style={{ '--d': '1.3s', '--t': '0.5s' }} d="M74 62h52" pathLength="1" />
      <path
        className="fx-draw"
        style={{ '--d': '1.7s', '--t': '0.9s' }}
        d="M100 132c-14-8-34-8-50-3v-26c16-5 36-5 50 3"
        pathLength="1"
      />
      <path
        className="fx-draw"
        style={{ '--d': '1.7s', '--t': '0.9s' }}
        d="M100 132c14-8 34-8 50-3v-26c-16-5-36-5-50 3"
        pathLength="1"
      />
      {showName && (
        <text className="fx-logo-name" x="100" y="200" textAnchor="middle">
          Oratio
        </text>
      )}
    </svg>
  );
}
