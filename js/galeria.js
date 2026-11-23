/* =========================================================
   LÚMINA · Galería de trabajos, visor (lightbox) y el estudio
   ========================================================= */
window.L = window.L || {};

L.galeria = (function () {
  const { $, $$ } = L.fx;
  const D = L.data;
  const esc = s => L.servicios.esc(s);
  const catName = id => (D.filtros.find(f => f[0] === id) || [, id])[1];

  /* ---------- Visor a pantalla completa (reutilizable) ---------- */
  const lb = { items: [], i: 0, render: null, lastFocus: null };
  function openLightbox(items, index, render) {
    lb.items = items; lb.i = index; lb.render = render; lb.lastFocus = document.activeElement;
    const box = $('#lightbox');
    box.hidden = false;
    document.body.classList.add('lb-open');
    requestAnimationFrame(() => box.classList.add('is-open'));
    showLightbox(false);
    $('#lbClose').focus();
  }
  function showLightbox(animate = true) {
    const it = lb.items[lb.i], img = $('#lbImg'), wrap = $('#lbImgWrap');
    wrap.classList.remove('is-zoom');
    const apply = () => {
      img.src = it.src; img.alt = it.alt;
      $('#lbCount').textContent = String(lb.i + 1).padStart(2, '0') + ' / ' + String(lb.items.length).padStart(2, '0');
      lb.render(it);
      img.classList.remove('is-swap');
    };
    if (animate) { img.classList.add('is-swap'); setTimeout(apply, 220); } else apply();
    // Precarga de la siguiente imagen
    const next = lb.items[(lb.i + 1) % lb.items.length]; if (next) new Image().src = next.src;
  }
  function closeLightbox() {
    const box = $('#lightbox');
    box.classList.remove('is-open');
    document.body.classList.remove('lb-open');
    setTimeout(() => { box.hidden = true; }, 400);
    lb.lastFocus && lb.lastFocus.focus && lb.lastFocus.focus({ preventScroll: true });
  }
  const step = d => { lb.i = (lb.i + d + lb.items.length) % lb.items.length; showLightbox(); };
  function bindLightbox() {
    $('#lbClose').addEventListener('click', closeLightbox);
    $('#lbPrev').addEventListener('click', () => step(-1));
    $('#lbNext').addEventListener('click', () => step(1));
    $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });
    $('#lbImgWrap').addEventListener('click', e => {
      const w = e.currentTarget, img = $('#lbImg'), r = img.getBoundingClientRect();
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      w.classList.toggle('is-zoom');
    });
    addEventListener('keydown', e => {
      if ($('#lightbox').hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') { // mantener el foco dentro del visor
        const f = $$('#lightbox button:not([hidden])').filter(b => b.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    // Deslizar en móvil
    let x0 = null;
    $('#lightbox').addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    $('#lightbox').addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---------- Galería de trabajos con filtros ---------- */
  let current = 'todos';
  function galeria() {
    const grid = $('#gallery'), bar = $('#galleryFilters');
    bar.innerHTML = D.filtros.map(([id, name]) => {
      const n = id === 'todos' ? D.galeria.length : D.galeria.filter(g => g.cat.includes(id)).length;
      return `<button class="filter" aria-pressed="${id === current}" data-f="${id}">${esc(name)}<sup>${n}</sup></button>`;
    }).join('');

    grid.innerHTML = D.galeria.map((g, i) => `
      <button class="g-item reveal" data-i="${i}" data-cursor="Ver" aria-label="Ver ${esc(g.t)} a pantalla completa">
        <span class="g-tag">${esc(catName(g.cat[0]))}</span>
        <img src="img/trabajos/mini/${g.img}.jpg" alt="${esc(g.t)}: ${esc(g.tec)}, forma ${esc(g.forma.toLowerCase())}" loading="lazy" decoding="async" width="${g.w}" height="${g.h}">
        <span class="g-cap"><b>${esc(g.t)}</b><span>${esc(g.tec)}</span></span>
      </button>`).join('');

    bar.addEventListener('click', e => {
      const b = e.target.closest('.filter'); if (!b) return;
      current = b.dataset.f;
      $$('.filter', bar).forEach(x => x.setAttribute('aria-pressed', x === b));
      const items = $$('.g-item', grid);
      let visible = 0;
      items.forEach(el => {
        const g = D.galeria[el.dataset.i];
        const show = current === 'todos' || g.cat.includes(current);
        if (show) visible++;
        if (show && el.hidden) {
          el.hidden = false; el.classList.add('is-out', 'is-visible');
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-out')));
        } else if (!show && !el.hidden) {
          el.classList.add('is-out');
          setTimeout(() => { if (el.classList.contains('is-out')) el.hidden = true; }, 380);
        }
      });
      $('#galleryEmpty').hidden = visible > 0;
    });

    grid.addEventListener('click', e => {
      const it = e.target.closest('.g-item'); if (!it) return;
      const list = D.galeria.filter(g => current === 'todos' || g.cat.includes(current));
      const items = list.map(g => ({ src: `img/trabajos/${g.img}.jpg`, alt: g.t, g }));
      const idx = list.indexOf(D.galeria[it.dataset.i]);
      openLightbox(items, Math.max(0, idx), ({ g }) => {
        $('#lbTitle').textContent = g.t;
        $('#lbMeta').innerHTML = `<b>Técnica:</b> ${esc(g.tec)}<br><b>Forma:</b> ${esc(g.forma)}<br><b>Artista:</b> ${esc(g.artista)}<br><b>Categorías:</b> ${g.cat.map(catName).map(esc).join(' · ')}<br><b>Precio aproximado:</b> ${g.precio} €`;
        $('#lbActions').innerHTML = `<button class="btn btn-gold btn-sm" id="lbBook"><span>Quiero este diseño</span><svg class="i"><use href="#i-arrow"/></svg></button>
          <button class="btn btn-ghost btn-sm" id="lbLike"><svg class="i"><use href="#i-heart"/></svg><span>Me encanta</span></button>`;
        $('#lbBook').onclick = () => {
          closeLightbox();
          L.reservas.prefill({ notas: `Me gustaría el diseño «${g.t}» de vuestra galería (${g.tec}, forma ${g.forma.toLowerCase()}).`, artista: g.artista.toLowerCase().replace('í', 'i') });
        };
        $('#lbLike').onclick = e2 => { e2.currentTarget.classList.toggle('btn-gold'); L.fx.toast('Guardado en tus favoritos', 'i-heart'); };
      });
    });
  }

  /* ---------- El estudio: scroll horizontal ---------- */
  function estudio() {
    const track = $('#hscrollTrack'), wrap = $('#hscroll');
    track.innerHTML = `
      <div class="panel-intro">
        <h3>Un recorrido por <em class="gold-text">Lúmina</em></h3>
        <p>Sigue bajando y te enseñamos cada rincón del atelier. Pulsa cualquier foto para verla a pantalla completa.</p>
      </div>` +
      D.local.map((l, i) => `
      <button class="panel ${l.w > l.h ? 'land' : 'port'}" data-i="${i}" data-cursor="Abrir" aria-label="${esc(l.t)}: ver a pantalla completa">
        <img src="img/local/${l.img}.jpg" alt="${esc(l.t)} del estudio Lúmina" loading="lazy" decoding="async" width="${l.w}" height="${l.h}">
        <span class="panel-cap"><small>${String(i + 1).padStart(2, '0')}</small><h3>${esc(l.t)}</h3><p>${esc(l.d)}</p></span>
      </button>`).join('');
    $('#hscrollTotal').textContent = String(D.local.length).padStart(2, '0');

    const panels = $$('.panel', track), bar = $('#hscrollBar'), now = $('#hscrollNow');
    const desktop = window.matchMedia('(min-width: 961px)');
    let maxX = 0;
    function size() {
      if (!desktop.matches) { wrap.style.height = ''; return; }
      maxX = Math.max(0, track.scrollWidth - innerWidth);
      wrap.style.height = (innerHeight + maxX) + 'px';
    }
    function update() {
      let p;
      if (desktop.matches) {
        const r = wrap.getBoundingClientRect();
        p = Math.min(1, Math.max(0, -r.top / Math.max(1, maxX)));
        track.style.transform = `translate3d(${-p * maxX}px,0,0)`;
        // parallax interno de cada foto
        panels.forEach(pn => {
          const pr = pn.getBoundingClientRect();
          const c = (pr.left + pr.width / 2 - innerWidth / 2) / innerWidth;
          pn.querySelector('img').style.setProperty('--px', (-c * 60 - pr.width * .065).toFixed(1) + 'px');
        });
      } else {
        p = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth);
      }
      bar.style.transform = `scaleX(${p})`;
      now.textContent = String(Math.min(D.local.length, Math.round(p * (D.local.length - 1)) + 1)).padStart(2, '0');
    }
    size(); update();
    addEventListener('resize', () => { size(); update(); });
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    // Re-calcular cuando cargan las imágenes (cambian los anchos)
    $$('img', track).forEach(img => img.addEventListener('load', size, { once: true }));

    track.addEventListener('click', e => {
      const pn = e.target.closest('.panel'); if (!pn) return;
      const items = D.local.map(l => ({ src: `img/local/${l.img}.jpg`, alt: l.t, l }));
      openLightbox(items, +pn.dataset.i, ({ l }) => {
        $('#lbTitle').textContent = l.t;
        $('#lbMeta').textContent = l.d;
        $('#lbActions').innerHTML = `<a class="btn btn-gold btn-sm" href="#reservas" id="lbVisit"><span>Reservar una visita</span><svg class="i"><use href="#i-arrow"/></svg></a>`;
        $('#lbVisit').onclick = () => closeLightbox();
      });
    });
  }

  function init() { bindLightbox(); galeria(); estudio(); }
  return { init, openLightbox, closeLightbox };
})();
