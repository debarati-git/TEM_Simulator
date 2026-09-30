(function(){
  'use strict';

  var sections=[
    {id:1,title:'Safety Check and Instrument Startup',short:'Safety & Startup',implemented:true,steps:[
      {title:'Check chiller status',instruction:'Check if the chiller is ON in chiller room.',hint:'Verify the chiller image and displayed temperature before confirming.'},
      {title:'Confirm room conditions',instruction:'Confirm the room air conditioning is ON and the room temperature is approximately 20–22°C.',hint:''},
      {title:'Verify SIP vacuum',instruction:'Confirm the Sputter Ion Pump (SIP) unit vacuum is ≤ 2.5×10⁻⁵ Pa.',hint:'Read the SIP vacuum indication and confirm before continuing.'},
      {title:'Verify TEMCON readiness',instruction:'Verify the TEMCON screen shows HT READY, EVAC READY, and an accelerating voltage of 80 kV before proceeding.',hint:'The PC drawer opens automatically. Confirm HT READY, EVAC READY, and 80 kV only; no voltage ramp is performed here.'},
      {title:'Check anti-contamination trap',instruction:'Check and, if required, refill the liquid nitrogen in the anti-contamination trap.',hint:'Confirm the anti-contamination trap check before continuing.'},
      {title:'Allow system stabilization',instruction:'Allow the filament and system to stabilize for the recommended warm-up period according to the operating guidelines.',hint:''},
      {title:'Record startup in logbook',instruction:'Record instrument startup in the logbook, including date, time, and operator name.',hint:'Complete all startup logbook fields before saving.'}
    ]},
    {id:2,title:'Specimen Loading and Holder Insertion',short:'Specimen Loading',implemented:true,steps:[
      {title:'Inspect holder O-rings',instruction:'Inspect the holder O-rings for damage, dust, or old grease; clean with a lint-free wipe and re-grease lightly if required before use.',hint:'Inspect the O-ring area in the close-up modal and confirm.'},
      {title:'Confirm goniometer green lamp',instruction:'Confirm the goniometer green lamp is lit, indicating it is ready for holder loading. If it is not lit, do not attempt to insert the holder.',hint:'Verify the green ready lamp before continuing.'},
      {title:'Load TEM grid',instruction:'Open the holder cartridge, place the TEM grid sample-side up using fine anti-static tweezers, and close the retaining clip securely so the grid cannot shift in transit.',hint:'Complete the three actions in order.'},
      {title:'Insert holder to first stop',instruction:'Insert the specimen holder straight into the goniometer port following the guide key until the first mechanical stop. Do not force it. Support the holder until you hear 3 clicks.',hint:'Drag the holder toward the port. Three spaced click sounds play at the first stop.'},
      {title:'Set PUMP and complete evacuation',instruction:'Set the goniometer PUMP/AIR switch to PUMP to begin evacuation, then wait until the amber lamp goes OFF before continuing. Do not rotate or push the holder further while evacuation is in progress.',hint:'The roughing-pump rumble continues throughout evacuation. Continue only after the amber lamp goes OFF.'},
      {title:'Confirm EVC ready in TEMCON',instruction:'Confirm the EVC status shows READY in the TEMCON software before rotating and fully inserting the specimen holder.',hint:'The TEMCON drawer opens automatically. Verify EVC status is READY before continuing.'},
      {title:'Rotate and fully insert holder',instruction:'Rotate the specimen holder by 15° clockwise and then by 75° clockwise to complete insertion into the goniometer.',hint:'Use the highlighted rotation buttons in sequence. The holder images update as each rotation is completed.'},
      {title:'Select holder model in TEMCON',instruction:'Select the appropriate holder model in TEMCON using the pull-down menu on the upper right.',hint:'Open the highlighted Holder Model pull-down and select Single Tilt.'}
    ]},
    {id:3,title:'Bright Field Imaging',short:'Bright Field',implemented:true,steps:[
      {title:'High Voltage · Set target',instruction:'Set the Auto HT target voltage to 200 kV.',hint:'Select 200 kV in TEMCON High Voltage Control.'},
      {title:'High Voltage · Set step size',instruction:'Set the Auto HT voltage step size to 0.5 kV.',hint:'Select 0.5 kV.'},
      {title:'High Voltage · Set interval',instruction:'Set the Auto HT Time/Step to 10 s.',hint:'Select 10 s.'},
      {title:'High Voltage · Start ramp',instruction:'Press Start under Auto HT and allow the accelerating voltage to rise from 80 kV to 200 kV.',hint:'The real ramp duration is compressed in the simulator.'},
      {title:'High Voltage · HT ON',instruction:'After the target reaches 200 kV, press HT: ON and verify the HT status is ON.',hint:'HT ON is unlocked only after the ramp reaches 200 kV.'},
      {title:'Electron Source · Filament ON',instruction:'On High Voltage Control, press Filament: ON.',hint:'Filament current will begin rising after this action.'},
      {title:'Electron Source · Beam current',instruction:'Wait for the Beam Current indicator to stabilize at approximately 103 µA.',hint:'This observation step advances automatically when the simulated current reaches approximately 103 µA.'},
      {title:'Vacuum · Verify V2',instruction:'Make sure the image observation chamber isolation valve V2 is OPEN in the Valve Status window.',hint:'Open V2 before generating the electron beam.'},
      {title:'Beam · Turn BEAM ON',instruction:'Press BEAM on control panel L1 to turn on the electron beam.',hint:'The beam then reaches the fluorescent-screen path.'},
      {title:'Imaging Mode · TEM',instruction:'Select TEM imaging mode on control panel L1.',hint:'Only the TEM control is active for this step.'},
      {title:'Magnification · LOW MAG',instruction:'Select LOW MAG on control panel R1.',hint:'Use LOW MAG for locating the region of interest.'},
      {title:'Magnification · Survey range',instruction:'Rotate MAG/CAM L until the magnification is within approximately 1,000–5,000×.',hint:'Any value in the manual-specified survey range is accepted.'},
      {title:'Specimen · Locate thin region',instruction:'Use the specimen-stage trackball to move to a hole or thin region of the specimen.',hint:'Center the highlighted dummy feature for training.'},
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
      {title:'Z Correction · Sensitivity',instruction:'If required, adjust the Z-control sensitivity using the arrows next to Z in TEMCON.',hint:'This is optional; the workflow continues automatically if no change is needed.'},
      {title:'Z Correction · Wobbler ON',instruction:'Press MAG WOB X or MAG WOB Y on R1 to start the wobble.',hint:'Use either axis as specified in the manual.'},
      {title:'Z Correction · Minimize wobble',instruction:'While the wobbler is ON, use Z UP / Z DOWN until lateral motion is minimized.',hint:'The dummy feature wobble reduces as Z approaches the correct height.'},
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
      {title:'CL Astigmatism · Inspect shape',instruction:'Rotate BRIGHTNESS clockwise and anticlockwise through crossover to inspect the beam shape.',hint:'The dummy beam is intentionally elliptical before correction.'},
      {title:'CL Astigmatism · DEF/STIG X',instruction:'Adjust DEF/STIG X on L1 to reduce the X component of beam ellipticity.',hint:'Move the beam shape toward circular.'},
      {title:'CL Astigmatism · DEF/STIG Y',instruction:'Adjust DEF/STIG Y on R1 to reduce the Y component of beam ellipticity.',hint:'Complete the circularization.'},
      {title:'CL Astigmatism · Verify',instruction:'Rotate BRIGHTNESS back and forth through crossover and verify the beam remains approximately circular.',hint:'Check the correction on both sides of crossover.'},
      {title:'CL Astigmatism · COND STIG OFF',instruction:'Press COND STIG again to exit condenser-stigmator adjustment.',hint:'The corrected setting is retained.'},
      {title:'Acquisition · Select ROI',instruction:'Use the stage trackball to select and centre the final area of interest.',hint:'The dummy specimen image will later be replaced with the actual sample images.'},
      {title:'Acquisition · Final magnification',instruction:'With MAG 1 retained, use MAG/CAM L to set the required final imaging magnification.',hint:'No fixed final magnification is specified in the manual; make a deliberate selection.'},
      {title:'Acquisition · Spread beam',instruction:'Use BRIGHTNESS to spread the beam appropriately for image recording.',hint:'Set uniform illumination over the final field of view.'},
      {title:'Acquisition · AUTO contrast',instruction:'Press AUTO if automatic image-contrast adjustment is desired.',hint:'AUTO is optional and does not block progression.'},
      {title:'Acquisition · F1 screen UP',instruction:'Press F1 on R1 to lift the fluorescent screen and expose the transmitted beam to the camera.',hint:'The camera exposure path becomes active.'},
      {title:'Acquisition · Open iTEM',instruction:'Open iTEM software in the camera workstation.',hint:'A dummy iTEM interface is used until the actual screenshot is supplied.'},
      {title:'Acquisition · OBJ FOCUS',instruction:'Adjust OBJ FOCUS COARSE / FINE if needed while viewing the camera image.',hint:'This focus touch-up is optional.'},
      {title:'Acquisition · Video',instruction:'Click the Video icon in iTEM to start the live camera feed.',hint:'Live acquisition begins.'},
      {title:'Acquisition · Snapshot',instruction:'Click Snapshot in iTEM to capture the Bright Field image.',hint:'A dummy BF image is captured.'},
      {title:'Acquisition · F1 screen DOWN',instruction:'After acquiring the image, press F1 again to return the fluorescent screen.',hint:'Bright Field acquisition is complete; limit real camera exposure as required by the operating procedure.'}
    ]},
    {id:4,title:'Dark Field Imaging',short:'Dark Field',implemented:false,steps:[]},
    {id:5,title:'Selected Area Electron Diffraction (SAED) Mode',short:'SAED',implemented:false,steps:[]},
    {id:6,title:'High-Resolution TEM (HRTEM) Imaging Mode',short:'HRTEM',implemented:false,steps:[]},
    {id:7,title:'Instrument Shutdown',short:'Shutdown',implemented:false,steps:[]}
  ];

  var state={sample:null,currentSection:0,currentStep:0,unlockedThrough:0,sectionComplete:{},completed:{},gridStage:0,insertionDone:false,pumpStarted:false,evacuationDone:false,rotation15:false,rotation75:false,holderSeated:false,trackballMoved:false,pumpTimer:null};
  var bfState={mag:3000,mode:'image',featureX:35,featureY:65,z:-8,wobble:false,wobbleSeen:false,aperture:'',caX:5,caY:-4,c2:45,c2Moves:0,condX:4,condY:-3,condTest:false,beamX:5,beamY:-4,objX:4,objY:-3,focusCoarse:8,focusFine:2,finalFocusChecked:false,finalAstigChecked:false,captured:false};
  var SECTION1_STEP1_START_DELAY_MS=2000;
  var STEP_MODAL_READING_DELAY_MS=2000;
  var STEP4_PC_OBSERVE_DELAY_MS=7000;
  var FULLSCREEN_REMINDER_MS=4200;
  var audioCtx=null,pumpNodes=null,modalLocked=false,nextModalTimer=null;
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
        '<img class="sop-tour__room sop-tour__room--a" id="sopTourRoomA" src="../assets/images/microscope/diagram/tem-guided-actual-room.jpg" alt="TEM room">'+
        '<img class="sop-tour__room sop-tour__room--b" id="sopTourRoomB" src="../assets/images/sop/section1-lab-door.png" alt="Opposite side of TEM laboratory showing chiller-room door">'+
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
      hideSection1Tour();
      completeStep();
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
      hideSection1Tour();
      completeStep();
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
      hideSection1Tour();
      completeStep();
    },5900));
  }

  function ensureAudio(){try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}catch(e){}}
  function clickSound(delay){
    ensureAudio();if(!audioCtx)return;
    var t=audioCtx.currentTime+(delay||0);
    var master=audioCtx.createGain();master.gain.setValueAtTime(.0001,t);master.gain.exponentialRampToValueAtTime(.42,t+.006);master.gain.exponentialRampToValueAtTime(.0001,t+.14);master.connect(audioCtx.destination);
    var low=audioCtx.createOscillator(),lowGain=audioCtx.createGain();low.type='square';low.frequency.setValueAtTime(210,t);low.frequency.exponentialRampToValueAtTime(72,t+.09);lowGain.gain.value=.72;low.connect(lowGain).connect(master);low.start(t);low.stop(t+.15);
    var snap=audioCtx.createOscillator(),snapGain=audioCtx.createGain();snap.type='triangle';snap.frequency.setValueAtTime(1150,t);snap.frequency.exponentialRampToValueAtTime(420,t+.045);snapGain.gain.value=.28;snap.connect(snapGain).connect(master);snap.start(t);snap.stop(t+.055);
  }
  function threeClicks(sel){var q=sel?(sel+' span'):'.sop-clicks span, .sop-vscene__clicks span';var dots=[].slice.call(document.querySelectorAll(q));dots.forEach(function(x){x.classList.remove('is-hit');});[0,1,2].forEach(function(d,i){clickSound(d);setTimeout(function(){if(dots[i])dots[i].classList.add('is-hit');},d*1000);});}
  function startPump(){
    ensureAudio();if(!audioCtx||pumpNodes)return;
    var master=audioCtx.createGain();master.gain.value=.105;
    var compressor=audioCtx.createDynamicsCompressor();compressor.threshold.value=-24;compressor.knee.value=18;compressor.ratio.value=5;compressor.attack.value=.01;compressor.release.value=.18;
    master.connect(compressor).connect(audioCtx.destination);
    var o1=audioCtx.createOscillator(),o2=audioCtx.createOscillator(),g1=audioCtx.createGain(),g2=audioCtx.createGain();
    o1.type='sawtooth';o1.frequency.value=48;g1.gain.value=.52;o1.connect(g1).connect(master);
    o2.type='triangle';o2.frequency.value=96;g2.gain.value=.24;o2.connect(g2).connect(master);
    var buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),data=buffer.getChannelData(0);for(var i=0;i<data.length;i++){data[i]=(Math.random()*2-1)*.55;}
    var noise=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),ng=audioCtx.createGain();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=260;filter.Q.value=.8;ng.gain.value=.13;noise.connect(filter).connect(ng).connect(master);
    var lfo=audioCtx.createOscillator(),lfoGain=audioCtx.createGain();lfo.type='sine';lfo.frequency.value=5.2;lfoGain.gain.value=.025;lfo.connect(lfoGain).connect(master.gain);
    o1.start();o2.start();noise.start();lfo.start();pumpNodes={master:master,o1:o1,o2:o2,noise:noise,lfo:lfo};
  }
  function stopPump(){if(!pumpNodes)return;try{pumpNodes.master.gain.cancelScheduledValues(audioCtx.currentTime);pumpNodes.master.gain.setValueAtTime(Math.max(.0001,pumpNodes.master.gain.value||.08),audioCtx.currentTime);pumpNodes.master.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.32);pumpNodes.o1.stop(audioCtx.currentTime+.36);pumpNodes.o2.stop(audioCtx.currentTime+.36);pumpNodes.noise.stop(audioCtx.currentTime+.36);pumpNodes.lfo.stop(audioCtx.currentTime+.36);}catch(e){}pumpNodes=null;}


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
      if(state.currentSection!==2||state.currentStep!==3)return;
      if(viewportScene)viewportScene.setAttribute('data-step4-phase','photo1');
    },5200));
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==3)return;
      if(viewportScene)viewportScene.setAttribute('data-step4-phase','photo2');
    },7850));
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==3)return;
      if(viewportScene)viewportScene.setAttribute('data-step4-phase','photo3');
    },10650));

    // Only after the final image is fully settled: play the three mechanical clicks.
    sceneTimers.push(setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==3)return;
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
        if(state.currentSection!==2||state.currentStep!==3)return;
        hideViewportScene();
        completeStep();
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
    setViewportControls('<div class="sop-pump-control-row"><button type="button" class="sop-pump-horizontal" id="sopViewportPumpToggle" aria-pressed="false"><span class="sop-pump-horizontal__label">AIR</span><span class="sop-pump-horizontal__track"><span class="sop-pump-horizontal__knob"></span></span><span class="sop-pump-horizontal__label">PUMP</span></button><button class="sop-flow-btn sop-flow-btn--success" id="sopViewportContinuePump" disabled>Set PUMP to begin</button></div>');
    var sw=document.getElementById('sopViewportPumpToggle'),cont=document.getElementById('sopViewportContinuePump');
    if(sw)sw.onclick=function(){
      if(state.pumpStarted)return;
      ensureAudio();state.pumpStarted=true;startPump();
      sw.classList.add('is-pump');sw.setAttribute('aria-pressed','true');sw.disabled=true;
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
  function updateProgress(){var total=sections.reduce(function(n,s){return n+(s.implemented?s.steps.length:0);},0);progress.style.width=Math.min(100,totalCompleted()/Math.max(1,total)*100)+'%';}
  function currentSection(){return state.currentSection?sections[state.currentSection-1]:null;}
  function currentStep(){var s=currentSection();return s&&s.steps[state.currentStep];}
  function key(){return state.currentSection+'-'+(state.currentStep+1);}

  function renderNav(){
    nav.innerHTML=sections.map(function(s){var unlocked=state.sample&&s.id<=state.unlockedThrough;var active=s.id===state.currentSection;var done=!!state.sectionComplete[s.id];return '<button class="sop-mini-tab'+(active?' is-active':'')+(done?' is-complete':'')+'" data-section="'+s.id+'" title="'+s.title.replace(/"/g,'&quot;')+'" '+(!unlocked?'disabled':'')+'><span class="sop-mini-tab__n">Section '+s.id+'</span><span class="sop-mini-tab__t">'+s.short+'</span><span class="sop-mini-tab__state">'+(done?'✓':(!unlocked?'🔒':(s.implemented?'':'…')))+'</span></button>';}).join('');
    [].slice.call(nav.querySelectorAll('[data-section]')).forEach(function(b){b.addEventListener('click',function(){var id=Number(b.dataset.section);if(!state.sample||id>state.unlockedThrough)return;openSection(id);});});
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
    if(!s){setInstructionText('Select an unlocked section.');hint.textContent='';hint.style.display='none';return;}
    if(state.sectionComplete[s.id]){setInstructionText('Section '+s.id+' complete: '+s.title+'.');hint.textContent='';hint.style.display='none';return;}
    if(!s.implemented){setInstructionText(s.title+' — workflow content is awaiting the detailed operating procedure.');hint.textContent='';hint.style.display='none';return;}
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
    modalTag.textContent=opts.tag||'SOP CHECK';modalTitle.textContent=opts.title||'';modalStep.textContent=opts.step||'';modalBody.innerHTML=opts.body||'';modalFooter.innerHTML=opts.footer||'';modal.classList.add('is-open');
  }
  function closeModal(force){if(modalLocked&&!force)return;if(chillerSwapTimer){clearTimeout(chillerSwapTimer);chillerSwapTimer=null;}modal.classList.remove('is-open');modalBody.innerHTML='';modalFooter.innerHTML='';modalLocked=false;resetModalPosition();}
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
      if(state.currentStep===3)state.insertionDone=false;
      if(state.currentStep===4){if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}state.pumpStarted=false;state.evacuationDone=false;stopPump();}
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
    openModal({locked:true,tag:'SELECT SAMPLE',title:'Choose specimen type',step:'Required before Section 1',body:'<p class="sop-flow-modal__copy">Select the specimen type for this guided operating session. Section 1 remains locked until a sample is selected.</p><div class="sop-sample-grid"><button class="sop-sample-card" data-sample="nanoparticles"><div class="sop-sample-icon">●</div><strong>Nanoparticles / Suspension</strong><span>Routine nanoparticle imaging specimen.</span></button><button class="sop-sample-card" data-sample="bulk-metallic"><div class="sop-sample-icon">▦</div><strong>Bulk Metallic</strong><span>Electropolished metallic specimen.</span></button><button class="sop-sample-card" data-sample="cross-section"><div class="sop-sample-icon">◫</div><strong>Cross-section</strong><span>Focused Ion Beam (FIB) prepared cross-section.</span></button></div>',footer:''});
    [].slice.call(modal.querySelectorAll('[data-sample]')).forEach(function(b){b.addEventListener('click',function(){ensureAudio();state.sample=b.dataset.sample;sampleInd.textContent=({nanoparticles:'NANOPARTICLES', 'bulk-metallic':'BULK METALLIC', 'cross-section':'CROSS-SECTION'}[state.sample]||'SELECTED');state.unlockedThrough=1;state.currentSection=1;state.currentStep=0;closeModal(true);setSessionControls(true);renderNav();setInstruction();setTimeout(showCurrentStep,SECTION1_STEP1_START_DELAY_MS);});});
  }

  function openSection(id){clearHtRampTimers();cleanupHtRampUi();clearBfTimers();clearS3PcPanel();hideBfScene();if(typeof hideS3ApertureOverlay==='function')hideS3ApertureOverlay();closePcDrawer();stopPump();hideViewportScene();hideSection1Tour();if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}if(id===2){state.gridStage=0;state.insertionDone=false;state.pumpStarted=false;state.evacuationDone=false;state.rotation15=false;state.rotation75=false;state.holderSeated=false;state.trackballMoved=false;}if(id===3){resetBfState();}state.currentSection=id;state.currentStep=0;renderNav();setInstruction();if(state.sectionComplete[id])return;if(!sections[id-1].implemented)return;setTimeout(showCurrentStep,STEP_MODAL_READING_DELAY_MS);}

  function completeStep(){
    state.completed[key()]=true;updateProgress();
    if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}
    var s=currentSection();
    if(state.currentStep<s.steps.length-1){
      state.currentStep++;setInstruction();renderNav();
      // Reading gap: keep the new instruction visible before opening its modal.
      var nextDelay=(state.currentSection===3?(state.currentStep===40?180:650):STEP_MODAL_READING_DELAY_MS);
      nextModalTimer=setTimeout(function(){nextModalTimer=null;showCurrentStep();},nextDelay);
    }else{
      state.sectionComplete[s.id]=true;state.unlockedThrough=Math.max(state.unlockedThrough,Math.min(7,s.id+1));renderNav();setInstruction();
      nextModalTimer=setTimeout(function(){nextModalTimer=null;showSectionComplete(s);},1200);
    }
  }

  function showSectionComplete(s){openModal({locked:true,tag:'SECTION COMPLETE',title:'Section '+s.id+' completed',step:s.title,body:'<p class="sop-flow-modal__copy">All required steps in <strong>'+s.title+'</strong> have been completed. Section '+Math.min(7,s.id+1)+' is now unlocked.</p>',footer:s.id<7?'<button class="sop-flow-btn sop-flow-btn--success" id="sopNextSection">Proceed to Section '+(s.id+1)+'</button>':'<button class="sop-flow-btn sop-flow-btn--success" id="sopFinish">Finish</button>'});var n=document.getElementById('sopNextSection');if(n)n.addEventListener('click',function(){closeModal(true);openSection(s.id+1);});var f=document.getElementById('sopFinish');if(f)f.addEventListener('click',function(){closeModal(true);});}

  function confirmFooter(label){return '<button class="sop-flow-btn sop-flow-btn--success" id="sopConfirmStep">'+label+'</button>';}
  function bindConfirm(){var b=document.getElementById('sopConfirmStep');if(b)b.addEventListener('click',function(){ensureAudio();closeModal(true);completeStep();});}

  function showCurrentStep(){
    var s=currentSection();if(!s||state.sectionComplete[s.id]||!s.implemented)return;setInstruction();renderNav();if(s.id===1)showSection1();else if(s.id===2)showSection2();else if(s.id===3)showSection3();
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
              var c=document.getElementById('sopHtRampContinue');if(c){c.hidden=false;c.disabled=false;c.onclick=function(){ensureAudio();cleanupHtRampUi();closePcDrawer();completeStep();};}
            }
          },120);
        }
      },120);
    };
  }

  function showSection1Step4Placeholder(){
    cleanupHtRampUi();closeModal(true);hideSection1Tour();hideViewportScene();openPcDrawer();
    var hg=document.querySelector('.temcon-group--hv'),vg=document.querySelector('.temcon-group--vacuum');
    var status=document.getElementById('pc-ht-status'),val=document.getElementById('pc-ht-value'),acc=document.getElementById('pc-acc-value');
    var evc=document.getElementById('pc-evc-status'),vac=document.getElementById('pc-vac-text');
    if(hg)hg.classList.add('sop-ht-focus');if(vg)vg.classList.add('sop-evc-focus');
    if(status)status.textContent='READY';if(val)val.textContent='80.00 kV';if(acc)acc.textContent='80 kV';if(evc)evc.textContent='READY';if(vac)vac.textContent='READY';
    setTimeout(function(){
      if(state.currentSection!==1||state.currentStep!==3)return;
      openModal({locked:true,tag:'SECTION 1 · TEMCON READINESS',title:'Verify TEMCON readiness',step:'Step 4 of 7',body:'<p class="sop-flow-modal__copy">Verify the TEMCON screen shows <strong>HT READY</strong>, <strong>EVAC READY</strong>, and an accelerating voltage of <strong>80 kV</strong>.</p><p class="sop-flow-modal__copy" style="margin-top:10px">No HT voltage ramp is performed in this step.</p>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopConfirmHtRampPlaceholder">Confirm TEMCON readiness</button>'});
      var b=document.getElementById('sopConfirmHtRampPlaceholder');if(b)b.addEventListener('click',function(){ensureAudio();if(hg)hg.classList.remove('sop-ht-focus');if(vg)vg.classList.remove('sop-evc-focus');closeModal(true);closePcDrawer();completeStep();});
    },1800);
  }

  function showSection1(){
    var n=state.currentStep+1,st=currentStep();hideViewportScene();closePcDrawer();
    if(n!==1&&n!==3&&n!==5)hideSection1Tour();
    if(n===1){runSection1Step1Tour();}
    else if(n===2){openModal({locked:true,tag:'SECTION 1 · SAFETY',title:st.title,step:'Step 2 of 7',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p>',footer:confirmFooter('Confirm room condition')});bindConfirm();}
    else if(n===3){runSection1Step3Tour();}
    else if(n===4){showSection1Step4Placeholder();}
    else if(n===5){runSection1Step5Tour();}
    else if(n===6){
      openModal({locked:true,tag:'SECTION 1 · STARTUP',title:st.title,step:'Step 6 of 7',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p><div class="sop-stabilize"><div class="sop-stabilize__bar"><span id="sopStabilizeBar"></span></div><div class="sop-stabilize__read" id="sopStabilizeRead">Stabilizing · 0%</div></div>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopStabilizeContinue" disabled>Stabilizing…</button>'});
      var bar=document.getElementById('sopStabilizeBar'),read=document.getElementById('sopStabilizeRead'),btn=document.getElementById('sopStabilizeContinue'),t0=Date.now(),dur=8000;
      var timer=setInterval(function(){if(!document.body.contains(bar)){clearInterval(timer);return;}var pct=Math.min(100,(Date.now()-t0)/dur*100);bar.style.width=pct+'%';read.textContent='Stabilizing · '+Math.round(pct)+'%';if(pct>=100){clearInterval(timer);read.textContent='Stabilization period complete';btn.disabled=false;btn.textContent='Confirm stabilization';}},120);
      btn.addEventListener('click',function(){if(btn.disabled)return;closeModal(true);completeStep();});
    }
    else if(n===7){var d=new Date();var date=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');var time=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');openModal({locked:true,tag:'SECTION 1 · LOGBOOK',title:st.title,step:'Step 7 of 7',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p><div class="sop-log-grid"><div class="sop-log-field"><label>Date</label><input id="sopLogDate" type="date" value="'+date+'"></div><div class="sop-log-field"><label>Time</label><input id="sopLogTime" type="time" value="'+time+'"></div><div class="sop-log-field sop-log-field--wide"><label>Operator name</label><input id="sopLogName" type="text" placeholder="Enter operator name"></div></div>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopSaveLog" disabled>Save startup log</button>'});var name=document.getElementById('sopLogName'),save=document.getElementById('sopSaveLog');function valid(){save.disabled=!name.value.trim();}name.addEventListener('input',valid);save.addEventListener('click',function(){if(!name.value.trim())return;closeModal(true);completeStep();});}
  }

  function openPcDrawer(){if(!drawer)return;var dt=document.getElementById('pc-drawer-title');if(dt)dt.textContent='PC · TEM CONTROL';drawer.classList.add('is-open');if(drawerHandle){drawerHandle.setAttribute('aria-expanded','true');drawerHandle.title='Collapse PC drawer';}if(pcTem){pcTem.hidden=false;pcTem.classList.add('is-active');pcTem.setAttribute('aria-hidden','false');}if(pcCam){pcCam.hidden=true;pcCam.classList.remove('is-active');}if(viewerStage)viewerStage.classList.add('has-drawer');var tabs=[].slice.call(document.querySelectorAll('[data-temcon-tab]'));tabs.forEach(function(b){var on=b.dataset.temconTab==='standard';b.classList.toggle('is-selected',on);b.setAttribute('aria-selected',on?'true':'false');});[].slice.call(document.querySelectorAll('[data-temcon-page]')).forEach(function(p){var on=p.dataset.temconPage==='standard';p.hidden=!on;p.classList.toggle('is-selected',on);});}
  function closePcDrawer(){if(!drawer)return;drawer.classList.remove('is-open');if(drawerHandle)drawerHandle.setAttribute('aria-expanded','false');if(pcTem)pcTem.setAttribute('aria-hidden','true');if(viewerStage)viewerStage.classList.remove('has-drawer');var hg=document.querySelector('.temcon-group--hv');if(hg)hg.classList.remove('sop-ht-focus');var vg=document.querySelector('.temcon-group--vacuum');if(vg)vg.classList.remove('sop-evc-focus');var sp=document.querySelector('[data-temcon-page="stage"]');if(sp)sp.classList.remove('sop-holder-model-step');var hm=document.getElementById('pc-holder-model-pulldown');if(hm)hm.hidden=true;[].slice.call(document.querySelectorAll('[data-action="holder-type"]')).forEach(function(b){b.disabled=false;b.removeAttribute('aria-disabled');});}
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
    else if(n===3){hideViewportScene();openModal({locked:true,tag:'SECTION 2 · GRID LOADING',title:st.title,step:'Step 3 of 8',body:'<p class="sop-flow-modal__copy">'+st.instruction+'</p><div class="sop-flow-modal__visual"><div style="width:min(760px,100%)"><img src="../assets/images/sop/section2-step3-grid-loading.png" alt="Actual holder cartridge photograph showing TEM grid loading with tweezers" style="margin-bottom:16px;"><div class="sop-grid-checks"><label class="sop-grid-check"><input type="checkbox" id="gridOpen"><span>1 · Open cartridge</span></label><label class="sop-grid-check is-disabled"><input type="checkbox" id="gridPlace" disabled><span>2 · Place grid sample-side up</span></label><label class="sop-grid-check is-disabled"><input type="checkbox" id="gridClose" disabled><span>3 · Close retaining clip</span></label></div></div></div>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="gridContinue" disabled>Continue</button>'});bindGrid();}
    else if(n===4){runSection2Step4();}
    else if(n===5){runSection2Step5();}
    else if(n===6){runSection2Step7Evc();}
    else if(n===7){runSection2Step8Rotation();}
    else if(n===8){runSection2Step10HolderModel();}
  }
  function selectTemconPage(name){
    var tabs=[].slice.call(document.querySelectorAll('[data-temcon-tab]'));
    tabs.forEach(function(b){var on=b.dataset.temconTab===name;b.classList.toggle('is-selected',on);b.setAttribute('aria-selected',on?'true':'false');});
    [].slice.call(document.querySelectorAll('[data-temcon-page]')).forEach(function(p){var on=p.dataset.temconPage===name;p.hidden=!on;p.classList.toggle('is-selected',on);});
  }
  function runSection2Step7Evc(){
    hideViewportScene();closeModal(true);openPcDrawer();selectTemconPage('stage');
    var evc=document.getElementById('pc-evc-status'),vac=document.querySelector('.temcon-group--vacuum'),air=document.getElementById('pc-vac-text');
    if(evc)evc.textContent='READY';if(air)air.textContent='READY';if(vac)vac.classList.add('sop-evc-focus');
    setTimeout(function(){
      if(state.currentSection!==2||state.currentStep!==5)return;
      openModal({locked:true,tag:'SECTION 2 · TEMCON',title:'Confirm EVC READY',step:'Step 6 of 8',body:'<p class="sop-flow-modal__copy">Verify the highlighted <strong>Specimen Exchange / Vacuum</strong> area in TEMCON. Confirm that <strong>EVC Status</strong> shows <strong>READY</strong> before rotating and fully inserting the holder.</p>',footer:'<button class="sop-flow-btn sop-flow-btn--success" id="sopConfirmEvc">Confirm EVC READY</button>'});
      var b=document.getElementById('sopConfirmEvc');if(b)b.addEventListener('click',function(){if(vac)vac.classList.remove('sop-evc-focus');closeModal(true);closePcDrawer();completeStep();});
    },3600);
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

    // Existing Step-4 final position first, then gently fade to the first new fully-insertion image.
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
      sceneTimers.push(setTimeout(function(){if(state.currentSection!==2||state.currentStep!==6)return;hideViewportScene();completeStep();},3900));
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
      var b=document.getElementById('sopConfirmFilamentPlaceholder');if(b)b.addEventListener('click',function(){ensureAudio();if(hg)hg.classList.remove('sop-ht-focus');closeModal(true);closePcDrawer();completeStep();});
    },1800);
  }

  function runSection2Step10HolderModel(){
    closeModal(true);hideViewportScene();openPcDrawer();selectTemconPage('stage');
    var stagePage=document.querySelector('[data-temcon-page="stage"]');
    var menu=document.getElementById('pc-holder-model-pulldown');
    var select=document.getElementById('pc-holder-model-select');
    var feedback=document.getElementById('pc-holder-model-feedback');
    var confirm=document.getElementById('pc-holder-model-confirm');
    var holderStatus=document.getElementById('pc-holder-status');
    if(stagePage)stagePage.classList.add('sop-holder-model-step');
    if(menu)menu.hidden=false;
    if(select){select.value='';select.disabled=false;}
    if(feedback){feedback.textContent='Select the holder model used for this specimen holder.';feedback.className='temcon-holder-model__feedback';}
    if(confirm){confirm.disabled=true;}
    var oldButtons=[].slice.call(document.querySelectorAll('[data-action="holder-type"]'));
    oldButtons.forEach(function(b){b.disabled=true;b.setAttribute('aria-disabled','true');});
    if(select)select.onchange=function(){
      ensureAudio();
      var ok=select.value==='single-tilt';
      if(confirm)confirm.disabled=!ok;
      if(feedback){
        feedback.textContent=ok?'Single Tilt holder selected. Confirm to complete specimen loading.':'This workflow uses the Single Tilt holder. Select Single Tilt.';
        feedback.className='temcon-holder-model__feedback '+(ok?'is-ready':'is-warning');
      }
      if(holderStatus)holderStatus.textContent=ok?'SINGLE TILT SELECTED':'NOT SELECTED';
    };
    if(confirm)confirm.onclick=function(){
      if(!select||select.value!=='single-tilt')return;
      ensureAudio();confirm.disabled=true;
      if(stagePage)stagePage.classList.remove('sop-holder-model-step');
      if(menu)menu.hidden=true;
      oldButtons.forEach(function(b){b.disabled=false;b.removeAttribute('aria-disabled');});
      closePcDrawer();
      completeStep();
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
    var beamLamp=document.getElementById('pc-beam-lamp');if(beamLamp){beamLamp.classList.toggle('is-on',beam);var bs=beamLamp.querySelector('strong');if(bs)bs.textContent=beam?'ON':'OFF';}
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
  function closeS3Locator(){var m=document.getElementById('sopControlLocator');if(m){m.classList.remove('is-open');m.setAttribute('aria-hidden','true');}}
  function openS3Locator(controlKey){
    var cfg=s3LocatorMap[controlKey],m=document.getElementById('sopControlLocator');if(!cfg||!m)return;
    var img=document.getElementById('sopLocatorImage'),hl=document.getElementById('sopLocatorHighlight'),title=document.getElementById('sopLocatorTitle'),note=document.getElementById('sopLocatorNote');
    if(img){
      img.src=cfg.panel==='l1'?'../assets/images/sop/section3-l1-modal-reference.png':(cfg.panel==='r1'?'../assets/images/sop/section3-r1-modal-reference.png':'../assets/images/sop/section3-spec-control-actual.png');
    }
    if(title)title.textContent=(cfg.panel==='l1'?'L1 · ':(cfg.panel==='r1'?'R1 · ':'SPECIMEN STAGE · '))+cfg.label.replace('SPEC CONTROL · ','');
    if(note)note.textContent=cfg.note||'Highlighted area shows the active control on the actual TEM panel.';
    if(hl){hl.style.left=cfg.x+'%';hl.style.top=cfg.y+'%';hl.style.width=cfg.w+'%';hl.style.height=cfg.h+'%';}
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
    if(!el||!document.body.contains(el)||state.currentSection!==3)return;
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
    var t=setTimeout(function(){if(state.currentSection!==sec||state.currentStep!==step){s3StepCompleting=false;return;}if(before)before();completeStep();},delay||650);bfTimers.push(t);
  }
  function initS3PanelInteractions(){
    if(s3PanelInit)return;s3PanelInit=true;if(!(window.TEM&&TEM.controlsUI))return;
    [].slice.call(document.querySelectorAll('[data-action]')).forEach(function(btn){btn.addEventListener('click',function(){if(state.currentSection!==3)return;var ctl=btn.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['action:'+btn.dataset.action];if(fn)fn(btn);});});
    ['brightness','focus-coarse','focus-fine'].forEach(function(name){var el=document.querySelector('[data-knob="'+name+'"]');if(!el)return;var min=Number(el.dataset.min||0),max=Number(el.dataset.max||100),value=Number(el.dataset.value||0);s3KnobHandles[name]=TEM.controlsUI.bindKnob(el,{min:min,max:max,value:value,onChange:function(v){if(state.currentSection!==3)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['knob:'+name];if(fn)fn(v);}});});
    [].slice.call(document.querySelectorAll('[data-defstig-axis]')).forEach(function(el){var axis=el.dataset.defstigAxis;var min=Number(el.dataset.min||-50),max=Number(el.dataset.max||50);s3KnobHandles['defstig-'+axis]=TEM.controlsUI.bindKnob(el,{min:min,max:max,value:0,onChange:function(v){if(state.currentSection!==3)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['defstig:'+axis];if(fn)fn(v);}});});
    ['stage-xy','aperture-align'].forEach(function(name){var el=document.querySelector('[data-trackpad="'+name+'"]');if(!el)return;var rr=(el.dataset.range||'-50,50').split(',').map(Number);s3PadHandles[name]=TEM.controlsUI.bindTrackpad(el,{rangeX:[rr[0],rr[1]],rangeY:[rr[0],rr[1]],valueX:0,valueY:0,onChange:function(pos){if(state.currentSection!==3)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['pad:'+name];if(fn)fn(pos);}});});
  }
  function ensureBfScene(){
    if(bfScene||!viewScreen)return;
    var w=document.createElement('div');w.id='sopBfScene';w.className='sop-bf-scene sop-bf-scene--screen';w.hidden=true;
    w.innerHTML='<div class="sop-bf-screen" id="sopBfScreen">'
      +'<img class="sop-bf-specimen" id="sopBfSpecimen" src="../assets/images/sop/bf-midmag-survey.png" alt="Bright field specimen view">'
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
  function showBfScene(){closeModal(true);closePcDrawer();hideViewportScene();hideSection1Tour();ensureBfScene();clearBfTimers();if(!bfScene)return;bfScene.hidden=false;bfScene.className='sop-bf-scene sop-bf-scene--screen';bfScene.classList.remove('is-fluorescent');if(viewEmpty)viewEmpty.style.display='none';setViewer('screen');bfSetSpecimenImage(bfResolveImageKey());bfRender();syncPcLiveStatus();}
  function bfSetStatus(text){if(bfStatus){bfStatus.textContent='';bfStatus.style.display='none';}}
  function updateBfDummyCue(){
    if(!bfDummyBadge && !bfStepIndicator) return;
    var n=(state.currentSection===3)?(state.currentStep+1):0;
    var label='DUMMY SAMPLE IMAGE', title='', sub='';
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
  function clearS3PcPanel(){var p=document.getElementById('sopS3PcPanel');if(p)p.remove();var v=document.getElementById('sopS3ValvePanel');if(v)v.remove();var it=document.getElementById('sopItemPanel');if(it)it.remove();var legacy=document.querySelector('.pc-cam-controls');if(legacy)legacy.style.display='';}
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
  function drawCapturedBf(){var cv=document.getElementById('pc-cam-canvas');if(!cv)return;var ctx=cv.getContext('2d'),img=new Image();img.onload=function(){ctx.clearRect(0,0,cv.width,cv.height);ctx.filter='grayscale(1) contrast(1.18)';ctx.drawImage(img,0,0,cv.width,cv.height);ctx.filter='none';ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='16px sans-serif';ctx.fillText('BF · '+Number(bfState.mag).toLocaleString()+'×',16,28);};img.src=BF_SPECIMEN_IMAGES.acquire;}
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
  var BF_MAG_VALUES=[1000,3000,5000,8000,20000,40000,80000,100000];
  /* v4.8.9 — magnification-dependent specimen image map */
  var BF_SPECIMEN_IMAGES={
    lowmag:  '../assets/images/sop/bf-lowmag-grid.png',
    midmag:  '../assets/images/sop/bf-midmag-survey.png',
    eucentric:'../assets/images/sop/bf-eucentric.png',
    aperture:'../assets/images/sop/bf-aperture.png',
    align:   '../assets/images/sop/bf-alignment.png',
    highmag: '../assets/images/sop/bf-highmag.png',
    acquire: '../assets/images/sop/bf-acquisition.png',
    fallback:'../assets/images/sop/bf-midmag-survey.png'
  };
  var bfCurrentImgKey='';
  function bfSetSpecimenImage(key){
    if(!bfSpecimen||bfCurrentImgKey===key)return;
    var src=BF_SPECIMEN_IMAGES[key]||BF_SPECIMEN_IMAGES.fallback;
    bfCurrentImgKey=key;
    bfSpecimen.style.opacity='0';
    setTimeout(function(){bfSpecimen.src=src;bfSpecimen.onload=function(){bfSpecimen.style.opacity='';};},120);
  }
  /* Resolve which image key to use for current step context */
  function bfResolveImageKey(){
    var n=state.currentStep+1;
    /* Steps 1-9: PC drawer, no specimen visible */
    if(n<=9) return 'midmag';
    /* Step 10: screen cover removal — low-mag initial beam */
    if(n===10) return 'lowmag';
    /* Steps 11-15: LOW MAG survey, grid overview */
    if(n>=11&&n<=15) return 'lowmag';
    /* Steps 16-21: Spot/Alpha, MAG 1 at 40k — mid-mag survey */
    if(n>=16&&n<=21) return 'midmag';
    /* Steps 22-28: Eucentric height — feature centering + wobble */
    if(n>=22&&n<=28) return 'eucentric';
    /* Steps 29-32: Condenser aperture — beam disk pattern */
    if(n>=29&&n<=32) return 'aperture';
    /* Steps 33-38: Beam shift/center — alignment pattern */
    if(n>=33&&n<=38) return 'align';
    /* Steps 39-45: Cond stig — back to mid-mag specimen view */
    if(n>=39&&n<=45) return 'midmag';
    /* Steps 46-48: Final imaging — high-mag */
    if(n>=46&&n<=48) return 'highmag';
    /* Steps 49-50: AUTO + F1 — still high-mag on screen */
    if(n>=49&&n<=50) return 'highmag';
    /* Steps 51-55: Camera/iTEM acquisition — CCD view */
    if(n>=51) return 'acquire';
    return 'midmag';
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
      +'<img class="sop-bf-specimen" id="sopBfSpecimen" src="../assets/images/sop/bf-midmag-survey.png" alt="Bright field specimen view">'
      +'<div class="sop-bf-step-indicator" id="sopBfStepIndicator"></div>'+'<div class="sop-dummy-badge" id="sopBfDummyBadge">DUMMY SAMPLE IMAGE</div>'
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
    closeModal(true);closePcDrawer();hideViewportScene();hideSection1Tour();ensureBfScene();clearBfTimers();
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
        if(state.currentSection!==3)return;var ctl=btn.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;
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
        if(state.currentSection!==3)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;
        var fn=s3Handlers['knob:'+name];if(fn)fn(v);
      }});
    });
    [].slice.call(document.querySelectorAll('[data-defstig-axis]')).forEach(function(el){
      var axis=el.dataset.defstigAxis,min=Number(el.dataset.min||-50),max=Number(el.dataset.max||50);
      s3KnobHandles['defstig-'+axis]=TEM.controlsUI.bindKnob(el,{min:min,max:max,value:0,onChange:function(v){
        if(state.currentSection!==3)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['defstig:'+axis];if(fn)fn(v);
      }});
    });
    ['stage-xy','aperture-align'].forEach(function(name){var el=document.querySelector('[data-trackpad="'+name+'"]');if(!el)return;var rr=(el.dataset.range||'-50,50').split(',').map(Number);s3PadHandles[name]=TEM.controlsUI.bindTrackpad(el,{rangeX:[rr[0],rr[1]],rangeY:[rr[0],rr[1]],valueX:0,valueY:0,onChange:function(pos){if(state.currentSection!==3)return;var ctl=el.closest('.ctl');if(ctl&&!ctl.classList.contains('is-active'))return;var fn=s3Handlers['pad:'+name];if(fn)fn(pos);}});});
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
    var n=state.currentStep+1;s3StepCompleting=false;hideViewportScene();hideSection1Tour();clearS3PcPanel();s3LockControls();
    /* v4.8.11: dummy condenser-aperture hardware is used only through displayed Step 30. */
    if(n<28||n>30)hideS3ApertureOverlay();
    switch(n){
      case 1:return runBFAtomic01();case 2:return runBFAtomic02();case 3:return runBFAtomic03();case 4:return runBFAtomic04();case 5:return runBFAtomic05();
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

  function runBFAtomic01(){
    s3PreparePcStandard();var e=document.getElementById('pc-autoht-target');if(!e)return;e.value=String(bfState.htTarget||80);s3PcTarget(e);
    e.onchange=function(){bfState.htTarget=Number(e.value);if(bfState.htTarget===200){s3PcDone(e);s3Complete(350);}};
  }
  function runBFAtomic02(){
    s3PreparePcStandard();var e=document.getElementById('pc-autoht-step');if(!e)return;e.value=String(bfState.htStep||1);s3PcTarget(e);
    e.onchange=function(){bfState.htStep=Number(e.value);if(bfState.htStep===0.5){s3PcDone(e);s3Complete(350);}};
  }
  function runBFAtomic03(){
    s3PreparePcStandard();var e=document.getElementById('pc-autoht-time');if(!e)return;e.value=String(bfState.htTime||1);s3PcTarget(e);
    e.onchange=function(){bfState.htTime=Number(e.value);if(bfState.htTime===10){s3PcDone(e);s3Complete(350);}};
  }
  function runBFAtomic04(){
    s3PreparePcStandard();var start=document.getElementById('pc-autoht-start'),status=document.getElementById('pc-ht-status'),val=document.getElementById('pc-ht-value'),acc=document.getElementById('pc-acc-value'),finish=document.getElementById('pc-autoht-finish');
    if(!start)return;bfState.htTarget=200;bfState.htStep=.5;bfState.htTime=10;var t=document.getElementById('pc-autoht-target'),s=document.getElementById('pc-autoht-step'),tm=document.getElementById('pc-autoht-time');if(t)t.value='200';if(s)s.value='0.5';if(tm)tm.value='10';
    var prog=ensureS3InlineProgress('ht','HT RAMP-UP · 80 kV → 200 kV');
    s3PcTarget(start);start.onclick=function(){ensureAudio();s3PcDone(start);if(status)status.textContent='RAMPING';if(prog&&prog.box)prog.box.classList.add('is-running');var t0=Date.now(),dur=7200;htRampInterval=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/dur),kv=80+120*p,pct=Math.round(p*100);if(val)val.textContent=kv.toFixed(2)+' kV';if(acc)acc.textContent=Math.round(kv)+' kV';if(finish)finish.textContent='Simulated Auto HT · '+pct+'%';if(prog){prog.bar.style.width=pct+'%';prog.pct.textContent=pct+'%';}if(p>=1){clearInterval(htRampInterval);htRampInterval=null;bfState.htRamped=true;if(status)status.textContent='TARGET REACHED';if(val)val.textContent='200.00 kV';if(acc)acc.textContent='200 kV';if(finish)finish.textContent='Target 200 kV reached';if(prog&&prog.box){prog.box.classList.remove('is-running');prog.box.classList.add('is-complete');prog.pct.textContent='100% · TARGET REACHED';}s3Complete(700);}},100);};
  }
  function runBFAtomic05(){
    s3PreparePcStandard();var e=document.getElementById('ht-on-btn'),status=document.getElementById('pc-ht-status'),lamp=document.getElementById('pc-ht-lamp');if(!e)return;e.disabled=false;e.removeAttribute('disabled');e.style.pointerEvents='auto';e.style.cursor='pointer';e.classList.add('sop-ht-next');
    e.onclick=function(ev){if(ev){ev.preventDefault();ev.stopPropagation();}if(!bfState.htRamped)return;ensureAudio();bfState.htOn=true;e.classList.remove('sop-ht-next');if(status)status.textContent='ON';if(lamp){lamp.classList.add('is-on');var sp=lamp.querySelector('span');if(sp)sp.textContent='ON';}s3Complete(350,function(){e.onclick=null;e.disabled=true;});return false;};
  }
  function runBFAtomic06(){
    s3PreparePcStandard();var e=document.getElementById('pc-filament-on'),fil=document.getElementById('pc-fil-status'),top=document.getElementById('pc-beam-current-top'),hv=document.getElementById('pc-beam-current-hv');if(!e)return;s3PcTarget(e);if(fil)fil.textContent='OFF';if(top)top.textContent='0 µA';if(hv)hv.textContent='0.0 µA';
    e.onclick=function(){ensureAudio();bfState.filamentOn=true;bfState.beamCurrent=0;if(fil)fil.textContent='ON · RISING';s3PcDone(e);s3Complete(350);};
  }
  function runBFAtomic07(){
    s3PreparePcStandard();var fil=document.getElementById('pc-fil-status'),top=document.getElementById('pc-beam-current-top'),hv=document.getElementById('pc-beam-current-hv'),finish=document.getElementById('pc-autoht-finish');if(fil)fil.textContent='ON · RISING';var prog=ensureS3InlineProgress('filament','FILAMENT STABILIZATION · Beam Current → ≈103 µA');if(prog&&prog.box)prog.box.classList.add('is-running');var t0=Date.now(),dur=4800,t=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/dur),ua=103*p,pct=Math.round(p*100);bfState.beamCurrent=ua;if(top)top.textContent=ua.toFixed(0)+' µA';if(hv)hv.textContent=ua.toFixed(1)+' µA';if(finish)finish.textContent='Beam Current '+ua.toFixed(0)+' µA';if(prog){prog.bar.style.width=pct+'%';prog.pct.textContent=pct+'% · '+ua.toFixed(0)+' µA';}if(p>=1){clearInterval(t);bfState.beamCurrent=103;if(fil)fil.textContent='ON';if(top)top.textContent='≈103 µA';if(hv)hv.textContent='≈103 µA';if(finish)finish.textContent='Beam Current stabilized ≈103 µA';if(prog&&prog.box){prog.box.classList.remove('is-running');prog.box.classList.add('is-complete');prog.pct.textContent='100% · ≈103 µA';}s3Complete(650);}},100);bfTimers.push(t);
  }
  function runBFAtomic08(){
    s3PreparePcStandard();var host=document.querySelector('[data-temcon-page="standard"]');addS3PcPanel(host,'Valve Status','<div class="sop-valve-grid"><span>V1</span><strong class="is-open">OPEN</strong><span>V2</span><strong id="s3V2State" class="'+(bfState.v2Open?'is-open':'is-closed')+'">'+(bfState.v2Open?'OPEN':'CLOSED')+'</strong></div><div class="sop-s3-pc-buttons"><button id="s3V2Open">OPEN V2</button></div><div class="sop-s3-pc-note">Dummy Valve Status window until the actual TEMCON image is supplied.</div>');var b=document.getElementById('s3V2Open'),st=document.getElementById('s3V2State');if(!b)return;b.onclick=function(){ensureAudio();bfState.v2Open=true;b.disabled=true;if(st){st.textContent='OPEN';st.className='is-open';}
      /* v4.8.9: close PC drawer before advancing to step 9 */
      setTimeout(function(){closePcDrawer();s3Complete(400);},600);
    };
  }
  function runBFAtomic09(){
    hideBfScene();hideS3ApertureOverlay();
    bfSetStatus('Press BEAM on L1.');
    s3Activate(['beam-on']);
    s3SetHandlers({'action:beam-toggle':function(btn){
      s3SelectButton(btn);
      bfState.beamOn=true;
      /* v4.8.9: stay on PC drawer briefly to show beam value update */
      syncPcLiveStatus();
      s3PreparePcStandard();
      setTimeout(function(){
        closePcDrawer();
        setTimeout(function(){
          runS3BeamScreenSequence(function(){s3Complete(300);});
        },400);
      },1400);
    }});
  }
  function runBFAtomic10(){showBfScene();setBfFluorescentMode(true);bfState.beamOn=true;bfState.coverOpen=false;bfRender();bfSetStatus('Remove the screen cover.');s3Activate([]);s3SetScreenAction('Remove screen cover',function(){bfState.coverOpen=true;bfRender();s3Complete(350);});}
  function runBFAtomic11(){showBfScene();bfState.coverOpen=true;bfRender();bfSetStatus('Select TEM imaging mode on L1.');s3Activate(['probe-tem']);s3SetHandlers({'action:probe-mode':function(btn){if(btn.dataset.value!=='tem')return;s3SelectButton(btn);bfState.temMode=true;s3Complete(350);}});}
  function runBFAtomic12(){showBfScene();bfSetStatus('Select TEM imaging mode on L1.');s3Activate(['probe-tem']);s3SetHandlers({'action:probe-mode':function(btn){if(btn.dataset.value!=='tem')return;s3SelectButton(btn);bfState.temMode=true;s3Complete(350);}});}
  function runBFAtomic12(){showBfScene();bfSetStatus('Select LOW MAG on R1.');s3Activate(['mag-mode']);s3SetHandlers({'action:mag-mode':function(btn){if(btn.dataset.value!=='lowmag')return;s3SelectButton(btn);bfState.magMode='LOW MAG';bfRender();s3Complete(350);}});}
  function runBFAtomic13(){showBfScene();if(!bfState.magMode)bfState.magMode='LOW MAG';s3SetMagIndex(3);bfSetStatus('Rotate MAG/CAM L into the 1,000–5,000× survey range.');s3Activate(['mag-caml']);s3SetHandlers({'knob:mag-caml':function(v){var i=Math.round(v);bfState.magIndex=i;bfState.mag=BF_MAG_VALUES[i]||8000;bfRender();if(bfState.mag>=1000&&bfState.mag<=5000)s3Complete(450);}});}
  function runBFAtomic14(){showBfScene();bfState.featureX=72;bfState.featureY=68;s3SetPad('stage-xy',70,-60);bfRender();bfSetStatus('Use the stage trackball to centre a hole or thin region.');s3Activate(['stage-xy']);s3SetHandlers({'pad:stage-xy':function(pos){bfState.stageX=pos.x;bfState.stageY=pos.y;bfState.featureX=50+pos.x*.30;bfState.featureY=50-pos.y*.30;bfRender();if(Math.abs(pos.x)<=10&&Math.abs(pos.y)<=10)s3Complete(450);}});}
  function runBFAtomic15(){showBfScene();bfSetStatus('Press STD FOCUS on R1.');s3Activate(['std-focus']);s3SetHandlers({'action:std-focus':function(btn){s3SelectButton(btn);bfState.focusCoarse=0;bfState.focusFine=0;bfRender();s3Complete(350);}});}
  function runBFAtomic16(){showBfScene();var start=Number((s3KnobHandles['spot-size']&&s3KnobHandles['spot-size'].value)||2);bfSetStatus('Set the desired SPOT SIZE.');s3Activate(['spot-size']);s3SetHandlers({'knob:spot-size':function(v){bfState.spot=Math.round(v);syncPcLiveStatus();if(Math.round(v)!==Math.round(start))s3Complete(400);}});}
  function runBFAtomic17(){showBfScene();var start=Number((s3KnobHandles['alpha-selector']&&s3KnobHandles['alpha-selector'].value)||2);bfSetStatus('Set the desired α SELECTOR.');s3Activate(['alpha-selector']);s3SetHandlers({'knob:alpha-selector':function(v){bfState.alpha=Math.round(v);syncPcLiveStatus();if(Math.round(v)!==Math.round(start))s3Complete(400);}});}
  function runBFAtomic18(){showBfScene();bfSetStatus('Select MAG 1 on R1.');s3Activate(['mag-mode']);s3SetHandlers({'action:mag-mode':function(btn){if(btn.dataset.value!=='mag1')return;s3SelectButton(btn);bfState.magMode='MAG 1';bfRender();s3Complete(350);}});}
  function runBFAtomic19(){showBfScene();bfSetStatus('Rotate MAG/CAM L to X40k.');s3Activate(['mag-caml']);s3SetHandlers({'knob:mag-caml':function(v){var i=Math.round(v);bfState.magIndex=i;bfState.mag=BF_MAG_VALUES[i]||8000;bfRender();if(bfState.mag===40000)s3Complete(450);}});}
  function runBFAtomic20(){showBfScene();bfState.c2=55;s3SetKnob('brightness',55);bfRender();bfSetStatus('Rotate BRIGHTNESS to the smallest crossover.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v<=22)s3Complete(450);}});}
  function runBFAtomic21(){showBfScene();bfSetStatus('Turn BRIGHTNESS clockwise to spread illumination over the screen.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v>=72)s3Complete(450);}});}
  function runBFAtomic22(){showBfScene();bfState.featureX=67;bfState.featureY=62;s3SetPad('stage-xy',55,-40);bfRender();bfSetStatus('At MAG 1, centre a thin feature with the trackball.');s3Activate(['stage-xy']);s3SetHandlers({'pad:stage-xy':function(pos){bfState.stageX=pos.x;bfState.stageY=pos.y;bfState.featureX=50+pos.x*.28;bfState.featureY=50-pos.y*.28;bfRender();if(Math.abs(pos.x)<=9&&Math.abs(pos.y)<=9)s3Complete(400);}});}
  function runBFAtomic23(){showBfScene();bfSetStatus('Press STD FOCUS before Z correction.');s3Activate(['std-focus']);s3SetHandlers({'action:std-focus':function(btn){s3SelectButton(btn);bfState.focusCoarse=0;bfState.focusFine=0;s3Complete(350);}});}
  function runBFAtomic24(){showBfScene();bfState.z=-6;bfState.zSensitivity=1;bfRender();bfSetStatus('Use Z UP / Z DOWN to approach minimum contrast.');s3Activate(['stage-z']);s3SetHandlers({'action:stage-z':function(btn){bfState.z=Math.max(-12,Math.min(12,bfState.z+Number(btn.dataset.dir)*(bfState.zSensitivity||1)));bfRender();if(Math.abs(bfState.z)<=3)s3Complete(350);}});}
  function runBFAtomic25(){s3PreparePcStage();var host=document.querySelector('[data-temcon-page="stage"]');addS3PcPanel(host,'Z Control Sensitivity','<div class="sop-s3-pc-note">Optional: adjust sensitivity only if needed.</div><div class="sop-s3-pc-buttons"><button id="s3ZSensDown">◀ Finer</button><strong id="s3ZSensRead">Normal</strong><button id="s3ZSensUp">Coarser ▶</button></div>');var d=document.getElementById('s3ZSensDown'),u=document.getElementById('s3ZSensUp'),r=document.getElementById('s3ZSensRead');var timer=setTimeout(function(){s3Complete(100);},2400);bfTimers.push(timer);function set(v,label){bfState.zSensitivity=v;if(r)r.textContent=label;clearTimeout(timer);s3Complete(250);}if(d)d.onclick=function(){set(.5,'Fine');};if(u)u.onclick=function(){set(2,'Coarse');};}
  function runBFAtomic26(){showBfScene();bfState.wobble=false;bfState.wobbleAxis='';bfRender();bfSetStatus('Press MAG WOB X or MAG WOB Y.');s3Activate(['wobbler']);s3SetHandlers({'action:mag-wob':function(btn){bfState.wobble=true;bfState.wobbleAxis=btn.dataset.axis||'x';s3SelectButton(btn);bfRender();s3Complete(350);}});}
  function runBFAtomic27(){showBfScene();bfState.wobble=true;bfRender();bfSetStatus('Use Z UP / Z DOWN until lateral wobble is minimized.');s3Activate(['stage-z']);s3SetHandlers({'action:stage-z':function(btn){bfState.z=Math.max(-8,Math.min(8,bfState.z+Number(btn.dataset.dir)*(bfState.zSensitivity||1)));bfRender();if(Math.abs(bfState.z)<=1)s3Complete(350);}});}
  function runBFAtomic28(){showBfScene();bfState.wobble=true;bfRender();bfSetStatus('Press the same MAG WOB control again to switch wobble OFF.');s3Activate(['wobbler']);s3SetHandlers({'action:mag-wob':function(btn){var ax=btn.dataset.axis||'x';if(bfState.wobbleAxis&&ax!==bfState.wobbleAxis)return;bfState.wobble=false;btn.classList.remove('is-selected');bfRender();s3Complete(350);}});}
  function runBFAtomic29(){closePcDrawer();hideBfScene();hideSection1Tour();setViewer('column');showS3ApertureOverlay('select');s3ApKnob1Pos=0;var b=document.getElementById('s3ApKnob1'),r=document.getElementById('s3ApKnob1Read');if(!b)return;r.textContent='OPEN';b.onclick=function(){ensureAudio();s3ApKnob1Pos=(s3ApKnob1Pos+1)%3;r.textContent=s3ApKnob1Pos===0?'OPEN':(s3ApKnob1Pos===1?'SURVEY':'ROUTINE BF/DF');b.style.setProperty('--ap-rot',(s3ApKnob1Pos*60)+'deg');if(s3ApKnob1Pos===2){bfState.apertureSelected=true;b.onclick=null;s3Complete(450);}};}
  function runBFAtomic30(){closePcDrawer();hideBfScene();hideSection1Tour();setViewer('column');showS3ApertureOverlay('x');bfState.beamX=0;bfState.beamY=0;bfState.caX=6;bfState.caY=-6;s3SetApKnob('x',6);s3SetApKnob('y',-6);bfRender();bfSetStatus('Adjust CA X until the beam is horizontally centered.');s3SetHandlers({'ap:ca-x':function(v){bfState.caX=v;bfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
  function runBFAtomic31(){closePcDrawer();hideBfScene();hideSection1Tour();setViewer('column');showS3ApertureOverlay('y');bfRender();bfSetStatus('Adjust CA Y until the beam is vertically centered.');s3SetHandlers({'ap:ca-y':function(v){bfState.caY=v;bfRender();if(Math.abs(v)<=1)s3Complete(250,function(){hideS3ApertureOverlay();});}});}
  function runBFAtomic32(){hideS3ApertureOverlay();showBfScene();bfState.caX=0;bfState.caY=0;bfState.c2=55;s3SetKnob('brightness',55);bfRender();var low=false,high=false;bfSetStatus('Vary BRIGHTNESS through contraction and expansion to verify symmetric centering.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;if(v<=30)low=true;if(v>=70)high=true;bfRender();if(low&&high)s3Complete(450);}});}
  function runBFAtomic33(){showBfScene();hideS3ApertureOverlay();bfState.c2=55;s3SetKnob('brightness',55);bfRender();bfSetStatus('Adjust BRIGHTNESS back to crossover.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v<=22)s3Complete(400);}});}
  function runBFAtomic34(){showBfScene();bfState.beamX=6;bfState.beamY=-5;s3SetKnob('shift-x',6);s3SetKnob('shift-y',-5);bfRender();bfSetStatus('Use SHIFT X to centre the crossover horizontally.');s3Activate(['shift-x']);s3SetHandlers({'knob:shift-x':function(v){bfState.beamX=v;bfRender();if(Math.abs(v)<=1)s3Complete(400);}});}
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
  function runBFAtomic46(){showBfScene();bfState.featureX=66;bfState.featureY=63;s3SetPad('stage-xy',54,-43);bfRender();bfSetStatus('Use the stage trackball to centre the final area of interest.');s3Activate(['stage-xy']);s3SetHandlers({'pad:stage-xy':function(pos){bfState.stageX=pos.x;bfState.stageY=pos.y;bfState.featureX=50+pos.x*.28;bfState.featureY=50-pos.y*.28;bfRender();if(Math.abs(pos.x)<=9&&Math.abs(pos.y)<=9)s3Complete(400);}});}
  function runBFAtomic47(){showBfScene();var start=bfState.magIndex;bfState.finalMagTouched=false;bfSetStatus('With MAG 1 retained, set the required final magnification using MAG/CAM L.');s3Activate(['mag-caml']);s3SetHandlers({'knob:mag-caml':function(v){var i=Math.round(v);bfState.magIndex=i;bfState.mag=BF_MAG_VALUES[i]||8000;bfRender();if(i!==start){bfState.finalMagTouched=true;s3Complete(450);}}});}
  function runBFAtomic48(){showBfScene();bfState.c2=50;s3SetKnob('brightness',50);bfRender();bfSetStatus('Spread the beam appropriately for image recording.');s3Activate(['brightness']);s3SetHandlers({'knob:brightness':function(v){bfState.c2=v;bfRender();if(v>=70)s3Complete(400);}});}
  function runBFAtomic49(){showBfScene();bfSetStatus('AUTO contrast is optional. Press AUTO now if desired.');s3Activate(['auto-contrast']);var timer=setTimeout(function(){s3Complete(100);},2300);bfTimers.push(timer);s3SetHandlers({'action:auto-contrast':function(btn){clearTimeout(timer);s3SelectButton(btn);bfState.autoUsed=true;bfRender();s3Complete(300);}});}
  function runBFAtomic50(){showBfScene();bfState.screenRaised=false;bfSetStatus('Press F1 to lift the fluorescent screen and expose the camera.');s3Activate(['f1']);s3SetHandlers({'action:f1':function(btn){s3SelectButton(btn);bfState.screenRaised=true;var s=document.getElementById('pc-cam-screen-state');if(s)s.textContent='Raised';s3Complete(350);}});}

  function ensureAtomicItemPanel(mode){
    openCameraDrawer();var host=document.querySelector('.camera-palette--acquisition .camera-palette__body');if(!host)return null;var legacy=document.querySelector('.pc-cam-controls');if(legacy)legacy.style.display='none';var old=document.getElementById('sopItemPanel');if(old)old.remove();var p=document.createElement('div');p.id='sopItemPanel';p.className='sop-item-panel';var html='<div class="sop-bf-card-title">iTEM acquisition</div>';
    if(mode==='open')html+='<button id="s3ItemOpen">Open iTEM</button><div class="sop-s3-pc-note">Dummy iTEM interface until the actual screenshot is supplied.</div>';
    if(mode==='focus')html+='<div class="sop-s3-pc-note">iTEM open · OBJ FOCUS adjustment is optional. Use the R1 focus knobs if needed.</div>';
    if(mode==='video')html+='<button id="s3ItemVideo">Video</button><div class="sop-s3-pc-note">Start the live camera feed.</div>';
    if(mode==='snapshot')html+='<button id="s3ItemSnapshot">Snapshot</button><div class="sop-s3-pc-note">Capture the Bright Field image.</div>';
    if(mode==='done')html+='<div class="sop-s3-pc-note">Snapshot captured · press F1 on R1 to return the fluorescent screen.</div>';
    p.innerHTML=html;host.appendChild(p);var ph=document.getElementById('pc-cam-placeholder');if(ph&&bfState.itemOpen)ph.style.display='none';return p;
  }
  function runBFAtomic51(){hideBfScene();hideS3ApertureOverlay();var p=ensureAtomicItemPanel('open'),b=document.getElementById('s3ItemOpen');if(!b)return;b.onclick=function(){ensureAudio();bfState.itemOpen=true;b.disabled=true;var ph=document.getElementById('pc-cam-placeholder');if(ph)ph.style.display='none';s3Complete(350);};}
  function runBFAtomic52(){hideBfScene();hideS3ApertureOverlay();ensureAtomicItemPanel('focus');s3Activate(['focus-coarse','focus-fine']);var timer=setTimeout(function(){s3Complete(100);},2800);bfTimers.push(timer);function touched(){clearTimeout(timer);s3Complete(350);}s3SetHandlers({'knob:focus-coarse':function(v){bfState.focusCoarse=v;touched();},'knob:focus-fine':function(v){bfState.focusFine=v;touched();}});}
  function runBFAtomic53(){hideBfScene();var p=ensureAtomicItemPanel('video'),b=document.getElementById('s3ItemVideo');if(!b)return;b.onclick=function(){ensureAudio();bfState.videoOn=true;b.disabled=true;var ls=document.getElementById('pc-cam-live-state');if(ls)ls.textContent='Running';drawCapturedBf();s3Complete(350);};}
  function runBFAtomic54(){hideBfScene();var p=ensureAtomicItemPanel('snapshot'),b=document.getElementById('s3ItemSnapshot');if(!b)return;b.onclick=function(){ensureAudio();bfState.captured=true;b.disabled=true;drawCapturedBf();var s=document.getElementById('pc-cam-image-state');if(s)s.textContent='Snapshot captured';s3Complete(350);};}
  function runBFAtomic55(){hideBfScene();ensureAtomicItemPanel('done');bfSetStatus('Press F1 to return the fluorescent screen.');s3Activate(['f1']);s3SetHandlers({'action:f1':function(btn){if(!bfState.captured)return;s3SelectButton(btn);bfState.screenRaised=false;var s=document.getElementById('pc-cam-screen-state');if(s)s.textContent='Down';s3Complete(450,function(){clearS3PcPanel();closePcDrawer();hideS3ApertureOverlay();});}});}

  function bindGrid(){
    var a=document.getElementById('gridOpen'),b=document.getElementById('gridPlace'),c=document.getElementById('gridClose'),next=document.getElementById('gridContinue');
    function enable(box){if(!box)return;box.disabled=false;var l=box.closest('.sop-grid-check');if(l)l.classList.remove('is-disabled');}
    function lock(box){if(!box)return;box.disabled=true;var l=box.closest('.sop-grid-check');if(l){l.classList.remove('is-disabled');l.classList.add('is-checked');}}
    if(a)a.addEventListener('change',function(){if(!a.checked)return;ensureAudio();state.gridStage=1;lock(a);enable(b);});
    if(b)b.addEventListener('change',function(){if(!b.checked||state.gridStage<1){b.checked=false;return;}ensureAudio();state.gridStage=2;lock(b);enable(c);});
    if(c)c.addEventListener('change',function(){if(!c.checked||state.gridStage<2){c.checked=false;return;}ensureAudio();state.gridStage=3;lock(c);if(next)next.disabled=false;});
    if(next)next.addEventListener('click',function(){if(state.gridStage<3)return;closeModal(true);completeStep();});
  }

  function bindHolderDrag(){var h=document.getElementById('holderDrag'),track=document.getElementById('holderTrack'),port=document.getElementById('holderPort'),btn=document.getElementById('holderContinue');var dragging=false,startX=0,startL=24;function maxL(){return Math.max(24,port.offsetLeft-h.offsetWidth+32);}h.addEventListener('pointerdown',function(e){ensureAudio();dragging=true;startX=e.clientX;startL=parseFloat(h.style.left)||24;h.setPointerCapture(e.pointerId);h.classList.add('is-dragging');});h.addEventListener('pointermove',function(e){if(!dragging)return;var x=Math.max(24,Math.min(maxL(),startL+e.clientX-startX));h.style.left=x+'px';});h.addEventListener('pointerup',function(){if(!dragging)return;dragging=false;h.classList.remove('is-dragging');var x=parseFloat(h.style.left)||24;if(x>=maxL()-7&&!state.insertionDone){state.insertionDone=true;h.style.left=maxL()+'px';threeClicks();setTimeout(function(){btn.disabled=false;},1250);}});btn.addEventListener('click',function(){if(!state.insertionDone)return;closeModal(true);completeStep();});}

  function startEvacuation(){if(state.evacuationDone){stopPump();return;}var bar=document.getElementById('vacBar'),txt=document.getElementById('vacText'),lamp=document.getElementById('amberLamp'),btn=document.getElementById('vacContinue'),t0=Date.now(),dur=6500;state.pumpTimer=setInterval(function(){var p=Math.min(100,(Date.now()-t0)/dur*100);bar.style.width=p+'%';txt.textContent='EVACUATING · '+Math.round(p)+'%';if(p>=100){clearInterval(state.pumpTimer);state.pumpTimer=null;state.evacuationDone=true;stopPump();lamp.classList.remove('is-on');txt.textContent='VACUUM READY · AMBER LAMP OFF';btn.disabled=false;btn.textContent='Continue';}},140);btn.addEventListener('click',function(){if(!state.evacuationDone)return;closeModal(true);completeStep();});}

  function bindRotation(){var r=document.getElementById('rotRange'),read=document.getElementById('rotRead'),a=document.getElementById('rot15'),b=document.getElementById('rot75'),c=document.getElementById('rotSeat'),seat=document.getElementById('seatHolder'),next=document.getElementById('rotContinue');r.addEventListener('input',function(){ensureAudio();var v=Number(r.value);read.textContent=v+'°';if(!state.rotation15&&v>=14&&v<=18){state.rotation15=true;a.classList.add('done');}if(state.rotation15&&v>=74){state.rotation75=true;b.classList.add('done');seat.disabled=false;}});seat.addEventListener('click',function(){if(!state.rotation75)return;clickSound(0);state.holderSeated=true;c.classList.add('done');seat.disabled=true;next.disabled=false;});next.addEventListener('click',function(){if(!state.holderSeated)return;closeModal(true);completeStep();});}

  function bindTrackball(){var ball=document.getElementById('specTrackball'),dot=document.getElementById('stageDot'),btn=document.getElementById('trackConfirm');var drag=false,lx=0,ly=0,total=0,x=50,y=50;ball.addEventListener('pointerdown',function(e){ensureAudio();drag=true;lx=e.clientX;ly=e.clientY;ball.setPointerCapture(e.pointerId);ball.classList.add('is-dragging');});ball.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;total+=Math.abs(dx)+Math.abs(dy);x=Math.max(12,Math.min(88,x+dx*.18));y=Math.max(12,Math.min(88,y+dy*.18));dot.style.left=x+'%';dot.style.top=y+'%';if(total>42&&!state.trackballMoved){state.trackballMoved=true;btn.disabled=false;}});ball.addEventListener('pointerup',function(){drag=false;ball.classList.remove('is-dragging');});btn.addEventListener('click',function(){if(!state.trackballMoved)return;closeModal(true);completeStep();});}

  function resetSession(){clearHtRampTimers();cleanupHtRampUi();clearBfTimers();clearS3PcPanel();hideBfScene();if(typeof hideS3ApertureOverlay==='function')hideS3ApertureOverlay();resetBfState();stopPump();hideViewportScene();hideSection1Tour();if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}if(state.pumpTimer)clearInterval(state.pumpTimer);state={sample:null,currentSection:0,currentStep:0,unlockedThrough:0,sectionComplete:{},completed:{},gridStage:0,insertionDone:false,pumpStarted:false,evacuationDone:false,rotation15:false,rotation75:false,holderSeated:false,trackballMoved:false,pumpTimer:null};sampleInd.textContent='SELECT SAMPLE';closePcDrawer();closeModal(true);setSessionControls(false);renderNav();setInstruction();updateProgress();}

  var restart=document.getElementById('btn-restart');if(restart)restart.addEventListener('click',function(){
    if(!state.sample){showSampleModal();return;}
    resetSession();
  });
  var undo=document.getElementById('btn-undo-step');if(undo)undo.addEventListener('click',function(){
    if(!state.sample||!state.currentSection)return;
    if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}
    clearHtRampTimers();cleanupHtRampUi();clearBfTimers();clearS3PcPanel();hideBfScene();closeModal(true);closePcDrawer();hideSection1Tour();stopPump();if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}
    if(state.currentStep>0){state.currentStep--;delete state.completed[key()];}
    if(state.currentSection===2 && state.currentStep>=4){state.pumpStarted=false;state.evacuationDone=false;}
    setInstruction();renderNav();updateProgress();setTimeout(showCurrentStep,650);
  });
  var showStep=document.getElementById('btn-show-step');if(showStep)showStep.addEventListener('click',function(){
    if(nextModalTimer){clearTimeout(nextModalTimer);nextModalTimer=null;}
    clearBfTimers();clearS3PcPanel();hideBfScene();closeModal(true);hideSection1Tour();
    if(!state.sample){showSampleModal();return;}
    var s=currentSection();if(!s||state.sectionComplete[s.id]||!s.implemented)return;
    if(state.currentSection===2 && state.currentStep===4){state.pumpStarted=false;state.evacuationDone=false;stopPump();if(state.pumpTimer){clearInterval(state.pumpTimer);state.pumpTimer=null;}}
    setInstruction();showCurrentStep();
  });
  if(drawerHandle)drawerHandle.addEventListener('click',function(){if(state.currentSection===1&&state.currentStep===3)return;if(drawer.classList.contains('is-open'))closePcDrawer();else openPcDrawer();});

  // Keep the old theory button functional.
  var theory=document.getElementById('guidedTheory'),theoryBtn=document.getElementById('guidedTheoryBtn'),theoryClose=document.getElementById('guidedTheoryClose'),theoryGot=document.getElementById('guidedTheoryGotIt'),theoryBg=document.getElementById('guidedTheoryBackdrop');
  function openTheory(){if(!theory)return;theory.hidden=false;void theory.offsetWidth;theory.classList.add('is-open');}
  function closeTheory(){if(!theory)return;theory.classList.remove('is-open');setTimeout(function(){theory.hidden=true;},180);}
  if(theoryBtn)theoryBtn.addEventListener('click',openTheory);if(theoryClose)theoryClose.addEventListener('click',closeTheory);if(theoryGot)theoryGot.addEventListener('click',closeTheory);if(theoryBg)theoryBg.addEventListener('click',closeTheory);

  document.addEventListener('visibilitychange',function(){if(document.hidden)stopPump();else if(state.pumpStarted&&!state.evacuationDone&&state.currentSection===2&&state.currentStep===4)startPump();});
  window.addEventListener('beforeunload',stopPump);

  window.addEventListener('resize',function(){refreshInstructionMarquee();});
  var r1Scroll=document.querySelector('#panel-r1 .ctl-panel__scroll'), stageDockHost=document.getElementById('sop-stage-dock');
  if(r1Scroll&&stageDockHost&&stageDockHost.parentNode!==r1Scroll){r1Scroll.appendChild(stageDockHost);}
  [].slice.call(document.querySelectorAll('#panel-l1 .ctl-panel__scroll,#panel-r1 .ctl-panel__scroll')).forEach(function(sc){
    var tid=null;sc.addEventListener('scroll',function(){if(state.currentSection!==3||!s3ActivePrimary)return;clearTimeout(tid);tid=setTimeout(function(){ensureS3ActiveVisible('smooth');},160);},{passive:true});
  });
  wireS3ViewerTabs();initS3PanelInteractions();wireFullscreen();showFullscreenReminder();
  var stageDock=document.getElementById('sop-stage-dock'),stageToggle=document.getElementById('sop-stage-dock-toggle'),stageLocator=document.getElementById('sop-stage-dock-locator');
  if(stageToggle&&stageDock){stageToggle.addEventListener('click',function(){var open=!stageDock.classList.contains('is-open');stageDock.classList.toggle('is-open',open);stageToggle.setAttribute('aria-expanded',open?'true':'false');if(open)setTimeout(function(){revealStageControl('smooth');},30);});}
  if(stageLocator){stageLocator.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();openS3Locator('stage-xy');});}
var lc=document.getElementById('sopLocatorClose');if(lc)lc.addEventListener('click',closeS3Locator);[].slice.call(document.querySelectorAll('[data-locator-close]')).forEach(function(e){e.addEventListener('click',closeS3Locator);});var pdh=document.getElementById('pc-drawer-handle');if(pdh)pdh.addEventListener('click',function(){setTimeout(syncPcLiveStatus,40);});setSessionControls(false);renderNav();setInstruction();updateProgress();closePcDrawer();
})();
