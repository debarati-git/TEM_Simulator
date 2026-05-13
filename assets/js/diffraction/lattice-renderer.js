/* =========================================================================
   Diffraction Lab — real-space lattice renderer
   Renders a 3D crystal lattice into the left SVG pane using simple
   orthographic projection and depth sorting.
   ========================================================================= */

(function () {
  'use strict';

  const { matVec3 } = window.TEM.math3d;
  const { structureBasis } = window.TEM.latticeData;

  class LatticeRenderer {
    /**
     * @param {SVGSVGElement} svg  the host SVG; must contain <g id="latticeGroup">
     */
    constructor(svg) {
      this.svg = svg;
      this.group = svg.querySelector('#latticeGroup');
      this.cellSize = 80;   // px per unit cell edge
      this.cellRange = 1;   // -N..N → 2N+1 cells along each axis
    }

    /** Generate atoms inside the visible range for the given crystal. */
    _generateAtoms(crystal) {
      const atoms = [];
      const N = this.cellRange;
      const basis = structureBasis(crystal.structure);

      for (let i = -N; i <= N; i++) {
        for (let j = -N; j <= N; j++) {
          for (let k = -N; k <= N; k++) {
            basis.forEach((b, bi) => {
              const x = i + b[0];
              const y = j + b[1];
              const z = k + b[2];
              if (x >= -N - 0.01 && x <= N + 1.01 &&
                  y >= -N - 0.01 && y <= N + 1.01 &&
                  z >= -N - 0.01 && z <= N + 1.01) {
                atoms.push({ pos: [x, y, z], isCorner: bi === 0 });
              }
            });
          }
        }
      }
      return atoms;
    }

    /**
     * Render the crystal at the given orientation.
     * @param {object} crystal     entry from CRYSTALS
     * @param {number[][]} rotMatrix  3×3 rotation matrix
     */
    render(crystal, rotMatrix) {
      const atoms = this._generateAtoms(crystal);
      const cellSize = this.cellSize;

      // Project all atoms (orthographic, with Y flipped for SVG)
      const projected = atoms.map(a => {
        const v = matVec3(rotMatrix, a.pos);
        return {
          x: v[0] * cellSize,
          y: -v[1] * cellSize,
          z: v[2] * cellSize,
          isCorner: a.isCorner
        };
      });

      // Painter's algorithm: back → front
      projected.sort((p, q) => p.z - q.z);

      let svg = '';

      // ── Unit cell edges (a 1×1×1 cube around origin) ────────────────
      const cellCorners = [
        [0,0,0],[1,0,0],[1,1,0],[0,1,0],
        [0,0,1],[1,0,1],[1,1,1],[0,1,1]
      ];
      const cellEdges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];
      const projCorners = cellCorners.map(c => {
        const v = matVec3(rotMatrix, c);
        return [v[0] * cellSize, -v[1] * cellSize, v[2] * cellSize];
      });
      cellEdges.forEach(([a, b]) => {
        svg += `<line class="lattice-cell-edge"
          x1="${projCorners[a][0].toFixed(2)}" y1="${projCorners[a][1].toFixed(2)}"
          x2="${projCorners[b][0].toFixed(2)}" y2="${projCorners[b][1].toFixed(2)}"/>`;
      });

      // ── Atoms (size + opacity by depth) ─────────────────────────────
      const zSpan = cellSize * this.cellRange * 2;
      projected.forEach(p => {
        const depth = (p.z + cellSize * this.cellRange) / zSpan; // 0..1
        const r = 4 + depth * 3;
        const opacity = 0.45 + depth * 0.55;
        svg += `<circle class="lattice-atom"
          cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}"
          r="${r.toFixed(2)}" opacity="${opacity.toFixed(2)}"/>`;
      });

      // ── Crystal axes overlay (a, b, c) ──────────────────────────────
      const axLen = cellSize * 1.25;
      const axes = [
        { vec: [1, 0, 0], label: 'a' },
        { vec: [0, 1, 0], label: 'b' },
        { vec: [0, 0, 1], label: 'c' }
      ];

      svg += `<g class="lattice-axes">`;
      svg += `<circle class="lattice-axes-origin" cx="0" cy="0" r="2.6"/>`;

      axes.forEach(ax => {
        const v = matVec3(rotMatrix, ax.vec);
        const tipX =  v[0] * axLen;
        const tipY = -v[1] * axLen;

        const dlen = Math.sqrt(tipX*tipX + tipY*tipY) || 1;
        const ux = tipX / dlen, uy = tipY / dlen;
        const nx = -uy, ny = ux;
        const ah = 9, aw = 5;
        const baseX = tipX - ux * ah;
        const baseY = tipY - uy * ah;
        const w1x = baseX + nx * aw, w1y = baseY + ny * aw;
        const w2x = baseX - nx * aw, w2y = baseY - ny * aw;

        svg += `<line class="lattice-axis-line"
          x1="0" y1="0" x2="${tipX.toFixed(2)}" y2="${tipY.toFixed(2)}"/>`;
        svg += `<polygon class="lattice-axis-head"
          points="${tipX.toFixed(2)},${tipY.toFixed(2)} ${w1x.toFixed(2)},${w1y.toFixed(2)} ${w2x.toFixed(2)},${w2y.toFixed(2)}"/>`;
        svg += `<text class="lattice-axis-label"
          x="${(tipX + ux * 13).toFixed(2)}" y="${(tipY + uy * 13 + 4).toFixed(2)}"
          text-anchor="middle">${ax.label}</text>`;
      });
      svg += `</g>`;

      this.group.innerHTML = svg;
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.LatticeRenderer = LatticeRenderer;
})();
