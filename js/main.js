/* =============================================================================
   UFMT HIFU service for uterine fibroids and adenomyosis
   Interaction layer. Nothing here writes content into the page.

   Every word on this site is present in index.html at load. This file only
   adds motion, navigation state and the inline form confirmation. With
   JavaScript disabled the page still renders in full, the FAQ still opens and
   closes, and the enquiry form still submits.

   Behaviours, all modelled on moovia.be:
     1  scrolled state
     2  overlay navigation
     3  hero zoom
     4  overlay gradient cross-fade
     5  scroll spy
     6  reveal on scroll
     7  enquiry form
   ============================================================================= */

(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Marks the document as scripted. The reveal styles hang off .js so that a
     no-script reader never meets an element parked at opacity 0. */
  doc.documentElement.classList.add('js');

  /* ---------------------------------------------------------------------------
     1  Scrolled state
     Past the first pixel the header menu retreats upward and the top scrim
     fades in, so the header stays legible over pale sections.
     ------------------------------------------------------------------------- */

  function onScroll() {
    if (window.scrollY >= 1) { body.classList.add('scrolled'); }
    else { body.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------------
     2  Overlay navigation
     ------------------------------------------------------------------------- */

  var burger = doc.querySelector('.btn-menu-burger');
  var overlay = doc.querySelector('.main-header-nav');

  function setMenu(open) {
    body.classList.toggle('menu-opened', open);
    if (burger) { burger.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    if (overlay) { overlay.setAttribute('aria-hidden', open ? 'false' : 'true'); }
  }

  if (burger && overlay) {
    burger.addEventListener('click', function () {
      setMenu(!body.classList.contains('menu-opened'));
    });

    /* Anchor links inside the overlay close it on the way through */
    overlay.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a) { setMenu(false); }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-opened')) {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------------
     3  Hero zoom
     The hero photograph scales up as the reader scrolls down into the page and
     back down as they scroll up.

     It is bound to scroll position rather than played as a one-shot animation,
     which is what makes it reverse: at any moment the scale reflects exactly
     how far into the hero the reader is, in either direction.

     Scaling only crops inward, so unlike a translate there is no overscan to
     keep in step and no way to expose an edge. The picture clips it.

     Native scrolling is untouched. No smooth-scroll library, no wheel
     interception, no dependency. The reader's scroll is the reader's.
     ------------------------------------------------------------------------- */

  function initHeroZoom() {
    var hero = doc.querySelector('.head');
    var img = hero && hero.querySelector('.head-bg img');
    if (!hero || !img) { return; }

    /* Scale added across a full scroll through the hero. Kept small on purpose:
       enough to feel alive behind the type, not enough to soften the picture. */
    var MAX_ZOOM = 0.16;
    var frame = null;
    var last = -1;

    function update() {
      frame = null;
      var height = hero.offsetHeight || 1;
      var progress = window.scrollY / height;
      if (progress < 0) { progress = 0; } else if (progress > 1) { progress = 1; }

      var scale = 1 + progress * MAX_ZOOM;
      /* Skip the write when nothing visible changed. */
      if (Math.abs(scale - last) < 0.0005) { return; }
      last = scale;
      img.style.transform = 'scale(' + scale.toFixed(4) + ')';
    }

    function onScroll() {
      if (!frame) { frame = requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    doc.documentElement.classList.add('hero-zoom');
    update();
  }

  /* Gated here so that under prefers-reduced-motion the class is never added
     and the photograph simply sits at its natural scale. */
  if (!reduced.matches) { initHeroZoom(); }

  /* ---------------------------------------------------------------------------
     4  Overlay gradient cross-fade
     Each group in the overlay carries a from/to pair. Hovering one fades the
     panel gradient across to that pair.
     ------------------------------------------------------------------------- */

  doc.querySelectorAll('.main-header-nav .activities').forEach(function (panel) {
    var layer = panel.querySelector('.degrade');
    if (!layer) { return; }
    var from = getComputedStyle(doc.documentElement).getPropertyValue('--midnight-plum').trim();
    var to = getComputedStyle(doc.documentElement).getPropertyValue('--deep-merlot').trim();

    function fade(a, b) {
      if (a === from && b === to) { return; }
      var gradient = 'linear-gradient(135deg, ' + a + ', ' + b + ')';
      if (layer.classList.contains('show')) {
        panel.style.backgroundImage = gradient;
        layer.classList.remove('show');
      } else {
        layer.style.backgroundImage = gradient;
        layer.classList.add('show');
      }
      from = a;
      to = b;
    }

    panel.querySelectorAll('.group').forEach(function (group) {
      var a = group.getAttribute('data-from');
      var b = group.getAttribute('data-to');
      if (!a || !b) { return; }
      group.addEventListener('mouseover', function () { fade(a, b); });
      group.addEventListener('focusin', function () { fade(a, b); });
    });
  });

  /* ---------------------------------------------------------------------------
     5  Scroll spy
     Moovia's header underline tracks the active hero slide. On a single page
     it tracks the section the reader is actually in.
     ------------------------------------------------------------------------- */

  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.main-header-menu a[href^="#"]'));
  var targets = navLinks
    .map(function (a) { return doc.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (targets.length && 'IntersectionObserver' in window) {
    var seen = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { seen.set(entry.target, entry.intersectionRatio); });

      var best = null;
      var bestRatio = 0;
      seen.forEach(function (ratio, el) {
        if (ratio > bestRatio) { bestRatio = ratio; best = el; }
      });

      navLinks.forEach(function (a) {
        a.classList.toggle('active', best !== null && a.getAttribute('href') === '#' + best.id);
      });
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.4, 0.75, 1] });

    targets.forEach(function (el) { spy.observe(el); });
  }

  /* ---------------------------------------------------------------------------
     6  Reveal on scroll
     Fade and rise, 400ms, 12px. The hidden state is added here rather than in
     the stylesheet, so content is never dependent on this running.
     ------------------------------------------------------------------------- */

  if ('IntersectionObserver' in window && !reduced.matches) {
    var revealables = doc.querySelectorAll('[data-reveal]');
    revealables.forEach(function (el) { el.classList.add('reveal'); });

    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------------------------------------------------------------------------
     7  Enquiry form
     The form posts natively without this code. What is added here is the
     floating label state, per-field error text and an inline confirmation in
     place of a page reload.

     No analytics, no tracking, no third party script touches this form. It
     carries health information.
     ------------------------------------------------------------------------- */

  doc.querySelectorAll('.form').forEach(function (form) {
    var message = form.querySelector('.form-message');
    var honeypot = form.querySelector('.pot input');

    /* Floating labels. A field that holds a value keeps its label raised. */
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      function sync() { field.classList.toggle('complete', field.value !== ''); }
      field.addEventListener('blur', sync);
      field.addEventListener('change', sync);
      sync();
    });

    function fieldError(field, text) {
      var wrap = field.closest('.input') || field.closest('.checkbox');
      if (!wrap) { return; }
      var slot = wrap.querySelector('.err');
      wrap.classList.toggle('invalid', Boolean(text));
      if (slot) { slot.textContent = text || ''; }
    }

    function validate() {
      var ok = true;
      var first = null;
      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        if (field.type === 'hidden' || field.closest('.pot')) { return; }
        if (field.checkValidity()) { fieldError(field, ''); return; }
        ok = false;
        if (!first) { first = field; }
        var label = field.getAttribute('data-error') || 'Please complete this field.';
        fieldError(field, label);
      });
      if (first) { first.focus(); }
      return ok;
    }

    form.addEventListener('submit', function (e) {
      /* Let the browser handle it natively if there is nowhere to post to. */
      var endpoint = form.getAttribute('action');
      if (!endpoint || endpoint.indexOf('FORM-ENDPOINT') !== -1) { return; }

      e.preventDefault();

      if (!validate()) {
        if (message) {
          message.className = 'form-message error';
          message.textContent = 'Some details are still missing. Please check the fields marked above.';
        }
        return;
      }

      if (honeypot && honeypot.value !== '') { return; }

      form.classList.add('wait');
      if (message) {
        message.className = 'form-message';
        message.textContent = 'Sending your enquiry…';
      }

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          form.classList.remove('wait');
          if (!res.ok) { throw new Error('rejected'); }
          if (message) {
            message.className = 'form-message valid';
            /* Wording matched to the confirmation message in the approved copy. */
            message.textContent = 'Thank you. We have your enquiry and someone from the team will be in touch to arrange a consultation. For more information, email vuyon@ufmt.com.';
          }
          form.reset();
          form.querySelectorAll('.complete').forEach(function (f) { f.classList.remove('complete'); });
        })
        .catch(function () {
          form.classList.remove('wait');
          if (message) {
            message.className = 'form-message error';
            message.textContent = 'We could not send that. Please try again, or call the practice on 077 265 8716.';
          }
        });
    });
  });
})();
