(() => {
  const root = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ——— Year ——— */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ——— Theme toggle ——— */
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme'); // 'light' | 'dark'
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const applyTheme = (mode) => {
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  };
  toggle?.addEventListener('click', () => {
    const next = (root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  /* ——— Magnetic buttons ——— */
  const magnets = document.querySelectorAll('.magnetic');
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  magnets.forEach(el => {
    let x = 0, y = 0, rx = 0, ry = 0;
    const strength = 18; // px
    const rotate = 6; // deg

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dx = (mx - rect.width / 2) / (rect.width / 2);
      const dy = (my - rect.height / 2) / (rect.height / 2);
      x = dx * strength; y = dy * strength; rx = -dy * rotate; ry = dx * rotate;
      el.style.setProperty('--mx', `${mx}px`);
      el.style.setProperty('--my', `${my}px`);
      el.style.transform = `translate(${x}px, ${y}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const reset = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
  });

  /* ——— 3D tilt cards ——— */
  const tilts = document.querySelectorAll('.tilt');
  tilts.forEach(card => {
    let raf = 0;
    const state = { rx: 0, ry: 0 };
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const target = { rx: -py * 10, ry: px * 12 };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        state.rx = lerp(state.rx, target.rx, 0.2);
        state.ry = lerp(state.ry, target.ry, 0.2);
        card.style.transform = `rotateX(${state.rx}deg) rotateY(${state.ry}deg) translateZ(0)`;
      });
    };
    const onLeave = () => { card.style.transform = ''; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });

  /* ——— Smooth internal nav + wipe ——— */
  const links = document.querySelectorAll('a[data-nav][href^="#"]');
  const wipe = document.querySelector('.transition-wipe');
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      // Wipe in
      wipe.style.transition = 'transform .4s cubic-bezier(.65,.05,.36,1)';
      wipe.style.transform = 'scaleX(1)';
      setTimeout(() => {
        if (!prefersReduced && window.gsap && window.ScrollToPlugin) {
          gsap.to(window, { duration: 0.9, scrollTo: { y: target, offsetY: 72 }, ease: 'power3.out' });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Wipe out
        setTimeout(() => {
          wipe.style.transform = 'scaleX(0)';
        }, 300);
      }, 200);
    });
  });

  /* ——— Split text (chars/words/lines) ——— */
  const splitElems = document.querySelectorAll('[data-split]');
  const splitText = (el, mode = 'chars') => {
    const text = el.textContent;
    el.textContent = '';
    if (mode === 'lines') {
      // Simple line split: wrap words, allow natural breaks
      const words = text.split(' ');
      const line = document.createElement('span'); line.className = 'line';
      words.forEach((w, i) => {
        const span = document.createElement('span'); span.className = 'word'; span.textContent = w + (i < words.length - 1 ? ' ' : '');
        line.appendChild(span);
      });
      el.appendChild(line);
      return Array.from(el.querySelectorAll('.word'));
    }
    if (mode === 'words') {
      return text.split(' ').map((w, i) => {
        const span = document.createElement('span'); span.className = 'word'; span.textContent = w + (i < text.length - 1 ? ' ' : '');
        el.appendChild(span); return span;
      });
    }
    // chars
    return text.split('').map(ch => {
      const span = document.createElement('span'); span.className = 'char'; span.textContent = ch;
      el.appendChild(span); return span;
    });
  };

  /* ——— GSAP section animations ——— */
  const initAnimations = () => {
    if (prefersReduced || !window.gsap) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Fade-in sections
    document.querySelectorAll('.section').forEach((sec) => {
      gsap.from(sec, {
        opacity: 0, y: 60, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 80%', toggleActions: 'play none none reverse' }
      });
    });

    // Split text reveals
    splitElems.forEach(el => {
      const mode = el.getAttribute('data-split');
      const spans = splitText(el, mode);
      gsap.from(spans, {
        yPercent: 120, rotateX: -25, opacity: 0,
        transformOrigin: '50% 100% -20',
        duration: 0.9, ease: 'power3.out',
        stagger: { each: 0.02, from: 'start' },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    // Images slight parallax
    document.querySelectorAll('.project-card img').forEach(img => {
      gsap.to(img, {
        y: -12, ease: 'none',
        scrollTrigger: { trigger: img, scrub: 0.4, start: 'top bottom', end: 'bottom top' }
      });
    });
  };

  /* ——— Hero parallax (mouse + scroll) ——— */
  const layers = document.querySelectorAll('.hero .layer');
  const hero = document.querySelector('.hero');
  if (hero && layers.length && !prefersReduced) {
    const parallax = (x, y) => {
      layers.forEach(layer => {
        const d = parseFloat(layer.getAttribute('data-depth') || '0.05');
        const tx = (x - window.innerWidth / 2) * d;
        const ty = (y - window.innerHeight / 2) * d;
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };
    window.addEventListener('mousemove', (e) => parallax(e.clientX, e.clientY));
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.2;
      layers.forEach(layer => {
        const d = parseFloat(layer.getAttribute('data-depth') || '0.05');
        layer.style.transform = `translate3d(0, ${y * d}px, 0)`;
      });
    });
  }

  /* ——— Background canvas (organic orbs + grain) ——— */
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w, h, t = 0;
    const orbs = Array.from({ length: 14 }).map((_, i) => ({
      r: 80 + Math.random() * 160,
      x: Math.random(),
      y: Math.random(),
      hue: (i * 26 + 200) % 360,
      a: .24 + Math.random() * .18,
      spx: (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
