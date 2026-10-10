(function(){
  'use strict';
  // Always-visible Stage Neutral control delegates to the existing instrument action.
  document.addEventListener('click',function(event){
    if(!event.target.closest('#sopStageNeutralVisible'))return;
    var original=document.querySelector('[data-temcon-page="stage"] [data-action="stage-neutralize"]');
    if(original&&!original.disabled)original.click();
  });


  var sections=[
    {id:1,title:'Safety Check and Instrument Startup',short:'Safety & Startup',implemented:true,steps:[
      {title:'Check chiller status',instruction:'Check if the chiller is ON in chiller room.',hint:'Verify the chiller image and displayed temperature before confirming.'},
      {title:'Confirm room conditions',instruction:'Confirm the room air conditioning is ON and the room temperature is approximately 20–22°C.',hint:''},
      {title:'Verify SIP vacuum',instruction:'Confirm the Sputter Ion Pump (SIP) unit vacuum is ≤ 2.5×10⁻⁵ Pa.',hint:'Read the SIP vacuum indication and confirm before continuing.'},
      {title:'Turn HT ON in TEMCON',instruction:'In the TEMCON High Voltage Control window, press HT ON and wait for the HT indicator to turn green. Verify the Valve Status evacuation indicators.',hint:'Use the existing HT ON button; wait for the accelerating-voltage popup to close.'},
      {title:'Check anti-contamination trap',instruction:'Check and, if required, refill the liquid nitrogen in the anti-contamination trap.',hint:'Confirm the anti-contamination trap check before continuing.'},
      {title:'Allow system stabilization',instruction:'Allow the filament and system to stabilize for the recommended warm-up period according to the operating guidelines.',hint:''},
      {title:'Record startup in logbook',instruction:'Record instrument startup in the logbook, including date, time, and operator name.',hint:'Complete all startup logbook fields before saving.'}
    ]},
    {id:2,title:'Specimen Loading and Holder Insertion',short:'Specimen Loading',implemented:true,steps:[
      {title:'Inspect holder O-rings',instruction:'Inspect the holder O-rings for damage, dust, or old grease; clean with a lint-free wipe and re-grease lightly if required before use.',hint:'Inspect the O-ring area in the close-up modal and confirm.'},
      {title:'Confirm goniometer green lamp',instruction:'Confirm the goniometer green lamp is lit, indicating it is ready for holder loading. If it is not lit, do not attempt to insert the holder.',hint:'Verify the green ready lamp before continuing.'},
      {title:'Load TEM grid',instruction:'Open the holder cartridge, place the TEM grid sample-side up using fine anti-static tweezers, and close the retaining clip securely so the grid cannot shift in transit.',hint:'Complete the three actions in order.'},
      {title:'Confirm EVAC Ready in TEMCON',instruction:'In the TEMCON Valve Status window, verify that Specimen / PIG4 reads EVAC Ready before proceeding with specimen-holder insertion.',hint:'The TEMCON drawer opens automatically. Verify Specimen / PIG4 shows EVAC Ready before continuing.'},
      {title:'Insert holder to first stop',instruction:'Insert the specimen holder straight into the goniometer port following the guide key until the first mechanical stop. Do not force it. Support the holder until you hear 3 clicks.',hint:'Drag the holder toward the port. Three spaced click sounds play at the first stop.'},
      {title:'Set PUMP and complete evacuation',instruction:'Set the goniometer PUMP/AIR switch to PUMP to begin evacuation, then wait until the amber lamp goes OFF before continuing. Do not rotate or push the holder further while evacuation is in progress.',hint:'The roughing-pump rumble continues throughout evacuation. Continue only after the amber lamp goes OFF.'},
      {title:'Rotate and fully insert holder',instruction:'Rotate the specimen holder by 15° clockwise and then by 75° clockwise to complete insertion into the goniometer.',hint:'Use the highlighted rotation buttons in sequence. The holder images update as each rotation is completed.'},
      {title:'Select holder model in TEMCON',instruction:'In the upper-right TEMCON holder dropdown, select EM-21010/21020 : Single Tilt Holder. Then confirm the selection in the popup.',hint:'Change the existing selection from Single Tilt Beryllium Holder to Single Tilt Holder to open the confirmation modal.'}
    ]},
    {id:3,title:'Bright Field Imaging',short:'Bright Field',implemented:true,steps:[
      {title:'High Voltage · Set target',instruction:'Set the Auto HT target voltage to 200 kV.',hint:'Select 200 kV in TEMCON High Voltage Control.'},
      {title:'High Voltage · Set step size',instruction:'Set the Auto HT voltage step size to 0.5 kV.',hint:'Select 0.5 kV.'},
      {title:'High Voltage · Set interval',instruction:'Set the Auto HT Time/Step to 10 s.',hint:'Select 10 s.'},
      {title:'High Voltage · Start ramp',instruction:'Press Start under Auto HT and allow the accelerating voltage to rise from 80 kV to 200 kV.',hint:'The real ramp duration is compressed in the simulator.'},
      {title:'Vacuum · Verify V2',instruction:'In the TEMCON Valve Status window beside High Voltage Control, verify that valve V2 is OPEN and the chamber vacuum is ready.',hint:'Observe the V2 green indicator before confirming.'},
      {title:'Electron Source · Filament ON',instruction:'Press Filament ON in High Voltage Control. Observe the Setting the Filament popup and wait for its progress bar to finish; Beam Current will reach 103 µA.',hint:'A filament-setting progress bar appears over the Valve Status window. Wait until it reaches 100%.'},
      {title:'Electron Source · Beam current',instruction:'Verify that the Beam Current has stabilized at 103 µA after filament setting.',hint:'The reading holds at 103 µA and the observation step completes automatically.'},
      {title:'Beam · Turn BEAM ON',instruction:'Press BEAM on control panel L1. Observe the TEMCON Beam indicator turn green, then watch the fluorescent screen illuminate as the viewport zooms in and switches to Viewing Screen automatically.',hint:'Wait for both green-illumination views to fade in and for the automatic Viewing Screen transition.'},
      {title:'Imaging Mode · TEM',instruction:'Select TEM imaging mode on control panel L1.',hint:'Only the TEM control is active for this step.'},
      {title:'Magnification · LOW MAG',instruction:'Select LOW MAG on control panel R1.',hint:'Use LOW MAG for locating the region of interest.'},
      {title:'Magnification · Survey range',instruction:'Rotate MAG/CAM L until the magnification is within approximately 1,000–5,000×.',hint:'Any value in the manual-specified survey range is accepted.'},
      {title:'Specimen · Locate thin region',instruction:'Use the specimen-stage trackball to move to a hole or thin region of the specimen.',hint:'Center a distinct feature in the real specimen image.'},
      {title:'Focus · STD FOCUS',instruction:'Press STD FOCUS on control panel R1.',hint:'STD FOCUS resets objective focus to its standard reference.'},
      {title:'Illumination · SPOT SIZE',instruction:'Set the desired SPOT SIZE using the L1 rotary control.',hint:'The manual does not prescribe a fixed value here; make a deliberate selection.'},
      {title:'Illumination · α SELECTOR',instruction:'Set the desired α SELECTOR using the L1 rotary control.',hint:'The manual does not prescribe a fixed value here; make a deliberate selection.'},
      {title:'Magnification · MAG 1',instruction:'Select MAG 1 on control panel R1.',hint:'MAG 1 is used for the following higher-magnification alignment.'},
      {title:'Magnification · X40k',instruction:'Rotate MAG/CAM L until approximately X40k is reached.',hint:'The Viewing Screen magnification updates with the knob.'},
      {title:'Illumination · Crossover',instruction:'Rotate BRIGHTNESS until the filament illumination is focused to a crossover.',hint:'Reach the smallest beam diameter.'},
      {title:'Illumination · Spread beam',instruction:'Turn BRIGHTNESS clockwise to overfocus the C3 condenser lens and spread illumination to fill the screen.',hint:'Expand the beam after reaching crossover.'},
      {title:'Z Correction · Center feature',instruction:'At MAG 1, use the stage trackball to position a thin feature at the screen centre.',hint:'Center the highlighted feature.'},
      {title:'Z Correction · STD FOCUS',instruction:'Press STD FOCUS before adjusting specimen height.',hint:'Reset objective focus before Z correction.'},
      {title:'Z Correction · Coarse Z',instruction:'Use Z UP / Z DOWN to bring the feature toward focus or minimum contrast.',hint:'Approach the eucentric-height region.'},
      {title:'Z Correction · Wobbler ON',instruction:'Press MAG WOB X or MAG WOB Y on R1 to start the wobble.',hint:'Use either axis as specified in the manual.'},
      {title:'Z Correction · Minimize wobble',instruction:'While the wobbler is ON, use Z UP / Z DOWN until lateral motion is minimized.',hint:'The real specimen image wobble reduces as Z approaches the correct height.'},
      {title:'Z Correction · Wobbler OFF',instruction:'Press the same MAG WOB X or MAG WOB Y control again to switch the wobble OFF.',hint:'The corrected Z height is retained.'},
      {title:'Condenser Aperture · Select',instruction:'Select an appropriate condenser aperture using the Knob 1 click-stops on the condenser-aperture assembly.',hint:'A temporary dummy column-hardware control is used until the actual reference image is supplied.'},
      {title:'Condenser Aperture · Centre X',instruction:'Adjust the condenser-aperture CA X centering control.',hint:'Center the beam horizontally.'},
      {title:'Condenser Aperture · Centre Y',instruction:'Adjust the condenser-aperture CA Y centering control.',hint:'Center the beam vertically.'},
      {title:'Condenser Aperture · Verify',instruction:'Vary BRIGHTNESS so the beam spreads and contracts symmetrically about the optical axis.',hint:'Verify there is no off-centre shift or crescent clipping.'},
      {title:'Condenser Lens · Crossover',instruction:'Adjust BRIGHTNESS to bring the beam to crossover.',hint:'Use the Viewing Screen to observe the minimum beam diameter.'},
      {title:'Condenser Lens · SHIFT X',instruction:'Use SHIFT X on L1 to centre the crossover horizontally.',hint:'Move the beam toward the viewing-axis centre.'},
      {title:'Condenser Lens · SHIFT Y',instruction:'Use SHIFT Y on R1 to centre the crossover vertically.',hint:'Complete beam centering.'},
      {title:'Condenser Lens · Spread',instruction:'Turn BRIGHTNESS to spread the beam over the screen.',hint:'Expand the illumination after centering the crossover.'},
      {title:'Condenser Lens · Re-centre X',instruction:'If the expanding beam drifts, use SHIFT X to correct the horizontal position.',hint:'Keep the expanded beam centered.'},
      {title:'Condenser Lens · Re-centre Y',instruction:'If the expanding beam drifts, use SHIFT Y to correct the vertical position.',hint:'Keep the expanded beam centered.'},
      {title:'CL Astigmatism · Spot Size 1',instruction:'Set SPOT SIZE to 1.',hint:'Spot Size 1 is required before condenser-lens astigmatism correction.'},
      {title:'CL Astigmatism · COND STIG ON',instruction:'Press COND STIG on L1 to enter condenser-stigmator adjustment.',hint:'DEF/STIG X and Y now adjust condenser stigmation.'},
      {title:'CL Astigmatism · Inspect shape',instruction:'Rotate BRIGHTNESS clockwise and anticlockwise through crossover to inspect the beam shape.',hint:'The simulated illumination outline is intentionally elliptical before correction while the real specimen remains visible.'},
      {title:'CL Astigmatism · DEF/STIG X',instruction:'Adjust DEF/STIG X on L1 to reduce the X component of beam ellipticity.',hint:'Move the beam shape toward circular.'},
      {title:'CL Astigmatism · DEF/STIG Y',instruction:'Adjust DEF/STIG Y on R1 to reduce the Y component of beam ellipticity.',hint:'Complete the circularization.'},
      {title:'CL Astigmatism · Verify',instruction:'Rotate BRIGHTNESS back and forth through crossover and verify the beam remains approximately circular.',hint:'Check the correction on both sides of crossover.'},
      {title:'CL Astigmatism · COND STIG OFF',instruction:'Press COND STIG again to exit condenser-stigmator adjustment.',hint:'The corrected setting is retained.'},
      {title:'Acquisition · Select ROI',instruction:'Use the stage trackball to select and centre the final area of interest.',hint:'Centre the required area using the real specimen image.'},
      {title:'Acquisition · Final magnification',instruction:'With MAG 1 retained, rotate MAG/CAM L to X60k for this real-sample exercise.',hint:'The supplied final Bright Field image sequence was recorded at 60,000×, so use X60k for the acquisition sequence.'},
      {title:'Acquisition · Spread beam',instruction:'Use BRIGHTNESS to spread the beam appropriately for image recording.',hint:'Set uniform illumination over the final field of view.'},
      {title:'Acquisition · AUTO contrast',instruction:'Press AUTO if automatic image-contrast adjustment is desired.',hint:'AUTO is optional and does not block progression.'},
      {title:'Acquisition · F1 screen UP',instruction:'Press F1 on R1 to lift the fluorescent screen and expose the transmitted beam to the camera.',hint:'The camera exposure path becomes active.'},
      {title:'Acquisition · iTEM workspace',instruction:'The Olympus iTEM acquisition workspace opens automatically in the PC drawer. Observe the specimen preview and camera tools before proceeding.',hint:'No Open iTEM button is needed. The workspace opens and the real specimen image appears automatically.'},
      {title:'Acquisition · Three focus conditions',instruction:'Inspect the specimen only in the Olympus iTEM camera window. Turn OBJ FOCUS counter-clockwise for underfocus (bright outer fringes), bring the image to in-focus (smooth background and minimum contrast), then turn clockwise for overfocus (dark outer fringes). Observe each condition, return near focus, and confirm in iTEM.',hint:'Underfocus / Scherzer: bright white fringe outside nanoparticle edges and textured carbon background. In-focus: flat, smooth background and no edge fringe. Overfocus: dark shadow fringe outside particle edges; avoid for final size measurement.'},
      {title:'Acquisition · Video',instruction:'Click the Video icon in iTEM to start the live camera feed.',hint:'Live acquisition begins.'},
      {title:'Acquisition · Snapshot',instruction:'Click Snapshot in iTEM to capture the Bright Field image.',hint:'The real-sample Bright Field image is captured.'},
      {title:'Acquisition · F1 screen DOWN',instruction:'After acquiring the image, press F1 again to return the fluorescent screen.',hint:'Bright Field acquisition is complete; limit real camera exposure as required by the operating procedure.'}
    ]},
    {id:4,title:'Dark Field Imaging',short:'Dark Field',implemented:true,upcoming:true,steps:[
      {title:'Diffraction · Switch to DIFF',instruction:'With the specimen in the stable focused Bright Field condition inherited from Section 3, switch the microscope to diffraction mode.',hint:'Use DIFF on the R1 Imaging / Magnification Mode control.'},
      {title:'Diffraction · Select reflection',instruction:'Select the diffracted spot of interest that will be used to form the Dark Field image.',hint:'Click the highlighted diffracted reflection on the SAED pattern.'},
      {title:'Beam Tilt · Activate DARK/BRIGHT TILT',instruction:'Activate DARK/BRIGHT TILT so the DEF/STIG X and Y controls adjust beam tilt for Dark Field alignment.',hint:'Use the DARK/BRIGHT TILT function on L1.'},
      {title:'Beam Tilt · Align X',instruction:'Adjust beam-tilt X until the selected diffracted spot is horizontally aligned with the optical axis.',hint:'Move the selected reflection toward the central crosshair.'},
      {title:'Beam Tilt · Align Y',instruction:'Adjust beam-tilt Y until the selected diffracted spot reaches the optical axis.',hint:'The selected reflection should finish at the screen centre.'},
      {title:'Dark Field · Return to image mode',instruction:'Switch back to MAG 1 image mode. The image should now be formed primarily from the selected diffracted beam.',hint:'The specimen view changes from the diffraction pattern to a Dark Field image.'},
      {title:'Objective Aperture · Insert',instruction:'Insert/select the objective aperture for Dark Field imaging to exclude the direct beam.',hint:'Select OBJ under Objective Aperture.'},
      {title:'Objective Aperture · Centre X',instruction:'Adjust objective-aperture X to improve Dark Field illumination from the selected diffracted beam.',hint:'Use Aperture Align and centre the X position.'},
      {title:'Objective Aperture · Centre Y',instruction:'Adjust objective-aperture Y to complete centering around the selected diffracted beam.',hint:'Correct centering produces the strongest, cleanest Dark Field image.'},
      {title:'Focus · Coarse',instruction:'Use OBJ FOCUS COARSE to bring the Dark Field image close to focus.',hint:'Reduce blur and Fresnel-fringe strength.'},
      {title:'Focus · Fine',instruction:'Use OBJ FOCUS FINE to minimize Fresnel-fringe contrast and reach the final focus condition.',hint:'Fine focus should leave the selected features sharp.'},
      {title:'Astigmatism · OBJ STIG ON',instruction:'Activate OBJ STIG to check and, if required, correct objective astigmatism.',hint:'The simulator introduces a small residual astigmatism for training.'},
      {title:'Astigmatism · DEF/STIG X',instruction:'Adjust DEF/STIG X to reduce the X component of objective astigmatism.',hint:'Move the Dark Field image toward symmetric sharpness.'},
      {title:'Astigmatism · DEF/STIG Y',instruction:'Adjust DEF/STIG Y to reduce the Y component of objective astigmatism.',hint:'Complete the astigmatism correction.'},
      {title:'Astigmatism · OBJ STIG OFF',instruction:'Press OBJ STIG again to exit stigmator adjustment and retain the corrected setting.',hint:'The final Dark Field image should remain sharp and stable.'},
      {title:'Acquisition · F1 screen UP',instruction:'Press F1 to lift the fluorescent screen and expose the Dark Field image to the camera.',hint:'The camera path becomes active.'},
      {title:'Acquisition · Open iTEM',instruction:'Open iTEM in the camera workstation for Dark Field acquisition.',hint:'A simulator iTEM panel is used until an actual screenshot is supplied.'},
      {title:'Acquisition · Video',instruction:'Start Video in iTEM to confirm the live Dark Field image.',hint:'The live camera view uses the corrected Dark Field condition.'},
      {title:'Acquisition · Snapshot',instruction:'Capture the Dark Field image using Snapshot.',hint:'The captured image is associated with the selected diffraction reflection.'},
      {title:'Acquisition · Record reflection',instruction:'Record the selected diffraction-spot identifier with the Dark Field image for correlation with the SAED pattern.',hint:'Save the simulator reflection ID g1 with the captured DF image.'},
      {title:'Acquisition · F1 screen DOWN',instruction:'Press F1 again to return the fluorescent screen after acquisition.',hint:'Dark Field imaging is complete.'}
    ]},
    {id:5,title:'Selected Area Electron Diffraction (SAED) Mode',short:'SAED',implemented:false,upcoming:true,steps:[]},
    {id:6,title:'Instrument Shutdown',short:'Shutdown',implemented:false,steps:[]}
  ];

  var state={sample:null,currentSection:0,currentStep:0,unlockedThrough:0,sectionComplete:{},completed:{},gridStage:0,insertionDone:false,pumpStarted:false,evacuationDone:false,rotation15:false,rotation75:false,holderSeated:false,trackballMoved:false,pumpTimer:null};
  var bfState={mag:3000,mode:'image',featureX:35,featureY:65,z:-8,wobble:false,wobbleSeen:false,aperture:'',caX:5,caY:-4,c2:45,c2Moves:0,condX:4,condY:-3,condTest:false,beamX:5,beamY:-4,objX:4,objY:-3,focusCoarse:8,focusFine:2,finalFocusChecked:false,finalAstigChecked:false,captured:false};
  var dfState={mode:'image',selectedReflection:false,tiltMode:false,tiltX:0,tiltY:0,darkField:false,objInserted:false,objX:25,objY:-20,focusCoarse:12,focusFine:6,objStigOn:false,astigX:9,astigY:-8,screenRaised:false,itemOpen:false,videoOn:false,captured:false,recorded:false};
  var SECTION1_STEP1_START_DELAY_MS=2000;
  var STEP_MODAL_READING_DELAY_MS=2000;
  /* RS3: preserve each achieved output and its completion message long enough for consolidation. */
  var STEP_RESULT_HOLD_MS=2500;
  var SECTION3_NEXT_STEP_DELAY_MS=450;
  var STEP4_PC_OBSERVE_DELAY_MS=7000;
  var FULLSCREEN_REMINDER_MS=4200;
  var audioCtx=null,pumpNodes=null,modalLocked=false,nextModalTimer=null;
  var stepTransitionPending=false,pendingStepCleanup=null;
  var SECTION3_ACHIEVEMENTS=[
    'Auto HT target is set to 200 kV.',
    'Auto HT voltage increment is set to 0.5 kV.',
    'Auto HT interval is set to 10 s per step.',
    'Accelerating voltage has reached 200 kV and stabilized.',
    'The electron-source filament is ON.',
    'Beam current has stabilized at approximately 103 µA.',
    'V2 is open for image observation.',
    'The electron beam is ON and available for imaging.',
    'TEM imaging mode is selected.',
    'LOW MAG mode is selected for specimen survey.',
    'A suitable low-magnification survey range has been reached.',
    'A useful thin specimen region has been located with the stage.',
    'Objective focus has been reset to STD FOCUS.',
    'The selected SPOT SIZE is established.',
    'The selected α setting is established.',
    'MAG 1 mode is selected for higher-magnification alignment.',
    'The specimen is set to approximately X40k.',
    'The illumination has been focused to crossover.',
    'The beam has been spread to illuminate the viewing area.',
    'The reference specimen feature is centered for Z correction.',
    'STD FOCUS has been restored before eucentric-height adjustment.',
    'Specimen Z is close to the eucentric-height region.',
    'The magnification wobbler is ON and specimen motion is visible.',
    'Wobble motion has been minimized by correcting specimen Z.',
    'The wobbler is OFF with the corrected Z height retained.',
    'A suitable condenser aperture is selected.',
    'Condenser-aperture X centering is corrected.',
    'Condenser-aperture Y centering is corrected.',
    'The condenser aperture is verified by symmetric beam expansion and contraction.',
    'The condenser beam is returned to crossover.',
    'The crossover is centered horizontally with SHIFT X.',
    'The crossover is centered vertically with SHIFT Y.',
    'The beam is spread over the viewing screen.',
    'Horizontal beam drift during expansion is corrected.',
    'Vertical beam drift during expansion is corrected.',
    'SPOT SIZE 1 is set for condenser-astigmatism correction.',
    'COND STIG adjustment mode is active.',
    'Beam shape has been inspected through crossover.',
    'The X component of condenser astigmatism is corrected.',
    'The Y component of condenser astigmatism is corrected.',
    'The beam remains approximately circular through crossover.',
    'COND STIG adjustment is complete and the correction is retained.',
    'The final real-sample region of interest is centered.',
    'Final acquisition magnification is set to X60k.',
    'The beam is spread appropriately for image recording.',
    'Image contrast is ready for acquisition; AUTO adjustment was handled as selected.',
    'The fluorescent screen is raised and the camera path is exposed.',
    'iTEM is open with the real Bright Field specimen available.',
    'Through-focus observed: underfocus (bright fringes), in-focus (sharp), overfocus (dark fringes). Focus is set for BF acquisition.',
    'The live iTEM video feed is running on the real specimen.',
    'A real Bright Field snapshot has been captured.',
    'The fluorescent screen is returned after acquisition; Bright Field imaging is complete.'
  ];
  var nav=document.getElementById('sop-section-nav');
  var modal=document.getElementById('sopFlowModal');
  var modalTag=document.getElementById('sopFlowTag');
  var modalTitle=document.getElementById('sopFlowTitle');
  var modalStep=document.getElementById('sopFlowStep');
  var modalBody=document.getElementById('sopFlowBody');
  var modalFooter=document.getElementById('sopFlowFooter');
  var modalPanel=modal.querySelector('.sop-flow-modal__panel');
  var modalDragHandle=document.getElementById('sopFlowDragHandle');
  var modalCloseBtn=document.getElementById('sopFlowClose');
  var instr=document.getElementById('instr-text');
  var hint=document.getElementById('instr-hint');
  var sampleInd=document.getElementById('ind-sample');
  var progress=document.getElementById('progress-fill');
  var drawer=document.getElementById('pc-drawer');
  var drawerHandle=document.getElementById('pc-drawer-handle');
  var pcTem=document.getElementById('pc-tem');
  var pcCam=document.getElementById('pc-cam');
  var viewerStage=document.getElementById('viewer-stage');
  var columnPanel=document.querySelector('.viewer__panel[data-view-panel="column"]');
  var screenPanel=document.querySelector('.viewer__panel[data-view-panel="screen"]');
  var viewScreen=document.getElementById('view-screen');
  var viewEmpty=document.getElementById('view-empty');
  var prestartExplore=document.getElementById('sopPrestartExplore');
  var prestartSurface=document.getElementById('sopPrestartZoomSurface');
  var prestartTransform=document.getElementById('sopPrestartZoomTransform');
  var prestartRead=document.getElementById('sopPrestartZoomRead');
  var prestartZoom={scale:1,x:0,y:0,dragging:false,pointerId:null,startX:0,startY:0,downX:0,downY:0};
  var prestartReturnFocus=null;
  function clampPrestartZoom(){
    if(!prestartSurface)return;
    var w=prestartSurface.clientWidth,h=prestartSurface.clientHeight;
    var mx=w*(prestartZoom.scale-1)/2,my=h*(prestartZoom.scale-1)/2;
    prestartZoom.x=Math.max(-mx,Math.min(mx,prestartZoom.x));
    prestartZoom.y=Math.max(-my,Math.min(my,prestartZoom.y));
  }
  function renderPrestartZoom(){
    if(!prestartTransform)return;
    clampPrestartZoom();
    prestartTransform.style.transform='translate('+prestartZoom.x+'px,'+prestartZoom.y+'px) scale('+prestartZoom.scale+')';
    if(prestartRead)prestartRead.textContent=Math.round(prestartZoom.scale*100)+'%';
    var out=document.getElementById('sopPrestartZoomOut'),inBtn=document.getElementById('sopPrestartZoomIn');
    if(out)out.disabled=prestartZoom.scale<=1.001;
    if(inBtn)inBtn.disabled=prestartZoom.scale>=2.999;
  }
  function resetPrestartZoom(){
    prestartZoom.scale=1;prestartZoom.x=0;prestartZoom.y=0;
    prestartZoom.dragging=false;prestartZoom.pointerId=null;
    if(prestartSurface)prestartSurface.classList.remove('is-panning');
    renderPrestartZoom();
  }
  function changePrestartZoom(factor,clientX,clientY){
    if(!prestartSurface||!prestartExplore||prestartExplore.hidden)return;
    var old=prestartZoom.scale,now=Math.max(1,Math.min(3,old*factor));
    if(Math.abs(now-old)<.001)return;
    var r=prestartSurface.getBoundingClientRect();
    var px=(clientX===undefined?r.left+r.width/2:clientX)-(r.left+r.width/2);
    var py=(clientY===undefined?r.top+r.height/2:clientY)-(r.top+r.height/2);
    prestartZoom.x=px-(px-prestartZoom.x)*(now/old);
    prestartZoom.y=py-(py-prestartZoom.y)*(now/old);
    prestartZoom.scale=now;
    renderPrestartZoom();
  }
  function openPrestartActualPanel(which,button){
    if(state.sample||!prestartExplore||prestartExplore.hidden)return;
    var modal=document.getElementById('sopControlLocator'),img=document.getElementById('sopLocatorImage');
    var title=document.getElementById('sopLocatorTitle'),note=document.getElementById('sopLocatorNote');
    var hl=document.getElementById('sopLocatorHighlight');
    if(!modal||!img)return;
    prestartReturnFocus=button||null;
    img.src=which==='l1'?'../assets/images/sop/section3-l1-modal-reference.png':'../assets/images/sop/section3-r1-modal-reference.png';
    img.alt=which==='l1'?'Actual photographic layout of the JEOL L1 left control panel':'Actual photographic layout of the JEOL R1 right control panel';
    if(title)title.textContent=which==='l1'?'L1 · Actual Left Control Panel':'R1 · Actual Right Control Panel';
    if(note)note.textContent='Actual JEOL control-panel layout for orientation. Close this view and press Start when ready.';
    if(hl)hl.style.display='none';
    modal.classList.add('sop-prestart-reference','is-open');modal.setAttribute('aria-hidden','false');
    var close=document.getElementById('sopLocatorClose');if(close)close.focus();
  }
  function startPrestartExplore(){
    if(!prestartExplore)return;
    if(state.sample)return;
    prestartExplore.hidden=false;
    document.body.classList.add('sop-prestart-active');
    resetPrestartZoom();
  }
  function stopPrestartExplore(){
    if(prestartExplore)prestartExplore.hidden=true;
    document.body.classList.remove('sop-prestart-active');
    resetPrestartZoom();
    var locator=document.getElementById('sopControlLocator');
    if(locator&&locator.classList.contains('sop-prestart-reference')){
      locator.classList.remove('sop-prestart-reference','is-open');locator.setAttribute('aria-hidden','true');
    }
    var hl=document.getElementById('sopLocatorHighlight');if(hl)hl.style.display='';
  }
  function wirePrestartExplore(){
    if(!prestartSurface)return;
    prestartSurface.addEventListener('wheel',function(e){
      if(prestartExplore.hidden||state.sample)return;
      e.preventDefault();
      changePrestartZoom(e.deltaY<0?1.15:(1/1.15),e.clientX,e.clientY);
    },{passive:false});
    prestartSurface.addEventListener('pointerdown',function(e){
      if(prestartExplore.hidden||state.sample||e.button!==0||e.target.closest('button'))return;
      prestartZoom.dragging=true;prestartZoom.pointerId=e.pointerId;
      prestartZoom.downX=e.clientX;prestartZoom.downY=e.clientY;
      prestartZoom.startX=prestartZoom.x;prestartZoom.startY=prestartZoom.y;
      prestartSurface.setPointerCapture(e.pointerId);
      prestartSurface.classList.add('is-panning');
      e.preventDefault();
    });
    prestartSurface.addEventListener('pointermove',function(e){
      if(!prestartZoom.dragging||e.pointerId!==prestartZoom.pointerId)return;
      prestartZoom.x=prestartZoom.startX+e.clientX-prestartZoom.downX;
      prestartZoom.y=prestartZoom.startY+e.clientY-prestartZoom.downY;
      renderPrestartZoom();
    });
    function endPan(e){if(e.pointerId!==prestartZoom.pointerId)return;
      prestartZoom.dragging=false;prestartZoom.pointerId=null;prestartSurface.classList.remove('is-panning');
      if(prestartSurface.hasPointerCapture(e.pointerId))prestartSurface.releasePointerCapture(e.pointerId);
    }
    prestartSurface.addEventListener('pointerup',endPan);
    prestartSurface.addEventListener('pointercancel',endPan);
    prestartSurface.addEventListener('dblclick',function(e){
      if(e.target.closest('button'))return;resetPrestartZoom();
    });
    [].slice.call(prestartExplore.querySelectorAll('[data-explore-panel]')).forEach(function(b){
      b.addEventListener('click',function(e){e.stopPropagation();openPrestartActualPanel(b.dataset.explorePanel,b);});
    });
    var plus=document.getElementById('sopPrestartZoomIn'),minus=document.getElementById('sopPrestartZoomOut'),reset=document.getElementById('sopPrestartZoomReset');
    if(plus)plus.addEventListener('click',function(){changePrestartZoom(1.25);});
    if(minus)minus.addEventListener('click',function(){changePrestartZoom(1/1.25);});
    if(reset)reset.addEventListener('click',resetPrestartZoom);
    document.addEventListener('keydown',function(e){
      var loc=document.getElementById('sopControlLocator');
      if(e.key==='Escape'&&loc&&loc.classList.contains('sop-prestart-reference')){
        loc.classList.remove('sop-prestart-reference','is-open');loc.setAttribute('aria-hidden','true');
        var hl=document.getElementById('sopLocatorHighlight');if(hl)hl.style.display='';
        if(prestartReturnFocus)prestartReturnFocus.focus();
      }
    });
    window.addEventListener('resize',function(){if(!prestartExplore.hidden)renderPrestartZoom();});
  }
  var viewportScene=null,viewportBg=null,viewportStatus=null,viewportControls=null,viewportGreenLamp=null,viewportAmberLamp=null,viewportSwitch=null,viewportHolder=null,viewportClicks=null,viewportProgress=null,viewportProgressBar=null,viewportFocus=null,viewportStep4Img1=null,viewportStep4Img2=null,viewportStep4Img3=null,viewportStep8Final=null;
  var bfScene=null,bfScreen=null,bfSpecimen=null,bfBeam=null,bfFeature=null,bfDirect=null,bfApertureRing=null,bfFringe=null,bfControlCard=null,bfActions=null,bfStatus=null,bfTimers=[];
  var s3Handlers={},s3KnobHandles={},s3PadHandles={},s3PanelInit=false,s3StepCompleting=false,s3LastBrightness=null;
  var DEFAULT_HOLDER_SRC='../assets/images/sop/section2-step4-holder-isolated.png';
  var STEP4_HOLDER_SRC='../assets/images/sop/section2-step4-holder-tip.png';
  var sceneTimers=[];
  var htRampTimers=[],htRampInterval=null;
  var section1Tour=null,tourRoomA=null,tourRoomB=null,tourChiller=null,tourDetail=null,tourControls=null,tourVeil=null;
  var tourTimers=[];
  var chillerSwapTimer=null;


  function clearTourTimers(){
    tourTimers.forEach(function(t){try{clearTimeout(t);}catch(e){}});
    tourTimers=[];
  }
  function ensureSection1Tour(){
    if(section1Tour||!columnPanel)return;
    var wrap=document.createElement('div');
    wrap.id='sopSection1Tour';
    wrap.className='sop-tour';
    wrap.hidden=true;
    wrap.innerHTML=''+
      '<div class="sop-tour__frame">'+
        '<img class="sop-tour__room sop-tour__room--a" id="sopTourRoomA" src="../assets/images/sop/column-viewport-real.png" alt="TEM room">'+
        '<img class="sop-tour__room sop-tour__room--b" id="sopTourRoomB" src="../assets/images/sop/section1-chiller-room-door-real.png" alt="Electron microscope laboratory view showing the chiller-room door">'+
        '<div class="sop-tour__veil" id="sopTourVeil"></div>'+
        '<img class="sop-tour__chiller" id="sopTourChiller" src="../assets/images/sop/section1-chiller-static.png" alt="Chiller temperature display">'+
        '<img class="sop-tour__detail" id="sopTourDetail" src="" alt="Detailed instrument check">'+
      '</div>'+
      '<div class="sop-tour__controls" id="sopTourControls"></div>';
    columnPanel.appendChild(wrap);
    section1Tour=wrap;
    tourRoomA=document.getElementById('sopTourRoomA');
    tourRoomB=document.getElementById('sopTourRoomB');
    tourChiller=document.getElementById('sopTourChiller');
    tourDetail=document.getElementById('sopTourDetail');
    tourControls=document.getElementById('sopTourControls');
    tourVeil=document.getElementById('sopTourVeil');
  }
  function setTourPhase(phase){
    ensureSection1Tour();
    if(!section1Tour)return;
    section1Tour.setAttribute('data-phase',phase||'home');
  }
  function hideSection1Tour(){
    ensureSection1Tour();
    clearTourTimers();
    if(!section1Tour)return;
    section1Tour.hidden=true;
    section1Tour.setAttribute('data-phase','home');
    if(tourControls)tourControls.innerHTML='';
    if(tourDetail){tourDetail.style.opacity='';tourDetail.src='';}
  }
  function runSection1Step1Tour(){
    closeModal(true); closePcDrawer(); hideViewportScene(); ensureSection1Tour(); clearTourTimers();
    if(!section1Tour)return;
    section1Tour.hidden=false;
    section1Tour.setAttribute('data-phase','home');
    if(tourControls)tourControls.innerHTML='';
    if(tourChiller)tourChiller.src='../assets/images/sop/section1-chiller-static.png';
    void section1Tour.offsetWidth;

    // Continuous cinematic route: smooth room rotation/crossfade -> one uninterrupted door approach -> chiller -> slow display zoom.
    // Keep the initial TEM-room image on screen long enough for orientation before beginning the turn.
    tourTimers.push(setTimeout(function(){setTourPhase('turn');},650));
    tourTimers.push(setTimeout(function(){setTourPhase('other');},5350));
    tourTimers.push(setTimeout(function(){setTourPhase('door-flight');},5650));
    tourTimers.push(setTimeout(function(){setTourPhase('enter-door');},14250));
    tourTimers.push(setTimeout(function(){setTourPhase('chiller-full');},16650));
    tourTimers.push(setTimeout(function(){setTourPhase('chiller-display');},18450));
    tourTimers.push(setTimeout(function(){
      if(!tourControls)return;
      tourControls.innerHTML='<button class="sop-flow-btn sop-flow-btn--success" id="sopTourConfirmChiller">Confirm chiller check</button>';
      var b=document.getElementById('sopTourConfirmChiller');
      if(b)b.addEventListener('click',returnFromChillerTour);
    },25950));
  }
  function returnFromChillerTour(){
    ensureAudio(); clearTourTimers();
    if(tourControls)tourControls.innerHTML='';
    // On return, skip the doorway replay: fade directly to Image 2, then turn back to Image 1.
    setTourPhase('return-other');
    tourTimers.push(setTimeout(function(){setTourPhase('return-turn');},3200));
    tourTimers.push(setTimeout(function(){setTourPhase('return-home');},8000));
    tourTimers.push(setTimeout(function(){
      completeStep(function(){hideSection1Tour();});
    },10200));
  }

  function runSection1Step3Tour(){
    closeModal(true); closePcDrawer(); hideViewportScene(); ensureSection1Tour(); clearTourTimers();
    if(!section1Tour)return;
    section1Tour.hidden=false;
    section1Tour.setAttribute('data-phase','sip-home');
    if(tourControls)tourControls.innerHTML='';
    if(tourChiller)tourChiller.src='../assets/images/sop/sip-vacuum-actual.jpg';
    if(tourDetail){tourDetail.src='../assets/images/sop/section1-sip-final.png';tourDetail.style.opacity='';}
    void section1Tour.offsetWidth;
    tourTimers.push(setTimeout(function(){setTourPhase('sip-approach');},900));
    tourTimers.push(setTimeout(function(){setTourPhase('sip-full');},7500));
    tourTimers.push(setTimeout(function(){setTourPhase('sip-gauge');},8900));
    tourTimers.push(setTimeout(function(){setTourPhase('sip-final');},14900));
    tourTimers.push(setTimeout(function(){
      if(!tourControls)return;
      tourControls.innerHTML='<button class="sop-flow-btn sop-flow-btn--success" id="sopTourConfirmSip">Confirm SIP vacuum</button>';
      var b=document.getElementById('sopTourConfirmSip');
      if(b)b.addEventListener('click',returnFromSipTour);
    },17100));
  }
  function returnFromSipTour(){
    ensureAudio(); clearTourTimers();
    if(tourControls)tourControls.innerHTML='';
    setTourPhase('sip-return-full');
    tourTimers.push(setTimeout(function(){setTourPhase('sip-return-room');},2600));
    tourTimers.push(setTimeout(function(){
      completeStep(function(){hideSection1Tour();});
    },6200));
  }


  function runSection1Step5Tour(){
    closeModal(true); closePcDrawer(); hideViewportScene(); ensureSection1Tour(); clearTourTimers();
    if(!section1Tour)return;
    section1Tour.hidden=false;
    section1Tour.setAttribute('data-phase','ln2-home');
    if(tourControls)tourControls.innerHTML='';
    if(tourChiller)tourChiller.style.opacity='0';
    if(tourDetail){tourDetail.src='../assets/images/sop/section1-ln2-final.png';tourDetail.style.opacity='';}
    void section1Tour.offsetWidth;
    tourTimers.push(setTimeout(function(){setTourPhase('ln2-approach');},1300));
    tourTimers.push(setTimeout(function(){setTourPhase('ln2-final');},7600));
    tourTimers.push(setTimeout(function(){
      if(!tourControls)return;
      tourControls.innerHTML='<button class="sop-flow-btn sop-flow-btn--success" id="sopTourConfirmLn2">Confirm LN₂ check</button>';
      var b=document.getElementById('sopTourConfirmLn2');
      if(b)b.addEventListener('click',returnFromLn2Tour);
    },9800));
  }
  function returnFromLn2Tour(){
    ensureAudio(); clearTourTimers();
    if(tourControls)tourControls.innerHTML='';
    setTourPhase('ln2-return-zoom');
    tourTimers.push(setTimeout(function(){setTourPhase('ln2-return-room');},1700));
    tourTimers.push(setTimeout(function(){
      completeStep(function(){hideSection1Tour();});
    },5900));
  }

  function ensureAudio(){try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}catch(e){}}
  // A holder-lock catch has both a short metal strike and a lower latching thud.
  // Layered Web Audio synthesis keeps the sound functional even when offline.
  function clickSound(delay){
    ensureAudio();if(!audioCtx)return;
    var t=audioCtx.currentTime+(delay||0);
    var bus=audioCtx.createGain(),limiter=audioCtx.createDynamicsCompressor();
    limiter.threshold.value=-13;limiter.knee.value=5;limiter.ratio.value=9;
    limiter.attack.value=.001;limiter.release.value=.09;
    bus.gain.setValueAtTime(.0001,t);
    bus.gain.exponentialRampToValueAtTime(.78,t+.003);
    bus.gain.exponentialRampToValueAtTime(.0001,t+.19);
    bus.connect(limiter);limiter.connect(audioCtx.destination);
    function hit(type,high,low,peak,duration,offset){
      var o=audioCtx.createOscillator(),g=audioCtx.createGain(),at=t+offset;
      o.type=type;o.frequency.setValueAtTime(high,at);
      o.frequency.exponentialRampToValueAtTime(low,at+duration*.85);
      g.gain.setValueAtTime(peak,at);
      g.gain.exponentialRampToValueAtTime(.0001,at+duration);
      o.connect(g);g.connect(bus);o.start(at);o.stop(at+duration+.005);
    }
    hit('square',290,77,.78,.112,0);          // solid catch, rather than a soft tick
    hit('triangle',1740,460,.63,.054,.002);   // sharp metal-on-metal click
    hit('square',610,155,.29,.080,.033);      // small follow-through latch
    var n=audioCtx.createBuffer(1,Math.round(audioCtx.sampleRate*.095),audioCtx.sampleRate),
        d=n.getChannelData(0);
    for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
    var src=audioCtx.createBufferSource(),hp=audioCtx.createBiquadFilter(),ng=audioCtx.createGain();
    src.buffer=n;hp.type='highpass';hp.frequency.value=900;
    ng.gain.setValueAtTime(.65,t);ng.gain.exponentialRampToValueAtTime(.0001,t+.085);
    src.connect(hp);hp.connect(ng);ng.connect(bus);src.start(t);src.stop(t+.095);
  }
  function threeClicks(sel){var q=sel?(sel+' span'):'.sop-clicks span, .sop-vscene__clicks span';var dots=[].slice.call(document.querySelectorAll(q));dots.forEach(function(x){x.classList.remove('is-hit');});[0,1,2].forEach(function(d,i){clickSound(d);setTimeout(function(){if(dots[i])dots[i].classList.add('is-hit');},d*1000);});}
  function startPump(){
    ensureAudio();if(!audioCtx||pumpNodes)return;
    var now=audioCtx.currentTime;
    var master=audioCtx.createGain(),compressor=audioCtx.createDynamicsCompressor();
    master.gain.setValueAtTime(.0001,now);
    master.gain.exponentialRampToValueAtTime(.48,now+.32); // stronger roughing-pump motor, compressor safeguards peaks
    compressor.threshold.value=-20;compressor.knee.value=16;
    compressor.ratio.value=4;compressor.attack.value=.008;compressor.release.value=.17;
    master.connect(compressor);compressor.connect(audioCtx.destination);
    var motor=audioCtx.createOscillator(),motorGain=audioCtx.createGain(),motorLP=audioCtx.createBiquadFilter();
    motor.type='sawtooth';motor.frequency.value=55;motorGain.gain.value=.53;
    motorLP.type='lowpass';motorLP.frequency.value=350;
    motor.connect(motorLP);motorLP.connect(motorGain);motorGain.connect(master);
    var harmonic=audioCtx.createOscillator(),harmonicGain=audioCtx.createGain();
    harmonic.type='triangle';harmonic.frequency.value=110;harmonicGain.gain.value=.21;
    harmonic.connect(harmonicGain);harmonicGain.connect(master);
    // Filtered air-flow/rotor noise makes it sound like roughing equipment,
    // not just a continuous electronic note.
    var buf=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),arr=buf.getChannelData(0);
    for(var i=0;i<arr.length;i++)arr[i]=Math.random()*2-1;
    var air=audioCtx.createBufferSource(),airFilter=audioCtx.createBiquadFilter(),airGain=audioCtx.createGain();
    air.buffer=buf;air.loop=true;airFilter.type='bandpass';airFilter.frequency.value=390;airFilter.Q.value=.52;
    airGain.gain.value=.28;air.connect(airFilter);airFilter.connect(airGain);airGain.connect(master);
    var pulse=audioCtx.createOscillator(),pulseDepth=audioCtx.createGain(),pulseBase=audioCtx.createConstantSource();
    pulse.type='sine';pulse.frequency.value=7.8;pulseDepth.gain.value=.12;
    pulseBase.offset.value=.86;
    var chuff=audioCtx.createGain();chuff.gain.value=0;
    // Keep periodic suction pulses positive: .86 + .12 * sin(t).
    pulseBase.connect(chuff.gain);pulse.connect(pulseDepth);pulseDepth.connect(chuff.gain);
    // Re-route air noise through the cyclic chuff envelope.
    airGain.disconnect();airGain.connect(chuff);chuff.connect(master);
    motor.start(now);harmonic.start(now);air.start(now);pulse.start(now);pulseBase.start(now);
    pumpNodes={master:master,o1:motor,o2:harmonic,noise:air,lfo:pulse,base:pulseBase};
  }
  function stopPump(){
    if(!pumpNodes||!audioCtx)return;
    var n=pumpNodes,p=audioCtx.currentTime;
    try{
      n.master.gain.cancelScheduledValues(p);
      n.master.gain.setValueAtTime(Math.max(.0001,n.master.gain.value||.1),p);
      n.master.gain.exponentialRampToValueAtTime(.0001,p+.38);
      [n.o1,n.o2,n.noise,n.lfo,n.base].forEach(function(node){if(node)node.stop(p+.40);});
    }catch(e){}
    pumpNodes=null;
  }


  function clearSceneTimers(){
    sceneTimers.forEach(function(t){try{clearTimeout(t);}catch(e){} try{clearInterval(t);}catch(e){}});
    sceneTimers=[];
  }
  function ensureViewportScene(){
    if(viewportScene||!columnPanel)return;
    var wrap=document.createElement('div');
    wrap.id='sopViewportScene';
    wrap.className='sop-vscene';
    wrap.hidden=true;
    wrap.innerHTML=''+
      '<div class="sop-vscene__frame">'+
        '<img class="sop-vscene__base" id="sopViewportBase" src="../assets/images/microscope/diagram/tem-guided-actual-room.jpg" alt="Full TEM room view">'+
        '<img class="sop-vscene__focus" id="sopViewportFocus" src="../assets/images/sop/section2-goniometer-closeup.png" alt="Zoomed goniometer view">'+
        '<img class="sop-vscene__step4photo sop-vscene__step4photo--1" id="sopViewportStep4Img1" src="../assets/images/sop/section2-step4-position1.png" alt="Specimen holder at initial insertion position">'+
        '<img class="sop-vscene__step4photo sop-vscene__step4photo--2" id="sopViewportStep4Img2" src="../assets/images/sop/section2-step4-position2.png" alt="Specimen holder partly inserted">'+
        '<img class="sop-vscene__step4photo sop-vscene__step4photo--3" id="sopViewportStep4Img3" src="../assets/images/sop/section2-step4-position3.png" alt="Specimen holder at first mechanical stop">'+
        '<img class="sop-vscene__step8final" id="sopViewportStep8Final" src="../assets/images/sop/section2-step8-holder-fully-inserted.png" alt="Specimen holder fully inserted">'+
        '<button type="button" class="sop-vscene__switch-hotspot" id="sopViewportSwitch" aria-label="Set PUMP AIR switch to PUMP"></button>'+
        '<img class="sop-vscene__holder" id="sopViewportHolder" src="../assets/images/sop/section2-step4-holder-isolated.png" alt="Specimen holder"><img class="sop-vscene__portmask" id="sopViewportPortMask" src="../assets/images/sop/section2-goniometer-closeup.png" alt="">'+
        '<div class="sop-vscene__clicks" id="sopViewportClicks"><span></span><span></span><span></span></div>'+
        '<div class="sop-vscene__progress" id="sopViewportProgress"><span id="sopViewportProgressBar"></span></div>'+
      '</div>'+
      '<div class="sop-vscene__controls" id="sopViewportControls"></div>';
    columnPanel.appendChild(wrap);
    viewportScene=wrap;
    viewportBg=document.getElementById('sopViewportBase');
    viewportStatus=null;
    viewportControls=document.getElementById('sopViewportControls');
    viewportGreenLamp=null;
    viewportAmberLamp=null;
    viewportSwitch=document.getElementById('sopViewportSwitch');
    viewportHolder=document.getElementById('sopViewportHolder');
    viewportClicks=document.getElementById('sopViewportClicks');
    viewportProgress=document.getElementById('sopViewportProgress');
    viewportProgressBar=document.getElementById('sopViewportProgressBar');
    viewportFocus=document.getElementById('sopViewportFocus');
    viewportStep4Img1=document.getElementById('sopViewportStep4Img1');
    viewportStep4Img2=document.getElementById('sopViewportStep4Img2');
    viewportStep4Img3=document.getElementById('sopViewportStep4Img3');
    viewportStep8Final=document.getElementById('sopViewportStep8Final');
  }
  function hideViewportScene(){
    ensureViewportScene();
    if(!viewportScene)return;
    clearSceneTimers();
    viewportScene.hidden=true;
    viewportScene.className='sop-vscene';
    viewportScene.removeAttribute('data-step4-phase');
    viewportScene.removeAttribute('data-step8-phase');
    viewportScene.removeAttribute('data-s3-screen-phase');
    if(viewportControls)viewportControls.innerHTML='';
    if(viewportSwitch){viewportSwitch.hidden=true;viewportSwitch.onclick=null;viewportSwitch.className='sop-vscene__switch-hotspot';}
    if(viewportHolder){viewportHolder.className='sop-vscene__holder'; viewportHolder.src=DEFAULT_HOLDER_SRC;}
    if(viewportClicks)viewportClicks.className='sop-vscene__clicks';
    if(viewportStep8Final)viewportStep8Final.className='sop-vscene__step8final';
    if(viewportProgress)viewportProgress.className='sop-vscene__progress';
    if(viewportProgressBar)viewportProgressBar.style.width='0%';
    if(viewportBg)viewportBg.src='../assets/images/microscope/diagram/tem-guided-actual-room.jpg';
    if(typeof viewportFocus!=='undefined'&&viewportFocus){viewportFocus.src='../assets/images/sop/section2-goniometer-closeup.png';viewportFocus.className='sop-vscene__focus';}
  }
  function showViewportScene(opts){
    ensureViewportScene();
    if(!viewportScene)return;
    clearSceneTimers();
    viewportScene.hidden=false;
    viewportScene.className='sop-vscene';
    viewportScene.removeAttribute('data-step4-phase');
    viewportScene.removeAttribute('data-step8-phase');
    viewportScene.removeAttribute('data-s3-screen-phase');
    if(viewportControls)viewportControls.innerHTML='';
    if(viewportSwitch){viewportSwitch.hidden=!((opts&&opts.switchVisible)||false);viewportSwitch.className='sop-vscene__switch-hotspot';}
    if(viewportHolder){viewportHolder.className='sop-vscene__holder'; viewportHolder.src=(opts&&opts.holderSrc)||DEFAULT_HOLDER_SRC;}
    if(viewportClicks)viewportClicks.className='sop-vscene__clicks';
    if(viewportStep8Final)viewportStep8Final.className='sop-vscene__step8final';
    if(viewportProgress)viewportProgress.className='sop-vscene__progress'+((opts&&opts.progress)?' is-visible':'');
    if(viewportProgressBar)viewportProgressBar.style.width=(opts&&opts.progressWidth)||'0%';
    if(viewportBg)viewportBg.src=(opts&&opts.baseSrc)||'../assets/images/microscope/diagram/tem-guided-actual-room.jpg';
    if(typeof viewportFocus!=='undefined'&&viewportFocus){
      viewportFocus.src=(opts&&opts.focusSrc)||'../assets/images/sop/section2-goniometer-closeup.png';
      viewportFocus.className='sop-vscene__focus';
    }
    void viewportScene.offsetWidth;
    if(opts&&opts.sceneClass)viewportScene.classList.add(opts.sceneClass);
    if(opts&&opts.fadeFocus){
      sceneTimers.push(setTimeout(function(){ if(viewportFocus) viewportFocus.classList.add('is-on'); }, opts.fadeFocusDelay||1400));
    }else if(viewportFocus){
      viewportFocus.classList.add('is-on');
    }
    if(opts&&opts.holder==='start'&&viewportHolder) viewportHolder.className='sop-vscene__holder is-visible is-start';
    else if(opts&&opts.holder==='moving'&&viewportHolder) viewportHolder.className='sop-vscene__holder is-visible is-moving';
    else if(opts&&opts.holder==='inserted'&&viewportHolder) viewportHolder.className='sop-vscene__holder is-visible is-inserted';
  }
  function setViewportControls(html){ensureViewportScene(); if(viewportControls)viewportControls.innerHTML=html||'';}
  function setViewportStatus(text){/* intentionally unused: no duplicated viewport instruction text */}
  function smoothSwapViewportFocus(newSrc, showDelay){
    if(typeof viewportFocus==='undefined' || !viewportFocus) return;
    viewportFocus.classList.remove('is-on');
    sceneTimers.push(setTimeout(function(){
      if(!viewportFocus) return;
      viewportFocus.src=newSrc;
      sceneTimers.push(setTimeout(function(){ if(viewportFocus) viewportFocus.classList.add('is-on'); }, showDelay||80));
    }, 220));
  }

  function setBfFluorescentMode(enabled){
    // v4.8.8: the Viewing Screen is always a live simulator surface.
    // Never swap in the old static fluorescent reference image.
    ensureBfScene();
    if(!bfScene) return;
    bfScene.classList.remove('is-fluorescent');
    if(bfSpecimen) bfSpecimen.src='../assets/images/sop/bf-midmag-survey.png';
    if(bfDummyBadge) bfDummyBadge.style.display='';
  }
  function runS3BeamScreenSequence(done){
    // v4.8.10: BEAM ON goes directly to the live grayscale specimen view.
    // The former dark/green fluorescent-screen transition is intentionally removed.
    closeModal(true); closePcDrawer(); hideSection1Tour(); hideViewportScene();
    bfState.beamOn=true;
    bfState.coverOpen=true;
    showBfScene();
    setBfFluorescentMode(false);
    bfRender();
    if(typeof done==='function') done();
  }
  function showSection2Step2(){
    closeModal(true); closePcDrawer();
    showViewportScene({
      baseSrc:'../assets/images/microscope/diagram/tem-guided-actual-room.jpg',
      focusSrc:'../assets/images/sop/section2-goniometer-closeup.png',
      sceneClass:'is-room-to-step2target',
      fadeFocus:true,
      fadeFocusDelay:2500
    });
    setViewportControls('<button class="sop-flow-btn sop-flow-btn--success" id="sopViewportConfirmGreen" disabled>Confirm green lamp</button>');
    var b=document.getElementById('sopViewportConfirmGreen');
    sceneTimers.push(setTimeout(function(){ if(b) b.disabled=false; }, 4200));
    if(b)b.addEventListener('click',function(){ensureAudio();completeStep();});
  }
  function runSection2Step4(){
    closeModal(true); closePcDrawer(); state.insertionDone=false;
    showViewportScene({
      baseSrc:'../assets/images/microscope/diagram/tem-guided-actual-room.jpg',
      focusSrc:'../assets/images/sop/section2-goniometer-closeup.png',
      sceneClass:'is-step4-photo-sequence',
      fadeFocus:true,
      fadeFocusDelay:2100
    });
    if(viewportScene)viewportScene.setAttribute('data-step4-phase','zoom');
    setViewportControls('<button class="sop-flow-btn sop-flow-btn--success" id="sopViewportConfirmInsert" disabled>Confirm after 3 clicks</button>');
    var confirmBtn=document.getElementById('sopViewportConfirmInsert');

    // Full viewport -> slow zoom to goniometer -> three real insertion photographs with gentle crossfades.
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==4)return;
      if(viewportScene)viewportScene.setAttribute('data-step4-phase','photo1');
    },5200));
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==4)return;
      if(viewportScene)viewportScene.setAttribute('data-step4-phase','photo2');
    },7850));
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==4)return;
      if(viewportScene)viewportScene.setAttribute('data-step4-phase','photo3');
    },10650));

    // Only after the final image is fully settled: play the three mechanical clicks.
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==4)return;
      state.insertionDone=true;
      if(viewportClicks)viewportClicks.className='sop-vscene__clicks is-visible';
      threeClicks('.sop-vscene__clicks');
    },13050));
    sceneTimers.push(setTimeout(function(){if(confirmBtn)confirmBtn.disabled=false;},15800));

    if(confirmBtn)confirmBtn.addEventListener('click',function(){
      if(!state.insertionDone)return;
      ensureAudio();
      clearSceneTimers();
      confirmBtn.disabled=true;
      if(viewportClicks)viewportClicks.className='sop-vscene__clicks';
      if(viewportScene)viewportScene.setAttribute('data-step4-phase','return');
      sceneTimers.push(setTimeout(function(){
        if(state.currentSection!==2||state.currentStep!==4)return;
        completeStep(function(){hideViewportScene();});
      },3800));
    });
  }
  function runSection2Step5(){
    closeModal(true); closePcDrawer();
    if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}
    state.pumpStarted=false;state.evacuationDone=false;stopPump();
    showViewportScene({
      baseSrc:'../assets/images/sop/section2-goniometer-closeup.png',
      focusSrc:'../assets/images/sop/section2-step5-green-only.png',
      sceneClass:'is-goniometer-to-pumpswitch',
      fadeFocus:true,
      fadeFocusDelay:1150,
      switchVisible:false,
      progress:true
    });
    if(viewportProgressBar)viewportProgressBar.style.width='0%';
    setViewportControls('<div class="sop-pump-control-row"><button type="button" class="sop-pump-vertical" id="sopViewportPumpToggle" aria-pressed="false" aria-label="PUMP / AIR switch: AIR selected. Click to set PUMP"><span class="sop-pump-vertical__label sop-pump-vertical__label--pump">PUMP</span><span class="sop-pump-vertical__track"><span class="sop-pump-vertical__knob"></span></span><span class="sop-pump-vertical__label sop-pump-vertical__label--air">AIR</span></button><button class="sop-flow-btn sop-flow-btn--success" id="sopViewportContinuePump" disabled>Set PUMP to begin</button></div>');
    var sw=document.getElementById('sopViewportPumpToggle'),cont=document.getElementById('sopViewportContinuePump');
    if(sw)sw.onclick=function(){
      if(state.pumpStarted)return;
      ensureAudio();state.pumpStarted=true;startPump();
      sw.classList.add('is-pump');sw.setAttribute('aria-pressed','true');sw.setAttribute('aria-label','PUMP / AIR switch: PUMP selected');sw.disabled=true;
      smoothSwapViewportFocus('../assets/images/sop/section2-step5-amber-only.png',60);
      if(cont){cont.textContent='Evacuating · wait for amber lamp OFF';cont.disabled=true;}
      var t0=Date.now(),dur=10000;
      state.pumpTimer=setInterval(function(){
        var p=Math.min(100,(Date.now()-t0)/dur*100);
        if(viewportProgressBar)viewportProgressBar.style.width=p+'%';
        if(cont)cont.textContent='Evacuating · '+Math.round(p)+'%';
        if(p>=100){
          clearInterval(state.pumpTimer);state.pumpTimer=null;state.evacuationDone=true;stopPump();
          smoothSwapViewportFocus('../assets/images/sop/section2-step5-green-only.png',80);
          sceneTimers.push(setTimeout(function(){if(cont){cont.disabled=false;cont.textContent='Continue · amber lamp OFF';}},650));
        }
      },140);
    };
    if(cont)cont.addEventListener('click',function(){if(!state.evacuationDone)return;completeStep();});
  }
  function isFullscreen(){return !!(document.fullscreenElement||document.webkitFullscreenElement);}
  function updateFullscreenUI(){
    var active=isFullscreen();
    document.body.classList.toggle('is-fullscreen',active);
    var btn=document.getElementById('btn-fullscreen');
    if(btn)btn.setAttribute('aria-pressed',active?'true':'false');
    if(active)hideFullscreenReminder();
  }
  function wireFullscreen(){
    var btn=document.getElementById('btn-fullscreen');
    if(!btn)return;
    btn.disabled=false;
    btn.removeAttribute('aria-disabled');
    btn.setAttribute('aria-pressed','false');
    btn.addEventListener('click',function(){
      if(isFullscreen()){
        var exit=document.exitFullscreen||document.webkitExitFullscreen;
        if(exit){try{var out=exit.call(document);if(out&&out.catch)out.catch(function(){});}catch(e){}}
      }else{
        var target=document.documentElement;
        var req=target.requestFullscreen||target.webkitRequestFullscreen;
        if(req){try{var result=req.call(target);if(result&&result.catch)result.catch(function(){});}catch(e){}}
      }
    });
    document.addEventListener('fullscreenchange',updateFullscreenUI);
    document.addEventListener('webkitfullscreenchange',updateFullscreenUI);
    updateFullscreenUI();
  }
  function hideFullscreenReminder(){
    var alertEl=document.getElementById('sopFullscreenAlert');
    if(alertEl)alertEl.classList.remove('is-visible');
  }
  function showFullscreenReminder(){
    var alertEl=document.getElementById('sopFullscreenAlert');
    var close=document.getElementById('sopFullscreenAlertClose');
    if(!alertEl)return;
    setTimeout(function(){if(!isFullscreen())alertEl.classList.add('is-visible');},180);
    setTimeout(hideFullscreenReminder,FULLSCREEN_REMINDER_MS);
    if(close)close.addEventListener('click',hideFullscreenReminder,{once:true});
  }

  function totalCompleted(){return Object.keys(state.completed).filter(function(k){return state.completed[k];}).length;}
  function updateProgress(){var total=sections.reduce(function(n,s){return n+(s.implemented&&!s.upcoming?s.steps.length:0);},0);progress.style.width=Math.min(100,totalCompleted()/Math.max(1,total)*100)+'%';}
  function currentSection(){return state.currentSection?sections[state.currentSection-1]:null;}
  function nextVisibleSectionId(id){for(var i=id;i<sections.length;i++){if(!sections[i].hidden&&!sections[i].upcoming)return sections[i].id;}return null;}
  function currentStep(){var s=currentSection();return s&&s.steps[state.currentStep];}
  function key(){return state.currentSection+'-'+(state.currentStep+1);}

  function showSectionSkipModal(id){
    var overlay=document.getElementById('sopSectionSkipModal');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.id='sopSectionSkipModal';
      overlay.className='sop-skip-modal-overlay';
      overlay.setAttribute('role','presentation');
      overlay.innerHTML='<div class="sop-skip-modal" role="dialog" aria-modal="true" aria-labelledby="sopSkipTitle" aria-describedby="sopSkipDescription" tabindex="-1">'+
        '<div class="sop-skip-modal__icon" aria-hidden="true">⚠</div>'+
        '<h2 id="sopSkipTitle">Recommended learning sequence</h2>'+
        '<p id="sopSkipDescription"></p>'+
        '<div class="sop-skip-modal__actions"><button type="button" data-skip-cancel>Cancel</button><button type="button" data-skip-continue>Continue to section</button></div></div>';
      document.body.appendChild(overlay);
    }
    var previouslyFocused=document.activeElement;
    var description=overlay.querySelector('#sopSkipDescription');
    var cancel=overlay.querySelector('[data-skip-cancel]');
    var proceed=overlay.querySelector('[data-skip-continue]');
    var modal=overlay.querySelector('[role="dialog"]');
    description.textContent='For the best learning experience, start with Section 1 and complete the preceding sections in order. Do you want to open Section '+id+' anyway?';
    proceed.textContent='Continue to Section '+id;
    overlay.classList.add('is-visible');
    function cleanup(){
      overlay.classList.remove('is-visible');
      overlay.removeEventListener('click',onBackdrop);
      document.removeEventListener('keydown',onKeydown,true);
      cancel.removeEventListener('click',onCancel);
      proceed.removeEventListener('click',onProceed);
      if(previouslyFocused&&previouslyFocused.focus)previouslyFocused.focus();
    }
    function onCancel(){cleanup();}
    function onProceed(){cleanup();openSection(id);}
    function onBackdrop(e){if(e.target===overlay)onCancel();}
    function onKeydown(e){
      if(e.key==='Escape'){e.preventDefault();onCancel();}
      if(e.key==='Tab'){
        var options=[cancel,proceed],i=options.indexOf(document.activeElement);
        if(e.shiftKey&&i<=0){e.preventDefault();proceed.focus();}
        else if(!e.shiftKey&&i>=1){e.preventDefault();cancel.focus();}
      }
    }
    overlay.addEventListener('click',onBackdrop);
    document.addEventListener('keydown',onKeydown,true);
    cancel.addEventListener('click',onCancel);
    proceed.addEventListener('click',onProceed);
    cancel.focus();
  }

  function renderNav(){
    nav.innerHTML=sections.filter(function(s){return !s.hidden;}).map(function(s){
      var upcoming=!!s.upcoming, unlocked=!!state.sample&&!upcoming;
      var active=s.id===state.currentSection,done=!!state.sectionComplete[s.id];
      return '<button class="sop-mini-tab'+(active?' is-active':'')+(done?' is-complete':'')+'" data-section="'+s.id+'" title="'+(upcoming?'Upcoming — ': '')+s.title.replace(/"/g,'&quot;')+'" '+(!unlocked?'disabled':'')+'><span class="sop-mini-tab__n">Section '+s.id+'</span><span class="sop-mini-tab__t">'+s.short+'</span><span class="sop-mini-tab__state">'+(upcoming?'◷ Upcoming':(done?'✓':(!unlocked?'🔒':'')))+'</span></button>';
    }).join('');
    [].slice.call(nav.querySelectorAll('[data-section]')).forEach(function(b){b.addEventListener('click',function(){
      var id=Number(b.dataset.section),target=sections[id-1];
      if(!state.sample||!target||target.upcoming||target.hidden)return;
      if(id===state.currentSection)return;
      // A learner may enter a later section, but is advised to follow the SOP in order.
      var skipped=id>1&&sections.some(function(s){return s.id<id&&!s.upcoming&&!s.hidden&&s.implemented&&!state.sectionComplete[s.id];});
      if(skipped){showSectionSkipModal(id);return;}
      openSection(id);
    });});
  }

  function refreshInstructionMarquee(){
    if(!instr)return;
    instr.classList.remove('is-marquee');
    instr.style.removeProperty('--instr-scroll');
    instr.style.removeProperty('--instr-duration');
    requestAnimationFrame(function(){
      var body=instr.parentElement;
      if(!body)return;
      var available=Math.max(0,body.clientWidth-4);
      var full=instr.scrollWidth;
      if(full>available+24){
        var dist=Math.max(24,full-available+18);
        var duration=Math.max(10,Math.min(24,dist/28+7));
        instr.style.setProperty('--instr-scroll','-'+dist+'px');
        instr.style.setProperty('--instr-duration',duration+'s');
        instr.classList.add('is-marquee');
      }
    });
  }
  function refreshHintMarquee(){
    if(!hint)return;
    hint.classList.remove('is-marquee');
    hint.style.removeProperty('--hint-scroll');
    hint.style.removeProperty('--hint-duration');
    requestAnimationFrame(function(){
      if(!hint || hint.style.display==='none')return;
      var available=Math.max(0,hint.clientWidth||0);
      var full=hint.scrollWidth;
      if(full>available+16){
        var dist=Math.max(20,full-available+14);
        var duration=Math.max(10,Math.min(24,dist/28+7));
        hint.style.setProperty('--hint-scroll','-'+dist+'px');
        hint.style.setProperty('--hint-duration',duration+'s');
        hint.classList.add('is-marquee');
      }
    });
  }
  function setInstructionText(text){
    if(!instr)return;
    instr.classList.remove('is-marquee');
    instr.style.removeProperty('--instr-scroll');
    instr.style.removeProperty('--instr-duration');
    instr.textContent=text;
    refreshInstructionMarquee();
  }
  function setInstruction(){
    if(!state.sample){setInstructionText('Review the microscope interface and control locations. Press START when you are ready to begin.');hint.textContent='';hint.style.display='none';return;}
    var s=currentSection();
    if(!s){setInstructionText('Select a section.');hint.textContent='';hint.style.display='none';return;}
    if(state.sectionComplete[s.id]){setInstructionText('Section '+s.id+' complete: '+s.title+'.');hint.textContent='';hint.style.display='none';return;}
    if(!s.implemented){setInstructionText(s.title+' — this section is accessible; guided shutdown steps are not yet available.');hint.textContent='';hint.style.display='none';return;}
    var st=currentStep();
    setInstructionText('Section '+s.id+' · Step '+(state.currentStep+1)+': '+st.instruction);
    // v4.8.2: hints are intentionally not shown in the instruction bar.
    if(hint){hint.textContent='';hint.style.display='none';hint.classList.remove('is-marquee');}
  }

  function resetModalPosition(){
    if(!modalPanel)return;
    modalPanel.classList.remove('is-dragging');
    modalPanel.style.position='';modalPanel.style.left='';modalPanel.style.top='';modalPanel.style.margin='';
  }
  function openModal(opts){
    if(chillerSwapTimer){clearTimeout(chillerSwapTimer);chillerSwapTimer=null;}
    modalLocked=opts.locked!==false;
    resetModalPosition();
    // Only the grid-loading step needs a compact body and a permanently visible footer.
    if(modalPanel)modalPanel.classList.toggle('sop-grid-step3',opts.compactGrid===true);
    if(modalCloseBtn)modalCloseBtn.style.display=opts.dismissible===false?'none':'';
    modalTag.textContent=opts.tag||'SOP CHECK';modalTitle.textContent=opts.title||'';modalStep.textContent=opts.step||'';modalBody.innerHTML=opts.body||'';modalFooter.innerHTML=opts.footer||'';modal.classList.add('is-open');
  }
  function closeModal(force){if(modalLocked&&!force)return;if(chillerSwapTimer){clearTimeout(chillerSwapTimer);chillerSwapTimer=null;}modal.classList.remove('is-open');modalBody.innerHTML='';modalFooter.innerHTML='';modalLocked=false;if(modalCloseBtn)modalCloseBtn.style.display='';resetModalPosition();}
  function playChillerOnceThenFreeze(){
    var img=document.getElementById('sopChillerLoopOnce');
    if(!img)return;
    img.src='../assets/images/sop/chiller-actual-animated.gif?ts='+Date.now();
  }
  function dismissModal(){
    if(!modal.classList.contains('is-open'))return;
    // Dismissal never completes the active step. The instruction bar remains on that step.
    if(state.currentSection===2){
      if(state.currentStep===2)state.gridStage=0;
      if(state.currentStep===4)state.insertionDone=false;
      if(state.currentStep===5){if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}state.pumpStarted=false;state.evacuationDone=false;stopPump();}
      if(state.currentStep===6){state.rotation15=false;state.rotation75=false;state.holderSeated=false;}

    }
    closeModal(true);
    setInstruction();
  }
  var bg=modal.querySelector('.sop-flow-modal__bg');
  if(modalCloseBtn)modalCloseBtn.addEventListener('click',dismissModal);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('is-open'))dismissModal();});

  // Drag the dialog by its header while keeping it inside the viewport.
  if(modalDragHandle&&modalPanel){
    var dragState=null;
    modalDragHandle.addEventListener('pointerdown',function(e){
      if(e.target.closest('button'))return;
      var r=modalPanel.getBoundingClientRect();
      dragState={dx:e.clientX-r.left,dy:e.clientY-r.top,pid:e.pointerId};
      modalPanel.style.position='fixed';modalPanel.style.left=r.left+'px';modalPanel.style.top=r.top+'px';modalPanel.style.margin='0';
      modalPanel.classList.add('is-dragging');
      modalDragHandle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    modalDragHandle.addEventListener('pointermove',function(e){
      if(!dragState||e.pointerId!==dragState.pid)return;
      var maxL=Math.max(8,window.innerWidth-modalPanel.offsetWidth-8),maxT=Math.max(8,window.innerHeight-modalPanel.offsetHeight-8);
      var left=Math.max(8,Math.min(maxL,e.clientX-dragState.dx));
      var top=Math.max(8,Math.min(maxT,e.clientY-dragState.dy));
      modalPanel.style.left=left+'px';modalPanel.style.top=top+'px';
    });
    function endDrag(e){if(!dragState||e.pointerId!==dragState.pid)return;dragState=null;modalPanel.classList.remove('is-dragging');}
    modalDragHandle.addEventListener('pointerup',endDrag);modalDragHandle.addEventListener('pointercancel',endDrag);
  }

  function setSessionControls(running){
    var restartBtn=document.getElementById('btn-restart');
    var undoBtn=document.getElementById('btn-undo-step');
    var showBtn=document.getElementById('btn-show-step');
    if(restartBtn){
      if(running){
        restartBtn.innerHTML='<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8a6 6 0 1 0 1.8-4.2M2 2v4h4"/></svg><span>Restart</span>';
        restartBtn.classList.remove('is-start-btn');
        restartBtn.title='Restart entire session';
      }else{
        restartBtn.innerHTML='<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="5"/><path d="M6 8l1.5 1.5L10 6.5"/></svg><span>Start</span>';
        restartBtn.classList.add('is-start-btn');
        restartBtn.title='Start guided session';
      }
    }
    if(undoBtn)undoBtn.style.display=running?'':'none';
    if(showBtn)showBtn.style.display=running?'':'none';
  }

  function showSampleModal(){
    openModal({locked:true,tag:'SELECT SAMPLE',title:'Choose specimen type',step:'Required before Section 1',body:'<p class="sop-flow-modal__copy">Select the specimen type for this guided operating session. Section 1 remains locked until a sample is selected.</p><div class="sop-sample-grid"><button class="sop-sample-card" data-sample="nanoparticles"><div class="sop-sample-icon">●</div><strong>Nanoparticles / Suspension</strong><span>Routine nanoparticle imaging specimen.</span></button><button class="sop-sample-card" data-sample="bulk-metallic" disabled title="Coming soon"><div class="sop-sample-icon">▦</div><strong>Bulk Metallic 🔒</strong><span>Coming soon · Electropolished metallic specimen.</span></button><button class="sop-sample-card" data-sample="cross-section" disabled title="Coming soon"><div class="sop-sample-icon">◫</div><strong>Cross-section 🔒</strong><span>Coming soon · Focused Ion Beam (FIB) prepared cross-section.</span></button></div>',footer:''});
    [].slice.call(modal.querySelectorAll('[data-sample]')).forEach(function(b){b.addEventListener('click',function(){if(b.dataset.sample!=='nanoparticles')return;ensureAudio();state.sample=b.dataset.sample;sampleInd.textContent=({nanoparticles:'NANOPARTICLES', 'bulk-metallic':'BULK METALLIC', 'cross-section':'CROSS-SECTION'}[state.sample]||'SELECTED');state.unlockedThrough=1;state.currentSection=1;state.currentStep=0;closeModal(true);setSessionControls(true);renderNav();setInstruction();setTimeout(showCurrentStep,SECTION1_STEP1_START_DELAY_MS);});});
  }

  function openSection(id){if(!sections[id-1]||sections[id-1].hidden||sections[id-1].upcoming)return;hideS3BeamScreenStill();if(stepTransitionPending){delete state.completed[key()];updateProgress();}clearPendingStepTransition();clearHtRampTimers();cleanupHtRampUi();clearBfTimers();clearS3PcPanel();releaseS3HtPhoto();hideBfScene();if(typeof hideDfScene==='function')hideDfScene();if(typeof hideS3ApertureOverlay==='function')hideS3ApertureOverlay();closePcDrawer();stopPump();hideViewportScene();hideSection1Tour();if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}if(id===2){state.gridStage=0;state.insertionDone=false;state.pumpStarted=false;state.evacuationDone=false;state.rotation15=false;state.rotation75=false;state.holderSeated=false;state.trackballMoved=false;}if(id===3){resetBfState();}if(id===4){resetDfState();}state.currentSection=id;state.currentStep=0;renderNav();setInstruction();if(state.sectionComplete[id])return;if(!sections[id-1].implemented)return;setTimeout(showCurrentStep,STEP_MODAL_READING_DELAY_MS);}

  function clearPendingStepTransition(){
    stepTransitionPending=false;pendingStepCleanup=null;
    if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}
    if(modalCloseBtn)modalCloseBtn.style.display='';
  }

  function advanceCompletedStep(){
    if(!stepTransitionPending)return;
    var s=currentSection();
    var cleanup=pendingStepCleanup;pendingStepCleanup=null;
    if(cleanup){try{cleanup();}catch(e){}}
    stepTransitionPending=false;
    if(!s)return;
    if(state.currentStep<s.steps.length-1){
      state.currentStep++;setInstruction();renderNav();
      // Keep a short reading gap after the result hold before the next step interface appears.
      var nextDelay=(state.currentSection===3?SECTION3_NEXT_STEP_DELAY_MS:(state.currentSection===4?520:STEP_MODAL_READING_DELAY_MS));
      nextModalTimer=setTimeout(function(){nextModalTimer=null;showCurrentStep();},nextDelay);
    }else{
      state.sectionComplete[s.id]=true;var nextId=nextVisibleSectionId(s.id);if(nextId!==null)state.unlockedThrough=Math.max(state.unlockedThrough,nextId);renderNav();setInstruction();
      nextModalTimer=setTimeout(function(){nextModalTimer=null;showSectionComplete(s);},650);
    }
  }

  function completeStep(afterHoldCleanup){
    if(stepTransitionPending)return;
    stepTransitionPending=true;pendingStepCleanup=typeof afterHoldCleanup==='function'?afterHoldCleanup:null;
    if(state.currentSection===3||state.currentSection===4)s3LockControls();
    state.completed[key()]=true;updateProgress();
    if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}
    // Keep the completed visual/output on screen while the learner reads the result in the instruction bar.
    if(state.currentSection===3){
      var achievedMsg=SECTION3_ACHIEVEMENTS[state.currentStep]||'The required Bright Field output has been achieved.';
      setInstructionText('Section 3 · Step '+(state.currentStep+1)+' complete — '+achievedMsg+'  Observe the result before the next step.');
    }else{
      setInstructionText('Section '+state.currentSection+' · Step '+(state.currentStep+1)+' complete — output achieved. Observe the result before the next step.');
    }
    nextModalTimer=setTimeout(function(){
      nextModalTimer=null;
      if(!stepTransitionPending)return;
      advanceCompletedStep();
    },STEP_RESULT_HOLD_MS);
  }

  function showSectionComplete(s){var nextId=nextVisibleSectionId(s.id);openModal({locked:true,tag:'SECTION COMPLETE',title:'Section '+s.id+' completed',step:s.title,body:'<p class="sop-flow-modal__copy">All required steps in <strong>'+s.title+'</strong> have been completed.'+(nextId!==null?' You may proceed to Section '+nextId+'.':'')+'</p>',footer:nextId!==null?'<button class="sop-flow-btn sop-flow-btn--success" id="sopNextSection">Proceed to Section '+nextId+'</button>':'<button class="sop-flow-btn sop-flow-btn--success" id="sopFinish">Finish</button>'});var n=document.getElementById('sopNextSection');if(n)n.addEventListener('click',function(){closeModal(true);openSection(nextId);});var f=document.getElementById('sopFinish');if(f)f.addEventListener('click',function(){closeModal(true);});}

  function confirmFooter(label){return '<button class="sop-flow-btn sop-flow-btn--success" id="sopConfirmStep">'+label+'</button>';}
  function bindConfirm(){var b=document.getElementById('sopConfirmStep');if(b)b.addEventListener('click',function(){ensureAudio();b.disabled=true;completeStep(function(){closeModal(true);});});}

  function showCurrentStep(){
    var s=currentSection();if(!s||state.sectionComplete[s.id]||!s.implemented)return;setInstruction();renderNav();if(s.id===1)showSection1();else if(s.id===2)showSection2();else if(s.id===3)showSection3();else if(s.id===4)showSection4();
  }

  function clearHtRampTimers(){
    htRampTimers.forEach(function(t){try{clearTimeout(t);}catch(e){}});
    htRampTimers=[];
    if(htRampInterval){try{clearInterval(htRampInterval);}catch(e){}htRampInterval=null;}
  }
  function setHtRampProgress(pct,label){
    var bar=document.getElementById('sopHtRampBar'),read=document.getElementById('sopHtRampRead');
    if(bar)bar.style.width=Math.max(0,Math.min(100,pct))+'%';
    if(read&&label)read.textContent=label;
  }
  function setHtRampGuide(text){
    var el=document.getElementById('sopHtRampGuideText');if(el)el.textContent=text;
  }
  function cleanupHtRampUi(){
    clearHtRampTimers();
    var guide=document.getElementById('sopHtRampGuide');if(guide)guide.remove();
    var hg=document.querySelector('.temcon-group--hv');if(hg){hg.classList.remove('sop-ht-ramp-mode','sop-ht-ramp-closed','sop-ht-focus');}
    var sc=document.getElementById('pc-ht-shortcut');if(sc){sc.classList.remove('sop-ht-next');sc.onclick=null;sc.onkeydown=null;}
    ['ht-on-btn','pc-autoht-start','pc-autoht-stop','pc-autoht-target','pc-autoht-step','pc-autoht-time'].forEach(function(id){
      var e=document.getElementById(id);if(e){e.classList.remove('sop-ht-next');e.onchange=null;e.onclick=null;}
    });
  }
  function runSection1Step4HtRamp(){
    clearHtRampTimers();cleanupHtRampUi();closeModal(true);hideSection1Tour();hideViewportScene();cleanupHtRampUi();openPcDrawer();
    var hg=document.querySelector('.temcon-group--hv'),sc=document.getElementById('pc-ht-shortcut');
    var on=document.getElementById('ht-on-btn'),off=document.getElementById('ht-off-btn');
    var start=document.getElementById('pc-autoht-start'),stop=document.getElementById('pc-autoht-stop');
    var target=document.getElementById('pc-autoht-target'),stepSel=document.getElementById('pc-autoht-step'),timeSel=document.getElementById('pc-autoht-time');
    var finish=document.getElementById('pc-autoht-finish'),status=document.getElementById('pc-ht-status'),val=document.getElementById('pc-ht-value'),acc=document.getElementById('pc-acc-value'),fil=document.getElementById('pc-fil-status'),lamp=document.getElementById('pc-ht-lamp');
    if(!hg||!sc||!on||!start||!target||!stepSel||!timeSel)return;

    var guide=document.createElement('div');
    guide.id='sopHtRampGuide';guide.className='sop-ht-ramp-guide';
    guide.innerHTML='<div class="sop-ht-ramp-guide__top"><strong>HT RAMP · STEP 4 OF 8</strong><span>Simulator timing compressed</span></div>'
      +'<div class="sop-ht-ramp-guide__text" id="sopHtRampGuideText">Click the HT shortcut to open High Voltage Control.</div>'
      +'<div class="sop-ht-ramp-guide__progress"><span id="sopHtRampBar"></span></div>'
      +'<div class="sop-ht-ramp-guide__read" id="sopHtRampRead">Current starting voltage: 80.00 kV</div>'
      +'<button class="sop-flow-btn sop-flow-btn--success sop-ht-ramp-guide__continue" id="sopHtRampContinue" disabled hidden>Continue</button>';
    hg.insertBefore(guide,hg.children[1]||null);

    hg.classList.add('sop-ht-ramp-mode','sop-ht-ramp-closed');
    sc.classList.add('sop-ht-next');
    sc.setAttribute('aria-label','Open High Voltage Control');
    if(status)status.textContent='OFF';
    if(val)val.textContent='80.00 kV';
    if(acc)acc.textContent='80 kV';
    if(fil)fil.textContent='Ready';
    if(lamp){var ls=lamp.querySelector('span');if(ls)ls.textContent='OFF';lamp.classList.remove('is-on');}
    on.disabled=true;if(off)off.disabled=true;start.disabled=true;if(stop)stop.disabled=true;target.disabled=true;stepSel.disabled=true;timeSel.disabled=true;
    target.value='80';stepSel.value='1';timeSel.value='1';if(finish)finish.textContent='Time to finish —';

    function openHv(){
      if(!hg.classList.contains('sop-ht-ramp-closed'))return;
      hg.classList.remove('sop-ht-ramp-closed');hg.classList.add('sop-ht-focus');sc.classList.remove('sop-ht-next');
      on.disabled=false;on.classList.add('sop-ht-next');
      setHtRampGuide('Baseline is 80 kV. Click HT ON, then wait for base emission stabilization.');
      setHtRampProgress(0,'Baseline: 80.00 kV · HT OFF');
    }
    sc.onclick=openHv;
    sc.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openHv();}};

    on.onclick=function(){
      if(on.disabled)return;ensureAudio();on.disabled=true;on.classList.remove('sop-ht-next');
      if(status)status.textContent='ON · STABILIZING';if(lamp){var ls=lamp.querySelector('span');if(ls)ls.textContent='ON';lamp.classList.add('is-on');}
      setHtRampGuide('HT is ON at 80 kV. Waiting for base emission to stabilize (actual procedure: 1–2 min).');
      var t0=Date.now(),dur=6000;
      htRampInterval=setInterval(function(){
        var p=Math.min(100,(Date.now()-t0)/dur*100);setHtRampProgress(p,'Base emission stabilization · '+Math.round(p)+'% · actual 1–2 min');
        if(p>=100){clearInterval(htRampInterval);htRampInterval=null;
          if(status)status.textContent='ON';if(fil)fil.textContent='Ready';
          stepSel.disabled=false;timeSel.disabled=false;stepSel.classList.add('sop-ht-next');timeSel.classList.add('sop-ht-next');
          setHtRampGuide('Set Auto HT ramp rate to 0.1 kV every 2–3 seconds.');
          setHtRampProgress(0,'Set Step = 0.1 kV and Time/Step = 2 or 3 sec');
        }
      },120);
    };

    function validateRate(){
      var ok=stepSel.value==='0.1'&&(timeSel.value==='2'||timeSel.value==='3');
      if(ok){
        stepSel.classList.remove('sop-ht-next');timeSel.classList.remove('sop-ht-next');stepSel.disabled=true;timeSel.disabled=true;
        target.disabled=false;target.classList.add('sop-ht-next');
        setHtRampGuide('Safe ramp rate set. Change Target Voltage to 200 kV.');
        setHtRampProgress(0,'Ramp rate: 0.1 kV every '+timeSel.value+' sec');
      }
    }
    stepSel.onchange=validateRate;timeSel.onchange=validateRate;

    target.onchange=function(){
      if(target.value!=='200')return;
      target.disabled=true;target.classList.remove('sop-ht-next');start.disabled=false;start.classList.add('sop-ht-next');
      setHtRampGuide('Target set to 200 kV. Click Start in Auto HT to begin automatic ramp-up.');
      if(finish)finish.textContent='Target 200.00 kV';
    };

    start.onclick=function(){
      if(start.disabled)return;ensureAudio();start.disabled=true;start.classList.remove('sop-ht-next');
      if(status)status.textContent='RAMPING';setHtRampGuide('Auto HT ramp in progress. Operating setting: 0.1 kV every '+timeSel.value+' sec. Simulator time is compressed.');
      var from=80,to=200,t0=Date.now(),dur=12000;
      htRampInterval=setInterval(function(){
        var p=Math.min(1,(Date.now()-t0)/dur),kv=from+(to-from)*p;
        kv=Math.round(kv*10)/10;
        if(val)val.textContent=kv.toFixed(1)+' kV';if(acc)acc.textContent=Math.round(kv)+' kV';
        if(finish)finish.textContent='Ramping to 200 kV · '+Math.round(p*100)+'%';
        setHtRampProgress(p*100,'Auto HT ramp · '+kv.toFixed(1)+' kV');
        if(p>=1){
          clearInterval(htRampInterval);htRampInterval=null;
          if(val)val.textContent='200.00 kV';if(acc)acc.textContent='200 kV';if(status)status.textContent='200 kV · STABILIZING';
          setHtRampGuide('200 kV reached. Allow the system to stabilize (actual procedure: 10–15 min).');
          var s0=Date.now(),sdur=9000;
          htRampInterval=setInterval(function(){
            var sp=Math.min(1,(Date.now()-s0)/sdur);
            setHtRampProgress(sp*100,'200 kV stabilization · '+Math.round(sp*100)+'% · actual 10–15 min');
            if(sp>=1){
              clearInterval(htRampInterval);htRampInterval=null;
              if(status)status.textContent='READY';if(fil)fil.textContent='Ready';if(finish)finish.textContent='HT READY · 200.00 kV';
              setHtRampGuide('HT ramp complete. TEMCON shows 200 kV and READY.');
              setHtRampProgress(100,'READY · 200.00 kV');
              var c=document.getElementById('sopHtRampContinue');if(c){c.hidden=false;c.disabled=false;c.onclick=function(){ensureAudio();c.disabled=true;completeStep(function(){cleanupHtRampUi();closePcDrawer();});};}
            }
          },120);
        }
      },120);
    };
  }

  function ensureStep4HvReplica(){
    var page=document.querySelector('[data-temcon-page="standard"]');
    var hv=page&&page.querySelector('.temcon-group--hv');
    if(!hv)return null;
    var replica=document.getElementById('sopStep4HvReplica');
    if(!replica){
      replica=document.createElement('div');
      replica.id='sopStep4HvReplica';
      replica.className='sop-step4-hv-replica';
      replica.innerHTML='<div class="sop-step4-window-image-wrap">'
        +'<img class="sop-step4-window-image" src="../assets/images/sop/section1-step4-high-voltage-control.png" alt="High Voltage Control window">'
        +'<button type="button" id="sopStep4HtOnHotspot" class="sop-step4-hotspot" aria-label="Press HT ON"></button>'
        +'</div>';
      hv.appendChild(replica);
    }
    return replica;
  }

  function ensureStep4Valve(){
    var page=document.querySelector('[data-temcon-page="standard"]');
    var hv=page&&page.querySelector('.temcon-group--hv');
    if(!hv)return null;
    var valve=document.getElementById('sopStep4Valve');
    if(valve){
      var existingImage=valve.querySelector('img.sop-step4-window-image--valve');
      if(existingImage){existingImage.src='../assets/images/sop/section1-step4-valve-status.png';existingImage.alt='Valve Status window';}
      valve.hidden=false;
    }
    if(!valve){
      valve=document.createElement('fieldset');
      valve.className='temcon-group sop-step4-valve-inline';
      valve.id='sopStep4Valve';
      valve.innerHTML='<div class="sop-step4-window-image-wrap sop-step4-window-image-wrap--valve">'
        +'<img class="sop-step4-window-image sop-step4-window-image--valve" src="../assets/images/sop/section1-step4-valve-status.png" alt="Valve Status window">'
        +'</div>';
      hv.insertAdjacentElement('afterend',valve);
    }
    var alert=document.getElementById('sopStep4Alert');
    if(!alert){
      alert=document.createElement('div');
      alert.id='sopStep4Alert';
      alert.className='sop-step4-alert';
      alert.innerHTML='<div class="sop-step4-alert__title">Accelerating Voltage</div><div class="sop-step4-alert__body">Setting the accelerating voltage.</div><div class="sop-step4-alert__actions"><button type="button" id="sopStep4AlertCancel">Cancel</button></div>';
      page.appendChild(alert);
    }
    alert.hidden=true;
    return valve;
  }

  // Share the single Valve Status window between the SOP steps; never append
  // an additional image below the active TEMCON desktop.
  function ensureSection2Step4Valve(){
    var valve=ensureStep4Valve();
    if(!valve)return null;
    var image=valve.querySelector('img.sop-step4-window-image--valve');
    if(image){
      image.src='../assets/images/sop/section2-step4-valve-status.png';
      image.alt='Valve Status window: Specimen / PIG4 EVAC Ready';
    }
    valve.hidden=false;
    return valve;
  }

  function ensureSection2Step8Valve(){
    // The same two TEMCON window slots are shared by Section 1 Step 4,
    // Section 2 Step 4 and Section 2 Step 8.
    var valve=ensureStep4Valve();
    if(!valve)return null;
    var image=valve.querySelector('img.sop-step4-window-image--valve');
    if(image){
      image.src='../assets/images/sop/section2-step8-valve-status.png';
      image.alt='Valve Status window, showing Specimen / PIG4 EVAC Ready';
    }
    valve.hidden=false;
    return valve;
  }

  function setSection1TopTemconState(htOn){
    var htLamp=document.getElementById('pc-ht-lamp');
    var beamLamp=document.getElementById('pc-beam-lamp');
    var acc=document.getElementById('pc-acc-value');
    var beamTop=document.getElementById('pc-beam-current-top');
    var beamHv=document.getElementById('pc-beam-current-hv');
    var htStatus=document.getElementById('pc-ht-status');
    var htValue=document.getElementById('pc-ht-value');
    var filStatus=document.getElementById('pc-fil-status');
    if(htLamp){htLamp.classList.toggle('is-on',!!htOn);htLamp.innerHTML='<strong>HT</strong>';}
    if(beamLamp){beamLamp.classList.remove('is-on');beamLamp.innerHTML='Beam<br><strong>NotReady</strong>';}
    if(acc)acc.textContent='80.00 kV';
    if(beamTop)beamTop.textContent=htOn?'8 µA':'0 µA';
    if(beamHv)beamHv.textContent=htOn?'8.0 µA':'0.1 µA';
    if(htStatus)htStatus.textContent='Ready';
    if(htValue)htValue.textContent='80.00 kV';
    if(filStatus)filStatus.textContent='NotReady';
    var pd=document.getElementById('pc-current-density'); if(pd) pd.textContent='0.0 pA/cm²';
    var stg=document.querySelector('.temcon-status__stage-mode'); if(stg&&!stg.querySelector('#sopStageNeutralVisible')) stg.textContent='Stage Neutral';
  }

  var step4HtReadyForConfirmation=false;
  function showStep4StatusConfirmation(){
    if(!step4HtReadyForConfirmation)return;
    openModal({locked:false,tag:'SECTION 1 · TEMCON STATUS',title:'Confirm HT and valve status',step:'Step 4 of 7',
      body:'<p class="sop-flow-modal__copy">Verify that the <strong>HT</strong> indicator is <strong>green</strong> at <strong>80.00 kV</strong>, the Beam status remains <strong>NotReady</strong>, and the Valve Status window shows the expected <strong>Evac Ready / vacuum status</strong> indicators.</p>',
      footer:'<button type="button" class="sop-flow-btn sop-flow-btn--success" id="sopStep4ConfirmStatus">Confirm HT and valve status</button>'});
    var confirm=document.getElementById('sopStep4ConfirmStatus');
    if(confirm)confirm.onclick=function(){
      if(confirm.disabled)return;
      ensureAudio();confirm.disabled=true;
      completeStep(function(){closeModal(true);hideSection1Step4Desk();closePcDrawer();});
    };
  }
  var step4AlertTimer=null,step4ConfirmTimer=null;
  function hideSection1Step4Desk(){
    if(step4AlertTimer){clearTimeout(step4AlertTimer);step4AlertTimer=null;}
    step4HtReadyForConfirmation=false;
    var page=document.querySelector('[data-temcon-page="standard"]');
    if(page)page.classList.remove('sop-step4-layout');
    var alert=document.getElementById('sopStep4Alert');if(alert)alert.hidden=true;
    var on=document.getElementById('sopStep4HtOnHotspot');if(on){on.onclick=null;on.disabled=false;on.classList.remove('is-active');}
    if(step4ConfirmTimer){clearTimeout(step4ConfirmTimer);step4ConfirmTimer=null;}
    closeModal(true);
  }

  function runSection1Step4Interactive(){
    clearHtRampTimers();cleanupHtRampUi();closeModal(true);hideSection1Tour();hideViewportScene();openPcDrawer();selectTemconPage('standard');
    step4HtReadyForConfirmation=false;
    var replica=ensureStep4HvReplica();
    var valve=ensureStep4Valve();
    if(!replica||!valve)return;
    replica.hidden=false;valve.hidden=false;
    var page=document.querySelector('[data-temcon-page="standard"]');
    page.classList.add('sop-step4-layout');
    setSection1TopTemconState(false);
    var on=document.getElementById('sopStep4HtOnHotspot');
    if(!on)return;
    on.disabled=false;on.classList.add('is-active');
    on.onclick=function(){
      if(on.disabled)return;
      ensureAudio();on.disabled=true;on.classList.remove('is-active');
      var alert=document.getElementById('sopStep4Alert');if(alert)alert.hidden=false;
      var cancel=document.getElementById('sopStep4AlertCancel');if(cancel)cancel.onclick=function(){if(alert)alert.hidden=true;};
      step4AlertTimer=setTimeout(function(){
        step4AlertTimer=null;
        if(state.currentSection!==1||state.currentStep!==3||!page.classList.contains('sop-step4-layout'))return;
        if(alert)alert.hidden=true;
        setSection1TopTemconState(true);
        step4ConfirmTimer=setTimeout(function(){
          step4ConfirmTimer=null;
          if(state.currentSection!==1||state.currentStep!==3||!page.classList.contains('sop-step4-layout'))return;
          step4HtReadyForConfirmation=true;
          showStep4StatusConfirmation();
        },1800);
      },2600);
    };
  }

  function showSection1(){
    var n=state.currentStep+1,st=currentStep();hideViewportScene();closePcDrawer();
    if(n!==1&&n!==3&&n!==5)hideSection1Tour();
    if(n===1){runSection1Step1Tour();}
    else if(n===2){openModal({locked:true,tag:'SECTION 1 · SAFETY',title:st.title,step:'Step 2 of 7',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p>',footer:confirmFooter('Confirm room condition')});bindConfirm();}
    else if(n===3){runSection1Step3Tour();}
    else if(n===4){runSection1Step4Interactive();}
    else if(n===5){runSection1Step5Tour();}
    else if(n===6){
      openModal({locked:true,tag:'SECTION 1 · STARTUP',title:st.title,step:'Step 6 of 7',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p><div class="sop-stabilize"><div class="sop-stabilize__bar"><span id="sopStabilizeBar"></span></div><div class="sop-stabilize__read" id="sopStabilizeRead">Stabilizing · 0%</div></div>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopStabilizeContinue" disabled>Stabilizing…</button>'});
      var bar=document.getElementById('sopStabilizeBar'),read=document.getElementById('sopStabilizeRead'),btn=document.getElementById('sopStabilizeContinue'),t0=Date.now(),dur=8000;
      var timer=setInterval(function(){if(!document.body.contains(bar)){clearInterval(timer);return;}var pct=Math.min(100,(Date.now()-t0)/dur*100);bar.style.width=pct+'%';read.textContent='Stabilizing · '+Math.round(pct)+'%';if(pct>=100){clearInterval(timer);read.textContent='Stabilization period complete';btn.disabled=false;btn.textContent='Confirm stabilization';}},120);
      btn.addEventListener('click',function(){if(btn.disabled)return;btn.disabled=true;completeStep(function(){closeModal(true);});});
    }
    else if(n===7){var d=new Date();var date=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');var time=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');openModal({locked:true,tag:'SECTION 1 · LOGBOOK',title:st.title,step:'Step 7 of 7',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p><div class="sop-log-grid"><div class="sop-log-field"><label>Date</label><input id="sopLogDate" type="date" value="'+date+'"></div><div class="sop-log-field"><label>Time</label><input id="sopLogTime" type="time" value="'+time+'"></div><div class="sop-log-field sop-log-field--wide"><label>Operator name</label><input id="sopLogName" type="text" placeholder="Enter operator name"></div></div>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopSaveLog" disabled>Save startup log</button>'});var name=document.getElementById('sopLogName'),save=document.getElementById('sopSaveLog');function valid(){save.disabled=!name.value.trim();}name.addEventListener('input',valid);save.addEventListener('click',function(){if(!name.value.trim())return;save.disabled=true;completeStep(function(){closeModal(true);});});}
  }

  function openPcDrawer(){if(!drawer)return;var dt=document.getElementById('pc-drawer-title');if(dt)dt.textContent='PC · TEM CONTROL';drawer.classList.add('is-open');if(drawerHandle){drawerHandle.setAttribute('aria-expanded','true');drawerHandle.title='Collapse PC drawer';}if(pcTem){pcTem.hidden=false;pcTem.classList.add('is-active');pcTem.setAttribute('aria-hidden','false');}if(pcCam){pcCam.hidden=true;pcCam.classList.remove('is-active');}if(viewerStage)viewerStage.classList.add('has-drawer');var storedHolder=document.getElementById('pc-holder-model-select');if(storedHolder&&state.selectedHolder)storedHolder.value=state.selectedHolder;var tabs=[].slice.call(document.querySelectorAll('[data-temcon-tab]'));tabs.forEach(function(b){var on=b.dataset.temconTab==='standard';b.classList.toggle('is-selected',on);b.setAttribute('aria-selected',on?'true':'false');});[].slice.call(document.querySelectorAll('[data-temcon-page]')).forEach(function(p){var on=p.dataset.temconPage==='standard';p.hidden=!on;p.classList.toggle('is-selected',on);});}
  function closePcDrawer(){if(!drawer)return;drawer.classList.remove('is-open');if(drawerHandle)drawerHandle.setAttribute('aria-expanded','false');if(pcTem)pcTem.setAttribute('aria-hidden','true');if(viewerStage)viewerStage.classList.remove('has-drawer');var hg=document.querySelector('.temcon-group--hv');if(hg)hg.classList.remove('sop-ht-focus');var vg=document.querySelector('.temcon-group--vacuum');if(vg)vg.classList.remove('sop-evc-focus');var sp=document.querySelector('[data-temcon-page="stage"]');if(sp)sp.classList.remove('sop-holder-model-step');var win=document.querySelector('.temcon-window');if(win)win.classList.remove('sop-holder-model-guided');hideSection1Step4Desk();hideSection2Step4Desk();releaseS3HtPhoto();var hm=document.getElementById('pc-holder-model-pulldown');if(hm)hm.hidden=false;var cf=document.getElementById('pc-holder-model-confirm');if(cf){cf.hidden=true;cf.disabled=true;}var fb=document.getElementById('pc-holder-model-feedback');if(fb)fb.hidden=true;[].slice.call(document.querySelectorAll('[data-action="holder-type"]')).forEach(function(b){b.disabled=false;b.removeAttribute('aria-disabled');});}
  function openCameraDrawer(){
    if(!drawer)return;
    drawer.classList.add('is-open');
    if(drawerHandle){drawerHandle.setAttribute('aria-expanded','true');drawerHandle.title='Collapse PC drawer';}
    var dt=document.getElementById('pc-drawer-title');if(dt)dt.textContent='PC · iTEM CAMERA';
    if(pcTem){pcTem.hidden=true;pcTem.classList.remove('is-active');pcTem.setAttribute('aria-hidden','true');}
    if(pcCam){pcCam.hidden=false;pcCam.classList.add('is-active');pcCam.setAttribute('aria-hidden','false');}
    if(viewerStage)viewerStage.classList.add('has-drawer');
    var cap=document.querySelector('.camera-titlebar__caption span:last-child');if(cap)cap.textContent='iTEM — Camera View';
  }


  function showSection2(){
    var n=state.currentStep+1,st=currentStep();closePcDrawer();
    if(n===1){hideViewportScene();openModal({locked:true,tag:'SECTION 2 · HOLDER',title:st.title,step:'Step 1 of 8',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p><div class="sop-flow-modal__visual"><img src="../assets/images/sop/section2-step1-holder-orings.png" alt="Actual specimen holder photograph showing the O-rings"></div><p class="sop-flow-modal__copy" style="margin-top:10px">Inspect the visible O-rings for damage, dust, dried grease, or contamination. Clean with a lint-free wipe and apply only light re-greasing if required.</p>',footer:confirmFooter('Confirm O-ring inspection')});bindConfirm();}
    else if(n===2){showSection2Step2();}
    else if(n===3){hideViewportScene();openModal({locked:true,compactGrid:true,tag:'SECTION 2 · GRID LOADING',title:st.title,step:'Step 3 of 8',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p><div class="sop-flow-modal__visual"><div style="width:min(760px,100%)"><img src="../assets/images/sop/section2-step3-grid-loading.png" alt="Actual holder cartridge photograph showing TEM grid loading with tweezers" style="margin-bottom:16px;"><div class="sop-grid-checks"><label class="sop-grid-check"><input type="checkbox" id="gridOpen"><span>1 · Open cartridge</span></label><label class="sop-grid-check is-disabled"><input type="checkbox" id="gridPlace" disabled><span>2 · Place grid sample-side up</span></label><label class="sop-grid-check is-disabled"><input type="checkbox" id="gridClose" disabled><span>3 · Close retaining clip</span></label></div></div></div>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="gridContinue" disabled>Continue</button>'});bindGrid();}
    else if(n===4){runSection2Step4Evac();}
    else if(n===5){runSection2Step4();}
    else if(n===6){runSection2Step5();}
    else if(n===7){runSection2Step8Rotation();}
    else if(n===8){runSection2Step10HolderModel();}
  }
  function selectTemconPage(name){
    var tabs=[].slice.call(document.querySelectorAll('[data-temcon-tab]'));
    tabs.forEach(function(b){var on=b.dataset.temconTab===name;b.classList.toggle('is-selected',on);b.setAttribute('aria-selected',on?'true':'false');});
    [].slice.call(document.querySelectorAll('[data-temcon-page]')).forEach(function(p){var on=p.dataset.temconPage===name;p.hidden=!on;p.classList.toggle('is-selected',on);});
  }

  var section2Step4Timer=null;
  function hideSection2Step4Desk(){
    if(section2Step4Timer){clearTimeout(section2Step4Timer);section2Step4Timer=null;}
    var page=document.querySelector('[data-temcon-page="standard"]');
    if(page)page.classList.remove('sop-step4-layout');
    var valve=document.getElementById('sopStep4Valve');
    if(valve)valve.hidden=true;
    var replica=document.getElementById('sopStep4HvReplica');
    if(replica)replica.hidden=true;
  }

  function runSection2Step4Evac(){
    hideViewportScene();closeModal(true);openPcDrawer();selectTemconPage('standard');
    var evc=document.getElementById('pc-evc-status'),air=document.getElementById('pc-vac-text');
    var page=document.querySelector('[data-temcon-page="standard"]');
    var replica=ensureStep4HvReplica();
    var valve=ensureSection2Step4Valve();
    if(!page||!replica||!valve)return;
    page.classList.add('sop-step4-layout');
    replica.hidden=false;valve.hidden=false;
    var htOn=document.getElementById('sopStep4HtOnHotspot');
    if(htOn){htOn.disabled=true;htOn.classList.remove('is-active');}
    if(evc)evc.textContent='READY';if(air)air.textContent='READY';
    setSection1TopTemconState(true);
    section2Step4Timer=setTimeout(function(){
      section2Step4Timer=null;
      if(state.currentSection!==2||state.currentStep!==3)return;
      openModal({locked:true,tag:'SECTION 2 · TEMCON',title:'Confirm EVAC READY for PIG4',step:'Step 4 of 8',
        body:'<p class="sop-flow-modal__copy">In the <strong>Valve Status</strong> window, verify specifically that <strong>Specimen / PIG4</strong> shows <strong>EVAC Ready</strong> before proceeding with holder insertion.</p>',
        footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopConfirmPIG4Evac">Confirm PIG4 EVAC Ready</button>'});
      var button=document.getElementById('sopConfirmPIG4Evac');
      if(button)button.addEventListener('click',function(){
        if(button.disabled)return;
        ensureAudio();button.disabled=true;
        completeStep(function(){closeModal(true);hideSection2Step4Desk();closePcDrawer();});
      });
    },8000);
  }

  function runSection2Step8Rotation(){
    closeModal(true);closePcDrawer();state.rotation15=false;state.rotation75=false;state.holderSeated=false;
    showViewportScene({
      baseSrc:'../assets/images/microscope/diagram/tem-guided-actual-room.jpg',
      focusSrc:'../assets/images/sop/section2-step4-position3.png',
      sceneClass:'is-step8-rotation-sequence',
      fadeFocus:true,
      fadeFocusDelay:1800
    });
    if(viewportStep4Img1){viewportStep4Img1.src='../assets/images/sop/section2-step8-position4.png';}
    if(viewportStep4Img2){viewportStep4Img2.src='../assets/images/sop/section2-step8-rotate15.png';}
    if(viewportStep4Img3){viewportStep4Img3.src='../assets/images/sop/section2-step8-rotate75.png';}
    if(viewportScene)viewportScene.setAttribute('data-step8-phase','context');
    var controls='<div class="sop-step8-inline">'
      +'<button class="sop-flow-btn sop-flow-btn--ghost" id="rot15Btn" disabled>Rotate by 15°</button>'
      +'<button class="sop-flow-btn sop-flow-btn--ghost" id="rot75Btn" disabled>Rotate by 75°</button>'
      +'<button class="sop-flow-btn sop-flow-btn--success" id="rotContinue" disabled>Continue</button>'
      +'</div>';
    setViewportControls(controls);
    var b15=document.getElementById('rot15Btn'),b75=document.getElementById('rot75Btn'),next=document.getElementById('rotContinue');

    // Previous first-stop insertion (Section 2 Step 5) position first, then fade to the fully-insertion image.
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==6)return;
      if(viewportScene)viewportScene.setAttribute('data-step8-phase','position4');
    },4300));
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==6)return;
      if(b15){b15.disabled=false;b15.classList.add('is-next-action');}
    },6100));

    if(b15)b15.addEventListener('click',function(){
      if(b15.disabled)return;ensureAudio();state.rotation15=true;b15.disabled=true;b15.classList.remove('is-next-action');b15.classList.add('is-done-action');
      if(viewportScene)viewportScene.setAttribute('data-step8-phase','rotate15');
      sceneTimers.push(setTimeout(function(){if(b75){b75.disabled=false;b75.classList.add('is-next-action');}},1500));
    });
    if(b75)b75.addEventListener('click',function(){
      if(b75.disabled||!state.rotation15)return;ensureAudio();state.rotation75=true;b75.disabled=true;b75.classList.remove('is-next-action');b75.classList.add('is-done-action');
      if(viewportScene)viewportScene.setAttribute('data-step8-phase','rotate75');
      sceneTimers.push(setTimeout(function(){if(viewportScene)viewportScene.setAttribute('data-step8-phase','fully-inserted');},1900));
      sceneTimers.push(setTimeout(function(){state.holderSeated=true;if(next)next.disabled=false;},3900));
    });
    if(next)next.addEventListener('click',function(){
      if(!(state.rotation75&&state.holderSeated))return;ensureAudio();clearSceneTimers();next.disabled=true;
      if(viewportScene)viewportScene.setAttribute('data-step8-phase','return');
      sceneTimers.push(setTimeout(function(){if(state.currentSection!==2||state.currentStep!==6)return;completeStep(function(){hideViewportScene();});},3900));
    });
  }

  function runSection2Step9FilamentPlaceholder(){
    closeModal(true);hideViewportScene();openPcDrawer();selectTemconPage('standard');
    var hg=document.querySelector('.temcon-group--hv'),fil=document.getElementById('pc-fil-status'),beamTop=document.getElementById('pc-beam-current-top'),beamHv=document.getElementById('pc-beam-current-hv');
    if(hg)hg.classList.add('sop-ht-focus');
    if(fil)fil.textContent='ON';if(beamTop)beamTop.textContent='≈103 µA';if(beamHv)beamHv.textContent='≈103 µA';
    setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==7)return;
      openModal({locked:true,tag:'SECTION 2 · TEMCON FILAMENT',title:'Turn filament ON',step:'Step 8 of 9',body:'<p class="sop-flow-modal__copy">This TEMCON filament interaction is temporarily represented by a confirmation step. The detailed PC-window interaction will be added when the reference image is supplied.</p><p class="sop-flow-modal__copy" style="margin-top:10px">On <strong>High Voltage Control</strong>, press <strong>Filament: ON</strong>. The filament current should increase gradually to its set value, and the <strong>Beam Current</strong> indicator should settle at approximately <strong>103 µA</strong>.</p>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopConfirmFilamentPlaceholder">Confirm Filament ON / ≈103 µA</button>'});
      var b=document.getElementById('sopConfirmFilamentPlaceholder');if(b)b.addEventListener('click',function(){ensureAudio();b.disabled=true;completeStep(function(){if(hg)hg.classList.remove('sop-ht-focus');closeModal(true);closePcDrawer();});});
    },1800);
  }

  // Step 8: choosing Single Tilt in the real TEMCON dropdown opens a standalone
  // confirmation modal. Never put a confirmation button under the dropdown.
  var showSection2Step8Confirmation=null;
  function runSection2Step10HolderModel(){
    closeModal(true);hideViewportScene();openPcDrawer();selectTemconPage('standard');
    var page=document.querySelector('[data-temcon-page="standard"]');
    var stagePage=document.querySelector('[data-temcon-page="stage"]');
    var replica=ensureStep4HvReplica(),valve=ensureSection2Step8Valve();
    var menu=document.getElementById('pc-holder-model-pulldown');
    var select=document.getElementById('pc-holder-model-select');
    var feedback=document.getElementById('pc-holder-model-feedback');
    var confirm=document.getElementById('pc-holder-model-confirm');
    var holderStatus=document.getElementById('pc-holder-status');
    var win=document.querySelector('.temcon-window');
    if(!page||!replica||!valve||!select)return;
    page.classList.add('sop-step4-layout');
    replica.hidden=false;valve.hidden=false;
    var htHotspot=document.getElementById('sopStep4HtOnHotspot');
    if(htHotspot){htHotspot.disabled=true;htHotspot.classList.remove('is-active');}
    setSection1TopTemconState(true);
    if(stagePage)stagePage.classList.remove('sop-holder-model-step');
    if(win)win.classList.add('sop-holder-model-guided');
    if(menu)menu.hidden=false;
    var placeholder=select.querySelector('option[value=""]');if(placeholder)placeholder.remove();
    // The TEMCON desktop keeps its normal Beryllium default until the learner
    // explicitly selects the required standard Single Tilt holder.
    select.value='single-tilt-beryllium';select.disabled=false;
    if(confirm){confirm.hidden=true;confirm.disabled=true;confirm.onclick=null;}
    if(feedback){feedback.hidden=true;feedback.textContent='';feedback.className='temcon-holder-model__feedback';}
    var oldButtons=[].slice.call(document.querySelectorAll('[data-action="holder-type"]'));
    oldButtons.forEach(function(b){b.disabled=true;b.setAttribute('aria-disabled','true');});
    function restore(){
      showSection2Step8Confirmation=null;
      if(win)win.classList.remove('sop-holder-model-guided');
      if(confirm){confirm.hidden=true;confirm.disabled=true;confirm.onclick=null;}
      if(feedback)feedback.hidden=true;
      select.onchange=null;
      select.value=state.selectedHolder||'single-tilt'; // preserve confirmed holder when leaving Section 2
      oldButtons.forEach(function(b){b.disabled=false;b.removeAttribute('aria-disabled');});
      hideSection2Step4Desk();
      closePcDrawer();
    }
    showSection2Step8Confirmation=function(){
      if(state.currentSection!==2||state.currentStep!==7||select.value!=='single-tilt')return;
      openModal({locked:false,tag:'SECTION 2 · HOLDER MODEL',title:'Confirm Single Tilt Holder',step:'Step 8 of 8',
        body:'<p class="sop-flow-modal__copy">Verify that the TEMCON holder dropdown shows <strong>EM-21010/21020 : Single Tilt Holder</strong> (not Single Tilt Beryllium Holder). Confirm this selection to complete specimen-holder loading.</p>',
        footer:'<button type="button" class="sop-flow-btn sop-flow-btn--success" id="sopConfirmSingleTilt">Confirm Single Tilt Holder</button>'});
      var btn=document.getElementById('sopConfirmSingleTilt');
      if(btn)btn.onclick=function(){
        if(btn.disabled||state.currentSection!==2||state.currentStep!==7||select.value!=='single-tilt')return;
        ensureAudio();btn.disabled=true;
        if(holderStatus)holderStatus.textContent='SINGLE TILT SELECTED';
        state.selectedHolder='single-tilt';
        completeStep(function(){closeModal(true);restore();});
      };
    };
    select.onchange=function(){
      ensureAudio();
      var correct=select.value==='single-tilt';
      if(holderStatus)holderStatus.textContent=correct?'SINGLE TILT SELECTED':'NOT SELECTED';
      // Choosing the right holder opens a separate modal; there is no inline
      // confirmation button or feedback panel obstructing the TEMCON controls.
      if(correct){showSection2Step8Confirmation();}
      else if(modal.classList.contains('is-open')&&modalTag.textContent==='SECTION 2 · HOLDER MODEL')closeModal(true);
    };
  }


  function setPcText(id,value){var e=document.getElementById(id);if(e)e.textContent=value;}
  function syncPcLiveStatus(){
    if(!bfState||state.currentSection!==3)return;
    var beam=!!bfState.beamOn,mode=bfState.magMode||(bfState.temMode?'TEM':'—'),mag=s3FormatMag? s3FormatMag(bfState.mag||8000):('X'+(bfState.mag||8000));
    setPcText('pc-live-beam',beam?'ON':'OFF');setPcText('pc-live-mode',mode);setPcText('pc-live-mag',mag);setPcText('pc-live-spot',String(bfState.spot||2));setPcText('pc-live-alpha','α'+String(bfState.alpha||2));setPcText('pc-live-z',Number(bfState.z||0).toFixed(1)+' µm');setPcText('pc-stg-x',Number(bfState.stageX||0).toFixed(1));setPcText('pc-stg-y',Number(bfState.stageY||0).toFixed(1));setPcText('readout-x',Number(bfState.stageX||0).toFixed(0));setPcText('readout-y',Number(bfState.stageY||0).toFixed(0));setPcText('readout-z',Number(bfState.z||0).toFixed(1));setPcText('pc-live-wobbler',bfState.wobble?('ON · '+String(bfState.wobbleAxis||'X').toUpperCase()):'OFF');setPcText('pc-live-condstig',bfState.condStigOn?'ON':'OFF');setPcText('pc-live-screen',bfState.screenRaised?'UP':'DOWN');setPcText('pc-live-camera',bfState.captured?'SNAPSHOT CAPTURED':(bfState.videoOn?'LIVE':(bfState.itemOpen?'iTEM OPEN':'IDLE')));setPcText('pc-live-v2',bfState.v2Open?'OPEN':'CLOSED');
    setPcText('pc-spot-value',String(bfState.spot||2));setPcText('pc-spot-value-top',String(bfState.spot||2));setPcText('pc-alpha-value',String(bfState.alpha||2));setPcText('pc-alpha-value-top',String(bfState.alpha||2));setPcText('pc-mag-value',mag);setPcText('pc-stg-z',Number(bfState.z||0).toFixed(1));
    var modeRead=document.getElementById('mag-mode-readout');if(modeRead)modeRead.textContent=mode;
    var magRead=document.getElementById('mag-caml-readout');if(magRead)magRead.textContent=mag;
    var beamLamp=document.getElementById('pc-beam-lamp');if(beamLamp){beamLamp.classList.toggle('is-on',beam);var bs=beamLamp.querySelector('strong');if(bs)bs.textContent=beam?'ON':((state.currentSection===3&&state.currentStep<4)?'NotReady':'OFF');}
  }

  function resetBfState(){
    bfState={mag:3000,mode:'image',featureX:35,featureY:65,z:-8,wobble:false,wobbleSeen:false,aperture:'',caX:5,caY:-4,c2:45,c2Moves:0,condX:4,condY:-3,condLowSeen:false,condHighSeen:false,beamX:5,beamY:-4,objX:4,objY:-3,focusCoarse:8,focusFine:2,finalFocusChecked:false,finalAstigChecked:false,captured:false};
  }
  function clearBfTimers(){bfTimers.forEach(function(t){try{clearTimeout(t);}catch(e){}try{clearInterval(t);}catch(e){}});bfTimers=[];s3StepCompleting=false;}
  function clearPhysicalFocus(){[].slice.call(document.querySelectorAll('.sop-control-focus')).forEach(function(e){e.classList.remove('sop-control-focus');});}
  function focusPhysical(selectors){clearPhysicalFocus();selectors.forEach(function(sel){var e=document.querySelector(sel);if(e)e.classList.add('sop-control-focus');});}
  function setViewer(which){
    [].slice.call(document.querySelectorAll('.viewer__tab')).forEach(function(t){var on=t.dataset.view===which;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',on?'true':'false');});
    [].slice.call(document.querySelectorAll('.viewer__panel')).forEach(function(p){p.classList.toggle('is-active',p.dataset.viewPanel===which);});
    var cap=document.getElementById('viewer-caption');if(cap)cap.textContent=which==='screen'?'VIEWING SCREEN · PHOSPHOR':'ELECTRON OPTICAL COLUMN';
  }
  function wireS3ViewerTabs(){[].slice.call(document.querySelectorAll('.viewer__tab')).forEach(function(t){if(t.dataset.sopWired)return;t.dataset.sopWired='1';t.addEventListener('click',function(){setViewer(t.dataset.view);});});}
  var s3LocatorMap={
    'probe-tem':{panel:'l1',label:'TEM',x:20.2,y:41.0,w:8.0,h:10.0},
    'beam-on':{panel:'l1',label:'BEAM',x:8.0,y:11.0,w:9.5,h:11.0,note:'Beam control region on the supplied L1 reference.'},
    'brightness':{panel:'l1',label:'BRIGHTNESS',x:56.0,y:58.0,w:17.5,h:22.0},
    'spot-size':{panel:'l1',label:'SPOT SIZE',x:34.0,y:70.0,w:14.5,h:19.0},
    'alpha-selector':{panel:'l1',label:'α SELECTOR',x:16.0,y:70.0,w:14.5,h:19.0},
    'def-stig-mode':{panel:'l1',label:'COND STIG',x:66.5,y:36.0,w:17.0,h:9.0},
    'shift-x':{panel:'l1',label:'SHIFT X',x:77.0,y:50.0,w:15.0,h:18.0},
    'def-stig-x':{panel:'l1',label:'DEF/STIG X',x:77.0,y:72.0,w:15.0,h:19.0},
    'f1':{panel:'r1',label:'F1',x:61.0,y:12.0,w:8.0,h:10.0},
    'mag-mode':{panel:'r1',label:'MAG 1 / LOW MAG',x:14.0,y:29.0,w:20.0,h:13.0},
    'mag-caml':{panel:'r1',label:'MAG/CAM L',x:34.0,y:43.0,w:18.0,h:21.0},
    'std-focus':{panel:'r1',label:'STD FOCUS',x:78.0,y:29.0,w:13.5,h:15.0},
    'wobbler':{panel:'r1',label:'MAG WOB X / Y',x:35.0,y:12.0,w:20.0,h:10.0},
    'auto-contrast':{panel:'r1',label:'AUTO',x:81.0,y:65.0,w:10.0,h:11.0},
    'shift-y':{panel:'r1',label:'SHIFT Y',x:10.0,y:46.0,w:13.0,h:17.0},
    'def-stig-y':{panel:'r1',label:'DEF/STIG Y',x:10.0,y:73.0,w:14.0,h:18.0},
    'focus-fine':{panel:'r1',label:'OBJ FOCUS FINE',x:35.0,y:72.0,w:17.0,h:20.0},
    'focus-coarse':{panel:'r1',label:'OBJ FOCUS COARSE',x:58.0,y:70.0,w:20.0,h:22.0},
    'stage-z':{panel:'r1',label:'Z UP / Z DOWN',x:8.0,y:11.0,w:24.0,h:12.0},
    'stage-xy':{panel:'stage',label:'SPEC CONTROL · Trackball',x:19.0,y:42.0,w:63.0,h:38.0,note:'Actual JEOL specimen-stage control. Use the large trackball for specimen X/Y movement; the magnifier shows the real hardware layout.'}
  };
  function removeS3LocatorButtons(){[].slice.call(document.querySelectorAll('.sop-control-locator')).forEach(function(b){b.remove();});}
  function closeS3Locator(){var m=document.getElementById('sopControlLocator');if(m){var pre=m.classList.contains('sop-prestart-reference');m.classList.remove('is-open','sop-prestart-reference');m.setAttribute('aria-hidden','true');if(pre){var hl=document.getElementById('sopLocatorHighlight');if(hl)hl.style.display='';if(prestartReturnFocus)prestartReturnFocus.focus();}}}
  function openS3Locator(controlKey){
    var cfg=s3LocatorMap[controlKey],m=document.getElementById('sopControlLocator');if(!cfg||!m)return;
    var img=document.getElementById('sopLocatorImage'),hl=document.getElementById('sopLocatorHighlight'),title=document.getElementById('sopLocatorTitle'),note=document.getElementById('sopLocatorNote');
    if(img){
      img.src=cfg.panel==='l1'?'../assets/images/sop/section3-l1-modal-reference.png':(cfg.panel==='r1'?'../assets/images/sop/section3-r1-modal-reference.png':'../assets/images/sop/section3-spec-control-actual.png');
    }
    if(title)title.textContent=(cfg.panel==='l1'?'L1 · ':(cfg.panel==='r1'?'R1 · ':'SPECIMEN STAGE · '))+cfg.label.replace('SPEC CONTROL · ','');
    if(note)note.textContent=cfg.note||'Highlighted area shows the active control on the actual TEM panel.';
    if(hl){hl.style.display='';hl.style.left=cfg.x+'%';hl.style.top=cfg.y+'%';hl.style.width=cfg.w+'%';hl.style.height=cfg.h+'%';}
    m.classList.add('is-open');m.setAttribute('aria-hidden','false');
  }
  function attachS3Locator(control,key){
    if(!control||!s3LocatorMap[key])return;
    var b=document.createElement('button');b.type='button';b.className='sop-control-locator';b.title='Show actual control position';b.setAttribute('aria-label','Show actual '+s3LocatorMap[key].label+' position');b.textContent='🔍';
    b.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();openS3Locator(key);});control.appendChild(b);
  }
  function s3LockControls(){[].slice.call(document.querySelectorAll('.ctl')).forEach(function(c){c.classList.remove('is-active','sop-control-focus');});removeS3LocatorButtons();var dock=document.getElementById('sop-stage-dock');if(dock){dock.classList.remove('is-active','is-open');var tg=document.getElementById('sop-stage-dock-toggle');if(tg)tg.setAttribute('aria-expanded','false');}s3Handlers={};}
  var s3ActivePrimary=null,s3VisibilityTimer=null;
  function revealStageControl(behavior){
    var dock=document.getElementById('sop-stage-dock');
    var sc=document.querySelector('#panel-r1 .ctl-panel__scroll');
    if(!dock||!sc)return;
    dock.classList.add('is-active','is-open');
    var tg=document.getElementById('sop-stage-dock-toggle');if(tg)tg.setAttribute('aria-expanded','true');
    // The stage controller sits at the bottom of R1. Scroll the *panel* to its true
    // bottom after expansion; nested offsetTop is not reliable here.
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var target=Math.max(0,sc.scrollHeight-sc.clientHeight);
        try{sc.scrollTo({top:target,behavior:behavior||'smooth'});}catch(_){sc.scrollTop=target;}
      });
    });
  }
  function ensureS3ActiveVisible(behavior){
    var el=s3ActivePrimary;
    if(!el||!document.body.contains(el)||(state.currentSection!==3&&state.currentSection!==4))return;
    if(el.closest('#sop-stage-dock')){
      revealStageControl(behavior||'smooth');
      return;
    }
    var panelScroller=el.closest('.ctl-panel__scroll');
    if(panelScroller){
      var er=el.getBoundingClientRect(),sr=panelScroller.getBoundingClientRect();
      var fullyVisible=er.top>=sr.top+12&&er.bottom<=sr.bottom-12;
      if(!fullyVisible){
        // Convert viewport coordinates into the scroll container coordinate system.
        var desired=panelScroller.scrollTop+(er.top-sr.top)-Math.max(18,(panelScroller.clientHeight-er.height)/2);
        desired=Math.max(0,Math.min(desired,panelScroller.scrollHeight-panelScroller.clientHeight));
        try{panelScroller.scrollTo({top:desired,behavior:behavior||'smooth'});}catch(_){panelScroller.scrollTop=desired;}
      }
      return;
    }
    var r=el.getBoundingClientRect();
    if(r.top<8||r.bottom>window.innerHeight-8){try{el.scrollIntoView({behavior:behavior||'smooth',block:'center',inline:'nearest'});}catch(_){}}
  }
  function scheduleS3ActiveVisibility(){
    [80,300,700,1200].forEach(function(delay){setTimeout(function(){ensureS3ActiveVisible(delay<100?'smooth':'auto');},delay);});
  }
  function s3Activate(keys){
    [].slice.call(document.querySelectorAll('.ctl')).forEach(function(c){c.classList.remove('is-active','sop-control-focus');});
    removeS3LocatorButtons();
    var active=[],dock=document.getElementById('sop-stage-dock');if(dock)dock.classList.remove('is-active');
    (keys||[]).forEach(function(k){
      [].slice.call(document.querySelectorAll('.ctl[data-control="'+k+'"]')).forEach(function(c){
        c.classList.add('is-active','sop-control-focus');active.push(c);
        if(c.closest('#panel-l1')||c.closest('#panel-r1')||c.closest('#sop-stage-dock'))attachS3Locator(c,k);
        if(k==='stage-xy'&&dock){dock.classList.add('is-active','is-open');var tg=document.getElementById('sop-stage-dock-toggle');if(tg)tg.setAttribute('aria-expanded','true');setTimeout(function(){revealStageControl('smooth');},40);setTimeout(function(){revealStageControl('auto');},420);}
      });
    });
    s3ActivePrimary=active.length?active[0]:null;
    if(s3ActivePrimary)scheduleS3ActiveVisibility();
  }
  function s3SelectButton(btn){if(!btn)return;var g=btn.parentElement;if(g)[].slice.call(g.querySelectorAll('button')).forEach(function(x){x.classList.remove('is-selected');});btn.classList.add('is-selected');}
  function s3SetHandlers(h){s3Handlers=h||{};}
  function s3SetKnob(name,v){var h=s3KnobHandles[name];if(h)h.value=v;}
  function s3SetPad(name,x,y){var h=s3PadHandles[name];if(h)h.value={x:x,y:y};}
  function s3AutoComplete(delay,before){
    if(s3StepCompleting)return;s3StepCompleting=true;var sec=state.currentSection,step=state.currentStep;
    var t=setTimeout(function(){if(state.currentSection!==sec||state.currentStep!==step){s3StepCompleting=false;return;}completeStep(before);},delay||650);bfTimers.push(t);
  }
  function initS3PanelInteractions(){
    if(s3PanelInit)return;s3PanelInit=true;if(!(window.TEM&&TEM.controlsUI))return;
    [].slice.call(document.querySelectorAll('[data-action]')).forEach(function(btn){btn.addEventListener('click',function(){if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=btn.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['action:'+btn.dataset.action];if(fn)fn(btn);});});
    ['brightness','focus-coarse','focus-fine'].forEach(function(name){var el=document.querySelector('[data-knob="'+name+'"]');if(!el)return;var min=Number(el.dataset.min||0),max=Number(el.dataset.max||100),value=Number(el.dataset.value||0);s3KnobHandles[name]=TEM.controlsUI.bindKnob(el,{min:min,max:max,value:value,onChange:function(v){if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['knob:'+name];if(fn)fn(v);}});});
    [].slice.call(document.querySelectorAll('[data-defstig-axis]')).forEach(function(el){var axis=el.dataset.defstigAxis;var min=Number(el.dataset.min||-50),max=Number(el.dataset.max||50);s3KnobHandles['defstig-'+axis]=TEM.controlsUI.bindKnob(el,{min:min,max:max,value:0,onChange:function(v){if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['defstig:'+axis];if(fn)fn(v);}});});
    ['stage-xy','aperture-align'].forEach(function(name){var el=document.querySelector('[data-trackpad="'+name+'"]');if(!el)return;var rr=(el.dataset.range||'-50,50').split(',').map(Number);s3PadHandles[name]=TEM.controlsUI.bindTrackpad(el,{rangeX:[rr[0],rr[1]],rangeY:[rr[0],rr[1]],valueX:0,valueY:0,onChange:function(pos){if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['pad:'+name];if(fn)fn(pos);}});});
  }
  function ensureBfScene(){
    if(bfScene||!viewScreen)return;
    var w=document.createElement('div');w.id='sopBfScene';w.className='sop-bf-scene sop-bf-scene--screen';w.hidden=true;
    w.innerHTML='<div class="sop-bf-screen" id="sopBfScreen">'
      +'<img class="sop-bf-specimen" id="sopBfSpecimen" src="../assets/images/sop/real-sample/Tv5.png" alt="Real Bright Field specimen view">'
      +'<div class="sop-bf-feature" id="sopBfFeature"><span></span></div>'
      +'<div class="sop-bf-beam" id="sopBfBeam"></div>'
      +'<div class="sop-bf-direct" id="sopBfDirect"></div>'
      +'<div class="sop-bf-aperture-ring" id="sopBfApertureRing"></div>'
      +'<div class="sop-bf-fringe" id="sopBfFringe"></div>'
      +'<div class="sop-bf-crosshair"><i></i><b></b></div>'
      +'<div class="sop-bf-status" id="sopBfStatus"></div>'
      +'</div>';
    viewScreen.appendChild(w);bfScene=w;bfScreen=document.getElementById('sopBfScreen');bfSpecimen=document.getElementById('sopBfSpecimen');bfBeam=document.getElementById('sopBfBeam');bfFeature=document.getElementById('sopBfFeature');bfDirect=document.getElementById('sopBfDirect');bfApertureRing=document.getElementById('sopBfApertureRing');bfFringe=document.getElementById('sopBfFringe');bfStatus=document.getElementById('sopBfStatus');bfControlCard=null;bfActions=null;
  }
  function hideBfScene(){ensureBfScene();clearBfTimers();clearPhysicalFocus();s3LockControls();if(!bfScene)return;bfScene.hidden=true;bfScene.className='sop-bf-scene sop-bf-scene--screen';if(viewEmpty)viewEmpty.style.display='';if(bfScreen)bfScreen.onclick=null;}
  function showBfScene(){hideS3BeamScreenStill();closeModal(true);closePcDrawer();hideViewportScene();hideSection1Tour();ensureBfScene();clearBfTimers();if(!bfScene)return;bfScene.hidden=false;bfScene.className='sop-bf-scene sop-bf-scene--screen';bfScene.classList.remove('is-fluorescent');if(viewEmpty)viewEmpty.style.display='none';setViewer('screen');bfSetSpecimenImage(bfResolveImageKey());bfRender();syncPcLiveStatus();}
  function bfSetStatus(text){if(bfStatus){bfStatus.textContent='';bfStatus.style.display='none';}}
  function updateBfDummyCue(){
    if(!bfDummyBadge && !bfStepIndicator) return;
    var n=(state.currentSection===3)?(state.currentStep+1+(state.currentStep>=4?1:0)):0;
    var label='REAL SAMPLE IMAGE', title='', sub='';
    if(n>=10){
      if(n===10){label='DUMMY · CA CENTERING'; title='Condenser Aperture Centering'; sub='Move CA X/Y so the beam expansion stays concentric about the optical axis.';}
      else if(n===11){label='DUMMY · C.STIG CHECK'; title='Condenser Astigmatism'; sub='The beam is intentionally elliptical first; DEF/STIG X and Y should make it circular.';}
      else if(n===12){label='DUMMY · BEAM CENTER'; title='Beam Shift Centering'; sub='Bring the crossover to the center and spread it with BRIGHTNESS.';}
      else if(n===13){label='DUMMY · OBJ APERTURE'; title='Objective Aperture Alignment'; sub='In diffraction mode, center the aperture ring on the direct 000 beam.';}
      else if(n===14){label='DUMMY · GAUSSIAN FOCUS'; title='Focus Adjustment'; sub='Coarse then Fine focus should reduce the Fresnel fringe and sharpen the image.';}
      else if(n===15){label='DUMMY · FINAL BF CHECK'; title='Final Bright-Field Check'; sub='Confirm final magnification, focus and astigmatism before acquisition.';}
      else if(n>=16){label='DUMMY · ACQUISITION'; title='Image Acquisition'; sub='Select the area of interest, spread the beam appropriately and prepare for capture.';}
    }
    if(bfDummyBadge){
      bfDummyBadge.textContent=label;
      bfDummyBadge.classList.toggle('is-operation', n>=10);
      bfDummyBadge.style.display='';
    }
    if(bfStepIndicator){
      if(n>=10){
        bfStepIndicator.innerHTML='<b>'+title+'</b><span>'+sub+'</span>';
        bfStepIndicator.style.display='block';
      }else{
        bfStepIndicator.innerHTML='';
        bfStepIndicator.style.display='none';
      }
    }
  }

  function bfRender(){
    if(!bfScene)return;var focus=Math.abs((bfState.focusCoarse||0)+(bfState.focusFine||0)),magScale=bfState.mag>=100000?1.17:(bfState.mag>=30000?1.08:1);
    if(bfSpecimen){bfSpecimen.style.transform='scale('+magScale+')';bfSpecimen.style.filter='grayscale(1) contrast('+(1.08+Math.min(.25,bfState.mag/500000))+') blur('+Math.min(5,focus*.22)+'px)';}
    if(bfFeature){bfFeature.style.left=bfState.featureX+'%';bfFeature.style.top=bfState.featureY+'%';bfFeature.style.setProperty('--wobble',Math.min(18,Math.abs(bfState.z||0)*1.35)+'px');bfFeature.classList.toggle('is-wobbling',!!bfState.wobble);}
    var beamOffsetX=(bfState.beamX||0)+(bfState.caX||0),beamOffsetY=(bfState.beamY||0)+(bfState.caY||0),size=Math.max(18,Math.min(82,bfState.c2||45));
    if(bfBeam){bfBeam.style.width=size+'%';bfBeam.style.height=Math.max(16,size-(Math.abs(bfState.condX||0)+Math.abs(bfState.condY||0))*2.3)+'%';bfBeam.style.left=(50+beamOffsetX)+'%';bfBeam.style.top=(50+beamOffsetY)+'%';bfBeam.style.transform='translate(-50%,-50%) rotate('+((bfState.condX||0)*5)+'deg)';}
    var isDiff=bfState.mode==='diff';bfScene.classList.toggle('is-diff',isDiff);if(bfDirect){bfDirect.style.left=(50+(bfState.objX||0))+'%';bfDirect.style.top=(50+(bfState.objY||0))+'%';}if(bfApertureRing){bfApertureRing.style.left='50%';bfApertureRing.style.top='50%';}
    if(bfFringe){bfFringe.style.opacity=Math.min(.95,focus/10).toFixed(2);bfFringe.style.transform='translate(-50%,-50%) scale('+(1+Math.min(.25,focus/30))+')';}
    var ind=document.getElementById('ind-mag');if(ind)ind.textContent=Number(bfState.mag).toLocaleString()+'×';
    if(bfStatus)bfStatus.innerHTML='<span>Mode <strong>'+String(bfState.mode).toUpperCase()+'</strong></span><span>MAG <strong>'+Number(bfState.mag).toLocaleString()+'×</strong></span><span>Z <strong>'+Number(bfState.z).toFixed(1)+'</strong></span>';
  }
  function clearS3PcPanel(){hideS3FocusViewport();var ws=document.querySelector('#pc-cam .camera-workstation');if(ws)ws.classList.remove('sop-item-workflow','sop-item-workflow--focus');var p=document.getElementById('sopS3PcPanel');if(p)p.remove();var v=document.getElementById('sopS3ValvePanel');if(v)v.remove();var it=document.getElementById('sopItemPanel');if(it)it.remove();var legacy=document.querySelector('.pc-cam-controls');if(legacy)legacy.style.display='';}
  function addS3PcPanel(host,title,body){clearS3PcPanel();var p=document.createElement('div');p.id='sopS3PcPanel';p.className='sop-s3-pc-panel';p.innerHTML='<div class="sop-s3-pc-panel__title">'+title+'</div>'+body;host.appendChild(p);return p;}

  function showSection3(){var n=state.currentStep+1;s3StepCompleting=false;hideViewportScene();hideSection1Tour();clearS3PcPanel();s3LockControls();if(n===1)runS3Step1HtRamp();else if(n===2)runS3Step2Filament();else if(n===3)runS3Step3V2();else if(n===4)runS3Step4LowMag();else if(n===5)runS3Step5EucentricMag();else if(n===6)runS3Step6CenterFeature();else if(n===7)runS3Step7Wobble();else if(n===8)runS3Step8HighMagWobble();else if(n===9)runS3Step9Aperture();else if(n===10)runS3Step10CenterCA();else if(n===11)runS3Step11CondStig();else if(n===12)runS3Step12BeamCenter();else if(n===13)runS3Step13ObjAperture();else if(n===14)runS3Step14Focus();else if(n===15)runS3Step15FinalCheck();else if(n===16)runS3Step16Acquire();}

  function runS3Step1HtRamp(){
    hideBfScene();setViewer('column');openPcDrawer();selectTemconPage('standard');var hg=document.querySelector('.temcon-group--hv');if(!hg)return;hg.classList.add('sop-ht-focus');var status=document.getElementById('pc-ht-status'),val=document.getElementById('pc-ht-value'),acc=document.getElementById('pc-acc-value');if(status)status.textContent='READY · 80 kV';if(val)val.textContent='80.00 kV';if(acc)acc.textContent='80 kV';
    addS3PcPanel(hg,'Bright Field · Auto HT ramp','<div class="sop-s3-pc-row"><label>Target voltage</label><select id="s3HtTarget"><option value="80">80 kV</option><option value="200">200 kV</option></select></div><div class="sop-s3-progress"><span id="s3HtBar"></span></div><div class="sop-s3-pc-note" id="s3HtNote">Starting from verified 80 kV baseline. Select 200 kV, then start Auto Ramp.</div><div class="sop-s3-pc-buttons"><button id="s3HtStart" disabled>Start Auto Ramp</button></div>');
    var target=document.getElementById('s3HtTarget'),start=document.getElementById('s3HtStart'),bar=document.getElementById('s3HtBar'),note=document.getElementById('s3HtNote');target.onchange=function(){start.disabled=target.value!=='200';};start.onclick=function(){ensureAudio();start.disabled=true;target.disabled=true;if(status)status.textContent='RAMPING';var t0=Date.now(),dur=9000,t=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/dur),kv=80+120*p;if(val)val.textContent=kv.toFixed(1)+' kV';if(acc)acc.textContent=Math.round(kv)+' kV';bar.style.width=(p*100)+'%';note.textContent='Auto HT ramp · '+kv.toFixed(1)+' kV';if(p>=1){clearInterval(t);if(val)val.textContent='200.00 kV';if(acc)acc.textContent='200 kV';if(status)status.textContent='STABILIZING';note.textContent='200 kV reached · stabilizing';var s0=Date.now(),sd=4000,st=setInterval(function(){var sp=Math.min(1,(Date.now()-s0)/sd);bar.style.width=(sp*100)+'%';if(sp>=1){clearInterval(st);if(status)status.textContent='READY';note.textContent='HT READY at 200 kV · advancing automatically';s3AutoComplete(900,function(){hg.classList.remove('sop-ht-focus');clearS3PcPanel();closePcDrawer();});}},120);bfTimers.push(st);}},120);bfTimers.push(t);};
  }
  function runS3Step2Filament(){
    hideBfScene();setViewer('column');openPcDrawer();selectTemconPage('standard');var hg=document.querySelector('.temcon-group--hv');if(!hg)return;hg.classList.add('sop-ht-focus');var fil=document.getElementById('pc-fil-status'),top=document.getElementById('pc-beam-current-top'),hv=document.getElementById('pc-beam-current-hv');if(fil)fil.textContent='OFF';if(top)top.textContent='0 µA';if(hv)hv.textContent='0.0 µA';
    addS3PcPanel(hg,'Bright Field · Filament','<div class="sop-s3-progress"><span id="s3FilBar"></span></div><div class="sop-s3-pc-note" id="s3FilNote">Press Filament ON and wait for beam current to stabilize.</div><div class="sop-s3-pc-buttons"><button id="s3FilOn">Filament ON</button></div>');var on=document.getElementById('s3FilOn'),bar=document.getElementById('s3FilBar'),note=document.getElementById('s3FilNote');on.onclick=function(){ensureAudio();on.disabled=true;if(fil)fil.textContent='ON · RISING';var t0=Date.now(),dur=6500,t=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/dur),ua=103*p;if(top)top.textContent=ua.toFixed(0)+' µA';if(hv)hv.textContent=ua.toFixed(1)+' µA';bar.style.width=(p*100)+'%';note.textContent='Beam Current '+ua.toFixed(0)+' µA';if(p>=1){clearInterval(t);if(fil)fil.textContent='ON';if(top)top.textContent='≈103 µA';if(hv)hv.textContent='≈103 µA';note.textContent='Filament ON · Beam Current ≈103 µA · advancing automatically';s3AutoComplete(900,function(){hg.classList.remove('sop-ht-focus');clearS3PcPanel();closePcDrawer();});}},120);bfTimers.push(t);};
  }
  function runS3Step3V2(){
    hideBfScene();setViewer('column');openPcDrawer();selectTemconPage('standard');var page=document.querySelector('[data-temcon-page="standard"]');if(!page)return;var p=document.createElement('div');p.id='sopS3ValvePanel';p.className='sop-s3-valve-panel';p.innerHTML='<div class="sop-s3-pc-panel__title">Valve Status</div><div class="sop-s3-valve-line"><span>Image observation chamber isolation valve</span><strong id="s3V2State">V2 · CLOSED</strong></div><div class="sop-s3-pc-note">The electron beam will not generate while V2 is closed.</div><div class="sop-s3-pc-buttons"><button id="s3V2Open">Open V2</button></div>';page.insertBefore(p,page.firstChild);var op=document.getElementById('s3V2Open'),st=document.getElementById('s3V2State');op.onclick=function(){ensureAudio();op.disabled=true;st.textContent='V2 · OPEN';st.classList.add('is-ready');s3AutoComplete(800,function(){clearS3PcPanel();closePcDrawer();});};
  }
  function runS3Step4LowMag(){
    showBfScene();bfState.mode='image';bfState.mag=3000;bfSetStatus('Select TEM IMAGE mode.');s3Activate(['imaging-mode']);
    s3SetHandlers({'action:imaging-mode':function(btn){if(btn.dataset.value==='diff')return;s3SelectButton(btn);bfState.mode='image';bfRender();bfSetStatus('TEM IMAGE selected · now select LOW magnification.');s3Activate(['magnification']);s3SetHandlers({'action:magnification':function(mb){if(mb.dataset.value!=='low')return;s3SelectButton(mb);bfState.mag=3000;bfRender();bfSetStatus('Survey magnification set to 3,000×.');s3AutoComplete(650);}});}});
  }
  function runS3Step5EucentricMag(){
    showBfScene();bfSetStatus('Set magnification to approximately 40,000×.');s3Activate(['magnification']);s3SetHandlers({'action:magnification':function(btn){if(btn.dataset.value!=='medium')return;s3SelectButton(btn);bfState.mag=40000;bfRender();bfSetStatus('40,000× selected · suitable for eucentric-height setup.');s3AutoComplete(650);}});
  }
  function runS3Step6CenterFeature(){
    showBfScene();bfState.featureX=35;bfState.featureY=65;bfState.focusCoarse=0;bfState.focusFine=0;s3SetPad('stage-xy',-100,-100);bfRender();bfSetStatus('Use Stage X/Y to center the highlighted feature.');s3Activate(['stage-xy']);
    s3SetHandlers({'pad:stage-xy':function(pos){bfState.featureX=50+pos.x*.15;bfState.featureY=50-pos.y*.15;bfRender();if(Math.abs(pos.x)<=12&&Math.abs(pos.y)<=12){bfSetStatus('Feature centered · press STD FOCUS.');s3Activate(['std-focus']);s3SetHandlers({'action:std-focus':function(btn){s3SelectButton(btn);bfState.focusCoarse=0;bfState.focusFine=0;bfRender();bfSetStatus('STD FOCUS reset complete.');s3AutoComplete(650);}});}}});
  }
  function runS3Step7Wobble(){
    showBfScene();bfState.z=-8;bfState.wobble=false;bfState.wobbleSeen=false;bfRender();bfSetStatus('Turn IMAGE WOBB X ON.');s3Activate(['wobbler']);
    function wobbleHandler(btn){bfState.wobble=!bfState.wobble;if(bfState.wobble){bfState.wobbleSeen=true;s3SelectButton(btn);bfSetStatus('WOBB X ON · use +Z / −Z until lateral shift is minimal.');s3Activate(['wobbler','stage-z']);}else{btn.classList.remove('is-selected');if(Math.abs(bfState.z)<=1&&bfState.wobbleSeen){bfSetStatus('Eucentric Z set.');bfRender();s3AutoComplete(650);}}bfRender();}
    function zHandler(btn){bfState.z=Math.max(-12,Math.min(12,bfState.z+Number(btn.dataset.dir)*2));bfRender();if(Math.abs(bfState.z)<=1){bfSetStatus('Minimal lateral shift reached · switch WOBB X OFF.');s3Activate(['wobbler']);}}
    s3SetHandlers({'action:wobbler-toggle':wobbleHandler,'action:stage-z':zHandler});
  }
  function runS3Step8HighMagWobble(){
    showBfScene();bfState.z=-3;bfState.wobble=false;bfState.wobbleSeen=false;bfSetStatus('Increase magnification to 100,000×.');s3Activate(['magnification']);
    function setHigh(btn){if(btn.dataset.value!=='high')return;s3SelectButton(btn);bfState.mag=100000;bfRender();bfSetStatus('100,000× set · turn IMAGE WOBB X ON.');s3Activate(['wobbler']);s3SetHandlers({'action:wobbler-toggle':wobbleHandler,'action:stage-z':zHandler});}
    function wobbleHandler(btn){bfState.wobble=!bfState.wobble;if(bfState.wobble){bfState.wobbleSeen=true;s3SelectButton(btn);bfSetStatus('High-mag wobble ON · fine-tune Z.');s3Activate(['wobbler','stage-z']);}else{btn.classList.remove('is-selected');if(Math.abs(bfState.z)<=.5&&bfState.wobbleSeen){bfSetStatus('Fine eucentric correction complete.');bfRender();s3AutoComplete(650);}}bfRender();}
    function zHandler(btn){bfState.z=Math.max(-5,Math.min(5,bfState.z+Number(btn.dataset.dir)*.5));bfRender();if(Math.abs(bfState.z)<=.5){bfSetStatus('High-mag wobble minimized · switch WOBB X OFF.');s3Activate(['wobbler']);}}
    s3SetHandlers({'action:magnification':setHigh});
  }
  function runS3Step9Aperture(){
    showBfScene();bfSetStatus('Select condenser aperture first.');s3Activate(['aperture-select']);
    s3SetHandlers({'action:aperture-select':function(btn){if(btn.dataset.value!=='condenser')return;s3SelectButton(btn);bfState.aperture='condenser';bfSetStatus('Condenser aperture selected · choose M for routine BF.');s3Activate(['aperture-size']);s3SetHandlers({'action:aperture-size':function(sb){if(sb.dataset.value!=='medium')return;s3SelectButton(sb);bfState.aperture='routine';bfSetStatus('Routine BF condenser aperture selected.');s3AutoComplete(650);}});}});
  }
  function runS3Step10CenterCA(){
    showBfScene();bfState.beamX=0;bfState.beamY=0;bfState.caX=5;bfState.caY=-4;bfState.c2=42;bfState.c2Moves=0;s3LastBrightness=42;s3SetPad('aperture-align',25,-20);s3SetKnob('brightness',42);bfRender();bfSetStatus('Center CA X/Y and vary C2/Intensity to verify symmetric beam spread.');s3Activate(['aperture-align','brightness']);
    function check(){if(Math.abs(bfState.caX)<=1&&Math.abs(bfState.caY)<=1&&bfState.c2Moves>=2){bfSetStatus('Beam expands/contracts symmetrically about the optical axis.');s3AutoComplete(700);}}
    s3SetHandlers({'pad:aperture-align':function(pos){bfState.caX=pos.x/5;bfState.caY=pos.y/5;bfRender();check();},'knob:brightness':function(v){bfState.c2=v;if(s3LastBrightness===null||Math.abs(v-s3LastBrightness)>=3){bfState.c2Moves++;s3LastBrightness=v;}bfRender();check();}});
  }
  function runS3Step11CondStig(){
    showBfScene();bfState.caX=0;bfState.caY=0;bfState.beamX=0;bfState.beamY=0;bfState.condX=4;bfState.condY=-3;bfState.c2=34;bfState.condLowSeen=false;bfState.condHighSeen=false;s3SetKnob('defstig-x',4);s3SetKnob('defstig-y',-3);s3SetKnob('brightness',34);bfRender();bfSetStatus('Select C.Stig mode.');s3Activate(['def-stig-mode']);
    function check(){if(Math.abs(bfState.condX)<=1&&Math.abs(bfState.condY)<=1&&bfState.condLowSeen&&bfState.condHighSeen){bfSetStatus('Beam remains circular through underfocus and overfocus.');s3AutoComplete(700);}}
    function begin(){bfSetStatus('Adjust COND STIG X/Y and vary C2 through under/overfocus.');s3Activate(['def-stig-pad','brightness']);s3SetHandlers({'defstig:x':function(v){bfState.condX=v;bfRender();check();},'defstig:y':function(v){bfState.condY=v;bfRender();check();},'knob:brightness':function(v){bfState.c2=v;if(v<=30)bfState.condLowSeen=true;if(v>=42)bfState.condHighSeen=true;bfRender();check();}});}
    s3SetHandlers({'action:def-stig-mode':function(btn){if(btn.dataset.value!=='condStig')return;s3SelectButton(btn);begin();}});
  }
  function runS3Step12BeamCenter(){
    showBfScene();bfState.caX=0;bfState.caY=0;bfState.condX=0;bfState.condY=0;bfState.beamX=5;bfState.beamY=-4;bfState.c2=42;s3SetKnob('defstig-x',5);s3SetKnob('defstig-y',-4);s3SetKnob('brightness',42);bfRender();bfSetStatus('Select Shift mode for beam centering.');s3Activate(['def-stig-mode']);
    function check(){if(Math.abs(bfState.beamX)<=1&&Math.abs(bfState.beamY)<=1&&bfState.c2>=60){bfSetStatus('Beam centered and spread to safe viewing intensity.');s3AutoComplete(700);}}
    function begin(){bfSetStatus('Center Beam Shift X/Y, then spread with C2/Intensity.');s3Activate(['def-stig-pad','brightness']);s3SetHandlers({'defstig:x':function(v){bfState.beamX=v;bfRender();check();},'defstig:y':function(v){bfState.beamY=v;bfRender();check();},'knob:brightness':function(v){bfState.c2=v;bfRender();check();}});}
    s3SetHandlers({'action:def-stig-mode':function(btn){if(btn.dataset.value!=='shift')return;s3SelectButton(btn);begin();}});
  }
  function runS3Step13ObjAperture(){
    showBfScene();bfState.mode='image';bfState.objX=4;bfState.objY=-3;s3SetPad('aperture-align',30,-22);bfRender();bfSetStatus('Switch briefly to DIFF mode.');s3Activate(['imaging-mode']);
    function toDiff(btn){if(btn.dataset.value!=='diff')return;s3SelectButton(btn);bfState.mode='diff';bfRender();bfSetStatus('Center the objective aperture ring on the direct 000 beam.');s3Activate(['aperture-align']);s3SetHandlers({'pad:aperture-align':align});}
    function align(pos){bfState.objX=pos.x/7.5;bfState.objY=pos.y/7.5;bfRender();if(Math.abs(bfState.objX)<=1&&Math.abs(bfState.objY)<=1){bfSetStatus('000 beam centered · switch back to IMAGE.');s3Activate(['imaging-mode']);s3SetHandlers({'action:imaging-mode':function(btn){if(btn.dataset.value==='diff')return;s3SelectButton(btn);bfState.mode='image';bfRender();bfSetStatus('Returned to TEM IMAGE mode.');s3AutoComplete(650);}});}}
    s3SetHandlers({'action:imaging-mode':toDiff});
  }
  function runS3Step14Focus(){
    showBfScene();bfState.mode='image';bfState.focusCoarse=8;bfState.focusFine=2;s3SetKnob('focus-coarse',8);s3SetKnob('focus-fine',2);bfRender();bfSetStatus('Use Coarse Focus to approach the Gaussian condition.');s3Activate(['focus-coarse']);
    s3SetHandlers({'knob:focus-coarse':function(v){bfState.focusCoarse=v;bfRender();if(Math.abs(v)<=2){bfSetStatus('Coarse focus close · use Fine Focus to minimize the Fresnel fringe.');s3Activate(['focus-fine']);s3SetHandlers({'knob:focus-fine':function(f){bfState.focusFine=f;bfRender();if(Math.abs(bfState.focusCoarse+bfState.focusFine)<=.5){bfSetStatus('Gaussian focus reached · Fresnel fringe minimized.');s3AutoComplete(700);}}});}}});
  }
  function runS3Step15FinalCheck(){
    showBfScene();bfState.finalFocusChecked=false;bfState.finalAstigChecked=false;bfState.focusFine=2;bfState.condX=3;bfState.condY=-2;s3SetKnob('focus-fine',2);s3SetKnob('defstig-x',3);s3SetKnob('defstig-y',-2);bfSetStatus('Select the final imaging magnification.');s3Activate(['magnification']);
    function astigCheck(){if(Math.abs(bfState.condX)<=1&&Math.abs(bfState.condY)<=1){bfState.finalAstigChecked=true;bfSetStatus('Final magnification, focus and astigmatism verified.');s3AutoComplete(700);}}
    s3SetHandlers({'action:magnification':function(btn){if(btn.dataset.value!=='very-high'&&btn.dataset.value!=='high')return;s3SelectButton(btn);bfState.mag=btn.dataset.value==='very-high'?150000:100000;bfRender();bfSetStatus('Final magnification selected · re-check Fine Focus.');s3Activate(['focus-fine']);s3SetHandlers({'knob:focus-fine':function(v){bfState.focusFine=v;bfRender();if(Math.abs(v)<=.5){bfState.finalFocusChecked=true;bfSetStatus('Focus re-checked · select O.Stig mode.');s3Activate(['def-stig-mode']);s3SetHandlers({'action:def-stig-mode':function(mb){if(mb.dataset.value!=='objStig')return;s3SelectButton(mb);bfSetStatus('O.Stig selected · center X/Y for final astigmatism check.');s3Activate(['def-stig-x']);s3SetHandlers({'defstig:x':function(x){bfState.condX=x;bfRender();astigCheck();},'defstig:y':function(y){bfState.condY=y;bfRender();astigCheck();}});}});}}});}});
  }
  /* Step 49 may preview on Viewing Screen; Step 50 is iTEM camera-only.
     Focus changes must be examined in the actual camera acquisition workspace. */
  var s3CameraFocusDrawToken=0;
  function ensureS3FocusViewport(){
    if(!viewScreen)return null;
    var panel=document.getElementById('s3ItemFocusViewport');
    if(!panel){
      panel=document.createElement('div');panel.id='s3ItemFocusViewport';
      panel.className='s3-item-focus-viewport';
      panel.innerHTML='<canvas id="s3ItemFocusViewportCanvas" width="640" height="480" aria-label="Simulated TEM camera specimen focus preview"></canvas>'
        +'<div class="s3-item-focus-viewport__top">OLYMPUS iTEM · CAMERA PREVIEW</div>'
        +'<div class="s3-item-focus-viewport__caption" id="s3ItemViewportCondition">CAMERA LIVE · specimen visible</div>';
      viewScreen.appendChild(panel);
    }
    panel.hidden=false;
    if(viewEmpty)viewEmpty.style.display='none';
    return panel;
  }
  function hideS3FocusViewport(){
    s3CameraFocusDrawToken++;
    var panel=document.getElementById('s3ItemFocusViewport');
    if(panel)panel.hidden=true;
  }
  function showS3CameraSignal(){
    var live=document.getElementById('pc-cam-live');
    if(live)live.classList.add('is-active');
    var placeholder=document.getElementById('pc-cam-placeholder');
    if(placeholder)placeholder.style.display='none';
    var led=document.getElementById('pc-cam-comm-led');if(led)led.classList.add('is-on');
    var stateCell=document.getElementById('pc-cam-camera-state');if(stateCell)stateCell.textContent='Active · iTEM';
    var screenCell=document.getElementById('pc-cam-screen-state');if(screenCell)screenCell.textContent='Raised';
    var imageStatus=document.getElementById('pc-cam-image-state');if(imageStatus)imageStatus.textContent='Specimen image · 16-bit';
    var file=document.getElementById('pc-cam-file-name');if(file)file.textContent='Live TEM · Bright Field / Specimen 01';
    var message=document.getElementById('pc-cam-message');if(message)message.textContent='OLYMPUS iTEM · CCD acquisition connected';
  }
  function mirrorS3CameraToScreen(source,caption){
    // Intentionally disabled: the acquisition/focus image lives in iTEM only.
    // Keep this compatibility hook inert so no Viewing Screen overlay flashes.
  }
  function drawBfCameraFrame(key,extraBlur,label,onReady){
    var cv=document.getElementById('pc-cam-canvas');if(!cv)return;
    var ctx=cv.getContext('2d'),img=new Image();
    img.onload=function(){
      var cw=cv.width,ch=cv.height,scale=Math.min(cw/img.width,ch/img.height),dw=img.width*scale,dh=img.height*scale,dx=(cw-dw)/2,dy=(ch-dh)/2;
      ctx.save();ctx.clearRect(0,0,cw,ch);ctx.fillStyle='#050505';ctx.fillRect(0,0,cw,ch);
      var blur=Math.max(0,Number(extraBlur||0));ctx.filter='grayscale(1) contrast('+(bfState.autoUsed?'1.34':'1.18')+')'+(blur>0?' blur('+blur.toFixed(2)+'px)':'');
      ctx.drawImage(img,dx,dy,dw,dh);ctx.filter='none';
      ctx.fillStyle='rgba(255,255,255,.86)';ctx.font='15px sans-serif';ctx.fillText(label||('BF · '+Number(bfState.mag||60000).toLocaleString()+'×'),14,24);ctx.restore();
      showS3CameraSignal();
      if(typeof onReady==='function')onReady(cv);
    };
    img.src=BF_SPECIMEN_IMAGES[key]||BF_SPECIMEN_IMAGES.acquire;
    showS3CameraSignal();
    var fn=document.getElementById('pc-cam-file-name');if(fn)fn.textContent='Live View — Real TEM sample';
    var ov=document.getElementById('pc-cam-overlay-mag');if(ov)ov.textContent='MAG '+s3FormatMag(bfState.mag||60000);
  }
  function drawBfCameraFocusPreview(){
    var signed=Number(bfState.focusCoarse||0)+Number(bfState.focusFine||0);
    var absF=Math.abs(signed);
    var key='cameraLiveC'; // Compare one field of nanoparticles throughout the focus sweep.
    var blur=Math.min(2.4,absF*.08);
    /* Draw base frame first, then overlay Fresnel fringe simulation */
    var cv=document.getElementById('pc-cam-canvas');if(!cv)return;
    var ctx=cv.getContext('2d'),img=new Image(),drawToken=++s3CameraFocusDrawToken;
    img.onload=function(){
      if(drawToken!==s3CameraFocusDrawToken)return;
      var cw=cv.width,ch=cv.height,scale=Math.min(cw/img.width,ch/img.height),dw=img.width*scale,dh=img.height*scale,dx=(cw-dw)/2,dy=(ch-dh)/2;
      ctx.save();ctx.clearRect(0,0,cw,ch);ctx.fillStyle='#050505';ctx.fillRect(0,0,cw,ch);
      var baseContrast=bfState.autoUsed?1.34:1.18;
      /* Minimum contrast at true focus: smooth carbon film, no rim.
         Underfocus emphasizes carbon texture; overfocus inverts rim contrast. */
      var contrastMod=absF<=1.5?-.29:(signed<0?Math.min(.22,absF*.016):-.04);
      var focusBlur=absF<=1.5?.75:blur;
      ctx.filter='grayscale(1) contrast('+(baseContrast+contrastMod).toFixed(2)+')'+(focusBlur>0?' blur('+focusBlur.toFixed(2)+'px)':'');
      ctx.drawImage(img,dx,dy,dw,dh);ctx.filter='none';
      /* A simulated Fresnel halo follows dark specimen boundaries, not the
         rectangular camera-window border. Light exterior halos indicate
         negative focus offset; positive offsets invert the same rims. */
      if(absF>2){
        var rim=ctx.getImageData(0,0,cw,ch),pixels=rim.data;
        var lum=new Uint8Array(cw*ch);
        for(var i=0;i<lum.length;i++){
          var j=i*4;lum[i]=(pixels[j]*.299+pixels[j+1]*.587+pixels[j+2]*.114)|0;
        }
        var strength=Math.min(1,absF/12),radius=3;
        var x0=Math.max(4,Math.ceil(dx)+4),x1=Math.min(cw-4,Math.floor(dx+dw)-4);
        var y0=Math.max(4,Math.ceil(dy)+4),y1=Math.min(ch-4,Math.floor(dy+dh)-4);
        for(var y=y0;y<y1;y++)for(var x=x0;x<x1;x++){
          var pos=y*cw+x,light=lum[pos];
          var nearDark=Math.min(lum[pos-radius],lum[pos+radius],lum[pos-radius*cw],lum[pos+radius*cw]);
          // Rim is on the brighter, exterior side of a dark particle edge.
          var jump=light-nearDark;
          if(jump<18)continue;
          var mix=Math.min(.66,(jump-18)/105*.8)*strength;
          var rgb=pos*4,goal=signed<0?255:0;
          pixels[rgb]+=((goal-pixels[rgb])*mix)|0;
          pixels[rgb+1]+=((goal-pixels[rgb+1])*mix)|0;
          pixels[rgb+2]+=((goal-pixels[rgb+2])*mix)|0;
        }
        ctx.putImageData(rim,0,0);
      }
      /* Header label */
      ctx.fillStyle='rgba(255,255,255,.86)';ctx.font='15px sans-serif';
      ctx.fillText('LIVE BF · OBJ FOCUS',14,24);
      /* Focus condition indicator */
      var condText,condColor,condNote;
      if(absF<=1.5){condText='IN FOCUS';condColor='#4ade80';condNote='Smooth carbon background · minimum contrast · no fringe';}
      else if(signed<0){condText='UNDERFOCUS';condColor='#60a5fa';condNote='White fringe outside nanoparticles · textured carbon';}
      else{condText='OVERFOCUS';condColor='#f59e0b';condNote='Dark outer nanoparticle fringe · avoid for sizing';}
      ctx.font='bold 13px sans-serif';ctx.fillStyle=condColor;
      ctx.fillText('\u25CF  '+condText,14,ch-16);
      ctx.font='11px sans-serif';ctx.fillStyle='rgba(255,255,255,.65)';
      ctx.fillText(condNote,14,ch-34);
      ctx.restore();
      showS3CameraSignal(); // Step 50: do not mirror focus conditions to Viewing Screen.
    };
    img.onerror=function(){var msg=document.getElementById('pc-cam-message');if(msg)msg.textContent='Camera image failed to load';};
    img.src=BF_SPECIMEN_IMAGES[key]||BF_SPECIMEN_IMAGES.acquire;
    showS3CameraSignal();
  }
  function startBfCameraLive(){
    var frames=['cameraLiveA','cameraLiveB','cameraLiveC','finalSharp'],i=0;
    drawBfCameraFrame(frames[0],.18,'LIVE BF · real sample');
    var t=setInterval(function(){i=(i+1)%frames.length;drawBfCameraFrame(frames[i],.10,'LIVE BF · real sample');},620);
    bfTimers.push(t);return t;
  }
  function drawCapturedBf(onReady){drawBfCameraFrame('finalSharp',0,'BF SNAPSHOT · real sample',onReady);}
  function downloadCapturedBf(canvas){
    if(!canvas)return false;
    try{
      var link=document.createElement('a');
      var time=new Date().toISOString().replace(/[:.]/g,'-');
      link.download='TEM_Bright_Field_Snapshot_'+time+'.png';
      link.href=canvas.toDataURL('image/png');
      document.body.appendChild(link);link.click();link.remove();
      var note=document.getElementById('pc-cam-message');
      if(note)note.textContent='Olympus iTEM · Bright Field snapshot downloaded';
      return true;
    }catch(e){
      var warn=document.getElementById('pc-cam-message');
      if(warn)warn.textContent='Snapshot captured. Browser blocked automatic download.';
      return false;
    }
  }
  function installItemPanel(){
    var host=document.querySelector('.camera-palette--acquisition .camera-palette__body');if(!host)return;var old=document.getElementById('sopItemPanel');if(old)old.remove();var p=document.createElement('div');p.id='sopItemPanel';p.className='sop-item-panel';p.innerHTML='<div class="sop-bf-card-title">iTEM acquisition</div><button id="s3ObjFocusCheck">OBJ FOCUS check (optional)</button><button id="s3Video">Video</button><button id="s3Snapshot" disabled>Snapshot</button><button id="s3F1Down" disabled>F1 · Return fluorescent screen</button>';host.appendChild(p);
    var objCheck=document.getElementById('s3ObjFocusCheck'),video=document.getElementById('s3Video'),snap=document.getElementById('s3Snapshot'),f1=document.getElementById('s3F1Down');if(objCheck)objCheck.onclick=function(){ensureAudio();objCheck.classList.add('is-done');objCheck.textContent='OBJ FOCUS checked';};video.onclick=function(){ensureAudio();video.classList.add('is-done');video.textContent='Video · LIVE';snap.disabled=false;var ls=document.getElementById('pc-cam-live-state');if(ls)ls.textContent='Running';};snap.onclick=function(){ensureAudio();snap.classList.add('is-done');snap.disabled=true;drawCapturedBf();bfState.captured=true;var s=document.getElementById('pc-cam-image-state');if(s)s.textContent='Snapshot captured';f1.disabled=false;};f1.onclick=function(){ensureAudio();f1.classList.add('is-done');f1.disabled=true;var s=document.getElementById('pc-cam-screen-state');if(s)s.textContent='Down';bfSetStatus('Bright Field image recorded · fluorescent screen returned.');s3AutoComplete(900,function(){clearS3PcPanel();closePcDrawer();});};
  }
  function runS3Step16Acquire(){
    showBfScene();bfState.captured=false;bfSetStatus('Click the Viewing Screen to select the area of interest.');s3Activate([]);if(!bfScreen)return;bfScreen.classList.add('is-roi-select');
    bfScreen.onclick=function(){ensureAudio();bfScreen.onclick=null;bfScreen.classList.remove('is-roi-select');bfSetStatus('Area selected · spread the beam with C2 / Intensity.');s3SetKnob('brightness',45);bfState.c2=45;s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v>=65){s3LockControls();bfSetStatus('Beam spread · continue the acquisition sequence in the PC drawer.');openPcDrawer();selectTemconPage('standard');var host=document.querySelector('.temcon-group--hv')||document.querySelector('[data-temcon-page="standard"]');addS3PcPanel(host,'Bright Field · Camera exposure','<div class="sop-s3-pc-note">AUTO contrast is optional. Press F1 to raise the fluorescent screen, then open iTEM.</div><div class="sop-s3-pc-buttons"><button id="s3Auto">AUTO contrast (optional)</button><button id="s3F1Up">F1 · Raise screen</button><button id="s3OpenItem" disabled>Open iTEM</button></div>');var auto=document.getElementById('s3Auto'),f1=document.getElementById('s3F1Up'),item=document.getElementById('s3OpenItem');auto.onclick=function(){ensureAudio();auto.classList.add('is-done');auto.disabled=true;};f1.onclick=function(){ensureAudio();f1.classList.add('is-done');f1.disabled=true;item.disabled=false;};item.onclick=function(){ensureAudio();clearS3PcPanel();openCameraDrawer();var cs=document.getElementById('pc-cam-screen-state');if(cs)cs.textContent='Raised';var cc=document.getElementById('pc-cam-camera-state');if(cc)cc.textContent='Inserted';var ph=document.getElementById('pc-cam-placeholder');if(ph)ph.style.display='none';installItemPanel();};}}});};bfRender();
  }


  /* =====================================================================
     SECTION 3 — MANUAL-DRIVEN BRIGHT FIELD WORKFLOW (fresh v4.7 build)
     Uses the existing simulator-style L1/R1 panels with actual control names.
     Routine steps auto-advance when the required control state is reached.
     ===================================================================== */
  var BF_MAG_VALUES=[1000,3000,5000,8000,20000,40000,60000,80000,100000];
  /* v4.9.1-RS1 — real Bright Field specimen image bank supplied by the user.
     The uploaded images are treated as Bright Field source material only. */
  var BF_SPECIMEN_IMAGES={
    grid200:       '../assets/images/sop/real-sample/Tv2.png',
    grid500:       '../assets/images/sop/real-sample/Tv1.png',
    surveyEmpty:   '../assets/images/sop/real-sample/Tv3.png',
    surveyEdge:    '../assets/images/sop/real-sample/Tv4.png',
    surveyThin:    '../assets/images/sop/real-sample/Tv5.png',
    mag50Edge:     '../assets/images/sop/real-sample/Tv6.png',
    mag50Region:   '../assets/images/sop/real-sample/Tv7.png',
    finalSharp:    '../assets/images/sop/real-sample/Tv8.png',
    cameraLiveA:   '../assets/images/sop/real-sample/Tv9.png',
    cameraLiveB:   '../assets/images/sop/real-sample/Tv10.png',
    autoContrast:  '../assets/images/sop/real-sample/Tv11.png',
    cameraLiveC:   '../assets/images/sop/real-sample/Tv12.png',
    acquire:       '../assets/images/sop/real-sample/Tv12.png',
    fallback:      '../assets/images/sop/real-sample/Tv5.png'
  };
  var bfCurrentImgKey='';
  var bfRealPreloaded=false;
  function bfPreloadRealImages(){
    if(bfRealPreloaded)return;bfRealPreloaded=true;
    Object.keys(BF_SPECIMEN_IMAGES).forEach(function(k){var im=new Image();im.src=BF_SPECIMEN_IMAGES[k];});
  }
  function bfSetSpecimenImage(key){
    if(!bfSpecimen||bfCurrentImgKey===key)return;
    var src=BF_SPECIMEN_IMAGES[key]||BF_SPECIMEN_IMAGES.fallback;
    bfCurrentImgKey=key;
    bfSpecimen.src=src;
    bfSpecimen.dataset.realSample=key;
  }
  /* Resolve the most appropriate real image for the current BF action.
     Stage-search steps intentionally move through empty -> edge -> thin-region
     fields so the trackball feels like navigation through the same specimen. */
  function bfResolveImageKey(){
    var n=state.currentStep+1+(state.currentStep>=4?1:0)+(state.currentStep>=22?1:0);
    var dist=Math.hypot(Number(bfState.stageX||0),Number(bfState.stageY||0));
    if(n<=9) return 'grid200';
    if(n===10||n===11) return 'grid200';
    if(n===12) return 'grid500';
    if(n===13){
      if(dist>72)return 'surveyEmpty';
      if(dist>28)return 'surveyEdge';
      return 'surveyThin';
    }
    if(n>=14&&n<=17) return 'surveyThin';
    if(n===18) return Number(bfState.mag||0)>=20000?'mag50Edge':'surveyThin';
    if(n>=19&&n<=20) return 'mag50Edge';
    if(n===21){
      if(dist>28)return 'mag50Edge';
      return 'mag50Region';
    }
    if(n>=22&&n<=44) return 'mag50Region';
    if(n===45) return dist>28?'mag50Edge':'mag50Region';
    if(n===46) return Number(bfState.mag||0)>=60000?'finalSharp':'mag50Region';
    if(n===47) return 'finalSharp';
    if(n===48) return bfState.autoUsed?'autoContrast':'finalSharp';
    if(n===49) return bfState.autoUsed?'autoContrast':'finalSharp';
    if(n===50) return 'cameraLiveA';
    if(n===51) return 'cameraLiveB';
    if(n===52) return 'autoContrast';
    if(n===53) return 'acquire';
    if(n>=54) return 'acquire';
    return 'surveyThin';
  }
  var bfCover=null,bfScreenAction=null,bfDummyBadge=null,bfStepIndicator=null;

  function resetBfState(){
    bfState={
      mag:8000,magIndex:3,magMode:'',beamOn:false,coverOpen:false,
      featureX:72,featureY:67,stageX:0,stageY:0,z:-6,zSensitivity:1,wobble:false,wobbleAxis:'',
      spot:2,alpha:2,spotMoved:false,alphaMoved:false,
      c2:55,beamX:7,beamY:-6,caX:0,caY:0,condX:5,condY:-4,condStigOn:false,
      focusCoarse:0,focusFine:0,captured:false,screenRaised:false,autoUsed:false,
      htTarget:80,htStep:1,htTime:1,htRamped:false,htOn:false,filamentOn:false,beamCurrent:0,v2Open:false,
      temMode:false,apertureSelected:false,finalMagTouched:false,itemOpen:false,videoOn:false
    };
  }

  function s3FormatMag(v){
    if(v>=1000)return 'X'+(v/1000).toFixed(v%1000?1:0)+'k';
    return 'X'+v;
  }

  function ensureBfScene(){
    if(bfScene||!viewScreen)return;
    var w=document.createElement('div');w.id='sopBfScene';w.className='sop-bf-scene sop-bf-scene--screen';w.hidden=true;
    w.innerHTML='<div class="sop-bf-screen" id="sopBfScreen">'
      +'<img class="sop-bf-specimen" id="sopBfSpecimen" src="../assets/images/sop/real-sample/Tv5.png" alt="Real Bright Field specimen view">'
      +'<div class="sop-bf-step-indicator" id="sopBfStepIndicator"></div>'+'<div class="sop-dummy-badge" id="sopBfDummyBadge">REAL SAMPLE IMAGE</div>'
      +'<div class="sop-bf-feature" id="sopBfFeature"><span></span></div>'
      +'<div class="sop-bf-beam" id="sopBfBeam"></div>'
      +'<div class="sop-bf-fringe" id="sopBfFringe"></div>'
      +'<div class="sop-bf-crosshair"><i></i><b></b></div>'
      +'<div class="sop-bf-cover" id="sopBfCover"><span>SCREEN COVER</span></div>'
      +'<button class="sop-bf-screen-action" id="sopBfScreenAction" type="button" hidden>Remove screen cover</button>'
      +'<div class="sop-bf-status" id="sopBfStatus"></div>'
      +'</div>';
    viewScreen.appendChild(w);
    bfScene=w;bfScreen=document.getElementById('sopBfScreen');bfSpecimen=document.getElementById('sopBfSpecimen');
    bfBeam=document.getElementById('sopBfBeam');bfFeature=document.getElementById('sopBfFeature');bfFringe=document.getElementById('sopBfFringe');
    bfStatus=document.getElementById('sopBfStatus');bfCover=document.getElementById('sopBfCover');bfScreenAction=document.getElementById('sopBfScreenAction');bfDummyBadge=document.getElementById('sopBfDummyBadge');bfStepIndicator=document.getElementById('sopBfStepIndicator');
  }

  function bfRender(){
    if(!bfScene)return;
    var focus=Math.abs((bfState.focusCoarse||0)+(bfState.focusFine||0));
    var zDefocus=Math.abs(Number(bfState.z||0));
    var phosphor=false; /* v4.8.10: grayscale specimen view; no phosphor overlay */
    var magScale=1+Math.max(0,Math.log10(Math.max(1000,bfState.mag)/1000))*.16;
    var stageTx=Math.max(-18,Math.min(18,Number(bfState.stageX||0)*-.12));
    var stageTy=Math.max(-18,Math.min(18,Number(bfState.stageY||0)*.12));
    if(bfSpecimen){
      bfSpecimen.style.setProperty('--bf-scale',magScale.toFixed(3));
      bfSpecimen.style.setProperty('--bf-stage-x',stageTx.toFixed(2)+'%');
      bfSpecimen.style.setProperty('--bf-stage-y',stageTy.toFixed(2)+'%');
      bfSpecimen.style.setProperty('--bf-wobble',Math.min(16,zDefocus*1.8).toFixed(1)+'px');
      bfSpecimen.classList.toggle('is-wobbling',!!bfState.wobble);
      bfSpecimen.classList.toggle('is-wobble-x',!!bfState.wobble&&String(bfState.wobbleAxis||'x').toLowerCase()==='x');
      bfSpecimen.classList.toggle('is-wobble-y',!!bfState.wobble&&String(bfState.wobbleAxis||'x').toLowerCase()==='y');
      bfSpecimen.style.transform='translate('+stageTx.toFixed(2)+'%,'+stageTy.toFixed(2)+'%) scale('+magScale.toFixed(3)+')';
      var blur=Math.min(5.5,focus*.30+zDefocus*.12);
      var contrast=1.15+(bfState.autoUsed?.26:0)+Math.max(0,3-zDefocus)*.035;
      var isCamera=(state.currentStep>=50);
      var bright=phosphor?(isCamera?.92:.14):1;
      var specOpacity=(bfState.beamOn&&bfState.coverOpen)?(phosphor?(isCamera?.90:.62):'0.92'):'0.08';
      bfSpecimen.style.filter='grayscale(1) brightness('+bright.toFixed(2)+') contrast('+contrast.toFixed(2)+') blur('+blur.toFixed(2)+'px)';
      bfSpecimen.style.opacity=specOpacity;
      /* v4.8.9 — swap specimen image on magnification/step change */
      var wantKey=bfResolveImageKey();
      if(wantKey!==bfCurrentImgKey)bfSetSpecimenImage(wantKey);
      /* Toggle camera class for acquisition steps */
      if(bfScene)bfScene.classList.toggle('is-camera',isCamera&&phosphor);
    }
    if(bfCover){bfCover.classList.toggle('is-open',!!bfState.coverOpen);}
    if(bfFeature){
      bfFeature.style.left=bfState.featureX+'%';bfFeature.style.top=bfState.featureY+'%';
      bfFeature.style.setProperty('--wobble',Math.min(22,zDefocus*2.0)+'px');
      bfFeature.classList.toggle('is-wobbling',!!bfState.wobble);
      bfFeature.style.opacity=(bfState.beamOn&&bfState.coverOpen)?'1':'0';
    }
    var size=Math.max(8,Math.min(94,Number(bfState.c2||55)));
    var ellipticity=(Math.abs(bfState.condX||0)+Math.abs(bfState.condY||0))*3.5;
    var beamH=Math.max(8,size-ellipticity);
    if(bfBeam){
      bfBeam.style.width=size+'%';bfBeam.style.height=beamH+'%';
      bfBeam.style.left=(50+(bfState.beamX||0)+(bfState.caX||0))+'%';bfBeam.style.top=(50+(bfState.beamY||0)+(bfState.caY||0))+'%';
      bfBeam.style.transform='translate(-50%,-50%) rotate('+((bfState.condX||0)*6)+'deg)';
      bfBeam.style.opacity=bfState.beamOn?'0.88':'0';
      bfBeam.style.setProperty('--beam-roundness',(Math.max(18,100-ellipticity*1.4))+'%');
    }
    if(bfFringe){
      bfFringe.style.opacity=(bfState.beamOn&&bfState.coverOpen)?Math.min(.92,(focus+zDefocus*.25)/7).toFixed(2):'0';
      bfFringe.style.borderWidth=(3+Math.min(8,focus*.5))+'px';
    }
    if(bfScreen){
      var spot=Number(bfState.spot||2),alpha=Number(bfState.alpha||2);
      bfScreen.style.setProperty('--bf-screen-glow',(0.16+Math.max(0,4-spot)*.035+alpha*.012).toFixed(2));
    }
    var ind=document.getElementById('ind-mag');if(ind)ind.textContent=Number(bfState.mag||0).toLocaleString()+'×';
    var mr=document.getElementById('mag-caml-readout');if(mr)mr.textContent=s3FormatMag(bfState.mag||8000);
    var mode=document.getElementById('mag-mode-readout');if(mode)mode.textContent=(bfState.magMode||'—').toUpperCase();updateBfDummyCue();syncPcLiveStatus();
  }

  function bfSetStatus(text){if(bfStatus){bfStatus.textContent='';bfStatus.style.display='none';}}

  function showBfScene(){
    hideS3BeamScreenStill();closeModal(true);closePcDrawer();hideViewportScene();hideSection1Tour();ensureBfScene();clearBfTimers();
    if(!bfScene)return;bfScene.hidden=false;if(viewEmpty)viewEmpty.style.display='none';setViewer('screen');
    var phosphor=false; /* v4.8.10: grayscale specimen view; no phosphor overlay */
    bfScene.classList.remove('is-phosphor','is-fluorescent');
    bfState.coverOpen=true;
    var imgKey=bfResolveImageKey();
    bfSetSpecimenImage(imgKey);
    bfScene.classList.toggle('is-camera',state.currentStep>=50);
    if(bfDummyBadge)bfDummyBadge.style.display='none';
    bfRender();syncPcLiveStatus();
  }

  function hideBfScene(){
    ensureBfScene();clearBfTimers();clearPhysicalFocus();s3LockControls();if(!bfScene)return;bfScene.hidden=true;if(viewEmpty)viewEmpty.style.display='';if(bfScreen)bfScreen.onclick=null;if(bfScreenAction){bfScreenAction.onclick=null;bfScreenAction.hidden=true;}
  }

  function s3SetScreenAction(label,fn){
    ensureBfScene();if(!bfScreenAction)return;bfScreenAction.textContent=label;bfScreenAction.hidden=false;bfScreenAction.onclick=function(){ensureAudio();bfScreenAction.hidden=true;bfScreenAction.onclick=null;if(fn)fn();};
  }

  function s3SetMagIndex(idx){
    idx=Math.max(0,Math.min(BF_MAG_VALUES.length-1,Math.round(idx)));bfState.magIndex=idx;bfState.mag=BF_MAG_VALUES[idx];
    var h=s3KnobHandles['mag-caml'];if(h)h.value=idx;bfRender();
  }

  function initS3PanelInteractions(){
    if(s3PanelInit)return;s3PanelInit=true;if(!(window.TEM&&TEM.controlsUI))return;
    [].slice.call(document.querySelectorAll('[data-action]')).forEach(function(btn){
      btn.addEventListener('click',function(){
        if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=btn.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;
        var fn=s3Handlers['action:'+btn.dataset.action];if(fn)fn(btn);
      });
    });
    var knobNames=['brightness','focus-coarse','focus-fine','spot-size','alpha-selector','shift-x','shift-y','mag-caml'];
    knobNames.forEach(function(name){
      var el=document.querySelector('[data-knob="'+name+'"]');if(!el)return;
      var min=Number(el.dataset.min||0),max=Number(el.dataset.max||100),step=Number(el.dataset.step||0),value=Number(el.dataset.value||0);
      var fmt=null;
      if(name==='alpha-selector')fmt=function(v){return 'α'+Math.round(v);};
      if(name==='mag-caml')fmt=function(v){return s3FormatMag(BF_MAG_VALUES[Math.round(v)]||8000);};
      s3KnobHandles[name]=TEM.controlsUI.bindKnob(el,{min:min,max:max,step:step,value:value,format:fmt||undefined,onChange:function(v){
        if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;
        var fn=s3Handlers['knob:'+name];if(fn)fn(v);
      }});
    });
    [].slice.call(document.querySelectorAll('[data-defstig-axis]')).forEach(function(el){
      var axis=el.dataset.defstigAxis,min=Number(el.dataset.min||-50),max=Number(el.dataset.max||50);
      s3KnobHandles['defstig-'+axis]=TEM.controlsUI.bindKnob(el,{min:min,max:max,value:0,onChange:function(v){
        if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['defstig:'+axis];if(fn)fn(v);
      }});
    });
    ['stage-xy','aperture-align'].forEach(function(name){var el=document.querySelector('[data-trackpad="'+name+'"]');if(!el)return;var rr=(el.dataset.range||'-50,50').split(',').map(Number);s3PadHandles[name]=TEM.controlsUI.bindTrackpad(el,{rangeX:[rr[0],rr[1]],rangeY:[rr[0],rr[1]],valueX:0,valueY:0,onChange:function(pos){if(state.currentSection!==3&&state.currentSection!==4)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['pad:'+name];if(fn)fn(pos);}});});
  }

  function s3ResetPcControls(){
    ['pc-autoht-target','pc-autoht-step','pc-autoht-time','pc-autoht-start','ht-on-btn','pc-filament-on','pc-filament-off'].forEach(function(id){var e=document.getElementById(id);if(e){e.disabled=true;e.classList.remove('sop-ht-next');e.onchange=null;e.onclick=null;}});
    var p=document.getElementById('sopS3PcPanel');if(p)p.remove();removeS3InlineProgress();
  }

  var s3ApertureOverlay=null,s3ApKnob1Pos=0,s3ApHandles={};

  function hideS3ApertureOverlay(){
    if(s3ApertureOverlay)s3ApertureOverlay.hidden=true;
  }

  function ensureS3ApertureOverlay(){
    if(s3ApertureOverlay||!viewerStage)return;
    var w=document.createElement('div');
    w.id='s3ApertureOverlay';w.className='sop-aperture-overlay';w.hidden=true;
    w.innerHTML='<div class="sop-aperture-card">'
      +'<div class="sop-aperture-card__head"><strong>Condenser Aperture Assembly</strong><span>Dummy hardware control</span></div>'
      +'<div class="sop-aperture-card__body">'
      +'<div class="sop-aperture-select"><button id="s3ApKnob1" class="sop-aperture-selector" type="button"><span class="sop-aperture-selector__dial"></span><b>Knob 1</b><small id="s3ApKnob1Read">OPEN</small></button><p>Click-stops</p></div>'
      +'<div class="sop-aperture-axis"><div class="knob" id="s3CaXKnob"><div class="knob__ring"></div><div class="knob__arc"></div><div class="knob__body"></div><div class="knob__value">6</div></div><b>CA X</b></div>'
      +'<div class="sop-aperture-axis"><div class="knob" id="s3CaYKnob"><div class="knob__ring"></div><div class="knob__arc"></div><div class="knob__body"></div><div class="knob__value">-6</div></div><b>CA Y</b></div>'
      +'</div><div class="sop-aperture-card__note" id="s3ApNote">Condenser-aperture hardware reference will be replaced when the actual image is supplied.</div></div>';
    viewerStage.appendChild(w);s3ApertureOverlay=w;
    if(window.TEM&&TEM.controlsUI){
      var x=document.getElementById('s3CaXKnob'),y=document.getElementById('s3CaYKnob');
      s3ApHandles.x=TEM.controlsUI.bindKnob(x,{min:-10,max:10,value:6,onChange:function(v){if(state.currentSection!==3||s3ApertureOverlay.hidden)return;var fn=s3Handlers['ap:ca-x'];if(fn)fn(v);}});
      s3ApHandles.y=TEM.controlsUI.bindKnob(y,{min:-10,max:10,value:-6,onChange:function(v){if(state.currentSection!==3||s3ApertureOverlay.hidden)return;var fn=s3Handlers['ap:ca-y'];if(fn)fn(v);}});
    }
  }

  function showS3ApertureOverlay(mode){
    ensureS3ApertureOverlay();if(!s3ApertureOverlay)return;s3ApertureOverlay.hidden=false;s3ApertureOverlay.setAttribute('data-mode',mode||'');
    [].slice.call(s3ApertureOverlay.querySelectorAll('.is-target')).forEach(function(e){e.classList.remove('is-target');});
    if(mode==='select')document.getElementById('s3ApKnob1').classList.add('is-target');
    if(mode==='x')document.getElementById('s3CaXKnob').classList.add('is-target');
    if(mode==='y')document.getElementById('s3CaYKnob').classList.add('is-target');
  }

  function s3SetApKnob(axis,v){if(s3ApHandles[axis])s3ApHandles[axis].value=v;}

  function s3PreparePcStandard(){hideBfScene();hideS3ApertureOverlay();setViewer('column');openPcDrawer();selectTemconPage('standard');s3ResetPcControls();}
  function s3PreparePcStage(){hideBfScene();hideS3ApertureOverlay();setViewer('column');openPcDrawer();selectTemconPage('stage');s3ResetPcControls();}
  function s3PcTarget(el){if(!el)return;el.disabled=false;el.classList.add('sop-ht-next');setTimeout(function(){try{el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});}catch(_){ }try{el.focus({preventScroll:true});}catch(e){}},70);}
  function s3PcDone(el){if(!el)return;el.classList.remove('sop-ht-next');el.disabled=true;}
  function s3Complete(delay,before){syncPcLiveStatus();s3AutoComplete(delay||450,before);}

  function showSection3(){
    var displayedStep=state.currentStep+1;
    if(displayedStep>4&&displayedStep!==8)releaseS3HtPhoto();
    // Previously optional Step 23 (Z sensitivity) is removed. Preserve the
    // physical atomic operations after it by mapping to their original slots.
    var legacyStep=displayedStep>=23?displayedStep+1:displayedStep;
    // Steps 5–7 retain the revised V2 -> Filament -> Beam Current order.
    var n=legacyStep===5?8:(legacyStep===6?6:(legacyStep===7?7:(legacyStep>7?legacyStep+1:legacyStep)));
    s3StepCompleting=false;hideViewportScene();hideSection1Tour();clearS3PcPanel();s3LockControls();bfPreloadRealImages();
    /* One HT ON step was removed; downstream physical operations keep the original atomic mappings. */
    if(n<28||n>30)hideS3ApertureOverlay();
    switch(n){
      case 1:return runBFAtomic01();case 2:return runBFAtomic02();case 3:return runBFAtomic03();case 4:return runBFAtomic04();
      case 6:return runBFAtomic06();case 7:return runBFAtomic07();case 8:return runBFAtomic08();case 9:return runBFAtomic09();case 10:return runBFAtomic11();
      case 11:return runBFAtomic12();case 12:return runBFAtomic13();case 13:return runBFAtomic14();case 14:return runBFAtomic15();case 15:return runBFAtomic16();
      case 16:return runBFAtomic17();case 17:return runBFAtomic18();case 18:return runBFAtomic19();case 19:return runBFAtomic20();case 20:return runBFAtomic21();
      case 21:return runBFAtomic22();case 22:return runBFAtomic23();case 23:return runBFAtomic24();case 24:return runBFAtomic25();case 25:return runBFAtomic26();
      case 26:return runBFAtomic27();case 27:return runBFAtomic28();case 28:return runBFAtomic29();case 29:return runBFAtomic30();case 30:return runBFAtomic31();
      case 31:return runBFAtomic32();case 32:return runBFAtomic33();case 33:return runBFAtomic34();case 34:return runBFAtomic35();case 35:return runBFAtomic36();
      case 36:return runBFAtomic37();case 37:return runBFAtomic38();case 38:return runBFAtomic39();case 39:return runBFAtomic40();case 40:return runBFAtomic41();
      case 41:return runBFAtomic42();case 42:return runBFAtomic43();case 43:return runBFAtomic44();case 44:return runBFAtomic45();case 45:return runBFAtomic46();
      case 46:return runBFAtomic47();case 47:return runBFAtomic48();case 48:return runBFAtomic49();case 49:return runBFAtomic50();case 50:return runBFAtomic51();
      case 51:return runBFAtomic52();case 52:return runBFAtomic53();case 53:return runBFAtomic54();case 54:return runBFAtomic55();
    }
  }

  function ensureS3InlineProgress(kind,label){
    var id='s3-inline-progress-'+kind,old=document.getElementById(id);if(old)old.remove();
    var host=kind==='ht'?document.getElementById('pc-autoht-panel'):document.querySelector('.temcon-group--hv');if(!host)return null;
    var box=document.createElement('div');box.id=id;box.className='s3-inline-progress s3-inline-progress--'+kind;
    box.innerHTML='<div class="s3-inline-progress__head"><span>'+label+'</span><strong id="'+id+'-pct">0%</strong></div><div class="s3-inline-progress__track"><span id="'+id+'-bar"></span></div>';
    if(kind==='ht')host.insertAdjacentElement('afterend',box);else host.appendChild(box);
    try{box.scrollIntoView({behavior:'smooth',block:'center'});}catch(_){ }
    return {box:box,bar:document.getElementById(id+'-bar'),pct:document.getElementById(id+'-pct')};
  }
  function removeS3InlineProgress(){[].slice.call(document.querySelectorAll('.s3-inline-progress')).forEach(function(e){e.remove();});}

  /* Section 3: image-based High Voltage Control used in the same TEMCON frame as Section 2.
     Only the live readouts/selectors are HTML controls, so the reference image stays intact. */
  var s3HtPhotoSource='../assets/images/sop/section3-high-voltage-control.png';
  var s3HtRampTimer=null,s3V2ModalTimer=null,s3V2ReadyForConfirm=false,s3FilamentTimer=null;
  function s3HtReadoutTime(){
    var target=Number(bfState.htTarget||80),step=Number(bfState.htStep||1),time=Number(bfState.htTime||1);
    return Math.max(0,(target-80)/step*time);
  }
  function s3HtPhotoNode(id){return document.getElementById(id);}
  function s3HtUpdateTime(fraction){
    var finish=s3HtPhotoNode('s3PhotoFinish');
    var nativeFinish=s3HtPhotoNode('pc-autoht-finish');
    var seconds=s3HtReadoutTime()*(1-(fraction||0));
    var display='Time to finish '+(seconds/60).toFixed(1)+' min.';
    if(finish)finish.textContent=display;
    if(nativeFinish)nativeFinish.textContent=display;
    return display;
  }
  function s3HtUpdateProgress(fraction){
    var progress=s3HtPhotoNode('s3PhotoProgress'),pct=s3HtPhotoNode('s3PhotoProgressPct');
    if(progress)progress.style.width=(Math.max(0,Math.min(1,fraction))*100).toFixed(1)+'%';
    if(pct)pct.textContent=Math.round(fraction*100)+'%';
    s3HtUpdateTime(fraction);
  }
  function ensureS3HtPhoto(showValve){
    hideBfScene();hideS3ApertureOverlay();setViewer('column');
    openPcDrawer();selectTemconPage('standard');s3ResetPcControls();
    var page=document.querySelector('[data-temcon-page="standard"]');
    var hv=ensureStep4HvReplica(),valve=showValve?ensureStep4Valve():document.getElementById('sopStep4Valve');
    if(!page||!hv||(showValve&&!valve))return null;
    page.classList.add('sop-step4-layout','sop-s3-ht-photo-layout');
    page.classList.toggle('sop-s3-ht-no-valve',!showValve);
    page.classList.toggle('sop-s3-v2-layout',!!showValve);
    hv.hidden=false;if(valve)valve.hidden=!showValve;
    var otherValve=document.getElementById('sopSection2Step6Valve');if(otherValve)otherValve.hidden=true;
    var img=hv.querySelector('img.sop-step4-window-image');
    if(img){if(!img.dataset.originalSource)img.dataset.originalSource=img.getAttribute('src');img.src=s3HtPhotoSource;img.alt='High Voltage Control, Auto HT ramp with Target, Step, Time/Step, Start and progress';}
    var valveImg=valve&&valve.querySelector('img.sop-step4-window-image--valve');
    if(valveImg&&showValve){if(!valveImg.dataset.originalSource)valveImg.dataset.originalSource=valveImg.getAttribute('src');valveImg.src='../assets/images/sop/section3-step7-valve-v2-open.png';valveImg.alt='Actual Valve Status showing V2 open and vacuum Ready';}
    var hotspot=s3HtPhotoNode('sopStep4HtOnHotspot');if(hotspot){hotspot.hidden=true;hotspot.disabled=true;}
    var wrap=hv.querySelector('.sop-step4-window-image-wrap');if(!wrap)return null;
    var ui=s3HtPhotoNode('s3HtPhotoUi');
    if(!ui){
      ui=document.createElement('div');ui.id='s3HtPhotoUi';ui.className='s3-ht-photo-ui';
      ui.innerHTML=`
        <span class="s3-ht-photo__kv" id="s3PhotoKv">80.00</span>
        <span class="s3-ht-photo__beam" id="s3PhotoBeam">40.5</span>
        <div class="s3-ht-photo__progress" aria-label="Auto HT progress"><span id="s3PhotoProgress"></span></div>
        <output class="s3-ht-photo__finish" id="s3PhotoFinish">Time to finish 0.0 min.</output>
        <select class="s3-ht-photo__select s3-ht-photo__target" id="s3PhotoTarget" aria-label="Auto HT target voltage">
          <option value="80">80.00</option><option value="120">120.00</option><option value="160">160.00</option><option value="200">200.00</option>
        </select>
        <select class="s3-ht-photo__select s3-ht-photo__step" id="s3PhotoStep" aria-label="Auto HT step size in kilovolts">
          <option value="1">1.0</option><option value="0.5">0.5</option><option value="0.1">0.1</option>
        </select>
        <select class="s3-ht-photo__select s3-ht-photo__time" id="s3PhotoTime" aria-label="Auto HT time per step in seconds">
          <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="10">10</option>
        </select>
        <button type="button" class="s3-ht-photo__start" id="s3PhotoStart" aria-label="Start Auto HT ramp" disabled></button>
        <span class="s3-ht-photo__progress-percent" id="s3PhotoProgressPct" aria-live="polite"></span>
        <span class="s3-ht-photo__filament-state" id="s3PhotoFilamentState" hidden>NotReady</span>
        <button type="button" class="s3-ht-photo__filament-on" id="s3PhotoFilamentOn" aria-label="Switch filament ON" hidden></button>
      `;
      wrap.appendChild(ui);
    }
    ui.hidden=false;
    var filOn=s3HtPhotoNode('s3PhotoFilamentOn');if(filOn){filOn.hidden=true;filOn.onclick=null;filOn.disabled=true;filOn.classList.remove('is-active');}
    var filStatusPhoto=s3HtPhotoNode('s3PhotoFilamentState');if(filStatusPhoto){filStatusPhoto.hidden=true;filStatusPhoto.textContent=bfState.filamentOn?'ON':'NotReady';}
    var sels=[['s3PhotoTarget','htTarget'],['s3PhotoStep','htStep'],['s3PhotoTime','htTime']];
    sels.forEach(function(pair){var el=s3HtPhotoNode(pair[0]);if(el){el.value=String(bfState[pair[1]]||1);el.onchange=null;}});
    var start=s3HtPhotoNode('s3PhotoStart');if(start){start.disabled=true;start.onclick=null;}
    var topHt=s3HtPhotoNode('pc-ht-lamp'),topBeam=s3HtPhotoNode('pc-beam-lamp');
    if(topHt){topHt.classList.add('is-on');topHt.innerHTML='<strong>HT</strong>';}
    if(topBeam){topBeam.classList.remove('is-on');topBeam.innerHTML='Beam<br><strong>NotReady</strong>';}
    var htStatus=s3HtPhotoNode('pc-ht-status');if(htStatus)htStatus.textContent='ON';
    var acc=s3HtPhotoNode('pc-acc-value');if(acc)acc.textContent=(bfState.htRamped?'200.00':'80.00')+' kV';
    var topBeamCurrent=s3HtPhotoNode('pc-beam-current-top');
    var readCurrent=bfState.filamentOn?Number(bfState.beamCurrent||43.2):43.2;
    if(topBeamCurrent)topBeamCurrent.textContent=readCurrent.toFixed(1)+' µA';
    var hvCurrent=s3HtPhotoNode('pc-beam-current-hv');if(hvCurrent)hvCurrent.textContent=readCurrent.toFixed(1)+' µA';
    bfState.htOn=true; // physically enabled in Section 1, before this voltage ramp
    var kv=s3HtPhotoNode('s3PhotoKv');if(kv)kv.textContent=bfState.htRamped?'200.00':'80.00';
    var beam=s3HtPhotoNode('s3PhotoBeam');if(beam)beam.textContent=readCurrent.toFixed(1);
    var htv=s3HtPhotoNode('pc-ht-value');if(htv)htv.textContent=(bfState.htRamped?'200.00':'80.00')+' kV';
    s3HtUpdateProgress(bfState.htRamped?1:0);
    return {page:page,ui:ui,wrap:wrap};
  }
  function releaseS3HtPhoto(){
    if(s3HtRampTimer){clearInterval(s3HtRampTimer);s3HtRampTimer=null;}
    if(s3FilamentTimer){clearInterval(s3FilamentTimer);s3FilamentTimer=null;}
    var popup=document.getElementById('s3FilamentProgressPopup');if(popup)popup.hidden=true;
    var page=document.querySelector('[data-temcon-page="standard"]');
    if(s3V2ModalTimer){clearTimeout(s3V2ModalTimer);s3V2ModalTimer=null;}
    s3V2ReadyForConfirm=false;
    if(page)page.classList.remove('sop-s3-ht-photo-layout','sop-step4-layout','sop-s3-ht-no-valve','sop-s3-v2-layout','sop-s3-ramp-running','sop-s3-filament-photo-layout');
    var overlay=s3HtPhotoNode('s3HtPhotoUi');if(overlay)overlay.hidden=true;
    var ht=s3HtPhotoNode('sopStep4HvReplica');
    if(ht){var im=ht.querySelector('img.sop-step4-window-image');if(im&&im.dataset.originalSource)im.src=im.dataset.originalSource;ht.hidden=true;}
    var valve=s3HtPhotoNode('sopStep4Valve');if(valve){var vi=valve.querySelector('img.sop-step4-window-image--valve');if(vi&&vi.dataset.originalSource)vi.src=vi.dataset.originalSource;valve.hidden=true;}
    var hotspot=s3HtPhotoNode('sopStep4HtOnHotspot');if(hotspot){hotspot.hidden=false;hotspot.disabled=false;}
  }
  function s3HtSetActive(name){
    ['s3PhotoTarget','s3PhotoStep','s3PhotoTime'].forEach(function(id){
      var e=s3HtPhotoNode(id);if(!e)return;e.disabled=(id!==name);e.classList.toggle('is-active',id===name);
    });
  }

  function runBFAtomic01(){
    if(!ensureS3HtPhoto())return;
    s3HtSetActive('s3PhotoTarget');
    var sel=s3HtPhotoNode('s3PhotoTarget');sel.onchange=function(){
      bfState.htTarget=Number(sel.value);s3HtUpdateTime(0);
      if(bfState.htTarget===200){sel.disabled=true;sel.classList.remove('is-active');s3Complete(500);}
    };
  }
  function runBFAtomic02(){
    if(!ensureS3HtPhoto())return;
    s3HtSetActive('s3PhotoStep');
    var sel=s3HtPhotoNode('s3PhotoStep');sel.onchange=function(){
      bfState.htStep=Number(sel.value);s3HtUpdateTime(0);
      if(bfState.htStep===0.5){sel.disabled=true;sel.classList.remove('is-active');s3Complete(500);}
    };
  }
  function runBFAtomic03(){
    if(!ensureS3HtPhoto())return;
    s3HtSetActive('s3PhotoTime');
    var sel=s3HtPhotoNode('s3PhotoTime');sel.onchange=function(){
      bfState.htTime=Number(sel.value);s3HtUpdateTime(0);
      if(bfState.htTime===10){sel.disabled=true;sel.classList.remove('is-active');s3Complete(500);}
    };
  }
  function runBFAtomic04(){
    if(!ensureS3HtPhoto())return;
    s3HtSetActive('');
    var start=s3HtPhotoNode('s3PhotoStart');if(!start)return;
    bfState.htTarget=200;bfState.htStep=0.5;bfState.htTime=10;
    ['s3PhotoTarget','s3PhotoStep','s3PhotoTime'].forEach(function(id){var el=s3HtPhotoNode(id);if(el)el.disabled=true;});
    start.disabled=false;start.classList.add('is-active');
    s3HtUpdateProgress(0);
    start.onclick=function(){
      if(start.disabled)return;
      ensureAudio();start.disabled=true;start.classList.remove('is-active');
      var page=document.querySelector('[data-temcon-page="standard"]');
      if(page)page.classList.add('sop-s3-ramp-running');
      var htStatus=s3HtPhotoNode('pc-ht-status');if(htStatus)htStatus.textContent='ON · RAMPING';
      var duration=12000,t0=Date.now();
      if(s3HtRampTimer)clearInterval(s3HtRampTimer);
      s3HtRampTimer=setInterval(function(){
        if(state.currentSection!==3||state.currentStep!==3){clearInterval(s3HtRampTimer);s3HtRampTimer=null;return;}
        var fraction=Math.min(1,(Date.now()-t0)/duration);
        var kv=Math.round((80+120*fraction)*10)/10;
        var ua=40.5+(kv-80)*0.0225; // actual photo sequence: ~43 µA at end of HT ramp
        var displayKv=kv.toFixed(2)+' kV';
        var topAcc=s3HtPhotoNode('pc-acc-value');if(topAcc)topAcc.textContent=displayKv;
        var nativeKv=s3HtPhotoNode('pc-ht-value');if(nativeKv)nativeKv.textContent=displayKv;
        var imgKv=s3HtPhotoNode('s3PhotoKv');if(imgKv)imgKv.textContent=kv.toFixed(2);
        var imgUa=s3HtPhotoNode('s3PhotoBeam');if(imgUa)imgUa.textContent=ua.toFixed(1);
        var topUa=s3HtPhotoNode('pc-beam-current-top');if(topUa)topUa.textContent=ua.toFixed(1)+' µA';
        var nativeUa=s3HtPhotoNode('pc-beam-current-hv');if(nativeUa)nativeUa.textContent=ua.toFixed(1)+' µA';
        s3HtUpdateProgress(fraction);
        if(fraction>=1){
          clearInterval(s3HtRampTimer);s3HtRampTimer=null;
          bfState.htRamped=true;bfState.htOn=true;bfState.beamCurrent=43.2;
          if(page)page.classList.remove('sop-s3-ramp-running');
          if(htStatus)htStatus.textContent='ON';
          s3HtUpdateProgress(1);
          s3Complete(1100);
        }
      },100);
    };
  }
  function prepareS3FilamentPhoto(showValve){
    var result=ensureS3HtPhoto(!!showValve);
    if(!result)return null;
    result.page.classList.add('sop-s3-filament-photo-layout');
    var nativeFil=document.getElementById('pc-fil-status');if(nativeFil)nativeFil.textContent=bfState.filamentOn?'ON':'NotReady';
    var photoFil=document.getElementById('s3PhotoFilamentState');if(photoFil){photoFil.hidden=false;photoFil.textContent=bfState.filamentOn?'ON':'NotReady';}
    return result;
  }
  function s3SetPhotoBeamCurrent(ua){
    var n=Math.min(103,Math.max(0,ua));bfState.beamCurrent=n;
    var val=n.toFixed(1),units=val+' µA';
    var photo=document.getElementById('s3PhotoBeam');if(photo)photo.textContent=val;
    var top=document.getElementById('pc-beam-current-top');if(top)top.textContent=units;
    var native=document.getElementById('pc-beam-current-hv');if(native)native.textContent=units;
  }
  function ensureS3FilamentProgressPopup(){
    var valve=document.getElementById('sopStep4Valve');
    var host=valve&&valve.querySelector('.sop-step4-window-image-wrap--valve');
    if(!host)return null;
    var popup=document.getElementById('s3FilamentProgressPopup');
    if(!popup){
      popup=document.createElement('div');
      popup.id='s3FilamentProgressPopup';
      popup.className='s3-filament-progress-popup';
      popup.hidden=true;
      popup.setAttribute('role','status');
      popup.setAttribute('aria-label','Filament setting progress');
      popup.innerHTML='<div class="s3-filament-progress-popup__title">Filament</div>'
        +'<div class="s3-filament-progress-popup__body"><span>Setting the Filament...</span>'
        +'<div class="s3-filament-progress-popup__track" aria-hidden="true"><span id="s3FilamentProgressBar"></span></div>'
        +'<strong id="s3FilamentProgressPercent">0%</strong>'
        +'<button type="button" id="s3FilamentCancel" aria-label="Cancel filament setting">Cancel</button></div>';
      host.appendChild(popup);
    }
    popup.hidden=false;
    var bar=document.getElementById('s3FilamentProgressBar');if(bar)bar.style.width='0%';
    var read=document.getElementById('s3FilamentProgressPercent');if(read)read.textContent='0%';
    var cancel=document.getElementById('s3FilamentCancel');if(cancel){cancel.disabled=false;cancel.textContent='Cancel';}
    return popup;
  }
  function runBFAtomic06(){
    // Section 3 Step 6: filament ON, with the reference-style popup on top of Valve Status.
    var result=prepareS3FilamentPhoto(true);
    if(!result)return;
    var on=document.getElementById('s3PhotoFilamentOn');
    if(!on)return;
    var valve=document.getElementById('sopStep4Valve');if(valve)valve.hidden=false;
    s3SetPhotoBeamCurrent(43.2);
    var nativeFil=document.getElementById('pc-fil-status');if(nativeFil)nativeFil.textContent='NotReady';
    var photoFil=document.getElementById('s3PhotoFilamentState');if(photoFil)photoFil.textContent='NotReady';
    bfState.filamentOn=false;
    on.hidden=false;on.disabled=false;on.classList.add('is-active');
    on.onclick=function(){
      if(on.disabled)return;
      ensureAudio();on.disabled=true;on.classList.remove('is-active');
      var popup=ensureS3FilamentProgressPopup();
      if(!popup){on.disabled=false;on.classList.add('is-active');return;}
      var bar=document.getElementById('s3FilamentProgressBar');
      var read=document.getElementById('s3FilamentProgressPercent');
      var cancel=document.getElementById('s3FilamentCancel');
      var duration=6500,t0=Date.now();
      var stopped=false;
      if(s3FilamentTimer)clearInterval(s3FilamentTimer);
      if(cancel)cancel.onclick=function(){
        if(stopped)return;stopped=true;
        if(s3FilamentTimer){clearInterval(s3FilamentTimer);s3FilamentTimer=null;}
        popup.hidden=true;on.disabled=false;on.classList.add('is-active');
        bfState.filamentOn=false;s3SetPhotoBeamCurrent(43.2);
        if(nativeFil)nativeFil.textContent='NotReady';
        if(photoFil)photoFil.textContent='NotReady';
      };
      s3FilamentTimer=setInterval(function(){
        if(state.currentSection!==3||state.currentStep!==5){clearInterval(s3FilamentTimer);s3FilamentTimer=null;return;}
        if(stopped)return;
        var fraction=Math.min(1,(Date.now()-t0)/duration),pct=Math.round(fraction*100);
        if(bar)bar.style.width=pct+'%';
        if(read)read.textContent=pct+'%';
        // The beam-current readout changes only AFTER filament setting is complete.
        if(fraction>=1){
          clearInterval(s3FilamentTimer);s3FilamentTimer=null;stopped=true;
          bfState.filamentOn=true;
          if(nativeFil)nativeFil.textContent='ON';
          if(photoFil)photoFil.textContent='ON';
          s3SetPhotoBeamCurrent(103);
          if(cancel){cancel.disabled=true;cancel.textContent='Complete';}
          s3Complete(900);
        }
      },100);
    };
  }
  var s3BeamCurrentReadyForConfirm=false;
  function showS3BeamCurrentConfirmation(){
    if(state.currentSection!==3||state.currentStep!==6||!s3BeamCurrentReadyForConfirm||stepTransitionPending)return;
    openModal({locked:false,tag:'SECTION 3 · FILAMENT STATUS',title:'Confirm filament and beam current',step:'Step 7',
      body:'<p class="sop-flow-modal__copy">Observe the TEMCON High Voltage Control window. Verify that the <strong>Filament status</strong> is <strong>ON</strong> and the <strong>Beam Current</strong> has stabilized at <strong>103 µA</strong>.</p>',
      footer:'<button type="button" class="sop-flow-btn sop-flow-btn--success" id="s3ConfirmBeamCurrent">Confirm 103 µA beam current</button>'});
    var btn=document.getElementById('s3ConfirmBeamCurrent');
    if(btn)btn.onclick=function(){
      if(btn.disabled||stepTransitionPending)return;
      ensureAudio();btn.disabled=true;s3BeamCurrentReadyForConfirm=false;
      closeModal(true);s3Complete(650);
    };
  }
  function runBFAtomic07(){
    // Step 7: learners must confirm the stabilized 103 µA beam current before moving on.
    s3BeamCurrentReadyForConfirm=false;
    if(!prepareS3FilamentPhoto(true))return;
    var on=document.getElementById('s3PhotoFilamentOn');if(on){on.hidden=true;on.disabled=true;on.onclick=null;}
    var popup=document.getElementById('s3FilamentProgressPopup');if(popup)popup.hidden=true;
    bfState.filamentOn=true;
    var nativeFil=document.getElementById('pc-fil-status');if(nativeFil)nativeFil.textContent='ON';
    var photoFil=document.getElementById('s3PhotoFilamentState');if(photoFil)photoFil.textContent='ON';
    s3SetPhotoBeamCurrent(103);
    var t=setTimeout(function(){
      if(state.currentSection!==3||state.currentStep!==6||stepTransitionPending)return;
      s3BeamCurrentReadyForConfirm=true;
      showS3BeamCurrentConfirmation();
    },2100);
    bfTimers.push(t);
  }
  function showS3V2VerificationModal(){
    if(state.currentSection!==3||state.currentStep!==4||!s3V2ReadyForConfirm)return;
    openModal({locked:false,tag:'SECTION 3 · VALVE STATUS',title:'Verify valve V2 is OPEN',step:'Step 5',
      body:'<p class="sop-flow-modal__copy">Observe the <strong>Valve Status</strong> window beside High Voltage Control. Confirm that the <strong>V2 isolation valve</strong> is <strong>OPEN</strong> (green indicator) and the chamber vacuum shows <strong>Evac Ready</strong>.</p>',
      footer:'<button type="button" class="sop-flow-btn sop-flow-btn--success" id="s3ConfirmV2">Confirm V2 OPEN</button>'});
    var btn=document.getElementById('s3ConfirmV2');
    if(btn)btn.onclick=function(){
      if(btn.disabled)return;
      ensureAudio();btn.disabled=true;bfState.v2Open=true;
      closeModal(true);s3Complete(550);
    };
  }
  function runBFAtomic08(){
    if(!ensureS3HtPhoto(true))return;
    var page=document.querySelector('[data-temcon-page="standard"]');
    if(page)page.classList.remove('sop-s3-filament-photo-layout');
    // V2 verification occurs BEFORE filament activation: retain NotReady / 43.2 µA.
    bfState.filamentOn=false;
    var photoFil=document.getElementById('s3PhotoFilamentState');if(photoFil){photoFil.hidden=false;photoFil.textContent='NotReady';}
    s3SetPhotoBeamCurrent(43.2);
    var fil=document.getElementById('pc-fil-status');if(fil)fil.textContent='NotReady';
    var on=document.getElementById('s3PhotoFilamentOn');if(on){on.hidden=true;on.disabled=true;}
    s3V2ReadyForConfirm=false;
    if(s3V2ModalTimer)clearTimeout(s3V2ModalTimer);
    s3V2ModalTimer=setTimeout(function(){
      s3V2ModalTimer=null;
      if(state.currentSection!==3||state.currentStep!==4)return;
      s3V2ReadyForConfirm=true;
      showS3V2VerificationModal();
    },6000);
  }
  // Section 3 Step 8 — BEAM ON, TEMCON indication, column zoom and two green-screen references.
  function hideS3BeamScreenStill(){
    var still=document.getElementById('s3BeamScreenStill');
    if(still){still.classList.remove('is-visible');still.hidden=true;}
  }
  function showS3BeamScreenStill(){
    if(!viewScreen)return;
    var still=document.getElementById('s3BeamScreenStill');
    if(!still){
      still=document.createElement('img');
      still.id='s3BeamScreenStill';
      still.className='sop-s3-beam-screen-still';
      still.alt='Fluorescent viewing screen glowing green after BEAM ON';
      still.src='../assets/images/sop/section3-step8-neon-screen.png';
      still.hidden=true;
      viewScreen.appendChild(still);
    }
    still.hidden=false;
    if(viewEmpty)viewEmpty.style.display='none';
    void still.offsetWidth;
    still.classList.add('is-visible');
  }
  function runS3BeamIlluminationSequence(){
    if(state.currentSection!==3||state.currentStep!==7)return;
    // The existing full-column photograph zooms toward the fluorescent screen first.
    hideBfScene();setViewer('column');
    showViewportScene({
      baseSrc:'../assets/images/sop/column-viewport-real.png',
      focusSrc:'../assets/images/sop/section3-step8-emerald-control-station.png',
      sceneClass:'is-s3-beam-glow-sequence'
    });
    if(!viewportScene)return;
    if(viewportStep4Img1){
      viewportStep4Img1.src='../assets/images/sop/section3-step8-emerald-control-station.png';
      viewportStep4Img1.alt='TEM control station with a green illuminated viewing screen';
    }
    if(viewportStep4Img2){
      viewportStep4Img2.src='../assets/images/sop/section3-step8-neon-screen.png';
      viewportStep4Img2.alt='Close view of the luminous green phosphor screen';
    }
    function stage(delay,phase,action){
      sceneTimers.push(setTimeout(function(){
        if(state.currentSection!==3||state.currentStep!==7||!viewportScene||viewportScene.hidden)return;
        viewportScene.setAttribute('data-s3-beam-phase',phase);
        if(typeof action==='function')action();
      },delay));
    }
    stage(100,'zoom');
    stage(4300,'first');
    stage(7600,'second');
    stage(10800,'screen',function(){
      /* v4.9.27: go directly to the grayscale specimen instead of
         the neon-screen still photo.  showBfScene() calls
         setViewer('screen') and hideViewportScene() internally.
         Completion is folded in here because hideViewportScene sets
         viewportScene.hidden=true, which would block any later
         stage callback's guard check. */
      bfState.coverOpen=true;
      showBfScene();
      s3Complete(1200);
    });
  }
  function runBFAtomic09(){
    hideS3BeamScreenStill();hideS3ApertureOverlay();
    // Reopen the same 200 kV / 103 µA HT + V2 Valve TEMCON presentation seen at Step 7.
    if(!prepareS3FilamentPhoto(true))return;
    var filOn=s3HtPhotoNode('s3PhotoFilamentOn');
    if(filOn){filOn.hidden=true;filOn.disabled=true;filOn.onclick=null;}
    var popup=document.getElementById('s3FilamentProgressPopup');if(popup)popup.hidden=true;
    var filState=s3HtPhotoNode('s3PhotoFilamentState');
    if(filState){filState.hidden=false;filState.textContent='ON';}
    var nativeFil=s3HtPhotoNode('pc-fil-status');if(nativeFil)nativeFil.textContent='ON';
    bfState.filamentOn=true;
    s3SetPhotoBeamCurrent(103);
    bfState.beamOn=false;
    var beamLamp=s3HtPhotoNode('pc-beam-lamp');
    if(beamLamp){beamLamp.classList.remove('is-on','sop-s3-beam-powered');beamLamp.innerHTML='Beam<br><strong>NotReady</strong>';}
    bfSetStatus('Press BEAM ON on L1. Observe green TEMCON status and the screen zoom.');
    s3Activate(['beam-on']);
    var pressed=false;
    s3SetHandlers({'action:beam-toggle':function(btn){
      if(pressed||state.currentSection!==3||state.currentStep!==7)return;
      pressed=true;ensureAudio();s3SelectButton(btn);
      s3SetHandlers({});s3Activate([]);
      bfState.beamOn=true;
      if(beamLamp){beamLamp.classList.add('is-on','sop-s3-beam-powered');beamLamp.innerHTML='Beam<br><strong>Ready</strong>';}
      bfSetStatus('BEAM ON · TEMCON status is green. Observe the fluorescent screen.');
      var timer=setTimeout(function(){
        if(state.currentSection!==3||state.currentStep!==7)return;
        closePcDrawer();
        runS3BeamIlluminationSequence();
      },1750);
      bfTimers.push(timer);
    }});
  }
  function runBFAtomic10(){showBfScene();setBfFluorescentMode(true);bfState.beamOn=true;bfState.coverOpen=false;bfRender();bfSetStatus('Remove the screen cover.');s3Activate([]);s3SetScreenAction('Remove screen cover',function(){bfState.coverOpen=true;bfRender();s3Complete(350);});}
  function runBFAtomic11(){showBfScene();bfState.coverOpen=true;bfRender();bfSetStatus('Select TEM imaging mode on L1.');s3Activate(['probe-tem']);s3SetHandlers({'action:probe-mode':function(btn){if(btn.dataset.value!=='tem')return;s3SelectButton(btn);bfState.temMode=true;s3Complete(350);}});}
  function runBFAtomic12(){showBfScene();bfSetStatus('Select TEM imaging mode on L1.');s3Activate(['probe-tem']);s3SetHandlers({'action:probe-mode':function(btn){if(btn.dataset.value!=='tem')return;s3SelectButton(btn);bfState.temMode=true;s3Complete(350);}});}
  function runBFAtomic12(){showBfScene();bfSetStatus('Select LOW MAG on R1.');s3Activate(['mag-mode']);s3SetHandlers({'action:mag-mode':function(btn){if(btn.dataset.value!=='lowmag')return;s3SelectButton(btn);bfState.magMode='LOW MAG';bfRender();s3Complete(350);}});}
  function runBFAtomic13(){showBfScene();if(!bfState.magMode)bfState.magMode='LOW MAG';s3SetMagIndex(3);bfSetStatus('Rotate MAG/CAM L into the 1,000–5,000× survey range.');s3Activate(['mag-caml']);s3SetHandlers({'knob:mag-caml':function(v){var i=Math.round(v);bfState.magIndex=i;bfState.mag=BF_MAG_VALUES[i]||8000;bfRender();if(bfState.mag>=1000&&bfState.mag<=5000)s3Complete(450);}});}
  function runBFAtomic14(){showBfScene();bfState.featureX=72;bfState.featureY=68;bfState.stageX=70;bfState.stageY=-60;s3SetPad('stage-xy',70,-60);bfRender();bfSetStatus('Use the stage trackball to centre a hole or thin region.');s3Activate(['stage-xy']);s3SetHandlers({'pad:stage-xy':function(pos){bfState.stageX=pos.x;bfState.stageY=pos.y;bfState.featureX=50+pos.x*.30;bfState.featureY=50-pos.y*.30;bfRender();if(Math.abs(pos.x)<=10&&Math.abs(pos.y)<=10)s3Complete(450);}});}
  function runBFAtomic15(){showBfScene();bfSetStatus('Press STD FOCUS on R1.');s3Activate(['std-focus']);s3SetHandlers({'action:std-focus':function(btn){s3SelectButton(btn);bfState.focusCoarse=0;bfState.focusFine=0;bfRender();s3Complete(350);}});}
  function runBFAtomic16(){showBfScene();var start=Number((s3KnobHandles['spot-size']&&s3KnobHandles['spot-size'].value)||2);bfSetStatus('Set the desired SPOT SIZE.');s3Activate(['spot-size']);s3SetHandlers({'knob:spot-size':function(v){bfState.spot=Math.round(v);syncPcLiveStatus();if(Math.round(v)!==Math.round(start))s3Complete(400);}});}
  function runBFAtomic17(){showBfScene();var start=Number((s3KnobHandles['alpha-selector']&&s3KnobHandles['alpha-selector'].value)||2);bfSetStatus('Set the desired α SELECTOR.');s3Activate(['alpha-selector']);s3SetHandlers({'knob:alpha-selector':function(v){bfState.alpha=Math.round(v);syncPcLiveStatus();if(Math.round(v)!==Math.round(start))s3Complete(400);}});}
  function runBFAtomic18(){showBfScene();bfSetStatus('Select MAG 1 on R1.');s3Activate(['mag-mode']);s3SetHandlers({'action:mag-mode':function(btn){if(btn.dataset.value!=='mag1')return;s3SelectButton(btn);bfState.magMode='MAG 1';bfRender();s3Complete(350);}});}
  function runBFAtomic19(){showBfScene();bfSetStatus('Rotate MAG/CAM L to X40k.');s3Activate(['mag-caml']);s3SetHandlers({'knob:mag-caml':function(v){var i=Math.round(v);bfState.magIndex=i;bfState.mag=BF_MAG_VALUES[i]||8000;bfRender();if(bfState.mag===40000)s3Complete(450);}});}
  function runBFAtomic20(){showBfScene();bfState.c2=55;s3SetKnob('brightness',55);bfRender();bfSetStatus('Rotate BRIGHTNESS to the smallest crossover.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v<=22)s3Complete(450);}});}
  function runBFAtomic21(){showBfScene();bfSetStatus('Turn BRIGHTNESS clockwise to spread illumination over the screen.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v>=72)s3Complete(450);}});}
  function runBFAtomic22(){showBfScene();bfState.featureX=67;bfState.featureY=62;bfState.stageX=55;bfState.stageY=-40;s3SetPad('stage-xy',55,-40);bfRender();bfSetStatus('At MAG 1, centre a thin feature with the trackball.');s3Activate(['stage-xy']);s3SetHandlers({'pad:stage-xy':function(pos){bfState.stageX=pos.x;bfState.stageY=pos.y;bfState.featureX=50+pos.x*.28;bfState.featureY=50-pos.y*.28;bfRender();if(Math.abs(pos.x)<=9&&Math.abs(pos.y)<=9)s3Complete(400);}});}
  function runBFAtomic23(){showBfScene();bfSetStatus('Press STD FOCUS before Z correction.');s3Activate(['std-focus']);s3SetHandlers({'action:std-focus':function(btn){s3SelectButton(btn);bfState.focusCoarse=0;bfState.focusFine=0;s3Complete(350);}});}
  function runBFAtomic24(){showBfScene();bfState.z=-6;bfState.zSensitivity=1;bfRender();bfSetStatus('Use Z UP / Z DOWN to approach minimum contrast.');s3Activate(['stage-z']);s3SetHandlers({'action:stage-z':function(btn){bfState.z=Math.max(-12,Math.min(12,bfState.z+Number(btn.dataset.dir)*(bfState.zSensitivity||1)));bfRender();if(Math.abs(bfState.z)<=3)s3Complete(350);}});}
  function runBFAtomic25(){s3PreparePcStage();var host=document.querySelector('[data-temcon-page="stage"]');addS3PcPanel(host,'Z Control Sensitivity','<div class="sop-s3-pc-note">Optional: adjust sensitivity only if needed.</div><div class="sop-s3-pc-buttons"><button id="s3ZSensDown">◀ Finer</button><strong id="s3ZSensRead">Normal</strong><button id="s3ZSensUp">Coarser ▶</button></div>');var d=document.getElementById('s3ZSensDown'),u=document.getElementById('s3ZSensUp'),r=document.getElementById('s3ZSensRead');var timer=setTimeout(function(){s3Complete(100);},2400);bfTimers.push(timer);function set(v,label){bfState.zSensitivity=v;if(r)r.textContent=label;clearTimeout(timer);s3Complete(250);}if(d)d.onclick=function(){set(.5,'Fine');};if(u)u.onclick=function(){set(2,'Coarse');};}
  function runBFAtomic26(){showBfScene();bfState.wobble=false;bfState.wobbleAxis='';bfRender();bfSetStatus('Press MAG WOB X or MAG WOB Y.');s3Activate(['wobbler']);s3SetHandlers({'action:mag-wob':function(btn){bfState.wobble=true;bfState.wobbleAxis=btn.dataset.axis||'x';s3SelectButton(btn);bfRender();s3Complete(350);}});}
  function runBFAtomic27(){showBfScene();bfState.wobble=true;bfRender();bfSetStatus('Use Z UP / Z DOWN until lateral wobble is minimized.');s3Activate(['stage-z']);s3SetHandlers({'action:stage-z':function(btn){bfState.z=Math.max(-8,Math.min(8,bfState.z+Number(btn.dataset.dir)*(bfState.zSensitivity||1)));bfRender();if(Math.abs(bfState.z)<=1)s3Complete(350);}});}
  function runBFAtomic28(){showBfScene();bfState.wobble=true;bfRender();bfSetStatus('Press the same MAG WOB control again to switch wobble OFF.');s3Activate(['wobbler']);s3SetHandlers({'action:mag-wob':function(btn){var ax=btn.dataset.axis||'x';if(bfState.wobbleAxis&&ax!==bfState.wobbleAxis)return;bfState.wobble=false;btn.classList.remove('is-selected');bfRender();s3Complete(350);}});}
  function runBFAtomic29(){closePcDrawer();hideBfScene();hideSection1Tour();setViewer('column');showS3ApertureOverlay('select');s3ApKnob1Pos=0;var b=document.getElementById('s3ApKnob1'),r=document.getElementById('s3ApKnob1Read');if(!b)return;r.textContent='OPEN';b.onclick=function(){ensureAudio();s3ApKnob1Pos=(s3ApKnob1Pos+1)%3;r.textContent=s3ApKnob1Pos===0?'OPEN':(s3ApKnob1Pos===1?'SURVEY':'ROUTINE BF/DF');b.style.setProperty('--ap-rot',(s3ApKnob1Pos*60)+'deg');if(s3ApKnob1Pos===2){bfState.apertureSelected=true;b.onclick=null;s3Complete(450);}};}
  function runBFAtomic30(){closePcDrawer();hideBfScene();hideSection1Tour();setViewer('column');showS3ApertureOverlay('x');bfState.beamX=0;bfState.beamY=0;bfState.caX=6;bfState.caY=-6;s3SetApKnob('x',6);s3SetApKnob('y',-6);bfRender();bfSetStatus('Adjust CA X until the beam is horizontally centered.');s3SetHandlers({'ap:ca-x':function(v){bfState.caX=v;bfRender();if(Math.abs(v)<=1){dfState.astigX=0;s3SetKnob('defstig-x',0);dfRender();s3Complete(400);}}});}
  function runBFAtomic31(){closePcDrawer();hideBfScene();hideSection1Tour();setViewer('column');showS3ApertureOverlay('y');bfRender();bfSetStatus('Adjust CA Y until the beam is vertically centered.');s3SetHandlers({'ap:ca-y':function(v){bfState.caY=v;bfRender();if(Math.abs(v)<=1)s3Complete(250,function(){hideS3ApertureOverlay();});}});}
  function runBFAtomic32(){hideS3ApertureOverlay();showBfScene();bfState.caX=0;bfState.caY=0;bfState.c2=55;s3SetKnob('brightness',55);bfRender();var low=false,high=false;bfSetStatus('Vary BRIGHTNESS through contraction and expansion to verify symmetric centering.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;if(v<=30)low=true;if(v>=70)high=true;bfRender();if(low&&high)s3Complete(450);}});}
  function runBFAtomic33(){showBfScene();hideS3ApertureOverlay();bfState.c2=55;s3SetKnob('brightness',55);bfRender();bfSetStatus('Adjust BRIGHTNESS back to crossover.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v<=22)s3Complete(400);}});}
  function runBFAtomic34(){showBfScene();bfState.beamX=6;bfState.beamY=-5;s3SetKnob('shift-x',6);s3SetKnob('shift-y',-5);bfRender();bfSetStatus('Use SHIFT X to centre the crossover horizontally.');s3Activate(['shift-x']);s3SetHandlers({'knob:shift-x':function(v){bfState.beamX=v;bfRender();if(Math.abs(v)<=1){dfState.astigY=0;s3SetKnob('defstig-y',0);dfRender();s3Complete(400);}}});}
  function runBFAtomic35(){showBfScene();bfSetStatus('Use SHIFT Y to centre the crossover vertically.');s3Activate(['shift-y']);s3SetHandlers({'knob:shift-y':function(v){bfState.beamY=v;bfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runBFAtomic36(){showBfScene();bfState.beamX=0;bfState.beamY=0;bfSetStatus('Spread the beam with BRIGHTNESS.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v>=72)s3Complete(400,function(){bfState.beamX=3;bfState.beamY=-3;});}});}
  function runBFAtomic37(){showBfScene();s3SetKnob('shift-x',3);bfRender();bfSetStatus('Fine-correct horizontal drift with SHIFT X.');s3Activate(['shift-x']);s3SetHandlers({'knob:shift-x':function(v){bfState.beamX=v;bfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runBFAtomic38(){showBfScene();s3SetKnob('shift-y',-3);bfRender();bfSetStatus('Fine-correct vertical drift with SHIFT Y.');s3Activate(['shift-y']);s3SetHandlers({'knob:shift-y':function(v){bfState.beamY=v;bfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runBFAtomic39(){showBfScene();s3SetKnob('spot-size',2);bfState.spot=2;bfSetStatus('Set SPOT SIZE to 1.');s3Activate(['spot-size']);s3SetHandlers({'knob:spot-size':function(v){bfState.spot=Math.round(v);if(bfState.spot===1)s3Complete(400);}});}
  function runBFAtomic40(){showBfScene();bfState.condStigOn=false;bfSetStatus('Press COND STIG on L1.');s3Activate(['def-stig-mode']);s3SetHandlers({'action:def-stig-mode':function(btn){if(btn.dataset.value!=='condStig')return;s3SelectButton(btn);bfState.condStigOn=true;s3Complete(350);}});}
  function runBFAtomic41(){showBfScene();bfState.condX=5;bfState.condY=-4;bfState.c2=55;s3SetKnob('brightness',55);s3SetKnob('defstig-x',5);s3SetKnob('defstig-y',-4);bfRender();var low=false,high=false;bfSetStatus('Rotate BRIGHTNESS clockwise and anticlockwise through crossover to inspect beam shape.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;if(v<=35)low=true;if(v>=65)high=true;bfRender();if(low&&high){
    /* v4.8.9: auto-correct beam — make ellipse circular on completion */
    bfState.condX=0;bfState.condY=0;s3SetKnob('defstig-x',0);s3SetKnob('defstig-y',0);bfRender();s3Complete(100);}}});}
  function runBFAtomic42(){showBfScene();bfSetStatus('Adjust DEF/STIG X to reduce ellipticity.');s3Activate(['def-stig-x']);s3SetHandlers({'defstig:x':function(v){bfState.condX=v;bfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runBFAtomic43(){showBfScene();bfSetStatus('Adjust DEF/STIG Y to make the beam circular.');s3Activate(['def-stig-y']);s3SetHandlers({'defstig:y':function(v){bfState.condY=v;bfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runBFAtomic44(){showBfScene();bfState.condX=0;bfState.condY=0;bfState.c2=55;s3SetKnob('brightness',55);bfRender();var low=false,high=false;bfSetStatus('Verify the circular beam by moving BRIGHTNESS back and forth.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;if(v<=30)low=true;if(v>=70)high=true;bfRender();if(low&&high)s3Complete(450);}});}
  function runBFAtomic45(){showBfScene();bfSetStatus('Press COND STIG again to exit adjustment.');s3Activate(['def-stig-mode']);s3SetHandlers({'action:def-stig-mode':function(btn){if(btn.dataset.value!=='condStig')return;bfState.condStigOn=false;btn.classList.remove('is-selected');s3Complete(350);}});}
  function runBFAtomic46(){showBfScene();bfState.featureX=66;bfState.featureY=63;bfState.stageX=54;bfState.stageY=-43;s3SetPad('stage-xy',54,-43);bfRender();bfSetStatus('Use the stage trackball to centre the final area of interest.');s3Activate(['stage-xy']);s3SetHandlers({'pad:stage-xy':function(pos){bfState.stageX=pos.x;bfState.stageY=pos.y;bfState.featureX=50+pos.x*.28;bfState.featureY=50-pos.y*.28;bfRender();if(Math.abs(pos.x)<=9&&Math.abs(pos.y)<=9)s3Complete(400);}});}
  function runBFAtomic47(){showBfScene();bfState.finalMagTouched=false;bfSetStatus('With MAG 1 retained, set MAG/CAM L to X60k for the supplied real-sample sequence.');s3Activate(['mag-caml']);s3SetHandlers({'knob:mag-caml':function(v){var i=Math.round(v);bfState.magIndex=i;bfState.mag=BF_MAG_VALUES[i]||8000;bfRender();if(bfState.mag===60000){bfState.finalMagTouched=true;s3Complete(450);}}});}
  function runBFAtomic48(){showBfScene();bfState.c2=50;s3SetKnob('brightness',50);bfRender();bfSetStatus('Spread the beam appropriately for image recording.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v>=70)s3Complete(400);}});}
  function runBFAtomic49(){showBfScene();bfSetStatus('AUTO contrast is optional. Press AUTO now if desired.');s3Activate(['auto-contrast']);var timer=setTimeout(function(){s3Complete(100);},2300);bfTimers.push(timer);s3SetHandlers({'action:auto-contrast':function(btn){clearTimeout(timer);s3SelectButton(btn);bfState.autoUsed=true;bfRender();s3Complete(300);}});}
  function runBFAtomic50(){showBfScene();bfState.screenRaised=false;bfSetStatus('Press F1 to lift the fluorescent screen and expose the camera.');s3Activate(['f1']);s3SetHandlers({'action:f1':function(btn){s3SelectButton(btn);bfState.screenRaised=true;var s=document.getElementById('pc-cam-screen-state');if(s)s.textContent='Raised';s3Complete(350);}});}

  function ensureAtomicItemPanel(mode){
    openCameraDrawer();
    var host=document.querySelector('.camera-palette--acquisition .camera-palette__body');if(!host)return null;
    var legacy=document.querySelector('.pc-cam-controls');if(legacy)legacy.style.display='none';
    var old=document.getElementById('sopItemPanel');if(old)old.remove();
    var ws=document.querySelector('#pc-cam .camera-workstation');if(ws){ws.classList.add('sop-item-workflow');ws.classList.toggle('sop-item-workflow--focus',mode==='focus');}
    var p=document.createElement('div');p.id='sopItemPanel';p.className='sop-item-panel sop-item-panel--olympus';
    var html='<div class="sop-item-panel__header"><span class="sop-item-panel__symbol">iTEM</span><strong>Acquisition</strong><small>Olympus TEM</small></div>';
    if(mode==='open')html+='<div class="sop-item-panel__status">● Camera connected · imaging workspace ready</div><div class="sop-s3-pc-note">Olympus iTEM is open automatically. The real specimen is displayed in the iTEM acquisition window.</div>';
    if(mode==='focus')html+='<div class="sop-s3-pc-note"><strong>Through-focus inspection</strong> — Observe all three focus conditions <strong>in the iTEM camera window only</strong>. Turn the OBJ FOCUS knobs counter-clockwise for underfocus, move toward minimum contrast, then clockwise for overfocus. Hold each view for one second.</div>'
      +'<div class="s3-focus-condition" id="s3FocusCondition">Current: UNDERFOCUS</div>'
      +'<div class="s3-focus-checklist" id="s3FocusChecklist" aria-label="Three focus conditions to observe">'
      +'<div class="s3-focus-check" data-focus-check="under"><span class="s3-focus-check__circle">○</span><span>Underfocus (Scherzer)</span><small>Bright white fringe outside particle edges; textured carbon film</small></div>'
      +'<div class="s3-focus-check" data-focus-check="sharp"><span class="s3-focus-check__circle">○</span><span>In focus</span><small>Low contrast; smooth carbon background; no edge fringes</small></div>'
      +'<div class="s3-focus-check" data-focus-check="over"><span class="s3-focus-check__circle">○</span><span>Overfocus</span><small>Dark outer fringe; avoid for final sizing</small></div></div>'
      +'<div class="s3-focus-readout" id="s3FocusReadout">Focus offset: −12.0 · Hold steady to inspect</div>'
      +'<button type="button" id="s3ConfirmFocusThree" class="s3-focus-confirm" disabled>Confirm all three focus conditions</button>';
    if(mode==='video')html+='<button id="s3ItemVideo">Video</button><div class="sop-s3-pc-note">Start the live Bright Field camera acquisition.</div>';
    if(mode==='snapshot')html+='<button id="s3ItemSnapshot">Snapshot</button><div class="sop-s3-pc-note">Capture the Bright Field image.</div>';
    if(mode==='done')html+='<div class="sop-s3-pc-note">Snapshot captured · press F1 on R1 to return the fluorescent screen.</div>';
    p.innerHTML=html;host.appendChild(p);showS3CameraSignal();return p;
  }
  function runBFAtomic51(){
    // Stay on the Column tab: iTEM lives only inside the camera drawer.
    setViewer('column');hideBfScene();hideS3ApertureOverlay();hideS3FocusViewport();
    bfState.itemOpen=true;
    var panel=ensureAtomicItemPanel('open');
    if(!panel)return;
    showS3CameraSignal();
    drawBfCameraFrame('cameraLiveC',.18,'OLYMPUS iTEM · live TEM specimen');
    var live=document.getElementById('pc-cam-live-state');if(live)live.textContent='Preview ready';
    // Auto-opened iTEM workspace is the new Section 3 Step 48.
    var t=setTimeout(function(){if(state.currentSection===3&&state.currentStep===47)s3Complete(650);},2000);
    bfTimers.push(t);
  }
  function runBFAtomic52(){
    // Focus conditions appear only in iTEM; never briefly switch to screen.
    setViewer('column');hideBfScene();hideS3ApertureOverlay();hideS3FocusViewport();
    bfState.itemOpen=true;
    bfState.focusCoarse=-12;bfState.focusFine=0;
    s3SetKnob('focus-coarse',-12);s3SetKnob('focus-fine',0);
    var panel=ensureAtomicItemPanel('focus');
    if(!panel)return;
    hideS3FocusViewport();
    setViewer('column'); // Only the iTEM camera shows under/in/overfocus. No screen overlay.
    showS3CameraSignal();
    drawBfCameraFocusPreview();
    var seen={under:false,sharp:false,over:false},holdTimer=null,lastCondition='',stableSince=0;
    var confirm=document.getElementById('s3ConfirmFocusThree');
    var read=document.getElementById('s3FocusReadout');
    var cond=document.getElementById('s3FocusCondition');
    var lastSigned=-12;
    function which(v){return v<=-5?'under':(Math.abs(v)<=1.5?'sharp':(v>=5?'over':'transition'));}
    function name(c){return c==='under'?'UNDERFOCUS':(c==='sharp'?'IN FOCUS':(c==='over'?'OVERFOCUS':'TRANSITION'));}
    function syncChecklist(active){
      ['under','sharp','over'].forEach(function(c){
        var el=document.querySelector('[data-focus-check="'+c+'"]');if(!el)return;
        el.classList.toggle('is-seen',!!seen[c]);el.classList.toggle('is-current',c===active);
        var ico=el.querySelector('.s3-focus-check__circle');if(ico)ico.textContent=seen[c]?'✓':'○';
      });
      var all=seen.under&&seen.sharp&&seen.over;
      var returned=(lastSigned>=-3&&lastSigned<=1.5);
      if(confirm)confirm.disabled=!(all&&returned);
      if(read)read.textContent='Focus offset: '+lastSigned.toFixed(1)+' · '+Object.values(seen).filter(Boolean).length+'/3 conditions observed'+(all&&!returned?' · Return near focus to confirm':'');
    }
    function inspect(){
      var signed=Number(bfState.focusCoarse||0)+Number(bfState.focusFine||0);
      lastSigned=signed;
      var active=which(signed);
      if(holdTimer)clearTimeout(holdTimer);
      if(cond)cond.textContent='Current: '+name(active)+(active==='transition'?' · adjust knob':' · hold to verify');
      drawBfCameraFocusPreview();syncChecklist(active);
      if(active==='transition'||seen[active])return;
      lastCondition=active;stableSince=Date.now();
      holdTimer=setTimeout(function(){
        if(state.currentSection!==3||state.currentStep!==48)return;
        var present=Number(bfState.focusCoarse||0)+Number(bfState.focusFine||0);
        if(which(present)!==lastCondition||Date.now()-stableSince<700)return;
        seen[active]=true;syncChecklist(active);
        if(cond)cond.textContent=name(active)+' observed ✓ — proceed to the next condition';
      },850);
      bfTimers.push(holdTimer);
    }
    // Focus knobs remain disabled while the learner reads the introduction.
    s3Activate([]);
    s3SetHandlers({
      'knob:focus-coarse':function(v){bfState.focusCoarse=v;inspect();},
      'knob:focus-fine':function(v){bfState.focusFine=v;inspect();}
    });
    if(confirm)confirm.onclick=function(){
      if(confirm.disabled||!(seen.under&&seen.sharp&&seen.over))return;
      ensureAudio();confirm.disabled=true;
      var n=document.getElementById('pc-cam-message');if(n)n.textContent='iTEM · Underfocus, in-focus, overfocus confirmed';
      s3Complete(550,function(){hideS3FocusViewport();});
    };
    // The camera is visible underneath the modal. After OK, enable the
    // actual OBJ FOCUS controls and begin evaluating three held conditions.
    openModal({locked:true,dismissible:false,tag:'SECTION 3 · iTEM FOCUS TRAINING',
      title:'Observe all three focus conditions',step:'Step '+(state.currentStep+1)+' of '+sections[2].steps.length,
      body:'<p class="sop-flow-modal__copy"><strong>This step is for learning purposes only.</strong> Observe the three focus conditions inside the <strong>iTEM camera window</strong>. Refer to the <strong>instructions on the right side of the camera screen</strong>.</p>'
        +'<p class="sop-flow-modal__copy" style="margin-top:9px"><strong>Underfocus:</strong> bright white fringes outside nanoparticle edges. <strong>In focus:</strong> smooth carbon background and minimum contrast. <strong>Overfocus:</strong> dark fringes outside particle edges.</p>'
        +'<p class="sop-flow-modal__copy" style="margin-top:9px">Use OBJ FOCUS COARSE/FINE to observe each condition, then return near focus and confirm your observations.</p>',
      footer:'<button type="button" class="sop-flow-btn sop-flow-btn--success" id="s3FocusLearningOk">OK — Begin focus observation</button>'});
    var ok=document.getElementById('s3FocusLearningOk');
    if(ok)ok.onclick=function(){
      closeModal(true);
      if(state.currentSection!==3||state.currentStep!==48)return;
      s3Activate(['focus-coarse','focus-fine']);
      inspect();
    };
  }
  function runBFAtomic53(){hideBfScene();hideS3FocusViewport();var p=ensureAtomicItemPanel('video'),b=document.getElementById('s3ItemVideo');if(!b)return;b.onclick=function(){ensureAudio();bfState.videoOn=true;b.disabled=true;var ls=document.getElementById('pc-cam-live-state');if(ls)ls.textContent='Running';startBfCameraLive();s3Complete(1500);};}
  function runBFAtomic54(){
    setViewer('column');hideBfScene();clearBfTimers();
    var p=ensureAtomicItemPanel('snapshot'),b=document.getElementById('s3ItemSnapshot');if(!b)return;
    drawBfCameraFrame('cameraLiveC',.08,'LIVE BF · ready for snapshot');
    b.onclick=function(){
      if(b.disabled)return;
      ensureAudio();b.disabled=true;
      drawCapturedBf(function(canvas){
        if(state.currentSection!==3||state.currentStep!==50)return;
        bfState.captured=true;
        var s=document.getElementById('pc-cam-image-state');if(s)s.textContent='Real BF snapshot captured';
        downloadCapturedBf(canvas);
        s3Complete(800);
      });
    };
  }
  function runBFAtomic55(){hideBfScene();ensureAtomicItemPanel('done');if(bfState.captured)drawCapturedBf();bfSetStatus('Press F1 to return the fluorescent screen.');s3Activate(['f1']);s3SetHandlers({'action:f1':function(btn){if(!bfState.captured)return;s3SelectButton(btn);bfState.screenRaised=false;var s=document.getElementById('pc-cam-screen-state');if(s)s.textContent='Down';s3Complete(450,function(){clearS3PcPanel();closePcDrawer();hideS3ApertureOverlay();});}});}


  /* =====================================================================
     SECTION 4 — DARK FIELD IMAGING (Version 4.9.1)
     Manual-driven beam-tilt Dark Field path built on the completed BF state.
     ===================================================================== */
  var dfScene=null,dfScreen=null,dfSpecimen=null,dfPattern=null,dfApertureShade=null,dfFringe=null;
  var DF_SPOTS=[
    {id:'000',x:50,y:50,r:9,direct:true},{id:'g1',x:70,y:36,r:6,target:true},{id:'g2',x:30,y:64,r:5},
    {id:'g3',x:67,y:66,r:4},{id:'g4',x:33,y:34,r:4},{id:'g5',x:82,y:51,r:3},{id:'g6',x:18,y:49,r:3},
    {id:'g7',x:55,y:22,r:3},{id:'g8',x:45,y:78,r:3}
  ];

  function resetDfState(){
    dfState={mode:'image',selectedReflection:false,tiltMode:false,tiltX:0,tiltY:0,darkField:false,objInserted:false,objX:25,objY:-20,focusCoarse:12,focusFine:6,objStigOn:false,astigX:9,astigY:-8,screenRaised:false,itemOpen:false,videoOn:false,captured:false,recorded:false};
    /* Enter DF from the stable BF condition established in Section 3. */
    bfState.beamOn=true;bfState.coverOpen=true;bfState.wobble=false;bfState.screenRaised=false;
    if(!bfState.mag||bfState.mag<8000){bfState.mag=40000;bfState.magIndex=5;}
  }

  function ensureDfScene(){
    if(dfScene||!viewScreen)return;
    var w=document.createElement('div');w.id='sopDfScene';w.className='sop-df-scene';w.hidden=true;
    w.innerHTML='<div class="sop-df-screen" id="sopDfScreen">'
      +'<img class="sop-df-specimen" id="sopDfSpecimen" src="../assets/images/sop/bf-highmag.png" alt="Dark field specimen simulation">'
      +'<div class="sop-df-pattern" id="sopDfPattern"></div>'
      +'<div class="sop-df-aperture-shade" id="sopDfApertureShade"></div>'
      +'<div class="sop-df-fringe" id="sopDfFringe"></div>'
      +'<div class="sop-df-crosshair"><i></i><b></b></div>'
      +'</div>';
    viewScreen.appendChild(w);dfScene=w;dfScreen=document.getElementById('sopDfScreen');dfSpecimen=document.getElementById('sopDfSpecimen');dfPattern=document.getElementById('sopDfPattern');dfApertureShade=document.getElementById('sopDfApertureShade');dfFringe=document.getElementById('sopDfFringe');
    dfPattern.innerHTML=DF_SPOTS.map(function(s){return '<button type="button" class="sop-df-spot'+(s.direct?' is-direct':'')+(s.target?' is-target':'')+'" data-df-spot="'+s.id+'" aria-label="Diffraction spot '+s.id+'"><span></span></button>';}).join('');
  }

  function dfRender(){
    ensureDfScene();if(!dfScene)return;
    var isDiff=dfState.mode==='diff';
    dfScene.classList.toggle('is-diff',isDiff);dfScene.classList.toggle('is-dark-field',!!dfState.darkField&&!isDiff);dfScene.classList.toggle('is-aperture-in',!!dfState.objInserted);
    if(dfPattern){
      [].slice.call(dfPattern.querySelectorAll('[data-df-spot]')).forEach(function(el){
        var id=el.dataset.dfSpot,s=DF_SPOTS.filter(function(p){return p.id===id;})[0];if(!s)return;
        el.style.left=(s.x+Number(dfState.tiltX||0))+'%';el.style.top=(s.y+Number(dfState.tiltY||0))+'%';el.style.width=(s.r*2)+'px';el.style.height=(s.r*2)+'px';
        el.classList.toggle('is-selected',id==='g1'&&dfState.selectedReflection);
        el.classList.toggle('is-on-axis',id==='g1'&&Math.abs((s.x+dfState.tiltX)-50)<=3&&Math.abs((s.y+dfState.tiltY)-50)<=3);
      });
    }
    if(dfSpecimen){
      var focusErr=Math.abs(Number(dfState.focusCoarse||0))+Math.abs(Number(dfState.focusFine||0));
      var astig=Math.abs(Number(dfState.astigX||0))+Math.abs(Number(dfState.astigY||0));
      var apErr=Math.hypot(Number(dfState.objX||0),Number(dfState.objY||0));
      var apertureQuality=dfState.objInserted?Math.max(.35,1-Math.min(1,apErr/45)*.65):.28;
      var blur=Math.min(5.5,focusErr*.20+astig*.055);
      var sx=1+Math.abs(Number(dfState.astigX||0))*.006,sy=1+Math.abs(Number(dfState.astigY||0))*.006;
      dfSpecimen.style.transform='scale('+sx.toFixed(3)+','+sy.toFixed(3)+')';
      if(dfState.darkField){
        dfSpecimen.style.opacity=String((.78*apertureQuality).toFixed(2));
        dfSpecimen.style.filter='grayscale(1) invert(1) brightness('+(0.48+apertureQuality*.32).toFixed(2)+') contrast(2.35) blur('+blur.toFixed(2)+'px)';
      }else{
        dfSpecimen.style.opacity='0.92';dfSpecimen.style.filter='grayscale(1) brightness(1.0) contrast(1.18) blur('+Math.min(3,focusErr*.12).toFixed(2)+'px)';
      }
    }
    if(dfApertureShade){
      var err=Math.hypot(Number(dfState.objX||0),Number(dfState.objY||0));
      dfApertureShade.style.opacity=dfState.darkField&&dfState.objInserted?Math.min(.58,err/55).toFixed(2):'0';
      dfApertureShade.style.transform='translate('+(Number(dfState.objX||0)*.20).toFixed(1)+'%,'+(Number(dfState.objY||0)*-.20).toFixed(1)+'%)';
    }
    if(dfFringe){
      var ferr=Math.abs(Number(dfState.focusCoarse||0))+Math.abs(Number(dfState.focusFine||0));
      dfFringe.style.opacity=dfState.darkField?Math.min(.85,ferr/16).toFixed(2):'0';
      dfFringe.style.borderWidth=(2+Math.min(8,ferr*.35))+'px';
    }
  }

  function showDfScene(){
    closeModal(true);closePcDrawer();hideBfScene();hideViewportScene();hideSection1Tour();ensureDfScene();clearBfTimers();
    if(!dfScene)return;dfScene.hidden=false;if(viewEmpty)viewEmpty.style.display='none';setViewer('screen');dfRender();
  }
  function hideDfScene(){
    if(!dfScene)return;dfScene.hidden=true;if(viewEmpty)viewEmpty.style.display='';if(dfPattern)[].slice.call(dfPattern.querySelectorAll('[data-df-spot]')).forEach(function(b){b.onclick=null;});
  }

  function setDefStigLabels(x,y){
    var lx=document.getElementById('def-stig-label'),ly=document.getElementById('def-stig-label-y');if(lx)lx.textContent=x||'DEF/STIG X';if(ly)ly.textContent=y||'DEF/STIG Y';
  }

  function showSection4(){
    var n=state.currentStep+1;s3StepCompleting=false;hideViewportScene();hideSection1Tour();clearS3PcPanel();s3LockControls();hideS3ApertureOverlay();setDefStigLabels('DEF/STIG X','DEF/STIG Y');
    switch(n){
      case 1:return runDF01();case 2:return runDF02();case 3:return runDF03();case 4:return runDF04();case 5:return runDF05();
      case 6:return runDF06();case 7:return runDF07();case 8:return runDF08();case 9:return runDF09();case 10:return runDF10();
      case 11:return runDF11();case 12:return runDF12();case 13:return runDF13();case 14:return runDF14();case 15:return runDF15();
      case 16:return runDF16();case 17:return runDF17();case 18:return runDF18();case 19:return runDF19();case 20:return runDF20();case 21:return runDF21();
    }
  }

  function runDF01(){showDfScene();dfState.mode='image';dfState.darkField=false;dfRender();s3Activate(['mag-mode']);s3SetHandlers({'action:mag-mode':function(btn){if(btn.dataset.value!=='diff')return;s3SelectButton(btn);dfState.mode='diff';dfRender();s3Complete(420);}});}
  function runDF02(){showDfScene();dfState.mode='diff';dfRender();var g1=dfPattern&&dfPattern.querySelector('[data-df-spot="g1"]');if(!g1)return;g1.classList.add('is-pickable');g1.onclick=function(){ensureAudio();dfState.selectedReflection=true;g1.classList.remove('is-pickable');g1.onclick=null;dfRender();s3Complete(380);};}
  function runDF03(){showDfScene();dfState.mode='diff';dfRender();s3Activate(['def-stig-mode']);s3SetHandlers({'action:def-stig-mode':function(btn){if(btn.dataset.value!=='darkTilt')return;s3SelectButton(btn);dfState.tiltMode=true;setDefStigLabels('BEAM TILT X','BEAM TILT Y');s3Complete(350);}});}
  function runDF04(){showDfScene();dfState.mode='diff';setDefStigLabels('BEAM TILT X','BEAM TILT Y');s3SetKnob('defstig-x',0);dfState.tiltX=0;dfRender();s3Activate(['def-stig-x']);s3SetHandlers({'defstig:x':function(v){dfState.tiltX=v;dfRender();if(v>=-22&&v<=-18){dfState.tiltX=-20;s3SetKnob('defstig-x',-20);dfRender();s3Complete(400);}}});}
  function runDF05(){showDfScene();dfState.mode='diff';setDefStigLabels('BEAM TILT X','BEAM TILT Y');s3SetKnob('defstig-y',0);dfState.tiltY=0;dfRender();s3Activate(['def-stig-y']);s3SetHandlers({'defstig:y':function(v){dfState.tiltY=v;dfRender();if(v>=12&&v<=16){dfState.tiltY=14;s3SetKnob('defstig-y',14);dfRender();s3Complete(420);}}});}
  function runDF06(){showDfScene();dfState.mode='diff';dfRender();s3Activate(['mag-mode']);s3SetHandlers({'action:mag-mode':function(btn){if(btn.dataset.value!=='mag1')return;s3SelectButton(btn);dfState.mode='image';dfState.darkField=true;dfRender();s3Complete(480);}});}
  function runDF07(){showDfScene();dfState.darkField=true;dfRender();s3Activate(['aperture-select']);s3SetHandlers({'action:aperture-select':function(btn){if(btn.dataset.value!=='objective')return;s3SelectButton(btn);dfState.objInserted=true;dfState.objX=25;dfState.objY=-20;s3SetPad('aperture-align',25,-20);dfRender();s3Complete(380);}});}
  function runDF08(){showDfScene();dfState.objInserted=true;s3SetPad('aperture-align',dfState.objX,dfState.objY);dfRender();s3Activate(['aperture-align']);s3SetHandlers({'pad:aperture-align':function(pos){dfState.objX=pos.x;dfState.objY=pos.y;dfRender();if(Math.abs(pos.x)<=4)s3Complete(400);}});}
  function runDF09(){showDfScene();dfState.objInserted=true;s3SetPad('aperture-align',dfState.objX,dfState.objY);dfRender();s3Activate(['aperture-align']);s3SetHandlers({'pad:aperture-align':function(pos){dfState.objX=pos.x;dfState.objY=pos.y;dfRender();if(Math.abs(pos.x)<=5&&Math.abs(pos.y)<=4)s3Complete(420);}});}
  function runDF10(){showDfScene();dfState.focusCoarse=12;s3SetKnob('focus-coarse',12);dfRender();s3Activate(['focus-coarse']);s3SetHandlers({'knob:focus-coarse':function(v){dfState.focusCoarse=v;dfRender();if(Math.abs(v)<=4){dfState.focusCoarse=0;s3SetKnob('focus-coarse',0);dfRender();s3Complete(400);}}});}
  function runDF11(){showDfScene();dfState.focusFine=6;s3SetKnob('focus-fine',6);dfRender();s3Activate(['focus-fine']);s3SetHandlers({'knob:focus-fine':function(v){dfState.focusFine=v;dfRender();if(Math.abs(v)<=1.5){dfState.focusFine=0;s3SetKnob('focus-fine',0);dfRender();s3Complete(420);}}});}
  function runDF12(){showDfScene();dfState.astigX=9;dfState.astigY=-8;dfRender();s3Activate(['def-stig-mode']);s3SetHandlers({'action:def-stig-mode':function(btn){if(btn.dataset.value!=='objStig')return;s3SelectButton(btn);dfState.objStigOn=true;setDefStigLabels('OBJ STIG X','OBJ STIG Y');s3Complete(350);}});}
  function runDF13(){showDfScene();setDefStigLabels('OBJ STIG X','OBJ STIG Y');s3SetKnob('defstig-x',9);dfState.astigX=9;dfRender();s3Activate(['def-stig-x']);s3SetHandlers({'defstig:x':function(v){dfState.astigX=v;dfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runDF14(){showDfScene();setDefStigLabels('OBJ STIG X','OBJ STIG Y');s3SetKnob('defstig-y',-8);dfState.astigY=-8;dfRender();s3Activate(['def-stig-y']);s3SetHandlers({'defstig:y':function(v){dfState.astigY=v;dfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runDF15(){showDfScene();setDefStigLabels('OBJ STIG X','OBJ STIG Y');dfRender();s3Activate(['def-stig-mode']);s3SetHandlers({'action:def-stig-mode':function(btn){if(btn.dataset.value!=='objStig')return;btn.classList.remove('is-selected');dfState.objStigOn=false;setDefStigLabels('DEF/STIG X','DEF/STIG Y');s3Complete(350);}});}
  function runDF16(){showDfScene();dfState.screenRaised=false;s3Activate(['f1']);s3SetHandlers({'action:f1':function(btn){s3SelectButton(btn);dfState.screenRaised=true;var s=document.getElementById('pc-cam-screen-state');if(s)s.textContent='Raised';s3Complete(350);}});}

  function ensureDfItemPanel(mode){
    hideDfScene();openCameraDrawer();var host=document.querySelector('.camera-palette--acquisition .camera-palette__body');if(!host)return null;var legacy=document.querySelector('.pc-cam-controls');if(legacy)legacy.style.display='none';var old=document.getElementById('sopItemPanel');if(old)old.remove();
    var p=document.createElement('div');p.id='sopItemPanel';p.className='sop-item-panel';var html='<div class="sop-bf-card-title">iTEM · Dark Field acquisition</div>';
    if(mode==='open')html+='<button id="s4ItemOpen">Open iTEM</button><div class="sop-s3-pc-note">Dark Field acquisition workspace.</div>';
    if(mode==='video')html+='<button id="s4ItemVideo">Video</button><div class="sop-s3-pc-note">Start the live Dark Field camera feed.</div>';
    if(mode==='snapshot')html+='<button id="s4ItemSnapshot">Snapshot</button><div class="sop-s3-pc-note">Capture the Dark Field image.</div>';
    if(mode==='record')html+='<div class="sop-df-record"><span>Selected reflection</span><strong>g1</strong><button id="s4RecordReflection">Record DF + g1</button></div>';
    if(mode==='done')html+='<div class="sop-s3-pc-note">Dark Field image and reflection g1 recorded. Press F1 on R1 to return the fluorescent screen.</div>';
    p.innerHTML=html;host.appendChild(p);var ph=document.getElementById('pc-cam-placeholder');if(ph&&dfState.itemOpen)ph.style.display='none';return p;
  }
  function drawCapturedDf(){
    var cv=document.getElementById('pc-cam-canvas');if(!cv)return;var ctx=cv.getContext('2d'),img=new Image();img.onload=function(){ctx.clearRect(0,0,cv.width,cv.height);ctx.fillStyle='#050505';ctx.fillRect(0,0,cv.width,cv.height);ctx.filter='grayscale(1) invert(1) brightness(.72) contrast(2.2)';ctx.drawImage(img,0,0,cv.width,cv.height);ctx.filter='none';ctx.fillStyle='rgba(255,255,255,.86)';ctx.font='15px sans-serif';ctx.fillText('DF · selected reflection g1',14,25);};img.src='../assets/images/sop/bf-acquisition.png';
  }
  function runDF17(){var p=ensureDfItemPanel('open'),b=document.getElementById('s4ItemOpen');if(!b)return;b.onclick=function(){ensureAudio();dfState.itemOpen=true;b.disabled=true;var ph=document.getElementById('pc-cam-placeholder');if(ph)ph.style.display='none';s3Complete(350);};}
  function runDF18(){var p=ensureDfItemPanel('video'),b=document.getElementById('s4ItemVideo');if(!b)return;b.onclick=function(){ensureAudio();dfState.videoOn=true;b.disabled=true;var ls=document.getElementById('pc-cam-live-state');if(ls)ls.textContent='Running · DF';drawCapturedDf();s3Complete(350);};}
  function runDF19(){var p=ensureDfItemPanel('snapshot'),b=document.getElementById('s4ItemSnapshot');if(!b)return;b.onclick=function(){ensureAudio();dfState.captured=true;b.disabled=true;drawCapturedDf();var s=document.getElementById('pc-cam-image-state');if(s)s.textContent='Dark Field snapshot captured';s3Complete(350);};}
  function runDF20(){var p=ensureDfItemPanel('record'),b=document.getElementById('s4RecordReflection');if(!b)return;b.onclick=function(){ensureAudio();if(!dfState.captured)return;dfState.recorded=true;b.disabled=true;b.textContent='Recorded · DF + g1';s3Complete(380);};}
  function runDF21(){ensureDfItemPanel('done');s3Activate(['f1']);s3SetHandlers({'action:f1':function(btn){if(!dfState.recorded)return;s3SelectButton(btn);dfState.screenRaised=false;var s=document.getElementById('pc-cam-screen-state');if(s)s.textContent='Down';s3Complete(450,function(){clearS3PcPanel();closePcDrawer();hideDfScene();setDefStigLabels('DEF/STIG X','DEF/STIG Y');});}});}

  function bindGrid(){
    var a=document.getElementById('gridOpen'),b=document.getElementById('gridPlace'),c=document.getElementById('gridClose'),next=document.getElementById('gridContinue');
    function enable(box){if(!box)return;box.disabled=false;var l=box.closest('.sop-grid-check');if(l)l.classList.remove('is-disabled');}
    function lock(box){if(!box)return;box.disabled=true;var l=box.closest('.sop-grid-check');if(l){l.classList.remove('is-disabled');l.classList.add('is-checked');}}
    if(a)a.addEventListener('change',function(){if(!a.checked)return;ensureAudio();state.gridStage=1;lock(a);enable(b);});
    if(b)b.addEventListener('change',function(){if(!b.checked||state.gridStage<1){b.checked=false;return;}ensureAudio();state.gridStage=2;lock(b);enable(c);});
    if(c)c.addEventListener('change',function(){if(!c.checked||state.gridStage<2){c.checked=false;return;}ensureAudio();state.gridStage=3;lock(c);if(next)next.disabled=false;});
    if(next)next.addEventListener('click',function(){if(state.gridStage<3)return;next.disabled=true;completeStep(function(){closeModal(true);});});
  }

  function bindHolderDrag(){var h=document.getElementById('holderDrag'),track=document.getElementById('holderTrack'),port=document.getElementById('holderPort'),btn=document.getElementById('holderContinue');var dragging=false,startX=0,startL=24;function maxL(){return Math.max(24,port.offsetLeft-h.offsetWidth+32);}h.addEventListener('pointerdown',function(e){ensureAudio();dragging=true;startX=e.clientX;startL=parseFloat(h.style.left)||24;h.setPointerCapture(e.pointerId);h.classList.add('is-dragging');});h.addEventListener('pointermove',function(e){if(!dragging)return;var x=Math.max(24,Math.min(maxL(),startL+e.clientX-startX));h.style.left=x+'px';});h.addEventListener('pointerup',function(){if(!dragging)return;dragging=false;h.classList.remove('is-dragging');var x=parseFloat(h.style.left)||24;if(x>=maxL()-7&&!state.insertionDone){state.insertionDone=true;h.style.left=maxL()+'px';threeClicks();setTimeout(function(){btn.disabled=false;},1250);}});btn.addEventListener('click',function(){if(!state.insertionDone)return;btn.disabled=true;completeStep(function(){closeModal(true);});});}

  function startEvacuation(){if(state.evacuationDone){stopPump();return;}var bar=document.getElementById('vacBar'),txt=document.getElementById('vacText'),lamp=document.getElementById('amberLamp'),btn=document.getElementById('vacContinue'),t0=Date.now(),dur=6500;state.pumpTimer=setInterval(function(){var p=Math.min(100,(Date.now()-t0)/dur*100);bar.style.width=p+'%';txt.textContent='EVACUATING · '+Math.round(p)+'%';if(p>=100){clearInterval(state.pumpTimer);state.pumpTimer=null;state.evacuationDone=true;stopPump();lamp.classList.remove('is-on');txt.textContent='VACUUM READY · AMBER LAMP OFF';btn.disabled=false;btn.textContent='Continue';}},140);btn.addEventListener('click',function(){if(!state.evacuationDone)return;btn.disabled=true;completeStep(function(){closeModal(true);});});}

  function bindRotation(){var r=document.getElementById('rotRange'),read=document.getElementById('rotRead'),a=document.getElementById('rot15'),b=document.getElementById('rot75'),c=document.getElementById('rotSeat'),seat=document.getElementById('seatHolder'),next=document.getElementById('rotContinue');r.addEventListener('input',function(){ensureAudio();var v=Number(r.value);read.textContent=v+'°';if(!state.rotation15&&v>=14&&v<=18){state.rotation15=true;a.classList.add('done');}if(state.rotation15&&v>=74){state.rotation75=true;b.classList.add('done');seat.disabled=false;}});seat.addEventListener('click',function(){if(!state.rotation75)return;clickSound(0);state.holderSeated=true;c.classList.add('done');seat.disabled=true;next.disabled=false;});next.addEventListener('click',function(){if(!state.holderSeated)return;next.disabled=true;completeStep(function(){closeModal(true);});});}

  function bindTrackball(){var ball=document.getElementById('specTrackball'),dot=document.getElementById('stageDot'),btn=document.getElementById('trackConfirm');var drag=false,lx=0,ly=0,total=0,x=50,y=50;ball.addEventListener('pointerdown',function(e){ensureAudio();drag=true;lx=e.clientX;ly=e.clientY;ball.setPointerCapture(e.pointerId);ball.classList.add('is-dragging');});ball.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;total+=Math.abs(dx)+Math.abs(dy);x=Math.max(12,Math.min(88,x+dx*.18));y=Math.max(12,Math.min(88,y+dy*.18));dot.style.left=x+'%';dot.style.top=y+'%';if(total>42&&!state.trackballMoved){state.trackballMoved=true;btn.disabled=false;}});ball.addEventListener('pointerup',function(){drag=false;ball.classList.remove('is-dragging');});btn.addEventListener('click',function(){if(!state.trackballMoved)return;btn.disabled=true;completeStep(function(){closeModal(true);});});}

  function resetSession(){hideS3BeamScreenStill();stopPrestartExplore();clearPendingStepTransition();clearHtRampTimers();cleanupHtRampUi();clearBfTimers();clearS3PcPanel();releaseS3HtPhoto();hideBfScene();if(typeof hideDfScene==='function')hideDfScene();if(typeof hideS3ApertureOverlay==='function')hideS3ApertureOverlay();resetBfState();stopPump();hideViewportScene();hideSection1Tour();if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}if(state.pumpTimer)clearInterval(state.pumpTimer);state={sample:null,currentSection:0,currentStep:0,unlockedThrough:0,sectionComplete:{},completed:{},gridStage:0,insertionDone:false,pumpStarted:false,evacuationDone:false,rotation15:false,rotation75:false,holderSeated:false,trackballMoved:false,pumpTimer:null};var holderReset=document.getElementById('pc-holder-model-select');if(holderReset)holderReset.value='single-tilt-beryllium';sampleInd.textContent='SELECT SAMPLE';closePcDrawer();closeModal(true);setSessionControls(false);renderNav();setInstruction();updateProgress();startPrestartExplore();}

  var restart=document.getElementById('btn-restart');if(restart)restart.addEventListener('click',function(){
    if(!state.sample){stopPrestartExplore();showSampleModal();return;}
    resetSession();
  });
  var undo=document.getElementById('btn-undo-step');if(undo)undo.addEventListener('click',function(){
    if(!state.sample||!state.currentSection)return;
    var wasPending=stepTransitionPending;
    if(wasPending)delete state.completed[key()];
    clearPendingStepTransition();
    if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}
    clearHtRampTimers();cleanupHtRampUi();clearBfTimers();clearS3PcPanel();releaseS3HtPhoto();hideBfScene();if(typeof hideDfScene==='function')hideDfScene();closeModal(true);closePcDrawer();hideSection1Tour();stopPump();if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}
    if(!wasPending&&state.currentStep>0){state.currentStep--;delete state.completed[key()];}
    if(state.currentSection===2 && state.currentStep>=5){state.pumpStarted=false;state.evacuationDone=false;}
    setInstruction();renderNav();updateProgress();setTimeout(showCurrentStep,650);
  });
  var showStep=document.getElementById('btn-show-step');if(showStep)showStep.addEventListener('click',function(){
    if(state.currentSection===3&&state.currentStep===6&&s3BeamCurrentReadyForConfirm){showS3BeamCurrentConfirmation();return;}
    if(state.currentSection===3&&state.currentStep===4&&s3V2ReadyForConfirm){showS3V2VerificationModal();return;}
    if(state.currentSection===2&&state.currentStep===7&&state.sample&&!stepTransitionPending&&showSection2Step8Confirmation){
      var holderSelect=document.getElementById('pc-holder-model-select');
      if(holderSelect&&holderSelect.value==='single-tilt')showSection2Step8Confirmation();
      else openModal({locked:false,tag:'SECTION 2 · HOLDER MODEL',title:'Select Single Tilt Holder',step:'Step 8 of 8',
        body:'<p class="sop-flow-modal__copy">Use the TEMCON holder dropdown in the F1–F6 row. Choose <strong>EM-21010/21020 : Single Tilt Holder</strong> to open the final confirmation.</p>',footer:''});
      return;
    }
    if(state.currentSection===1&&state.currentStep===3&&state.sample){
      if(step4HtReadyForConfirmation){showStep4StatusConfirmation();}
      else{
        openModal({locked:false,tag:'SECTION 1 · HIGH VOLTAGE',title:'Switch HT ON',step:'Step 4 of 7',
          body:'<p class="sop-flow-modal__copy">In the existing High Voltage Control window, press <strong>HT ON</strong>. Wait for the accelerating-voltage alert to disappear and the HT indicator to turn green. Then verify the Valve Status window.</p>',footer:''});
      }
      return;
    }

    if(stepTransitionPending){delete state.completed[key()];updateProgress();}
    clearPendingStepTransition();
    clearBfTimers();clearS3PcPanel();releaseS3HtPhoto();hideBfScene();if(typeof hideDfScene==='function')hideDfScene();closeModal(true);hideSection1Tour();
    if(!state.sample){showSampleModal();return;}
    var s=currentSection();if(!s||state.sectionComplete[s.id]||!s.implemented)return;
    if(state.currentSection===2 && state.currentStep===5){state.pumpStarted=false;state.evacuationDone=false;stopPump();if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}}
    setInstruction();showCurrentStep();
  });
  function togglePcDrawerForLearner(){
    if(!drawer||state.currentSection===1&&state.currentStep===3)return;
    var opening=!drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open',opening);
    if(viewerStage)viewerStage.classList.toggle('has-drawer',opening);
    if(drawerHandle){
      drawerHandle.setAttribute('aria-expanded',opening?'true':'false');
      drawerHandle.title=opening?'Collapse PC drawer':'Expand PC drawer';
    }
    // Keep pcCam/pcTem visibility and their DOM content unchanged. In particular,
    // do NOT invoke openPcDrawer(), which would switch iTEM back to TEMCON.
    if(opening&&pcCam&&!pcCam.hidden&&pcCam.classList.contains('is-active')){
      var dt=document.getElementById('pc-drawer-title');if(dt)dt.textContent='PC · iTEM CAMERA';
      if(state.currentSection===3&&state.currentStep===48){
        showS3CameraSignal();drawBfCameraFocusPreview();
      }
    }
  }
  if(drawerHandle){
    drawerHandle.addEventListener('click',togglePcDrawerForLearner);
    drawerHandle.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();togglePcDrawerForLearner();}
    });
  }

  // Keep the old theory button functional.
  var theory=document.getElementById('guidedTheory'),theoryBtn=document.getElementById('guidedTheoryBtn'),theoryClose=document.getElementById('guidedTheoryClose'),theoryGot=document.getElementById('guidedTheoryGotIt'),theoryBg=document.getElementById('guidedTheoryBackdrop');
  function openTheory(){if(!theory)return;theory.hidden=false;void theory.offsetWidth;theory.classList.add('is-open');}
  function closeTheory(){if(!theory)return;theory.classList.remove('is-open');setTimeout(function(){theory.hidden=true;},180);}
  if(theoryBtn)theoryBtn.addEventListener('click',openTheory);if(theoryClose)theoryClose.addEventListener('click',closeTheory);if(theoryGot)theoryGot.addEventListener('click',closeTheory);if(theoryBg)theoryBg.addEventListener('click',closeTheory);

  document.addEventListener('visibilitychange',function(){if(document.hidden)stopPump();else if(state.pumpStarted&&!state.evacuationDone&&state.currentSection===2&&state.currentStep===5)startPump();});
  window.addEventListener('beforeunload',stopPump);

  window.addEventListener('resize',function(){refreshInstructionMarquee();});
  var r1Scroll=document.querySelector('#panel-r1 .ctl-panel__scroll'), stageDockHost=document.getElementById('sop-stage-dock');
  if(r1Scroll&&stageDockHost&&stageDockHost.parentNode!==r1Scroll){r1Scroll.appendChild(stageDockHost);}
  [].slice.call(document.querySelectorAll('#panel-l1 .ctl-panel__scroll,#panel-r1 .ctl-panel__scroll')).forEach(function(sc){
    var tid=null;sc.addEventListener('scroll',function(){if((state.currentSection!==3&&state.currentSection!==4)||!s3ActivePrimary)return;clearTimeout(tid);tid=setTimeout(function(){ensureS3ActiveVisible('smooth');},160);},{passive:true});
  });
  wireS3ViewerTabs();initS3PanelInteractions();wireFullscreen();showFullscreenReminder();
  var stageDock=document.getElementById('sop-stage-dock'),stageToggle=document.getElementById('sop-stage-dock-toggle'),stageLocator=document.getElementById('sop-stage-dock-locator');
  if(stageToggle&&stageDock){stageToggle.addEventListener('click',function(){var open=!stageDock.classList.contains('is-open');stageDock.classList.toggle('is-open',open);stageToggle.setAttribute('aria-expanded',open?'true':'false');if(open)setTimeout(function(){revealStageControl('smooth');},30);});}
  if(stageLocator){stageLocator.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();openS3Locator('stage-xy');});}
var lc=document.getElementById('sopLocatorClose');if(lc)lc.addEventListener('click',closeS3Locator);[].slice.call(document.querySelectorAll('[data-locator-close]')).forEach(function(e){e.addEventListener('click',closeS3Locator);});var pdh=document.getElementById('pc-drawer-handle');if(pdh)pdh.addEventListener('click',function(){setTimeout(syncPcLiveStatus,40);});setSessionControls(false);renderNav();setInstruction();updateProgress();closePcDrawer();wirePrestartExplore();startPrestartExplore();
})();
