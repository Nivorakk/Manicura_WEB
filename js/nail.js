/* =========================================================
   LÚMINA · Generador de formas de uña (SVG)
   Devuelve el trazado "d" de una uña centrada en x = 0.
   - w  : ancho de la uña
   - yc : altura de la cutícula (parte baja)
   - yT : altura de la punta (parte alta, valor menor)
   Lo usan el probador virtual y el explorador de formas.
   ========================================================= */
window.L = window.L || {};

L.nail = (function () {
  const f = n => Math.round(n * 100) / 100;
  const P = (x, y) => f(x) + ',' + f(y);

  // Media uña derecha: segmentos desde la punta (0, yT) hasta la esquina de la cutícula (r, yK)
  function rightHalf(shape, r, yT, yK) {
    const H = yK - yT;
    const lim = k => Math.min(k * r, H * 0.88);
    switch (shape) {
      case 'redonda': {
        const a = Math.min(r, H * 0.8);
        return [{ c1: [0.552 * r, yT], c2: [r, yT + a - 0.552 * a], to: [r, yT + a] }, { to: [r, yK] }];
      }
      case 'oval': {
        const a = lim(1.5);
        return [{ c1: [0.6 * r, yT], c2: [r, yT + a * 0.45], to: [r, yT + a] }, { to: [r, yK] }];
      }
      case 'almendra': {
        const a = lim(2.6);
        return [{ c1: [0.32 * r, yT + 0.02 * a], c2: [0.9 * r, yT + 0.38 * a], to: [r, yT + a] }, { to: [r, yK] }];
      }
      case 'stiletto': {
        const a = lim(3.6);
        return [{ c1: [0.22 * r, yT + 0.16 * a], c2: [0.86 * r, yT + 0.6 * a], to: [r, yT + a] }, { to: [r, yK] }];
      }
      case 'squoval':
        return [{ to: [0.55 * r, yT] }, { c1: [0.88 * r, yT], c2: [r, yT + 0.12 * r], to: [r, yT + 0.45 * r] }, { to: [r, yK] }];
      case 'cuadrada':
        return [{ to: [0.86 * r, yT] }, { c1: [0.96 * r, yT], c2: [r, yT + 0.04 * r], to: [r, yT + 0.16 * r] }, { to: [r, yK] }];
      case 'bailarina': {
        const a = lim(2.8);
        return [{ to: [0.46 * r, yT] }, { c1: [0.56 * r, yT], c2: [0.62 * r, yT + 0.05 * r], to: [0.64 * r, yT + 0.16 * r] }, { to: [r, yT + a] }, { to: [r, yK] }];
      }
      default:
        return rightHalf('almendra', r, yT, yK);
    }
  }

  function path(shape, w, yc, yT) {
    const r = w / 2;
    const c = w * 0.26;             // profundidad de la curva de la cutícula
    const yK = yc - c;              // altura de las esquinas de la cutícula
    // Cutícula: de la esquina izquierda a la derecha pasando por (0, yc)
    let d = 'M' + P(-r, yK) +
      ' C' + P(-r, yK + c * 1.05) + ' ' + P(-0.55 * r, yc) + ' ' + P(0, yc) +
      ' C' + P(0.55 * r, yc) + ' ' + P(r, yK + c * 1.05) + ' ' + P(r, yK);

    if (shape === 'lipstick') {
      const a = Math.min(1.5 * r, (yK - yT) * 0.7);
      d += ' L' + P(r, yT + a) +
        ' C' + P(r, yT + a * 0.78) + ' ' + P(0.86 * r, yT + a * 0.68) + ' ' + P(0.6 * r, yT + a * 0.56) +
        ' L' + P(-0.55 * r, yT + a * 0.04) +
        ' C' + P(-0.84 * r, yT - a * 0.06) + ' ' + P(-r, yT + a * 0.1) + ' ' + P(-r, yT + a * 0.34) +
        ' Z';
      return d;
    }

    const segs = rightHalf(shape, r, yT, yK);
    // Recorremos la media derecha al revés (de la cutícula a la punta)
    const pts = [[0, yT]].concat(segs.map(s => s.to));
    for (let i = segs.length - 1; i >= 0; i--) {
      const s = segs[i], from = pts[i];
      d += s.c1 ? ' C' + P(s.c2[0], s.c2[1]) + ' ' + P(s.c1[0], s.c1[1]) + ' ' + P(from[0], from[1])
                : ' L' + P(from[0], from[1]);
    }
    // Y la media izquierda en espejo (de la punta a la cutícula)
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      d += s.c1 ? ' C' + P(-s.c1[0], s.c1[1]) + ' ' + P(-s.c2[0], s.c2[1]) + ' ' + P(-s.to[0], s.to[1])
                : ' L' + P(-s.to[0], s.to[1]);
    }
    return d + ' Z';
  }

  // Zona de la punta francesa: un arco ("sonrisa") que cubre la parte superior
  function smile(w, yS, depth, yTop) {
    const r = w;
    return 'M' + P(-r, yS + depth) + ' Q' + P(0, yS - depth * 1.2) + ' ' + P(r, yS + depth) +
      ' L' + P(r, yTop) + ' L' + P(-r, yTop) + ' Z';
  }

  // Longitud mínima de borde libre que necesita cada forma (en anchos de uña)
  const minLen = { redonda: 0.05, oval: 0.18, almendra: 0.32, stiletto: 0.55, squoval: 0.08, cuadrada: 0.08, bailarina: 0.42, lipstick: 0.3 };

  return { path, smile, minLen };
})();
