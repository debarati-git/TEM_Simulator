# Roadmap

Planned work beyond Version 1.0. Items are listed roughly in priority order
within each phase. Phases can ship independently.

## Phase 3 · The Column — Interactive Anatomy

Convert Module 01 from a scaffolded reference into a full anatomy walkthrough.

- **Clickable components** on the column diagram with per-component
  educational copy (gun, condenser system, specimen stage, objective lens,
  intermediate / projector lenses, viewing chamber, detectors).
- **2D rotation control** to view the column from different angles. (A full
  3D rotatable model was discussed; deferred until 2D rotation is shipped
  and validated.)
- **Component cross-references** linking each part to where it's operated in
  Module 02 (e.g., clicking the "condenser aperture" component jumps to the
  relevant guided-session step).

## Phase 4 · Diffraction Lab Expansion

The current SAED-only renderer is the foundation. Build out from here:

- **Ring (polycrystalline) pattern mode** — same kinematic engine, but spots
  averaged over all crystallite orientations into concentric rings. Useful
  for distinguishing single-crystal vs polycrystalline diffraction in
  classroom contexts.
- **Diffraction-mode plumbing for Module 02** — replace the CSS hexagonal-spot
  placeholder at step 21 with a call into the real Diffraction Lab renderer
  using the Nanoparticles' assumed lattice.
- **Phase identification helper** — type in measured d-spacings, get a
  ranked list of candidate phases from the crystal database.
- **CBED disks + Kikuchi lines** — graduate-level scope. Significantly bigger
  build (dynamical effects, disk geometry). Deferred indefinitely unless
  there's pedagogical demand.

## Microscope Module Expansion

- **Experiment Mode** — controls always unlocked, no step gating, no
  instructions. The branch already exists in the UI scaffolding; the
  controller's gating logic just needs an "unguided" flag.
- **Additional samples:**
  - **Zebrafish** — biological, gated to 120 kV with mass-thickness contrast.
  - **Metal** — crystalline foil with diffraction-contrast emphasis.
  - **Mineral** — bulk geological sample.
- **Real micrographs at each magnification level** rather than CSS-scaled
  placeholders. Each sample × mag level needs its own image.
- **Beam-current dose model** (any of three options under consideration):
  - Wire to overall image brightness (simple, but overlaps with the
    Brightness knob).
  - Add a dose-accumulation gauge that builds up at high current and
    eventually degrades the image (sample radiation damage).
  - Leave as-is and keep the explanatory note in the theory modal.
  Decision deferred to user feedback in the field.

## Cross-Cutting Improvements

- **Audio cues** — subtle relay-click sounds on lockdown, soft chime on step
  success. Already scaffolded in `feedback.js` but currently silent.
- **Onboarding tour** — a one-time first-visit overlay introducing the
  layout. Not auto-fired for return visitors (cookie/localStorage).
- **Save / resume** — let students pause a session and continue later. Would
  use `localStorage` to persist the state snapshot.
- **Internationalisation** — localise instruction text. Strings are inline in
  `guided-data.js` today; would need a small i18n layer.
- **Accessibility audit** — keyboard navigation across knobs and trackpads,
  ARIA labels on dynamic state, screen-reader announcements for step
  transitions. Some basics are already in place; a full audit is overdue.

## Out of Scope (Likely Permanent)

- **Real-time aberration correction simulation** — graduate-research
  territory.
- **Energy-loss spectroscopy (EELS) / energy-dispersive X-ray (EDS)
  modules** — separate instruments with their own pedagogical scope.
- **Cryo-TEM mode** — would require modelling the cryo-holder workflow and
  ice contrast; substantial new module rather than an extension.

## Contributing

Modifications go through `ARCHITECTURE.md`'s "How to Extend" section. Major
behaviour changes (new step types, new tolerance predicates, alternative
state models) should be discussed before implementation — the current shape
is load-bearing for the 32-step flow's correctness.
