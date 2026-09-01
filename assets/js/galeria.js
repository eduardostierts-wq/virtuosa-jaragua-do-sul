/* =====================================================================
   VIRTUOSA ESTÉTICA — JARAGUÁ DO SUL
   galeria.js · Antes e Depois — filtros por procedimento + lightbox
   ---------------------------------------------------------------------
   Lightbox escrito à mão (sem GLightbox/Fancybox): ~2 KB contra ~30 KB
   da biblioteca, sem dependência externa e com navegação por teclado
   (← → e ESC), foco preso no diálogo e aria-modal correto.
   ===================================================================== */
(function () {
  'use strict';

  const galeria = document.getElementById('galeria');
  if (!galeria) return;

  const itens = Array.from(galeria.querySelectorAll('.ba'));
  const filtros = Array.from(document.querySelectorAll('[data-filtros="galeria"] .filter'));
  const contador = document.querySelector('[data-contador="galeria"]');
  const vazio = document.querySelector('[data-vazio="galeria"]');

  /* ---------------------------------------------------------------
     FILTRO POR CATEGORIA
     --------------------------------------------------------------- */
  function aplicar(categoria) {
    let visiveis = 0;
    itens.forEach(function (item) {
      const combina = categoria === 'todos' || item.dataset.categoria === categoria;
      item.hidden = !combina;
      if (combina) visiveis++;
    });
    filtros.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filtro === categoria));
    });
    if (contador) {
      contador.textContent = visiveis + (visiveis === 1 ? ' resultado' : ' resultados');
    }
    if (vazio) vazio.hidden = visiveis > 0;
    montarSlides();
  }

  filtros.forEach(function (b) {
    b.addEventListener('click', function () { aplicar(b.dataset.filtro); });
  });

  /* ---------------------------------------------------------------
     LIGHTBOX
     --------------------------------------------------------------- */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('.lightbox__img');
  const lbCap = lb.querySelector('.lightbox__cap');
  let slides = [];
  let indice = 0;
  let ultimoFoco = null;

  function montarSlides() {
    slides = [];
    itens.filter(function (i) { return !i.hidden; }).forEach(function (item) {
      item.querySelectorAll('.ba__pair button').forEach(function (btn) {
        const img = btn.querySelector('img');
        slides.push({ src: img.src, alt: img.alt, legenda: item.dataset.legenda || img.alt, botao: btn });
        btn.dataset.slide = slides.length - 1;
      });
    });
  }

  function abrir(i) {
    indice = (i + slides.length) % slides.length;
    const s = slides[indice];
    lbImg.src = s.src;
    lbImg.alt = s.alt;
    lbCap.textContent = s.legenda + '  ·  ' + (indice + 1) + '/' + slides.length;
    lb.hidden = false;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lightbox__close').focus();
  }

  function fechar() {
    lb.classList.remove('is-open');
    lb.hidden = true;
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }

  galeria.addEventListener('click', function (e) {
    const btn = e.target.closest('.ba__pair button');
    if (!btn) return;
    ultimoFoco = btn;
    abrir(Number(btn.dataset.slide || 0));
  });

  lb.addEventListener('click', function (e) {
    if (e.target === lb) return fechar();
    if (e.target.closest('.lightbox__close')) return fechar();
    if (e.target.closest('.lightbox__nav--prev')) return abrir(indice - 1);
    if (e.target.closest('.lightbox__nav--next')) return abrir(indice + 1);
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft') abrir(indice - 1);
    if (e.key === 'ArrowRight') abrir(indice + 1);
    // Mantém o foco dentro do diálogo (foco preso)
    if (e.key === 'Tab') {
      const focaveis = lb.querySelectorAll('button');
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  });

  /* Filtro inicial: aceita antes-depois.html?filtro=laser */
  const inicial = new URLSearchParams(location.search).get('filtro');
  aplicar(inicial && filtros.some(function (f) { return f.dataset.filtro === inicial; }) ? inicial : 'todos');
})();
