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


## Module 01 — The Column (v1.1, flip-card layout)

Module 01 now uses a two-faced flip card. Each face has its own image asset.

| Path | Used for | Dimensions | Notes |
| --- | --- | --- | --- |
| `column/tem-photo.png` | **Front face** — real laboratory photograph of a JEOL TEM. Default view on page load. Hosts 7 hotspots over the externally visible parts (gun housing, condenser block, viewing-chamber binoculars, specimen airlock, CCD / detector, control console, monitor). | 466 × 822 (aspect ≈ 0.567) | **Present.** Hotspot coords in `data/components-data.js` (`faces.photo.components`) are calibrated against these dimensions. Re-source at higher resolution later for sharper zoom. |
| `column/tem-schematic.png` | **Back face** — annotated block-diagram schematic showing every lens, deflector, and stigmator in the column with a printed legend. Hosts 23 hotspots over the drawn elements (IL5 has no drawn box; its hotspot covers the legend text). | 586 × 820 (aspect ≈ 0.715) | **Present.** Hotspot coords in `data/components-data.js` (`faces.schematic.components`) were derived by scanning the image for dark-pixel bands in the column-drawing strip (x ≈ 140 – 280 px). Re-source at higher resolution later for sharper zoom. |

**Image-swap caveat.** Both images' hotspot percentages are tied to their exact
source dimensions. If either image is swapped for a different one (higher
resolution, redrawn, or differently cropped) the hotspot percentages must be
re-derived from scratch — automated coordinate carry-over has historically
failed. The schematic re-derivation can be repeated with the included
`schematic_annotated.png` workflow.


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

---

## Module 01 v1.3 — Exterior view + drill-down placeholders

| Asset | Dimensions | Role | Notes |
|-------|-----------|------|-------|
| `tem-exterior.png` | 1060 × 943 | Default face (real annotated diagram) | Used as-is with baked-in green labels. 18 hotspots placed over the green callout dots; 1 component (foot switches) carries 2 pins. |
| `interior-placeholder.png` | 620 × 880 | Flip partner | **Placeholder.** Replace with the real column-interior visualization; then add labelled hotspots to `interiorFace.components`. |
| `panel-l1-placeholder.png` | 900 × 620 | Drill-down: Control Panel L1 | **Placeholder.** Replace with the real console photo; populate `panelL1Face.components` with per-control hotspots. |
| `panel-r1-placeholder.png` | 900 × 620 | Drill-down: Control Panel R1 | **Placeholder.** Same as L1. |

**Exterior hotspot derivation.** Green leader-line endpoint dots were detected
by eroded-blob analysis (`PIL` + `scipy.ndimage`): threshold on
`G>90, R<110, B<110, G-R>40, G-B>40`, binary-erode 2 iterations to drop thin
text strokes, then take the centre-of-mass of blobs ≥ 8 px. 19 dots were found
(18 components; foot switches contributes 2). Centres are stored as
percent-of-image in `data/components-data.js`; the `box(cx,cy,w,h)` helper
builds a centred hotspot rectangle around each.

**Recalibration caveat (unchanged).** All percentages are tied to the exact
1060 × 943 source. If the exterior image is swapped, re-run the dot detection
and regenerate the coordinates from scratch. When real images replace the
three placeholders, derive their internal hotspots against *those* images'
dimensions.

---

## Module 01 v1.4 — Control Panel L1 (real image)

| Asset | Dimensions | Role | Notes |
|-------|-----------|------|-------|
| `panel-l1.png` | 1105 × 829 | Drill-down: Control Panel L1 | Real JEOL console image. 11 hotspots placed on the numbered callout circles (1–11) around the periphery. Centres derived by green-ring detection (threshold on green channel, median centroid within a 30 px window per seed). |
| `panel-r1-placeholder.png` | 900 × 620 | Drill-down: Control Panel R1 | Still a placeholder — awaiting the real R1 console image + its callout list. |

`panel-l1-placeholder.png` was retired once the real image arrived.

**Viewport control layout (v1.4):** the face indicator and flip toggle moved
into a toolbar **above** the image (`.column-viewport__topbar`), and the zoom
button became a compact icon anchored to the **top-right corner of the stage**
(`.zoom-open-btn` inside `.column-stage`). This removes the earlier overlap of
control text on the diagram.


---

## Module 01 v1.5 — Control Panel R1 (real image) + exterior label hotspots

| Asset | Dimensions | Role | Notes |
|-------|-----------|------|-------|
| `panel-r1.png` | 1278 x 833 | Drill-down: Control Panel R1 | Real JEOL console image. 11 hotspots on the numbered callout circles (1-11), 7 on the left edge + 4 on the right. Centres from green-ring detection (median centroid per seed). |

`panel-r1-placeholder.png` retired once the real image arrived. Only
`interior-placeholder.png` remains a placeholder.

**Exterior hotspots relocated to label text (v1.5).** The 18 exterior
hotspot boxes were moved from the green leader-line dots onto the green
text labels. Boxes are hardcoded top-left `{x,y,w,h}` percentages (the
detection-heuristic for text blocks over-merged adjacent multi-line labels,
so boxes were placed by hand and verified by overlay render). The `pin`
values were left on the part dots, so hover lights the label box AND a pin
on the actual component, joined by the diagram's leader line.


---

## Module 01 v1.6 — Column Interior + Goniometer (real images)

| Asset | Dimensions | Role | Notes |
|-------|-----------|------|-------|
| `tem-interior.png` | 1135 x 1136 | Column Interior (flip partner) | Real cutaway diagram. 28 hotspots on the green text labels (16 left + 12 right columns, detected as text rows). No code-pins yet (image draws its own leader + dot per part). Descriptions PROVISIONAL. |
| `panel-goniometer.png` | 742 x 592 | Drill-down: Goniometer | 4 hotspots on the numbered circles (1-4). Centres from green detection. Descriptions from the JEOL goniometer control sheet. |

Retired `interior-placeholder.png`. **No placeholders remain** in Module 01;
all five column images (`tem-exterior`, `tem-interior`, `panel-l1`,
`panel-r1`, `panel-goniometer`) are real.

The exterior "Goniometer" component now carries `drilldown: 'panel-goniometer'`
in addition to the two control panels.
