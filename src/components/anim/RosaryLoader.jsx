/** Carregamento temático: as contas de uma dezena acendem uma a uma, em ciclo. */
export default function RosaryLoader({ label = 'Preparando a oração…' }) {
  const beads = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 10) * 2 * Math.PI;
    return { x: 50 + 30 * Math.cos(a), y: 46 + 30 * Math.sin(a), i };
  });

  return (
    <div className="fx-loader" role="status">
      <svg viewBox="0 0 100 110" width="110" height="121" aria-hidden="true">
        <circle cx="50" cy="46" r="30" className="fx-loader-string" />
        {beads.map((b) => (
          <circle key={b.i} cx={b.x} cy={b.y} r="5" className="fx-loader-bead" style={{ '--i': b.i }} />
        ))}
        <path d="M50 76v8M50 92v14M44 98h12" className="fx-loader-cross" />
        <circle cx="50" cy="86" r="2.6" className="fx-loader-medal" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
