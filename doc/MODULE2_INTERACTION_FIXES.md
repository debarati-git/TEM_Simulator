# Module 2 Interaction Fixes

## Implemented

1. **Step-wise Undo**
   - Undo now restores the complete state snapshot from before the preceding guided step.
   - Previous completed-step data is retained correctly.
   - Step timers and automatic actions are cancelled before restoring state.
   - Prelude offsets and preset values no longer accumulate when returning to a step.

2. **Manually controlled PC drawer**
   - The drawer remains collapsed when a guided step begins.
   - Its handle stays visible and can be clicked at any time.
   - Keyboard opening/closing is supported with Enter or Space.
   - TEM- and camera-related steps select and highlight the relevant drawer without opening it automatically.

3. **Column action hotspots**
   - Specimen REMOVE/INSERT is positioned below the Specimen label.
   - Condenser-aperture INSERT is positioned below the Condenser aperture label.
   - Objective-aperture INSERT is positioned below the Objective aperture label.
   - The old specimen REMOVE text embedded in the column image was removed.

## PC drawer contextual auto-open

The drawer now opens automatically only for guided steps that explicitly use the TEM control PC or camera PC. For all other steps it starts collapsed, while remaining manually accessible through its handle.
