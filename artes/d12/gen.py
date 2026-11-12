import asyncio, os, sys
from playwright.async_api import async_playwright

A = 'file:///home/claude/sitevendas/assets/site/'
F = 'file:///tmp/claude-0/-home-claude-sitevendas/a6abf365-80a7-5ed2-af68-ee526eb254a9/scratchpad/fonts/'
OUT = '/home/claude/sitevendas/artes/d12/'
LIDO = 'Dados oficiais globalproesports.com · lidos em 12/11/2026 às 9h20 (Brasília)'

def L(n): return A + n + '_c.png'

THEMES = {
 'pro': dict(acc1='#ffe08a', acc2='#f5b729', acc3='#c98a12', edge='#7b3fd6', glowA='rgba(245,183,41,.30)', glowB='rgba(123,63,214,.55)',
             chip='#1d1550', chipfg='#ffd36b', border='rgba(255,201,77,.75)', tag='#DIVISIONPRO', camp='DIVISION PRO', troph='tpro', rays=False),
 'br':  dict(acc1='#f1c6ff', acc2='#c77dff', acc3='#9b30ff', edge='#9b30ff', glowA='rgba(199,125,255,.38)', glowB='rgba(155,48,255,.55)',
             chip='#2a1660', chipfg='#e3b8ff', border='rgba(199,125,255,.85)', tag='#LIGABRPRO', camp='LIGA BRPRO', troph='tbr', rays=True),
}

def page(theme, chip1, title1, title2, body, variant=0, title_size=150, last=False):
    t = THEMES[theme]
    # vary the glow positions between slides
    gpos = [('18% 22%', '88% 78%', '80% 18%'), ('82% 30%', '12% 85%', '30% 10%'), ('50% 12%', '90% 60%', '8% 55%')][variant % 3]
    rays = ''
    if t['rays']:
        rays = f'''<div class="rays"></div>'''
    hexa = "data:image/svg+xml;utf8," + ("<svg xmlns='http://www.w3.org/2000/svg' width='56' height='97'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L28 97' fill='none' stroke='white' stroke-opacity='0.05' stroke-width='1.2'/></svg>").replace('#', '%23')
    arrow = '' if last else '<div class="arr">ARRASTA →</div>'
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:BC;font-weight:600;src:url({F}fontsource-barlow-condensed-5.3.0/files/barlow-condensed-latin-600-normal.woff2)}}
@font-face{{font-family:BC;font-weight:700;src:url({F}fontsource-barlow-condensed-5.3.0/files/barlow-condensed-latin-700-normal.woff2)}}
@font-face{{font-family:BC;font-weight:800;src:url({F}fontsource-barlow-condensed-5.3.0/files/barlow-condensed-latin-800-normal.woff2)}}
@font-face{{font-family:BC;font-weight:900;src:url({F}fontsource-barlow-condensed-5.3.0/files/barlow-condensed-latin-900-normal.woff2)}}
@font-face{{font-family:B;font-weight:500;src:url({F}fontsource-barlow-5.3.0/files/barlow-latin-500-normal.woff2)}}
@font-face{{font-family:B;font-weight:700;src:url({F}fontsource-barlow-5.3.0/files/barlow-latin-700-normal.woff2)}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1080px;height:1350px;overflow:hidden;font-family:BC;color:#f6f0e6;position:relative;
 background:
  radial-gradient(ellipse 620px 520px at {gpos[0]}, {t['glowA']}, transparent 70%),
  radial-gradient(ellipse 700px 600px at {gpos[1]}, {t['glowB']}, transparent 70%),
  radial-gradient(ellipse 500px 420px at {gpos[2]}, rgba(255,255,255,.06), transparent 70%),
  radial-gradient(ellipse 1300px 900px at 50% 45%, #2a1757 0%, #1a0e3c 55%, #0e0726 100%);}}
.hex{{position:absolute;inset:0;background-image:url("{hexa}");opacity:.9;
 -webkit-mask-image:radial-gradient(ellipse 600px 500px at {gpos[1]}, #000, transparent 75%)}}
.rays{{position:absolute;inset:-200px;background:conic-gradient(from 200deg at 75% 0%, transparent 0 8deg, rgba(199,125,255,.10) 10deg, transparent 14deg 22deg, rgba(199,125,255,.08) 25deg, transparent 29deg 40deg, rgba(255,255,255,.06) 43deg, transparent 47deg);filter:blur(6px)}}
.edgeL{{position:absolute;left:0;top:0;bottom:0;width:160px;background:linear-gradient(90deg,{t['edge']}55,transparent)}}
.edgeR{{position:absolute;right:0;top:0;bottom:0;width:160px;background:linear-gradient(-90deg,{t['edge']}55,transparent)}}
.c{{position:absolute;width:58px;height:58px;border-color:{t['acc2']};border-style:solid;opacity:.85}}
.c1{{left:22px;top:22px;border-width:3px 0 0 3px}}.c2{{right:22px;top:22px;border-width:3px 3px 0 0}}
.c3{{left:22px;bottom:22px;border-width:0 0 3px 3px}}.c4{{right:22px;bottom:22px;border-width:0 3px 3px 0}}
.frame{{position:absolute;inset:34px;border:1px solid {t['border']};opacity:.35;border-radius:2px}}
.topbar{{position:absolute;left:0;right:0;top:0;height:8px;background:linear-gradient(90deg,{t['acc3']},{t['acc1']},{t['acc3']})}}
.head{{position:absolute;left:66px;top:58px;display:flex;align-items:center;gap:26px;height:110px}}
.head .g{{height:62px}} .head .u{{height:98px}}
.head .bar{{width:3px;height:70px;background:linear-gradient({t['acc1']},{t['acc3']});border-radius:2px}}
.fc{{position:absolute;right:70px;top:86px;height:48px}}
.chips{{position:absolute;left:66px;top:184px;display:flex;gap:12px}}
.chip{{font:700 25px/1 BC;letter-spacing:.14em;padding:13px 22px;border-radius:30px;text-transform:uppercase}}
.chip.r{{background:#ff2d55;color:#fff}}
.chip.n{{background:{t['chip']};color:{t['chipfg']};border:1.5px solid {t['border']}}}
.title{{position:absolute;left:62px;top:248px;width:720px;font:900 {title_size}px/0.88 BC;text-transform:uppercase;letter-spacing:-.005em;white-space:nowrap}}
.title .w{{display:block;color:#fbf6ec;text-shadow:0 4px 30px rgba(0,0,0,.35)}}
.title .h{{display:block;background:linear-gradient(180deg,{t['acc1']} 0%,{t['acc2']} 55%,{t['acc3']} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 22px {t['glowA']})}}
.trophy{{position:absolute;right:58px;top:200px;width:250px;height:290px;display:flex;align-items:center;justify-content:center}}
.trophy img{{max-width:100%;max-height:100%;filter:drop-shadow(0 0 30px {t['glowB']})}}
.card{{background:linear-gradient(160deg,rgba(40,24,90,.92),rgba(18,10,46,.95));border:2px solid {t['border']};border-radius:18px;box-shadow:0 0 0 1px rgba(0,0,0,.4),0 18px 40px rgba(0,0,0,.35)}}
.gold{{background:linear-gradient(180deg,{t['acc1']},{t['acc2']} 60%,{t['acc3']});-webkit-background-clip:text;background-clip:text;color:transparent}}
.lbl{{font:700 24px/1 BC;letter-spacing:.2em;color:{t['acc2']};text-transform:uppercase}}
.note{{position:absolute;left:66px;bottom:104px;font:500 17px/1 B;color:rgba(230,220,255,.55)}}
.foot{{position:absolute;left:66px;right:66px;bottom:44px;border-top:1px solid rgba(255,255,255,.18);padding-top:20px;display:flex;justify-content:space-between;align-items:center}}
.foot .hd{{font:500 25px/1 B;color:rgba(240,232,255,.85)}}
.foot .tg{{font:800 27px/1 BC;letter-spacing:.16em;color:{t['acc2']}}}
.arr{{position:absolute;right:66px;bottom:100px;font:800 24px/1 BC;letter-spacing:.18em;color:{t['acc1']}}}
.logo{{object-fit:contain;filter:drop-shadow(0 6px 14px rgba(0,0,0,.45))}}
{body[1]}
</style></head><body>
<div class="hex"></div>{rays}<div class="edgeL"></div><div class="edgeR"></div>
<div class="topbar"></div><div class="frame"></div><div class="c c1"></div><div class="c c2"></div><div class="c c3"></div><div class="c c4"></div>
<div class="head"><img class="g" src="{L('global')}"><div class="bar"></div><img class="u" src="{L('ulisses')}"></div>
<img class="fc" src="{A}fc27_t.png">
<div class="chips"><div class="chip r">{chip1}</div><div class="chip n">{t['camp']}</div></div>
<div class="title"><span class="w">{title1}</span><span class="h">{title2}</span></div>
<div class="trophy"><img src="{L(t['troph'])}"></div>
{body[0]}
<div class="note">{LIDO}</div>{arrow}
<div class="foot"><div class="hd">@globalproesports · @ulissescostatv</div><div class="tg">{t['tag']}</div></div>
</body></html>'''

# ---------------- DIVISION PRO ----------------
pro1 = ('''
<div class="sub">3º × 4º da Division Pro, hoje às 22h10</div>
<div class="vs card">
  <div class="side"><img class="logo big" src="%s"><div class="nm">VIKINGS</div><div class="ps">3º · 13 PTS</div>
     <div class="badge"><b>14</b> GOLS MARCADOS<span>melhor ataque da liga</span></div></div>
  <div class="mid"><div class="x gold">VS</div><div class="hr">22H10</div></div>
  <div class="side"><img class="logo big" src="%s"><div class="nm">BLX</div><div class="ps">4º · 10 PTS</div>
     <div class="badge"><b>0</b> DERROTAS<span>invicto em 6 jogos</span></div></div>
</div>
<div class="cta">PALPITE: <b>1</b> VIKINGS · <b>X</b> EMPATE · <b>2</b> BLX <span>COMENTA</span></div>
''' % (L('vikings'), L('blx')), '''
.sub{position:absolute;left:66px;top:468px;font:700 40px/1 BC;color:#f3ead8}
.vs{position:absolute;left:66px;right:66px;top:540px;height:530px;display:flex;align-items:center;justify-content:space-between;padding:0 40px}
.side{width:330px;display:flex;flex-direction:column;align-items:center;text-align:center}
.big{width:240px;height:240px}
.nm{font:900 54px/1 BC;margin-top:14px;letter-spacing:.02em}
.ps{font:700 26px/1 BC;letter-spacing:.16em;color:#ffd36b;margin-top:8px}
.badge{margin-top:20px;border:1.5px solid rgba(255,201,77,.7);border-radius:12px;padding:12px 18px;font:700 24px/1.1 BC;letter-spacing:.06em;background:rgba(255,201,77,.08)}
.badge b{font:900 40px/1 BC;color:#ffd36b;margin-right:6px}
.badge span{display:block;font:500 19px/1.2 B;letter-spacing:0;color:rgba(240,232,255,.75);margin-top:4px}
.mid{text-align:center}.x{font:900 120px/1 BC}.hr{font:800 30px/1 BC;letter-spacing:.14em;color:#fff;background:#ff2d55;padding:8px 16px;border-radius:8px;margin-top:6px}
.cta{position:absolute;left:66px;right:66px;top:1112px;height:96px;border-radius:16px;background:linear-gradient(90deg,#f5b729,#ffe08a,#f5b729);color:#1b0f3d;display:flex;align-items:center;justify-content:center;gap:10px;font:800 38px/1 BC;letter-spacing:.04em}
.cta b{font-weight:900;background:#1b0f3d;color:#ffd36b;border-radius:8px;padding:2px 12px;margin:0 2px}
.cta span{font:700 26px/1 BC;letter-spacing:.08em;margin-left:10px}
''')

rows = [('PONTOS', '13', '10', 13, 10, 1), ('VITÓRIAS', '4', '2', 4, 2, 1), ('EMPATES', '1', '4', 1, 4, 0), ('DERROTAS', '1', '0', 1, 0, -1),
        ('GOLS MARCADOS', '14', '8', 14, 8, 1), ('GOLS SOFRIDOS', '8', '4', 8, 4, -1), ('SALDO', '+6', '+4', 6, 4, 1), ('APROVEITAMENTO', '72%', '56%', 72, 56, 1)]
rh = ''
for lab, a, b, va, vb, better in rows:
    m = max(va, vb) or 1
    wa, wb = va / m * 100, vb / m * 100
    ca = 'win' if (better == 1 and va > vb) or (better == -1 and va < vb) else ''
    cb = 'win' if (better == 1 and vb > va) or (better == -1 and vb < va) else ''
    rh += f'<div class="row"><div class="va {ca}">{a}</div><div class="bl"><i class="{ca}" style="width:{wa:.0f}%"></i></div><div class="lb">{lab}</div><div class="br"><i class="{cb}" style="width:{wb:.0f}%"></i></div><div class="vb {cb}">{b}</div></div>'
pro2 = (f'''
<div class="sub">Os números de cada um em 6 jogos na Division Pro</div>
<div class="cmp card">
 <div class="hd2"><div class="tm"><img class="logo" src="{L('vikings')}"><span>VIKINGS</span></div><div class="vv">×</div><div class="tm r"><span>BLX</span><img class="logo" src="{L('blx')}"></div></div>
 {rh}
</div>
<div class="leg">Dourado: quem leva vantagem no número</div>
''', '''
.sub{position:absolute;left:66px;top:520px;font:700 36px/1 BC;color:#f3ead8}
.cmp{position:absolute;left:66px;right:66px;top:580px;padding:18px 30px 12px}
.hd2{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.tm{display:flex;align-items:center;gap:16px;font:900 46px/1 BC}.tm img{width:84px;height:84px}
.vv{font:900 50px/1 BC;color:#ffd36b}
.row{display:grid;grid-template-columns:76px 1fr 220px 1fr 76px;gap:0 10px;align-items:center;height:52px;border-top:1px solid rgba(255,255,255,.08)}
.va,.vb{font:800 36px/1 BC;color:rgba(246,240,230,.7)}.va{text-align:left}.vb{text-align:right}
.va.win,.vb.win{color:#ffd36b}
.lb{text-align:center;font:700 22px/1 BC;letter-spacing:.14em;color:rgba(240,232,255,.85)}
.bl,.br{display:flex;height:14px}.bl{justify-content:flex-end}.br{justify-content:flex-start}
.bl i,.br i{display:block;height:14px;border-radius:7px;background:rgba(200,185,255,.35)}
.bl i.win,.br i.win{background:linear-gradient(90deg,#c98a12,#ffe08a)}
.leg{position:absolute;right:66px;top:1188px;font:500 20px/1 B;color:rgba(240,232,255,.6)}
''')

def mrow(hr, a, an, b, bn, tagtxt=''):
    return f'''<div class="m card"><div class="h">{hr}</div><div class="t"><img class="logo" src="{L(a)}"><span>{an}</span></div><div class="x">×</div><div class="t r"><span>{bn}</span><img class="logo" src="{L(b)}"></div></div>'''
pro3 = (f'''
<div class="sub">Depois do confronto direto, cada um tem mais um jogo na quinta</div>
<div class="ml">
{mrow('22H10', 'blx', 'BLX', 'vikings', 'VIKINGS')}
{mrow('22H40', 'bronx', 'THE BRONX', 'blx', 'BLX')}
{mrow('22H40', 'maquina', 'MÁQUINA', 'vikings', 'VIKINGS')}
</div>
<div class="poll card"><div class="q">ENQUETE NOS STORIES</div><div class="qq">Quem sai da quinta com mais pontos?</div>
<div class="op"><div><img class="logo" src="{L('vikings')}">VIKINGS</div><div><img class="logo" src="{L('blx')}">BLX</div></div></div>
''', '''
.sub{position:absolute;left:66px;top:520px;width:950px;font:700 34px/1.1 BC;color:#f3ead8}
.ml{position:absolute;left:66px;right:66px;top:590px;display:flex;flex-direction:column;gap:16px}
.m{height:112px;display:grid;grid-template-columns:120px 1fr 60px 1fr;align-items:center;padding:0 26px}
.m .h{font:800 28px/1 BC;letter-spacing:.1em;color:#fff;background:#ff2d55;border-radius:8px;padding:8px 0;text-align:center;width:100px}
.m .t{display:flex;align-items:center;gap:16px;font:900 40px/1 BC}.m .t.r{justify-content:flex-end}.m .t img{width:78px;height:78px}
.m .x{text-align:center;font:900 40px/1 BC;color:#ffd36b}
.poll{position:absolute;left:66px;right:66px;top:1000px;height:200px;padding:20px 30px;text-align:center;border-color:#ffd36b}
.q{font:700 22px/1 BC;letter-spacing:.24em;color:#ffd36b}.qq{font:900 44px/1.05 BC;margin-top:10px}
.op{display:flex;justify-content:center;gap:30px;margin-top:16px}.op div{display:flex;align-items:center;gap:12px;font:800 32px/1 BC;background:rgba(255,201,77,.12);border:1.5px solid rgba(255,201,77,.6);border-radius:40px;padding:6px 26px 6px 8px}
.op img{width:52px;height:52px}
''')

# ---------------- LIGA BRPRO ----------------
def g3(n, hr, a, an, ap, b, bn, bp):
    return f'''<div class="gm card"><div class="n">{n}</div><div class="h">{hr}</div>
<div class="t"><img class="logo" src="{L(a)}"><div><span>{an}</span><em>{ap}</em></div></div><div class="x">×</div>
<div class="t r"><div><span>{bn}</span><em>{bp}</em></div><img class="logo" src="{L(b)}"></div></div>'''
br1 = (f'''
<div class="sub">Os últimos jogos do calendário da fase de liga</div>
<div class="gl">
{g3(1, '23H10', 'evo', 'EVOLUTION', '4º · 24 PTS', 'vibe', 'VIBE', '1º · 36 PTS')}
{g3(2, '23H10', 'flb', 'FLB', '3º · 25 PTS', 'bronx', 'THE BRONX', '2º · 31 PTS')}
{g3(3, '23H40', 'mx', 'M.X GAMING', '7º · 18 PTS', 'flb', 'FLB', '3º · 25 PTS')}
</div>
<div class="cta">QUAL JOGO DECIDE A NOITE? COMENTA <b>1</b> <b>2</b> OU <b>3</b></div>
''', '''
.sub{position:absolute;left:66px;top:532px;font:700 38px/1 BC;color:#f3e8ff}
.gl{position:absolute;left:66px;right:66px;top:600px;display:flex;flex-direction:column;gap:18px}
.gm{position:relative;height:150px;display:grid;grid-template-columns:1fr 70px 1fr;align-items:center;padding:0 30px 0 92px}
.gm .n{position:absolute;left:0;top:0;bottom:0;width:70px;display:flex;align-items:center;justify-content:center;font:900 56px/1 BC;color:#1a0e3c;background:linear-gradient(180deg,#f1c6ff,#c77dff 60%,#9b30ff);border-radius:16px 0 0 16px}
.gm .h{position:absolute;left:50%;top:-14px;transform:translateX(-50%);font:800 22px/1 BC;letter-spacing:.12em;background:#1a0e3c;border:1.5px solid rgba(199,125,255,.85);color:#e3b8ff;padding:6px 14px;border-radius:20px}
.gm .t{display:flex;align-items:center;gap:16px}.gm .t.r{justify-content:flex-end;text-align:right}
.gm .t img{width:104px;height:104px}
.gm .t span{display:block;font:900 40px/1 BC}.gm .t em{display:block;font:700 22px/1 BC;font-style:normal;letter-spacing:.12em;color:#d9a8ff;margin-top:6px}
.gm .x{text-align:center;font:900 46px/1 BC;color:#c77dff}
.cta{position:absolute;left:66px;right:66px;top:1124px;height:88px;border-radius:16px;background:linear-gradient(90deg,#9b30ff,#c77dff,#9b30ff);display:flex;align-items:center;justify-content:center;gap:10px;font:800 36px/1 BC;letter-spacing:.05em;color:#fff;box-shadow:0 0 30px rgba(155,48,255,.5)}
.cta b{background:#fff;color:#4a1590;border-radius:8px;padding:2px 14px;font-weight:900}
''')

br2 = (f'''
<div class="sub">O líder em gols e o líder em assistências se encontram às 23h40</div>
<div class="duo">
 <div class="pc card"><div class="lbl">ARTILHEIRO</div><img class="logo" src="{L('mx')}"><div class="num">14</div><div class="u">GOLS EM 8 JOGOS</div><div class="id">rafinharibeiro14</div><div class="tm">M.X GAMING</div></div>
 <div class="vsx"><div class="gold">VS</div><span>23H40</span></div>
 <div class="pc card"><div class="lbl">GARÇOM</div><img class="logo" src="{L('flb')}"><div class="num">11</div><div class="u">ASSISTÊNCIAS EM 8 JOGOS</div><div class="id">zR10Igor</div><div class="tm">FLB ES</div></div>
</div>
<div class="cta">QUEM DECIDE O JOGO? COMENTA <b>GOL</b> OU <b>PASSE</b></div>
''', '''
.sub{position:absolute;left:66px;top:532px;width:950px;font:700 36px/1.05 BC;color:#f3e8ff}
.duo{position:absolute;left:66px;right:66px;top:610px;display:grid;grid-template-columns:1fr 110px 1fr;align-items:center}
.pc{height:490px;display:flex;flex-direction:column;align-items:center;padding-top:26px;text-align:center}
.pc img{width:128px;height:128px;margin-top:14px}
.num{font:900 118px/0.9 BC;margin-top:10px;background:linear-gradient(180deg,#fff,#f1c6ff 50%,#c77dff);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 18px rgba(199,125,255,.5))}
.u{font:700 22px/1 BC;letter-spacing:.16em;color:#d9a8ff;margin-top:6px}
.id{margin-top:16px;width:86%;background:#c77dff;color:#1a0e3c;font:900 38px/1 BC;padding:12px 0;border-radius:6px}
.tm{font:700 26px/1 BC;letter-spacing:.06em;margin-top:12px}
.vsx{text-align:center}.vsx div{font:900 74px/1 BC;background:linear-gradient(180deg,#f1c6ff,#c77dff);-webkit-background-clip:text;background-clip:text;color:transparent}
.vsx span{display:inline-block;margin-top:8px;font:800 22px/1 BC;letter-spacing:.1em;background:#ff2d55;color:#fff;padding:6px 10px;border-radius:6px}
.cta{position:absolute;left:66px;right:66px;top:1124px;height:88px;border-radius:16px;background:linear-gradient(90deg,#9b30ff,#c77dff,#9b30ff);display:flex;align-items:center;justify-content:center;gap:10px;font:800 36px/1 BC;letter-spacing:.05em;color:#fff;box-shadow:0 0 30px rgba(155,48,255,.5)}
.cta b{background:#fff;color:#4a1590;border-radius:8px;padding:2px 14px;font-weight:900}
''')

tb = [('1', 'vibe', 'VIBE', 36, 15, 11, 3, 1, '+29'), ('2', 'bronx', 'THE BRONX', 31, 13, 10, 1, 2, '+20'), ('3', 'flb', 'FLB', 25, 14, 6, 7, 1, '+23'),
      ('4', 'evo', 'EVOLUTION', 24, 13, 7, 3, 3, '+11'), ('5', 'maquina', 'MÁQUINA', 21, 13, 7, 0, 6, '+10')]
trs = ''.join(f'<div class="tr"><div class="p">{p}º</div><div class="tn"><img class="logo" src="{L(k)}"><span>{n}</span></div><div class="pt">{pt}</div><div>{j}</div><div>{v}</div><div>{e}</div><div>{d}</div><div>{sg}</div></div>' for p, k, n, pt, j, v, e, d, sg in tb)
br3 = (f'''
<div class="sub">Como chega o top 5 para a noite de quinta</div>
<div class="tab card"><div class="tr th"><div>#</div><div class="tn">EQUIPE</div><div class="pt">PTS</div><div>J</div><div>V</div><div>E</div><div>D</div><div>SG</div></div>{trs}</div>
<div class="cta">MARCA O SEU CLUBE E MANDA O PALPITE</div>
''', '''
.sub{position:absolute;left:66px;top:532px;font:700 38px/1 BC;color:#f3e8ff}
.tab{position:absolute;left:66px;right:66px;top:600px;padding:10px 26px}
.tr{display:grid;grid-template-columns:70px 1fr 100px 60px 60px 60px 60px 80px;align-items:center;height:86px;border-top:1px solid rgba(255,255,255,.09);font:800 34px/1 BC;text-align:center}
.tr.th{height:46px;border-top:0;font:700 22px/1 BC;letter-spacing:.14em;color:#d9a8ff}
.tr .tn{display:flex;align-items:center;gap:16px;text-align:left;font:900 38px/1 BC}.tr.th .tn{font:700 22px/1 BC}
.tr .tn img{width:68px;height:68px}
.tr .p{color:#c77dff;font-weight:900}
.tr .pt{font:900 42px/1 BC;color:#f1c6ff}
.cta{position:absolute;left:66px;right:66px;top:1124px;height:88px;border-radius:16px;background:linear-gradient(90deg,#9b30ff,#c77dff,#9b30ff);display:flex;align-items:center;justify-content:center;gap:10px;font:800 36px/1 BC;letter-spacing:.05em;color:#fff;box-shadow:0 0 30px rgba(155,48,255,.5)}
''')

SLIDES = {
 'pro-1': page('pro', 'QUI 12/11 · 22H10', 'O MELHOR ATAQUE', 'PEGA O INVICTO', pro1, 0, 104),
 'pro-2': page('pro', 'QUI 12/11 · CARA A CARA', 'VIKINGS', '× BLX', pro2, 1, 150),
 'pro-3': page('pro', 'QUI 12/11 · RODADA DUPLA', 'A NOITE', 'NÃO PARA AÍ', pro3, 2, 130, last=True),
 'br-1': page('br', 'QUI 12/11 · 23H10 E 23H40', 'QUINTA DE', 'DECISÃO', br1, 0, 150),
 'br-2': page('br', 'DESTAQUES DO MOMENTO', 'ARTILHEIRO', '× GARÇOM', br2, 1, 140),
 'br-3': page('br', 'QUI 12/11 · CLASSIFICAÇÃO', 'O TOP 5', 'CHEGA ASSIM', br3, 2, 140, last=True),
}

async def main():
    only = sys.argv[1:]
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=1)
        for k, html in SLIDES.items():
            if only and k not in only: continue
            fn = OUT + k + '.html'; open(fn, 'w').write(html)
            await pg.goto('file://' + fn); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=OUT + k + '.png')
        await b.close()
asyncio.run(main())
