/* =====================================================================
   VIRTUOSA ESTÉTICA — JARAGUÁ DO SUL
   chatbot.js · Assistente virtual (simulado, 100% front-end)
   ---------------------------------------------------------------------
   Como funciona: um pequeno autômato de estados. Cada nó tem uma
   resposta e um conjunto de respostas rápidas. Nada é enviado para
   servidor algum nesta etapa.

   >>> PONTO DE INTEGRAÇÃO FUTURA (CRM / atendimento) <<<
   1) Captura de lead: em `registrarInteracao()` troque o console.log
      por um POST para o endpoint do CRM.
   2) Chat humano: substitua o nó 'atendente' por um widget real
      (ex.: WhatsApp Business API, Chatwoot, Zenvia, Take Blip).
   3) Histórico: `estado.historico` já guarda a conversa, pronta para
      ser enviada junto com o lead.
   ===================================================================== */
(function () {
  'use strict';

  const painel = document.getElementById('chat');
  if (!painel) return;

  const abrirBtn = document.getElementById('chat-open');
  const fecharBtn = painel.querySelector('.chat__close');
  const corpo = painel.querySelector('.chat__body');
  const rapidas = painel.querySelector('.chat__quick');
  const floaters = document.querySelector('.floaters');

  const estado = { historico: [], noAtual: 'inicio', jaAbriu: false };

  /* ---------------------------------------------------------------
     ÁRVORE DE CONVERSA
     texto: aceita HTML simples. {wa} é trocado pelo link do WhatsApp.
     --------------------------------------------------------------- */
  const NOS = {
    inicio: {
      texto: 'Oi! Eu sou a <strong>Vi</strong>, assistente virtual da Virtuosa Jaraguá do Sul. ' +
             'Posso te ajudar a escolher um tratamento, mostrar os valores ou já agendar sua ' +
             '<strong>avaliação gratuita</strong>. Por onde começamos?',
      opcoes: ['agendar', 'precos', 'simular', 'atendente']
    },

    agendar: {
      rotulo: 'Agendar avaliação',
      texto: 'Ótima escolha! A <strong>avaliação é gratuita e sem compromisso</strong>: uma ' +
             'profissional analisa seu caso e monta um plano com valores fechados na hora. ' +
             'Leva cerca de 40 minutos.<br><br>Toque abaixo para escolher seu horário pelo WhatsApp.',
      acoes: [{ rotulo: 'Agendar pelo WhatsApp', wa: 'avaliacao', estilo: 'wa' }],
      opcoes: ['precos', 'endereco', 'simular']
    },

    precos: {
      rotulo: 'Ver preços',
      texto: 'A gente publica os valores, sim — nada de "consulte-nos".<br><br>' +
             'Alguns exemplos: <strong>axilas a laser a partir de R$ 89</strong> a sessão, ' +
             '<strong>criofrequência a partir de R$ 250</strong> e ' +
             '<strong>harmonização de glúteo a partir de R$ 1.500</strong>. ' +
             'Pacotes fechados têm até 20% de desconto.',
      acoes: [{ rotulo: 'Ver tabela completa', href: 'precos.html' }],
      opcoes: ['simular', 'agendar', 'atendente']
    },

    simular: {
      rotulo: 'Simular orçamento',
      texto: 'Em 5 perguntinhas eu te mostro uma <strong>faixa de investimento estimada</strong> ' +
             'para o seu caso — e você já sai com o resumo pronto para mandar no WhatsApp.',
      acoes: [{ rotulo: 'Fazer minha simulação', href: 'orcamento.html' }],
      opcoes: ['precos', 'agendar']
    },

    endereco: {
      rotulo: 'Onde vocês ficam?',
      texto: 'Estamos na <strong>R. 25 de Julho, 786 — Vila Nova, Jaraguá do Sul/SC</strong>. ' +
             'Atendemos de segunda a sexta das 8h às 20h e aos sábados das 8h às 14h.',
      acoes: [{ rotulo: 'Ver no mapa', href: 'contato.html#mapa' }],
      opcoes: ['agendar', 'atendente']
    },

    resultados: {
      rotulo: 'Ver resultados',
      texto: 'Temos uma galeria de antes e depois separada por procedimento. ' +
             'Vale lembrar que <strong>resultados variam de pessoa para pessoa</strong> — por isso ' +
             'a avaliação presencial é tão importante.',
      acoes: [{ rotulo: 'Abrir galeria', href: 'antes-depois.html' }],
      opcoes: ['agendar', 'precos']
    },

    atendente: {
      rotulo: 'Falar com atendente',
      texto: 'Claro! Nossa recepção responde de segunda a sexta das 8h às 20h e no sábado ' +
             'até as 14h. Fora desse horário a mensagem fica registrada e respondemos ' +
             'assim que abrirmos.',
      acoes: [{ rotulo: 'Chamar no WhatsApp', wa: 'geral', estilo: 'wa' },
              { rotulo: 'Ligar na recepção', tel: true }],
      opcoes: ['agendar', 'precos', 'endereco']
    }
  };

  /* ---------------------------------------------------------------
     RENDERIZAÇÃO
     --------------------------------------------------------------- */
  function balao(html, tipo) {
    const div = document.createElement('div');
    div.className = 'msg msg--' + tipo;
    div.innerHTML = html;
    corpo.appendChild(div);
    corpo.scrollTop = corpo.scrollHeight;
    return div;
  }

  function digitando() {
    const div = document.createElement('div');
    div.className = 'typing';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = '<span></span><span></span><span></span>';
    corpo.appendChild(div);
    corpo.scrollTop = corpo.scrollHeight;
    return div;
  }

  function montarAcoes(acoes) {
    if (!acoes || !acoes.length) return '';
    return '<div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.85rem">' +
      acoes.map(function (a) {
        let href = a.href || '#';
        if (a.wa) href = waLink(VIRTUOSA.msg[a.wa]);
        if (a.tel) href = 'tel:+' + VIRTUOSA.unidade.whatsapp;
        const externo = a.wa ? ' target="_blank" rel="noopener"' : '';
        const classe = a.estilo === 'wa' ? 'btn btn--wa btn--sm' : 'btn btn--sm';
        return '<a class="' + classe + '" href="' + href + '"' + externo + '>' + a.rotulo + '</a>';
      }).join('') + '</div>';
  }

  function mostrarRapidas(chaves) {
    rapidas.innerHTML = '';
    (chaves || []).forEach(function (chave) {
      const no = NOS[chave];
      if (!no) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = no.rotulo || chave;
      b.addEventListener('click', function () { responder(chave); });
      rapidas.appendChild(b);
    });
    // Atalho sempre disponível
    if (chaves && chaves.indexOf('resultados') === -1) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = 'Ver resultados';
      b.addEventListener('click', function () { responder('resultados'); });
      rapidas.appendChild(b);
    }
  }

  function responder(chave) {
    const no = NOS[chave];
    if (!no) return;

    if (no.rotulo) balao(no.rotulo, 'user');
    registrarInteracao(chave);
    rapidas.innerHTML = '';

    const t = digitando();
    setTimeout(function () {
      t.remove();
      balao(no.texto + montarAcoes(no.acoes), 'bot');
      mostrarRapidas(no.opcoes);
      estado.noAtual = chave;
    }, 620);
  }

  /* ---------------------------------------------------------------
     REGISTRO DE INTERAÇÃO (captura de lead)
     >>> AQUI ENTRA O CRM <<<
     --------------------------------------------------------------- */
  function registrarInteracao(chave) {
    estado.historico.push({ no: chave, em: new Date().toISOString() });
    // TODO(CRM): enviar evento para o CRM da rede.
    // fetch(API + '/eventos', { method:'POST', body: JSON.stringify({
    //   tipo:'chatbot', unidade:'jaragua-do-sul', passo:chave,
    //   pagina:location.pathname, historico:estado.historico }) });
    console.info('[Virtuosa][chatbot] interação registrada:', chave);
  }

  /* ---------------------------------------------------------------
     ABRIR / FECHAR
     --------------------------------------------------------------- */
  function abrir(estadoAberto) {
    painel.classList.toggle('is-open', estadoAberto);
    painel.hidden = !estadoAberto;   // hidden em vez de aria-hidden: evita foco em elemento oculto
    if (floaters) floaters.style.display = estadoAberto ? 'none' : '';
    if (estadoAberto) {
      if (!estado.jaAbriu) {
        estado.jaAbriu = true;
        const t = digitando();
        setTimeout(function () {
          t.remove();
          balao(NOS.inicio.texto, 'bot');
          mostrarRapidas(NOS.inicio.opcoes);
        }, 500);
      }
      if (fecharBtn) fecharBtn.focus();
    } else if (abrirBtn) {
      abrirBtn.focus();
    }
  }

  if (abrirBtn) abrirBtn.addEventListener('click', function () {
    abrirBtn.setAttribute('aria-expanded', 'true');
    abrir(true);
  });
  if (fecharBtn) fecharBtn.addEventListener('click', function () {
    if (abrirBtn) abrirBtn.setAttribute('aria-expanded', 'false');
    abrir(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && painel.classList.contains('is-open')) abrir(false);
  });

  /* Abertura automática discreta após 18s, uma única vez por sessão.
     O sessionStorage é opcional: em navegação anônima ou com cookies
     bloqueados o acesso lança exceção, então tudo fica em try/catch. */
  const memoria = {
    ler: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    gravar: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignora */ } }
  };

  if (!memoria.ler('vi-chat-visto')) {
    setTimeout(function () {
      if (!painel.classList.contains('is-open')) {
        memoria.gravar('vi-chat-visto', '1');
        abrir(true);
      }
    }, 18000);
  }
})();
