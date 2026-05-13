/* =========================================================================
   TEM Simulator — Column components data
   Loaded as a JS file so it works under file:// without fetch.
   Canonical mirror lives at /data/components.json.

   Hotspot coordinates are percentages of the source image (1166x1349)
   and were derived by scanning the image for label-text bounding boxes
   and verifying against an overlaid percentage grid.

   - hotspot {x,y,w,h}: rectangle covering the label TEXT in the diagram
   - pin     {x,y}    : centre of the optical element the label points to
   ========================================================================= */
(function () {
  'use strict';
  window.TEM = window.TEM || {};

  window.TEM.dataColumnComponents = {
    image: {
      src: '../assets/images/column/tem-column-anatomy.jpg',
      width: 1166,
      height: 1349
    },
    components: [
      /* ---------- LEFT-SIDE LABELS (top to bottom) ---------- */
      {
        id: 'gun',
        name: 'Electron Gun',
        role: 'Source of the electron beam',
        body: [
          'Sits at the very top of the column. Generates a stream of electrons either by heating a filament (thermionic emission — tungsten or LaB\u2086) or by extracting electrons from a sharp tip with a strong electric field (field-emission gun, FEG).',
          'Electrons are then accelerated through the high-voltage potential difference of 80–300 kV, giving them the energy to penetrate the specimen. The brightness and coherence of the beam are set here and determine the ultimate quality of the image.'
        ],
        hotspot: { x: 11.0, y: 13.5, w: 14.0, h: 2.0 },
        pin: { x: 36.0, y: 13.0 }
      },
      {
        id: 'condenser-aperture',
        name: 'Condenser Aperture',
        role: 'Trims the beam — controls coherence and current',
        body: [
          'A precision-machined hole (typically 30–200 µm) placed below the gun. It blocks electrons travelling at large angles and lets through only a narrow, axial pencil of the beam.',
          'Smaller apertures give better coherence and contrast but reduce beam current. The operator picks an aperture size based on the imaging task — large for bright-field overviews, small for high-resolution work.'
        ],
        hotspot: { x: 5.0, y: 18.2, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 18.5 }
      },
      {
        id: 'condenser-lens-1',
        name: 'Condenser Lens 1 (C1)',
        role: 'First beam-shaping lens',
        body: [
          'An electromagnetic lens whose primary job is to demagnify the electron source — turning a relatively large gun crossover into a small effective source.',
          'C1 is the dominant control of probe size in STEM mode. In conventional TEM imaging, C1 is usually set to a fixed strength and the operator works mainly with C2.'
        ],
        hotspot: { x: 5.0, y: 22.6, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 23.5 }
      },
      {
        id: 'condenser-lens-2',
        name: 'Condenser Lens 2 (C2)',
        role: 'Final beam-conditioning lens — the BRIGHTNESS knob',
        body: [
          'Focuses the demagnified source onto, or above, the specimen plane. The C2 strength is what the operator changes when adjusting the brightness knob.',
          'Setting C2 to focus the beam exactly on the specimen produces a tightly converged spot (used for STEM and microdiffraction). Spreading C2 above or below the specimen gives a broad, parallel illumination — required for high-quality conventional TEM imaging and selected-area diffraction.'
        ],
        hotspot: { x: 5.0, y: 27.6, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 28.5 }
      },
      {
        id: 'objective-aperture',
        name: 'Objective Aperture',
        role: 'Sits in the back focal plane — sets image contrast',
        body: [
          'Inserted into the back focal plane of the objective lens, where the diffraction pattern of the specimen forms. By blocking electrons that were scattered through large angles, it raises amplitude contrast — vital for unstained biological sections and weakly scattering materials.',
          'Smaller objective apertures give higher contrast but limit resolution. The aperture must be aligned so its centre lies on the optical axis, otherwise the resulting image will appear shaded or skewed.'
        ],
        hotspot: { x: 5.0, y: 35.9, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 35.0 }
      },
      {
        id: 'objective-lens-upper',
        name: 'Objective Lens — Upper Polepiece',
        role: 'Pre-focuses the beam onto the specimen',
        body: [
          'The upper polepiece of the split-objective lens. It tightens the beam down onto the specimen plane and forms part of the strong magnetic field in which the specimen sits.',
          'The polepiece geometry (the gap between upper and lower) sets the available specimen tilt range and ultimately limits resolution. Modern high-resolution TEMs use a narrow polepiece gap (~3–5 mm).'
        ],
        hotspot: { x: 5.0, y: 39.5, w: 20.0, h: 2.3 },
        pin: { x: 36.0, y: 41.0 }
      },
      {
        id: 'objective-lens-lower',
        name: 'Objective Lens — Lower Polepiece',
        role: 'Forms the first magnified image',
        body: [
          'The lower polepiece, immediately below the specimen, performs the first stage of magnification. This is the most important lens in the entire microscope — its spherical (C\u209b) and chromatic (C\u1d04) aberrations set the resolution floor for the whole instrument.',
          'Focus adjustments mostly act on this lens. The objective stigmator nearby corrects astigmatism introduced by polepiece imperfections.'
        ],
        hotspot: { x: 5.0, y: 44.2, w: 20.0, h: 2.2 },
        pin: { x: 36.0, y: 46.5 }
      },
      {
        id: 'sad-aperture',
        name: 'SAD Aperture',
        role: 'Selects a region for diffraction',
        body: [
          'The Selected-Area Diffraction aperture sits in the image plane of the objective lens. Because it lives in an image plane (not a diffraction plane), inserting it physically restricts the field of view — only electrons that passed through a chosen patch of the specimen contribute to the diffraction pattern.',
          'Selectable region size is typically 0.1–10 µm. SAD is the standard technique for crystallographic identification and orientation analysis of micron-scale features.'
        ],
        hotspot: { x: 5.0, y: 47.7, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 48.7 }
      },
      {
        id: 'intermediate-lens-1',
        name: 'Intermediate Lens 1',
        role: 'Switches between image and diffraction modes',
        body: [
          'The intermediate lens chooses what the projector system relays to the screen. With one excitation it images the back focal plane of the objective lens — producing a diffraction pattern. With a different excitation it images the first image plane — producing a real-space image.',
          'Toggling the Mode selector on the control panel between IMAGING and DIFFRACTION is, at the column level, a change of intermediate-lens strength.'
        ],
        hotspot: { x: 5.0, y: 52.4, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 53.4 }
      },
      {
        id: 'projector-lens-1',
        name: 'Projector Lens 1',
        role: 'First stage of final magnification',
        body: [
          'A post-specimen lens that further magnifies the intermediate image (or diffraction pattern) on its way down to the viewing screen.',
          'Projector lenses operate in series and contribute most of the system\u2019s adjustable magnification. The magnification controls on the panel cascade through the intermediate and projector lens excitations.'
        ],
        hotspot: { x: 5.0, y: 56.0, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 57.5 }
      },
      {
        id: 'projector-lens-2',
        name: 'Projector Lens 2',
        role: 'Final stage of magnification',
        body: [
          'The last electromagnetic lens in the column. Together with Projector Lens 1 and the intermediate lens, it projects the final image onto the phosphor screen or camera with total magnifications up to about 1,500,000×.',
          'Beam alignment through this lens is fine-tuned with the projector alignment trackpad — small misalignments here cause the image to shift when the magnification is changed.'
        ],
        hotspot: { x: 5.0, y: 59.8, w: 20.0, h: 2.0 },
        pin: { x: 36.0, y: 61.0 }
      },
      {
        id: 'stem-detector',
        name: 'STEM Detector',
        role: 'Scanning-mode signal collection',
        body: [
          'In Scanning Transmission Electron Microscopy (STEM) mode, the beam is focused to a small probe and rastered across the specimen. Different detectors collect different scattered signals:',
          'Bright-Field (BF) — electrons that passed through unscattered. Dark-Field / HAADF (High-Angle Annular Dark Field) — electrons scattered to high angles, giving Z-contrast. The detector is inserted into the beam path below the column when STEM mode is selected.'
        ],
        hotspot: { x: 5.0, y: 67.9, w: 20.0, h: 2.2 },
        pin: { x: 26.0, y: 70.5 }
      },
      {
        id: 'camera',
        name: 'Camera (Recording)',
        role: 'Captures the final digital image',
        body: [
          'A CCD, CMOS, or direct-electron detector camera mounted below the phosphor screen. During acquisition the phosphor is lifted out of the way (or made transparent) so the beam strikes the camera directly.',
          'Modern direct-electron detectors enable single-electron counting and have dramatically improved low-dose imaging of beam-sensitive specimens such as cryo-EM samples.'
        ],
        hotspot: { x: 8.0, y: 83.7, w: 25.0, h: 1.9 },
        pin: { x: 38.0, y: 85.5 }
      },

      /* ---------- RIGHT-SIDE LABELS ---------- */
      {
        id: 'column',
        name: 'Column',
        role: 'Evacuated electron pathway',
        body: [
          'A vertical, sealed vacuum chamber housing the entire optical system. The column is kept at roughly 10\u207b\u2077 torr (or better near the gun) so that electrons can travel from the source to the detector with negligible scattering by residual gas.',
          'All lenses, apertures, deflectors, and the specimen stage are integrated into the column. A complex differential pumping system maintains the vacuum hierarchy from gun to viewing chamber.'
        ],
        hotspot: { x: 47.0, y: 21.4, w: 8.0, h: 2.0 },
        pin: { x: 41.0, y: 25.0 }
      },
      {
        id: 'specimen',
        name: 'Specimen',
        role: 'The sample under examination',
        body: [
          'An ultra-thin specimen — typically under 100 nm thick — sits in a side-entry holder inserted through an airlock into the gap between the upper and lower objective polepieces.',
          'The holder rests on the goniometer stage, which provides motorised X / Y / Z translation and tilt about one or two axes. Eucentric height (Z) is set so that the specimen stays centred under tilt — the standard starting condition for any alignment.'
        ],
        hotspot: { x: 46.0, y: 42.5, w: 9.0, h: 1.9 },
        pin: { x: 42.0, y: 43.5 }
      },
      {
        id: 'binoculars',
        name: 'Binoculars',
        role: 'Direct optical viewing of the phosphor',
        body: [
          'A pair of low-power optical objectives that lets the operator inspect the phosphor screen at magnification of about 10×. Used for fine focusing and final alignment.',
          'On modern microscopes with continuous live digital readout, binoculars are increasingly secondary — but they remain useful for low-dose work where the camera might saturate.'
        ],
        hotspot: { x: 53.0, y: 65.4, w: 10.0, h: 2.3 },
        pin: { x: 45.0, y: 65.0 }
      },
      {
        id: 'phosphor-screen',
        name: 'Phosphor Screen',
        role: 'Real-time visible image',
        body: [
          'A flat plate coated with a fluorescent phosphor — typically a green-emitting compound such as P43 (Gd\u2082O\u2082S:Tb). Electrons striking the phosphor cause it to glow, producing a live visible image of the specimen.',
          'The screen is the original viewing medium for TEMs and is still mounted on most instruments. For data acquisition it is lifted out of the path so the beam can reach the camera below.'
        ],
        hotspot: { x: 47.0, y: 76.6, w: 13.0, h: 2.3 },
        pin: { x: 41.0, y: 75.0 }
      },
      /* ---------- CONTROL PANEL INSET ---------- */
      {
        id: 'control-panel',
        name: 'Control Panel',
        role: 'Operator interface — the entire microscope in knobs and buttons',
        body: [
          'The console used to drive the microscope. It groups every adjustment a TEM operator routinely makes into one panel: <strong>High Voltage</strong> (accelerating kV), <strong>Beam Intensity</strong> (gun emission), <strong>Focus</strong> and <strong>Stigmator</strong> for the objective, <strong>Alignment</strong> trackpads (X / Y deflectors), a <strong>Magnification</strong> readout, and the <strong>Mode</strong> selector that swaps the column between TEM imaging and STEM scanning.',
          'In Module 02 of this simulator you\u2019ll use a working version of this panel to align a real specimen — first guided, then free-form. The Camera and STEM Detector toggles at the bottom-right insert and retract the corresponding detectors.'
        ],
        hotspot: { x: 58.0, y: 26.5, w: 22.0, h: 4.5 },
        pin:     { x: 69.0, y: 43.0 }
      }
    ]
  };
})();
