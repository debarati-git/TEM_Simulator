(function(){
  'use strict';

  var sections = [
    { id:1, title:'Safety Check and Instrument Startup', implemented:true, steps:[
      {id:'1-1', short:'Check chiller ON and temperature ≤ 18°C', title:'Check chiller status', location:'Chiller / cooling system', hint:'Image verification'},
      {id:'1-2', short:'Confirm room AC ON and ~20–22°C', title:'Confirm room air conditioning', location:'TEM room environment', hint:'Image verification'},
      {id:'1-3', short:'Verify SIP vacuum ≤ 2.5×10⁻⁵ Pa', title:'Verify SIP vacuum', location:'SIP vacuum monitor', hint:'Image verification'},
      {id:'1-4', short:'Confirm HT status “Ready” in TEMCON', title:'Verify TEMCON HT status', location:'TEMCON PC drawer', hint:'PC drawer automatically opened'},
      {id:'1-5', short:'Check / refill liquid nitrogen in anti-contamination trap', title:'Check anti-contamination trap', location:'Anti-contamination trap', hint:'Liquid nitrogen check'},
      {id:'1-6', short:'Allow filament and system to stabilize', title:'System warm-up and stabilization', location:'Instrument stabilization', hint:'Simulated warm-up check'},
      {id:'1-7', short:'Record startup in instrument logbook', title:'Complete startup logbook', location:'Instrument logbook', hint:'Record operator details'}
    ]},
    { id:2, title:'Specimen Loading and Holder Insertion', implemented:true, steps:[
      {id:'2-1', short:'Inspect and clean holder O-rings', title:'Inspect specimen-holder O-rings', location:'Specimen holder', hint:'Close-up inspection'},
      {id:'2-2', short:'Confirm goniometer green lamp is lit', title:'Confirm goniometer readiness', location:'Goniometer', hint:'Green ready lamp'},
      {id:'2-3', short:'Load TEM grid sample-side up and close retaining clip', title:'Load TEM grid into holder cartridge', location:'Holder cartridge', hint:'Guided three-action sequence'},
      {id:'2-4', short:'Insert holder to first stop and listen for 3 clicks', title:'Insert holder to first mechanical stop', location:'Goniometer port', hint:'Drag holder into position'},
      {id:'2-5', short:'Set PUMP/AIR switch to PUMP', title:'Start goniometer evacuation', location:'Goniometer PUMP/AIR control', hint:'Pumping sound starts'},
      {id:'2-6', short:'Wait until amber lamp goes out', title:'Wait for airlock evacuation', location:'Goniometer airlock', hint:'Do not move the holder'},
      {id:'2-7', short:'Rotate 15° then 75° clockwise and insert fully', title:'Rotate and fully insert holder', location:'Specimen holder / goniometer', hint:'Two-stage rotation'},
      {id:'2-8', short:'Demonstrate stage motion using SPEC CONTROL trackball', title:'Verify stage response with trackball', location:'JEOL SPEC CONTROL trackball', hint:'Drag trackball with mouse'}
    ]},
    { id:3, title:'Bright Field Imaging', implemented:false, steps:[] },
    { id:4, title:'Dark Field Imaging', implemented:false, steps:[] },
    { id:5, title:'Selected Area Electron Diffraction (SAED) Mode', implemented:false, steps:[] },
    { id:6, title:'High-Resolution TEM (HRTEM) Imaging Mode', implemented:false, hidden:true, steps:[] },
    { id:7, title:'Instrument Shutdown', implemented:false, steps:[] }
  ];

  var state = {
    currentSection:1,
    currentStep:0,
    unlockedThrough:1,
    sectionComplete:{},
    completedSteps:{},
    warmupDone:false,
    gridStage:0,
    insertionDone:false,
    pumpStarted:false,
    evacuationDone:false,
    rotation15:false,
    rotation75:false,
    holderSeated:false,
    trackballMoved:false,
    pumpTimer:null
  };

  var modalConfirmFn = null;
  var audioCtx = null;
  var pumpNodes = null;

  var navEl = document.getElementById('sop-sections-nav');
  var stepListEl = document.getElementById('step-list');
  var stepListTitle = document.getElementById('step-list-title');
  var stepCountEl = document.getElementById('step-count');
  var visualEl = document.getElementById('sop-visual');
  var actionEl = document.getElementById('sop-action');
  var activeLocationEl = document.getElementById('active-location');
  var stageHintEl = document.getElementById('stage-hint');
  var overallProgressEl = document.getElementById('overall-progress');
  var overallLabelEl = document.getElementById('overall-label');

  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];}); }
  function currentSection(){ return sections[state.currentSection-1]; }
  function nextVisibleSectionId(id){ for(var i=id;i<sections.length;i++){ if(!sections[i].hidden) return sections[i].id; } return null; }
  function currentStep(){ var s=currentSection(); return s.steps[state.currentStep] || null; }
  function stepKey(sectionId,index){ return sectionId+'-'+(index+1); }

  function ensureAudio(){
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if(audioCtx.state === 'suspended') audioCtx.resume();
    }catch(e){}
  }

  function playMechanicalClick(when){
    ensureAudio(); if(!audioCtx) return;
    var t = audioCtx.currentTime + (when||0);
    var osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type='square'; osc.frequency.setValueAtTime(150,t); osc.frequency.exponentialRampToValueAtTime(70,t+.055);
    gain.gain.setValueAtTime(.0001,t); gain.gain.exponentialRampToValueAtTime(.20,t+.004); gain.gain.exponentialRampToValueAtTime(.0001,t+.075);
    osc.connect(gain).connect(audioCtx.destination); osc.start(t); osc.stop(t+.08);
  }

  function playThreeClicks(){
    var dots = Array.prototype.slice.call(document.querySelectorAll('.click-indicator span'));
    [0,.48,.96].forEach(function(delay,idx){
      playMechanicalClick(delay);
      setTimeout(function(){ if(dots[idx]) dots[idx].classList.add('is-hit'); }, Math.round(delay*1000));
    });
  }

  function startPumpSound(){
    ensureAudio(); if(!audioCtx || pumpNodes) return;
    var master=audioCtx.createGain(); master.gain.value=.085;
    var o1=audioCtx.createOscillator(), o2=audioCtx.createOscillator();
    o1.type='sawtooth'; o2.type='sine'; o1.frequency.value=72; o2.frequency.value=144;
    var g1=audioCtx.createGain(), g2=audioCtx.createGain(); g1.gain.value=.65; g2.gain.value=.28;
    o1.connect(g1).connect(master); o2.connect(g2).connect(master); master.connect(audioCtx.destination);
    o1.start(); o2.start(); pumpNodes={o1:o1,o2:o2,master:master};
  }
  function stopPumpSound(){
    if(!pumpNodes) return;
    try{ pumpNodes.master.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.25); pumpNodes.o1.stop(audioCtx.currentTime+.3); pumpNodes.o2.stop(audioCtx.currentTime+.3); }catch(e){}
    pumpNodes=null;
  }

  function renderNav(){
    navEl.innerHTML = sections.filter(function(sec){ return !sec.hidden; }).map(function(sec){
      var unlocked = sec.id <= state.unlockedThrough;
      var active = sec.id===state.currentSection;
      var done = !!state.sectionComplete[sec.id];
      var stateText = done ? '✓' : (!unlocked ? '🔒' : (sec.implemented ? 'OPEN' : 'NEXT'));
      return '<button class="sop-section-tab'+(active?' is-active':'')+(done?' is-complete':'')+'" data-section="'+sec.id+'" '+(!unlocked?'disabled':'')+'>'+ 
        '<span class="sop-section-tab__num">SECTION '+sec.id+'</span><span class="sop-section-tab__name">'+esc(sec.title)+'</span><span class="sop-section-tab__state">'+stateText+'</span></button>';
    }).join('');
    navEl.querySelectorAll('[data-section]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var id=Number(btn.dataset.section); if(id>state.unlockedThrough || !sections[id-1] || sections[id-1].hidden) return;
        state.currentSection=id;
        state.currentStep=0;
        stopPumpSound();
        render();
      });
    });
  }

  function renderSteps(){
    var sec=currentSection();
    stepListTitle.textContent='Section '+sec.id+' steps';
    if(!sec.implemented){
      stepCountEl.textContent='Planned'; stepListEl.innerHTML='<div class="sop-step-item is-active"><span class="sop-step-item__num">—</span><span class="sop-step-item__text">Workflow content will be added when the section procedure is provided.</span></div>'; return;
    }
    if(state.sectionComplete[sec.id]) stepCountEl.textContent='Complete'; else stepCountEl.textContent=(state.currentStep+1)+' / '+sec.steps.length;
    stepListEl.innerHTML=sec.steps.map(function(step,i){
      var done=!!state.completedSteps[stepKey(sec.id,i)], active=!state.sectionComplete[sec.id] && i===state.currentStep;
      return '<div class="sop-step-item'+(done?' is-done':'')+(active?' is-active':'')+'"><span class="sop-step-item__num">'+(done?'✓':(i+1))+'</span><span class="sop-step-item__text">'+esc(step.short)+'</span></div>';
    }).join('');
  }

  function overviewInset(){ return ''; }

  function contextModal(title, body, className){
    return '<div class="sop-context-modal '+(className||'')+'"><div class="sop-context-modal__bar"><span>SECTION 1 · SAFETY CHECK</span><strong>'+esc(title)+'</strong></div><div class="sop-context-modal__body">'+body+'</div></div>';
  }

  function actionPanel(step, condition, status, buttonHtml){
    return '<div class="sop-action__kicker">Section '+state.currentSection+' · Step '+(state.currentStep+1)+'</div><h2>'+esc(step.title)+'</h2>'+ 
      '<p class="sop-action__instruction">'+condition.instruction+'</p>'+ 
      (condition.caution?'<div class="sop-condition">'+condition.caution+'</div>':'')+
      '<div class="sop-action__spacer"></div>'+(status?'<div class="sop-status-note" id="action-status">'+status+'</div>':'')+(buttonHtml||'');
  }

  function render(){
    renderNav(); renderSteps();
    var sec=currentSection();
    overallLabelEl.textContent='Section '+Math.min(state.unlockedThrough,7)+' of 7';
    var completeCount=Object.keys(state.sectionComplete).filter(function(k){return state.sectionComplete[k];}).length;
    overallProgressEl.style.width=(completeCount/7*100)+'%';

    if(!sec.implemented){ return renderFuture(sec); }
    if(state.sectionComplete[sec.id]){ return renderComplete(sec); }
    var step=currentStep();
    activeLocationEl.textContent=step.location; stageHintEl.textContent=step.hint;
    if(sec.id===1) renderSection1(step); else renderSection2(step);
  }

  function completeStep(){
    var sec=currentSection(); state.completedSteps[stepKey(sec.id,state.currentStep)]=true;
    if(state.currentStep < sec.steps.length-1){ state.currentStep++; render(); }
    else { state.sectionComplete[sec.id]=true; var nextId=nextVisibleSectionId(sec.id); if(nextId!==null) state.unlockedThrough=Math.max(state.unlockedThrough,nextId); render(); }
  }

  function renderComplete(sec){
    activeLocationEl.textContent='Section '+sec.id+' complete'; stageHintEl.textContent='Sequential gate passed';
    var next=sections[sec.id];
    visualEl.innerHTML='<div class="section-complete"><div class="section-complete__icon">✓</div><h3>'+esc(sec.title)+' complete</h3><p>All required checks and interactions in this section have been completed. '+(next?'The next section is now unlocked.':'')+'</p></div>'+overviewInset();
    var nextText=next ? 'Open Section '+next.id : 'Session complete';
    actionEl.innerHTML='<div class="sop-action__kicker">SECTION COMPLETE</div><h2>Progress saved for this session</h2><p class="sop-action__instruction">The SOP remains sequential. Earlier completed sections may be reviewed from the section tabs.</p><div class="sop-action__spacer"></div>'+(next?'<button class="sop-btn" id="open-next">'+nextText+'</button>':'');
    var b=document.getElementById('open-next'); if(b)b.addEventListener('click',function(){var nextId=nextVisibleSectionId(sec.id);if(nextId!==null){state.currentSection=nextId;state.currentStep=0;render();}});
  }

  function renderFuture(sec){
    activeLocationEl.textContent=sec.title; stageHintEl.textContent='Framework ready';
    visualEl.innerHTML='<div class="future-section"><div class="future-section__num">'+sec.id+'</div><h3>'+esc(sec.title)+'</h3><p>This section is present in the new seven-section framework. Its detailed operating steps will be added after the procedure is supplied.</p></div>'+overviewInset();
    actionEl.innerHTML='<div class="sop-action__kicker">SECTION '+sec.id+'</div><h2>Workflow awaiting content</h2><p class="sop-action__instruction">Sections remain sequential. The detailed controls and validation logic for this section have intentionally not been invented.</p><div class="sop-action__spacer"></div><div class="sop-status-note">Sections '+(sec.id+1)+'–7 remain locked until this section is implemented and completed.</div>';
  }

  function confirmModal(title,copy,onConfirm,badge){
    var modal=document.getElementById('sop-confirm-modal');
    document.getElementById('sop-modal-title').textContent=title;
    document.getElementById('sop-modal-copy').textContent=copy;
    document.getElementById('sop-modal-badge').textContent=badge||'CONFIRMATION';
    modalConfirmFn=onConfirm; modal.classList.add('is-open');
  }
  function closeModal(){document.getElementById('sop-confirm-modal').classList.remove('is-open');modalConfirmFn=null;}
  document.getElementById('sop-modal-cancel').addEventListener('click',closeModal);
  document.getElementById('sop-modal-confirm').addEventListener('click',function(){var fn=modalConfirmFn;closeModal();if(fn)fn();});
  document.querySelector('#sop-confirm-modal .sop-modal__backdrop').addEventListener('click',closeModal);

  function bindConfirmButton(message){
    var btn=document.getElementById('confirm-step'); if(!btn)return;
    btn.addEventListener('click',function(){ensureAudio();confirmModal('Confirm this check',message,completeStep);});
  }

  function renderSection1(step){
    if(step.id==='1-1'){
      visualEl.innerHTML=contextModal('Chiller / cooling system','<div><img class="sop-photo" src="../assets/images/sop/dummy-chiller.svg" alt="Dummy chiller image showing ON and 17.5 degrees Celsius"><div class="sop-placeholder-caption">Replaceable dummy asset: <strong>dummy-chiller.svg</strong></div></div>','sop-context-modal--photo');
      actionEl.innerHTML=actionPanel(step,{instruction:'Check that the chiller is ON and verify the displayed temperature is ≤ 18°C.',caution:'Do not continue if the cooling system is OFF or the temperature exceeds the permitted value.'},'Displayed example: Chiller ON · 17.5°C','<button class="sop-btn" id="confirm-step">Confirm chiller check</button>');
      bindConfirmButton('I have verified that the chiller is ON and the temperature is 18°C or below.');
    } else if(step.id==='1-2'){
      visualEl.innerHTML=contextModal('TEM room environment','<div><img class="sop-photo" src="../assets/images/sop/dummy-room-ac.svg" alt="Dummy TEM room air-conditioning image showing 21 degrees Celsius"><div class="sop-placeholder-caption">Replaceable dummy asset: <strong>dummy-room-ac.svg</strong></div></div>','sop-context-modal--photo');
      actionEl.innerHTML=actionPanel(step,{instruction:'Confirm the room air conditioning is ON and the room temperature is approximately 20–22°C.'},'Displayed example: Room AC ON · 21°C','<button class="sop-btn" id="confirm-step">Confirm room condition</button>');
      bindConfirmButton('I have verified that the room air conditioning is ON and the room temperature is approximately 20–22°C.');
    } else if(step.id==='1-3'){
      visualEl.innerHTML=contextModal('SIP vacuum monitor','<div><img class="sop-photo" src="../assets/images/sop/dummy-sip-vacuum.svg" alt="Dummy SIP vacuum image showing 2.1 times 10 to the minus 5 pascal"><div class="sop-placeholder-caption">Replaceable dummy asset: <strong>dummy-sip-vacuum.svg</strong></div></div>','sop-context-modal--photo');
      actionEl.innerHTML=actionPanel(step,{instruction:'Read the Sputter Ion Pump (SIP) vacuum and confirm it is ≤ 2.5×10⁻⁵ Pa.'},'Displayed example: 2.1×10⁻⁵ Pa','<button class="sop-btn" id="confirm-step">Confirm SIP vacuum</button>');
      bindConfirmButton('I have verified that the SIP vacuum is 2.5×10⁻⁵ Pa or lower.');
    } else if(step.id==='1-4'){
      visualEl.innerHTML=contextModal('TEMCON PC drawer','<div class="temcon-scene"><div class="temcon-drawer"><div class="temcon-screenbar"><span>JEOL TEMCON · Operation</span><span>200 kV TEM</span></div><div class="temcon-window"><div class="temcon-tabs"><span class="temcon-tab active">Operation</span><span class="temcon-tab">Stage</span><span class="temcon-tab">Maintenance</span></div><div class="temcon-grid"><div class="temcon-box temcon-callout"><div class="temcon-label">HIGH TENSION STATUS</div><div class="temcon-ready">READY</div><div class="temcon-label" style="margin-top:12px">High Voltage Control</div><div class="temcon-ht-off">HT OFF</div></div><div class="temcon-box"><div class="temcon-label">Column Vacuum</div><div class="temcon-value">GOOD</div></div><div class="temcon-box"><div class="temcon-label">Accelerating Voltage</div><div class="temcon-value">0.00 kV</div></div><div class="temcon-box"><div class="temcon-label">Stage</div><div class="temcon-value">NEUTRAL</div></div></div></div></div></div>','sop-context-modal--wide');
      actionEl.innerHTML=actionPanel(step,{instruction:'The PC drawer has opened automatically. Verify that TEMCON shows HT status as “READY” before specimen insertion.',caution:'HT must remain OFF at this stage. Do not turn high tension ON until the specimen is loaded and ready.'},'Required state: HT status READY · HT OFF','<button class="sop-btn" id="verify-ht">I have checked the PC screen</button>');
      document.getElementById('verify-ht').addEventListener('click',function(){ensureAudio();confirmModal('Confirm TEMCON status','Confirm that HT status reads “READY” and that high tension remains OFF before specimen insertion.',completeStep,'TEMCON CHECK');});
    } else if(step.id==='1-5'){
      visualEl.innerHTML=contextModal('Anti-contamination trap','<div class="sop-equipment"><div class="sop-equipment-card"><h3>Anti-contamination trap</h3><div class="ln2-trap"><div class="ln2-can"></div><div class="ln2-level"><strong>Liquid nitrogen level</strong><div class="ln2-level__bar"><div class="ln2-level__fill"></div></div><p style="font-size:.72rem;color:#5b7080;line-height:1.45">Check the trap and refill liquid nitrogen if required before continuing.</p></div></div></div></div>');
      actionEl.innerHTML=actionPanel(step,{instruction:'Check the liquid nitrogen level in the anti-contamination trap and refill it if required.'},'Visual check ready','<button class="sop-btn" id="confirm-step">Confirm LN₂ check</button>');
      bindConfirmButton('I have checked the anti-contamination trap and refilled liquid nitrogen if required.');
    } else if(step.id==='1-6'){
      visualEl.innerHTML=contextModal('Filament & system stabilization','<div class="warmup-panel"><div class="warmup-icon">◉</div><h3>Filament & system stabilization</h3><p style="font-size:.76rem;color:var(--sop-muted)">Run the short simulator check below. It represents the laboratory warm-up requirement; it does not replace the instrument-specific recommended warm-up period.</p><div class="warmup-bar"><span id="warmup-fill"></span></div><div class="warmup-readout" id="warmup-readout">Ready to start simulated stabilization check</div></div>');
      actionEl.innerHTML=actionPanel(step,{instruction:'Allow the filament and system to stabilize for the recommended warm-up period specified by the operating guidelines.'},state.warmupDone?'Simulated stabilization check complete.':'The simulator uses a short progress animation only; follow the real instrument guideline for actual warm-up time.','<button class="sop-btn" id="warmup-btn">'+(state.warmupDone?'Continue':'Start simulated stabilization')+'</button>');
      document.getElementById('warmup-btn').addEventListener('click',function(){ensureAudio();if(state.warmupDone){completeStep();return;}var btn=this,fill=document.getElementById('warmup-fill'),read=document.getElementById('warmup-readout');btn.disabled=true;var p=0;var timer=setInterval(function(){p+=4;fill.style.width=p+'%';read.textContent='Stabilizing… '+p+'%';if(p>=100){clearInterval(timer);state.warmupDone=true;read.textContent='Stabilization check complete';btn.disabled=false;btn.textContent='Continue';}},120);});
    } else if(step.id==='1-7'){
      var now=new Date(),date=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),time=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
      visualEl.innerHTML=contextModal('Instrument startup logbook','<form class="logbook" id="startup-log"><h3>TEM Instrument Startup Log</h3><div class="logbook-grid"><label>Date<input id="log-date" type="date" value="'+date+'" required></label><label>Time<input id="log-time" type="time" value="'+time+'" required></label><label class="full">Operator name<input id="log-operator" type="text" placeholder="Enter operator name" autocomplete="name" required></label></div></form>');
      actionEl.innerHTML=actionPanel(step,{instruction:'Record the instrument startup in the logbook, including date, time, and operator name.'},'All three fields are required.','<button class="sop-btn" id="save-log">Save startup log</button>');
      document.getElementById('save-log').addEventListener('click',function(){ensureAudio();var name=document.getElementById('log-operator').value.trim();if(!name){document.getElementById('action-status').textContent='Enter the operator name before saving the startup record.';document.getElementById('log-operator').focus();return;}confirmModal('Save startup record','Confirm the startup log entry and complete Section 1.',completeStep,'LOGBOOK');});
    }
  }

  function renderSection2(step){
    if(step.id==='2-1'){
      visualEl.innerHTML='<div class="oring-demo"><div class="holder-tip"></div><div class="oring-zoom"></div></div>'+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'Inspect the holder O-rings for damage, dust, or old grease. Clean with a lint-free wipe and re-grease lightly if required before use.'},'Inspect both sealing O-rings before holder insertion.','<button class="sop-btn" id="confirm-step">Confirm O-ring inspection</button>');
      bindConfirmButton('I have inspected the holder O-rings and cleaned / lightly re-greased them if required.');
    } else if(step.id==='2-2'){
      visualEl.innerHTML='<div class="gonio-scene"><img class="gonio-photo" src="../assets/images/microscope/goniometer-reference.png" alt="Goniometer reference"><span class="gonio-led green is-on" title="Green ready lamp"></span><span class="gonio-led amber" title="Amber evacuation lamp"></span></div>'+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'Confirm that the goniometer green lamp is lit, indicating that the goniometer is ready for holder loading.',caution:'If the green lamp is not lit, do not attempt to insert the holder.'},'Green ready lamp is highlighted.','<button class="sop-btn" id="confirm-step">Confirm green lamp</button>');
      bindConfirmButton('I have verified that the goniometer green lamp is lit.');
    } else if(step.id==='2-3'){
      visualEl.innerHTML='<div class="cartridge"><div class="cartridge-body" id="cartridge-body"><div class="cartridge-slot"></div><div class="tem-grid"></div><div class="retaining-clip"></div></div><div class="sequence-row"><button class="seq-btn" id="seq-open">1 · Open cartridge</button><button class="seq-btn" id="seq-grid" disabled>2 · Place grid sample-side up</button><button class="seq-btn" id="seq-close" disabled>3 · Close retaining clip</button></div></div>'+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'Open the holder cartridge, place the TEM grid sample-side up using fine anti-static tweezers, then close the retaining clip securely.'},'Complete the three actions in order.','<button class="sop-btn" id="seq-continue" disabled>Continue</button>');
      bindGridSequence();
    } else if(step.id==='2-4'){
      visualEl.innerHTML='<div class="insertion-rig"><div class="insertion-track" id="insert-track"><div class="first-stop"><span>FIRST MECHANICAL STOP</span></div><div class="insertion-port"></div><div class="drag-holder" id="drag-holder"></div></div><div class="click-indicator"><span>CLICK 1</span><span>CLICK 2</span><span>CLICK 3</span></div></div>'+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'Follow the guide key and push the holder straight to the first mechanical stop. Support the holder with your finger until you hear three clicks.',caution:'Do not force the holder. If resistance is felt, check guide-key alignment before continuing.'},state.insertionDone?'First stop reached · three clicks completed.':'Drag the holder to the right until it reaches the marked first stop.','<button class="sop-btn" id="insert-continue" '+(state.insertionDone?'':'disabled')+'>Continue</button>');
      bindInsertion();
    } else if(step.id==='2-5'){
      visualEl.innerHTML=pumpVisual(true)+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'Set the goniometer PUMP/AIR switch to PUMP by pulling it out while turning. The amber lamp will light while evacuation is in progress.'},'Click the PUMP/AIR control. Pumping sound will begin.','<button class="sop-btn" id="pump-command">Set switch to PUMP</button>');
      document.getElementById('pump-switch').addEventListener('click',activatePump); document.getElementById('pump-command').addEventListener('click',activatePump);
    } else if(step.id==='2-6'){
      visualEl.innerHTML=pumpVisual(false)+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'Wait for the amber lamp to go out, indicating that the goniometer has reached sufficient vacuum.',caution:'Do not rotate or push the holder while the amber lamp is lit.'},state.evacuationDone?'Amber lamp OFF · vacuum ready.':'Evacuating goniometer… pumping sound remains active.','<button class="sop-btn" id="vacuum-continue" '+(state.evacuationDone?'':'disabled')+'>Continue after amber lamp is OFF</button>');
      startEvacuationWait();
      var vc=document.getElementById('vacuum-continue'); if(vc)vc.addEventListener('click',completeStep);
    } else if(step.id==='2-7'){
      visualEl.innerHTML='<div class="rotation-rig"><div class="rotation-dial"><div class="rotation-handle" id="rotation-handle"></div><div class="rotation-center"></div></div><div class="rotation-slider"><strong>Clockwise holder rotation</strong><div class="rotation-readout" id="rotation-readout">0°</div><input type="range" id="rotation-range" min="0" max="75" step="1" value="0" aria-label="Holder rotation angle"><div class="rotation-steps"><span id="rot15">15° first</span><span id="rot75">75° next</span><span id="rotSeat">Fully seated</span></div><button class="sop-btn" id="seat-holder" disabled>Insert holder fully</button></div></div>'+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'After the amber lamp is out, rotate the holder 15° clockwise first, then continue to 75° clockwise, and finally insert the holder fully into the column.'},'Move the rotation control through the two required target angles in sequence.','<div class="sop-status-note" id="rotation-status">Target 1: rotate to 15° clockwise.</div><button class="sop-btn" id="rotation-continue" disabled>Continue</button>');
      bindRotation();
    } else if(step.id==='2-8'){
      visualEl.innerHTML='<div class="trackball-rig"><div class="trackball-unit"><h4>JEOL SPEC CONTROL</h4><div class="trackball" id="spec-trackball" aria-label="Interactive stage trackball"></div><div style="text-align:center;margin-top:12px;font-size:.65rem;font-weight:800">DRAG WITH MOUSE</div></div><div class="stage-monitor"><span class="stage-monitor__label">STAGE RESPONSE · X/Y DEMONSTRATION</span><div class="stage-dot" id="stage-dot"></div></div></div>'+overviewInset();
      actionEl.innerHTML=actionPanel(step,{instruction:'Use the JEOL SPEC CONTROL trackball to demonstrate that the specimen stage responds to manual movement. Drag the trackball with the mouse and observe the stage-response marker.'},state.trackballMoved?'Stage response detected. You can now confirm the check.':'Move the trackball in any direction to demonstrate stage response.','<button class="sop-btn" id="trackball-confirm" '+(state.trackballMoved?'':'disabled')+'>Confirm stage motion</button>');
      bindTrackball();
    }
  }

  function bindGridSequence(){
    var body=document.getElementById('cartridge-body'),open=document.getElementById('seq-open'),grid=document.getElementById('seq-grid'),close=document.getElementById('seq-close'),cont=document.getElementById('seq-continue');
    open.addEventListener('click',function(){ensureAudio();state.gridStage=Math.max(state.gridStage,1);body.classList.add('is-open');open.classList.add('is-done');open.disabled=true;grid.disabled=false;});
    grid.addEventListener('click',function(){state.gridStage=Math.max(state.gridStage,2);body.classList.add('is-grid');grid.classList.add('is-done');grid.disabled=true;close.disabled=false;});
    close.addEventListener('click',function(){state.gridStage=3;body.classList.add('is-closed');close.classList.add('is-done');close.disabled=true;cont.disabled=false;});
    cont.addEventListener('click',completeStep);
  }

  function bindInsertion(){
    var holder=document.getElementById('drag-holder'),track=document.getElementById('insert-track'),stop=document.querySelector('.first-stop'),cont=document.getElementById('insert-continue'); if(!holder||!track)return;
    function maxLeft(){return Math.max(25,(stop ? stop.offsetLeft : track.clientWidth-205)-holder.offsetWidth+6);}
    if(state.insertionDone){holder.style.left=maxLeft()+'px';cont.disabled=false;cont.addEventListener('click',completeStep);return;}
    var dragging=false,startX=0,startLeft=25;
    holder.addEventListener('pointerdown',function(e){ensureAudio();dragging=true;startX=e.clientX;startLeft=parseFloat(holder.style.left)||25;holder.setPointerCapture(e.pointerId);holder.classList.add('is-dragging');});
    holder.addEventListener('pointermove',function(e){if(!dragging)return;var x=Math.max(25,Math.min(maxLeft(),startLeft+e.clientX-startX));holder.style.left=x+'px';});
    holder.addEventListener('pointerup',function(e){if(!dragging)return;dragging=false;holder.classList.remove('is-dragging');var x=parseFloat(holder.style.left)||25;if(x>=maxLeft()-8){state.insertionDone=true;holder.style.left=maxLeft()+'px';playThreeClicks();document.getElementById('action-status').textContent='First stop reached. Supporting holder while three clicks are heard…';setTimeout(function(){cont.disabled=false;document.getElementById('action-status').textContent='Three clicks completed. Holder is at the first mechanical stop.';},1250);} });
    cont.addEventListener('click',completeStep);
  }

  function pumpVisual(interactive){
    return '<div class="pump-control"><div class="pump-switch-panel"><div class="pump-labels"><span>PUMP</span><span>AIR</span></div><div class="pump-switch'+(state.pumpStarted?' is-pump':'')+'" id="pump-switch" title="PUMP/AIR switch"></div><div class="pump-status"><span class="pump-lamp'+(!state.evacuationDone && state.pumpStarted?' is-on':'')+'" id="amber-lamp"></span><strong>AMBER</strong></div></div><div class="vacuum-gauge"><div style="font-size:.7rem;color:#90b2c4">GONIOMETER AIRLOCK</div><strong id="vacuum-readout">'+(state.evacuationDone?'VACUUM READY':'EVACUATING')+'</strong><div class="pump-wave" id="pump-wave" style="'+(state.evacuationDone?'animation:none;opacity:.25':'')+'"></div><div class="vacuum-progress"><span id="vacuum-progress" style="width:'+(state.evacuationDone?'100':'0')+'%"></span></div></div></div>';
  }

  function activatePump(){
    if(state.pumpStarted)return;ensureAudio();state.pumpStarted=true;startPumpSound();completeStep();
  }

  function startEvacuationWait(){
    if(state.evacuationDone){stopPumpSound();return;}
    startPumpSound(); if(state.pumpTimer)return;
    var started=Date.now(),duration=6500; var bar=document.getElementById('vacuum-progress'),read=document.getElementById('vacuum-readout'),lamp=document.getElementById('amber-lamp'),btn=document.getElementById('vacuum-continue');
    state.pumpTimer=setInterval(function(){var p=Math.min(100,(Date.now()-started)/duration*100);if(bar)bar.style.width=p+'%';if(read)read.textContent='EVACUATING · '+Math.round(p)+'%';if(p>=100){clearInterval(state.pumpTimer);state.pumpTimer=null;state.evacuationDone=true;stopPumpSound();if(lamp)lamp.classList.remove('is-on');if(read)read.textContent='VACUUM READY';if(btn)btn.disabled=false;var status=document.getElementById('action-status');if(status)status.textContent='Amber lamp OFF · sufficient vacuum reached. You may continue.';}},160);
  }

  function bindRotation(){
    var range=document.getElementById('rotation-range'),handle=document.getElementById('rotation-handle'),read=document.getElementById('rotation-readout'),r15=document.getElementById('rot15'),r75=document.getElementById('rot75'),seat=document.getElementById('seat-holder'),rSeat=document.getElementById('rotSeat'),cont=document.getElementById('rotation-continue'),status=document.getElementById('rotation-status');
    range.addEventListener('input',function(){ensureAudio();var v=Number(range.value);handle.style.transform='rotate('+v+'deg)';read.textContent=v+'°';if(!state.rotation15 && v>=14 && v<=18){state.rotation15=true;r15.classList.add('done');status.textContent='15° reached. Target 2: continue clockwise to 75°.';}if(state.rotation15 && v>=74){state.rotation75=true;r75.classList.add('done');seat.disabled=false;status.textContent='75° reached. Push the holder fully into the column.';}});
    seat.addEventListener('click',function(){if(!state.rotation75)return;playMechanicalClick(0);state.holderSeated=true;rSeat.classList.add('done');seat.disabled=true;cont.disabled=false;status.textContent='Holder fully seated in the goniometer stage.';});
    cont.addEventListener('click',completeStep);
  }

  function bindTrackball(){
    var ball=document.getElementById('spec-trackball'),dot=document.getElementById('stage-dot'),btn=document.getElementById('trackball-confirm');if(!ball)return;
    var dragging=false,lastX=0,lastY=0,total=0,x=50,y=50;
    ball.addEventListener('pointerdown',function(e){ensureAudio();dragging=true;lastX=e.clientX;lastY=e.clientY;ball.setPointerCapture(e.pointerId);ball.classList.add('is-dragging');});
    ball.addEventListener('pointermove',function(e){if(!dragging)return;var dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;total+=Math.abs(dx)+Math.abs(dy);x=Math.max(12,Math.min(88,x+dx*.16));y=Math.max(12,Math.min(88,y+dy*.16));dot.style.left=x+'%';dot.style.top=y+'%';if(total>42&&!state.trackballMoved){state.trackballMoved=true;btn.disabled=false;document.getElementById('action-status').textContent='Stage response detected from trackball movement. Confirm after checking the response.';}});
    ball.addEventListener('pointerup',function(){dragging=false;ball.classList.remove('is-dragging');});
    btn.addEventListener('click',function(){if(!state.trackballMoved)return;confirmModal('Confirm stage motion','Confirm that you observed stage response while moving the JEOL SPEC CONTROL trackball.',completeStep,'STAGE CHECK');});
  }

  document.addEventListener('visibilitychange',function(){if(document.hidden)stopPumpSound();else if(state.currentSection===2 && state.currentStep===5 && !state.evacuationDone)startPumpSound();});
  window.addEventListener('beforeunload',stopPumpSound);

  render();
})();
