/* =========================================================
   LÚMINA · Servicios, formas, diccionario y carta de precios
   ========================================================= */
window.L = window.L || {};

L.servicios = (function () {
  const { $, $$ } = L.fx;
  const D = L.data;
  const euro = n => n.toLocaleString('es-ES') + ' €';
  const dur = m => m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ' ' + (m % 60) + ' min' : ''}` : `${m} min`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Pestañas accesibles reutilizables */
  function tabs(container, items, onSelect, withIcons) {
    container.innerHTML = items.map((c, i) =>
      `<button class="tab" role="tab" id="${container.id}-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${c.id}">
        ${withIcons ? `<svg class="i"><use href="#i-${c.icono}"/></svg>` : ''}${esc(c.nombre)}</button>`).join('');
    const btns = $$('.tab', container);
    const select = (btn, focus) => {
      btns.forEach(b => { const on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      if (focus) btn.focus();
      onSelect(btn.dataset.id);
    };
    container.addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) select(b); });
    container.addEventListener('keydown', e => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowRight') select(btns[(i + 1) % btns.length], true);
      if (e.key === 'ArrowLeft') select(btns[(i - 1 + btns.length) % btns.length], true);
    });
    onSelect(items[0].id);
  }

  /* ---------- Tarjetas de servicios ---------- */
  function renderServicios(catId) {
    const cat = D.categorias.find(c => c.id === catId);
    $('#servPanel').setAttribute('aria-labelledby', 'servTabs-' + catId);
    $('#servPanel').innerHTML = `
      <div class="serv-intro"><p>${esc(cat.intro)}</p><span class="count">${cat.servicios.length} servicios</span></div>
      <div class="serv-grid">
        ${cat.servicios.map((s, i) => `
          <article class="serv-card" style="--ci:${i}">
            ${s.top ? '<span class="top">Favorito</span>' : ''}
            <h4>${esc(s.nombre)}</h4>
            <p>${esc(s.desc)}</p>
            <div class="serv-meta">
              <span>${s.min ? `<svg class="i"><use href="#i-clock"/></svg> ${dur(s.min)}` : 'Consulta condiciones'}</span>
              <span><small>${s.extra ? '+' : 'desde'}</small><b>${euro(s.precio)}</b>${s.porUna ? '<small> /uña</small>' : ''}</span>
            </div>
            <a href="#reservas" class="book-link" data-book="${s.id}">Reservar <svg class="i"><use href="#i-arrow"/></svg></a>
          </article>`).join('')}
      </div>`;
  }

  /* ---------- Carta de precios ---------- */
  function renderPrecios(catId) {
    const cat = D.categorias.find(c => c.id === catId);
    $('#priceBoard').innerHTML = cat.servicios.map((s, i) => `
      <div class="price-item${s.top ? ' is-top' : ''}" style="--ci:${i}">
        <h4>${esc(s.nombre)}</h4><span class="dots"></span>
        <span class="price">${s.extra ? '<small>+</small>' : ''}${euro(s.precio)}${s.porUna ? '<small> /uña</small>' : ''}</span>
        <p><span>${esc(s.desc)}</span>${s.min ? `<span><svg class="i"><use href="#i-clock"/></svg>${dur(s.min)}</span>` : '<span></span>'}</p>
      </div>`).join('');
  }

  /* ---------- Explorador de formas ---------- */
  function formas() {
    const wrap = $('#shapeButtons'), svg = $('#shapeSvg'), range = $('#shapeLength');
    let current = 'almendra';
    // Miniaturas de cada forma
    wrap.innerHTML = D.formas.map(f => {
      const d = L.nail.path(f.id, 50, 92, 92 - 50 * 0.95 - 50 * (L.nail.minLen[f.id] + .45));
      return `<button class="shape-btn" role="radio" aria-checked="${f.id === current}" data-shape="${f.id}">
        <svg viewBox="-30 -4 60 100" aria-hidden="true"><path d="${d}"/></svg>${f.nombre}</button>`;
    }).join('');

    svg.innerHTML = `
      <defs>
        <linearGradient id="shapeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F3E2C3"/><stop offset=".45" stop-color="#D9B98C"/><stop offset="1" stop-color="#8C6A3F"/>
        </linearGradient>
        <linearGradient id="shapeSkin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#B9835F"/><stop offset=".5" stop-color="#E3B693"/><stop offset="1" stop-color="#B9835F"/>
        </linearGradient>
        <linearGradient id="shapeShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <filter id="shapeGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
      <ellipse cx="0" cy="150" rx="110" ry="150" fill="rgba(217,185,140,.12)" filter="url(#shapeGlow)"/>
      <rect x="-62" y="120" width="124" height="260" rx="62" fill="url(#shapeSkin)"/>
      <path id="shapeNail" fill="url(#shapeGrad)" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/>
      <path id="shapeShineP" fill="none" stroke="url(#shapeShine)" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;

    function draw() {
      const w = 96, yc = 270, len = range.value / 100;
      const yT = yc - w * 0.95 - w * (L.nail.minLen[current] + len * 1.5);
      $('#shapeNail').setAttribute('d', L.nail.path(current, w, yc, yT));
      $('#shapeShineP').setAttribute('d', `M-22,${yc - 30} L-16,${yT + w * .55}`);
      const f = D.formas.find(x => x.id === current);
      $('#shapeName').textContent = f.nombre;
      $('#shapeDesc').textContent = f.desc;
      $('#shapeIdeal').textContent = f.ideal;
    }
    wrap.addEventListener('click', e => {
      const b = e.target.closest('.shape-btn'); if (!b) return;
      current = b.dataset.shape;
      $$('.shape-btn', wrap).forEach(x => x.setAttribute('aria-checked', x === b));
      const stage = $('#shapeStage');
      stage.animate([{ transform: 'scale(.98)', opacity: .6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  /* ---------- Diccionario con buscador ---------- */
  function diccionario() {
    const grid = $('#glossaryGrid'), input = $('#glossarySearch'), count = $('#glossaryCount');
    const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const mark = (text, q) => {
      if (!q) return esc(text);
      const i = norm(text).indexOf(q);
      if (i < 0) return esc(text);
      return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
    };
    function render() {
      const q = norm(input.value.trim());
      const list = D.tecnicas.filter(([t, d]) => !q || norm(t).includes(q) || norm(d).includes(q));
      count.textContent = `${list.length} de ${D.tecnicas.length}`;
      grid.innerHTML = list.length
        ? list.map(([t, d], i) => `<div class="term" style="animation-delay:${Math.min(i, 12) * 25}ms"><b>${mark(t, q)}</b><p>${mark(d, q)}</p></div>`).join('')
        : '<div class="glossary-empty">No encontramos esa técnica… ¡pero seguro que sabemos hacerla! Pregúntanos.</div>';
    }
    input.addEventListener('input', render);
    render();
  }

  function init() {
    tabs($('#servTabs'), D.categorias, renderServicios, true);
    tabs($('#priceTabs'), D.categorias, renderPrecios, false);
    formas();
    diccionario();
    // "Reservar" desde cualquier tarjeta de servicio
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-book]');
      if (!a) return;
      e.preventDefault();
      L.reservas.prefill({ servicios: [a.dataset.book] });
    });
  }

  return { init, euro, dur, esc };
})();
