/* Global Academy: carregador fixo. O Wix aponta para este arquivo; ele busca a versão atual do site em version.json. */
(function () {
if (window.__gaLoad) return; window.__gaLoad = 1;
var FALLBACK = '1949bd0af84d89ce5da2808b06914bd84abeccf0';
var BASE = 'https://cdn.jsdelivr.net/gh/globalfutpro-creator/sitevendas@';
function go(sha) {
var s = document.createElement('script'); s.src = BASE + sha + '/academy/ga-app.js';
s.onerror = function () { if (sha !== FALLBACK) go(FALLBACK); };
document.head.appendChild(s);
}
try {
fetch('https://raw.githubusercontent.com/globalfutpro-creator/sitevendas/ga-home-live/academy/version.json?t=' + Math.floor(Date.now() / 60000), { cache: 'no-store' })
.then(function (r) { return r.json(); }).then(function (j) { go(j && /^[0-9a-f]{40}$/.test(j.sha) ? j.sha : FALLBACK); }).catch(function () { go(FALLBACK); });
} catch (e) { go(FALLBACK); }
})();
