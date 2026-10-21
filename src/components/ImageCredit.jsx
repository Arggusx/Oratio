/** Crédito de uma imagem do Wikimedia Commons: autor, licença e link para a fonte. */
export default function ImageCredit({ image, className = '' }) {
  if (!image) return null;
  return (
    <p className={`image-credit ${className}`}>
      Imagem: {image.author} ·{' '}
      {image.licenseUrl ? (
        <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer license">
          {image.license}
        </a>
      ) : (
        image.license
      )}{' '}
      ·{' '}
      <a href={image.source} target="_blank" rel="noopener noreferrer">
        Wikimedia Commons
      </a>
      {image.note && ` · ${image.note}`}
    </p>
  );
}
