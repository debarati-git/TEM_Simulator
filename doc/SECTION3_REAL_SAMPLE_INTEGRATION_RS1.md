# Section 3 Real-Sample Bright Field Integration — RS1

This build integrates the 12 supplied real TEM micrographs (Tv1–Tv12) into Section 3 while preserving the existing guided controls and Section 4 Dark Field simulation.

## Real image mapping
- Tv2 (200×): initial LOW MAG grid overview.
- Tv1 (500×): closer survey-grid state.
- Tv3 → Tv4 → Tv5 (8000×): stage-trackball specimen search from empty field to edge to useful thin region.
- Tv6 → Tv7 (50000×): higher-magnification specimen state used for MAG 1, Z correction, condenser/aperture/beam alignment, and ROI centering.
- Tv8–Tv12 (60000×): final real-sample acquisition family. Tv11 is used for the AUTO-contrast state; Tv9/Tv10/Tv12/Tv8 form the camera/live-view sequence; Tv8 is the frozen final snapshot.

## Interactive behavior
- Stage X/Y translates the real micrograph and can switch between the real search frames as the target region is approached.
- Z correction and MAG WOB X/Y oscillate the real specimen image itself; amplitude decreases toward the eucentric condition.
- Focus controls apply blur to the real specimen/camera view.
- BRIGHTNESS, condenser aperture centering, SHIFT, and condenser-stigmatism steps retain their simulator beam/illumination overlays over the real specimen.
- AUTO contrast acts on the real sample and uses the supplied higher-contrast real frame.
- The final acquisition exercise is set to X60k so the simulator magnification matches the supplied 60000× acquisition images.
- iTEM camera steps use the real image sequence for focus touch-up, live Video, and Snapshot.

## Dark Field handling
None of Tv1–Tv12 is labelled or treated as a genuine Dark Field micrograph. Section 4 retains its simulated Dark Field source/processing and does not use the uploaded real-sample bank as an experimental DF capture.
