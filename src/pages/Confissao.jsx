import Candle from '../components/anim/Candle';
import ConfessionGuide from '../components/ConfessionGuide';

export default function Confissao() {
  return (
    <main className="page confession-page">
      <ConfessionGuide
        header={
          <>
            <div className="page-title-row">
              <div>
                <span className="eyebrow">Sacramento da Reconciliação</span>
                <h1 className="section-title">Exame de consciência</h1>
              </div>
              <Candle />
            </div>
            <p className="lead">
              Um roteiro para se preparar para a confissão: reze, marque o que se aplica a você e leve a lista com
              você.
            </p>
          </>
        }
      />
    </main>
  );
}
