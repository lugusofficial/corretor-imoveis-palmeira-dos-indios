// Depoimentos em slides. Progressivo: sem script o trilho rola com o dedo.
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Depoimentos em slides. O trilho anda por transform, um passo de cada vez:
     a rolagem nativa com scroll snap parava entre dois slides no Safari do
     iPhone. Avanca sozinho a cada 7 s ate a primeira interacao (seta,
     arraste ou foco) e ai para de vez. Sem script a janela rola com o dedo. */
  function depoimentos() {
    var raiz = document.querySelector('[data-depo]');
    if (!raiz) { return; }
    var janela = raiz.querySelector('[data-depo-janela]');
    var trilho = raiz.querySelector('[data-depo-trilho]');
    var prev = raiz.querySelector('[data-depo-prev]');
    var next = raiz.querySelector('[data-depo-next]');
    if (!janela || !trilho || !prev || !next) { return; }
    var total = trilho.children.length;
    var largo = window.matchMedia('(min-width: 56em)');
    var indice = 0;
    var parado = reduced;
    raiz.classList.add('is-live');
    janela.scrollLeft = 0;

    // data-depo-um: um slide por vez sempre, quando a secao divide espaco com outra coisa.
    var porTela = function () { return largo.matches && !raiz.hasAttribute('data-depo-um') ? 2 : 1; };
    var ir = function (alvo) {
      var ultimo = Math.max(0, total - porTela());
      indice = alvo > ultimo ? 0 : (alvo < 0 ? ultimo : alvo);
      trilho.style.transform = 'translateX(' + (-indice * 100 / porTela()) + '%)';
    };
    var parar = function () { parado = true; };
    prev.addEventListener('click', function () { parar(); ir(indice - 1); });
    next.addEventListener('click', function () { parar(); ir(indice + 1); });
    janela.addEventListener('focusin', parar);
    if (largo.addEventListener) { largo.addEventListener('change', function () { ir(indice); }); }

    // Arraste horizontal; o gesto vertical continua rolando a pagina.
    var x0 = null, y0 = null;
    janela.addEventListener('touchstart', function (e) {
      parar(); x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    janela.addEventListener('touchend', function (e) {
      if (x0 === null) { return; }
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { ir(indice + (dx < 0 ? 1 : -1)); }
      x0 = null;
    }, { passive: true });

    var visivel = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; }, { threshold: 0.5 }).observe(janela);
    }
    setInterval(function () { if (!parado && visivel && !document.hidden) { ir(indice + 1); } }, 7000);
    ir(0);
  }

  depoimentos();
})();
