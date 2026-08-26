/* =========================================================================
   Guided Simulator — IIT SOP Controls Extension  (v4.2)
   Adds pre-flight modal checklist, Spot Size, and α Selector bindings.
   Loaded AFTER controls.js — wraps the original init to add new bindings.
   ========================================================================= */
(function () {
  'use strict';

  var origInit = TEM.controls.init;

  function initIIT() {
    origInit();
    bindPreflightModal();
    bindSpotSize();
    bindAlphaSelector();
    bindBeamToggle();
    bindHTControl();
    bindGoniometerControls();
    bindStageVerify();
    bindShutdownModal();
    subscribeIITStatusStrip();
  }

  /* ---- Pre-flight checklist modal ---- */
  function bindPreflightModal() {
    var modal = document.getElementById('preflightModal');
    if (!modal) return;

    var checks = [
      { action: 'preflight-vacuum', key: 'preflightVacuum', id: 'pf-vacuum' },
      { action: 'preflight-sip',    key: 'preflightSIP',    id: 'pf-sip' },
      { action: 'preflight-hv',     key: 'preflightHV',     id: 'pf-hv' },
      { action: 'preflight-acd',    key: 'preflightACD',    id: 'pf-acd' }
    ];

    var countEl = document.getElementById('preflight-count');

    function updateCount() {
      var done = 0;
      checks.forEach(function(c) { if (TEM.state.get(c.key)) done++; });
      if (countEl) countEl.textContent = done;
      // Auto-close modal when all 4 confirmed
      if (done >= 4) {
        setTimeout(function() { closePreflightModal(); }, 400);
      }
    }

    checks.forEach(function(c) {
      var item = document.getElementById(c.id);
      if (!item) return;

      item.addEventListener('click', function() {
        if (item.classList.contains('is-confirmed')) return;

        // HV ramp gets a short animation
        if (c.action === 'preflight-hv') {
          item.classList.add('is-ramping');
          var readout = document.getElementById('hv-ramp-readout');
          var startV = 80, endV = 200, duration = 1500;
          var startTime = Date.now();
          function animateRamp() {
            var elapsed = Date.now() - startTime;
            var t = Math.min(elapsed / duration, 1);
            var currentV = Math.round(startV + (endV - startV) * t);
            if (readout) readout.textContent = currentV + ' kV';
            if (t < 1) {
              requestAnimationFrame(animateRamp);
            } else {
              item.classList.remove('is-ramping');
              item.classList.add('is-confirmed');
              TEM.state.set(c.key, true);
              TEM.state.set('accVoltage', 200);
              updateCount();
            }
          }
          requestAnimationFrame(animateRamp);
        } else {
          item.classList.add('is-confirmed');
          TEM.state.set(c.key, true);
          updateCount();
        }
      });

      TEM.state.subscribeKey(c.key, function(val) {
        if (item) item.classList.toggle('is-confirmed', !!val);
        updateCount();
      });
    });

    // Open/close helpers
    window._openPreflightModal = function() {
      modal.hidden = false;
      void modal.offsetWidth;
      modal.classList.add('is-open');
    };

    function closePreflightModal() {
      modal.classList.remove('is-open');
      setTimeout(function() { modal.hidden = true; }, 250);
    }

    // Listen for pre-flight steps to auto-open the modal
    TEM.state.subscribeKey('currentStepId', function(stepId) {
      if (stepId >= 1 && stepId <= 4) {
        window._openPreflightModal();
      }
    });
  }

  /* ---- Spot Size knob (1–5 stepped) ---- */
  function bindSpotSize() {
    var knobEl = document.querySelector('.knob[data-knob="spot-size"]');
    if (!knobEl) return;
    var handle = TEM.controlsUI.bindKnob(knobEl, {
      min: 1, max: 5, step: 1,
      value: TEM.state.get('spotSize') || 1,
      format: function(v) { return Math.round(v); },
      onChange: function(v) { TEM.state.set('spotSize', Math.round(v)); }
    });
    TEM.state.subscribeKey('spotSize', function(val) {
      if (val !== Math.round(handle.value)) handle.value = val;
      // Keep both TEMCON illumination readouts synchronized.
      var readout = document.getElementById('pc-spot-value');
      if (readout) readout.textContent = val;
      var topReadout = document.getElementById('pc-spot-value-top');
      if (topReadout) topReadout.textContent = val;
    });
  }

  /* ---- Alpha Selector knob (α1–α5 stepped) ---- */
  function bindAlphaSelector() {
    var knobEl = document.querySelector('.knob[data-knob="alpha-selector"]');
    if (!knobEl) return;
    var handle = TEM.controlsUI.bindKnob(knobEl, {
      min: 1, max: 5, step: 1,
      value: TEM.state.get('alphaSelector') || 3,
      format: function(v) { return 'α' + Math.round(v); },
      onChange: function(v) { TEM.state.set('alphaSelector', Math.round(v)); }
    });
    TEM.state.subscribeKey('alphaSelector', function(val) {
      if (val !== Math.round(handle.value)) handle.value = val;
      var readout = document.getElementById('pc-alpha-value');
      if (readout) readout.textContent = val;
      var topReadout = document.getElementById('pc-alpha-value-top');
      if (topReadout) topReadout.textContent = val;
    });
  }

  /* ---- BEAM toggle button (green glow when on) ---- */
  function bindBeamToggle() {
    var btn = document.getElementById('beam-toggle');
    if (!btn) return;
    btn.addEventListener('click', function() {
      if (btn.disabled) return;
      var current = TEM.state.get('beamOn');
      TEM.state.set('beamOn', !current);
    });
    TEM.state.subscribeKey('beamOn', function(val) {
      btn.classList.toggle('is-beam-on', !!val);
      // Update PC drawer readouts
      var filStatus = document.getElementById('pc-fil-status');
      if (filStatus) filStatus.textContent = val ? 'Ready' : 'OFF';
      var beamCurrentHV = document.getElementById('pc-beam-current-hv');
      if (beamCurrentHV) beamCurrentHV.textContent = val ? '101.1 µA' : '0.0 µA';
      var beamCurrentTop = document.getElementById('pc-beam-current-top');
      if (beamCurrentTop) beamCurrentTop.textContent = val ? '101.1 µA' : '0.0 µA';
    });
  }

  /* ---- HT ON/OFF control in PC drawer ---- */
  function bindHTControl() {
    var onBtn = document.getElementById('ht-on-btn');
    var offBtn = document.getElementById('ht-off-btn');
    if (!onBtn || !offBtn) return;

    onBtn.addEventListener('click', function() {
      if (onBtn.disabled) return;
      TEM.state.set('htOff', false);
    });
    offBtn.addEventListener('click', function() {
      if (offBtn.disabled) return;
      TEM.state.set('htOff', true);
    });

    function updateHT() {
      var off = TEM.state.get('htOff');
      var hvDone = TEM.state.get('preflightHV');
      onBtn.classList.toggle('is-selected', hvDone && !off);
      offBtn.classList.toggle('is-selected', !!off);
      var htStatus = document.getElementById('pc-ht-status');
      if (htStatus) htStatus.textContent = (hvDone && !off) ? 'ON' : 'OFF';
      var htValue = document.getElementById('pc-ht-value');
      if (htValue) htValue.textContent = (hvDone && !off) ? '200.00 kV' : '0.00 kV';
      var indHT = document.getElementById('ind-ht');
      if (indHT) indHT.textContent = (hvDone && !off) ? '200 kV' : 'OFF';
    }
    TEM.state.subscribeKey('htOff', updateHT);
    TEM.state.subscribeKey('preflightHV', updateHT);
  }

  /* ---- Shutdown modal ---- */
  function bindShutdownModal() {
    var modal = document.getElementById('shutdownModal');
    if (!modal) return;

    var items = [
      { id: 'sd-holder-remove',    key: 'holderWithdrawn' },
      { id: 'sd-apertures-remove', key: 'aperturesRemoved' },
      { id: 'sd-acd-heat',         key: 'acdHeatOn' }
    ];
    var countEl = document.getElementById('shutdown-count');

    function updateCount() {
      var done = 0;
      items.forEach(function(item) { if (TEM.state.get(item.key)) done++; });
      if (countEl) countEl.textContent = done;
      if (done >= 3) setTimeout(function() { closeModal(); }, 500);
    }

    items.forEach(function(item) {
      var el = document.getElementById(item.id);
      if (!el) return;
      el.addEventListener('click', function() {
        if (el.classList.contains('is-confirmed')) return;
        el.classList.add('is-confirmed');
        TEM.state.set(item.key, true);
        updateCount();
      });
      TEM.state.subscribeKey(item.key, function(val) {
        el.classList.toggle('is-confirmed', !!val);
        updateCount();
      });
    });

    // Map step IDs to shutdown items for highlighting
    var stepToItem = { 47: 'sd-holder-remove', 48: 'sd-apertures-remove', 49: 'sd-acd-heat' };

    function highlightActive(stepId) {
      document.querySelectorAll('.shutdown-item').forEach(function(el) {
        el.classList.remove('is-current-step');
      });
      var targetId = stepToItem[stepId];
      if (targetId) {
        var el = document.getElementById(targetId);
        if (el) el.classList.add('is-current-step');
      }
    }

    window._openShutdownModal = function() {
      modal.hidden = false;
      void modal.offsetWidth;
      modal.classList.add('is-open');
      highlightActive(TEM.state.get('currentStepId'));
    };

    function closeModal() {
      modal.classList.remove('is-open');
      setTimeout(function() { modal.hidden = true; }, 250);
    }
    window._closeShutdownModal = closeModal;

    TEM.state.subscribeKey('currentStepId', function(stepId) {
      highlightActive(stepId);
      if (stepToItem[stepId] && modal.hidden) window._openShutdownModal();
    });
  }

  /* ---- IIT-specific status strip updates ---- */
  function subscribeIITStatusStrip() {
    var indHT = document.getElementById('ind-ht');
    TEM.state.subscribeKey('preflightHV', function(v) {
      if (indHT && v) indHT.textContent = '200 kV';
    });
  }

  /* ---- Specimen Loading Modal ---- */
  function bindGoniometerControls() {
    var modal = document.getElementById('specimenModal');
    if (!modal) return;

    // Map each checklist item to a state key
    var items = [
      { id: 'sm-oring',        key: 'oringInspected',     step: 'oring' },
      { id: 'sm-green-lamp',   key: 'gonioGreenConfirmed', step: 'green-lamp' },
      { id: 'sm-grid-load',    key: 'gridLoaded',          step: 'grid-load' },
      { id: 'sm-pump-switch',  key: 'pumpSwitchSet',       step: 'pump-switch' },
      { id: 'sm-amber-wait',   key: 'airlockPumped',       step: 'amber-wait' },
      { id: 'sm-rotate-insert', key: 'holderFullyInserted', step: 'rotate-insert' },
      { id: 'sm-stage-verify', key: null,                   step: 'stage-verify' }
    ];

    var countEl = document.getElementById('specimen-count');

    function updateSpecimenCount() {
      var done = 0;
      items.forEach(function(item) {
        if (item.key && TEM.state.get(item.key)) done++;
        else if (item.step === 'stage-verify') {
          if (TEM.state.get('stageVerifyX') && TEM.state.get('stageVerifyY') &&
              TEM.state.get('stageVerifyZ') && TEM.state.get('stageVerifyTilt')) done++;
        }
      });
      if (countEl) countEl.textContent = done;
      // Auto-close when all 7 complete
      if (done >= 7) {
        setTimeout(function() { closeSpecimenModal(); }, 500);
      }
    }

    // Bind click handlers for simple checklist items
    items.forEach(function(item) {
      if (item.step === 'amber-wait' || item.step === 'stage-verify') return;
      var el = document.getElementById(item.id);
      if (!el) return;
      el.addEventListener('click', function() {
        if (el.classList.contains('is-confirmed')) return;
        el.classList.add('is-confirmed');
        TEM.state.set(item.key, true);

        // PUMP switch: update status text
        if (item.step === 'pump-switch') {
          var statusEl = el.querySelector('.preflight-item__status');
          if (statusEl) statusEl.textContent = 'PUMP';
        }

        updateSpecimenCount();
      });

      // Subscribe to state for undo support
      TEM.state.subscribeKey(item.key, function(val) {
        if (el) el.classList.toggle('is-confirmed', !!val);
        updateSpecimenCount();
      });
    });

    // Amber wait: auto-confirmed by autoAirlockModal handler
    var amberEl = document.getElementById('sm-amber-wait');
    var amberStatus = amberEl ? amberEl.querySelector('.specimen-amber-status') : null;

    window._setSpecimenAmberActive = function(active) {
      if (amberEl) amberEl.classList.toggle('is-evacuating', active);
      if (amberStatus) amberStatus.textContent = active ? '● AMBER' : '—';
      // Update modal header lamps
      var smGreen = document.getElementById('sm-lamp-green');
      var smAmber = document.getElementById('sm-lamp-amber');
      if (smGreen) smGreen.classList.toggle('is-on', !active);
      if (smAmber) smAmber.classList.toggle('is-on', active);
    };

    TEM.state.subscribeKey('airlockPumped', function(val) {
      if (amberEl) {
        amberEl.classList.toggle('is-confirmed', !!val);
        amberEl.classList.remove('is-evacuating');
      }
      if (amberStatus) amberStatus.textContent = val ? 'READY' : '—';
      // Restore header lamps
      var smGreen = document.getElementById('sm-lamp-green');
      var smAmber = document.getElementById('sm-lamp-amber');
      if (smGreen) smGreen.classList.toggle('is-on', !!val);
      if (smAmber) smAmber.classList.remove('is-on');
      updateSpecimenCount();
    });

    // Goniometer lamp management in PC drawer (read-only display)
    var greenLamp = document.getElementById('gonio-lamp-green');
    var amberLamp = document.getElementById('gonio-lamp-amber');

    window._setGonioLamp = function(mode) {
      if (greenLamp) greenLamp.classList.toggle('is-on', mode === 'green');
      if (amberLamp) amberLamp.classList.toggle('is-on', mode === 'amber');
      // Also update modal header lamps
      var smGreen = document.getElementById('sm-lamp-green');
      var smAmber = document.getElementById('sm-lamp-amber');
      if (smGreen) smGreen.classList.toggle('is-on', mode === 'green');
      if (smAmber) smAmber.classList.toggle('is-on', mode === 'amber');
    };

    // Default: green lamp on once preflight passes
    TEM.state.subscribeKey('preflightACD', function(v) {
      if (v) window._setGonioLamp('green');
    });
    TEM.state.subscribeKey('airlockPumped', function(v) {
      if (v) window._setGonioLamp('green');
    });

    // Status readouts in PC drawer
    TEM.state.subscribeKey('gridLoaded', function(v) {
      var el = document.getElementById('pc-grid-status');
      if (el) el.textContent = v ? 'LOADED' : 'NOT LOADED';
    });
    TEM.state.subscribeKey('holderFullyInserted', function(v) {
      var holderStatus = document.getElementById('pc-holder-status');
      if (holderStatus && v) holderStatus.textContent = 'INSERTED';
      var specStatus = document.getElementById('pc-specimen-status');
      if (specStatus && v) specStatus.textContent = 'IN COLUMN';
    });
    TEM.state.subscribeKey('pumpSwitchSet', function(v) {
      var pumpReadout = document.getElementById('gonio-pump-state-readout');
      if (pumpReadout) pumpReadout.textContent = v ? 'PUMP' : 'AIR';
    });

    // Open/close modal helpers
    window._openSpecimenModal = function() {
      modal.hidden = false;
      void modal.offsetWidth;
      modal.classList.add('is-open');

      // Highlight the currently active item based on current step
      var stepId = TEM.state.get('currentStepId');
      highlightActiveSpecimenItem(stepId);
    };

    function closeSpecimenModal() {
      modal.classList.remove('is-open');
      setTimeout(function() { modal.hidden = true; }, 250);
    }
    window._closeSpecimenModal = closeSpecimenModal;

    // Map step IDs to specimen items for highlighting
    var stepToItem = { 7: 'oring', 8: 'green-lamp', 10: 'grid-load', 13: 'pump-switch', 14: 'amber-wait', 15: 'rotate-insert', 16: 'stage-verify' };

    function highlightActiveSpecimenItem(stepId) {
      document.querySelectorAll('.specimen-item').forEach(function(el) {
        el.classList.remove('is-current-step');
      });
      var target = stepToItem[stepId];
      if (target) {
        var el = document.querySelector('[data-specimen-step="' + target + '"]');
        if (el) {
          el.classList.add('is-current-step');
          // Scroll into view within the modal
          setTimeout(function() {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }
    }

    TEM.state.subscribeKey('currentStepId', function(stepId) {
      highlightActiveSpecimenItem(stepId);
      // Reopen if entering a specimen modal step
      if (stepToItem[stepId] && modal.hidden) {
        window._openSpecimenModal();
      }
    });
  }

  function bindSimpleAction(action, stateKey) {
    document.querySelectorAll('.pbtn[data-action="' + action + '"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled) return;
        TEM.state.set(stateKey, true);
        btn.classList.add('is-confirmed');
      });
    });
  }

  /* ---- Stage verification (X, Y, Z, Tilt) — inside specimen modal ---- */
  function bindStageVerify() {
    var axes = [
      { action: 'stage-verify-x',    key: 'stageVerifyX' },
      { action: 'stage-verify-y',    key: 'stageVerifyY' },
      { action: 'stage-verify-z',    key: 'stageVerifyZ' },
      { action: 'stage-verify-tilt', key: 'stageVerifyTilt' }
    ];
    var countEl = document.getElementById('sm-verify-count');
    var parentItem = document.getElementById('sm-stage-verify');

    function updateVerifyCount() {
      var done = 0;
      axes.forEach(function(a) { if (TEM.state.get(a.key)) done++; });
      if (countEl) countEl.textContent = done;
      if (parentItem && done >= 4) parentItem.classList.add('is-confirmed');
    }

    axes.forEach(function(axis) {
      document.querySelectorAll('.pbtn[data-action="' + axis.action + '"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (btn.disabled) return;
          TEM.state.set(axis.key, true);
          btn.classList.add('is-confirmed');
          updateVerifyCount();
        });
      });
      TEM.state.subscribeKey(axis.key, function(val) {
        document.querySelectorAll('.pbtn[data-action="' + axis.action + '"]').forEach(function(btn) {
          btn.classList.toggle('is-confirmed', !!val);
        });
        updateVerifyCount();
      });
    });
  }

  TEM.controls = { init: initIIT };
})();
