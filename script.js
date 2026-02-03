(function () {
  'use strict';

  // --- Glass crack intro overlay (shows on every visit) ---
  const glassIntro = document.getElementById('glass-intro');
  const crackSvg = document.getElementById('glass-intro-crack');
  const particlesEl = document.getElementById('glass-intro-particles');
  const heroCta = document.getElementById('hero-cta');
  const shatterLayer = document.getElementById('glass-shatter');
  const shatterCrack = document.getElementById('glass-shatter-crack');
  const shatterShards = document.getElementById('glass-shatter-shards');

  function shouldShowIntro() {
    return true; /* Show crack intro on every visit */
  }

  function dismissIntro() {
    glassIntro.classList.add('is-dismissed');
    document.body.style.overflow = '';
    if (heroCta) heroCta.focus();
  }

  function generateCrackPaths(ox, oy) {
    const branches = 8;
    const paths = [];
    for (let i = 0; i < branches; i++) {
      const angle = (i / branches) * Math.PI * 2 + (i % 2) * 0.25;
      let x = ox, y = oy;
      const segs = 4 + (i % 2);
      const pts = [x, y];
      for (let s = 0; s < segs; s++) {
        const len = 12 + (s * 6) + (i % 3) * 3;
        x += Math.cos(angle + s * 0.35) * len;
        y += Math.sin(angle + s * 0.35) * len;
        pts.push(x, y);
      }
      const d = pts.reduce((acc, v, idx) => acc + (idx % 2 ? ',' : (idx ? 'L' : 'M')) + v, '');
      paths.push({ d });
    }
    return paths;
  }

  function addParticles(cx, cy) {
    if (!particlesEl) return;
    const n = 4;
    for (let i = 0; i < n; i++) {
      const span = document.createElement('span');
      const angle = (i / n) * Math.PI * 2;
      const dist = 15 + Math.random() * 20;
      span.style.cssText = `left:${cx}%;top:${cy}%;--px:${Math.cos(angle) * dist}px;--py:${Math.sin(angle) * dist}px`;
      particlesEl.appendChild(span);
      setTimeout(() => span.remove(), 650);
    }
  }

  function spawnShatter(ox, oy, paths) {
    if (!shatterLayer || !shatterCrack || !shatterShards) return;
    shatterCrack.innerHTML = paths.map(({ d }) =>
      `<path d="${d}" pathLength="100"></path>`
    ).join('');
    shatterShards.innerHTML = '';
    const shardCount = 12;
    for (let i = 0; i < shardCount; i++) {
      const span = document.createElement('span');
      const angle = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 180;
      const size = 10 + Math.random() * 22;
      span.style.width = `${size}px`;
      span.style.height = `${Math.max(8, size * 0.7)}px`;
      span.style.left = `${ox}%`;
      span.style.top = `${oy}%`;
      span.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      span.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      span.style.setProperty('--rot', `${Math.random() * 180}deg`);
      span.style.setProperty('--delay', `${Math.random() * 0.12}s`);
      shatterShards.appendChild(span);
    }
    document.body.classList.remove('glass-shatter-active');
    void shatterLayer.offsetWidth;
    document.body.classList.add('glass-shatter-active');
    window.setTimeout(() => {
      document.body.classList.remove('glass-shatter-active');
      shatterShards.innerHTML = '';
      shatterCrack.innerHTML = '';
    }, 1500);
  }

  function triggerCrackAndDismiss(clientX, clientY) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      dismissIntro();
      return;
    }
    const rect = glassIntro.getBoundingClientRect();
    const ox = ((clientX - rect.left) / rect.width) * 100;
    const oy = ((clientY - rect.top) / rect.height) * 100;
    const paths = generateCrackPaths(ox, oy);
    crackSvg.innerHTML = paths.map(({ d }) =>
      `<path d="${d}" pathLength="100"></path>`
    ).join('');
    addParticles(ox, oy);
    spawnShatter(ox, oy, paths);
    setTimeout(dismissIntro, 750);
  }

  let introDismissing = false;

  function handleIntroDismiss(e) {
    if (!glassIntro || glassIntro.classList.contains('is-dismissed') || introDismissing) return;
    const isClick = e.type === 'click';
    const isKey = e.type === 'keydown' && (e.key === 'Enter' || e.key === ' ');
    if (!isClick && !isKey) return;
    if (isKey) e.preventDefault();
    introDismissing = true;
    const x = isClick ? e.clientX : window.innerWidth / 2;
    const y = isClick ? e.clientY : window.innerHeight / 2;
    triggerCrackAndDismiss(x, y);
  }

  if (glassIntro) {
    document.body.style.overflow = 'hidden';
    glassIntro.classList.remove('is-dismissed');
    glassIntro.addEventListener('click', handleIntroDismiss);
    glassIntro.addEventListener('keydown', handleIntroDismiss);
    glassIntro.focus();
  }

  // --- Effects preference (localStorage + prefers-reduced-motion) ---
  const EFFECTS_KEY = 'palvos-effects';
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getEffectsEnabled() {
    if (prefersReducedMotion()) return false;
    const stored = localStorage.getItem(EFFECTS_KEY);
    return stored !== 'false'; // default true when not set
  }

  function setEffectsEnabled(enabled) {
    localStorage.setItem(EFFECTS_KEY, String(enabled));
    document.body.classList.toggle('effects-off', !enabled);
    const wrap = document.querySelector('.hero-video-wrap');
    if (!enabled && wrap) wrap.style.transform = '';
  }

  // Initialize effects state
  document.body.classList.toggle('effects-off', !getEffectsEnabled());

  // Effects toggle button
  const effectsToggle = document.getElementById('effects-toggle');
  if (effectsToggle) {
    effectsToggle.setAttribute('aria-pressed', String(getEffectsEnabled()));
    effectsToggle.addEventListener('click', () => {
      const next = !getEffectsEnabled();
      setEffectsEnabled(next);
      effectsToggle.setAttribute('aria-pressed', String(next));
    });
  }

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
  const staggerContainers = document.querySelectorAll('.ikigai-grid, .testimonials-grid, .portfolio-grid');
  const getStaggerDelay = (i) => (window.matchMedia('(max-width: 768px)').matches ? i * 0.04 : i * 0.08);
  staggerContainers.forEach((container) => {
    container.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${getStaggerDelay(i)}s`;
    });
  });

  // Ikigai cards: mouse-follow glow (throttled, desktop only)
  const isTouch = 'ontouchstart' in window;
  if (!isTouch) {
    let rafId = null;
    let pendingCard = null, pendingX = 0, pendingY = 0;
    function updateGlow() {
      if (pendingCard && getEffectsEnabled()) {
        pendingCard.style.setProperty('--mouse-x', pendingX + '%');
        pendingCard.style.setProperty('--mouse-y', pendingY + '%');
      }
      rafId = null;
    }
    document.querySelectorAll('.ikigai-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        pendingCard = card;
        pendingX = ((e.clientX - rect.left) / rect.width) * 100;
        pendingY = ((e.clientY - rect.top) / rect.height) * 100;
        if (!rafId) rafId = requestAnimationFrame(updateGlow);
      });
    });
  }

  // Services engine: scroll + cursor tilt + hover sync
  const servicesSection = document.getElementById('services');
  const servicesScene = servicesSection ? servicesSection.querySelector('.services-scene') : null;
  const servicesEngine = document.getElementById('services-engine');
  const serviceLines = servicesSection ? servicesSection.querySelectorAll('.service-line') : [];

  if (servicesScene && serviceLines.length) {
    const defaultAccent = getComputedStyle(servicesScene).getPropertyValue('--engine-accent').trim() || 'rgba(0, 212, 170, 0.9)';
    const defaultSpeed = getComputedStyle(servicesScene).getPropertyValue('--engine-speed').trim() || '14s';
    const resetEngine = () => {
      servicesScene.style.setProperty('--engine-accent', defaultAccent);
      servicesScene.style.setProperty('--engine-speed', defaultSpeed);
    };
    serviceLines.forEach((line) => {
      const activate = () => {
        if (!getEffectsEnabled()) return;
        if (line.dataset.accent) servicesScene.style.setProperty('--engine-accent', line.dataset.accent);
        if (line.dataset.speed) servicesScene.style.setProperty('--engine-speed', `${line.dataset.speed}s`);
      };
      line.addEventListener('mouseenter', activate);
      line.addEventListener('focus', activate);
      line.addEventListener('mouseleave', resetEngine);
      line.addEventListener('blur', resetEngine);
    });
    servicesSection.addEventListener('mouseleave', resetEngine);
  }

  if (servicesSection && servicesEngine && !window.matchMedia('(max-width: 768px)').matches) {
    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    function onServicesScroll() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!getEffectsEnabled()) return;
      if (window.matchMedia('(max-width: 768px)').matches) return;
      rafId = null;
      const rect = servicesSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const enter = vh * 0.3;
      const exit = -vh * 0.2;
      const total = enter - exit;
      const dist = rect.top - enter;
      const progress = Math.max(0, Math.min(1, 1 - dist / total));
      const deg = (progress - 0.5) * 6;
      targetY = deg;
      targetX = (progress - 0.5) * -3;
    }
    function scheduleScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(onServicesScroll);
    }
    function updateTilt() {
      if (!getEffectsEnabled() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        servicesEngine.style.setProperty('--engine-tilt-x', '0deg');
        servicesEngine.style.setProperty('--engine-tilt-y', '0deg');
      } else {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        servicesEngine.style.setProperty('--engine-tilt-x', `${currentX.toFixed(3)}deg`);
        servicesEngine.style.setProperty('--engine-tilt-y', `${currentY.toFixed(3)}deg`);
      }
      requestAnimationFrame(updateTilt);
    }
    servicesSection.addEventListener('mousemove', (e) => {
      if (!getEffectsEnabled()) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = servicesSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = x * 8;
      targetX = y * -6;
    });
    servicesSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleScroll);
    onServicesScroll();
    updateTilt();
  }

  // About 3D: subtle mouse tilt on the brand carousel
  const aboutViewer = document.querySelector('.about-viewer');
  const brand3d = document.querySelector('.brand-3d');
  if (aboutViewer && brand3d && !window.matchMedia('(max-width: 768px)').matches) {
    let tiltRaf = null;
    const updateBrandTilt = (x, y) => {
      brand3d.style.setProperty('--brand-tilt-x', `${y.toFixed(2)}deg`);
      brand3d.style.setProperty('--brand-tilt-y', `${x.toFixed(2)}deg`);
    };
    aboutViewer.addEventListener('mousemove', (e) => {
      if (!getEffectsEnabled()) return;
      const rect = aboutViewer.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      const x = relX * 10;
      const y = relY * -8;
      if (tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        updateBrandTilt(x, y);
        tiltRaf = null;
      });
    });
    aboutViewer.addEventListener('mouseleave', () => {
      updateBrandTilt(0, 0);
    });
  }

  // CTA mirror sweep when approaching the section
  const ctaSection = document.querySelector('.cta');
  const ctaInner = document.querySelector('.cta-inner');
  if (ctaSection && ctaInner) {
    const revealMirror = () => {
      if (prefersReducedMotion()) return;
      if (!ctaInner.classList.contains('mirror-active')) {
        ctaInner.classList.add('mirror-active');
      }
    };
    if ('IntersectionObserver' in window) {
      const mirrorObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealMirror();
        });
      }, { rootMargin: '0px 0px -20% 0px', threshold: 0.2 });
      mirrorObserver.observe(ctaSection);
    } else {
      revealMirror();
    }
  }

  // Hero video: show when loaded, robust fallback on error (poster + gradient stay visible)
  const heroVideo = document.querySelector('.hero-video');
  const heroFallback = document.querySelector('.hero-video-fallback');
  const heroSection = document.querySelector('.hero');
  if (heroVideo && heroFallback) {
    heroVideo.style.opacity = '1';
    heroVideo.addEventListener('canplay', () => {
      heroVideo.style.transition = 'opacity 0.8s ease';
      heroVideo.style.opacity = '1';
      heroFallback.style.opacity = '0';
      heroVideo.play().catch(() => {});
    });
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
      heroFallback.style.opacity = '1';
      heroFallback.style.transition = 'opacity 0.6s ease';
    });
    if (heroVideo.readyState >= 2) {
      heroVideo.play().catch(() => {});
    } else {
      heroVideo.load();
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

  // Hero video parallax: video moves slower than foreground on scroll (disabled when effects off)
  const heroVideoWrap = document.querySelector('.hero-video-wrap');
  if (heroVideoWrap && heroSection) {
    const onParallax = () => {
      if (!getEffectsEnabled()) return;
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
  const THUNDER_FIRST_STRIKE_MS = 20000;   // First thunder after 20 seconds
  const THUNDER_INTERVAL_MS = 120000;      // Then every 2 minutes

  function triggerThunder() {
    if (!getEffectsEnabled()) return;
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
    // Desktop: first thunder after 20s, then every 2 minutes
    setTimeout(() => {
      cycleTheme();
      if (thunderIntervalId) clearInterval(thunderIntervalId);
      thunderIntervalId = setInterval(cycleTheme, THUNDER_INTERVAL_MS);
    }, THUNDER_FIRST_STRIKE_MS);
  }

  // --- Portfolio modal (vanilla JS) ---
  const portfolioData = {
    ernest: {
      title: 'Ernest Akakpo',
      summary: 'A personal brand and portfolio site that showcases expertise and attracts clients. Built with a focus on conversion and authentic storytelling.',
      role: 'Web design, branding, development',
      stack: 'React, Tailwind, Vercel',
      goals: 'Establish professional presence, attract consulting clients, demonstrate thought leadership',
      outcomes: 'Clean, fast site that converts visitors into inquiry leads',
      link: 'https://ernestakakpo.com',
      screenshots: ['assets/work-1.png']
    },
    paakow: {
      title: 'Paakow',
      summary: 'A portfolio and storytelling site for a creative professional. Designed to resonate with potential collaborators and clients.',
      role: 'Personal site design & development',
      stack: 'Next.js, Tailwind, Vercel',
      goals: 'Tell a compelling story, showcase work, enable contact',
      outcomes: 'Memorable, on-brand experience that generates opportunities',
      link: 'https://paakow.vercel.app/',
      screenshots: ['assets/work-2.png']
    },
    akosua: {
      title: 'Akosua Osei',
      summary: 'A full-stack site with strong SEO and conversion optimization. Built to rank and convert in a competitive space.',
      role: 'Full-stack design, SEO, conversion',
      stack: 'Next.js, SEO, analytics',
      goals: 'Improve search visibility, increase form submissions, professional credibility',
      outcomes: 'Improved rankings, higher conversion rate, scalable architecture',
      link: 'https://akosua-osei.vercel.app/',
      screenshots: ['assets/work-3.png']
    }
  };

  const modal = document.getElementById('portfolio-modal');
  const modalCloseButtons = document.querySelectorAll('[data-close-modal]');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-project]');

  function openModal(projectId) {
    const data = portfolioData[projectId];
    if (!data || !modal) return;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-summary').textContent = data.summary;
    document.getElementById('modal-role').textContent = data.role;
    document.getElementById('modal-stack').textContent = data.stack;
    document.getElementById('modal-goals').textContent = data.goals;
    document.getElementById('modal-outcomes').textContent = data.outcomes;
    const cta = document.getElementById('modal-cta');
    cta.href = data.link;
    const screenshots = document.getElementById('modal-screenshots');
    screenshots.innerHTML = (data.screenshots || []).map(src => `<img src="${src}" alt="" loading="lazy">`).join('');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function handlePortfolioClick(e, item) {
    if (e.target.closest('a.portfolio-link')) return;
    e.preventDefault();
    openModal(item.getAttribute('data-project'));
  }

  portfolioItems.forEach(item => {
    item.addEventListener('click', (e) => handlePortfolioClick(e, item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePortfolioClick(e, item);
      }
    });
  });

  modalCloseButtons.forEach(btn => btn.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  // --- Custom smooth scroll: 550ms, easeInOutCubic, header offset ---
  const getScrollOffset = () => window.matchMedia('(max-width: 768px)').matches ? 64 : 80;
  const SCROLL_DURATION = 550;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetEl) {
    const offset = getScrollOffset();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const y = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo(0, Math.max(0, y));
      return;
    }
    const startY = window.scrollY;
    const endY = targetEl.getBoundingClientRect().top + startY - offset;
    const distance = Math.max(0, endY) - startY;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target);
      }
    });
  });

})();
