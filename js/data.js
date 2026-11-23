/* =========================================================
   LÚMINA NAILS · Datos de la web
   Todo el contenido (servicios, precios, galería, quiz…)
   vive aquí para que sea fácil de editar sin tocar el HTML.
   ========================================================= */
window.L = window.L || {};

L.data = {
  /* ---------- SERVICIOS Y PRECIOS ---------- */
  categorias: [
    {
      id: 'manicura',
      nombre: 'Manicura',
      icono: 'hand',
      intro: 'La base de unas manos impecables: cutícula perfecta, forma precisa y un acabado que dura.',
      servicios: [
        { id: 'man-express', nombre: 'Manicura express', desc: 'Limado, forma y esmaltado tradicional. Perfecta entre reuniones.', min: 25, precio: 22 },
        { id: 'man-clasica', nombre: 'Manicura clásica', desc: 'Baño de manos, cutícula con alicate, hidratación y esmaltado.', min: 40, precio: 28 },
        { id: 'man-rusa', nombre: 'Manicura rusa (e-file)', desc: 'Cutícula en seco con torno de precisión. Resultado limpísimo y duradero.', min: 50, precio: 36, top: true },
        { id: 'man-japonesa', nombre: 'Manicura japonesa P-Shine', desc: 'Pasta de queratina y pulido con gamuza: brillo natural sin esmalte.', min: 45, precio: 34 },
        { id: 'man-masculina', nombre: 'Manicura masculina', desc: 'Limpieza, forma, cutícula y pulido mate o brillo invisible.', min: 35, precio: 26 },
        { id: 'man-ritual', nombre: 'Ritual Lúmina', desc: 'Exfoliación con polvo de oro, mascarilla, parafina y masaje de 15 minutos.', min: 70, precio: 49, top: true }
      ]
    },
    {
      id: 'esmaltado',
      nombre: 'Esmaltado y estructura',
      icono: 'drop',
      intro: 'Color que dura semanas y estructura que protege la uña natural mientras crece.',
      servicios: [
        { id: 'esm-semi', nombre: 'Semipermanente', desc: 'Incluye preparación de cutícula y esmaltado en gel. Hasta 3 semanas.', min: 50, precio: 32 },
        { id: 'esm-rusa-semi', nombre: 'Manicura rusa + semipermanente', desc: 'Nuestro servicio estrella: acabado de catálogo pegado a la cutícula.', min: 75, precio: 42, top: true },
        { id: 'esm-rubber', nombre: 'Rubber base / nivelación', desc: 'Base flexible que nivela y refuerza uñas finas o con estrías.', min: 60, precio: 39 },
        { id: 'esm-biab', nombre: 'BIAB (builder in a bottle)', desc: 'Gel constructor sobre uña natural: fuerza, curva perfecta y aspecto natural.', min: 70, precio: 45, top: true },
        { id: 'esm-biab-relleno', nombre: 'Relleno BIAB', desc: 'Mantenimiento cada 3–4 semanas para seguir dejando crecer tu uña.', min: 60, precio: 39 },
        { id: 'esm-tradicional', nombre: 'Esmaltado tradicional', desc: 'Añadido a cualquier manicura. Gama de lujo libre de 10 tóxicos.', min: 15, precio: 8, extra: true }
      ]
    },
    {
      id: 'extensiones',
      nombre: 'Extensiones',
      icono: 'nail',
      intro: 'Largo, forma y arquitectura a medida. Esculpimos la uña que siempre has querido.',
      servicios: [
        { id: 'ext-gel', nombre: 'Uñas de gel esculpidas', desc: 'Esculpidas sobre molde, con curva C y ápice perfectos.', min: 100, precio: 58, top: true },
        { id: 'ext-acrilico', nombre: 'Acrílico', desc: 'Máxima resistencia para largos extremos y formas arquitectónicas.', min: 105, precio: 60 },
        { id: 'ext-polygel', nombre: 'Polygel / acrygel', desc: 'Lo mejor del gel y el acrílico: ligero, flexible y sin olor.', min: 95, precio: 56 },
        { id: 'ext-softgel', nombre: 'Soft gel tips', desc: 'Tips completos de gel blando: extensiones rápidas, ligeras y naturales.', min: 80, precio: 50 },
        { id: 'ext-dip', nombre: 'Dip powder', desc: 'Polvo por inmersión: color intenso y uña fuerte sin lámpara UV.', min: 60, precio: 40 },
        { id: 'ext-presson', nombre: 'Press-on a medida', desc: 'Set de 24 uñas pintadas a mano en tus medidas, reutilizables.', min: 30, precio: 45 },
        { id: 'ext-relleno', nombre: 'Relleno gel / acrílico', desc: 'Mantenimiento de extensiones a partir de 3 semanas.', min: 80, precio: 45 },
        { id: 'ext-retirada', nombre: 'Retirada', desc: 'Retirada cuidadosa sin limar la uña natural. Gratis si repites con nosotras.', min: 20, precio: 12 },
        { id: 'ext-reparacion', nombre: 'Reparación de uña (fibra o seda)', desc: 'Reconstrucción de una uña rota. Precio por uña.', min: 10, precio: 5, porUna: true }
      ]
    },
    {
      id: 'nailart',
      nombre: 'Nail art',
      icono: 'brush',
      intro: 'De la micro francesa al 3D escultórico: cada tendencia, interpretada con técnica de autor.',
      servicios: [
        { id: 'art-french', nombre: 'Francesa / micro french / french de color', desc: 'Clásica, invertida, doble o de color, con línea de sonrisa impecable.', min: 15, precio: 10, extra: true },
        { id: 'art-babyboomer', nombre: 'Baby boomer / ombré', desc: 'Degradado sin cortes del nude al blanco o al color que elijas.', min: 20, precio: 12, extra: true },
        { id: 'art-cromo', nombre: 'Cromado, glazed donut y aurora', desc: 'Polvos efecto espejo, perla o holográfico sobre gel.', min: 15, precio: 10, extra: true, top: true },
        { id: 'art-cateye', nombre: 'Ojo de gato y velvet', desc: 'Esmaltes magnéticos con haz de luz o efecto terciopelo.', min: 15, precio: 10, extra: true },
        { id: 'art-aura', nombre: 'Aura nails y aerógrafo', desc: 'Degradados difuminados con aerógrafo profesional.', min: 20, precio: 12, extra: true },
        { id: 'art-sencillo', nombre: 'Diseño sencillo (por uña)', desc: 'Líneas, puntos, stickers, stamping o glitter localizado.', min: 4, precio: 3, extra: true, porUna: true },
        { id: 'art-manoalzada', nombre: 'Mano alzada (por uña)', desc: 'Flores, retratos mini, line art o negative space pintados a pincel.', min: 8, precio: 6, extra: true, porUna: true },
        { id: 'art-3d', nombre: '3D, encapsulado o charms (por uña)', desc: 'Relieve en gel, gotas cromadas, perlas, flores secas o pan de oro encapsulado.', min: 10, precio: 7, extra: true, porUna: true },
        { id: 'art-cristales', nombre: 'Cristales y strass (por uña)', desc: 'Cristales de alta refracción colocados uno a uno.', min: 6, precio: 5, extra: true, porUna: true },
        { id: 'art-pandeoro', nombre: 'Pan de oro / foil', desc: 'Láminas de oro o plata aplicadas a mano (set completo).', min: 10, precio: 8, extra: true }
      ]
    },
    {
      id: 'pedicura',
      nombre: 'Pedicura',
      icono: 'foot',
      intro: 'Tronos de pedicura con hidromasaje y rituales que convierten una cita en un pequeño viaje.',
      servicios: [
        { id: 'ped-express', nombre: 'Pedicura express', desc: 'Corte, forma, cutícula y esmaltado tradicional.', min: 35, precio: 30 },
        { id: 'ped-semi', nombre: 'Pedicura completa + semipermanente', desc: 'Baño, durezas, cutícula, hidratación y color que dura 4 semanas.', min: 60, precio: 45, top: true },
        { id: 'ped-rusa', nombre: 'Pedicura rusa (e-file)', desc: 'Técnica en seco con torno: precisión absoluta en cutícula y durezas.', min: 70, precio: 50 },
        { id: 'ped-ritual', nombre: 'Pedicura spa ritual', desc: 'Sales minerales, exfoliación, mascarilla, toallas calientes y masaje.', min: 80, precio: 58 }
      ]
    },
    {
      id: 'tratamientos',
      nombre: 'Tratamientos',
      icono: 'leaf',
      intro: 'Cuidados que reparan, fortalecen y miman tus manos entre manicura y manicura.',
      servicios: [
        { id: 'tra-parafina', nombre: 'Baño de parafina', desc: 'Hidratación profunda con calor para manos secas.', min: 15, precio: 12, extra: true },
        { id: 'tra-queratina', nombre: 'Fortalecedor de queratina', desc: 'Tratamiento para uñas débiles, finas o que se abren en capas.', min: 20, precio: 18 },
        { id: 'tra-masaje', nombre: 'Masaje de manos y antebrazos', desc: '15 minutos de masaje relajante con aceites de cutícula y almendra.', min: 15, precio: 14, extra: true },
        { id: 'tra-peeling', nombre: 'Peeling de manos con oro', desc: 'Exfoliación iluminadora con partículas de oro y vitamina C.', min: 10, precio: 10, extra: true },
        { id: 'tra-mordidas', nombre: 'Programa uñas mordidas', desc: 'Reconstrucción progresiva y acompañamiento para dejar el hábito.', min: 60, precio: 42 }
      ]
    },
    {
      id: 'experiencias',
      nombre: 'Experiencias',
      icono: 'star',
      intro: 'Momentos para celebrar: bodas, regalos, planes en grupo y una membresía para no fallar nunca.',
      servicios: [
        { id: 'exp-novia', nombre: 'Ritual Novia', desc: 'Prueba de diseño, manicura y pedicura del gran día y cava para tu madrina.', min: 180, precio: 145, top: true },
        { id: 'exp-madrehija', nombre: 'Madre e hija', desc: 'Dos manicuras con semipermanente en puestos contiguos y merienda.', min: 75, precio: 75 },
        { id: 'exp-party', nombre: 'Lúmina Party', desc: 'Suite privada para grupos de 4 a 8 personas con cava. Precio por persona.', min: 120, precio: 39 },
        { id: 'exp-club', nombre: 'Club Lúmina (mensual)', desc: '2 semipermanentes + 1 pedicura al mes y un 10 % en todo lo demás.', min: 0, precio: 89 },
        { id: 'exp-regalo', nombre: 'Tarjeta regalo', desc: 'En estuche de terciopelo y válida durante un año. Desde 30 €.', min: 0, precio: 30 }
      ]
    }
  ],

  /* ---------- DICCIONARIO DE TÉCNICAS ---------- */
  tecnicas: [
    ['Acrílico', 'Extensión que mezcla polímero en polvo y monómero líquido. Muy resistente, ideal para largos extremos.'],
    ['Aerógrafo', 'Pistola de aire que pulveriza esmalte para crear degradados y difuminados perfectos.'],
    ['Almendra', 'Forma afinada de laterales suaves y punta redondeada. Estiliza muchísimo los dedos.'],
    ['Aura nails', 'Degradado circular desde el centro de la uña, como un halo de luz difuminado.'],
    ['Aurora / holográfico', 'Polvo que refleja varios colores según el ángulo, como una aurora boreal.'],
    ['Baby boomer', 'Degradado vertical sin cortes del rosa nude al blanco: la evolución de la francesa.'],
    ['BIAB', 'Builder in a bottle: gel constructor aplicado sobre la uña natural para reforzarla.'],
    ['Bailarina (coffin)', 'Forma larga con laterales que se estrechan y punta recta, como una zapatilla de ballet.'],
    ['Blooming gel', 'Gel que hace que el color se expanda como acuarela: ideal para flores y mármoles.'],
    ['Cat eye (ojo de gato)', 'Esmalte con partículas magnéticas; con un imán se crea un haz de luz que se mueve.'],
    ['Charms', 'Pequeñas joyas y figuras en 3D fijadas con gel: lazos, perlas, estrellas…'],
    ['Cromado', 'Polvo metálico frotado sobre gel que crea un acabado espejo: oro, plata, champán…'],
    ['Cutícula rusa', 'Retirada de cutícula en seco con fresas de torno para un acabado limpísimo.'],
    ['Dip powder', 'Uña sumergida en polvo de color y sellada con activador. No necesita lámpara.'],
    ['Encapsulado', 'Elementos (flores secas, pan de oro, glitter) atrapados entre capas de gel transparente.'],
    ['Efecto mármol', 'Vetas que imitan mármol o piedra natural, a menudo con detalles en oro.'],
    ['Efecto terciopelo (velvet)', 'Esmalte magnético con brillo difuso que parece terciopelo bajo la luz.'],
    ['Esculpida en molde', 'Extensión construida sobre un molde de papel bajo el borde libre, sin tip.'],
    ['Francesa', 'Base nude con punta blanca. Variantes: micro, invertida, doble, de color y en V.'],
    ['Glass nails', 'Acabado translúcido y brillante que parece cristal tallado.'],
    ['Glazed donut', 'Polvo perlado sobre nude: brillo húmedo y luminoso, como un donut glaseado.'],
    ['Jelly nails', 'Colores translúcidos y jugosos, como una gominola a contraluz.'],
    ['Line art', 'Dibujos minimalistas de línea fina: caras, hojas, ondas, geometrías.'],
    ['Lipstick', 'Forma con la punta cortada en diagonal, como la barra de un pintalabios.'],
    ['Mano alzada', 'Diseños pintados a pincel, trazo a trazo, sin plantillas ni pegatinas.'],
    ['Milky nails', 'Blanco lechoso semitransparente que unifica y aclara la uña.'],
    ['Negative space', 'Diseños que dejan zonas de uña natural visibles como parte del dibujo.'],
    ['Ombré', 'Degradado horizontal o vertical entre dos o más colores.'],
    ['Pan de oro', 'Láminas finísimas de metal aplicadas a mano para un efecto joya.'],
    ['P-Shine', 'Manicura japonesa con pasta de queratina y pulido: brillo natural sin esmalte.'],
    ['Polygel', 'Híbrido entre gel y acrílico, moldeable como plastilina y muy ligero.'],
    ['Press-on', 'Uñas postizas pintadas a mano a medida, que se colocan y retiran en casa.'],
    ['Rubber base', 'Base de goma flexible que nivela la uña y hace que el color dure más.'],
    ['Semipermanente', 'Esmalte en gel que se cura con lámpara. Dura de 2 a 3 semanas sin descascarillarse.'],
    ['Soft gel tips', 'Tips completos de gel blando que se adhieren y curan: extensiones rápidas.'],
    ['Squoval', 'Mezcla de cuadrada y oval: punta recta con esquinas suaves. Muy resistente.'],
    ['Stamping', 'Diseños transferidos con placa grabada y tampón de silicona.'],
    ['Stiletto', 'Forma muy afilada terminada en punta. Dramática y escultural.'],
    ['Strass y cristales', 'Piedras de cristal colocadas una a una para un efecto joya.'],
    ['Sugar effect', 'Textura granulada como azúcar sobre el esmalte.'],
    ['Tortoise (carey)', 'Manchas ámbar y marrón translúcidas que imitan la concha de tortuga.'],
    ['3D gel', 'Relieves esculpidos con gel espeso: flores, gotas, ondas y texturas.']
  ],

  /* ---------- FORMAS DE UÑA ---------- */
  formas: [
    { id: 'redonda', nombre: 'Redonda', desc: 'Sigue la curva natural del dedo. Práctica, resistente y perfecta para uñas cortas.', ideal: 'Uñas cortas · día a día · deporte' },
    { id: 'oval', nombre: 'Oval', desc: 'Laterales rectos y punta en óvalo. Alarga visualmente los dedos sin perder suavidad.', ideal: 'Manos pequeñas · estilo clásico' },
    { id: 'almendra', nombre: 'Almendra', desc: 'Afinada y elegante, termina en una punta suave. La forma más pedida en Lúmina.', ideal: 'Alargar los dedos · cromados · francesas' },
    { id: 'squoval', nombre: 'Squoval', desc: 'Punta recta con esquinas redondeadas: lo mejor de la cuadrada y la oval.', ideal: 'Uñas medias · BIAB · semipermanente' },
    { id: 'cuadrada', nombre: 'Cuadrada', desc: 'Borde recto y esquinas marcadas. Moderna, gráfica y muy fotogénica.', ideal: 'Dedos largos · francesas · nail art' },
    { id: 'bailarina', nombre: 'Bailarina', desc: 'Laterales que se estrechan y punta plana. Sofisticada y muy de tendencia.', ideal: 'Extensiones medias y largas' },
    { id: 'stiletto', nombre: 'Stiletto', desc: 'Afilada hasta la punta. Escultural, atrevida y pensada para destacar.', ideal: 'Extensiones · looks de noche' },
    { id: 'lipstick', nombre: 'Lipstick', desc: 'Punta cortada en diagonal, como un pintalabios. Original y poco vista.', ideal: 'Quien busca algo diferente' }
  ],

  /* ---------- EQUIPO ---------- */
  equipo: [
    { id: 'valeria', nombre: 'Valeria Montes', rol: 'Fundadora y directora artística', esp: 'Nail art de autor, cromados y novias', foto: 'img/proceso/pincel.jpg', anos: 14 },
    { id: 'irene', nombre: 'Irene Sanz', rol: 'Master en manicura rusa', esp: 'Cutícula e-file, BIAB y rubber base', foto: 'img/proceso/esmaltado.jpg', anos: 9 },
    { id: 'mei', nombre: 'Mei Lin', rol: 'Nail artist senior', esp: 'Estilo coreano, 3D, encapsulados y aura nails', foto: 'img/proceso/lampara.jpg', anos: 7 },
    { id: 'lucia', nombre: 'Lucía Ferrer', rol: 'Especialista en extensiones', esp: 'Acrílico, polygel y formas arquitectónicas', foto: 'img/proceso/limado.jpg', anos: 8 }
  ],

  /* ---------- GALERÍA DE TRABAJOS ---------- */
  // cat: francesa, nailart, gel, acrilico, semi, biab, cromado, novias, pedicura, minimal
  galeria: [
    { img: 'cromado-champagne', t: 'Chrome Champagne', tec: 'Gel + polvo cromado espejo', forma: 'Almendra larga', cat: ['cromado', 'gel'], artista: 'Valeria', precio: 68, w: 1080, h: 1440 },
    { img: 'micro-french', t: 'Micro French Milky', tec: 'BIAB milky + micro francesa', forma: 'Almendra', cat: ['francesa', 'biab', 'minimal'], artista: 'Irene', precio: 55, w: 1080, h: 1440 },
    { img: 'glazed-donut', t: 'Glazed Donut', tec: 'Semipermanente + polvo perla', forma: 'Squoval corta', cat: ['cromado', 'semi', 'minimal'], artista: 'Mei', precio: 42, w: 1080, h: 1440 },
    { img: 'cat-eye-esmeralda', t: 'Cat Eye Esmeralda', tec: 'Gel magnético ojo de gato', forma: 'Almendra larga', cat: ['nailart', 'gel'], artista: 'Mei', precio: 68, w: 1080, h: 1440 },
    { img: 'pan-de-oro', t: 'Pan de Oro', tec: 'Gel nude + láminas de oro a mano', forma: 'Almendra', cat: ['nailart', 'gel'], artista: 'Valeria', precio: 66, w: 933, h: 1400 },
    { img: 'rosa-empolvado', t: 'Rosa Empolvado', tec: 'Gel esculpido rosa nude', forma: 'Almendra afilada', cat: ['gel', 'minimal'], artista: 'Lucía', precio: 58, w: 933, h: 1400 },
    { img: 'monocromo', t: 'Monocromo Gráfico', tec: 'Mix & match negro, blanco y oro', forma: 'Redonda corta', cat: ['nailart', 'semi'], artista: 'Mei', precio: 56, w: 1400, h: 933 },
    { img: 'rojo-lumina', t: 'Rojo Lúmina', tec: 'Semipermanente rojo rubí', forma: 'Oval', cat: ['semi', 'minimal'], artista: 'Irene', precio: 42, w: 1120, h: 1400 },
    { img: 'acrilico-rojo', t: 'Almendra Rubí', tec: 'Acrílico + gel rojo de alto brillo', forma: 'Almendra larga', cat: ['acrilico'], artista: 'Lucía', precio: 60, w: 1120, h: 1400 },
    { img: 'azul-glaciar', t: 'Azul Glaciar', tec: 'Extensión de gel + ombré turquesa', forma: 'Almendra XL', cat: ['acrilico', 'gel', 'nailart'], artista: 'Lucía', precio: 70, w: 1400, h: 1400 },
    { img: 'french-color', t: 'French Cobalto', tec: 'Francesa de color sobre nude', forma: 'Squoval', cat: ['francesa', 'semi'], artista: 'Irene', precio: 52, w: 1050, h: 1400 },
    { img: 'novia-nude', t: 'Novia Nude', tec: 'BIAB rosa velo, acabado espejo', forma: 'Squoval', cat: ['novias', 'biab', 'minimal'], artista: 'Valeria', precio: 45, w: 1400, h: 933 },
    { img: 'novia-encaje', t: 'Novia Encaje', tec: 'Semipermanente nude con brillo perla', forma: 'Almendra corta', cat: ['novias', 'semi'], artista: 'Valeria', precio: 42, w: 1400, h: 933 },
    { img: 'menta', t: 'Menta Pastel', tec: 'Semipermanente verde menta', forma: 'Squoval', cat: ['semi'], artista: 'Irene', precio: 42, w: 1400, h: 933 },
    { img: 'glitter-nude', t: 'Nude Glitter', tec: 'Gel nude + uña de acento con glitter', forma: 'Almendra', cat: ['gel', 'nailart'], artista: 'Mei', precio: 61, w: 933, h: 1400 },
    { img: 'glitter-rosa', t: 'Rosa Brillo', tec: 'Semipermanente rosa + glitter holográfico', forma: 'Oval', cat: ['semi', 'nailart'], artista: 'Irene', precio: 45, w: 1400, h: 933 },
    { img: 'chocolate', t: 'Chocolate & Joyas', tec: 'Semipermanente cacao con detalles a mano', forma: 'Redonda', cat: ['semi', 'nailart'], artista: 'Mei', precio: 48, w: 933, h: 1400 },
    { img: 'pedicura', t: 'Pedicura Vainilla', tec: 'Pedicura completa + semipermanente', forma: 'Natural', cat: ['pedicura'], artista: 'Irene', precio: 45, w: 1400, h: 933 },
    { img: 'nail-art-pastel', t: 'Pastel Mix & Match', tec: 'Cada uña un diseño: line art y color', forma: 'Almendra corta', cat: ['nailart', 'semi'], artista: 'Mei', precio: 54, w: 1050, h: 1400 },
    { img: 'french-rosa', t: 'French Rosé', tec: 'Acrílico + francesa rosa con mano alzada', forma: 'Bailarina', cat: ['francesa', 'acrilico', 'nailart'], artista: 'Lucía', precio: 72, w: 788, h: 1400 },
    { img: 'nude-oro', t: 'Nude & Oro', tec: 'BIAB nude perlado', forma: 'Bailarina corta', cat: ['biab', 'minimal'], artista: 'Irene', precio: 45, w: 1050, h: 1400 },
    { img: 'nude-satin', t: 'Satén Nude', tec: 'Rubber base + semipermanente satén', forma: 'Oval', cat: ['semi', 'minimal'], artista: 'Irene', precio: 39, w: 933, h: 1400 }
  ],
  filtros: [
    ['todos', 'Todos'], ['francesa', 'Francesa'], ['nailart', 'Nail art'], ['gel', 'Gel'], ['acrilico', 'Acrílico'],
    ['semi', 'Semipermanente'], ['biab', 'BIAB'], ['cromado', 'Cromados'], ['novias', 'Novias'], ['pedicura', 'Pedicura'], ['minimal', 'Minimal']
  ],

  /* ---------- EL ESTUDIO (LOCAL) ---------- */
  // Todas las fotos pertenecen al mismo salón (serie de Max Vakhtbovych en Pexels)
  local: [
    { img: 'entrada', t: 'La entrada', d: 'Un escaparate de cristal de suelo a techo. Desde fuera ya se intuye todo lo que te espera dentro.', w: 1800, h: 1312 },
    { img: 'sala-principal', t: 'Sala principal', d: 'Un espacio diáfano de mármol blanco, techo de lamas negras y luz cálida regulable.', w: 1800, h: 1202 },
    { img: 'tocador', t: 'Tocador Hollywood', d: 'Espejos de camerino con bombillas para el último retoque y la foto de rigor antes de salir.', w: 1201, h: 1800 },
    { img: 'zona-manicura', t: 'Zona de manicura', d: 'Puestos de diseño con aspiración integrada: aire limpio y sin olores mientras trabajamos.', w: 1800, h: 1206 },
    { img: 'puesto', t: 'Tu puesto', d: 'Mesa escultórica, sillón ergonómico y lámpara de precisión. Cada detalle pensado para ti.', w: 1258, h: 1800 },
    { img: 'recepcion', t: 'Recepción', d: 'Mostrador lacado en negro piano. Te recibimos con té blanco, agua aromatizada o una copa de cava.', w: 1800, h: 1202 },
    { img: 'cabina', t: 'Cabina privada', d: 'Tras el cristal esmerilado, cabinas privadas para pedicura spa y tratamientos.', w: 1177, h: 1800 },
    { img: 'vista', t: 'Vista general', d: 'Espejos de camerino, islas de color y zonas de trabajo que fluyen en un único espacio.', w: 1800, h: 1202 },
    { img: 'boutique', t: 'Boutique Lúmina', d: 'Islas lacadas con más de 1.200 tonos y nuestra selección de cuidados para casa.', w: 1349, h: 1800 },
    { img: 'detalle', t: 'El detalle', d: 'Superficies negras mate, extractor integrado y una lámpara que lo ilumina todo con precisión.', w: 1406, h: 1800 }
  ],

  /* ---------- OPINIONES ---------- */
  opiniones: [
    { n: 'Carmen R.', s: 'Manicura rusa + semipermanente', t: 'Tres semanas y mi manicura sigue como el primer día. El local es de otro planeta y el trato, exquisito.' },
    { n: 'Alejandra M.', s: 'Ritual Novia', t: 'Valeria diseñó unas uñas con perlas para mi boda que no paraban de fotografiar. Gracias por tanta calma ese día.' },
    { n: 'Sofía L.', s: 'Cromado champagne', t: 'Llevo años buscando un sitio así en Madrid. Puntuales, higiénicas y con un nivel de detalle impresionante.' },
    { n: 'Daniela O.', s: 'BIAB', t: 'Por fin me crecen las uñas. Irene es una artista y la Suite Rosé es mi sitio favorito del barrio.' },
    { n: 'Patricia G.', s: 'Pedicura spa ritual', t: 'Salí flotando. Los tronos de pedicura, la música, el cava… un pequeño viaje en pleno Salamanca.' }
  ],

  /* ---------- PROBADOR VIRTUAL ---------- */
  colecciones: [
    { id: 'nudes', nombre: 'Nudes', colores: [['Porcelana', '#F1D6CB'], ['Champagne nude', '#E6C3AA'], ['Rosa ballet', '#F0C2C3'], ['Milky', '#F3E8E3'], ['Beige satén', '#D7B096'], ['Taupe', '#A58C80'], ['Capuchino', '#B58769'], ['Moka', '#7E5341']] },
    { id: 'rojos', nombre: 'Rojos', colores: [['Rubí Lúmina', '#9E0F27'], ['Cereza', '#C8102E'], ['Carmín', '#B3122E'], ['Frambuesa', '#B5194F'], ['Tomate', '#D63A2F'], ['Coral', '#F0645A'], ['Velvet wine', '#6B1027'], ['Burdeos', '#560A1C']] },
    { id: 'rosas', nombre: 'Rosas', colores: [['Rosa empolvado', '#E8B4B8'], ['Rosa palo', '#EFC9CB'], ['Peonía', '#E37C99'], ['Chicle', '#F5A3C7'], ['Salmón', '#F2A28B'], ['Malva', '#B97A9A'], ['Fucsia', '#D6247A'], ['Magenta', '#A0115F']] },
    { id: 'oscuros', nombre: 'Oscuros', colores: [['Negro ónix', '#141414'], ['Esmeralda', '#0F5C46'], ['Azul noche', '#14213D'], ['Chocolate', '#4A2C22'], ['Ciruela', '#3E1B35'], ['Verde botella', '#1F3B2D'], ['Grafito', '#3A3A3C'], ['Berenjena', '#4B1F3A']] },
    { id: 'pastel', nombre: 'Pastel', colores: [['Lavanda', '#C9B6E4'], ['Menta', '#A8DCC6'], ['Cielo', '#A9CBEA'], ['Melocotón', '#F7C59F'], ['Limón', '#F3E59A'], ['Lila', '#D7B9D5'], ['Aguamarina', '#8FD3CF'], ['Vainilla', '#F4E6C3']] },
    { id: 'metal', nombre: 'Metálicos', colores: [['Oro', '#D4AF37'], ['Champagne', '#D9B98C'], ['Plata', '#C4C7CC'], ['Oro rosa', '#C98B8F'], ['Bronce', '#A97142'], ['Cobre', '#B87333'], ['Titanio', '#8A8D91'], ['Perla', '#EDE6DB']] }
  ],
  acabados: [
    { id: 'brillo', nombre: 'Brillo', extra: 0 },
    { id: 'mate', nombre: 'Mate', extra: 0 },
    { id: 'cromado', nombre: 'Cromado', extra: 10 },
    { id: 'glitter', nombre: 'Glitter', extra: 6 },
    { id: 'cateye', nombre: 'Ojo de gato', extra: 10 },
    { id: 'francesa', nombre: 'Francesa', extra: 10 },
    { id: 'babyboomer', nombre: 'Baby boomer', extra: 12 },
    { id: 'aurora', nombre: 'Aurora', extra: 10 }
  ],
  pieles: [
    ['Porcelana', '#F6DCCB', '#E7C0A9'],
    ['Clara', '#EBC3A6', '#D6A585'],
    ['Media', '#D19F7A', '#B9835F'],
    ['Canela', '#A8734F', '#8E5C3C'],
    ['Ébano', '#6E4530', '#563424']
  ],

  /* ---------- QUIZ ---------- */
  quiz: {
    preguntas: [
      {
        q: '¿Cómo describirías tu forma de vestir?',
        o: [
          ['Básicos impecables y tonos neutros', { minimal: 2 }],
          ['Brillo, joyas y protagonismo', { glam: 2 }],
          ['Encaje, flores y tonos suaves', { romantica: 2 }],
          ['Mezclo colores y estampados sin miedo', { artista: 2 }],
          ['Un vestido negro y labios rojos', { clasica: 2 }],
          ['Negro total, cuero y terciopelo', { dark: 2 }]
        ]
      },
      {
        q: 'Tu plan perfecto de sábado es…',
        o: [
          ['Brunch tranquilo y paseo por el Retiro', { minimal: 1, romantica: 1 }],
          ['Fiesta de gala con photocall', { glam: 2 }],
          ['Inauguración en una galería de arte', { artista: 2 }],
          ['Cena en un restaurante de manteles blancos', { clasica: 2 }],
          ['Cóctel en un speakeasy a media luz', { dark: 2 }],
          ['Picnic al atardecer con amigas', { romantica: 1, artista: 1 }]
        ]
      },
      {
        q: '¿Qué largo de uña te representa?',
        o: [
          ['Corta y natural, que no estorbe', { minimal: 2, clasica: 1 }],
          ['Media, elegante y versátil', { romantica: 1, clasica: 1 }],
          ['Larga, para lucirla', { glam: 1, dark: 1 }],
          ['Extra larga: cuanto más, mejor', { glam: 1, artista: 1, dark: 1 }]
        ]
      },
      {
        q: '¿Qué color te llama más?',
        o: [
          ['Nude, beige, lechoso', { minimal: 2 }],
          ['Rojo intenso', { clasica: 2 }],
          ['Rosa empolvado', { romantica: 2 }],
          ['Oro, plata, cromo', { glam: 2 }],
          ['Negro, burdeos, esmeralda', { dark: 2 }],
          ['¡Todos a la vez!', { artista: 2 }]
        ]
      },
      {
        q: '¿Qué es lo más importante para ti?',
        o: [
          ['Que se vea natural y cuidada', { minimal: 2 }],
          ['Que dure semanas perfecta', { clasica: 1, minimal: 1 }],
          ['Que todo el mundo me pregunte', { glam: 1, artista: 1 }],
          ['Que sea único, solo mío', { artista: 1, dark: 1 }],
          ['Que transmita delicadeza', { romantica: 2 }]
        ]
      },
      {
        q: 'Elige tu joya favorita',
        o: [
          ['Pequeños aros de oro', { minimal: 2 }],
          ['Collar statement', { glam: 2 }],
          ['Perlas', { romantica: 2 }],
          ['Anillos mezclados', { artista: 2 }],
          ['Un reloj clásico', { clasica: 2 }],
          ['Gargantilla negra', { dark: 2 }]
        ]
      }
    ],
    perfiles: {
      minimal: {
        nombre: 'Clean Girl Minimal',
        frase: 'Menos es más, y tú lo sabes.',
        desc: 'Te encantan las manos cuidadas que parecen naturales pero perfectas. Tu fórmula: uña sana, tonos lechosos y un brillo que dice «me cuido» sin gritarlo.',
        img: 'micro-french',
        servicios: ['esm-biab', 'man-rusa', 'art-french'],
        look: { color: '#F3E8E3', nombre: 'Milky', acabado: 'brillo', forma: 'squoval', largo: 0.25 },
        paleta: ['#F3E8E3', '#F0C2C3', '#E6C3AA', '#D7B096']
      },
      glam: {
        nombre: 'Glamour Chrome',
        frase: 'Naciste para brillar bajo los focos.',
        desc: 'Lo tuyo es el efecto espejo, las joyas y los acabados que capturan la luz. Cromados, cat eye y largos que no pasan desapercibidos.',
        img: 'cromado-champagne',
        servicios: ['ext-gel', 'art-cromo', 'art-cateye'],
        look: { color: '#D9B98C', nombre: 'Champagne', acabado: 'cromado', forma: 'almendra', largo: 0.75 },
        paleta: ['#D4AF37', '#D9B98C', '#C4C7CC', '#C98B8F']
      },
      romantica: {
        nombre: 'Romántica Atemporal',
        frase: 'Delicada, luminosa, inolvidable.',
        desc: 'Francesas suaves, baby boomer, perlas y rosas empolvados. Tus manos cuentan historias bonitas y nunca pasan de moda.',
        img: 'novia-encaje',
        servicios: ['esm-rusa-semi', 'art-babyboomer', 'art-3d'],
        look: { color: '#F0C2C3', nombre: 'Rosa ballet', acabado: 'babyboomer', forma: 'almendra', largo: 0.45 },
        paleta: ['#EFC9CB', '#E8B4B8', '#F3E8E3', '#EDE6DB']
      },
      artista: {
        nombre: 'Artista Atrevida',
        frase: 'Tus uñas son tu lienzo.',
        desc: 'Cada uña, un diseño. Mezclas colores, texturas, 3D y line art sin miedo. Contigo, nuestras artistas se lo pasan en grande.',
        img: 'nail-art-pastel',
        servicios: ['esm-semi', 'art-manoalzada', 'art-3d'],
        look: { color: '#C9B6E4', nombre: 'Lavanda', acabado: 'aurora', forma: 'cuadrada', largo: 0.5 },
        paleta: ['#C9B6E4', '#A8DCC6', '#F7C59F', '#E37C99']
      },
      clasica: {
        nombre: 'Clásica Icónica',
        frase: 'El rojo perfecto nunca falla.',
        desc: 'Elegancia sin esfuerzo: forma oval, rojo intenso y un brillo impecable. Lo tuyo es la sofisticación de siempre, ejecutada a la perfección.',
        img: 'rojo-lumina',
        servicios: ['esm-rusa-semi', 'man-ritual', 'tra-parafina'],
        look: { color: '#9E0F27', nombre: 'Rubí Lúmina', acabado: 'brillo', forma: 'oval', largo: 0.4 },
        paleta: ['#9E0F27', '#C8102E', '#560A1C', '#E6C3AA']
      },
      dark: {
        nombre: 'Dark Couture',
        frase: 'Misteriosa, magnética, de alta costura.',
        desc: 'Negros profundos, burdeos, esmeraldas y detalles en oro. Formas afiladas y acabados terciopelo para una elegancia con carácter.',
        img: 'cat-eye-esmeralda',
        servicios: ['ext-acrilico', 'art-cateye', 'art-pandeoro'],
        look: { color: '#0F5C46', nombre: 'Esmeralda', acabado: 'cateye', forma: 'stiletto', largo: 0.85 },
        paleta: ['#141414', '#0F5C46', '#6B1027', '#D4AF37']
      }
    }
  }
};

/* Utilidades de búsqueda rápidas */
L.data.servicioPorId = (function () {
  const map = {};
  L.data.categorias.forEach(c => c.servicios.forEach(s => { map[s.id] = Object.assign({ cat: c.id }, s); }));
  return id => map[id];
})();
