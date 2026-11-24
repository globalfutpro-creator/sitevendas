// Comunidade Global Academy — backend (Wix Velo, arquivo backend/comunidade.web.js)
// Regra: visitante lê tudo; só aluno (plano ativo da Academy) ou admin posta, curte, comenta e segue.
// Todas as coleções ficam com leitura "qualquer pessoa" e escrita "admin": só este arquivo grava.
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { currentMember } from 'wix-members-backend';
import { orders } from 'wix-pricing-plans-backend';
import { files } from 'wix-media.v2';
import { collections } from 'wix-data.v2';
import { elevate } from 'wix-auth';
import { groups, members as gMembros } from 'wix-groups-backend';
import { members as sMembros } from 'wix-members-backend';

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
  const nick = (m && m.profile && (m.profile.nickname || m.profile.slug)) || 'aluno';
  const base = String(nick).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9._]/g, '').slice(0, 22) || 'aluno';
  const usado = await wixData.query('ComuPerfis').eq('handle', base).count(OPT);
  const novo = {
    memberId,
    handle: usado ? base + (Date.now() % 1000) : base,
    nome: (m && m.profile && m.profile.nickname) || 'Aluno',
    foto: (m && m.profile && (/** @type {any} */ (m.profile).profilePhoto || /** @type {any} */ (m.profile).photo || {}).url) || '',
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

async function montarFeed({ aba = 'todos', antesDe = null, autor = null } = {}, meId) {
  let q = wixData.query('ComuPosts').ne('oculto', true).descending('_createdDate').limit(12);
  if (aba === 'alta') q = wixData.query('ComuPosts').ne('oculto', true).descending('curtidas').limit(12);
  else if (aba && aba !== 'todos') q = q.eq('aba', aba);
  if (autor) q = q.eq('autorId', autor);
  if (antesDe) q = q.lt('_createdDate', new Date(antesDe));
  const r = await q.find(OPT);
  if (!r.items.length) return { posts: [], fim: true };
  const pids = r.items.map(p => p._id);
  const ids = [...new Set(r.items.map(p => p.autorId))];
  const [perf, curt, coms] = await Promise.all([
    wixData.query('ComuPerfis').hasSome('memberId', ids).limit(100).find(OPT),
    meId ? wixData.query('ComuCurtidas').eq('memberId', meId).hasSome('postId', pids).limit(100).find(OPT) : Promise.resolve({ items: [] }),
    wixData.query('ComuComentarios').hasSome('postId', pids).descending('_createdDate').limit(200).find(OPT)
  ]);
  const mapa = Object.fromEntries(perf.items.map(p => [p.memberId, p]));
  const curti = new Set(curt.items.map(c => c.postId));
  /** @type {Object<string, any[]>} */
  const ult = {};
  for (const c of coms.items) { const l = ult[c.postId] || (ult[c.postId] = []); if (l.length < 2) l.unshift(c); }
  const posts = r.items.map(p => ({ ...p, autor: mapa[p.autorId] || null, curti: curti.has(p._id), ultimos: ult[p._id] || [] }));
  return { posts, fim: r.items.length < 12 };
}
async function meuId() { try { const m = await currentMember.getMember(); return m ? m._id : null; } catch (e) { return null; } }

export const feed = webMethod(Permissions.Anyone, async (args) => montarFeed(args || {}, await meuId()));

// Tudo o que a página precisa ao abrir, numa chamada só (abre rápido)
export const inicio = webMethod(Permissions.Anyone, async () => {
  const [s, top] = await Promise.all([quemSou(), wixData.query('ComuPerfis').descending('seguidores').limit(10).find(OPT)]);
  const [f, perfil] = await Promise.all([
    montarFeed({}, s.membro ? s.membro._id : null),
    s.membro && s.aluno ? perfilDe(s.membro._id, s.membro) : Promise.resolve(null)
  ]);
  return { sessao: s.membro ? { logado: true, aluno: s.aluno, admin: s.admin, perfil } : { logado: false, aluno: false }, feed: f, top: top.items };
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
export const uploadUrl = webMethod(Permissions.SiteMember, async ({ tipo, nome, mime }) => {
  await exigirAluno();
  const ok = /^(image\/(jpeg|png|webp)|video\/(mp4|quicktime|webm))$/.test(String(mime || ''));
  if (!ok) throw new Error('FORMATO');
  const gerar = elevate(files.generateFileUploadUrl);
  const r = await gerar(String(mime), /** @type {any} */ ({ fileName: limpa(nome, 60) || (tipo === 'video' ? 'post.mp4' : 'post.jpg') }));
  return { uploadUrl: r.uploadUrl };
});

export const postar = webMethod(Permissions.SiteMember, async ({ midia, tipo, legenda, aba }) => {
  const s = await exigirAluno();
  if (!midia && !limpa(legenda, 5)) throw new Error('SEM_MIDIA');
  const p = await wixData.insert('ComuPosts', {
    autorId: s.membro._id, midia: midia ? String(midia) : '', tipo: !midia ? 'texto' : (tipo === 'video' ? 'video' : 'imagem'),
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

// Lista de quem está na comunidade (perfis), mais antigos primeiro
export const membros = webMethod(Permissions.Anyone, async () => {
  const r = await wixData.query('ComuPerfis').ascending('entrouEm').limit(200).find(OPT);
  return r.items;
});

// Importa (espelha) o grupo "Networking nos Games": membros, posts e comentários. Só admin, pode rodar de novo.
const POSTS_GRUPO = [
  { autor: 'ADM', quando: '2025-07-03T15:00:00Z', curtidas: 2, texto: 'Networking gamer! Bem-vindo ao grupo! Aqui os talentos já consolidados se encontram com os novos membros, trocando informações, conteúdos, serviços e muito mais. Aproveite o espaço para postar vídeos, artes, roteiros etc. Mostre o seu talento para que outras pessoas possam contratar os seus serviços, ou até fechar grandes parcerias.', comentarios: [] },
  { autor: 'Caldana', quando: '2025-07-31T15:00:00Z', curtidas: 2, texto: 'Olá amigos!!!', comentarios: [] },
  { autor: 'Lucas Augusto', quando: '2026-02-14T15:00:00Z', curtidas: 5, texto: 'Fala galera', comentarios: [{ autor: 'Caldana', texto: 'Bom te ver por aqui irmão! 👍' }] }
];
export const importarGrupo = webMethod(Permissions.Admin, async () => {
  const log = [];
  const g = await groups.getGroupBySlug('networking-nos-games', /** @type {any} */ ({ suppressAuth: true }));
  let lista = [];
  for (let skip = 0; skip < 1000;) {
    const r = /** @type {any} */ (await gMembros.listGroupMembers(g._id, /** @type {any} */ ({ limit: 100, skip, suppressAuth: true })));
    const it = (r && (r.items || r)) || [];
    if (!it.length) break;
    lista = lista.concat(it);
    skip += it.length;
  }
  log.push('membros no grupo: ' + lista.length);
  /** @type {Object<string,string>} */
  const porNome = {};
  for (const it of lista) {
    const id = it.siteMemberId || it.memberId || it._id;
    let m = null;
    try { m = await sMembros.getMember(id, { fieldsets: ['PUBLIC'] }); } catch (e) { m = null; }
    const p = await perfilDe(id, m);
    const pr = /** @type {any} */ (m && m.profile) || {};
    const foto = (pr.profilePhoto && pr.profilePhoto.url) || (pr.photo && pr.photo.url) || p.foto || '';
    const nome = (m && m.profile && m.profile.nickname) || p.nome;
    await wixData.update('ComuPerfis', { ...p, foto, nome, entrouEm: it.joinedDate ? new Date(it.joinedDate) : (p.entrouEm || new Date()) }, OPT);
    porNome[String(nome).trim().toLowerCase()] = id;
    log.push(String(nome) + ' | ' + ((m && m.profile && m.profile.slug) || '') + ' | ' + id);
  }
  for (const po of POSTS_GRUPO) {
    const autorId = porNome[po.autor.toLowerCase()] || Object.entries(porNome).find(([k]) => k.indexOf(po.autor.toLowerCase().split(' ')[0]) === 0)?.[1];
    if (!autorId) { log.push('sem autor: ' + po.autor); continue; }
    const ja = await wixData.query('ComuPosts').eq('autorId', autorId).eq('legenda', po.texto).count(OPT);
    if (ja) { log.push('já existe: ' + po.texto.slice(0, 20)); continue; }
    const novo = await wixData.insert('ComuPosts', { autorId, midia: '', tipo: 'texto', legenda: po.texto, aba: 'geral', curtidas: po.curtidas, comentarios: po.comentarios.length, oculto: false, quando: new Date(po.quando) }, OPT);
    for (const c of po.comentarios) {
      const cid = porNome[c.autor.toLowerCase()] || Object.entries(porNome).find(([k]) => k.indexOf(c.autor.toLowerCase().split(' ')[0]) === 0)?.[1];
      const cp = cid ? (await wixData.query('ComuPerfis').eq('memberId', cid).limit(1).find(OPT)).items[0] : null;
      await wixData.insert('ComuComentarios', { postId: novo._id, memberId: cid || '', handle: cp ? cp.handle : c.autor, texto: c.texto }, OPT);
    }
    const pa = (await wixData.query('ComuPerfis').eq('memberId', autorId).limit(1).find(OPT)).items[0];
    if (pa) await wixData.update('ComuPerfis', { ...pa, posts: (pa.posts || 0) + 1 }, OPT);
    log.push('post importado: ' + po.texto.slice(0, 20));
  }
  return log;
});

export const debugGrupo = webMethod(Permissions.Admin, async () => {
  const g = await groups.getGroupBySlug('networking-nos-games', /** @type {any} */ ({ suppressAuth: true }));
  const a = /** @type {any} */ (await gMembros.listGroupMembers(g._id, /** @type {any} */ ({ suppressAuth: true })));
  const b = /** @type {any} */ (await gMembros.listGroupMembers(g._id, /** @type {any} */ ({ limit: 100, skip: 0, suppressAuth: true })));
  const tipo = (x) => Array.isArray(x) ? 'array:' + x.length : (x && typeof x === 'object' ? 'obj:' + Object.keys(x).join(',') : typeof x);
  return { gid: g._id, total: g.membersCount, a: tipo(a), aItems: a && a.items ? tipo(a.items) : '', amostra: JSON.stringify((a.items || a)[0] || null).slice(0, 400), b: tipo(b), bItems: b && b.items ? tipo(b.items) : '' };
});
