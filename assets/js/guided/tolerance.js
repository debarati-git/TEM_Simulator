/* =========================================================================
   Guided Simulator — Tolerance / sweet-spot evaluator
   Loads sweet-spot predicates from guided-config.json and evaluates them
   against state values.

   Usage:
     await TEM.tolerance.load();
     TEM.tolerance.inSweetSpot('beamShift_center', state.beamShift);
   ========================================================================= */

(function () {
  'use strict';

  let config = null;

  /**
   * Load the sweet-spot config. Prefer the embedded global
   * TEM.dataGuidedConfig (works under file:// and http://) and fall
   * back to fetching the JSON file if needed (dev environments).
   */
  async function load(url) {
    if (window.TEM && window.TEM.dataGuidedConfig) {
      config = window.TEM.dataGuidedConfig;
      return config;
    }
    try {
      const path = url || resolveDataPath('guided-config.json');
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      config = await res.json();
      return config;
    } catch (e) {
      console.error('Failed to load guided-config:', e);
      throw e;
    }
  }

  function resolveDataPath(filename) {
    // We're at pages/microscope-guided.html — data sits one level up
    return `../data/${filename}`;
  }

  /**
   * Evaluate a sweet-spot predicate against a value.
   * @param {string} key   — sweet spot id in guided-config.json
   * @param {*} value      — number, or { x, y }, or { x, y, z }
   * @returns {boolean}
   */
  function inSweetSpot(key, value) {
    if (!config || !config.sweetSpots || !config.sweetSpots[key]) return false;
    const predStr = config.sweetSpots[key].predicate;

    // Predicates use the variables x, y, z, v — extract them from the input
    let x = 0, y = 0, z = 0, v = 0;
    if (typeof value === 'number') {
      v = value;
    } else if (value && typeof value === 'object') {
      if ('x' in value) x = +value.x || 0;
      if ('y' in value) y = +value.y || 0;
      if ('z' in value) z = +value.z || 0;
      if ('v' in value) v = +value.v || 0;
    }

    // Compile a safe predicate function. Only arithmetic + Math.abs allowed.
    // The predicate string comes from our own config file, not user input.
    try {
      const fn = new Function('x', 'y', 'z', 'v', 'abs',
        `return (${predStr});`);
      return !!fn(x, y, z, v, Math.abs);
    } catch (e) {
      console.error(`Bad predicate for ${key}:`, predStr, e);
      return false;
    }
  }

  /** Get the raw config (useful for renderers that need image paths etc.) */
  function getConfig() { return config; }

  window.TEM = window.TEM || {};
  window.TEM.tolerance = { load, inSweetSpot, getConfig };
})();
