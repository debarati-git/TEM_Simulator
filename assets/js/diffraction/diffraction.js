/* =========================================================================
   Diffraction Lab — main controller
   Wires the lattice renderer, SAED renderer, dropdowns, sliders, drag,
   spot-readout and ruler tool into one coherent experience.
   ========================================================================= */

(function () {
  'use strict';

  const { CRYSTALS, ZONE_AXES, deBroglieWavelength } = window.TEM.latticeData;
  const { matMul3, rotX, rotY, rotationToZone } = window.TEM.math3d;
  const { LatticeRenderer, DiffractionRenderer } = window.TEM;

  // ── Module state ─────────────────────────────────────────────────────
  const DIFF = {
    crystal:      'Au',
    zone:         '[001]',
    cameraLength: 1000,    // mm
    voltage:      200,     // kV
    rotation:     [[1,0,0],[0,1,0],[0,0,1]],
    selectedSpot: null,
    rulerActive:  false,
    rulerPoint1:  null,
    rulerPoint2:  null
  };

  // ── Init ─────────────────────────────────────────────────────────────
  function init() {
    const latticeSVG = document.getElementById('latticeSVG');
    const diffSVG    = document.getElementById('diffSVG');
    if (!latticeSVG || !diffSVG) return;

    const latticeRenderer = new LatticeRenderer(latticeSVG);
    const diffRenderer    = new DiffractionRenderer(diffSVG);

    const latticeCanvas   = document.getElementById('latticeCanvas');
    const measureGroup    = diffSVG.querySelector('#measureGroup');

    // ── DOM references for controls ───────────────────────────────────
    const crystalTrigger     = document.getElementById('crystalTrigger');
    const crystalTriggerText = document.getElementById('crystalTriggerText');
    const crystalDropdown    = document.getElementById('crystalDropdown');

    const zoneTrigger        = document.getElementById('zoneTrigger');
    const zoneTriggerText    = document.getElementById('zoneTriggerText');
    const zoneDropdown       = document.getElementById('zoneDropdown');
    const zonePatternMeta    = document.getElementById('zonePatternMeta');

    const cameraSlider       = document.getElementById('cameraSlider');
    const cameraValue        = document.getElementById('cameraValue');

    const voltageButtons     = document.querySelectorAll('[data-voltage]');

    const rulerToolBtn       = document.getElementById('rulerTool');
    const resetViewBtn       = document.getElementById('resetView');

    const latticeTitle       = document.getElementById('latticeTitle');
    const latticeMeta        = document.getElementById('latticeMeta');
    const wavelengthReadout  = document.getElementById('wavelengthReadout');

    const dragRotateHintEl   = document.getElementById('dragRotateHint');
    const spotClickHintEl    = document.getElementById('spotClickHint');

    const spotReadout        = document.getElementById('spotReadout');
    const spotHKL            = document.getElementById('spotHKL');
    const spotD              = document.getElementById('spotD');
    const spotG              = document.getElementById('spotG');
    const spotTheta          = document.getElementById('spotTheta');
    const spotR              = document.getElementById('spotR');
    const spotReadoutClose   = document.getElementById('spotReadoutClose');

    // ── Master redraw ─────────────────────────────────────────────────
    function redraw() {
      const crystal = CRYSTALS[DIFF.crystal];
      latticeRenderer.render(crystal, DIFF.rotation);
      diffRenderer.generate(crystal, DIFF.rotation, DIFF.cameraLength, DIFF.voltage);
      updateWavelengthReadout();
      // Re-apply selection (since spots are regenerated each redraw)
      if (DIFF.selectedSpot) {
        const sel = diffRenderer.spots.find(s =>
          s.hkl[0] === DIFF.selectedSpot.hkl[0] &&
          s.hkl[1] === DIFF.selectedSpot.hkl[1] &&
          s.hkl[2] === DIFF.selectedSpot.hkl[2]
        );
        if (sel) {
          const el = diffSVG.querySelector(`.diff-spot[data-idx="${diffRenderer.spots.indexOf(sel)}"]`);
          if (el) el.classList.add('is-selected');
          DIFF.selectedSpot = sel;
          showSpotReadout(sel);
        } else {
          hideSpotReadout();
        }
      }
      // Refresh ruler endpoints / line if active
      if (DIFF.rulerActive && (DIFF.rulerPoint1 || DIFF.rulerPoint2)) {
        // Try to re-find the spots by hkl
        if (DIFF.rulerPoint1) {
          DIFF.rulerPoint1 = diffRenderer.spots.find(s =>
            s.hkl[0] === DIFF.rulerPoint1.hkl[0] &&
            s.hkl[1] === DIFF.rulerPoint1.hkl[1] &&
            s.hkl[2] === DIFF.rulerPoint1.hkl[2]
          ) || null;
        }
        if (DIFF.rulerPoint2) {
          DIFF.rulerPoint2 = diffRenderer.spots.find(s =>
            s.hkl[0] === DIFF.rulerPoint2.hkl[0] &&
            s.hkl[1] === DIFF.rulerPoint2.hkl[1] &&
            s.hkl[2] === DIFF.rulerPoint2.hkl[2]
          ) || null;
        }
        drawMeasurement();
      }
    }

    function updateWavelengthReadout() {
      if (!wavelengthReadout) return;
      const lambda_pm = deBroglieWavelength(DIFF.voltage) * 1e12;
      wavelengthReadout.textContent = lambda_pm.toFixed(2);
    }

    // ── Crystal dropdown ───────────────────────────────────────────────
    const crystalOpts = Object.values(CRYSTALS).map(c => ({
      value: c.key, name: c.name, meta: `${c.structure} · a=${c.a} nm`
    }));

    function buildDropdown(container, options, current, onSelect) {
      container.innerHTML = options.map(opt => `
        <div class="diff-select-option ${opt.value === current ? 'is-active' : ''}"
             data-value="${opt.value}">
          <span class="diff-select-option-name">${opt.name}</span>
          <span class="diff-select-option-meta">${opt.meta || ''}</span>
        </div>
      `).join('');
      container.querySelectorAll('.diff-select-option').forEach(el => {
        el.addEventListener('click', () => {
          onSelect(el.dataset.value);
          container.classList.remove('is-open');
          container.parentElement.querySelector('.diff-select-trigger')?.classList.remove('is-open');
        });
      });
    }

    function refreshCrystal() {
      buildDropdown(crystalDropdown, crystalOpts, DIFF.crystal, (val) => {
        DIFF.crystal = val;
        const c = CRYSTALS[val];
        crystalTriggerText.textContent = c.name;
        latticeTitle.textContent = c.name;
        latticeMeta.textContent  = `${c.structure} · a = ${c.a} nm`;
        hideSpotReadout();
        clearMeasurement();
        redraw();
        refreshCrystal();
      });
    }
    refreshCrystal();

    crystalTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = crystalTrigger.classList.toggle('is-open');
      crystalDropdown.classList.toggle('is-open', isOpen);
      zoneTrigger.classList.remove('is-open');
      zoneDropdown.classList.remove('is-open');
    });

    // ── Zone-axis dropdown ────────────────────────────────────────────
    const zoneOpts = ZONE_AXES.map(z => ({
      value: z.label, name: z.label, meta: z.desc
    }));

    function refreshZone() {
      buildDropdown(zoneDropdown, zoneOpts, DIFF.zone, (val) => {
        DIFF.zone = val;
        zoneTriggerText.textContent = val;
        zonePatternMeta.textContent = val;
        const za = ZONE_AXES.find(z => z.label === val);
        hideSpotReadout();
        clearMeasurement();
        animateToRotation(rotationToZone(za.uvw));
        refreshZone();
      });
    }
    refreshZone();

    zoneTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = zoneTrigger.classList.toggle('is-open');
      zoneDropdown.classList.toggle('is-open', isOpen);
      crystalTrigger.classList.remove('is-open');
      crystalDropdown.classList.remove('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.diff-select')) {
        crystalTrigger.classList.remove('is-open');
        crystalDropdown.classList.remove('is-open');
        zoneTrigger.classList.remove('is-open');
        zoneDropdown.classList.remove('is-open');
      }
    });

    // ── Camera-length slider ──────────────────────────────────────────
    function updateSliderFill() {
      const min = parseFloat(cameraSlider.min);
      const max = parseFloat(cameraSlider.max);
      const pct = ((DIFF.cameraLength - min) / (max - min)) * 100;
      cameraSlider.style.setProperty('--val', pct + '%');
    }
    cameraSlider.addEventListener('input', (e) => {
      DIFF.cameraLength = parseInt(e.target.value, 10);
      cameraValue.textContent = DIFF.cameraLength;
      updateSliderFill();
      redraw();
    });
    updateSliderFill();

    // ── Voltage selector ──────────────────────────────────────────────
    voltageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const v = parseInt(btn.dataset.voltage, 10);
        DIFF.voltage = v;
        voltageButtons.forEach(b => b.classList.toggle('is-active', b === btn));
        hideSpotReadout();
        clearMeasurement();
        redraw();
      });
    });

    // ── 3D rotation by drag ───────────────────────────────────────────
    let isDragging = false;
    let dragStart = null;
    let rotStart  = null;

    function startDrag(clientX, clientY) {
      isDragging = true;
      dragStart = { x: clientX, y: clientY };
      rotStart = DIFF.rotation.map(row => row.slice());
      // DRAG TO ROTATE hint stays visible always (per design) — no hide here.
    }
    function moveDrag(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - dragStart.x;
      const dy = clientY - dragStart.y;
      const ry = rotY(dx * 0.012);
      const rx = rotX(dy * 0.012);
      DIFF.rotation = matMul3(rx, matMul3(ry, rotStart));
      redraw();
    }
    function endDrag() { isDragging = false; }

    latticeCanvas.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);

    // Touch support for mobile/tablet
    latticeCanvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0]; startDrag(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const t = e.touches[0]; moveDrag(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', endDrag);

    // ── Animated zone-axis transition ─────────────────────────────────
    let animFrame = null;
    function animateToRotation(targetRot) {
      if (animFrame) cancelAnimationFrame(animFrame);
      const startRot = DIFF.rotation.map(row => row.slice());
      const startTime = performance.now();
      const duration = 600;

      function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        const M = [[0,0,0],[0,0,0],[0,0,0]];
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 3; j++)
            M[i][j] = startRot[i][j] + (targetRot[i][j] - startRot[i][j]) * ease;
        DIFF.rotation = M;
        redraw();
        if (t < 1) animFrame = requestAnimationFrame(step);
        else animFrame = null;
      }
      animFrame = requestAnimationFrame(step);
    }

    // ── Spot readout ──────────────────────────────────────────────────
    function showSpotReadout(spot) {
      if (spot.isCenter) {
        spotHKL.innerHTML = '(<em>000</em>)';
        spotD.textContent = '∞ (transmitted)';
        spotG.textContent = '0 nm⁻¹';
        spotTheta.textContent = '0°';
        spotR.textContent = '0 mm';
      } else {
        const fmt = (n) => n < 0 ? `\u0305${Math.abs(n)}` : `${n}`;
        spotHKL.innerHTML = `(<em>${spot.hkl.map(fmt).join('')}</em>)`;
        spotD.textContent     = spot.d_nm.toFixed(3) + ' nm';
        spotG.textContent     = spot.g_inv.toFixed(2) + ' nm⁻¹';
        spotTheta.textContent = (spot.theta * 180 / Math.PI * 2).toFixed(2) + '°';
        spotR.textContent     = spot.R_mm.toFixed(2) + ' mm';
      }
      spotReadout.classList.add('is-visible');
      if (spotClickHintEl) spotClickHintEl.classList.add('is-hidden');
    }

    function hideSpotReadout() {
      spotReadout.classList.remove('is-visible');
      DIFF.selectedSpot = null;
      diffSVG.querySelectorAll('.diff-spot').forEach(s => s.classList.remove('is-selected'));
      // Bring the click-any-spot hint back once the readout is dismissed.
      if (spotClickHintEl) spotClickHintEl.classList.remove('is-hidden');
    }

    spotReadoutClose.addEventListener('click', hideSpotReadout);

    // Delegated spot-click handler — spots are regenerated every redraw
    diffSVG.addEventListener('click', (e) => {
      const spotEl = e.target.closest('.diff-spot');
      if (!spotEl) return;
      if (DIFF.rulerActive) {
        handleRulerClick(spotEl);
        return;
      }
      diffSVG.querySelectorAll('.diff-spot').forEach(s => s.classList.remove('is-selected'));
      spotEl.classList.add('is-selected');
      const idx = parseInt(spotEl.dataset.idx, 10);
      const spot = diffRenderer.spots[idx];
      DIFF.selectedSpot = spot;
      showSpotReadout(spot);
    });

    // ── Ruler tool ────────────────────────────────────────────────────
    function clearMeasurement() {
      DIFF.rulerPoint1 = null;
      DIFF.rulerPoint2 = null;
      measureGroup.innerHTML = '';
    }

    rulerToolBtn.addEventListener('click', () => {
      DIFF.rulerActive = !DIFF.rulerActive;
      rulerToolBtn.classList.toggle('is-active', DIFF.rulerActive);
      if (!DIFF.rulerActive) {
        clearMeasurement();
      } else {
        hideSpotReadout();
      }
    });

    function handleRulerClick(spotEl) {
      const idx  = parseInt(spotEl.dataset.idx, 10);
      const spot = diffRenderer.spots[idx];
      if (!DIFF.rulerPoint1) {
        DIFF.rulerPoint1 = spot;
      } else if (!DIFF.rulerPoint2) {
        DIFF.rulerPoint2 = spot;
      } else {
        DIFF.rulerPoint1 = spot;
        DIFF.rulerPoint2 = null;
      }
      drawMeasurement();
    }

    function drawMeasurement() {
      let svg = '';
      if (DIFF.rulerPoint1) {
        const p1 = DIFF.rulerPoint1;
        svg += `<circle class="measure-endpoint"
          cx="${p1.x.toFixed(2)}" cy="${p1.y.toFixed(2)}" r="4"/>`;
      }
      if (DIFF.rulerPoint1 && DIFF.rulerPoint2) {
        const p1 = DIFF.rulerPoint1, p2 = DIFF.rulerPoint2;
        svg += `<line class="measure-line"
          x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}"
          x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}"/>`;
        svg += `<circle class="measure-endpoint"
          cx="${p2.x.toFixed(2)}" cy="${p2.y.toFixed(2)}" r="4"/>`;

        // Convert screen-pixel distance back to mm via current scale
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const dist_screen = Math.sqrt(dx*dx + dy*dy);
        const scale = diffRenderer.screenScale || 1;
        const dist_mm = dist_screen / scale;

        // Use d = λL / R (R = inter-spot distance treated as one g-vector difference)
        const lambda_nm = deBroglieWavelength(DIFF.voltage) * 1e9;
        const d_nm = (lambda_nm * DIFF.cameraLength) / dist_mm;

        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const labelText = `${dist_mm.toFixed(2)} mm   d = ${d_nm.toFixed(3)} nm`;
        const labelW = labelText.length * 5.6 + 12;
        svg += `<rect class="measure-readout"
          x="${(mx - labelW/2).toFixed(2)}" y="${(my - 18).toFixed(2)}"
          width="${labelW.toFixed(2)}" height="14" rx="2"/>`;
        svg += `<text class="measure-readout-text"
          x="${mx.toFixed(2)}" y="${(my - 8).toFixed(2)}">${labelText}</text>`;
      }
      measureGroup.innerHTML = svg;
    }

    // ── Reset view ────────────────────────────────────────────────────
    resetViewBtn.addEventListener('click', () => {
      DIFF.zone = '[001]';
      zoneTriggerText.textContent = '[001]';
      zonePatternMeta.textContent = '[001]';
      refreshZone();
      hideSpotReadout();
      if (DIFF.rulerActive) {
        DIFF.rulerActive = false;
        rulerToolBtn.classList.remove('is-active');
      }
      clearMeasurement();
      animateToRotation(rotationToZone([0, 0, 1]));
      // Re-show the click-any-spot hint (drag-to-rotate is always visible)
      if (spotClickHintEl) {
        spotClickHintEl.classList.remove('is-hidden');
        void spotClickHintEl.offsetWidth;
      }
    });

    // ── Initial render ────────────────────────────────────────────────
    DIFF.rotation = rotationToZone([0, 0, 1]);
    const c0 = CRYSTALS[DIFF.crystal];
    latticeTitle.textContent = c0.name;
    latticeMeta.textContent  = `${c0.structure} · a = ${c0.a} nm`;
    redraw();
  }

  window.TEM = window.TEM || {};
  window.TEM.diffraction = { init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
