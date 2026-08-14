/**
 * Nomad & Nook — Scroll Conductor Bridge (Argentina Edition)
 * Connects MengTo native scroll conductor with 3D world, HUD readouts, and navigation rail.
 */

(function () {
  'use strict';

  if (typeof createScrollConductor !== 'function') {
    console.error('createScrollConductor is required.');
    return;
  }

  const sections = document.querySelectorAll('.hero-section, .chapter-section, .curated-section, .commission-section');
  const hudCoords = document.getElementById('hud-coords-val');
  const hudElevation = document.getElementById('hud-elev-val');
  const hudBiome = document.getElementById('hud-biome-val');
  const railProgressBar = document.querySelector('.rail-progress-bar');
  const railItems = document.querySelectorAll('.rail-item');
  const navLinks = document.querySelectorAll('.nav-link');

  const videoTracks = [
    document.getElementById('video-track-0'),
    document.getElementById('video-track-1'),
    document.getElementById('video-track-2'),
    document.getElementById('video-track-3'),
    document.getElementById('video-track-4')
  ];

  function updateVideoTracks(chapterIndex) {
    let trackIdx = 0;
    if (chapterIndex <= 1) trackIdx = 0;
    else if (chapterIndex === 2) trackIdx = 1;
    else if (chapterIndex === 3) trackIdx = 2;
    else if (chapterIndex === 4) trackIdx = 3;
    else trackIdx = 4;

    videoTracks.forEach((video, i) => {
      if (!video) return;
      const isActive = i === trackIdx;
      video.classList.toggle('is-active', isActive);
      if (isActive) {
        if (video.paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
        }
      } else {
        setTimeout(() => {
          if (!video.classList.contains('is-active') && !video.paused) {
            video.pause();
          }
        }, 1600);
      }
    });
  }

  const biomesData = [
    { name: 'Puna Jujeña & Quebrada', coords: '23°44′48″S 65°29′57″W', elev: '+2.320 m' },
    { name: 'Quebrada de Humahuaca & Salinas', coords: '23°44′48″S 65°29′57″W', elev: '+2.320 m' },
    { name: 'Selva Misionera & Iguazú', coords: '25°41′43″S 54°26′12″W', elev: '+195 m' },
    { name: 'Cañón de Talampaya & Puna', coords: '29°48′11″S 67°59′42″W', elev: '+1.300 m' },
    { name: 'Monte Fitz Roy & Glaciares', coords: '49°16′15″S 73°02′44″W', elev: '+180 m' },
    { name: 'Canal Beagle & Fin del Mundo', coords: '54°48′26″S 68°18′14″W', elev: '+0 m' },
    { name: 'Atelier Nomad & Nook Argentina', coords: '54°48′26″S 68°18′14″W', elev: '+0 m' },
    { name: 'Comisión Privada Argentina', coords: '54°48′26″S 68°18′14″W', elev: '+0 m' }
  ];

  const conductor = createScrollConductor({
    sections: sections,
    damping: 5.2,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    onUpdate: function (state) {
      // 1. Update Three.js Environmental World
      if (window.NomadExperience && typeof window.NomadExperience.updateWorldState === 'function') {
        window.NomadExperience.updateWorldState(state);
      }

      // 2. Update Destination Rail Progress Fill via GPU Composited Transform
      if (railProgressBar) {
        railProgressBar.style.transform = 'scaleY(' + state.normalizedSmooth + ')';
      }

      // 3. Update HUD Data & Auto-hide at Colophon
      const activeIdx = Math.min(biomesData.length - 1, state.smoothIndex);
      const biome = biomesData[activeIdx] || biomesData[0];

      if (hudCoords && hudCoords.textContent !== biome.coords) hudCoords.textContent = biome.coords;
      if (hudElevation && hudElevation.textContent !== biome.elev) hudElevation.textContent = biome.elev;
      if (hudBiome && hudBiome.textContent !== biome.name) hudBiome.textContent = biome.name;

      // 4. Smooth Fade for Scroll Invitation
      const scrollInv = document.querySelector('.scroll-invitation');
      if (scrollInv) {
        const heroOpacity = Math.max(0, 1 - state.smoothIndex * 2.5);
        scrollInv.style.opacity = heroOpacity;
        scrollInv.style.pointerEvents = heroOpacity <= 0.05 ? 'none' : 'auto';
        scrollInv.style.transform = 'translateY(' + (state.smoothIndex * 15) + 'px)';
      }
    },
    onChapterChange: function (index, state) {
      // Synchronize Destination Rail Active Class
      railItems.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
      });

      // Synchronize Nav Links
      navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === index - 1);
      });

      // Synchronize Mobile Spatial Pill Readout
      const mobileSpatialText = document.getElementById('mobile-spatial-text');
      if (mobileSpatialText && biomesData[index]) {
        const b = biomesData[index];
        const shortName = b.name.split('&')[0].trim();
        mobileSpatialText.textContent = `0${index} · ${shortName} · ${b.elev}`;
      }

      // Synchronize Audio Biome Synthesizer
      if (window.NomadAudio && typeof window.NomadAudio.setBiomeMix === 'function') {
        window.NomadAudio.setBiomeMix(index);
      }

      // Synchronize Background Video Tracks
      updateVideoTracks(index);
    }
  });

  conductor.start();
  window.NomadConductor = conductor;

  // Remeasure on font & image settlement
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      conductor.measure();
      conductor.read();
    });
  }

  // Listen for reduced motion changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
    conductor.setReducedMotion(e.matches);
    if (window.NomadExperience) {
      window.NomadExperience.setReducedMotion(e.matches);
    }
  });

  // Smooth Anchor Navigation via Conductor goTo
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });
})();
