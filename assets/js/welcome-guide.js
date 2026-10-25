(function(){
  'use strict';
  var guide=null,previousFocus=null,autoTimer=null;
  var AUTO_DELAY_MS=1300;
  var AUTO_KEY='tem-guide-first-auto-v4.9.65';
  function hasAutoShown(){try{return sessionStorage.getItem(AUTO_KEY)==='1';}catch(_){return window.__temAutoGuideShown===true;}}
  function markAutoShown(){window.__temAutoGuideShown=true;try{sessionStorage.setItem(AUTO_KEY,'1');}catch(_){}}

  function build(){
    if(guide)return;
    guide=document.createElement('div');
    guide.className='tem-welcome-overlay';guide.id='temWelcomeGuide';
    guide.innerHTML='<div class="tem-welcome-shade" data-welcome-close></div>'+
      '<section class="tem-welcome-panel" role="dialog" aria-modal="true" aria-labelledby="temWelcomeTitle" aria-describedby="temWelcomeList" tabindex="-1">'+
      '<div class="tem-welcome-heading"><div><span class="tem-welcome-eyebrow">JEOL JEM-2100 · Simulator quick start</span><h2 id="temWelcomeTitle">How to use this simulator</h2></div><button type="button" data-welcome-close class="tem-welcome-x" aria-label="Close instructions">×</button></div>'+
      '<ol id="temWelcomeList" class="tem-welcome-list">'+
      '<li><strong>Choose a module:</strong> explore <b>The Column</b> or select <b>The Microscope → Guided Session</b>.</li>'+
      '<li><strong>Begin:</strong> click <b>Start</b> and choose <b>Nanoparticles / Suspension</b>.</li>'+
      '<li><strong>Follow each step:</strong> read the instruction bar and interact with the highlighted microscope controls; use <b>Show Step</b> to reopen guidance.</li>'+
      '<li><strong>Navigate freely:</strong> use <b>Skip Step</b> to move on without performing an action, <b>Undo</b> to return, or a section tab to change sections.</li>'+
      '<li><strong>Use the controls:</strong> turn audio on/off, switch to <b>Full Screen</b> for clearer viewing, or select <b>Restart</b> to start over.</li>'+
      '</ol><p class="tem-welcome-note">Four section tabs are shown: Safety & Startup, Specimen Loading, Bright Field, and Shutdown. Shutdown guidance is not yet available.</p>'+
      '<div class="tem-welcome-actions"><button type="button" data-welcome-close class="tem-welcome-continue">Got it — Explore Simulator →</button></div></section>';
    document.body.appendChild(guide);
    guide.addEventListener('click',function(ev){if(ev.target.closest('[data-welcome-close]'))close();});
  }
  function open(){
    if(autoTimer!==null){clearTimeout(autoTimer);autoTimer=null;}
    // Manual opening before the scheduled popup suppresses that second popup.
    markAutoShown();build();
    if(guide.classList.contains('is-open'))return;
    previousFocus=document.activeElement;guide.classList.add('is-open');
    var b=guide.querySelector('.tem-welcome-continue');if(b)b.focus();
  }
  function close(){if(!guide)return;guide.classList.remove('is-open');if(previousFocus&&previousFocus!==document.body&&previousFocus.focus)previousFocus.focus();}
  document.addEventListener('keydown',function(ev){if(guide&&guide.classList.contains('is-open')&&ev.key==='Escape'){ev.stopPropagation();close();}else if(guide&&guide.classList.contains('is-open')&&ev.key==='Tab'){
    var els=[].slice.call(guide.querySelectorAll('button'));var i=els.indexOf(document.activeElement);if(ev.shiftKey&&i===0){ev.preventDefault();els[els.length-1].focus();}else if(!ev.shiftKey&&i===els.length-1){ev.preventDefault();els[0].focus();}
  }},true);
  // Top navigation is injected on DOMContentLoaded; delegate so ? always works.
  document.addEventListener('click',function(ev){if(ev.target.closest('#btn-howto'))open();});
  if(!window.TEM)window.TEM={};window.TEM.showWelcomeGuide=open;
  // Show automatically once per browser session (not once for each internal page).
  // The delay allows the instrument shell to render before a modal overlays it.
  if(!hasAutoShown()){
    autoTimer=setTimeout(function(){autoTimer=null;if(!hasAutoShown())open();},AUTO_DELAY_MS);
  }
})();
