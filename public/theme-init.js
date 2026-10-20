// Aplica o tema salvo antes da primeira pintura (evita piscar em claro).
// Fica em arquivo próprio para a Content-Security-Policy não precisar liberar scripts inline.
(function () {
  var theme = null;
  try {
    theme = localStorage.getItem('oratio:tema');
  } catch {
    theme = null; // armazenamento indisponível (modo privado, bloqueio de cookies)
  }
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
