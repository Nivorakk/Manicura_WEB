/* =========================================================
   LÚMINA · Calculadora de presupuesto
   ========================================================= */
window.L = window.L || {};

L.calculadora = (function () {
  const { $, $$ } = L.fx;
  const S = id => L.data.servicioPorId(id);
  const esc = s => L.servicios.esc(s);

  const BASES = ['man-clasica', 'man-rusa', 'esm-semi', 'esm-rusa-semi', 'esm-biab', 'esm-rubber', 'ext-gel', 'ext-acrilico', 'ext-polygel', 'ext-softgel', 'man-ritual', 'ped-semi'];
  const FINISHES = ['art-french', 'art-babyboomer', 'art-cromo', 'art-cateye', 'art-aura', 'art-pandeoro'];
  const ART = ['art-sencillo', 'art-manoalzada', 'art-3d', 'art-cristales'];
  const EXTRAS = ['ext-retirada', 'tra-parafina', 'tra-masaje', 'tra-peeling', 'ped-express'];

  const state = { base: 'esm-rusa-semi', finishes: new Set(), art: 'art-sencillo', nails: 0, extras: new Set(), club: false };
  let shownTotal = 0, ticketNum = 1;

  function render() {
    $('#calcBase').innerHTML = BASES.map(id => {
      const s = S(id);
      return `<button class="option" role="radio" aria-checked="${state.base === id}" data-id="${id}">
        <b>${esc(s.nombre)}</b><span>${L.servicios.dur(s.min)}</span><strong>${s.precio} €</strong></button>`;
    }).join('');
    const chips = (ids, set) => ids.map(id => {
      const s = S(id);
      return `<button class="chip" aria-pressed="${set.has(id)}" data-id="${id}">${esc(s.nombre.replace(' (por uña)', ''))} <em>+${s.precio} €${s.porUna ? '/uña' : ''}</em></button>`;
    }).join('');
    $('#calcFinish').innerHTML = chips(FINISHES, state.finishes);
    $('#calcExtras').innerHTML = chips(EXTRAS, state.extras);
    $('#calcArtType').innerHTML = ART.map(id => {
      const s = S(id);
      return `<button class="chip" role="radio" aria-checked="${state.art === id}" data-id="${id}">${esc(s.nombre.replace(' (por uña)', ''))} <em>${s.precio} €/uña</em></button>`;
    }).join('');
    $('#calcNailDots').innerHTML = Array.from({ length: 10 }, (_, i) =>
      `<button class="nail-dot${i < state.nails ? ' is-on' : ''}" data-n="${i + 1}" aria-label="${i + 1} ${i ? 'uñas' : 'uña'}"></button>`).join('');
  }

  function lines() {
    const out = [];
    const b = S(state.base);
    out.push({ t: b.nombre, p: b.precio, m: b.min });
    state.finishes.forEach(id => { const s = S(id); out.push({ t: s.nombre, p: s.precio, m: s.min }); });
    if (state.nails > 0) {
      const a = S(state.art);
      out.push({ t: `${a.nombre.replace(' (por uña)', '')} × ${state.nails}`, p: a.precio * state.nails, m: a.min * state.nails });
    }
    state.extras.forEach(id => { const s = S(id); out.push({ t: s.nombre, p: s.precio, m: s.min }); });
    return out;
  }

  function update() {
    const ls = lines();
    let total = ls.reduce((a, l) => a + l.p, 0);
    const mins = ls.reduce((a, l) => a + l.m, 0);
    let html = ls.map(l => `<li><span>${esc(l.t)}</span><span>${l.p} €</span></li>`).join('');
    if (state.club) {
      const d = Math.round(total * .1 * 100) / 100;
      html += `<li class="discount"><span>Club Lúmina −10 %</span><span>−${d.toLocaleString('es-ES', { minimumFractionDigits: Number.isInteger(d) ? 0 : 2 })} €</span></li>`;
      total -= d;
    }
    $('#ticketLines').innerHTML = html;
    $('#ticketTime').textContent = L.servicios.dur(mins);
    $('#calcNailCount').textContent = state.nails;
    animateTotal(total);
  }

  function animateTotal(to) {
    const el = $('#ticketTotal'), from = shownTotal, t0 = performance.now();
    shownTotal = to;
    const fmt = v => { const r = Math.round(v * 100) / 100; return r.toLocaleString('es-ES', Number.isInteger(to) ? { maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    if (L.fx.reduced) { el.textContent = fmt(to); return; }
    (function tick(now) {
      const p = Math.min(1, (now - t0) / 600), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    el.parentElement.animate([{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 400 });
  }

  function bind() {
    $('#calcBase').addEventListener('click', e => {
      const b = e.target.closest('.option'); if (!b) return;
      state.base = b.dataset.id;
      $$('.option', $('#calcBase')).forEach(x => x.setAttribute('aria-checked', x === b));
      update();
    });
    const toggle = (box, set) => box.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      const id = b.dataset.id;
      set.has(id) ? set.delete(id) : set.add(id);
      b.setAttribute('aria-pressed', set.has(id));
      update();
    });
    toggle($('#calcFinish'), state.finishes);
    toggle($('#calcExtras'), state.extras);
    $('#calcArtType').addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      state.art = b.dataset.id;
      $$('.chip', $('#calcArtType')).forEach(x => x.setAttribute('aria-checked', x === b));
      if (!state.nails) state.nails = 2;
      $$('.nail-dot').forEach((d, i) => d.classList.toggle('is-on', i < state.nails));
      update();
    });
    $('#calcNailDots').addEventListener('click', e => {
      const d = e.target.closest('.nail-dot'); if (!d) return;
      const n = +d.dataset.n;
      state.nails = state.nails === n ? n - 1 : n;
      $$('.nail-dot').forEach((x, i) => x.classList.toggle('is-on', i < state.nails));
      update();
    });
    $('#calcClub').addEventListener('change', e => { state.club = e.target.checked; update(); });
    $('#calcBook').addEventListener('click', () => {
      const ids = [state.base, ...state.finishes, ...state.extras];
      const art = state.nails ? `${S(state.art).nombre.replace(' (por uña)', '')} en ${state.nails} ${state.nails > 1 ? 'uñas' : 'uña'}` : '';
      L.reservas.prefill({ servicios: ids, notas: art ? `Presupuesto de la calculadora. Diseño: ${art}.` : 'Presupuesto de la calculadora.', extraArt: state.nails ? { id: state.art, n: state.nails } : null });
      ticketNum++;
      $('#ticketNum').textContent = String(ticketNum).padStart(4, '0');
    });
  }

  function init() { render(); bind(); update(); }
  return { init };
})();
