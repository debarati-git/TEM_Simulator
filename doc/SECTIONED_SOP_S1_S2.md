# Sectioned IIT SOP workflow — Sections 1 and 2

This build restructures `pages/microscope-iit.html` into seven sequential SOP sections. Sections unlock only after the preceding section is completed.

## Implemented

### Section 1 — Safety Check and Instrument Startup
1. Chiller ON and temperature <= 18 C — replaceable dummy image.
2. Room AC ON and room temperature ~20–22 C — replaceable dummy image.
3. SIP vacuum <= 2.5 x 10^-5 Pa — replaceable dummy image.
4. TEMCON PC drawer auto-opens; HT READY and HT OFF are highlighted; confirmation modal required.
5. Liquid nitrogen / anti-contamination trap check.
6. Short simulated stabilization indicator. This is explicitly labelled as a simulator check, not the real warm-up period.
7. Startup logbook with date, time and required operator name.

### Section 2 — Specimen Loading and Holder Insertion
1. O-ring inspection close-up.
2. Goniometer green-lamp verification using the existing reference asset.
3. Sequential cartridge interaction: open, place grid sample-side up, close retaining clip.
4. Drag holder to first mechanical stop; three synthesized mechanical clicks play with spacing.
5. Set PUMP/AIR to PUMP; amber lamp turns on and synthesized pumping sound starts.
6. Timed evacuation state; pumping sound continues until amber lamp turns off.
7. Holder rotation control requires 15 degrees first, then 75 degrees clockwise, then full seating.
8. Mouse-draggable JEOL SPEC CONTROL trackball demonstrates stage response; confirmation modal completes the section.

## Placeholder sections
- Section 3 — Bright Field Imaging
- Section 4 — Dark Field Imaging
- Section 5 — Selected Area Electron Diffraction (SAED) Mode
- Section 6 — High-Resolution TEM (HRTEM) Imaging Mode
- Section 7 — Instrument Shutdown

Section 3 unlocks after Section 2 but contains only a placeholder until its operating procedure is supplied. Sections 4–7 remain locked sequentially.

## Replaceable dummy assets
- `assets/images/sop/dummy-chiller.svg`
- `assets/images/sop/dummy-room-ac.svg`
- `assets/images/sop/dummy-sip-vacuum.svg`

They can be replaced later without changing the workflow logic, provided the filenames are retained.

## Instruction pacing refinement
- Sample selection now starts Section 1 Step 1 after a short ~0.3 s handoff.
- Automatic step-modal handoffs wait ~3.5 s so the instruction bar can be read before the modal appears.
- Section 1 Step 4 leaves the TEMCON drawer unobstructed for ~7 s before its HT confirmation modal appears.
- Section 1 instruction hints are suppressed and orange modal-note callouts were removed; HT emphasis uses the blue signal accent.
- The instruction bar uses a high-visibility blinking blue dot to indicate the active instruction.
