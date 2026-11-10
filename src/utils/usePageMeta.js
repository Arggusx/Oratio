import { useEffect } from 'react';
import { getSaint } from '../data/saints';
import { getNovena } from '../data/novenas';
import { getTrail } from '../data/trails';
import { getCantico, hasPage } from '../data/canticos';
import { JORNADA_ATIVA } from './features';

export const SITE_URL = 'https://www.oratiodaily.com';

const BRAND = ' | Oratio Daily';
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

/** Título no padrão "Assunto principal | Oratio Daily", com até 60 caracteres. */
export function pageTitle(subject, fallback) {
  const full = subject + BRAND;
  if (full.length <= TITLE_MAX || !fallback) return full;
  return fallback + BRAND;
}

const DESCRIPTION_MIN = 130;

/**
 * Descrição entre 130 e 155 caracteres: se ficar curta, ganha a frase extra (quando couber);
 * se ficar longa, é cortada no fim de uma palavra.
 */
export function clampDescription(text, extra = '') {
  let clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length < DESCRIPTION_MIN && extra && clean.length + extra.length + 1 <= DESCRIPTION_MAX) {
    clean = `${clean} ${extra}`;
  }
  if (clean.length <= DESCRIPTION_MAX) return clean;
  const cut = clean.slice(0, DESCRIPTION_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.—-]+$/, '')}…`;
}

const QUIZ_DESCRIPTION =
  'Teste o que você sabe sobre a fé católica: perguntas com cinco alternativas, a explicação de cada resposta e níveis do fácil ao desafio final.';

// Cada página tem um assunto principal, que abre o título e aparece na descrição.
// Títulos: até 60 caracteres, palavra-chave no início e a marca no fim.
// Descrições: de 130 a 155 caracteres, com um convite para o clique.
const DEFAULT_META = {
  title: pageTitle('Terço, Liturgia Diária e Orações'),
  description:
    'Reze o terço com guia passo a passo, leia a liturgia e o Evangelho do dia e aprofunde a fé com santos, novenas e a Escola da Fé. Grátis e sem cadastro.',
};

const NOT_FOUND_META = {
  title: pageTitle('Página não encontrada'),
  description: 'O endereço pode ter mudado ou sido digitado errado.',
  noindex: true,
};

const PAGE_META = {
  '/': DEFAULT_META,
  '/home/misterio': {
    title: pageTitle('Mistérios do terço de cada dia'),
    description:
      'Saiba quais mistérios do terço rezar em cada dia da semana (gozosos, luminosos, dolorosos e gloriosos) e o que contemplar em cada uma das cinco dezenas.',
  },
  '/home/leituras': {
    title: pageTitle('Liturgia diária e Evangelho do dia'),
    description:
      'Leia a liturgia diária completa: primeira leitura, salmo com refrão, segunda leitura, Evangelho do dia e homilia, com as respostas do povo na Missa.',
  },
  '/home/oracoes': {
    title: pageTitle('Como rezar o terço passo a passo'),
    description:
      'Aprenda a rezar o terço passo a passo, com o rosário nórdico, a Oração de São Bento e orações católicas por intenção e para cada momento do dia.',
  },
  '/home/calendario': {
    title: pageTitle('Calendário católico e dias santos'),
    description:
      'Consulte os domingos e dias santos de preceito, solenidades, festas de santos e feriados nacionais no calendário litúrgico do Brasil, com busca por nome.',
  },
  '/home/santos': {
    title: pageTitle('Santos católicos: história e orações'),
    description:
      'Conheça a história, a data da festa e as orações de mais de 40 santos, como São Bento, Santo Antônio, Santa Rita e São Judas Tadeu, e peça a intercessão.',
  },
  '/home/escola-da-fe': {
    title: pageTitle('Escola da Fé: dúvidas sobre a fé católica'),
    description:
      'Respostas simples para dúvidas sobre a fé católica: o que fazer na Missa, símbolos cristãos, milagres eucarísticos, títulos de Nossa Senhora e santos.',
  },
  '/home/confissao': {
    title: pageTitle('Exame de consciência para confissão'),
    description:
      'Prepare-se para a confissão com um exame de consciência pelos Dez Mandamentos e preceitos da Igreja, o passo a passo para confessar e o Ato de Contrição.',
  },
  '/home/novenas': {
    title: pageTitle('Novenas católicas: nove dias de oração'),
    description:
      'Reze novenas ao Espírito Santo, de Natal, a Nossa Senhora Aparecida e a Santo Antônio, com um tema e uma oração para cada um dos nove dias da novena.',
  },
  '/home/trilhas': {
    title: pageTitle('Trilhas e quiz católico'),
    description:
      'Aprenda sobre a fé de um jeito leve: trilhas sobre a Missa, os sacramentos, Maria e a Bíblia, uma etapa por dia, e quiz católico do fácil ao desafio final.',
  },
  '/home/canticos': {
    title: pageTitle('Cânticos da Missa: catálogo por momento'),
    description:
      'Cânticos para cada momento da Missa e tempo litúrgico, com a letra e a tradução de hinos como Salve Regina, Adoro te devote, Te Deum e Veni Creator.',
  },
  '/comunidade': {
    title: pageTitle('Mural de intenções e pedidos de oração'),
    description:
      'Deixe o seu pedido de oração e reze pelos pedidos de outras pessoas. Veja quantos rezaram o terço hoje e as novenas em grupo, sem identificar ninguém.',
  },
  // Com a Jornada desligada (VITE_JORNADA), /jornada é só um aviso de "em breve". Nos dois casos, fora dos buscadores.
  '/jornada': JORNADA_ATIVA
    ? {
        title: pageTitle('Jornada: seu caminho de oração'),
        description: 'Seu progresso pessoal: dias de oração, novenas, coleção de santos e milagres visitados. Fica só no seu aparelho.',
        noindex: true,
      }
    : {
        title: pageTitle('Jornada: em breve'),
        description: 'Em breve: um caminho de oração para acompanhar os seus dias.',
        noindex: true,
      },
  '/creditos': {
    title: pageTitle('Créditos das imagens e dos cânticos'),
    description:
      'Autores, fontes e licenças das imagens de santos e de Nossa Senhora e dos textos dos cânticos usados no Oratio Daily, com links para as obras originais.',
  },
  '/privacidade': {
    title: pageTitle('Política de Privacidade'),
    description:
      'Saiba quais dados o Oratio Daily trata, por que trata, com quais serviços compartilha e quais são os seus direitos como titular de dados pela LGPD.',
  },
};

export function metaFor(rawPathname) {
  // O React Router aceita "/home/leituras/" como "/home/leituras".
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, '') : rawPathname;
  if (PAGE_META[pathname]) return PAGE_META[pathname];

  const saintMatch = pathname.match(/^\/home\/santos\/([^/]+)$/);
  if (saintMatch) {
    const saint = getSaint(saintMatch[1]);
    if (!saint) return NOT_FOUND_META;
    return {
      title: pageTitle(`${saint.name}: história e oração`, saint.name),
      description: clampDescription(
        `Conheça ${saint.name} (${saint.title}): a história, a data da festa, do que é padroeiro e a oração para pedir a sua intercessão.`,
        'Reze com o Oratio.',
      ),
    };
  }

  const canticoMatch = pathname.match(/^\/home\/canticos\/([^/]+)$/);
  if (canticoMatch) {
    const cantico = getCantico(canticoMatch[1]);
    // Só os cânticos com letra publicada têm página.
    if (!cantico || !hasPage(cantico)) return NOT_FOUND_META;
    const about = cantico.subtitle ? `${cantico.title} (${cantico.subtitle})` : cantico.title;
    return {
      title: pageTitle(`${cantico.title}: ${cantico.translation ? 'letra e tradução' : 'letra'}`, cantico.title),
      description: clampDescription(
        cantico.translation
          ? `${about}: letra original com tradução, o momento da Missa em que se canta, a origem e a fonte do cântico.`
          : `${about}: letra completa, o momento da Missa em que se canta, a origem e a fonte deste cântico.`,
        'Cante e reze com o Oratio.',
      ),
    };
  }

  if (/^\/home\/misterio\/foco\//.test(pathname)) return PAGE_META['/home/oracoes'];

  const novenaMatch = pathname.match(/^\/home\/novenas\/([^/]+)$/);
  if (novenaMatch) {
    const novena = getNovena(novenaMatch[1]);
    if (!novena) return NOT_FOUND_META;
    return {
      title: pageTitle(novena.title),
      description: clampDescription(`${novena.intro} Um tema e uma oração para cada um dos nove dias.`),
    };
  }

  if (pathname === '/home/quiz/aleatorio') {
    return { title: pageTitle('Quiz católico: desafio aleatório'), description: QUIZ_DESCRIPTION };
  }

  const trailQuizMatch = pathname.match(/^\/home\/trilhas\/([^/]+)\/quiz\/(\d)$/);
  if (trailQuizMatch) {
    const trail = getTrail(trailQuizMatch[1]);
    if (!trail) return NOT_FOUND_META;
    return { title: pageTitle(`Quiz: ${trail.title}`, 'Quiz católico'), description: QUIZ_DESCRIPTION };
  }

  const trailMatch = pathname.match(/^\/home\/trilhas\/([^/]+)$/);
  if (trailMatch) {
    const trail = getTrail(trailMatch[1]);
    if (!trail) return NOT_FOUND_META;
    return {
      title: pageTitle(`Trilha: ${trail.title}`, trail.title),
      description: clampDescription(
        `${trail.intro} Uma etapa por dia, com quiz para fixar o que aprendeu.`,
        'Comece agora, é grátis.',
      ),
    };
  }

  // Rota inexistente: o servidor responde 200 (é um SPA), então avisamos os
  // buscadores para não indexar a página de erro.
  return NOT_FOUND_META;
}

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Atualiza título, descrição, Open Graph e URL canônica a cada troca de página. */
export default function usePageMeta(pathname) {
  useEffect(() => {
    const { title, description, noindex } = metaFor(pathname);
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('link[rel="canonical"]', 'href', url);

    let robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex');
    } else if (robots) {
      robots.remove();
    }
  }, [pathname]);
}
