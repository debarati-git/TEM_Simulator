# Phase 2 Modifications — In Progress

## Tasks (in build order)
1. [ ] #3 Beam current unlocks at step 8
2. [ ] #4 Voltage gating: nanoparticles → only 200kV
3. [ ] #5 Auto-scroll to active control
4. [ ] #7 "Undo Step" replaces "Restart Section"
5. [ ] #2 Blinking label hotspots
6. [ ] #9 ROI step: only blue circle moves (not sample)
7. [ ] #8 Beam animation on column when beam on
8. [ ] #1 Light theme as default + dark toggle

## Files I'll touch
- data/guided-data.js (step 8 unlocks, ROI behavior)
- assets/js/guided/controls.js (voltage gating, auto-scroll)
- assets/js/guided/guided-controller.js (Undo Step, scroll hook)
- assets/js/guided/diagram.js (label blink)
- assets/js/guided/image-renderer.js (ROI-only behavior)
- assets/css/guided.css (label blink, beam animation, theme)
- assets/css/global.css (theme variables)
- pages/microscope-guided.html (theme toggle, Undo button)

## Sweet spots (locked, do not change)
beamShift_center:    abs(x)<=8 && abs(y)<=8
brightness_diverge:  v>=65 && v<=80
apertureAlign_*:     abs(x)<=8 && abs(y)<=8
stigmator_circular:  abs(x)<=8 && abs(y)<=8
stageZ_eucentric:    abs(v)<=5
stageXY_lowMag:      abs(x-35)<=12 && abs(y-25)<=12
stageXY_medMag:      abs(x-35)<=6  && abs(y-25)<=6
stageXY_highMag:     abs(x-35)<=3  && abs(y-25)<=3
focus_sharp:         abs(v)<=4

## Diagram hotspots
remove-holder/insert-specimen: x=54, y=44, w=14, h=5
insert-condenser:              x=45, y=18, w=10, h=3
insert-objective:              x=45, y=40, w=10, h=3
