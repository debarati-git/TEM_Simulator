# RS8 — Professor-video phosphor and camera behavior

This patch is based on the supplied professor demonstration video and keeps the approved RS7 SOP/control workflow intact.

## Section 3 changes

- Restored the physical fluorescent-screen behavior after BEAM ON.
- BEAM ON now transitions from a dark viewing chamber to green phosphor illumination instead of jumping to a clean grayscale micrograph.
- BRIGHTNESS/C2 now has a non-linear visual response: a small bright white-green crossover expands into a broad green illuminated field.
- Real Bright Field specimen images remain in use, but on the physical viewing screen they are rendered as specimen contrast within the illuminated phosphor field.
- The specimen and the beam are separated into different rendering layers: specimen-stage motion moves the specimen while the beam remains tied to the optical axis.
- Condenser astigmatism continues to alter beam ellipticity; beam shift/aperture alignment continues to move the illuminated field.
- F1 Screen UP immediately removes the green physical-screen image and shows a dark physical viewing screen before the camera workflow begins.
- The iTEM/DigitalMicrograph camera view remains grayscale and now keeps the Live FFT pane active during the local Section 3 acquisition flow.
- F1 Screen DOWN briefly restores the green physical fluorescent-screen view before Section 3 completes.

## Preserved behavior

- RS7 TEMCON scrolling and interactive menus.
- Section 1 and Section 2 workflow and success criteria.
- Section 3 step order, control gating, stage navigation, focus, Z/wobble, condenser aperture, condenser stigmation, and final acquisition logic.
- Section 4 Dark Field implementation and later sections.
