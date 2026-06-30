# Changelog

## v1.7 — Interior Hotspot Fix + Module 02 Diagram Swap

### Module 01 · The Column

- Fixed the **High voltage cable** hotspot on the Column Interior face — it now
  sits exactly over its text label.

### Module 02 · The Microscope

- **Replaced the guided-viewer ray diagram with the detailed Column Interior
  cutaway** (`tem-interior.png`). The 4 step hotspots (Specimen remove/insert,
  Condenser aperture, Objective aperture) and their action labels were
  recalibrated to the new diagram's geometry. The beam overlay (decorative,
  centre-aligned) and all guided-session logic — sweet-spot predicates,
  STICKY_UNLOCKS, step-4 auto-airlock, controls, tolerances, steps — are
  unchanged.

### Unchanged

- Module 03 untouched. All frozen Module 02 state logic untouched (only the
  diagram image and the 4 diagram-hotspot coordinates changed).


## v1.6 — Module 01 Column Interior + Goniometer Drill-Down

### Module 01 · The Column

- **Column Interior is now a real cutaway visualization** (1135 x 1136),
  replacing the placeholder behind the "Flip to see Column Interior" button.
  **28 components** are mapped as hotspots on their green text labels:
  electron gun, Wehnelt, accelerating tube, high-voltage cable, the condenser
  lens / aperture / mini-lens / stigmator / deflectors, spot alignment,
  goniometer, specimen holder, the objective lens / mini-lens / stigmator,
  field-limiting aperture, 1st/2nd image shifters, projector lens coil &
  deflector, intermediate lens coil, binocular microscope, viewing chamber /
  window, small & large screens, and the camera chamber.
  **Descriptions are provisional** (written from standard-TEM knowledge);
  exact text will be supplied later. (Pins are omitted on this face for now —
  the diagram already draws a leader + dot to each part.)
- **New Goniometer drill-down** from the exterior view. The exterior
  "Goniometer" hotspot is now a third drill-down (alongside Control Panels L1
  and R1). It opens the real goniometer photo (742 x 592) with 4 hotspots on
  the numbered callouts: green ready lamp, yellow evacuation lamp, PUMP/AIR
  switch, and the optional-holder connector (descriptions from the JEOL
  goniometer control sheet).
- **No placeholder images remain** in Module 01.
- Modules 02 and 03 untouched.


## v1.5 — Module 01 Control Panel R1 + Exterior Hotspots on Labels

### Module 01 · The Column

- **Control Panel R1 drill-down now uses the real JEOL console image**
  (1278 x 833) with **11 calibrated hotspots on the numbered callout labels**
  (1-11): Wobbler switches (IMAGE WOBB X/Y, HT WOBB), Function switches
  (MAG 1/2, LOW MAG, SA MAG, SA DIFF), SHIFT Y knob, DEF-STIG Y knob,
  MAG/CAM L knob, OBJ FOCUS (FINE / COARSE / CRS), DIFF FOCUS (+ CRS),
  EXP TIME / PHOTO (EXP TIME, AUTO, PHOTO, lamp), STD FOCUS, F switches
  (F1-F6), and Z switches. Descriptions adapted from the JEOL EM210 manual.
- **Exterior hotspots moved onto their green text labels.** Each exterior
  component's clickable hotspot now sits on its label text (e.g. "Refrigerant
  tank", "Goniometer") rather than on the leader-line dot. The **pins remain
  on the actual parts**, so the green leader line visually connects each
  label to the component it points to. Foot switches: hotspot on the "Foot
  switches" text, with the two pedal pins retained.
- Both console placeholder images retired; **no placeholders remain except
  the Column Interior** flip face.
- Modules 02 and 03 untouched.


## v1.4 — Module 01 Control Panel L1 + Viewport Controls

### Module 01 · The Column

- **Control Panel L1 drill-down now uses the real JEOL console image**
  (1105 × 829) with **11 calibrated hotspots placed on the numbered callout
  labels** (1–11): BEAM switch, APERTURE CONTROL, PROBE CONTROL, ROOM LAMP
  switch, DEF/STIG switches, BRIGHTNESS knob, BRIGHTNESS CRS, SHIFT X knob,
  SHIFT CRS, DEF/STIG X knob, and DEF-STIG CRS. Descriptions adapted from the
  JEOL EM210 "Description of Controls" manual. Hotspot centres derived by
  green-circle detection on the periphery.
- **Viewport controls relocated so nothing overlaps the diagram:**
  - The **face indicator** (top-left) and the **Flip to see…** toggle now sit
    in a **toolbar above the image**, so their text no longer overlaps the
    diagram.
  - The **Zoom** control is now a **compact icon button inside the image's
    top-right corner**.
- Retired the L1 placeholder image (`panel-l1-placeholder.png`); Control Panel
  R1 remains a placeholder pending its real image.
- Modules 02 and 03 untouched.


## v1.3 — Module 01 Exterior View & Drill-Down Consoles

### Module 01 · The Column

- **Exterior view is now the default face**, fully replacing the old lab-photo
  face. It uses the supplied annotated exterior diagram (1060 x 943 px) as-is,
  with 18 components mapped to invisible hotspots placed exactly over each
  green callout dot: condenser aperture assembly, CM lens shift screws,
  refrigerant tank, goniometer, specimen holder, field-limiting aperture
  assembly, intermediate lens shift screws, projector lens shift screws,
  binocular microscope, PC monitor, control panel L1, trackball, fluorescent
  screen lever, control panel R1, camera chamber door, cover L2, cover R2, and
  foot switches (one component, two pedal pins).
- **Flip target changed from "Ray Diagram" to "Column Interior."** The flip
  button now reads **"Flip to see Column Interior"** / **"Flip to see
  Exterior"** (shortcut `F` unchanged). The interior face is a **placeholder**
  pending the real interior visualization.
- **Drill-down detail views** for **Control Panel L1** and **Control Panel
  R1**. Clicking either hotspot (or the "Open detailed view" button in the
  detail card) **replaces the viewport** with that console's detail face and
  shows a **"Back to Exterior"** control (also `Esc`). Both detail faces use
  **placeholder images** with their own (currently empty) internal-hotspot
  arrays, ready to populate when the real console images arrive.
- **Drill-down affordances:** drill-down hotspots/pins use a blue (signal)
  accent vs the amber default, and their list rows show a `›` chevron.
- **Retired** the old `tem-photo.png`, `tem-ray-diagram.png`, and
  `tem-schematic.png` assets — no longer referenced by Module 01.
- Modules 02 and 03 untouched.


## v1.1 — Module 01 Flip-Card Refresh

### Module 01 · The Column

- **Replaced the single annotated diagram with a two-faced flip card.**
  - **Front face** (default view on page load): a real laboratory photograph of
    a JEOL transmission electron microscope.
  - **Back face**: an annotated block-diagram schematic naming every lens,
    deflector, and stigmator in the electron-optical column.
  - The card rotates 180° about its Y-axis with a CSS 3D transform when the
    operator presses the **Show Schematic** / **Show Photo** toggle (or the
    keyboard shortcut `F`). A small `PHOTO` / `SCHEMATIC` indicator in the
    top-left of the viewport always shows which face is up.
- **New hotspot sets, calibrated per face.**
  - Photo face — 7 externally visible parts: electron gun housing, condenser
    system block, viewing-chamber binoculars, specimen airlock & goniometer,
    CCD / detector housing, control console, display monitor.
  - Schematic face — 23 internal components: Filament, Gun1, Gun2, CL1, CL2,
    CL3, CL5 (condenser stigmator), Spot, CLA1, CLA2, CM, Specimen, OL5, OL,
    OM, IS1, IS2, IL5, IL1, IL2, IL3, PLA, PL.
  - Schematic hotspot coordinates were derived by scanning the source image
    for dark-pixel bands in the column-drawing region and converting to
    percentages; photo hotspots were placed by visual inspection.
  - Each component carries a fresh two-paragraph description written from
    standard TEM knowledge — what the element does, where it sits in the
    optical chain, and how the operator interacts with it.
- **Removed Module 01 components that did not appear in the new schematic:**
  Viewing Chamber, Detectors, and Control Panel (these are surfaced
  visually only on the photo face now).
- **Per-face dark-mode handling.** The schematic still inverts in dark mode
  (so a black-on-white diagram becomes white-on-black). The real photo does
  **not** invert — instead it is dimmed and slightly contrast-boosted, since
  inverting a colour photograph would turn it into an unreadable negative.
- **Zoom modal** now operates on whichever face is showing, with a dynamic
  heading (`TEM Column · Real Lab View` vs `TEM Column · Annotated Schematic`)
  and per-face theme filters in dark mode.
- **Beam animation** is now confined to the schematic face only (centreline
  x ≈ 35.8 %, from below the filament to above the projector), since an
  animated beam over a photo of the closed column does not match physical
  reality.

### Image Assets

- Added `assets/images/column/tem-photo.png` (466 × 822, ~611 KB).
- Added `assets/images/column/tem-schematic.png` (586 × 820, ~496 KB).
- Removed the v1.0 single-image asset `tem-column-anatomy.jpg` and its
  pre-label-resize backup (`tem-column-anatomy.original.jpg`).

### Data schema

- `data/components-data.js` now exports a faces-keyed structure:
  `{ faces: { photo: {image, components}, schematic: {image, components} },
   defaultFace: 'photo' }`.
- The JSON mirror at `data/components.json` is deprecated for Module 01 — the
  canonical source for v1.1 onward is the JS file. The JSON file is now a
  small stub explaining this.

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
