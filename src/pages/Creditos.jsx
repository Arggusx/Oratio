import { Link } from 'react-router-dom';
import { saints } from '../data/saints';
import { marianTitles } from '../data/marianTitles';
import { saintImages, marianImages } from '../data/imageCredits';
import ImageCredit from '../components/ImageCredit';

// Obras de onde vêm os textos dos cânticos publicados com letra (todos em domínio público).
const CANTICO_SOURCES = [
  {
    name: 'Liber Usualis',
    detail:
      'Abadia de Solesmes, edição de 1961. Reúne os cantos gregorianos: antífonas marianas, hinos eucarísticos, Te Deum e cantos do Advento e da Quaresma.',
  },
  {
    name: 'Graduale Romanum e seu Kyriale',
    detail:
      'Livro de canto da Missa romana. Dele vêm o Kyrie, o Glória, o Santo e o Cordeiro da Missa VIII (De Angelis), as sequências e os cantos do Domingo de Ramos.',
  },
  {
    name: 'Bíblia',
    detail: 'Os Salmos 23, 100 e 117 e o Magnificat (Lc 1,46-55) estão em tradução livre feita para o Oratio.',
  },
  {
    name: 'Hinos antigos',
    detail:
      'Adeste fideles (John Francis Wade, séc. XVIII), Veni, veni, Emmanuel (Psalteriolum Cantionum Catholicarum, 1710) e Puer natus in Bethlehem (séc. XIV).',
  },
];

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
          <h1 className="section-title">Créditos</h1>
        </div>
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

      <section className="saint-section">
        <h2 className="saint-section-title">Textos dos cânticos</h2>
        <p className="credits-note">
          Na página de <Link to="/home/canticos">Cânticos da Missa</Link>, só os textos em domínio público têm a
          letra publicada. As traduções para o português foram feitas para o Oratio. Os cânticos com autor vivo ou
          editora aparecem sem a letra, com a indicação de onde encontrá-la.
        </p>
        <ul className="credits-sources">
          {CANTICO_SOURCES.map((s) => (
            <li key={s.name}>
              <strong>{s.name}</strong>
              <span>{s.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="saint-section">
        <h2 className="saint-section-title">Textos da Missa</h2>
        <p className="credits-note">
          No Ordinário da Missa, as respostas do povo são trechos curtos do Missal Romano, na tradução oficial da
          CNBB, de uso comum nas celebrações. As regras de cada dia seguem a Instrução Geral do Missal Romano. As
          antífonas, as orações e as leituras do dia vêm da API Liturgia Diária.
        </p>
      </section>
    </main>
  );
}
