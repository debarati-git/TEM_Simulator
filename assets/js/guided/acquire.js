/* =========================================================================
   Guided Simulator — Image Acquisition & Download
   When the user presses ACQUIRE on the final step, capture the current
   viewing screen state to a PNG and trigger a download.

   Since the viewing screen is rendered with DOM elements (gradients,
   CSS filters) rather than a canvas, we draw an approximation directly
   to a fresh canvas using the current state values.
   ========================================================================= */

(function () {
  'use strict';

  /** Capture and trigger a download. */
  function capture() {
    const s = TEM.state.getAll();
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Black phosphor background
    ctx.fillStyle = '#03050a';
    ctx.fillRect(0, 0, size, size);

    // Clip to the circular phosphor screen
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.clip();

    // Subtle inner gradient (phosphor screen feel)
    const bgGrad = ctx.createRadialGradient(
      size / 2, size * 0.45, 0,
      size / 2, size / 2, size / 2
    );
    bgGrad.addColorStop(0, '#0a1014');
    bgGrad.addColorStop(0.55, '#06090c');
    bgGrad.addColorStop(1, '#03050a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Draw the sample
    drawSample(ctx, size, s);

    // Scan-line texture
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#ffffff';
    for (let y = 0; y < size; y += 3) {
      ctx.fillRect(0, y, size, 1);
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // Frame ring
    ctx.strokeStyle = 'rgba(77, 208, 225, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();

    // Metadata footer — small lab-record overlay at the bottom edge
    drawMetadata(ctx, size, s);

    // Trigger download
    const filename = `TEM_${s.sample || 'sample'}_${stamp()}.png`;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 500);
    }, 'image/png');
  }

  /** Draw the sample (placeholder particle field) into the canvas. */
  function drawSample(ctx, size, s) {
    const mag = s.magnification || 'low';
    const focus = Math.abs(s.focus ?? 0);
    const blur = Math.max(0, focus / 5);    // matches the live renderer

    // Stage offset within the field of view
    const magScale = mag === 'low' ? 0.4 : mag === 'medium' ? 1.0 : 2.5;
    const offX = -(s.stageX ?? 0) * 0.3 * magScale * size / 100;
    const offY =  (s.stageY ?? 0) * 0.3 * magScale * size / 100;

    if (blur > 0) ctx.filter = `blur(${blur.toFixed(1)}px)`;

    // Number of particles and their scale depend on magnification
    const particles = particlesFor(mag);
    for (const p of particles) {
      const cx = (p.x / 100) * size + offX;
      const cy = (p.y / 100) * size + offY;
      const r = p.r * size / 100;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,   `rgba(230, 240, 250, ${p.alpha})`);
      grad.addColorStop(0.5, `rgba(180, 210, 230, ${p.alpha * 0.5})`);
      grad.addColorStop(1,   'rgba(120, 180, 210, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.filter = 'none';
  }

  /** Particle positions for each magnification level. */
  function particlesFor(mag) {
    if (mag === 'low') {
      return [
        { x: 30, y: 40, r: 0.6, alpha: 0.65 },
        { x: 65, y: 30, r: 0.6, alpha: 0.6  },
        { x: 45, y: 55, r: 0.7, alpha: 0.7  },
        { x: 70, y: 65, r: 0.6, alpha: 0.55 },
        { x: 25, y: 75, r: 0.6, alpha: 0.6  },
        { x: 80, y: 80, r: 0.5, alpha: 0.5  },
        { x: 55, y: 25, r: 0.6, alpha: 0.6  },
        { x: 15, y: 35, r: 0.5, alpha: 0.5  },
        { x: 85, y: 45, r: 0.6, alpha: 0.55 },
        { x: 40, y: 85, r: 0.5, alpha: 0.5  },
        { x: 65, y: 90, r: 0.5, alpha: 0.5  },
        { x: 10, y: 60, r: 0.6, alpha: 0.6  },
      ];
    }
    if (mag === 'medium') {
      return [
        { x: 30, y: 40, r: 1.6, alpha: 0.8 },
        { x: 65, y: 30, r: 1.6, alpha: 0.75 },
        { x: 45, y: 55, r: 1.8, alpha: 0.85 },
        { x: 70, y: 65, r: 1.4, alpha: 0.7  },
        { x: 25, y: 75, r: 1.6, alpha: 0.75 },
        { x: 80, y: 80, r: 1.3, alpha: 0.65 },
        { x: 55, y: 25, r: 1.6, alpha: 0.75 },
        { x: 50, y: 50, r: 2.0, alpha: 0.85 },
      ];
    }
    // high
    return [
      { x: 45, y: 50, r: 5.5, alpha: 0.95 },
      { x: 55, y: 45, r: 4.5, alpha: 0.9 },
      { x: 50, y: 55, r: 4.2, alpha: 0.85 },
      { x: 35, y: 60, r: 5.5, alpha: 0.8 },
      { x: 65, y: 60, r: 5.0, alpha: 0.75 },
    ];
  }

  /** Lab-record metadata footer drawn inside the screen. */
  function drawMetadata(ctx, size, s) {
    ctx.save();
    ctx.font = '14px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(77, 208, 225, 0.6)';
    ctx.textBaseline = 'bottom';

    const margin = 24;
    const lines = [
      `TEM · ${s.sample ? s.sample.toUpperCase() : 'SAMPLE'}`,
      `HV ${s.accVoltage ?? '—'} kV   MAG ${String(s.magnification || '—').toUpperCase()}`,
      `${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
    ];
    let y = size - margin;
    for (let i = lines.length - 1; i >= 0; i--) {
      ctx.fillText(lines[i], margin, y);
      y -= 18;
    }
    ctx.restore();
  }

  function stamp() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  window.TEM = window.TEM || {};
  window.TEM.acquire = { capture };
})();
