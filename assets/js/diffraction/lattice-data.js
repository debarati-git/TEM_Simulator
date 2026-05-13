/* =========================================================================
   Diffraction Lab — lattice data + physics
   Crystal database, zone axes, physical constants, and de Broglie wavelength.
   ========================================================================= */

(function () {
  'use strict';

  // ── Physical constants ─────────────────────────────────────────────────
  const PHYS = {
    h:  6.62607015e-34,        // Planck constant (J·s)
    m0: 9.1093837015e-31,      // electron rest mass (kg)
    e:  1.602176634e-19,       // elementary charge (C)
    c:  299792458              // speed of light (m/s)
  };

  /**
   * Relativistic de Broglie wavelength.
   * @param {number} V_kV  Accelerating voltage in kV
   * @returns {number} wavelength in metres
   */
  function deBroglieWavelength(V_kV) {
    const V = V_kV * 1000;
    const num = PHYS.h;
    const den = Math.sqrt(
      2 * PHYS.m0 * PHYS.e * V *
      (1 + (PHYS.e * V) / (2 * PHYS.m0 * PHYS.c * PHYS.c))
    );
    return num / den;
  }

  // ── Crystal database ──────────────────────────────────────────────────
  // Lattice parameter `a` in nm. Selection rules baked into allowed(h,k,l).
  const CRYSTALS = {
    Au: {
      key: 'Au',
      name: 'Gold (Au)',
      structure: 'FCC',
      a: 0.408,
      desc: 'Face-centred cubic — soft, dense, classic SAED standard.',
      allowed: (h, k, l) => {
        if (h === 0 && k === 0 && l === 0) return false;
        const allEven = (h % 2 === 0) && (k % 2 === 0) && (l % 2 === 0);
        const allOdd  = (Math.abs(h) % 2 === 1) && (Math.abs(k) % 2 === 1) && (Math.abs(l) % 2 === 1);
        return allEven || allOdd;
      }
    },
    Al: {
      key: 'Al',
      name: 'Aluminium (Al)',
      structure: 'FCC',
      a: 0.405,
      desc: 'Face-centred cubic — light, common substrate.',
      allowed: (h, k, l) => {
        if (h === 0 && k === 0 && l === 0) return false;
        const allEven = (h % 2 === 0) && (k % 2 === 0) && (l % 2 === 0);
        const allOdd  = (Math.abs(h) % 2 === 1) && (Math.abs(k) % 2 === 1) && (Math.abs(l) % 2 === 1);
        return allEven || allOdd;
      }
    },
    Cu: {
      key: 'Cu',
      name: 'Copper (Cu)',
      structure: 'FCC',
      a: 0.362,
      desc: 'Face-centred cubic — slightly smaller lattice than Au/Al.',
      allowed: (h, k, l) => {
        if (h === 0 && k === 0 && l === 0) return false;
        const allEven = (h % 2 === 0) && (k % 2 === 0) && (l % 2 === 0);
        const allOdd  = (Math.abs(h) % 2 === 1) && (Math.abs(k) % 2 === 1) && (Math.abs(l) % 2 === 1);
        return allEven || allOdd;
      }
    },
    Fe: {
      key: 'Fe',
      name: 'α-Iron (Fe)',
      structure: 'BCC',
      a: 0.287,
      desc: 'Body-centred cubic — only h+k+l even reflections appear.',
      allowed: (h, k, l) => {
        if (h === 0 && k === 0 && l === 0) return false;
        return ((h + k + l) % 2 === 0);
      }
    },
    W: {
      key: 'W',
      name: 'Tungsten (W)',
      structure: 'BCC',
      a: 0.316,
      desc: 'Body-centred cubic — dense, high-Z.',
      allowed: (h, k, l) => {
        if (h === 0 && k === 0 && l === 0) return false;
        return ((h + k + l) % 2 === 0);
      }
    },
    Si: {
      key: 'Si',
      name: 'Silicon (Si)',
      structure: 'Diamond',
      a: 0.543,
      desc: 'Diamond cubic — FCC plus the (h+k+l)≡0 mod 4 extinction rule.',
      allowed: (h, k, l) => {
        if (h === 0 && k === 0 && l === 0) return false;
        const allEven = (h % 2 === 0) && (k % 2 === 0) && (l % 2 === 0);
        const allOdd  = (Math.abs(h) % 2 === 1) && (Math.abs(k) % 2 === 1) && (Math.abs(l) % 2 === 1);
        if (allOdd) return true;
        if (allEven) return ((h + k + l) % 4 === 0);
        return false;
      }
    }
  };

  // ── Zone axes for cubic systems ───────────────────────────────────────
  const ZONE_AXES = [
    { uvw: [0, 0, 1], label: '[001]', desc: '4-fold symmetry — square pattern' },
    { uvw: [0, 1, 1], label: '[011]', desc: '2-fold — rectangular pattern' },
    { uvw: [1, 1, 1], label: '[111]', desc: '6-fold — hexagonal pattern' },
    { uvw: [0, 1, 2], label: '[012]', desc: 'Low symmetry' },
    { uvw: [1, 1, 2], label: '[112]', desc: 'Rectangular' },
    { uvw: [1, 1, 3], label: '[113]', desc: 'Low symmetry' }
  ];

  // ── Basis atom positions per structure ────────────────────────────────
  // Returns array of [x,y,z] within a single unit cell (units of a).
  function structureBasis(structure) {
    switch (structure) {
      case 'FCC':
        return [
          [0,   0,   0  ],
          [0.5, 0.5, 0  ],
          [0.5, 0,   0.5],
          [0,   0.5, 0.5]
        ];
      case 'BCC':
        return [
          [0,   0,   0  ],
          [0.5, 0.5, 0.5]
        ];
      case 'Diamond':
        return [
          [0,    0,    0   ],
          [0.5,  0.5,  0   ],
          [0.5,  0,    0.5 ],
          [0,    0.5,  0.5 ],
          [0.25, 0.25, 0.25],
          [0.75, 0.75, 0.25],
          [0.75, 0.25, 0.75],
          [0.25, 0.75, 0.75]
        ];
      default:
        return [[0, 0, 0]];
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.latticeData = {
    PHYS,
    deBroglieWavelength,
    CRYSTALS,
    ZONE_AXES,
    structureBasis
  };
})();
