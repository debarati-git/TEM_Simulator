# TEM Simulator — Static Image Catalog

This document lists every image asset the simulator either uses today or
will need as future phases come online. Paths are relative to
`assets/images/` unless noted.

Format conventions:
- Recommended dimensions are in **W × H** pixels.
- PNG with transparency or solid white background is the default; SVG is
  noted where it's a better fit (icons, schematic diagrams).
- "Placeholder present" means a stand-in already exists in the repo.
- "Required" means the asset must exist before that module ships.


## Module 02 — The Microscope (Phase 2, complete in v1.0)

### Column diagram

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `microscope/diagram/tem-column.png` | Column view in the viewing screen; clickable hotspots for specimen/condenser/objective | 1085 × 1270 (aspect ≈ 0.85) | **Present.** Light-theme version with embedded label pills (Condenser/Objective/SAD apertures, Specimen, Phosphor screen, Camera). All hotspot coords in `data/guided-data.js` are calibrated against this exact image. If swapped, recalibrate. |

### Sample micrographs (imaging mode)

Each sample needs at least one base micrograph. The current implementation
CSS-scales a single image to fake the four magnification levels, which is
serviceable but a 4-level set per sample gives much better fidelity.

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `microscope/samples/nanoparticles/nanoparticles.png` | Sample image, all mag levels (CSS-scaled) | 1024 × 1024 | **Placeholder present.** Replace with a real nanoparticle TEM image. |
| `microscope/samples/nanoparticles/nanoparticles-low.png` | Low-mag (overview) | 1024 × 1024 | Optional — only if upgrading from single-image scaling. |
| `microscope/samples/nanoparticles/nanoparticles-medium.png` | Medium-mag | 1024 × 1024 | Optional. |
| `microscope/samples/nanoparticles/nanoparticles-high.png` | High-mag | 1024 × 1024 | Optional. |
| `microscope/samples/nanoparticles/nanoparticles-veryhigh.png` | Very-high-mag | 1024 × 1024 | Optional. |
| `microscope/samples/zebrafish/zebrafish.png` | Bio sample at 120 kV (placeholder button exists but flow not built) | 1024 × 1024 | **Required** when Zebrafish flow is enabled. |
| `microscope/samples/zebrafish/zebrafish-{low,medium,high,veryhigh}.png` | Per-mag versions | 1024 × 1024 | Optional set. |
| `microscope/samples/metal/metal.png` | Metal sample | 1024 × 1024 | **Required** when Metal flow is enabled. |
| `microscope/samples/metal/metal-{low,medium,high,veryhigh}.png` | Per-mag versions | 1024 × 1024 | Optional set. |
| `microscope/samples/mineral/mineral.png` | Mineral sample | 1024 × 1024 | **Required** when Mineral flow is enabled. |
| `microscope/samples/mineral/mineral-{low,medium,high,veryhigh}.png` | Per-mag versions | 1024 × 1024 | Optional set. |

### Sample diffraction patterns

Real diffraction images give crystalline samples a believable look. The
simulator currently renders a CSS hexagonal-spot placeholder.

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `microscope/samples/nanoparticles/diffraction.png` | Diffraction-mode screen for the nanoparticle sample | 1024 × 1024 | **Required** to replace CSS placeholder. Black background, white/cyan spots. |
| `microscope/samples/metal/diffraction.png` | Diffraction for metal sample | 1024 × 1024 | When Metal flow ships. |
| `microscope/samples/mineral/diffraction.png` | Diffraction for mineral sample | 1024 × 1024 | When Mineral flow ships. |
| (Zebrafish has no diffraction — biological sample is amorphous.) | | | |

### STEM mode variants (optional)

If you want STEM to look distinct from TEM beyond a CSS filter:

| Path | Used for | Notes |
| --- | --- | --- |
| `microscope/samples/{sample}/stem-bright.png` | STEM bright-field rendering | Could be the imaging micrograph with an inversion/filter applied at runtime instead. |
| `microscope/samples/{sample}/stem-dark.png` | STEM dark-field rendering | Same — runtime filter usually sufficient. |

### Phosphor / screen overlays

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `microscope/screen/phosphor-glow.png` | Optional ambient glow texture on the round phosphor screen | 1024 × 1024 (alpha PNG) | Currently a CSS radial gradient. Real texture optional. |
| `microscope/screen/scanline.png` | Optional CRT/phosphor scanline overlay | 1024 × 1024 (alpha PNG) | Currently a CSS repeating gradient. |


## Module 01 — The Column (Phase 3, scaffolded)

This module is an exploratory anatomy view rather than a guided session.
The exact image set depends on the visual approach (annotated cross-section
vs. per-component close-ups vs. 3D rotation).

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `column/tem-column-anatomy.png` | Full annotated cross-section, more detail than the Phase-2 diagram | 1500 × 1800 or larger | Higher detail than `microscope/diagram/tem-column.png`. May share that asset or be a distinct illustration. |
| `column/components/gun.png` | Close-up of the electron gun | 800 × 800 | One per component for component-detail panel. |
| `column/components/condenser-lens.png` | Condenser lens cutaway | 800 × 800 | |
| `column/components/condenser-aperture.png` | Condenser aperture mechanism | 800 × 800 | |
| `column/components/objective-lens.png` | Objective lens cutaway | 800 × 800 | |
| `column/components/objective-aperture.png` | Objective aperture mechanism | 800 × 800 | |
| `column/components/sad-aperture.png` | SAD aperture mechanism | 800 × 800 | |
| `column/components/specimen-holder.png` | Side-entry specimen holder | 800 × 800 | |
| `column/components/projector-lens.png` | Projector lens stack | 800 × 800 | |
| `column/components/phosphor-screen.png` | Phosphor screen detail | 800 × 800 | |
| `column/components/camera.png` | Image-recording camera bulb | 800 × 800 | |
| `column/3d/tem-column-{front,side,iso}.png` | If a 3D-rotate view is built | 1200 × 1500 | Optional — only if the 3D path is chosen over per-component close-ups. |


## Module 03 — Diffraction Lab (Phase 4, complete in v1.0)

Diffraction patterns in the lab are rendered mathematically from the crystal
lattice data (`assets/js/diffraction/lattice-data.js`) — no static images
needed for the patterns themselves. Reference images are useful for
educational comparison.

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `diffraction/reference/cubic.png` | Real diffraction pattern reference for a cubic lattice | 800 × 800 | Optional, "compare to real" panel. |
| `diffraction/reference/hexagonal.png` | Hexagonal lattice real pattern | 800 × 800 | Optional. |
| `diffraction/reference/tetragonal.png` | Tetragonal lattice real pattern | 800 × 800 | Optional. |
| `diffraction/reference/orthorhombic.png` | Orthorhombic real pattern | 800 × 800 | Optional. |
| `diffraction/reference/monoclinic.png` | Monoclinic real pattern | 800 × 800 | Optional. |
| `diffraction/reference/triclinic.png` | Triclinic real pattern | 800 × 800 | Optional. |
| `diffraction/lattice/{system}.svg` | Unit-cell illustrations | SVG | Could also be 3D-rendered at runtime from data. Static SVG is cheaper. |


## Landing & navigation

Currently the landing page and the mode-select page use inline SVG icons.
Optional polish:

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `landing/hero-tem.jpg` | Hero photo of a real TEM instrument | 1600 × 900 | Optional. Adds physical-instrument context. |
| `landing/module-01-column-thumb.png` | Module 1 card thumbnail | 800 × 600 | Optional — currently an SVG icon. |
| `landing/module-02-microscope-thumb.png` | Module 2 card thumbnail | 800 × 600 | Optional. |
| `landing/module-03-diffraction-thumb.png` | Module 3 card thumbnail | 800 × 600 | Optional. |


## Favicon / app icon

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `favicon.ico` (or `assets/icons/favicon.svg`) | Browser tab icon | 32×32 / 16×16 (or SVG) | Not currently set. Worth adding for polish. |
| `assets/icons/apple-touch-icon.png` | iOS bookmark icon | 180 × 180 | Optional. |


## Priority summary (what to source first)

For the current build to look more authentic without adding new modules,
the highest-leverage assets to source are:

1. **`microscope/samples/nanoparticles/nanoparticles.png`** — replace the
   PIL-generated placeholder with a real high-resolution TEM nanoparticle
   image. Single biggest visual upgrade for the existing flow.
2. **`microscope/samples/nanoparticles/diffraction.png`** — replace the
   CSS hexagonal-spot placeholder used at step 21 (Diffraction mode).
3. **Per-mag versions** of the nanoparticle micrograph (low/medium/high/
   very-high). Optional, but removes the CSS-scaled "single-image" feel.
4. **Zebrafish, Metal, Mineral** sample images — required before those
   sample buttons can be un-disabled.
5. **Column-component close-ups** — only when Phase 3 (The Column module)
   is ready to be built out.
