/* =========================================================
   LÚMINA · Test "¿Cuál es tu estilo de uñas ideal?"
   ========================================================= */
window.L = window.L || {};

L.quiz = (function () {
  const { $ } = L.fx;
  const Q = L.data.quiz;
  const esc = s => L.servicios.esc(s);
  let step = 0, answers = [];

  function start() {
    $('#quizCard').innerHTML = `
      <div class="quiz-start">
        <div>
          <h3>Descubre tu estilo en <em class="gold-text">un minuto</em></h3>
          <p>Te haremos seis preguntas sobre tu forma de vestir, tus planes y tus colores favoritos. Al final tendrás tu perfil, tu paleta y los servicios ideales para ti, con la opción de probarlo en el probador virtual.</p>
          <button class="btn btn-gold magnetic" id="quizGo"><span>Empezar el test</span><svg class="i"><use href="#i-arrow"/></svg></button>
        </div>
        <div class="quiz-collage" aria-hidden="true">
          <img src="img/trabajos/mini/rojo-lumina.jpg" alt="" loading="lazy">
          <img src="img/trabajos/mini/nail-art-pastel.jpg" alt="" loading="lazy">
          <img src="img/trabajos/mini/micro-french.jpg" alt="" loading="lazy">
        </div>
      </div>`;
    $('#quizGo').onclick = () => { step = 0; answers = []; question(); };
  }

  function question() {
    const q = Q.preguntas[step];
    const letters = 'ABCDEF';
    $('#quizCard').innerHTML = `
      <div class="quiz-progress"><span>Pregunta ${step + 1} de ${Q.preguntas.length}</span><div class="quiz-bar"><i style="width:${(step / Q.preguntas.length) * 100}%"></i></div></div>
      <h3 class="quiz-q">${esc(q.q)}</h3>
      <div class="quiz-options">
        ${q.o.map((o, i) => `<button class="quiz-opt${answers[step] === i ? ' is-picked' : ''}" data-i="${i}" style="--ci:${i}"><span class="k">${letters[i]}</span>${esc(o[0])}</button>`).join('')}
      </div>
      ${step > 0 ? '<button class="quiz-back" id="quizBack"><svg class="i"><use href="#i-left"/></svg> Anterior</button>' : ''}`;
    requestAnimationFrame(() => { const bar = $('#quizCard .quiz-bar i'); if (bar) bar.style.width = ((step + 1) / Q.preguntas.length) * 100 + '%'; });
    $('#quizCard .quiz-options').onclick = e => {
      const b = e.target.closest('.quiz-opt'); if (!b) return;
      answers[step] = +b.dataset.i;
      b.classList.add('is-picked');
      setTimeout(() => { step++; step < Q.preguntas.length ? question() : result(); }, 380);
    };
    const back = $('#quizBack');
    if (back) back.onclick = () => { step--; question(); };
  }

  function result() {
    const score = {};
    answers.forEach((a, i) => {
      const w = Q.preguntas[i].o[a][1];
      for (const k in w) score[k] = (score[k] || 0) + w[k];
    });
    const id = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
    const p = Q.perfiles[id];
    const S = L.data.servicioPorId;
    $('#quizCard').innerHTML = `
      <div class="quiz-result">
        <figure><img src="img/trabajos/${p.img}.jpg" alt="Diseño recomendado para el perfil ${esc(p.nombre)}"></figure>
        <div>
          <p class="eyebrow">Tu estilo es</p>
          <h3>${esc(p.nombre)}</h3>
          <p class="frase">${esc(p.frase)}</p>
          <p>${esc(p.desc)}</p>
          <div class="palette" aria-label="Tu paleta">${p.paleta.map((c, i) => `<i style="background:${c};animation-delay:${i * 90}ms"></i>`).join('')}</div>
          <ul class="reco">${p.servicios.map(sid => { const s = S(sid); return `<li><span>${esc(s.nombre)}</span><b>${s.extra ? '+' : ''}${s.precio} €</b></li>`; }).join('')}</ul>
          <div class="quiz-actions">
            <button class="btn btn-gold btn-sm" id="quizTry"><span>Probarlo en el probador</span><svg class="i"><use href="#i-star"/></svg></button>
            <button class="btn btn-ghost btn-sm" id="quizBook"><span>Reservar este estilo</span></button>
            <button class="btn btn-ghost btn-sm" id="quizAgain"><span>Repetir</span></button>
          </div>
        </div>
      </div>`;
    L.fx.confetti();
    $('#quizTry').onclick = () => { L.probador.apply(p.look); L.fx.goTo('#probador'); L.fx.toast(`Look «${p.nombre}» cargado en el probador`, 'i-star'); };
    $('#quizBook').onclick = () => L.reservas.prefill({ servicios: p.servicios.slice(0, 2), notas: `Mi resultado del test de estilo: ${p.nombre}.` });
    $('#quizAgain').onclick = start;
  }

  return { init: start };
})();
