/* =========================================================================
   Guided Simulator — Control Wiring  (v2.0)
   Connects every UI control to the state store.
   DEF/STIG X/Y knobs are routed by defStigMode.
   ========================================================================= */
(function () {
  'use strict';

  var defStigHandles = { x: null, y: null };

  function init() {
    bindSampleSelector();
    bindAccVoltage();
    bindBeamOn();
    bindKnobs();
    bindDefStigMode();
    bindDefStigKnobs();
    bindApertureControls();
    bindStageXY();
    bindStageZ();
    bindImagingMode();
    bindMagnification();
    bindStdFocus();
    bindWobbler();
    // PC controls
    bindHolderType();
    bindStageNeutralize();
    bindSpecimenInsert();
    bindCameraInsert();
    bindLiveView();
    bindScreenRaise();
    bindAcquire();

    subscribeReadouts();
    subscribeStatusStrip();
    subscribeDefStigReadout();
  }

  /* ---- Selector group helper ---- */
  function bindSelectorGroup(action, stateKey, parse) {
    document.querySelectorAll('.pbtn[data-action="' + action + '"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled) return;
        var value = parse ? parse(btn.dataset.value) : btn.dataset.value;
        TEM.state.set(stateKey, value);
      });
    });
    TEM.state.subscribeKey(stateKey, function(val) {
      var targetStr = val == null ? null : String(val);
      document.querySelectorAll('.pbtn[data-action="' + action + '"]').forEach(function(btn) {
        btn.classList.toggle('is-selected', btn.dataset.value === targetStr);
      });
    });
  }

  /* ---- Toggle helper ---- */
  function bindToggle(action, stateKey) {
    var btn = document.querySelector('.pbtn[data-action="' + action + '"]');
    if (!btn) return;
    btn.addEventListener('click', function() {
      if (btn.disabled) return;
      TEM.state.set(stateKey, !TEM.state.get(stateKey));
    });
    TEM.state.subscribeKey(stateKey, function(val) {
      btn.classList.toggle('is-on', !!val);
    });
  }

  function bindSampleSelector()  { bindSelectorGroup('sample', 'sample'); }
  function bindAccVoltage() {
    bindSelectorGroup('acc-voltage', 'accVoltage', function(v){ return parseInt(v, 10); });
    var SAMPLE_VOLTAGES = { 'nanoparticles': [200], 'zebrafish': [120], 'metal': [200], 'mineral': [200] };
    function applyVoltageGating(sample) {
      var allowed = SAMPLE_VOLTAGES[sample] || [120, 200];
      document.querySelectorAll('.pbtn[data-action="acc-voltage"]').forEach(function(btn) {
        var v = parseInt(btn.dataset.value, 10);
        var ok = allowed.includes(v);
        btn.disabled = !ok;
        btn.classList.toggle('is-gated-out', !ok);
      });
    }
    TEM.state.subscribeKey('sample', applyVoltageGating);
  }
  function bindBeamOn()           { bindToggle('beam-on', 'beamOn'); }
  function bindWobbler()          { bindToggle('wobbler-toggle', 'wobblerOn'); }
  function bindStdFocus()         { bindToggle('std-focus', 'stdFocusReset'); }
  function bindHolderType()       { bindSelectorGroup('holder-type', 'holderType'); }
  function bindStageNeutralize()  { bindToggle('stage-neutralize', 'stageNeutralized'); }
  function bindSpecimenInsert()   { bindToggle('specimen-insert', 'specimenInsertedPanel'); }
  function bindCameraInsert()     { bindToggle('camera-insert', 'cameraInserted'); }
  function bindLiveView()         { bindToggle('live-view', 'cameraLiveView'); }
  function bindScreenRaise()      { bindToggle('screen-raise', 'screenRaised'); }
  function bindImagingMode()      { bindSelectorGroup('imaging-mode', 'imagingMode'); }
  function bindMagnification()    { bindSelectorGroup('magnification', 'magnification'); }

  /* ---- Acquire ---- */
  function bindAcquire() {
    var btn = document.querySelector('.pbtn[data-action="acquire"]');
    if (!btn) return;
    btn.addEventListener('click', function() {
      if (btn.disabled) return;
      TEM.state.set('imageAcquired', true);
      if (TEM.acquire && TEM.acquire.capture) TEM.acquire.capture();
    });
  }

  /* ---- Knobs ---- */
  function bindKnobs() {
    document.querySelectorAll('.knob[data-knob]').forEach(function(knob) {
      var key = knob.dataset.knob;
      // Spot Size and Alpha Selector are discrete IIT-SOP controls. They are
      // bound in controls-iit.js with step=1; do not double-bind them here as
      // continuous knobs, otherwise the displayed integer can differ from the
      // underlying state and Step 18 may never pass.
      if (key === 'spot-size' || key === 'alpha-selector') return;
      var min = +(knob.dataset.min || 0);
      var max = +(knob.dataset.max || 100);
      var stateKey = camelize(key);
      var initialVal = TEM.state.get(stateKey);
      if (initialVal == null) initialVal = +(knob.dataset.value || min);

      var handle = TEM.controlsUI.bindKnob(knob, {
        min: min, max: max, value: initialVal,
        onChange: function(v) {
          // During objective focusing, every new coarse movement requires a
          // subsequent fine adjustment. This prevents the step from passing
          // merely because Fine Focus started at its default zero value.
          if (stateKey === 'focusCoarse') {
            TEM.state.set('focusCoarseAdjusted', true);
            TEM.state.set('focusFineAdjusted', false);
          } else if (stateKey === 'focusFine' && TEM.state.get('focusCoarseAdjusted')) {
            TEM.state.set('focusFineAdjusted', true);
          }
          TEM.state.set(stateKey, v);
        }
      });

      TEM.state.subscribeKey(stateKey, function(val) {
        if (val !== handle.value) handle.value = val;
      });
    });
  }

  /* ---- DEF/STIG mode buttons ---- */
  function bindDefStigMode() {
    bindSelectorGroup('def-stig-mode', 'defStigMode');
    // When mode changes, sync both knobs to the selected function.
    TEM.state.subscribeKey('defStigMode', function(mode) {
      syncDefStigKnobs(mode);
      updateDefStigLabel(mode);
    });
  }

  function updateDefStigLabel(mode) {
    var el = document.getElementById('def-stig-label');
    if (!el) return;
    var labels = { shift: 'Beam Shift', condStig: 'Cond. Stigmator', objStig: 'Obj. Stigmator' };
    var label = labels[mode] || 'DEF / STIG';
    // If there's a separate Y label (IIT split layout), update both individually
    var elY = document.getElementById('def-stig-label-y');
    if (elY) {
      el.textContent = label + ' X';
      elY.textContent = label + ' Y';
    } else {
      el.textContent = label + ' X · Y';
    }
    document.querySelectorAll('[data-defstig-axis]').forEach(function(knob) {
      knob.setAttribute('aria-label', label + ' ' + knob.dataset.defstigAxis.toUpperCase() + ' control');
    });
  }

  /* ---- DEF/STIG multifunction X/Y knobs ---- */
  function bindDefStigKnobs() {
    var mode = TEM.state.get('defStigMode') || 'shift';
    var initial = getDefStigValues(mode);

    document.querySelectorAll('[data-defstig-axis]').forEach(function(knob) {
      var axis = knob.dataset.defstigAxis;
      if (axis !== 'x' && axis !== 'y') return;
      var min = +(knob.dataset.min || -50);
      var max = +(knob.dataset.max || 50);

      defStigHandles[axis] = TEM.controlsUI.bindKnob(knob, {
        min: min,
        max: max,
        value: initial[axis],
        onChange: function(value) { writeDefStigAxis(axis, value); }
      });
    });

    // Two-way sync: external state updates refresh both physical knobs.
    ['beamShift', 'condStig', 'objStig'].forEach(function(key) {
      TEM.state.subscribeKey(key, function() {
        var curMode = TEM.state.get('defStigMode');
        if (getDefStigKey(curMode) === key) syncDefStigKnobs(curMode);
      });
    });

    updateDefStigLabel(mode);
    syncDefStigKnobs(mode);
  }

  function getDefStigKey(mode) {
    if (mode === 'condStig') return 'condStig';
    if (mode === 'objStig')  return 'objStig';
    return 'beamShift';
  }

  function getDefStigValues(mode) {
    var key = getDefStigKey(mode);
    return TEM.state.get(key) || { x: 0, y: 0 };
  }

  function writeDefStigAxis(axis, value) {
    var mode = TEM.state.get('defStigMode') || 'shift';
    var key = getDefStigKey(mode);
    var current = getDefStigValues(mode);
    var next = { x: current.x, y: current.y };
    next[axis] = value;
    TEM.state.set(key, next);
  }

  function syncDefStigKnobs(mode) {
    var vals = getDefStigValues(mode);
    ['x', 'y'].forEach(function(axis) {
      var handle = defStigHandles[axis];
      if (handle && handle.value !== vals[axis]) handle.value = vals[axis];
    });
  }

  /* ---- Aperture controls ---- */
  function bindApertureControls() {
    document.querySelectorAll('.pbtn[data-action="aperture-select"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled) return;
        TEM.state.set('currentAperture', btn.dataset.value);
      });
    });
    TEM.state.subscribeKey('currentAperture', function(val) {
      document.querySelectorAll('.pbtn[data-action="aperture-select"]').forEach(function(btn) {
        btn.classList.toggle('is-selected', btn.dataset.value === val);
      });
    });

    document.querySelectorAll('.pbtn[data-action="aperture-size"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled) return;
        var which = TEM.state.get('currentAperture');
        if (which === 'condenser') TEM.state.set('condenserSize', btn.dataset.value);
        else if (which === 'objective') TEM.state.set('objectiveSize', btn.dataset.value);
      });
    });

    var reflectSize = function() {
      var which = TEM.state.get('currentAperture');
      var size = null;
      if (which === 'condenser') size = TEM.state.get('condenserSize');
      else if (which === 'objective') size = TEM.state.get('objectiveSize');
      document.querySelectorAll('.pbtn[data-action="aperture-size"]').forEach(function(btn) {
        btn.classList.toggle('is-selected', btn.dataset.value === size);
      });
    };
    TEM.state.subscribeKey('currentAperture', reflectSize);
    TEM.state.subscribeKey('condenserSize', reflectSize);
    TEM.state.subscribeKey('objectiveSize', reflectSize);

    // Aperture alignment trackpad
    var pad = document.querySelector('[data-trackpad="aperture-align"]');
    if (pad) {
      var range = (pad.dataset.range || '-50,50').split(',').map(Number);
      var init = TEM.state.get('apertureAlignment') || { x: 0, y: 0 };
      var handle = TEM.controlsUI.bindTrackpad(pad, {
        rangeX: [range[0], range[1]], rangeY: [range[0], range[1]],
        valueX: init.x, valueY: init.y,
        onChange: function(pos) { TEM.state.set('apertureAlignment', pos); }
      });
      TEM.state.subscribeKey('apertureAlignment', function(val) {
        if (!val) return;
        var cur = handle.value;
        if (cur.x !== val.x || cur.y !== val.y) handle.value = val;
      });
    }
  }

  /* ---- Stage XY trackpad ---- */
  function bindStageXY() {
    var pad = document.querySelector('[data-trackpad="stage-xy"]');
    if (!pad) return;
    var range = (pad.dataset.range || '-100,100').split(',').map(Number);
    var handle = TEM.controlsUI.bindTrackpad(pad, {
      rangeX: [range[0], range[1]], rangeY: [range[0], range[1]],
      valueX: TEM.state.get('stageX') || 0,
      valueY: TEM.state.get('stageY') || 0,
      onChange: function(pos) {
        TEM.state.set('stageX', pos.x);
        TEM.state.set('stageY', pos.y);
      }
    });
    TEM.state.subscribeKey('stageX', function(vx) {
      var cur = handle.value;
      if (cur.x !== vx) handle.value = { x: vx, y: cur.y };
    });
    TEM.state.subscribeKey('stageY', function(vy) {
      var cur = handle.value;
      if (cur.y !== vy) handle.value = { x: cur.x, y: vy };
    });
  }

  /* ---- Stage Z rocker ---- */
  function bindStageZ() {
    document.querySelectorAll('[data-action="stage-z"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var dir = +btn.dataset.dir;
        var cur = TEM.state.get('stageZ');
        TEM.state.set('stageZ', Math.max(-50, Math.min(50, cur + dir)));
      });
    });
  }

  /* ---- Readouts ---- */
  function subscribeReadouts() {
    var xEl = document.getElementById('readout-x');
    var yEl = document.getElementById('readout-y');
    var zEl = document.getElementById('readout-z');
    TEM.state.subscribeKey('stageX', function(v) { if (xEl) xEl.textContent = Math.round(v); });
    TEM.state.subscribeKey('stageY', function(v) { if (yEl) yEl.textContent = Math.round(v); });
    TEM.state.subscribeKey('stageZ', function(v) { if (zEl) zEl.textContent = Math.round(v); });
  }

  function subscribeDefStigReadout() {
    var xEl = document.getElementById('readout-def-x');
    var yEl = document.getElementById('readout-def-y');
    function update() {
      var mode = TEM.state.get('defStigMode') || 'shift';
      var vals = getDefStigValues(mode);
      if (xEl) xEl.textContent = Math.round(vals.x);
      if (yEl) yEl.textContent = Math.round(vals.y);
    }
    TEM.state.subscribe(function(key) {
      if (key === 'defStigMode' || key === 'beamShift' || key === 'condStig' || key === 'objStig') update();
    });
    update();
  }

  function subscribeStatusStrip() {
    var indVacuum = document.getElementById('ind-vacuum');
    var indBeam   = document.getElementById('ind-beam');
    var indHT     = document.getElementById('ind-ht');
    var indSample = document.getElementById('ind-sample');
    var indMag    = document.getElementById('ind-mag');

    TEM.state.subscribeKey('airlockPumped', function(v) { if (indVacuum) indVacuum.classList.toggle('is-on', !!v); });
    TEM.state.subscribeKey('beamOn', function(v) { if (indBeam) indBeam.classList.toggle('is-on', !!v); });
    TEM.state.subscribeKey('accVoltage', function(v) { if (indHT) indHT.textContent = v ? v + ' kV' : '—'; });
    TEM.state.subscribeKey('sample', function(v) { if (indSample) indSample.textContent = v ? v.charAt(0).toUpperCase() + v.slice(1) : '—'; });
    TEM.state.subscribeKey('magnification', function(v) { if (indMag) indMag.textContent = v ? v.toUpperCase() : '—'; });
  }

  function camelize(s) { return String(s).replace(/-([a-z])/g, function(_, c){ return c.toUpperCase(); }); }

  window.TEM = window.TEM || {};
  window.TEM.controls = { init: init };
})();
