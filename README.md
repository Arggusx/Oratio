# Oratio

O **Oratio** é uma aplicação web católica para criar um momento diário de oração, leitura e contemplação. Ela reúne o terço guiado conta por conta, a liturgia do dia, leituras breves com interpretação, o calendário litúrgico, os santos, a Escola da Fé e a **Jornada**, um conjunto de jogos de oração que acompanham o caminho de cada pessoa sem ranking, pontos ou culpa.

O projeto é uma *single-page application* (SPA) em React: a navegação acontece no navegador, sem recarregar a página, com transições animadas para manter uma experiência calma e contínua. O conteúdo e a interface estão em português do Brasil, e nada exige cadastro.

## Para que serve

O site foi pensado como um refúgio digital para quem deseja:

- rezar o terço com um roteiro guiado, contando as Ave-Marias no próprio desenho do terço;
- consultar os mistérios de cada dia e acompanhar a liturgia e o Evangelho;
- fazer pausas breves de leitura bíblica, um trecho por vez;
- encontrar orações tradicionais por intenção e por momento do dia;
- preparar a confissão com um exame de consciência;
- aprender sobre a fé (Missa, símbolos, santos, títulos de Maria, milagres eucarísticos, hierarquia da Igreja);
- seguir um caminho de oração com novenas, trilhas de estudo e quizzes;
- rezar em comunhão com outras pessoas, de forma anônima.

## Visual

O estilo é "sagrado-minimalista": fundo creme, terracota como cor de ação e dourado como enfeite, títulos em Cormorant Garamond e texto em Inter.

- **Tokens de design** em `src/index.css` (`:root`): dois papéis de texto (`--color-text` e `--color-text-muted`; os nomes antigos `soft`, `pale`, `faint` e `light` apontam para o tom suave), um dourado só para texto (`--color-gold-text`, contraste de 6,5:1; o dourado claro fica para ícones e enfeites), três raios (12, 18 e 22 px, além da pílula) e `--control-height` de 48 px para os botões.
- **Botões**: `.btn` (cheio, terracota), `.btn-secondary` (contornado) e `.btn-ghost`. "Marcar terço de hoje" é um botão cheio que vira um selo dourado depois de marcado; dentro de listas (novenas, intenções, missões) ele fica contornado.
- **Modo escuro** em tons quentes. Na primeira visita segue o sistema; a escolha fica salva (`oratio:tema`) e é aplicada antes da primeira pintura por `public/theme-init.js`, para a tela não piscar em claro.
- **Temas do ano litúrgico**: `useSeasonTheme` define `<html data-season="...">` (Advento, Natal, Quaresma, Tríduo, Páscoa, Pentecostes ou Tempo Comum), e o CSS troca a cor de destaque, os brilhos do fundo e os enfeites da página inicial. Para pré-visualizar outro tempo, use `?tempo=natal` (vale até fechar a aba) e `?tempo=auto` para voltar ao calendário.
- **Cabeçalho**: marca, a etiqueta do **tempo litúrgico de hoje** na cor do dia (leva ao calendário; no celular aparece o nome curto, como "Comum"), o atalho da Escola da Fé no celular e o botão de tema.
- **Barra inferior no celular** com cinco itens e o **Terço no centro**, num círculo em destaque: Início, Leituras, Terço, Calendário e Jornada. No computador, os links ficam no topo.
- Listas de cartões são sempre centralizadas, inclusive a última linha; listas longas mostram poucos itens e um botão "Ver mais"; no celular, listas de cartões paralelos rolam na horizontal.
- Animações em SVG (pomba, velas, sino, anjo, terço que se monta) respeitam `prefers-reduced-motion`.

## Funcionalidades

### Início

- **Terço de hoje**: a foto do terço vira um cartão com o mistério do dia por cima ("Terço de hoje · ~20 min", por exemplo "Mistérios Gloriosos") e o botão "Começar a rezar".
- **Para hoje**: lista curta com o terço (riscado quando já foi marcado na Jornada), a leitura do dia e, quando houver, o santo do dia. A lista de santos é baixada à parte, para não pesar na página inicial.
- **Oração para agora**: a oração do momento do dia (manhã, Ângelus ou Regina Caeli, tarde, noite, antes de dormir) escrita por uma pena.
- **A Palavra em Três Momentos**: leituras contemplativas, sem o Evangelho, em três trechos (Antigo Testamento, Poesia e Sabedoria, Cartas e Epístolas), mostrados **um por vez, no mesmo lugar**. As abas no topo trocam o trecho e acendem conforme a leitura avança; o cartão tem o texto inteiro (só os muito longos abrem no "Ler mais"), a interpretação recolhível, "Copiar", "Anterior" e "Próximo: …". No último trecho aparece uma mensagem de fim da leitura.
- É possível voltar a dias anteriores (nunca a dias futuros) e recomeçar a leitura do início (Gênesis 1, Jó 1 e Romanos 1) no próprio ritmo; o ponto de recomeço fica salvo no navegador (`oratio:leitura-inicio`). Há um atalho para o Evangelho do dia na página de Liturgia.

### Terço e Orações

A página **Terço e Orações** tem quatro abas (`?secao=terco`, `nordico`, `oracoes`, `confissao`):

1. **Terço Tradicional**: escolha do grupo de mistérios (o do dia vem marcado) e um **terço interativo**. O desenho se monta ao aparecer; tocar numa parte (cruz, contas, medalha) mostra ao lado o que rezar ali, e "Anterior"/"Próximo" percorrem os 8 passos na ordem da oração.
   - **No passo das dezenas, o próprio terço vira o contador**: as contas da dezena da vez ficam destacadas e acendem uma a uma, na cor do mistério. Ao lado aparecem "1ª dezena de 5", o mistério e a meditação, o Pai-Nosso antes de começar, a Ave-Maria com a cláusula do mistério, o Glória e a Jaculatória no fim, o contador "3 de 10" e o botão "Rezei a Ave-Maria", que vira "Próxima dezena" e, depois da quinta, "Ir para o encerramento".
   - Abaixo, o roteiro passo a passo em texto, o botão "Marcar terço de hoje", as orações opcionais para depois do terço e a imagem com a posição das contas.
2. **Terço Nórdico (das Cláusulas)**: roteiro completo de cada conjunto de mistérios; em cada Ave-Maria, a cláusula meditativa entra depois do nome de Jesus.
3. **Orações**: catálogo pesquisável e filtrável por categoria, por **intenção** ("Para que você quer rezar?") e por **momento do dia**; inclui a Oração de São Bento em português e latim.
4. **Confissão**: exame de consciência pelos Dez Mandamentos e pelos preceitos da Igreja, os sete pecados capitais, o passo a passo de como se confessar e o Ato de Contrição. A lista marcada fica só na tela e não é salva.

O antigo modo foco (`/home/misterio/foco/...`) foi incorporado ao terço interativo; o endereço leva a esta página.

### Mistérios do Rosário

A página **Mistérios** lista os cinco mistérios de cada conjunto e os dias em que são rezados:

| Conjunto | Dias indicados |
| --- | --- |
| Gozosos | Segundas e sábados; domingos do Advento |
| Luminosos | Quintas-feiras |
| Dolorosos | Terças e sextas; domingos da Quaresma |
| Gloriosos | Quartas e domingos |

Os dados ficam em `src/data/mysteries.js` (nome, meditação, cor e cláusula do Terço Nórdico). Os nomes dos quatro grupos, usados na página inicial, estão em `src/data/mysteryTitles.js`.

### Liturgia diária

A página **Leituras** busca a liturgia numa fonte externa e mostra, conforme a disponibilidade, a primeira leitura, o salmo com refrão, a segunda leitura, o Evangelho, as respostas da Missa e uma homilia/reflexão (com aviso quando a homilia é de um dia anterior). A cor da interface acompanha a cor litúrgica. O botão **Modo foco** abre a leitura em tela inteira. Se uma integração falhar, aparecem leituras e reflexões de contingência.

### Calendário Católico

O ano inteiro com domingos de preceito, dias santos de guarda (normas da CNBB), celebrações litúrgicas, festas de santos e feriados nacionais. A legenda funciona como filtro, há busca por nome, o **anel do ano litúrgico** mostra o intervalo de datas de cada tempo e o ciclo de leituras atual (A, B ou C) fica em destaque. As datas móveis são calculadas a partir da Páscoa em `src/utils/liturgicalCalendar.js`, que também define o tempo litúrgico, o mistério do dia e quando o Aleluia é omitido.

### Escola da Fé

Quatro seções (`?secao=curiosidades`, `missa`, `simbolos`, `santos`):

- **Curiosidades**: perguntas frequentes pesquisáveis sobre sacramentos, história, liturgia, dogmas e tradições; **Quem é quem na Igreja** (do Papa aos leigos e a Igreja no Brasil); os **títulos de Nossa Senhora** explicados; e o catálogo de **milagres eucarísticos** pelo mundo.
- **Na Missa**: quando fazer a inclinação de cabeça, a inclinação profunda e a genuflexão, conforme a Instrução Geral do Missal Romano, com ícones ilustrados.
- **Símbolos**: 15 símbolos cristãos com imagem e citação bíblica.
- **Santos**: mais de 40 santos com biografia, festa, patronatos e orações (a principal e as por intenção). Cada um tem sua página em `/home/santos/:slug`.

Cada seção termina com um convite para a ilha do mesmo assunto nas Trilhas da fé, onde estão o estudo e os quizzes.

### Jornada

> A Jornada só aparece quando o build é feito com `VITE_JORNADA=true` (veja [Jornada ligada ou desligada](#jornada-ligada-ou-desligada)). Na produção ela fica desligada; no hml, ligada.

A **Jornada** (`/jornada`) guarda o caminho de oração **só neste aparelho** (`localStorage`, chave `oratio:jornada`); nada vai para servidor. Os princípios: sem pontos, ranking, selos de quantidade nem culpa por dias perdidos.

- **Painel**: medalhão do peregrino (saudação, nome opcional, foto opcional reduzida para 256×256 no próprio aparelho e moldura animada em SVG, ganha ao concluir uma ilha), "Continue de onde parou", "Para hoje" e prateleiras com os jogos.
- **Caminho de oração**: as semanas de terço marcadas; em cada semana, um dia sem oração é coberto por uma "graça", para faltar um dia não apagar o caminho.
- **Missões e Novenas** (`/home/novenas`): novenas ao Espírito Santo, de Natal, a Nossa Senhora Aparecida e a Santo Antônio, com nove contas que acendem.
- **Buquê espiritual**: um buquê de orações oferecido a alguém, enviado como imagem.
- **Trilhas da fé** (`/home/trilhas`): ilhas flutuantes em ziguezague (Conheça a Missa, Os 4 dogmas de Maria, Os 7 sacramentos, Conheça a Bíblia, Amigos de Deus: os santos, Os sinais da fé). A primeira parada traz o estudo do caminho inteiro, e as seguintes têm quizzes cada vez mais difíceis.
- **Desafio aleatório** (`/home/quiz/aleatorio`): perguntas de todos os temas, com cinco alternativas, num banco de 126 perguntas.
- **Santos do ano**: a coleção de santos, que completa uma rosácea mês a mês.
- **Mapa dos milagres**: o mundo inteiro desenhado, com os milagres eucarísticos visitados e um atalho para o catálogo.
- **Passaporte do Peregrino**: como a credencial do Caminho de Santiago, ganha um carimbo a cada ilha concluída, e cada carimbo libera uma moldura para o medalhão.

### Comunidade

A página **Comunidade** (`/comunidade`) mostra quantas pessoas rezaram o terço hoje, as novenas feitas em grupo, metas e um mural de intenções. O aparelho manda só um código aleatório (`oratio:anon`), que a API guarda embaralhado. Se a API falhar, a parte da comunidade some e o resto do site segue normal.

### Feedback e privacidade

O botão flutuante **Feedback** abre um formulário enviado pelo Formspree. A **Política de Privacidade** (`/privacidade`, LGPD) explica o que fica no aparelho (tema, Jornada, foto do medalhão, leitura) e o uso do Vercel Web Analytics.

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Início: terço de hoje, Para hoje, oração para agora e leitura em três trechos |
| `/home/oracoes` | Terço interativo, Terço Nórdico, orações e confissão (`?secao=`) |
| `/home/misterio` | Os quatro grupos de mistérios |
| `/home/leituras` | Liturgia diária, Evangelho e homilia |
| `/home/calendario` | Calendário católico do ano, com filtros e busca |
| `/home/escola-da-fe` | Escola da Fé (`?secao=curiosidades`, `missa`, `simbolos`, `santos`); `/home/curiosidades` redireciona para cá |
| `/home/santos/:slug` | Página de um santo |
| `/home/confissao` | Exame de consciência |
| `/jornada` | Jornada (painel e jogos, `?secao=`); só existe com `VITE_JORNADA=true`, senão dá página não encontrada |
| `/home/novenas` e `/home/novenas/:id` | Novenas |
| `/home/trilhas` e `/home/trilhas/:id` | Trilhas da fé |
| `/home/trilhas/:id/quiz/:level` | Quiz de uma ilha |
| `/home/quiz/aleatorio` | Desafio aleatório |
| `/comunidade` | Comunidade |
| `/privacidade` | Política de Privacidade (LGPD) |
| `/creditos` | Créditos das imagens |
| `/home/misterio/foco/*` | Antigo modo foco; redireciona para `/home/oracoes` |

## Tecnologias

- [React 19](https://react.dev/) para a interface;
- [Vite](https://vite.dev/) para desenvolvimento e build;
- [React Router](https://reactrouter.com/) para as rotas no cliente (páginas carregadas sob demanda com `lazy`);
- [Framer Motion](https://www.framer.com/motion/) para animações e transições;
- [Lucide React](https://lucide.dev/) para ícones;
- [Vercel Web Analytics](https://vercel.com/docs/analytics);
- CSS próprio dividido por área em `src/styles/` (tokens e base, cada página, Jornada, modo escuro, animações e temas litúrgicos); `src/index.css` só importa esses arquivos, na ordem da cascata.

## Estrutura do projeto

```text
.
├── public/
│   ├── fontes/              # Fontes locais
│   ├── img2/                # Ícones e imagens do site
│   ├── theme-init.js        # Aplica o tema salvo antes da primeira pintura
│   ├── llms.txt, robots.txt # Descrição para buscadores e IAs
│   └── sitemap.xml          # Gerado no build
├── scripts/
│   └── generate-sitemap.mjs # Gera o sitemap (roda antes de npm run build)
├── src/
│   ├── components/          # Cabeçalho, barra inferior, terço interativo, leitura, blocos reutilizáveis
│   │   ├── anim/            # Animações em SVG
│   │   └── journey/         # Jogos da Jornada
│   ├── data/                # Mistérios, orações, santos, novenas, trilhas, quizzes, milagres...
│   ├── pages/               # Páginas associadas às rotas
│   ├── utils/               # Calendário litúrgico, Jornada, comunidade, tema litúrgico, SEO
│   ├── App.jsx              # Rotas e animação entre páginas
│   ├── styles/              # CSS por área (base, páginas, Jornada, modo escuro, animações)
│   ├── index.css            # Importa os arquivos de styles/ na ordem da cascata
│   └── main.jsx             # Ponto de entrada React
├── index.html               # Metadados e carregamento da aplicação
├── vercel.json              # Reescrita de rotas para a SPA
└── package.json             # Dependências e comandos
```

## Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior (recomenda-se uma versão LTS);
- npm, que acompanha o Node.js.

### Instalação e execução

```bash
npm install
npm run dev
```

O Vite mostra no terminal o endereço local, normalmente `http://localhost:5173`.

### Outros comandos

```bash
# Gera o sitemap e os arquivos de produção em dist/
npm run build

# Gera só o sitemap
npm run sitemap

# Confere regras de lint
npm run lint

# Serve localmente o build de produção
npm run preview
```

O gerador do sitemap roda no Node e importa arquivos de `src/data/`. Por isso, os imports entre esses arquivos precisam ter a extensão `.js` (por exemplo, `import { LEVELS } from './quizLevels.js'`); sem ela o Vite funciona, mas o `npm run build` falha.

## Integrações e configuração

O front-end consome as seguintes fontes:

| Recurso | Endereço padrão | Uso |
| --- | --- | --- |
| Leitura diária em três trechos | `https://daily-prayer-api.vercel.app/api/daily-reading` | Página inicial |
| Versículo do dia | `https://daily-prayer-api.vercel.app/api/verse-of-the-day` | Componente `VerseOfTheDay` |
| Reflexão do dia | `https://daily-prayer-api.vercel.app/api/daily-reflection` | Página de Liturgia |
| Homilia do dia | `https://daily-prayer-api.vercel.app/api/daily-homily` | Página de Liturgia |
| Comunidade | `https://daily-prayer-api.vercel.app/api/community` | Comunidade e contadores |
| Liturgia | `https://liturgia.up.railway.app/v2/` | Leituras, salmo e Evangelho |
| Feedback | Formspree (`https://formspree.io/f/mqapqejd`) | Formulário flutuante |

Para direcionar as chamadas da `daily-prayer-api` a outro serviço, crie um arquivo `.env.local` na raiz:

```env
VITE_API_ORACAO=https://seu-dominio-de-api.example
```

O valor é a URL-base, sem os caminhos `/api/...`. Em desenvolvimento, a página de Liturgia também tenta `http://localhost:3000` para buscar a reflexão diária antes do serviço público. A API precisa liberar CORS para a origem do site; ao rodar o Vite numa porta diferente da 5173, a comunidade pode ficar indisponível localmente.

### Jornada ligada ou desligada

A Jornada (`/jornada`, o item dela na barra inferior e no topo, os atalhos "Ver na Jornada", "Guardar na coleção", "Marcar no meu mapa" e a janela de carimbo das trilhas) só entra no site quando a variável de build `VITE_JORNADA` vale `true`. Sem a variável, ou com qualquer outro valor, ela some: `/jornada` cai na página não encontrada, a Escola da Fé ocupa o quinto lugar da barra inferior e o código da Jornada nem vai para o pacote. O terço de hoje, as novenas, as trilhas e os quizzes continuam funcionando e guardando o progresso no aparelho.

A flag é lida em `src/utils/features.js` (`JORNADA_ATIVA`). Como é uma variável do Vite, vale no momento do build: depois de mudar o valor, é preciso fazer um novo deploy.

Na Vercel, em **Settings > Environment Variables** do projeto:

- no projeto (ou ambiente) do **hml**, crie `VITE_JORNADA` com o valor `true`;
- na **produção**, não crie a variável (ou deixe com outro valor).

Para testar localmente com a Jornada, ponha `VITE_JORNADA=true` no `.env.local`.

### Formato esperado das APIs

Os endpoints de leitura diária aceitam pequenas variações de nomes, mas o formato recomendado é:

```json
{
  "total_estimated_time": "5 a 10 min",
  "readings": [
    {
      "id": "at_historia",
      "titulo_categoria": "Antigo Testamento",
      "referencia": "Isaías 40:28-31",
      "tempo_estimado": "~3 min",
      "texto": "...",
      "reflexao": "..."
    }
  ]
}
```

Para a reflexão diária, use ao menos `title` e `content`. A aplicação também aceita `titulo`, `subject`, `texto`, `reflexao` e `message`. Se uma chamada falhar, entram conteúdos locais de contingência.

## Dados guardados no aparelho

| Chave | O que guarda |
| --- | --- |
| `oratio:tema` | Tema claro ou escuro escolhido |
| `oratio:jornada` | Progresso da Jornada (dias rezados, novenas, trilhas, quizzes, coleção, buquês, perfil e foto do medalhão) |
| `oratio:leitura-inicio` | Início da leitura pessoal, quando a pessoa recomeça do zero |
| `oratio:leitura-cache:*` | Leituras já baixadas |
| `oratio:anon` | Código aleatório e anônimo usado pela comunidade |
| `oratio:tempo-teste` | Pré-visualização de um tempo litúrgico (`sessionStorage`, só até fechar a aba) |

## Publicação

O `vercel.json` encaminha qualquer rota para `index.html`, porque as rotas são resolvidas pelo React Router no navegador; sem isso, abrir direto `/home/oracoes` daria 404.

Para publicar na Vercel:

1. Importe o repositório na Vercel.
2. Mantenha o preset de Vite.
3. Se usar uma API própria, cadastre `VITE_API_ORACAO` nas variáveis de ambiente. Para ligar a Jornada (só no hml), cadastre `VITE_JORNADA=true`.
4. Faça o deploy. O comando de build é `npm run build` (gera o sitemap e o build).

## Fluxo de branches

- `main`: o que está publicado.
- `develop`: onde as mudanças são testadas antes de irem para a `main`.
- Cada mudança vai numa branch própria (`feat/...`, `fix/...`, `docs/...`), mesclada na `develop` com `git merge --no-ff`. Depois de testada, a `develop` é mesclada na `main`.

## Observações de manutenção

- Mistérios em `src/data/mysteries.js`: alimentam a página de Mistérios, o Terço Nórdico e as dezenas do terço interativo.
- Passos do terço tradicional em `src/data/rosaryData.js`; o desenho e a contagem das dezenas ficam em `src/components/anim/RosaryExplorer.jsx`, com o formato do terço em `src/utils/rosaryShape.js`.
- Orações em `src/data/prayers.js`, santos e intenções em `src/data/saints.js`, novenas em `src/data/novenas.js`, trilhas em `src/data/trails.js` e perguntas em `src/data/quizBank.js` (níveis em `src/data/quizLevels.js`, separados para o banco de perguntas não entrar no pacote principal).
- A Jornada inteira passa por `src/utils/journeyStore.js`; se um dia houver login, é esse objeto que será sincronizado.
- Títulos e descrições de cada página (SEO) ficam em `src/utils/usePageMeta.js`.
- O componente `VerseOfTheDay` está pronto para o endpoint de versículo do dia, mas não aparece em nenhuma página hoje.

## Licença

Este repositório não declara uma licença. Antes de reutilizar ou redistribuir o código e os materiais visuais, defina uma licença apropriada e confirme as permissões dos conteúdos de terceiros.
