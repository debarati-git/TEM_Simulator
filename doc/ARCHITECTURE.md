# Architecture

A reference for anyone modifying, extending, or auditing the simulator. Read
this before adding a new sample, a new step, a new crystal, or a new module.

## High-Level Principles

1. **No build step.** Pure HTML/CSS/JS. Open `index.html` in a browser and it
   runs. This is non-negotiable for the educational deployment model.
2. **`file://` compatible.** No `fetch()`, no module imports, no servers
   needed. Data files are embedded as JavaScript globals
   (`window.TEM.guidedData`, etc.) so they load via plain `<script>` tags.
3. **Pub/sub state.** A single in-memory state store per module, with
   subscribe/get/set. Renderers and feedback systems are pure functions of
   state → DOM.
4. **Tolerance-driven progression.** Steps advance when state enters a defined
   "sweet spot" range, not on exact equality. Tolerances are declarative.
5. **Design tokens via CSS variables.** Light is the default theme; dark
   overrides scoped to `:root[data-theme="dark"]`. Token values live in
   `assets/css/global.css`.

## Module 02 — Guided Session Architecture

The most complex module. Five layers, top to bottom:

```
┌─────────────────────────────────────────────────────────────┐
│  guided-controller.js                                       │
│  Step runner. Reads guided-data.js, listens to state,       │
│  evaluates success conditions via tolerance.js,             │
│  advances steps with a 150ms debounce.                      │
├─────────────────────────────────────────────────────────────┤
│  controls.js + controls-ui.js                               │
│  Input handlers. Buttons, knobs, trackpads, rockers wire    │
│  their drag/click events through these into state mutations.│
├─────────────────────────────────────────────────────────────┤
│  state.js                                                   │
│  The pub/sub store. Single source of truth. Every other     │
│  layer either pushes into it or pulls from it.              │
├─────────────────────────────────────────────────────────────┤
│  image-renderer.js + diagram.js + acquire.js                │
│  Pure state → DOM consumers. Map state values to viewer     │
│  visuals: beam glow, focus blur, wobbler oscillation,       │
│  diffraction overlay, etc.                                  │
├─────────────────────────────────────────────────────────────┤
│  tolerance.js + feedback.js                                 │
│  Tolerance evaluator (reads "sweet spot" predicates from    │
│  config) and feedback layer (hints, flashes, audio cues).   │
└─────────────────────────────────────────────────────────────┘
```

### State Shape

Defined in `assets/js/guided/state.js`. Key fields:

```js
{
  sample: null,                    // 'nanoparticles' | …
  // Column / vacuum
  holderRemoved, specimenInserted{Diagram|Panel}, airlockPumped,
  // Beam
  accVoltage, beamOn, beamCurrent, brightness,
  beamShift: {x, y}, stigmator: {x, y},
  // Apertures
  currentAperture, condenserInserted, objectiveInserted,
  condenserSize, objectiveSize, apertureAlignment: {x, y},
  // Stage
  stageX, stageY, stageZ,
  // Imaging
  wobblerOn, magnification, mode,
  imagingMode, stemImaging, stemScan,
  // Lenses
  currentLens, projectorAlignment: {x, y}, objFocus, fftOn,
  // Acquisition
  cameraInserted, acquired
}
```

State mutations go through `TEM.state.set('keyName', value)`. Subscribers fire
synchronously.

### Step Definition Shape

In `data/guided-data.js`, each step is:

```js
{
  id: 8,
  instruction: 'Centre the beam using the Beam Shift trackpad.',
  hint: 'Drag the dot toward the centre.',           // hidden in v1.0 UI
  unlocks: ['beam-shift', 'beam-current'],           // controls to activate
  prelude: {                                          // optional setup
    offsets: [
      { offset: 'beamShift',  amount: { x: -22, y: 18 } },
      { offset: 'stigmator',  amount: { x: 32,  y: 38 } },
    ]
  },
  success: { type: 'valueInRange', key: 'beamShift', spot: 'beamShift_center' },
  switchViewer: 'beam',                              // optional
  diagramHotspot: 'insert-condenser',                // optional
  roiTarget: { x: 0.3, y: 0.45 },                    // optional
  autoAdvance: false                                 // optional, skip race
}
```

### Success Condition Types

- `selectValue` — state[key] === value
- `selectAny`   — state[key] is truthy
- `valueInRange` — state[key] passes the named tolerance predicate

### Sweet Spot Definitions (DO NOT CHANGE without verifying every step)

```
beamShift_center:    abs(x) ≤ 8  && abs(y) ≤ 8
brightness_diverge:  v ≥ 65      && v ≤ 80
apertureAlign_*:     abs(x) ≤ 8  && abs(y) ≤ 8
stigmator_circular:  abs(x) ≤ 8  && abs(y) ≤ 8
stageZ_eucentric:    abs(v) ≤ 5
stageXY_lowMag:      abs(x - 35) ≤ 12 && abs(y - 25) ≤ 12
stageXY_medMag:      abs(x - 35) ≤ 6  && abs(y - 25) ≤ 6
stageXY_highMag:     abs(x - 35) ≤ 3  && abs(y - 25) ≤ 3
focus_sharp:         abs(v) ≤ 4
```

### Sticky Unlocks

The controller maintains `STICKY_UNLOCKS = new Set(['beam-current'])`. Once
unlocked, sticky controls stay active for the rest of the session — they don't
re-lock when their step is satisfied.

### Auto-Advance Pattern

Step 4 ("Holder repositions and airlock pumps") uses `autoAdvance: true` to
skip the state-change success check. This is the *only* step that does so —
its progression is timer-driven, not state-driven. The flag prevents a
timer-vs-state race condition.

## Module 03 — Diffraction Lab Architecture

Three-layer pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│  diffraction.js                                             │
│  Module controller. Wires dropdowns, slider, voltage btns,  │
│  drag-rotation, spot clicks, ruler tool, reset.             │
├─────────────────────────────────────────────────────────────┤
│  lattice-renderer.js    +   reciprocal-renderer.js          │
│  Pure renderers. Take (crystal, rotationMatrix, …) → SVG.   │
│  Run on every state change. No memoisation.                 │
├─────────────────────────────────────────────────────────────┤
│  math3d.js  +  lattice-data.js                              │
│  3D math primitives (rotation matrices, zone-axis mapping)  │
│  and crystal definitions (a, structure, allowed reflections)│
└─────────────────────────────────────────────────────────────┘
```

The reciprocal renderer applies structure-factor rules:
- FCC: h, k, l all even or all odd
- BCC: h + k + l even
- Diamond: like FCC plus a phase-cancellation condition
- Simple cubic: all reflections allowed

Spot positions are computed in reciprocal space, then projected onto the
viewing plane perpendicular to the current zone axis, then scaled by the
camera-length factor for screen rendering.

## How To Extend

### Add a New Sample (Module 02)

1. Add a sample-image PNG under `assets/images/microscope/samples/<name>/`.
2. In `data/guided-data.js`, add a `<name>` block with the per-step config.
3. Wire the sample button in the left rail of `microscope-guided.html` and
   remove its `disabled` attribute.
4. If voltage gating differs, update the voltage-gating logic in `controls.js`.

### Add a New Crystal (Module 03)

1. In `assets/js/diffraction/lattice-data.js`, add an entry to `CRYSTALS`:
   ```js
   NewMat: {
     key: 'NewMat', name: 'Material Name', structure: 'FCC',
     a: 0.408, color: '#…'
   }
   ```
2. Reload the page. The dropdown rebuilds itself from the data.

### Add a New Step (Module 02)

1. Insert a new step object into `data/guided-data.js` in the desired position.
2. Renumber the `id` fields of subsequent steps so they remain contiguous.
3. If the step requires a new tolerance, add its predicate to `tolerance.js`.
4. If the step uses a control that doesn't exist in the rails yet, add the
   markup to `microscope-guided.html` and a handler in `controls.js`.

## Theme System

CSS custom properties scoped to `:root` (light, default) and
`:root[data-theme="dark"]`. The theme attribute is set on `<html>` by
`global.js` before render to prevent flash. User preference persists in
`localStorage.tem_theme`.

Where theme tokens didn't read cleanly across themes (status strips, viewer
bars), colours are hard-coded inline. See the comment in `global.css`.

## Performance Notes

- The reciprocal renderer regenerates SVG on every state change.
  For ≤ 60 spots, this is well under a frame at 60Hz.
- The image renderer for Module 02 reuses DOM nodes via classList toggles —
  no expensive re-renders on state change.
- All animations use CSS transforms / opacity (compositor-friendly). The
  wobbler is the only animation that mutates margin, intentionally to mimic
  real lens current oscillation.

## File-by-File Responsibilities

```
assets/js/global.js              Topnav injection, theme toggle, fullscreen
assets/js/column.js              Column page handlers, zoom modal
assets/js/microscope-mode.js     Mode picker on microscope.html
assets/js/guided/state.js        Pub/sub state store
assets/js/guided/tolerance.js    Sweet-spot predicate evaluator
assets/js/guided/feedback.js     Hint timer (hidden in v1.0), flashes
assets/js/guided/controls-ui.js  Knob/trackpad UI scaffolding
assets/js/guided/controls.js     Control event handlers → state writes
assets/js/guided/image-renderer.js   Viewer state → DOM
assets/js/guided/diagram.js      Column-diagram hotspot + beam animation
assets/js/guided/acquire.js      Camera-insert + acquire/download flow
assets/js/guided/guided-controller.js  Step runner (the heart of the flow)
assets/js/diffraction/lattice-data.js     Crystal definitions
assets/js/diffraction/math3d.js           3D matrix math + zone rotation
assets/js/diffraction/lattice-renderer.js Real-space lattice SVG renderer
assets/js/diffraction/reciprocal-renderer.js  SAED pattern SVG renderer
assets/js/diffraction/diffraction.js      Module controller
```
