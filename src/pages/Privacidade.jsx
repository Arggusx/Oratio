import { Link } from 'react-router-dom';

// Canal de contato do responsável pelo site (exigido pela LGPD, art. 41).
const CONTACT_EMAIL = 'dougclasher9@gmail.com';
const LAST_UPDATE = '20 de outubro de 2026';

export default function Privacidade() {
  return (
    <main className="page privacy-page">
      <span className="eyebrow">Transparência</span>
      <h1 className="section-title">Política de Privacidade</h1>
      <p className="lead">
        O Oratio é um site de oração e não exige cadastro. Esta página explica, de forma simples, quais dados podem
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
          Quando você envia uma sugestão pelo botão <strong>Feedback</strong>, recebemos o texto que você escreveu
          (e qualquer dado que decidir incluir nele). O envio é feito pelo serviço <strong>Formspree</strong>, que
          também pode registrar dados técnicos, como endereço IP e navegador, para entregar a mensagem e filtrar
          spam. Usamos as mensagens apenas para melhorar o site. A base legal é o seu consentimento, dado ao enviar
          (LGPD, art. 7º, I). Não peça nem envie dados sensíveis pelo formulário.
        </p>

        <h3>Dados guardados no seu próprio aparelho</h3>
        <p>
          O site guarda algumas preferências no armazenamento local do seu navegador (<em>localStorage</em>): o tema
          claro ou escuro, a data em que você recomeçou a leitura diária e cópias das leituras já carregadas, para
          abrir mais rápido. Essas informações <strong>ficam apenas no seu aparelho</strong> e não são enviadas para
          nós. Você pode apagá-las a qualquer momento limpando os dados do site nas configurações do navegador.
        </p>

        <h3>Registros técnicos de acesso</h3>
        <p>
          Como qualquer site, o Oratio é hospedado num provedor (Vercel), que registra automaticamente dados de
          acesso, como endereço IP, data e hora e a página acessada, para manter o serviço funcionando e seguro. O
          mesmo vale para a nossa API de leituras, também hospedada na Vercel.
        </p>
      </section>

      <section>
        <h2>3. Serviços de terceiros</h2>
        <p>Para funcionar, o site se conecta a estes serviços, que recebem o endereço IP do seu aparelho:</p>
        <ul>
          <li><strong>Vercel</strong> — hospedagem do site e da API de leituras.</li>
          <li><strong>Google Fonts</strong> — fornece as fontes de texto usadas no site.</li>
          <li><strong>Formspree</strong> — envio do formulário de feedback (somente se você usá-lo).</li>
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
          <li>Não usamos cookies de rastreamento, ferramentas de análise de público nem anúncios.</li>
          <li>Não vendemos nem compartilhamos seus dados para fins comerciais.</li>
          <li>Não pedimos cadastro, senha nem dados de pagamento.</li>
        </ul>
      </section>

      <section>
        <h2>5. Por quanto tempo guardamos</h2>
        <p>
          As mensagens do formulário de feedback são guardadas pelo tempo necessário para analisá-las, por no máximo
          12 meses, e depois apagadas. Os registros técnicos de acesso são mantidos pelos provedores de hospedagem
          conforme suas próprias políticas e as exigências legais.
        </p>
      </section>

      <section>
        <h2>6. Seus direitos</h2>
        <p>Pela LGPD (art. 18), você pode pedir, a qualquer momento:</p>
        <ul>
          <li>a confirmação de que tratamos dados seus e o acesso a eles;</li>
          <li>a correção de dados incompletos ou desatualizados;</li>
          <li>a exclusão das mensagens que você enviou;</li>
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
