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
  let autoAdvanceTimer = null;

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

    // Restart buttons
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) restartBtn.addEventListener('click', restart);
    const restartSectionBtn = document.getElementById('btn-restart-section');
    if (restartSectionBtn) restartSectionBtn.addEventListener('click', restartSection);

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
    if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }

    const step = steps[index];
    if (!step) {
      finish();
      return;
    }

    // Push ROI target into the renderer BEFORE the currentStepId state
    // mutation, so renderer sees the new target on its first render.
    if (TEM.imageRenderer && TEM.imageRenderer.setRoiTarget) {
      TEM.imageRenderer.setRoiTarget(step.roiTarget || null);
    }

    TEM.state.set('currentStepId', step.id);

    // Update instruction text
    const instrEl = document.getElementById('instr-text');
    if (instrEl) instrEl.textContent = step.instruction;

    // Clear any visible hint from the previous step
    if (TEM.feedback && TEM.feedback.clearHint) TEM.feedback.clearHint();

    // Lock all controls, then unlock just this step's targets
    applyLockState(step);

    // Highlight diagram hotspot if this step has one (declared in data)
    TEM.diagram.setActiveHotspot(step.diagram || null);

    // Update progress bar (the just-completed steps make the bar advance)
    setProgress(index / steps.length);

    // Auto-switch viewer
    if (step.switchViewer) setViewer(step.switchViewer, { flash: true });

    // Blue ROI circle on the screen if this step has a target
    if (TEM.imageRenderer && TEM.imageRenderer.setRoiTarget) {
      TEM.imageRenderer.setRoiTarget(step.roiTarget || null);
    }

    // onEnter side-effects: events that happen automatically when this step activates
    if (step.onEnter === 'autoAirlock') {
      // Animate the airlock pumping: set airlockPumped=true after ~half the autoAdvance delay
      setTimeout(() => {
        TEM.state.set('airlockPumped', true);
      }, Math.max(200, (step.autoAdvance || 2000) / 2));
    }

    // Prelude: nudge state into a non-trivial starting point so the success
    // condition isn't already satisfied. This forces the user to actually
    // interact with the control instead of the step auto-advancing.
    //
    // `prelude.offset`: 'beamShift' | 'stigmator' | 'apertureAlignment' | 'stage'
    //   Sets that key (or stageX+stageY for 'stage') to an off-target value
    //   to make the alignment task non-trivial.
    // `prelude.set`: { key, value } — generic write.
    if (step.prelude) {
      applyPrelude(step.prelude);
    }

    // Auto-advance for descriptive/animation steps (no user action required)
    if (step.autoAdvance) {
      autoAdvanceTimer = setTimeout(() => {
        if (currentStepIndex === index) activateStep(currentStepIndex + 1);
      }, step.autoAdvance);
    }

    // Arm the hint timer
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

    // For autoAdvance steps, the timer controls progression — don't advance on
    // state changes (the onEnter side-effects may set state mid-step).
    if (step.autoAdvance) return;

    if (checkSuccess(step)) {
      // Small delay so the user sees their final action register before advancing
      setTimeout(() => {
        if (checkSuccess(steps[currentStepIndex])) {
          activateStep(currentStepIndex + 1);
        }
      }, 150);
    }
  }

  /* -------------------- Success condition evaluation -------------------- */

  function checkSuccess(step) {
    if (!step) return false;
    const cond = step.success || step.successCondition;       // back-compat
    if (!cond) return false;
    return evalCondition(cond);
  }

  function evalCondition(cond) {
    if (!cond) return false;

    if (cond.type === 'always') return true;

    if (cond.type === 'composite' && Array.isArray(cond.all)) {
      return cond.all.every(evalCondition);
    }

    if (cond.type === 'selectValue') {
      const actual = TEM.state.get(cond.key);
      return actual === cond.value;
    }

    if (cond.type === 'valueInRange') {
      let value;
      if (cond.key === 'stage') {
        value = { x: TEM.state.get('stageX'), y: TEM.state.get('stageY') };
      } else {
        value = TEM.state.get(cond.key);
      }
      return TEM.tolerance.inSweetSpot(cond.spot, value);
    }

    if (cond.type === 'click') {
      return TEM.state.get(cond.key) === true;
    }

    return false;
  }

  /* -------------------- Viewer tab switcher -------------------- */

  function setViewer(which, opts) {
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

    // Flash the viewer briefly when auto-switched, to draw the user's eye
    if (opts && opts.flash) {
      const v = document.querySelector('.viewer');
      if (v) {
        v.classList.remove('is-flash');
        // Force reflow so the animation restarts
        void v.offsetWidth;
        v.classList.add('is-flash');
        setTimeout(() => v.classList.remove('is-flash'), 1200);
      }
    }
  }

  /* -------------------- Progress bar -------------------- */

  function setProgress(t) {
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${Math.max(0, Math.min(1, t)) * 100}%`;
  }

  /* -------------------- Step prelude --------------------
     Apply a step's prelude: nudge state values away from sweet-spot zero
     so the success condition isn't trivially satisfied. The user must
     actually interact with the control to advance.
  */
  function applyPrelude(prelude) {
    if (!prelude) return;

    if (prelude.offset && prelude.amount) {
      const { offset, amount } = prelude;
      if (offset === 'stage') {
        // Special case — apply to stageX and stageY separately
        const curX = TEM.state.get('stageX') || 0;
        const curY = TEM.state.get('stageY') || 0;
        TEM.state.set('stageX', curX + (amount.x || 0));
        TEM.state.set('stageY', curY + (amount.y || 0));
      } else {
        const cur = TEM.state.get(offset) || { x: 0, y: 0 };
        TEM.state.set(offset, {
          x: (cur.x || 0) + (amount.x || 0),
          y: (cur.y || 0) + (amount.y || 0),
        });
      }
    }

    if (prelude.set) {
      const { key, value } = prelude.set;
      TEM.state.set(key, value);
    }
  }

  /* -------------------- Restart -------------------- */

  function restart() {
    TEM.state.reset();
    if (TEM.imageRenderer && TEM.imageRenderer.resetReferences) {
      TEM.imageRenderer.resetReferences();
    }
    setViewer('column');
    activateStep(0);
  }

  /** Restart from the start of the current section.
      Sections (approximate):
      1-7   Setup
      8-9   Beam alignment
      10-15 Aperture / stigmation
      16-19 Find sample (mag + eucentric)
      20-24 Objective aperture / diffraction
      25-32 Acquisition
  */
  function restartSection() {
    const sectionStarts = [1, 8, 10, 16, 20, 25];
    const currentId = steps[currentStepIndex]?.id || 1;
    let start = 1;
    for (const sid of sectionStarts) {
      if (sid <= currentId) start = sid;
    }
    const targetIndex = steps.findIndex(s => s.id === start);
    if (targetIndex >= 0) {
      TEM.state.reset();
      activateStep(targetIndex);
    }
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
