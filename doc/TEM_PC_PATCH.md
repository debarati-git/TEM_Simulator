# Module 2 JEOL TEM PC Patch

This patch reconstructs the Module 2 TEM control drawer in a legacy JEOL JEM-2100 / TEMCON-inspired Windows interface based on the supplied manual screenshots.

## Files changed

- `pages/microscope-guided.html`
- `assets/js/guided/pc-drawer.js`

## Files added

- `assets/css/module2-tem-pc.css`
- `assets/images/microscope/pc/jeol-tem-operation-reference.png`

## Functional behaviour retained

- Guided drawer opening and closing
- Holder-type selection
- Stage neutralisation
- Vacuum-ready indication
- Live accelerating-voltage, beam, stage, imaging-mode and focus readouts
- Camera software drawer
- Existing guided control locking and success validation

The Standard and Stage pages are functional tabs. Guided steps 1, 2 and 6 automatically show the Stage page because those steps use holder, stage and vacuum functions.
