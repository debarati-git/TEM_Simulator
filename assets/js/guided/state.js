/* =========================================================================
   Guided Simulator — State Store
   A flat key-value store with pub/sub. Every control writes via set();
   every renderer/readout reads via get() or subscribe().

   Usage:
     TEM.state.set('beamOn', true)
     TEM.state.get('beamOn')
     TEM.state.subscribe((key, value, prev, all) => { ... })
     TEM.state.subscribeKey('beamOn', (value, prev) => { ... })
     TEM.state.reset()
   ========================================================================= */

(function () {
  'use strict';

  /** Initial state shape — see docs/design-notes.md for the rationale. */
  const initial = {
    // Sample
    sample: null,                       // 'nanoparticles' | etc.

    // Column / vacuum
    holderRemoved: false,
    specimenInsertedDiagram: false,     // clicked diagram hotspot
    specimenInsertedPanel:   false,     // clicked panel Insert button
    airlockPumped: false,

    // Beam
    accVoltage: null,                   // 120 | 200
    beamOn: false,
    beamCurrent: 50,
    brightness: 50,
    beamShift: { x: 0, y: 0 },
    stigmator: { x: 0, y: 0 },

    // Apertures
    currentAperture: null,              // 'condenser' | 'objective' | 'sad'
    condenserInserted: false,
    objectiveInserted: false,
    condenserSize: null,
    objectiveSize: null,
    apertureAlignment: { x: 0, y: 0 },

    // Stage
    stageX: 0, stageY: 0, stageZ: 0,

    // Imaging
    wobblerOn: false,
    magnification: null,                // 'low' | 'medium' | 'high'
    mode: null,                         // 'diffraction' | 'imaging'
    focus: 0,

    // Camera
    cameraInserted: false,
    imageAcquired: false,

    // Meta
    currentStepId: 1,
  };

  /** Deep clone — values are primitives or shallow objects in this state. */
  function clone(v) {
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map(clone);
    const out = {};
    for (const k in v) out[k] = clone(v[k]);
    return out;
  }

  function equal(a, b) {
    if (a === b) return true;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const ak = Object.keys(a), bk = Object.keys(b);
      if (ak.length !== bk.length) return false;
      return ak.every(k => equal(a[k], b[k]));
    }
    return false;
  }

  let data = clone(initial);
  const subscribers = [];          // (key, value, prev, all) => void
  const keySubs = new Map();       // key → array of (value, prev) => void

  function get(key) { return clone(data[key]); }
  function getAll() { return clone(data); }

  function set(key, value) {
    const prev = data[key];
    if (equal(prev, value)) return;
    data[key] = clone(value);

    for (const fn of subscribers) {
      try { fn(key, data[key], prev, data); }
      catch (e) { console.error('state subscriber error:', e); }
    }
    const ks = keySubs.get(key);
    if (ks) {
      for (const fn of ks) {
        try { fn(data[key], prev); }
        catch (e) { console.error('state keysub error:', e); }
      }
    }
  }

  function subscribe(fn) {
    subscribers.push(fn);
    return () => {
      const i = subscribers.indexOf(fn);
      if (i >= 0) subscribers.splice(i, 1);
    };
  }

  function subscribeKey(key, fn) {
    let arr = keySubs.get(key);
    if (!arr) { arr = []; keySubs.set(key, arr); }
    arr.push(fn);
    return () => {
      const i = arr.indexOf(fn);
      if (i >= 0) arr.splice(i, 1);
    };
  }

  function reset() {
    const prev = data;
    data = clone(initial);
    for (const key in data) {
      if (!equal(prev[key], data[key])) {
        for (const fn of subscribers) fn(key, data[key], prev[key], data);
        const ks = keySubs.get(key);
        if (ks) for (const fn of ks) fn(data[key], prev[key]);
      }
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.state = { get, getAll, set, subscribe, subscribeKey, reset };
})();
