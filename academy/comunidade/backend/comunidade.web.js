// Comunidade Global Academy — backend (Wix Velo, arquivo backend/comunidade.web.js)
// Regra: visitante lê tudo; só aluno (plano ativo da Academy) ou admin posta, curte, comenta e segue.
// Todas as coleções ficam com leitura "qualquer pessoa" e escrita "admin": só este arquivo grava.
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { currentMember } from 'wix-members-backend';
import { orders } from 'wix-pricing-plans-backend';
import { mediaManager } from 'wix-media-backend';
import { collections } from 'wix-data.v2';
import { elevate } from 'wix-auth';

// Planos que liberam a comunidade (Global Academy 12 meses). Acrescentar outros IDs se houver.
const PLANOS_ALUNO = ['fc7d621e-2fd9-42fa-9be9-7407e5f9495a'];
const ADMIN_ROLES = ['Admin', 'Owner'];
const OPT = { suppressAuth: true };
const LIM = { legenda: 600, comentario: 400, bio: 220 };
const ABAS = ['narracao', 'edicao', 'artes', 'jogo', 'geral'];

async function quemSou() {
  let m = null;
  try { m = await currentMember.getMember({ fieldsets: ['FULL'] }); } catch (e) { m = null; }
  if (!m) return { membro: null, aluno: false, admin: false };
  let roles = [];
  try { roles = (await currentMember.getRoles()).map(r => /** @type {any} */ (r).title || ''); } catch (e) { roles = []; }
  const admin = roles.some(r => ADMIN_ROLES.includes(r));
  let aluno = admin;
  if (!aluno) {
    try {
      const lista = await orders.listCurrentMemberOrders(/** @type {any} */ ({ orderStatuses: ['ACTIVE'] }));
      aluno = (lista || []).some(o => PLANOS_ALUNO.includes(o.planId));
    } catch (e) { aluno = false; }
  }
  return { membro: m, aluno, admin };
}

/** @param {string} memberId @param {any} m */
async function perfilDe(memberId, m) {
  const r = await wixData.query('ComuPerfis').eq('memberId', memberId).limit(1).find(OPT);
  if (r.items.length) return r.items[0];
  const nick = (m && m.profile && (m.profile.slug || m.profile.nickname)) || 'aluno';
  const novo = {
    memberId,
    handle: String(nick).toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 24) || ('aluno' + Date.now() % 100000),
    nome: (m && m.profile && m.profile.nickname) || 'Aluno',
    foto: (m && m.profile && m.profile.photo && m.profile.photo.url) || '',
    capa: '', area: '', bio: '', seguidores: 0, seguindo: 0, posts: 0, professor: false
  };
  return wixData.insert('ComuPerfis', novo, OPT);
}

async function exigirAluno() {
  const s = await quemSou();
  if (!s.membro) throw new Error('ENTRAR');
  if (!s.aluno) throw new Error('SO_ALUNOS');
  const perfil = await perfilDe(s.membro._id, s.membro);
  return { ...s, perfil };
}

const limpa = (/** @type {any} */ t, /** @type {number} */ n) => String(t || '').replace(/<[^>]*>/g, '').trim().slice(0, n);

// ---------- leitura (qualquer pessoa) ----------
export const sessao = webMethod(Permissions.Anyone, async () => {
  const s = await quemSou();
  if (!s.membro) return { logado: false, aluno: false };
  const perfil = s.aluno ? await perfilDe(s.membro._id, s.membro) : null;
  return { logado: true, aluno: s.aluno, admin: s.admin, perfil };
});

export const feed = webMethod(Permissions.Anyone, async ({ aba = 'todos', antesDe = null, autor = null } = {}) => {
  let q = wixData.query('ComuPosts').ne('oculto', true).descending('_createdDate').limit(12);
  if (aba && aba !== 'todos' && aba !== 'alta') q = q.eq('aba', aba);
  if (aba === 'alta') q = wixData.query('ComuPosts').ne('oculto', true).descending('curtidas').limit(12);
  if (autor) q = q.eq('autorId', autor);
  if (antesDe) q = q.lt('_createdDate', new Date(antesDe));
  const r = await q.find(OPT);
  const ids = [...new Set(r.items.map(p => p.autorId))];
  const perf = ids.length ? (await wixData.query('ComuPerfis').hasSome('memberId', ids).limit(100).find(OPT)).items : [];
  const mapa = Object.fromEntries(perf.map(p => [p.memberId, p]));
  let curti = [];
  const s = await quemSou();
  if (s.membro && r.items.length) {
    curti = (await wixData.query('ComuCurtidas').eq('memberId', s.membro._id).hasSome('postId', r.items.map(p => p._id)).limit(100).find(OPT)).items.map(c => c.postId);
  }
  const posts = await Promise.all(r.items.map(async p => {
    const c = await wixData.query('ComuComentarios').eq('postId', p._id).descending('_createdDate').limit(2).find(OPT);
    return { ...p, autor: mapa[p.autorId] || null, curti: curti.includes(p._id), ultimos: c.items.reverse() };
  }));
  return { posts, fim: r.items.length < 12 };
});

export const maisSeguidos = webMethod(Permissions.Anyone, async () => {
  const r = await wixData.query('ComuPerfis').descending('seguidores').limit(10).find(OPT);
  return r.items;
});

export const perfil = webMethod(Permissions.Anyone, async (handle) => {
  const r = await wixData.query('ComuPerfis').eq('handle', String(handle || '')).limit(1).find(OPT);
  if (!r.items.length) return null;
  const p = r.items[0];
  let sigo = false;
  const s = await quemSou();
  if (s.membro) sigo = (await wixData.query('ComuSeguidores').eq('seguidorId', s.membro._id).eq('seguidoId', p.memberId).count(OPT)) > 0;
  return { ...p, sigo, meu: !!(s.membro && s.membro._id === p.memberId) };
});

export const comentarios = webMethod(Permissions.Anyone, async (postId) => {
  const r = await wixData.query('ComuComentarios').eq('postId', postId).ascending('_createdDate').limit(100).find(OPT);
  return r.items;
});

// ---------- escrita (só aluno) ----------
export const uploadUrl = webMethod(Permissions.SiteMember, async ({ tipo, nome }) => {
  await exigirAluno();
  const mime = tipo === 'video' ? 'video/mp4' : 'image/jpeg';
  return mediaManager.getUploadUrl('/comunidade', /** @type {any} */ ({ mediaOptions: { mimeType: mime, mediaType: tipo === 'video' ? 'video' : 'image' }, metadataOptions: { isPrivate: false, isVisitorUpload: true } }));
});

export const postar = webMethod(Permissions.SiteMember, async ({ midia, tipo, legenda, aba }) => {
  const s = await exigirAluno();
  if (!midia) throw new Error('SEM_MIDIA');
  const p = await wixData.insert('ComuPosts', {
    autorId: s.membro._id, midia: String(midia), tipo: tipo === 'video' ? 'video' : 'imagem',
    legenda: limpa(legenda, LIM.legenda), aba: ABAS.includes(aba) ? aba : 'geral',
    curtidas: 0, comentarios: 0, oculto: false
  }, OPT);
  await wixData.update('ComuPerfis', { ...s.perfil, posts: (s.perfil.posts || 0) + 1 }, OPT);
  return p;
});

export const curtir = webMethod(Permissions.SiteMember, async (postId) => {
  const s = await exigirAluno();
  const ja = await wixData.query('ComuCurtidas').eq('postId', postId).eq('memberId', s.membro._id).limit(1).find(OPT);
  const post = await wixData.get('ComuPosts', postId, OPT);
  if (!post) throw new Error('POST_SUMIU');
  if (ja.items.length) {
    await wixData.remove('ComuCurtidas', ja.items[0]._id, OPT);
    post.curtidas = Math.max(0, (post.curtidas || 0) - 1);
  } else {
    await wixData.insert('ComuCurtidas', { postId, memberId: s.membro._id }, OPT);
    post.curtidas = (post.curtidas || 0) + 1;
  }
  await wixData.update('ComuPosts', post, OPT);
  return { curti: !ja.items.length, curtidas: post.curtidas };
});

export const comentar = webMethod(Permissions.SiteMember, async ({ postId, texto }) => {
  const s = await exigirAluno();
  const t = limpa(texto, LIM.comentario);
  if (!t) throw new Error('VAZIO');
  const c = await wixData.insert('ComuComentarios', { postId, memberId: s.membro._id, handle: s.perfil.handle, texto: t }, OPT);
  const post = await wixData.get('ComuPosts', postId, OPT);
  if (post) { post.comentarios = (post.comentarios || 0) + 1; await wixData.update('ComuPosts', post, OPT); }
  return c;
});

export const seguir = webMethod(Permissions.SiteMember, async (seguidoId) => {
  const s = await exigirAluno();
  if (seguidoId === s.membro._id) throw new Error('VOCE_MESMO');
  const ja = await wixData.query('ComuSeguidores').eq('seguidorId', s.membro._id).eq('seguidoId', seguidoId).limit(1).find(OPT);
  const alvo = (await wixData.query('ComuPerfis').eq('memberId', seguidoId).limit(1).find(OPT)).items[0];
  if (!alvo) throw new Error('PERFIL_SUMIU');
  const d = ja.items.length ? -1 : 1;
  if (d < 0) await wixData.remove('ComuSeguidores', ja.items[0]._id, OPT);
  else await wixData.insert('ComuSeguidores', { seguidorId: s.membro._id, seguidoId }, OPT);
  await wixData.update('ComuPerfis', { ...alvo, seguidores: Math.max(0, (alvo.seguidores || 0) + d) }, OPT);
  await wixData.update('ComuPerfis', { ...s.perfil, seguindo: Math.max(0, (s.perfil.seguindo || 0) + d) }, OPT);
  return { sigo: d > 0, seguidores: Math.max(0, (alvo.seguidores || 0) + d) };
});

export const editarPerfil = webMethod(Permissions.SiteMember, async ({ handle, nome, area, bio, foto, capa }) => {
  const s = await exigirAluno();
  const h = limpa(handle, 24).toLowerCase().replace(/[^a-z0-9._]/g, '');
  if (h && h !== s.perfil.handle) {
    const usado = await wixData.query('ComuPerfis').eq('handle', h).count(OPT);
    if (usado) throw new Error('HANDLE_USADO');
  }
  return wixData.update('ComuPerfis', {
    ...s.perfil, handle: h || s.perfil.handle, nome: limpa(nome, 40) || s.perfil.nome,
    area: limpa(area, 40), bio: limpa(bio, LIM.bio), foto: foto || s.perfil.foto, capa: capa || s.perfil.capa
  }, OPT);
});

export const denunciar = webMethod(Permissions.SiteMember, async ({ postId, motivo }) => {
  const s = await quemSou();
  if (!s.membro) throw new Error('ENTRAR');
  return wixData.insert('ComuDenuncias', { postId, memberId: s.membro._id, motivo: limpa(motivo, 200) }, OPT);
});

// Admin: tirar post do ar (não apaga, só oculta)
export const ocultar = webMethod(Permissions.SiteMember, async (postId) => {
  const s = await quemSou();
  if (!s.admin) throw new Error('SO_ADMIN');
  const p = await wixData.get('ComuPosts', postId, OPT);
  p.oculto = true;
  return wixData.update('ComuPosts', p, OPT);
});

// Instalação: cria as coleções (rodar uma vez pelo botão Executar do editor, só admin)
const COLS = {
  ComuPerfis: [['memberId','TEXT'],['handle','TEXT'],['nome','TEXT'],['foto','URL'],['capa','URL'],['area','TEXT'],['bio','TEXT'],['seguidores','NUMBER'],['seguindo','NUMBER'],['posts','NUMBER'],['professor','BOOLEAN']],
  ComuPosts: [['autorId','TEXT'],['midia','URL'],['tipo','TEXT'],['legenda','TEXT'],['aba','TEXT'],['curtidas','NUMBER'],['comentarios','NUMBER'],['oculto','BOOLEAN']],
  ComuCurtidas: [['postId','TEXT'],['memberId','TEXT']],
  ComuComentarios: [['postId','TEXT'],['memberId','TEXT'],['handle','TEXT'],['texto','TEXT']],
  ComuSeguidores: [['seguidorId','TEXT'],['seguidoId','TEXT']],
  ComuDenuncias: [['postId','TEXT'],['memberId','TEXT'],['motivo','TEXT']]
};
export const instalarColecoes = webMethod(Permissions.Admin, async () => {
  const criar = elevate(collections.createDataCollection);
  const feito = [];
  for (const [id, campos] of Object.entries(COLS)) {
    try {
      await criar(/** @type {any} */ ({
        _id: id, displayName: id,
        fields: campos.map(([key, type]) => ({ key, displayName: key, type })),
        permissions: { read: 'ANYONE', insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN' }
      }));
      feito.push(id + ': criada');
    } catch (e) { feito.push(id + ': ' + String((e && e.message) || e).slice(0, 120)); }
  }
  return feito;
});
