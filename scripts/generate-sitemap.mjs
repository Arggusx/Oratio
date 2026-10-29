// Gera public/sitemap.xml antes de cada build (npm run build chama este script).
// As páginas de santos vêm de src/data/saints.js, então um santo novo entra sozinho.
import { writeFileSync } from 'node:fs';
import { saints } from '../src/data/saints.js';
import { novenas } from '../src/data/novenas.js';

const SITE_URL = 'https://oratio-daily-dev.vercel.app';
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/home/leituras', changefreq: 'daily', priority: '0.9' },
  { path: '/home/oracoes', changefreq: 'weekly', priority: '0.9' },
  { path: '/home/misterio', changefreq: 'monthly', priority: '0.8' },
  { path: '/home/calendario', changefreq: 'monthly', priority: '0.8' },
  { path: '/home/santos', changefreq: 'weekly', priority: '0.8' },
  ...saints.map((s) => ({ path: `/home/santos/${s.slug}`, changefreq: 'monthly', priority: '0.7' })),
  { path: '/home/escola-da-fe', changefreq: 'weekly', priority: '0.7' },
  { path: '/home/confissao', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/novenas', changefreq: 'monthly', priority: '0.7' },
  ...novenas.map((n) => ({ path: `/home/novenas/${n.id}`, changefreq: 'yearly', priority: '0.6' })),
  { path: '/home/escola-da-fe?secao=missa', changefreq: 'monthly', priority: '0.6' },
  { path: '/home/escola-da-fe?secao=simbolos', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacidade', changefreq: 'yearly', priority: '0.2' },
  { path: '/creditos', changefreq: 'yearly', priority: '0.2' },
];

const escapeXml = (text) => text.replace(/&/g, '&amp;');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${escapeXml(SITE_URL + p.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml gerado com ${pages.length} páginas.`);
