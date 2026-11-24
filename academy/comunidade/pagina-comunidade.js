// Comunidade Global Academy — código da página /comunidade (Wix Velo)
// Na página: um Elemento Personalizado com ID "comu", tag "ga-comunidade",
// script https://cdn.jsdelivr.net/gh/globalfutpro-creator/sitevendas@<sha>/academy/comunidade/ga-comunidade.js
import * as C from 'backend/comunidade.web';
import { authentication } from 'wix-members-frontend';
import wixLocation from 'wix-location-frontend';

const PLANO = '/pricing-plans/personaliza-o-do-plano?planId=fc7d621e-2fd9-42fa-9be9-7407e5f9495a&checkoutFlowId=32621e00-ff95-4f9a-91a0-b021d562bd84&pricingVariantId=b2484435-a12e-4bca-b344-597941b75440';

$w.onReady(async function () {
  const el = $w('#customElement1');
  const enviar = (id, ok, data) => el.setAttribute('resp', JSON.stringify({ id, ok, data, t: Date.now() }));
  const sessao = async () => el.setAttribute('sessao', JSON.stringify(await C.sessao()));

  el.on('ga-acao', async (ev) => {
    const { id, tipo, args } = ev.detail || {};
    try {
      if (tipo === 'entrar') { await authentication.promptLogin({ mode: 'login' }); await sessao(); return enviar(id, true, null); }
      if (tipo === 'virarAluno') { wixLocation.to(PLANO); return enviar(id, true, null); }
      if (typeof C[tipo] !== 'function') throw new Error('ACAO_INVALIDA');
      enviar(id, true, await C[tipo](args));
    } catch (e) {
      enviar(id, false, String((e && e.message) || e));
    }
  });

  authentication.onLogin(sessao);
  try { el.setAttribute('inicio', JSON.stringify(await C.inicio())); } catch (e) { await sessao(); }
});
