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
    const closeMenu = () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Scroll reveal - mobile uses earlier trigger (smaller rootMargin) for better sync with viewport
  const revealEls = document.querySelectorAll('.reveal');
  const isMobileView = () => window.matchMedia('(max-width: 768px)').matches;
  const getRevealRootMargin = () => isMobileView() ? '0px 0px -40px 0px' : '0px 0px -80px 0px';

  let revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { rootMargin: getRevealRootMargin(), threshold: 0.1 });

  revealEls.forEach((el) => revealObserver.observe(el));

  // Recreate reveal observer on resize (mobile/desktop switch)
  window.addEventListener('resize', () => {
    revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { rootMargin: getRevealRootMargin(), threshold: 0.1 });
    revealEls.forEach((el) => revealObserver.observe(el));
  });

  // Stagger children in grids - shorter delay on mobile for snappier feel
  const staggerContainers = document.querySelectorAll('.ikigai-grid, .services-grid, .portfolio-grid');
  const getStaggerDelay = (i) => (window.matchMedia('(max-width: 768px)').matches ? i * 0.04 : i * 0.08);
  staggerContainers.forEach((container) => {
    container.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${getStaggerDelay(i)}s`;
    });
  });

  // Hero video: show when loaded, fallback only on error
  const heroVideo = document.querySelector('.hero-video');
  const heroFallback = document.querySelector('.hero-video-fallback');
  const heroSection = document.querySelector('.hero');
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

  // On mobile: play video only when hero is visible, pause when scrolled away (saves battery, keeps sync)
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
  if (heroVideo && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!isMobile()) return;
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.25 });
    heroObserver.observe(heroSection);
  }

  // Hero video parallax: video moves slower than foreground on scroll (reduced on mobile for performance)
  const heroVideoWrap = document.querySelector('.hero-video-wrap');
  if (heroVideoWrap && heroSection) {
    const onParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const scrollProgress = -rect.top;
        const speed = isMobile() ? 0.1 : 0.35;
        const translateY = scrollProgress * speed;
        heroVideoWrap.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
  }

  // Thunder effect: synced with video playback on mobile, interval-based on desktop
  const thunderOverlay = document.querySelector('.thunder-overlay');
  const themes = ['', 'theme-amber', 'theme-steel', 'theme-copper', 'theme-cyan'];
  let themeIndex = 0;
  const THUNDER_INTERVAL_EARLY_MS = 5200;
  const THUNDER_INTERVAL_LATE_MS = 70000;
  const SWITCH_AFTER_MS = 30000;

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

  let thunderIntervalId = null;

  if (heroVideo && isMobile()) {
    // Mobile: sync thunder with video playback - fire at 5.2s intervals for first 30s, then 70s
    let lastThunderTime = -1;
    const earlyInterval = 5.2;
    const lateInterval = 70;
    const earlyPhaseEnd = 30;

    heroVideo.addEventListener('timeupdate', () => {
      if (!heroVideo.duration || heroVideo.paused) return;
      const t = heroVideo.currentTime;
      if (t < lastThunderTime) lastThunderTime = -1; // Video looped
      const interval = lastThunderTime < earlyPhaseEnd ? earlyInterval : lateInterval;
      const expectedStrike = lastThunderTime < 0 ? 0 : lastThunderTime + interval;
      if (t >= expectedStrike - 0.35) {
        lastThunderTime = t;
        cycleTheme();
      }
    });
    // First thunder when video starts
    heroVideo.addEventListener('playing', () => {
      if (lastThunderTime < 0) {
        cycleTheme();
        lastThunderTime = 0;
      }
    });
  } else {
    // Desktop: interval-based
    function startEarlyInterval() {
      thunderIntervalId = setInterval(cycleTheme, THUNDER_INTERVAL_EARLY_MS);
    }
    function startLateInterval() {
      if (thunderIntervalId) clearInterval(thunderIntervalId);
      thunderIntervalId = setInterval(cycleTheme, THUNDER_INTERVAL_LATE_MS);
    }
    setTimeout(() => cycleTheme(), 800);
    startEarlyInterval();
    setTimeout(() => startLateInterval(), SWITCH_AFTER_MS);
  }

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
