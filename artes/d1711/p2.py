from gen import *
chip = f'<div class=chip><img src="{L("tdp")}">DIVISION <span>PRO</span> · ELITE</div>'
G=[('ywiskZ','Sem posição','go',1,'21,70',[('Jogos',4),('Assist.',2),('Final.',5),('Passes',44)]),
   ('JNzxxx','Lateral/ala','go',2,'19,40',[('Jogos',5),('Assist.',1),('Final.',2),('Passes',44)]),
   ('DUQUEhs','Meia','go',7,'14,00',[('Jogos',5),('Gols',1),('Assist.',1),('Passes',28)])]
R=[('Tchezord','Atacante','gremio',3,'17,00',[('Jogos',9),('Gols',7),('Assist.',4),('Final.',4)]),
   ('joaovitor_pg','Meia','gremio',4,'16,90',[('Jogos',5),('Gols',1),('Assist.',4),('Final.',7)]),
   ('Baladao16','Atacante','gremio',5,'16,80',[('Jogos',6),('Gols',3),('Assist.',5),('Final.',6)])]
def pc(p):
    n,pos,k,rk,perf,st=p
    sts=''.join(f'<div style="flex:1;text-align:center"><div style="font:900 34px/1 \'Barlow Condensed\'">{v}</div><div style="font:700 15px/1 \'Barlow Condensed\';letter-spacing:.1em;color:#cdbb92;margin-top:4px;text-transform:uppercase">{l}</div></div>' for l,v in st)
    return f"""<div class=card style="padding:16px 18px;display:flex;flex-direction:column;gap:10px">
<div style="display:flex;align-items:center;gap:12px"><div style="font:900 30px/1 'Barlow Condensed';width:46px"><span class=gold>#{rk}</span></div><img src="{L(k)}" style="width:52px;height:52px;object-fit:contain">
<div style="flex:1;min-width:0"><div style="font:900 34px/1 'Barlow Condensed';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{n}</div><div style="font:700 17px/1 'Barlow Condensed';letter-spacing:.14em;color:#cdbb92;text-transform:uppercase;margin-top:4px">{pos}</div></div>
<div style="text-align:right"><div style="font:900 40px/1 'Barlow Condensed'"><span class=gold>{perf}</span></div><div style="font:700 13px/1 'Barlow Condensed';letter-spacing:.12em;color:#cdbb92">PERFORMANCE</div></div></div>
<div style="display:flex;border-top:1px solid rgba(214,172,88,.35);padding-top:10px">{sts}</div></div>"""
s1 = shell(f"""
<div style="position:absolute;top:262px;left:0;right:0"><div class=ttl style="font-size:100px">DUELO DO <span class=gold>RANKING</span></div>
<div class=sub style="margin-top:12px">O top 5 da Division Pro joga no mesmo campo</div></div>
<div style="position:absolute;top:430px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:40px">
<div style="text-align:center"><img src="{L('gremio')}" style="width:250px;height:250px;object-fit:contain"><div style="font:900 50px/1 'Barlow Condensed';margin-top:10px">GRÊMIO</div><div style="font:700 24px/1 'Barlow Condensed';letter-spacing:.14em;color:#cdbb92;margin-top:6px">3º · 22 PTS</div></div>
<div style="text-align:center"><div style="font:900 120px/1 'Barlow Condensed'"><span class=gold>×</span></div><div style="font:900 44px/1 'Barlow Condensed'">22H10</div><div style="font:700 22px/1 'Barlow Condensed';letter-spacing:.14em;color:#cdbb92;margin-top:6px">HOJE · 17/11</div></div>
<div style="text-align:center"><img src="{L('go')}" style="width:250px;height:250px;object-fit:contain"><div style="font:900 50px/1 'Barlow Condensed';margin-top:10px">GO</div><div style="font:700 24px/1 'Barlow Condensed';letter-spacing:.14em;color:#cdbb92;margin-top:6px">4º · 16 PTS</div></div></div>
<div style="position:absolute;top:840px;left:90px;right:90px;display:flex;gap:16px">
<div class=card style="flex:1;padding:20px;text-align:center"><div style="font:900 64px/1 'Barlow Condensed'"><span class=gold>TOP 5</span></div><div style="font:700 21px/1.25 'Barlow Condensed';letter-spacing:.1em;color:#e9dcc0;margin-top:8px">DO RANKING É TODO<br>DE GO E GRÊMIO</div></div>
<div class=card style="flex:1;padding:20px;text-align:center"><div style="font:900 64px/1 'Barlow Condensed'"><span class=gold>21,70</span></div><div style="font:700 21px/1.25 'Barlow Condensed';letter-spacing:.1em;color:#e9dcc0;margin-top:8px">ywiskZ (GO)<br>Nº 1 DO RANKING</div></div>
<div class=card style="flex:1;padding:20px;text-align:center"><div style="font:900 64px/1 'Barlow Condensed'"><span class=gold>7</span></div><div style="font:700 21px/1.25 'Barlow Condensed';letter-spacing:.1em;color:#e9dcc0;margin-top:8px">GOLS DE TCHEZORD<br>(GRÊMIO)</div></div></div>
<div style="position:absolute;top:1090px;left:84px;right:84px" class=cta>QUEM DECIDE O JOGO? <b>ARRASTA</b> E ESCOLHE O SEU 👉</div>
""", chip=chip)
s2 = shell(f"""
<div style="position:absolute;top:262px;left:0;right:0"><div class=ttl style="font-size:92px">CRAQUE <span class=gold>× CRAQUE</span></div>
<div class=sub style="margin-top:10px">Os 3 melhores de cada lado no ranking</div></div>
<div style="position:absolute;top:420px;left:60px;right:60px;display:grid;grid-template-columns:1fr 1fr;gap:16px 18px">
<div style="font:800 26px/1 'Barlow Condensed';letter-spacing:.16em;color:#f3cf74;text-align:center">GRÊMIO</div><div style="font:800 26px/1 'Barlow Condensed';letter-spacing:.16em;color:#f3cf74;text-align:center">GO</div>
{''.join(pc(R[i])+pc(G[i]) for i in range(3))}</div>
<div style="position:absolute;top:1060px;left:70px;right:70px" class=cta>QUEM É O DONO DA NOITE?<br>COMENTA O NOME DO SEU CRAQUE 👇</div>
""", arrow=False, chip=chip)
render([('dp-duelo-1',s1),('dp-duelo-2',s2)], 'out')
