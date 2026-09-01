/* =====================================================================
   VIRTUOSA ESTÉTICA — JARAGUÁ DO SUL
   servicos.js · filtro por categoria + busca em tempo real
   ---------------------------------------------------------------------
   Os cards já vêm no HTML (bom para SEO e para quem está sem JS).
   Este script apenas mostra/esconde — nada é renderizado por JavaScript.
   ===================================================================== */
(function () {
  'use strict';

  const lista = document.getElementById('lista-servicos');
  if (!lista) return;

  const cards = Array.from(lista.querySelectorAll('[data-categoria]'));
  const filtros = Array.from(document.querySelectorAll('[data-filtros="servicos"] .filter'));
  const busca = document.getElementById('busca');
  const contador = document.querySelector('[data-contador="servicos"]');
  const vazio = document.querySelector('[data-vazio="servicos"]');

  let categoriaAtiva = 'todos';

  /* Remove acentos para que "depilacao" encontre "depilação". */
  function normalizar(txt) {
    return (txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function aplicar() {
    const termo = normalizar(busca ? busca.value.trim() : '');
    let visiveis = 0;

    cards.forEach(function (card) {
      const okCategoria = categoriaAtiva === 'todos' || card.dataset.categoria === categoriaAtiva;
      const okBusca = !termo || normalizar(card.dataset.busca || card.textContent).indexOf(termo) !== -1;
      const mostrar = okCategoria && okBusca;
      card.hidden = !mostrar;
      if (mostrar) visiveis++;
    });

    filtros.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filtro === categoriaAtiva));
    });
    if (contador) {
      contador.textContent = visiveis + (visiveis === 1 ? ' procedimento' : ' procedimentos');
    }
    if (vazio) vazio.hidden = visiveis > 0;
  }

  filtros.forEach(function (b) {
    b.addEventListener('click', function () {
      categoriaAtiva = b.dataset.filtro;
      aplicar();
      // Mantém a URL compartilhável (ex.: servicos.html?cat=laser)
      const url = new URL(location.href);
      if (categoriaAtiva === 'todos') url.searchParams.delete('cat');
      else url.searchParams.set('cat', categoriaAtiva);
      history.replaceState(null, '', url);
    });
  });

  if (busca) {
    let t;
    busca.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(aplicar, 140); // debounce simples
    });
  }

  /* Estado inicial vindo da URL: servicos.html?cat=faciais */
  const cat = new URLSearchParams(location.search).get('cat');
  if (cat && filtros.some(function (f) { return f.dataset.filtro === cat; })) categoriaAtiva = cat;
  aplicar();
})();
