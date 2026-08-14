/**
 * Nomad & Nook — Argentina Editorial Dossiers & Interactive Controllers
 * Manages modal dossiers, commission form validation, and typography animations.
 */

(function () {
  'use strict';

  // Archival Dossier Master Records for Argentina Monograph
  const dossiers = {
    purmamarca: {
      region: 'norte',
      tag: 'PLACA I · JUJUY · NORTE ANDINO',
      title: 'Cerro de los Siete Colores & Purmamarca',
      meta: 'Altitud: +2.320 m · Coordenadas: 23°44′48″S 65°29′57″W · Siglo XVII',
      img: 'images/arg-norte-1.webp',
      body: `
        <p>Al pie de la Quebrada de Humahuaca, Purmamarca se erige como una joya arquitectónica del norte argentino. Sus construcciones de adobe blanqueado con cal, techos de vigas de cardón y paja embarrada, se recortan contra la imponente masa mineral del Cerro de los Siete Colores.</p>
        <p>Los estratos geológicos representan más de seiscientos millones de años de historia terrestre: pigmentos de origen marino del Cámbrico, limolitas rojizas del Terciario y areniscas ocres del Mesozoico que adquieren su máximo esplendor visual durante la primera hora del amanecer.</p>
        <blockquote>«El silencio de la Puna no es ausencia de sonido, sino la respiración pura de la piedra y el viento andino.»</blockquote>
        <p>Nuestras travesías privadas incluyen acceso exclusivo a los senderos arqueológicos de Los Colorados con guías de la comunidad kolla y pernocte en residencias privadas de arquitectura tradicional de adobe.</p>
      `
    },
    salinas: {
      region: 'norte',
      tag: 'PLACA II · JUJUY & SALTA · PUNA',
      title: 'Salinas Grandes & El Espejo de Salitre',
      meta: 'Altitud: +3.450 m · Superficie: 212 km² · Cuenca Endorreica',
      img: 'images/arg-norte-2.webp',
      body: `
        <p>A más de tres mil cuatrocientos metros sobre el nivel del mar, las Salinas Grandes extienden un desierto blanco de cristal de sal que une las provincias de Jujuy y Salta. Su costra salina de hasta medio metro de espesor resguarda lagunas subterráneas ricas en minerales.</p>
        <p>Los piletones geométricos de evaporación artesanal reflejan con nitidez quirúrgica el azul cobalto del cielo puneño y los volcanes lejanos, creando una experiencia de desorientación espacial y belleza abstracta irrepetible.</p>
        <p>La experiencia Nomad & Nook organiza almuerzos privados de alta cocina andina servidos sobre mesas de sal en el centro del salar, con vinos de altura de Cafayate y traslados en vehículos todoterreno de expedición.</p>
      `
    },
    iguazu: {
      region: 'litoral',
      tag: 'PLACA III · MISIONES · PARQUE NACIONAL IGUAZÚ',
      title: 'Garganta del Diablo & Saltos Mayores',
      meta: 'Altitud: +195 m · Caudal: 1.500 m³/s · Patrimonio Mundial UNESCO',
      img: 'images/arg-litoral-1.webp',
      body: `
        <p>La Garganta del Diablo es la mayor expresión de fuerza fluvial del continente. Con más de ochenta metros de caída libre en forma de herradura, concentra el flujo de las doscientas setenta y cinco cascadas que componen las Cataratas del Iguazú.</p>
        <p>El vapor pulverizado por el impacto crea un microclima perpetuo donde prosperan orquídeas endémicas, bromelias y bandadas de vencejos de cascada que anidan en las grietas detrás del torrente de agua.</p>
        <p>Coordinamos ingresos al parque fuera del horario comercial, permitiendo contemplar la Garganta del Diablo al amanecer en absoluta soledad o durante las noches de plenilunio con el espectáculo lunar sobre la bruma.</p>
      `
    },
    yaboti: {
      region: 'litoral',
      tag: 'PLACA IV · MISIONES · RESERVA DE BIOSFERA YABOTÍ',
      title: 'Ecolodge en la Selva Virgen Paranaense',
      meta: 'Reserva Natural: 250.000 ha · Río Yabotí · Bosque Atlántico',
      img: 'images/arg-litoral-2.webp',
      body: `
        <p>En el corazón de la Reserva de Biosfera Yabotí, el bosque atlántico paranaense conserva uno de los ecosistemas con mayor biodiversidad del planeta. Lapachos amarillos, cañafístolas y helechos arborescentes forman un dosel verde continuo.</p>
        <p>Los pabellones de madera de reforestación y vidrio se elevan sobre pilotes de madera dura a orillas de ríos cristalinos, ofreciendo un refugio de diseño minimalista con gastronomía basada en ingredientes de la selva y pesca sustentable.</p>
        <p>Actividades curadas: navegación en kayak por los saltos del Moconá, etnobotánica guiada por guardaparques y avistaje nocturno de fauna silvestre misionera.</p>
      `
    },
    talampaya: {
      region: 'cuyo',
      tag: 'PLACA V · LA RIOJA & SAN JUAN · CUYO',
      title: 'Farallones del Cañón de Talampaya',
      meta: 'Altitud: +1.300 m · Muros: 150 m · Yacimiento Fósil Triásico',
      img: 'images/arg-cuyo-1.webp',
      body: `
        <p>El Parque Nacional Talampaya resguarda un cañón monumental esculpido por el agua y el viento a lo largo de millones de años. Sus farallones verticales de arenisca roja alcanzan los ciento cincuenta metros de altura, arrojando sombras teatrales al atardecer.</p>
        <p>Junto al vecino Ischigualasto (Valle de la Luna), constituye el registro fósil continental más completo del período Triásico en todo el planeta, cuando los primeros dinosaurios comenzaron a poblar la Tierra.</p>
        <p>Nuestra travesía incluye safaris en vehículos 4x4 descapotables por el cauce seco del río Talampaya, visitas a los petroglifos de la Puerta del Cañón y catas de Torrontés riojano bajo el cielo estrellado.</p>
      `
    },
    catamarca: {
      region: 'cuyo',
      tag: 'PLACA VI · CATAMARCA · ANTOFAGASTA DE LA SIERRA',
      title: 'Campo de Piedra Pómez & Desierto Puneño',
      meta: 'Altitud: +3.050 m · Formación: Erupción Volcán Robledo · Cordillera Andina',
      img: 'images/arg-cuyo-2.webp',
      body: `
        <p>Ubicado en la Puna catamarqueña, el Campo de Piedra Pómez es uno de los paisajes más extraños e hipnóticos de la Tierra. Una extensión de más de veinticinco kilómetros de rocas de ceniza volcánica blanca, esculpidas por vientos implacables en formas de crestas marinas, dunas petrificadas y tótems gigantes.</p>
        <p>Rodeado de conos volcánicos negros y dunas de arena dorada, el contraste cromático y la pureza del aire a más de tres mil metros transmiten una sensación de viaje extraterrestre.</p>
        <p>Acceso por helicóptero privado o expedición en convoy 4x4 con campamentos de lujo temporales (glamping safari) montados exclusivamente para nuestros huéspedes.</p>
      `
    },
    fitzroy: {
      region: 'patagonia',
      tag: 'PLACA VII · SANTA CRUZ · EL CHALTÉN',
      title: 'Monte Fitz Roy & Laguna de los Tres',
      meta: 'Altitud: +3.405 m · Parque Nacional Los Glaciares · Aguja Granítica',
      img: 'images/arg-patagonia-1.webp',
      body: `
        <p>El Monte Fitz Roy (Cerro Chaltén en lengua tehuelche, «montaña que humea») es el ícono absoluto del montañismo patagónico. Sus monolitos verticales de granito rosado se elevan más de dos mil metros sobre el relieve circundante.</p>
        <p>Al amanecer, la refracción de la luz solar enciende las paredes de roca en un rojo fuego incandescente reflejado en las aguas turquesas de la Laguna de los Tres con témpanos flotantes.</p>
        <p>La propuesta Nomad & Nook combina refugios de montaña de diseño con calefacción a leña, chefs privados y ascensiones guiadas con guías certificados UIAGM a miradores vírgenes de la cordillera.</p>
      `
    },
    peritomoreno: {
      region: 'patagonia',
      tag: 'PLACA VIII · SANTA CRUZ · EL CALAFATE',
      title: 'Glaciar Perito Moreno & Campo de Hielo Sur',
      meta: 'Superficie: 250 km² · Frente: 5 km · Altura Frontal: 70 m',
      img: 'images/arg-patagonia-2.webp',
      body: `
        <p>El Glaciar Perito Moreno es una de las mayores maravillas naturales del mundo. Con un frente de cinco kilómetros y murallas que emergen setenta metros sobre el Lago Argentino, es uno de los pocos glaciares que se mantiene en equilibrio dinámico.</p>
        <p>El estruendo de los desprendimientos de bloques de hielo azul eléctrico, seguido del eco en los bosques de lenga y la formación de olas gigantes en el canal de los témpanos, es una experiencia sensorial sobrecogedora.</p>
        <p>Organizamos caminatas privadas sobre el hielo con grampones hacia seracs y cuevas azules profundas, culminando con un brindis de whisky sobre hielo milenario extraído en el momento.</p>
      `
    },
    ushuaia: {
      region: 'ushuaia',
      tag: 'PLACA IX · TIERRA DEL FUEGO · USHUAIA',
      title: 'Faro Les Éclaireurs & Canal Beagle',
      meta: 'Coordenadas: 54°52′S 68°05′W · Construcción: 1920 · Canal MarMaritime Austral',
      img: 'images/arg-ushuaia-1.webp',
      body: `
        <p>En los islotes rocosos del Canal Beagle, la torre troncocónica de diez metros con franjas rojas y blancas del Faro Les Éclaireurs señala el paso de navegantes entre los océanos Atlántico y Pacífico.</p>
        <p>Rodeado de colonias de cormoranes imperiales, lobos marinos de dos pelos y la silueta nevada de los Montes Martial, el faro encarna la épica de los exploradores antárticos.</p>
        <p>Nuestra curaduría incluye expediciones en veleros clásicos de madera por el Paso Moat y avistaje de ballenas jorobadas y delfines australes con biólogos marinos residentes.</p>
      `
    },
    lapataia: {
      region: 'ushuaia',
      tag: 'PLACA X · TIERRA DEL FUEGO · PARQUE NACIONAL',
      title: 'Bahía Lapataia & El Fin del Camino',
      meta: 'Extremo Austral de la Ruta Nacional 3 · Km 3.079 · Fiordo Subantártico',
      img: 'images/arg-ushuaia-2.webp',
      body: `
        <p>Bahía Lapataia marca el límite definitivo de la red vial continental americana: el fin de la mítica Ruta 3 y de la Carretera Panamericana que nace en Alaska a más de diecisiete mil kilómetros al norte.</p>
        <p>En otoño, los bosques de lengas y ñires adquieren tonalidades cobre y carmesí sobre turbales centenarios y costas salpicadas de concheros yámanas milenarios.</p>
        <p>Experiencias privadas: navegación en gomones semirrígidos por la Isla Redonda, cata de centolla fueguina a orillas del fiordo y sobrevuelos en avioneta privada sobre la Cordillera de Darwin.</p>
      `
    }
  };

  // Modal Dialog Controller
  const modal = document.getElementById('dossier-modal');
  const modalContent = document.getElementById('modal-body-content');
  const modalCloseBtn = document.getElementById('modal-close');

  function openDossier(id) {
    const data = dossiers[id];
    if (!data || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-dossier-layout">
        <div class="modal-img-frame">
          <img src="${data.img}" alt="${data.title}" class="modal-dossier-img">
        </div>
        <div class="modal-text-frame">
          <span class="card-tag">${data.tag}</span>
          <h2 id="modal-title" class="modal-dossier-title">${data.title}</h2>
          <div class="modal-dossier-meta">${data.meta}</div>
          <div class="modal-dossier-copy">${data.body}</div>
          <div class="modal-dossier-actions">
            <a href="#commission" class="btn-monograph dossier-commission-cta" data-dossier-region="${data.region || 'norte'}">Comisionar Esta Travesía</a>
          </div>
        </div>
      </div>
    `;

    // Connect Dossier CTA to pre-select region in the commission form
    const cta = modalContent.querySelector('.dossier-commission-cta');
    if (cta) {
      cta.addEventListener('click', () => {
        const reg = cta.getAttribute('data-dossier-region');
        const regionSelect = document.getElementById('client-region');
        if (regionSelect && reg) {
          regionSelect.value = reg;
        }
        modal.close();
      });
    }

    modal.showModal();
  }

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  }

  // Attach card and trigger click handlers
  document.querySelectorAll('.editorial-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-dossier');
      if (id) openDossier(id);
    });
  });

  document.querySelectorAll('.media-center-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = trigger.closest('.editorial-card');
      if (card) {
        const id = card.getAttribute('data-dossier');
        if (id) openDossier(id);
      }
    });
  });

  // Commission Form & Luxury Atelier Voucher Controller
  const form = document.getElementById('commission-form');
  const formStatus = document.getElementById('form-status');
  const voucherModal = document.getElementById('voucher-modal');
  const voucherCloseBtn = document.getElementById('voucher-close');
  const voucherDismissBtn = document.getElementById('voucher-dismiss-btn');

  if (form && formStatus) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements['name']?.value?.trim();
      const email = form.elements['email']?.value?.trim();
      const regionSelect = form.elements['region'];
      const regionText = regionSelect ? regionSelect.options[regionSelect.selectedIndex].text : 'Travesía por Argentina';

      if (!name || !email) {
        formStatus.textContent = 'Por favor complete su nombre y correo para procesar la comisión.';
        formStatus.className = 'form-status is-error';
        return;
      }

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const refCode = `#NN-ARG-2026-${randomDigits}`;

      if (voucherModal) {
        const refEl = document.getElementById('voucher-ref-code');
        const clientEl = document.getElementById('voucher-client-name');
        const regEl = document.getElementById('voucher-region-name');
        const dateEl = document.getElementById('voucher-date-val');

        if (refEl) refEl.textContent = refCode;
        if (clientEl) clientEl.textContent = name;
        if (regEl) regEl.textContent = regionText;
        if (dateEl) dateEl.textContent = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });

        voucherModal.showModal();
      }

      formStatus.textContent = `Estimado/a ${name}, su solicitud (${refCode}) para la expedición por Argentina ha sido recibida en el Atelier.`;
      formStatus.className = 'form-status is-success';
      form.reset();
    });
  }

  if (voucherModal) {
    if (voucherCloseBtn) {
      voucherCloseBtn.addEventListener('click', () => voucherModal.close());
    }
    if (voucherDismissBtn) {
      voucherDismissBtn.addEventListener('click', () => voucherModal.close());
    }
    voucherModal.addEventListener('click', (e) => {
      if (e.target === voucherModal) voucherModal.close();
    });
  }

  // Mobile Spatial HUD Pill & Drawer Controller
  const mobilePill = document.getElementById('mobile-spatial-pill');
  const mobileDrawer = document.getElementById('mobile-chapter-drawer');

  if (mobilePill && mobileDrawer) {
    mobilePill.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobilePill.classList.toggle('is-open');
      mobileDrawer.classList.toggle('is-open', isOpen);
      mobilePill.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    mobileDrawer.querySelectorAll('.mobile-chapter-link').forEach(link => {
      link.addEventListener('click', () => {
        mobilePill.classList.remove('is-open');
        mobileDrawer.classList.remove('is-open');
        mobilePill.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobilePill.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobilePill.classList.remove('is-open');
        mobileDrawer.classList.remove('is-open');
        mobilePill.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Custom Cursor Magnetic & Spring Interpolation
  const cursor = document.getElementById('custom-cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isVisible = false;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      isVisible = true;
    });

    function updateCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      const ring = cursor.querySelector('.cursor-ring');
      if (ring) {
        ring.style.transform = `translate3d(${ringX - mouseX}px, ${ringY - mouseY}px, 0)`;
      }

      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Event delegation for interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .editorial-card, .curated-journey-card, input, select, textarea, [data-dossier]')) {
        cursor.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .editorial-card, .curated-journey-card, input, select, textarea, [data-dossier]')) {
        cursor.classList.remove('is-hovering');
      }
    });
  }

})();
