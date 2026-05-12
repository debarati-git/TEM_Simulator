/* =========================================================================
   Guided Simulator — Column Diagram Hotspots
   Renders 4 invisible clickable zones over the column image, positioned
   by percentage coordinates from guided-config.json. Each hotspot writes
   a corresponding state value when clicked. The active hotspot (the one
   the current step is targeting) is highlighted with a pulsing cyan ring.

   Hotspot ids:
     remove-holder      → sets state.holderRemoved = true
     insert-specimen    → sets state.specimenInsertedDiagram = true
     insert-condenser   → sets state.condenserInserted = true
     insert-objective   → sets state.objectiveInserted = true
   ========================================================================= */

(function () {
  'use strict';

  let container;          // .viewer__column-hotspots
  let hotspots = {};      // id → DOM element
  let activeId = null;

  /** Mapping from hotspot id → which state key it sets when clicked. */
  const HOTSPOT_STATE = {
    'remove-holder':    'holderRemoved',
    'insert-specimen':  'specimenInsertedDiagram',
    'insert-condenser': 'condenserInserted',
    'insert-objective': 'objectiveInserted',
  };

  function init() {
    container = document.getElementById('diagram-hotspots');
    if (!container) return;

    const cfg = TEM.tolerance.getConfig();
    if (!cfg || !cfg.diagramHotspots) return;

    container.innerHTML = '';
    hotspots = {};

    for (const [id, spec] of Object.entries(cfg.diagramHotspots)) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'hotspot';
      el.dataset.hotspot = id;
      el.title = spec.label;
      el.setAttribute('aria-label', spec.label);
      el._spec = spec;                    // keep coords for repositioning
      el.addEventListener('click', () => onClick(id));
      container.appendChild(el);
      hotspots[id] = el;
    }

    // Position hotspots relative to the column image (not the full layer)
    positionHotspots();

    // Reposition on resize, and once after image loads to be sure
    const img = document.querySelector('.viewer__column-image');
    if (img) {
      if (img.complete) positionHotspots();
      else img.addEventListener('load', positionHotspots);
    }
    window.addEventListener('resize', positionHotspots);
  }

  /** Place each hotspot at its (x,y,w,h) percentage of the image's
      rendered bounds — not the surrounding layer. The image is letterboxed
      inside the layer (object-fit: contain), so we need to map percentages
      to actual pixel positions. */
  function positionHotspots() {
    const layer = container;
    const img   = document.querySelector('.viewer__column-image');
    if (!layer || !img) return;
    const layerB = layer.getBoundingClientRect();
    const imgB   = img.getBoundingClientRect();
    if (layerB.width === 0 || imgB.width === 0) return;

    // Image offset within the layer (in px)
    const dx = imgB.left - layerB.left;
    const dy = imgB.top  - layerB.top;

    for (const el of Object.values(hotspots)) {
      const s = el._spec;
      if (!s) continue;
      const left   = dx + (s.x / 100) * imgB.width;
      const top    = dy + (s.y / 100) * imgB.height;
      const width  =      (s.w / 100) * imgB.width;
      const height =      (s.h / 100) * imgB.height;
      el.style.left   = `${left}px`;
      el.style.top    = `${top}px`;
      el.style.width  = `${width}px`;
      el.style.height = `${height}px`;
    }
  }

  function onClick(id) {
    // Only the active hotspot accepts clicks in strict guided mode
    if (id !== activeId) return;
    const key = HOTSPOT_STATE[id];
    if (key) TEM.state.set(key, true);
  }

  /**
   * Highlight one hotspot as active (the one the current step targets).
   * All others become invisible/non-interactive. Passing null clears.
   */
  function setActiveHotspot(id) {
    activeId = id;
    for (const [hid, el] of Object.entries(hotspots)) {
      const active = hid === id;
      el.classList.toggle('is-active', active);
      el.style.pointerEvents = active ? 'auto' : 'none';
    }
    // The hotspot layer must accept pointer events on its children when active
    if (container) {
      container.style.pointerEvents = id ? 'none' : 'none';
      // (children still get clicks via their own pointer-events:auto)
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.diagram = { init, setActiveHotspot, repositionHotspots: positionHotspots };
})();
