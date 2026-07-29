/* =========================================================================
   Guided Simulator — Viewing Screen Renderer  (v2.0)
   Uses focusCoarse + focusFine for blur. condStig affects beam shape.
   ========================================================================= */
(function () {
  'use strict';

  var screenEl, emptyEl, beamEl, sampleEl, roiEl, contentEl;
  var wobbleGhostLeft, wobbleGhostRight, wobbleMeter, wobbleMeterFill, wobbleMeterValue;
  var currentRoiTarget = null;

  function init() {
    screenEl = document.getElementById('view-screen');
    emptyEl  = document.getElementById('view-empty');
    if (!screenEl) return;

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

    wobbleGhostLeft = screenEl.querySelector('.view-wobble-ghost--left');
    if (!wobbleGhostLeft) {
      wobbleGhostLeft = document.createElement('div');
      wobbleGhostLeft.className = 'view-wobble-ghost view-wobble-ghost--left';
      screenEl.insertBefore(wobbleGhostLeft, contentEl);
    }
    wobbleGhostRight = screenEl.querySelector('.view-wobble-ghost--right');
    if (!wobbleGhostRight) {
      wobbleGhostRight = document.createElement('div');
      wobbleGhostRight.className = 'view-wobble-ghost view-wobble-ghost--right';
      screenEl.insertBefore(wobbleGhostRight, contentEl);
    }

    wobbleMeter = screenEl.querySelector('.view-wobble-meter');
    if (!wobbleMeter) {
      wobbleMeter = document.createElement('div');
      wobbleMeter.className = 'view-wobble-meter';
      wobbleMeter.innerHTML =
        '<div class="view-wobble-meter__top"><span>IMAGE WOBBLE X</span><strong id="view-wobble-value">AMPLITUDE —</strong></div>' +
        '<div class="view-wobble-meter__track"><span class="view-wobble-meter__fill"></span></div>' +
        '<div class="view-wobble-meter__note">Adjust Z and observe whether the lateral movement becomes smaller.</div>';
      screenEl.appendChild(wobbleMeter);
    }
    wobbleMeterFill = wobbleMeter.querySelector('.view-wobble-meter__fill');
    wobbleMeterValue = wobbleMeter.querySelector('#view-wobble-value');

    var cfg = TEM.tolerance.getConfig();
    var samp = cfg && cfg.samples && cfg.samples.nanoparticles;
    if (samp && samp.image && sampleEl) {
      var sampleImage = 'url("' + samp.image + '")';
      sampleEl.style.backgroundImage = sampleImage;
      if (wobbleGhostLeft) wobbleGhostLeft.style.backgroundImage = sampleImage;
      if (wobbleGhostRight) wobbleGhostRight.style.backgroundImage = sampleImage;
    }

    TEM.state.subscribe(function() { render(); });
    render();
  }

  function setRoiTarget(target) {
    currentRoiTarget = target || null;
    render();
  }

  function render() {
    if (!screenEl) return;
    var s = TEM.state.getAll();
    var cfg = TEM.tolerance.getConfig();

    var beamOn = !!s.beamOn;
    var inImaging = s.imagingMode === 'mag1' || s.imagingMode === 'lowmag' || s.imagingMode == null;
    var inDiffraction = s.imagingMode === 'diff';
    var showSample = beamOn && inImaging && !!s.magnification;
    var showDiff = beamOn && inDiffraction;

    // Column beam
    var columnBeam = document.getElementById('column-beam');
    if (columnBeam) columnBeam.classList.toggle('is-on', beamOn);

    if (emptyEl) emptyEl.style.opacity = beamOn ? '0' : '1';

    screenEl.classList.toggle('is-camera-view', !!s.screenRaised && !!s.cameraInserted);
    screenEl.classList.toggle('is-diffraction', showDiff);

    // Sample
    if (sampleEl) {
      if (showSample) {
        sampleEl.style.opacity = '1';
        var mag = s.magnification;
        var scales = (cfg && cfg.samples && cfg.samples.nanoparticles && cfg.samples.nanoparticles.scales) || { low: 0.25, medium: 0.55, high: 1.0 };
        var baseScale = scales[mag] || 0.5;

        // Combined focus from both knobs
        var totalFocus = Math.abs(s.focusCoarse || 0) + Math.abs(s.focusFine || 0) * 0.3;
        var blur = Math.max(0, totalFocus / 5);

        var sx = 0, sy = 0;
        if (!currentRoiTarget) {
          var magShiftFactor = mag === 'low' ? 0.3 : mag === 'medium' ? 1.0 : 2.5;
          sx = -(s.stageX || 0) * 0.3 * magShiftFactor;
          sy =  (s.stageY || 0) * 0.3 * magShiftFactor;
        }

        var sampleTransform = 'translate(' + sx + '%, ' + sy + '%) scale(' + baseScale + ')';
        sampleEl.style.transform = sampleTransform;
        sampleEl.style.filter = blur > 0 ? 'blur(' + blur.toFixed(1) + 'px)' : '';
        [wobbleGhostLeft, wobbleGhostRight].forEach(function(ghost) {
          if (!ghost) return;
          ghost.style.setProperty('--wobble-base-transform', sampleTransform);
          ghost.style.filter = (blur > 0 ? 'blur(' + blur.toFixed(1) + 'px) ' : '') + 'grayscale(1) contrast(1.08) brightness(0.78)';
          ghost.style.visibility = 'visible';
        });
      } else {
        sampleEl.style.opacity = '0';
        if (wobbleGhostLeft) wobbleGhostLeft.style.visibility = 'hidden';
        if (wobbleGhostRight) wobbleGhostRight.style.visibility = 'hidden';
      }
    }

    // Beam spot
    if (beamEl) {
      var showBeam = beamOn && !showSample && !showDiff;
      if (showBeam) {
        beamEl.style.opacity = '1';
        var b = (s.brightness || 50) / 100;
        var baseSize = 18 + b * 70;
        var lum = 0.45 + (1 - Math.abs(b - 0.55) * 2) * 0.55;
        beamEl.style.setProperty('--lum', lum.toFixed(2));

        var shiftX = (s.beamShift ? s.beamShift.x : 0) * 0.6;
        var shiftY = (s.beamShift ? s.beamShift.y : 0) * 0.6;

        // Condenser stig affects beam shape
        var csX = (s.condStig ? s.condStig.x : 0) / 50;
        var csY = (s.condStig ? s.condStig.y : 0) / 50;
        var scaleX = 1 + csX * 0.6;
        var scaleY = 1 - csY * 0.6;
        var rot = (csX * csY) * 35;

        beamEl.style.width  = baseSize + '%';
        beamEl.style.height = baseSize + '%';
        beamEl.style.left = 'calc(50% + ' + shiftX + '% - ' + (baseSize/2) + '%)';
        beamEl.style.top  = 'calc(50% - ' + shiftY + '% - ' + (baseSize/2) + '%)';
        beamEl.style.transform = 'scale(' + scaleX + ', ' + scaleY + ') rotate(' + rot + 'deg)';
      } else {
        beamEl.style.opacity = '0';
      }
    }

    // Aperture clip-path
    var apertureActive = (
      (s.currentAperture === 'condenser' && s.condenserInserted && s.condenserSize) ||
      (s.currentAperture === 'objective' && s.objectiveInserted && s.objectiveSize)
    );
    if (contentEl) {
      if (apertureActive) {
        var size = s.currentAperture === 'condenser' ? s.condenserSize : s.objectiveSize;
        var r = size === 'small' ? 22 : size === 'large' ? 55 : 35;
        var ax = 50 + (s.apertureAlignment ? s.apertureAlignment.x : 0) * 0.4;
        var ay = 50 - (s.apertureAlignment ? s.apertureAlignment.y : 0) * 0.4;
        contentEl.style.clipPath = 'circle(' + r + '% at ' + ax + '% ' + ay + '%)';
      } else {
        contentEl.style.clipPath = '';
      }
    }

    // ROI circle
    if (roiEl) {
      if (currentRoiTarget && showSample) {
        roiEl.style.opacity = '1';
        var magR = s.magnification;
        var factor = magR === 'low' ? 1.2 : magR === 'medium' ? 2.0 : 3.0;
        var dx = (currentRoiTarget.x - (s.stageX || 0)) * factor;
        var dy = (currentRoiTarget.y - (s.stageY || 0)) * factor;
        roiEl.style.left = 'calc(50% + ' + dx + '% - 28px)';
        roiEl.style.top  = 'calc(50% - ' + dy + '% - 28px)';
      } else {
        roiEl.style.opacity = '0';
      }
    }

    // Wobble: stage-Z error controls the lateral image oscillation.
    // At eucentric height the image is nearly stationary; moving away in
    // either Z direction increases amplitude again.
    // Show the instructional wobble overlay only while the learner is
    // actively adjusting Z (guided Step 21). Once eucentric height is found
    // and the workflow advances, remove the meter, ghosts and animation even
    // though the next instruction still asks the learner to switch Wobble off.
    var wobbleFeedbackActive = !!s.wobblerOn && Number(s.currentStepId) === 21;
    if (wobbleFeedbackActive && contentEl) {
      var zError = Math.abs(Number(s.stageZ) || 0);
      var amp = zError <= 1 ? 0.5 : (zError <= 5 ? 1 + zError * 0.55 : 4 + (zError - 5) * 1.35);
      amp = Math.min(38, amp);
      var level = Math.min(100, Math.round((amp / 38) * 100));
      var descriptor = level < 12 ? 'MINIMUM' : level < 35 ? 'LOW' : level < 68 ? 'MEDIUM' : 'HIGH';

      screenEl.style.setProperty('--wobble-amp', amp.toFixed(1) + 'px');
      screenEl.style.setProperty('--wobble-level', level + '%');
      screenEl.style.setProperty('--wobble-ghost-opacity', (0.08 + level / 100 * 0.2).toFixed(2));
      if (wobbleMeter) {
        wobbleMeter.style.visibility = 'visible';
        wobbleMeter.style.opacity = '';
      }
      if (wobbleMeterFill) wobbleMeterFill.style.width = level + '%';
      if (wobbleMeterValue) wobbleMeterValue.textContent = descriptor + ' · ' + amp.toFixed(1) + ' px';
      screenEl.classList.add('is-wobbling');
    } else {
      screenEl.classList.remove('is-wobbling');
      screenEl.style.setProperty('--wobble-amp', '0px');
      screenEl.style.setProperty('--wobble-level', '0%');
      if (wobbleMeter) {
        wobbleMeter.style.opacity = '0';
        wobbleMeter.style.visibility = 'hidden';
      }
      if (wobbleMeterFill) wobbleMeterFill.style.width = '0%';
      if (wobbleMeterValue) wobbleMeterValue.textContent = 'AMPLITUDE —';
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.imageRenderer = { init: init, render: render, setRoiTarget: setRoiTarget };
})();
