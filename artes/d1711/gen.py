import base64, os, sys
from playwright.sync_api import sync_playwright
D = os.path.dirname(os.path.abspath(__file__))
FD = '/tmp/claude-0/fonts'
def b64(p, mime): return f"data:{mime};base64," + base64.b64encode(open(p, 'rb').read()).decode()
def L(k): return b64(f"{D}/logos/{k}.png", "image/png")
def font(fam, w):
    pk = 'fontsource-barlow-condensed-5.2.6' if fam == 'Barlow Condensed' else 'fontsource-barlow-5.2.5'
    import glob
    f = glob.glob(f"{FD}/fontsource-{'barlow-condensed' if fam=='Barlow Condensed' else 'barlow'}-*/package/files/{'barlow-condensed' if fam=='Barlow Condensed' else 'barlow'}-latin-{w}-normal.woff2")[0]
    return f"@font-face{{font-family:'{fam}';font-weight:{w};src:url({b64(f,'font/woff2')})}}"
FONTS = ''.join(font('Barlow Condensed', w) for w in (600, 700, 800, 900)) + ''.join(font('Barlow', w) for w in (500, 600, 700))
STAMP = "Dados: globalproesports.com · lidos em 17/11/2026, 10h30 (Brasília)"

CSS = FONTS + """
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;overflow:hidden;background:#050505;font-family:Barlow,sans-serif;color:#fff}
.art{position:relative;width:1080px;height:1350px;overflow:hidden;
 background:radial-gradient(ellipse 70% 45% at 50% 0%,rgba(255,206,110,.20),transparent 70%),
 radial-gradient(ellipse 60% 40% at 50% 100%,rgba(212,160,60,.13),transparent 70%),#060606}
.beam{position:absolute;top:-200px;width:260px;height:1100px;background:linear-gradient(180deg,rgba(255,215,130,.22),rgba(255,215,130,0) 80%);filter:blur(18px);transform-origin:top center}
.b1{left:120px;transform:rotate(18deg)}.b2{right:120px;transform:rotate(-18deg)}.b3{left:410px;width:260px;opacity:.55}
.frame{position:absolute;inset:26px;border:1.5px solid rgba(214,172,88,.55)}
.c{position:absolute;width:46px;height:46px;border-color:#e8c46c;border-style:solid}
.tl{top:18px;left:18px;border-width:4px 0 0 4px}.tr{top:18px;right:18px;border-width:4px 4px 0 0}
.bl{bottom:18px;left:18px;border-width:0 0 4px 4px}.br{bottom:18px;right:18px;border-width:0 4px 4px 0}
.topbar{position:absolute;top:26px;left:50%;transform:translateX(-50%);width:300px;height:5px;background:linear-gradient(90deg,transparent,#f3d27a,transparent)}
.brand{position:absolute;top:58px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:26px}
.brand img.g{height:62px}.brand img.u{height:78px}.brand .sep{width:2px;height:62px;background:linear-gradient(#0000,#e8c46c,#0000)}
.fc{position:absolute;top:66px;right:62px;font:900 30px/1 'Barlow Condensed';letter-spacing:.02em;color:#fff;border:2px solid #e8c46c;padding:6px 10px 4px;border-radius:4px}
.fc b{color:#f3cf74}
.chip{display:inline-flex;align-items:center;gap:14px;padding:8px 26px 8px 10px;border:1.5px solid #d9b260;border-radius:999px;background:linear-gradient(180deg,rgba(255,215,120,.10),rgba(0,0,0,.4));font:800 26px/1 'Barlow Condensed';letter-spacing:.14em;text-transform:uppercase}
.chip img{height:74px;margin:-12px 0}.chip span{color:#f3cf74}
.ttl{font:900 112px/.9 'Barlow Condensed';text-transform:uppercase;letter-spacing:-.005em;text-align:center}
.gold{background:linear-gradient(180deg,#fff1b8 0%,#f3cf74 40%,#c8902e 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{font:700 30px/1.2 'Barlow Condensed';letter-spacing:.16em;text-transform:uppercase;color:#e9dcc0;text-align:center}
.card{border:2px solid #d4ab5a;border-radius:18px;background:linear-gradient(180deg,rgba(255,220,140,.08),rgba(0,0,0,.55));box-shadow:0 0 30px rgba(230,180,80,.15),inset 0 0 0 1px rgba(255,230,160,.08)}
.foot{position:absolute;bottom:56px;left:104px;right:104px;display:flex;justify-content:space-between;align-items:flex-end}
.foot .h{font:700 24px/1 Barlow;color:#d9c9a3;letter-spacing:.02em}
.foot .ar{font:900 34px/1 'Barlow Condensed';letter-spacing:.12em;color:#f3cf74}
.stamp{position:absolute;bottom:98px;left:0;right:0;text-align:center;font:500 18px/1 Barlow;color:#8f8470}
.cta{font:800 34px/1.15 'Barlow Condensed';text-align:center;letter-spacing:.04em;text-transform:uppercase}
.cta b{color:#f3cf74}
"""
def shell(inner, arrow=True, chip=None):
    ch = f'<div style="position:absolute;top:168px;left:0;right:0;text-align:center">{chip}</div>' if chip else ''
    return f"""<!doctype html><html><head><meta charset=utf-8><style>{CSS}</style></head><body><div class=art>
<div class="beam b1"></div><div class="beam b2"></div><div class="beam b3"></div>
<div class=frame><div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c br"></div></div>
<div class=topbar></div>
<div class=brand><img class=g src="{L('global')}"><div class=sep></div><img class=u src="{L('ulisses')}"></div>
<div class=fc>FC<b>27</b></div>{ch}
{inner}
<div class=stamp>{STAMP}</div>
<div class=foot><div class=h>@globalproesports · @ulissescostatv</div><div class=ar>{'ARRASTA →' if arrow else ''}</div></div>
</div></body></html>"""

def render(slides, outdir):
    outdir=os.path.abspath(outdir); os.makedirs(outdir, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=1)
        for name, html in slides:
            hp = f"{outdir}/{name}.html"; open(hp, 'w').write(html)
            pg.goto('file://' + hp); pg.wait_for_timeout(300)
            pg.screenshot(path=f"{outdir}/{name}.png")
            from PIL import Image
            Image.open(f"{outdir}/{name}.png").convert('RGB').save(f"{outdir}/{name}.jpg", quality=86, optimize=True, progressive=True)
            os.remove(f"{outdir}/{name}.png"); os.remove(hp)
        b.close()
