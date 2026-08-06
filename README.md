# Oratio 

O **Oratio** é uma aplicação web católica para criar um momento diário de oração, leitura e contemplação. Ela reúne o roteiro do Santo Terço, os mistérios do Rosário, a liturgia do dia, leituras breves com reflexões e uma área de dúvidas sobre a fé e as tradições da Igreja.

O projeto é uma *single-page application* (SPA) em React: a navegação acontece no navegador, sem recarregar a página, e as transições são animadas para manter uma experiência calma e contínua.

## Para que serve

O site foi pensado como um refúgio digital para quem deseja:

- rezar o terço com um roteiro guiado;
- consultar os mistérios apropriados para cada dia;
- acompanhar leituras e o Evangelho do dia;
- fazer pausas breves de leitura bíblica e meditação;
- encontrar orações tradicionais;
- esclarecer dúvidas frequentes sobre a fé católica;
- enviar sugestões por meio do formulário de feedback.

O conteúdo e a interface estão em português do Brasil.

## Funcionalidades

### Início

A página inicial apresenta o propósito do Oratio  e traz a seção **A Palavra em Três Momentos**. Ela organiza leituras contemplativas — sem o Evangelho — em três blocos: Antigo Testamento, Poesia e Sabedoria, e Cartas e Epístolas. Cada bloco pode exibir o texto completo, uma reflexão e um botão para copiar o trecho.

Há também um atalho para a página de Liturgia, onde o Evangelho do dia está disponível.

### Mistérios do Rosário

A página **Mistérios** lista os cinco mistérios de cada conjunto do Rosário e os dias em que são tradicionalmente rezados:

| Conjunto | Dias indicados |
| --- | --- |
| Gozosos | Segundas e sábados; domingos do Advento |
| Luminosos | Quintas-feiras |
| Dolorosos | Terças e sextas; domingos da Quaresma |
| Gloriosos | Quartas e domingos; Tempo Pascal |

Os dados ficam centralizados em `src/data/mysteries.js`, incluindo nome, texto de meditação, cor visual e cláusula usada no Rosário Nórdico.

### Terço e orações

A página **Terço e Orações** possui três áreas:

1. **Como rezar o terço** — guia em etapas, do sinal da cruz à Salve-Rainha, acompanhado de uma imagem explicativa.
2. **Rosário Nórdico (das Cláusulas)** — abre um roteiro completo para cada conjunto de mistérios. Em cada Ave-Maria, a cláusula meditativa correspondente é inserida após o nome de Jesus.
3. **Orações tradicionais** — catálogo pesquisável e filtrável por categorias: Diárias, Marianas, Santos e Sacramentais.

### Liturgia diária

A página **Leituras** busca a liturgia em uma fonte externa e mostra, conforme a disponibilidade, a primeira leitura, o salmo, a segunda leitura, o Evangelho e uma homilia/reflexão. A cor da interface acompanha a cor litúrgica recebida.

O botão **Modo foco** abre a leitura selecionada em uma sobreposição de tela inteira, para reduzir distrações.

Caso uma integração esteja indisponível, o site apresenta leituras e reflexões de contingência em vez de interromper a experiência.

### Central de conhecimento

A página **Curiosidades** funciona como uma FAQ. Ela permite pesquisar e filtrar perguntas sobre sacramentos, história da Igreja, símbolos e liturgia, dogmas e tradições.

### Navegação e feedback

O cabeçalho é responsivo: em telas pequenas, os links são apresentados em um menu lateral. O botão flutuante **Feedback** abre um formulário enviado pelo Formspree.

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Página inicial e leituras em três blocos |
| `/home/misterio` | Conjuntos e meditações dos mistérios |
| `/home/leituras` | Liturgia diária, Evangelho e homilia |
| `/home/oracoes` | Guia do terço, Rosário Nórdico e orações |
| `/home/curiosidades` | Perguntas e respostas sobre a fé católica |
| `/home/misterio/foco/:tipo/:id` | Modo guiado de um mistério (`tipo`: `gozosos`, `luminosos`, `dolorosos` ou `gloriosos`; `id`: 1 a 5) |

No modo guiado, cada mistério tem dez contas interativas. Ao avançar pelas dez Ave-Marias, a aplicação segue automaticamente para o próximo mistério; após o quinto, retorna à página de Mistérios.

## Tecnologias

- [React 19](https://react.dev/) para a interface;
- [Vite](https://vite.dev/) para desenvolvimento e geração do build;
- [React Router](https://reactrouter.com/) para rotas no cliente;
- [Framer Motion](https://www.framer.com/motion/) para animações e transições;
- [Lucide React](https://lucide.dev/) para ícones;
- CSS próprio em `src/index.css` para o visual responsivo;
- Vercel, configurada para servir a SPA corretamente em rotas diretas.

## Estrutura do projeto

```text
.
├── public/
│   ├── fontes/              # Fontes locais
│   └── img2/                # Ícones e imagens do site
├── src/
│   ├── components/          # Cabeçalho, rodapé, feedback e blocos reutilizáveis
│   ├── data/mysteries.js    # Dados dos quatro conjuntos de mistérios
│   ├── pages/               # Páginas associadas às rotas
│   ├── App.jsx              # Rotas e animação entre páginas
│   ├── index.css            # Estilos globais e responsividade
│   └── main.jsx             # Ponto de entrada React
├── index.html               # Metadados e carregamento da aplicação
├── vercel.json              # Reescrita de rotas para a SPA
└── package.json             # Dependências e comandos do projeto
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

O Vite exibirá no terminal o endereço local, normalmente `http://localhost:5173`.

### Outros comandos

```bash
# Gera os arquivos de produção em dist/
npm run build

# Confere regras de lint
npm run lint

# Serve localmente o build de produção
npm run preview
```

## Integrações e configuração

O front-end consome as seguintes fontes:

| Recurso | Endereço padrão | Uso |
| --- | --- | --- |
| Leitura diária em três blocos | `https://-prayer-api.vercel.app/api/-reading` | Página inicial |
| Versículo do dia | `https://-prayer-api.vercel.app/api/verse-of-the-day` | Componente `VerseOfTheDay` |
| Reflexão/homilia | `https://-prayer-api.vercel.app/api/-reflection` | Página de Liturgia |
| Liturgia | `https://liturgia.up.railway.app/v2/` | Leituras, salmo e Evangelho |
| Feedback | Formspree (`https://formspree.io/f/mqapqejd`) | Formulário flutuante |

Para direcionar as chamadas relacionadas à oração a outro serviço, crie um arquivo `.env.local` na raiz:

```env
VITE_API_ORACAO=https://seu-dominio-de-api.example
```

O valor deve ser a URL-base, sem os caminhos `/api/...`. Em desenvolvimento, a página de Liturgia também tenta `http://localhost:3000` para buscar a reflexão diária antes de usar o serviço público padrão.

### Formato esperado das APIs

Os endpoints de leitura diária são tolerantes a pequenas variações de nomes, mas o formato recomendado é:

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

Para a reflexão diária, use ao menos `title` e `content`. A aplicação também aceita os sinônimos `titulo`, `subject`, `texto`, `reflexao` e `message`.

Se uma chamada falhar, são usados conteúdos locais de fallback. Assim, a navegação e a leitura continuam funcionando mesmo sem conexão com essas APIs.

## Publicação

O arquivo `vercel.json` encaminha qualquer rota para `index.html`. Isso é necessário porque as rotas são resolvidas pelo React Router no navegador; sem essa regra, acessar diretamente uma URL como `/home/oracoes` poderia retornar 404 no servidor.

Para publicar na Vercel:

1. Importe o repositório na Vercel.
2. Mantenha o preset de Vite.
3. Caso use uma API própria, cadastre `VITE_API_ORACAO` nas variáveis de ambiente do projeto.
4. Faça o deploy. O comando de build é `npm run build`.

## Observações de manutenção

- Adicione ou edite mistérios em `src/data/mysteries.js` para que as páginas de Mistérios, Terço e Modo Foco permaneçam sincronizadas.
- Os textos de orações e perguntas frequentes estão diretamente em `src/pages/Oracoes.jsx` e `src/pages/Curiosidades.jsx`.
- Não há backend local em execução neste repositório, embora `axios`, `express` e `cors` constem como dependências. As funcionalidades atuais dependem de APIs externas ou de dados de contingência no front-end.
- O componente `VerseOfTheDay` existe no projeto e está preparado para consumir o endpoint de versículo do dia; verifique sua inclusão em uma página caso queira expô-lo na interface atual.

## Licença

Este repositório não declara uma licença. Antes de reutilizar ou redistribuir o código e os materiais visuais, defina uma licença apropriada e confirme as permissões dos conteúdos de terceiros.
