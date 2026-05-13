/* =========================================================================
   The Column — Anatomy module
   - Renders hotspots over the annotated diagram + a component list on the right
   - Hovering / clicking either the diagram label OR the list item inspects it
   - Zoom modal opens at 135 % with cursor-anchored wheel zoom + click-drag pan
   ========================================================================= */

(function () {
  'use strict';

  const data = window.TEM && window.TEM.dataColumnComponents;
  if (!data) {
    console.error('[column] components data not loaded');
    return;
  }

  /* ----------------------- 1. Build hotspots, pins, and list ------------- */

  const wrap     = document.getElementById('column-image-wrap');
  const hotLayer = document.getElementById('column-hotspots');
  const image    = document.getElementById('column-image');
  const listEl   = document.getElementById('component-list');

  if (!wrap || !hotLayer || !image || !listEl) return;

  const pinByComponent = {};
  const listItemById   = {};

  data.components.forEach((c, i) => {
    /* --- diagram hotspot button --- */
    const h = document.createElement('button');
    h.type = 'button';
    h.className = 'column-hotspot';
    h.dataset.componentId = c.id;
    h.setAttribute('aria-label', c.name);
    h.title = c.name;
    h.style.left   = c.hotspot.x + '%';
    h.style.top    = c.hotspot.y + '%';
    h.style.width  = c.hotspot.w + '%';
    h.style.height = c.hotspot.h + '%';
    hotLayer.appendChild(h);

    /* --- pin on the actual element --- */
    if (c.pin) {
      const p = document.createElement('div');
      p.className = 'column-pin';
      p.dataset.componentId = c.id;
      p.style.left = c.pin.x + '%';
      p.style.top  = c.pin.y + '%';
      hotLayer.appendChild(p);
      pinByComponent[c.id] = p;
    }

    /* --- reference list item --- */
    const li = document.createElement('li');
    li.className = 'component-list__item';
    li.dataset.componentId = c.id;
    li.setAttribute('role', 'option');
    li.setAttribute('tabindex', '0');
    li.innerHTML = `
      <span class="component-list__num">${String(i + 1).padStart(2, '0')}</span>
      <span class="component-list__name">${c.name}</span>
    `;
    listEl.appendChild(li);
    listItemById[c.id] = li;
  });

  /* On first load, briefly pulse every hotspot to advertise interactivity. */
  function runIntro() {
    hotLayer.classList.add('is-intro');
    setTimeout(() => hotLayer.classList.remove('is-intro'), 1700);
  }
  if (image.complete) {
    requestAnimationFrame(runIntro);
  } else {
    image.addEventListener('load', () => requestAnimationFrame(runIntro), { once: true });
  }

  /* ----------------------- 2. Info panel population ----------------------- */

  const infoPanel  = document.getElementById('column-info');
  const emptyEl    = infoPanel.querySelector('[data-info-empty]');
  const contentEl  = infoPanel.querySelector('[data-info-content]');
  const titleEl    = infoPanel.querySelector('[data-info-title]');
  const roleEl     = infoPanel.querySelector('[data-info-role]');
  const bodyEl     = infoPanel.querySelector('[data-info-body]');
  const progressEl = infoPanel.querySelector('[data-info-progress]');

  /* Initial progress label = total count (until first inspection) */
  if (progressEl) progressEl.textContent = String(data.components.length).padStart(2, '0');

  const componentIndexById = {};
  data.components.forEach((c, i) => { componentIndexById[c.id] = i; });

  function clearActive() {
    hotLayer.querySelectorAll('.column-hotspot.is-active').forEach(el => el.classList.remove('is-active'));
    hotLayer.querySelectorAll('.column-pin.is-active').forEach(el => el.classList.remove('is-active'));
    listEl.querySelectorAll('.component-list__item.is-active').forEach(el => el.classList.remove('is-active'));
  }

  function showComponent(id, opts) {
    opts = opts || {};
    const c = data.components.find(x => x.id === id);
    if (!c) return;

    if (emptyEl)   emptyEl.hidden = true;
    if (contentEl) contentEl.hidden = false;
    infoPanel.classList.add('is-populated');

    titleEl.textContent = c.name;
    roleEl.textContent  = c.role;
    bodyEl.innerHTML    = c.body.map(p => `<p>${p}</p>`).join('');

    const idx = componentIndexById[id] + 1;
    const total = data.components.length;
    if (progressEl) {
      progressEl.textContent = `${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }

    clearActive();
    const hot = hotLayer.querySelector(`.column-hotspot[data-component-id="${id}"]`);
    if (hot) hot.classList.add('is-active');
    if (pinByComponent[id]) pinByComponent[id].classList.add('is-active');
    if (listItemById[id])   listItemById[id].classList.add('is-active');

    /* If the call came from the diagram, scroll the list to the active item */
    if (opts.source === 'diagram' && listItemById[id]) {
      listItemById[id].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /* Diagram hotspot hover / focus / click */
  hotLayer.querySelectorAll('.column-hotspot').forEach(btn => {
    const id = btn.dataset.componentId;
    btn.addEventListener('mouseenter', () => showComponent(id, { source: 'diagram' }));
    btn.addEventListener('focus',      () => showComponent(id, { source: 'diagram' }));
    btn.addEventListener('click',      () => showComponent(id, { source: 'diagram' }));
  });

  /* Reference list — hover or click selects the component */
  listEl.querySelectorAll('.component-list__item').forEach(li => {
    const id = li.dataset.componentId;
    li.addEventListener('mouseenter', () => showComponent(id, { source: 'list' }));
    li.addEventListener('focus',      () => showComponent(id, { source: 'list' }));
    li.addEventListener('click',      () => showComponent(id, { source: 'list' }));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showComponent(id, { source: 'list' });
      }
    });
  });

  /* When the cursor leaves the entire image region, drop the pin pulse on the
     diagram (keeps the detail card populated, but stops the diagram from
     looking like it's still indicating something).                            */
  wrap.addEventListener('mouseleave', () => {
    hotLayer.querySelectorAll('.column-hotspot.is-active').forEach(el => el.classList.remove('is-active'));
    hotLayer.querySelectorAll('.column-pin.is-active').forEach(el => el.classList.remove('is-active'));
  });

  /* ----------------------- 3. Zoom modal ---------------------------------- */

  const modal     = document.getElementById('zoom-modal');
  const stage     = document.getElementById('zoom-stage');
  const zoomImg   = document.getElementById('zoom-image');
  const scaleLbl  = document.getElementById('zoom-scale');

  const openBtn   = document.getElementById('zoom-open-btn');
  const closeBtns = modal.querySelectorAll('[data-zoom-close]');
  const inBtn     = document.getElementById('zoom-in-btn');
  const outBtn    = document.getElementById('zoom-out-btn');
  const resetBtn  = document.getElementById('zoom-reset-btn');

  const MIN_SCALE   = 0.4;     // 40% of fit
  const MAX_SCALE   = 6;       // 600% of fit
  const ZOOM_STEP   = 1.2;     // for button clicks
  const INITIAL_PCT = 1.16;    // load at 116%

  let scale  = 1;
  let panX   = 0;
  let panY   = 0;
  let baseScale = 1;          // the scale at which the image fits the stage; defines "100%"

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function applyTransform() {
    zoomImg.style.transform =
      `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${scale})`;
    if (scaleLbl) {
      scaleLbl.textContent = Math.round((scale / baseScale) * 100) + '%';
    }
  }

  function computeBaseScale() {
    const r = stage.getBoundingClientRect();
    if (!r.width || !r.height || !zoomImg.naturalWidth || !zoomImg.naturalHeight) {
      return null;
    }
    const pad = 24;
    const sx = (r.width  - pad * 2) / zoomImg.naturalWidth;
    const sy = (r.height - pad * 2) / zoomImg.naturalHeight;
    return Math.min(sx, sy);
  }

  function fitToStage() {
    const b = computeBaseScale();
    if (b == null) { requestAnimationFrame(fitToStage); return; }
    baseScale = b;
    scale  = baseScale;
    panX   = 0;
    panY   = 0;
    applyTransform();
  }

  /* Open the modal at INITIAL_PCT of the fit-to-stage size */
  function openAtInitial() {
    const b = computeBaseScale();
    if (b == null) { requestAnimationFrame(openAtInitial); return; }
    baseScale = b;
    scale = baseScale * INITIAL_PCT;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function openZoom() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(openAtInitial);
  }

  function closeZoom() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  /* ---- Mouse wheel zoom — anchored to cursor position ---- */
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

  /* ---- Click-drag panning ---- */
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;
  let panStartX  = 0, panStartY  = 0;

  stage.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    panStartX  = panX;
    panStartY  = panY;
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

  /* Touch — single-finger pan */
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    isDragging = true;
    dragStartX = t.clientX;
    dragStartY = t.clientY;
    panStartX  = panX;
    panStartY  = panY;
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

  /* ---- Buttons ---- */
  function zoomByStep(factor) {
    const target = clamp(scale * factor, baseScale * MIN_SCALE, baseScale * MAX_SCALE);
    scale = target;
    applyTransform();
  }

  if (inBtn)    inBtn   .addEventListener('click', () => zoomByStep(ZOOM_STEP));
  if (outBtn)   outBtn  .addEventListener('click', () => zoomByStep(1 / ZOOM_STEP));
  if (resetBtn) resetBtn.addEventListener('click', () => { openAtInitial(); });  /* reset = back to 135% */
  if (openBtn)  openBtn .addEventListener('click', openZoom);
  closeBtns.forEach(b => b.addEventListener('click', closeZoom));

  /* ---- Keyboard ---- */
  window.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape')                  { closeZoom(); }
    else if (e.key === '+' || e.key === '=') { zoomByStep(ZOOM_STEP); }
    else if (e.key === '-' || e.key === '_') { zoomByStep(1 / ZOOM_STEP); }
    else if (e.key === '0')                  { openAtInitial(); }
  });

  /* Re-fit on resize while modal is open and close to initial scale */
  window.addEventListener('resize', () => {
    if (modal.hidden) return;
    /* Only auto-refit if user hasn't pinch-zoomed away from the initial */
    if (Math.abs(scale - baseScale * INITIAL_PCT) < 0.01) openAtInitial();
  });

  if (!zoomImg.complete) {
    zoomImg.addEventListener('load', () => {
      if (!modal.hidden) openAtInitial();
    });
  }

  /* Expose for debug / tests */
  window.TEM = window.TEM || {};
  window.TEM.column = {
    showComponent,
    openZoom,
    closeZoom,
  };
})();
