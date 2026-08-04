document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var headerCta = document.querySelector('.header-cta .btn');

  if (toggle && nav) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'main-nav');
    nav.id = 'main-nav';

    // Backdrop, inserted once so it doesn't need to live in every HTML file
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // Clone the header's primary CTA into the mobile panel so it's not lost
    // when .header-cta .btn is hidden at the 900px breakpoint (see style.css)
    if (headerCta) {
      var mobileCta = headerCta.cloneNode(true);
      mobileCta.classList.add('header-cta-mobile');
      nav.appendChild(mobileCta);
    }

    var openNav = function () {
      nav.classList.add('open');
      toggle.classList.add('is-open');
      backdrop.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-locked');
    };
    var closeNav = function () {
      nav.classList.remove('open');
      toggle.classList.remove('is-open');
      backdrop.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-locked');
    };

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) closeNav(); else openNav();
    });
    backdrop.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    // Close the mobile panel automatically if the viewport is resized
    // back up to desktop width while it's open (must match the 900px
    // nav breakpoint in style.css)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  // Animated counters in the stat strip
  var statCounters = document.querySelectorAll('.stat .num');
  if (statCounters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = Number(el.dataset.target || 0);
        var suffix = el.dataset.suffix || '';
        var duration = 1400;
        var startTime = null;
        var formatValue = function (value) {
          return Math.round(value).toString();
        };
        var tick = function (timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = formatValue(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = formatValue(target) + suffix;
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });

    statCounters.forEach(function (el) { counterObserver.observe(el); });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.style.boxShadow = '0 8px 24px -18px rgba(15,46,78,.45)';
      else header.style.boxShadow = 'none';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
