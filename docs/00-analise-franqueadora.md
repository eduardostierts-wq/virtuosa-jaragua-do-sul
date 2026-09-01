# Etapa 0 — Análise do site oficial da franqueadora

> Levantamento feito em **31/08/2026** diretamente no site oficial da rede, com inspeção do DOM e dos
> estilos computados. Serve de base para a fidelidade visual do site da unidade de Jaraguá do Sul.

## 1. Onde a rede está publicada hoje

A Virtuosa opera **dois domínios com finalidades diferentes**:

| Domínio | Papel | Estado em 31/08/2026 |
|---|---|---|
| `virtuosaestetica.com.br` | Site institucional (WordPress + Elementor / addon "ThePlus") | **Fora do ar** — respondia HTTP 500 com `<body>` vazio |
| `esteticavirtuosa.com.br` | Plataforma de landing pages das franquias (Next.js + Tailwind, CMS em `franquias.ous.ar`) | No ar, 340 URLs no `sitemap.xml` |

A unidade analisada é **`esteticavirtuosa.com.br/jaragua-do-sul-vila-nova`**, com quatro subpáginas de
categoria (`/depilacao-a-laser`, `/procedimentos-corporais`, `/procedimentos-faciais`, `/emagrecimento`)
e uma de protocolo (`/monjifast`).

> **Achado relevante:** a rede tem ~68 unidades publicadas nesse padrão. Cada uma recebe a **mesma
> landing page** com nome e endereço trocados. É exatamente aí que mora a oportunidade da unidade de
> Jaraguá do Sul — um site próprio compete localmente muito melhor do que um template replicado.

---

## 2. Paleta de cores exata

Valores lidos dos estilos computados (não estimados a olho):

| Token | Valor | Onde aparece |
|---|---|---|
| **Primária** | `rgb(236, 0, 140)` → **`#EC008C`** | classe `.text-primary` / `.bg-primary`: logotipo, títulos H2, botões, topbar |
| **Gradiente rosa** | `linear-gradient(#FF1AA2 35%, #C40074)` | classe `.bg-gradient-pink`: hero e seção de avaliações |
| **Cerise 100** | `#FFE3F8` | textos claros sobre fundo rosa (rodapé) |
| **Cerise 200** | `rgba(255,198,241,.3)` → base `#FFC6F1` | fundos suaves e bordas |
| **Glow neon** | `radial-gradient(#EEFF00 0%, transparente 70%)` com `mix-blend-mode: screen` | brilho amarelo por trás da foto do hero |
| Branco / preto | `#FFFFFF` / `#000000` | texto do menu e corpo |

**Dourado: não existe no site oficial.** A restrição do briefing está alinhada com o que a marca
pratica hoje — este projeto não usa dourado em lugar nenhum.

## 3. Tipografia

| Fonte | Uso | Pesos observados |
|---|---|---|
| **Montserrat** | tudo: menu, títulos, corpo | 400, 500, 600, 800, 900 |
| **Satisfy** (manuscrita) | palavra-destaque do hero — “Melhor Versão!”, 60 px | 400 |
| Space Grotesk | declarada em `--font-space`, sem uso visível | — |

Padrões de título: **caixa alta**, peso 800/900, `line-height` justo. H2 em rosa `#EC008C`; H2/H3
sobre fundo rosa em branco.

## 4. Estrutura da landing page da unidade

```
┌ Topbar rosa (#EC008C) — faixa fina de aviso
├ Header — logotipo + menu (Home · Sobre nós · Cuidados Corporais ·
│          Procedimentos Faciais · Emagrecimento · Depilação a Laser · Monji Fast)
├ Hero — gradiente rosa + glow neon + foto + título caixa alta com
│         palavra manuscrita + CTA
├ Sobre a unidade — texto institucional + 3 pilares
│         (EXCLUSIVIDADE · ATENDIMENTO DE ALTO PADRÃO · CONFORTO) + "Saiba mais"
├ Nossos serviços — 4 cards com "Saber Mais"
├ O que dizem sobre nós — seção em gradiente rosa + prints de avaliações
├ Bloco da unidade — endereço, telefone, "Ligar na recepção" /
│         "Quero Agendar" / "Como Chegar"
└ Rodapé — política de privacidade + assinatura da agência
```

As páginas de categoria seguem outro padrão: hero → carrossel antes/depois → grade de cards de
procedimento (nome + descrição + “Agendar avaliação”) → acordeão de dúvidas frequentes.

## 5. Componentes visuais

- **Botões:** `rounded-full` (pill 100%), fundo `#EC008C`, texto branco, `font-semibold`, altura
  48 px no mobile e 64 px no desktop, ícone à esquerda com `gap` de 16 px.
- **Cards:** cantos arredondados, foto em cima, título e CTA embaixo.
- **Acordeão:** dúvidas frequentes nas páginas de categoria.
- **Flutuante:** botão de WhatsApp fixo no canto inferior direito com etiqueta rosa
  *“Agende sua consulta e GANHE um presente surpresa”*.
- **Sem chatbot, sem simulador, sem tabela de preços.**

## 6. Tom de voz e CTAs

Tom institucional, focado em autoridade da rede: *“17 anos no mercado”*, *“mais de 60 premiações”*,
*“3 Selos de Excelência da ABF”*, *“protocolos únicos criados por Mary Iaczinski”*.

CTAs literais do site: **“Quero Agendar”**, **“Agendar avaliação”**, **“Saber Mais”**, **“Saiba mais”**,
**“Ligar na recepção”**, **“Como Chegar”**, **“Adquirir”**.

## 7. Prova social

A seção *“O que dizem sobre nós”* exibe **capturas de tela** das avaliações do Google
(`Captura_de_tela_2024_02_06_*.png`), com o texto *“Após mais de 74 avaliações…”*. São imagens
estáticas de fevereiro de 2024 — não há integração com a API do Google Business Profile.

## 8. Responsividade e qualidade técnica

Layout responsivo (Tailwind, mobile-first) e funcional. Pontos frágeis encontrados:

| Problema | Impacto |
|---|---|
| `alt="null"` em praticamente todas as imagens | Acessibilidade e SEO de imagem |
| `<title>` da página de categoria renderiza `Procedimentos Corporais em [object Object]` | Bug de SEO visível no resultado de busca |
| Avaliações como print de tela | Sem texto indexável, sem atualização, ilegível para leitor de tela |
| Sem `LocalBusiness` / JSON-LD aparente | Perde rich results e ranking local |
| Sem preços em lugar nenhum | Barreira de entrada — o problema central do briefing |

---

## 9. Oportunidades aplicadas ao site da unidade

| # | Oportunidade | Como foi implementada aqui |
|---|---|---|
| 1 | **Assistente virtual** para captura de lead | Chatbot flutuante com árvore de conversa e respostas rápidas (`assets/js/chatbot.js`), com os pontos de integração de CRM marcados |
| 2 | **Simulador de orçamento** | Formulário de 5 etapas com áreas dinâmicas, cálculo de faixa e resumo enviado ao WhatsApp (`orcamento.html`) |
| 3 | **Publicação de preços** | Página `precos.html` com 44 procedimentos, valor avulso e de pacote — quebra a barreira “aqui é caro” |
| 4 | **Prova social legível** | Depoimentos em HTML (texto indexável), selo 4,9/74 avaliações e `aggregateRating` no JSON-LD |
| 5 | **Galeria antes/depois com filtro** | `antes-depois.html` com filtros por procedimento, lightbox próprio e aviso legal |
| 6 | **CTAs mais persuasivos** | Toda página termina em faixa de CTA; verde do WhatsApp usado só onde a ação é WhatsApp |
| 7 | **SEO local** | JSON-LD `BeautySalon` com endereço, geo, horários, `areaServed` (5 cidades) e ofertas; metatags `geo.*`; títulos e textos citando Jaraguá do Sul e Vila Nova; `sitemap.xml` e `robots.txt` |
| 8 | **Acessibilidade** | `alt` em 100% das imagens, foco visível, navegação por teclado, `aria-*` no menu, acordeão, chat e lightbox |
| 9 | **Performance** | Zero dependência externa de JS, fontes auto-hospedadas (latin subset), imagens otimizadas com `loading="lazy"` |

---

## 10. O que foi mantido idêntico à franqueadora

Para que a unidade continue reconhecível como Virtuosa:

- rosa `#EC008C` como cor de ação e de destaque, sem substituição;
- gradiente `#FF1AA2 → #C40074` no hero e nas faixas de CTA;
- glow neon amarelo em `mix-blend-mode: screen` atrás do hero;
- Montserrat para tudo e Satisfy na palavra-destaque do título;
- botões em pill com ícone à esquerda;
- títulos de seção em caixa alta, peso 800/900;
- WhatsApp flutuante no canto inferior direito;
- discurso de autoridade da rede (17 anos, +60 premiações, 3 selos ABF, protocolos de Mary Iaczinski).

**Pendências de aprovação da franqueadora** estão listadas em
[`02-checklist-validacao-cliente.md`](02-checklist-validacao-cliente.md).
