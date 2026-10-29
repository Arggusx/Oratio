import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Largura de cada cartão no trilho (igual ao CSS: min(82vw, 23rem)) e o espaço entre eles.
const GAP = 16;
const cardWidth = () => Math.min(window.innerWidth * 0.82, 23 * parseFloat(getComputedStyle(document.documentElement).fontSize));
// Abaixo disso, o trilho andaria tão pouco que não vale a pena: os cartões ficam numa grade comum.
const MIN_DISTANCE = 120;

/**
 * Trilho lateral: enquanto a pessoa rola a página para baixo (roda do mouse ou dedo), a seção fica parada na
 * tela e os cartões andam para o lado; ao chegar ao último, a página volta a rolar normalmente.
 * Se tudo já cabe na largura, ou se a pessoa pediu menos movimento, os cartões ficam numa grade comum.
 */
export default function ScrollRail({ children, label, className = '' }) {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [railHeight, setRailHeight] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reduced] = useState(prefersReducedMotion);

  // Quanto o trilho precisa andar: a largura dos cartões que não cabem na tela. A conta não depende do
  // layout atual (trilho ou grade), para a seção poder trocar de um para o outro ao redimensionar a janela.
  useEffect(() => {
    if (reduced) return undefined;
    const track = trackRef.current;
    const sticky = outerRef.current.firstElementChild;
    const measure = () => {
      const count = track.children.length;
      const needed = count * cardWidth() + (count - 1) * GAP - track.parentElement.clientWidth;
      setDistance(needed > MIN_DISTANCE ? needed : 0);
      setRailHeight(sticky.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track.parentElement);
    observer.observe(sticky);
    return () => observer.disconnect();
  }, [reduced]);

  // A rolagem vertical vira deslocamento lateral, 1 para 1.
  useEffect(() => {
    if (reduced || distance === 0) {
      trackRef.current.style.transform = '';
      return undefined;
    }
    const outer = outerRef.current;
    const track = trackRef.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Quanto a parte grudada já desceu dentro da seção = quanto a página rolou com ela parada.
      const sticky = outer.firstElementChild;
      const offset = sticky.getBoundingClientRect().top - outer.getBoundingClientRect().top;
      const moved = Math.min(Math.max(offset, 0), distance);
      track.style.transform = `translate3d(${-moved}px, 0, 0)`;
      setProgress(moved / distance);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, distance]);

  const active = !reduced && distance > 0;

  return (
    <section
      ref={outerRef}
      className={`scroll-rail ${active ? 'is-active' : 'is-static'} ${className}`}
      // A seção fica mais alta exatamente o quanto o trilho precisa andar.
      style={active ? { height: railHeight + distance } : undefined}
      aria-label={label}
    >
      <div className="scroll-rail-sticky">
        <div className="scroll-rail-viewport">
          <div ref={trackRef} className="scroll-rail-track">
            {children}
          </div>
        </div>
        {active && (
          <div className="scroll-rail-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
        )}
      </div>
    </section>
  );
}
