import { Link } from 'react-router-dom';
import { saints } from '../data/saints';
import { marianTitles } from '../data/marianTitles';
import { saintImages, marianImages } from '../data/imageCredits';
import ImageCredit from '../components/ImageCredit';
import Angel from '../components/anim/Angel';

function CreditList({ items }) {
  return (
    <ul className="credits-list">
      {items.map(({ id, name, image, to }) => (
        <li key={id} className="credits-item">
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            loading="lazy"
            decoding="async"
            style={image.position ? { objectPosition: image.position } : undefined}
          />
          <div>
            {to ? <Link to={to}>{name}</Link> : <strong>{name}</strong>}
            <ImageCredit image={image} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Creditos() {
  const saintItems = saints
    .filter((s) => saintImages[s.slug])
    .map((s) => ({ id: s.slug, name: s.name, image: saintImages[s.slug], to: `/home/santos/${s.slug}` }));
  const marianItems = marianTitles
    .filter((t) => marianImages[t.id])
    .map((t) => ({ id: t.id, name: t.title, image: marianImages[t.id] }));

  return (
    <main className="page credits-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Transparência</span>
          <h1 className="section-title">Créditos das imagens</h1>
        </div>
        <Angel />
      </div>
      <p className="lead">
        As pinturas, ícones e fotografias dos santos e de Nossa Senhora vêm do Wikimedia Commons. A maioria está
        em domínio público, por serem obras antigas; as demais têm licenças livres que permitem o uso com o
        devido crédito. Todas foram reduzidas e convertidas para WebP para carregar mais rápido.
      </p>
      <p className="credits-note">
        Imagens com licença CC BY-SA continuam sob a mesma licença. Se você é autor de alguma delas e encontrou
        um erro no crédito, avise pelo botão de feedback.
      </p>

      <section className="saint-section">
        <h2 className="saint-section-title">Santos</h2>
        <CreditList items={saintItems} />
      </section>

      <section className="saint-section">
        <h2 className="saint-section-title">Títulos de Nossa Senhora</h2>
        <CreditList items={marianItems} />
      </section>
    </main>
  );
}
