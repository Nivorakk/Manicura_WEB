/* =========================================================
   LÚMINA · Arranque de la web
   ========================================================= */
(function () {
  const { $, $$ } = L.fx;
  const D = L.data;
  const esc = s => L.servicios.esc(s);

  /* ---------- Equipo ---------- */
  function equipo() {
    $('#teamGrid').innerHTML = D.equipo.map((m, i) => `
      <article class="member reveal" style="--rd:${i * .1}s" tabindex="0">
        <img src="${m.foto}" alt="Trabajo de ${esc(m.nombre)}" loading="lazy">
        <span class="member-years">${m.anos} años</span>
        <div class="member-info">
          <small>${esc(m.rol)}</small>
          <h4>${esc(m.nombre)}</h4>
          <p>${esc(m.esp)}</p>
          <button class="btn btn-ghost btn-sm" data-artist="${m.id}"><span>Reservar con ${esc(m.nombre.split(' ')[0])}</span></button>
        </div>
      </article>`).join('');
    $('#teamGrid').addEventListener('click', e => {
      const b = e.target.closest('[data-artist]'); if (!b) return;
      L.reservas.prefill({ artista: b.dataset.artist });
    });
  }

  /* ---------- Carrusel de opiniones ---------- */
  function carrusel() {
    const track = $('#carouselTrack'), dots = $('#carDots');
    track.innerHTML = D.opiniones.map((o, i) => `
      <figure class="quote${i === 0 ? ' is-active' : ''}" aria-hidden="${i !== 0}">
        <div class="quote-stars" aria-label="5 estrellas">★★★★★</div>
        <blockquote>${esc(o.t)}</blockquote>
        <cite><b>${esc(o.n)}</b> · ${esc(o.s)}</cite>
      </figure>`).join('');
    dots.innerHTML = D.opiniones.map((_, i) => `<button aria-label="Opinión ${i + 1}" aria-current="${i === 0}"></button>`).join('');
    const quotes = $$('.quote', track), dotBtns = $$('button', dots);
    let i = 0, timer;
    const show = n => {
      quotes[i].classList.remove('is-active'); quotes[i].classList.add('is-prev'); quotes[i].setAttribute('aria-hidden', true);
      const old = quotes[i]; setTimeout(() => old.classList.remove('is-prev'), 800);
      i = (n + quotes.length) % quotes.length;
      quotes[i].classList.add('is-active'); quotes[i].setAttribute('aria-hidden', false);
      dotBtns.forEach((d, k) => d.setAttribute('aria-current', k === i));
    };
    const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 6500); };
    $('#carPrev').onclick = () => { show(i - 1); auto(); };
    $('#carNext').onclick = () => { show(i + 1); auto(); };
    dots.onclick = e => { const k = dotBtns.indexOf(e.target.closest('button')); if (k >= 0) { show(k); auto(); } };
    $('#carousel').addEventListener('mouseenter', () => clearInterval(timer));
    $('#carousel').addEventListener('mouseleave', auto);
    auto();
  }

  /* ---------- ¿Abierto ahora? ---------- */
  function abierto() {
    const d = new Date(), h = d.getHours() + d.getMinutes() / 60, day = d.getDay();
    const open = (day >= 1 && day <= 5 && h >= 10 && h < 21) || (day === 6 && h >= 10 && h < 15);
    const el = $('#openNow');
    el.classList.toggle('is-open', open);
    el.textContent = open ? 'Abierto ahora' : 'Cerrado ahora · reserva online 24 h';
  }

  /* ---------- Newsletter ---------- */
  function newsletter() {
    $('#newsletter').addEventListener('submit', e => {
      e.preventDefault();
      const input = e.target.querySelector('input');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) { L.fx.toast('Revisa tu email, parece incompleto', 'i-mail'); input.focus(); return; }
      input.value = '';
      L.fx.toast('¡Bienvenida! Tu código LUMINA15 está en camino', 'i-mail');
    });
  }

  /* ---------- Línea de tiempo que se dibuja con el scroll ---------- */
  function timeline() {
    const wrap = $('.timeline-wrap'), fill = $('#timelineFill');
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / (r.height + innerHeight * .2)));
      fill.style.transform = `scaleX(${p})`;
    };
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    L.servicios.init();
    L.galeria.init();
    L.calculadora.init();
    L.probador.init();
    L.quiz.init();
    L.reservas.init();
    equipo();
    carrusel();
    abierto();
    newsletter();
    timeline();
    L.fx.init();
  });
})();
