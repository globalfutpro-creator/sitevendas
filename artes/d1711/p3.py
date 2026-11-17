from gen import *
chip = f'<div class=chip><img src="{L("tbr")}">LIGA <span>BRPRO</span> · DIVISION PRO</div>'
def q(a,ka,pa,b,kb,pb,st,win=None):
    def side(n,k,p,w):
        op='' if (win is None or w) else 'opacity:.38;filter:grayscale(1)'
        tag='<div style="font:800 18px/1 \'Barlow Condensed\';letter-spacing:.14em;color:#3ddc97;margin-top:4px">CLASSIFICADO</div>' if w else ('<div style="font:800 18px/1 \'Barlow Condensed\';letter-spacing:.14em;color:#ff6b6b;margin-top:4px">ELIMINADO</div>' if win is not None else '')
        return f'<div style="display:flex;align-items:center;gap:12px;flex:1;{op}"><img src="{L(k)}" style="width:76px;height:76px;object-fit:contain"><div><div style="font:900 34px/1 \'Barlow Condensed\';text-transform:uppercase">{n} <span style="font-size:24px;color:#cdbb92">{p}º</span></div>{tag}</div></div>'
    hl='border-color:#f3cf74;box-shadow:0 0 30px rgba(243,207,116,.3)' if win else ''
    return f'<div class=card style="display:flex;align-items:center;gap:10px;padding:16px 24px;{hl}">{side(a,ka,pa,win=="a")}<div style="font:900 26px/1 \'Barlow Condensed\';color:#f3cf74;width:150px;text-align:center">{st}</div>{side(b,kb,pb,win=="b")}</div>'
s1 = shell(f"""
<div style="position:absolute;top:268px;left:0;right:0"><div class=ttl>ZEBRA NAS <span class=gold>QUARTAS</span></div>
<div class=sub style="margin-top:14px">O 2º e o 3º da liga já estão fora</div></div>
<div style="position:absolute;top:470px;left:80px;right:80px;display:flex;flex-direction:column;gap:16px">
{q('The Bronx','bronx',2,'Máquina','maquina',7,'ZEBRA','b')}
{q('M.X Gaming','mx',3,'Evolution','evolution',6,'ZEBRA','b')}
{q('VIBE','vibe',1,'Bahia 073','bahia',8,'AGUARDANDO')}
{q('FLB','flb',4,'EQP Caos','caos',5,'AGUARDANDO')}
</div>
<div class=card style="position:absolute;top:1010px;left:130px;right:130px;padding:18px 20px">
<div class=cta>SEMIFINAL DEFINIDA:<br><b>EVOLUTION × MÁQUINA</b></div></div>
""", chip=chip)
def stat(lbl,a,b):
    return f'<div style="display:flex;align-items:center;border-top:1px solid rgba(214,172,88,.3);padding:8px 0"><div style="flex:1;text-align:center;font:900 40px/1 \'Barlow Condensed\'">{a}</div><div style="width:280px;text-align:center;font:800 22px/1 \'Barlow Condensed\';letter-spacing:.16em;color:#cdbb92">{lbl}</div><div style="flex:1;text-align:center;font:900 40px/1 \'Barlow Condensed\'">{b}</div></div>'
s2 = shell(f"""
<div style="position:absolute;top:262px;left:0;right:0"><div class=ttl style="font-size:96px">AS <span class=gold>ZEBRAS</span> SE ENCONTRAM</div>
<div class=sub style="margin-top:12px">Semifinal · campanha na fase de liga</div></div>
<div class=card style="position:absolute;top:440px;left:80px;right:80px;padding:22px 30px 10px">
<div style="display:flex;align-items:center;margin-bottom:14px"><div style="flex:1;text-align:center"><img src="{L('evolution')}" style="width:128px;height:128px;object-fit:contain"><div style="font:900 40px/1 'Barlow Condensed';margin-top:6px">EVOLUTION</div></div>
<div style="width:120px;text-align:center;font:900 90px/1 'Barlow Condensed'"><span class=gold>×</span></div>
<div style="flex:1;text-align:center"><img src="{L('maquina')}" style="width:128px;height:128px;object-fit:contain"><div style="font:900 40px/1 'Barlow Condensed';margin-top:6px">MÁQUINA</div></div></div>
{stat('POSIÇÃO NA LIGA','6º','7º')}{stat('PONTOS','28','24')}{stat('V · E · D','8 · 4 · 6','7 · 3 · 8')}{stat('GOLS PRÓ','29','26')}{stat('GOLS CONTRA','22','22')}{stat('SALDO','+7','+4')}
</div>
<div style="position:absolute;top:1070px;left:84px;right:84px" class=cta>ÚLTIMO DUELO: <b>1 × 1</b> (12/11). QUEM VAI À FINAL?<br>COMENTA <b>1</b> EVOLUTION OU <b>2</b> MÁQUINA 👇</div>
""", arrow=False, chip=chip)
render([('brpro-zebra-1',s1),('brpro-zebra-2',s2)], 'out')
