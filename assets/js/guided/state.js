/* =========================================================================
   Guided Simulator — State Store  (v2.0)
   Flat key-value store with pub/sub.
   ========================================================================= */
(function () {
  'use strict';

  var initial = {
    // Sample & holder
    sample: null,
    holderType: null,
    stageNeutralized: false,
    holderRemoved: false,
    specimenInsertedDiagram: false,
    specimenInsertedPanel: false,
    airlockPumped: false,

    // Beam
    accVoltage: null,
    beamOn: false,
    beamCurrent: 50,
    brightness: 50,

    // DEF/STIG — single pad, multi-mode
    // No DEF/STIG mode is preselected. The learner must explicitly choose
    // SHIFT at the beam-centring step, after which the selected button stays
    // visibly highlighted like the other selector controls.
    defStigMode: null,
    beamShift:   { x: 0, y: 0 },
    condStig:    { x: 0, y: 0 },
    objStig:     { x: 0, y: 0 },

    // Apertures
    currentAperture: null,
    condenserInserted: false,
    objectiveInserted: false,
    condenserSize: null,
    objectiveSize: null,
    apertureAlignment: { x: 0, y: 0 },

    // Stage
    stageX: 0, stageY: 0, stageZ: 0,

    // Imaging
    imagingMode: 'mag1',
    magnification: null,
    wobblerOn: false,
    focusCoarse: 0,
    focusFine: 0,
    // Focus-step interaction flags. Fine adjustment is accepted only after
    // the learner has first operated the coarse-focus knob.
    focusCoarseAdjusted: false,
    focusFineAdjusted: false,
    stdFocusReset: false,

    // PC2 Camera
    screenRaised: false,
    cameraInserted: false,
    cameraLiveView: false,
    liveFFTOn: false,
    imageAcquired: false,

    // Meta
    currentStepId: 1
  };

  function clone(v) {
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map(clone);
    var out = {};
    for (var k in v) out[k] = clone(v[k]);
    return out;
  }

  function equal(a, b) {
    if (a === b) return true;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      var ak = Object.keys(a), bk = Object.keys(b);
      if (ak.length !== bk.length) return false;
      return ak.every(function(k){ return equal(a[k], b[k]); });
    }
    return false;
  }

  var data = clone(initial);
  var subscribers = [];
  var keySubs = new Map();

  function get(key) { return clone(data[key]); }
  function getAll() { return clone(data); }

  function set(key, value) {
    var prev = data[key];
    if (equal(prev, value)) return;
    data[key] = clone(value);
    for (var i = 0; i < subscribers.length; i++) {
      try { subscribers[i](key, data[key], prev, data); }
      catch (e) { console.error('state subscriber error:', e); }
    }
    var ks = keySubs.get(key);
    if (ks) {
      for (var j = 0; j < ks.length; j++) {
        try { ks[j](data[key], prev); }
        catch (e) { console.error('state keysub error:', e); }
      }
    }
  }

  function subscribe(fn) {
    subscribers.push(fn);
    return function() {
      var i = subscribers.indexOf(fn);
      if (i >= 0) subscribers.splice(i, 1);
    };
  }

  function subscribeKey(key, fn) {
    var arr = keySubs.get(key);
    if (!arr) { arr = []; keySubs.set(key, arr); }
    arr.push(fn);
    return function() {
      var i = arr.indexOf(fn);
      if (i >= 0) arr.splice(i, 1);
    };
  }

  function reset() {
    var prev = data;
    data = clone(initial);
    for (var key in data) {
      if (!equal(prev[key], data[key])) {
        for (var i = 0; i < subscribers.length; i++) subscribers[i](key, data[key], prev[key], data);
        var ks = keySubs.get(key);
        if (ks) for (var j = 0; j < ks.length; j++) ks[j](data[key], prev[key]);
      }
    }
  }

  function getInitial() { return clone(initial); }

  window.TEM = window.TEM || {};
  window.TEM.state = { get: get, getAll: getAll, set: set, subscribe: subscribe, subscribeKey: subscribeKey, reset: reset, getInitial: getInitial };
})();
