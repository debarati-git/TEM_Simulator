/* =========================================================================
   Guided Simulator — IIT SOP Controls Extension  (v4.0)
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

  /* ---- Spot Size selector (1–5) ---- */
  function bindSpotSize() {
    document.querySelectorAll('.pbtn[data-action="spot-size"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled) return;
        TEM.state.set('spotSize', parseInt(btn.dataset.value, 10));
      });
    });
    TEM.state.subscribeKey('spotSize', function(val) {
      document.querySelectorAll('.pbtn[data-action="spot-size"]').forEach(function(btn) {
        btn.classList.toggle('is-selected', parseInt(btn.dataset.value, 10) === val);
      });
    });
  }

  /* ---- Alpha Selector (α1–α5) ---- */
  function bindAlphaSelector() {
    document.querySelectorAll('.pbtn[data-action="alpha-selector"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled) return;
        TEM.state.set('alphaSelector', parseInt(btn.dataset.value, 10));
      });
    });
    TEM.state.subscribeKey('alphaSelector', function(val) {
      document.querySelectorAll('.pbtn[data-action="alpha-selector"]').forEach(function(btn) {
        btn.classList.toggle('is-selected', parseInt(btn.dataset.value, 10) === val);
      });
    });
  }

  /* ---- IIT-specific status strip updates ---- */
  function subscribeIITStatusStrip() {
    var indHT = document.getElementById('ind-ht');
    TEM.state.subscribeKey('preflightHV', function(v) {
      if (indHT && v) indHT.textContent = '200 kV';
    });
  }

  TEM.controls = { init: initIIT };
})();
