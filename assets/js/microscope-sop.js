/* =========================================================================
   Module 03 — IIT SOP guided comparison build
   This file is deliberately isolated from Module 02 so the existing simulator
   remains unchanged for professor-side comparison.
   ========================================================================= */
(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var phaseOrder = ['setup', 'bf', 'df', 'saed', 'hrtem', 'end'];
  var phaseInfo = {
    setup: { title: 'Common Setup & Alignment', pre: 'Prerequisite: none', screen: 'Instrument setup' },
    bf:    { title: 'Bright Field Imaging', pre: 'Prerequisite: microscope ready', screen: 'Bright-field image' },
    df:    { title: 'Dark Field Imaging', pre: 'Prerequisite: stable, focused BF condition', screen: 'Dark-field workflow' },
    saed:  { title: 'Selected Area Electron Diffraction', pre: 'Prerequisite: focused BF image', screen: 'SAED workflow' },
    hrtem: { title: 'High-Resolution TEM', pre: 'Prerequisite: BF + diffraction familiarity', screen: 'HRTEM workflow' },
    end:   { title: 'End Session / Specimen Unload', pre: 'Prerequisite: acquisition complete', screen: 'End-session procedure' }
  };

  var state = {};
  var currentPhase = 'setup';
  var stepIndex = 0;
  var stepTimer = null;
  var noticeTimer = null;
  var interactionSerial = 0;
  var activeView = 'column';
  var pcOpen = false;
  var pcScreen = 'tem';
  var transitionTimer = null;
  var progressKey = 'temSopBeginnerProgressV2';
  var sampleImage = new Image();
  sampleImage.src = '../assets/images/microscope/samples/nanoparticles/nanoparticles.png';

  function baseState() {
    return {
      safetyVerified: false,
      stageNeutral: false,
      greenReady: false,
      holderPos: 'OUT',
      airlockStatus: 'VENTED',
      pumpStarted: false,
      voltage: 80,
      htOn: false,
      filamentOn: false,
      beamOn: false,
      brightness: 55,
      spot1: false,
      alpha2: false,
      functionMode: 'mag1',
      magCam: 20,
      stdFocus: false,
      wobbleOn: false,
      stageZ: 18,
      focusCoarse: 18,
      focusFine: 8,
      diffFocus: 18,
      defMode: null,
      defX: 0,
      defY: 0,
      alpha: 8,
      beta: -7,
      selectedAperture: null,
      apertures: { cl: false, ol: false, sa: false },
      apX: 0,
      apY: 0,
      diffractionSpotSelected: false,
      kikuchiIdentified: false,
      imageAcquired: false,
      logRecorded: false
    };
  }

  function applyPreset(phase) {
    state = baseState();
    if (phase !== 'setup') {
      state.safetyVerified = true;
      state.stageNeutral = true;
      state.greenReady = true;
      state.holderPos = 'C';
      state.airlockStatus = 'EVACUATED';
      state.voltage = 200;
      state.htOn = true;
      state.filamentOn = true;
      state.beamOn = true;
      state.brightness = 72;
      state.functionMode = 'mag1';
      state.magCam = 45;
      state.stageZ = 0;
      state.focusCoarse = 0;
      state.focusFine = 0;
      state.apertures.cl = true;
      state.apertures.ol = true;
      state.selectedAperture = 'ol';
      state.defMode = 'shift';
    }
    if (phase === 'bf') {
      // Start the BF teaching section from a beam-ready microscope, before
      // the learner inserts/centres the imaging apertures.
      state.apertures.cl = false;
      state.apertures.ol = false;
      state.selectedAperture = null;
    }
    if (phase === 'df') {
      state.magCam = 60;
      state.apertures.cl = true;
      state.apertures.ol = true;
      state.selectedAperture = 'ol';
    }
    if (phase === 'saed') {
      state.spot1 = true;
      state.alpha2 = true;
      state.apertures.cl = true;
      state.apertures.ol = true;
      state.selectedAperture = 'ol';
    }
    if (phase === 'hrtem') {
      // Enter from an aligned BF condition with the OL aperture still in, so
      // the learner explicitly removes it before multi-beam HRTEM imaging.
      state.apertures.cl = true;
      state.apertures.ol = true;
      state.selectedAperture = 'ol';
      state.magCam = 75;
      state.alpha = 8;
      state.beta = -7;
      state.defX = 18;
      state.defY = -14;
      state.focusFine = 10;
    }
    if (phase === 'end') {
      state.functionMode = 'mag1';
      state.magCam = 25;
      state.apertures.cl = true;
      state.apertures.ol = true;
      state.apertures.sa = true;
      state.selectedAperture = 'ol';
    }
  }

  function near(v, target, tolerance) { return Math.abs(v - target) <= tolerance; }
  function centeredXY(x, y, t) { return Math.abs(x) <= t && Math.abs(y) <= t; }
  function apertureInserted(which) { return !!state.apertures[which]; }

  var phases = {
    setup: [
      step('setup-1', 'Verify the pre-operation checks: chiller, room conditions and SIP vacuum.', 'The manuals require stable cooling and vacuum before specimen insertion or high-voltage operation.', 'safety', function(){ return state.safetyVerified; }),
      step('setup-2', 'Press STAGE NEUTRAL before specimen insertion.', 'A neutral stage provides a safe, known starting position for the holder.', 'stage-neutral', function(){ return state.stageNeutral; }),
      step('setup-3', 'Confirm the goniometer GREEN lamp is ready for holder loading.', 'The holder should not be inserted until the goniometer indicates it is ready.', 'airlock', function(){ return state.greenReady; }),
      step('setup-4', 'Insert the holder straight to the first mechanical stop — Position A.', 'The guide key must engage without force before the airlock is pumped.', 'airlock', function(){ return state.holderPos === 'A'; }),
      step('setup-5', 'Set the PUMP/AIR switch to PUMP to evacuate the goniometer airlock.', 'The holder must remain still while the amber evacuation state is active.', 'airlock', function(){ return state.pumpStarted; }),
      { id:'setup-6', instruction:'Wait for the airlock evacuation to complete before rotating the holder.', why:'The manual specifically warns not to rotate or push the holder while evacuation is in progress.', target:null, success:function(){ return state.airlockStatus === 'EVACUATED'; }, onEnter:function(){ if(state.airlockStatus !== 'EVACUATED') showNotice('Amber lamp: evacuating airlock… do not rotate the holder.', 1300); } },
      step('setup-7', 'After evacuation, rotate 15° clockwise and then 75° clockwise and seat the holder at Position C.', 'This reproduces the staged insertion sequence into the microscope column.', 'airlock', function(){ return state.holderPos === 'C' && state.airlockStatus === 'EVACUATED'; }),
      step('setup-8', 'Select 200 kV in the High Voltage control.', 'The supplied procedures use 200 kV for routine JEM-2100 imaging of this practice specimen.', 'voltage', function(){ return state.voltage === 200; }),
      step('setup-9', 'Switch HT ON after the specimen is loaded and the microscope is ready.', 'High tension establishes the accelerating field; vacuum readiness must be confirmed first.', 'ht-filament', function(){ return state.htOn; }),
      step('setup-10', 'Switch the filament ON and allow the emission to stabilise.', 'The electron source must reach a stable operating condition before illumination is used.', 'ht-filament', function(){ return state.filamentOn; }),
      step('setup-11', 'Press BEAM to open the beam path to the viewing screen.', 'The BEAM switch allows the electron illumination to reach the specimen/viewing chamber.', 'beam', function(){ return state.beamOn; }),
      step('setup-12', 'Spread the illumination to a comfortable viewing field with BRIGHTNESS.', 'The beam should fill the viewing area without concentrating unnecessary dose.', 'brightness', function(){ return state.brightness >= 65 && state.brightness <= 80; }, function(){ state.brightness = 48; })
    ],

    bf: [
      step('bf-1', 'Select LOW MAG to locate a thin region or feature of interest.', 'A wide field of view makes specimen navigation safer and easier for a new operator.', 'function', function(){ return state.functionMode === 'lowmag'; }),
      step('bf-2', 'Switch to MAG1 and set the magnification near 40,000× for eucentric-height adjustment.', 'The SOP recommends roughly 30,000–50,000× so wobble motion is visible but the feature remains trackable.', ['function','magcam'], function(){ return state.functionMode === 'mag1' && magLabel() === '40k×'; }, function(){ state.magCam = 22; }),
      step('bf-3', 'Press STD FOCUS to reset the objective lens to its reference focus.', 'Eucentric-height adjustment is referenced to the standard objective focus condition.', 'std-focus', function(){ return state.stdFocus; }),
      step('bf-4', 'Turn IMAGE WOBB X ON.', 'If the specimen is away from eucentric height, the selected feature shifts laterally during wobble.', 'wobble', function(){ return state.wobbleOn; }),
      step('bf-5', 'Adjust specimen Z until the lateral wobble is minimised.', 'Minimum lateral movement indicates the specimen is close to the eucentric height.', 'stage-z', function(){ return Math.abs(state.stageZ) <= 2; }, function(){ state.stageZ = 18; }),
      step('bf-6', 'Turn IMAGE WOBB X OFF after the eucentric height is set.', 'Normal imaging should continue with the wobbler deselected.', 'wobble', function(){ return !state.wobbleOn; }),
      step('bf-7', 'Select the CL (condenser) aperture and INSERT it.', 'The condenser aperture controls illumination angle and contributes to beam quality.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'cl' && apertureInserted('cl'); }),
      step('bf-8', 'Centre the condenser aperture with the X/Y aperture controls.', 'The beam should spread and contract symmetrically about the optical axis rather than clip or shift.', 'aperture-xy', function(){ return centeredXY(state.apX, state.apY, 1); }, function(){ state.apX = 6; state.apY = -4; }),
      step('bf-9', 'Select COND STIG, then correct X/Y until the beam remains circular.', 'Condenser astigmatism appears as an elliptical beam that changes orientation through focus.', ['def-mode','def-xy'], function(){ return state.defMode === 'cond' && centeredXY(state.defX, state.defY, 3); }, function(){ state.defX = 18; state.defY = -14; }),
      step('bf-10', 'Re-spread and centre the beam for imaging.', 'Bright-field acquisition should use a centred, comfortable illumination field.', 'brightness', function(){ return state.brightness >= 65 && state.brightness <= 80; }, function(){ state.brightness = 50; }),
      step('bf-11', 'Switch briefly to SA DIFF to view the direct 000 beam.', 'The objective aperture is centred on the direct beam in diffraction space for Bright Field imaging.', 'function', function(){ return state.functionMode === 'sadiff'; }),
      step('bf-12', 'Select the OL (objective) aperture and INSERT it.', 'In Bright Field the objective aperture selects the direct transmitted beam while excluding stronger-angle scattering.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'ol' && apertureInserted('ol'); }),
      step('bf-13', 'Centre the objective aperture on the direct 000 beam.', 'Correct centring ensures the Bright Field image is formed from the intended transmitted beam.', 'aperture-xy', function(){ return centeredXY(state.apX, state.apY, 1); }, function(){ state.apX = -6; state.apY = 4; }),
      step('bf-14', 'Return to MAG1 image mode.', 'After aperture alignment, Bright Field focusing is performed in real-space imaging mode.', 'function', function(){ return state.functionMode === 'mag1'; }),
      step('bf-15', 'Use OBJ FOCUS coarse first to approach focus.', 'Coarse focus brings the image close to the Gaussian focus condition before fine correction.', 'obj-focus', function(){ return Math.abs(state.focusCoarse) <= 3; }, function(){ state.focusCoarse = 20; }),
      step('bf-16', 'Use OBJ FOCUS fine to minimise the edge/Fresnel fringe and sharpen the image.', 'Fine focus gives the final Bright Field focus without large objective-lens changes.', 'obj-focus', function(){ return Math.abs(state.focusFine) <= 2; }, function(){ state.focusFine = 10; }),
      step('bf-17', 'Acquire the Bright Field image.', 'This establishes the reference image from which DF, SAED and HRTEM workflows can proceed.', 'camera', function(){ return state.imageAcquired; })
    ],

    df: [
      step('df-1', 'From the stable Bright Field condition, switch to SA DIFF.', 'Dark Field starts by viewing the diffraction pattern so a specific diffracted reflection can be chosen.', 'function', function(){ return state.functionMode === 'sadiff'; }),
      { id:'df-2', instruction:'Click one diffracted spot on the pattern — not the central 000 beam.', why:'The selected diffracted beam will be used to form the Dark Field image.', target:'screen', success:function(){ return state.diffractionSpotSelected; }, onEnter:function(){ state.diffractionSpotSelected = false; } },
      step('df-3', 'Select DARK TILT on the DEF/STIG function row.', 'DARK TILT assigns the X/Y controls to the condenser-lens beam-deflector used for dark-field observation.', 'def-mode', function(){ return state.defMode === 'dark'; }),
      step('df-4', 'Adjust the X/Y DEF/STIG knobs until the selected diffracted spot is brought onto the optical axis.', 'Beam-tilt dark field aligns the chosen diffracted beam with the imaging axis.', 'def-xy', function(){ return centeredXY(state.defX, state.defY, 3); }, function(){ state.defX = 20; state.defY = -16; }),
      step('df-5', 'Return to MAG1 image mode.', 'The image is now formed using the diffraction condition selected in the previous steps.', 'function', function(){ return state.functionMode === 'mag1'; }),
      step('df-6', 'Select OL and centre/reinsert the objective aperture around the chosen diffracted beam.', 'The objective aperture should pass the selected diffracted beam while excluding the direct beam.', ['aperture-select','aperture-xy'], function(){ return state.selectedAperture === 'ol' && apertureInserted('ol') && centeredXY(state.apX, state.apY, 1); }, function(){ state.apX = 6; state.apY = 4; }),
      step('df-7', 'Fine-focus the Dark Field image.', 'DF uses the same real-space focus principle as BF after the diffracted beam is selected.', 'obj-focus', function(){ return Math.abs(state.focusFine) <= 2; }, function(){ state.focusFine = -10; }),
      step('df-8', 'Acquire the Dark Field image and retain the selected reflection for correlation.', 'The DF image is meaningful only when the diffraction spot used to form it is known.', 'camera', function(){ return state.imageAcquired; })
    ],

    saed: [
      step('saed-1', 'Set SPOT 1 and α 2 for the diffraction setup used in the supplied operation procedure.', 'These settings establish the illumination condition specified for the practice SAED workflow.', 'spot-alpha', function(){ return state.spot1 && state.alpha2; }, function(){ state.spot1 = false; state.alpha2 = false; }),
      step('saed-2', 'Select the SA aperture and INSERT it while still in image mode.', 'The selected-area aperture defines which real-space region contributes to the diffraction pattern.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'sa' && apertureInserted('sa'); }),
      step('saed-3', 'Position the SA aperture with its X/Y controls so it encloses only the region of interest.', 'Surrounding regions should be excluded from the selected-area diffraction pattern.', 'aperture-xy', function(){ return centeredXY(state.apX, state.apY, 1); }, function(){ state.apX = -8; state.apY = 6; }),
      step('saed-4', 'Switch to SA DIFF.', 'The fluorescent screen now displays the diffraction pattern instead of the real-space image.', 'function', function(){ return state.functionMode === 'sadiff'; }),
      step('saed-5', 'Select PLA on the DEF/STIG function row.', 'PLA moves the diffraction pattern/projector-lens image position; it is separate from positioning the SA aperture.', 'def-mode', function(){ return state.defMode === 'pla'; }),
      step('saed-6', 'Use the X/Y DEF/STIG knobs to centre the diffraction pattern.', 'Projector-lens alignment keeps the pattern centred in the recorded field.', 'def-xy', function(){ return centeredXY(state.defX, state.defY, 3); }, function(){ state.defX = -18; state.defY = 15; }),
      step('saed-7', 'Adjust DIFF FOCUS until the spots are sharp and minimal in size.', 'Diffraction focus is independent of normal image focus and directly controls spot sharpness.', 'diff-focus', function(){ return Math.abs(state.diffFocus) <= 2; }, function(){ state.diffFocus = 22; }),
      step('saed-8', 'Set MAG/CAM L to a defined camera length — use 300 mm for this practice pattern.', 'Camera length must be recorded because it is needed to calibrate diffraction spacing.', 'magcam', function(){ return camLengthLabel() === '300 mm'; }, function(){ state.magCam = 15; }),
      step('saed-9', 'Select OL and REMOVE the objective aperture before diffraction acquisition.', 'The SOP states that the objective aperture is not used during SAED acquisition.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'ol' && !apertureInserted('ol'); }),
      step('saed-10', 'Acquire the SAED pattern.', 'Record the diffraction pattern together with the camera-length setting.', 'camera', function(){ return state.imageAcquired; }),
      step('saed-11', 'Return to MAG1 and remove the SA aperture before proceeding.', 'The selected-area aperture should be opened/removed after the diffraction acquisition.', ['function','aperture-select','aperture-action'], function(){ return state.functionMode === 'mag1' && !apertureInserted('sa'); })
    ],

    hrtem: [
      step('hrtem-1', 'Select OL and make sure the objective aperture is OUT.', 'HRTEM requires multiple direct and diffracted beams to interfere; an objective aperture would suppress them.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'ol' && !apertureInserted('ol'); }),
      step('hrtem-2', 'Switch to SA DIFF to inspect the diffraction condition.', 'Zone-axis alignment is established in diffraction space before high-resolution imaging.', 'function', function(){ return state.functionMode === 'sadiff'; }),
      { id:'hrtem-3', instruction:'Click the Kikuchi-band intersection shown on the diffraction pattern.', why:'The SOP instructs the operator to track Kikuchi bands, rather than simply chasing diffraction spots, during zone-axis alignment.', target:'screen', success:function(){ return state.kikuchiIdentified; }, onEnter:function(){ state.kikuchiIdentified = false; } },
      step('hrtem-4', 'Adjust α and β specimen tilt until the Kikuchi intersection is centred on the direct beam.', 'Centred Kikuchi geometry indicates the target zone axis is aligned in both tilt directions.', 'tilt', function(){ return Math.abs(state.alpha) <= 1 && Math.abs(state.beta) <= 1; }, function(){ state.alpha = 8; state.beta = -7; }),
      step('hrtem-5', 'Return to MAG1 after zone-axis alignment.', 'Once the crystallographic orientation is set, minimise further specimen movement and return to imaging.', 'function', function(){ return state.functionMode === 'mag1'; }),
      step('hrtem-6', 'Increase MAG/CAM L to the high-resolution range — use approximately 150,000×.', 'HRTEM lattice-fringe observation requires substantially higher magnification than survey imaging.', 'magcam', function(){ return magLabel() === '150k×'; }, function(){ state.magCam = 45; }),
      step('hrtem-7', 'Select OBJ STIG on the DEF/STIG function row.', 'Objective astigmatism must be minimised before fine HRTEM focusing.', 'def-mode', function(){ return state.defMode === 'obj'; }),
      step('hrtem-8', 'Correct OBJ STIG X/Y while watching the live FFT until it becomes symmetric.', 'A symmetric FFT is a practical visual cue that objective astigmatism has been reduced.', 'def-xy', function(){ return centeredXY(state.defX, state.defY, 3); }, function(){ state.defX = 20; state.defY = -17; }),
      step('hrtem-9', 'Fine-tune OBJ FOCUS near the optimum lattice-fringe contrast while monitoring the FFT.', 'HRTEM focus is judged from lattice contrast and Fourier-space information rather than only edge sharpness.', 'obj-focus', function(){ return Math.abs(state.focusFine) <= 2; }, function(){ state.focusFine = 12; }),
      step('hrtem-10', 'Acquire the HRTEM image; the live FFT is retained as the spacing/orientation reference.', 'The HRTEM image and its FFT should be saved together for later verification.', 'camera', function(){ return state.imageAcquired; })
    ],

    end: [
      step('end-1', 'Press STAGE NEUTRAL before removing the specimen holder.', 'The operation manual starts shutdown by returning the stage to its initial/neutral position.', 'stage-neutral', function(){ return state.stageNeutral; }, function(){ state.stageNeutral = false; }),
      step('end-2', 'Select CL and REMOVE the condenser aperture from the beam path.', 'Apertures used during the session should be removed before specimen unloading/end-of-session handover.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'cl' && !apertureInserted('cl'); }),
      step('end-3', 'Select OL and REMOVE the objective aperture.', 'Leaving apertures withdrawn protects them and returns the instrument toward its handover condition.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'ol' && !apertureInserted('ol'); }),
      step('end-4', 'Select SA and REMOVE/open the selected-area aperture.', 'The SA field-limiting aperture should not remain in the beam path after diffraction work.', ['aperture-select','aperture-action'], function(){ return state.selectedAperture === 'sa' && !apertureInserted('sa'); }),
      step('end-5', 'Switch BEAM OFF.', 'Beam emission is stopped before the specimen is removed.', 'beam', function(){ return !state.beamOn; }),
      step('end-6', 'Switch the filament OFF.', 'The shutdown sequence requires emission current to fall before completing the high-voltage handover.', 'ht-filament', function(){ return !state.filamentOn; }),
      step('end-7', 'Return the accelerating-voltage setting to 80 kV for the shutdown sequence.', 'The supplied operation manual describes ramping the high voltage back down to 80 kV.', 'voltage', function(){ return state.voltage === 80; }),
      step('end-8', 'Switch HT OFF.', 'Confirm the high-tension status is no longer on before unloading.', 'ht-filament', function(){ return !state.htOn; }),
      step('end-9', 'Withdraw/rotate the holder from Position C to Position B.', 'The holder is removed by reversing the insertion sequence; do not pull it straight out in one motion.', 'airlock', function(){ return state.holderPos === 'B'; }, function(){ state.holderPos = 'C'; state.airlockStatus='EVACUATED'; }),
      step('end-10', 'Continue from Position B to Position A.', 'The second reverse rotation brings the holder to the airlock position before venting.', 'airlock', function(){ return state.holderPos === 'A'; }),
      step('end-11', 'Set PUMP/AIR to AIR and wait for the airlock to vent.', 'The holder should be fully withdrawn only after the specimen exchange chamber is vented.', 'airlock', function(){ return state.airlockStatus === 'VENTED'; }),
      step('end-12', 'Remove the holder completely and return it to its base.', 'Support the holder during removal to avoid dropping or striking the goniometer.', 'airlock', function(){ return state.holderPos === 'OUT'; }),
      { id:'end-13', instruction:'End of session: save data, note specimen details, and record the session in the logbook.', why:'The manuals include data naming, clean handover and logbook recording as part of the operating procedure.', target:'camera', success:function(){ return state.logRecorded; } }
    ]
  };

  function step(id, instruction, why, target, success, onEnter) {
    return { id:id, instruction:instruction, why:why, target:target, success:success, onEnter:onEnter || null };
  }

  function init() {
    $$('.sop-button:disabled').forEach(function(btn){ btn.dataset.fixedDisabled = '1'; });
    wireControls();
    wirePhaseTabs();
    wireNavigation();
    wireViewAndPC();
    sampleImage.onload = function(){ render(); renderCameraPreview(); };
    var params = new URLSearchParams(window.location.search);
    var requested = params.get('phase');
    var phase = phaseInfo[requested] && isPhaseUnlocked(requested) ? requested : firstIncompletePhase();
    if (!phaseInfo[phase]) phase = 'setup';
    setPhase(phase, false, { carry:false, silent:true, force:true });
    if (requested && requested !== phase) setTimeout(function(){ showNotice('That section is locked. Complete the current beginner section first.', 1900); }, 220);
    requestAnimationFrame(animationLoop);
  }

  function wirePhaseTabs() {
    $$('.sop-phase-tab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var phase = btn.dataset.phase;
        if (!isPhaseUnlocked(phase)) { showNotice('Locked: complete the previous section first.', 1600); return; }
        if (phase === currentPhase) return;
        setPhase(phase, true, { carry:false });
      });
    });
  }

  function wireNavigation() {
    $('#btn-prev').addEventListener('click', function(){ if(stepIndex > 0){ stepIndex--; activateStep(); } });
    $('#btn-restart-section').addEventListener('click', function(){ setPhase(currentPhase, false); });
  }

  function wireControls() {
    $('#btn-safety').addEventListener('click', function(){ state.safetyVerified = true; touch('safety'); showNotice('Checks verified: cooling and SIP vacuum within the manual limits.'); });
    $('#btn-neutral').addEventListener('click', function(){ state.stageNeutral = true; touch('stage-neutral'); showNotice('Stage returned to neutral position.'); });
    $('#btn-green').addEventListener('click', function(){ state.greenReady = true; touch('airlock'); showNotice('Goniometer green lamp confirmed.'); });
    $('#btn-holder-a').addEventListener('click', function(){ if(state.greenReady && state.holderPos==='OUT'){ state.holderPos='A'; touch('airlock'); } else if(currentPhase==='end' && state.holderPos==='B'){ state.holderPos='A'; touch('airlock'); } else showNotice('Position A is available only at the correct point in the holder sequence.'); });
    $('#btn-holder-b').addEventListener('click', function(){ if(currentPhase==='end' && state.holderPos==='C'){ state.holderPos='B'; touch('airlock'); } else showNotice('Position B is used during the reverse holder-removal sequence.'); });
    $('#btn-holder-c').addEventListener('click', function(){ if(state.airlockStatus === 'EVACUATED'){ state.holderPos = 'C'; touch('airlock'); } else { showNotice('Evacuate the airlock before moving to Position C.'); } });
    $('#btn-holder-out').addEventListener('click', function(){ if(state.airlockStatus === 'VENTED' && state.holderPos === 'A'){ state.holderPos = 'OUT'; touch('airlock'); } else { showNotice('Move to Position A and vent the airlock before fully removing the holder.'); } });
    $('#btn-pump').addEventListener('click', function(){
      if(state.airlockStatus === 'VENTED' && state.holderPos === 'A') {
        state.airlockStatus = 'PUMPING'; state.pumpStarted = true; touch('airlock');
        showNotice('Amber lamp ON — evacuating. Do not rotate the holder.', 1200);
        setTimeout(function(){ state.airlockStatus = 'EVACUATED'; updateUI(); checkCurrentStep(); showNotice('Amber lamp OFF — airlock evacuation complete.'); }, 1150);
      } else if(state.airlockStatus === 'EVACUATED' && state.holderPos === 'A') {
        state.airlockStatus = 'VENTING'; touch('airlock');
        setTimeout(function(){ state.airlockStatus = 'VENTED'; updateUI(); checkCurrentStep(); showNotice('Airlock vented. Holder may now be removed.'); }, 750);
      } else {
        showNotice('PUMP/AIR action is interlocked for the current holder position.');
      }
    });

    $$('[data-voltage]').forEach(function(btn){ btn.addEventListener('click', function(){ var v=+btn.dataset.voltage; if(v===200 && !(state.holderPos==='C' && state.airlockStatus==='EVACUATED')) return showNotice('Load and evacuate the specimen holder before selecting 200 kV.'); if(v===80 && (state.beamOn || state.filamentOn)) return showNotice('Turn BEAM and FILAMENT off before returning to 80 kV.'); state.voltage=v; touch('voltage'); }); });
    $('#btn-ht').addEventListener('click', function(){ if(!state.htOn && !(state.voltage===200 && state.holderPos==='C' && state.airlockStatus==='EVACUATED')) return showNotice('HT ON is interlocked until the specimen is loaded, evacuated and 200 kV is selected.'); if(state.htOn && (state.beamOn || state.filamentOn)) return showNotice('Turn BEAM and FILAMENT off before HT OFF.'); state.htOn=!state.htOn; touch('ht-filament'); });
    $('#btn-filament').addEventListener('click', function(){ if(!state.filamentOn && !state.htOn) return showNotice('Switch HT ON before the filament.'); if(state.filamentOn && state.beamOn) return showNotice('Switch BEAM OFF before FILAMENT OFF.'); state.filamentOn=!state.filamentOn; touch('ht-filament'); });
    $('#btn-beam').addEventListener('click', function(){ if(!state.beamOn && !state.filamentOn) return showNotice('Switch the filament ON before opening the beam.'); state.beamOn=!state.beamOn; touch('beam'); });

    bindRange('rng-brightness', 'brightness', 'out-brightness', function(v){ return String(v); }, 'brightness');
    bindRange('rng-def-x', 'defX', 'out-def-x', function(v){ return String(v); }, 'def-xy');
    bindRange('rng-def-y', 'defY', 'out-def-y', function(v){ return String(v); }, 'def-xy');
    bindRange('rng-focus-c', 'focusCoarse', 'out-focus-c', function(v){ return String(v); }, 'obj-focus');
    bindRange('rng-focus-f', 'focusFine', 'out-focus-f', function(v){ return String(v); }, 'obj-focus');
    bindRange('rng-diff-focus', 'diffFocus', 'out-diff-focus', function(v){ return String(v); }, 'diff-focus');
    bindRange('rng-alpha', 'alpha', 'out-alpha', function(v){ return v + '°'; }, 'tilt');
    bindRange('rng-beta', 'beta', 'out-beta', function(v){ return v + '°'; }, 'tilt');
    bindRange('rng-magcam', 'magCam', 'out-magcam', function(){ return state.functionMode === 'sadiff' ? camLengthLabel() : magLabel(); }, 'magcam');

    $$('[data-defmode]').forEach(function(btn){ btn.addEventListener('click', function(){ state.defMode = btn.dataset.defmode; touch('def-mode'); }); });
    $$('[data-function]').forEach(function(btn){ btn.addEventListener('click', function(){ state.functionMode = btn.dataset.function; touch('function'); }); });
    $$('[data-simple]').forEach(function(btn){ btn.addEventListener('click', function(){ state[btn.dataset.simple] = true; touch('spot-alpha'); }); });

    $('#btn-std-focus').addEventListener('click', function(){ state.stdFocus = true; state.focusCoarse = 0; touch('std-focus'); });
    $('#btn-wobble').addEventListener('click', function(){ state.wobbleOn = !state.wobbleOn; touch('wobble'); });
    $$('[data-z]').forEach(function(btn){ btn.addEventListener('click', function(){ var d=+btn.dataset.z; state.stageZ += d * Math.max(1, Math.ceil(Math.abs(state.stageZ)/8)); if(Math.abs(state.stageZ)<1) state.stageZ=0; touch('stage-z'); }); });

    $$('[data-aperture]').forEach(function(btn){ btn.addEventListener('click', function(){ state.selectedAperture = btn.dataset.aperture; touch('aperture-select'); }); });
    $('#btn-ap-insert').addEventListener('click', function(){ if(!state.selectedAperture) return showNotice('Select CL, OL or SA first.'); state.apertures[state.selectedAperture] = true; touch('aperture-action'); });
    $('#btn-ap-remove').addEventListener('click', function(){ if(!state.selectedAperture) return showNotice('Select CL, OL or SA first.'); state.apertures[state.selectedAperture] = false; touch('aperture-action'); });
    $$('[data-apmove]').forEach(function(btn){ btn.addEventListener('click', function(){
      var m=btn.dataset.apmove, amount=2;
      if(m==='x-') state.apX -= amount; if(m==='x+') state.apX += amount; if(m==='y-') state.apY -= amount; if(m==='y+') state.apY += amount;
      if(Math.abs(state.apX)<2) state.apX=0; if(Math.abs(state.apY)<2) state.apY=0;
      touch('aperture-xy');
    }); });

    $('#btn-acquire').addEventListener('click', function(){
      var st = currentStep();
      if(currentPhase==='end' && st && st.id==='end-13') { state.logRecorded = true; showNotice('Session record saved to the practice logbook.'); }
      else { state.imageAcquired = true; showNotice('Practice acquisition recorded.'); }
      touch('camera');
    });

    $('#sop-canvas').addEventListener('click', function(e){
      var st=currentStep(); if(!st || st.target!=='screen') return;
      if(currentPhase==='df') { state.diffractionSpotSelected = true; showNotice('Diffracted reflection selected.'); touch('screen'); }
      if(currentPhase==='hrtem') { state.kikuchiIdentified = true; showNotice('Kikuchi-band intersection identified.'); touch('screen'); }
    });
  }

  function wireViewAndPC() {
    $$('.sop-view-tab').forEach(function(btn){ btn.addEventListener('click', function(){ switchView(btn.dataset.sopView, false); }); });
    $('#sop-pc-handle').addEventListener('click', function(){ setPCOpen(!pcOpen, false); });
    $$('.sop-pc-tab').forEach(function(btn){ btn.addEventListener('click', function(){ setPCScreen(btn.dataset.pcScreen, false); setPCOpen(true, false); }); });
  }
  function switchView(view, announce) {
    if(view!=='column'&&view!=='screen') return; if(activeView===view) return; activeView=view;
    $$('.sop-view-tab').forEach(function(btn){btn.classList.toggle('is-active',btn.dataset.sopView===view);});
    $$('.sop-view-panel').forEach(function(panel){panel.classList.toggle('is-active',panel.dataset.sopViewPanel===view);});
    $('#sop-view-caption').textContent=view==='column'?'ELECTRON OPTICAL COLUMN':'FLUORESCENT / CAMERA VIEW';
    if(announce) showNotice('Automatic view change → '+(view==='column'?'Column':'Viewing Screen'),1250);
  }
  function setPCOpen(open, announce) { if(pcOpen===open) return; pcOpen=open; var d=$('#sop-pc-drawer'); d.classList.toggle('is-open',open); d.setAttribute('aria-expanded',open?'true':'false'); if(announce&&open) showNotice('Computer screen opened automatically for this step.',1250); }
  function setPCScreen(which, announce) { if(which!=='tem'&&which!=='camera') return; var changed=pcScreen!==which; pcScreen=which; $$('.sop-pc-tab').forEach(function(btn){btn.classList.toggle('is-active',btn.dataset.pcScreen===which);}); $$('.sop-pc-screen').forEach(function(panel){panel.classList.toggle('is-active',panel.dataset.pcPanel===which);}); $('#sop-pc-handle-label').textContent=which==='tem'?'PC · TEM CONTROL':'PC · CAMERA / iTEM'; if(announce&&changed) showNotice('Automatic computer tab change → '+(which==='tem'?'TEM CONTROL':'CAMERA / iTEM'),1250); }
  function guidePresentationForStep(st) {
    if(!st) return; var targets=Array.isArray(st.target)?st.target:(st.target?[st.target]:[]), id=st.id||'';
    if(targets.indexOf('voltage')>=0||targets.indexOf('ht-filament')>=0||targets.indexOf('stage-neutral')>=0){setPCScreen('tem',true);setPCOpen(true,true);}
    else if(targets.indexOf('camera')>=0){switchView('screen',true);setPCScreen('camera',true);setPCOpen(true,true);}
    else {setPCOpen(false,false); if(targets.indexOf('airlock')>=0||(currentPhase==='setup'&&/^setup-[1-7]$/.test(id))||(currentPhase==='end'&&/^end-(9|10|11|12)$/.test(id))) switchView('column',true); else if(targets.length) switchView('screen',true);}
  }
  function getCompletedPhases(){try{var raw=sessionStorage.getItem(progressKey),arr=raw?JSON.parse(raw):[];return Array.isArray(arr)?arr.filter(function(p){return phaseInfo[p];}):[];}catch(e){return[];}}
  function markPhaseComplete(phase){var arr=getCompletedPhases();if(arr.indexOf(phase)<0)arr.push(phase);arr.sort(function(a,b){return phaseOrder.indexOf(a)-phaseOrder.indexOf(b);});try{sessionStorage.setItem(progressKey,JSON.stringify(arr));}catch(e){}}
  function firstIncompletePhase(){var done=getCompletedPhases();for(var i=0;i<phaseOrder.length;i++)if(done.indexOf(phaseOrder[i])<0)return phaseOrder[i];return'end';}
  function isPhaseUnlocked(phase){var idx=phaseOrder.indexOf(phase);if(idx<0)return false;var done=getCompletedPhases();if(idx===0||done.indexOf(phase)>=0)return true;return done.indexOf(phaseOrder[idx-1])>=0&&phase===firstIncompletePhase();}
  function updatePhaseTabs(){var done=getCompletedPhases();$$('.sop-phase-tab').forEach(function(btn){var p=btn.dataset.phase,unlocked=isPhaseUnlocked(p)||p===currentPhase;btn.classList.toggle('is-active',p===currentPhase);btn.classList.toggle('is-complete',done.indexOf(p)>=0);btn.classList.toggle('is-locked',!unlocked);btn.disabled=!unlocked;btn.setAttribute('aria-disabled',!unlocked?'true':'false');});}
  function updateControlGating(){var st=currentStep(),targets=st?(Array.isArray(st.target)?st.target:(st.target?[st.target]:[])):[];$$('.sop-control').forEach(function(zone){var allowed=targets.indexOf(zone.dataset.control)>=0;zone.querySelectorAll('.sop-button,.sop-range').forEach(function(el){if(el.dataset.fixedDisabled==='1'){el.disabled=true;return;}el.disabled=!allowed;});});$('#sop-canvas').style.cursor=targets.indexOf('screen')>=0?'crosshair':'default';}
  function preparePhaseCarry(phase){state.imageAcquired=false;if(phase==='bf'){state.functionMode='mag1';state.stdFocus=false;state.wobbleOn=false;state.stageZ=18;state.apertures.cl=false;state.apertures.ol=false;state.selectedAperture=null;state.apX=0;state.apY=0;}else if(phase==='df'){state.functionMode='mag1';state.diffractionSpotSelected=false;state.defMode='shift';state.defX=0;state.defY=0;state.apertures.cl=true;state.apertures.ol=true;state.selectedAperture='ol';state.apX=0;state.apY=0;state.focusFine=0;}else if(phase==='saed'){state.functionMode='mag1';state.defMode='shift';state.defX=0;state.defY=0;state.diffFocus=18;state.spot1=false;state.alpha2=false;state.apertures.ol=true;state.apertures.sa=false;state.selectedAperture=null;state.apX=0;state.apY=0;}else if(phase==='hrtem'){state.functionMode='mag1';state.apertures.sa=false;state.apertures.ol=false;state.selectedAperture='ol';state.alpha=8;state.beta=-7;state.kikuchiIdentified=false;state.defMode='shift';state.defX=0;state.defY=0;state.focusFine=10;}else if(phase==='end'){state.functionMode='mag1';state.wobbleOn=false;state.stageNeutral=false;state.selectedAperture='cl';}}
  function showTransition(from,next){var m=$('#sop-transition-modal');$('#sop-transition-title').textContent=phaseInfo[from].title+' complete';$('#sop-transition-text').textContent='Next: '+phaseInfo[next].title+'. Moving automatically so the beginner follows the required sequence.';m.hidden=false;setTimeout(function(){m.hidden=true;},1700);}
  function updatePCMirror(){function t(id,v){var e=$('#'+id);if(e)e.textContent=v;}t('pc-acc-value',state.voltage+' kV');t('pc-ht-value',state.htOn?'ON':'READY');t('pc-filament-value',state.filamentOn?'ON':'OFF');t('pc-beam-value',state.beamOn?'ON':'OFF');t('pc-vac-value',state.airlockStatus);t('pc-mode-value',modeDisplay());t('pc-stage-z','Z '+(state.stageZ>=0?'+':'')+state.stageZ+' µm');t('pc-camera-mode',modeDisplay());}
  function updateColumnMirror(){var b=$('#sop-column-beam');if(b)b.classList.toggle('is-on',state.beamOn);var e=$('#sop-column-status');if(!e)return;if(state.holderPos==='OUT')e.textContent='SPECIMEN NOT LOADED';else if(state.airlockStatus==='PUMPING')e.textContent='AIRLOCK EVACUATING';else if(state.holderPos==='A')e.textContent='HOLDER AT POSITION A';else if(state.holderPos==='B')e.textContent='HOLDER AT POSITION B';else if(state.holderPos==='C')e.textContent=state.beamOn?'SPECIMEN LOADED · BEAM ON':'SPECIMEN LOADED';}
  function renderCameraPreview(){var c=$('#sop-camera-preview');if(!c)return;var ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#05080a';ctx.fillRect(0,0,w,h);if(activeView==='screen'){try{ctx.drawImage($('#sop-canvas'),0,0,w,h);}catch(e){}}else{ctx.fillStyle='#aeb6bc';ctx.font='15px monospace';ctx.textAlign='center';ctx.fillText('Camera preview follows the imaging screen',w/2,h/2);}}

  function bindRange(id, key, outId, format, targetKey) {
    var el = $('#' + id), out = $('#' + outId);
    el.addEventListener('input', function(){ state[key] = +el.value; out.textContent = format(+el.value); touch(targetKey); });
  }

  function setPhase(phase, pushUrl, opts) {
    opts=opts||{}; if(!phaseInfo[phase])return; if(!opts.force&&!isPhaseUnlocked(phase)&&phase!==currentPhase){showNotice('Locked: complete the previous section first.',1600);return;}
    clearTimeout(stepTimer);clearTimeout(transitionTimer);currentPhase=phase;stepIndex=0;if(opts.carry&&Object.keys(state).length)preparePhaseCarry(phase);else applyPreset(phase);if(pushUrl)history.replaceState(null,'','microscope-sop-guided.html?phase='+encodeURIComponent(phase));updatePhaseTabs();$('#sop-phase-title').textContent=phaseInfo[phase].title;$('#sop-phase-pre').textContent=phaseInfo[phase].pre;activateStep();
  }

  function currentStep() { return (phases[currentPhase] || [])[stepIndex] || null; }

  function activateStep() {
    clearTimeout(stepTimer);
    state.imageAcquired = false;
    var st = currentStep();
    if (!st) return finishPhase();
    if (st.onEnter) st.onEnter();
    $('#sop-stepno').textContent = 'Step ' + (stepIndex + 1) + ' / ' + phases[currentPhase].length;
    $('#sop-task').textContent = st.instruction;
    $('#sop-why').textContent = 'Why: ' + st.why;
    highlightTarget(st.target);
    updateUI();
    guidePresentationForStep(st);

    // Passive wait steps (e.g. airlock pumping) should advance as soon as the state reaches the expected condition.
    if (!st.target) {
      stepTimer = setInterval(function(){ if(st.success()) { clearInterval(stepTimer); advance(); } }, 160);
    }
  }

  function finishPhase() {
    highlightTarget(null);updateControlGating();$('#sop-stepno').textContent='Section complete';var completed=currentPhase;markPhaseComplete(completed);updatePhaseTabs();var next=phaseOrder[phaseOrder.indexOf(completed)+1];$('#sop-task').textContent=phaseInfo[completed].title+' complete.';$('#sop-why').textContent=next?'The simulator will now move to '+phaseInfo[next].title+' so the beginner follows the laboratory sequence without skipping ahead.':'The full beginner workflow is complete.';$('#sop-next-hint').textContent=next?'Automatic transition in progress…':'Workflow complete.';$('#sop-progress').textContent='100%';if(!next){showNotice('✓ Full IIT SOP beginner workflow complete.',2200);return;}showTransition(completed,next);transitionTimer=setTimeout(function(){setPhase(next,true,{carry:true,force:true});},1750);
  }

  function touch(targetKey) {
    interactionSerial++;
    updateUI();
    checkCurrentStep(targetKey);
  }

  function checkCurrentStep(targetKey) {
    var st = currentStep();
    if (!st) return;
    if (st.success && st.success()) {
      setTimeout(function(){
        var current = currentStep();
        if(current && current.id === st.id && st.success()) advance();
      }, 180);
    }
  }

  function advance() { stepIndex++; activateStep(); }

  function highlightTarget(target) {
    $$('.sop-control').forEach(function(el){ el.classList.remove('is-target'); });
    $('#sop-clickcue').classList.remove('is-visible');
    var targets = Array.isArray(target) ? target : (target ? [target] : []);
    targets.forEach(function(t){
      if(t==='screen') { $('#sop-clickcue').classList.add('is-visible'); return; }
      $$('[data-control="' + t + '"]').forEach(function(el){ el.classList.add('is-target'); });
    });
    updateControlGating();
  }

  function magLabel() {
    var v=state.magCam;
    if(v < 18) return '1k×';
    if(v < 34) return '5k×';
    if(v < 53) return '40k×';
    if(v < 68) return '100k×';
    if(v < 84) return '150k×';
    return '800k×';
  }
  function camLengthLabel() {
    var v=state.magCam;
    if(v < 25) return '100 mm';
    if(v < 50) return '300 mm';
    if(v < 75) return '600 mm';
    return '1000 mm';
  }

  function updateUI() {
    $('#sop-led-vac').classList.toggle('is-on', state.airlockStatus === 'EVACUATED' || currentPhase !== 'setup');
    $('#sop-vac-status').textContent = state.airlockStatus === 'PUMPING' ? 'PUMPING' : (state.airlockStatus === 'VENTING' ? 'VENTING' : (state.airlockStatus === 'EVACUATED' ? 'READY' : 'VENTED'));
    $('#sop-led-beam').classList.toggle('is-on', state.beamOn);
    $('#sop-beam-status').textContent = state.beamOn ? 'ON' : 'OFF';
    $('#sop-ht-status').textContent = state.htOn ? state.voltage + ' kV ON' : (state.voltage + ' kV ' + (state.voltage===80?'READY':'OFF'));
    $('#sop-mode-status').textContent = modeDisplay();
    $('#sop-mag-status').textContent = state.functionMode === 'sadiff' ? camLengthLabel() : magLabel();
    $('#sop-screen-mode').textContent = phaseInfo[currentPhase].screen;

    $('#btn-beam').classList.toggle('is-on', state.beamOn);
    $('#btn-ht').classList.toggle('is-on', state.htOn); $('#btn-ht').textContent = state.htOn ? 'HT OFF' : 'HT ON';
    $('#btn-filament').classList.toggle('is-on', state.filamentOn); $('#btn-filament').textContent = state.filamentOn ? 'FILAMENT OFF' : 'FILAMENT ON';
    $('#btn-wobble').classList.toggle('is-on', state.wobbleOn);
    $('#btn-std-focus').classList.toggle('is-selected', state.stdFocus);
    $('#btn-neutral').classList.toggle('is-selected', state.stageNeutral);
    $('#btn-safety').classList.toggle('is-selected', state.safetyVerified);
    $('#btn-green').classList.toggle('is-selected', state.greenReady);

    $$('[data-voltage]').forEach(function(btn){ btn.classList.toggle('is-selected', +btn.dataset.voltage === state.voltage); });
    $$('[data-defmode]').forEach(function(btn){ btn.classList.toggle('is-selected', btn.dataset.defmode === state.defMode); });
    $$('[data-function]').forEach(function(btn){ btn.classList.toggle('is-selected', btn.dataset.function === state.functionMode); });
    $$('[data-aperture]').forEach(function(btn){ btn.classList.toggle('is-selected', btn.dataset.aperture === state.selectedAperture); });
    $$('[data-simple]').forEach(function(btn){ btn.classList.toggle('is-selected', !!state[btn.dataset.simple]); });

    setRange('rng-brightness', state.brightness, 'out-brightness', String(state.brightness));
    setRange('rng-def-x', state.defX, 'out-def-x', String(state.defX));
    setRange('rng-def-y', state.defY, 'out-def-y', String(state.defY));
    setRange('rng-focus-c', state.focusCoarse, 'out-focus-c', String(state.focusCoarse));
    setRange('rng-focus-f', state.focusFine, 'out-focus-f', String(state.focusFine));
    setRange('rng-diff-focus', state.diffFocus, 'out-diff-focus', String(state.diffFocus));
    setRange('rng-alpha', state.alpha, 'out-alpha', state.alpha + '°');
    setRange('rng-beta', state.beta, 'out-beta', state.beta + '°');
    setRange('rng-magcam', state.magCam, 'out-magcam', state.functionMode === 'sadiff' ? camLengthLabel() : magLabel());

    $('#out-stage-z').textContent = (state.stageZ>=0?'+':'') + state.stageZ + ' µm';
    $('#out-airlock').textContent = state.airlockStatus;
    $('#out-holder').textContent = state.holderPos;

    $('#meta-ol').textContent = state.apertures.ol ? 'IN' : 'OUT';
    $('#meta-sa').textContent = state.apertures.sa ? 'IN' : 'OUT';
    $('#meta-caml').textContent = state.functionMode === 'sadiff' ? camLengthLabel() : magLabel();
    $('#meta-beam').textContent = beamMeta();

    var progress = phases[currentPhase].length ? Math.round((stepIndex / phases[currentPhase].length) * 100) : 0;
    $('#sop-progress').textContent = Math.min(100, progress) + '%';
    $('#sop-next-hint').textContent = currentStep() ? 'Use the highlighted control to continue.' : 'Section complete.';

    $('#sop-fft').classList.toggle('is-visible', currentPhase === 'hrtem' && state.functionMode === 'mag1');
    updatePhaseTabs();updateControlGating();updatePCMirror();updateColumnMirror();render();renderFFT();renderCameraPreview();
  }

  function setRange(id, val, outId, text) { var el=$('#'+id); if(+el.value!==+val) el.value=val; $('#'+outId).textContent=text; }

  function modeDisplay() {
    if(currentPhase==='df' && state.functionMode==='mag1' && state.diffractionSpotSelected) return 'DF';
    if(currentPhase==='hrtem' && state.functionMode==='mag1') return 'HRTEM';
    if(state.functionMode==='sadiff') return 'SA DIFF';
    if(state.functionMode==='samag') return 'SA MAG';
    if(state.functionMode==='lowmag') return 'LOW MAG';
    return currentPhase==='bf' ? 'BF / MAG1' : 'MAG1';
  }

  function beamMeta() {
    if(currentPhase==='df' && state.diffractionSpotSelected) return 'Selected diffracted';
    if(currentPhase==='hrtem') return state.functionMode==='sadiff' ? 'Direct + diffracted pattern' : 'Multiple beams';
    if(currentPhase==='saed') return state.functionMode==='sadiff' ? 'Diffraction pattern' : 'Direct image beam';
    if(currentPhase==='bf') return 'Direct 000';
    return state.beamOn ? 'Illumination beam' : 'Beam off';
  }

  function showNotice(text, ms) {
    var el=$('#sop-global-toast');if(!el){el=document.createElement('div');el.id='sop-global-toast';el.className='sop-global-toast';document.body.appendChild(el);}el.textContent=text;el.classList.add('is-visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(function(){el.classList.remove('is-visible');},ms||1200);
  }

  function animationLoop(t) {
    if(state.wobbleOn || currentPhase==='hrtem') render(t || performance.now());
    requestAnimationFrame(animationLoop);
  }

  function render(t) {
    var c=$('#sop-canvas'); if(!c) return;
    var ctx=c.getContext('2d'), w=c.width, h=c.height;
    ctx.save(); ctx.clearRect(0,0,w,h); ctx.fillStyle='#04070b'; ctx.fillRect(0,0,w,h);

    if(state.functionMode==='sadiff') drawDiffraction(ctx,w,h,t||0);
    else if(currentPhase==='setup') drawSetup(ctx,w,h,t||0);
    else if(currentPhase==='df') drawSpecimen(ctx,w,h,'df',t||0);
    else if(currentPhase==='hrtem') drawHRTEM(ctx,w,h,t||0);
    else drawSpecimen(ctx,w,h,'bf',t||0);

    ctx.restore();
  }

  function drawSetup(ctx,w,h,t) {
    var cx=w/2 + state.defX*2.4, cy=h/2 + state.defY*1.6;
    if(!state.beamOn) {
      ctx.fillStyle='#0b1320'; ctx.fillRect(0,0,w,h);
      ctx.fillStyle='#64748b'; ctx.font='24px IBM Plex Mono, monospace'; ctx.textAlign='center'; ctx.fillText('BEAM OFF', w/2, h/2);
      return;
    }
    var r=90 + state.brightness*2.1;
    var g=ctx.createRadialGradient(cx,cy,0,cx,cy,r); g.addColorStop(0,'rgba(220,255,220,.93)'); g.addColorStop(.6,'rgba(174,235,184,.62)'); g.addColorStop(1,'rgba(80,160,95,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(56,189,248,.35)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(w/2-18,h/2);ctx.lineTo(w/2+18,h/2);ctx.moveTo(w/2,h/2-18);ctx.lineTo(w/2,h/2+18);ctx.stroke();
  }

  function drawSpecimen(ctx,w,h,kind,t) {
    var wob = state.wobbleOn ? Math.sin(t/150) * Math.min(35, Math.abs(state.stageZ)*1.6) : 0;
    var blur = Math.min(7, (Math.abs(state.focusCoarse)+Math.abs(state.focusFine))/10);
    if(sampleImage.complete && sampleImage.naturalWidth) {
      ctx.save();
      if(kind==='df') ctx.filter='invert(1) grayscale(1) contrast(1.65) brightness(.65)' + (blur?' blur('+blur+'px)':'');
      else ctx.filter='grayscale(1) contrast(1.05)' + (blur?' blur('+blur+'px)':'');
      var scale=Math.max(w/sampleImage.naturalWidth,h/sampleImage.naturalHeight);
      var dw=sampleImage.naturalWidth*scale, dh=sampleImage.naturalHeight*scale;
      ctx.drawImage(sampleImage,(w-dw)/2+wob,(h-dh)/2,dw,dh);
      ctx.restore();
    } else {
      ctx.fillStyle=kind==='df'?'#0b0f14':'#cfd4d8'; ctx.fillRect(0,0,w,h);
      for(var i=0;i<36;i++){ var x=(i*137)%w, y=(i*83)%h, r=12+(i%5)*5; ctx.fillStyle=kind==='df'?'#d8e1e8':'#434b55'; ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill(); }
    }
    if(kind==='df' && !state.diffractionSpotSelected) { ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(0,0,w,h); }
  }

  function drawDiffraction(ctx,w,h,t) {
    ctx.fillStyle='#010308'; ctx.fillRect(0,0,w,h);
    var cx=w/2 + (state.defMode==='pla'?state.defX*2.1:0), cy=h/2 + (state.defMode==='pla'?state.defY*1.7:0);
    var spotBlur=Math.min(11,Math.abs(state.diffFocus)/4);
    var spots=[[-150,0],[150,0],[0,-150],[0,150],[-108,-108],[108,-108],[-108,108],[108,108],[-220,72],[220,-72]];
    ctx.save();
    ctx.shadowColor='white'; ctx.shadowBlur=8+spotBlur;
    drawSpot(ctx,cx,cy,7+spotBlur*.4,'#ffffff');
    spots.forEach(function(p,i){ drawSpot(ctx,cx+p[0],cy+p[1],4+spotBlur*.25,state.diffractionSpotSelected&&i===1?'#fbbf24':'#dce9ff'); });
    ctx.restore();

    if(currentPhase==='hrtem') {
      var ix=cx+state.alpha*10, iy=cy+state.beta*10;
      ctx.strokeStyle='rgba(148,163,184,.32)'; ctx.lineWidth=18;
      ctx.beginPath(); ctx.moveTo(ix-350,iy-150); ctx.lineTo(ix+350,iy+150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ix-300,iy+220); ctx.lineTo(ix+300,iy-220); ctx.stroke();
      ctx.strokeStyle='rgba(226,232,240,.48)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(ix-350,iy-150); ctx.lineTo(ix+350,iy+150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ix-300,iy+220); ctx.lineTo(ix+300,iy-220); ctx.stroke();
      ctx.strokeStyle='rgba(251,191,36,.85)'; ctx.beginPath();ctx.arc(ix,iy,15,0,Math.PI*2);ctx.stroke();
    }
  }

  function drawSpot(ctx,x,y,r,color){ ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }

  function drawHRTEM(ctx,w,h,t) {
    var aligned=Math.abs(state.alpha)<=1 && Math.abs(state.beta)<=1;
    var stig=Math.sqrt(state.defX*state.defX+state.defY*state.defY);
    var focus=Math.abs(state.focusFine);
    ctx.fillStyle='#777';ctx.fillRect(0,0,w,h);
    ctx.save();
    ctx.translate(w/2,h/2); ctx.rotate((state.defX-state.defY)*0.002);
    var spacing=aligned?14:18;
    var contrast=Math.max(.08,.45 - focus*.018 - stig*.007);
    for(var y=-h;y<h;y+=spacing){
      ctx.strokeStyle='rgba(20,20,20,'+contrast+')'; ctx.lineWidth=4; ctx.beginPath();ctx.moveTo(-w,y);ctx.lineTo(w,y+state.beta*1.5);ctx.stroke();
      ctx.strokeStyle='rgba(235,235,235,'+(contrast*.45)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w,y+5);ctx.lineTo(w,y+5+state.beta*1.5);ctx.stroke();
    }
    ctx.restore();
    var grad=ctx.createRadialGradient(w*.54,h*.5,40,w*.54,h*.5,330);grad.addColorStop(0,'rgba(0,0,0,.08)');grad.addColorStop(1,'rgba(0,0,0,.62)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    if(!aligned){ ctx.fillStyle='rgba(2,6,23,.62)';ctx.fillRect(0,0,w,h); ctx.fillStyle='#cbd5e1';ctx.font='20px IBM Plex Mono, monospace';ctx.textAlign='center';ctx.fillText('Zone axis not yet aligned',w/2,h/2); }
  }

  function renderFFT() {
    var c=$('#sop-fft-canvas'); if(!c) return; var ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#01030a';ctx.fillRect(0,0,w,h);
    var cx=w/2,cy=h/2;var sx=1+Math.abs(state.defX)*.02,sy=1+Math.abs(state.defY)*.02;var blur=Math.abs(state.focusFine)*.25;
    ctx.save();ctx.translate(cx,cy);ctx.shadowColor='#fff';ctx.shadowBlur=4+blur;var pts=[[0,0],[42,0],[-42,0],[0,42],[0,-42],[30,30],[-30,-30],[30,-30],[-30,30]];
    pts.forEach(function(p,i){ctx.fillStyle=i===0?'#fff':'#cfe8ff';ctx.beginPath();ctx.ellipse(p[0]*sx,p[1]*sy,2.4+blur*.12,2.4+blur*.12,0,0,Math.PI*2);ctx.fill();});ctx.restore();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
