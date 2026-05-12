/* =========================================================================
   The Microscope — mode selector logic
   Phase 1: minimal. Most behavior is plain anchor navigation; this file
   exists so we can add analytics or confirmation flows later if needed.
   ========================================================================= */

(function () {
  'use strict';

  // Disabled cards should not navigate anywhere even if a child link is added later.
  document.querySelectorAll('.mode-card.is-disabled').forEach(card => {
    card.addEventListener('click', (e) => e.preventDefault());
  });

  window.TEM = window.TEM || {};
  window.TEM.microscopeMode = {};
})();
