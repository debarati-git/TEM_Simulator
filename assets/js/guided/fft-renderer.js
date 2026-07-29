/* =========================================================================
   Guided Simulator — Live FFT Canvas Renderer
   Draws concentric rings on the FFT canvas. Shape responds to objStig:
     - Round rings when objStig is near (0,0) and focus is sharp
     - Streaked/elliptical when objStig or focus is off
   ========================================================================= */
(function () {
  'use strict';

  var canvas, ctx;
  var animId = null;

  function init() {
    canvas = document.getElementById('pc-fft-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    TEM.state.subscribe(function(key) {
      if (key === 'objStig' || key === 'focusFine' || key === 'focusCoarse' ||
          key === 'cameraLiveView' || key === 'screenRaised' || key === 'liveFFTOn') {
        render();
      }
    });
    render();
  }

  function render() {
    if (!ctx) return;
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Only draw when camera is live
    var s = TEM.state.getAll();
    if (!s.cameraLiveView || !s.screenRaised) {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NO SIGNAL', w / 2, h / 2 + 3);
      return;
    }

    // Dark background
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, w, h);

    var cx = w / 2;
    var cy = h / 2;

    // Stigmation values — affects ring ellipticity
    var stigX = (s.objStig ? s.objStig.x : 0) / 50;
    var stigY = (s.objStig ? s.objStig.y : 0) / 50;

    // Focus — affects ring sharpness (blur)
    var focus = Math.abs(s.focusFine || 0) + Math.abs(s.focusCoarse || 0) * 0.5;
    var defocusAmount = Math.min(focus / 8, 1);

    // Draw 4 concentric rings
    var radii = [0.15, 0.3, 0.48, 0.68];
    var alphas = [0.7, 0.5, 0.35, 0.2];

    for (var i = 0; i < radii.length; i++) {
      var baseR = radii[i] * Math.min(w, h) / 2;
      // Astigmatism stretches rings
      var rx = baseR * (1 + stigX * 0.8);
      var ry = baseR * (1 - stigY * 0.8);
      var rot = (stigX * stigY) * 0.7;

      // Ring width (thicker when out of focus)
      var ringWidth = 1.5 + defocusAmount * 6;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(2, rx), Math.max(2, ry), 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180, 220, 255, ' + alphas[i] + ')';
      ctx.lineWidth = ringWidth;
      ctx.stroke();

      // Inner glow
      if (ringWidth < 3) {
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(2, rx), Math.max(2, ry), 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(120, 190, 255, ' + (alphas[i] * 0.4) + ')';
        ctx.lineWidth = ringWidth + 3;
        ctx.stroke();
      }

      ctx.restore();
    }

    // Central bright spot
    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
    grad.addColorStop(0, 'rgba(220, 240, 255, 0.9)');
    grad.addColorStop(0.5, 'rgba(160, 200, 240, 0.4)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  window.TEM = window.TEM || {};
  window.TEM.fftRenderer = { init: init, render: render };
})();
