from gen import *
chip = f'<div class=chip><img src="{L("tdp")}">DIVISION <span>PRO</span> · ELITE</div>'

def team_card(k, name, pos, pts, j, extra=''):
    return f"""<div class=card style="width:290px;padding:26px 16px 22px;text-align:center;position:relative">
<div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:#0a0a0a;border:2px solid #d4ab5a;border-radius:999px;padding:6px 20px;font:900 32px/1 'Barlow Condensed'"><span class=gold>{pos}º</span></div>
<img src="{L(k)}" style="width:190px;height:190px;object-fit:contain;margin-top:6px">
<div style="font:900 40px/1 'Barlow Condensed';text-transform:uppercase;margin-top:10px">{name}</div>
<div style="font:900 92px/1 'Barlow Condensed';margin-top:6px" class=gold>{pts}</div>
<div style="font:700 22px/1 'Barlow Condensed';letter-spacing:.18em;color:#cdbb92">PONTOS · {j} JOGOS</div>{extra}</div>"""

s1 = shell(f"""
<div style="position:absolute;top:268px;left:0;right:0">
<div class=ttl>TRÊS NA <span class=gold>PONTA</span></div>
<div class=sub style="margin-top:18px">1 ponto separa o topo da Division Pro</div></div>
<div style="position:absolute;top:530px;left:0;right:0;display:flex;justify-content:center;gap:34px">
{team_card('ressaca','Ressaca',1,23,9)}{team_card('vikings','Vikings',2,22,10)}{team_card('gremio','Grêmio',3,22,10)}</div>
<div class=card style="position:absolute;top:1060px;left:120px;right:120px;padding:20px 24px">
<div class=cta>HOJE, 22H40 · <b>RESSACA × GRÊMIO</b><br><span style="font-size:27px;color:#e9dcc0;letter-spacing:.08em">CONFRONTO DIRETO · 1º CONTRA 3º</span></div></div>
""", chip=chip)

def game(t, a, ka, b, kb, hl=False):
    bd = 'border-color:#f3cf74;box-shadow:0 0 34px rgba(243,207,116,.35)' if hl else ''
    return f"""<div class=card style="display:flex;align-items:center;padding:14px 22px;gap:14px;{bd}">
<div style="font:900 34px/1 'Barlow Condensed';width:92px" class=gold>{t}</div>
<img src="{L(ka)}" style="width:78px;height:78px;object-fit:contain"><div style="font:800 34px/1 'Barlow Condensed';text-transform:uppercase;flex:1">{a}</div>
<div style="font:900 30px/1 'Barlow Condensed';color:#f3cf74">×</div>
<div style="font:800 34px/1 'Barlow Condensed';text-transform:uppercase;flex:1;text-align:right">{b}</div><img src="{L(kb)}" style="width:78px;height:78px;object-fit:contain"></div>"""

s2 = shell(f"""
<div style="position:absolute;top:262px;left:0;right:0"><div class=ttl style="font-size:96px">A NOITE <span class=gold>DOS TRÊS</span></div>
<div class=sub style="margin-top:12px">Os jogos dos líderes hoje · terça, 17/11</div></div>
<div style="position:absolute;top:452px;left:84px;right:84px;display:flex;flex-direction:column;gap:16px">
{game('22H10','The Bronx','bronx','Ressaca','ressaca')}
{game('22H10','Grêmio','gremio','GO','go')}
{game('22H10','Vikings','vikings','MDB','mdb')}
{game('22H40','Ressaca','ressaca','Grêmio','gremio',True)}
{game('22H40','Bafo Chopp','bafo','Vikings','vikings')}
</div>
<div style="position:absolute;top:1092px;left:84px;right:84px" class=cta><span style="font-size:30px;color:#e9dcc0">Ressaca ainda tem 1 jogo a menos.</span><br>QUEM DORME LÍDER? COMENTA <b>1</b>, <b>2</b> OU <b>3</b> 👇</div>
""", chip=chip)

rows=[('ressaca','Ressaca',1,23,9,7,2,0,'+14'),('vikings','Vikings',2,22,10,7,1,2,'+14'),('gremio','Grêmio',3,22,10,7,1,2,'+9'),('go','GO',4,16,9,5,1,3,'+5')]
def tr(r):
    k,n,p,pts,j,v,e,d,sg=r; ap=round(pts*100/(3*j))
    td="font:800 40px/1 'Barlow Condensed';text-align:center;padding:16px 0"
    return f"""<tr style="border-top:1px solid rgba(214,172,88,.35)"><td style="{td};width:60px" class=gold>{p}º</td><td style="padding:12px 0"><div style="display:flex;align-items:center;gap:14px"><img src="{L(k)}" style="width:70px;height:70px;object-fit:contain"><span style="font:900 40px/1 'Barlow Condensed';text-transform:uppercase">{n}</span></div></td>
<td style="{td};color:#f3cf74;font-size:46px">{pts}</td><td style="{td}">{j}</td><td style="{td}">{v}</td><td style="{td}">{e}</td><td style="{td}">{d}</td><td style="{td}">{sg}</td><td style="{td};color:#f3cf74">{ap}%</td></tr>"""
th="font:800 24px/1 'Barlow Condensed';letter-spacing:.12em;color:#cdbb92;text-align:center;padding-bottom:12px"
s3 = shell(f"""
<div style="position:absolute;top:262px;left:0;right:0"><div class=ttl style="font-size:96px">CARA A <span class=gold>CARA</span></div>
<div class=sub style="margin-top:12px">O G4 da Division Pro, número a número</div></div>
<div class=card style="position:absolute;top:440px;left:70px;right:70px;padding:22px 26px 10px">
<table style="width:100%;border-collapse:collapse"><tr><th style="{th}">#</th><th style="{th};text-align:left">EQUIPE</th><th style="{th}">PTS</th><th style="{th}">J</th><th style="{th}">V</th><th style="{th}">E</th><th style="{th}">D</th><th style="{th}">SG</th><th style="{th}">APROV.</th></tr>
{''.join(tr(r) for r in rows)}</table></div>
<div style="position:absolute;top:910px;left:90px;right:90px;display:flex;gap:18px">
<div class=card style="flex:1;padding:18px;text-align:center"><div style="font:900 52px/1 'Barlow Condensed'" class=gold>+14</div><div style="font:700 22px/1.2 'Barlow Condensed';letter-spacing:.1em;color:#e9dcc0;margin-top:6px">MELHOR SALDO<br>RESSACA E VIKINGS</div></div>
<div class=card style="flex:1;padding:18px;text-align:center"><div style="font:900 52px/1 'Barlow Condensed'" class=gold>0</div><div style="font:700 22px/1.2 'Barlow Condensed';letter-spacing:.1em;color:#e9dcc0;margin-top:6px">DERROTAS<br>DO RESSACA</div></div>
<div class=card style="flex:1;padding:18px;text-align:center"><div style="font:900 52px/1 'Barlow Condensed'" class=gold>7</div><div style="font:700 22px/1.2 'Barlow Condensed';letter-spacing:.1em;color:#e9dcc0;margin-top:6px">VITÓRIAS<br>PARA CADA UM DO TOP 3</div></div></div>
<div style="position:absolute;top:1106px;left:84px;right:84px" class=cta>QUEM TERMINA A NOITE NO TOPO? <b>CRAVA O PLACAR</b> 👇</div>
""", arrow=False, chip=chip)
render([('dp-topo-1',s1),('dp-topo-2',s2),('dp-topo-3',s3)], 'out')
