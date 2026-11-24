# Comunidade Global Academy: instalação no Wix

Mural estilo rede social. Visitante vê tudo; só aluno (plano ativo da Academy) ou admin posta, curte, comenta e segue. A trava fica no backend, não só na tela.

## 1. Coleções (CMS do Wix)

Todas com permissão: **ler = qualquer pessoa; criar, atualizar e apagar = só admin** (quem grava é o backend).

| Coleção | Campos |
|---|---|
| ComuPerfis | memberId (texto), handle (texto), nome, foto (URL), capa (URL), area, bio, seguidores (número), seguindo (número), posts (número), professor (booleano) |
| ComuPosts | autorId, midia (URL), tipo (imagem/video), legenda, aba (narracao/edicao/artes/jogo/geral), curtidas (número), comentarios (número), oculto (booleano) |
| ComuCurtidas | postId, memberId |
| ComuComentarios | postId, memberId, handle, texto |
| ComuSeguidores | seguidorId, seguidoId |
| ComuDenuncias | postId, memberId, motivo |

## 2. Backend

Criar `backend/comunidade.web.js` com o conteúdo de `backend/comunidade.web.js`.
Conferir `PLANOS_ALUNO` (ID do plano da Academy: fc7d621e-2fd9-42fa-9be9-7407e5f9495a).

## 3. Página /comunidade

1. Página nova "Comunidade", URL `/comunidade`, largura total, sem cabeçalho de conteúdo.
2. Elemento Personalizado, ID `comu`, tag `ga-comunidade`, script do jsDelivr: `https://cdn.jsdelivr.net/gh/globalfutpro-creator/sitevendas@<sha>/academy/comunidade/ga-comunidade.js`.
3. Código da página: conteúdo de `pagina-comunidade.js`.

## 4. Professores

Na coleção ComuPerfis, marcar `professor = true` nos perfis dos professores (selo dourado "Professor").

## 5. Ligações

Prévia da home e aba Comunidade do menu apontam para `/comunidade` (no `buildwix2.py`, trocar `/group/networking-nos-games/discussion`). O grupo antigo não é apagado.

## 6. Conferir depois de instalar

- Upload de vídeo: confirmar o formato da URL devolvida pelo Wix (`enviar()` em ga-comunidade.js).
- Visitante deslogado: curtir/comentar abre o aviso "Só para alunos".
- Aluno: postar imagem e vídeo, curtir, comentar, seguir, editar perfil.
- Admin: botão "Tirar do ar" (oculta, não apaga).
