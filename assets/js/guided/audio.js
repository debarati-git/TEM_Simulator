/* =========================================================================
   Guided Simulator — Instruction Audio (Text-to-Speech)
   Reads the on-screen instruction text aloud using the browser's built-in
   SpeechSynthesis API. No audio files — keeps the project file://-friendly
   and offline-capable.

   Off by default on every page load. The learner opts in via the toggle
   button in the instruction bar; the choice is NOT persisted across
   reloads (always starts OFF), per project decision.

   Usage:
     TEM.audio.init(toggleBtnEl)   — wire the toggle button, set initial icon
     TEM.audio.speak(text)         — speak text if enabled (cancels any
                                      utterance already in progress)
     TEM.audio.setEnabled(bool)    — turn on/off; speaking on speaks the
                                      current instruction immediately
     TEM.audio.isEnabled()
   ========================================================================= */

(function () {
  'use strict';

  var supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  var enabled = false;
  var toggleBtn = null;
  var getCurrentText = null; // fn returning the live instruction string

  function pickVoice() {
    var voices = supported ? window.speechSynthesis.getVoices() : [];
    if (!voices || !voices.length) return null;
    // Prefer an Indian-English voice (browser/OS dependent — common names
    // include "Google हिन्दी" is Hindi, not this; look for en-IN lang tag
    // or an explicit "India" in the voice name, e.g. "Microsoft Heera",
    // "Microsoft Ravi", "Rishi", "Veena", "Google UK English India" variants).
    return voices.find(function (v) { return /^en[-_]in\b/i.test(v.lang); })
      || voices.find(function (v) { return /india/i.test(v.name); })
      || voices.find(function (v) { return /^en/i.test(v.lang) && v.default; })
      || voices.find(function (v) { return /^en/i.test(v.lang); })
      || voices[0];
  }

  function speak(text) {
    if (!supported || !enabled || !text) return;
    var clean = String(text).trim();
    if (!clean) return;

    window.speechSynthesis.cancel(); // never let utterances overlap/queue

    var utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 0.7;
    utter.pitch = 1;
    var voice = pickVoice();
    if (voice) utter.voice = voice;

    window.speechSynthesis.speak(utter);
  }

  function stop() {
    if (supported) window.speechSynthesis.cancel();
  }

  function updateButton() {
    if (!toggleBtn) return;
    toggleBtn.classList.toggle('is-active', enabled);
    toggleBtn.setAttribute('aria-pressed', String(enabled));
    toggleBtn.title = enabled ? 'Turn off voice instructions' : 'Turn on voice instructions';
  }

  function setEnabled(next) {
    enabled = !!next;
    updateButton();
    if (enabled) {
      // Speak whatever is currently on screen right away, so turning audio
      // on mid-step doesn't leave the learner waiting for the next step.
      speak(getCurrentText ? getCurrentText() : null);
    } else {
      stop();
    }
  }

  function isEnabled() { return enabled; }

  var hintTimer = null;

  /** Show the "psst, audio exists" callout every time the pre-start screen
   *  appears (initial load and every Restart). */
  function showHint() {
    if (!supported) return;
    var hintEl = document.getElementById('audio-hint');
    if (!hintEl) return;

    if (hintTimer) { window.clearTimeout(hintTimer); hintTimer = null; }
    hintEl.classList.add('is-visible');
    hintTimer = window.setTimeout(dismissHint, 12000);
  }

  function dismissHint() {
    var hintEl = document.getElementById('audio-hint');
    if (hintEl) hintEl.classList.remove('is-visible');
    if (hintTimer) { window.clearTimeout(hintTimer); hintTimer = null; }
  }

  function init(toggleBtnEl, currentTextFn) {
    toggleBtn = toggleBtnEl || null;
    getCurrentText = typeof currentTextFn === 'function' ? currentTextFn : null;

    if (!supported) {
      if (toggleBtn) {
        toggleBtn.disabled = true;
        toggleBtn.classList.add('is-unsupported');
        toggleBtn.title = 'Voice instructions are not supported in this browser';
      }
      return;
    }

    // Some browsers (Chrome) load voice list asynchronously.
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = function () {};
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        dismissHint();
        setEnabled(!enabled);
      });
    }

    var closeBtn = document.getElementById('audio-hint-close');
    if (closeBtn) closeBtn.addEventListener('click', dismissHint);

    // Stop any speech if the learner navigates away.
    window.addEventListener('beforeunload', stop);
    window.addEventListener('pagehide', stop);

    updateButton();
  }

  window.TEM = window.TEM || {};
  window.TEM.audio = {
    init: init,
    speak: speak,
    stop: stop,
    setEnabled: setEnabled,
    isEnabled: isEnabled,
    showHint: showHint,
    dismissHint: dismissHint
  };
})();
