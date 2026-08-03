/* ==========================================================================
   CÓDIGO XR CAPITAL
   Interações e animações de entrada
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var poucoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ------------------------------------------------------------------
     1. HEADER: fixo, esconde ao descer, reaparece ao subir
     ------------------------------------------------------------------ */
  function iniciarTopo() {
    var topo = $('.topo');
    if (!topo) return;
    var ultimo = window.scrollY;
    var travado = false;

    function atualizar() {
      var y = window.scrollY;
      topo.classList.toggle('is-fixo', y > 40);
      if (!travado) {
        if (y > ultimo && y > 320) topo.classList.add('is-oculto');
        else topo.classList.remove('is-oculto');
      }
      ultimo = y;
    }

    window.addEventListener('scroll', atualizar, { passive: true });
    topo.addEventListener('mouseenter', function () { travado = true; topo.classList.remove('is-oculto'); });
    topo.addEventListener('mouseleave', function () { travado = false; });
    atualizar();
  }

  /* ------------------------------------------------------------------
     2. MENU MOBILE
     ------------------------------------------------------------------ */
  function iniciarMenu() {
    var botao = $('.menu-btn');
    var drawer = $('.drawer');
    if (!botao || !drawer) return;

    function alternar(forcar) {
      var abrir = typeof forcar === 'boolean' ? forcar : !drawer.classList.contains('is-aberto');
      drawer.classList.toggle('is-aberto', abrir);
      botao.classList.toggle('is-aberto', abrir);
      botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      document.body.style.overflow = abrir ? 'hidden' : '';
    }

    botao.addEventListener('click', function () { alternar(); });
    $$('.drawer__link, .drawer .btn', drawer).forEach(function (a) {
      a.addEventListener('click', function () { alternar(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-aberto')) alternar(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && drawer.classList.contains('is-aberto')) alternar(false);
    });
  }

  /* ------------------------------------------------------------------
     3. FATIAR TÍTULOS EM LINHAS  [data-fatiar]
     ------------------------------------------------------------------ */
  function fatiar(el) {
    if (poucoMovimento) { el.classList.add('is-fatiado'); return; }
    var original = el.getAttribute('data-texto-original');
    if (original === null) {
      original = el.innerHTML;
      el.setAttribute('data-texto-original', original);
    } else {
      el.innerHTML = original;
    }

    // envolve cada palavra para medir a quebra de linha real
    var partes = el.innerHTML.split(/(<[^>]+>)/g).map(function (p) {
      if (p.charAt(0) === '<') return p;
      return p.replace(/(\S+)/g, '<i class="pal">$1</i>');
    }).join('');
    el.innerHTML = partes;

    var palavras = $$('.pal', el);
    if (!palavras.length) { el.classList.add('is-fatiado'); return; }

    var linhas = [];
    var atual = [];
    var topoAtual = null;
    palavras.forEach(function (p) {
      var t = Math.round(p.offsetTop);
      if (topoAtual === null) topoAtual = t;
      if (Math.abs(t - topoAtual) > 4) {
        linhas.push(atual);
        atual = [];
        topoAtual = t;
      }
      atual.push(p);
    });
    if (atual.length) linhas.push(atual);

    var html = linhas.map(function (linha, i) {
      var texto = linha.map(function (p) { return p.outerHTML; }).join(' ');
      return '<span class="fatia"><span style="--atraso:' + (i * 0.085).toFixed(3) + 's">' + texto + '</span></span>';
    }).join('');
    el.innerHTML = html;
    $$('.pal', el).forEach(function (p) {
      var pai = p.parentNode;
      while (p.firstChild) pai.insertBefore(p.firstChild, p);
      pai.removeChild(p);
    });
    el.classList.add('is-fatiado');
  }

  function iniciarFatias() {
    var alvos = $$('[data-fatiar]');
    if (!alvos.length) return;
    // rede de segurança: nenhum título pode ficar invisível
    setTimeout(function () {
      alvos.forEach(function (el) { el.classList.add('is-fatiado'); });
    }, 1600);
    alvos.forEach(fatiar);
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        alvos.forEach(function (el) {
          var visivel = el.classList.contains('is-visivel');
          fatiar(el);
          if (visivel) el.classList.add('is-visivel');
        });
      }, 220);
    });
  }

  /* ------------------------------------------------------------------
     4. ANIMAÇÕES DE ENTRADA
     ------------------------------------------------------------------ */
  function iniciarEntradas() {
    var alvos = $$('[data-anima], [data-fatiar]');
    if (!alvos.length) return;

    if (poucoMovimento || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('is-visivel'); });
      return;
    }

    // escalona automaticamente os filhos de um grupo
    $$('[data-grupo]').forEach(function (grupo) {
      var passo = parseFloat(grupo.getAttribute('data-grupo')) || 0.09;
      $$('[data-anima]', grupo).forEach(function (filho, i) {
        if (!filho.style.getPropertyValue('--atraso')) {
          filho.style.setProperty('--atraso', (i * passo).toFixed(3) + 's');
        }
      });
    });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visivel');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------
     5. CONTADORES
     ------------------------------------------------------------------ */
  function iniciarContadores() {
    var alvos = $$('[data-contador]');
    if (!alvos.length) return;

    function animar(el) {
      var fim = parseFloat(el.getAttribute('data-contador'));
      var casas = (el.getAttribute('data-casas') | 0);
      var prefixo = el.getAttribute('data-prefixo') || '';
      var sufixo = el.getAttribute('data-sufixo') || '';
      if (poucoMovimento) {
        el.textContent = prefixo + fim.toFixed(casas).replace('.', ',') + sufixo;
        return;
      }
      var dur = 1500;
      var t0 = null;
      function passo(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        var v = fim * eased;
        el.textContent = prefixo + v.toFixed(casas).replace('.', ',') + sufixo;
        if (p < 1) requestAnimationFrame(passo);
      }
      requestAnimationFrame(passo);
    }

    if (!('IntersectionObserver' in window)) { alvos.forEach(animar); return; }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        animar(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. ACORDEÃO
     ------------------------------------------------------------------ */
  function iniciarAcordeao() {
    $$('.acordeao').forEach(function (grupo) {
      var unico = grupo.hasAttribute('data-unico');
      $$('.acordeao__btn', grupo).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.acordeao__item');
          var abrir = !item.classList.contains('is-aberto');
          if (unico) {
            $$('.acordeao__item', grupo).forEach(function (o) {
              o.classList.remove('is-aberto');
              var b = $('.acordeao__btn', o);
              if (b) b.setAttribute('aria-expanded', 'false');
            });
          }
          item.classList.toggle('is-aberto', abrir);
          btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     7. BARRA DE PROGRESSO E BOTÃO AO TOPO
     ------------------------------------------------------------------ */
  function iniciarProgresso() {
    var barra = $('.progresso');
    var topoBtn = $('.ao-topo');
    if (!barra && !topoBtn) return;

    function atualizar() {
      var altura = document.body.scrollHeight - window.innerHeight;
      var p = altura > 0 ? window.scrollY / altura : 0;
      if (barra) barra.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      if (topoBtn) topoBtn.classList.toggle('is-visivel', window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();

    if (topoBtn) {
      topoBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: poucoMovimento ? 'auto' : 'smooth' });
      });
    }
  }

  /* ------------------------------------------------------------------
     8. PARALLAX SUAVE  [data-parallax]
     ------------------------------------------------------------------ */
  function iniciarParallax() {
    if (poucoMovimento) return;
    var alvos = $$('[data-parallax]');
    if (!alvos.length) return;
    var tick = false;

    function render() {
      var vh = window.innerHeight;
      alvos.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var forca = parseFloat(el.getAttribute('data-parallax')) || 12;
        var centro = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (centro * forca * -1).toFixed(2) + 'px,0) scale(1.06)';
      });
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(render); }
    }, { passive: true });
    window.addEventListener('resize', render);
    render();
  }

  /* ------------------------------------------------------------------
     9. FILTROS DO BLOG
     ------------------------------------------------------------------ */
  function iniciarFiltros() {
    var barra = $('[data-filtros]');
    if (!barra) return;
    var itens = $$('[data-categoria]');

    $$('.filtro', barra).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var alvo = btn.getAttribute('data-filtro');
        $$('.filtro', barra).forEach(function (b) { b.classList.toggle('is-ativo', b === btn); });
        itens.forEach(function (item) {
          var cat = item.getAttribute('data-categoria');
          var mostrar = alvo === 'todos' || cat === alvo;
          item.style.display = mostrar ? '' : 'none';
          if (mostrar) {
            item.classList.remove('is-visivel');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { item.classList.add('is-visivel'); });
            });
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     10. FORMULÁRIO
     ------------------------------------------------------------------ */
  var RETORNO_PADRAO = 'Recebemos suas informações. Nossa equipe fará uma análise inicial e retornará o contato para agendar a conversa executiva.';

  function iniciarFormulario() {
    $$('[data-form]').forEach(prepararFormulario);
  }

  /* Cada formulário cuida do próprio aviso de retorno. A mensagem pode ser
     trocada por página com o atributo data-retorno no <form>. */
  function prepararFormulario(form) {
    var status = $('.form-status', form.parentNode) || $('.form-status');

    function validarCampo(campo) {
      var wrap = campo.closest('.campo');
      var aviso = wrap ? $('.campo__aviso', wrap) : null;
      var ok = campo.checkValidity();
      if (wrap) wrap.classList.toggle('campo--erro', !ok);
      if (aviso) aviso.textContent = ok ? '' : (campo.getAttribute('data-erro') || 'Preencha este campo.');
      return ok;
    }

    $$('input, select, textarea', form).forEach(function (campo) {
      campo.addEventListener('blur', function () { if (campo.value) validarCampo(campo); });
      campo.addEventListener('input', function () {
        var wrap = campo.closest('.campo');
        if (wrap && wrap.classList.contains('campo--erro')) validarCampo(campo);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var campos = $$('input[required], select[required], textarea[required]', form);
      var valido = true;
      var primeiro = null;
      campos.forEach(function (campo) {
        if (!validarCampo(campo)) {
          valido = false;
          if (!primeiro) primeiro = campo;
        }
      });

      if (!valido) {
        if (primeiro) {
          primeiro.focus();
          primeiro.scrollIntoView({ behavior: poucoMovimento ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }

      var botao = $('button[type="submit"]', form);
      if (botao) botao.setAttribute('disabled', 'disabled');
      if (status) {
        status.textContent = form.getAttribute('data-retorno') || RETORNO_PADRAO;
        status.classList.add('is-visivel');
        status.scrollIntoView({ behavior: poucoMovimento ? 'auto' : 'smooth', block: 'center' });
      }
      form.reset();
      setTimeout(function () { if (botao) botao.removeAttribute('disabled'); }, 2500);
    });
  }

  /* ------------------------------------------------------------------
     11. PRODUTO VINDO DA LOJA
     Quando o visitante chega de produtos-financeiros.html?produto=X,
     o formulário de contato já abre sabendo o que ele veio pedir.
     ------------------------------------------------------------------ */
  function iniciarProdutoNaUrl() {
    var produto;
    try {
      produto = new URLSearchParams(window.location.search).get('produto');
    } catch (e) { return; }
    if (!produto) return;

    var mensagem = $('#mensagem');
    if (mensagem && !mensagem.value) {
      mensagem.value = 'Tenho interesse na linha de ' + produto + '. ';
    }

    var aviso = $('.contato-form__intro');
    if (aviso) {
      aviso.textContent = 'Você chegou pela linha de ' + produto +
        '. Complete os campos abaixo para que nossa mesa de originação avalie o enquadramento da operação.';
    }

    var alvo = $('#formulario') || $('[data-form]');
    if (alvo) {
      alvo.scrollIntoView({ behavior: poucoMovimento ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* ------------------------------------------------------------------
     12. ANO ATUAL NO RODAPÉ
     ------------------------------------------------------------------ */
  function iniciarAno() {
    $$('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------
     13. BOOT
     ------------------------------------------------------------------ */
  function iniciar() {
    raiz.classList.add('js');
    iniciarTopo();
    iniciarMenu();
    iniciarFatias();
    iniciarEntradas();
    iniciarContadores();
    iniciarAcordeao();
    iniciarProgresso();
    iniciarParallax();
    iniciarFiltros();
    iniciarFormulario();
    iniciarProdutoNaUrl();
    iniciarAno();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  // recalcula as fatias depois que as fontes da marca carregam
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (!poucoMovimento) window.dispatchEvent(new Event('resize'));
    });
  }
})();
