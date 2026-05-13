/* =========================================================================
   Guided Simulator — Column Diagram Hotspots
   Each hotspot has two parts:
     1. A clickable rectangle over the component (subtle when active)
     2. An invisible-by-default overlay over the corresponding text label
        on the image — when active, it blinks cyan to draw the user's eye.
   Either part can be clicked to trigger the action.
   ========================================================================= */

(function () {
  'use strict';

  let container;            // .viewer__column-hotspots
  let hotspots = {};        // id → { rect: el, label: el, spec }
  let activeId = null;

  /** Hotspot id → state key it sets when clicked. */
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
      // The hotspot rectangle (over the component)
      const rect = document.createElement('button');
      rect.type = 'button';
      rect.className = 'hotspot';
      rect.dataset.hotspot = id;
      rect.title = `${spec.action} ${spec.labelText}`;
      rect.setAttribute('aria-label', `${spec.action} ${spec.labelText}`);
      rect._spec = spec;
      rect.addEventListener('click', () => onClick(id));
      container.appendChild(rect);

      // The label overlay (over the text label on the image)
      let label = null;
      if (spec.labelPos) {
        label = document.createElement('button');
        label.type = 'button';
        label.className = 'hotspot-label';
        label.dataset.hotspot = id;
        // The cue text reflects what the user is about to do — "Insert"
        // for component insertions, "Remove" / "Insert" for the specimen
        // depending on which step is active.
        label.innerHTML = `
          <span class="hotspot-label__action">${spec.action}</span>
        `;
        label._spec = spec;
        label.addEventListener('click', () => onClick(id));
        container.appendChild(label);
      }

      hotspots[id] = { rect, label, spec };
    }

    positionHotspots();

    const img = document.querySelector('.viewer__column-image');
    if (img) {
      if (img.complete) positionHotspots();
      else img.addEventListener('load', positionHotspots);
    }
    window.addEventListener('resize', positionHotspots);
  }

  /** Place each hotspot relative to the actual rendered image bounds.
      The image is letterboxed inside its layer (object-fit: contain),
      so we map % coords to the image, not to the layer. */
  function positionHotspots() {
    const layer = container;
    const img   = document.querySelector('.viewer__column-image');
    if (!layer || !img) return;
    const layerB = layer.getBoundingClientRect();
    const imgB   = img.getBoundingClientRect();
    if (layerB.width === 0 || imgB.width === 0) return;

    const dx = imgB.left - layerB.left;
    const dy = imgB.top  - layerB.top;

    for (const h of Object.values(hotspots)) {
      const s = h.spec;
      if (!s) continue;
      // Position rect
      h.rect.style.left   = `${dx + (s.x / 100) * imgB.width}px`;
      h.rect.style.top    = `${dy + (s.y / 100) * imgB.height}px`;
      h.rect.style.width  = `${(s.w / 100) * imgB.width}px`;
      h.rect.style.height = `${(s.h / 100) * imgB.height}px`;
      // Position label overlay
      if (h.label && s.labelPos) {
        const lp = s.labelPos;
        h.label.style.left   = `${dx + (lp.x / 100) * imgB.width}px`;
        h.label.style.top    = `${dy + (lp.y / 100) * imgB.height}px`;
        h.label.style.width  = `${(lp.w / 100) * imgB.width}px`;
        h.label.style.height = `${(lp.h / 100) * imgB.height}px`;
      }
    }
  }

  function onClick(id) {
    if (id !== activeId) return;
    const key = HOTSPOT_STATE[id];
    if (key) TEM.state.set(key, true);
  }

  /** Highlight one hotspot as active. Clears all others. */
  function setActiveHotspot(id) {
    activeId = id;
    for (const [hid, h] of Object.entries(hotspots)) {
      const active = hid === id;
      h.rect.classList.toggle('is-active', active);
      h.rect.style.pointerEvents = active ? 'auto' : 'none';
      if (h.label) {
        h.label.classList.toggle('is-active', active);
        h.label.style.pointerEvents = active ? 'auto' : 'none';
      }
    }
  }

  window.TEM = window.TEM || {};
  window.TEM.diagram = { init, setActiveHotspot, repositionHotspots: positionHotspots };
})();
