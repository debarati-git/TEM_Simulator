# TEM Simulator — IIT Learning Module

A web-based simulator for the Transmission Electron Microscope, built so that IIT
students can familiarise themselves with TEM operation before using real
hardware. Pure HTML / CSS / JS — no frameworks, no build step.

## Modules

1. **The Column** — an annotated cross-section of the TEM. Hover over components
   to learn what each one does.
2. **The Microscope** — the simulator itself. Two modes:
   - **Guided** — a step-by-step walkthrough of TEM startup, alignment, and
     image acquisition. Controls unlock one at a time.
   - **Experiment** — free practice (coming soon).
3. **The Diffraction Lab** — switch between crystal systems and observe the
   reciprocal-space patterns they produce.

## Project layout

```
tem-simulator/
├── index.html             — landing page
├── pages/                 — per-module pages
├── assets/                — css, js, images, icons, fonts
├── data/                  — JSON configs (step definitions, lattice data, etc.)
└── docs/                  — design notes
```

## Running locally

Open `index.html` directly in a modern browser. No server required for the
landing page. For pages that fetch JSON (Phases 2–4), serve the folder with
any static file server:

```
# Python 3
python3 -m http.server 8000

# Node
npx serve

# VS Code
Use the "Live Server" extension
```

Then visit `http://localhost:8000`.

## Build status

| Phase | Scope                          | Status      |
|-------|--------------------------------|-------------|
| 1     | Scaffolding — all pages exist  | ✅ Done      |
| 2     | Guided simulator logic         | Next        |
| 3     | Column page interactivity      | Pending     |
| 4     | Diffraction lab renderer       | Pending     |

## Design system

- **Aesthetic**: refined industrial / instrument-panel — dark UI, monospace
  accents, electron-beam cyan as the single signal colour.
- **Type**: IBM Plex Serif (display) · IBM Plex Sans (body) · IBM Plex Mono
  (labels & readouts).
- **Spacing**: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px scale, via CSS
  variables in `global.css`.

See `docs/design-notes.md` for architectural decisions.
