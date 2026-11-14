import { Link } from 'react-router-dom';
import { JORNADA_ATIVA } from '../utils/features';

// Canal de contato do responsável pelo site (exigido pela LGPD, art. 41).
const CONTACT_EMAIL = 'dougclasher9@gmail.com';
const LAST_UPDATE = '6 de novembro de 2026';

export default function Privacidade() {
  return (
    <main className="page privacy-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Transparência</span>
          <h1 className="section-title">Política de Privacidade</h1>
        </div>
      </div>
      <p className="lead">
        O Oratio é um site de oração e não exige cadastro: a conta com Google é opcional. Esta página explica, de forma simples, quais dados podem
        ser tratados quando você o usa, por quê e quais são os seus direitos, conforme a Lei Geral de Proteção de
        Dados (Lei nº 13.709/2018 — LGPD).
      </p>
      <p className="privacy-updated">Última atualização: {LAST_UPDATE}</p>

      <section>
        <h2>1. Quem é o responsável</h2>
        <p>
          O Oratio é mantido por Douglas (Arggusx), que é o controlador dos dados tratados pelo site. Para qualquer
          dúvida ou pedido sobre seus dados, escreva para{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>2. Quais dados são tratados</h2>

        <h3>Formulário de feedback</h3>
        <p>
          Quando você envia uma mensagem pelo botão <strong>Feedback</strong> (relato de erro, sugestão ou ideia),
          recebemos o tipo de mensagem, o texto que você escreveu (e qualquer dado que decidir incluir nele), o
          endereço da página do site em que você estava e, <strong>somente se você informar</strong>, o seu e-mail,
          usado apenas para responder. O envio é feito pelo serviço <strong>Formspree</strong>, que
          também pode registrar dados técnicos, como endereço IP e navegador, para entregar a mensagem e filtrar
          spam. Usamos as mensagens apenas para melhorar o site. A base legal é o seu consentimento, dado ao enviar
          (LGPD, art. 7º, I). Não peça nem envie dados sensíveis pelo formulário.
        </p>

        <h3>Dados guardados no seu próprio aparelho</h3>
        <p>
          O site guarda algumas preferências no armazenamento local do seu navegador (<em>localStorage</em>): o tema
          claro ou escuro, a data em que você recomeçou a leitura diária, cópias das leituras já carregadas, para
          abrir mais rápido, e{' '}
          {JORNADA_ATIVA ? (
            <>
              o progresso da <strong>Jornada</strong> (dias de oração, novenas, trilhas, coleção, mapa, buquês
              espirituais, respostas dos quizzes e, se você escolher, o nome e a foto do medalhão)
            </>
          ) : (
            <>o seu progresso (dias de terço marcados, novenas, trilhas e respostas dos quizzes)</>
          )}
          . Sem conta, essas informações <strong>ficam apenas no seu
          aparelho</strong> e não são enviadas para nós. Você pode apagá-las a qualquer momento limpando os dados do site nas configurações do navegador.
        </p>
        {JORNADA_ATIVA && (
          <p>
            A <strong>foto do medalhão</strong> é opcional. Ela é recortada e reduzida no próprio aparelho e nunca sai
            dele: não é enviada para nós nem para ninguém. Para apagá-la, toque em “Remover foto” na Jornada.
          </p>
        )}

        <h3>Conta com Google (opcional)</h3>
        {JORNADA_ATIVA ? (
          <p>
            Se você escolher <strong>entrar com Google</strong> na Jornada, recebemos do Google o identificador da sua
            conta, o seu e-mail e o primeiro nome, e guardamos uma cópia do progresso da Jornada para que ele fique igual
            em todos os seus aparelhos. A <strong>foto do medalhão não vai para a conta</strong>: continua só no aparelho.
            Não recebemos a sua senha do Google. A base legal é o seu consentimento, dado ao entrar (LGPD, art. 7º, I). Você
            pode sair ou <strong>apagar a conta</strong> a qualquer momento na própria Jornada; apagar a conta apaga o
            progresso guardado nela.
          </p>
        ) : (
          <p>
            Se você <strong>entrou com Google</strong>, recebemos do Google o identificador da sua conta, o seu e-mail e o
            primeiro nome, e guardamos uma cópia do seu progresso para que ele fique igual em todos os seus aparelhos.
            Não recebemos a sua senha do Google. A base legal é o seu consentimento, dado ao entrar (LGPD, art. 7º, I).
            Para <strong>apagar a conta</strong> e o progresso guardado nela, escreva para{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        )}

        <h3>Mensagens por e-mail (opcional)</h3>
        <p>
          Quem tem conta pode pedir para receber a Palavra do dia por e-mail, às 6h. Usamos o seu e-mail só para isso, e
          o envio é feito pelo serviço <strong>Resend</strong>. Para parar,{' '}
          {JORNADA_ATIVA ? 'desmarque a opção na Jornada ou use o link' : 'use o link'} que vem em toda mensagem.
        </p>

        <h3>Registros técnicos de acesso</h3>
        <p>
          Como qualquer site, o Oratio é hospedado num provedor (Vercel), que registra automaticamente dados de
          acesso, como endereço IP, data e hora e a página acessada, para manter o serviço funcionando e seguro. O
          mesmo vale para a nossa API de leituras, também hospedada na Vercel.
        </p>

        <h3>Comunidade</h3>
        <p>
          Para mostrar números como “hoje, 342 pessoas rezaram o terço” e “1.240 pessoas estão fazendo esta novena”,
          quando você marca um terço ou um dia de novena o site envia à nossa API só o tipo da marcação e um código
          aleatório criado no seu aparelho. Esse código não contém nenhum dado seu, e a API guarda apenas uma versão
          embaralhada dele (hash com chave secreta). O endereço IP também só é guardado embaralhado, com uma chave que
          muda todo dia, para limitar envios abusivos.
        </p>
        <p>
          No <strong>mural de intenções</strong>, o pedido e o primeiro nome (opcional) que você escrever ficam
          <strong> públicos</strong> por 30 dias. Não escreva sobrenome, endereço, telefone ou detalhes que identifiquem
          alguém; links, e-mails e telefones são removidos automaticamente. Pedidos impróprios podem ser denunciados e
          saem do mural.
        </p>

        <h3>Estatísticas de visitas</h3>
        <p>
          Usamos o Vercel Web Analytics para saber quantas pessoas visitam o site e quais páginas são mais lidas. Ele
          não usa cookies e não identifica você: os dados são agregados e anônimos, sem guardar o endereço IP.
        </p>
      </section>

      <section>
        <h2>3. Serviços de terceiros</h2>
        <p>Para funcionar, o site se conecta a estes serviços, que recebem o endereço IP do seu aparelho:</p>
        <ul>
          <li><strong>Vercel</strong> — hospedagem do site e da API de leituras.</li>
          <li><strong>Google Fonts</strong> — fornece as fontes de texto usadas no site.</li>
          <li><strong>Formspree</strong> — envio do formulário de feedback (somente se você usá-lo).</li>
          <li><strong>Google</strong> — login da conta (somente se você entrar com Google).</li>
          <li><strong>Resend</strong> — envio das mensagens por e-mail (somente se você pedir).</li>
          <li><strong>Neon</strong> — banco de dados da nossa API, onde ficam a Comunidade e as contas.</li>
          <li>
            <strong>Cloudflare Turnstile</strong> — confirma que quem publica um pedido no mural da Comunidade não é
            um robô. Só é carregado na página da Comunidade e analisa sinais técnicos do navegador, sem cookies de
            rastreamento e sem quebra-cabeça.
          </li>
          <li>
            <strong>API de Liturgia</strong> (liturgia.up.railway.app) — fornece as leituras da liturgia diária, com
            conteúdo da Canção Nova.
          </li>
        </ul>
        <p>
          Alguns desses serviços ficam fora do Brasil (principalmente nos Estados Unidos), o que configura
          transferência internacional de dados, permitida pela LGPD (art. 33) quando necessária para prestar o
          serviço.
        </p>
      </section>

      <section>
        <h2>4. O que não fazemos</h2>
        <ul>
          <li>Não usamos cookies de rastreamento nem anúncios.</li>
          <li>Não vendemos nem compartilhamos seus dados para fins comerciais.</li>
          <li>Não exigimos cadastro e nunca pedimos senha nem dados de pagamento; a conta com Google é opcional.</li>
        </ul>
      </section>

      <section>
        <h2>5. Por quanto tempo guardamos</h2>
        <p>
          As mensagens do formulário de feedback são guardadas pelo tempo necessário para analisá-las, por no máximo
          12 meses, e depois apagadas. Os pedidos do mural deixam de aparecer depois de 30 dias e são apagados em
          até 12 meses; as marcações anônimas da Comunidade são mantidas só como contagem. Os dados da conta e o progresso guardado nela ficam até você apagar a conta. Os registros técnicos de acesso são mantidos pelos provedores de hospedagem
          conforme suas próprias políticas e as exigências legais.
        </p>
      </section>

      <section>
        <h2>6. Seus direitos</h2>
        <p>Pela LGPD (art. 18), você pode pedir, a qualquer momento:</p>
        <ul>
          <li>a confirmação de que tratamos dados seus e o acesso a eles;</li>
          <li>a correção de dados incompletos ou desatualizados;</li>
          <li>
            a exclusão das mensagens que você enviou e da sua conta
            {JORNADA_ATIVA && ' (o botão “Apagar conta” na Jornada faz isso na hora)'};
          </li>
          <li>informações sobre com quem os dados foram compartilhados;</li>
          <li>a revogação do seu consentimento.</li>
        </ul>
        <p>
          Para exercer esses direitos, escreva para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Responderemos
          em até 15 dias. Se não ficar satisfeito, você também pode procurar a Autoridade Nacional de Proteção de Dados
          (ANPD).
        </p>
      </section>

      <section>
        <h2>7. Mudanças nesta política</h2>
        <p>
          Se esta política mudar, a nova versão será publicada nesta página com a data de atualização. Voltar para o{' '}
          <Link to="/">início</Link>.
        </p>
      </section>
    </main>
  );
}
