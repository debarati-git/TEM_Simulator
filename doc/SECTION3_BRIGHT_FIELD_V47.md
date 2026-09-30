# Section 3 — Bright Field Imaging (v4.7 fresh rebuild)

This build follows the supplied manual-driven Bright Field workflow. Section 2 ends with holder-model selection; Filament ON is not in Section 2.

## Section 3 top-level flow
1. Auto HT: Target 200 kV, Step 0.5 kV, Time/Step 10 s, Start ramp; after target is reached press HT ON.
2. Filament ON; Beam Current rises to approximately 103 µA.
3. Verify V2 OPEN in a temporary/dummy Valve Status panel.
4. Press BEAM on L1.
5. Remove screen cover and use stage X/Y to locate a thin region.
6. Press STD FOCUS on R1.
7. Deliberately set SPOT SIZE and α SELECTOR (manual gives no fixed values here).
8. Select MAG 1 and rotate MAG/CAM L to X40k.
9. Use BRIGHTNESS to reach crossover and then spread illumination.
10. Centre feature, STD FOCUS, adjust Z, MAG WOB X/Y, reduce wobble with Z, then switch wobble OFF. TEMCON Z-sensitivity arrows are optional.
11. Use BRIGHTNESS, SHIFT X and SHIFT Y to centre and spread condenser illumination.
12. Set SPOT SIZE 1, enter COND STIG, vary BRIGHTNESS, correct with DEF/STIG X/Y, verify circular beam, then exit COND STIG.
13. Centre final ROI, select MAG 1, set final magnification with MAG/CAM L, spread beam; AUTO is optional.
14. Press F1, open iTEM, optionally refine OBJ FOCUS, start Video, take Snapshot, press F1 again.

## Panel controls reproduced in simulator-style L1/R1
L1: BEAM, BRIGHTNESS, SPOT SIZE, α SELECTOR, SHIFT X, COND STIG, DEF/STIG X.

R1: F1, MAG 1, MAG 2, LOW MAG, SA MAG, SA DIFF, MAG/CAM L, MAG WOB X, MAG WOB Y, Z UP/DOWN, STD FOCUS, SHIFT Y, DEF/STIG Y, OBJ FOCUS FINE, OBJ FOCUS COARSE, AUTO.

## Temporary visual assets
`assets/images/sop/section3-dummy-bf.png` is a dummy specimen image used for low-mag, alignment, focus and acquisition states. It can be replaced later with actual sample images without changing the control sequence.

V2 Valve Status and iTEM acquisition UI are temporary simulator representations until exact screenshots are supplied.
