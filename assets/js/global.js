/* =========================================================================
   TEM Simulator — Global JS
   Shared utilities used across all pages.
   ========================================================================= */

(function () {
  'use strict';

  /* -------- Theme: apply saved preference IMMEDIATELY (before any render) -------- */
  try {
    const saved = localStorage.getItem('tem-theme');
    const theme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  /** Toggle between light and dark. Persists preference. */
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('tem-theme', next); } catch (e) { /* private mode */ }
  }

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
          <button type="button" class="topnav__theme-toggle" id="theme-toggle" title="Toggle light / dark theme" aria-label="Toggle theme">
            <svg class="topnav__theme-icon-sun" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <circle cx="8" cy="8" r="3"/>
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3"/>
            </svg>
            <svg class="topnav__theme-icon-moon" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z"/>
            </svg>
          </button>
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
    toggleTheme,
  };

  /** After topnav injects, attach the theme toggle handler. */
  function attachThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  }

  /* Auto-init on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectTopNav();
      injectMobileGuard();
      attachThemeToggle();
    });
  } else {
    injectTopNav();
    injectMobileGuard();
    attachThemeToggle();
  }
})();
