/* =========================================================
   MACS — Shared header/footer behavior
   Include this file, unchanged, on every page.
========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  var header   = document.getElementById('site-header');
  var nav      = document.getElementById('main-nav');
  var toggle   = document.getElementById('menu-toggle');
  var backdrop = document.getElementById('nav-backdrop');

  /* ---------- Mobile menu open/close ---------- */
  function openMenu() {
    nav.classList.add('is-open');
    backdrop.classList.add('is-visible');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  function isMenuOpen() {
    return nav.classList.contains('is-open');
  }

  if (toggle && nav && backdrop) {
    toggle.addEventListener('click', function () {
      isMenuOpen() ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    // Close after choosing a link (mobile)
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close mobile menu on scroll
    window.addEventListener('scroll', function () {
      if (isMenuOpen()) {
        closeMenu();
      }
    }, { passive: true });

    // Reset state if the viewport grows into desktop layout
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && isMenuOpen()) closeMenu();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Active nav link (belt-and-suspenders) ----------
     Each page should already mark its own link with class="is-active".
     This just corrects it automatically from the filename, so the
     header partial never has to be hand-edited per page. */
  var pageMap = { home: 'index.html', about: 'about.html', services: 'services.html', projects: 'projects.html', contact: 'contact.html' };
  var currentPage = pageMap[document.body.dataset.page] || 'index.html';
      
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var linkPage = link.getAttribute('href');
    link.classList.toggle('is-active', linkPage === currentPage);
  });

/* ---------- Contact form — AJAX submit via Web3Forms ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var submitBtn = document.getElementById('contact-submit-btn');
    var statusEl = document.getElementById('contact-form-status');
    var btnOriginalText = submitBtn.textContent;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusEl.className = 'contact-form__status';
      statusEl.textContent = '';

      var formData = new FormData(contactForm);
      var payload = {};
      formData.forEach(function (value, key) { payload[key] = value; });

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.success) {
            statusEl.textContent = 'Thank you! Your message has been sent successfully.';
            statusEl.className = 'contact-form__status is-visible is-success';
            contactForm.reset();
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          statusEl.textContent = 'Something went wrong. Please try again.';
          statusEl.className = 'contact-form__status is-visible is-error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = btnOriginalText;
        });
    });
  }
});