// Roda depois do build (npm run build chama este script).
// Para cada rota do sitemap, copia dist/index.html para dist/<rota>/index.html
// trocando título, descrição, Open Graph e canonical pelos da página.
// Assim, quem não roda JavaScript (prévia do WhatsApp, redes sociais e alguns
// buscadores) vê os dados certos de cada página. O SPA continua o mesmo: o
// React assume a página normalmente depois que o JavaScript carrega.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const dist = new URL('../dist/', import.meta.url);

// O usePageMeta.js usa imports sem extensão (estilo Vite), então carregamos pelo próprio Vite.
const vite = await createServer({
  configFile: false,
  root: fileURLToPath(new URL('..', import.meta.url)),
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const { metaFor, SITE_URL } = await vite.ssrLoadModule('/src/utils/usePageMeta.js');

  const template = readFileSync(new URL('index.html', dist), 'utf8');
  const sitemap = readFileSync(new URL('sitemap.xml', dist), 'utf8');

  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1].replace(/&amp;/g, '&')))
    .filter((u) => !u.search) // ?secao=... é a mesma página, já gerada sem a query
    .map((u) => u.pathname)
    .filter((p) => p !== '/'); // a página inicial já é o próprio dist/index.html

  const escapeAttr = (text) =>
    String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapeText = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Troca o atributo de uma tag do <head>; se a tag não existir, o build falha
  // (melhor descobrir aqui do que publicar páginas com os dados da inicial).
  function replaceTag(html, pattern, attr, value) {
    let found = false;
    const out = html.replace(pattern, (tag) => {
      found = true;
      return tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${escapeAttr(value)}"`);
    });
    if (!found) throw new Error(`Tag não encontrada no dist/index.html: ${pattern}`);
    return out;
  }

  const seen = new Set();
  for (const path of paths) {
    if (seen.has(path)) continue;
    seen.add(path);

    const { title, description, noindex } = metaFor(path);
    const url = `${SITE_URL}${path}`;

    let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(title)}</title>`);
    html = replaceTag(html, /<meta name="description"[^>]*>/, 'content', description);
    html = replaceTag(html, /<meta property="og:title"[^>]*>/, 'content', title);
    html = replaceTag(html, /<meta property="og:description"[^>]*>/, 'content', description);
    html = replaceTag(html, /<meta property="og:url"[^>]*>/, 'content', url);
    html = replaceTag(html, /<link rel="canonical"[^>]*>/, 'href', url);
    if (noindex) html = html.replace('</head>', '  <meta name="robots" content="noindex" />\n</head>');

    const dir = new URL(`.${path}/`, dist);
    mkdirSync(dir, { recursive: true });
    writeFileSync(new URL('index.html', dir), html);
  }

  console.log(`HTML com título e descrição próprios gerado para ${seen.size} páginas.`);
} finally {
  await vite.close();
}
