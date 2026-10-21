import SaintsDirectory from '../components/SaintsDirectory';

export default function Santos() {
  return (
    <main className="page">
      <span className="eyebrow">Intercessores</span>
      <h1 className="section-title">Santos</h1>
      <p className="lead">
        Conheça a história de alguns santos, a data em que a Igreja os celebra e as orações para pedir sua
        intercessão. Toque em um santo para abrir a página dele.
      </p>

      <SaintsDirectory />
    </main>
  );
}
