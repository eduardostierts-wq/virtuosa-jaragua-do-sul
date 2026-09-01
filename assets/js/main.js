/* =====================================================================
   VIRTUOSA ESTÉTICA — JARAGUÁ DO SUL
   main.js · comportamentos globais (todas as páginas)
   · menu mobile acessível
   · sombra do cabeçalho ao rolar
   · animação de entrada das seções (IntersectionObserver)
   · acordeões de FAQ
   · ano automático no rodapé
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     MENU MOBILE (drawer)
     Fecha ao clicar fora, ao pressionar ESC e devolve o foco ao botão.
     --------------------------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.drawer');

  function abrirMenu(abrir) {
    if (!drawer || !toggle) return;
    drawer.classList.toggle('is-open', abrir);
    toggle.setAttribute('aria-expanded', String(abrir));
    document.body.style.overflow = abrir ? 'hidden' : '';
    if (abrir) {
      const primeiro = drawer.querySelector('a, button');
      if (primeiro) primeiro.focus();
    } else {
      toggle.focus();
    }
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      abrirMenu(!drawer.classList.contains('is-open'));
    });
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer || e.target.closest('.drawer__close') || e.target.closest('a')) {
        abrirMenu(false);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) abrirMenu(false);
    });
  }

  /* ---------------------------------------------------------------
     SOMBRA DO CABEÇALHO
     --------------------------------------------------------------- */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     REVELAR SEÇÕES AO ROLAR
     Progressive enhancement: sem JS ou sem suporte, tudo fica visível.
     --------------------------------------------------------------- */
  const alvos = document.querySelectorAll('.reveal');
  if (alvos.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      alvos.forEach(function (el) { io.observe(el); });
    } else {
      alvos.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------------------------------------------------------------
     ACORDEÕES (FAQ)
     --------------------------------------------------------------- */
  document.querySelectorAll('.accordion__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const aberto = btn.getAttribute('aria-expanded') === 'true';
      const painel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!aberto));
      if (painel) painel.classList.toggle('is-open', !aberto);
    });
  });

  /* ---------------------------------------------------------------
     ANO NO RODAPÉ
     --------------------------------------------------------------- */
  document.querySelectorAll('[data-ano]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------------
     FORMULÁRIOS APENAS VISUAIS (sem back-end nesta etapa)
     >>> PONTO DE INTEGRAÇÃO FUTURA (CRM) <<<
     Substituir o bloco abaixo por um fetch() para o endpoint do CRM.
     Exemplo:
       fetch('https://api.crm-da-rede.com.br/v1/leads', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(dados)
       })
     --------------------------------------------------------------- */
  document.querySelectorAll('form[data-fake-submit]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const aviso = form.querySelector('[data-form-msg]');
      const botao = form.querySelector('button[type="submit"]');
      if (botao) { botao.disabled = true; botao.textContent = 'Enviando...'; }

      setTimeout(function () {
        if (aviso) {
          aviso.hidden = false;
          aviso.focus();
        }
        form.reset();
        if (botao) { botao.disabled = false; botao.textContent = botao.dataset.label || 'Enviar'; }
      }, 700);
    });
  });
})();
