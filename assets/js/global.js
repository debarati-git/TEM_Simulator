/* =========================================================================
   TEM Simulator — Global JS
   Shared utilities used across all pages.
   ========================================================================= */

(function () {
  'use strict';

  /**
   * Mobile guard — TEM simulator needs real estate, so we show a warning
   * on narrow viewports. Doesn't block, just informs.
   */
  function injectMobileGuard() {
    if (document.querySelector('.mobile-guard')) return;
    const el = document.createElement('div');
    el.className = 'mobile-guard';
    el.innerHTML = `
      <div class="mobile-guard__title">Larger screen recommended</div>
      <p class="mobile-guard__text">
        The TEM simulator is designed for a desktop or laptop display.
        Please switch to a larger screen for the best experience.
      </p>
    `;
    document.body.appendChild(el);
  }

  /**
   * Module definitions used to build the global top navigation.
   * "key" is matched against the [data-module] attribute on each page's
   * topnav slot so we know which entry to highlight.
   */
  const MODULES = [
    { key: 'column',      num: '01', label: 'The Column',     href: 'pages/column.html' },
    { key: 'microscope',  num: '02', label: 'The Microscope', href: 'pages/microscope.html' },
    { key: 'diffraction', num: '03', label: 'Diffraction Lab',href: 'pages/diffraction-lab.html' },
  ];

  /**
   * Build the persistent top navigation. Three module links are shown on
   * every page; the active one is highlighted. The brand logo always
   * returns to the landing page.
   *
   * Usage in page HTML:
   *   <div data-topnav data-module="column"></div>
   *   <div data-topnav data-landing="true"></div>   <!-- index.html only -->
   */
  function injectTopNav() {
    const slot = document.querySelector('[data-topnav]');
    if (!slot) return;

    const activeModule = slot.dataset.module || '';
    const isLanding    = slot.dataset.landing === 'true';
    // From sub-pages (pages/*.html) we need to back out one level
    const root         = isLanding ? '' : '../';

    const moduleLinks = MODULES.map(m => {
      const isActive = m.key === activeModule;
      const href     = root + m.href;
      return `
        <a href="${href}"
           class="topnav__module${isActive ? ' is-active' : ''}"
           ${isActive ? 'aria-current="page"' : ''}>
          <span class="topnav__module-num">${m.num}</span>
          <span class="topnav__module-label">${m.label}</span>
        </a>
      `;
    }).join('');

    slot.outerHTML = `
      <nav class="topnav">
        <a href="${root || '#'}${root ? 'index.html' : ''}" class="topnav__brand">
          <span class="topnav__brand-mark" aria-hidden="true"></span>
          <span class="topnav__brand-text">
            <span class="topnav__brand-title">TEM Simulator</span>
            <span class="topnav__brand-sub">IIT · Learning Module</span>
          </span>
        </a>

        <div class="topnav__modules" role="navigation" aria-label="Modules">
          ${moduleLinks}
        </div>

        <div class="topnav__right">
          ${!isLanding ? `
            <a href="${root}index.html" class="topnav__home" title="Return to home">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path d="M2 7l6-5 6 5v7a1 1 0 0 1-1 1h-3v-5H6v5H3a1 1 0 0 1-1-1V7z"/>
              </svg>
              Home
            </a>
          ` : ''}
          <div class="topnav__status">
            <span class="topnav__status-dot" aria-hidden="true"></span>
            <span>READY</span>
          </div>
        </div>
      </nav>
    `;
  }

  /* Expose a tiny namespace for other modules to extend */
  window.TEM = window.TEM || {};
  window.TEM.global = {
    injectMobileGuard,
    injectTopNav,
  };

  /* Auto-init on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectTopNav();
      injectMobileGuard();
    });
  } else {
    injectTopNav();
    injectMobileGuard();
  }
})();
