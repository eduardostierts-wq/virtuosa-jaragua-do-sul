/* =====================================================================
   VIRTUOSA ESTÉTICA — JARAGUÁ DO SUL
   orcamento.js · Simulador de orçamento multi-etapas (front-end)
   ---------------------------------------------------------------------
   Fluxo: procedimento → área → objetivo → histórico → faixa etária
          → estimativa + resumo + envio para o WhatsApp.

   O cálculo usa as faixas de VIRTUOSA.precos (config.js). É uma
   ESTIMATIVA: o valor final sempre depende da avaliação presencial —
   isso é dito ao usuário na tela de resultado, por transparência.

   >>> PONTO DE INTEGRAÇÃO FUTURA (CRM) <<<
   A função enviarLead() já monta o objeto do lead. Basta trocar o
   console.log por um POST para o endpoint do CRM da rede.
   ===================================================================== */
(function () {
  'use strict';

  const raiz = document.getElementById('simulador');
  if (!raiz) return;

  /* Categorias cujo preço é por PROTOCOLO (não por sessão) */
  const POR_PROTOCOLO = ['faciais', 'exclusivos'];

  const passos = Array.from(raiz.querySelectorAll('.step'));
  const barra = raiz.querySelector('.quote__bar span');
  const rotuloPasso = raiz.querySelector('[data-step-label]');
  const btnVoltar = raiz.querySelector('[data-acao="voltar"]');
  const btnAvancar = raiz.querySelector('[data-acao="avancar"]');
  const areasBox = raiz.querySelector('[data-areas]');

  const respostas = { categoria: '', area: '', objetivo: '', experiencia: '', idade: '' };
  let atual = 0;
  let iniciado = false; // evita rolar a página no carregamento

  /* ---------------------------------------------------------------
     NAVEGAÇÃO ENTRE ETAPAS
     --------------------------------------------------------------- */
  function irPara(indice) {
    atual = Math.max(0, Math.min(indice, passos.length - 1));
    passos.forEach(function (p, i) { p.classList.toggle('is-active', i === atual); });

    const pct = ((atual + 1) / passos.length) * 100;
    if (barra) barra.style.width = pct + '%';
    if (rotuloPasso) {
      rotuloPasso.textContent = atual === passos.length - 1
        ? 'Resultado'
        : 'Etapa ' + (atual + 1) + ' de ' + (passos.length - 1);
    }

    const ultimo = passos.length - 1;
    btnVoltar.hidden = atual === 0 || atual === ultimo;
    btnAvancar.hidden = atual === ultimo;
    btnAvancar.textContent = atual === ultimo - 1 ? 'Ver minha estimativa' : 'Continuar';
    validar();

    // Foco no título da etapa: leitores de tela anunciam a mudança
    if (iniciado) {
      const titulo = passos[atual].querySelector('.step__q, .estimate__label');
      if (titulo) {
        titulo.setAttribute('tabindex', '-1');
        titulo.focus({ preventScroll: true });
      }
      raiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    iniciado = true;
  }

  /* Habilita o botão "Continuar" apenas quando a etapa foi respondida */
  function validar() {
    const passo = passos[atual];
    const obrigatorio = passo.dataset.required !== 'false';
    const marcado = passo.querySelector('input[type="radio"]:checked');
    btnAvancar.disabled = obrigatorio && !marcado;
  }

  /* ---------------------------------------------------------------
     ETAPA 2 — ÁREAS DINÂMICAS conforme a categoria escolhida
     --------------------------------------------------------------- */
  function montarAreas(categoria) {
    const areas = VIRTUOSA.precos[categoria] || {};
    areasBox.innerHTML = Object.keys(areas).map(function (chave, i) {
      const id = 'area-' + chave;
      return '<label class="option">' +
               '<input type="radio" name="area" id="' + id + '" value="' + chave + '"' + (i === 0 ? '' : '') + '>' +
               '<span>' + (VIRTUOSA.rotulos[chave] || chave) + '</span>' +
             '</label>';
    }).join('');
    respostas.area = '';
  }

  /* ---------------------------------------------------------------
     CÁLCULO DA ESTIMATIVA
     --------------------------------------------------------------- */
  function calcular() {
    const faixa = (VIRTUOSA.precos[respostas.categoria] || {})[respostas.area] || [0, 0];
    const fator = VIRTUOSA.fatores.objetivo[respostas.objetivo] || 1;
    const sessoes = VIRTUOSA.fatores.sessoes[respostas.objetivo] || [1, 1];
    const primeiraVez = respostas.experiencia === 'nao' ? 0.97 : 1; // condição de boas-vindas

    let min, max, sMin, sMax;

    if (POR_PROTOCOLO.indexOf(respostas.categoria) !== -1) {
      // Preço já é do protocolo fechado
      sMin = 1; sMax = 1;
      min = faixa[0] * fator * primeiraVez;
      max = faixa[1] * fator;
    } else {
      sMin = sessoes[0]; sMax = sessoes[1];
      const desconto = sMin >= 10 ? (1 - VIRTUOSA.fatores.descontoPacote) : 1;
      min = faixa[0] * sMin * fator * desconto * primeiraVez;
      max = faixa[1] * sMax * fator;
    }

    const arredonda = function (v) { return Math.round(v / 10) * 10; };
    return { min: arredonda(min), max: arredonda(max), sMin: sMin, sMax: sMax };
  }

  /* ---------------------------------------------------------------
     TELA DE RESULTADO
     --------------------------------------------------------------- */
  function mostrarResultado() {
    const r = calcular();
    const porProtocolo = POR_PROTOCOLO.indexOf(respostas.categoria) !== -1;

    raiz.querySelector('[data-estimativa]').textContent = brl(r.min) + ' a ' + brl(r.max);

    raiz.querySelector('[data-plano]').textContent = porProtocolo
      ? 'Protocolo completo, aplicação única com manutenção sugerida em 6 a 12 meses.'
      : 'Plano sugerido: ' + r.sMin + ' a ' + r.sMax + ' sessões' +
        (r.sMin >= 10 ? ' — já com os ' + (VIRTUOSA.fatores.descontoPacote * 100) + '% de desconto de pacote fechado.' : '.');

    const resumo = raiz.querySelector('[data-resumo]');
    const linhas = [
      ['Procedimento', VIRTUOSA.rotulos[respostas.categoria]],
      ['Área', VIRTUOSA.rotulos[respostas.area]],
      ['Objetivo', VIRTUOSA.rotulos[respostas.objetivo]],
      ['Já fez tratamento antes', VIRTUOSA.rotulos[respostas.experiencia]]
    ];
    if (respostas.idade && respostas.idade !== 'prefiro-nao') {
      linhas.push(['Faixa etária', VIRTUOSA.rotulos[respostas.idade]]);
    }
    resumo.innerHTML = linhas.map(function (l) {
      return '<div><dt>' + l[0] + '</dt><dd>' + (l[1] || '—') + '</dd></div>';
    }).join('');

    /* Mensagem pré-preenchida do WhatsApp ------------------------- */
    const texto =
      'Olá! Fiz a simulação no site da Virtuosa Jaraguá do Sul e gostaria de agendar minha avaliação gratuita.\n\n' +
      '• Procedimento: ' + VIRTUOSA.rotulos[respostas.categoria] + '\n' +
      '• Área: ' + VIRTUOSA.rotulos[respostas.area] + '\n' +
      '• Objetivo: ' + VIRTUOSA.rotulos[respostas.objetivo] + '\n' +
      '• Já fiz tratamento antes: ' + VIRTUOSA.rotulos[respostas.experiencia] + '\n' +
      (respostas.idade && respostas.idade !== 'prefiro-nao'
        ? '• Faixa etária: ' + VIRTUOSA.rotulos[respostas.idade] + '\n' : '') +
      '• Estimativa do site: ' + brl(r.min) + ' a ' + brl(r.max) + '\n\n' +
      'Podemos agendar?';

    const btnWa = raiz.querySelector('[data-wa-orcamento]');
    btnWa.href = waLink(texto);
    btnWa.target = '_blank';
    btnWa.rel = 'noopener';

    enviarLead(r);
  }

  /* ---------------------------------------------------------------
     ENVIO DO LEAD  >>> AQUI ENTRA O CRM <<<
     --------------------------------------------------------------- */
  function enviarLead(estimativa) {
    const lead = {
      origem: 'site-jaragua-do-sul',
      formulario: 'orcamento-rapido',
      respostas: respostas,
      estimativa: estimativa,
      pagina: location.href,
      em: new Date().toISOString()
    };
    // TODO(CRM): fetch('https://api.crm-da-rede.com.br/v1/leads', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(lead)
    // });
    console.info('[Virtuosa][orçamento] lead pronto para o CRM:', lead);
  }

  /* ---------------------------------------------------------------
     EVENTOS
     --------------------------------------------------------------- */
  raiz.addEventListener('change', function (e) {
    const input = e.target;
    if (input.type !== 'radio') return;

    if (input.name === 'categoria') {
      respostas.categoria = input.value;
      montarAreas(input.value);
    } else if (input.name === 'area') {
      respostas.area = input.value;
    } else if (input.name === 'objetivo') {
      respostas.objetivo = input.value;
    } else if (input.name === 'experiencia') {
      respostas.experiencia = input.value;
    } else if (input.name === 'idade') {
      respostas.idade = input.value;
    }
    validar();
  });

  btnAvancar.addEventListener('click', function () {
    if (atual === passos.length - 2) {
      mostrarResultado();
    }
    irPara(atual + 1);
  });
  btnVoltar.addEventListener('click', function () { irPara(atual - 1); });

  const btnRefazer = raiz.querySelector('[data-acao="refazer"]');
  if (btnRefazer) {
    btnRefazer.addEventListener('click', function () {
      raiz.querySelectorAll('input[type="radio"]').forEach(function (i) { i.checked = false; });
      Object.keys(respostas).forEach(function (k) { respostas[k] = ''; });
      areasBox.innerHTML = '<p class="hint">Escolha primeiro o procedimento na etapa anterior.</p>';
      irPara(0);
    });
  }

  /* Pré-seleção via querystring: orcamento.html?cat=laser
     usada pelos botões "Solicitar orçamento" dos cards de serviço. */
  const cat = new URLSearchParams(location.search).get('cat');
  if (cat && VIRTUOSA.precos[cat]) {
    const alvo = raiz.querySelector('input[name="categoria"][value="' + cat + '"]');
    if (alvo) {
      alvo.checked = true;
      respostas.categoria = cat;
      montarAreas(cat);
    }
  }

  irPara(0);
})();
