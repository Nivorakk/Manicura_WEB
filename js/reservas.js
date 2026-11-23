/* =========================================================
   LÚMINA · Reserva online en 4 pasos
   Servicio → Artista → Día y hora → Datos → Confirmación
   (La disponibilidad es simulada: es una web de demostración.)
   ========================================================= */
window.L = window.L || {};

L.reservas = (function () {
  const { $, $$ } = L.fx;
  const D = L.data;
  const S = id => D.servicioPorId(id);
  const esc = s => L.servicios.esc(s);
  const dur = m => L.servicios.dur(m);

  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  // Festivos (día-mes) en Madrid
  const FESTIVOS = ['1-1', '6-1', '1-5', '2-5', '15-5', '15-8', '12-10', '1-11', '9-11', '6-12', '8-12', '25-12'];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const state = { step: 1, cat: 'manicura', services: new Set(), art: null, artist: 'any', date: null, time: null, view: new Date(today.getFullYear(), today.getMonth(), 1) };

  /* ---------- Cálculos ---------- */
  function totals() {
    let price = 0, mins = 0;
    state.services.forEach(id => { const s = S(id); price += s.precio; mins += s.min; });
    if (state.art) { const a = S(state.art.id); price += a.precio * state.art.n; mins += a.min * state.art.n; }
    return { price, mins: Math.max(mins, 30) };
  }
  const key = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const isClosed = d => d.getDay() === 0 || FESTIVOS.includes(`${d.getDate()}-${d.getMonth() + 1}`);
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function slotsFor(d) {
    if (isClosed(d)) return [];
    const close = d.getDay() === 6 ? 15 * 60 : 21 * 60;
    const { mins } = totals();
    const out = [];
    const now = new Date();
    for (let t = 10 * 60; t + Math.min(mins, 120) <= close; t += 30) {
      const label = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      // Ocupación simulada pero estable para cada día y artista
      const busy = (hash(key(d) + label + state.artist) % 100) < (state.artist === 'any' ? 28 : 45);
      const past = d.getTime() === today.getTime() && t <= now.getHours() * 60 + now.getMinutes() + 30;
      out.push({ label, t, free: !busy && !past });
    }
    return out;
  }

  /* ---------- Paso 1: servicios ---------- */
  function renderCats() {
    $('#bkCats').innerHTML = D.categorias.map(c => `<button class="pill" role="tab" aria-selected="${c.id === state.cat}" data-id="${c.id}">${esc(c.nombre)}</button>`).join('');
  }
  function renderServices() {
    const cat = D.categorias.find(c => c.id === state.cat);
    $('#bkServices').innerHTML = cat.servicios.filter(s => s.min > 0).map(s => `
      <button class="option" aria-pressed="${state.services.has(s.id)}" data-id="${s.id}">
        <b>${esc(s.nombre)}</b><span>${dur(s.min)}</span><strong>${s.extra ? '+' : ''}${s.precio} €${s.porUna ? '<small style="font-size:.6em"> /uña</small>' : ''}</strong>
      </button>`).join('');
  }

  /* ---------- Paso 2: artistas ---------- */
  function renderArtists() {
    $('#bkArtists').innerHTML = `
      <button class="artist-opt any" role="radio" aria-checked="${state.artist === 'any'}" data-id="any">
        <div><svg class="i"><use href="#i-star"/></svg><b>Sin preferencia</b><span>Más horas disponibles</span></div>
      </button>` +
      D.equipo.map(m => `
      <button class="artist-opt" role="radio" aria-checked="${state.artist === m.id}" data-id="${m.id}">
        <img src="${m.foto.replace('proceso/', 'proceso/mini/')}" alt="" loading="lazy">
        <div><b>${esc(m.nombre)}</b><span>${esc(m.esp)}</span></div>
      </button>`).join('');
  }

  /* ---------- Paso 3: calendario y horas ---------- */
  function renderCalendar() {
    const v = state.view, y = v.getFullYear(), m = v.getMonth();
    $('#calTitle').textContent = `${MESES[m]} ${y}`;
    const first = (new Date(y, m, 1).getDay() + 6) % 7; // lunes = 0
    const days = new Date(y, m + 1, 0).getDate();
    const max = new Date(today); max.setMonth(max.getMonth() + 3);
    let html = '';
    for (let i = 0; i < first; i++) html += '<span class="day empty"></span>';
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d);
      const closed = isClosed(date);
      const past = date < today || date > max;
      const free = !closed && !past ? slotsFor(date).filter(s => s.free).length : 0;
      const disabled = closed || past || free === 0;
      const cls = ['day', closed ? 'closed' : '', free > 0 && free < 6 ? 'few' : '', date.getTime() === today.getTime() ? 'today' : '', state.date && date.getTime() === state.date.getTime() ? 'is-selected' : ''].join(' ');
      const label = `${DIAS[date.getDay()]} ${d} de ${MESES[m]}${closed ? ', cerrado' : disabled ? ', no disponible' : `, ${free} horas libres`}`;
      html += `<button class="${cls}" data-d="${d}" ${disabled ? 'disabled' : ''} aria-label="${label}">${d}</button>`;
    }
    $('#calGrid').innerHTML = html;
    $('#calPrev').disabled = y === today.getFullYear() && m === today.getMonth();
    $('#calNext').disabled = new Date(y, m + 1, 1) > max;
  }
  function renderSlots() {
    const box = $('#slotGroup');
    if (!state.date) { $('#slotsTitle').textContent = 'Selecciona un día del calendario'; box.innerHTML = ''; return; }
    const d = state.date;
    $('#slotsTitle').textContent = `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
    const slots = slotsFor(d);
    const group = (title, list) => list.length ? `<h5>${title}</h5>` + list.map((s, i) =>
      `<button class="slot" role="radio" aria-checked="${state.time === s.label}" data-t="${s.label}" ${s.free ? '' : 'disabled aria-label="' + s.label + ' ocupado"'} style="--ci:${i}">${s.label}</button>`).join('') : '';
    box.innerHTML = group('Mañana', slots.filter(s => s.t < 14 * 60)) + group('Tarde', slots.filter(s => s.t >= 14 * 60));
  }

  /* ---------- Resumen lateral ---------- */
  function renderSummary() {
    const list = [...state.services].map(id => { const s = S(id); return `<li><span>${esc(s.nombre)}</span><span>${s.precio} €</span></li>`; });
    if (state.art) { const a = S(state.art.id); list.push(`<li><span>${esc(a.nombre.replace(' (por uña)', ''))} × ${state.art.n}</span><span>${a.precio * state.art.n} €</span></li>`); }
    $('#bkSummaryList').innerHTML = list.length ? list.join('') : '<li class="muted">Aún no has elegido servicio</li>';
    const art = state.artist === 'any' ? 'Sin preferencia' : D.equipo.find(m => m.id === state.artist).nombre;
    $('#sumArtist').textContent = art;
    $('#sumDate').textContent = state.date ? `${DIAS[state.date.getDay()]} ${state.date.getDate()} ${MESES[state.date.getMonth()].slice(0, 3)}.` : '—';
    $('#sumTime').textContent = state.time || '—';
    const t = totals();
    $('#sumDur').textContent = list.length ? dur(t.mins) : '—';
    $('#sumTotal').textContent = t.price.toLocaleString('es-ES') + ' €';
  }

  /* ---------- Navegación entre pasos ---------- */
  const HINTS = {
    1: () => state.services.size || state.art ? `${state.services.size + (state.art ? 1 : 0)} seleccionado(s)` : 'Selecciona al menos un servicio',
    2: () => 'Todas nuestras artistas trabajan con el mismo protocolo',
    3: () => state.date && state.time ? 'Perfecto, ¡ya casi está!' : 'Elige un día y una hora',
    4: () => 'Te enviaremos la confirmación por email'
  };
  function valid(step) {
    if (step === 1) return state.services.size > 0 || !!state.art;
    if (step === 2) return !!state.artist;
    if (step === 3) return !!(state.date && state.time);
    return true;
  }
  function go(step) {
    state.step = step;
    $$('.pane').forEach(p => p.classList.toggle('is-active', +p.dataset.pane === step));
    $$('#stepper li').forEach(li => {
      const n = +li.dataset.step;
      li.classList.toggle('is-active', n === step);
      li.classList.toggle('is-done', n < step);
    });
    if (step === 3) { renderCalendar(); renderSlots(); }
    const done = step === 5;
    $('.booking-nav').hidden = done;
    $('#bkSummary').hidden = done;
    updateNav();
  }
  function updateNav() {
    const s = state.step;
    $('#bkBack').disabled = s === 1;
    $('#bkNext').disabled = !valid(s);
    $('#bkNext span').textContent = s === 4 ? 'Confirmar cita' : 'Continuar';
    if (HINTS[s]) $('#bkHint').textContent = HINTS[s]();
    renderSummary();
  }

  /* ---------- Formulario ---------- */
  function validateForm() {
    const name = $('#fName'), phone = $('#fPhone'), email = $('#fEmail'), priv = $('#fPrivacy');
    const checks = [
      [name, name.value.trim().length >= 3],
      [phone, /^(\+34)?\s?[6-9](\s?\d){8}$/.test(phone.value.trim())],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())]
    ];
    let ok = true;
    checks.forEach(([el, good]) => { el.closest('.field').classList.toggle('is-invalid', !good); if (!good) ok = false; });
    priv.closest('.check').classList.toggle('is-invalid', !priv.checked);
    if (!priv.checked) ok = false;
    if (!ok) { const first = $('.is-invalid input, .check.is-invalid input'); first && first.focus(); }
    return ok;
  }

  /* ---------- Confirmación, citas guardadas y .ics ---------- */
  const KEY = 'lumina-citas';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const store = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) { /* sin almacenamiento */ } };
  let lastBooking = null;

  function confirm() {
    const code = 'LUM-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const t = totals();
    const [h, m] = state.time.split(':').map(Number);
    const start = new Date(state.date); start.setHours(h, m, 0, 0);
    const names = [...state.services].map(id => S(id).nombre);
    if (state.art) names.push(`${S(state.art.id).nombre.replace(' (por uña)', '')} × ${state.art.n}`);
    lastBooking = {
      code, start: start.toISOString(), mins: t.mins, price: t.price, names,
      artist: $('#sumArtist').textContent, nombre: $('#fName').value.trim(), notas: $('#fNotes').value.trim()
    };
    const list = load(); list.push(lastBooking); store(list);
    $('#doneEmail').textContent = $('#fEmail').value.trim();
    $('#doneCode').textContent = code;
    go(5);
    L.fx.confetti();
    renderMine();
  }

  function ics(b) {
    const pad = n => String(n).padStart(2, '0');
    const f = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const s = new Date(b.start), e = new Date(s.getTime() + b.mins * 60000);
    const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lumina Nails//Reservas//ES', 'BEGIN:VEVENT',
      `UID:${b.code}@lumina-nails`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`, `DTEND:${f(e)}`,
      'SUMMARY:Cita en Lúmina Nails', 'LOCATION:Calle de Lagasca 48\\, 28001 Madrid',
      `DESCRIPTION:${b.names.join(' + ').replace(/,/g, '\\,')} · Código ${b.code}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([txt], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `lumina-${b.code}.ics` });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    L.fx.toast('Archivo de calendario descargado', 'i-calendar');
  }

  function renderMine() {
    const now = Date.now();
    const list = load().filter(b => new Date(b.start).getTime() > now - 3600000).sort((a, b) => new Date(a.start) - new Date(b.start));
    $('#myBookings').hidden = !list.length;
    $('#myBookingsList').innerHTML = list.map(b => {
      const d = new Date(b.start);
      return `<li><div><b>${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</b><br>
        <span>${esc(b.names.join(' + '))} · ${esc(b.artist)} · ${b.price} €</span></div>
        <div style="display:flex;gap:16px;align-items:center"><code>${b.code}</code><button class="link-btn" data-cancel="${b.code}">Cancelar</button></div></li>`;
    }).join('');
  }

  function reset() {
    state.services.clear(); state.art = null; state.artist = 'any'; state.date = null; state.time = null;
    $('#bkForm').reset();
    $$('.field.is-invalid, .check.is-invalid').forEach(e => e.classList.remove('is-invalid'));
    renderServices(); renderArtists(); go(1);
  }

  /* ---------- API pública: preparar una reserva desde otras secciones ---------- */
  function prefill({ servicios = [], notas = '', artista = null, extraArt = null } = {}) {
    if (state.step === 5) reset();
    if (servicios.length) {
      state.services = new Set(servicios.filter(id => S(id) && S(id).min > 0));
      state.cat = S(servicios[0]).cat;
    }
    state.art = extraArt;
    if (artista && D.equipo.some(m => m.id === artista)) state.artist = artista;
    if (notas) { $('#fNotes').value = notas; }
    renderCats(); renderServices(); renderArtists();
    go(1);
    L.fx.goTo('#reservas');
    L.fx.toast(servicios.length ? 'Hemos preparado tu reserva ✦' : 'Tu diseño está anotado en la reserva ✦', 'i-calendar');
  }

  function bind() {
    $('#bkCats').addEventListener('click', e => {
      const b = e.target.closest('[data-id]'); if (!b) return;
      state.cat = b.dataset.id; renderCats(); renderServices();
    });
    $('#bkServices').addEventListener('click', e => {
      const b = e.target.closest('.option'); if (!b) return;
      const id = b.dataset.id;
      state.services.has(id) ? state.services.delete(id) : state.services.add(id);
      b.setAttribute('aria-pressed', state.services.has(id));
      state.time = null; // la duración cambia: volvemos a elegir hora
      updateNav();
    });
    $('#bkArtists').addEventListener('click', e => {
      const b = e.target.closest('.artist-opt'); if (!b) return;
      state.artist = b.dataset.id; state.time = null;
      $$('.artist-opt').forEach(x => x.setAttribute('aria-checked', x === b));
      updateNav();
    });
    $('#calPrev').addEventListener('click', () => { state.view.setMonth(state.view.getMonth() - 1); renderCalendar(); });
    $('#calNext').addEventListener('click', () => { state.view.setMonth(state.view.getMonth() + 1); renderCalendar(); });
    $('#calGrid').addEventListener('click', e => {
      const b = e.target.closest('.day:not(:disabled)'); if (!b || !b.dataset.d) return;
      state.date = new Date(state.view.getFullYear(), state.view.getMonth(), +b.dataset.d);
      state.time = null;
      $$('.day').forEach(x => x.classList.toggle('is-selected', x === b));
      renderSlots(); updateNav();
    });
    $('#slotGroup').addEventListener('click', e => {
      const b = e.target.closest('.slot:not(:disabled)'); if (!b) return;
      state.time = b.dataset.t;
      $$('.slot').forEach(x => x.setAttribute('aria-checked', x === b));
      updateNav();
    });
    $('#stepper').addEventListener('click', e => {
      const li = e.target.closest('li'); if (!li) return;
      const n = +li.dataset.step;
      if (n < state.step && state.step !== 5) go(n);
    });
    $('#bkBack').addEventListener('click', () => go(Math.max(1, state.step - 1)));
    $('#bkNext').addEventListener('click', () => {
      if (state.step < 4) { if (valid(state.step)) go(state.step + 1); return; }
      if (validateForm()) confirm();
    });
    $('#bkForm').addEventListener('input', e => {
      const f = e.target.closest('.field, .check');
      if (f && f.classList.contains('is-invalid')) validateFormSilent(f);
    });
    $('#bkForm').addEventListener('submit', e => { e.preventDefault(); $('#bkNext').click(); });
    $('#doneIcs').addEventListener('click', () => lastBooking && ics(lastBooking));
    $('#doneNew').addEventListener('click', reset);
    $('#myBookingsList').addEventListener('click', e => {
      const b = e.target.closest('[data-cancel]'); if (!b) return;
      store(load().filter(x => x.code !== b.dataset.cancel));
      renderMine();
      L.fx.toast('Cita cancelada. ¡Esperamos verte pronto!', 'i-calendar');
    });
  }
  function validateFormSilent(f) {
    const input = f.querySelector('input');
    if (f.classList.contains('check')) { f.classList.toggle('is-invalid', !input.checked); return; }
    const v = input.value.trim();
    const ok = input.id === 'fName' ? v.length >= 3 : input.id === 'fPhone' ? /^(\+34)?\s?[6-9](\s?\d){8}$/.test(v) : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    f.classList.toggle('is-invalid', !ok);
  }

  function init() { renderCats(); renderServices(); renderArtists(); bind(); go(1); renderMine(); }
  return { init, prefill };
})();
