// Desenhos que flutuam sobre cada ilha da trilha. Todos cabem numa caixa de 48×48, centrada em (0, 0).
const ICONS = {
  igreja: (
    <>
      <path className="ti-fill" d="M-14 18V-2L0-14 14-2v20z" />
      <path className="ti-line" d="M0-26v12M-5-21h10M-5 18V6a5 5 0 0 1 10 0v12" />
    </>
  ),
  biblia: (
    <>
      <path className="ti-fill" d="M-18-14c6-3 12-3 18 2 6-5 12-5 18-2v28c-6-3-12-3-18 2-6-5-12-5-18-2z" />
      <path className="ti-line" d="M0-12v30M8-6v10M4-2h8" />
    </>
  ),
  pergaminho: (
    <>
      <path className="ti-fill" d="M-14-18h24a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4h-24z" />
      <path className="ti-line" d="M-8-10h16M-8-3h16M-8 4h11M-14-18a4 4 0 0 0 0 8M-14 18a4 4 0 0 1 0-8" />
    </>
  ),
  ofertas: (
    <>
      <ellipse className="ti-fill" cx="-8" cy="6" rx="10" ry="7" />
      <path className="ti-fill" d="M6-14h12l-2 12a4 4 0 0 1-8 0z" />
      <path className="ti-line" d="M12 2v14M7 16h10M-14 4h12" />
    </>
  ),
  calice: (
    <>
      <circle className="ti-glow" cx="0" cy="-16" r="8" />
      <path className="ti-line" d="M0-21v10M-5-16h10" />
      <path className="ti-fill" d="M-12-4h24a12 12 0 0 1-24 0z" />
      <path className="ti-line" d="M0 8v8M-8 18h16" />
    </>
  ),
  hostia: (
    <>
      <circle className="ti-glow" cx="0" cy="0" r="16" />
      <circle className="ti-fill" cx="0" cy="0" r="11" />
      <path className="ti-line" d="M0-6v12M-6 0h12" />
    </>
  ),
  pomba: (
    <>
      <path className="ti-fill" d="M-18 4c8-6 18-7 27-4 3 1 6 0 8-2 1 2 1 4 0 6-2 2-6 3-9 3-6 0-11 2-15 5l-6-1 3-2c-4-1-6-3-8-5z" />
      <path className="ti-fill" d="M0 1C-2-7-7-12-14-14c3 6 5 11 8 17z" />
    </>
  ),
  estrela: (
    <>
      <circle className="ti-glow" cx="0" cy="0" r="17" />
      <path className="ti-fill" d="M0-16l4 11 12 1-9 8 3 12-10-7-10 7 3-12-9-8 12-1z" />
    </>
  ),
  lirio: (
    <>
      <path className="ti-line" d="M0 20V-2M0 10c-6-2-9-6-9-10M0 6c5-2 8-5 8-9" />
      <path className="ti-fill" d="M0-2c-7-4-9-12-4-18 1 6 4 9 4 18 0-9 3-12 4-18 5 6 3 14-4 18z" />
    </>
  ),
  lua: (
    <>
      <path className="ti-fill" d="M6-16a16 16 0 1 0 0 32 13 13 0 0 1 0-32z" />
      <path className="ti-line" d="M12-14l1.5 3 3 .5-2.2 2 .5 3-2.8-1.4-2.8 1.4.5-3-2.2-2 3-.5zM16 6l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2-.3z" />
    </>
  ),
  concha: (
    <>
      <path className="ti-fill" d="M0 16c-12 0-19-9-17-19 6-1 10 0 17 4 7-4 11-5 17-4 2 10-5 19-17 19z" />
      <path className="ti-line" d="M0 16V2M-8 14l4-12M8 14L4 2M-6-14c2 3 2 6 0 8M2-20c2 3 2 6 0 8M8-14c2 3 2 6 0 8" />
    </>
  ),
  chaves: (
    <>
      <circle className="ti-fill" cx="-8" cy="-10" r="7" />
      <circle className="ti-fill" cx="8" cy="-10" r="7" />
      <path className="ti-line" d="M-4-5L10 18M4-5l-14 23M6 13l4-3M-6 13l-4-3" />
    </>
  ),
  oleo: (
    <>
      <path className="ti-fill" d="M-10-4h20v18a6 6 0 0 1-6 6h-8a6 6 0 0 1-6-6z" />
      <path className="ti-line" d="M-6-4v-6h12v6M-3-10v-4h6v4" />
      <path className="ti-glow" d="M0-24c4 5 5 8 0 11-5-3-4-6 0-11z" />
      <path className="ti-line" d="M-4 6h8" />
    </>
  ),
  aneis: (
    <>
      <circle className="ti-glow" cx="0" cy="0" r="18" />
      <circle className="ti-line" cx="-6" cy="2" r="10" />
      <circle className="ti-line" cx="6" cy="2" r="10" />
      <path className="ti-fill" d="M-6-12l3 4h-6zM6-12l3 4h-6z" />
    </>
  ),
  pergunta: (
    <>
      <circle className="ti-glow" cx="0" cy="0" r="17" />
      <circle className="ti-fill" cx="0" cy="0" r="13" />
      <path className="ti-line" d="M-4.5-4a4.5 4.5 0 1 1 6 4.2c-1.2.5-1.5 1.2-1.5 2.6M0 7.5v.5" />
    </>
  ),
  coroa: (
    <>
      <circle className="ti-glow" cx="0" cy="-2" r="18" />
      <path className="ti-fill" d="M-16 10l-2-18 9 8 9-14 9 14 9-8-2 18z" />
      <path className="ti-line" d="M-14 15h28M0-8v2" />
    </>
  ),
  nuvens: (
    <>
      <circle className="ti-glow" cx="0" cy="-8" r="12" />
      <path className="ti-line" d="M0-20v8M-4-16h8" />
      <path className="ti-fill" d="M-18 14a7 7 0 0 1 4-12 9 9 0 0 1 17-2 7 7 0 0 1 13 6 6 6 0 0 1-2 8z" />
    </>
  ),
};

/**
 * Uma ilha flutuante da trilha: terra, grama e o desenho da etapa por cima.
 * O estado (concluída, atual, trancada) só muda as cores; o CSS cuida da flutuação.
 * "color" tinge o desenho e o brilho com a cor da trilha.
 */
export default function TrailIsland({ icon, state = 'current', color }) {
  return (
    <svg
      className={`trail-island-svg is-${state}`}
      viewBox="-60 -62 120 112"
      style={color ? { '--island': color } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="ti-shadow" cx="0" cy="46" rx="34" ry="5" />
      {/* terra com raízes e a grama em cima */}
      <path className="ti-earth" d="M-46 6c0 18 22 34 46 34S46 24 46 6z" />
      <path className="ti-roots" d="M-14 30l-4 10M2 38v8M16 30l5 9" />
      <ellipse className="ti-grass" cx="0" cy="6" rx="46" ry="14" />
      <ellipse className="ti-grass-top" cx="-4" cy="3" rx="36" ry="9" />
      <g className="ti-icon" transform="translate(0 -22)">
        {ICONS[icon] ?? ICONS.estrela}
      </g>
    </svg>
  );
}
