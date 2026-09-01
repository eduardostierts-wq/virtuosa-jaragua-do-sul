# Guia de imagens — o que é o quê e como substituir

Todas as fotos vieram do **Unsplash** (licença de uso livre, inclusive comercial, sem atribuição
obrigatória) e foram redimensionadas e comprimidas em JPEG qualidade ~60. O conjunto inteiro pesa
**menos de 900 KB**.

## Inventário

| Arquivo | Onde aparece | Tamanho entregue | O que colocar no lugar |
|---|---|---|---|
| `hero.jpg` | Hero da home | 760 px de largura | Cliente real ou profissional da unidade, enquadramento vertical 4:5, fundo claro |
| `unidade.jpg` | CTA da página “A Unidade” | 700 px | Foto ampla das salas de atendimento |
| `sala-rosa.jpg` | Página “A Unidade”, CTA do contato | 520 px | Sala de atendimento na vertical |
| `estrutura.jpg` | “A Unidade”, CTA da galeria | 700 px | Corredor / estrutura da clínica |
| `recepcao.jpg` | “A Unidade”, CTA de preços | 700 px | Recepção com a fachada ou o balcão |
| `equipe.jpg` | CTA da página de serviços | 700 px | Profissional em atendimento |
| `equipe2.jpg` | Card da responsável técnica | 520 px | Retrato da responsável técnica |
| `av1…av5.jpg` | Avatares dos depoimentos | 150 px | Foto da cliente **com autorização**, ou remover o `<img>` e usar as iniciais |
| `serv-corporais.jpg` | Card “Procedimentos corporais” | 620 px | Sessão corporal na unidade |
| `serv-faciais.jpg` | Card “Procedimentos faciais” | 620 px | Sessão facial |
| `serv-laser.jpg` | Card “Depilação a laser” | 620 px | Aplicação de laser |
| `serv-emagrecimento.jpg` | Card “Emagrecimento” | 620 px | Consulta nutricional ou protocolo corporal |
| `esp-gluteo.jpg` | Bloco “Harmonização de glúteo” | 760 px | Foto do protocolo |
| `esp-crio.jpg` | Bloco “Criofrequência” | 760 px | Aparelho de criofrequência em uso |
| `cta-final.jpg` | Faixa final da home | 760 px | Cliente satisfeita |
| `antes-depois/*.jpg` | Galeria (9 pares) | 720 × 540 | **Fotos reais com termo de autorização assinado** |
| `favicon.svg` | Ícone da aba | vetor | Ícone oficial da marca |

## Como substituir (3 passos)

1. **Mantenha o mesmo nome de arquivo.** Assim nenhum HTML precisa ser alterado.
2. **Respeite a proporção**: cards de serviço 4:3 · hero 4:5 · antes/depois 4:3 · avatares 1:1.
3. **Comprima antes de subir.** Foto de celular tem 4 MB; o site precisa de ~60 KB.

```bash
# redimensiona e comprime tudo de uma vez (ImageMagick)
mogrify -resize 760x -quality 72 -strip assets/img/*.jpg

# ou sem instalar nada, com Node
npx @squoosh/cli --mozjpeg '{"quality":72}' -d assets/img assets/img/*.jpg
```

Se trocar a proporção de alguma foto, ajuste também o `width` e o `height` da tag `<img>`
correspondente — esses atributos evitam que o layout “pule” enquanto a imagem carrega (CLS).

## Galeria antes e depois

As 18 imagens de `assets/img/antes-depois/` são **placeholders gerados para o projeto**: cada uma tem a
marca d'água diagonal “IMAGEM ILUSTRATIVA”, a etiqueta ANTES/DEPOIS e a tarja inferior avisando que
deve ser substituída. Elas **não representam resultados reais** e não devem ir ao ar como se fossem.

Para trocar por fotos reais:

1. Fotografe sempre com **mesma luz, mesmo ângulo, mesma distância e mesmo fundo** — sem isso a
   comparação não tem valor e ainda soa manipulada.
2. Colha o **termo de autorização de uso de imagem** assinado, por procedimento.
3. Verifique as regras do conselho profissional da responsável técnica sobre divulgação de
   antes/depois (há restrições relevantes em várias categorias no Brasil).
4. Salve como `assets/img/antes-depois/<caso>-antes.jpg` e `<caso>-depois.jpg`, 720 × 540.
5. Ajuste título, tempo de tratamento e categoria no HTML de `antes-depois.html`.

## Onde buscar novas fotos gratuitas

- <https://unsplash.com/pt-br/s/fotografias/beauty-clinic-treatment>
- <https://www.pexels.com/pt-br/procurar/clinica%20estetica/>
- <https://pixabay.com/pt/images/search/est%C3%A9tica/>

Evite fotos que já apareçam em concorrentes da mesma cidade, e nunca use imagens do site oficial da
franqueadora sem autorização por escrito.
