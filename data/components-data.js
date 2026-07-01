/* =========================================================================
   TEM Simulator — Column components data  (Module 01 · v1.3)

   v1.3 restructure
   - Exterior view is the new DEFAULT face (real annotated lab diagram,
     1060 x 943 px). It fully replaces the old "photo" face.
   - Old photo + ray-diagram faces retired from Module 01.
   - Flip target is now "interior" (Column Interior) — placeholder for a new
     interior visualization to be supplied later. Flip button reads
     "Flip to see Column Interior".
   - Two exterior hotspots are DRILL-DOWN targets (control panel L1 / R1).
     Clicking one replaces the viewport with that panel's detail face
     (placeholder image + its own internal hotspot array, empty for now)
     and shows a "Back to Exterior" control.

   Face roles
   ----------
   exterior  : top-level default, 17 components, 2 of them drill-downs.
   interior  : flip partner of exterior (placeholder).
   panel-l1  : drill-down detail of Control Panel L1 (placeholder image).
   panel-r1  : drill-down detail of Control Panel R1 (placeholder image).

   Coordinate convention (unchanged from prior versions)
   -----------------------------------------------------
   hotspot {x,y,w,h} : % of source image — clickable box.
   pin     {x,y}     : % of source image — marker centre (the green dot).

   IMPORTANT: exterior hotspot percentages are tied to the EXACT source
   image dimensions (1060 x 943). Any image swap requires full recalibration.
   Dot centres were derived by eroded-blob detection on the green callout
   endpoints (see doc/image-assets.md).
   ========================================================================= */
(function () {
  'use strict';
  window.TEM = window.TEM || {};

  /* Helper: build a centred hotspot box (in %) around a dot centre. */
  function box(cx, cy, w, h) {
    return { x: +(cx - w / 2).toFixed(2), y: +(cy - h / 2).toFixed(2), w: w, h: h };
  }

  /* =====================================================================
     EXTERIOR FACE — annotated lab diagram, 17 components (default)
     Image: 1060 x 943 px
     Dot centres (percent) from green-endpoint detection.
     ===================================================================== */
  const exteriorFace = {
    image: {
      src: '../assets/images/column/tem-exterior.png',
      width: 929,
      height: 833
    },
    components: [
      {
        id: 'ext-condenser-aperture',
        name: 'Condenser Aperture Assembly',
        role: 'Selects the illumination aperture above the specimen',
        body: [
          'The side-mounted assembly on the upper column that carries the condenser apertures. A strip of precision-drilled holes (typically 30-200 \u00b5m) can be slid into the beam; the small X/Y knobs centre the chosen hole on the optical axis.',
          'Choosing a smaller condenser aperture improves the spatial coherence of the illumination (sharper interference fringes) at the cost of beam current; a larger one gives a brighter beam for rapid survey work.'
        ],
        pin: { x: 44.7, y: 24.0 },
        hotspot: { x: 13.0, y: 17.6, w: 16.5, h: 6.6 }
      },
      {
        id: 'ext-cm-lens-screws',
        name: 'CM Lens Shift Screws (4 pcs.)',
        role: 'Mechanical alignment of the condenser-mini (CM) lens',
        body: [
          'A set of four screws used to mechanically centre the condenser-mini lens polepiece relative to the optical axis. Mechanical alignment of the polepiece complements the electrical (coil-based) beam alignment performed from the console.',
          'These are service / coarse-alignment adjustments — set during installation and major maintenance, not touched during routine operation.'
        ],
        pin: { x: 41.8, y: 26.5 },
        hotspot: { x: 9.0, y: 24.3, w: 34.5, h: 3.2 }
      },
      {
        id: 'ext-refrigerant-tank',
        name: 'Refrigerant Tank (LN\u2082 Dewar)',
        role: 'Liquid-nitrogen reservoir for the anti-contamination cold trap',
        body: [
          'A liquid-nitrogen dewar mounted on the column. It feeds a cold finger / anti-contaminator near the specimen that condenses stray hydrocarbon molecules onto a cold surface, keeping them off the specimen and reducing carbon build-up under the beam.',
          'On instruments with a cooled detector or an energy filter, a refrigerant supply may also stabilise those subsystems. The tank is topped up regularly; letting it run dry degrades vacuum cleanliness around the sample.'
        ],
        pin: { x: 39.3, y: 31.3 },
        hotspot: { x: 11.0, y: 29.0, w: 18.8, h: 3.2 }
      },
      {
        id: 'ext-goniometer',
        name: 'Goniometer',
        role: 'Precision specimen stage — position and tilt control',
        drilldown: 'panel-goniometer',
        body: [
          'The mechanical stage into which the specimen holder is inserted. It controls X / Y / Z translation and \u03b1 (and on double-tilt holders \u03b2) tilt of the specimen with sub-micron and sub-degree precision, letting the operator bring a feature onto the axis and orient a crystal to a chosen zone axis.',
          'Goniometer stability is decisive for high-resolution work: thermal drift, backlash, or vibration here shows up directly as image blur. Side-entry goniometers (shown) are the most common geometry in modern TEMs.'
        ],
        pin: { x: 51.2, y: 30.2 },
        hotspot: { x: 66.4, y: 19.0, w: 13.6, h: 3.0 }
      },
      {
        id: 'ext-specimen-holder',
        name: 'Specimen Holder',
        role: 'Rod that carries the specimen into the column',
        body: [
          'The rod inserted horizontally through the airlock into the goniometer. Its tip clamps the 3 mm specimen grid inside the objective-lens polepiece gap. Holders come in many types: single-tilt, double-tilt, heating, cooling (LN\u2082 / He), biasing, and in-situ straining or gas-cell designs.',
          'The holder is introduced through a vacuum airlock that is pumped separately before a gate valve opens to the column, protecting the column vacuum. Cleanliness of the rod tip is critical — a contaminated holder is a common source of specimen drift and contamination.'
        ],
        pin: { x: 53.1, y: 31.5 },
        hotspot: { x: 69.0, y: 25.0, w: 14.5, h: 2.6 }
      },
      {
        id: 'ext-field-limiting-aperture',
        name: 'Field-Limiting Aperture Assembly',
        role: 'Selected-area (SAD) aperture in the image plane',
        body: [
          'The assembly carrying the selected-area / field-limiting aperture, located in an image plane below the objective lens. Inserting it restricts which region of the specimen contributes to the diffraction pattern, enabling selected-area electron diffraction (SAED) from a chosen grain or phase.',
          'Like the other apertures it has X/Y centring knobs and a strip of selectable hole sizes. It is retracted during normal imaging and inserted only when isolating a region for diffraction.'
        ],
        pin: { x: 52.2, y: 37.9 },
        hotspot: { x: 64.8, y: 30.0, w: 21.5, h: 4.4 }
      },
      {
        id: 'ext-intermediate-screws',
        name: 'Intermediate Lens Shift Screws (4 pcs.)',
        role: 'Mechanical centring of the intermediate lens',
        body: [
          'Four screws for mechanical alignment of the intermediate lens polepiece on the optical axis. The intermediate lenses set the magnification zoom and perform the image / diffraction mode switch, so their mechanical centring underpins clean mode changes.',
          'As with the other shift-screw sets, these are coarse mechanical adjustments made during alignment and service rather than routine operation.'
        ],
        pin: { x: 49.6, y: 41.2 },
        hotspot: { x: 71.0, y: 35.0, w: 18.5, h: 4.4 }
      },
      {
        id: 'ext-projector-screws',
        name: 'Projector Lens Shift Screws (4 pcs.)',
        role: 'Mechanical centring of the projector lens',
        body: [
          'Four screws for mechanically centring the projector lens polepiece. The projector lens is the final magnetic lens, projecting the image or diffraction pattern onto the screen and camera, so its alignment affects how centred and distortion-free the final image is.',
          'These too are coarse mechanical alignments fixed during setup and maintenance, not part of day-to-day operation.'
        ],
        pin: { x: 49.5, y: 44.7 },
        hotspot: { x: 71.0, y: 40.0, w: 20.0, h: 4.6 }
      },
      {
        id: 'ext-binocular-microscope',
        name: 'Binocular Microscope',
        role: 'Optical eyepieces for viewing the phosphor screen',
        body: [
          'The binocular optics that look down onto the fluorescent viewing screen, giving the operator a direct, magnified optical view of the live electron image. They are the traditional tool for fine focusing and astigmatism correction, resolving screen detail finer than the naked eye.',
          'Although high-sensitivity cameras now capture the image digitally, the binoculars remain valuable for real-time alignment because the eye-screen path has no readout lag.'
        ],
        pin: { x: 43.5, y: 47.1 },
        hotspot: { x: 12.0, y: 39.4, w: 18.2, h: 3.2 }
      },
      {
        id: 'ext-pc-monitor',
        name: 'PC Monitor',
        role: 'Live image, column status, and acquisition software display',
        body: [
          'The computer display showing the live camera image, column status (vacuum, lens currents, stage position), and the acquisition / analysis software menus. Most TEMs run two or more screens — one for the live image and one for column control.',
          'The monitor is the operator\u2019s main feedback surface during digital acquisition, where exposure, binning, drift correction, and image saving are managed.'
        ],
        pin: { x: 71.2, y: 47.7 },
        hotspot: { x: 75.0, y: 46.0, w: 12.0, h: 2.8 }
      },
      {
        id: 'ext-control-panel-l1',
        name: 'Control Panel L1',
        role: 'Left operator console — beam / illumination controls',
        drilldown: 'panel-l1',
        body: [
          'The left-hand operator console on the desk. It typically carries the left trackball (beam shift / tilt), the brightness (C2) control, gun and condenser alignment functions, and the aperture and mode buttons used to set up the illumination.',
          'Click to open a detailed view of this console and explore its individual knobs and switches.'
        ],
        pin: { x: 29.8, y: 54.7 },
        hotspot: { x: 4.2, y: 50.4, w: 27.6, h: 3.2 }
      },
      {
        id: 'ext-trackball',
        name: 'Trackball',
        role: 'Beam / image / stage positioning control',
        body: [
          'A trackball on the console used for smooth, fine positioning. Depending on the active mode it drives beam shift / tilt, image shift, or stage (specimen) movement, letting the operator slew across the specimen or recentre a feature without reaching for individual knobs.',
          'Most columns provide two trackballs (one per console) so beam and image / stage controls are available simultaneously during alignment.'
        ],
        pin: { x: 37.0, y: 55.0 },
        hotspot: { x: 17.0, y: 43.9, w: 10.2, h: 3.2 }
      },
      {
        id: 'ext-fluorescent-screen-lever',
        name: 'Fluorescent Screen Lever',
        role: 'Raises / lowers the phosphor viewing screen',
        body: [
          'The lever that lifts the fluorescent (phosphor) viewing screen out of the beam path. With the screen down, the operator views the live image through the binoculars; lifting it lets the beam reach the camera or a direct-electron detector below for acquisition.',
          'Screen up / down is one of the most frequent actions in a session — survey and focus on the screen, then lift it to record.'
        ],
        pin: { x: 51.6, y: 55.5 },
        hotspot: { x: 74.5, y: 50.0, w: 13.5, h: 4.6 }
      },
      {
        id: 'ext-control-panel-r1',
        name: 'Control Panel R1',
        role: 'Right operator console — imaging / focus controls',
        drilldown: 'panel-r1',
        body: [
          'The right-hand operator console on the desk. It typically carries the right trackball (image shift / stage), the magnification and focus controls, the diffraction (DIFF) and imaging mode buttons, and image-shift / alignment functions.',
          'Click to open a detailed view of this console and explore its individual knobs and switches.'
        ],
        pin: { x: 59.0, y: 57.5 },
        hotspot: { x: 76.0, y: 55.8, w: 20.0, h: 3.0 }
      },
      {
        id: 'ext-camera-chamber-door',
        name: 'Camera Chamber Door',
        role: 'Access to the recording chamber below the screen',
        body: [
          'The door of the camera (recording) chamber beneath the viewing screen. Historically this chamber held photographic film plates; today it houses the CCD / CMOS camera or a retractable detector. The door provides access for camera service and, on film-era instruments, plate loading.',
          'The chamber is part of the column vacuum, so the door is interlocked with the vacuum system and only opened under the correct conditions.'
        ],
        pin: { x: 40.0, y: 63.0 },
        hotspot: { x: 11.0, y: 91.0, w: 24.6, h: 3.4 }
      },
      {
        id: 'ext-cover-l2',
        name: 'Cover L2 (Control Panel L2)',
        role: 'Left cabinet — houses secondary control electronics',
        body: [
          'The left cabinet cover of the desk console. Behind it sit secondary control electronics and the L2 control panel for the instrument — power supplies, interface boards, and auxiliary controls that are not needed on the operator surface.',
          'These covers are access panels for service engineers; they remain closed during normal operation.'
        ],
        pin: { x: 19.9, y: 67.3 },
        hotspot: { x: 2.6, y: 65.2, w: 19.0, h: 6.4 }
      },
      {
        id: 'ext-cover-r2',
        name: 'Cover R2 (Control Panel R2)',
        role: 'Right cabinet — houses secondary control electronics',
        body: [
          'The right cabinet cover of the desk console, behind which sit the R2 control panel and additional control electronics for the instrument. Like the left cabinet it holds power and interface hardware kept off the operator surface.',
          'Opened only for maintenance and service access; closed during routine use.'
        ],
        pin: { x: 79.7, y: 76.5 },
        hotspot: { x: 78.0, y: 74.9, w: 20.6, h: 5.4 }
      },
      {
        id: 'ext-foot-switches',
        name: 'Foot Switches',
        role: 'Hands-free controls for frequent actions',
        body: [
          'The pair of floor pedals that give the operator hands-free control of frequently used functions — commonly screen lift, beam blanking, exposure / capture, or stage actions — so both hands stay on the trackballs and knobs during alignment and acquisition.',
          'Pedal assignment is configurable on most instruments to match the operator\u2019s preferred workflow.'
        ],
        pin: { x: 41.5, y: 86.9 },
        /* The component has two endpoint dots (left + right pedal). The second
           marker is rendered from `extraPins`; the hotspot box spans both. */
        extraPins: [{ x: 51.0, y: 87.9 }],
        hotspot: { x: 54.5, y: 92.3, w: 13.2, h: 2.9 }
      }
    ]
  };

  /* =====================================================================
     INTERIOR FACE — real cutaway visualization (flip partner of exterior)
     Image: 1135 x 1136 px. 28 labelled components; hotspots sit on the green
     TEXT labels (pins omitted for now — the diagram already draws a leader +
     dot to each part). Descriptions are PROVISIONAL (standard-TEM knowledge);
     exact text to be supplied later.
     ===================================================================== */
  const interiorFace = {
    image: {
      src: '../assets/images/column/tem-interior.png',
      width: 1135,
      height: 1136
    },
    note: 'Descriptions are provisional (standard-TEM knowledge); exact text to be supplied. Components are grouped by subsystem (illumination / specimen / imaging / viewing).',
    components: [
      {
        id: 'int-electron-gun',
        name: 'Electron Gun',
        role: 'Source of the electron beam',
        subsystem: 'illumination',
        body: [
          'The assembly at the very top of the column where electrons are generated and accelerated. It houses the cathode (filament), the Wehnelt cylinder, and the anode of the accelerating tube.'
        ],
        hotspot: { x: 20.4, y: 12.0, w: 14.6, h: 2.4 }
      },
      {
        id: 'int-wehnelt',
        name: 'Wehnelt',
        role: 'Bias electrode that focuses emission into a fine crossover',
        subsystem: 'illumination',
        body: [
          'A negatively-biased cap surrounding the filament tip. Its field shapes the emitted electrons into a small, bright crossover that acts as the effective source for the rest of the column.'
        ],
        hotspot: { x: 23.5, y: 16.9, w: 11.5, h: 2.2 }
      },
      {
        id: 'int-accelerating-tube',
        name: 'Accelerating Tube',
        role: 'Accelerates electrons to the operating voltage',
        subsystem: 'illumination',
        body: [
          'A stack of electrodes that accelerates the electrons through the chosen high voltage (e.g. 80-300 kV), setting their final wavelength before they enter the lens system.'
        ],
        hotspot: { x: 16.8, y: 21.8, w: 18.2, h: 2.4 }
      },
      {
        id: 'int-hv-cable',
        name: 'High Voltage Cable',
        role: 'Delivers the accelerating high voltage to the gun',
        subsystem: 'illumination',
        body: [
          'The heavily insulated cable feeding the accelerating voltage from the tank/generator to the electron gun.'
        ],
        hotspot: { x: 67.0, y: 8.2, w: 15.5, h: 2.6 }
      },
      {
        id: 'int-condenser-lens-coil',
        name: 'Condenser Lens Coil',
        role: 'Electromagnetic coil of the condenser lens',
        subsystem: 'illumination',
        body: [
          'The winding that produces the magnetic field of the condenser lens, controlling the diameter and intensity of the beam reaching the specimen.'
        ],
        hotspot: { x: 15.1, y: 32.0, w: 20.0, h: 2.2 }
      },
      {
        id: 'int-condenser-aperture',
        name: 'Condenser Aperture',
        role: 'Limits beam divergence and current',
        subsystem: 'illumination',
        body: [
          'A metal aperture inserted into the beam to set the convergence angle and coherence of the illumination.'
        ],
        hotspot: { x: 14.9, y: 36.2, w: 20.2, h: 2.4 }
      },
      {
        id: 'int-condenser-mini-lens',
        name: 'Condenser Mini Lens Coil',
        role: 'Auxiliary condenser lens',
        subsystem: 'illumination',
        body: [
          'A weaker lens working with the main condenser lenses to decouple convergence angle from spot size, enabling TEM / STEM illumination modes.'
        ],
        hotspot: { x: 11.5, y: 39.6, w: 23.6, h: 2.2 }
      },
      {
        id: 'int-cl-stigmator',
        name: 'Condenser Lens Stigmator Coil',
        role: 'Corrects astigmatism of the illumination',
        subsystem: 'illumination',
        body: [
          'A multipole coil that removes ellipticity from the condenser lens field, keeping the illuminating spot round.'
        ],
        hotspot: { x: 58.7, y: 32.5, w: 28.7, h: 2.4 }
      },
      {
        id: 'int-cl-1st-deflector',
        name: 'Condenser Lens 1st Beam Deflector',
        role: 'Upper beam-shift / tilt coil',
        subsystem: 'illumination',
        body: [
          'The first of a paired deflector set used to shift or tilt the beam above the specimen (beam shift, dark-field tilt).'
        ],
        hotspot: { x: 58.7, y: 36.2, w: 32.6, h: 2.2 }
      },
      {
        id: 'int-cl-2nd-deflector',
        name: 'Condenser Lens 2nd Beam Deflector',
        role: 'Lower beam-shift / tilt coil',
        subsystem: 'illumination',
        body: [
          'The lower deflector of the condenser pair; together with the 1st deflector it produces pure beam shift or pure beam tilt at the specimen.'
        ],
        hotspot: { x: 58.7, y: 41.7, w: 33.0, h: 2.2 }
      },
      {
        id: 'int-spot-alignment',
        name: 'Spot Alignment',
        role: 'Centres the beam crossover on the axis',
        subsystem: 'illumination',
        body: [
          'Deflection used to align the illuminating spot onto the optical axis so the beam stays centred as brightness is changed.'
        ],
        hotspot: { x: 58.7, y: 29.2, w: 18.0, h: 2.4 }
      },
      {
        id: 'int-gonio-meter',
        name: 'Goniometer',
        role: 'Precision specimen stage',
        subsystem: 'specimen',
        body: [
          'The mechanical stage that holds and orients the specimen, providing X/Y/Z translation and tilt with high precision.'
        ],
        hotspot: { x: 20.5, y: 43.4, w: 14.5, h: 2.2 }
      },
      {
        id: 'int-specimen-holder',
        name: 'Specimen Holder',
        role: 'Carries the specimen into the objective gap',
        subsystem: 'specimen',
        body: [
          'The rod that clamps the 3 mm grid and positions the specimen inside the objective-lens polepiece gap.'
        ],
        hotspot: { x: 17.3, y: 47.3, w: 17.8, h: 2.4 }
      },
      {
        id: 'int-objective-lens-coil',
        name: 'Objective Lens Coil',
        role: 'Coil of the primary imaging lens',
        subsystem: 'imaging',
        body: [
          'The winding of the objective lens, which forms the first magnified image and largely sets the instrument\'s resolution.'
        ],
        hotspot: { x: 16.2, y: 51.3, w: 18.9, h: 2.4 }
      },
      {
        id: 'int-obj-mini-lens',
        name: 'Objective Mini Lens Coil',
        role: 'Fine-focus auxiliary objective lens',
        subsystem: 'imaging',
        body: [
          'A weaker lens below the objective used for fine focusing and for low-magnification imaging.'
        ],
        hotspot: { x: 58.7, y: 51.0, w: 23.5, h: 2.4 }
      },
      {
        id: 'int-obj-stigmator',
        name: 'Objective Lens Stigmator Coil',
        role: 'Corrects objective-lens astigmatism',
        subsystem: 'imaging',
        body: [
          'A multipole coil that compensates astigmatism in the objective lens - essential for sharp high-resolution imaging.'
        ],
        hotspot: { x: 58.7, y: 45.8, w: 27.5, h: 2.4 }
      },
      {
        id: 'int-field-limiting-aperture',
        name: 'Field Limiting Aperture',
        role: 'Selected-area (SAD) aperture',
        subsystem: 'imaging',
        body: [
          'An aperture in the image plane that restricts the specimen area contributing to a diffraction pattern, enabling selected-area diffraction.'
        ],
        hotspot: { x: 13.6, y: 57.1, w: 21.5, h: 2.4 }
      },
      {
        id: 'int-1st-image-shifter',
        name: '1st Image Shifter',
        role: 'Upper image-shift deflector',
        subsystem: 'imaging',
        body: [
          'A deflector that shifts the image (or diffraction pattern) on the screen, used with the 2nd shifter for pure image translation.'
        ],
        hotspot: { x: 58.7, y: 55.3, w: 19.4, h: 2.4 }
      },
      {
        id: 'int-2nd-image-shifter',
        name: '2nd Image Shifter',
        role: 'Lower image-shift deflector',
        subsystem: 'imaging',
        body: [
          'The lower image-shift deflector; paired with the 1st shifter to move the image without tilting it.'
        ],
        hotspot: { x: 58.7, y: 59.2, w: 19.7, h: 2.4 }
      },
      {
        id: 'int-intermediate-lens-coil',
        name: 'Intermediate Lens Coil',
        role: 'Variable-magnification lens stage',
        subsystem: 'imaging',
        body: [
          'The intermediate lenses set the magnification range and switch the column between imaging and diffraction modes.'
        ],
        hotspot: { x: 58.7, y: 64.4, w: 22.6, h: 2.2 }
      },
      {
        id: 'int-projector-lens-coil',
        name: 'Projector Lens Coil',
        role: 'Coil of the final projection lens',
        subsystem: 'imaging',
        body: [
          'The winding of the projector lens, which provides the final magnification onto the screen and camera.'
        ],
        hotspot: { x: 16.5, y: 63.9, w: 18.6, h: 2.4 }
      },
      {
        id: 'int-projector-beam-deflector',
        name: 'Projector Lens Beam Deflector',
        role: 'Centres the image on the projector axis',
        subsystem: 'imaging',
        body: [
          'Deflection that keeps the magnified image/diffraction pattern centred through the projector lens.'
        ],
        hotspot: { x: 8.0, y: 60.8, w: 27.0, h: 2.4 }
      },
      {
        id: 'int-binocular-microscope',
        name: 'Binocular Microscope',
        role: 'Optical viewing of the screen',
        subsystem: 'viewing',
        body: [
          'Binocular optics that give the operator a magnified direct view of the fluorescent screen for focusing and astigmatism correction.'
        ],
        hotspot: { x: 13.8, y: 67.8, w: 21.2, h: 2.4 }
      },
      {
        id: 'int-viewing-chamber',
        name: 'Viewing Chamber',
        role: 'Houses the fluorescent screen',
        subsystem: 'viewing',
        body: [
          'The chamber containing the phosphor viewing screen where the electron image is made visible.'
        ],
        hotspot: { x: 17.1, y: 76.9, w: 18.0, h: 2.4 }
      },
      {
        id: 'int-viewing-window',
        name: 'Viewing Window',
        role: 'Leaded-glass observation port',
        subsystem: 'viewing',
        body: [
          'The shielded glass window through which the operator views the screen, protecting against X-rays.'
        ],
        hotspot: { x: 18.1, y: 80.6, w: 16.9, h: 2.4 }
      },
      {
        id: 'int-small-screen',
        name: 'Small Screen',
        role: 'Focusing / high-detail viewing screen',
        subsystem: 'viewing',
        body: [
          'A small phosphor screen used at higher optical magnification for fine focusing of the live image.'
        ],
        hotspot: { x: 58.7, y: 75.0, w: 16.4, h: 2.2 }
      },
      {
        id: 'int-large-screen',
        name: 'Large Screen',
        role: 'Main fluorescent viewing screen',
        subsystem: 'viewing',
        body: [
          'The large phosphor screen that displays the full electron image for general viewing and survey.'
        ],
        hotspot: { x: 58.7, y: 78.9, w: 16.3, h: 2.4 }
      },
      {
        id: 'int-camera-chamber',
        name: 'Camera Chamber',
        role: 'Records the image below the screen',
        subsystem: 'viewing',
        body: [
          'The chamber beneath the viewing screen housing the camera (or, historically, film) that records the image when the screen is lifted.'
        ],
        hotspot: { x: 13.0, y: 90.5, w: 22.0, h: 2.5 }
      }
    ]
  };

  /* =====================================================================
     DRILL-DOWN: CONTROL PANEL L1 (real JEOL console image)
     Image: 1105 x 829 px. 11 numbered callouts (1-11). Hotspots sit on the
     numbered LABEL circles around the periphery (centres from green-circle
     detection); pins mark the same circles. Descriptions adapted from the
     JEOL EM210 "Description of Controls" manual.
     ===================================================================== */
  const panelL1Face = {
    image: {
      src: '../assets/images/column/panel-l1.png',
      width: 1105,
      height: 829
    },
    isDrilldown: true,
    title: 'Control Panel L1',
    parentComponentId: 'ext-control-panel-l1',
    components: [
      {
        id: 'l1-beam',
        name: '\u2460 BEAM switch',
        role: 'Starts / stops electron-beam emission',
        body: [
          'Pressing this switch when the built-in lamp is unlit starts the emission of electrons; pressing it again while the lamp is lit stops emission.',
          'Its function is the same as Filament ON / OFF in the High Voltage Control window.'
        ],
        pin: { x: 16.3, y: 3.7 },
        hotspot: box(16.3, 3.7, 6, 6)
      },
      {
        id: 'l1-aperture-control',
        name: '\u2461 APERTURE CONTROL',
        role: 'Selects and positions the motor-driven apertures',
        body: [
          'Pressing one of the motor-driven aperture switches lights its lamp and hands control to the selector and X/Y arrow switches. Aperture switches: <strong>CL</strong> (condenser aperture), <strong>EDS</strong> (hard X-ray aperture), <strong>OL</strong> (objective aperture), <strong>HC</strong> (high-contrast objective aperture), <strong>SA</strong> (field-limiting aperture). Only motor-driven apertures can be selected.',
          'The selector switches <strong>OPEN, 1, 2, 3, 4</strong> choose the hole (size) of the selected assembly. The <strong>X</strong> and <strong>Y</strong> arrow switches move the aperture in those directions, and the <strong>CRS</strong> (coarse) switch multiplies the move-per-press by 16.'
        ],
        pin: { x: 37.6, y: 3.1 },
        hotspot: box(37.6, 3.1, 6, 6)
      },
      {
        id: 'l1-probe-control',
        name: '\u2462 PROBE CONTROL',
        role: 'Sets illumination mode and probe geometry',
        body: [
          'Illumination-mode selectors: <strong>TEM</strong> (wide-area illumination), <strong>EDS</strong> (high-current-density micro-area), <strong>NBD</strong> (small-convergence-angle micro-area) and <strong>CBD</strong> (variable wide-range convergence-angle micro-area). Selecting a mode lights its built-in lamp.',
          'The <strong>\u03b1 SELECTOR</strong> knob varies the convergence angle while keeping the spot size constant (clockwise lowers the CM-lens current and widens the angle; fully clockwise drops the CM current to zero). The <strong>SPOT SIZE</strong> knob changes the minimum converged-beam size — a higher SPOT SIZE number gives a smaller spot.'
        ],
        pin: { x: 5.5, y: 27.5 },
        hotspot: box(5.5, 27.5, 7, 6)
      },
      {
        id: 'l1-room-lamp',
        name: '\u2463 ROOM LAMP switch',
        role: 'Turns the room lamp on / off',
        body: [
          'Switches the room lamp on and off, on instruments where a room lamp is provided.'
        ],
        pin: { x: 5.5, y: 9.8 },
        hotspot: box(5.5, 9.8, 7, 6)
      },
      {
        id: 'l1-defstig-switches',
        name: '\u2464 DEF / STIG switches',
        role: 'Choose which deflector / stigmator coil the knobs drive',
        body: [
          'Pressing one of these lights its lamp and assigns the SHIFT knobs (L1-\u2467, R1-\u2462) or the DEF/STIG knobs (L1-\u2465, R1-\u2463) to the selected coil; pressing again holds the coil at its current value (lamp dims). Switches: <strong>IMAGE SHIFT</strong> (shifts the image at high magnification), <strong>PLA</strong> (projector-lens deflector during spot / image shift), <strong>COND STIG</strong> (condenser-lens stigmator), <strong>OBJ STIG</strong> (objective-lens stigmator, from stored memory).',
          '<strong>DARK TILT</strong> and <strong>BRIGHT TILT</strong> set the condenser beam-deflector coil from stored memory so the SHIFT and DEF/STIG knobs can tilt the beam for dark-field or bright-field imaging. <strong>NTRL</strong> brightens the lamp and clears the stored memory for the selected switch.'
        ],
        pin: { x: 93.3, y: 31.7 },
        hotspot: box(93.3, 31.7, 6, 6)
      },
      {
        id: 'l1-brightness',
        name: '\u2465 BRIGHTNESS knob',
        role: 'Converges and spreads the electron beam',
        body: [
          'The main brightness (condenser C2) control: turning it converges or spreads the electron beam on the specimen / screen.'
        ],
        pin: { x: 57.3, y: 95.7 },
        hotspot: box(57.3, 95.7, 6, 6)
      },
      {
        id: 'l1-brightness-crs',
        name: '\u2466 BRIGHTNESS CRS switch',
        role: 'Coarse mode for the BRIGHTNESS knob (C/B)',
        body: [
          'When on, the change in current per notch of the BRIGHTNESS knob (L1-\u2465) is increased by a factor of 16 for rapid adjustment.'
        ],
        pin: { x: 41.6, y: 95.3 },
        hotspot: box(41.6, 95.3, 6, 6)
      },
      {
        id: 'l1-shift-x',
        name: '\u2467 SHIFT X knob',
        role: 'Shifts the beam in X (condenser deflector)',
        body: [
          'Shifts the electron beam in the X direction by varying the condenser-lens beam-deflector coil current. When DEF Select \u2013 Gun is chosen in the maintenance Alignment Panel, it instead adjusts the electron-gun 1st beam-deflector coil.'
        ],
        pin: { x: 93.4, y: 54.3 },
        hotspot: box(93.4, 54.3, 6, 6)
      },
      {
        id: 'l1-shift-crs',
        name: '\u2468 SHIFT CRS switch',
        role: 'Coarse mode for the SHIFT knobs (C/S)',
        body: [
          'When on, the change in current per notch of the SHIFT knobs (L1-\u2467, R1-\u2462) is increased by a factor of 16.'
        ],
        pin: { x: 93.4, y: 62.4 },
        hotspot: box(93.4, 62.4, 6, 6)
      },
      {
        id: 'l1-defstig-x',
        name: '\u2469 DEF / STIG X knob',
        role: 'Varies X current in the selected coil',
        body: [
          'Varies the X-direction current in whichever coil is selected by the DEF/STIG switch (L1-\u2464) or from the maintenance Alignment Panel.'
        ],
        pin: { x: 93.5, y: 79.5 },
        hotspot: box(93.5, 79.5, 6, 6)
      },
      {
        id: 'l1-defstig-crs',
        name: '\u246A DEF-STIG CRS switch',
        role: 'Coarse mode for the DEF / STIG knobs (C)',
        body: [
          'When on, the change in current per notch of the DEF/STIG knobs (L1-\u2465, R1-\u2463) is increased by a factor of 16.'
        ],
        pin: { x: 93.2, y: 88.7 },
        hotspot: box(93.2, 88.7, 6, 6)
      }
    ]
  };

  /* =====================================================================
     DRILL-DOWN: CONTROL PANEL R1 (PLACEHOLDER image, empty hotspots)
     ===================================================================== */
  const panelR1Face = {
    image: {
      src: '../assets/images/column/panel-r1.png',
      width: 1278,
      height: 833
    },
    isDrilldown: true,
    title: 'Control Panel R1',
    parentComponentId: 'ext-control-panel-r1',
    components: [
      {
        id: 'r1-wobbler',
        name: '\u2460 Wobbler switches',
        role: 'Focusing / voltage-axis alignment aids',
        body: [
          '<strong>IMAGE WOBB X</strong> and <strong>IMAGE WOBB Y</strong> periodically vary the 1st and 2nd beam-deflector coil currents while on; an out-of-focus image then wobbles in X or Y, making the focus point easy to find. They match the ImageX / ImageY buttons in the maintenance Alignment Panel.',
          '<strong>HT WOBB</strong> periodically varies the high voltage while on, to help align the voltage axis (same as the HT button in the maintenance Alignment Panel).'
        ],
        pin: { x: 4.2, y: 10.0 },
        hotspot: box(4.2, 10.0, 6, 6)
      },
      {
        id: 'r1-function',
        name: '\u2461 Function switches',
        role: 'Choose the image-forming mode',
        body: [
          'Select the imaging mode; the magnification or camera length of the chosen mode is set with the MAG/CAM L knob (R1-\u2464) and shown on the monitor. Each mode stores its own value (except MAG 2), so re-selecting a mode restores its stored magnification / camera length.',
          '<strong>MAG 1</strong> — normal magnification. <strong>MAG 2</strong> — a specific magnification (not stored). <strong>LOW MAG</strong> — low-magnification mode. <strong>SA MAG</strong> — selected-area magnification. <strong>SA DIFF</strong> — selected-area diffraction.'
        ],
        pin: { x: 4.4, y: 27.1 },
        hotspot: box(4.4, 27.1, 6, 6)
      },
      {
        id: 'r1-shift-y',
        name: '\u2462 SHIFT Y knob',
        role: 'Shifts the beam in Y (condenser deflector)',
        body: [
          'Shifts the electron beam in the Y direction by varying the condenser-lens beam-deflector coil current. When DEF Select \u2013 Gun is chosen in the maintenance Alignment Panel, it instead varies the electron-gun 1st beam-deflector coil.'
        ],
        pin: { x: 4.4, y: 55.5 },
        hotspot: box(4.4, 55.5, 6, 6)
      },
      {
        id: 'r1-defstig-y',
        name: '\u2463 DEF-STIG Y knob',
        role: 'Varies Y current in the selected coil',
        body: [
          'Varies the Y-direction current in whichever coil is selected by the DEF/STIG switch (L1-\u2464) or by the DEF Select buttons in the maintenance Alignment Panel.'
        ],
        pin: { x: 4.3, y: 84.8 },
        hotspot: box(4.3, 84.8, 6, 6)
      },
      {
        id: 'r1-mag-caml',
        name: '\u2464 MAG / CAM L knob',
        role: 'Sets magnification or camera length',
        body: [
          'Varies the value for the active Function-switch mode: normal magnification (MAG 1 / MAG 2), low magnification (LOW MAG), selected-area magnification (SA MAG), or camera length (SA DIFF).',
          'Turning clockwise increases the magnification or camera length; counter-clockwise decreases it.'
        ],
        pin: { x: 4.3, y: 43.2 },
        hotspot: box(4.3, 43.2, 6, 6)
      },
      {
        id: 'r1-obj-focus',
        name: '\u2465 OBJ FOCUS knob',
        role: 'Focuses the image (objective-lens current)',
        body: [
          'Focuses the image by varying the objective-lens current (the objective minilens current in LOW MAG mode).',
          'The <strong>FINE</strong> knob gives the smallest current change per notch; the <strong>COARSE</strong> knob changes by the equivalent of 16 FINE notches; and the <strong>CRS</strong> switch multiplies the per-notch change of both FINE and COARSE by a further 16.'
        ],
        pin: { x: 4.4, y: 63.1 },
        hotspot: box(4.4, 63.1, 6, 6)
      },
      {
        id: 'r1-diff-focus',
        name: '\u2466 DIFF FOCUS knob',
        role: 'Focuses the SA aperture or diffraction pattern',
        body: [
          'Focuses the field-limiting aperture while SA MAG (R1-\u2461) is on, and focuses the diffraction pattern while SA DIFF (R1-\u2461) is on.',
          'Its <strong>CRS</strong> switch multiplies the per-notch current change of the FOCUS knob by 16.'
        ],
        pin: { x: 96.5, y: 27.6 },
        hotspot: box(96.5, 27.6, 6, 6)
      },
      {
        id: 'r1-exp-photo',
        name: '\u2467 EXP TIME / PHOTO',
        role: 'Exposure time and film photography',
        body: [
          'The <strong>EXP TIME</strong> knob sets the exposure time (clockwise = longer). The <strong>AUTO</strong> switch toggles automatic exposure mode (lamp lit) versus manual (lamp out).',
          '<strong>PHOTO</strong>: pressing it when its lamp is unlit advances film to the exposure position (lamp lights when ready), exposes, and advances; pressing while the lamp is lit exposes the film already in position. Advance / photograph timing is set in the Film Camera Property window. The adjacent <strong>lamp</strong> indicates, when lit, that the shutter is open.'
        ],
        pin: { x: 96.3, y: 47.2 },
        hotspot: box(96.3, 47.2, 6, 6)
      },
      {
        id: 'r1-std-focus',
        name: '\u2468 STD FOCUS switch',
        role: 'Resets objective lens to its reference current',
        body: [
          'Pressing this switch sets the objective-lens current back to its original (standard) reference value \u2014 a quick way to return to a known focus datum.'
        ],
        pin: { x: 96.5, y: 35.9 },
        hotspot: box(96.5, 35.9, 6, 6)
      },
      {
        id: 'r1-f-switches',
        name: '\u2469 F switches',
        role: 'User-allocatable function keys (F1\u2013F6)',
        body: [
          'Six programmable switches (F1\u2013F6) to which the operator can allocate frequently used functions for one-press access.'
        ],
        pin: { x: 96.6, y: 10.0 },
        hotspot: box(96.6, 10.0, 6, 6)
      },
      {
        id: 'r1-z-switches',
        name: '\u246A Z switches',
        role: 'Shift the specimen vertically (Z height)',
        body: [
          'Move the specimen up or down along the optical axis (Z direction) \u2014 used to bring the specimen to the eucentric / standard height.'
        ],
        pin: { x: 4.6, y: 18.4 },
        hotspot: box(4.6, 18.4, 6, 6)
      }
    ]
  };

  /* =====================================================================
     EXPORT
     ===================================================================== */
  /* =====================================================================
     DRILL-DOWN: GONIOMETER (real photo, 4 numbered callouts)
     Image: 1051 x 838 px. Hotspots on the numbered circles; descriptions from
     the JEOL goniometer control description.
     ===================================================================== */
  const panelGoniometerFace = {
    image: {
      src: '../assets/images/column/panel-goniometer.png',
      width: 1028,
      height: 866
    },
    isDrilldown: true,
    title: 'Goniometer',
    parentComponentId: 'ext-goniometer',
    components: [
      {
        id: 'gonio-green-lamp',
        name: '① Green lamp',
        role: 'Ready-to-load indicator',
        body: [
          'Indicates, when lit, that the goniometer is ready for loading of a specimen holder.'
        ],
        pin: { x: 10.7, y: 56.8 },
        hotspot: box(10.7, 56.8, 6, 5)
      },
      {
        id: 'gonio-yellow-lamp',
        name: '② Yellow lamp',
        role: 'Evacuation indicator',
        body: [
          'Indicates, when lit, that the roughing vacuum pump is evacuating the goniometer.'
        ],
        pin: { x: 10.7, y: 65.7 },
        hotspot: box(10.7, 65.7, 6, 5)
      },
      {
        id: 'gonio-pump-air',
        name: '③ PUMP / AIR switch',
        role: 'Evacuate or vent the goniometer airlock',
        body: [
          'Setting this switch to PUMP evacuates the goniometer (the yellow lamp lights up during evacuation) and setting this switch to AIR opens the goniometer to the atmosphere. Set the switch to the desired position while pulling it out.'
        ],
        pin: { x: 10.7, y: 83.9 },
        hotspot: box(10.7, 83.9, 6, 5)
      },
      {
        id: 'gonio-connector',
        name: '④ Connector',
        role: 'Port for optional specimen holders',
        body: [
          'Used for optional specimen holders such as a double-tilt specimen holder.'
        ],
        pin: { x: 68.5, y: 97.1 },
        hotspot: box(68.5, 97.1, 8, 5)
      }
    ]
  };

  window.TEM.dataColumnComponents = {
    faces: {
      exterior: exteriorFace,
      interior: interiorFace,
      'panel-l1': panelL1Face,
      'panel-r1': panelR1Face,
      'panel-goniometer': panelGoniometerFace
    },
    defaultFace: 'exterior',
    flipPair: ['exterior', 'interior'],
    drilldownFaces: ['panel-l1', 'panel-r1', 'panel-goniometer']
  };
})();
