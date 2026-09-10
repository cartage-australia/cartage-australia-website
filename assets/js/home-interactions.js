(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Material gallery: cursor / keyboard focus chooses the expanded card.
  const materialCards = [...document.querySelectorAll('[data-material-card]')];
  if (materialCards.length) {
    const activate = card => {
      if (window.matchMedia('(max-width: 900px)').matches) return;
      materialCards.forEach(el => el.classList.toggle('is-active', el === card));
    };
    materialCards.forEach(card => {
      card.addEventListener('mouseenter', () => activate(card));
      card.addEventListener('focus', () => activate(card));
    });
  }

  // Magnetic CTAs: restrained 7px max movement and desktop/pointer only.
  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.body.classList.add('home-magnetic-ready');
    const targets = [...document.querySelectorAll('.btn:not(.header-action-btn), .portal-btn:not(.header-action-btn), .interactive-text-link')];
    targets.forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - .5) * 14;
        const y = ((e.clientY - r.top) / r.height - .5) * 10;
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
      el.addEventListener('blur', () => { el.style.transform = ''; });
    });
  }
})();
