/* =========================================================================
   Diffraction Lab — 3D math helpers
   Pure functions for rotation matrices and 3-vector operations.
   ========================================================================= */

(function () {
  'use strict';

  function matMul3(A, B) {
    const C = [[0,0,0],[0,0,0],[0,0,0]];
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++)
          C[i][j] += A[i][k] * B[k][j];
    return C;
  }

  function matVec3(M, v) {
    return [
      M[0][0]*v[0] + M[0][1]*v[1] + M[0][2]*v[2],
      M[1][0]*v[0] + M[1][1]*v[1] + M[1][2]*v[2],
      M[2][0]*v[0] + M[2][1]*v[1] + M[2][2]*v[2]
    ];
  }

  function rotX(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    return [[1,0,0],[0,c,-s],[0,s,c]];
  }

  function rotY(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    return [[c,0,s],[0,1,0],[-s,0,c]];
  }

  function identity3() {
    return [[1,0,0],[0,1,0],[0,0,1]];
  }

  function normalize3(v) {
    const m = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return m > 0 ? [v[0]/m, v[1]/m, v[2]/m] : v;
  }

  function dot3(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }

  function cross3(a, b) {
    return [
      a[1]*b[2] - a[2]*b[1],
      a[2]*b[0] - a[0]*b[2],
      a[0]*b[1] - a[1]*b[0]
    ];
  }

  /**
   * Build a rotation matrix that aligns crystal direction [uvw] with the
   * viewer's −Z axis (i.e. the beam direction, pointing into the screen).
   * Uses Rodrigues' formula.
   */
  function rotationToZone(uvw) {
    const u = normalize3(uvw);
    const target = [0, 0, -1];
    const axis = cross3(u, target);
    const axisMag = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);
    if (axisMag < 1e-9) {
      if (dot3(u, target) > 0) return identity3();
      return [[1,0,0],[0,-1,0],[0,0,-1]];
    }
    const ax = [axis[0]/axisMag, axis[1]/axisMag, axis[2]/axisMag];
    const angle = Math.acos(Math.max(-1, Math.min(1, dot3(u, target))));
    const c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
    const [x, y, z] = ax;
    return [
      [t*x*x + c,    t*x*y - s*z, t*x*z + s*y],
      [t*x*y + s*z,  t*y*y + c,   t*y*z - s*x],
      [t*x*z - s*y,  t*y*z + s*x, t*z*z + c  ]
    ];
  }

  window.TEM = window.TEM || {};
  window.TEM.math3d = {
    matMul3, matVec3, rotX, rotY, identity3,
    normalize3, dot3, cross3, rotationToZone
  };
})();
