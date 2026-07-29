# Module 2 Camera, Wobbler and Guidance Patch

This update adds four linked improvements to the guided JEOL JEM-2100 simulator.

## 1. Camera workstation reconstruction

The camera drawer now uses a legacy scientific imaging-workstation layout with:

- DigitalMicrograph-style title bar, menu bar and toolbar
- Large live-image window
- Camera, fluorescent-screen and live-view status fields
- Exposure, binning and readout indications
- Histogram and live FFT palettes
- Classic bevelled workstation controls
- Live status and acquisition messages

The existing guided controls and state keys are retained.

## 2. Clear stage-Z wobble response

When Image Wobble X is active:

- large absolute stage-Z error produces large lateral movement
- movement decreases as stage Z approaches eucentric height
- movement increases again after passing the correct height
- ghosted image extremes reinforce the oscillation
- a visible amplitude meter reports HIGH, MEDIUM, LOW or MINIMUM movement

The display does not tell the learner which Z direction to choose; the learner must observe whether movement improves.

## 3. Drawer heading cleanup

The former step-specific suffix was removed. The drawer title now remains a normal software title.

## 4. Guided pointing cues

- A large animated pointing hand appears beside the active instruction.
- The current target control receives an amber outline and pointing-hand locator.
- Diagram INSERT/REMOVE actions receive the same visible locator.
- The locator advances to the next unfinished control in multi-action camera steps.
