# Guia passo a passo — do zero ao site no ar

Guia completo de execução no **VS Code + Git + GitHub**, na ordem em que este projeto foi construído.
Se você recebeu o projeto pronto, comece pelo **Passo 2**.

---

## Passo 1 — Ambiente de desenvolvimento

### 1.1 Instalar o VS Code

Baixe em <https://code.visualstudio.com>. No Windows, marque *“Adicionar ao PATH”* durante a instalação
— é o que permite abrir uma pasta com `code .` pelo terminal.

### 1.2 Extensões

O projeto já traz `.vscode/extensions.json`; ao abrir a pasta, o VS Code oferece instalar tudo de uma vez.
Se preferir instalar pelo terminal:

```bash
code --install-extension ritwickdey.liveserver
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension eamodio.gitlens
code --install-extension formulahendry.auto-rename-tag
code --install-extension naumovs.color-highlight
code --install-extension usernamehw.errorlens
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension streetsidesoftware.code-spell-checker-portuguese-brazilian
```

| Extensão | Para que serve aqui |
|---|---|
| **Live Server** | Servidor local com recarregamento automático. **Obrigatório**: com `file://` as fontes `woff2` são bloqueadas por CORS |
| **Prettier** | Formatação automática ao salvar (`.prettierrc` já configurado) |
| **ESLint** | Erros de JavaScript aparecem enquanto você digita |
| **GitLens** | Mostra quem mudou cada linha e quando |
| **Auto Rename Tag** | Renomeia a tag de fechamento junto com a de abertura |
| **Color Highlight** | Pinta os hex do CSS — útil para conferir a paleta da marca |
| **Error Lens** | Traz o erro para a própria linha |
| **Code Spell Checker (+ PT-BR)** | Evita erro de português no texto do site |

### 1.3 Configurações do editor

Já vêm em `.vscode/settings.json` (formatar ao salvar, `tabSize` 2, `LF`, porta 5501 do Live Server,
corretor em pt-BR).

### 1.4 Estrutura de pastas

```
virtuosa-jaragua/
├── index.html              ← Home
├── servicos.html           ← Serviços + filtro + busca
├── antes-depois.html       ← Galeria com filtros + lightbox
├── precos.html             ← Tabela de preços
├── orcamento.html          ← Simulador multi-etapas
├── sobre.html              ← A unidade
├── contato.html            ← Contato + mapa
├── 404.html
├── robots.txt · sitemap.xml · site.webmanifest
├── .gitignore · .prettierrc
├── .vscode/                ← extensões e settings recomendados
├── assets/
│   ├── css/   base.css · components.css · pages.css
│   ├── js/    config.js · main.js · chatbot.js · orcamento.js · galeria.js · servicos.js
│   ├── fonts/ Montserrat (5 pesos) + Satisfy — subset latin, .woff2
│   └── img/   fotos, avatares e antes-depois/
└── docs/                   ← análise, este guia, checklist e guia de imagens
```

**Regra que vale a pena manter:** `assets/js/config.js` é a fonte única de verdade
(telefone, endereço, horários, faixas de preço). Mudou o telefone? Uma linha, sete páginas atualizadas.

### 1.5 Rodar localmente

Abra a pasta no VS Code → clique com o botão direito em `index.html` → **“Open with Live Server”**.
O site sobe em `http://127.0.0.1:5501`.

Alternativa sem extensão nenhuma:

```bash
python3 -m http.server 5501     # depois abra http://localhost:5501
npx serve .                     # se preferir Node
```

> Não abra os arquivos com duplo clique (`file://`): as fontes `woff2` não carregam por causa do CORS
> e o site fica com a fonte de fallback.

---

## Passo 2 — Git e GitHub

### 2.1 Identidade (uma vez por máquina)

```bash
git config --global user.name  "Seu Nome"
git config --global user.email "seu@email.com"
git config --global init.defaultBranch main
```

### 2.2 Primeiro commit

```bash
cd virtuosa-jaragua
git init
git add .
git commit -m "feat: estrutura inicial do site da unidade Jaraguá do Sul"
```

### 2.3 Criar o repositório e enviar

Pelo site: <https://github.com/new> → nome `virtuosa-jaragua-do-sul` → **sem** README/.gitignore
(o projeto já tem) → *Create repository*. Depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/virtuosa-jaragua-do-sul.git
git branch -M main
git push -u origin main
```

Com o GitHub CLI (`gh`) é uma linha só:

```bash
gh repo create virtuosa-jaragua-do-sul --public --source=. --remote=origin --push
```

### 2.4 Organização de branches

```
main       → sempre estável, é o que está publicado
develop    → integração do trabalho em andamento
feature/*  → uma branch por funcionalidade
```

```bash
git checkout -b develop
git push -u origin develop

git checkout -b feature/chatbot
# ... trabalha ...
git add . && git commit -m "feat(chatbot): árvore de conversa e respostas rápidas"
git push -u origin feature/chatbot
# abre Pull Request de feature/chatbot -> develop no GitHub
```

### 2.5 Mensagens de commit

Padrão **Conventional Commits** — dá para gerar changelog automático depois e, num portfólio,
mostra maturidade de processo:

```
feat(orcamento): simulador multi-etapas com cálculo de faixa
fix(menu): fecha o drawer ao pressionar ESC
style(hero): ajusta contraste do subtítulo para AA
docs(readme): instruções de deploy no GitHub Pages
perf(img): converte fotos de serviço para 620px
refactor(css): extrai tokens de cor para base.css
chore(vscode): adiciona extensões recomendadas
```

Sequência sugerida de commits para reconstruir o projeto passo a passo:

1. `chore: estrutura de pastas e configuração do editor`
2. `feat(design-system): tokens de cor, tipografia e reset`
3. `feat(layout): cabeçalho, menu mobile e rodapé`
4. `feat(home): hero, especialidades e prova social`
5. `feat(servicos): listagem com filtro e busca`
6. `feat(precos): tabela completa e pacotes`
7. `feat(orcamento): simulador multi-etapas`
8. `feat(galeria): antes e depois com filtro e lightbox`
9. `feat(chatbot): assistente virtual`
10. `feat(seo): JSON-LD, sitemap e robots`
11. `docs: README, análise da franqueadora e checklist`

---

## Passo 3 — Desenvolvimento das páginas

A ordem que evita retrabalho:

1. **HTML semântico primeiro.** `header`/`nav`/`main`/`section`/`article`/`footer`, um único `<h1>` por
   página e hierarquia de títulos sem pular nível. Escreva o conteúdo real antes de estilizar — texto
   provisório esconde problemas de layout.
2. **CSS mobile-first.** Escreva o estilo do celular sem media query e use `@media (min-width: …)`
   apenas para crescer. Aqui isso está em três arquivos: `base.css` (tokens/reset/tipografia),
   `components.css` (peças reutilizáveis) e `pages.css` (blocos específicos).
3. **JavaScript por último**, como melhoria progressiva: sem JS, o site continua legível e navegável.
   Os cards de serviço e as tabelas estão no HTML — o script só filtra.

### Sobre bibliotecas

O briefing sugeria Swiper, GLightbox e AOS. Elas foram avaliadas e **substituídas por implementações
nativas**, com o custo real de cada uma:

| Sugestão | Peso | O que foi usado no lugar | Ganho |
|---|---|---|---|
| Swiper | ~140 KB | `scroll-snap-type: x mandatory` (CSS puro) | −140 KB, funciona sem JS |
| GLightbox | ~30 KB | Lightbox próprio em `galeria.js` (~2 KB) | −28 KB, foco preso e navegação por teclado |
| AOS | ~15 KB | `IntersectionObserver` em `main.js` (~15 linhas) | −15 KB, respeita `prefers-reduced-motion` |

Total de JavaScript do site: **cerca de 18 KB não minificados**, sem nenhuma dependência externa.
Se você quiser usar as bibliotecas mesmo assim, elas entram via CDN antes de `</body>` — mas saiba
que está trocando ~185 KB por conveniência.

---

## Passo 4 — Testes e otimização

### 4.1 Responsividade

`F12` → ícone de dispositivos (`Ctrl+Shift+M`). Teste em **360, 390, 768, 1024, 1280 e 1440 px**.
Checar: o conteúdo nunca gera rolagem horizontal; o menu vira hambúrguer abaixo de 1024 px; as tabelas
de preço escondem a coluna de observações abaixo de 640 px.

### 4.2 Validação

- HTML: <https://validator.w3.org/nu/> (por URL ou colando o código)
- CSS: <https://jigsaw.w3.org/css-validator/>
- Links quebrados: extensão *HTML Validate* ou `npx linkinator http://localhost:5501 --recurse`

### 4.3 Performance e acessibilidade

`F12` → aba **Lighthouse** → *Analyze page load* (rode em janela anônima). Metas para este projeto:
Performance ≥ 95, Acessibilidade ≥ 95, Boas práticas 100, SEO 100.

Se precisar reotimizar imagens:

```bash
# Squoosh CLI (qualidade 72 costuma ser indistinguível)
npx @squoosh/cli --mozjpeg '{"quality":72}' -d assets/img assets/img/*.jpg
# ou, com ImageMagick instalado
mogrify -resize 1200x -quality 72 assets/img/*.jpg
```

### 4.4 Acessibilidade na mão

- Navegue a página inteira **só com Tab**: o foco precisa estar sempre visível e a ordem tem que fazer
  sentido. `Esc` fecha menu, chat e lightbox.
- Rode a extensão **axe DevTools** ou o **WAVE**.
- Confira contraste: branco sobre `#EC008C` passa em AA para texto grande; para texto pequeno sobre
  rosa, use `#C40074`.

---

## Passo 5 — Publicar

### GitHub Pages (grátis, ideal para portfólio)

`Settings` → `Pages` → *Source*: `Deploy from a branch` → branch `main`, pasta `/ (root)` → *Save*.
Em poucos minutos: `https://SEU-USUARIO.github.io/virtuosa-jaragua-do-sul/`.

> Como o site fica em subpasta, os caminhos **relativos** (`assets/...`, `servicos.html`) funcionam.
> Não troque por caminhos absolutos (`/assets/...`) — quebrariam no Pages.

### Netlify ou Vercel (com domínio próprio e HTTPS)

Netlify: arraste a pasta em <https://app.netlify.com/drop>, ou conecte o repositório
(build command vazio, publish directory `.`).

### Antes de publicar como site real

1. Trocar `https://virtuosa-jaragua.com.br` pelo domínio real em: `<link rel="canonical">` e `og:url`
   das 7 páginas, `robots.txt` e `sitemap.xml`.
2. Remover o bloco `<div class="demo-flag">` das 7 páginas (é o aviso de projeto acadêmico).
3. Percorrer o [checklist de validação com o cliente](02-checklist-validacao-cliente.md).
