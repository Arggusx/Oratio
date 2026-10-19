import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import MassGesturesSection from '../components/MassGesturesSection';

const facts = [
  // Apologética & Dúvidas Frequentes
  [
    'Dúvidas Frequentes',
    'Os católicos adoram imagens ou estátuas?',
    'Não! A Igreja Católica ensina com clareza a diferença entre Adoração (Latreia) e Veneração (Dulia). A adoração é devida EXCLUSIVAMENTE a Deus (Pai, Filho e Espírito Santo). As imagens e estátuas de Maria e dos Santos não são adoradas nem possuem poderes próprios; elas funcionam como memórias visuais ("fotografias de fé") que nos ajudam a recordar os exemplos de virtude e nos direcionam a Deus.',
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
    'São Pedro, apóstolo de Jesus Cristo, é o primeiro Papa. Jesus disse a ele: "Tu és Pedro, e sobre esta pedra edificarei a minha Igreja" (Mt 16,18). A Sucessão Apostólica é a linha ininterrupta de imposição de mãos de Pedro até o atual Papa (Papa Francisco).',
  ],

  // Símbolos e Liturgia
  [
    'Símbolos e Liturgia',
    'Por que o calendário litúrgico usa cores?',
    'As cores litúrgicas tornam visível o caráter de cada celebração e tempo do ano: o verde simboliza a esperança (Tempo Comum), o roxo a conversão e penitência (Advento e Quaresma), o branco a alegria e pureza (Natal, Páscoa), o vermelho o fogo do Espírito Santo e o martírio (Pentecostes), e o rosa a alegria em meio à penitência.',
  ],
  [
    'Símbolos e Liturgia',
    'O que é o Jejum e a Abstinência na Sexta-feira Santa e Quarta de Cinzas?',
    'O jejum (redução de refeições) e a abstinência de carne vermelha são atos penitenciais da Igreja para nos unir ao sacrifício de Jesus na cruz. São obrigatórios na Quarta-feira de Cinzas e na Sexta-feira da Paixão para fiéis de 18 a 59 anos (jejum) e a partir dos 14 anos (abstinência).',
  ],
  [
    'Símbolos e Liturgia',
    'O que é a devoção ao Sagrado Coração de Jesus e Imaculado Coração de Maria?',
    'São devoções centradas no amor misericordioso de Deus e no sim generoso de Maria. Revelada a Santa Margarida Maria Alacoque no século XVII, a devoção ao Sagrado Coração promete graças especiais para quem comunga nas primeiras sextas-feiras do mês.',
  ],
];

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

function CuriosidadesSection() {
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

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

  return (
    <div>
      {/* ── Search bar ── */}
      <div className="search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar dúvidas e curiosidades..."
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
        {shown.map(([cat, title, text], i) => (
          <motion.div
            className="faq-item"
            key={title}
            custom={i}
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

        {shown.length === 0 && (
          <p className="lead" style={{ textAlign: 'center', marginTop: '2rem' }}>
            Nenhuma curiosidade encontrada.
          </p>
        )}
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: 'curiosidades', label: 'Curiosidades' },
  { id: 'missa', label: 'Na Missa' },
];

export default function EscolaDaFe() {
  // A seção fica na URL (?secao=missa) para poder ser compartilhada.
  const [searchParams, setSearchParams] = useSearchParams();
  const section = SECTIONS.some((s) => s.id === searchParams.get('secao'))
    ? searchParams.get('secao')
    : 'curiosidades';

  return (
    <main className="page">
      <span className="eyebrow">Conhecer para amar</span>
      <h1 className="section-title">Escola da Fé</h1>
      <p className="lead">
        Respostas simples sobre a fé católica, a história e as tradições da Igreja, e um guia prático para viver
        bem a Santa Missa.
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
        {section === 'missa' ? <MassGesturesSection /> : <CuriosidadesSection />}
      </motion.div>
    </main>
  );
}
