import { useEffect } from 'react';
import { getSaint } from '../data/saints';

export const SITE_URL = 'https://oratio-daily-dev.vercel.app';

const DEFAULT_META = {
  title: 'Oratio Daily — Oração, Terço e Liturgia Diária',
  description:
    'Um refúgio diário para o silêncio, a contemplação dos mistérios e a Palavra que sustenta o caminho. Reze o terço, leia a liturgia e aprofunde sua fé.',
};

const NOT_FOUND_META = {
  title: 'Página não encontrada — Oratio',
  description: 'O endereço pode ter mudado ou sido digitado errado.',
  noindex: true,
};

const PAGE_META = {
  '/': DEFAULT_META,
  '/home/misterio': {
    title: 'Mistérios do Terço para cada dia — Oratio',
    description: 'Mistérios gozosos, luminosos, dolorosos e gloriosos: quando rezar cada um e o que contemplar em cada dezena.',
  },
  '/home/leituras': {
    title: 'Liturgia Diária e Evangelho do Dia — Oratio',
    description: 'Primeira leitura, salmo com refrão, segunda leitura, Evangelho e homilia do dia, com as respostas da Missa.',
  },
  '/home/oracoes': {
    title: 'Como rezar o terço e orações católicas — Oratio',
    description: 'Roteiro passo a passo do terço tradicional e do rosário nórdico, Oração de São Bento e orações por intenção e momento do dia.',
  },
  '/home/calendario': {
    title: 'Calendário Católico: dias santos, festas e feriados — Oratio',
    description: 'Domingos e dias santos de preceito, solenidades, festas de santos e feriados nacionais do Brasil, com busca por nome.',
  },
  '/home/santos': {
    title: 'Santos e orações por intenção — Oratio',
    description: 'História, data da festa e orações de santos como São Bento, São Rafael, Santo Antônio, Santa Rita e São Judas Tadeu.',
  },
  '/home/escola-da-fe': {
    title: 'Escola da Fé: dúvidas, Missa, símbolos e santos — Oratio',
    description: 'Respostas sobre a fé católica, o que fazer na Missa, símbolos cristãos, milagres eucarísticos, os títulos de Nossa Senhora e a vida dos santos.',
  },
  '/home/confissao': {
    title: 'Exame de consciência para a confissão — Oratio',
    description: 'Roteiro para se confessar: perguntas pelos Dez Mandamentos e preceitos da Igreja, lista para marcar, como se confessar e Ato de Contrição.',
  },
  '/creditos': {
    title: 'Créditos das imagens — Oratio',
    description: 'Autores e licenças das pinturas, ícones e fotografias de santos e de Nossa Senhora usadas no Oratio.',
  },
  '/privacidade': {
    title: 'Política de Privacidade — Oratio',
    description: 'Quais dados o Oratio trata, por quê e quais são os seus direitos pela LGPD.',
  },
};

function metaFor(rawPathname) {
  // O React Router aceita "/home/leituras/" como "/home/leituras".
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, '') : rawPathname;
  if (PAGE_META[pathname]) return PAGE_META[pathname];

  const saintMatch = pathname.match(/^\/home\/santos\/([^/]+)$/);
  if (saintMatch) {
    const saint = getSaint(saintMatch[1]);
    if (!saint) return NOT_FOUND_META;
    return {
      title: `${saint.name}: história e orações — Oratio`,
      description: `${saint.name} (${saint.title}). Biografia, data da festa, do que é padroeiro e orações para pedir sua intercessão.`,
    };
  }

  if (/^\/home\/misterio\/foco\/[^/]+\/[^/]+$/.test(pathname)) {
    return { title: 'Rezar o mistério em modo foco — Oratio', description: DEFAULT_META.description };
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
