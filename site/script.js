/* ============================================================
   D.S.O.H.K - interaction layer
   Progressive enhancement: page works fully without this file.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── WhatsApp enrolment endpoint ─────────────────────── */
  var WHATSAPP_NUMBER = '233591013771';

  /*     Mobile navigation                                    */
  var toggle = document.getElementById('nav-toggle');
  var nav    = document.getElementById('nav-menu');

  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a destination
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });

    // Close when the layout returns to desktop
    window.matchMedia('(min-width: 821px)').addEventListener('change', function (e) {
      if (e.matches) setNav(false);
    });
  }

  /*     Solidify top bar on scroll                           */
  var topbar = document.querySelector('.topbar');

  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /*     Reveal on enter                                      */
  var revealables = document.querySelectorAll('.reveal');

  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /*     Current year                                         */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /*     Enrollment form                                      */
  var form = document.getElementById('enroll-form');
  var note = document.getElementById('form-note');

  if (form && note) {
    var say = function (msg, isError) {
      note.textContent = msg;
      note.classList.toggle('is-error', Boolean(isError));
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = form.elements.name;
      var email = form.elements.email;
      var invalid = [];

      [name, email].forEach(function (field) {
        var bad = !field.checkValidity();
        field.classList.toggle('is-invalid', bad);
        if (bad) invalid.push(field);
      });

      if (invalid.length) {
        say('Please complete the required fields.', true);
        invalid[0].focus();
        return;
      }

      var line = function (label, value) {
        return value ? '*' + label + '*: ' + value : '';
      };

      var stageLabels = {
        beginner: 'Beginner (Foundation & Awakening)',
        intermediate: 'Intermediate (Application & Expansion)',
        advanced: 'Advanced (Mastery & Illumination)',
        unsure: 'Not yet certain'
      };

      var contactLabels = {
        email: 'Email', phone: 'Telephone', inperson: 'In person'
      };

      var callingLabels = {
        pastor: 'Pastor',
        herbalist: 'Herbalist',
        others: 'Others'
      };

      var body = [
        '*ENROLLMENT REQUEST*',
        'Divine School of Hidden Knowledge',
        '',
        line('Name', name.value.trim()),
        line('You are a', callingLabels[form.elements.calling.value]),
        line('Email', email.value.trim()),
        line('Pathway', stageLabels[form.elements.pathway.value]),
        line('Preferred contact', contactLabels[form.elements.contact.value]),
        line('Message', form.elements.message.value.trim()),
        '',
        'Sent from the D.S.O.H.K website'
      ].filter(Boolean).join('\n');

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(body);

      say('Opening WhatsApp with your details ready to send.');

      var opened = window.open(url, '_blank', 'noopener,noreferrer');

      if (!opened) {
        // Popup blocked — fall back to same-tab navigation
        window.location.href = url;
      } else {
        form.reset();
      }
    });

    form.addEventListener('input', function (e) {
      e.target.classList.remove('is-invalid');
      if (note.classList.contains('is-error')) note.textContent = '';
    });
  }
})();
