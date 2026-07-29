/* =========================================================================
   Guided Simulator — PC Drawer Controller
   JEOL JEM-2100 TEMCON-style Operation window + Camera software drawer.
   ========================================================================= */
(function () {
  'use strict';

  var drawerEl, handleEl, stageEl;
  var temEl, camEl, titleEl;
  var currentPanel = 'tem';  // selected panel; drawer may still be collapsed
  var currentTemTab = 'standard';
  var currentTemSubtab = 'wobbler';
  var cameraImage = null;
  var cameraImageReady = false;
  var fftRevealTimer = null;

  function init() {
    drawerEl = document.getElementById('pc-drawer');
    handleEl = document.getElementById('pc-drawer-handle');
    stageEl  = document.getElementById('viewer-stage');
    temEl    = document.getElementById('pc-tem');
    camEl    = document.getElementById('pc-cam');
    titleEl  = document.getElementById('pc-drawer-title');
    if (!drawerEl || !handleEl) return;

    handleEl.addEventListener('click', toggle);
    handleEl.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });

    bindTEMTabs();
    bindTEMSubtabs();
    prepareCameraImage();

    // TEMCON main data display and Stage page readouts.
    [
      'airlockPumped', 'accVoltage', 'beamOn', 'beamCurrent', 'stageNeutralized',
      'stageX', 'stageY', 'stageZ', 'holderType',
      'holderRemoved', 'specimenInsertedDiagram', 'specimenInsertedPanel',
      'imagingMode', 'magnification', 'focusCoarse', 'focusFine',
      'defStigMode', 'wobblerOn', 'currentStepId',
      'cameraInserted', 'cameraLiveView', 'screenRaised'
    ].forEach(function(key) {
      TEM.state.subscribeKey(key, updateTEMReadouts);
    });

    TEM.state.subscribeKey('currentStepId', function(stepId) {
      selectRecommendedTEMTab(stepId);
    });

    [
      'cameraInserted', 'cameraLiveView', 'screenRaised', 'imageAcquired',
      'magnification', 'imagingMode', 'stageX', 'stageY',
      'focusCoarse', 'focusFine', 'objStig', 'sample'
    ].forEach(function(key) {
      TEM.state.subscribeKey(key, updateCamState);
    });

    // Once the fluorescent screen is raised, reveal the Live FFT palette
    // automatically so it is already visible for the following O.STIG step.
    TEM.state.subscribeKey('screenRaised', function(value, previous) {
      if (value && !previous) scheduleFFTReveal();
      if (!value && fftRevealTimer) {
        clearTimeout(fftRevealTimer);
        fftRevealTimer = null;
      }
    });

    selectPanel('tem');
    setStepActive(false);
    close();
    updateTEMReadouts();
    updateCamState();
  }

  function prepareCameraImage() {
    cameraImage = new Image();
    cameraImage.onload = function() {
      cameraImageReady = true;
      updateCamState();
    };
    cameraImage.onerror = function() {
      cameraImageReady = false;
      updateCamState();
    };
    cameraImage.src = '../assets/images/microscope/samples/nanoparticles/nanoparticles.png';
  }

  function bindTEMTabs() {
    document.querySelectorAll('[data-temcon-tab]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        setTEMTab(btn.dataset.temconTab);
      });
    });
  }

  function bindTEMSubtabs() {
    document.querySelectorAll('[data-temcon-subtab]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        setTEMSubtab(btn.dataset.temconSubtab);
      });
    });
  }

  function setTEMTab(tabName) {
    currentTemTab = tabName === 'stage' ? 'stage' : 'standard';

    document.querySelectorAll('[data-temcon-tab]').forEach(function(btn) {
      var selected = btn.dataset.temconTab === currentTemTab;
      btn.classList.toggle('is-selected', selected);
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    document.querySelectorAll('[data-temcon-page]').forEach(function(page) {
      var selected = page.dataset.temconPage === currentTemTab;
      page.classList.toggle('is-selected', selected);
      page.hidden = !selected;
    });
  }

  function setTEMSubtab(tabName) {
    var valid = ['wobbler', 'screen', 'settings'];
    currentTemSubtab = valid.indexOf(tabName) >= 0 ? tabName : 'wobbler';

    document.querySelectorAll('[data-temcon-subtab]').forEach(function(btn) {
      var selected = btn.dataset.temconSubtab === currentTemSubtab;
      btn.classList.toggle('is-selected', selected);
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    document.querySelectorAll('[data-temcon-subpage]').forEach(function(page) {
      var selected = page.dataset.temconSubpage === currentTemSubtab;
      page.classList.toggle('is-selected', selected);
      page.hidden = !selected;
    });
  }

  function selectRecommendedTEMTab(stepId) {
    // Guided setup actions live on the reconstructed Stage page.
    if (stepId === 1 || stepId === 2 || stepId === 6) {
      setTEMTab('stage');
    } else if (currentPanel === 'tem') {
      setTEMTab('standard');
    }
  }

  function revealFFT() {
    if (!camEl || currentPanel !== 'cam' || !isOpen()) return;
    var fftPanel = document.getElementById('pc-cam-fft');
    if (!fftPanel) return;

    // Scroll the drawer's own overflow area, not the complete document.
    var drawerRect = camEl.getBoundingClientRect();
    var fftRect = fftPanel.getBoundingClientRect();
    var targetTop = Math.max(0, camEl.scrollTop + fftRect.top - drawerRect.top - 8);
    if (typeof camEl.scrollTo === 'function') {
      camEl.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      camEl.scrollTop = targetTop;
    }
    fftPanel.classList.add('is-auto-revealed');
    setTimeout(function() { fftPanel.classList.remove('is-auto-revealed'); }, 1400);
  }

  function scheduleFFTReveal() {
    if (fftRevealTimer) clearTimeout(fftRevealTimer);
    fftRevealTimer = setTimeout(function() {
      fftRevealTimer = null;
      revealFFT();
    }, 260);
  }

  function revealControl(controlKey) {
    if (!controlKey || !isOpen()) return;
    var panel = currentPanel === 'cam' ? camEl : temEl;
    if (!panel || panel.hidden) return;
    var target = panel.querySelector('.ctl[data-control="' + controlKey + '"]');
    if (!target) return;

    // Scroll only the active drawer content. Centre the target where possible
    // so long button labels such as Raise Fluorescent Screen remain obvious.
    var panelRect = panel.getBoundingClientRect();
    var targetRect = target.getBoundingClientRect();
    var desiredOffset = Math.max(8, (panel.clientHeight - targetRect.height) / 2);
    var targetTop = Math.max(0, panel.scrollTop + targetRect.top - panelRect.top - desiredOffset);
    if (typeof panel.scrollTo === 'function') {
      panel.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      panel.scrollTop = targetTop;
    }
  }

  function selectPanel(which) {
    if (!drawerEl) return;
    currentPanel = which === 'cam' ? 'cam' : 'tem';

    temEl.hidden = currentPanel !== 'tem';
    camEl.hidden = currentPanel !== 'cam';
    temEl.classList.toggle('is-active', currentPanel === 'tem');
    camEl.classList.toggle('is-active', currentPanel === 'cam');

    if (currentPanel === 'tem') {
      titleEl.textContent = 'PC · JEOL TEM CONTROL';
      selectRecommendedTEMTab(TEM.state.get('currentStepId'));
      updateTEMReadouts();
    } else {
      titleEl.textContent = 'PC · CAMERA SOFTWARE';
      updateCamState();
      if (TEM.state.get('screenRaised')) scheduleFFTReveal();
    }
  }

  function setStepActive(active) {
    if (!drawerEl) return;
    drawerEl.classList.toggle('is-step-active', !!active);
    handleEl.classList.toggle('is-step-target', !!active);
  }

  function setTarget(which, active) {
    selectPanel(which);
    setStepActive(active);
  }

  function open(which) {
    if (!drawerEl) return;
    if (which) selectPanel(which);
    drawerEl.classList.add('is-open');
    handleEl.setAttribute('aria-expanded', 'true');
    handleEl.title = 'Collapse PC drawer';
    var activeContent = currentPanel === 'cam' ? camEl : temEl;
    if (activeContent) activeContent.setAttribute('aria-hidden', 'false');
    if (stageEl) stageEl.classList.add('has-drawer');
  }

  function close() {
    if (!drawerEl) return;
    drawerEl.classList.remove('is-open');
    handleEl.setAttribute('aria-expanded', 'false');
    handleEl.title = 'Open PC drawer';
    if (temEl) temEl.setAttribute('aria-hidden', 'true');
    if (camEl) camEl.setAttribute('aria-hidden', 'true');
    if (stageEl) stageEl.classList.remove('has-drawer');
  }

  function toggle() {
    if (isOpen()) close();
    else open();
  }

  function isOpen() { return !!(drawerEl && drawerEl.classList.contains('is-open')); }
  function activePanel() { return currentPanel; }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setClass(id, className, enabled) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle(className, !!enabled);
  }

  function formatFixed(value, digits) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = 0;
    return number.toFixed(digits);
  }

  function getMagnificationLabel(state) {
    if (state.imagingMode === 'diff') return 'SAED';
    if (state.imagingMode === 'lowmag') return 'X500';
    var labels = {
      low: 'X2k',
      medium: 'X20k',
      high: 'X100k',
      'very-high': 'X200k'
    };
    return labels[state.magnification] || 'X20k';
  }

  function getSpecimenStatus(state) {
    if (state.specimenInsertedPanel) return 'IN COLUMN';
    if (state.specimenInsertedDiagram) return state.airlockPumped ? 'AIRLOCK READY' : 'IN AIRLOCK';
    if (state.holderRemoved) return 'HOLDER REMOVED';
    return 'OUTSIDE COLUMN';
  }

  function updateTEMReadouts() {
    if (!window.TEM || !TEM.state) return;
    var s = TEM.state.getAll();

    // Top data display area.
    setClass('pc-ht-lamp', 'is-on', !!s.accVoltage);
    setClass('pc-beam-lamp', 'is-on', !!s.beamOn);
    setText('pc-beam-lamp', s.beamOn ? 'Beam\nON' : 'Beam\nOFF');

    // Restore the two-line status lamp after textContent replacement.
    var beamLamp = document.getElementById('pc-beam-lamp');
    if (beamLamp) beamLamp.innerHTML = 'Beam<br><strong>' + (s.beamOn ? 'ON' : 'OFF') + '</strong>';

    setText('pc-acc-value', s.accVoltage ? formatFixed(s.accVoltage, 2) + ' kV' : '— kV');
    setText('pc-beam-current', Math.round(Number(s.beamCurrent) || 0) + ' µA');
    setText('pc-mag-value', getMagnificationLabel(s));

    var defocusNm = (Number(s.focusCoarse) || 0) + (Number(s.focusFine) || 0) / 10;
    setText('pc-defocus-value', formatFixed(defocusNm, 1) + ' nm');

    var currentDensity = Math.max(0, (Number(s.beamCurrent) || 0) * 0.016);
    setText('pc-current-density', formatFixed(currentDensity, 1) + ' pA/cm²');

    setText('pc-stg-x', formatFixed(s.stageX, 1));
    setText('pc-stg-y', formatFixed(s.stageY, 1));
    setText('pc-stg-z', formatFixed(s.stageZ, 1));
    setText('pc-stg-tx', '0.0');
    setText('pc-stg-ty', '0.0');

    // Detailed Stage page.
    setText('pc-stage-x-detail', formatFixed(s.stageX, 3));
    setText('pc-stage-y-detail', formatFixed(s.stageY, 3));
    setText('pc-stage-z-detail', formatFixed(s.stageZ, 3));
    setText('pc-holder-status', s.holderType ? s.holderType.replace('-', ' ').toUpperCase() : 'NOT SELECTED');
    setText('pc-specimen-status', getSpecimenStatus(s));

    var vacuumBusy = s.currentStepId === 6 && !s.airlockPumped;
    setClass('pc-vac-ind', 'is-on', !!s.airlockPumped);
    setText('pc-vac-text', s.airlockPumped ? 'READY' : (vacuumBusy ? 'EVACUATING' : 'NOT READY'));
    setText('pc-column-vacuum', 'READY');
    setText('pc-airlock-valve', s.airlockPumped ? 'READY TO OPEN' : 'CLOSED');
    setText('pc-vac-pressure', s.airlockPumped ? '3.2 × 10⁻⁵ Pa' : (vacuumBusy ? 'PUMPING…' : '— Pa'));

    var progress = document.querySelector('.temcon-progress');
    if (progress) {
      progress.classList.toggle('is-busy', vacuumBusy);
      progress.classList.toggle('is-ready', !!s.airlockPumped);
    }

    var message = 'TEM Connected';
    if (vacuumBusy) message = 'Airlock evacuation in progress…';
    else if (s.airlockPumped && s.currentStepId === 6) message = 'Airlock vacuum ready';
    else if (s.stageNeutralized) message = 'Stage neutralized at safe position';
    else if (s.holderType) message = 'Holder selected: ' + s.holderType.replace('-', ' ');
    setText('pc-system-message', message);

    setText('pc-screen-state', s.screenRaised ? 'UP' : 'DOWN');
    setText('pc-camera-state', s.cameraInserted ? 'INSERTED' : 'RETRACTED');

    document.querySelectorAll('[data-temcon-mode]').forEach(function(btn) {
      btn.classList.toggle('is-current', btn.dataset.temconMode === s.imagingMode);
    });
    document.querySelectorAll('[data-temcon-stig]').forEach(function(btn) {
      btn.classList.toggle('is-current', btn.dataset.temconStig === s.defStigMode);
    });
    var imageX = document.querySelector('[data-temcon-wobbler="image-x"]');
    if (imageX) imageX.classList.toggle('is-current', !!s.wobblerOn);
  }

  function updateCameraButton(action, activeText, inactiveText, active) {
    var button = document.querySelector('.camera-workstation .pbtn[data-action="' + action + '"]');
    if (!button) return;
    var textSpan = button.querySelector('span:last-child');
    if (textSpan) textSpan.textContent = active ? activeText : inactiveText;
  }

  function drawCameraCanvas(state, live) {
    var canvas = document.getElementById('pc-cam-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#05080a';
    ctx.fillRect(0, 0, w, h);

    if (!live || !cameraImageReady || !cameraImage) {
      ctx.fillStyle = 'rgba(215,230,235,0.22)';
      ctx.font = '16px "Lucida Console", Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(live ? 'LOADING CAMERA IMAGE…' : 'NO LIVE SIGNAL', w / 2, h / 2);
      return;
    }

    var zoomMap = { low: 1.0, medium: 1.35, high: 1.85, 'very-high': 2.35 };
    var zoom = zoomMap[state.magnification] || 1.35;
    var sourceW = cameraImage.naturalWidth / zoom;
    var sourceH = cameraImage.naturalHeight / zoom;
    var stageFactor = state.magnification === 'high' || state.magnification === 'very-high' ? 1.5 : 0.7;
    var offsetX = (Number(state.stageX) || 0) * stageFactor;
    var offsetY = (Number(state.stageY) || 0) * stageFactor;
    var sx = Math.max(0, Math.min(cameraImage.naturalWidth - sourceW, (cameraImage.naturalWidth - sourceW) / 2 + offsetX));
    var sy = Math.max(0, Math.min(cameraImage.naturalHeight - sourceH, (cameraImage.naturalHeight - sourceH) / 2 - offsetY));

    var focus = Math.abs(Number(state.focusCoarse) || 0) + Math.abs(Number(state.focusFine) || 0) * 0.3;
    var blur = Math.min(5, focus / 6);
    ctx.save();
    ctx.filter = 'grayscale(1) contrast(1.16) brightness(0.96)' + (blur > 0.15 ? ' blur(' + blur.toFixed(1) + 'px)' : '');
    ctx.drawImage(cameraImage, sx, sy, sourceW, sourceH, 0, 0, w, h);
    ctx.restore();

    // Camera scan lines and sparse sensor noise.
    ctx.fillStyle = 'rgba(255,255,255,0.028)';
    for (var y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
    for (var i = 0; i < 160; i++) {
      var px = (i * 83) % w;
      var py = (i * 47) % h;
      var alpha = 0.025 + ((i % 7) / 7) * 0.035;
      ctx.fillStyle = 'rgba(230,240,245,' + alpha.toFixed(3) + ')';
      ctx.fillRect(px, py, 1, 1);
    }
  }

  function updateCamState() {
    var liveEl = document.getElementById('pc-cam-live');
    if (!window.TEM || !TEM.state) return;
    var s = TEM.state.getAll();
    var live = !!s.cameraInserted && !!s.cameraLiveView && !!s.screenRaised;

    if (liveEl) {
      liveEl.classList.toggle('is-active', live);
      liveEl.classList.toggle('is-acquired', !!s.imageAcquired);
    }
    setClass('pc-cam-comm-led', 'is-on', true);
    setText('pc-cam-camera-state', s.cameraInserted ? 'Inserted' : 'Retracted');
    setText('pc-cam-screen-state', s.screenRaised ? 'Up' : 'Down');
    setText('pc-cam-live-state', s.cameraLiveView ? (live ? 'Running' : 'Waiting') : 'Stopped');
    setText('pc-cam-overlay-mag', 'MAG ' + getMagnificationLabel(s));
    setText('pc-cam-overlay-exp', '1.00 s');
    setText('pc-cam-zoom', s.magnification === 'very-high' ? '235%' : s.magnification === 'high' ? '185%' : s.magnification === 'medium' ? '135%' : '100%');
    setText('pc-cam-image-state', s.imageAcquired ? 'Acquired' : (live ? 'Live' : 'No image'));
    setText('pc-cam-file-name', (s.imageAcquired ? 'TEM_Image_001' : 'Live View') + ' — ' + (s.sample ? s.sample.replace('-', ' ') : 'Nanoparticles'));

    var placeholder = document.getElementById('pc-cam-placeholder');
    if (placeholder) {
      if (!s.cameraInserted) placeholder.textContent = 'CAMERA RETRACTED — NO LIVE SIGNAL';
      else if (!s.cameraLiveView) placeholder.textContent = 'CAMERA INSERTED — START LIVE VIEW';
      else if (!s.screenRaised) placeholder.textContent = 'LIVE VIEW WAITING — RAISE FLUORESCENT SCREEN';
      else placeholder.textContent = '';
    }

    var stigX = s.objStig ? Math.abs(Number(s.objStig.x) || 0) : 0;
    var stigY = s.objStig ? Math.abs(Number(s.objStig.y) || 0) : 0;
    var stigError = Math.max(stigX, stigY);
    setText('pc-cam-fft-state', !live ? 'No signal' : (stigError <= 5 ? 'Circular / corrected' : stigError <= 18 ? 'Slightly elliptical' : 'Elliptical'));

    var message = 'Camera workstation ready';
    if (!s.cameraInserted) message = 'Camera is retracted';
    else if (!s.cameraLiveView) message = 'Camera inserted — live view stopped';
    else if (!s.screenRaised) message = 'Live view waiting for fluorescent screen to be raised';
    else if (s.imageAcquired) message = 'Image acquired and saved to download';
    else message = 'Live acquisition running';
    setText('pc-cam-message', message);
    setText('pc-cam-ready-state', live ? 'LIVE' : (s.cameraInserted ? 'READY' : 'STANDBY'));

    updateCameraButton('camera-insert', 'Retract Camera', 'Insert Camera', !!s.cameraInserted);
    updateCameraButton('live-view', 'Stop Live View', 'Start Live View', !!s.cameraLiveView);
    updateCameraButton('screen-raise', 'Lower Fluorescent Screen', 'Raise Fluorescent Screen', !!s.screenRaised);

    drawCameraCanvas(s, live);
  }

  window.TEM = window.TEM || {};
  window.TEM.pcDrawer = {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
    setTarget: setTarget,
    setStepActive: setStepActive,
    isOpen: isOpen,
    activePanel: activePanel,
    setTEMTab: setTEMTab,
    setTEMSubtab: setTEMSubtab,
    revealFFT: revealFFT,
    revealControl: revealControl
  };
})();
