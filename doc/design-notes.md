# Design Notes

This document captures the architectural decisions made during the design
phase, so future contributors (including you, six months from now) can
understand *why* the code looks the way it does.

---

## Implementation status (v1.0)

This is the original design document. A few specifics have evolved since
it was written; the original text is preserved below for design rationale,
and the current values are recorded here so readers don't have to
reconcile them mentally.

| Topic                                | Original design               | As shipped in v1.0                   |
| ------------------------------------ | ----------------------------- | ------------------------------------ |
| Guided step count                    | 29                            | **32**                                |
| Three-zone grid template (guided)    | `320px 1fr 380px`             | **`280px 1fr 280px`**                 |
| Signal accent colour                 | `#4dd0e1`                     | **`#0284C7`** (sky-600, for contrast) |
| Wrong-action hint                    | Inline amber after ~3 seconds | **Removed** — too noisy in practice   |
| Phase 2 status                       | "Next"                        | **Complete** in this release          |
| Strict guided model                  | One control active at a time  | **Mostly** — beam-current is a sticky-unlock; once unlocked, stays clickable |
| Restart navigation                   | Restart only                  | **Restart + Undo Step** — undo resets just the current step |

The rest of the document below reflects the original design intent, which
is still load-bearing for the v1.0 build's structure.

---

## Aesthetic direction

**Refined industrial / instrument-panel.** The TEM is a serious scientific
instrument, and the UI should evoke that. We chose:

- Dark UI (electron-microscope control rooms are dark)
- Monospace fonts for labels and readouts (engineering register)
- One signal accent colour — electron-beam cyan — used sparingly to
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

Inside `microscope-guided.html` the body is a CSS grid with three columns:

- **Left rail**: Column diagram with interactive hotspots, plus gun /
  vacuum / beam / aperture controls
- **Centre viewer**: Instruction panel + circular viewing screen + diagram
- **Right rail**: Stage, imaging mode, magnification, lens, focus, camera
  controls — every control present in DOM from the start

Reason for putting all controls in DOM at load time: it makes the unlock
logic trivial (just toggle a `.is-active` class on each `.control` wrapper)
and avoids any layout jumps as the user progresses.

## Guided-mode interaction model

**Guided mode**: at any moment, the step controller unlocks a small set of
controls — usually just one, sometimes two or three for parallel adjustments
(e.g., trackpad + adjacent knob). Other controls are dimmed (`opacity: 0.35;
pointer-events: none`). When the user satisfies the current step's success
condition, the next step's controls become active and the previous ones
re-lock — except for sticky-unlocks (currently just `beam-current`), which
stay clickable once unlocked.

**Tolerance for continuous controls**: sweet-spot ranges. Each step that
involves a slider, knob, or trackpad has an `[min, max]` window defined
declaratively. Step auto-completes when the value enters the window.

**Navigation**: forward-only. A persistent **Restart** button (top of the
context bar) resets state to initial and returns to step 1. **Undo Step**
sits next to it and resets only the current step's state keys, re-running
its prelude. No back, no skip — matches the MyScope reference and is
pedagogically simpler.

## State management

A single state object (in `state.js`) holds everything. Every control
mutates state through a setter; every visual subscribes to state changes
and renders. No business logic in renderers; no state in DOM. This keeps
debugging predictable.

Initial state shape is documented in `state.js` itself.

## Viewing screen rendering

The phosphor screen reflects state:

- Before beam-on: black, "SCREEN OFFLINE"
- Beam on with no aperture: a circular beam spot, position offset by
  `beamShift`, size and brightness modulated by `brightness`
- Aperture inserted with bad alignment: beam clipped
- Imaging mode with magnification set: pre-rendered sample image swapped in
- Focus off: CSS `filter: blur(Npx)` where N is distance from sweet-spot
- Wobbler on: small CSS keyframe translation tied to `abs(stageZ)`

Renderer is pure — state in, DOM updates out.

## Image library

For each sample type we plan 3 magnification levels (`-low`, `-medium`,
`-high`). The v1.0 implementation CSS-scales a single image to fake all four
magnification levels, which is serviceable but a per-level set per sample
gives much better fidelity. See `image-assets.md` for the full catalogue.

The renderer picks the matching image (when present) and applies CSS filters
for in-between states. This is enormously simpler than real optics simulation
and visually convincing enough for teaching.

Image paths live in the step data so they can be swapped without touching
the controller code.

## Data files

- `/data/guided-data.js` — the 32 steps. The LIVE source (embedded as a
  JavaScript global for `file://` compatibility).
- `/data/guided-steps.json` and `/data/guided-config.json` — canonical
  JSON mirrors of the step data and tuning values.
- `/data/components.json` — TEM component descriptions for the Column page.
- `/data/crystal-systems.json` — lattice parameters for the Diffraction Lab.

Separating step definitions from tuning values means a domain expert can
adjust tolerances without reading code, and the step list itself stays
pedagogical and stable.

## Phase 1 deliverables (delivered)

- All 4 HTML pages exist and navigate to each other
- Shared CSS design tokens defined in `global.css`
- Persistent top navigation injected by `global.js`
- Guided simulator three-zone layout fully laid out with every control
  rendered (all disabled until unlocked)
- All JS module stubs in place with documented Phase-2/3/4 responsibilities
- All JSON data files in place with documented schemas

## Phase 2 — Guided simulator logic (delivered in v1.0)

Original build order, retained here for historical reference:

1. `state.js` — pub/sub store
2. `controls.js` — wire every control to state mutations
3. `guided-steps.json` (+ `guided-data.js`) — the step list
4. `guided-controller.js` — lock/unlock orchestration, success-watching
5. `tolerance.js` + `feedback.js` — sweet-spot eval + hint timer
6. `image-renderer.js` — viewing screen reactivity
7. `diagram.js` — column hit zones + active highlighting
8. `acquire.js` — canvas snapshot + PNG download
9. Polish pass — transitions, micro-animations, restart flow

All nine of these shipped in v1.0. See `ARCHITECTURE.md` for current
file-by-file responsibilities and `CHANGELOG.md` for the full feature list.
