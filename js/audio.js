/**
 * Nomad & Nook — Procedural Web Audio Soundscape Synthesizer (Argentina Edition)
 * Zero External Audio Files — 100% Procedurally Synthesized Ambient Journey
 * Generates Andean Puna breeze, Iguazú waterfall roar, Cuyo canyon resonance,
 * Patagonian glacial wind, and Beagle Channel oceanic swell.
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;

  // Biome Audio Gain Nodes
  let punaGain = null;
  let waterfallGain = null;
  let canyonGain = null;
  let glacierGain = null;
  let beagleGain = null;

  function initAudio() {
    if (audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Pink Noise Generator for Natural Wind & Water
    const bufferSize = audioCtx.sampleRate * 4;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
      b6 = white * 0.115926;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // 1. Puna Wind (High Altitude Gentle Filter)
    const punaFilter = audioCtx.createBiquadFilter();
    punaFilter.type = 'bandpass';
    punaFilter.frequency.setValueAtTime(480, audioCtx.currentTime);
    punaFilter.Q.setValueAtTime(2.0, audioCtx.currentTime);

    punaGain = audioCtx.createGain();
    punaGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    noiseSource.connect(punaFilter);
    punaFilter.connect(punaGain);
    punaGain.connect(masterGain);

    // 2. Iguazú Waterfall Roar (Lowpass Rich Swell)
    const waterFilter = audioCtx.createBiquadFilter();
    waterFilter.type = 'lowpass';
    waterFilter.frequency.setValueAtTime(320, audioCtx.currentTime);

    waterfallGain = audioCtx.createGain();
    waterfallGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    noiseSource.connect(waterFilter);
    waterFilter.connect(waterfallGain);
    waterfallGain.connect(masterGain);

    // 3. Cuyo & Talampaya Canyon Resonance (Warm Triad Drone)
    canyonGain = audioCtx.createGain();
    canyonGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    [110, 164.81, 220].forEach(freq => {
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      const f = audioCtx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(340, audioCtx.currentTime);
      osc.connect(f);
      f.connect(canyonGain);
      osc.start();
    });
    canyonGain.connect(masterGain);

    // 4. Patagonian Glacial Wind & Ice Shimmer
    const glacierFilter = audioCtx.createBiquadFilter();
    glacierFilter.type = 'bandpass';
    glacierFilter.frequency.setValueAtTime(820, audioCtx.currentTime);
    glacierFilter.Q.setValueAtTime(4.5, audioCtx.currentTime);

    glacierGain = audioCtx.createGain();
    glacierGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    noiseSource.connect(glacierFilter);
    glacierFilter.connect(glacierGain);
    glacierGain.connect(masterGain);

    // 5. Beagle Channel Oceanic Swell & Southern Stars
    beagleGain = audioCtx.createGain();
    beagleGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    [528, 660, 792, 1056].forEach(freq => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.03, audioCtx.currentTime);
      osc.connect(g);
      g.connect(beagleGain);
      osc.start();
    });
    beagleGain.connect(masterGain);

    noiseSource.start();
  }

  function setBiomeMix(biomeIndex) {
    if (!audioCtx || !isPlaying) return;
    const t = audioCtx.currentTime + 0.1;
    const fade = 1.4;

    const gPuna = biomeIndex <= 1 ? 0.35 : 0.03;
    const gWater = biomeIndex === 2 ? 0.45 : 0.02;
    const gCanyon = biomeIndex === 3 ? 0.30 : 0.02;
    const gGlacier = biomeIndex === 4 ? 0.40 : 0.02;
    const gBeagle = biomeIndex >= 5 ? 0.35 : 0.02;

    if (punaGain) punaGain.gain.setTargetAtTime(gPuna, t, fade);
    if (waterfallGain) waterfallGain.gain.setTargetAtTime(gWater, t, fade);
    if (canyonGain) canyonGain.gain.setTargetAtTime(gCanyon, t, fade);
    if (glacierGain) glacierGain.gain.setTargetAtTime(gGlacier, t, fade);
    if (beagleGain) beagleGain.gain.setTargetAtTime(gBeagle, t, fade);
  }

  function toggleAudio() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const btn = document.getElementById('audio-toggle');
    if (!isPlaying) {
      isPlaying = true;
      masterGain.gain.setTargetAtTime(0.7, audioCtx.currentTime, 1.2);
      if (btn) btn.classList.add('is-playing');
    } else {
      isPlaying = false;
      masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.8);
      if (btn) btn.classList.remove('is-playing');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('audio-toggle');
    if (btn) btn.addEventListener('click', toggleAudio);
  });

  window.NomadAudio = {
    toggle: toggleAudio,
    setBiomeMix: setBiomeMix
  };
})();
