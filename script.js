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

  // Thunder effect: 40 seconds on, 3 minutes off, repeat
  const thunderOverlay = document.querySelector('.thunder-overlay');
  const themes = ['', 'theme-amber', 'theme-steel', 'theme-copper', 'theme-cyan'];
  let themeIndex = 0;
  const THUNDER_INTERVAL_MS = 5100;
  const THUNDER_ACTIVE_MS = 40000;
  const THUNDER_PAUSE_MS = 180000;
  let themeIntervalId = null;
  let scheduleTimeoutId = null;

  function triggerThunder() {
    if (thunderOverlay) {
      thunderOverlay.classList.remove('flash');
      thunderOverlay.offsetHeight;
      thunderOverlay.classList.add('flash');
      setTimeout(() => thunderOverlay.classList.remove('flash'), 450);
    }
    document.body.classList.add('thunder-impact');
    setTimeout(() => document.body.classList.remove('thunder-impact'), 350);
  }

  function cycleTheme() {
    document.body.classList.remove(...themes.filter(Boolean));
    themeIndex = (themeIndex + 1) % themes.length;
    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
    }
    triggerThunder();
  }

  function startThunderPhase() {
    cycleTheme();
    themeIntervalId = setInterval(cycleTheme, THUNDER_INTERVAL_MS);
    scheduleTimeoutId = setTimeout(() => {
      clearInterval(themeIntervalId);
      themeIntervalId = null;
      scheduleTimeoutId = setTimeout(startThunderPhase, THUNDER_PAUSE_MS);
    }, THUNDER_ACTIVE_MS);
  }

  setTimeout(startThunderPhase, 800);

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
