/**
 * Fundo do site inteiro, no estilo do Codolin: malha discreta de cruzinhas douradas e
 * brilhos suaves que se movem bem devagar. Fica atrás de todo o conteúdo e não recebe cliques.
 */
export default function SiteBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      <span className="site-bg-glow site-bg-glow-gold" />
      <span className="site-bg-glow site-bg-glow-blue" />
      <span className="site-bg-glow site-bg-glow-rose" />
    </div>
  );
}
