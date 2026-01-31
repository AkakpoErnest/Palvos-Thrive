(function () {
  'use strict';

  // Header scroll state
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const revealOptions = { rootMargin: '0px 0px -80px 0px', threshold: 0.1 };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, revealOptions);

  revealEls.forEach((el) => revealObserver.observe(el));

  // Stagger children in grids (optional)
  const staggerContainers = document.querySelectorAll('.ikigai-grid, .services-grid, .portfolio-grid');
  staggerContainers.forEach((container, ci) => {
    const children = container.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // Hero video: show when loaded, fallback only on error
  const heroVideo = document.querySelector('.hero-video');
  const heroFallback = document.querySelector('.hero-video-fallback');
  if (heroVideo && heroFallback) {
    heroVideo.style.opacity = '1';
    heroVideo.addEventListener('canplay', () => {
      heroVideo.style.transition = 'opacity 0.8s ease';
      heroVideo.style.opacity = '1';
      heroVideo.play().catch(() => {});
    });
    heroVideo.addEventListener('error', () => {
      heroFallback.style.opacity = '1';
    });
    if (heroVideo.readyState >= 2) {
      heroVideo.play().catch(() => {});
    }
  }

  // Hero video parallax: video moves slower than foreground on scroll
  const heroVideoWrap = document.querySelector('.hero-video-wrap');
  const heroSection = document.querySelector('.hero');
  if (heroVideoWrap && heroSection) {
    const parallaxSpeed = 0.35;
    const onParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      const heroHeight = heroSection.offsetHeight;
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const scrollProgress = -rect.top;
        const translateY = scrollProgress * parallaxSpeed;
        heroVideoWrap.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
  }

  // Video-synced color themes and thunder effect (every 5.3 seconds)
  const thunderOverlay = document.querySelector('.thunder-overlay');
  const themes = ['', 'theme-amber', 'theme-steel', 'theme-copper', 'theme-cyan'];
  let themeIndex = 0;
  const THEME_INTERVAL_MS = 5300;
  const SCROLL_PAUSE_MS = 30000;
  let themeIntervalId = null;
  let scrollPauseTimeoutId = null;
  let lastScrollY = window.scrollY;

  function triggerThunder() {
    if (thunderOverlay) {
      thunderOverlay.classList.remove('flash');
      void thunderOverlay.offsetWidth;
      thunderOverlay.classList.add('flash');
      setTimeout(() => thunderOverlay.classList.remove('flash'), 500);
    }
  }

  function cycleTheme() {
    document.body.classList.remove(...themes.filter(Boolean));
    themeIndex = (themeIndex + 1) % themes.length;
    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
    }
    triggerThunder();
  }

  function startThemeInterval() {
    if (themeIntervalId) return;
    themeIntervalId = setInterval(cycleTheme, THEME_INTERVAL_MS);
  }

  function stopThemeInterval() {
    if (themeIntervalId) {
      clearInterval(themeIntervalId);
      themeIntervalId = null;
    }
  }

  function onScrollForThunder() {
    if (window.scrollY > lastScrollY) {
      stopThemeInterval();
      if (scrollPauseTimeoutId) clearTimeout(scrollPauseTimeoutId);
      scrollPauseTimeoutId = setTimeout(() => {
        scrollPauseTimeoutId = null;
        startThemeInterval();
      }, SCROLL_PAUSE_MS);
    }
    lastScrollY = window.scrollY;
  }

  window.addEventListener('scroll', onScrollForThunder, { passive: true });
  startThemeInterval();

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
