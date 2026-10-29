import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TrailIsland from '../TrailIsland';
import { DEFAULT_FRAME, allFrames } from '../../data/rewards';

// Enfeites de cada moldura, distribuídos em volta do círculo.
function motifs(frame, r) {
  const around = (n, render, offset = -Math.PI / 2) =>
    Array.from({ length: n }, (_, i) => {
      const a = offset + (i / n) * Math.PI * 2;
      return render(60 + r * Math.cos(a), 60 + r * Math.sin(a), (a * 180) / Math.PI + 90, i);
    });
  switch (frame.motif) {
    case 'cruzes':
      return around(8, (x, y, rot, i) => (
        <path key={i} d={`M${x} ${y - 4}v8M${x - 3} ${y - 1.5}h6`} transform={`rotate(${rot} ${x} ${y})`} className="af-line" />
      ));
    case 'estrelas':
      return around(12, (x, y, rot, i) => (
        <path
          key={i}
          d={`M${x} ${y - 3.6}l1 2.3 2.5.3-1.9 1.7.6 2.5-2.2-1.3-2.2 1.3.6-2.5-1.9-1.7 2.5-.3z`}
          className="af-fill"
        />
      ));
    case 'sete':
      return around(7, (x, y, rot, i) => <circle key={i} cx={x} cy={y} r="3" className="af-fill" />);
    case 'alfa':
      return [
        <text key="a" x="11" y="64" className="af-text">
          Α
        </text>,
        <text key="o" x="101" y="64" className="af-text">
          Ω
        </text>,
        ...around(10, (x, y, rot, i) => <circle key={i} cx={x} cy={y} r="1.6" className="af-fill" />, -Math.PI / 2 + 0.3),
      ];
    case 'raios':
      return around(24, (x, y, rot, i) => (
        <path key={i} d={`M${x} ${y - (i % 2 ? 2.5 : 4.5)}v${i % 2 ? 5 : 9}`} transform={`rotate(${rot} ${x} ${y})`} className="af-line" />
      ));
    case 'peixes':
      return around(6, (x, y, rot, i) => (
        <path
          key={i}
          d={`M${x - 5} ${y}q5-5 9 0q-4 5-9 0zM${x + 4} ${y}l3-2.5v5z`}
          transform={`rotate(${rot + 90} ${x} ${y})`}
          className="af-fill"
        />
      ));
    default:
      return null;
  }
}

/** Medalhão da Jornada: a inicial do nome (ou uma pomba) dentro da moldura escolhida. */
export function AvatarFrame({ frameId, name, size = 96 }) {
  const frame = allFrames.find((f) => f.id === frameId) ?? DEFAULT_FRAME;
  const initial = name?.trim().charAt(0).toUpperCase();
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className="avatar-frame"
      style={{ '--frame': frame.color, '--frame-accent': frame.accent }}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="56" className="af-ring" />
      <circle cx="60" cy="60" r="44" className="af-inner" />
      {motifs(frame, 50)}
      {initial ? (
        <text x="60" y="73" className="af-initial">
          {initial}
        </text>
      ) : (
        <path
          className="af-dove"
          d="M38 64c10-8 24-10 36-5 4 1 7 0 9-3 2 2 2 5 0 7-3 3-7 4-11 4-8 0-15 2-20 6l-7-1 4-3c-5-1-8-3-11-5zM58 60c-2-9-8-15-17-18 4 7 6 13 9 20z"
        />
      )}
    </svg>
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
      <div className="reward-rays" aria-hidden="true" />
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
