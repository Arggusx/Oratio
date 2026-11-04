import { useEffect, useRef } from 'react';
import { buildFrameLayers } from '../../data/frameLayers';
import { Link } from 'react-router-dom';
import TrailIsland from '../TrailIsland';
import { DEFAULT_FRAME, allFrames } from '../../data/rewards';

// As duas camadas SVG (trás e frente) de cada moldura, montadas uma vez só.
const LAYERS = buildFrameLayers(allFrames);

// Pomba no lugar da inicial, quando a pessoa não pôs o nome.
const DOVE =
  'M38 64c10-8 24-10 36-5 4 1 7 0 9-3 2 2 2 5 0 7-3 3-7 4-11 4-8 0-15 2-20 6l-7-1 4-3c-5-1-8-3-11-5zM58 60c-2-9-8-15-17-18 4 7 6 13 9 20z';

/**
 * Medalhão da Jornada: a foto (ou a inicial do nome, ou uma pomba) dentro da moldura escolhida.
 * A pilha é: camada de trás (o anel e as partículas) → avatar → camada da frente (selos e brilhos).
 * As animações são SMIL, dentro do próprio SVG; ficam pausadas quando o medalhão sai da tela,
 * quando "animate" é falso (moldura bloqueada) ou quando a pessoa prefere menos movimento.
 */
export function AvatarFrame({ frameId, name, photo, size = 96, animate = true }) {
  const frame = allFrames.find((f) => f.id === frameId) ?? DEFAULT_FRAME;
  const layers = LAYERS[frame.id] ?? LAYERS[DEFAULT_FRAME.id];
  const initial = name?.trim().charAt(0).toUpperCase();
  const boxRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);

  useEffect(() => {
    const svgs = [backRef.current, frontRef.current].filter(Boolean);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const play = (on) =>
      svgs.forEach((svg) => {
        if (on) svg.unpauseAnimations?.();
        else svg.pauseAnimations?.();
      });
    if (!animate || reduced) {
      play(false);
      return undefined;
    }
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => play(entry.isIntersecting));
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [animate, frame.id]);

  return (
    <span
      ref={boxRef}
      className="avatar-frame"
      style={{ width: size, height: size, '--frame': frame.color, '--frame-accent': frame.accent }}
      aria-hidden="true"
    >
      <svg
        ref={backRef}
        className="af-fx"
        viewBox="-40 -40 180 180"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: layers.tras }}
      />
      <span className="af-avatar">
        {photo ? (
          <img src={photo} alt="" className="af-photo" />
        ) : initial ? (
          <span className="af-initial" style={{ fontSize: size * 0.42 }}>
            {initial}
          </span>
        ) : (
          <svg viewBox="30 36 60 40" className="af-dove" focusable="false">
            <path d={DOVE} />
          </svg>
        )}
      </span>
      {layers.frente && (
        <svg
          ref={frontRef}
          className="af-fx is-front"
          viewBox="-40 -40 180 180"
          focusable="false"
          dangerouslySetInnerHTML={{ __html: layers.frente }}
        />
      )}
    </span>
  );
}

/** Carimbo do Passaporte do Peregrino. Sem a ilha concluída, aparece só o contorno tracejado. */
export function Stamp({ trail, reward, stamped, date }) {
  return (
    <div className={`stamp ${stamped ? 'is-stamped' : ''}`} style={{ '--stamp': trail.color, '--tilt': `${(trail.id.length % 7) - 3}deg` }}>
      <span className="stamp-art" aria-hidden="true">
        <TrailIsland icon={reward.stamp.icon} color={trail.color} />
      </span>
      <strong>{stamped ? reward.stamp.title : trail.title}</strong>
      <small>{stamped ? `“${reward.stamp.motto}”${date ? ` · ${date}` : ''}` : 'Conclua a ilha para carimbar'}</small>
    </div>
  );
}

/** Janela que aparece ao concluir uma ilha: o carimbo e a moldura ganhos. */
export function RewardReveal({ trail, reward, onClose, onUseFrame }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className="reward-reveal" style={{ '--trail': trail.color }} aria-labelledby="reward-title">
      {/* Os raios são maiores que a janela: ficam dentro de uma camada recortada para não criar rolagem vazia. */}
      <div className="reward-rays-clip" aria-hidden="true">
        <div className="reward-rays" />
      </div>
      <span className="eyebrow">Ilha concluída</span>
      <h2 id="reward-title">{trail.title}</h2>
      <div className="reward-items">
        <figure>
          <Stamp trail={trail} reward={reward} stamped />
          <figcaption>Carimbo no seu Passaporte do Peregrino</figcaption>
        </figure>
        <figure>
          <AvatarFrame frameId={reward.frame.id} size={120} />
          <figcaption>Nova moldura: {reward.frame.name}</figcaption>
        </figure>
      </div>
      <div className="reward-actions">
        <button
          type="button"
          className="btn"
          onClick={() => {
            onUseFrame();
            dialogRef.current?.close();
          }}
        >
          Usar a moldura nova
        </button>
        <Link to="/jornada?secao=passaporte" className="fx-small-btn" onClick={() => dialogRef.current?.close()}>
          Ver o passaporte
        </Link>
      </div>
    </dialog>
  );
}
