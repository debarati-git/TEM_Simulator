# User Guide — For Students

This guide walks through using the TEM Simulator. No prior TEM experience
required; the simulator is the introduction.

## Getting Around

The top navigation persists across every page and contains:

- **Brand mark** (left) — returns you to the landing page.
- **Module tabs** — Column · Microscope · Diffraction Lab.
- **Home / theme toggle** (right) — flip between light and dark themes.
  Your choice is remembered across sessions.

Most pages also have a **Full Screen** button. Pulsing gently in the corner —
click it to maximise the simulator and reduce visual distraction.

## Module 01 — The Column

A scaffolded anatomy reference for the electron-optical column. (Full
interactivity ships in a future build — see `ROADMAP.md`.)

## Module 02 — The Microscope

The instrument-operation module.

### Choosing a Mode

On entering, you'll see two cards: **Guided Session** and **Experiment Mode**.
For Version 1.0, only Guided Session is wired. Pick it.

### The Guided Session

You'll operate a 200 kV TEM through 32 sequential steps using the Nanoparticles
sample. Each step gates the next: an instruction appears at the top of the
screen, and one or more controls light up. Once you've operated the highlighted
controls correctly (within the simulator's tolerance window), the next step
unlocks automatically.

#### Layout

- **Top status strip** — live indicators for vacuum, beam, HT (accelerating
  voltage), sample, and magnification. Progress bar at the bottom edge.
- **Context bar** — back · current instruction · Undo Step · Restart · Theory.
- **Three-panel body** — left control rail (gun & vacuum, beam, apertures),
  centre viewer (column diagram, then beam-on-screen view), right control rail
  (stage, modes, imaging, projector, focus, camera).

#### Visual Cues

- **Orange ring / glow** around a control = "this control just unlocked,
  operate it now". This is the *amber unlock* signal.
- **Cyan / blue highlight** = the currently selected value (active tab,
  selected button, knob arc indicator).
- **Blinking "CLICK TO INSERT/REMOVE"** badges on the column diagram = there's
  an action on the diagram itself.

#### When You Get Stuck

- **Undo Step** — resets just the current step's state and re-applies its
  setup. Use this when you've over-adjusted a control.
- **Restart** — wipes the session and returns you to step 1.
- **Theory** (top right of the status bar) — opens a reference modal explaining
  what the controls actually do physically. Useful when an instruction makes
  sense but the *why* doesn't.

#### Sweet Spots

Several steps require placing a control inside a tolerance window — not a
specific value. The windows are deliberately generous at lower magnifications
and tighter at higher ones. If a step feels stuck, you're probably *near* the
target — small adjustments, not large ones.

## Module 03 — The Diffraction Lab

A single-crystal SAED (Selected Area Electron Diffraction) pattern simulator.

### Layout

- **Status bar** — shows wavelength λ, camera length L, zone axis, and a `?`
  help button.
- **Left pane (Real Space)** — the 3D crystal lattice. Drag to rotate.
- **Right pane (Reciprocal Space)** — the resulting SAED pattern. Click any
  spot for its full readout: (hkl) indices, d-spacing, |g|, Bragg 2θ, and
  screen radius R.
- **Bottom controls** — Crystal · Zone Axis · Camera Length · Acc. Voltage ·
  Tools (Ruler, Reset).

### Quick Workflow

1. Pick a **crystal** (Au, Cu, Si, NaCl, …) — the lattice on the left updates.
2. Pick a **zone axis** ([001], [011], [111], …) — the crystal rotates to that
   viewing direction and the pattern morphs accordingly.
3. **Click a spot** to read its Miller indices and d-spacing.
4. Activate the **Ruler** tool and click two spots to measure their separation
   on screen — d is inferred via `d = λL / R`.

### Theory Panel

A "Theory" reference panel slides in from a tab on the right edge — it covers
real ↔ reciprocal space duality, Bragg's law, zone-axis intuition, the camera
equation, and what you can infer from a pattern (crystal structure, lattice
parameter, orientation, phase ID).

### Important Scope Note

This lab simulates **single-crystal SAED only**. Ring patterns (polycrystalline
samples) and CBED are out of scope for Version 1.0.

## Tips

- Work in **dark mode** for long sessions — it matches the scope phosphor
  aesthetic and is easier on the eyes.
- Use **Full Screen** when running through the guided flow — the topnav can
  distract from the workflow.
- The **Theory** modal / panel is your friend — open it whenever an
  instruction is technically clear but conceptually opaque.
