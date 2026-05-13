/* =========================================================================
   Guided Simulator — Viewing Screen Renderer
   Pure state→DOM mapping. State changes → renderer reads → DOM updates.

   Layered visuals (back to front):
     1. Background          — phosphor (green tinted) OR camera (neutral grey)
     2. Sample image        — real PNG, scaled per magnification level
     3. Beam spot           — circular gradient, position/size/stigmation from state
     4. Aperture mask       — clip-path circle when an aperture is inserted
     5. Blue ROI circle     — appears for stage-move steps with a roiTarget
     6. Wobble transform    — animation on the whole content when wobblerOn
   ========================================================================= */

(function () {
  'use strict';

  let screenEl, emptyEl, beamEl, sampleEl, roiEl, contentEl;
  let currentRoiTarget = null;     // set by guided-controller when a step has roiTarget

  function init() {
    screenEl = document.getElementById('view-screen');
    emptyEl  = document.getElementById('view-empty');
    if (!screenEl) return;

    // Build the layer stack once.
    if (!screenEl.querySelector('.view-content')) {
      contentEl = document.createElement('div');
      contentEl.className = 'view-content';
      screenEl.appendChild(contentEl);

      sampleEl = document.createElement('div');
      sampleEl.className = 'view-sample';
      contentEl.appendChild(sampleEl);

      beamEl = document.createElement('div');
      beamEl.className = 'view-beam';
      contentEl.appendChild(beamEl);

      roiEl = document.createElement('div');
      roiEl.className = 'view-roi';
      screenEl.appendChild(roiEl);
    }
    contentEl = screenEl.querySelector('.view-content');
    sampleEl  = screenEl.querySelector('.view-sample');
    beamEl    = screenEl.querySelector('.view-beam');
    roiEl     = screenEl.querySelector('.view-roi');

    // Set the sample background once from config
    const cfg = TEM.tolerance.getConfig();
    const samp = cfg?.samples?.nanoparticles;
    if (samp?.image && sampleEl) {
      sampleEl.style.backgroundImage = `url("${samp.image}")`;
    }

    TEM.state.subscribe(() => render());
    render();
  }

  /** Called by guided-controller when a step has a roiTarget. */
  function setRoiTarget(target) {
    currentRoiTarget = target || null;
    render();
  }

  function render() {
    if (!screenEl) return;
    const s = TEM.state.getAll();
    const cfg = TEM.tolerance.getConfig();

    const beamOn        = !!s.beamOn;
    const inImaging     = s.mode === 'imaging' || s.mode == null;
    const inDiffraction = s.mode === 'diffraction';
    const showSample    = beamOn && inImaging && !!s.magnification;
    const showDiff      = beamOn && inDiffraction;

    // Column beam animation — visible when beam is on, regardless of which
    // viewer tab the user is currently looking at (they can switch back to
    // the column at any time and see it animating).
    const columnBeam = document.getElementById('column-beam');
    if (columnBeam) columnBeam.classList.toggle('is-on', beamOn);

    // ----- Empty placeholder (only before beam) -----
    if (emptyEl) emptyEl.style.opacity = beamOn ? '0' : '1';

    // ----- Camera tint vs phosphor tint -----
    screenEl.classList.toggle('is-camera-view', !!s.cameraInserted);

    // ----- Diffraction mode visual -----
    screenEl.classList.toggle('is-diffraction', showDiff);

    // ----- Sample image -----
    if (sampleEl) {
      if (showSample) {
        sampleEl.style.opacity = '1';

        const mag = s.magnification;
        const scales = cfg?.samples?.nanoparticles?.scales || { low: 0.25, medium: 0.55, high: 1.0 };
        const baseScale = scales[mag] || 0.5;

        // Focus blur
        const blur = Math.max(0, Math.abs(s.focus ?? 0) / 5);

        // Stage offset — BUT during ROI-positioning steps, the sample stays
        // fixed at the centre. Only the blue circle moves. This matches the
        // mental model: the user is searching for a region of interest;
        // moving the stage moves their *cursor* through sample space, not
        // the sample itself.
        let sx = 0, sy = 0;
        if (!currentRoiTarget) {
          const magShiftFactor = mag === 'low' ? 0.3 : mag === 'medium' ? 1.0 : 2.5;
          sx = -(s.stageX ?? 0) * 0.3 * magShiftFactor;
          sy =  (s.stageY ?? 0) * 0.3 * magShiftFactor;
        }

        sampleEl.style.transform =
          `translate(${sx}%, ${sy}%) scale(${baseScale})`;
        sampleEl.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : '';
      } else {
        sampleEl.style.opacity = '0';
      }
    }

    // ----- Beam spot -----
    if (beamEl) {
      const showBeam = beamOn && !showSample && !showDiff;
      if (showBeam) {
        beamEl.style.opacity = '1';

        const b = (s.brightness ?? 50) / 100;
        const baseSize = 18 + b * 70;

        const lum = 0.45 + (1 - Math.abs(b - 0.55) * 2) * 0.55;
        beamEl.style.setProperty('--lum', lum.toFixed(2));

        const shiftX = (s.beamShift?.x ?? 0) * 0.6;
        const shiftY = (s.beamShift?.y ?? 0) * 0.6;

        const stigX = (s.stigmator?.x ?? 0) / 50;
        const stigY = (s.stigmator?.y ?? 0) / 50;
        const scaleX = 1 + stigX * 0.6;
        const scaleY = 1 - stigY * 0.6;
        const rot = (stigX * stigY) * 35;

        beamEl.style.width  = `${baseSize}%`;
        beamEl.style.height = `${baseSize}%`;
        beamEl.style.left = `calc(50% + ${shiftX}% - ${baseSize/2}%)`;
        beamEl.style.top  = `calc(50% - ${shiftY}% - ${baseSize/2}%)`;
        beamEl.style.transform = `scale(${scaleX}, ${scaleY}) rotate(${rot}deg)`;
      } else {
        beamEl.style.opacity = '0';
      }
    }

    // ----- Aperture clip-path mask -----
    const apertureActive = (
      (s.currentAperture === 'condenser' && s.condenserInserted && s.condenserSize) ||
      (s.currentAperture === 'objective' && s.objectiveInserted && s.objectiveSize)
    );
    if (contentEl) {
      if (apertureActive) {
        const size = s.currentAperture === 'condenser' ? s.condenserSize : s.objectiveSize;
        const r = size === 'small' ? 22 : size === 'large' ? 55 : 35;
        const ax = 50 + (s.apertureAlignment?.x ?? 0) * 0.4;
        const ay = 50 - (s.apertureAlignment?.y ?? 0) * 0.4;
        contentEl.style.clipPath = `circle(${r}% at ${ax}% ${ay}%)`;
      } else {
        contentEl.style.clipPath = '';
      }
    }

    // ----- Blue ROI circle -----
    // The circle shows where the target region of interest sits relative to
    // the current stage position. As the user drags the stage, only this
    // circle moves (the sample stays put — see above). When the circle is
    // centred on screen, the user has reached the ROI.
    if (roiEl) {
      if (currentRoiTarget && showSample) {
        roiEl.style.opacity = '1';
        // The on-screen offset of the circle = (target - current) * factor.
        // Factor is tuned so a stageX of (target.x) maps to ~0% offset.
        // At low mag we use a smaller factor so the circle starts well
        // off-center; at high mag the factor is higher (small stage
        // changes produce big circle movements, like the real instrument).
        const mag = s.magnification;
        const factor = mag === 'low' ? 1.2 :
                       mag === 'medium' ? 2.0 :
                       3.0;
        const dx = (currentRoiTarget.x - (s.stageX ?? 0)) * factor;
        const dy = (currentRoiTarget.y - (s.stageY ?? 0)) * factor;
        roiEl.style.left = `calc(50% + ${dx}% - 28px)`;
        roiEl.style.top  = `calc(50% - ${dy}% - 28px)`;
      } else {
        roiEl.style.opacity = '0';
      }
    }

    // ----- Wobble animation -----
    if (s.wobblerOn && contentEl) {
      const amp = Math.min(10, Math.abs(s.stageZ ?? 0) * 0.5 + 2);
      screenEl.style.setProperty('--wobble-amp', `${amp}px`);
      screenEl.classList.add('is-wobbling');
    } else {
      screenEl.classList.remove('is-wobbling');
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.imageRenderer = { init, render, setRoiTarget };
})();
