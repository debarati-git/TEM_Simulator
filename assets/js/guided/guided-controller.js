/* =========================================================================
   Guided Simulator — Step Orchestrator
   The heart of guided mode. Loads steps from JSON, manages the active
   step, locks/unlocks controls accordingly, watches state for success
   conditions, advances when satisfied, and updates the UI (instruction
   text, progress bar, viewer auto-switch).
   ========================================================================= */

(function () {
  'use strict';

  let steps = [];
  let currentStepIndex = 0;
  let stepStartedAt = 0;
  let hintArmed = false;

  /* -------------------- Boot -------------------- */

  async function init() {
    try {
      // Prefer embedded data (works under file:// too). Fall back to fetch.
      if (window.TEM && window.TEM.dataGuidedSteps) {
        steps = window.TEM.dataGuidedSteps.steps;
        await TEM.tolerance.load();
      } else {
        const [stepsRes] = await Promise.all([
          fetch('../data/guided-steps.json').then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
          }),
          TEM.tolerance.load(),
        ]);
        steps = stepsRes.steps;
      }
    } catch (e) {
      console.error('Guided controller init failed:', e);
      showInitError(e);
      return;
    }

    // Wire viewer tabs (column / screen toggle)
    document.querySelectorAll('.viewer__tab').forEach(tab => {
      tab.addEventListener('click', () => setViewer(tab.dataset.view));
    });

    // Wire fullscreen toggle
    wireFullscreen();

    // Restart button
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) restartBtn.addEventListener('click', restart);

    // Initialize control wiring (subscribers to state)
    TEM.controls.init();
    TEM.diagram.init();
    TEM.imageRenderer.init();

    // Subscribe to state to check success after every mutation
    TEM.state.subscribe(onStateChange);

    // Show step 1
    activateStep(0);
  }

  /** If we couldn't load data, surface a readable error rather than
      leaving every control silently locked. */
  function showInitError(e) {
    const instrEl = document.getElementById('instr-text');
    if (instrEl) {
      instrEl.textContent =
        'Guided session couldn\'t load. Try opening the simulator via a local web server ' +
        '(e.g. `python3 -m http.server` in the project root) or check the browser console.';
    }
  }

  /* -------------------- Fullscreen toggle --------------------
     Uses the native Fullscreen API to make the entire simulator (the
     whole document body) fill the screen. Browser chrome hides; the
     user sees only the simulator. Esc returns to normal.
  */
  function wireFullscreen() {
    const btn = document.getElementById('btn-fullscreen');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const inFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (inFS) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) try { exit.call(document); } catch (e) { /* ignore */ }
      } else {
        const target = document.documentElement;          // entire app
        const req = target.requestFullscreen || target.webkitRequestFullscreen;
        if (req) try { req.call(target); } catch (e) { /* ignore */ }
      }
    });

    // Sync class state when user enters or exits (also handles Esc)
    const onFSChange = () => {
      const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
      document.body.classList.toggle('is-fullscreen', active);
      if (TEM.diagram && TEM.diagram.repositionHotspots) {
        setTimeout(TEM.diagram.repositionHotspots, 100);
      }
    };
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);
  }

  /* -------------------- Step activation -------------------- */

  function activateStep(index) {
    currentStepIndex = index;
    stepStartedAt = Date.now();
    hintArmed = false;

    const step = steps[index];
    if (!step) {
      finish();
      return;
    }

    TEM.state.set('currentStepId', step.id);

    // Update instruction text
    const instrEl = document.getElementById('instr-text');
    if (instrEl) instrEl.textContent = step.instruction;

    // Clear any visible hint from the previous step
    if (TEM.feedback && TEM.feedback.clearHint) TEM.feedback.clearHint();

    // Lock all controls, then unlock just this step's targets
    applyLockState(step);

    // Highlight diagram hotspot if this step has one
    TEM.diagram.setActiveHotspot(diagramHotspotForStep(step));

    // Update progress bar
    setProgress((index) / steps.length);

    // Optional: switch viewer at certain steps
    if (step.switchViewerTo) setViewer(step.switchViewerTo);

    // After a brief delay, arm the hint timer if the step has a hint
    if (step.hint) {
      setTimeout(() => {
        if (currentStepIndex === index && !checkSuccess(step)) {
          if (TEM.feedback) TEM.feedback.armHint(step.hint, 3000);
          hintArmed = true;
        }
      }, 800);
    }
  }

  function finish() {
    setProgress(1);
    const instrEl = document.getElementById('instr-text');
    if (instrEl) {
      instrEl.textContent = 'Session complete. Your image has been downloaded. Press Restart to run again.';
    }
    // Lock everything
    document.querySelectorAll('.ctl').forEach(c => c.classList.remove('is-active'));
    TEM.diagram.setActiveHotspot(null);
  }

  /* -------------------- Lock / unlock controls -------------------- */

  /**
   * Strict guided mode: every control with [data-control] is locked, then
   * only the targets in step.unlocks are unlocked. Buttons with [data-action]
   * inside locked controls are also disabled at the button level so disabled
   * styles apply cleanly.
   */
  function applyLockState(step) {
    const targets = new Set(step.unlocks || []);

    document.querySelectorAll('.ctl[data-control]').forEach(ctl => {
      const key = ctl.dataset.control;
      const active = targets.has(key);
      ctl.classList.toggle('is-active', active);
    });
  }

  /* -------------------- State change → check success -------------------- */

  function onStateChange(key, value, prev, all) {
    const step = steps[currentStepIndex];
    if (!step) return;

    // Hint timer: if user is fiddling, defer the hint
    if (hintArmed && TEM.feedback) TEM.feedback.poke();

    if (checkSuccess(step)) {
      // Small delay so the user sees their final action register before advancing
      setTimeout(() => {
        // Re-check in case state changed during the delay
        if (checkSuccess(steps[currentStepIndex])) {
          activateStep(currentStepIndex + 1);
        }
      }, 350);
    }
  }

  /* -------------------- Success condition evaluation -------------------- */

  function checkSuccess(step) {
    if (!step || !step.successCondition) return false;
    return evalCondition(step.successCondition);
  }

  function evalCondition(cond) {
    if (!cond) return false;

    if (cond.type === 'composite' && Array.isArray(cond.all)) {
      return cond.all.every(evalCondition);
    }

    if (cond.type === 'selectValue') {
      const actual = TEM.state.get(cond.key);
      return actual === cond.value;
    }

    if (cond.type === 'valueInRange') {
      // The "stage" key composes stageX and stageY into { x, y } for the predicate
      let value;
      if (cond.key === 'stage') {
        value = { x: TEM.state.get('stageX'), y: TEM.state.get('stageY') };
      } else {
        value = TEM.state.get(cond.key);
      }
      return TEM.tolerance.inSweetSpot(cond.spot, value);
    }

    if (cond.type === 'click') {
      // 'click' is a special-case selectValue where the click target itself
      // is what we're watching. The diagram click handlers set the
      // corresponding state key, so we just compare to true.
      return TEM.state.get(cond.key) === true;
    }

    return false;
  }

  /* -------------------- Map step to diagram hotspot (if any) -------------------- */

  function diagramHotspotForStep(step) {
    // Steps that involve a diagram click drive a specific hotspot.
    switch (step.id) {
      case 1: return 'remove-holder';
      case 3: return 'insert-specimen';
      case 10: return 'insert-condenser';
      case 19: return 'insert-objective';
      default: return null;
    }
  }

  /* -------------------- Viewer tab switcher -------------------- */

  function setViewer(which) {
    document.querySelectorAll('.viewer__tab').forEach(t => {
      const active = t.dataset.view === which;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.viewer__panel').forEach(p => {
      p.classList.toggle('is-active', p.dataset.viewPanel === which);
    });
    const caption = document.getElementById('viewer-caption');
    if (caption) {
      caption.textContent = which === 'column'
        ? 'FIG · ELECTRON OPTICAL COLUMN'
        : 'VIEWING SCREEN · PHOSPHOR';
    }
  }

  /* -------------------- Progress bar -------------------- */

  function setProgress(t) {
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${Math.max(0, Math.min(1, t)) * 100}%`;
  }

  /* -------------------- Restart -------------------- */

  function restart() {
    TEM.state.reset();
    setViewer('column');
    activateStep(0);
  }

  /* -------------------- Expose -------------------- */

  window.TEM = window.TEM || {};
  window.TEM.guidedController = {
    init, restart, setViewer, setProgress,
    activateStep,
    get currentStep() { return steps[currentStepIndex]; },
    get currentIndex() { return currentStepIndex; },
    get totalSteps() { return steps.length; },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init().catch(console.error); });
  } else {
    init().catch(console.error);
  }
})();
