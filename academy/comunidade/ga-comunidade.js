/* Comunidade Global Academy — elemento <ga-comunidade> (mural estilo rede social)
   Conversa com o código da página (Velo) por eventos "ga-acao" e pelo atributo "resp".
   Visitante vê tudo; postar, curtir, comentar e seguir só aluno (a trava real está no backend). */
(function () {
  if (customElements.get('ga-comunidade')) return;
  var IMG = 'https://cdn.jsdelivr.net/gh/globalfutpro-creator/sitevendas@18e97ce3a028a0aecedebded63469e07687417b4/academy/img/';
  var ABAS = [['todos', 'Feed'], ['alta', 'Em alta'], ['narracao', 'Narração'], ['edicao', 'Edição'], ['artes', 'Artes'], ['jogo', 'Jogo']];
  var LIM = { imagemMB: 10, videoMB: 100, videoSeg: 90 };
  var ERROS = { ENTRAR: 'Entre na sua conta para continuar.', SO_ALUNOS: 'Só alunos da Global Academy podem fazer isso.', HANDLE_USADO: 'Esse @ já está em uso.', VAZIO: 'Escreva alguma coisa.', SEM_MIDIA: 'Escreva algo ou escolha um vídeo ou uma imagem.', FORMATO: 'Formato não aceito. Use MP4, JPG, PNG ou WEBP.' };
  if (!document.getElementById('ga-comu-fonts')) {
    var l = document.createElement('link'); l.id = 'ga-comu-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Teko:wght@500;600;700&family=Barlow:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(l);
  }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var num = function (n) { n = n || 0; return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.', ',') + ' mil' : String(n); };
  var quando = function (d) {
    var s = (Date.now() - new Date(d).getTime()) / 1000;
    if (s < 60) return 'agora'; if (s < 3600) return Math.floor(s / 60) + ' min'; if (s < 86400) return Math.floor(s / 3600) + ' h';
    if (s < 604800) return Math.floor(s / 86400) + ' d';
    var dt = new Date(d); return dt.getDate() + ' ' + ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][dt.getMonth()] + (dt.getFullYear() !== new Date().getFullYear() ? ' ' + dt.getFullYear() : '');
  };
  var ICO = {
    heart: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    com: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 12l16-8-6 16-3-7z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffc43d" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
  };
  var CSS = [
    ':host{display:block;font-family:Barlow,system-ui,sans-serif;color:#fff;background:linear-gradient(180deg,#2a1470 0%,#1a0f44 55%,#120838 100%);min-height:100vh}',
    '*{box-sizing:border-box}button{font:inherit;color:inherit;cursor:pointer}a{color:#ffc43d}',
    '.top{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(255,196,61,.25);background:rgba(18,8,56,.92);backdrop-filter:blur(8px)}',
    '.top img{height:30px}.top .bar{width:1px;height:26px;background:#ffc43d}',
    '.g{background:linear-gradient(180deg,#fff1b8,#ffc43d 55%,#ff9f1a);-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.ttl{margin-left:auto;font:700 30px/1 Teko,sans-serif;letter-spacing:.02em}',
    '.wrap{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr);gap:24px;padding:12px 12px 120px}',
    '@media(min-width:1000px){.wrap{grid-template-columns:220px minmax(0,560px) 300px;justify-content:center;padding:24px}}',
    '.side{display:none}@media(min-width:1000px){.side{display:block}}',
    '.nav button{display:block;width:100%;text-align:left;background:none;border:0;padding:12px 14px;border-radius:12px;font:800 15px Barlow;letter-spacing:.04em;text-transform:uppercase}',
    '.nav button.on{background:rgba(255,196,61,.14);color:#ffc43d}',
    '.tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px}.tabs::-webkit-scrollbar{display:none}',
    '.tab{flex:none;font:800 12px Barlow;letter-spacing:.1em;text-transform:uppercase;padding:8px 14px;border-radius:999px;border:1px solid rgba(23,217,255,.5);background:rgba(23,217,255,.12);color:#5ff0ff}',
    '.tab.on{background:linear-gradient(180deg,#ffe08a,#ffb21a);color:#2a1600;border-color:transparent}',
    '@media(min-width:1000px){.tabs.mob{display:none}}',
    '.stories{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;padding:12px 4px}.stories::-webkit-scrollbar{display:none}',
    '.st{flex:none;width:70px;display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:0;padding:0}',
    '.st span{font:700 11px Barlow;max-width:70px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.ring{display:inline-block;flex:none;padding:2.5px;border-radius:50%;background:conic-gradient(#ffc43d,#9b30ff,#17d9ff,#ffc43d)}',
    '.av{display:flex;align-items:center;justify-content:center;border-radius:50%;border:2.5px solid #1a0f44;background:linear-gradient(135deg,#9b30ff,#1a0f44);font:700 20px Teko;object-fit:cover;overflow:hidden}',
    '.box{border-radius:20px;background:linear-gradient(180deg,rgba(52,25,127,.85),rgba(31,16,86,.92));border:1px solid rgba(185,140,255,.28);box-shadow:0 0 0 1px rgba(255,196,61,.08),0 14px 40px rgba(10,4,40,.5)}',
    '.feed{display:flex;flex-direction:column;gap:18px}',
    '.post{overflow:hidden}.ph{display:flex;align-items:center;gap:10px;padding:12px 14px}',
    '.ph .nm{background:none;border:0;padding:0;text-align:left;min-width:0}.ph b{font-size:15px}.ph small{display:block;font-size:12px;color:#17d9ff;font-weight:700}',
    '.tag{display:inline-block;margin-left:6px;vertical-align:2px;font:800 9px Barlow;letter-spacing:.12em;text-transform:uppercase;padding:3px 7px;border-radius:999px;background:rgba(23,217,255,.16);color:#5ff0ff;border:1px solid rgba(23,217,255,.5)}',
    '.tag.prof{background:linear-gradient(180deg,#ffe08a,#ffb21a);color:#2a1600;border:0}',
    '.seg{margin-left:auto;flex:none;font:800 12px Barlow;letter-spacing:.06em;text-transform:uppercase;color:#ffc43d;border:1px solid rgba(255,196,61,.6);border-radius:999px;padding:6px 12px;background:none}',
    '.seg.on{color:#cdb8ff;border-color:rgba(185,140,255,.4)}',
    '.media{position:relative;background:#120838;max-height:620px;display:flex;align-items:center;justify-content:center}',
    '.media img,.media video{width:100%;max-height:620px;object-fit:contain;display:block}',
    '.act{display:flex;align-items:center;gap:18px;padding:12px 14px 4px;font:800 14px Barlow}',
    '.act button{display:flex;align-items:center;gap:6px;background:none;border:0;padding:0}',
    '.lk svg{fill:none;stroke:#e9dcff;stroke-width:2}.lk.on svg{fill:#ff2d55;stroke:#ff2d55}.lk.pop svg{animation:pop .45s}',
    '@keyframes pop{40%{transform:scale(1.45)}100%{transform:scale(1)}}',
    '.cap{padding:4px 14px 10px;font-size:14px;line-height:1.45;color:#efe6ff;white-space:pre-wrap;word-break:break-word}',
    '.cm{margin:0 14px 12px;padding:10px 12px;border-radius:12px;background:rgba(10,4,40,.45);font-size:13px;color:#e9dcff}.cm p{margin:0 0 4px}',
    '.vm{background:none;border:0;padding:0 14px 12px;color:#9f8ad8;font-size:13px}',
    '.lock{display:flex;align-items:center;gap:10px;padding:12px 14px;border-top:1px solid rgba(185,140,255,.2);font-size:13px;color:#cdb8ff}',
    '.lock button{margin-left:auto;background:none;border:0;color:#ffc43d;font-weight:800;white-space:nowrap}',
    '.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:12px;font:800 14px Barlow;letter-spacing:.05em;text-transform:uppercase;min-height:46px;padding:0 18px}',
    '.gold{background:linear-gradient(180deg,#ffe08a,#ffb21a);color:#2a1600;box-shadow:0 0 24px rgba(255,196,61,.55)}',
    '.ghost{background:rgba(26,15,68,.7);color:#fff;border:1.5px solid #17d9ff;box-shadow:0 0 14px rgba(23,217,255,.35)}',
    '.dock{position:fixed;left:0;right:0;bottom:0;z-index:6;padding:12px 16px 16px;background:linear-gradient(180deg,rgba(18,8,56,0),#120838 35%);display:flex;flex-direction:column;align-items:center;gap:6px}',
    '.dock .btn{width:100%;max-width:520px}.dock small{font-size:12px;color:#cdb8ff;text-align:center}',
    '.fab{position:fixed;right:18px;bottom:22px;z-index:6;width:58px;height:58px;border-radius:50%;border:0;display:flex;align-items:center;justify-content:center}',
    '@media(min-width:1000px){.fab,.dock{display:none}}',
    '.compose{display:flex;align-items:center;gap:12px;padding:14px;cursor:pointer}.compose .tx{flex:1;color:#9f8ad8}',
    '.card{padding:18px}.card h3{margin:0 0 8px;font:700 30px/0.95 Teko;text-transform:uppercase}',
    '.who{display:flex;align-items:center;gap:10px;padding:7px 0}.who .nm{flex:1;min-width:0;background:none;border:0;padding:0;text-align:left}.who b{display:block;font-size:14px}.who small{color:#17d9ff;font-weight:700;font-size:12px}',
    '.more{display:block;margin:4px auto 0;background:none;border:1px solid rgba(185,140,255,.4);border-radius:999px;padding:10px 20px;font:800 13px Barlow;letter-spacing:.06em;text-transform:uppercase;color:#cdb8ff}',
    '.empty{padding:40px 20px;text-align:center;color:#cdb8ff}',
    '.pf .capa{height:150px;background:#1f1056 center/cover;border-radius:20px 20px 0 0;position:relative}',
    '.pf .capa:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(26,15,68,.1),#1f1056);border-radius:inherit}',
    '.pf .hd{display:flex;align-items:flex-end;gap:14px;margin-top:-48px;padding:0 18px;position:relative;z-index:1}',
    '.pf h2{margin:0;font:700 36px/0.9 Teko;text-transform:uppercase;word-break:break-word}',
    '.pf .bio{margin:12px 18px 0;font-size:14px;line-height:1.5;color:#efe6ff;white-space:pre-wrap}',
    '.nums{display:flex;justify-content:space-around;margin:16px 18px;padding:12px 0;border-radius:16px;background:rgba(10,4,40,.45);border:1px solid rgba(255,196,61,.25)}',
    '.nums div{text-align:center}.nums b{display:block;font:700 30px/1 Teko}.nums span{font:700 11px Barlow;letter-spacing:.1em;text-transform:uppercase;color:#cdb8ff}',
    '.pbtn{display:flex;gap:10px;margin:0 18px 16px}.pbtn .btn{flex:1}',
    '.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:0 4px 4px}',
    '.grid button{position:relative;aspect-ratio:1;border:0;padding:0;overflow:hidden;border-radius:6px;background:#120838}',
    '.grid img,.grid video{width:100%;height:100%;object-fit:cover;display:block}.grid i{position:absolute;right:6px;top:4px;font-style:normal;font-weight:800}',
    '.ov{position:fixed;inset:0;z-index:20;background:rgba(8,3,30,.78);display:flex;align-items:flex-end;justify-content:center}',
    '@media(min-width:700px){.ov{align-items:center}}',
    '.sh{width:100%;max-width:560px;max-height:90vh;overflow:auto;border-radius:22px 22px 0 0;padding:18px}@media(min-width:700px){.sh{border-radius:22px}}',
    '.sh h3{margin:0 0 12px;font:700 32px/0.95 Teko;text-transform:uppercase}',
    '.fld{display:block;width:100%;margin:0 0 12px;padding:12px 14px;border-radius:12px;border:1px solid rgba(185,140,255,.4);background:rgba(10,4,40,.55);color:#fff;font:500 15px Barlow}',
    'textarea.fld{min-height:90px;resize:vertical}',
    '.drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:150px;margin-bottom:12px;border:2px dashed rgba(255,196,61,.5);border-radius:16px;color:#cdb8ff;text-align:center;padding:12px;cursor:pointer}',
    '.drop img,.drop video{max-width:100%;max-height:260px;border-radius:12px}',
    '.row{display:flex;gap:10px}.row .btn{flex:1}',
    '.msg{color:#ff8fa3;font-size:13px;min-height:18px;margin:0 0 8px}',
    '.prog{height:6px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden;margin:0 0 12px}.prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#17d9ff,#ffc43d)}',
    '.cmi{display:flex;gap:8px;position:sticky;bottom:-18px;padding:10px 0 0;background:inherit}.cmi .fld{margin:0}',
    '.sk .skc{width:44px;height:44px;border-radius:50%}.sk .skc,.sk .skl,.sk .skm{display:block;background:linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.16),rgba(255,255,255,.06));background-size:200% 100%;animation:shim 1.1s linear infinite}.sk .skl{height:12px;border-radius:6px}.sk .skm{aspect-ratio:4/5;max-height:420px}@keyframes shim{to{background-position:-200% 0}}',
    '.stack{display:flex}.stack .ring{margin-left:-10px}.stack .ring:first-child{margin-left:0}',
    '.sec h4{margin:0 2px 2px;font:700 22px Teko;text-transform:uppercase;letter-spacing:.02em}.sec h4 small{color:#ffc43d;font-size:18px;margin-left:4px}',
    '.tl{position:relative;padding-left:20px;margin-top:14px}.tl:before{content:"";position:absolute;left:6px;top:6px;bottom:0;width:2px;background:linear-gradient(#ffc43d,#9b30ff 60%,transparent)}',
    '.tl>article:before{content:"";position:absolute;left:-19px;top:22px;width:12px;height:12px;border-radius:50%;background:#ffc43d;box-shadow:0 0 12px #ffc43d}.tl>article{position:relative;overflow:visible}.tl>article>.media{overflow:hidden}',
    '.txt{margin:0 14px 6px;padding:22px 18px;border-radius:16px;background:linear-gradient(135deg,rgba(155,48,255,.35),rgba(23,217,255,.18));border:1px solid rgba(185,140,255,.35);font-size:16px;line-height:1.55;color:#fff;white-space:pre-wrap;word-break:break-word}',
    '.txt.big{font:700 30px/1.05 Teko,sans-serif;text-transform:uppercase;letter-spacing:.01em;text-align:center;padding:34px 18px}',
    '.grid .txt{margin:0;height:100%;display:flex;align-items:center;justify-content:center;font-size:12px;padding:8px;border-radius:6px}.grid .txt.big{font-size:18px}',
    '.hdl{color:#17d9ff;font-weight:700;font-size:13px}',
    '.compose{margin-bottom:4px}',
    '.hero{position:relative;overflow:hidden;margin:4px 0 20px;border-radius:26px;padding:2px;background:conic-gradient(from var(--a,0deg),#ffc43d,#9b30ff,#17d9ff,#ffc43d);animation:gira 6s linear infinite;box-shadow:0 0 40px rgba(155,48,255,.5),0 0 80px rgba(255,196,61,.18)}',
    '@property --a{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes gira{to{--a:360deg}}',
    '.hero .hbg{position:absolute;inset:2px;border-radius:24px;background:center/cover;opacity:.35;filter:saturate(1.2)}',
    '.hero .hglow{position:absolute;inset:2px;border-radius:24px;background:radial-gradient(120% 90% at 100% 0%,rgba(255,196,61,.30),transparent 55%),radial-gradient(90% 80% at 0% 100%,rgba(23,217,255,.25),transparent 60%),linear-gradient(160deg,rgba(58,28,143,.82),rgba(26,15,68,.94))}',
    '.hin{position:relative;padding:28px 20px 22px}',
    '.hero .kick{display:inline-flex;align-items:center;gap:8px;font:800 11px Barlow;letter-spacing:.14em;text-transform:uppercase;color:#5ff0ff;margin-bottom:10px}.hero .kick i{width:8px;height:8px;border-radius:50%;background:#17d9ff;box-shadow:0 0 10px #17d9ff;animation:pis 1.6s ease-in-out infinite}',
    '@keyframes pis{50%{opacity:.35;transform:scale(.7)}}',
    '.hero h1{margin:0;font:700 clamp(36px,12vw,56px)/.86 Teko,sans-serif;max-width:100%;overflow-wrap:anywhere;text-transform:uppercase;letter-spacing:.01em;text-shadow:0 0 24px rgba(155,48,255,.6)}.hero h1 .g{filter:drop-shadow(0 0 14px rgba(255,196,61,.55))}@media(min-width:700px){.hero h1{font-size:76px}}',
    '.hero p{margin:12px 0 16px;color:#efe6ff;font-size:15px;line-height:1.5;max-width:470px}',
    '.hchips{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}.hchips span{display:flex;align-items:baseline;gap:6px;padding:8px 12px;border-radius:12px;background:rgba(10,4,40,.55);border:1px solid rgba(255,196,61,.35);font:700 12px Barlow;letter-spacing:.08em;text-transform:uppercase;color:#cdb8ff}.hchips b{font:700 26px/1 Teko;color:#ffc43d;letter-spacing:0}',
    '.hst{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.hst .btn{min-height:46px}',
    '.shine{position:relative;overflow:hidden}.shine:after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.65),transparent);transform:skewX(-20deg);animation:brilha 3.2s ease-in-out infinite}',
    '@keyframes brilha{0%,60%{left:-60%}100%{left:130%}}',
    '.jn{position:relative}.jn:before{content:"";position:absolute;left:-17px;top:20px;width:8px;height:8px;border-radius:50%;background:#17d9ff;box-shadow:0 0 10px #17d9ff}',
    '.jni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:rgba(10,4,40,.38);border:1px dashed rgba(23,217,255,.35)}.jni .nm{flex:1;min-width:0;background:none;border:0;padding:0;text-align:left;font-size:14px;color:#e9dcff}.jni b{color:#fff}.jni small{display:block;color:#17d9ff;font-weight:700;font-size:12px}',
    '.seg.sm{padding:5px 10px;font-size:11px}',
    '.sent{opacity:.7}.fimtl{text-align:center;color:#9f8ad8;font-size:13px;padding:10px 0 4px}',
    '.voltar{margin:0 0 12px}',
    '.pf{position:relative}.pf .capa{height:190px;border-radius:24px 24px 0 0;background:#1f1056 center/cover;position:relative;overflow:hidden;border:1px solid rgba(255,196,61,.4);border-bottom:0}',
    '.capa-brilho{position:absolute;inset:0;background:linear-gradient(180deg,rgba(26,15,68,.05),rgba(31,16,86,.95)),radial-gradient(80% 60% at 80% 0%,rgba(255,196,61,.35),transparent 60%)}',
    '.pcard{position:relative;margin-top:-70px;padding:0 18px 20px;text-align:center;border-radius:0 0 24px 24px;background:linear-gradient(180deg,transparent,rgba(31,16,86,.96) 70px);border:1px solid rgba(255,196,61,.4);border-top:0;box-shadow:0 20px 50px rgba(10,4,40,.6)}',
    '.pav{display:inline-block;border-radius:50%;padding:4px;background:conic-gradient(from var(--a,0deg),#ffc43d,#9b30ff,#17d9ff,#ffc43d);animation:gira 5s linear infinite;box-shadow:0 0 30px rgba(255,196,61,.55)}.pav .ring{padding:0;background:none}',
    '.pnome{margin:12px 0 2px;font:700 44px/.9 Teko,sans-serif;text-transform:uppercase;letter-spacing:.01em;word-break:break-word}.pnome.lg{font-size:32px}.pnome .g{filter:drop-shadow(0 0 12px rgba(255,196,61,.5))}',
    '.phdl{color:#17d9ff;font-weight:700;font-size:14px}.phdl span{color:#cdb8ff}',
    '.pbadges{display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin:12px 0 4px}.pbadges .tag{margin:0;font-size:10px;padding:5px 10px}.tag.dim{background:rgba(255,255,255,.06);color:#cdb8ff;border-color:rgba(255,255,255,.18)}',
    '.pf .bio{margin:12px auto 0;max-width:420px;font-size:14px;line-height:1.55;color:#efe6ff}.pf .bio.vazio{color:#9f8ad8;font-style:italic}',
    '.pf .nums{margin:18px 0;gap:10px;display:grid;grid-template-columns:repeat(3,1fr);padding:0;background:none;border:0}',
    '.pf .nums div{padding:12px 4px;border-radius:16px;background:rgba(10,4,40,.55);border:1px solid rgba(255,196,61,.35);box-shadow:inset 0 0 18px rgba(155,48,255,.25)}.pf .nums b{font-size:34px}',
    '.pf .pbtn{margin:0;display:flex;gap:10px}.pf .pbtn .btn{flex:1}',
    '.ptabs{display:flex;gap:18px;margin:22px 4px 10px;border-bottom:1px solid rgba(185,140,255,.25)}.ptabs span{padding:0 2px 10px;font:800 13px Barlow;letter-spacing:.12em;text-transform:uppercase;color:#9f8ad8}.ptabs .on{color:#ffc43d;border-bottom:2px solid #ffc43d;box-shadow:0 6px 12px -8px #ffc43d}',
    '.pf .grid{padding:0;gap:6px}.pf .grid button{border-radius:12px;border:1px solid rgba(185,140,255,.25);transition:transform .2s}.pf .grid button:hover{transform:scale(1.03)}',
    '.pvazio{display:flex;flex-direction:column;align-items:center;gap:6px;padding:36px 20px;border-radius:20px;border:1px dashed rgba(255,196,61,.4);background:rgba(10,4,40,.35);text-align:center;color:#cdb8ff;font-size:14px}.pvazio b{color:#fff;font:700 26px Teko;text-transform:uppercase}.pvi{font-size:34px;color:#ffc43d;text-shadow:0 0 16px #ffc43d}',
    '.toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:30;background:#1f1056;border:1px solid #ffc43d;border-radius:999px;padding:10px 18px;font-weight:700;box-shadow:0 0 24px rgba(255,196,61,.4)}'
  ].join('\n');

  var SK1 = '<div class="box post sk"><div class="ph"><span class="skc"></span><span class="skl" style="width:40%"></span></div><div class="skm"></div><div style="padding:14px"><span class="skl" style="width:70%"></span><span class="skl" style="width:45%;margin-top:8px"></span></div></div>';
  var SKEL = SK1 + SK1;
  class GaComunidade extends HTMLElement {
    static get observedAttributes() { return ['sessao', 'resp', 'inicio']; }
    constructor() {
      super();
      this.r = this.attachShadow({ mode: 'open' });
      this.s = { logado: false, aluno: false };
      this.pend = {}; this.seq = 0;
      this.aba = 'todos'; this.posts = []; this.fim = false; this.top = []; this.membros = [];
      this.u = new URLSearchParams(location.search).get('u');
    }
    connectedCallback() {
      this.r.innerHTML = '<style>' + CSS + '</style><div id="app"></div>';
      this.app = this.r.getElementById('app');
      this.app.addEventListener('click', (e) => this.clique(e));
      if (!this.u) { try { var cc = JSON.parse(localStorage.getItem('ga-comu-cache') || 'null'); if (cc && cc.feed) { this.posts = cc.feed.posts || []; this.top = cc.top || []; this.membros = cc.membros || []; this.fim = cc.feed.fim; } } catch (e) {} }
      this.render();
      // sem o código da página (pré-visualização), mostra o aviso em vez de travar
      this.boot = setTimeout(() => { if (!this.ligado) { this.ligado = true; this.carregar(); } }, 8000);
    }
    attributeChangedCallback(nome, _a, v) {
      if (!v) return;
      var d; try { d = JSON.parse(v); } catch (e) { return; }
      if (nome === 'inicio') {
        this.ligado = true; this.s = d.sessao || this.s; this.top = d.top || []; this.membros = d.membros || this.membros;
        if (!this.u) { this.posts = d.feed.posts; this.fim = d.feed.fim; this.carregando = false; this.render(); }
        else this.carregar();
        try { localStorage.setItem('ga-comu-cache', JSON.stringify({ feed: d.feed, top: d.top, membros: d.membros })); } catch (e) {}
        return;
      }
      if (nome === 'sessao') {
        this.s = d || {}; this.render();
      } else if (nome === 'resp' && this.pend[d.id]) {
        var p = this.pend[d.id]; delete this.pend[d.id];
        d.ok ? p.ok(d.data) : p.no(new Error(d.data));
      }
    }
    chamar(tipo, args) {
      var id = 'a' + (++this.seq) + '_' + Date.now();
      return new Promise((ok, no) => {
        this.pend[id] = { ok: ok, no: no };
        this.dispatchEvent(new CustomEvent('ga-acao', { detail: { id: id, tipo: tipo, args: args }, bubbles: true, composed: true }));
        setTimeout(() => { if (this.pend[id]) { delete this.pend[id]; no(new Error('SEM_RESPOSTA')); } }, 60000);
      });
    }
    aviso(t) {
      var d = document.createElement('div'); d.className = 'toast'; d.textContent = t;
      this.r.appendChild(d); setTimeout(() => d.remove(), 2600);
    }
    erro(e) { var c = String((e && e.message) || e); if (c === 'SO_ALUNOS' || c === 'ENTRAR') return this.portao(); this.aviso(ERROS[c] || 'Não deu certo agora. Tente de novo.'); }
    async carregar() {
      try {
        var t = this.chamar('maisSeguidos').then((x) => { this.top = x || []; this.render(); }).catch(() => {});
        if (this.u) { await this.abrirPerfil(this.u, true); }
        else { await this.buscar(true); }
        await t;
      } catch (e) { this.falhou = true; this.render(); }
    }
    async buscar(zera) {
      this.carregando = true; this.render();
      var ul = this.posts[this.posts.length - 1]; var antes = !zera && ul ? (ul.quando || ul._createdDate) : null;
      var r = await this.chamar('feed', { aba: this.aba, antesDe: antes, autor: this.perfil ? this.perfil.memberId : null });
      this.posts = zera ? r.posts : this.posts.concat(r.posts); this.fim = r.fim; if (zera) this.lim = 10;
      this.carregando = false; this.render();
    }
    async abrirPerfil(handle, inicial) {
      this.perfil = await this.chamar('perfil', handle);
      if (!inicial) history.pushState(null, '', '?u=' + encodeURIComponent(handle));
      this.posts = []; this.aba = 'todos';
      if (this.perfil) await this.buscar(true); else this.render();
      window.scrollTo(0, 0);
    }
    voltarFeed() { this.perfil = null; this.u = null; history.pushState(null, '', location.pathname); this.buscar(true); }
    av(p, s) {
      s = s || 40; var f = p && p.foto; var l = esc(((p && (p.nome || p.handle)) || 'A').trim().charAt(0).toUpperCase());
      return '<span class="ring"><' + (f ? 'img src="' + esc(f) + '" alt=""' : 'span') + ' class="av" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * .5) + 'px">' + (f ? '' : l + '</span>') + '</span>';
    }
    tagDe(p) { return p && p.professor ? '<span class="tag prof">Professor</span>' : '<span class="tag">Aluno</span>'; }
    midia(p, grid) {
      if (p.tipo === 'texto' || !p.midia) { var t = esc(p.legenda || ''); return '<div class="txt' + (t.length < 90 ? ' big' : '') + '">' + (grid ? t.slice(0, 80) : t) + '</div>'; }
      var u = esc(p.midia);
      if (p.tipo === 'video') return '<video src="' + u + '#t=0.5" ' + (grid ? 'muted playsinline preload="metadata"' : 'controls playsinline preload="metadata"') + '></video>';
      return '<img src="' + u + '" alt="" loading="lazy">';
    }
    entrada(m) {
      var meu = this.s.perfil && this.s.perfil.memberId === m.memberId;
      return '<div class="jn"><div class="jni">' + this.av(m, 40) + '<button class="nm" data-perfil="' + esc(m.handle) + '"><b>' + esc(m.nome || m.handle) + '</b> entrou na comunidade<small>' + quando(m.entrouEm || m._createdDate) + '</small></button>' +
        (meu ? '' : '<button class="seg sm" data-seguir="' + esc(m.memberId) + '">Seguir</button>') + '</div></div>';
    }
    cartao(p) {
      var a = p.autor || {}; var meu = this.s.perfil && this.s.perfil.memberId === p.autorId;
      var cm = (p.ultimos || []).map((c) => '<p><b>' + esc(c.handle) + '</b> ' + esc(c.texto) + '</p>').join('');
      return '<article class="box post" data-post="' + esc(p._id) + '">' +
        '<div class="ph">' + this.av(a) + '<button class="nm" data-perfil="' + esc(a.handle) + '"><b>' + esc(a.nome || a.handle || 'aluno') + '</b>' + this.tagDe(a) + '<small>@' + esc(a.handle || '') + ' · ' + quando(p.quando || p._createdDate) + '</small></button>' +
        (meu ? '' : '<button class="seg" data-seguir="' + esc(p.autorId) + '">Seguir</button>') + '</div>' +
        (p.tipo === 'texto' || !p.midia ? this.midia(p) : '<div class="media">' + this.midia(p) + '</div>') +
        '<div class="act"><button class="lk' + (p.curti ? ' on' : '') + '" data-curtir="' + esc(p._id) + '">' + ICO.heart + '<span>' + num(p.curtidas) + '</span></button>' +
        '<button data-coment="' + esc(p._id) + '">' + ICO.com + '<span>' + num(p.comentarios) + '</span></button>' +
        '<button data-share="' + esc(p._id) + '" aria-label="Compartilhar">' + ICO.send + '</button>' +
        (this.s.admin ? '<button data-ocultar="' + esc(p._id) + '" style="margin-left:auto;font-size:12px;color:#ff8fa3">Tirar do ar</button>' : '<button data-denuncia="' + esc(p._id) + '" style="margin-left:auto;font-size:12px;color:#9f8ad8">Denunciar</button>') + '</div>' +
        (p.legenda && p.tipo !== 'texto' && p.midia ? '<div class="cap"><b>' + esc(a.handle) + '</b> ' + esc(p.legenda) + '</div>' : '') +
        (cm ? '<div class="cm">' + cm + '</div>' : '') +
        (p.comentarios > 2 ? '<button class="vm" data-coment="' + esc(p._id) + '">Ver os ' + p.comentarios + ' comentários</button>' : '') +
        (this.s.aluno ? '' : '<div class="lock">' + ICO.lock + '<span>Curtir e comentar: só alunos</span><button data-portao>Quero ser aluno</button></div>') +
        '</article>';
    }
    render() {
      if (!this.app) return;
      var aluno = this.s.aluno;
      var top = this.hasAttribute('embutido') ? '' : '<header class="top"><img src="' + IMG + 'ga.png" alt="Global Academy"><span class="bar"></span><img src="' + IMG + 'utv.png" alt="Ulisses TV"><span class="ttl g">COMUNIDADE</span></header>';
      var tabs = ABAS.map((t) => '<button class="tab' + (this.aba === t[0] ? ' on' : '') + '" data-aba="' + t[0] + '">' + t[1] + '</button>').join('');
      var nav = ABAS.map((t) => '<button class="' + (this.aba === t[0] && !this.perfil ? 'on' : '') + '" data-aba="' + t[0] + '">' + t[1] + '</button>').join('') +
        (this.s.perfil ? '<button data-perfil="' + esc(this.s.perfil.handle) + '">Meu perfil</button>' : '');
      var mem = this.membros.length ? this.membros : this.top;
      var nPosts = this.posts.length;
      var hero = '<section class="hero"><div class="hbg" style="background-image:url(\'' + IMG + 'cena-arena-hd.jpg\')"></div><div class="hglow"></div>' +
        '<div class="hin"><span class="kick"><i></i>Rede social dos alunos · Global Academy</span>' +
        '<h1>Mural da<br><span class="g">Comunidade</span></h1>' +
        '<p>Cortes, narrações, artes e jogadas. Mostre o seu trabalho, siga quem faz e seja visto por quem contrata.</p>' +
        '<div class="hchips"><span><b>' + (mem.length || '…') + '</b>membros</span><span><b>' + nPosts + (this.fim ? '' : '+') + '</b>posts</span></div>' +
        '<div class="hst"><div class="stack">' + mem.slice(0, 7).map((p) => this.av(p, 38)).join('') + '</div>' +
        (aluno ? '<button class="btn gold shine" data-postar>+ Postar agora</button>' : '<button class="btn gold shine" data-portao>Quero participar</button>') + '</div></div></section>';
      var quem = mem.length ? '<div class="sec"><h4>Quem está na comunidade <small>' + mem.length + '</small></h4><div class="stories">' + mem.map((p) => '<button class="st" data-perfil="' + esc(p.handle) + '">' + this.av(p, 56) + '<span>' + esc(p.nome || p.handle) + '</span></button>').join('') + '</div></div>' : '';
      var stories = this.top.length ? '<div class="stories">' + this.top.map((p) => '<button class="st" data-perfil="' + esc(p.handle) + '">' + this.av(p, 56) + '<span>' + esc(p.handle) + '</span></button>').join('') + '</div>' : '';
      var compose = aluno ? '<div class="box compose" data-postar>' + this.av(this.s.perfil) + '<span class="tx">Mostre o seu trabalho: corte, narração ou arte…</span>' + ICO.plus + '</div>' : '';
      var itens = this.posts.map((p) => ({ k: 'p', d: new Date(p.quando || p._createdDate).getTime(), p: p }));
      if (this.aba === 'todos' && this.membros.length) {
        var limite = this.fim || !this.posts.length ? 0 : Math.min.apply(null, itens.map((x) => x.d));
        var jaEntrou = new Set(this.posts.filter((p) => p.tipo === 'entrada').map((p) => p.autorId));
        this.membros.forEach((m) => { if (jaEntrou.has(m.memberId)) return; var d = new Date(m.entrouEm || m._createdDate).getTime(); if (d >= limite) itens.push({ k: 'j', d: d, p: m }); });
      }
      itens.sort((a, b) => b.d - a.d);
      this.totalItens = itens.length;
      var vis = itens.slice(0, this.lim || 10);
      var lista = this.falhou ? '<div class="box empty">A comunidade está sendo ligada. Volte em instantes.</div>'
        : (vis.length ? vis.map((x) => x.k === 'p' ? this.cartao(x.p) : this.entrada(x.p)).join('') : (this.carregando || !this.ligado ? SKEL : '<div class="box empty">Ainda não tem posts aqui. ' + (aluno ? 'Seja o primeiro a postar!' : 'Os alunos começam a postar em breve.') + '</div>'));
      var mais = (vis.length < itens.length || (!this.fim && this.posts.length)) ? '<div id="sent" class="sent">' + SK1 + '</div>' : (vis.length ? '<div class="fimtl">Você chegou ao começo da comunidade ✨</div>' : '');
      var centro;
      if (this.perfil) {
        var p = this.perfil; var nm = p.nome || p.handle || '';
        var desde = p.entrouEm || p._createdDate; var dd = desde ? new Date(desde) : null;
        var mes = dd ? ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][dd.getMonth()] + ' ' + dd.getFullYear() : '';
        centro = '<button class="more voltar" data-voltar>← Voltar ao mural</button><div class="pf">' +
          '<div class="capa" style="background-image:url(\'' + esc(p.capa || IMG + 'cena-arena-hd.jpg') + '\')"><div class="capa-brilho"></div></div>' +
          '<div class="pcard"><div class="pav">' + this.av(p, 112) + '</div>' +
          '<h2 class="pnome' + (nm.length > 14 ? ' lg' : '') + '"><span class="g">' + esc(nm) + '</span></h2>' +
          '<div class="phdl">@' + esc(p.handle) + (p.area ? ' · <span>' + esc(p.area) + '</span>' : '') + '</div>' +
          '<div class="pbadges">' + (p.professor ? '<span class="tag prof">★ Professor</span>' : '<span class="tag">🎓 Aluno Global Academy</span>') + (mes ? '<span class="tag dim">Membro desde ' + mes + '</span>' : '') + '</div>' +
          (p.bio ? '<p class="bio">' + esc(p.bio) + '</p>' : (p.meu ? '<p class="bio vazio">Conte quem você é e o que procura. Toque em Editar perfil.</p>' : '')) +
          '<div class="nums">' + [['posts', p.posts], ['seguidores', p.seguidores], ['seguindo', p.seguindo]].map((n) => '<div><b class="g">' + num(n[1]) + '</b><span>' + n[0] + '</span></div>').join('') + '</div>' +
          '<div class="pbtn">' + (p.meu ? '<button class="btn ghost" data-editar>Editar perfil</button><button class="btn gold shine" data-postar>+ Postar</button>'
            : '<button class="btn ' + (p.sigo ? 'ghost' : 'gold shine') + '" data-seguir="' + esc(p.memberId) + '">' + (p.sigo ? '✓ Seguindo' : '+ Seguir') + '</button><button class="btn ghost" data-share="perfil:' + esc(p.handle) + '">Compartilhar</button>') + '</div></div>' +
          '<div class="ptabs"><span class="on">Posts</span></div>' +
          (this.posts.length ? '<div class="grid">' + this.posts.map((x) => '<button data-abrir="' + esc(x._id) + '">' + this.midia(x, true) + (x.tipo === 'video' ? '<i>▶</i>' : '') + '</button>').join('') + '</div>'
            : '<div class="pvazio"><div class="pvi">✦</div><b>' + (p.meu ? 'Seu mural começa aqui' : 'Nenhum post ainda') + '</b><span>' + (p.meu ? 'Poste um corte, uma narração ou uma arte e apareça para a comunidade.' : 'Quando ' + esc(nm) + ' postar, aparece aqui.') + '</span></div>') +
          '</div>';
      } else if (!this.perfil && this.u && this.ligado && !this.carregando) {
        centro = '<div class="box empty">Perfil não encontrado. <button class="more" data-voltar>Ir para o feed</button></div>';
      } else {
        centro = hero + quem + '<div class="tabs mob">' + tabs + '</div>' + compose + '<div class="feed tl">' + lista + '</div>' + mais;
      }
      var lado = '<div class="side"><div style="position:sticky;top:80px"><div class="nav">' + nav + '</div>' + (aluno ? '<button class="btn gold" data-postar style="width:100%;margin-top:14px">+ Postar</button>' : '<button class="btn gold" data-portao style="width:100%;margin-top:14px">Ser aluno e postar</button>') + '</div></div>';
      var dir = '<div class="side"><div style="position:sticky;top:80px;display:flex;flex-direction:column;gap:18px">' +
        '<div class="box card"><h3 class="g">Mais seguidos</h3>' + (this.top.slice(0, 6).map((p) => '<div class="who">' + this.av(p, 38) + '<button class="nm" data-perfil="' + esc(p.handle) + '"><b>' + esc(p.handle) + '</b><small>' + esc(p.area || (p.professor ? 'Professor' : 'Aluno')) + ' · ' + num(p.seguidores) + '</small></button></div>').join('') || '<p style="color:#cdb8ff;margin:0">Em breve.</p>') + '</div>' +
        '<div class="box card" style="font-size:14px;line-height:1.6;color:#cdb8ff"><b style="color:#fff">Regras da comunidade</b><br>Respeito sempre · Sem propaganda · Denuncie o que estiver errado</div></div></div>';
      var dock = aluno ? '<button class="btn gold fab" data-postar aria-label="Postar">' + ICO.plus + '</button>'
        : '<div class="dock"><button class="btn gold" data-portao>' + (this.s.logado ? 'Quero ser aluno e postar' : 'Entrar e postar · ser aluno') + '</button><small>Visitante vê tudo. Postar, curtir e comentar é para alunos.</small></div>';
      this.app.innerHTML = top + '<div class="wrap">' + lado + '<main>' + centro + '</main>' + dir + '</div>' + dock;
      var sent = this.r.getElementById('sent');
      if (this.io) this.io.disconnect();
      if (sent && 'IntersectionObserver' in window) {
        this.io = new IntersectionObserver((ents) => {
          if (!ents.some((e) => e.isIntersecting) || this.puxando) return;
          this.puxando = true;
          var lim = this.lim || 10;
          if (lim < this.totalItens) { this.lim = lim + 10; this.render(); this.puxando = false; }
          else if (!this.fim) { this.buscar(false).catch(() => {}).then(() => { this.lim = (this.lim || 10) + 10; this.puxando = false; this.render(); }); }
          else this.puxando = false;
        }, { rootMargin: '600px 0px' });
        this.io.observe(sent);
      }
    }
    portao() {
      var logado = this.s.logado;
      this.modal('<h3 class="g">Só para alunos</h3><p style="color:#efe6ff;line-height:1.5;margin:0 0 16px">Você pode ver tudo na comunidade. Para postar, curtir, comentar e seguir, entre como aluno da Global Academy.</p>' +
        '<div class="row">' + (logado ? '' : '<button class="btn ghost" data-m="entrar">Já sou aluno</button>') + '<button class="btn gold" data-m="aluno">Quero ser aluno</button></div>', (k) => {
        if (k === 'entrar') this.chamar('entrar').catch(() => {});
        if (k === 'aluno') this.chamar('virarAluno').catch(() => {});
        return true;
      });
    }
    modal(html, cb) {
      var ov = document.createElement('div'); ov.className = 'ov';
      ov.innerHTML = '<div class="box sh">' + html + '</div>';
      ov.addEventListener('click', (e) => {
        if (e.target === ov) return ov.remove();
        var b = e.target.closest('[data-m]'); if (!b) return;
        if (b.dataset.m === 'fechar') return ov.remove();
        Promise.resolve(cb && cb(b.dataset.m, ov, b)).then((fecha) => { if (fecha) ov.remove(); });
      });
      this.r.appendChild(ov); return ov;
    }
    async clique(e) {
      var b = e.target.closest('button,[data-postar]'); if (!b) return;
      var d = b.dataset;
      if (d.aba) { this.aba = d.aba; if (this.perfil) { this.perfil = null; history.pushState(null, '', location.pathname); } return this.buscar(true).catch((x) => this.erro(x)); }
      if (d.perfil != null) return this.abrirPerfil(d.perfil).catch((x) => this.erro(x));
      if (d.voltar != null) return this.voltarFeed();
      if (d.mais != null) return this.buscar(false).catch((x) => this.erro(x));
      if (d.portao != null) return this.portao();
      if (d.share && d.share.indexOf('perfil:') === 0) {
        var pu = location.origin + location.pathname + '?u=' + encodeURIComponent(d.share.slice(7));
        if (navigator.share) return navigator.share({ title: 'Perfil na Comunidade Global Academy', url: pu }).catch(() => {});
        try { await navigator.clipboard.writeText(pu); this.aviso('Link do perfil copiado!'); } catch (x) { this.aviso(pu); }
        return;
      }
      if (d.share) {
        var url = location.origin + location.pathname + '?p=' + d.share;
        if (navigator.share) return navigator.share({ title: 'Comunidade Global Academy', url: url }).catch(() => {});
        try { await navigator.clipboard.writeText(url); this.aviso('Link copiado!'); } catch (x) { this.aviso(url); }
        return;
      }
      if (d.abrir) { var p = this.posts.find((x) => x._id === d.abrir); if (p) this.modal('<button class="more" data-m="fechar" style="margin:0 0 12px">Fechar</button>' + this.cartao(p)); return; }
      if (!this.s.aluno && (d.curtir || d.seguir || d.postar != null || d.editar != null)) return this.portao();
      if (d.coment) return this.abrirComentarios(d.coment);
      if (d.denuncia) { if (!this.s.logado) return this.portao(); this.chamar('denunciar', { postId: d.denuncia, motivo: 'denúncia pelo botão' }).then(() => this.aviso('Recebemos a denúncia. Obrigado!')).catch((x) => this.erro(x)); return; }
      if (d.ocultar) { this.chamar('ocultar', d.ocultar).then(() => { this.posts = this.posts.filter((x) => x._id !== d.ocultar); this.render(); this.aviso('Post tirado do ar.'); }).catch((x) => this.erro(x)); return; }
      if (d.curtir) {
        var post = this.posts.find((x) => x._id === d.curtir); if (!post) return;
        post.curti = !post.curti; post.curtidas = (post.curtidas || 0) + (post.curti ? 1 : -1);
        b.classList.toggle('on', post.curti); b.classList.remove('pop'); void b.offsetWidth; if (post.curti) b.classList.add('pop');
        b.querySelector('span').textContent = num(post.curtidas);
        try { var r = await this.chamar('curtir', d.curtir); post.curti = r.curti; post.curtidas = r.curtidas; } catch (x) { post.curti = !post.curti; post.curtidas += post.curti ? 1 : -1; this.render(); this.erro(x); }
        return;
      }
      if (d.seguir) {
        try {
          var s = await this.chamar('seguir', d.seguir);
          if (this.perfil && this.perfil.memberId === d.seguir) { this.perfil.sigo = s.sigo; this.perfil.seguidores = s.seguidores; this.render(); }
          else { b.textContent = s.sigo ? 'Seguindo' : 'Seguir'; b.classList.toggle('on', s.sigo); }
          if (s.sigo) this.aviso('Agora você segue esse perfil!');
        } catch (x) { this.erro(x); }
        return;
      }
      if (d.postar != null) return this.abrirPostar();
      if (d.editar != null) return this.abrirEditar();
    }
    async abrirComentarios(postId) {
      var ov = this.modal('<h3 class="g">Comentários</h3><div id="cl"><p style="color:#cdb8ff">Carregando…</p></div>' +
        (this.s.aluno ? '<div class="cmi"><input class="fld" id="ct" maxlength="400" placeholder="Escreva um comentário"><button class="btn gold" data-m="env">Enviar</button></div>'
          : '<div class="lock" style="margin:10px -18px -18px">' + ICO.lock + '<span>Comentar: só alunos</span><button data-m="portao">Quero ser aluno</button></div>'), async (k, o) => {
        if (k === 'portao') { this.portao(); return true; }
        if (k !== 'env') return false;
        var inp = o.querySelector('#ct'); var t = inp.value.trim(); if (!t) return false;
        inp.value = '';
        try {
          var c = await this.chamar('comentar', { postId: postId, texto: t });
          var p = this.posts.find((x) => x._id === postId); if (p) { p.comentarios = (p.comentarios || 0) + 1; p.ultimos = (p.ultimos || []).concat([c]).slice(-2); }
          o.querySelector('#cl').insertAdjacentHTML('beforeend', '<p style="margin:0 0 10px"><b>' + esc(c.handle) + '</b> ' + esc(c.texto) + '</p>');
          this.render();
        } catch (x) { this.erro(x); }
        return false;
      });
      try {
        var lista = await this.chamar('comentarios', postId);
        ov.querySelector('#cl').innerHTML = lista.length ? lista.map((c) => '<p style="margin:0 0 10px"><b>' + esc(c.handle) + '</b> ' + esc(c.texto) + ' <small style="color:#9f8ad8">' + quando(c._createdDate) + '</small></p>').join('') : '<p style="color:#cdb8ff">Seja o primeiro a comentar.</p>';
      } catch (x) { ov.querySelector('#cl').innerHTML = '<p style="color:#ff8fa3">Não carregou agora.</p>'; }
    }
    abrirPostar() {
      var arq = null, tipo = 'imagem';
      var ov = this.modal('<h3 class="g">Novo post</h3>' +
        '<label class="drop" id="dz"><span style="font-size:30px">＋</span><b>Vídeo ou imagem (opcional)</b><small>Vídeo até ' + LIM.videoSeg + ' s e ' + LIM.videoMB + ' MB · imagem até ' + LIM.imagemMB + ' MB</small><input type="file" accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/webp" hidden id="fi"></label>' +
        '<select class="fld" id="ab">' + ABAS.slice(2).map((a) => '<option value="' + a[0] + '">' + a[1] + '</option>').join('') + '<option value="geral">Geral</option></select>' +
        '<textarea class="fld" id="lg" maxlength="600" placeholder="Legenda: conte o que você fez"></textarea>' +
        '<div class="prog" hidden id="pg"><i></i></div><p class="msg" id="ms"></p>' +
        '<div class="row"><button class="btn ghost" data-m="fechar">Cancelar</button><button class="btn gold" data-m="pub">Publicar</button></div>', async (k, o, btn) => {
        if (k !== 'pub') return false;
        var ms = o.querySelector('#ms');
        if (!arq && !o.querySelector('#lg').value.trim()) { ms.textContent = ERROS.SEM_MIDIA; return false; }
        btn.disabled = true; btn.textContent = 'Enviando…';
        try {
          var url = '';
          if (arq) { var up = await this.chamar('uploadUrl', { tipo: tipo === 'video' ? 'video' : 'imagem', nome: arq.name, mime: arq.type }); url = await this.enviar(arq, up, tipo, o.querySelector('#pg')); }
          var novo = await this.chamar('postar', { midia: url, tipo: tipo, legenda: o.querySelector('#lg').value, aba: o.querySelector('#ab').value });
          novo.autor = this.s.perfil; novo.ultimos = []; this.posts.unshift(novo);
          if (this.s.perfil) this.s.perfil.posts = (this.s.perfil.posts || 0) + 1;
          this.render(); this.aviso('Post publicado! 🔥'); return true;
        } catch (x) { btn.disabled = false; btn.textContent = 'Publicar'; ms.textContent = ERROS[String(x.message)] || 'Não deu certo o envio. Tente de novo.'; return false; }
      });
      ov.querySelector('#fi').addEventListener('change', (e) => {
        var f = e.target.files[0]; var ms = ov.querySelector('#ms'); ms.textContent = ''; if (!f) return;
        var ehVideo = /^video\//.test(f.type); var mb = f.size / 1048576;
        if (ehVideo ? mb > LIM.videoMB : mb > LIM.imagemMB) { ms.textContent = 'Arquivo grande demais (máximo ' + (ehVideo ? LIM.videoMB : LIM.imagemMB) + ' MB).'; return; }
        var u = URL.createObjectURL(f); var dz = ov.querySelector('#dz');
        if (ehVideo) {
          var v = document.createElement('video'); v.preload = 'metadata'; v.src = u;
          v.onloadedmetadata = () => {
            if (v.duration > LIM.videoSeg + 0.5) { ms.textContent = 'Vídeo longo demais (máximo ' + LIM.videoSeg + ' s). Corte o melhor trecho.'; return; }
            arq = f; tipo = 'video'; v.controls = true; v.muted = true; dz.innerHTML = ''; dz.appendChild(v);
          };
        } else { arq = f; tipo = 'imagem'; dz.innerHTML = '<img src="' + u + '" alt="">'; }
      });
    }
    enviar(arq, up, tipo, pg) {
      return new Promise((ok, no) => {
        var x = new XMLHttpRequest(); x.open('PUT', up.uploadUrl + (up.uploadUrl.indexOf('?') < 0 ? '?' : '&') + 'filename=' + encodeURIComponent(arq.name));
        x.setRequestHeader('Content-Type', arq.type);
        pg.hidden = false;
        x.upload.onprogress = (e) => { if (e.lengthComputable) pg.firstChild.style.width = Math.round(e.loaded / e.total * 100) + '%'; };
        x.onload = () => {
          try {
            var r = JSON.parse(x.responseText); var f = Array.isArray(r) ? r[0] : (r.file || r);
            var url = f.url || '';
            var fu = f.file_url || '';
            if (!url && fu) url = /^https?:/.test(fu) ? fu : (/^video\//.test(fu) ? 'https://video.wixstatic.com/' + fu : 'https://static.wixstatic.com/' + fu.replace(/^\/+/, ''));
            if (!url && f.file_name) url = (tipo === 'video' ? 'https://video.wixstatic.com/video/' + f.file_name.replace(/\.[^.]+$/, '') + '/file' : 'https://static.wixstatic.com/media/' + f.file_name);
            if (tipo === 'video' && f.media && f.media.video && f.media.video.resolutions && f.media.video.resolutions.length) {
              var rs = f.media.video.resolutions.slice().sort(function (a, b) { return (b.height || 0) - (a.height || 0); });
              url = (rs.find(function (v) { return (v.height || 0) <= 720; }) || rs[0]).url || url;
            }
            x.status < 300 && url ? ok(url) : no(new Error('UPLOAD'));
          } catch (e) { no(new Error('UPLOAD')); }
        };
        x.onerror = () => no(new Error('UPLOAD')); x.send(arq);
      });
    }
    abrirEditar() {
      var p = this.s.perfil || {};
      this.modal('<h3 class="g">Editar perfil</h3>' +
        '<input class="fld" id="eh" maxlength="24" placeholder="@ (ex.: bia.edits)" value="' + esc(p.handle) + '">' +
        '<input class="fld" id="en" maxlength="40" placeholder="Nome" value="' + esc(p.nome) + '">' +
        '<input class="fld" id="ea" maxlength="40" placeholder="Área (ex.: Narração, Edição de vídeo)" value="' + esc(p.area) + '">' +
        '<textarea class="fld" id="eb" maxlength="220" placeholder="Bio: quem é você e o que procura">' + esc(p.bio) + '</textarea><p class="msg" id="ms"></p>' +
        '<div class="row"><button class="btn ghost" data-m="fechar">Cancelar</button><button class="btn gold" data-m="sv">Salvar</button></div>', async (k, o) => {
        if (k !== 'sv') return false;
        try {
          var n = await this.chamar('editarPerfil', { handle: o.querySelector('#eh').value, nome: o.querySelector('#en').value, area: o.querySelector('#ea').value, bio: o.querySelector('#eb').value });
          this.s.perfil = n; await this.abrirPerfil(n.handle); this.aviso('Perfil atualizado!'); return true;
        } catch (x) { o.querySelector('#ms').textContent = ERROS[String(x.message)] || 'Não salvou. Tente de novo.'; return false; }
      });
    }
  }
  customElements.define('ga-comunidade', GaComunidade);
})();
