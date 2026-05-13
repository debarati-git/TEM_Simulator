/* =========================================================================
   Diffraction Lab — reciprocal-space (SAED) renderer
   Generates and draws diffraction spots based on the current crystal,
   orientation, accelerating voltage, and camera length.
   ========================================================================= */

(function () {
  'use strict';

  const { matVec3 } = window.TEM.math3d;
  const { deBroglieWavelength } = window.TEM.latticeData;

  class DiffractionRenderer {
    /**
     * @param {SVGSVGElement} svg  host SVG; must contain <g id="diffGroup">
     */
    constructor(svg) {
      this.svg = svg;
      this.group = svg.querySelector('#diffGroup');
      this.spots = [];
      // viewBox is -200..200, so a screen radius of 170 fits comfortably.
      this.screenRadius = 170;
    }

    /**
     * Compute spot positions and intensities for the current orientation.
     * Returns the list of spots and re-renders.
     */
    generate(crystal, rotMatrix, cameraLength_mm, voltage_kV) {
      const a = crystal.a;                                       // nm
      const lambda_nm = deBroglieWavelength(voltage_kV) * 1e9;   // m → nm

      const HMAX = 5;
      const allowed = [];

      // ── Walk every (h,k,l) and filter by structure factor + Laue zone ──
      const gz_threshold = 0.5; // 1/nm — allow a little excitation error

      for (let h = -HMAX; h <= HMAX; h++) {
        for (let k = -HMAX; k <= HMAX; k++) {
          for (let l = -HMAX; l <= HMAX; l++) {
            if (!crystal.allowed(h, k, l)) continue;

            // Reciprocal lattice vector (1/nm) for cubic
            const g = [h / a, k / a, l / a];
            const gRot = matVec3(rotMatrix, g);

            // Spots near the zero-order Laue zone (perpendicular to beam)
            if (Math.abs(gRot[2]) > gz_threshold) continue;

            const g_perp = Math.sqrt(gRot[0]*gRot[0] + gRot[1]*gRot[1]);
            if (g_perp < 1e-6) continue;

            const d = 1 / g_perp;                                 // d-spacing (nm)
            const theta = Math.asin(Math.min(1, lambda_nm / (2 * d))); // Bragg angle (rad)
            const R_mm = cameraLength_mm * Math.tan(2 * theta);   // radius on screen (mm)

            allowed.push({
              hkl: [h, k, l],
              gx: gRot[0],
              gy: gRot[1],
              gz: gRot[2],
              d_nm: d,
              theta: theta,
              R_mm: R_mm,
              intensity: Math.max(0.18, 1 - Math.abs(gRot[2]) / gz_threshold)
            });
          }
        }
      }

      // ── Scale so the largest R fits within the screen ───────────────
      const maxR = Math.max(...allowed.map(s => s.R_mm), 1);
      const screenScale = this.screenRadius / maxR;

      // Centre (000) transmitted beam
      const spots = [{
        hkl: [0, 0, 0],
        x: 0, y: 0,
        d_nm: Infinity,
        R_mm: 0,
        g_inv: 0,
        theta: 0,
        intensity: 1.5,
        isCenter: true
      }];

      allowed.forEach(s => {
        const mag = Math.sqrt(s.gx*s.gx + s.gy*s.gy);
        if (mag < 1e-6) return;
        const dx = s.gx / mag;
        const dy = s.gy / mag;
        const x =  dx * s.R_mm * screenScale;
        const y = -dy * s.R_mm * screenScale;          // flip y for SVG
        spots.push({
          hkl: s.hkl,
          x, y,
          d_nm: s.d_nm,
          R_mm: s.R_mm,
          g_inv: 1 / s.d_nm,
          theta: s.theta,
          intensity: s.intensity,
          isCenter: false
        });
      });

      this.spots = spots;
      this.screenScale = screenScale;
      this.maxR_mm = maxR;
      this._render();
      return spots;
    }

    _render() {
      let svg = '';

      // ── Concentric ring guides (visual reference) ───────────────────
      [50, 100, 150].forEach(r => {
        svg += `<circle class="diff-ring" cx="0" cy="0" r="${r}"/>`;
      });

      // ── Spots ────────────────────────────────────────────────────────
      this.spots.forEach((s, i) => {
        const r = s.isCenter ? 6 : (3 + s.intensity * 2);
        // Build label with overline for negative indices
        const labelText = s.isCenter
          ? '000'
          : s.hkl.map(n => n < 0 ? `\u0305${Math.abs(n)}` : `${n}`).join('');
        svg += `<g class="diff-spot ${s.isCenter ? 'is-center' : ''}" data-idx="${i}">`;
        svg += `<circle cx="${s.x.toFixed(2)}" cy="${s.y.toFixed(2)}"
                  r="${r.toFixed(2)}" opacity="${s.intensity.toFixed(2)}"/>`;
        svg += `<text class="diff-spot-label"
                  x="${s.x.toFixed(2)}" y="${(s.y - r - 4).toFixed(2)}">${labelText}</text>`;
        svg += `</g>`;
      });

      this.group.innerHTML = svg;
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.DiffractionRenderer = DiffractionRenderer;
})();
