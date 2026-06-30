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
  /** Controls that, once unlocked, stay unlocked for the rest of the session.
      Beam Current is exposed at step 8 and stays available through alignment
      and imaging — the user can fine-tune it any time. */
  const STICKY_UNLOCKS = new Set(['beam-current']);
  const everUnlocked = new Set();

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
    const undoBtn = document.getElementById('btn-undo-step');
    if (undoBtn) undoBtn.addEventListener('click', undoStep);

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
    // Clear any inactivity hint left over from the last step
    if (TEM.feedback) TEM.feedback.clearHint();
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
    for (const key of everUnlocked) {
      if (STICKY_UNLOCKS.has(key)) targets.add(key);
    }
    for (const key of (step.unlocks || [])) everUnlocked.add(key);

    let firstNewlyActive = null;
    document.querySelectorAll('.ctl[data-control]').forEach(ctl => {
      const key = ctl.dataset.control;
      const wasActive = ctl.classList.contains('is-active');
      const active = targets.has(key);
      if (active && !wasActive && !firstNewlyActive && (step.unlocks || []).includes(key)) {
        firstNewlyActive = ctl;
      }
      ctl.classList.toggle('is-active', active);
    });

    // Scroll the parent dz zone of the first newly-unlocked control into view,
    // then briefly highlight the zone so the student's eye is drawn to it.
    if (firstNewlyActive) {
      const zone = firstNewlyActive.closest('.dz');
      if (zone) {
        setTimeout(() => {
          zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          // Flash the zone border for 1.6 s then remove
          zone.classList.add('is-zone-active');
          setTimeout(() => zone.classList.remove('is-zone-active'), 1600);
        }, 80);
      } else {
        setTimeout(() => {
          firstNewlyActive.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
    }
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

     Forms supported:
       prelude: { offset: 'beamShift', amount: {x:-22, y:18} }
       prelude: { offsets: [
         { offset: 'beamShift', amount: {x:-22, y:18} },
         { offset: 'stigmator', amount: {x:-18, y:22} },
       ]}
       prelude: { set: { key: 'foo', value: 5 } }
  */
  function applyPrelude(prelude) {
    if (!prelude) return;

    // Single offset (legacy form)
    if (prelude.offset && prelude.amount) {
      applyOffset(prelude.offset, prelude.amount);
    }
    // Multiple offsets
    if (Array.isArray(prelude.offsets)) {
      for (const o of prelude.offsets) {
        if (o.offset && o.amount) applyOffset(o.offset, o.amount);
      }
    }

    if (prelude.set) {
      const { key, value } = prelude.set;
      TEM.state.set(key, value);
    }
  }

  function applyOffset(offset, amount) {
    if (offset === 'stage') {
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

  /* -------------------- Restart -------------------- */

  function restart() {
    TEM.state.reset();
    everUnlocked.clear();
    if (TEM.imageRenderer && TEM.imageRenderer.resetReferences) {
      TEM.imageRenderer.resetReferences();
    }
    setViewer('column');
    activateStep(0);
  }

  /** Undo the current step: reset any state values that this step is
      responsible for, then re-activate the step (re-running its prelude
      and lock state). This gives the user a way to retry just the
      current step without losing prior progress. */
  function undoStep() {
    const step = steps[currentStepIndex];
    if (!step) return;

    // Clear the state key(s) this step's success condition watches, so it
    // doesn't immediately auto-pass.
    clearSuccessKeys(step.success);
    activateStep(currentStepIndex);
  }

  /** For a step's success condition, reset the underlying state keys
      back to their initial values. */
  function clearSuccessKeys(cond) {
    if (!cond) return;
    if (cond.type === 'composite' && Array.isArray(cond.all)) {
      cond.all.forEach(clearSuccessKeys);
      return;
    }
    const key = cond.key;
    if (!key) return;
    if (cond.type === 'selectValue') {
      // Reset the boolean/string back to its initial value
      const v = INITIAL_VALUES[key];
      if (v !== undefined) TEM.state.set(key, v);
    } else if (cond.type === 'valueInRange') {
      if (key === 'stage') {
        TEM.state.set('stageX', 0);
        TEM.state.set('stageY', 0);
      } else {
        const v = INITIAL_VALUES[key];
        TEM.state.set(key, v !== undefined ? v : { x: 0, y: 0 });
      }
    }
  }

  /** Mirror of the state store's initial values, so undoStep can reset
      to the right defaults. Kept in sync with state.js manually. */
  const INITIAL_VALUES = {
    holderRemoved: false,
    sample: null,
    specimenInsertedDiagram: false,
    specimenInsertedPanel: false,
    airlockPumped: false,
    accVoltage: null,
    beamOn: false,
    beamShift: { x: 0, y: 0 },
    brightness: 50,
    stigmator: { x: 18, y: -14 },
    currentAperture: null,
    condenserInserted: false,
    objectiveInserted: false,
    condenserSize: null,
    objectiveSize: null,
    apertureAlignment: { x: 0, y: 0 },
    stageZ: 0,
    wobblerOn: false,
    magnification: null,
    mode: null,
    focus: 0,
    cameraInserted: false,
    imageAcquired: false,
  };

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
