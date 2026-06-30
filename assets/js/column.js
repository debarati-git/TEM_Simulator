/* =========================================================================
   The Column — Anatomy module (v1.3)

   v1.3 navigation model
     - Default face: EXTERIOR (annotated lab diagram), replaces old photo.
     - Flip pair: exterior <-> interior. The flip toggle rotates the card and
       re-binds the right-hand panel to the active flip-face's components.
       Button label: "Flip to see Column Interior" / "Flip to see Exterior".
     - Drill-down: two exterior components carry `drilldown: <faceId>`
       (control panel L1 -> 'panel-l1', R1 -> 'panel-r1'). Clicking such a
       hotspot (or its "Open detailed view" CTA) REPLACES the viewport with
       that detail face and shows a "Back to Exterior" control. Esc / the
       back button returns to the exterior face.

   Preserved behaviours
     - Hotspot intro pulse on load + on every face change.
     - Pin pulse on the active component (+ extra pins, e.g. foot switches).
     - Cursor-anchored wheel zoom, click-drag / touch pan, keyboard shortcuts.
   ========================================================================= */

(function () {
  'use strict';

  const root = window.TEM && window.TEM.dataColumnComponents;
  if (!root || !root.faces) {
    console.error('[column] components data not loaded (expected faces structure)');
    return;
  }

  /* --------------------------------------------------------------------- */
  /*  STATE / CONFIG                                                       */
  /* --------------------------------------------------------------------- */
  const allFaceIds = Object.keys(root.faces);
  const flipPair   = root.flipPair || ['exterior', 'interior'];
  const FLIP_FRONT = flipPair[0];   // 'exterior'
  const FLIP_BACK  = flipPair[1];   // 'interior'
  const drilldownFaces = root.drilldownFaces || [];

  let currentFaceId = root.defaultFace || allFaceIds[0];
  let activeDrilldown = null;        // faceId of the open detail face, or null

  // Per-face indexes
  const pinByComponent     = {};
  const listItemById       = {};
  const hotspotLayerByFace = {};
  allFaceIds.forEach(f => { pinByComponent[f] = {}; listItemById[f] = {}; });

  /* --------------------------------------------------------------------- */
  /*  DOM refs                                                             */
  /* --------------------------------------------------------------------- */
  const flipEl       = document.getElementById('column-flip');
  const flipToggle   = document.getElementById('flip-toggle');
  const flipLabel    = document.querySelector('[data-flip-label]');
  const breadcrumbEl = document.querySelector('[data-breadcrumb]');
  const listEl       = document.getElementById('component-list');
  const listHeading  = document.querySelector('[data-info-list-heading]');
  const backBtn      = document.getElementById('back-to-exterior');
  const drilldownCta = document.querySelector('[data-drilldown-cta]');

  const infoPanel  = document.getElementById('column-info');
  const emptyEl    = infoPanel.querySelector('[data-info-empty]');
  const contentEl  = infoPanel.querySelector('[data-info-content]');
  const titleEl    = infoPanel.querySelector('[data-info-title]');
  const roleEl     = infoPanel.querySelector('[data-info-role]');
  const bodyEl     = infoPanel.querySelector('[data-info-body]');
  const progressEl = infoPanel.querySelector('[data-info-progress]');

  if (!flipEl || !listEl) {
    console.error('[column] required DOM nodes missing');
    return;
  }

  /* Human-readable face labels for the indicator + zoom heading. */
  function faceLabel(faceId) {
    switch (faceId) {
      case 'exterior':  return 'Exterior \u00b7 Lab View';
      case 'interior':  return 'Column Interior';
      case 'panel-l1':  return 'Control Panel L1';
      case 'panel-r1':  return 'Control Panel R1';
      default:          return (root.faces[faceId] && root.faces[faceId].title) || faceId;
    }
  }
  function listHeadingFor(faceId) {
    if (faceId === 'exterior') return 'EXTERNAL PARTS';
    if (faceId === 'interior') return 'INTERIOR';
    return 'CONTROLS';
  }

  /* Breadcrumb: top-level faces show a single segment; drill-downs show
     "Exterior › <panel>" with the first segment clickable to go back. */
  function renderBreadcrumb(faceId) {
    if (!breadcrumbEl) return;
    breadcrumbEl.innerHTML = '';

    function seg(label, onClick) {
      const el = document.createElement(onClick ? 'button' : 'span');
      el.className = 'breadcrumb__seg' + (onClick ? ' breadcrumb__seg--link' : ' breadcrumb__seg--current');
      el.textContent = label;
      if (onClick) {
        el.type = 'button';
        el.addEventListener('click', onClick);
      }
      breadcrumbEl.appendChild(el);
    }
    function sep() {
      const s = document.createElement('span');
      s.className = 'breadcrumb__sep';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = '\u203a';
      breadcrumbEl.appendChild(s);
    }

    if (drilldownFaces.indexOf(faceId) !== -1) {
      // Drill-down: Exterior (clickable) › <panel>
      seg('Exterior', () => exitDrilldown());
      sep();
      seg(faceLabel(faceId));
    } else {
      // Top-level face (exterior or interior)
      seg(faceLabel(faceId));
    }
  }

  /* --------------------------------------------------------------------- */
  /*  1. Build hotspots + pins for every face                              */
  /* --------------------------------------------------------------------- */
  function buildFace(faceId) {
    const face = root.faces[faceId];
    if (!face) return;

    const wrapEl  = document.querySelector(`[data-face-wrap="${faceId}"]`);
    const layerEl = document.querySelector(`[data-face-hotspots="${faceId}"]`);
    if (!wrapEl || !layerEl) return;
    hotspotLayerByFace[faceId] = layerEl;

    face.components.forEach((c) => {
      if (!c.hotspot) return;  // placeholder entries may have no hotspot

      const h = document.createElement('button');
      h.type = 'button';
      h.className = 'column-hotspot';
      if (c.drilldown) h.classList.add('column-hotspot--drilldown');
      if (c.subsystem) h.classList.add('subsystem--' + c.subsystem);
      h.dataset.componentId = c.id;
      h.dataset.face = faceId;
      h.setAttribute('aria-label', c.name + (c.drilldown ? ' (opens detailed view)' : ''));
      h.title = c.name + (c.drilldown ? ' — click to open detailed view' : '');
      h.style.left   = c.hotspot.x + '%';
      h.style.top    = c.hotspot.y + '%';
      h.style.width  = c.hotspot.w + '%';
      h.style.height = c.hotspot.h + '%';
      /* Drill-down affordance: a magnifier-plus glyph that fades in on hover. */
      if (c.drilldown) {
        h.innerHTML =
          '<span class="column-hotspot__expand" aria-hidden="true">' +
          '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7">' +
          '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14M7 5v4M5 7h4"/></svg></span>';
      }
      layerEl.appendChild(h);

      h.addEventListener('mouseenter', () => showComponent(c.id, faceId, { source: 'diagram' }));
      h.addEventListener('focus',      () => showComponent(c.id, faceId, { source: 'diagram' }));
      h.addEventListener('click',      () => {
        showComponent(c.id, faceId, { source: 'diagram' });
        if (c.drilldown) enterDrilldown(c.drilldown);
      });

      /* Primary pin */
      if (c.pin) {
        const p = makePin(c.id, c.pin, c.drilldown);
        layerEl.appendChild(p);
        pinByComponent[faceId][c.id] = p;
      }
      /* Extra pins (e.g. the two foot-switch pedals share one component) */
      if (Array.isArray(c.extraPins)) {
        c.extraPins.forEach((pt) => {
          const ep = makePin(c.id, pt, c.drilldown);
          ep.classList.add('column-pin--extra');
          layerEl.appendChild(ep);
        });
      }
    });

    wrapEl.addEventListener('mouseleave', () => {
      layerEl.querySelectorAll('.column-hotspot.is-active').forEach(el => el.classList.remove('is-active'));
      layerEl.querySelectorAll('.column-pin.is-active').forEach(el => el.classList.remove('is-active'));
    });
  }

  function makePin(componentId, pt, isDrill) {
    const p = document.createElement('div');
    p.className = 'column-pin' + (isDrill ? ' column-pin--drilldown' : '');
    p.dataset.componentId = componentId;
    p.style.left = pt.x + '%';
    p.style.top  = pt.y + '%';
    return p;
  }

  allFaceIds.forEach(buildFace);

  /* --------------------------------------------------------------------- */
  /*  2. Component list (right-hand panel) — rebuilt per face              */
  /* --------------------------------------------------------------------- */
  function rebuildListFor(faceId) {
    const face = root.faces[faceId];
    if (!face) return;

    listEl.innerHTML = '';
    listItemById[faceId] = {};

    face.components.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'component-list__item';
      if (c.drilldown) li.classList.add('component-list__item--drilldown');
      if (c.subsystem) li.classList.add('subsystem--' + c.subsystem);
      li.dataset.componentId = c.id;
      li.dataset.face = faceId;
      li.setAttribute('role', 'option');
      li.setAttribute('tabindex', '0');
      li.innerHTML =
        `<span class="component-list__num">${String(i + 1).padStart(2, '0')}</span>` +
        `<span class="component-list__name">${c.name}</span>` +
        (c.drilldown ? '<span class="component-list__chev" aria-hidden="true">\u203a</span>' : '');
      listEl.appendChild(li);
      listItemById[faceId][c.id] = li;

      li.addEventListener('mouseenter', () => showComponent(c.id, faceId, { source: 'list' }));
      li.addEventListener('focus',      () => showComponent(c.id, faceId, { source: 'list' }));
      li.addEventListener('click',      () => {
        showComponent(c.id, faceId, { source: 'list' });
        if (c.drilldown) enterDrilldown(c.drilldown);
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showComponent(c.id, faceId, { source: 'list' });
          if (c.drilldown) enterDrilldown(c.drilldown);
        }
      });
    });

    if (listHeading) listHeading.textContent = listHeadingFor(faceId);
    if (progressEl)  progressEl.textContent = String(face.components.length).padStart(2, '0');
  }

  /* --------------------------------------------------------------------- */
  /*  3. showComponent — single entry point used by every interaction      */
  /* --------------------------------------------------------------------- */
  function showComponent(id, faceId, opts) {
    opts = opts || {};
    const face = root.faces[faceId];
    if (!face) return;
    const c = face.components.find(x => x.id === id);
    if (!c) return;

    if (emptyEl)   emptyEl.hidden = true;
    if (contentEl) contentEl.hidden = false;
    infoPanel.classList.add('is-populated');

    titleEl.textContent = c.name;
    roleEl.textContent  = c.role;
    bodyEl.innerHTML    = c.body.map(p => `<p>${p}</p>`).join('');

    /* Drill-down CTA in the detail card */
    if (drilldownCta) {
      if (c.drilldown) {
        drilldownCta.hidden = false;
        drilldownCta.dataset.target = c.drilldown;
      } else {
        drilldownCta.hidden = true;
        drilldownCta.removeAttribute('data-target');
      }
    }

    const idx = face.components.findIndex(x => x.id === id) + 1;
    const total = face.components.length;
    if (progressEl) {
      progressEl.textContent = `${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }

    clearActiveInFace(faceId);

    const layer = hotspotLayerByFace[faceId];
    if (layer) {
      const hot = layer.querySelector(`.column-hotspot[data-component-id="${id}"]`);
      if (hot) hot.classList.add('is-active');
      /* activate ALL pins for this component (covers extraPins) */
      layer.querySelectorAll(`.column-pin[data-component-id="${id}"]`)
           .forEach(p => p.classList.add('is-active'));
    }
    if (listItemById[faceId] && listItemById[faceId][id]) {
      listItemById[faceId][id].classList.add('is-active');
    }

    if (opts.source === 'diagram' && listItemById[faceId] && listItemById[faceId][id]) {
      listItemById[faceId][id].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function clearActiveInFace(faceId) {
    const layer = hotspotLayerByFace[faceId];
    if (layer) {
      layer.querySelectorAll('.column-hotspot.is-active').forEach(el => el.classList.remove('is-active'));
      layer.querySelectorAll('.column-pin.is-active').forEach(el => el.classList.remove('is-active'));
    }
    listEl.querySelectorAll('.component-list__item.is-active').forEach(el => el.classList.remove('is-active'));
  }

  function clearDetail() {
    if (emptyEl)   emptyEl.hidden = false;
    if (contentEl) contentEl.hidden = true;
    if (drilldownCta) { drilldownCta.hidden = true; drilldownCta.removeAttribute('data-target'); }
    infoPanel.classList.remove('is-populated');
    if (progressEl) {
      const face = root.faces[currentFaceId];
      if (face) progressEl.textContent = String(face.components.length).padStart(2, '0');
    }
  }

  function replayIntro(faceId) {
    const layer = hotspotLayerByFace[faceId];
    if (!layer) return;
    layer.classList.remove('is-intro');
    void layer.offsetWidth;            // force reflow to restart animation
    layer.classList.add('is-intro');
    setTimeout(() => layer.classList.remove('is-intro'), 1700);
  }

  /* --------------------------------------------------------------------- */
  /*  4. Flip handling (exterior <-> interior)                             */
  /* --------------------------------------------------------------------- */
  function setFace(faceId, opts) {
    opts = opts || {};
    if (!root.faces[faceId]) return;
    /* Flip only operates on the flip pair. */
    if (faceId !== FLIP_FRONT && faceId !== FLIP_BACK) return;
    if (faceId === currentFaceId && !opts.force) return;

    /* Leaving a drill-down implicitly when flipping. */
    if (activeDrilldown) exitDrilldown({ silent: true });

    currentFaceId = faceId;
    const isBack = (faceId === FLIP_BACK);

    flipEl.classList.toggle('is-flipped', isBack);
    flipToggle.setAttribute('aria-pressed', String(isBack));
    if (flipLabel) {
      flipLabel.textContent = isBack ? 'Flip to see Exterior' : 'Flip to see Column Interior';
    }
    renderBreadcrumb(faceId);

    rebuildListFor(faceId);
    clearDetail();
    replayIntro(faceId);
  }

  if (flipToggle) {
    flipToggle.addEventListener('click', () => {
      setFace(currentFaceId === FLIP_FRONT ? FLIP_BACK : FLIP_FRONT);
    });
  }

  /* --------------------------------------------------------------------- */
  /*  4b. Drill-down handling (enter / exit a detail face)                 */
  /* --------------------------------------------------------------------- */
  function enterDrilldown(faceId) {
    if (drilldownFaces.indexOf(faceId) === -1) return;
    const detailEl = document.querySelector(`[data-detail-face="${faceId}"]`);
    if (!detailEl) return;

    /* Hide any other open detail face */
    document.querySelectorAll('.column-detail').forEach(el => {
      el.hidden = (el !== detailEl);
      el.classList.toggle('is-active', el === detailEl);
    });

    activeDrilldown = faceId;
    currentFaceId = faceId;

    /* Viewport mode flags */
    flipEl.classList.add('is-hidden-by-detail');
    document.getElementById('column-viewport').classList.add('is-drilldown');

    /* Controls: hide flip toggle, show back button */
    if (flipToggle) flipToggle.style.display = 'none';
    if (backBtn) backBtn.hidden = false;
    renderBreadcrumb(faceId);

    rebuildListFor(faceId);
    clearDetail();

    /* Auto-show the placeholder/first component's description for context */
    const face = root.faces[faceId];
    if (face && face.components.length) {
      showComponent(face.components[0].id, faceId, { source: 'list' });
    }
    replayIntro(faceId);
  }

  function exitDrilldown(opts) {
    opts = opts || {};
    document.querySelectorAll('.column-detail').forEach(el => {
      el.hidden = true;
      el.classList.remove('is-active');
    });
    activeDrilldown = null;
    currentFaceId = FLIP_FRONT;  // always return to exterior

    flipEl.classList.remove('is-hidden-by-detail');
    document.getElementById('column-viewport').classList.remove('is-drilldown');

    if (flipToggle) flipToggle.style.display = '';
    if (backBtn) backBtn.hidden = true;

    /* Make sure the flip card is showing the exterior front face. */
    flipEl.classList.remove('is-flipped');
    flipToggle.setAttribute('aria-pressed', 'false');
    if (flipLabel) flipLabel.textContent = 'Flip to see Column Interior';
    renderBreadcrumb(FLIP_FRONT);

    if (!opts.silent) {
      rebuildListFor(FLIP_FRONT);
      clearDetail();
      replayIntro(FLIP_FRONT);
    }
  }

  if (backBtn) backBtn.addEventListener('click', () => exitDrilldown());
  if (drilldownCta) {
    drilldownCta.addEventListener('click', () => {
      const target = drilldownCta.dataset.target;
      if (target) enterDrilldown(target);
    });
  }

  /* --------------------------------------------------------------------- */
  /*  Initial population: exterior face + intro pulse                      */
  /* --------------------------------------------------------------------- */
  rebuildListFor(currentFaceId);
  renderBreadcrumb(currentFaceId);
  if (flipLabel)   flipLabel.textContent = 'Flip to see Column Interior';

  function runInitialIntro() {
    replayIntro(currentFaceId);
  }
  const firstImage = document.querySelector(`[data-face-image="${currentFaceId}"]`);
  if (firstImage) {
    if (firstImage.complete) requestAnimationFrame(runInitialIntro);
    else firstImage.addEventListener('load', () => requestAnimationFrame(runInitialIntro), { once: true });
  }

  /* --------------------------------------------------------------------- */
  /*  5. Zoom modal — operates on whichever face is currently visible      */
  /* --------------------------------------------------------------------- */
  const modal     = document.getElementById('zoom-modal');
  const stage     = document.getElementById('zoom-stage');
  const zoomImg   = document.getElementById('zoom-image');
  const scaleLbl  = document.getElementById('zoom-scale');
  const zoomHead  = document.querySelector('[data-zoom-heading]');

  const openBtn   = document.getElementById('zoom-open-btn');
  const closeBtns = modal.querySelectorAll('[data-zoom-close]');
  const inBtn     = document.getElementById('zoom-in-btn');
  const outBtn    = document.getElementById('zoom-out-btn');
  const resetBtn  = document.getElementById('zoom-reset-btn');

  const MIN_SCALE   = 0.4;
  const MAX_SCALE   = 6;
  const ZOOM_STEP   = 1.2;
  const INITIAL_PCT = 1.0;

  let scale  = 1;
  let panX   = 0;
  let panY   = 0;
  let baseScale = 1;

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function applyTransform() {
    zoomImg.style.transform =
      `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${scale})`;
    if (scaleLbl) scaleLbl.textContent = Math.round((scale / baseScale) * 100) + '%';
  }

  function computeBaseScale() {
    const r = stage.getBoundingClientRect();
    if (!r.width || !r.height || !zoomImg.naturalWidth || !zoomImg.naturalHeight) return null;
    const pad = 24;
    const sx = (r.width  - pad * 2) / zoomImg.naturalWidth;
    const sy = (r.height - pad * 2) / zoomImg.naturalHeight;
    return Math.min(sx, sy);
  }

  function openAtInitial() {
    const b = computeBaseScale();
    if (b == null) { requestAnimationFrame(openAtInitial); return; }
    baseScale = b;
    scale = baseScale * INITIAL_PCT;
    panX = 0; panY = 0;
    applyTransform();
  }

  function configureZoomImageForCurrentFace() {
    const face = root.faces[currentFaceId];
    if (!face) return;
    zoomImg.src = face.image.src;
    if (zoomHead) zoomHead.textContent = 'TEM Column \u00b7 ' + faceLabel(currentFaceId);
  }

  function openZoom() {
    configureZoomImageForCurrentFace();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (zoomImg.complete && zoomImg.naturalWidth) {
      requestAnimationFrame(openAtInitial);
    } else {
      zoomImg.addEventListener('load', () => requestAnimationFrame(openAtInitial), { once: true });
    }
  }

  function closeZoom() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = stage.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width  / 2;
    const cy = e.clientY - r.top  - r.height / 2;
    const factor = Math.exp(-e.deltaY * 0.0015);
    const targetScale = clamp(scale * factor, baseScale * MIN_SCALE, baseScale * MAX_SCALE);
    const actualFactor = targetScale / scale;
    panX = cx - (cx - panX) * actualFactor;
    panY = cy - (cy - panY) * actualFactor;
    scale = targetScale;
    applyTransform();
  }, { passive: false });

  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;
  let panStartX  = 0, panStartY  = 0;

  stage.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX; dragStartY = e.clientY;
    panStartX  = panX;      panStartY  = panY;
    stage.classList.add('is-panning');
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = panStartX + (e.clientX - dragStartX);
    panY = panStartY + (e.clientY - dragStartY);
    applyTransform();
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-panning');
  });

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    isDragging = true;
    dragStartX = t.clientX; dragStartY = t.clientY;
    panStartX  = panX;      panStartY  = panY;
    stage.classList.add('is-panning');
  }, { passive: true });
  stage.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    panX = panStartX + (t.clientX - dragStartX);
    panY = panStartY + (t.clientY - dragStartY);
    applyTransform();
  }, { passive: true });
  stage.addEventListener('touchend', () => {
    isDragging = false;
    stage.classList.remove('is-panning');
  });

  function zoomByStep(factor) {
    scale = clamp(scale * factor, baseScale * MIN_SCALE, baseScale * MAX_SCALE);
    applyTransform();
  }

  if (inBtn)    inBtn   .addEventListener('click', () => zoomByStep(ZOOM_STEP));
  if (outBtn)   outBtn  .addEventListener('click', () => zoomByStep(1 / ZOOM_STEP));
  if (resetBtn) resetBtn.addEventListener('click', () => { openAtInitial(); });
  if (openBtn)  openBtn .addEventListener('click', openZoom);
  closeBtns.forEach(b => b.addEventListener('click', closeZoom));

  /* Keyboard */
  window.addEventListener('keydown', (e) => {
    if (modal.hidden) {
      /* Esc backs out of a drill-down when no modal is open */
      if (e.key === 'Escape' && activeDrilldown) { exitDrilldown(); return; }
      /* 'F' toggles the flip card (only when not in a drill-down) */
      if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (activeDrilldown) return;
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          setFace(currentFaceId === FLIP_FRONT ? FLIP_BACK : FLIP_FRONT);
        }
      }
      return;
    }
    if (e.key === 'Escape')                  { closeZoom(); }
    else if (e.key === '+' || e.key === '=') { zoomByStep(ZOOM_STEP); }
    else if (e.key === '-' || e.key === '_') { zoomByStep(1 / ZOOM_STEP); }
    else if (e.key === '0')                  { openAtInitial(); }
  });

  window.addEventListener('resize', () => {
    if (modal.hidden) return;
    if (Math.abs(scale - baseScale * INITIAL_PCT) < 0.01) openAtInitial();
  });

  /* Expose for debug / tests */
  window.TEM = window.TEM || {};
  window.TEM.column = {
    showComponent,
    openZoom,
    closeZoom,
    setFace,
    enterDrilldown,
    exitDrilldown,
    get currentFace() { return currentFaceId; },
    get activeDrilldown() { return activeDrilldown; }
  };
})();
