# Virtuosa Estética — Unidade Jaraguá do Sul

Site front-end da unidade franqueada da **Virtuosa Estética** em Jaraguá do Sul/SC, desenvolvido para o
projeto acadêmico **Expansionista**, que simula a expansão real de uma franquia.

> **Aviso.** Este é um **site-conceito, não oficial**. A faixa preta no topo de todas as páginas
> deixa isso explícito para qualquer visitante. Preços e depoimentos são ilustrativos.
> Para transformar em site real, siga o
> [checklist de validação](docs/02-checklist-validacao-cliente.md).

**HTML5 + CSS3 + JavaScript puro.** Sem framework, sem build, sem dependência externa — abre no Live
Server e publica no GitHub Pages sem configuração.

---

## O que este site resolve

A rede publica hoje uma landing page padronizada por unidade, sem preços, sem simulador e com as
avaliações do Google em forma de print. O diagnóstico completo está em
[`docs/00-analise-franqueadora.md`](docs/00-analise-franqueadora.md).

O problema comercial da unidade é específico: **a clínica é bonita e moderna, e por isso as pessoas
presumem que é cara** — parte do público classe B desiste antes de pedir orçamento. Tudo aqui foi
desenhado em cima disso:

| Barreira | Resposta no site |
|---|---|
| “Deve ser caro” | Tabela de preços pública com 44 procedimentos e valores de pacote |
| “Não sei quanto vai me custar” | Simulador de orçamento em 5 perguntas, com faixa estimada na hora |
| “Tenho vergonha de perguntar o preço” | Assistente virtual que responde valores sem precisar falar com ninguém |
| “Será que funciona mesmo?” | Galeria antes/depois com filtro e depoimentos em texto (indexáveis) |
| “Onde fica? Atende sábado?” | SEO local, NAP no rodapé, mapa e horários |

---

## Funcionalidades

**Assistente virtual (`assets/js/chatbot.js`)** — botão flutuante com pulso, janela na identidade da
marca, saudação automática, indicador de digitação e respostas rápidas: *Agendar avaliação · Ver preços ·
Simular orçamento · Falar com atendente · Ver resultados*. Cada nó pode devolver botões de ação
(WhatsApp, telefone ou navegação). Abre sozinho uma vez por sessão, após 18 s.

**Simulador de orçamento (`orcamento.html` + `assets/js/orcamento.js`)** — 5 etapas com barra de
progresso: procedimento → área (**as opções mudam conforme o procedimento**) → objetivo → histórico →
faixa etária (opcional). Calcula uma faixa a partir de `VIRTUOSA.precos`, aplica o multiplicador do
objetivo, o número típico de sessões, o desconto de pacote e a condição de primeira vez. No fim, mostra
o resumo e monta um link `wa.me` com **todas as respostas e a estimativa já escritas na mensagem**.
Aceita pré-seleção por URL: `orcamento.html?cat=laser`.

**Galeria antes e depois (`antes-depois.html`)** — 9 casos com filtro por procedimento, contador de
resultados e lightbox próprio (setas, `Esc`, foco preso no diálogo). Aviso legal no topo.

**Serviços (`servicos.html`)** — 39 procedimentos com filtro por categoria + busca em tempo real que
ignora acentos. Os cards estão no HTML (bons para SEO); o JavaScript apenas mostra e esconde. O filtro
grava o estado na URL: `servicos.html?cat=faciais`.

**Preços (`precos.html`)** — 5 tabelas por categoria, valor avulso e de pacote, 3 pacotes em destaque
e FAQ sobre pagamento.

**SEO local** — JSON-LD `BeautySalon` com endereço, geo, horários, `aggregateRating`, `makesOffer` e
`areaServed` (Jaraguá do Sul, Guaramirim, Schroeder, Corupá e Massaranduba); `BreadcrumbList` nas
páginas internas; `FAQPage` onde há FAQ; metatags `geo.*`, Open Graph, `sitemap.xml` e `robots.txt`.

---

## Rodando localmente

```bash
git clone https://github.com/SEU-USUARIO/virtuosa-jaragua-do-sul.git
cd virtuosa-jaragua-do-sul
code .
```

No VS Code, botão direito em `index.html` → **Open with Live Server**.
Sem a extensão: `python3 -m http.server 5501` e abra `http://localhost:5501`.

> **Não abra com duplo clique.** Em `file://` o navegador bloqueia as fontes `.woff2` por CORS e o site
> aparece com a fonte de fallback.

Passo a passo completo de ambiente, Git e deploy: [`docs/01-guia-passo-a-passo.md`](docs/01-guia-passo-a-passo.md).

---

## Estrutura

```
.
├── index.html  servicos.html  antes-depois.html  precos.html
├── orcamento.html  sobre.html  contato.html  404.html
├── robots.txt   sitemap.xml   site.webmanifest
├── .vscode/     extensões e settings recomendados
├── assets/
│   ├── css/
│   │   ├── base.css         tokens, reset, tipografia, utilitários
│   │   ├── components.css   botões, cards, header, footer, chat, formulários, lightbox
│   │   └── pages.css        hero, especialidades, simulador, contato
│   ├── js/
│   │   ├── config.js        ⭐ fonte única de verdade (dados da unidade + preços)
│   │   ├── main.js          menu, scroll reveal, acordeões, formulários
│   │   ├── chatbot.js       assistente virtual
│   │   ├── orcamento.js     simulador multi-etapas
│   │   ├── galeria.js       filtros + lightbox
│   │   └── servicos.js      filtro + busca
│   ├── fonts/               Montserrat (5 pesos) + Satisfy — subset latin
│   └── img/                 fotos, avatares e antes-depois/
└── docs/
    ├── 00-analise-franqueadora.md        Etapa 0 — análise do site oficial
    ├── 01-guia-passo-a-passo.md          ambiente, Git, testes e deploy
    ├── 02-checklist-validacao-cliente.md o que precisa de aprovação
    └── 03-imagens.md                     inventário e troca de fotos
```

---

## Personalizando

### Dados da unidade, WhatsApp e preços

Tudo em **`assets/js/config.js`**. Trocou o telefone ali? As 7 páginas acompanham — todos os links de
WhatsApp são montados por `waLink()` a partir de `[data-wa]`.

```js
unidade: {
  telefone: '(47) 99105-4027',
  whatsapp: '5547991054027',   // só dígitos, com DDI 55
  endereco: 'R. 25 de Julho, 786 — Vila Nova',
  ...
}
```

> **Atenção:** a tabela visível em `precos.html` e as faixas de `VIRTUOSA.precos` são hoje duas fontes
> separadas. Ao alterar preços, mude as duas.

### Textos e imagens

Textos ficam direto no HTML de cada página, em português e sem template engine.
Imagens: mantenha o nome do arquivo e a proporção — detalhes em [`docs/03-imagens.md`](docs/03-imagens.md).

### Cores e tipografia

Em `assets/css/base.css`, bloco `:root`. **O rosa `#EC008C` é o DNA da marca e não deve ser alterado.**
Dourado não é usado nesta versão (aprovação pendente da franqueadora).

### Conversa do chatbot

Em `assets/js/chatbot.js`, objeto `NOS`. Cada nó tem `rotulo` (texto do botão), `texto` (resposta,
aceita HTML), `acoes` (botões) e `opcoes` (próximas respostas rápidas). Adicionar um assunto é
adicionar um item ao objeto.

---

## Onde plugar o CRM

Nenhum dado sai do navegador nesta etapa. Os três pontos de integração estão marcados no código com
`>>> PONTO DE INTEGRAÇÃO FUTURA (CRM) <<<` e `TODO(CRM)`:

| Arquivo | Função | O que fazer |
|---|---|---|
| `assets/js/orcamento.js` | `enviarLead()` | Objeto do lead já montado (respostas + estimativa + página + timestamp). Trocar o `console.log` por um `fetch` POST |
| `assets/js/chatbot.js` | `registrarInteracao()` | Envia cada passo da conversa; `estado.historico` guarda o caminho completo |
| `assets/js/main.js` | `form[data-fake-submit]` | Formulário de contato: substituir o `setTimeout` simulado pelo POST real |

```js
// exemplo em orcamento.js → enviarLead()
await fetch('https://api.crm-da-rede.com.br/v1/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  body: JSON.stringify(lead)
});
```

Sem back-end próprio, dá para publicar hoje com **Formspree**, **Netlify Forms** ou um webhook do
**Zapier/Make** — nesses casos, revise a Política de Privacidade e o texto do consentimento LGPD.

---

## Decisões técnicas

**Zero bibliotecas de terceiros.** Swiper, GLightbox e AOS foram avaliados e substituídos por
`scroll-snap`, um lightbox próprio de ~2 KB e `IntersectionObserver`. Economia de ~185 KB — todo o
JavaScript do site cabe em cerca de 18 KB não minificados.

**Fontes auto-hospedadas.** Montserrat e Satisfy vêm de `assets/fonts/` (subset latin, `.woff2`,
~125 KB no total). Sem requisição ao Google Fonts: mais rápido, funciona offline e não expõe o IP do
visitante a terceiros — ponto positivo para adequação à LGPD.

**Mobile-first de verdade.** Todo o CSS base é do celular; media queries só com `min-width`.
Escala tipográfica fluida com `clamp()`, sem breakpoints de fonte.

**Acessibilidade.** Skip link, foco visível em tudo, `aria-expanded`/`aria-controls` no menu, acordeão
e chat, foco preso no lightbox e no drawer, `Esc` fecha tudo, `alt` em 100% das imagens, `role="log"` +
`aria-live` no chat e `prefers-reduced-motion` respeitado.

**Melhoria progressiva.** Sem JavaScript, todo o conteúdo continua legível: os cards de serviço, as
tabelas de preço e a galeria estão no HTML. O script apenas filtra, simula e conversa.

---

## Publicando

**GitHub Pages:** `Settings` → `Pages` → branch `main`, pasta `/ (root)`.
Os caminhos são relativos de propósito, então funciona em subpasta.

**Netlify/Vercel:** build command vazio, publish directory `.`.

Antes de publicar como site oficial: trocar o domínio em `canonical`, `og:url`, `robots.txt` e
`sitemap.xml`; remover a `<div class="demo-flag">` das 7 páginas; e percorrer o
[checklist de validação](docs/02-checklist-validacao-cliente.md).

---

## Créditos

- **Marca, paleta e tipografia:** Virtuosa Estética (franqueadora). Cores e fontes levantadas do site
  oficial em 31/08/2026 e documentadas em `docs/00-analise-franqueadora.md`.
- **Fotografias:** [Unsplash](https://unsplash.com) — licença de uso livre. Substituir por fotos da
  unidade antes de publicar.
- **Fontes:** [Montserrat](https://fonts.google.com/specimen/Montserrat) e
  [Satisfy](https://fonts.google.com/specimen/Satisfy), SIL Open Font License 1.1.
- **Ícones:** desenhados para o projeto, em SVG inline.

Projeto acadêmico **Expansionista**. Não possui vínculo oficial com a Virtuosa Estética e não deve ser
apresentado como o site da unidade.
