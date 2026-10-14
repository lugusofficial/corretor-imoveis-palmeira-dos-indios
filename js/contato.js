// Formulario de contato sem servidor: monta a mensagem com os campos e abre o
// WhatsApp do corretor. Sem script o formulario faz GET no wa.me e o campo
// "text" (a mensagem) chega sozinho.
(function () {
  'use strict';
  var form = document.querySelector('form[data-whats]');
  if (!form) { return; }
  var numero = form.getAttribute('data-whats');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) { return; }
    var nome = form.elements.nome.value.trim();
    var procura = form.elements.procura.value.trim();
    var msg = form.elements.text.value.trim();
    var partes = ['Olá, Jônatas! Vim pelo site.'];
    if (nome) { partes.push('Meu nome é ' + nome + '.'); }
    if (procura) { partes.push('Procuro: ' + procura + '.'); }
    if (msg) { partes.push(msg); }
    window.location.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(partes.join(' '));
  });
})();
