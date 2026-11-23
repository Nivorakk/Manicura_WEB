/* =========================================================
   LÚMINA · Efectos visuales y utilidades comunes
   Preloader, cursor con destellos, partículas doradas, animaciones
   al hacer scroll, parallax, tilt 3D, botones magnéticos, contadores,
   cabecera inteligente, menú móvil, toasts y confeti.
   ========================================================= */
window.L = window.L || {};

L.fx = (function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };

  /* ---------- Preloader ---------- */
  function preloader(onDone) {
    const pre = $('#preloader'), bar = $('#preloaderBar'), count = $('#preloaderCount');
    const imgs = $$('img').filter(i => !i.loading || i.loading !== 'lazy').slice(0, 6);
    let loaded = 0, shown = 0, finished = false;
    const total = imgs.length || 1;
    imgs.forEach(img => {
      if (img.complete) loaded++;
      else img.addEventListener('load', () => loaded++, { once: true }), img.addEventListener('error', () => loaded++, { once: true });
    });
    const start = performance.now();
    (function tick(now) {
      const target = Math.min(100, (loaded / total) * 100, ((now - start) / 1400) * 100);
      shown = lerp(shown, target, .12);
      const v = Math.round(shown);
      bar.style.transform = `scaleX(${shown / 100})`;
      count.textContent = v;
      if (v >= 99 || now - start > 4000) {
        if (finished) return;
        finished = true;
        count.textContent = 100; bar.style.transform = 'scaleX(1)';
        setTimeout(() => {
          pre.classList.add('is-done');
          document.body.classList.remove('is-loading');
          setTimeout(() => { document.body.classList.add('is-ready'); onDone && onDone(); }, 550);
        }, 200);
        return;
      }
      requestAnimationFrame(tick);
    })(start);
  }

  /* ---------- Cursor y estela de destellos ---------- */
  function cursor() {
    window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    if (!finePointer) return;
    document.documentElement.classList.add('has-cursor');
    const dot = $('#cursorDot'), ring = $('#cursorRing'), label = $('#cursorLabel');
    const ringPos = { x: mouse.x, y: mouse.y };
    const canvas = $('#sparkleCanvas'), ctx = canvas.getContext('2d');
    let W, H, dpr = Math.min(devicePixelRatio || 1, 2);
    const sparks = [];
    const resize = () => { W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr; };
    resize(); addEventListener('resize', resize);
    let last = { x: mouse.x, y: mouse.y };

    function star(x, y, r, rot, alpha) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.quadraticCurveTo(r * .12, r * .12, 0, r);
        ctx.quadraticCurveTo(-r * .12, r * .12, 0, 0);
      }
      ctx.fill(); ctx.restore();
    }
    (function loop() {
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      ringPos.x = lerp(ringPos.x, mouse.x, .18); ringPos.y = lerp(ringPos.y, mouse.y, .18);
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      // Nuevos destellos según la velocidad del ratón
      const dist = Math.hypot(mouse.x - last.x, mouse.y - last.y);
      if (!reduced && dist > 6 && sparks.length < 70) {
        const n = Math.min(3, Math.floor(dist / 14) + 1);
        for (let i = 0; i < n; i++) sparks.push({ x: mouse.x * dpr, y: mouse.y * dpr, vx: (Math.random() - .5) * 1.4 * dpr, vy: (Math.random() * .8 + .2) * dpr, r: (Math.random() * 5 + 2.5) * dpr, rot: Math.random() * 3, life: 1, hue: Math.random() < .25 ? '#F6D6D8' : (Math.random() < .5 ? '#F3E2C3' : '#D9B98C') });
      }
      last = { x: mouse.x, y: mouse.y };
      ctx.clearRect(0, 0, W, H);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.rot += .05; s.life -= .022;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.fillStyle = s.hue; ctx.shadowColor = '#D9B98C'; ctx.shadowBlur = 8 * dpr;
        star(s.x, s.y, s.r * s.life, s.rot, s.life);
      }
      requestAnimationFrame(loop);
    })();

    // Estados del anillo: hover y etiqueta
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], a, button, .g-item, .panel, input[type=range], label');
      ring.classList.remove('is-hover', 'is-label');
      if (!t) return;
      const txt = t.getAttribute && t.getAttribute('data-cursor');
      if (txt) { label.textContent = txt; ring.classList.add('is-label'); }
      else ring.classList.add('is-hover');
    });
    document.addEventListener('pointerdown', () => ring.style.scale = '.85');
    document.addEventListener('pointerup', () => ring.style.scale = '1');
    document.addEventListener('mouseleave', () => document.documentElement.classList.remove('has-cursor'));
    document.addEventListener('mouseenter', () => document.documentElement.classList.add('has-cursor'));
  }

  /* ---------- Partículas doradas del hero ---------- */
  function heroParticles() {
    const canvas = $('#heroCanvas'); if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W, H, parts = [], visible = true;
    function resize() {
      const r = canvas.getBoundingClientRect();
      W = canvas.width = r.width * dpr; H = canvas.height = r.height * dpr;
      const n = Math.round(Math.min(110, r.width / 12));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: (Math.random() ** 2 * 2.4 + .4) * dpr,
        vx: (Math.random() - .5) * .15 * dpr, vy: -(Math.random() * .35 + .05) * dpr,
        a: Math.random() * .6 + .2, tw: Math.random() * Math.PI * 2
      }));
    }
    resize(); addEventListener('resize', resize);
    new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      const rect = canvas.getBoundingClientRect();
      const mx = (mouse.x - rect.left) * dpr, my = (mouse.y - rect.top) * dpr;
      for (const p of parts) {
        if (!reduced) {
          p.x += p.vx; p.y += p.vy; p.tw += .03;
          const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
          if (d < 140 * dpr) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
          if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
          if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        }
        const alpha = p.a * (.55 + .45 * Math.sin(p.tw));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,236,205,${alpha})`);
        g.addColorStop(.4, `rgba(217,185,140,${alpha * .45})`);
        g.addColorStop(1, 'rgba(217,185,140,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
      }
    })();
  }

  /* ---------- Profundidad del hero con el ratón ---------- */
  function heroDepth() {
    const wrap = $('#heroVisual'); if (!wrap || !finePointer || reduced) return;
    const layers = $$('[data-depth]', wrap);
    const cur = { x: 0, y: 0 };
    (function loop() {
      const tx = (mouse.x / innerWidth - .5), ty = (mouse.y / innerHeight - .5);
      cur.x = lerp(cur.x, tx, .06); cur.y = lerp(cur.y, ty, .06);
      layers.forEach(l => {
        const d = parseFloat(l.dataset.depth);
        l.style.translate = `${cur.x * d * -40}px ${cur.y * d * -40}px`;
        if (l.classList.contains('arch')) l.style.rotate = `y ${cur.x * 8}deg`;
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Títulos divididos en palabras ---------- */
  function splitTitles(root = document) {
    $$('.reveal-title:not([data-split-done])', root).forEach(el => {
      el.dataset.splitDone = '1';
      let wi = 0;
      const walk = node => {
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const w = document.createElement('span'); w.className = 'word';
              const inner = document.createElement('span'); inner.textContent = part; inner.style.setProperty('--wi', wi++);
              w.appendChild(inner); frag.appendChild(w);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1 && !child.classList.contains('word')) {
            // Para <em class="gold-text"> dividimos también en palabras (así el texto puede saltar de línea)
            // y cada palabra conserva el estilo dorado del elemento original
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const w = document.createElement('span'); w.className = 'word';
              const inner = document.createElement('span'); inner.style.setProperty('--wi', wi++);
              const clone = child.cloneNode(false); clone.textContent = part;
              inner.appendChild(clone); w.appendChild(inner); frag.appendChild(w);
            });
            child.replaceWith(frag);
          }
        });
      };
      walk(el);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  let io;
  function reveal(root = document) {
    splitTitles(root);
    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        });
      }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    }
    // Retraso escalonado para hermanos que aparecen a la vez
    $$('.reveal, .reveal-title, .reveal-img', root).forEach(el => {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = '1';
      const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
      const idx = sibs.indexOf(el);
      if (idx > 0 && !el.style.getPropertyValue('--rd')) el.style.setProperty('--rd', Math.min(idx, 6) * .08 + 's');
      io.observe(el);
    });
  }

  /* ---------- Contadores ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || 0, 10);
    const fmt = v => el.dataset.format === 'miles' ? Math.round(v).toLocaleString('es-ES') : v.toFixed(dec).replace('.', ',');
    if (reduced) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 2000;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  function counters() {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); }
    }), { threshold: .6 });
    $$('[data-count]').forEach(el => obs.observe(el));
  }

  /* ---------- Parallax suave (data-speed) ---------- */
  function parallax() {
    if (reduced) return;
    const els = $$('[data-speed]');
    const update = () => {
      const vh = innerHeight;
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
        el.style.translate = `0 ${off.toFixed(1)}px`;
      });
    };
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ---------- Tilt 3D y brillo que sigue al ratón ---------- */
  function tilt(selector) {
    if (!finePointer || reduced) return;
    document.addEventListener('pointermove', e => {
      const card = e.target.closest(selector);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      card.style.transform = `perspective(900px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 10}deg) translateZ(0)`;
    });
    document.addEventListener('pointerout', e => {
      const card = e.target.closest(selector);
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }

  /* ---------- Botones magnéticos ---------- */
  function magnetic() {
    if (!finePointer || reduced) return;
    document.addEventListener('pointermove', e => {
      const b = e.target.closest('.magnetic');
      $$('.magnetic.is-mag').forEach(m => { if (m !== b) { m.classList.remove('is-mag'); m.style.setProperty('--bx', '0px'); m.style.setProperty('--by', '0px'); } });
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.classList.add('is-mag');
      b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * .25).toFixed(1) + 'px');
      b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * .35).toFixed(1) + 'px');
    });
  }

  /* ---------- Cabecera, navegación activa, progreso y menú ---------- */
  function header() {
    const head = $('#siteHeader'), prog = $('#scrollProgress'), toTop = $('#toTop'), ring = $('#toTopRing');
    let lastY = scrollY;
    const onScroll = () => {
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      head.classList.toggle('is-scrolled', y > 40);
      head.classList.toggle('is-hidden', y > lastY && y > 500 && !document.body.classList.contains('menu-open'));
      lastY = y;
      const p = max > 0 ? y / max : 0;
      prog.style.transform = `scaleX(${p})`;
      toTop.classList.toggle('is-visible', y > 900);
      ring.style.strokeDashoffset = 113.1 * (1 - p);
    };
    addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
    onScroll();
    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

    // Enlace activo según la sección visible
    const links = $$('.nav-link');
    const secObs = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      links.forEach(l => l.classList.toggle('is-active', l.dataset.nav === id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-section]').forEach(s => secObs.observe(s));

    // Menú móvil
    const burger = $('#burger'), menu = $('#mobileMenu');
    $$('#mobileMenu a').forEach((a, i) => a.style.setProperty('--mi', i));
    const toggle = open => {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.setAttribute('aria-hidden', !open);
    };
    burger.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => toggle(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---------- Cinta de técnicas ---------- */
  function marquee() {
    const a = ['Manicura rusa', 'BIAB', 'Cromado champagne', 'Cat eye', 'Aura nails', 'Baby boomer', 'Encapsulados', 'Pan de oro'];
    const b = ['Acrílico', 'Polygel', 'Soft gel tips', 'Glazed donut', 'Micro french', 'Velvet nails', 'Nail art 3D', 'Pedicura spa'];
    const build = list => {
      const html = list.map(t => `<span class="marquee-item">${t}<svg class="i"><use href="#i-star"/></svg></span>`).join('');
      return html + html; // duplicado para el bucle infinito
    };
    $('#marquee1').innerHTML = build(a);
    $('#marquee2').innerHTML = build(b);
  }

  /* ---------- Toasts ---------- */
  function toast(msg, icon = 'i-check') {
    const zone = $('#toastZone');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<svg class="i"><use href="#${icon}"/></svg><span></span>`;
    t.querySelector('span').textContent = msg;
    zone.appendChild(t);
    setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 500); }, 3200);
  }

  /* ---------- Confeti dorado ---------- */
  function confetti() {
    if (reduced) return;
    const c = $('#confetti'), ctx = c.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    const colors = ['#D9B98C', '#F3E2C3', '#A8814F', '#E8B4B8', '#FFFFFF'];
    const ps = Array.from({ length: 160 }, () => ({
      x: c.width / 2 + (Math.random() - .5) * 200 * dpr, y: c.height * .55,
      vx: (Math.random() - .5) * 16 * dpr, vy: (-Math.random() * 16 - 6) * dpr,
      w: (Math.random() * 8 + 4) * dpr, h: (Math.random() * 4 + 2) * dpr,
      rot: Math.random() * 6, vr: (Math.random() - .5) * .3, col: colors[Math.floor(Math.random() * colors.length)], life: 1
    }));
    (function loop() {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = 0;
      ps.forEach(p => {
        if (p.life <= 0) return;
        alive++;
        p.vy += .45 * dpr; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .007;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (alive) requestAnimationFrame(loop); else ctx.clearRect(0, 0, c.width, c.height);
    })();
  }

  /* ---------- Rango con relleno dorado ---------- */
  function rangeFill(input) {
    const set = () => input.style.setProperty('--p', ((input.value - input.min) / (input.max - input.min)) * 100 + '%');
    input.addEventListener('input', set); set();
  }

  /* ---------- Desplazamiento suave a una sección ---------- */
  function goTo(sel) {
    const el = typeof sel === 'string' ? $(sel) : sel;
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 70;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }

  function init() {
    marquee();
    cursor();
    heroParticles();
    heroDepth();
    header();
    counters();
    parallax();
    tilt('.serv-card');
    magnetic();
    $$('input[type=range]').forEach(rangeFill);
    preloader(() => reveal());
  }

  return { init, reveal, toast, confetti, countUp, rangeFill, goTo, reduced, finePointer, $, $$ };
})();
