/* ================================================================
   WEDDING INVITATION — script.js
   Nagraj & Granthali · 26 April 2026
================================================================ */
(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────────── */
  const overlay  = document.getElementById('intro-overlay');
  const tapBtn   = document.getElementById('tap-btn');
  const audio    = document.getElementById('bg-audio');
  const muteBtn  = document.getElementById('mute-btn');
  const iconSnd  = document.getElementById('icon-sound');
  const iconMut  = document.getElementById('icon-mute');
  const bfLayer  = document.getElementById('butterfly-layer');
  const reveals  = Array.from(document.querySelectorAll('.reveal'));
  const sideFl   = Array.from(document.querySelectorAll('.side-flower'));

  let opened = false;

  /* ================================================================
     BUTTERFLY FACTORY — 14 butterflies of varied size, speed, pos
  ================================================================ */
  const BF_CONFIG = [
    { left:  4,  sz: 0.72, op: 0.38, wf: '0.36s', delay:  0.4, dur: 12 },
    { left: 14,  sz: 0.50, op: 0.28, wf: '0.46s', delay:  3.5, dur: 15 },
    { left: 25,  sz: 0.85, op: 0.42, wf: '0.33s', delay:  7.0, dur: 11 },
    { left: 38,  sz: 0.60, op: 0.32, wf: '0.42s', delay:  1.2, dur: 14 },
    { left: 50,  sz: 0.78, op: 0.36, wf: '0.38s', delay:  9.5, dur: 12 },
    { left: 62,  sz: 0.55, op: 0.30, wf: '0.48s', delay:  4.8, dur: 16 },
    { left: 73,  sz: 0.68, op: 0.35, wf: '0.40s', delay:  7.8, dur: 13 },
    { left: 84,  sz: 0.52, op: 0.26, wf: '0.44s', delay: 12.0, dur: 17 },
    { left: 92,  sz: 0.76, op: 0.38, wf: '0.35s', delay:  2.2, dur: 11 },
    { left:  9,  sz: 0.62, op: 0.30, wf: '0.43s', delay:  6.1, dur: 14 },
    { left: 31,  sz: 0.88, op: 0.40, wf: '0.31s', delay: 10.5, dur: 10 },
    { left: 57,  sz: 0.58, op: 0.28, wf: '0.45s', delay:  5.4, dur: 15 },
    { left: 78,  sz: 0.70, op: 0.33, wf: '0.39s', delay: 14.0, dur: 13 },
    { left: 46,  sz: 0.64, op: 0.32, wf: '0.41s', delay: 16.5, dur: 18 },
  ];

  const BF_COLORS = [
    'rgba(184, 134,  90, OP)',
    'rgba(201, 154, 110, OP)',
    'rgba(218, 178, 140, OP)',
    'rgba(168, 110,  65, OP)',
    'rgba(196, 148, 100, OP)',
    'rgba(210, 168, 120, OP)',
  ];

  function makeBFSvg(color, w, h) {
    return `<svg width="${w}" height="${h}" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14 C14 5, 1 2, 0 10 C-1 17, 10 22, 20 14Z" fill="${color}"/>
      <path d="M20 14 C14 19, 3 24, 2 19 C1 15, 9 11, 20 14Z" fill="${color}" opacity="0.58"/>
      <path d="M20 14 C26 5, 39 2, 40 10 C41 17, 30 22, 20 14Z" fill="${color}"/>
      <path d="M20 14 C26 19, 37 24, 38 19 C39 15, 31 11, 20 14Z" fill="${color}" opacity="0.58"/>
      <ellipse cx="20" cy="14" rx="1.7" ry="5.5" fill="${color}" opacity="0.72"/>
      <circle  cx="20" cy="9"  r="1.4"            fill="${color}" opacity="0.55"/>
      <line x1="19" y1="7" x2="17" y2="3" stroke="${color}" stroke-width="0.7" opacity="0.5"/>
      <line x1="21" y1="7" x2="23" y2="3" stroke="${color}" stroke-width="0.7" opacity="0.5"/>
    </svg>`;
  }

  BF_CONFIG.forEach((cfg, i) => {
    const el      = document.createElement('div');
    el.className  = 'bf';
    const color   = BF_COLORS[i % BF_COLORS.length].replace('OP', cfg.op);
    const w       = Math.round(40 * cfg.sz);
    const h       = Math.round(28 * cfg.sz);

    /* Organic sway waypoints */
    const sx1 = (Math.random() - 0.5) * 100;
    const sy1 = -(12 + Math.random() * 22);
    const sx2 = sx1 + (Math.random() - 0.5) * 90;
    const sy2 = -(40 + Math.random() * 25);
    const sx3 = sx2 + (Math.random() - 0.5) * 80;
    const r1  = (Math.random() - 0.5) * 22;
    const r2  = (Math.random() - 0.5) * 28;
    const r3  = (Math.random() - 0.5) * 18;

    el.style.cssText = [
      `left:${cfg.left}%`,
      `--bf-opacity:${cfg.op}`,
      `--wf-dur:${cfg.wf}`,
      `--sx1:${sx1}px`,  `--sy1:${sy1}vh`,
      `--sx2:${sx2}px`,  `--sy2:${sy2}vh`,
      `--sx3:${sx3}px`,
      `--r1:${r1}deg`,   `--r2:${r2}deg`,  `--r3:${r3}deg`,
      `animation:float-up ${cfg.dur}s linear ${cfg.delay}s infinite`,
      `animation-play-state:paused`,
    ].join(';');

    el.innerHTML = makeBFSvg(color, w, h);
    bfLayer.appendChild(el);
  });

  /* ================================================================
     PETAL FACTORY — 10 drifting petals
  ================================================================ */
  const PETAL_CONFIG = [
    { left:  8,  sz: 0.9,  op: 0.30, delay:  2.0, dur: 11 },
    { left: 20,  sz: 0.7,  op: 0.25, delay:  5.5, dur: 13 },
    { left: 35,  sz: 1.0,  op: 0.32, delay:  0.8, dur: 10 },
    { left: 48,  sz: 0.8,  op: 0.28, delay:  8.2, dur: 14 },
    { left: 60,  sz: 0.65, op: 0.24, delay:  3.6, dur: 12 },
    { left: 72,  sz: 0.95, op: 0.30, delay: 11.0, dur: 11 },
    { left: 85,  sz: 0.75, op: 0.26, delay:  6.8, dur: 15 },
    { left: 15,  sz: 0.85, op: 0.28, delay: 14.0, dur: 13 },
    { left: 55,  sz: 0.72, op: 0.25, delay:  9.3, dur: 16 },
    { left: 93,  sz: 0.60, op: 0.22, delay: 17.5, dur: 18 },
  ];

  function makePetalSvg(color, w, h) {
    // Simple teardrop petal shape
    return `<svg width="${w}" height="${h}" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1 C16 6, 18 14, 10 27 C2 14, 4 6, 10 1Z" fill="${color}"/>
      <path d="M10 1 L10 27" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
    </svg>`;
  }

  const PETAL_COLORS = [
    'rgba(210, 170, 130, OP)',
    'rgba(195, 150, 110, OP)',
    'rgba(225, 185, 145, OP)',
    'rgba(180, 135,  90, OP)',
  ];

  PETAL_CONFIG.forEach((cfg, i) => {
    const el     = document.createElement('div');
    el.className = 'petal';
    const color  = PETAL_COLORS[i % PETAL_COLORS.length].replace('OP', cfg.op);
    const w      = Math.round(20 * cfg.sz);
    const h      = Math.round(28 * cfg.sz);

    const px1 = (Math.random() - 0.5) * 80;
    const px2 = px1 + (Math.random() - 0.5) * 60;
    const px3 = px2 + (Math.random() - 0.5) * 50;
    const pr1 = Math.random() * 360;
    const pr2 = pr1 + (Math.random() - 0.5) * 180;
    const pr3 = pr2 + (Math.random() - 0.5) * 120;

    el.style.cssText = [
      `left:${cfg.left}%`,
      `--pt-opacity:${cfg.op}`,
      `--px1:${px1}px`, `--px2:${px2}px`, `--px3:${px3}px`,
      `--pr1:${pr1}deg`, `--pr2:${pr2}deg`, `--pr3:${pr3}deg`,
      `animation:petal-fall ${cfg.dur}s ease-in-out ${cfg.delay}s infinite`,
      `animation-play-state:paused`,
    ].join(';');

    el.innerHTML = makePetalSvg(color, w, h);
    bfLayer.appendChild(el);
  });

  /* ================================================================
     OPEN INVITE — triggered ONLY by #tap-btn
  ================================================================ */
  function openInvite() {
    if (opened) return;
    opened = true;

    /* Dismiss overlay */
    overlay.classList.add('fade-away');

    /* Start audio (browser may block; silent fail) */
    audio.play().catch(() => {});

    /* Show mute button after overlay fades */
    setTimeout(() => muteBtn.classList.add('shown'), 1100);

    /* Activate butterflies & petals */
    bfLayer.querySelectorAll('.bf, .petal').forEach(el => {
      el.style.animationPlayState = 'running';
    });

    /* Activate side flowers */
    sideFl.forEach(el => el.classList.add('in'));

    /* Stagger-reveal invitation sections */
    reveals.forEach((el, idx) => {
      const base = el.style.transitionDelay
        ? parseFloat(el.style.transitionDelay) * 1000
        : 0;
      setTimeout(() => el.classList.add('in'), 800 + base + idx * 60);
    });
  }

  /* Only the tap button opens — overlay itself does nothing */
  tapBtn.addEventListener('click',    openInvite);
  tapBtn.addEventListener('touchend', e => { e.preventDefault(); openInvite(); }, { passive: false });
  tapBtn.addEventListener('keydown',  e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvite(); }
  });

  /* ================================================================
     MUTE TOGGLE
  ================================================================ */
  let muted = false;
  muteBtn.addEventListener('click', () => {
    muted        = !muted;
    audio.muted  = muted;
    iconSnd.style.display = muted ? 'none'  : 'block';
    iconMut.style.display = muted ? 'block' : 'none';
    muteBtn.setAttribute('aria-label', muted ? 'Unmute music' : 'Mute music');
  });

  /* ================================================================
     INTERSECTION OBSERVER — scroll-based reveals
  ================================================================ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && opened) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => io.observe(el));

}());
