/* Global Academy: atalhos da área do membro no celular.
   Nas páginas /account/* e /profile/*, mostra um painel com tudo o que o aluno tem
   (no celular o Wix esconde as abas num seletor que quase ninguém percebe). */
(function () {
  if (window.__gaMembro) return; window.__gaMembro = 1;
  var ITENS = [
    ['🎓', 'Meu curso', '/account/challenges'],
    ['🔥', 'Comunidade', '/comunidade'],
    ['👥', 'Grupo de networking', '/account/grupodenetworking'],
    ['💳', 'Assinaturas', '/account/minhas-assinaturas'],
    ['🧾', 'Pedidos', '/account/meus-pedidos'],
    ['🔔', 'Notificações', '/account/notifications'],
    ['👤', 'Meu perfil', null],
    ['⚙️', 'Configurações', '/account/settings']
  ];
  var CSS = '.ga-mb{margin:16px 12px 8px;padding:16px;border-radius:20px;background:linear-gradient(180deg,rgba(52,25,127,.92),rgba(31,16,86,.95));border:1px solid rgba(255,196,61,.45);box-shadow:0 0 26px rgba(155,48,255,.35);font-family:Barlow,system-ui,sans-serif;color:#fff}' +
    '.ga-mb h3{margin:0 0 12px;font:700 26px/1 Teko,sans-serif;letter-spacing:.02em;text-transform:uppercase;background:linear-gradient(180deg,#fff1b8,#ffc43d 55%,#ff9f1a);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.ga-mb .gr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}' +
    '.ga-mb a{display:flex;align-items:center;gap:10px;min-height:54px;padding:10px 12px;border-radius:14px;background:rgba(10,4,40,.5);border:1px solid rgba(23,217,255,.35);color:#fff !important;text-decoration:none;font-weight:700;font-size:14px;line-height:1.15}' +
    '.ga-mb a.on{border-color:#ffc43d;box-shadow:0 0 14px rgba(255,196,61,.45)}' +
    '.ga-mb a span{font-size:20px;flex:none}' +
    '.ga-mb a.dest{grid-column:1/-1;background:linear-gradient(180deg,#ffe08a,#ffb21a);color:#2a1600 !important;border:0;justify-content:center;text-transform:uppercase;letter-spacing:.05em}' +
    'html.ga-membro body,html.ga-membro #SITE_CONTAINER{background:linear-gradient(180deg,#2a1470,#120838) !important}';
  function eMembro() { return /^\/(account|profile)\//.test(location.pathname) && window.innerWidth < 900; }
  function perfilUrl() {
    var a = document.querySelector('a[href*="/profile/"]');
    return a ? a.getAttribute('href') : '/account/settings';
  }
  function montar() {
    document.documentElement.classList.toggle('ga-membro', eMembro());
    var ja = document.getElementById('ga-mb');
    if (!eMembro()) { if (ja) ja.remove(); return; }
    if (!document.getElementById('ga-mb-css')) {
      var st = document.createElement('style'); st.id = 'ga-mb-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var ancora = document.querySelector('[data-hook="ProfileCard-wrapper"]');
    if (!ancora) return;
    if (ja && ja.previousElementSibling === ancora) return;
    if (ja) ja.remove();
    var aqui = location.pathname;
    var html = '<h3>Minha área</h3><div class="gr">' + ITENS.map(function (it, i) {
      var url = it[2] || perfilUrl();
      return '<a href="' + url + '" class="' + (i === 0 ? 'dest ' : '') + (aqui.indexOf(url) === 0 ? 'on' : '') + '"><span>' + it[0] + '</span>' + it[1] + '</a>';
    }).join('') + '</div>';
    var box = document.createElement('nav'); box.id = 'ga-mb'; box.className = 'ga-mb'; box.setAttribute('aria-label', 'Minha área'); box.innerHTML = html;
    ancora.insertAdjacentElement('afterend', box);
  }
  setInterval(montar, 800);
  window.addEventListener('resize', montar);
})();
