# RS7 — Scrollable and menu-interactive TEMCON replica

Build: TEM Simulator v4.9.1 RS7

## Scope

This revision updates the reconstructed TEMCON reference workstation used in:

- Section 1, Step 4 — TEMCON readiness verification
- Section 2, Step 6 — Specimen Exchange / Vacuum EVC READY verification
- Section 2, Step 8 — holder-model selection

## Changes

- The reconstructed PC desktop is now hosted inside a dedicated scroll viewport with persistent horizontal and vertical scrollbars.
- The guided confirmation bar remains outside the scroll viewport so the task action stays reachable while the user inspects the full PC desktop.
- All top TEMCON menu headings are clickable: File, Dialogue, Monitor, Property, Option, Maintenance, Display, JEOLS, and Help.
- Each top menu opens a clickable submenu. Commands either focus the relevant reconstructed TEMCON child window or open a small training-mode command/dialog response.
- HT, SPC, Status, VAC, and F1–F6 shortcut controls are clickable.
- High Voltage Control and Valve Status can be brought to the front from menus/shortcuts; TEMCON child windows also raise when selected.
- The existing task-specific verification logic is preserved: HT READY + EVAC READY + 80 kV in Section 1 Step 4, EVC READY in Section 2 Step 6, and Single Tilt Holder selection in Section 2 Step 8.
