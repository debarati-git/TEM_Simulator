/* =========================================================================
   TEM Simulator — Guided steps data (37 steps, MyScope-faithful)
   Loaded as a JS file so it works under file:// without fetch.
   ========================================================================= */
(function () {
  'use strict';
  window.TEM = window.TEM || {};

  /* The 37-step canonical flow for the Nanoparticles sample. Each step has:
       id           — sequential
       instruction  — what the user sees
       hint         — shown after 3s of inactivity
       unlocks      — which .ctl[data-control] elements become interactive
       success      — condition that advances to the next step
       diagram      — id of column hotspot to highlight, or null
       autoAdvance  — true if step should advance after a delay with no input
       switchViewer — auto-switch to 'column' or 'screen' on entry
  */
  window.TEM.dataGuidedSteps = {
    sample: 'nanoparticles',
    totalSteps: 32,
    steps: [
      // ----- Setup (1-7) -----
      {
        id: 1,
        instruction: 'Click REMOVE on the specimen holder in the column diagram.',
        hint: 'The holder hotspot on the column is highlighted — click it.',
        unlocks: [],
        diagram: 'remove-holder',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'holderRemoved', value: true }
      },
      {
        id: 2,
        instruction: 'Select Nanoparticles from the sample list.',
        hint: 'Under Gun & Vacuum, press Nanoparticles.',
        unlocks: ['sample'],
        success: { type: 'selectValue', key: 'sample', value: 'nanoparticles' }
      },
      {
        id: 3,
        instruction: 'Click INSERT on the column diagram to load the specimen.',
        hint: 'The specimen hotspot on the column is highlighted.',
        unlocks: [],
        diagram: 'insert-specimen',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'specimenInsertedDiagram', value: true }
      },
      {
        id: 4,
        instruction: 'Holder repositions and the airlock pumps automatically.',
        hint: null,
        unlocks: [],
        autoAdvance: 2200,
        onEnter: 'autoAirlock',
        success: { type: 'selectValue', key: 'airlockPumped', value: true }
      },
      {
        id: 5,
        instruction: 'Click INSERT under Specimen on the control panel to push the specimen into the column.',
        hint: 'Under Gun & Vacuum, press Specimen Insert.',
        unlocks: ['specimen-insert'],
        success: { type: 'selectValue', key: 'specimenInsertedPanel', value: true }
      },
      {
        id: 6,
        instruction: 'Select the accelerating voltage. Use 200 kV for nanoparticle samples.',
        hint: 'Press 200 kV under Acc. Voltage. (120 kV is for biological samples.)',
        unlocks: ['acc-voltage'],
        success: { type: 'selectValue', key: 'accVoltage', value: 200 }
      },
      {
        id: 7,
        instruction: 'Switch the beam ON.',
        hint: 'Press the Beam On button.',
        unlocks: ['beam-on'],
        switchViewer: 'screen',
        success: { type: 'selectValue', key: 'beamOn', value: true }
      },

      // ----- Beam alignment (8-15) -----
      {
        id: 8,
        instruction: 'The beam appears on the screen. Centre it using the Beam Shift trackpad.',
        hint: 'Drag the Beam Shift dot toward the centre of its trackpad.',
        unlocks: ['beam-shift'],
        prelude: { offset: 'beamShift', amount: { x: -22, y: 18 } },
        success: { type: 'valueInRange', key: 'beamShift', spot: 'beamShift_center' }
      },
      {
        id: 9,
        instruction: 'Diverge the beam to cover the full field of view using the Brightness knob.',
        hint: 'Turn Brightness clockwise to around 70.',
        unlocks: ['brightness'],
        success: { type: 'valueInRange', key: 'brightness', spot: 'brightness_diverge' }
      },
      {
        id: 10,
        instruction: 'Select Condenser as the aperture type.',
        hint: 'Under Apertures, press Cond.',
        unlocks: ['aperture-select'],
        success: { type: 'selectValue', key: 'currentAperture', value: 'condenser' }
      },
      {
        id: 11,
        instruction: 'Click INSERT on the condenser aperture in the column diagram.',
        hint: 'The condenser aperture hotspot is highlighted.',
        unlocks: [],
        diagram: 'insert-condenser',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'condenserInserted', value: true }
      },
      {
        id: 12,
        instruction: 'Select an aperture size. Medium is a good starting choice.',
        hint: 'Press M under Aperture Size.',
        unlocks: ['aperture-size'],
        switchViewer: 'screen',
        success: { type: 'selectValue', key: 'condenserSize', value: 'medium' }
      },
      {
        id: 13,
        instruction: 'Centre the condenser aperture using the Aperture Alignment trackpad.',
        hint: 'Drag the alignment dot to the centre of the pad.',
        unlocks: ['aperture-align'],
        prelude: { offset: 'apertureAlignment', amount: { x: 26, y: -19 } },
        success: { type: 'valueInRange', key: 'apertureAlignment', spot: 'apertureAlign_cond' }
      },
      {
        id: 14,
        instruction: 'Adjust the Stigmator to make the beam circular.',
        hint: 'Drag the Stigmator dot toward (0,0) to round the beam.',
        unlocks: ['stigmator'],
        prelude: { offset: 'stigmator', amount: { x: -24, y: 20 } },
        success: { type: 'valueInRange', key: 'stigmator', spot: 'stigmator_circular' }
      },
      {
        id: 15,
        instruction: 'Re-diverge the beam with the Brightness knob.',
        hint: 'Turn Brightness back to the 65–80 range.',
        unlocks: ['brightness'],
        prelude: { set: { key: 'brightness', value: 45 } },
        success: { type: 'valueInRange', key: 'brightness', spot: 'brightness_diverge' }
      },

      // ----- Find sample (16-19) -----
      {
        id: 16,
        instruction: 'Set magnification to LOW to find the sample.',
        hint: 'Under Imaging > Magnification, press Low.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'low' }
      },
      {
        id: 17,
        instruction: 'Activate the Wobbler to find the eucentric height.',
        hint: 'Press Wobbler Toggle.',
        unlocks: ['wobbler'],
        success: { type: 'selectValue', key: 'wobblerOn', value: true }
      },
      {
        id: 18,
        instruction: 'Adjust Z height to minimise the wobble.',
        hint: 'Use the +Z / −Z rocker to bring Z close to zero.',
        unlocks: ['stage-z'],
        prelude: { set: { key: 'stageZ', value: 22 } },
        success: { type: 'valueInRange', key: 'stageZ', spot: 'stageZ_eucentric' }
      },
      {
        id: 19,
        instruction: 'Eucentric height found. Deactivate the Wobbler.',
        hint: 'Press Wobbler Toggle again.',
        unlocks: ['wobbler'],
        success: { type: 'selectValue', key: 'wobblerOn', value: false }
      },

      // ----- Objective alignment (20-24) -----
      {
        id: 20,
        instruction: 'Switch to Diffraction mode.',
        hint: 'Under Imaging > Mode, press Diffraction.',
        unlocks: ['mode'],
        success: { type: 'selectValue', key: 'mode', value: 'diffraction' }
      },
      {
        id: 21,
        instruction: 'Select Objective as the aperture type.',
        hint: 'Under Apertures, press Obj.',
        unlocks: ['aperture-select'],
        success: { type: 'selectValue', key: 'currentAperture', value: 'objective' }
      },
      {
        id: 22,
        instruction: 'Click INSERT on the objective aperture in the column diagram.',
        hint: 'The objective aperture hotspot is highlighted on the column.',
        unlocks: [],
        diagram: 'insert-objective',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'objectiveInserted', value: true }
      },
      {
        id: 23,
        instruction: 'Centre the objective aperture using the Aperture Alignment trackpad.',
        hint: 'Drag the alignment dot to the centre.',
        unlocks: ['aperture-align'],
        switchViewer: 'screen',
        prelude: { offset: 'apertureAlignment', amount: { x: -28, y: 22 } },
        success: { type: 'valueInRange', key: 'apertureAlignment', spot: 'apertureAlign_obj' }
      },
      {
        id: 24,
        instruction: 'Switch back to Imaging mode.',
        hint: 'Under Imaging > Mode, press Imaging.',
        unlocks: ['mode'],
        success: { type: 'selectValue', key: 'mode', value: 'imaging' }
      },

      // ----- Image acquisition (25-32) -----
      {
        id: 25,
        instruction: 'Move the stage to the region of interest (blue circle).',
        hint: 'Drag the Stage X/Y dot toward the upper-right.',
        unlocks: ['stage-xy'],
        roiTarget: { x: 35, y: 25 },
        success: { type: 'valueInRange', key: 'stage', spot: 'stageXY_lowMag' }
      },
      {
        id: 26,
        instruction: 'Increase magnification to MEDIUM.',
        hint: 'Under Magnification, press Med.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'medium' }
      },
      {
        id: 27,
        instruction: 'Recentre on the region of interest at medium magnification.',
        hint: 'Drag the stage to bring the blue circle to centre.',
        unlocks: ['stage-xy'],
        roiTarget: { x: 35, y: 25 },
        prelude: { offset: 'stage', amount: { x: -10, y: 8 } },
        success: { type: 'valueInRange', key: 'stage', spot: 'stageXY_medMag' }
      },
      {
        id: 28,
        instruction: 'Increase magnification to HIGH.',
        hint: 'Under Magnification, press High.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'high' }
      },
      {
        id: 29,
        instruction: 'Recentre on the region of interest at high magnification.',
        hint: 'Fine-tune the stage so the blue circle is centred.',
        unlocks: ['stage-xy'],
        roiTarget: { x: 35, y: 25 },
        prelude: { offset: 'stage', amount: { x: -6, y: 5 } },
        success: { type: 'valueInRange', key: 'stage', spot: 'stageXY_highMag' }
      },
      {
        id: 30,
        instruction: 'Focus the image using the Objective Lens Focus knob.',
        hint: 'Turn Focus slowly until the image sharpens — aim for near zero.',
        unlocks: ['focus'],
        prelude: { set: { key: 'focus', value: 18 } },
        success: { type: 'valueInRange', key: 'focus', spot: 'focus_sharp' }
      },
      {
        id: 31,
        instruction: 'Insert the camera to prepare for acquisition.',
        hint: 'Under Capture, press Camera Insert.',
        unlocks: ['camera-insert'],
        success: { type: 'selectValue', key: 'cameraInserted', value: true }
      },
      {
        id: 32,
        instruction: 'Press ACQUIRE & DOWNLOAD to save the image.',
        hint: 'Final step — press the Acquire button.',
        unlocks: ['acquire'],
        success: { type: 'selectValue', key: 'imageAcquired', value: true }
      }
    ]
  };

  window.TEM.dataGuidedConfig = {
    sweetSpots: {
      beamShift_center:   { predicate: 'abs(x) <= 12 && abs(y) <= 12' },
      brightness_diverge: { predicate: 'v >= 65 && v <= 80' },
      apertureAlign_cond: { predicate: 'abs(x) <= 12 && abs(y) <= 12' },
      stigmator_circular: { predicate: 'abs(x) <= 12 && abs(y) <= 12' },
      stageZ_eucentric:   { predicate: 'abs(v) <= 5' },
      apertureAlign_obj:  { predicate: 'abs(x) <= 12 && abs(y) <= 12' },
      stageXY_lowMag:     { predicate: 'abs(x - 35) <= 15 && abs(y - 25) <= 15' },
      stageXY_medMag:     { predicate: 'abs(x - 35) <= 8 && abs(y - 25) <= 8' },
      stageXY_highMag:    { predicate: 'abs(x - 35) <= 5 && abs(y - 25) <= 5' },
      focus_sharp:        { predicate: 'abs(v) <= 5' }
    },
    hints: { wrongValueDelayMs: 3000 },
    samples: {
      nanoparticles: {
        image: '../assets/images/microscope/samples/nanoparticles/nanoparticles.png',
        // Scale factor applied at each mag level. Lower scale = more particles
        // visible (zoomed out). The base image is "high mag" — 1.0.
        scales: { low: 0.25, medium: 0.55, high: 1.0 }
      }
    },
    diagramHotspots: {
      'remove-holder':    { x: 54, y: 44, w: 14, h: 5,  label: 'Remove Holder' },
      'insert-specimen':  { x: 54, y: 44, w: 14, h: 5,  label: 'Insert Specimen' },
      'insert-condenser': { x: 45, y: 18, w: 10, h: 3,  label: 'Insert Condenser Aperture' },
      'insert-objective': { x: 45, y: 40, w: 10, h: 3,  label: 'Insert Objective Aperture' }
    }
  };
})();
