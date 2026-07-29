/* =========================================================================
   TEM Simulator — Guided steps data  (v2.0, 35 steps)
   Panel-faithful flow per Debarati's operating procedure.
   ========================================================================= */
(function () {
  'use strict';
  window.TEM = window.TEM || {};

  window.TEM.dataGuidedSteps = {
    sample: 'nanoparticles',
    totalSteps: 35,
    steps: [
      // ===== PHASE 1: SETUP (1–8) =====
      {
        id: 1,
        instruction: 'Select the holder type. Use Single Tilt for routine nanoparticle imaging.',
        hint: 'Open the PC drawer and choose Single Tilt.',
        unlocks: ['holder-type'],
        pcDrawer: 'tem',
        success: { type: 'selectValue', key: 'holderType', value: 'single-tilt' }
      },
      {
        id: 2,
        instruction: 'Click Stage Neutralize to return the stage to a safe insertion position.',
        hint: 'Press the Neutralize button in the PC drawer.',
        unlocks: ['stage-neutralize'],
        pcDrawer: 'tem',
        success: { type: 'selectValue', key: 'stageNeutralized', value: true }
      },
      {
        id: 3,
        instruction: 'Click REMOVE on the specimen holder in the column diagram to take out the empty holder.',
        hint: 'The holder hotspot on the column is highlighted — click it.',
        unlocks: [],
        diagram: 'remove-holder',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'holderRemoved', value: true }
      },
      {
        id: 4,
        instruction: 'Select Nanoparticles from the sample list.',
        hint: 'Under Sample on the right panel, press Nanoparticles.',
        unlocks: ['sample'],
        success: { type: 'selectValue', key: 'sample', value: 'nanoparticles' }
      },
      {
        id: 5,
        instruction: 'Click INSERT on the column diagram to load the specimen into the airlock.',
        hint: 'The specimen hotspot on the column is highlighted.',
        unlocks: [],
        diagram: 'insert-specimen',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'specimenInsertedDiagram', value: true }
      },
      {
        id: 6,
        instruction: 'The airlock pumps automatically. Wait for vacuum ready.',
        hint: null,
        unlocks: [],
        autoAdvance: 2200,
        onEnter: 'autoAirlock',
        pcDrawer: 'tem',
        success: { type: 'selectValue', key: 'airlockPumped', value: true }
      },
      {
        id: 7,
        instruction: 'Click INSERT under Holder on the right panel to push the specimen into the column.',
        hint: 'Under Sample, press Holder Insert.',
        unlocks: ['specimen-insert'],
        success: { type: 'selectValue', key: 'specimenInsertedPanel', value: true }
      },
      {
        id: 8,
        instruction: 'Select the accelerating voltage. Use 200 kV for nanoparticle samples.',
        hint: 'Press 200 kV under Acc. Voltage.',
        unlocks: ['acc-voltage'],
        success: { type: 'selectValue', key: 'accVoltage', value: 200 }
      },

      // ===== PHASE 2: BEAM ON & ALIGNMENT (9–17) =====
      {
        id: 9,
        instruction: 'Switch the beam ON on the left panel.',
        hint: 'Press Beam On.',
        unlocks: ['beam-on'],
        pcDrawer: 'tem',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'beamOn', value: true }
      },
      {
        id: 10,
        instruction: 'The beam appears off-center. Set DEF/STIG mode to SHIFT and centre the beam using the trackpad.',
        switchViewer: 'screen',
        hint: 'Press Shift under DEF/STIG Mode, then drag the pad to centre.',
        unlocks: ['def-stig-mode', 'def-stig-pad', 'beam-current'],
        prelude: {
          offsets: [
            { offset: 'beamShift', amount: { x: -22, y: 18 } },
            { offset: 'condStig', amount: { x: 32, y: 38 } }
          ]
        },
        success: {
          type: 'composite',
          all: [
            { type: 'selectValue', key: 'defStigMode', value: 'shift' },
            { type: 'valueInRange', key: 'beamShift', spot: 'beamShift_center' }
          ]
        }
      },
      {
        id: 11,
        instruction: 'Diverge the beam to fill the field of view using the Brightness knob.',
        hint: 'Turn Brightness clockwise to around 70.',
        unlocks: ['brightness'],
        success: { type: 'valueInRange', key: 'brightness', spot: 'brightness_diverge' }
      },
      {
        id: 12,
        instruction: 'Select Condenser as the aperture type.',
        hint: 'Under Apertures on the right panel, press Cond.',
        unlocks: ['aperture-select'],
        success: { type: 'selectValue', key: 'currentAperture', value: 'condenser' }
      },
      {
        id: 13,
        instruction: 'Click INSERT on the condenser aperture in the column diagram.',
        hint: 'The condenser aperture hotspot is highlighted.',
        unlocks: [],
        diagram: 'insert-condenser',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'condenserInserted', value: true }
      },
      {
        id: 14,
        instruction: 'Select a Medium aperture size.',
        hint: 'Press M under Aperture Size.',
        unlocks: ['aperture-size'],
        switchViewer: 'screen',
        success: { type: 'selectValue', key: 'condenserSize', value: 'medium' }
      },
      {
        id: 15,
        instruction: 'Centre the condenser aperture using the Aperture Alignment trackpad.',
        hint: 'Drag the alignment dot to the centre of the pad.',
        unlocks: ['aperture-align'],
        prelude: { offset: 'apertureAlignment', amount: { x: 26, y: -19 } },
        success: { type: 'valueInRange', key: 'apertureAlignment', spot: 'apertureAlign_cond' }
      },
      {
        id: 16,
        instruction: 'Switch DEF/STIG to C.STIG and correct condenser astigmatism to make the beam circular.',
        hint: 'Press C.Stig, then drag the DEF/STIG pad toward centre.',
        unlocks: ['def-stig-mode', 'def-stig-pad'],
        success: {
          type: 'composite',
          all: [
            { type: 'selectValue', key: 'defStigMode', value: 'condStig' },
            { type: 'valueInRange', key: 'condStig', spot: 'stigmator_circular' }
          ]
        }
      },
      {
        id: 17,
        instruction: 'Re-diverge the beam with the Brightness knob.',
        hint: 'Turn Brightness back to the 65–80 range.',
        unlocks: ['brightness'],
        prelude: { set: { key: 'brightness', value: 45 } },
        success: { type: 'valueInRange', key: 'brightness', spot: 'brightness_diverge' }
      },

      // ===== PHASE 3: FIND SAMPLE & EUCENTRIC HEIGHT (18–22) =====
      {
        id: 18,
        instruction: 'Set magnification to LOW to find the sample.',
        hint: 'Under Magnification on the right panel, press Low.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'low' }
      },
      {
        id: 19,
        instruction: 'Press Standard Focus to reset the objective lens.',
        hint: 'Press Std Focus Reset on the right panel.',
        unlocks: ['std-focus'],
        success: { type: 'selectValue', key: 'stdFocusReset', value: true }
      },
      {
        id: 20,
        instruction: 'Turn the Wobbler ON to find eucentric height.',
        hint: 'Press Wobble X.',
        unlocks: ['wobbler'],
        success: { type: 'selectValue', key: 'wobblerOn', value: true }
      },
      {
        id: 21,
        instruction: 'Adjust Z while observing the phosphor screen. The lateral image swing should shrink near eucentric height and grow when moving away.',
        hint: 'Use +Z / −Z and continue in the direction that reduces the displayed wobble amplitude.',
        unlocks: ['stage-z'],
        prelude: { set: { key: 'stageZ', value: 22 } },
        success: { type: 'valueInRange', key: 'stageZ', spot: 'stageZ_eucentric' }
      },
      {
        id: 22,
        instruction: 'Eucentric height found. Turn the Wobbler OFF.',
        hint: 'Press Wobble X again.',
        unlocks: ['wobbler'],
        success: { type: 'selectValue', key: 'wobblerOn', value: false }
      },

      // ===== PHASE 4: OBJECTIVE APERTURE ALIGNMENT (23–27) =====
      {
        id: 23,
        instruction: 'Switch to DIFF mode on the right panel.',
        hint: 'Press DIFF under Imaging Mode.',
        unlocks: ['imaging-mode'],
        success: { type: 'selectValue', key: 'imagingMode', value: 'diff' }
      },
      {
        id: 24,
        instruction: 'Select Objective as the aperture type.',
        hint: 'Under Apertures, press Obj.',
        unlocks: ['aperture-select'],
        success: { type: 'selectValue', key: 'currentAperture', value: 'objective' }
      },
      {
        id: 25,
        instruction: 'Click INSERT on the objective aperture in the column diagram.',
        hint: 'The objective aperture hotspot is highlighted.',
        unlocks: [],
        diagram: 'insert-objective',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'objectiveInserted', value: true }
      },
      {
        id: 26,
        instruction: 'Centre the objective aperture using the Aperture Alignment trackpad.',
        hint: 'Drag the alignment dot to the centre.',
        unlocks: ['aperture-align'],
        switchViewer: 'screen',
        prelude: { offset: 'apertureAlignment', amount: { x: -28, y: 22 } },
        success: { type: 'valueInRange', key: 'apertureAlignment', spot: 'apertureAlign_obj' }
      },
      {
        id: 27,
        instruction: 'Switch back to MAG1 imaging mode.',
        hint: 'Press MAG1 under Imaging Mode.',
        unlocks: ['imaging-mode'],
        success: { type: 'selectValue', key: 'imagingMode', value: 'mag1' }
      },

      // ===== PHASE 5: IMAGE ACQUISITION (28–35) =====
      {
        id: 28,
        instruction: 'Move the stage to the region of interest (blue circle).',
        hint: 'Drag the Stage X/Y pad toward the target.',
        unlocks: ['stage-xy'],
        roiTarget: { x: 35, y: 25 },
        success: { type: 'valueInRange', key: 'stage', spot: 'stageXY_lowMag' }
      },
      {
        id: 29,
        instruction: 'Increase magnification to MEDIUM.',
        hint: 'Press Med under Magnification.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'medium' }
      },
      {
        id: 30,
        instruction: 'Recentre on the region of interest at medium magnification.',
        hint: 'Drag the stage to bring the blue circle to centre.',
        unlocks: ['stage-xy'],
        roiTarget: { x: 35, y: 25 },
        prelude: { offset: 'stage', amount: { x: -10, y: 8 } },
        success: { type: 'valueInRange', key: 'stage', spot: 'stageXY_medMag' }
      },
      {
        id: 31,
        instruction: 'Increase magnification to HIGH.',
        hint: 'Press High under Magnification.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'high' }
      },
      {
        id: 32,
        instruction: 'Focus the image. Use the Coarse focus first, then Fine focus for sharpness.',
        hint: 'Turn the focus knobs until the image is sharp — aim for near zero.',
        unlocks: ['focus-coarse', 'focus-fine'],
        prelude: { set: { key: 'focusCoarse', value: 18 } },
        success: {
          type: 'composite',
          all: [
            { type: 'selectValue', key: 'focusCoarseAdjusted', value: true },
            { type: 'valueInRange', key: 'focusCoarse', spot: 'focus_sharp' },
            { type: 'selectValue', key: 'focusFineAdjusted', value: true },
            { type: 'valueInRange', key: 'focusFine', spot: 'focus_sharp' }
          ]
        }
      },
      {
        id: 33,
        instruction: 'Insert the camera, start Live View, and raise the screen.',
        hint: 'In the Camera drawer: Insert → Live → Raise Screen.',
        unlocks: ['camera-insert', 'live-view', 'screen-raise'],
        pcDrawer: 'cam',
        success: {
          type: 'composite',
          all: [
            { type: 'selectValue', key: 'cameraInserted', value: true },
            { type: 'selectValue', key: 'cameraLiveView', value: true },
            { type: 'selectValue', key: 'screenRaised', value: true }
          ]
        }
      },
      {
        id: 34,
        instruction: 'Switch DEF/STIG to O.STIG and correct objective astigmatism while watching the FFT — make the rings round.',
        hint: 'Press O.Stig, then drag the DEF/STIG pad until FFT rings are circular.',
        unlocks: ['def-stig-mode', 'def-stig-pad'],
        pcDrawer: 'cam',
        prelude: { offset: 'objStig', amount: { x: -20, y: 18 } },
        success: {
          type: 'composite',
          all: [
            { type: 'selectValue', key: 'defStigMode', value: 'objStig' },
            { type: 'valueInRange', key: 'objStig', spot: 'objStig_round' }
          ]
        }
      },
      {
        id: 35,
        instruction: 'Press ACQUIRE to capture and download the image.',
        hint: 'Press Acquire in the Camera drawer.',
        unlocks: ['acquire'],
        pcDrawer: 'cam',
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
      objStig_round:      { predicate: 'abs(x) <= 12 && abs(y) <= 12' },
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
        scales: { low: 0.25, medium: 0.55, high: 1.0 }
      }
    },
    diagramHotspots: {
      'remove-holder':    { x: 47.0, y: 33.5, w: 12.0, h: 8.2, actionPos: { x: 68.5, y: 34.4, w: 13.0, h: 3.8 }, labelText: 'Specimen holder', action: 'Remove' },
      'insert-specimen':  { x: 47.0, y: 33.5, w: 12.0, h: 8.2, actionPos: { x: 68.5, y: 34.4, w: 13.0, h: 3.8 }, labelText: 'Specimen holder', action: 'Insert' },
      'insert-condenser': { x: 37.5, y: 24.6, w: 12.2, h: 7.2, actionPos: { x: 14.0, y: 29.4, w: 12.0, h: 3.8 }, labelText: 'Condenser aperture', action: 'Insert' },
      'insert-objective': { x: 46.6, y: 43.6, w: 12.2, h: 7.0, actionPos: { x: 68.5, y: 45.8, w: 13.0, h: 3.8 }, labelText: 'Objective aperture', action: 'Insert' }
    }
  };
})();
