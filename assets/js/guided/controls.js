/* =========================================================================
   Guided Simulator — Control Wiring
   Connects every UI control to the state store. Each control writes via
   state.set(); readouts and visual indicators read via state.subscribe().

   This module is the bridge between the presentation layer (knobs,
   trackpads, buttons in the DOM) and the application state.
   ========================================================================= */

(function () {
  'use strict';

  /* -------------------- Initialization -------------------- */

  function init() {
    bindSampleSelector();
    bindAirlock();
    bindSpecimenInsert();
    bindAccVoltage();
    bindBeamOn();
    bindKnobs();
    bindTrackpads();
    bindApertureControls();
    bindStageZ();
    bindModeSelector();
    bindMagnification();
    bindWobbler();
    bindCameraInsert();
    bindAcquire();

    subscribeReadouts();
    subscribeStatusStrip();
    subscribeButtonStates();
    subscribeFeedbackPoke();
  }

  /* -------------------- Selector buttons (data-value groups) --------------------
     Pattern: a row of buttons all sharing the same data-action.
     Clicking one selects it (adds is-selected) and removes selection from siblings.
     Writes the chosen value to state under a state key derived from the action.
  */

  function bindSelectorGroup(action, stateKey, parse) {
    document.querySelectorAll(`.pbtn[data-action="${action}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const value = parse ? parse(btn.dataset.value) : btn.dataset.value;
        TEM.state.set(stateKey, value);
      });
    });
    // Subscribe: highlight the currently selected button
    TEM.state.subscribeKey(stateKey, (val) => {
      const targetStr = val == null ? null : String(val);
      document.querySelectorAll(`.pbtn[data-action="${action}"]`).forEach(btn => {
        btn.classList.toggle('is-selected', btn.dataset.value === targetStr);
      });
    });
  }

  function bindSampleSelector()  { bindSelectorGroup('sample',          'sample');                                }
  function bindAccVoltage()      { bindSelectorGroup('acc-voltage',     'accVoltage',     v => parseInt(v, 10));  }
  function bindModeSelector()    { bindSelectorGroup('mode',            'mode');                                  }
  function bindMagnification()   { bindSelectorGroup('magnification',   'magnification');                         }

  /* -------------------- Aperture select/size (special — select drives multiple state slots) -------------------- */

  function bindApertureControls() {
    // Aperture selector — also drives diagram hotspot focus
    document.querySelectorAll('.pbtn[data-action="aperture-select"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        TEM.state.set('currentAperture', btn.dataset.value);
      });
    });
    TEM.state.subscribeKey('currentAperture', (val) => {
      document.querySelectorAll('.pbtn[data-action="aperture-select"]').forEach(btn => {
        btn.classList.toggle('is-selected', btn.dataset.value === val);
      });
    });

    // Aperture size — writes to condenserSize OR objectiveSize based on currentAperture
    document.querySelectorAll('.pbtn[data-action="aperture-size"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const which = TEM.state.get('currentAperture');
        if (which === 'condenser') TEM.state.set('condenserSize', btn.dataset.value);
        else if (which === 'objective') TEM.state.set('objectiveSize', btn.dataset.value);
      });
    });
    // Subscribe: light the appropriate size button based on which aperture is selected
    const reflectSize = () => {
      const which = TEM.state.get('currentAperture');
      let size = null;
      if (which === 'condenser') size = TEM.state.get('condenserSize');
      else if (which === 'objective') size = TEM.state.get('objectiveSize');
      document.querySelectorAll('.pbtn[data-action="aperture-size"]').forEach(btn => {
        btn.classList.toggle('is-selected', btn.dataset.value === size);
      });
    };
    TEM.state.subscribeKey('currentAperture', reflectSize);
    TEM.state.subscribeKey('condenserSize', reflectSize);
    TEM.state.subscribeKey('objectiveSize', reflectSize);
  }

  /* -------------------- Toggle buttons (Pump, Specimen Insert, Beam On, Wobbler, Camera Insert) -------------------- */

  function bindToggle(action, stateKey) {
    const btn = document.querySelector(`.pbtn[data-action="${action}"]`);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      // For pump and specimen-insert, clicking turns it on (one-way).
      // For beam-on, wobbler, camera-insert — toggleable in principle, but in the
      // guided flow they typically also one-way. We toggle to support replay/restart cases.
      TEM.state.set(stateKey, !TEM.state.get(stateKey));
    });
    TEM.state.subscribeKey(stateKey, (val) => {
      btn.classList.toggle('is-on', !!val);
    });
  }

  function bindAirlock()        { bindToggle('airlock-pump',    'airlockPumped'); }
  function bindSpecimenInsert() { bindToggle('specimen-insert', 'specimenInsertedPanel'); }
  function bindBeamOn()         { bindToggle('beam-on',         'beamOn'); }
  function bindWobbler()        { bindToggle('wobbler-toggle',  'wobblerOn'); }
  function bindCameraInsert()   { bindToggle('camera-insert',   'cameraInserted'); }

  /* -------------------- Knobs --------------------
     The Phase 1.5 controls-ui.js already binds the visual behavior; we just
     pipe its onChange into state.set().
  */

  function bindKnobs() {
    document.querySelectorAll('.knob').forEach(knob => {
      const key = knob.dataset.knob;
      const min = +(knob.dataset.min ?? 0);
      const max = +(knob.dataset.max ?? 100);
      const initial = TEM.state.get(camelize(key)) ?? +(knob.dataset.value ?? min);

      const handle = TEM.controlsUI.bindKnob(knob, {
        min, max, value: initial,
        onChange(v) { TEM.state.set(camelize(key), v); },
      });

      // Two-way: if state changes from elsewhere (e.g. reset), update the knob.
      TEM.state.subscribeKey(camelize(key), (val) => {
        if (val !== handle.value) handle.value = val;
      });
    });
  }

  /* -------------------- Trackpads -------------------- */

  function bindTrackpads() {
    document.querySelectorAll('.trackpad').forEach(pad => {
      const key = pad.dataset.trackpad;
      const [rMin, rMax] = (pad.dataset.range || '-50,50').split(',').map(Number);
      const stateKey = camelize(key);
      const initial = TEM.state.get(stateKey) || { x: 0, y: 0 };

      const handle = TEM.controlsUI.bindTrackpad(pad, {
        rangeX: [rMin, rMax],
        rangeY: [rMin, rMax],
        valueX: initial.x, valueY: initial.y,
        onChange({ x, y }) { TEM.state.set(stateKey, { x, y }); },
      });

      TEM.state.subscribeKey(stateKey, (val) => {
        if (!val) return;
        const cur = handle.value;
        if (cur.x !== val.x || cur.y !== val.y) handle.value = val;
      });
    });
  }

  /* -------------------- Stage Z rocker -------------------- */

  function bindStageZ() {
    document.querySelectorAll('[data-action="stage-z"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = +btn.dataset.dir;
        const cur = TEM.state.get('stageZ');
        const next = Math.max(-50, Math.min(50, cur + dir));
        TEM.state.set('stageZ', next);
      });
    });
  }

  /* -------------------- Acquire -------------------- */

  function bindAcquire() {
    const btn = document.querySelector('.pbtn[data-action="acquire"]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      TEM.state.set('imageAcquired', true);
      if (TEM.acquire && TEM.acquire.capture) TEM.acquire.capture();
    });
  }

  /* -------------------- Readouts (subscribe to state) -------------------- */

  function subscribeReadouts() {
    const xEl = document.getElementById('readout-x');
    const yEl = document.getElementById('readout-y');
    const zEl = document.getElementById('readout-z');
    TEM.state.subscribeKey('stageX', (v) => xEl && (xEl.textContent = String(Math.round(v))));
    TEM.state.subscribeKey('stageY', (v) => yEl && (yEl.textContent = String(Math.round(v))));
    TEM.state.subscribeKey('stageZ', (v) => zEl && (zEl.textContent = String(Math.round(v))));
  }

  /* -------------------- Status strip live indicators -------------------- */

  function subscribeStatusStrip() {
    const indVacuum = document.getElementById('ind-vacuum');
    const indBeam   = document.getElementById('ind-beam');
    const indHT     = document.getElementById('ind-ht');
    const indSample = document.getElementById('ind-sample');
    const indMag    = document.getElementById('ind-mag');

    TEM.state.subscribeKey('airlockPumped', (v) => {
      if (indVacuum) indVacuum.classList.toggle('is-on', !!v);
    });
    TEM.state.subscribeKey('beamOn', (v) => {
      if (indBeam) indBeam.classList.toggle('is-on', !!v);
    });
    TEM.state.subscribeKey('accVoltage', (v) => {
      if (indHT) indHT.textContent = v ? `${v} kV` : '—';
    });
    TEM.state.subscribeKey('sample', (v) => {
      if (indSample) indSample.textContent = v ? v.charAt(0).toUpperCase() + v.slice(1) : '—';
    });
    TEM.state.subscribeKey('magnification', (v) => {
      if (indMag) indMag.textContent = v ? v.toUpperCase() : '—';
    });
  }

  /* -------------------- Button state reflection
     Most select-buttons are handled by bindSelectorGroup above; this section
     handles the LED-button on/off reflection for toggle controls (set above
     via bindToggle), and the disabled/enabled state of locked controls.
  */
  function subscribeButtonStates() {
    // Nothing extra here right now — bindToggle and the controller handle these.
  }

  /* -------------------- Feedback poke
     Any state change while a hint is pending should reset the timer.
  */
  function subscribeFeedbackPoke() {
    TEM.state.subscribe(() => {
      if (TEM.feedback && TEM.feedback.poke) TEM.feedback.poke();
    });
  }

  /* -------------------- helpers -------------------- */

  /** "beam-current" → "beamCurrent" */
  function camelize(s) {
    return String(s).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  window.TEM = window.TEM || {};
  window.TEM.controls = { init };

  // Note: controls.init() is called by guided-controller after state is ready.
})();
