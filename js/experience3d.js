/**
 * Nomad & Nook — Atmospheric Depth & Particle WebGL Engine (Argentina Edition)
 * Living environmental layers synchronized with Argentina's geography:
 * - Subtle, restrained micro-particles (Zero intrusive huge blobs)
 * - Crystal clear legibility across all sections and footer
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error('Three.js is required.');
    return;
  }

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.5, 2400);
  camera.position.set(0, 0, 100);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // =========================================================================
  // 1. PROCEDURAL TEXTURES
  // =========================================================================

  function cvs(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  function texMist() {
    const W = 512, H = 256, c = cvs(W, H), x = c.getContext('2d');
    const g = x.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2);
    g.addColorStop(0.0, 'rgba(235, 245, 255, 0.40)');
    g.addColorStop(0.4, 'rgba(195, 220, 245, 0.18)');
    g.addColorStop(0.75, 'rgba(150, 190, 220, 0.04)');
    g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    return c;
  }

  function texMote() {
    const S = 32, c = cvs(S, S), x = c.getContext('2d');
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0.0, 'rgba(255, 255, 255, 0.9)');
    g.addColorStop(0.4, 'rgba(248, 246, 240, 0.4)');
    g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return c;
  }

  const mistTex = new THREE.CanvasTexture(texMist());
  const moteTex = new THREE.CanvasTexture(texMote());

  // =========================================================================
  // 2. 3-TIER SOUTHERN SPECTRAL STARFIELD (Cruz del Sur & Magallanes)
  // =========================================================================

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const starCounts = [6000, 2500, 800];
  const starSizes  = [0.9 * dpr, 1.5 * dpr, 2.4 * dpr];
  const spectralColors = [
    new THREE.Color(0xaec8ff),
    new THREE.Color(0xf6f8fc),
    new THREE.Color(0xfff0db),
    new THREE.Color(0xffd19c)
  ];

  const starGroups = new THREE.Group();
  starCounts.forEach((count, tier) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 1200;
      pos[i * 3 + 1] = Math.random() * 600 - 50;
      pos[i * 3 + 2] = -300 - Math.random() * 500;
      const c = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const mat = new THREE.PointsMaterial({
      size: starSizes[tier],
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    starGroups.add(new THREE.Points(geo, mat));
  });
  scene.add(starGroups);

  // =========================================================================
  // 3. PATAGONIAN ALPINE SNOWFALL (Subtle & Restrained)
  // =========================================================================

  const snowCount = 400; // Drastically reduced for clean elegance
  const snowGeo = new THREE.BufferGeometry();
  const snowPos = new Float32Array(snowCount * 3);
  const snowVel = new Float32Array(snowCount * 3);

  for (let i = 0; i < snowCount; i++) {
    snowPos[i * 3]     = (Math.random() - 0.5) * 800;
    snowPos[i * 3 + 1] = Math.random() * 500 - 200;
    snowPos[i * 3 + 2] = (Math.random() - 0.5) * 400;

    snowVel[i * 3]     = (Math.random() - 0.5) * 8;
    snowVel[i * 3 + 1] = -(25 + Math.random() * 30);
    snowVel[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

  const snowMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.2 * dpr,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const snowMesh = new THREE.Points(snowGeo, snowMat);
  scene.add(snowMesh);

  // =========================================================================
  // 4. FLOATING SUBTLE MICRO-MOTES (Pin-Point Dust, No Blobs)
  // =========================================================================

  const moteCount = 50; // Only 50 subtle pin-points
  const moteGeo = new THREE.BufferGeometry();
  const motePos = new Float32Array(moteCount * 3);
  const moteSeeds = new Float32Array(moteCount * 3);

  for (let i = 0; i < moteCount; i++) {
    motePos[i * 3]     = (Math.random() - 0.5) * 600;
    motePos[i * 3 + 1] = (Math.random() - 0.5) * 400;
    motePos[i * 3 + 2] = (Math.random() - 0.5) * 200;

    moteSeeds[i * 3]     = 0.4 + Math.random() * 0.8;
    moteSeeds[i * 3 + 1] = Math.random() * Math.PI * 2;
    moteSeeds[i * 3 + 2] = 0.5 + Math.random() * 0.5;
  }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));

  const moteMat = new THREE.PointsMaterial({
    map: moteTex,
    color: 0xf8f6f0,
    size: 2.5 * dpr, // Small pin-point size
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const moteMesh = new THREE.Points(moteGeo, moteMat);
  scene.add(moteMesh);

  // =========================================================================
  // 5. RESTRAINED VOLUMETRIC MIST PLANES (Low Opacity)
  // =========================================================================

  const mistPlanes = [];
  const mistConfigs = [
    { x: -80, y: -40, z: -120, w: 500, h: 140, opacity: 0.08, speed: 0.04, col: 0xd0e2f2 },
    { x: 90,  y: -20, z: -200, w: 600, h: 180, opacity: 0.10, speed: 0.03, col: 0xc4dbee },
    { x: 0,   y: 60,  z: -280, w: 700, h: 220, opacity: 0.06, speed: 0.02, col: 0xb0ccdf }
  ];

  mistConfigs.forEach(cfg => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(cfg.w, cfg.h),
      new THREE.MeshBasicMaterial({
        map: mistTex,
        color: cfg.col,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    mesh.position.set(cfg.x, cfg.y, cfg.z);
    mesh.userData = { baseX: cfg.x, baseY: cfg.y, speed: cfg.speed };
    mistPlanes.push(mesh);
    scene.add(mesh);
  });

  // =========================================================================
  // 6. USHUAIA LIGHTHOUSE BEAM (Subtle, Background Placed)
  // =========================================================================

  const laserGeo = new THREE.CylinderGeometry(0.5, 0.5, 600, 8);
  laserGeo.translate(0, 300, 0);
  laserGeo.rotateZ(-0.28);
  laserGeo.rotateX(0.10);

  const laserMat = new THREE.MeshBasicMaterial({
    color: 0x48e0ff,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const laserMesh = new THREE.Mesh(laserGeo, laserMat);
  laserMesh.position.set(160, -80, -350); // Moved to right background away from central text
  scene.add(laserMesh);

  // =========================================================================
  // 7. SCROLL INTERPOLATION & ATMOSPHERIC PROFILES
  // =========================================================================

  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentScrollState = { smooth: 0 };

  const chapterAtmospheres = [
    { snowOp: 0.0,  starOp: 0.20, moteOp: 0.20, laserOp: 0.0,  mistOp: 0.06 }, // 00 Prólogo
    { snowOp: 0.0,  starOp: 0.25, moteOp: 0.25, laserOp: 0.0,  mistOp: 0.05 }, // 01 Norte
    { snowOp: 0.0,  starOp: 0.10, moteOp: 0.10, laserOp: 0.0,  mistOp: 0.08 }, // 02 Misiones
    { snowOp: 0.0,  starOp: 0.20, moteOp: 0.20, laserOp: 0.0,  mistOp: 0.05 }, // 03 Cuyo
    { snowOp: 0.40, starOp: 0.30, moteOp: 0.05, laserOp: 0.0,  mistOp: 0.08 }, // 04 Patagonia
    { snowOp: 0.0,  starOp: 0.55, moteOp: 0.00, laserOp: 0.25, mistOp: 0.04 }, // 05 Ushuaia
    { snowOp: 0.0,  starOp: 0.25, moteOp: 0.00, laserOp: 0.0,  mistOp: 0.00 }, // 06 Travesías
    { snowOp: 0.0,  starOp: 0.15, moteOp: 0.00, laserOp: 0.0,  mistOp: 0.00 }  // 07 Comisión / Footer
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function updateAtmosphere(progress) {
    const maxIdx = chapterAtmospheres.length - 1;
    const p = clamp(progress, 0, maxIdx);
    const i = Math.floor(p);
    const nextI = Math.min(maxIdx, i + 1);
    const t = p - i;

    const cur = chapterAtmospheres[i];
    const nxt = chapterAtmospheres[nextI];

    snowMat.opacity = lerp(cur.snowOp, nxt.snowOp, t);
    moteMat.opacity = lerp(cur.moteOp, nxt.moteOp, t);
    laserMat.opacity = lerp(cur.laserOp, nxt.laserOp, t);

    const curStarOp = lerp(cur.starOp, nxt.starOp, t);
    starGroups.children.forEach(pts => { pts.material.opacity = curStarOp; });

    const curMistOp = lerp(cur.mistOp, nxt.mistOp, t);
    mistPlanes.forEach(m => { m.material.opacity = curMistOp; });
  }

  // Pointer Parallax
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  });

  // Render Loop
  let lastTime = performance.now();
  let time = 0;

  function render(now) {
    requestAnimationFrame(render);
    if (document.hidden) return;

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    time += dt;

    mouse.x += (mouse.targetX - mouse.x) * 4.0 * dt;
    mouse.y += (mouse.targetY - mouse.y) * 4.0 * dt;

    const px = isReducedMotion ? 0 : mouse.x * 8;
    const py = isReducedMotion ? 0 : mouse.y * 4;
    const breathY = isReducedMotion ? 0 : Math.sin(time * 0.8) * 1.0;

    camera.position.x = px;
    camera.position.y = py + breathY;
    camera.lookAt(0, 0, -200);

    updateAtmosphere(currentScrollState.smooth || 0);

    // Alpine Snow Physics
    if (snowMat.opacity > 0.01) {
      const pos = snowGeo.attributes.position.array;
      for (let i = 0; i < snowCount; i++) {
        pos[i * 3]     += (snowVel[i * 3] + Math.sin(time + i * 0.5) * 3.0) * dt;
        pos[i * 3 + 1] += snowVel[i * 3 + 1] * dt;
        pos[i * 3 + 2] += snowVel[i * 3 + 2] * dt;

        if (pos[i * 3 + 1] < -250) {
          pos[i * 3 + 1] = 250;
          pos[i * 3] = (Math.random() - 0.5) * 800;
        }
      }
      snowGeo.attributes.position.needsUpdate = true;
    }

    // Micro Mote Physics
    if (moteMat.opacity > 0.01) {
      const mPos = moteGeo.attributes.position.array;
      for (let i = 0; i < moteCount; i++) {
        mPos[i * 3]     += Math.sin(time * 0.7 + moteSeeds[i * 3 + 1]) * 2.0 * dt;
        mPos[i * 3 + 1] += Math.cos(time * 0.5 + moteSeeds[i * 3 + 1]) * 1.5 * dt;
      }
      moteGeo.attributes.position.needsUpdate = true;
    }

    // Mist Planes Drift
    mistPlanes.forEach(m => {
      m.position.x = m.userData.baseX + Math.sin(time * m.userData.speed) * 12.0;
      m.position.y = m.userData.baseY + Math.cos(time * (m.userData.speed * 0.7)) * 3.0;
    });

    renderer.render(scene, camera);
  }

  requestAnimationFrame(render);

  window.NomadExperience = {
    updateWorldState: function (state) {
      currentScrollState = state;
    },
    setReducedMotion: function (reduce) {
      isReducedMotion = reduce;
    }
  };
})();
