/* AYANA — site interactions */
(function () {
  'use strict';

  const header  = document.querySelector('.site-header');
  const backTop = document.querySelector('.back-to-top');
  const nav     = document.querySelector('.main-nav');
  const toggle  = document.querySelector('.nav-toggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqMobile = window.matchMedia('(max-width: 900px)');

  /* ---------- Sticky header + back-to-top visibility ---------- */
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header)  header.classList.toggle('is-scrolled', y > 12);
    if (backTop) backTop.classList.toggle('is-visible', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Dropdowns ---------- */
  function closeAllDrops() {
    document.querySelectorAll('.has-drop').forEach((item) => {
      item.classList.remove('is-open');
      const btn = item.querySelector(':scope > .nav-link');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function closeDrawer() {
    if (!nav || !toggle) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
    closeAllDrops();
  }

  document.querySelectorAll('.has-drop > .nav-link').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (!mqMobile.matches) return; // desktop uses hover
      e.preventDefault();
      const parent = trigger.parentElement;
      const wasOpen = parent.classList.contains('is-open');
      closeAllDrops();
      if (!wasOpen) {
        parent.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.querySelectorAll('.nav-drop a').forEach((link) => {
    link.addEventListener('click', () => {
      const parent = link.closest('.has-drop');
      if (parent) {
        parent.classList.remove('is-open');
        const btn = parent.querySelector(':scope > .nav-link');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (!mqMobile.matches) {
          parent.classList.add('drop-suppressed');
          parent.addEventListener('mouseleave', () => {
            parent.classList.remove('drop-suppressed');
          }, { once: true });
        }
      }
      closeDrawer();
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-drop')) closeAllDrops();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAllDrops();
    if (nav && nav.classList.contains('is-open')) closeDrawer();
  });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeDrawer();
      else {
        toggle.setAttribute('aria-expanded', 'true');
        nav.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach((el) => observer.observe(el));
})();