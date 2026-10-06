# Version 4.9.1 — Section 4 Dark Field Imaging

Implemented the manual-driven Section 4 Dark Field workflow on the approved Version 4.9 baseline.

- 21 atomic guided actions.
- Inherits the stable Bright Field condition from Section 3.
- Adds DIFF mode on R1.
- Adds DARK/BRIGHT TILT and OBJ STIG functions to DEF/STIG.
- Adds objective-aperture selection and X/Y alignment control.
- Uses a CSS-generated SAED pattern with one guided selected reflection (g1).
- Beam-tilt X/Y moves the selected diffracted spot onto the optical axis.
- Returns to a simulated Dark Field image using the same specimen context.
- Objective aperture centering, focus, and objective astigmatism correction produce live visual response.
- Reuses F1 and iTEM acquisition flow, records the Dark Field image with reflection ID g1.
- Viewing Screen remains visual-only with no instructional text overlay.
- Section 5 unlocks after Dark Field completion.
