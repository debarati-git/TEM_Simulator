/* =========================================================================
   TEM Simulator — Control UI Behaviors
   Knob (circular drag) and Trackpad (XY drag) interaction logic.

   These are presentation-layer behaviors. They don't know about TEM state —
   they just emit input events with current values. Phase 2's controls.js
   will subscribe to those events and mutate state.

   API:
     TEM.controlsUI.bindKnob(el, { min, max, value, onChange })
     TEM.controlsUI.bindTrackpad(el, { rangeX, rangeY, onChange })
   ========================================================================= */

(function () {
  'use strict';

  /* ---------------- KNOB ---------------- */

  /**
   * Wire up a .knob element for circular drag.
   * Mouse/touch position relative to knob center is mapped to an angle,
   * which maps to a value in [min, max]. The visible arc is 270° (from
   * -135° at bottom-left to +135° at bottom-right) — the bottom 90° is
   * dead zone (the "missing" wedge at the bottom of a real rotary knob).
   *
   * Options:
   *   min, max          numeric range
   *   value             initial value
   *   onChange(v)       called with the new value while dragging
   *   format(v)         optional fn to format the value readout (default: rounded)
   */
  function bindKnob(el, opts = {}) {
    const min = opts.min ?? 0;
    const max = opts.max ?? 100;
    const format = opts.format ?? ((v) => Math.round(v));
    let value = opts.value ?? min;

    const valueEl = el.querySelector('.knob__value');
    const bodyEl  = el.querySelector('.knob__body');
    const arcEl   = el.querySelector('.knob__arc');

    function render() {
      const t = (value - min) / (max - min);          // 0..1
      const deg = -135 + (t * 270);                   // -135..+135 degrees
      const arcDeg = t * 270;                         // 0..270 for the progress arc
      el.style.setProperty('--rot', `${deg}deg`);
      if (arcEl) arcEl.style.setProperty('--arc-deg', `${arcDeg}deg`);
      if (valueEl) valueEl.textContent = format(value);
    }

    function angleFromPointer(clientX, clientY) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // atan2 returns -π..π. We want 0° at top, clockwise positive.
      // Standard CSS rotation is also 0° at top, clockwise positive, so we can
      // just compute the angle and feed it directly.
      const dx = clientX - cx;
      const dy = clientY - cy;
      // angle in degrees, 0° = up, +ve clockwise
      let deg = Math.atan2(dx, -dy) * (180 / Math.PI);
      // Clamp to the knob's valid range: -135° to +135° (270° arc)
      if (deg > 135)  deg = 135;
      if (deg < -135) deg = -135;
      return deg;
    }

    function setFromPointer(clientX, clientY) {
      const deg = angleFromPointer(clientX, clientY);
      const t = (deg + 135) / 270;                    // 0..1
      const newVal = min + t * (max - min);
      if (newVal !== value) {
        value = newVal;
        render();
        if (opts.onChange) opts.onChange(value);
      }
    }

    let dragging = false;
    function onDown(e) {
      // Only respond on left mouse / single touch
      if (e.type === 'mousedown' && e.button !== 0) return;
      dragging = true;
      el.setPointerCapture?.(e.pointerId ?? 0);
      const pt = pointerOf(e);
      setFromPointer(pt.x, pt.y);
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      const pt = pointerOf(e);
      setFromPointer(pt.x, pt.y);
    }
    function onUp() { dragging = false; }

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    // Keyboard accessibility — arrows fine, shift+arrow coarse
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-valuemin', String(min));
    el.setAttribute('aria-valuemax', String(max));
    el.addEventListener('keydown', (e) => {
      const step = (e.shiftKey ? (max - min) / 10 : (max - min) / 100);
      let dv = 0;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') dv = step;
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') dv = -step;
      if (dv) {
        value = Math.max(min, Math.min(max, value + dv));
        render();
        if (opts.onChange) opts.onChange(value);
        e.preventDefault();
      }
    });

    render();

    return {
      get value() { return value; },
      set value(v) { value = Math.max(min, Math.min(max, v)); render(); },
    };
  }

  /* ---------------- TRACKPAD ---------------- */

  /**
   * Wire up a .trackpad element for XY drag.
   * Click-and-drag inside the pad sets the cursor dot's position.
   * The position is mapped from pad space [-1..1, -1..1] to the supplied
   * [rangeX, rangeY] ranges (each is [min, max]).
   *
   * Options:
   *   rangeX, rangeY       [min, max]
   *   valueX, valueY       initial values
   *   onChange({x, y})     called with new values while dragging
   *   readout              optional element to receive a "X.XX, Y.YY" string
   */
  function bindTrackpad(el, opts = {}) {
    const rx = opts.rangeX ?? [-50, 50];
    const ry = opts.rangeY ?? [-50, 50];
    let valX = opts.valueX ?? (rx[0] + rx[1]) / 2;
    let valY = opts.valueY ?? (ry[0] + ry[1]) / 2;

    const dotEl     = el.querySelector('.trackpad__dot');
    const readoutEl = opts.readout || null;

    function render() {
      // Map values to percentage positions inside the pad.
      // X: rx[0] → 0%, rx[1] → 100%
      // Y: ry[0] → 100% (bottom), ry[1] → 0% (top) — flip y so up = positive
      const px = (valX - rx[0]) / (rx[1] - rx[0]) * 100;
      const py = (1 - (valY - ry[0]) / (ry[1] - ry[0])) * 100;
      if (dotEl) {
        dotEl.style.setProperty('--dot-x', `${px}%`);
        dotEl.style.setProperty('--dot-y', `${py}%`);
      }
      if (readoutEl) {
        readoutEl.textContent = `X ${valX.toFixed(0)}  ·  Y ${valY.toFixed(0)}`;
      }
    }

    function setFromPointer(clientX, clientY) {
      const rect = el.getBoundingClientRect();
      // 0..1 within the pad
      let tx = (clientX - rect.left) / rect.width;
      let ty = (clientY - rect.top) / rect.height;
      tx = Math.max(0, Math.min(1, tx));
      ty = Math.max(0, Math.min(1, ty));
      const newX = rx[0] + tx * (rx[1] - rx[0]);
      const newY = ry[0] + (1 - ty) * (ry[1] - ry[0]);
      if (newX !== valX || newY !== valY) {
        valX = newX; valY = newY;
        render();
        if (opts.onChange) opts.onChange({ x: valX, y: valY });
      }
    }

    let dragging = false;
    el.addEventListener('pointerdown', (e) => {
      if (e.type === 'mousedown' && e.button !== 0) return;
      dragging = true;
      el.setPointerCapture?.(e.pointerId ?? 0);
      setFromPointer(e.clientX, e.clientY);
      e.preventDefault();
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      setFromPointer(e.clientX, e.clientY);
    });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointercancel', () => { dragging = false; });

    render();

    return {
      get value() { return { x: valX, y: valY }; },
      set value({ x, y }) {
        valX = Math.max(rx[0], Math.min(rx[1], x));
        valY = Math.max(ry[0], Math.min(ry[1], y));
        render();
      },
    };
  }

  /* ---------------- helpers ---------------- */

  function pointerOf(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  window.TEM = window.TEM || {};
  window.TEM.controlsUI = { bindKnob, bindTrackpad };
})();
