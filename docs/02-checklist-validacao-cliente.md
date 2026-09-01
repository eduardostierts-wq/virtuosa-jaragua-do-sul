# Checklist de validação — franqueadora e unidade

Itens que **não podem ir ao ar sem aprovação**. Cada um está marcado no código com um comentário
`<!-- VALIDAR COM O CLIENTE: ... -->` ou `⚠`.

---

## 1. Identidade visual (aprovação da franqueadora)

| # | Item | Situação | Onde está no código |
|---|---|---|---|
| 1.1 | **Dourado** | ❌ **Não utilizado.** Aprovação pendente. Se for liberado, sugerimos entrar apenas como filete em selos de protocolo exclusivo, nunca em botão ou texto corrido | comentário no topo de `assets/css/base.css` |
| 1.2 | **Logotipo** | ⚠ Em uso o **logotipo oficial da rede**, recortado com fundo transparente a partir de um arquivo de baixa resolução (241 × 94 px). Serve para tela; **não serve para impressão nem para telas grandes**. Solicitar o arquivo vetorial (SVG/AI) no manual de marca e confirmar a autorização de uso | `assets/img/logo.png` e `logo-branco.png`; regras `.brand__logo` em `components.css` |
| 1.3 | Paleta rosa | ✅ Extraída do site oficial (`#EC008C`, `#FF1AA2`, `#C40074`, `#FFE3F8`) | `:root` em `base.css` |
| 1.4 | Tipografia | ✅ Montserrat + Satisfy, iguais às do site oficial, auto-hospedadas (SIL Open Font License) | `assets/fonts/` |
| 1.5 | Glow neon amarelo do hero | ✅ Presente no site oficial; confirmar se pode ser replicado na unidade | `.hero__glow` em `pages.css` |

## 2. Dados da unidade

| # | Item | Situação |
|---|---|---|
| 2.1 | Endereço — R. 25 de Julho, 786, Vila Nova, Jaraguá do Sul/SC, 89259-000 | ⚠ Confirmar (fonte: site oficial da rede) |
| 2.2 | Telefone/WhatsApp — (47) 99105-4027 | ⚠ Confirmar. **Enquanto for peça de portfólio, avaliar trocar por um número fictício** para não gerar mensagens reais na recepção — é uma linha em `assets/js/config.js` |
| 2.3 | E-mail — `jaraguadosul@virtuosaestetica.com.br` | ❌ Ilustrativo, confirmar o real |
| 2.4 | Horários — seg–sex 8h–20h, sáb 8h–14h | ⚠ Confirmar |
| 2.5 | Coordenadas do mapa (−26.4996643, −49.0808047) | ⚠ Confirmar |
| 2.6 | Redes sociais (Instagram/Facebook) | ❌ Links vazios — preencher em `config.js` |
| 2.7 | Responsável técnica + registro profissional | ❌ **Obrigatório em publicidade de serviços de estética.** Preencher nome e nº de registro no rodapé |
| 2.8 | CNPJ da unidade no rodapé | ❌ Recomendado; incluir se o cliente autorizar |

## 3. Preços

| # | Item | Situação |
|---|---|---|
| 3.1 | Publicar preços | ⚠ **Decisão estratégica do briefing.** Confirmar com a franqueadora se há política de rede sobre divulgação de valores |
| 3.2 | Tabela completa (44 procedimentos) | ⚠ Valores de referência de mercado para SC — **validar item a item** com a unidade |
| 3.3 | Desconto de pacote (20%) e parcelamento em 10x | ⚠ Confirmar condições reais |
| 3.4 | Vigência dos valores | ⚠ Definir data e política de reajuste (o texto atual diz “vigentes em 2026”) |
| 3.5 | Sincronia entre a tabela visível e o simulador | ⚠ `precos.html` (HTML) e `VIRTUOSA.precos` (`config.js`) são hoje duas fontes. Ao alterar preços, **mude os dois** — ou migre para um CMS |

## 4. Imagens

| # | Item | Situação |
|---|---|---|
| 4.1 | Fotos de banco de imagens (Unsplash) | ✅ Uso livre, sem atribuição obrigatória. **Substituir por fotos reais da unidade** antes de publicar |
| 4.2 | Galeria antes/depois | ❌ São **placeholders** com marca d’água “imagem ilustrativa”. Trocar por fotos reais |
| 4.3 | Autorização de uso de imagem das pacientes | ❌ **Obrigatório**: termo assinado para cada foto de antes/depois |
| 4.4 | Regras de publicidade de antes/depois | ⚠ Conselhos profissionais da área (biomedicina, farmácia, enfermagem, odontologia e medicina) impõem restrições à divulgação de antes/depois. **Consultar o conselho da responsável técnica** antes de publicar |
| 4.5 | Fotos e nomes da equipe | ❌ Ilustrativos — substituir com autorização |

## 5. Textos e conteúdo

| # | Item | Situação |
|---|---|---|
| 5.1 | Depoimentos | ❌ **Fictícios**, criados para o projeto. Substituir por avaliações reais do Google (ver item 5.2) — publicar depoimento inventado como real é propaganda enganosa |
| 5.2 | Selo “4,9 / 74 avaliações” | ⚠ Número real observado no site da rede em 31/08/2026, mas **muda com o tempo**. Ideal: integrar a API do Google Business Profile |
| 5.3 | “Maior unidade da rede depois da matriz” | ⚠ Afirmação do briefing — confirmar antes de publicar |
| 5.4 | “17 anos”, “+60 premiações”, “3 Selos ABF” | ✅ Texto institucional do próprio site da rede — reconfirmar a cada ano |
| 5.5 | Promessas de resultado | ✅ O site evita garantir resultado e traz aviso explícito na galeria. **Manter esse cuidado** em qualquer texto novo |

## 6. Jurídico e privacidade

| # | Item | Situação |
|---|---|---|
| 6.1 | Política de Privacidade | ❌ Página não criada. **Necessária** — o formulário coleta nome e telefone |
| 6.2 | Consentimento LGPD no formulário | ✅ Checkbox obrigatório implementado em `contato.html` |
| 6.3 | Aviso de cookies | ✅ Não é necessário hoje: o site não usa cookies nem analytics. **Se adicionar Google Analytics ou Meta Pixel, o banner passa a ser obrigatório** |
| 6.4 | Aviso de projeto acadêmico | ✅ Faixa `.demo-flag` no topo das 7 páginas. Remover apenas quando o site for oficial |

## 7. Antes de trocar a chave

- [ ] Domínio real substituído em `canonical`, `og:url`, `robots.txt` e `sitemap.xml`
- [ ] Bloco `.demo-flag` removido das 7 páginas
- [ ] Todos os itens ❌ acima resolvidos
- [ ] Página de Política de Privacidade publicada e linkada no rodapé
- [ ] Google Search Console e Google Business Profile configurados com a URL
- [ ] Lighthouse ≥ 95 em Performance e Acessibilidade
- [ ] Teste real de envio de WhatsApp em celular Android e iPhone
