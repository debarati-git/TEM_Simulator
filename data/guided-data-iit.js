/* =========================================================================
   TEM Simulator — Guided steps data  (v4.1, 44 steps)
   IIT SOP flow per Adem Ahmed Aliy & Sakshi Nigavekar operating procedures
   and meeting notes from IIT Hyderabad.
   Specimen loading expanded to match JEOL JEM-2100 goniometer procedure.
   ========================================================================= */
(function () {
  'use strict';
  window.TEM = window.TEM || {};

  window.TEM.dataGuidedSteps = {
    sample: null,
    totalSteps: 44,
    steps: [
      // ===== PHASE 0: PRE-FLIGHT CHECKS (1–4) — shown in modal overlay =====
      {
        id: 1,
        instruction: 'Check that the column vacuum is good. Click Column Vacuum in the checklist to confirm.',
        hint: 'Click the Column Vacuum row in the pre-flight checklist.',
        unlocks: ['preflight-vacuum'],
        onEnter: 'openPreflightModal',
        success: { type: 'selectValue', key: 'preflightVacuum', value: true }
      },
      {
        id: 2,
        instruction: 'Verify the Sputter Ion Pump (SIP) LED is green. Click the SIP row to confirm.',
        hint: 'Click the SIP Gauge LED row in the checklist.',
        unlocks: ['preflight-sip'],
        success: { type: 'selectValue', key: 'preflightSIP', value: true }
      },
      {
        id: 3,
        instruction: 'Ramp the High Voltage to 200 kV. Click the HV row — the ramp animation will run automatically.',
        hint: 'Click the High Voltage Ramp row in the checklist.',
        unlocks: ['preflight-hv'],
        success: { type: 'selectValue', key: 'preflightHV', value: true }
      },
      {
        id: 4,
        instruction: 'Fill liquid nitrogen in the Anti-Contamination Device (ACD). Click the ACD row to confirm.',
        hint: 'Click the ACD Liquid Nitrogen row in the checklist.',
        unlocks: ['preflight-acd'],
        success: { type: 'selectValue', key: 'preflightACD', value: true }
      },

      // ===== PHASE 1: HOLDER LOADING (5–16) =====
      {
        id: 5,
        instruction: 'Click Stage Neutralize to return the stage to a safe insertion position. Always neutralize before loading or removing a holder.',
        hint: 'Press the Neutralize button in the PC drawer.',
        unlocks: ['stage-neutralize'],
        pcDrawer: 'tem',
        pcTab: 'stage',
        success: { type: 'selectValue', key: 'stageNeutralized', value: true }
      },
      {
        id: 6,
        instruction: 'Click REMOVE on the specimen holder in the column diagram. The previous user may have left a holder inside.',
        hint: 'The holder hotspot on the column is highlighted — click it.',
        unlocks: [],
        diagram: 'remove-holder',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'holderRemoved', value: true }
      },
      {
        id: 7,
        instruction: 'Inspect the holder O-rings for damage, dust, or old grease. Click Inspect O-rings in the specimen loading checklist to confirm.',
        hint: 'Click the Inspect O-rings row in the specimen loading checklist.',
        unlocks: ['oring-inspect'],
        onEnter: 'openSpecimenModal',
        success: { type: 'selectValue', key: 'oringInspected', value: true }
      },
      {
        id: 8,
        instruction: 'Confirm the goniometer green lamp is lit, indicating the goniometer is ready for holder loading. Click the green lamp row.',
        hint: 'Click the Goniometer Green Lamp row in the checklist.',
        unlocks: ['gonio-green-lamp'],
        onEnter: 'openSpecimenModal',
        success: { type: 'selectValue', key: 'gonioGreenConfirmed', value: true }
      },
      {
        id: 9,
        instruction: 'Select the sample type. Choose from Nanoparticles (suspension), Bulk Metallic (electropolished), or Cross-section (FIB).',
        hint: 'Under Sample on the right panel, choose your specimen.',
        unlocks: ['sample'],
        success: { type: 'selectOneOf', key: 'sample', values: ['nanoparticles', 'bulk-metallic', 'cross-section'] }
      },
      {
        id: 10,
        instruction: 'Load the TEM grid onto the holder cartridge: open the cartridge, place the grid sample-side up with anti-static tweezers, and close the retaining clip. Click Load TEM Grid to confirm.',
        hint: 'Click the Load TEM Grid row in the checklist.',
        unlocks: ['grid-load'],
        onEnter: 'openSpecimenModal',
        success: { type: 'selectValue', key: 'gridLoaded', value: true }
      },
      {
        id: 11,
        instruction: 'Select the holder type. Use Single Tilt for routine imaging or Double Tilt for crystallographic work.',
        hint: 'Open the PC drawer (Stage tab) and choose Single Tilt or Double Tilt.',
        unlocks: ['holder-type'],
        pcDrawer: 'tem',
        pcTab: 'stage',
        success: { type: 'selectOneOf', key: 'holderType', values: ['single-tilt', 'double-tilt'] }
      },
      {
        id: 12,
        instruction: 'Insert the specimen holder into the goniometer port to the first mechanical stop. Follow the guide key on the holder shaft. Click INSERT on the column diagram.',
        hint: 'The specimen hotspot on the column is highlighted.',
        unlocks: [],
        diagram: 'insert-specimen',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'specimenInsertedDiagram', value: true }
      },
      {
        id: 13,
        instruction: 'Set the goniometer PUMP/AIR switch to PUMP to begin evacuating the airlock. The amber lamp will light during evacuation.',
        hint: 'Click the Set PUMP / AIR row in the checklist.',
        unlocks: ['pump-switch'],
        onEnter: 'openSpecimenModal',
        success: { type: 'selectValue', key: 'pumpSwitchSet', value: true }
      },
      {
        id: 14,
        instruction: 'The airlock is evacuating — amber lamp is lit. Wait for the amber lamp to go out. Do not rotate or push the holder while the amber lamp is on.',
        hint: null,
        unlocks: [],
        autoAdvance: 3500,
        onEnter: 'autoAirlockModal',
        success: { type: 'selectValue', key: 'airlockPumped', value: true }
      },
      {
        id: 15,
        instruction: 'Amber lamp is out — vacuum ready. Rotate the holder (150° then 750° clockwise) and push it fully into the column until it seats in the goniometer stage. Click Rotate & Insert Fully.',
        hint: 'Click the Rotate & Insert Fully row in the checklist.',
        unlocks: ['holder-rotate-insert'],
        onEnter: 'openSpecimenModal',
        success: { type: 'selectValue', key: 'holderFullyInserted', value: true }
      },
      {
        id: 16,
        instruction: 'Verify that the specimen stage responds on all axes. Click each axis button (X, Y, Z, Tilt) to confirm motion.',
        hint: 'Click each of the four axis buttons in the Verify Stage Motion row.',
        unlocks: ['stage-verify'],
        onEnter: 'openSpecimenModal',
        success: {
          type: 'composite',
          all: [
            { type: 'selectValue', key: 'stageVerifyX', value: true },
            { type: 'selectValue', key: 'stageVerifyY', value: true },
            { type: 'selectValue', key: 'stageVerifyZ', value: true },
            { type: 'selectValue', key: 'stageVerifyTilt', value: true }
          ]
        }
      },

      // ===== PHASE 2: BEAM ON & ALIGNMENT (17–26) =====
      {
        id: 17,
        instruction: 'Switch the beam ON. The filament will warm up and beam current will auto-stabilize to ~103 µA.',
        hint: 'Press Beam On on the left panel.',
        unlocks: ['beam-on'],
        pcDrawer: 'tem',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'beamOn', value: true }
      },
      {
        id: 18,
        instruction: 'Set Spot Size to 1 and α Selector to α3. These control beam convergence and illuminated area.',
        hint: 'Use the Spot Size and Alpha Selector controls on the left panel.',
        unlocks: ['spot-size', 'alpha-selector'],
        switchViewer: 'screen',
        success: {
          type: 'composite',
          all: [
            { type: 'selectValue', key: 'spotSize', value: 1 },
            { type: 'selectValue', key: 'alphaSelector', value: 3 }
          ]
        }
      },
      {
        id: 19,
        instruction: 'The beam appears off-center. Set DEF/STIG mode to SHIFT and centre the beam using the X and Y knobs.',
        switchViewer: 'screen',
        hint: 'Press Shift under DEF/STIG Mode, then adjust the X and Y knobs to centre the beam.',
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
        id: 20,
        instruction: 'Diverge the beam to fill the field of view using the Brightness knob.',
        hint: 'Turn Brightness clockwise to around 70.',
        unlocks: ['brightness'],
        success: { type: 'valueInRange', key: 'brightness', spot: 'brightness_diverge' }
      },
      {
        id: 21,
        instruction: 'Select Condenser as the aperture type.',
        hint: 'Under Apertures on the right panel, press Cond.',
        unlocks: ['aperture-select'],
        success: { type: 'selectValue', key: 'currentAperture', value: 'condenser' }
      },
      {
        id: 22,
        instruction: 'Click INSERT on the condenser aperture in the column diagram.',
        hint: 'The condenser aperture hotspot is highlighted.',
        unlocks: [],
        diagram: 'insert-condenser',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'condenserInserted', value: true }
      },
      {
        id: 23,
        instruction: 'Select a Medium aperture size.',
        hint: 'Press M under Aperture Size.',
        unlocks: ['aperture-size'],
        switchViewer: 'screen',
        success: { type: 'selectValue', key: 'condenserSize', value: 'medium' }
      },
      {
        id: 24,
        instruction: 'Centre the condenser aperture using the Aperture Alignment trackpad.',
        hint: 'Drag the alignment dot to the centre of the pad.',
        unlocks: ['aperture-align'],
        prelude: { offset: 'apertureAlignment', amount: { x: 26, y: -19 } },
        success: { type: 'valueInRange', key: 'apertureAlignment', spot: 'apertureAlign_cond' }
      },
      {
        id: 25,
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
        id: 26,
        instruction: 'Re-diverge the beam with the Brightness knob.',
        hint: 'Turn Brightness clockwise again to around 70.',
        unlocks: ['brightness'],
        prelude: { set: { key: 'brightness', value: 35 } },
        success: { type: 'valueInRange', key: 'brightness', spot: 'brightness_diverge' }
      },

      // ===== PHASE 3: EUCENTRIC HEIGHT (27–32) =====
      {
        id: 27,
        instruction: 'Set magnification to LOW to find the sample.',
        hint: 'Press Low under Magnification.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'low' }
      },
      {
        id: 28,
        instruction: 'Locate a distinct feature (e.g. a hole edge or contamination spot) and centre it using the Stage X/Y pad.',
        hint: 'Drag the Stage X/Y pad toward the blue circle target.',
        unlocks: ['stage-xy'],
        roiTarget: { x: 35, y: 25 },
        success: { type: 'valueInRange', key: 'stage', spot: 'stageXY_lowMag' }
      },
      {
        id: 29,
        instruction: 'Press Standard Focus to reset the objective lens to its nominal value.',
        hint: 'Press Std Focus on the left panel.',
        unlocks: ['std-focus'],
        success: { type: 'selectValue', key: 'stdFocusReset', value: true }
      },
      {
        id: 30,
        instruction: 'Turn the Wobbler ON to find eucentric height.',
        hint: 'Press Wobble X on the left panel.',
        unlocks: ['wobbler'],
        success: { type: 'selectValue', key: 'wobblerOn', value: true }
      },
      {
        id: 31,
        instruction: 'Adjust Z while observing the phosphor screen. The lateral image swing should shrink near eucentric height and grow when moving away.',
        hint: 'Use +Z / −Z and continue in the direction that reduces the displayed wobble amplitude.',
        unlocks: ['stage-z'],
        prelude: { set: { key: 'stageZ', value: 22 } },
        success: { type: 'valueInRange', key: 'stageZ', spot: 'stageZ_eucentric' }
      },
      {
        id: 32,
        instruction: 'Eucentric height found. Turn the Wobbler OFF.',
        hint: 'Press Wobble X again.',
        unlocks: ['wobbler'],
        success: { type: 'selectValue', key: 'wobblerOn', value: false }
      },

      // ===== PHASE 4: OBJECTIVE APERTURE ALIGNMENT (33–37) =====
      {
        id: 33,
        instruction: 'Switch to DIFF mode on the right panel.',
        hint: 'Press DIFF under Imaging Mode.',
        unlocks: ['imaging-mode'],
        success: { type: 'selectValue', key: 'imagingMode', value: 'diff' }
      },
      {
        id: 34,
        instruction: 'Select Objective as the aperture type.',
        hint: 'Under Apertures, press Obj.',
        unlocks: ['aperture-select'],
        success: { type: 'selectValue', key: 'currentAperture', value: 'objective' }
      },
      {
        id: 35,
        instruction: 'Click INSERT on the objective aperture in the column diagram.',
        hint: 'The objective aperture hotspot is highlighted.',
        unlocks: [],
        diagram: 'insert-objective',
        switchViewer: 'column',
        success: { type: 'selectValue', key: 'objectiveInserted', value: true }
      },
      {
        id: 36,
        instruction: 'Centre the objective aperture using the Aperture Alignment trackpad.',
        hint: 'Drag the alignment dot to the centre.',
        unlocks: ['aperture-align'],
        switchViewer: 'screen',
        prelude: { offset: 'apertureAlignment', amount: { x: -28, y: 22 } },
        success: { type: 'valueInRange', key: 'apertureAlignment', spot: 'apertureAlign_obj' }
      },
      {
        id: 37,
        instruction: 'Switch back to MAG1 imaging mode.',
        hint: 'Press MAG1 under Imaging Mode.',
        unlocks: ['imaging-mode'],
        success: { type: 'selectValue', key: 'imagingMode', value: 'mag1' }
      },

      // ===== PHASE 5: IMAGE ACQUISITION (38–44) =====
      {
        id: 38,
        instruction: 'Increase magnification to MEDIUM.',
        hint: 'Press Med under Magnification.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'medium' }
      },
      {
        id: 39,
        instruction: 'Recentre on the region of interest at medium magnification.',
        hint: 'Drag the stage to bring the blue circle to centre.',
        unlocks: ['stage-xy'],
        roiTarget: { x: 35, y: 25 },
        prelude: { offset: 'stage', amount: { x: -10, y: 8 } },
        success: { type: 'valueInRange', key: 'stage', spot: 'stageXY_medMag' }
      },
      {
        id: 40,
        instruction: 'Increase magnification to HIGH.',
        hint: 'Press High under Magnification.',
        unlocks: ['magnification'],
        success: { type: 'selectValue', key: 'magnification', value: 'high' }
      },
      {
        id: 41,
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
        id: 42,
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
        id: 43,
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
        id: 44,
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
        label: 'Nanoparticles',
        desc: 'Suspension on carbon grid',
        image: '../assets/images/microscope/samples/nanoparticles/nanoparticles.png',
        scales: { low: 0.25, medium: 0.55, high: 1.0 }
      },
      'bulk-metallic': {
        label: 'Bulk Metallic',
        desc: 'Electropolished / ion milled',
        image: '../assets/images/microscope/samples/nanoparticles/nanoparticles.png',
        scales: { low: 0.25, medium: 0.55, high: 1.0 }
      },
      'cross-section': {
        label: 'Cross-section',
        desc: 'FIB / ion milled',
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
