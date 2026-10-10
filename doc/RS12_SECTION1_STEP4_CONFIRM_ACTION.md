# RS12 — Section 1 Step 4 unobstructed PC view + standard confirmation modal

Baseline: RS11 InteractiveFullPC.

Changes:
- Removed the fixed confirmation/instruction strip from the bottom of the Section 1 Step 4 PC screen.
- The full supplied Windows/TEMCON PC screen, including the taskbar, remains visible without obstruction.
- During Section 1 Step 4, the normal top action button changes from “Show Step” to “Confirm Step”.
- Clicking “Confirm Step” opens the same centered/draggable SOP confirmation modal used by the other simulator steps.
- The confirmation modal asks the learner to confirm HT READY, EVAC READY, and 80.00 kV.
- Closing the modal leaves the learner on the same Step 4 PC screen; confirming completes the step and advances normally.
- Existing PC familiarization interactions from RS11 are retained.
