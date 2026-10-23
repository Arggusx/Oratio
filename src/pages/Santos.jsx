import SaintsDirectory from '../components/SaintsDirectory';
import Angel from '../components/anim/Angel';

export default function Santos() {
  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Intercessores</span>
          <h1 className="section-title">Santos</h1>
        </div>
        <Angel />
      </div>
      <p className="lead">
        Conheça a história de alguns santos, a data em que a Igreja os celebra e as orações para pedir sua
        intercessão. Toque em um santo para abrir a página dele.
      </p>

      <SaintsDirectory />
    </main>
  );
}
