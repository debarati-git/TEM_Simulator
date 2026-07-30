/* =========================================================================
   Guided Simulator — Step Orchestrator  (v2.0)
   Loads steps, manages lock/unlock, evaluates success, auto-advances,
   opens/closes PC drawer as steps require.
   ========================================================================= */
(function () {
  'use strict';

  var steps = [];
  var currentStepIndex = -1;   // -1 = pre-start
  var stepStartedAt = 0;
  var hintArmed = false;
  var autoAdvanceTimer = null;
  var stepTimers = [];
  var stepEntrySnapshots = [];
  var isRestoringState = false;
  var sessionStarted = false;
  var lastStepTargetControl = null;
  var floatingPointerTick = null;
  var STICKY_UNLOCKS = new Set(['beam-current']);
  var everUnlocked = new Set();
  var STATE_TO_CONTROL = {
    sample: 'sample', holderType: 'holder-type', stageNeutralized: 'stage-neutralize',
    holderRemoved: 'holder-remove', specimenInsertedDiagram: 'specimen-insert-diagram',
    specimenInsertedPanel: 'specimen-insert', airlockPumped: 'airlock',
    accVoltage: 'acc-voltage', beamOn: 'beam-on', brightness: 'brightness',
    defStigMode: 'def-stig-mode', beamShift: 'def-stig-pad', condStig: 'def-stig-pad', objStig: 'def-stig-pad',
    currentAperture: 'aperture-select', condenserInserted: 'condenser-insert', objectiveInserted: 'objective-insert',
    condenserSize: 'aperture-size', objectiveSize: 'aperture-size', apertureAlignment: 'aperture-align',
    stage: 'stage-xy', stageX: 'stage-xy', stageY: 'stage-xy', stageZ: 'stage-z',
    imagingMode: 'imaging-mode', magnification: 'magnification', wobblerOn: 'wobbler',
    focusCoarse: 'focus-coarse', focusFine: 'focus-fine',
    focusCoarseAdjusted: 'focus-coarse', focusFineAdjusted: 'focus-fine', stdFocusReset: 'std-focus',
    cameraInserted: 'camera-insert', cameraLiveView: 'live-view', screenRaised: 'screen-raise',
    imageAcquired: 'acquire'
  };

  /* ---- Boot ---- */
  function init() {
    try {
      if (window.TEM && window.TEM.dataGuidedSteps) {
        steps = window.TEM.dataGuidedSteps.steps;
        TEM.tolerance.load();
      }
    } catch (e) {
      console.error('Guided controller init failed:', e);
      showInitError(e);
      return;
    }

    document.querySelectorAll('.viewer__tab').forEach(function(tab) {
      tab.addEventListener('click', function() { setViewer(tab.dataset.view); });
    });
    wireFullscreen();

    var restartBtn = document.getElementById('btn-restart');
    if (restartBtn) restartBtn.addEventListener('click', function() {
      if (TEM.audio && TEM.audio.dismissHint) TEM.audio.dismissHint();
      if (!sessionStarted) {
        startSession();
      } else {
        restart();
      }
    });
    var undoBtn = document.getElementById('btn-undo-step');
    if (undoBtn) undoBtn.addEventListener('click', undoStep);

    TEM.controls.init();
    TEM.diagram.init();
    TEM.imageRenderer.init();
    TEM.pcDrawer.init();
    TEM.fftRenderer.init();

    if (TEM.audio) {
      TEM.audio.init(document.getElementById('btn-audio-toggle'), function () {
        var instrEl = document.getElementById('instr-text');
        return instrEl ? instrEl.textContent : null;
      });
    }

    TEM.state.subscribe(onStateChange);
    initFloatingPointer();
    showPreStart();
  }

  /** Single write-point for the instruction text: updates the DOM and, if
   *  the learner has audio on, speaks it aloud. Keeps voice output
   *  automatically in sync with whatever text is shown on screen. */
  function setInstructionText(text) {
    var instrEl = document.getElementById('instr-text');
    if (instrEl) instrEl.textContent = text;
    if (TEM.audio) TEM.audio.speak(text);
  }

  function setGuidanceActive(active) {
    var instruction = document.querySelector('.guided-context__instr');
    if (instruction) instruction.classList.toggle('is-guidance-active', !!active);
  }

  function initFloatingPointer() {
    var guidedBody = document.querySelector('.guided-body');
    var panelScrolls = document.querySelectorAll('.ctl-panel__scroll');

    panelScrolls.forEach(function(panel) {
      panel.addEventListener('scroll', scheduleFloatingPointerUpdate, { passive: true });
    });
    window.addEventListener('resize', scheduleFloatingPointerUpdate, { passive: true });
    document.addEventListener('fullscreenchange', scheduleFloatingPointerUpdate);
    document.addEventListener('webkitfullscreenchange', scheduleFloatingPointerUpdate);

    if (guidedBody) {
      var ro = new ResizeObserver(scheduleFloatingPointerUpdate);
      ro.observe(guidedBody);
    }
  }

  function scheduleFloatingPointerUpdate() {
    if (floatingPointerTick) cancelAnimationFrame(floatingPointerTick);
    floatingPointerTick = requestAnimationFrame(function() {
      floatingPointerTick = null;
      updateFloatingPointer();
    });
  }

  function getFloatingPointerAnchor(target) {
    if (!target) return target;
    var controlKey = target.dataset.control || '';

    // These wrappers contain labels plus one or more buttons. Anchor the cue
    // to the actual action the learner must click rather than to the full box.
    if (controlKey === 'sample') {
      return target.querySelector('.pbtn[data-action="sample"][data-value="nanoparticles"]') || target;
    }
    if (controlKey === 'holder-type') {
      return target.closest('fieldset.temcon-group') || target;
    }
    if (controlKey === 'specimen-insert') {
      return target.querySelector('.pbtn[data-action="specimen-insert"]') || target;
    }

    // For compact row controls, a button is a more precise target than the
    // complete label-and-button wrapper.
    if (target.classList.contains('ctl--row-2')) {
      return target.querySelector('.pbtn, .rocker, .trackpad, .knob') || target;
    }
    return target;
  }

  function updateFloatingPointer() {
    var pointer = document.getElementById('guided-step-pointer');
    var guidedBody = document.querySelector('.guided-body');
    var target = document.querySelector('.ctl.is-step-target-control');
    if (!pointer || !guidedBody || !target) {
      if (pointer) pointer.classList.remove('is-visible');
      return;
    }

    var bodyRect = guidedBody.getBoundingClientRect();
    var anchor = getFloatingPointerAnchor(target);
    var rect = anchor.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      pointer.classList.remove('is-visible');
      return;
    }

    var pointerIcon = pointer.querySelector('.guided-step-pointer__icon');
    var pointerSize = 34;
    var pointerHalf = pointerSize / 2;
    var sideGap = 5;
    var requiredSideRoom = pointerSize + sideGap + 4;
    var boundary = bodyRect;
    var panel = target.closest('.ctl-panel');
    var panelRect = panel ? panel.getBoundingClientRect() : null;
    var leftRoom = rect.left - (panelRect ? panelRect.left : bodyRect.left);
    var rightRoom = (panelRect ? panelRect.right : bodyRect.right) - rect.right;
    var mode = 'down';
    var controlKey = target.dataset.control || '';
    var forceDownPointer = controlKey === 'holder-type' || controlKey === 'specimen-insert';

    // Specimen-holder controls are intentionally indicated from above. The
    // Holder Type step targets the full Specimen Holder fieldset, while the
    // later Insert step targets its actual action button.
    if (!forceDownPointer) {
      // Prefer the inward-facing side for each physical panel. If that side
      // lacks room, try the opposite side; otherwise retain the downward cue.
      if (panel && panel.classList.contains('ctl-panel--left')) {
        if (rightRoom >= requiredSideRoom) mode = 'left';
        else if (leftRoom >= requiredSideRoom) mode = 'right';
      } else if (panel && panel.classList.contains('ctl-panel--right')) {
        if (leftRoom >= requiredSideRoom) mode = 'right';
        else if (rightRoom >= requiredSideRoom) mode = 'left';
      } else {
        if (rightRoom >= requiredSideRoom || leftRoom >= requiredSideRoom) {
          mode = rightRoom >= leftRoom ? 'left' : 'right';
        }
      }
    }

    var x;
    var y;
    if (mode === 'right') {
      // Pointer sits left of the target and points right toward it.
      x = rect.left - bodyRect.left - sideGap - pointerHalf;
      y = rect.top - bodyRect.top + rect.height / 2;
      if (pointerIcon) pointerIcon.textContent = '👉';
    } else if (mode === 'left') {
      // Pointer sits right of the target and points left toward it.
      x = rect.right - bodyRect.left + sideGap + pointerHalf;
      y = rect.top - bodyRect.top + rect.height / 2;
      if (pointerIcon) pointerIcon.textContent = '👈';
    } else {
      x = rect.left - bodyRect.left + rect.width / 2;
      y = rect.top - bodyRect.top - sideGap - pointerHalf;
      if (pointerIcon) pointerIcon.textContent = '👇';
    }

    var minX = pointerHalf + 6;
    var maxX = Math.max(minX, bodyRect.width - pointerHalf - 6);
    var minY = pointerHalf + 6;
    var maxY = Math.max(minY, bodyRect.height - pointerHalf - 6);
    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    pointer.classList.remove('is-pointer-left', 'is-pointer-right', 'is-pointer-down');
    pointer.classList.add('is-pointer-' + mode);
    pointer.style.left = x + 'px';
    pointer.style.top = y + 'px';
    pointer.classList.add('is-visible');
  }

  /* ---- Pre-start screen ---- */
  function showPreStart() {
    sessionStarted = false;
    currentStepIndex = -1;
    hintArmed = false;
    setGuidanceActive(false);

    // Restart/pre-start must not retain the delayed orange hint from the
    // previously active step. Clear both the feedback timer and DOM state.
    if (TEM.feedback && TEM.feedback.clearHint) TEM.feedback.clearHint();
    var hintEl = document.getElementById('instr-hint');
    if (hintEl) {
      hintEl.classList.remove('is-visible');
      hintEl.textContent = '';
    }

    setInstructionText('Welcome to the Guided TEM Session. All controls are locked until each step activates them. Press START to begin.');

    var restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.querySelector('span') || null;
      restartBtn.innerHTML = '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 8l5-5 5 5M3 8l5 5 5-5" opacity="0"/><circle cx="8" cy="8" r="5"/><path d="M6 8l1.5 1.5L10 6.5"/></svg><span>Start</span>';
      restartBtn.classList.add('is-start-btn');
    }

    var undoBtn = document.getElementById('btn-undo-step');
    if (undoBtn) undoBtn.style.display = 'none';

    // Lock all controls
    document.querySelectorAll('.ctl').forEach(function(c) {
      c.classList.remove('is-active');
      c.classList.remove('is-step-target-control');
    });
    TEM.diagram.setActiveHotspot(null);
    if (TEM.pcDrawer.setTarget) TEM.pcDrawer.setTarget('tem', false);
    TEM.pcDrawer.close();
    scheduleFloatingPointerUpdate();
    setProgress(0);

    if (TEM.audio && TEM.audio.showHintOnce) TEM.audio.showHintOnce();
  }

  function startSession() {
    sessionStarted = true;

    var restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.innerHTML = '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8a6 6 0 1 0 1.8-4.2M2 2v4h4"/></svg><span>Restart</span>';
      restartBtn.classList.remove('is-start-btn');
    }

    var undoBtn = document.getElementById('btn-undo-step');
    if (undoBtn) undoBtn.style.display = '';

    activateStep(0);
  }

  function showInitError(e) {
    setGuidanceActive(false);
    var instrEl = document.getElementById('instr-text');
    if (instrEl) instrEl.textContent = 'Guided session couldn\'t load. Check the console.';
  }

  /* ---- Fullscreen ---- */
  function wireFullscreen() {
    var btn = document.getElementById('btn-fullscreen');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var inFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (inFS) {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) try { exit.call(document); } catch(e) {}
      } else {
        var target = document.documentElement;
        var req = target.requestFullscreen || target.webkitRequestFullscreen;
        if (req) try { req.call(target); } catch(e) {}
      }
    });
    var onFSChange = function() {
      var active = !!(document.fullscreenElement || document.webkitFullscreenElement);
      document.body.classList.toggle('is-fullscreen', active);
      if (TEM.diagram && TEM.diagram.repositionHotspots) setTimeout(TEM.diagram.repositionHotspots, 100);
    };
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);
  }

  /* ---- Step activation ---- */
  function clearStepTimers() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
    stepTimers.forEach(function(timerId) { clearTimeout(timerId); });
    stepTimers = [];
  }

  function scheduleStepTimer(fn, delay) {
    var timerId = setTimeout(function() {
      var index = stepTimers.indexOf(timerId);
      if (index >= 0) stepTimers.splice(index, 1);
      fn();
    }, delay);
    stepTimers.push(timerId);
    return timerId;
  }

  function activateStep(index) {
    clearStepTimers();

    var step = steps[index];
    if (!step) { finish(); return; }
    setGuidanceActive(true);

    // Save the exact state that existed before this step. Undo restores this
    // snapshot and then re-enters the preceding step, including its prelude.
    stepEntrySnapshots[index] = TEM.state.getAll();
    stepEntrySnapshots.length = index + 1;

    currentStepIndex = index;
    stepStartedAt = Date.now();
    hintArmed = false;
    lastStepTargetControl = null;

    if (TEM.imageRenderer && TEM.imageRenderer.setRoiTarget) {
      TEM.imageRenderer.setRoiTarget(step.roiTarget || null);
    }

    TEM.state.set('currentStepId', step.id);

    setInstructionText(step.instruction);

    if (TEM.feedback && TEM.feedback.clearHint) TEM.feedback.clearHint();

    applyLockState(step);
    TEM.diagram.setActiveHotspot(step.diagram || null);
    setProgress(index / steps.length);

    if (step.switchViewer) setViewer(step.switchViewer, { flash: true });

    // PC-targeted steps open the required TEM or camera interface
    // automatically. All other steps begin with the drawer collapsed, while
    // the handle stays available so the learner can inspect the PC at any time.
    if (step.pcDrawer) {
      if (TEM.pcDrawer.setTarget) TEM.pcDrawer.setTarget(step.pcDrawer, true);
      TEM.pcDrawer.open(step.pcDrawer);
    } else {
      if (TEM.pcDrawer.setTarget) TEM.pcDrawer.setTarget('tem', false);
      TEM.pcDrawer.close();
    }

    // onEnter side-effects
    if (step.onEnter === 'autoAirlock') {
      scheduleStepTimer(function() {
        if (currentStepIndex === index) TEM.state.set('airlockPumped', true);
      }, Math.max(200, (step.autoAdvance || 2000) / 2));
    }

    if (step.prelude) applyPrelude(step.prelude);

    if (step.autoAdvance) {
      autoAdvanceTimer = scheduleStepTimer(function() {
        autoAdvanceTimer = null;
        if (currentStepIndex === index) activateStep(currentStepIndex + 1);
      }, step.autoAdvance);
    }

    scheduleFloatingPointerUpdate();

    if (step.hint) {
      scheduleStepTimer(function() {
        if (currentStepIndex === index && !checkSuccess(step)) {
          if (TEM.feedback) TEM.feedback.armHint(step.hint, 3000);
          hintArmed = true;
        }
      }, 800);
    }
  }

  function finish() {
    clearStepTimers();
    setGuidanceActive(false);
    setProgress(1);
    setInstructionText('Session complete. Your image has been downloaded. Press Restart to run again.');
    if (TEM.feedback) TEM.feedback.clearHint();
    document.querySelectorAll('.ctl').forEach(function(c) {
      c.classList.remove('is-active');
      c.classList.remove('is-step-target-control');
    });
    document.querySelectorAll('.dz.is-zone-active').forEach(function(z) { z.classList.remove('is-zone-active'); });
    TEM.diagram.setActiveHotspot(null);
    if (TEM.pcDrawer.setStepActive) TEM.pcDrawer.setStepActive(false);
    TEM.pcDrawer.close();
    scheduleFloatingPointerUpdate();
  }

  /* ---- Lock/unlock ---- */
  function pendingControlForStep(step) {
    if (!step) return null;
    var cond = step.success || step.successCondition;
    if (cond && cond.type === 'composite' && Array.isArray(cond.all)) {
      for (var i = 0; i < cond.all.length; i++) {
        if (!evalCondition(cond.all[i])) {
          return STATE_TO_CONTROL[cond.all[i].key] || (step.unlocks && step.unlocks[0]) || null;
        }
      }
    }
    if (cond && cond.key) return STATE_TO_CONTROL[cond.key] || (step.unlocks && step.unlocks[0]) || null;
    return (step.unlocks && step.unlocks[0]) || null;
  }

  function refreshStepTargetLocator(step) {
    document.querySelectorAll('.ctl.is-step-target-control').forEach(function(ctl) {
      ctl.classList.remove('is-step-target-control');
    });
    var targetKey = pendingControlForStep(step);
    if (!targetKey) {
      lastStepTargetControl = null;
      scheduleFloatingPointerUpdate();
      return;
    }
    document.querySelectorAll('.ctl[data-control="' + targetKey + '"]').forEach(function(ctl) {
      ctl.classList.add('is-step-target-control');
    });

    // During multi-action PC steps, move the drawer to the newly pending
    // control. In the camera sequence this makes Insert Camera, Live View,
    // and especially Raise Fluorescent Screen visible in turn.
    scheduleFloatingPointerUpdate();

    if (targetKey !== lastStepTargetControl) {
      lastStepTargetControl = targetKey;
      scheduleStepTimer(function() {
        if (TEM.pcDrawer && TEM.pcDrawer.revealControl) {
          TEM.pcDrawer.revealControl(targetKey);
        }
        scheduleFloatingPointerUpdate();
        scheduleStepTimer(scheduleFloatingPointerUpdate, 260);
      }, 120);
    }
  }

  function applyLockState(step) {
    var targets = new Set(step.unlocks || []);
    for (var key of everUnlocked) {
      if (STICKY_UNLOCKS.has(key)) targets.add(key);
    }
    for (var k of (step.unlocks || [])) everUnlocked.add(k);

    // Clear all zone highlights first
    document.querySelectorAll('.dz.is-zone-active').forEach(function(z) {
      z.classList.remove('is-zone-active');
    });

    var activeZones = new Set();
    document.querySelectorAll('.ctl[data-control]').forEach(function(ctl) {
      var ctlKey = ctl.dataset.control;
      var active = targets.has(ctlKey);
      ctl.classList.toggle('is-active', active);
      // Mark parent zone as active if this control is unlocked by the current step
      if (active && (step.unlocks || []).includes(ctlKey)) {
        var zone = ctl.closest('.dz');
        if (zone && !activeZones.has(zone)) {
          activeZones.add(zone);
        }
      }
    });

    refreshStepTargetLocator(step);

    // Apply persistent zone highlight and scroll first one into view
    var first = true;
    activeZones.forEach(function(zone) {
      zone.classList.add('is-zone-active');
      if (first) {
        first = false;
        setTimeout(function() {
          zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
    });
  }

  /* ---- State change → check success ---- */
  function onStateChange(key, value, prev, all) {
    if (isRestoringState) return;
    var step = steps[currentStepIndex];
    if (!step) return;
    refreshStepTargetLocator(step);
    if (hintArmed && TEM.feedback) TEM.feedback.poke();
    if (step.autoAdvance) return;

    if (checkSuccess(step)) {
      scheduleStepTimer(function() {
        if (checkSuccess(steps[currentStepIndex])) {
          activateStep(currentStepIndex + 1);
        }
      }, 150);
    }
  }

  /* ---- Success evaluation ---- */
  function checkSuccess(step) {
    if (!step) return false;
    var cond = step.success || step.successCondition;
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
      return TEM.state.get(cond.key) === cond.value;
    }
    if (cond.type === 'valueInRange') {
      var value;
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

  /* ---- Viewer tab switcher ---- */
  function setViewer(which, opts) {
    document.querySelectorAll('.viewer__tab').forEach(function(t) {
      var active = t.dataset.view === which;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.viewer__panel').forEach(function(p) {
      p.classList.toggle('is-active', p.dataset.viewPanel === which);
    });
    var caption = document.getElementById('viewer-caption');
    if (caption) {
      caption.textContent = which === 'column' ? 'ELECTRON OPTICAL COLUMN' : 'VIEWING SCREEN · PHOSPHOR';
    }
    if (opts && opts.flash) {
      var v = document.querySelector('.viewport-wrap');
      if (v) {
        v.classList.remove('is-flash');
        void v.offsetWidth;
        v.classList.add('is-flash');
        setTimeout(function() { v.classList.remove('is-flash'); }, 1200);
      }
    }
  }

  function setProgress(t) {
    var fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = (Math.max(0, Math.min(1, t)) * 100) + '%';
  }

  /* ---- Prelude ---- */
  function applyPrelude(prelude) {
    if (!prelude) return;
    if (prelude.offset && prelude.amount) applyOffset(prelude.offset, prelude.amount);
    if (Array.isArray(prelude.offsets)) {
      for (var i = 0; i < prelude.offsets.length; i++) {
        var o = prelude.offsets[i];
        if (o.offset && o.amount) applyOffset(o.offset, o.amount);
      }
    }
    if (prelude.set) TEM.state.set(prelude.set.key, prelude.set.value);
  }

  function applyOffset(offset, amount) {
    if (offset === 'stage') {
      TEM.state.set('stageX', (TEM.state.get('stageX') || 0) + (amount.x || 0));
      TEM.state.set('stageY', (TEM.state.get('stageY') || 0) + (amount.y || 0));
    } else {
      var cur = TEM.state.get(offset) || { x: 0, y: 0 };
      TEM.state.set(offset, { x: (cur.x || 0) + (amount.x || 0), y: (cur.y || 0) + (amount.y || 0) });
    }
  }

  /* ---- Restart / Undo ---- */
  function restoreState(snapshot) {
    if (!snapshot) return;
    isRestoringState = true;
    try {
      Object.keys(snapshot).forEach(function(key) {
        TEM.state.set(key, snapshot[key]);
      });
    } finally {
      isRestoringState = false;
    }
  }

  function rebuildUnlockHistory(targetIndex) {
    everUnlocked.clear();
    for (var i = 0; i < targetIndex; i++) {
      (steps[i].unlocks || []).forEach(function(key) { everUnlocked.add(key); });
    }
  }

  function restart() {
    // A restart is intentionally a full Module 2 page reload. This clears all
    // state, timers, canvas references, drawer positions, selected controls,
    // hints and transient animations exactly as a fresh page visit would.
    clearStepTimers();
    if (TEM.feedback && TEM.feedback.clearHint) TEM.feedback.clearHint();
    window.location.reload();
  }

  function undoStep() {
    if (!sessionStarted || currentStepIndex < 0) return;

    // Undo one complete guided step. At Step 1, restore and retry Step 1.
    var targetIndex = Math.max(0, currentStepIndex - 1);
    var snapshot = stepEntrySnapshots[targetIndex] || TEM.state.getInitial();

    clearStepTimers();
    restoreState(snapshot);
    rebuildUnlockHistory(targetIndex);
    stepEntrySnapshots.length = targetIndex + 1;
    activateStep(targetIndex);
  }

  /* ---- Expose ---- */
  window.TEM = window.TEM || {};
  window.TEM.guidedController = {
    init: init, restart: restart, undoStep: undoStep,
    setViewer: setViewer, setProgress: setProgress,
    activateStep: activateStep,
    get currentStep() { return steps[currentStepIndex]; },
    get currentIndex() { return currentStepIndex; },
    get totalSteps() { return steps.length; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { init(); });
  } else {
    init();
  }
})();
