/* =========================================================
   LÚMINA · Probador virtual de esmaltes
   Dibuja una mano en SVG y pinta las uñas en tiempo real.
   ========================================================= */
window.L = window.L || {};

L.probador = (function () {
  const { $, $$ } = L.fx;
  const D = L.data;
  const NS = 'http://www.w3.org/2000/svg';
  const esc = s => L.servicios.esc(s);

  /* ---------- Utilidades de color ---------- */
  const hex2rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgb2hex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x.map((v, i) => v + (y[i] - v) * t)); };
  const light = (c, t) => mix(c, '#ffffff', t);
  const dark = (c, t) => mix(c, '#000000', t);
  const lum = c => { const [r, g, b] = hex2rgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

  /* ---------- Geometría de la mano (vista dorso, mano derecha) ---------- */
  const FINGERS = [
    { id: 'indice', x: 170, y: 318, a: -9, len: 176, w: 44 },
    { id: 'corazon', x: 223, y: 306, a: -1.5, len: 200, w: 46 },
    { id: 'anular', x: 275, y: 313, a: 5.5, len: 184, w: 44 },
    { id: 'menique', x: 321, y: 338, a: 13, len: 142, w: 37 },
    { id: 'pulgar', x: 152, y: 446, a: -44, len: 128, w: 50, thumb: true }
  ];

  const state = { piel: 1, forma: 'almendra', largo: .45, col: 'rojos', color: '#9E0F27', nombre: 'Rubí Lúmina', acabado: 'brillo', accent: false, ring: true };

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent && parent.appendChild(e);
    return e;
  }

  /* ---------- Construcción del SVG ---------- */
  let svg, defs;
  function build() {
    svg = $('#handSvg');
    svg.innerHTML = '';
    defs = el('defs', {}, svg);

    // Sombras, máscara de la muñeca y brillos
    defs.innerHTML = `
      <filter id="handShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".55"/></filter>
      <filter id="softBlur"><feGaussianBlur stdDeviation="1.4"/></filter>
      <filter id="bandBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter>
      <linearGradient id="wristFade" x1="0" y1="0" x2="0" y2="1"><stop offset=".72" stop-color="#fff"/><stop offset=".97" stop-color="#000"/></linearGradient>
      <mask id="wristMask" maskUnits="userSpaceOnUse" x="0" y="0" width="460" height="600"><rect width="460" height="600" fill="url(#wristFade)"/></mask>
      <linearGradient id="nShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".22" stop-color="#000" stop-opacity="0"/>
        <stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/>
      </linearGradient>
      <linearGradient id="nShadeV" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".25" stop-color="#000" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="hiGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/>
      </linearGradient>
      <linearGradient id="sweepGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="goldRing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFF3D6"/><stop offset=".45" stop-color="#D9B98C"/><stop offset=".55" stop-color="#A8814F"/><stop offset="1" stop-color="#E9CFA4"/>
      </linearGradient>
      <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFB3E6" stop-opacity=".75"/><stop offset=".35" stop-color="#9AD8FF" stop-opacity=".55"/>
        <stop offset=".65" stop-color="#C9A8FF" stop-opacity=".65"/><stop offset="1" stop-color="#A8FFE4" stop-opacity=".6"/>
      </linearGradient>
      <pattern id="glitter" patternUnits="userSpaceOnUse" width="14" height="14">${glitterDots(14, 16)}</pattern>
      <pattern id="glitter2" patternUnits="userSpaceOnUse" width="9" height="9">${glitterDots(9, 9)}</pattern>`;

    // Degradados dinámicos (dependen del color elegido)
    ['m', 'a'].forEach(s => {
      defs.insertAdjacentHTML('beforeend', `
        <linearGradient id="${s}Chrome" x1="0" y1="0" x2="1" y2="1"><stop id="${s}c0" offset="0"/><stop id="${s}c1" offset=".28"/><stop id="${s}c2" offset=".5"/><stop id="${s}c3" offset=".72"/><stop id="${s}c4" offset="1"/></linearGradient>
        <linearGradient id="${s}Boomer" x1="0" y1="1" x2="0" y2="0"><stop id="${s}b0" offset=".05"/><stop id="${s}b1" offset=".75"/></linearGradient>
        <linearGradient id="${s}Cat" x1="0" y1="1" x2="1" y2="0"><stop id="${s}k0" offset=".25" stop-opacity="0"/><stop id="${s}k1" offset=".5" stop-opacity=".95"/><stop id="${s}k2" offset=".75" stop-opacity="0"/></linearGradient>`);
    });
    const skinG = el('linearGradient', { id: 'skinX', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    el('stop', { id: 'sk0', offset: 0 }, skinG); el('stop', { id: 'sk1', offset: .45 }, skinG); el('stop', { id: 'sk2', offset: 1 }, skinG);
    const skinR = el('radialGradient', { id: 'skinPalm', cx: .45, cy: .35, r: .75 }, defs);
    el('stop', { id: 'sp0', offset: 0 }, skinR); el('stop', { id: 'sp1', offset: 1 }, skinR);

    // Brillo ambiental detrás de la mano
    el('ellipse', { cx: 240, cy: 330, rx: 210, ry: 240, fill: 'rgba(217,185,140,.07)' }, svg);
    const hand = el('g', { filter: 'url(#handShadow)', mask: 'url(#wristMask)', id: 'hand' }, svg);

    // Dedos (salvo el pulgar), palma y pulgar encima
    const order = [0, 1, 2, 3];
    order.forEach(i => fingerGroup(hand, FINGERS[i], i));
    el('path', { id: 'palm', fill: 'url(#skinPalm)', d: 'M176,600 C171,548 136,508 127,460 C118,412 127,352 152,318 Q222,288 300,308 C333,318 351,345 348,384 C345,432 334,480 325,520 C318,556 314,582 314,600 Z' }, hand);
    // Relieves de nudillos y tendones
    const kn = el('g', { opacity: .55 }, hand);
    [[178, 326], [228, 314], [278, 320], [322, 344]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y + 4, rx: 15, ry: 8, fill: 'url(#skinKnuckle)' }, kn));
    defs.insertAdjacentHTML('beforeend', '<radialGradient id="skinKnuckle"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>');
    [[178, 340, 196, 470], [228, 330, 230, 480], [278, 336, 262, 480]].forEach(([x1, y1, x2, y2]) =>
      el('path', { d: `M${x1},${y1} Q${(x1 + x2) / 2 + 4},${(y1 + y2) / 2} ${x2},${y2}`, style: 'stroke:var(--crease)', 'stroke-width': 5, fill: 'none', opacity: .08, 'stroke-linecap': 'round' }, kn));
    fingerGroup(hand, FINGERS[4], 4);
  }

  function glitterDots(size, n) {
    let s = '', seed = size * 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const cols = ['#FFFFFF', '#F3E2C3', '#D9B98C', '#E8E8F0', '#FFD9E8'];
    for (let i = 0; i < n; i++) s += `<circle cx="${(rnd() * size).toFixed(2)}" cy="${(rnd() * size).toFixed(2)}" r="${(rnd() * .9 + .35).toFixed(2)}" fill="${cols[Math.floor(rnd() * cols.length)]}" opacity="${(rnd() * .5 + .5).toFixed(2)}"/>`;
    return s;
  }

  // Un dedo con su uña
  function fingerGroup(parent, f, i) {
    const g = el('g', { transform: `translate(${f.x},${f.y}) rotate(${f.a})`, class: 'finger', 'data-i': i }, parent);
    // Dedo afinado hacia la punta (más elegante que un rectángulo)
    const r0 = f.w / 2, r1 = f.w * (f.thumb ? .46 : .43), yb = f.thumb ? 70 : 46;
    el('path', { d: `M${-r0},${yb} L${-r1},${-f.len + r1} C${-r1},${-f.len - r1 * .32} ${r1},${-f.len - r1 * .32} ${r1},${-f.len + r1} L${r0},${yb} Z`, fill: 'url(#skinX)', style: 'stroke:var(--crease)', 'stroke-opacity': .35, 'stroke-width': 1 }, g);
    // Pliegues de las articulaciones
    const cr = el('g', { style: 'stroke:var(--crease)', fill: 'none', 'stroke-linecap': 'round', opacity: .45 }, g);
    if (!f.thumb) {
      const y1 = -f.len * .5;
      el('path', { d: `M${-f.w * .26},${y1} Q0,${y1 + 5} ${f.w * .26},${y1}` , 'stroke-width': 1.3 }, cr);
      el('path', { d: `M${-f.w * .18},${y1 + 7} Q0,${y1 + 11} ${f.w * .18},${y1 + 7}`, 'stroke-width': 1 }, cr);
      el('path', { d: `M${-f.w * .2},${-f.len * .76} Q0,${-f.len * .76 + 4} ${f.w * .2},${-f.len * .76}`, 'stroke-width': 1 }, cr);
    } else {
      el('path', { d: `M${-f.w * .24},${-f.len * .45} Q0,${-f.len * .45 + 6} ${f.w * .24},${-f.len * .45}`, 'stroke-width': 1.3 }, cr);
    }
    if (i === 2) { // anillo en el anular
      const ring = el('g', { id: 'ringJewel' }, g);
      el('rect', { x: -f.w / 2 - 1.5, y: -f.len * .2, width: f.w + 3, height: 9, rx: 4.5, fill: 'url(#goldRing)' }, ring);
      el('circle', { cx: 0, cy: -f.len * .2 + 1, r: 5.5, fill: '#F8FBFF', stroke: '#D9B98C', 'stroke-width': 1.4 }, ring);
      el('circle', { cx: -1.6, cy: -f.len * .2 - .6, r: 1.6, fill: '#fff' }, ring);
    }
    el('g', { class: 'nail', id: 'nail' + i }, g);
  }

  /* ---------- Pintar las uñas ---------- */
  function setStops(s, color, finish) {
    const set = (id, c, op) => { const st = $('#' + id); st.setAttribute('stop-color', c); if (op !== undefined) st.setAttribute('stop-opacity', op); };
    // Cromado: bandas metálicas
    set(s + 'c0', dark(color, .45)); set(s + 'c1', light(color, .75)); set(s + 'c2', color); set(s + 'c3', dark(color, .5)); set(s + 'c4', light(color, .55));
    // Baby boomer: de nude a color
    set(s + 'b0', '#F0C9C2'); set(s + 'b1', color);
    // Ojo de gato: haz de luz
    const beam = lum(color) < .25 ? light(color, .7) : light(color, .55);
    set(s + 'k0', beam, 0); set(s + 'k1', beam, .95); set(s + 'k2', beam, 0);
  }

  function paintNail(i, finish, color, set) {
    const f = FINGERS[i];
    const g = $('#nail' + i);
    g.innerHTML = '';
    const nw = f.w * (f.thumb ? .74 : .72);
    const yc = -f.len + f.w * (f.thumb ? 1.1 : 1.04);
    const ext = nw * (L.nail.minLen[state.forma] + state.largo * 1.55);
    const yT = -f.len + f.w * .06 - ext;
    const d = L.nail.path(state.forma, nw, yc, yT);
    const clipId = 'nc' + i;
    const cp = el('clipPath', { id: clipId }, g);
    el('path', { d }, cp);

    let base = color;
    if (finish === 'cromado') base = `url(#${set}Chrome)`;
    if (finish === 'babyboomer') base = `url(#${set}Boomer)`;
    if (finish === 'cateye') base = dark(color, .35);
    if (finish === 'francesa') base = '#F2CFC9';
    if (finish === 'mate') base = mix(color, '#808080', .08);
    el('path', { d, fill: base, class: 'nail-fill' }, g);

    const inner = el('g', { 'clip-path': `url(#${clipId})` }, g);
    const box = { x: -nw, y: yT - 10, w: nw * 2, h: yc - yT + 20 };
    if (finish === 'francesa') {
      const yS = yT + Math.max(nw * .55, (-f.len + f.w * .2 - yT) * .85 + nw * .2);
      el('path', { d: L.nail.smile(nw, yS, nw * .22, yT - 20), fill: lum(color) > .85 ? '#FBF8F4' : color }, inner);
    }
    if (finish === 'cateye') el('rect', { x: box.x, y: box.y, width: box.w, height: box.h, fill: `url(#${set}Cat)`, filter: 'url(#bandBlur)' }, inner);
    if (finish === 'glitter' || set === 'a') {
      el('rect', { x: box.x, y: box.y, width: box.w, height: box.h, fill: 'url(#glitter)', opacity: set === 'a' ? 1 : .85 }, inner);
      if (set === 'a') el('rect', { x: box.x, y: box.y, width: box.w, height: box.h, fill: 'url(#glitter2)' }, inner);
    }
    if (finish === 'aurora') el('rect', { x: box.x, y: box.y, width: box.w, height: box.h, fill: 'url(#aurora)', opacity: .5, style: 'mix-blend-mode:screen' }, inner);
    // Brillo animado al cambiar
    el('rect', { x: box.x, y: yc, width: box.w, height: nw * .9, fill: 'url(#sweepGrad)', opacity: .7, class: 'sweep', transform: 'skewY(-25)' }, inner);

    // Volumen: sombra lateral y en la cutícula
    el('path', { d, fill: 'url(#nShade)', opacity: finish === 'mate' ? .7 : 1 }, g);
    el('path', { d, fill: 'url(#nShadeV)' }, g);
    // Reflejos (no en mate)
    if (finish !== 'mate') {
      const hx = -nw * .2;
      el('path', { d: `M${hx},${yc - nw * .35} Q${hx - nw * .05},${(yc + yT) / 2} ${hx + nw * .02},${yT + nw * .55}`, stroke: 'url(#hiGrad)', 'stroke-width': nw * (finish === 'cromado' ? .2 : .13), 'stroke-linecap': 'round', fill: 'none', filter: 'url(#softBlur)', opacity: finish === 'cromado' ? .95 : .75 }, g);
      el('ellipse', { cx: nw * .22, cy: yc - nw * .45, rx: nw * .05, ry: nw * .12, fill: '#fff', opacity: .35, filter: 'url(#softBlur)' }, g);
    }
    el('path', { d, fill: 'none', stroke: dark(state.color, .5), 'stroke-opacity': .25, 'stroke-width': .8 }, g);
  }

  function paint(animate = true) {
    const skin = D.pieles[state.piel];
    svg.style.setProperty('--crease', skin[2]);
    $('#sk0').setAttribute('stop-color', skin[2]);
    $('#sk1').setAttribute('stop-color', skin[1]);
    $('#sk2').setAttribute('stop-color', dark(skin[2], .06));
    $('#sp0').setAttribute('stop-color', skin[1]);
    $('#sp1').setAttribute('stop-color', skin[2]);
    setStops('m', state.color, state.acabado);
    setStops('a', state.color, 'glitter');
    FINGERS.forEach((f, i) => {
      const accent = state.accent && i === 2;
      paintNail(i, accent ? 'glitter' : state.acabado, state.color, accent ? 'a' : 'm');
    });
    $('#ringJewel').style.display = state.ring ? '' : 'none';
    if (animate && !L.fx.reduced) {
      $$('.sweep', svg).forEach((r, i) => r.animate([{ transform: 'skewY(-25deg) translateY(40px)' }, { transform: 'skewY(-25deg) translateY(-240px)' }], { duration: 900, delay: i * 60, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }));
    }
    updateTag();
  }

  /* ---------- Etiqueta con precio estimado ---------- */
  function estimate() {
    const largo = state.largo, sharp = ['stiletto', 'bailarina', 'lipstick'].includes(state.forma);
    let baseId = 'esm-rusa-semi';
    if (largo > .62 || (sharp && largo > .3)) baseId = 'ext-gel';
    else if (largo > .35) baseId = 'esm-biab';
    const fin = D.acabados.find(a => a.id === state.acabado);
    const total = L.data.servicioPorId(baseId).precio + fin.extra + (state.accent ? 6 : 0);
    return { baseId, total, fin };
  }
  const lengthLabel = v => v < .2 ? 'Corto' : v < .45 ? 'Medio' : v < .7 ? 'Largo' : 'Extra largo';
  function updateTag() {
    const { baseId, total, fin } = estimate();
    const forma = D.formas.find(f => f.id === state.forma).nombre;
    $('#tagSwatch').style.background = state.acabado === 'cromado'
      ? `linear-gradient(135deg, ${dark(state.color, .4)}, ${light(state.color, .7)}, ${state.color}, ${dark(state.color, .45)})`
      : state.color;
    $('#tagName').textContent = state.nombre;
    $('#tagMeta').textContent = `${fin.nombre} · ${forma} · ${L.data.servicioPorId(baseId).nombre}`;
    $('#tagPrice').textContent = total + ' €';
    $('#tryLengthLabel').textContent = lengthLabel(state.largo);
  }

  /* ---------- Controles ---------- */
  function radioRow(container, items, isOn, onPick, cls = 'pill', extra = () => '') {
    container.innerHTML = items.map(it => `<button class="${cls}" role="radio" aria-checked="${isOn(it)}" data-id="${it.id}" ${extra(it)}>${it.nombre ? esc(it.nombre) : ''}</button>`).join('');
    container.onclick = e => {
      const b = e.target.closest('[data-id]'); if (!b) return;
      $$('[data-id]', container).forEach(x => x.setAttribute('aria-checked', x === b));
      onPick(b.dataset.id);
    };
  }

  function renderSwatches() {
    const col = D.colecciones.find(c => c.id === state.col);
    const box = $('#trySwatches');
    box.innerHTML = col.colores.map(([n, h], i) =>
      `<button class="swatch" role="radio" aria-checked="${h.toLowerCase() === state.color.toLowerCase()}" aria-label="${esc(n)}" title="${esc(n)}" data-hex="${h}" data-name="${esc(n)}" style="background:${h};--ci:${i}"></button>`).join('');
  }

  function controls() {
    $('#skinRow').innerHTML = D.pieles.map((p, i) =>
      `<button class="skin" role="radio" aria-checked="${i === state.piel}" aria-label="Piel ${esc(p[0])}" title="${esc(p[0])}" data-i="${i}" style="background:linear-gradient(135deg, ${p[1]}, ${p[2]})"></button>`).join('');
    $('#skinRow').onclick = e => {
      const b = e.target.closest('.skin'); if (!b) return;
      state.piel = +b.dataset.i;
      $$('.skin').forEach(x => x.setAttribute('aria-checked', x === b));
      paint(false);
    };
    radioRow($('#tryShape'), D.formas, f => f.id === state.forma, id => { state.forma = id; paint(); });
    radioRow($('#tryFinish'), D.acabados, a => a.id === state.acabado, id => { state.acabado = id; paint(); });
    $('#tryCollections').innerHTML = D.colecciones.map(c => `<button class="pill" role="tab" aria-selected="${c.id === state.col}" data-id="${c.id}">${esc(c.nombre)}</button>`).join('');
    $('#tryCollections').onclick = e => {
      const b = e.target.closest('[data-id]'); if (!b) return;
      state.col = b.dataset.id;
      $$('[data-id]', $('#tryCollections')).forEach(x => x.setAttribute('aria-selected', x === b));
      renderSwatches();
    };
    renderSwatches();
    $('#trySwatches').onclick = e => {
      const b = e.target.closest('.swatch'); if (!b) return;
      state.color = b.dataset.hex; state.nombre = b.dataset.name;
      $$('.swatch').forEach(x => x.setAttribute('aria-checked', x === b));
      paint();
    };
    const len = $('#tryLength');
    len.addEventListener('input', () => { state.largo = len.value / 100; paint(false); });
    $('#tryAccent').addEventListener('change', e => { state.accent = e.target.checked; paint(); });
    $('#tryRing').addEventListener('change', e => { state.ring = e.target.checked; paint(false); });
    $('#tryRandom').addEventListener('click', random);
    $('#trySave').addEventListener('click', save);
    $('#tryBook').addEventListener('click', book);
  }

  function syncControls() {
    $$('#tryShape [data-id]').forEach(x => x.setAttribute('aria-checked', x.dataset.id === state.forma));
    $$('#tryFinish [data-id]').forEach(x => x.setAttribute('aria-checked', x.dataset.id === state.acabado));
    $$('#tryCollections [data-id]').forEach(x => x.setAttribute('aria-selected', x.dataset.id === state.col));
    $$('.skin').forEach((x, i) => x.setAttribute('aria-checked', i === state.piel));
    renderSwatches();
    const len = $('#tryLength'); len.value = Math.round(state.largo * 100); len.dispatchEvent(new Event('input'));
    $('#tryAccent').checked = state.accent;
  }

  /* ---------- Acciones ---------- */
  function random() {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const col = pick(D.colecciones), c = pick(col.colores);
    Object.assign(state, { col: col.id, color: c[1], nombre: c[0], acabado: pick(D.acabados).id, forma: pick(D.formas).id, largo: Math.round(Math.random() * 80 + 10) / 100, accent: Math.random() < .3 });
    syncControls(); paint();
  }

  // Aplica un look desde fuera (por ejemplo, el resultado del quiz)
  function apply(look) {
    const col = D.colecciones.find(c => c.colores.some(x => x[1].toLowerCase() === look.color.toLowerCase()));
    Object.assign(state, { color: look.color, nombre: look.nombre, acabado: look.acabado, forma: look.forma, largo: look.largo, accent: false, col: col ? col.id : state.col });
    syncControls(); paint();
  }

  const KEY = 'lumina-looks';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const store = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* almacenamiento no disponible */ } };
  function save() {
    const list = load();
    const look = { color: state.color, nombre: state.nombre, acabado: state.acabado, forma: state.forma, largo: state.largo, accent: state.accent, piel: state.piel };
    if (list.some(l => l.color === look.color && l.acabado === look.acabado && l.forma === look.forma)) { L.fx.toast('Ese look ya está guardado', 'i-heart'); return; }
    list.unshift(look); store(list.slice(0, 8)); renderSaved();
    L.fx.toast('Look guardado en tu colección', 'i-heart');
  }
  function renderSaved() {
    const list = load();
    $('#savedLooks').hidden = !list.length;
    $('#savedRow').innerHTML = list.map((l, i) => {
      const fin = D.acabados.find(a => a.id === l.acabado), fo = D.formas.find(f => f.id === l.forma);
      return `<div class="saved-look"><button data-load="${i}" style="display:flex;align-items:center;gap:10px"><i style="background:${l.color}"></i>${esc(l.nombre)} · ${esc(fin.nombre)} · ${esc(fo.nombre)}</button><button class="del" data-del="${i}" aria-label="Borrar look">×</button></div>`;
    }).join('');
  }
  function bindSaved() {
    $('#savedRow').addEventListener('click', e => {
      const ld = e.target.closest('[data-load]'), del = e.target.closest('[data-del]');
      const list = load();
      if (ld) { const l = list[+ld.dataset.load]; Object.assign(state, l); const col = D.colecciones.find(c => c.colores.some(x => x[1] === l.color)); if (col) state.col = col.id; syncControls(); paint(); }
      if (del) { list.splice(+del.dataset.del, 1); store(list); renderSaved(); }
    });
  }

  function book() {
    const { baseId, fin } = estimate();
    const map = { cromado: 'art-cromo', aurora: 'art-cromo', cateye: 'art-cateye', francesa: 'art-french', babyboomer: 'art-babyboomer' };
    const ids = [baseId]; if (map[state.acabado]) ids.push(map[state.acabado]);
    const forma = D.formas.find(f => f.id === state.forma).nombre.toLowerCase();
    L.reservas.prefill({
      servicios: ids,
      notas: `Look del probador virtual: color ${state.nombre} (${state.color}), acabado ${fin.nombre.toLowerCase()}, forma ${forma}, largo ${lengthLabel(state.largo).toLowerCase()}${state.accent ? ', con uña de acento en glitter' : ''}.`
    });
  }

  function init() {
    build(); controls(); renderSaved(); bindSaved(); paint(false);
    // Pequeño "saludo" al entrar en pantalla
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { paint(); io.disconnect(); } }, { threshold: .4 });
    io.observe($('#tryonStage'));
  }

  return { init, apply };
})();
