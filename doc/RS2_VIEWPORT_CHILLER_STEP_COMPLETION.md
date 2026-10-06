# RS2 — Real viewport, chiller-room turn, and step-completion pacing

Baseline: TEM_Simulator_v4.9.1_RS1_RealSample_Section3

## Changes
- Replaced the Microscope New main Column viewport with the supplied real TEM-room image (`column-viewport-real.png`).
- Section 1 Step 1 now begins from that same real Column image and turns to the supplied chiller-room-door photograph (`section1-chiller-room-door-real.png`) before continuing to the chiller close-up.
- Added a 1.5 s achieved-output observation hold to the shared step-completion path. This applies to all implemented sections and is inherited by future sections that use the same completion function.
- Section 3 adds a mandatory short `STEP ACHIEVED` modal after the observation hold. Each Bright Field step has a concise result statement. The next step begins only after the learner presses **OK**.
- Section 3/4 panel controls are locked as soon as the required output is reached, preserving the achieved state during the observation hold.
- Deferred Section 3/4 cleanup callbacks until after the hold (and, for Section 3, after OK), so the learner can still see the achieved output.
- Preserved the Section 2 final inserted-holder state through the new observation hold.
