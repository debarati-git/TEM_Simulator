# TEM Simulator — Version 1.8

A web-based Transmission Electron Microscope learning environment, built for
IIT students to develop instrument intuition before working on real hardware.

## Overview

The simulator reproduces the workflow of operating a 200 kV TEM through three
self-contained modules. Each module is browser-only — no install, no server —
and runs from a static `file://` URL so it works offline on any machine.

| Module                | State          | What it does                                   |
| --------------------- | -------------- | ---------------------------------------------- |
| 01 · The Column       | **Complete (v1.1)** | Flip-card anatomy view: real TEM photo (front, 7 external parts) + annotated schematic (back, 23 internal components) |
| 02 · The Microscope   | **Complete**   | 32-step guided operation flow (Nanoparticles sample) |
| 03 · Diffraction Lab  | **Complete**   | Single-crystal SAED pattern explorer            |

## Quick Start

1. Download `tem-simulator-v1.1.zip` and unzip.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
3. Pick a module from the landing page or top navigation.

No build step, no dependencies. Everything is plain HTML, CSS, and ES2017+
JavaScript.

## Folder Layout

```
tem-simulator/
├── index.html                       Landing page
├── pages/
│   ├── column.html                  Module 01
│   ├── microscope.html              Module 02 chooser
│   ├── microscope-guided.html       Module 02 — guided session
│   └── diffraction-lab.html         Module 03
├── assets/
│   ├── css/                         Page + global stylesheets
│   ├── js/
│   │   ├── global.js                Top nav, theme toggle, shared helpers
│   │   ├── column.js                Column module logic
│   │   ├── microscope-mode.js       Microscope mode picker
│   │   ├── guided/                  Guided-session controller, state, renderer
│   │   └── diffraction/             Diffraction renderer, math3D, lattice data
│   ├── images/                      Diagrams, sample images, icons
│   ├── icons/                       UI icons
│   └── fonts/                       (None — fonts loaded from Google)
├── data/
│   ├── guided-data.js               LIVE 32-step source for guided flow
│   ├── guided-config.json           Canonical config mirror
│   ├── guided-steps.json            Canonical steps mirror
│   ├── components.json              Column component metadata
│   ├── components-data.js           Embedded version of the above
│   └── crystal-systems.json         Crystal-system reference data
└── doc/                             You are here
```

## Documentation Index

| File                 | Read it when…                                              |
| -------------------- | ---------------------------------------------------------- |
| `README.md`          | Starting from zero. (This file.)                           |
| `USER_GUIDE.md`      | You want to know how to operate the simulator as a student. |
| `ARCHITECTURE.md`    | You're modifying the code or adding new content.           |
| `design-notes.md`    | You want the design rationale — *why* the structure is the way it is. |
| `image-assets.md`    | You're sourcing or replacing visual assets (column diagram, micrographs, references). |
| `CHANGELOG.md`       | You want to know what shipped in this version.             |
| `ROADMAP.md`         | You want to know what's coming next.                       |

## Browser Support

Modern evergreen browsers from 2022 onward. Specifically requires:

- CSS Grid + Flexbox
- ES2017+ (`async`, optional chaining, nullish coalescing)
- SVG, CSS custom properties
- `backdrop-filter` (gracefully degrades on older Safari)

## Credits & License

Built for the IIT pre-lab TEM training programme. Visual design inspired by
industrial instrument panels; pedagogical structure inspired by the MyScope
TEM simulator workflow.
