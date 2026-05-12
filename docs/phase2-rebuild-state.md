# Phase 2 Rebuild — Where We Are

## What's done in this rebuild pass
- Confirmed headless: 33-step flow advances correctly through objective-aperture selection.
- The user's bug ("stuck after selecting objective aperture") therefore is a UI-layer issue, not state logic.

## What I'm doing now (in order)
1. Adding missing MyScope controls (STD FOCUS, Very High mag, Specimen Tilt Tx/Ty, TEM/STEM toggle, STEM Dark/Bright + Spot/Raster, Projector Lens Alignment XY, FFT toggle, Lens selector, Restart Section button).
2. Removing auto-advance from step 8 (descriptive "beam appears" step).
3. Merging descriptive steps into following action steps (33 → ~26 steps).
4. Re-verifying with REAL CLICKS not state mutations to expose any UI bug.

## Sweet spots (locked, don't change)
beamShift_center:    abs(x)<=8 && abs(y)<=8
brightness_diverge:  v>=65 && v<=80
apertureAlign_*:     abs(x)<=8 && abs(y)<=8
stigmator_circular:  abs(x)<=8 && abs(y)<=8
stageZ_eucentric:    abs(v)<=5
stageXY_lowMag:      abs(x-35)<=12 && abs(y-25)<=12
stageXY_medMag:      abs(x-35)<=6  && abs(y-25)<=6
stageXY_highMag:     abs(x-35)<=3  && abs(y-25)<=3
focus_sharp:         abs(v)<=4

## Diagram hotspot coordinates (calibrated for 975x1510 image)
remove-holder/insert-specimen: x=54, y=44, w=14, h=5
insert-condenser:              x=45, y=18, w=10, h=3
insert-objective:              x=45, y=40, w=10, h=3
