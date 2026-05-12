/* =========================================================================
   Diffraction Lab — controller
   Phase 1: minimal interactivity so the selector visually responds.
   Phase 4 will compute and render actual reciprocal patterns.
   ========================================================================= */

(function () {
  'use strict';

  function init() {
    const items = document.querySelectorAll('#diff-list .diff-selector__item');

    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
        // Phase 4 will: load lattice data, call reciprocal-renderer
      });
    });
  }

  window.TEM = window.TEM || {};
  window.TEM.diffraction = { init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
