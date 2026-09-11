(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavClose = document.getElementById('mobileNavClose');

  function openMobileNav() {
    mobileNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (navToggle) navToggle.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item__pergunta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-item__pergunta').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Carrossel de cards ---------- */
  var track = document.getElementById('carrosselTrack');
  var prevBtn = document.getElementById('carrosselPrev');
  var nextBtn = document.getElementById('carrosselNext');

  function scrollByCard(dir) {
    if (!track) return;
    var card = track.querySelector('.card-saida');
    var gap = parseFloat(getComputedStyle(track).gap) || 22;
    var amount = card ? card.offsetWidth + gap : 320;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }
  if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });

  function updateCarrosselButtons() {
    if (!track || !prevBtn || !nextBtn) return;
    var max = track.scrollWidth - track.clientWidth - 4;
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= max;
  }
  if (track) {
    track.addEventListener('scroll', updateCarrosselButtons, { passive: true });
    window.addEventListener('resize', updateCarrosselButtons);
    updateCarrosselButtons();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Header shadow on scroll ---------- */
  var headerBar = document.querySelector('.header__bar');
  function onScrollHeader() {
    if (!headerBar) return;
    if (window.scrollY > 8) {
      headerBar.style.boxShadow = '0 14px 34px -18px rgba(14,18,26,.34)';
    } else {
      headerBar.style.boxShadow = '';
    }
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Campo "Outros" do objetivo ---------- */
  var objetivoSelect = document.getElementById('objetivo');
  var objetivoOutroRow = document.getElementById('objetivoOutroRow');
  var objetivoOutroInput = document.getElementById('objetivoOutro');
  function syncObjetivoOutro() {
    if (!objetivoSelect || !objetivoOutroRow) return;
    var isOutros = objetivoSelect.value === 'Outros';
    objetivoOutroRow.hidden = !isOutros;
    if (objetivoOutroInput) {
      objetivoOutroInput.required = isOutros;
      if (!isOutros) objetivoOutroInput.value = '';
    }
  }
  if (objetivoSelect) objetivoSelect.addEventListener('change', syncObjetivoOutro);

  /* ---------- Formulário de contato ----------
     Envia o lead para a planilha do Google Sheets (via Apps Script),
     que por sua vez alimenta o Pluga e o RD Station CRM.
     Ver integracao-crm/google-apps-script.gs para o código do outro lado. */
  var SHEETS_ENDPOINT = 'COLE_AQUI_A_URL_DO_APP_DA_WEB';

  var form = document.getElementById('formContato');
  var feedback = document.getElementById('formFeedback');
  var carimboInput = document.getElementById('carimbo');
  if (carimboInput) carimboInput.value = String(Date.now());

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '.7';

      var dados = new FormData(form);
      dados.append('pagina', window.location.href);

      function finalizarEnvio() {
        feedback.classList.add('is-visible');
        form.reset();
        if (carimboInput) carimboInput.value = String(Date.now());
        syncObjetivoOutro();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }

      // mode: 'no-cors' porque o Apps Script não devolve cabeçalhos de CORS;
      // a resposta fica opaca (não dá pra ler o corpo), mas o envio funciona.
      // Erro de rede real (ex: sem internet) ainda cai no catch.
      fetch(SHEETS_ENDPOINT, { method: 'POST', mode: 'no-cors', body: dados })
        .catch(function (erro) {
          console.error('Falha ao enviar lead para a planilha:', erro);
        })
        .finally(finalizarEnvio);
    });
  }
})();
