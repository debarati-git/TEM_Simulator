/* =========================================================================
   Guided Simulator — Inline hint feedback
   Shows a contextual hint under the instruction text after N seconds of
   user inactivity at a wrong value. Hint clears when value changes again.

   Usage:
     TEM.feedback.armHint(text, delayMs)  — start the timer
     TEM.feedback.clearHint()             — clear immediately
     TEM.feedback.poke()                  — value changed; reset the timer
   ========================================================================= */

(function () {
  'use strict';

  let currentHint = null;
  let timer = null;
  let delay = 3000;

  function hintEl() {
    return document.getElementById('instr-hint');
  }

  /** Arm a hint to appear after `delayMs` of inactivity. */
  function armHint(text, delayMs) {
    clearTimer();
    currentHint = text;
    delay = delayMs ?? 3000;
    timer = setTimeout(showHint, delay);
  }

  /** Reset the timer (called when state mutates) — keeps the same hint text. */
  function poke() {
    if (!currentHint) return;
    clearTimer();
    timer = setTimeout(showHint, delay);
    // Hide any visible hint until user pauses again
    const el = hintEl();
    if (el) el.classList.remove('is-visible');
  }

  function showHint() {
    const el = hintEl();
    if (!el || !currentHint) return;
    el.textContent = currentHint;
    el.classList.add('is-visible');
  }

  function clearHint() {
    clearTimer();
    currentHint = null;
    const el = hintEl();
    if (el) {
      el.classList.remove('is-visible');
      el.textContent = '';
    }
  }

  function clearTimer() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  window.TEM = window.TEM || {};
  window.TEM.feedback = { armHint, clearHint, poke };
})();
