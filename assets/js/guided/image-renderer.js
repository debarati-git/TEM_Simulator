/* =========================================================================
   Guided Simulator — Viewing Screen Renderer
   Updates the round phosphor screen based on state. The render is pure:
   state in, DOM updates out. No business logic.

   Visual layers (from back to front):
   1. Black background (always)
   2. Beam spot (when beamOn): position from beamShift, size/brightness
      from brightness, shape from stigmator
   3. Sample image (when imaging mode + magnification set): swap from
      pre-rendered set per mag level, with focus blur
   4. Wobbler animation (when wobblerOn): horizontal oscillation tied to
      stageZ deviation from zero
   ========================================================================= */

(function () {
  'use strict';

  let screenEl, emptyEl, beamEl, sampleEl;

  function init() {
    screenEl = document.getElementById('view-screen');
    emptyEl  = document.getElementById('view-empty');
    if (!screenEl) return;

    // Inject the rendering layers once. CSS handles the visual styling.
    if (!screenEl.querySelector('.view-beam')) {
      const beam = document.createElement('div');
      beam.className = 'view-beam';
      screenEl.appendChild(beam);

      const sample = document.createElement('div');
      sample.className = 'view-sample';
      screenEl.appendChild(sample);
    }
    beamEl   = screenEl.querySelector('.view-beam');
    sampleEl = screenEl.querySelector('.view-sample');

    // Subscribe to every state change and re-render
    TEM.state.subscribe(() => render());
    render();
  }

  function render() {
    if (!screenEl) return;
    const s = TEM.state.getAll();

    const screenActive = s.beamOn;        // beam on → screen lights up
    const showSample   = screenActive && s.mode === 'imaging' && s.magnification;

    // Empty placeholder visible only before beam-on
    if (emptyEl) emptyEl.style.opacity = screenActive ? '0' : '1';

    // ----- Beam spot -----
    if (beamEl) {
      if (screenActive && !showSample) {
        beamEl.style.opacity = '1';

        // Brightness drives size and luminosity (50 baseline; 100 = full diverge)
        const b = s.brightness / 100;                  // 0..1
        const size = 18 + b * 70;                      // 18% → 88% of screen
        beamEl.style.width  = `${size}%`;
        beamEl.style.height = `${size}%`;

        // Brightness vs. fill: at low brightness the spot is tiny and bright;
        // at high brightness it expands and dims slightly (real diverged beam behaviour)
        const luminance = 0.4 + (1 - Math.abs(b - 0.5) * 2) * 0.6;
        beamEl.style.setProperty('--lum', luminance.toFixed(2));

        // Beam shift offsets the centre in screen %
        const shiftX = (s.beamShift?.x ?? 0) * 0.6;    // -50..50 → -30%..30%
        const shiftY = (s.beamShift?.y ?? 0) * 0.6;
        beamEl.style.left = `calc(50% + ${shiftX}% - ${size/2}%)`;
        beamEl.style.top  = `calc(50% - ${shiftY}% - ${size/2}%)`;

        // Stigmator distorts the spot into an ellipse
        const stigX = (s.stigmator?.x ?? 0) / 50;      // -1..1
        const stigY = (s.stigmator?.y ?? 0) / 50;
        const sx = 1 + stigX * 0.35;
        const sy = 1 - stigY * 0.35;
        // Astigmatism rotates with the diagonal — combine x+y for rotation hint
        const rot = (stigX + stigY) * 12;
        beamEl.style.transform = `scale(${sx}, ${sy}) rotate(${rot}deg)`;
      } else {
        beamEl.style.opacity = '0';
      }
    }

    // ----- Sample image -----
    if (sampleEl) {
      if (showSample) {
        const mag = s.magnification;          // 'low' | 'medium' | 'high'
        sampleEl.dataset.mag = mag;
        sampleEl.style.opacity = '1';

        // Focus blur — distance from 0
        const blur = Math.max(0, Math.abs(s.focus ?? 0) / 5);     // 0..10px
        sampleEl.style.filter = `blur(${blur.toFixed(1)}px)`;

        // Stage offset within field of view — at higher mag, smaller stage delta
        // translates to more on-screen movement
        const magScale = mag === 'low' ? 0.4 : mag === 'medium' ? 1.0 : 2.5;
        const sx = -(s.stageX ?? 0) * 0.3 * magScale;
        const sy =  (s.stageY ?? 0) * 0.3 * magScale;
        sampleEl.style.transform = `translate(${sx}%, ${sy}%)`;
      } else {
        sampleEl.style.opacity = '0';
        sampleEl.dataset.mag = '';
      }
    }

    // ----- Wobbler animation: applied to whole screen-content -----
    if (s.wobblerOn && screenEl) {
      const amp = Math.min(8, Math.abs(s.stageZ ?? 0) * 0.4);   // 0..8 px
      screenEl.style.setProperty('--wobble-amp', `${amp}px`);
      screenEl.classList.add('is-wobbling');
    } else {
      screenEl.classList.remove('is-wobbling');
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.imageRenderer = { init, render };
})();
