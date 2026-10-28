import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import MassGesturesSection from '../components/MassGesturesSection';
import SymbolsSection from '../components/SymbolsSection';
import MiraclesCatalog from '../components/MiraclesCatalog';
import MarianTitles from '../components/MarianTitles';
import { marianTitles } from '../data/marianTitles';
import { marianImages } from '../data/imageCredits';
import SaintsDirectory from '../components/SaintsDirectory';
import { LoadMoreButton } from '../components/LoadMore';
import { useLoadMore } from '../utils/useLoadMore';
import { eucharisticMiracles } from '../data/eucharisticMiracles';
import Angel from '../components/anim/Angel';

const countryCount = new Set(eucharisticMiracles.map((m) => m.country)).size;

// Ostensório: a Hóstia no centro de raios dourados, sobre a base.
function MonstranceIcon() {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8;
    const outer = i % 2 === 0 ? 15 : 12.5;
    return { x1: 24 + 8.5 * Math.cos(a), y1: 18 + 8.5 * Math.sin(a), x2: 24 + outer * Math.cos(a), y2: 18 + outer * Math.sin(a) };
  });
  return (
    <svg className="feature-card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {rays.map((r, i) => (
        <line key={i} {...r} />
      ))}
      <circle cx="24" cy="18" r="6.5" className="host" />
      <path d="M24 15v6M21 18h6" className="host-cross" />
      <path d="M24 33v8M18 44h12M20.5 41h7" className="stand" />
    </svg>
  );
}

const facts = [
  // Apologética & Dúvidas Frequentes
  [
    'Dúvidas Frequentes',
    'Os católicos adoram imagens ou estátuas?',
    'Não! A Igreja Católica ensina com clareza a diferença entre Adoração (Latreia) e Veneração (Dulia). A adoração é devida EXCLUSIVAMENTE a Deus (Pai, Filho e Espírito Santo). As imagens e estátuas de Maria e dos Santos não são adoradas nem possuem poderes próprios; elas funcionam como memórias visuais ("fotografias de fé") que nos ajudam a recordar os exemplos de virtude e nos direcionam a Deus.',
  ],
  [
    'Dúvidas Frequentes',
    'Existem várias Nossas Senhoras?',
    'Não. Nossa Senhora Aparecida, de Fátima, de Lourdes, das Graças e todas as outras são a mesma pessoa: Maria de Nazaré, a Mãe de Jesus. Os diferentes títulos destacam um aspecto da sua vida (como as Dores ou a Assunção), uma verdade de fé (como a Imaculada Conceição), um lugar onde ela se manifestou (como Fátima ou Lourdes) ou a forma como um povo experimenta a sua proteção (como Auxiliadora ou Perpétuo Socorro). As imagens mudam de acordo com a cultura de cada lugar, mas a pessoa é uma só. Veja “Uma só Maria, muitos títulos” na aba Santos desta página.',
  ],
  [
    'Dúvidas Frequentes',
    'Por que os católicos pedem a intercessão de Maria e dos Santos?',
    'Pedir a intercessão dos Santos não substitui Jesus Cristo como único Mediador de salvação (1Tm 2,5). Assim como pedimos a um amigo ou familiar que reze por nós na terra, a Bíblia ensina que a Igreja no céu (os santos triunfantes em Cristo) continua viva em Deus e apresenta as nossas orações ao Altíssimo (Ap 5,8 e Heb 12,1). Maria e os santos não concedem graças por si mesmos, mas intercedem por nós junto a Deus.',
  ],
  [
    'Dúvidas Frequentes',
    'Por que confessar os pecados com um padre e não direto com Deus?',
    'A Confissão sacramental foi instituída pelo próprio Jesus Cristo no domingo de Páscoa, quando disse aos Apóstolos: "Recebei o Espírito Santo. Aqueles a quem perdoardes os pecados, lhes serão perdoados; e àqueles a quem os retiverdes, lhes serão retidos" (Jo 20,22-23). O sacerdote atua in persona Christi (na pessoa de Cristo) e em nome de toda a comunidade eclesial atingida pelo pecado.',
  ],
  [
    'Dúvidas Frequentes',
    'Existe fundamento bíblico para a doutrina do Purgatório?',
    'Sim. O Purgatório não é um "segundo inferno" nem um lugar de punição eterna, mas um estado de purificação final dos salvos que morrem na amizade de Deus, mas ainda com apego às penas temporais do pecado. A Bíblia menciona a purificação pelo fogo (1Cor 3,15), a remissão de faltas na vida futura (Mt 12,32) e a prática dos fiéis de rezar pelos mortos para que sejam libertos de seus pecados (2Macabeus 12,44-45).',
  ],
  [
    'Dúvidas Frequentes',
    'Jesus teve irmãos de sangue?',
    'Na linguagem bíblica semítica (hebraico e aramaico), o termo "irmão" (ah) era usado indistintamente para parentes próximos como primos, sobrinhos e membros da mesma tribo (como Abraão e Ló em Gn 13,8). A tradição apostólica e a Igreja sempre professaram a perpétua virgindade de Nossa Senhora. O próprio Jesus, na cruz, entrega sua mãe aos cuidados do apóstolo João (Jo 19,26-27), o que seria impensável no direito judaico se Maria tivesse outros filhos biológicos vivos.',
  ],
  [
    'Dúvidas Frequentes',
    'Por que a Bíblia Católica tem 73 livros e outras têm 66?',
    'A Bíblia Católica possui 73 livros (46 no Antigo Testamento e 27 no Novo Testamento) porque preserva a versão grega dos Setenta (Septuaginta), usada pelos apóstolos e pela Igreja primitiva. Os 7 livros adicionais no Antigo Testamento (Tobias, Judite, Sabedoria, Eclesiástico, Baruc, 1 e 2 Macabeus) são chamados Deuterocanônicos. Eles foram retirados das Bíblias protestantes a partir da Reforma no século XVI.',
  ],
  [
    'Dúvidas Frequentes',
    'Por que os padres da Igreja Latina não se casam (Celibato)?',
    'O celibato sacerdotal não é um dogma imutável, mas uma disciplina apostólica de grande valor espiritual. Os padres celibatários imitam a forma de vida do próprio Jesus Cristo e de São Paulo (1Cor 7,32-34), entregando-se com coração indiviso ao serviço de Deus e ao cuidado da comunidade eclesial, sem distrações familiares.',
  ],
  [
    'Dúvidas Frequentes',
    'O Papa é infalível? O que significa a Infalibilidade Papal?',
    'A infalibilidade não significa que o Papa seja impecável ou que nunca erre em sua vida pessoal. Significa que, por uma assistência especial do Espírito Santo prometida por Cristo a Pedro (Lc 22,32), o Papa não pode errar quando define de forma solene e definitiva (ex cathedra) uma doutrina de Fé ou Moral para ser seguida por toda a Igreja.',
  ],

  // Vida de Oração
  [
    'Vida de Oração',
    'Posso rezar deitado? E o terço?',
    'Pode, sim. Na oração pessoal, a Igreja não exige uma posição específica: você pode rezar de pé, sentado, de joelhos, caminhando, enquanto cozinha ou trabalha, ou deitado, como antes de dormir, durante uma doença ou na velhice. O próprio salmista reza na cama: “Quando, no leito, me vem vossa lembrança, passo a noite toda pensando em vós” (Sl 62,7). O terço também pode ser rezado deitado. Deus olha antes de tudo para o coração: “o homem vê a face, mas o Senhor olha o coração” (1Sm 16,7). Ele conhece o seu cansaço e não exige que você mude de posição para se aproximar dele.',
  ],
  [
    'Vida de Oração',
    'Quando fazer o sinal da cruz, além das orações?',
    'O sinal da cruz é uma pequena oração em si: ao fazê-lo, você professa a fé na Santíssima Trindade e na cruz de Cristo. Já no século III, Tertuliano contava que os cristãos o traçavam na testa ao sair e ao entrar, ao se vestir, ao comer e ao se deitar. Hoje, momentos comuns para fazê-lo são: ao acordar e antes de dormir; ao sair de casa, antes de viajar ou de pegar a estrada; ao passar diante de uma igreja, onde Jesus está presente no sacrário; ao entrar na igreja, com água benta, recordando o Batismo; antes e depois das refeições; antes de uma prova, de uma entrevista, de uma cirurgia ou de começar o trabalho; ao ouvir uma sirene de ambulância ou uma notícia triste, rezando por quem sofre; ao passar por um cemitério ou por um cortejo fúnebre, pelos falecidos; em momentos de medo ou de tentação; ao receber a bênção do padre; e quando os pais abençoam os filhos, traçando a cruz na testa deles. Antes do Evangelho, na Missa, faz-se um sinal menor na testa, nos lábios e no peito, pedindo que a Palavra esteja no pensamento, na boca e no coração. O importante é fazê-lo com calma e consciência, e não como um gesto automático.',
  ],
  [
    'Vida de Oração',
    'Então a postura do corpo não importa na oração?',
    'Importa, mas não como condição para Deus nos ouvir. Somos corpo e alma, e o Catecismo ensina que o corpo também participa da oração (CIC 2702): ajoelhar-se expressa humildade e adoração, e ficar de pé expressa prontidão e respeito. O próprio Jesus rezou de joelhos (Lc 22,41) e prostrado com o rosto em terra (Mt 26,39). Por isso, quando for possível, escolher uma postura que ajude na atenção e na reverência é um bom hábito. O que Jesus condena é a oração feita para ser vista: “não façais como os hipócritas, que gostam de orar de pé nas sinagogas e nas esquinas das ruas, para serem vistos pelos homens” (Mt 6,5). Deus procura sinceridade, não aparência. Na Missa é diferente: os gestos são comuns a toda a assembleia e seguem as normas litúrgicas (veja a seção “Na Missa”).',
  ],

  // Os 7 Sacramentos
  [
    'Os 7 Sacramentos',
    'Por que são sete os sacramentos?',
    'A Igreja reconhece sete sinais sacramentais instituídos por Cristo: Batismo, Confirmação (Crisma), Eucaristia, Penitência (Confissão), Unção dos Enfermos, Ordem e Matrimônio. Eles acompanham os momentos centrais da vida cristã, desde o nascimento até a morte, e são canais da graça divina para a santificação dos fiéis.',
  ],
  [
    'Os 7 Sacramentos',
    'O que é a Eucaristia e a Transubstanciação?',
    'É o centro e o ápice da vida cristã: a celebração em que a Igreja faz memória da Páscoa de Cristo. Na Eucaristia ocorre a Transubstanciação: embora a aparência (os acidentes) de pão e vinho permaneça a mesma, a substância converte-se real, verdadeira e substancialmente no Corpo, Sangue, Alma e Divindade de Jesus Cristo.',
  ],
  [
    'Os 7 Sacramentos',
    'Qual a diferença entre Batismo e Crisma?',
    'O Batismo é o primeiro sacramento, que nos torna filhos de Deus, membros da Igreja e apaga o pecado original. A Crisma (Confirmação) completa a graça do Batismo, fortalecendo o cristão com a efusão e os 7 dons do Espírito Santo para testemunhar a fé com maturidade.',
  ],
  [
    'Os 7 Sacramentos',
    'O que é o sacramento da Unção dos Enfermos?',
    'É o sacramento concedido aos fiéis que se encontram em perigo de morte por doença grave ou velhice. Traz alívio espiritual, força, perdão dos pecados e, se for da vontade de Deus, a restauração da saúde física.',
  ],

  // História & Tradições
  [
    'História e Tradições',
    'Como nasceu a tradição do terço?',
    'A oração do terço amadureceu ao longo dos séculos como uma forma popular de meditar os acontecimentos da salvação de Jesus junto com Maria. A tradição atribui ao dominicano São Domingos de Gusmão (século XIII) a difusão do Rosário. Em 2002, São João Paulo II acrescentou os Mistérios Luminosos.',
  ],
  [
    'História e Tradições',
    'O que foi o Concílio Vaticano II?',
    'Realizado entre 1962 e 1965, o Concílio Vaticano II foi o 21º concílio ecumênico da Igreja. Convocado por São João XXIII e concluído por São Paulo VI, promoveu a renovação litúrgica, o diálogo ecumênico, e uma maior participação dos leigos na missão da Igreja.',
  ],
  [
    'História e Tradições',
    'Quem foi o primeiro Papa e o que é a Sucessão Apostólica?',
    'São Pedro, apóstolo de Jesus Cristo, é o primeiro Papa. Jesus disse a ele: "Tu és Pedro, e sobre esta pedra edificarei a minha Igreja" (Mt 16,18). A Sucessão Apostólica é a linha ininterrupta de imposição de mãos de Pedro até o atual Papa (Papa Leão XIV, eleito em 2025).',
  ],

  // Símbolos e Liturgia
  [
    'Símbolos e Liturgia',
    'Por que o calendário litúrgico usa cores?',
    'As cores litúrgicas tornam visível o caráter de cada celebração e tempo do ano: o verde simboliza a esperança (Tempo Comum), o roxo a conversão e penitência (Advento e Quaresma), o branco a alegria e pureza (Natal, Páscoa), o vermelho o fogo do Espírito Santo e o martírio (Pentecostes), e o rosa a alegria em meio à penitência.',
  ],
  [
    'Símbolos e Liturgia',
    'O que são os Anos A, B e C da liturgia?',
    'São os três ciclos das leituras de domingo. Em cada ano, o Evangelho dos domingos vem principalmente de um evangelista: Mateus no Ano A, Marcos no Ano B e Lucas no Ano C. O Evangelho de João é lido todos os anos, sobretudo na Quaresma, na Páscoa e, no Ano B, no discurso do Pão da Vida. Assim, em três anos, quem vai à Missa aos domingos ouve as partes mais importantes dos quatro Evangelhos. Os dias de semana têm outro ciclo, de dois anos (Ano I e Ano II), para a primeira leitura. O ano litúrgico começa no 1º Domingo do Advento: o que começou no fim de 2025 é o Ano A, com Mateus, e o que começa no fim de 2026 é o Ano B. Veja o ciclo atual no Calendário.',
  ],
  [
    'Símbolos e Liturgia',
    'O que é o Jejum e a Abstinência na Sexta-feira Santa e Quarta de Cinzas?',
    'O jejum (redução de refeições) e a abstinência de carne (de qualquer tipo, não só a vermelha) são atos penitenciais da Igreja para nos unir ao sacrifício de Jesus na cruz. São obrigatórios na Quarta-feira de Cinzas e na Sexta-feira da Paixão para fiéis de 18 a 59 anos (jejum) e a partir dos 14 anos (abstinência).',
  ],
  [
    'Símbolos e Liturgia',
    'O que é a devoção ao Sagrado Coração de Jesus e Imaculado Coração de Maria?',
    'São devoções centradas no amor misericordioso de Deus e no sim generoso de Maria. Revelada a Santa Margarida Maria Alacoque no século XVII, a devoção ao Sagrado Coração promete graças especiais para quem comunga nas primeiras sextas-feiras do mês.',
  ],
];

// Quantas curiosidades aparecem antes do botão "Ver mais".
const PAGE_SIZE = 6;

const allCategories = ['Todos', ...new Set(facts.map((f) => f[0]))];

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.35,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

// Dados estruturados (schema.org FAQPage) com todas as perguntas desta seção.
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'pt-BR',
  mainEntity: facts.map(([, question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}).replace(/</g, '\\u003c'); // evita que algum texto feche a tag <script>

function CuriosidadesSection() {
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  // Coleção aberta no lugar das perguntas: 'milagres', 'maria' ou nenhuma.
  const [collection, setCollection] = useState(null);

  // Ao abrir ou fechar o catálogo, volta ao topo da seção.
  const openCollection = (value) => {
    setCollection(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shown = useMemo(() => {
    return facts.filter((f) => {
      const matchesCat = category === 'Todos' || f[0] === category;
      const matchesQuery = f
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [category, query]);

  // Com busca ou categoria escolhida, mostra todos os resultados de uma vez.
  const isFiltering = query.trim() !== '' || category !== 'Todos';
  const { listed, remaining, showMore } = useLoadMore(shown, PAGE_SIZE, { showAll: isFiltering });

  if (collection) {
    return (
      <div>
        <button type="button" className="miracles-back" onClick={() => openCollection(null)}>
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar às curiosidades
        </button>
        <MiraclesCatalog />
      </div>
    );
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      {/* ── Destaques: coleções que abrem no lugar das perguntas ── */}
      <div className="feature-cards h-scroll">
        <button type="button" className="feature-card" onClick={() => openCollection('milagres')}>
          <MonstranceIcon />
          <span className="feature-card-text">
            <span className="feature-card-eyebrow">Inspirado em São Carlo Acutis</span>
            <strong>Milagres eucarísticos pelo mundo</strong>
            <span>
              {eucharisticMiracles.length} milagres em {countryCount} países, de Lanciano a Buenos Aires
            </span>
          </span>
          <ArrowRight size={20} className="feature-card-arrow" aria-hidden="true" />
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar dúvidas e curiosidades..."
          aria-label="Pesquisar dúvidas e curiosidades"
        />
      </div>

      {/* ── Category pills ── */}
      <div className="faq-categories">
        {allCategories.map((c) => (
          <button
            className={`category ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── FAQ items ── */}
      <div>
        {listed.map(([cat, title, text], i) => (
          <motion.div
            className="faq-item"
            key={title}
            custom={i % PAGE_SIZE}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={`accordion ${open === i ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>
                  <small className="faq-category-label">{cat}</small>
                  {title}
                </span>
                <ChevronDown size={18} className="accordion-icon" />
              </button>
              <div className="accordion-content">
                <div>
                  <p className="accordion-body">{text}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <LoadMoreButton remaining={remaining} onClick={showMore} label="Ver mais curiosidades" />

        {shown.length === 0 && (
          <p className="lead" style={{ textAlign: 'center', marginTop: '2rem' }}>
            Nenhuma curiosidade encontrada.
          </p>
        )}
      </div>
    </div>
  );
}

/** Santos: Nossa Senhora em destaque e, abaixo, todos os santos. */
function SantosSection() {
  const [showMarian, setShowMarian] = useState(false);
  const cover = marianImages.guadalupe;

  const toggle = (value) => {
    setShowMarian(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showMarian) {
    return (
      <div>
        <button type="button" className="miracles-back" onClick={() => toggle(false)}>
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar aos santos
        </button>
        <MarianTitles />
      </div>
    );
  }

  return (
    <div>
      <header className="mass-intro" style={{ marginBottom: '1.2rem' }}>
        <h2 className="mass-intro-title">Santos e intercessores</h2>
        <p>
          Conheça Nossa Senhora e os santos: a história de cada um, a data em que a Igreja os celebra e as orações
          para pedir sua intercessão.
        </p>
      </header>

      {/* Nossa Senhora vem antes e com mais destaque que os demais santos */}
      <button type="button" className="marian-feature" onClick={() => toggle(true)}>
        {cover && <img src={cover.src} width={cover.width} height={cover.height} alt="" loading="lazy" decoding="async" />}
        <span className="marian-feature-text">
          <span className="feature-card-eyebrow">Rainha de todos os santos</span>
          <strong>Nossa Senhora</strong>
          <span>
            Aparecida, Fátima, Lourdes, Guadalupe… Por que são todas a mesma Maria, Mãe de Jesus: {marianTitles.length}{' '}
            títulos explicados, com imagens.
          </span>
          <span className="marian-feature-cta">
            Conhecer os títulos de Maria
            <ArrowRight size={18} aria-hidden="true" />
          </span>
        </span>
      </button>

      <SaintsDirectory />
    </div>
  );
}

const SECTIONS = [
  { id: 'curiosidades', label: 'Curiosidades' },
  { id: 'missa', label: 'Na Missa' },
  { id: 'simbolos', label: 'Símbolos' },
  { id: 'santos', label: 'Santos' },
];

export default function EscolaDaFe() {
  // A seção fica na URL (?secao=missa) para poder ser compartilhada.
  const [searchParams, setSearchParams] = useSearchParams();
  const section = SECTIONS.some((s) => s.id === searchParams.get('secao'))
    ? searchParams.get('secao')
    : 'curiosidades';

  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Conhecer para amar</span>
          <h1 className="section-title">Escola da Fé</h1>
        </div>
        <Angel />
      </div>
      <p className="lead">
        Respostas simples sobre a fé católica, um guia prático para viver bem a Santa Missa, o significado dos
        principais símbolos cristãos e a vida de Nossa Senhora e dos santos.
      </p>

      <div className="subnav-segmented" role="tablist" aria-label="Seções da Escola da Fé">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={section === s.id}
            className={section === s.id ? 'active' : ''}
            onClick={() => setSearchParams(s.id === 'curiosidades' ? {} : { secao: s.id }, { replace: true })}
          >
            {s.label}
          </button>
        ))}
      </div>

      <motion.div
        key={section}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {section === 'missa' && <MassGesturesSection />}
        {section === 'simbolos' && <SymbolsSection />}
        {section === 'curiosidades' && <CuriosidadesSection />}
        {section === 'santos' && <SantosSection />}
      </motion.div>
    </main>
  );
}
