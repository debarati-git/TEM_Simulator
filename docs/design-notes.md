# Design Notes

This document captures the architectural decisions made during the design
phase, so future contributors (including you, six months from now) can
understand *why* the code looks the way it does.

## Aesthetic direction

**Refined industrial / instrument-panel.** The TEM is a serious scientific
instrument, and the UI should evoke that. We chose:

- Dark UI (electron-microscope control rooms are dark)
- Monospace fonts for labels and readouts (engineering register)
- One signal accent colour — electron-beam cyan `#4dd0e1` — used sparingly to
  draw the eye to the active control or current step
- Crosshair corner decorations on important surfaces
- Generous whitespace, restrained ornament

What we explicitly avoided: purple gradients, glassmorphism, soft drop shadows,
Inter / Roboto, "AI-default" aesthetics.

## Three modules, three pages

The original brief specified three navigations: Column, Microscope, Diffraction.
Each lives in its own HTML file under `/pages/` with its own CSS stylesheet
under `/assets/css/`, all sharing `global.css` for design tokens.

## Global module navigation

The persistent top nav on every page (injected by `global.js`) hosts all three
module links so the user can jump between modules from anywhere. Pages declare
their module association with a `data-module` attribute on the topnav slot:

```html
<div data-topnav data-module="column"></div>        <!-- on column.html -->
<div data-topnav data-module="microscope"></div>    <!-- on microscope.html and microscope-guided.html -->
<div data-topnav data-module="diffraction"></div>   <!-- on diffraction-lab.html -->
<div data-topnav data-landing="true"></div>         <!-- on index.html, no module highlighted -->
```

The matching nav link is highlighted with the signal colour. Sub-pages
(like `microscope-guided.html`) belong to their parent module's group, so
the parent stays highlighted while the user is inside a sub-flow.

The landing page (`index.html`) intentionally has no module highlighted —
the three feature cards in the body serve as a richer first-time entry
point, while the top nav becomes a quick switcher for repeat visits.

## The simulator's three zones

Inside `microscope-guided.html` the body is a `grid-template-columns: 320px 1fr 380px`:

- **Left (320px)**: Column diagram with interactive hotspots
- **Centre (flex)**: Instruction panel + circular viewing screen
- **Right (380px)**: Control panel with every control present in DOM from
  the start

Reason for putting all controls in DOM at load time: it makes the unlock
logic trivial (just toggle a `.is-active` class on each `.control` wrapper)
and avoids any layout jumps as the user progresses.

## Guided-mode interaction model

**Strict guided mode**: at any moment, exactly one control is interactive.
All other controls have `opacity: 0.35; pointer-events: none`. When the
user satisfies the current step's success condition, the next step's
control becomes active and the previous one re-locks.

**Tolerance for continuous controls**: sweet-spot ranges. Each step that
involves a slider or joypad has an invisible `[min, max]` window defined in
`/data/guided-config.json`. Step auto-completes when the value enters the
window.

**Wrong-action feedback**: after ~3 seconds at a wrong value, an inline
hint appears under the instruction text in warm amber. Hint clears as
soon as the value changes again. Non-blocking, friendly tone.

**Navigation**: forward-only. A persistent Restart button (top right of
the screen zone) resets state to initial and returns to step 1. No back,
no skip — matches the MyScope reference and is pedagogically simpler.

## State management

A single state object (in `state.js`) holds everything. Every control
mutates state through a setter; every visual subscribes to state changes
and renders. No business logic in renderers; no state in DOM. This keeps
debugging predictable.

Initial state shape is documented in `state.js` itself.

## Viewing screen rendering

The phosphor screen (`#view-screen`) reflects state:

- Before step 6: black, "SCREEN OFFLINE"
- Step 6+ with no aperture: a circular beam spot, position offset by
  `beamShift`, size and brightness modulated by `brightness`
- Aperture inserted with bad alignment: beam clipped
- Imaging mode with magnification set: pre-rendered sample image swapped in
- Focus off: CSS `filter: blur(Npx)` where N is distance from sweet-spot
- Wobbler on: small CSS keyframe translation tied to `abs(stageZ)`

Renderer is pure — state in, DOM updates out.

## Image library

For each sample type we store 3 magnification levels (`-low`, `-medium`,
`-high`). The renderer picks the matching image and applies CSS filters for
in-between states. This is enormously simpler than real optics simulation and
visually convincing enough for teaching.

Image paths live in `guided-config.json` so they can be swapped without
touching code.

## Data files

- `/data/guided-steps.json` — the 29 steps. Schema documented in the file's
  `_schema` key.
- `/data/guided-config.json` — tunable values: sweet-spot ranges, hint
  timing, image paths. Edit freely without touching code.
- `/data/components.json` — TEM component descriptions for the Column page.
- `/data/crystal-systems.json` — lattice parameters for the Diffraction Lab.

Separating step definitions from tuning values means a domain expert can
adjust tolerances without reading code, and the step list itself stays
pedagogical and stable.

## Phase 1 deliverables

- All 4 HTML pages exist and navigate to each other
- Shared CSS design tokens defined in `global.css`
- Persistent top navigation injected by `global.js`
- Guided simulator three-zone layout fully laid out with every control
  rendered (all disabled)
- All JS module stubs in place with documented Phase-2/3/4 responsibilities
- All JSON data files in place with documented schemas

## Phase 2 — Guided simulator logic (next)

Build order (each step independently runnable and visually verifiable):

1. `state.js` — implement pub/sub store
2. `controls.js` — wire every control to state mutations
3. `guided-steps.json` — fill in all 29 steps
4. `guided-controller.js` — lock/unlock orchestration, success-watching
5. `tolerance.js` + `feedback.js` — sweet-spot eval + hint timer
6. `image-renderer.js` — viewing screen reactivity
7. `diagram.js` — column hit zones + active highlighting
8. `acquire.js` — canvas snapshot + PNG download
9. Polish pass — transitions, micro-animations, restart flow
