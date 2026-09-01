/* =====================================================================
   VIRTUOSA ESTÉTICA — JARAGUÁ DO SUL
   config.js · FONTE ÚNICA DE VERDADE do site
   ---------------------------------------------------------------------
   Tudo que o cliente costuma pedir para trocar (telefone, endereço,
   horários, faixas de preço da simulação) está neste arquivo.
   Edite aqui e a mudança se propaga para o assistente virtual, para o
   simulador de orçamento e para todos os links de WhatsApp.

   >>> PONTO DE INTEGRAÇÃO FUTURA (CRM) <<<
   Quando o CRM da rede for conectado, os objetos UNIDADE e PRECOS
   passam a ser carregados de uma API em vez de ficarem fixos aqui.
   Ver README.md → "Onde plugar o CRM".
   ===================================================================== */

const VIRTUOSA = {

  /* ---------------------------------------------------------------
     1. DADOS DA UNIDADE
     Fonte: página oficial da unidade em esteticavirtuosa.com.br
     ⚠ VALIDAR COM O CLIENTE antes de publicar (ver docs/02-checklist).
     --------------------------------------------------------------- */
  unidade: {
    nome: 'Virtuosa Estética — Jaraguá do Sul',
    bairro: 'Vila Nova',
    endereco: 'R. 25 de Julho, 786 — Vila Nova',
    cidade: 'Jaraguá do Sul',
    uf: 'SC',
    cep: '89259-000',
    telefone: '(47) 99105-4027',
    // Somente dígitos, com DDI 55 — usado para montar os links wa.me
    whatsapp: '5547991054027',
    email: 'jaraguadosul@virtuosaestetica.com.br', // e-mail ilustrativo
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/clinicavirtuosajaraguavilanova/',
    mapsUrl: 'https://www.google.com/maps/place/Cl%C3%ADnica+Est%C3%A9tica+Virtuosa+Vila+Nova/@-26.4996643,-49.0808047,17z',
    // Coordenadas usadas no JSON-LD (SEO local)
    lat: -26.4996643,
    lng: -49.0808047,
    horarios: [
      ['Segunda a sexta', '08h00 às 20h00'],
      ['Sábado', '08h00 às 14h00'],
      ['Domingo e feriados', 'Fechado']
    ],
    // Prova social — números exibidos nos selos
    google: { nota: 4.9, avaliacoes: 74 }
  },

  /* ---------------------------------------------------------------
     2. MENSAGENS PADRÃO DE WHATSAPP
     --------------------------------------------------------------- */
  msg: {
    geral: 'Olá! Vim pelo site da Virtuosa Jaraguá do Sul e gostaria de mais informações.',
    avaliacao: 'Olá! Quero agendar minha avaliação gratuita na Virtuosa Jaraguá do Sul.',
    precos: 'Olá! Vi a tabela de preços no site e quero tirar uma dúvida.'
  },

  /* ---------------------------------------------------------------
     3. TABELA DE PREÇOS USADA NO SIMULADOR
     Valores em reais, por sessão, praticados na região (referência de
     mercado para Santa Catarina, público classe B).
     ⚠ Mantenha sincronizado com a tabela visível em precos.html.
     --------------------------------------------------------------- */
  precos: {
    // categoria -> { area: [minimo, maximo] }  (valor por sessão)
    laser: {
      'axilas':            [79, 99],
      'buco':              [69, 89],
      'virilha':           [129, 169],
      'meia-perna':        [149, 189],
      'perna-inteira':     [219, 279],
      'corpo-inteiro':     [590, 790]
    },
    corporais: {
      'abdomen':           [180, 260],
      'flancos':           [180, 260],
      'gluteos':           [190, 280],
      'coxas':             [190, 280],
      'bracos':            [140, 200],
      'costas':            [140, 200]
    },
    emagrecimento: {
      'abdomen':           [220, 320],
      'flancos':           [220, 320],
      'coxas':             [220, 320],
      'corpo-todo':        [390, 560]
    },
    faciais: {
      'rosto-completo':    [149, 390],
      'terco-superior':    [590, 890],
      'labios':            [990, 1290],
      'contorno':          [890, 1490]
    },
    exclusivos: {
      'gluteos':           [1500, 2400],
      'abdomen':           [1200, 1900],
      'corpo-todo':        [1900, 3200]
    }
  },

  /* Multiplicadores aplicados sobre a faixa base ------------------- */
  fatores: {
    // Objetivo declarado pela cliente
    objetivo: {
      'manutencao':   0.85,
      'resultado':    1.00,
      'transformacao':1.25
    },
    // Nº de sessões sugerido por objetivo (usado no texto do resumo)
    sessoes: {
      'manutencao':   [1, 3],
      'resultado':    [4, 6],
      'transformacao':[8, 10]
    },
    // Desconto de pacote fechado a partir de 10 sessões
    descontoPacote: 0.20
  },

  /* ---------------------------------------------------------------
     4. RÓTULOS AMIGÁVEIS (usados no resumo e na mensagem de WhatsApp)
     --------------------------------------------------------------- */
  rotulos: {
    laser: 'Depilação a laser',
    corporais: 'Procedimentos corporais',
    emagrecimento: 'Emagrecimento',
    faciais: 'Procedimentos faciais',
    exclusivos: 'Protocolos exclusivos Virtuosa',
    'axilas': 'Axilas', 'buco': 'Buço', 'virilha': 'Virilha completa',
    'meia-perna': 'Meia perna', 'perna-inteira': 'Perna inteira', 'corpo-inteiro': 'Corpo inteiro',
    'abdomen': 'Abdômen', 'flancos': 'Flancos', 'gluteos': 'Glúteos', 'coxas': 'Coxas',
    'bracos': 'Braços', 'costas': 'Costas', 'corpo-todo': 'Corpo todo',
    'rosto-completo': 'Rosto completo', 'terco-superior': 'Terço superior (testa e olhos)',
    'labios': 'Lábios', 'contorno': 'Contorno facial',
    'manutencao': 'Manutenção dos resultados',
    'resultado': 'Resultado visível',
    'transformacao': 'Transformação completa',
    'sim': 'Sim, já fiz', 'nao': 'Nunca fiz',
    '18-29': '18 a 29 anos', '30-44': '30 a 44 anos', '45+': '45 anos ou mais',
    'prefiro-nao': 'Prefere não informar'
  }
};

/* ---------------------------------------------------------------
   HELPERS GLOBAIS
   --------------------------------------------------------------- */

/** Monta um link wa.me já com a mensagem codificada. */
function waLink(texto) {
  const msg = texto || VIRTUOSA.msg.geral;
  return 'https://wa.me/' + VIRTUOSA.unidade.whatsapp + '?text=' + encodeURIComponent(msg);
}

/** Formata número como moeda brasileira sem centavos. */
function brl(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

/* Preenche automaticamente todo elemento com data-wa (opcionalmente
   data-wa-msg) e todo elemento com data-unidade="campo". */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    const chave = el.dataset.wa;                       // geral | avaliacao | precos
    el.href = waLink(el.dataset.waMsg || VIRTUOSA.msg[chave] || VIRTUOSA.msg.geral);
    el.rel = 'noopener';
    el.target = '_blank';
  });
  document.querySelectorAll('[data-unidade]').forEach(function (el) {
    const v = VIRTUOSA.unidade[el.dataset.unidade];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-tel]').forEach(function (el) {
    el.href = 'tel:+' + VIRTUOSA.unidade.whatsapp;
  });
});
