# Changelog

## v1.0 — First Public Release

### Module 01 · The Column

- Annotated cross-section diagram of the electron-optical column.
- Clickable component labels with descriptive captions.
- Zoom modal for close inspection of the diagram.

### Module 02 · The Microscope (Guided)

- **Full 32-step guided session** for the Nanoparticles sample.
- All 18 panel controls present and wired:
  - Left rail: Sample · Airlock Pump · Specimen Insert · Acc Voltage · Std
    Focus · Beam On · Beam Current · Brightness · Beam Shift · Stigmator ·
    Aperture Select · Aperture Size · Aperture Alignment.
  - Right rail: Stage X/Y · Stage Z · X/Y/Z readouts · Specimen Tilt ·
    Imaging Mode · Mode · STEM Imaging · STEM Scan · Magnification · Lens
    selector · Projector Lens Alignment · Wobbler · FFT · Obj Lens Focus ·
    Camera Insert · Acquire & Download.
- **Visual simulation:**
  - Nanoparticle placeholder image with per-magnification scaling.
  - Beam glow with stigmator-driven ellipse + rotation.
  - Aperture clip-path mask with alignment-offset center.
  - Blue ROI circle that moves independently of sample.
  - Focus blur tied to focus-knob distance from zero.
  - Wobbler sine-eased oscillation, amplitude tied to |stageZ|.
  - Camera-mode neutral grayscale (vs phosphor green for live view).
- **Diagram interaction:**
  - Blinking "CLICK TO INSERT/REMOVE" badges at active steps.
  - Beam-on overlay: pulsing electron source, traveling dot, phosphor glow.
- **Workflow controls:**
  - Voltage gating (120 kV disabled for Nanoparticles).
  - Auto-scroll to newly-active control in its rail.
  - Undo Step (re-applies the current step's prelude).
  - Restart (full session reset).
  - Native browser Full Screen with pulsing affordance.
- **Theory modal** — five-section explainer (TEM image fundamentals, contrast
  mechanisms, focus & astigmatism, magnification regimes, image capture).
- **Theme toggle** — light default, dark via toggle, persisted across sessions.

### Module 03 · The Diffraction Lab

- **Single-crystal SAED pattern simulator** — out of scope for Version 1.0:
  ring patterns (polycrystalline) and CBED.
- 3D real-space lattice on the left with drag-rotation. Yellow [100][010][001]
  axes anchored to the crystal.
- Reciprocal-space SAED pattern on the right with selectable spots showing
  full readout: (hkl), d-spacing, |g|, 2θ, screen radius R.
- Ruler tool for inter-spot measurement → infers d directly via λL/R.
- Crystal dropdown (Au, Cu, Si, NaCl, …) with structure-factor filtering
  (FCC, BCC, simple cubic, diamond cubic).
- Zone-axis dropdown with animated 600ms transition.
- Camera-length slider (200–2000 mm) with live spot rescaling.
- Acc voltage selector (120 / 200 kV) → de Broglie wavelength readout.
- **Help modal** auto-opens on every visit; reopenable via header `?` icon.
- **Theory side-panel** with horizontal pull-tab. Click-outside-closes pattern.
- Both real-space and reciprocal-space panes use the dark "scope" background
  for instrument-faithful look.
- Light grid overlay in reciprocal-space pane, centred on the (000) spot.

### Global

- Top navigation persistent across pages with active-module indicator.
- Theme toggle in the topnav, persisted in `localStorage`.
- Status indicators (vacuum, beam, HT, sample, mag) live-update from state.
- Thin progress bar across the bottom of the status strip.

### Documentation

- `README.md`, `USER_GUIDE.md`, `ARCHITECTURE.md`, `design-notes.md`,
  `image-assets.md`, `CHANGELOG.md`, `ROADMAP.md` in the new `doc/` folder.

## Known Limitations in v1.0

- **Beam Current knob** is wired into state but not visually modeled —
  acknowledged in the in-app theory modal.
- **Only the Nanoparticles sample** has a guided flow. Zebrafish, Metal, and
  Mineral buttons exist but are disabled.
- **Experiment Mode** (free-form, no step gating) is scaffolded but not built.
- **Module 01** is annotated and explorable but not yet a full anatomy
  walkthrough.
- **Mag-level rendering** uses CSS scaling of a single high-resolution
  placeholder rather than distinct micrographs per zoom level.
- **Diffraction-mode visual at step 21** uses a CSS hexagonal-spot pattern as
  a placeholder; the real Diffraction Lab renderer is not yet plumbed into
  the Module 02 viewer.
- **Ring (polycrystalline) patterns** and **CBED** are out of scope.
