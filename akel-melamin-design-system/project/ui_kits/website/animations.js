// animations.js — scroll-triggered reveals, count-up, magnetic hover.
// Vanilla, no deps. Respects prefers-reduced-motion and disables on narrow screens.
(function () {
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_NARROW = window.matchMedia('(max-width: 720px)').matches;

  // Mark reveal targets so CSS gives them their initial hidden state.
  function markReveals(root) {
    const sel = '[data-anim="fade-up"], [data-anim="hero-photo"], [data-anim="hero"] .hero__title, [data-anim="hero"] .hero__body, [data-anim="hero"] .hero__cta, [data-anim="hero"] .eyebrow, [data-anim-stagger] [data-anim="stagger-item"], [data-anim="stats-strip"], [data-anim="section"]';
    root.querySelectorAll(sel).forEach(el => el.classList.add('anim-init'));
  }

  // Reveal-on-enter observer
  function setupReveals(root) {
    if (PREFERS_REDUCED) {
      root.querySelectorAll('.anim-init').forEach(el => el.classList.add('anim-in'));
      return;
    }
    // Use the inner scroll container as the observer root if present.
    const scrollRoot = root.querySelector && root.querySelector('.kit-scroll');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.matches('[data-anim="stagger-item"]')) {
          const parent = el.closest('[data-anim-stagger]');
          if (parent) {
            const siblings = [...parent.querySelectorAll('[data-anim="stagger-item"]')];
            const idx = siblings.indexOf(el);
            el.style.transitionDelay = (idx * 60) + 'ms';
          }
        } else {
          const d = parseInt(el.getAttribute('data-anim-delay') || '0', 10);
          if (d) el.style.transitionDelay = d + 'ms';
        }
        el.classList.add('anim-in');
        io.unobserve(el);
      });
    }, { root: scrollRoot || null, rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

    // Immediately reveal anything already visible in the scroll viewport.
    const inViewRect = (el) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return r.top < vh * 0.98 && r.bottom > 0;
    };
    root.querySelectorAll('.anim-init').forEach(el => {
      if (inViewRect(el)) {
        // Reveal on next frame so transition is visible
        requestAnimationFrame(() => {
          if (el.matches('[data-anim="stagger-item"]')) {
            const parent = el.closest('[data-anim-stagger]');
            if (parent) {
              const siblings = [...parent.querySelectorAll('[data-anim="stagger-item"]')];
              const idx = siblings.indexOf(el);
              el.style.transitionDelay = (idx * 60) + 'ms';
            }
          } else {
            const d = parseInt(el.getAttribute('data-anim-delay') || '0', 10);
            if (d) el.style.transitionDelay = d + 'ms';
          }
          el.classList.add('anim-in');
        });
      } else {
        io.observe(el);
      }
    });
  }

  // Count-up for [data-count-to] inside revealed stats
  function setupCountUps(root) {
    if (PREFERS_REDUCED) {
      root.querySelectorAll('[data-count-to]').forEach(el => {
        el.textContent = el.getAttribute('data-count-to');
      });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const to = parseFloat(el.getAttribute('data-count-to'));
        const dur = 1400;
        const t0 = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = to * eased;
          el.textContent = Math.round(v).toString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = Number.isInteger(to) ? to.toString() : to.toFixed(1);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.3 });
    root.querySelectorAll('[data-count-to]').forEach(el => io.observe(el));
  }

  // Magnetic hover for buttons flagged .magnetic — pulls toward cursor
  function setupMagnetic(root) {
    if (PREFERS_REDUCED || IS_NARROW) return;
    root.querySelectorAll('.magnetic').forEach(el => {
      if (el.__magInit) return;
      el.__magInit = true;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width/2)) / r.width;
        const dy = (e.clientY - (r.top + r.height/2)) / r.height;
        el.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  // Gentle parallax for the hero photo — translate on scroll
  function setupHeroParallax(root) {
    if (PREFERS_REDUCED || IS_NARROW) return;
    const el = root.querySelector('[data-anim="hero-photo"]');
    if (!el) return;
    const scrollRoot = root.closest('.kit-scroll') || document.querySelector('.kit-scroll') || window;
    const getY = () => scrollRoot === window ? window.scrollY : scrollRoot.scrollTop;
    let rafId = null;
    function loop() {
      const y = getY();
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const progress = (r.top - window.innerHeight) / -1200;
        const shift = Math.max(-40, Math.min(40, progress * 30));
        el.style.setProperty('--parallax-y', shift + 'px');
      }
      rafId = null;
    }
    const onScroll = () => { if (rafId == null) rafId = requestAnimationFrame(loop); };
    scrollRoot.addEventListener('scroll', onScroll, { passive: true });
    loop();
  }

  // Run — call after DOM is ready and React has painted
  window.__akelAnimations = {
    init(root) {
      root = root || document;
      markReveals(root);
      // Next frame, so initial state paints before transitions fire
      requestAnimationFrame(() => {
        setupReveals(root);
        setupCountUps(root);
        setupMagnetic(root);
        setupHeroParallax(root);
      });
    },
    refresh(root) {
      root = root || document;
      markReveals(root);
      requestAnimationFrame(() => {
        setupReveals(root);
        setupCountUps(root);
        setupMagnetic(root);
      });
    },
  };
})();
