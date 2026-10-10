# RS13 — Section 1 Step 4 drawer + delayed confirmation

Baseline: RS12 Step4 StandardConfirmModal.

Changes:
- Restored the original PC drawer behavior in Section 1 Step 4.
- The TEMCON PC drawer opens automatically for the step and can be collapsed/reopened from the PC drawer handle without destroying the interactive PC state.
- Reopening the drawer restores the same full interactive TEMCON screen and reschedules the readiness confirmation.
- The top-right guided-session button remains the normal **Show Step** action; it is no longer renamed to **Confirm Step**.
- A standard centered/draggable SOP confirmation modal appears automatically after a short viewing delay while the PC drawer is open.
- Collapsing the drawer before the delay cancels the pending confirmation; reopening the drawer starts the delay again.
- The confirmation still checks HT READY, EVAC READY, and 80.00 kV.
- RS11 full-PC interactions and RS8 phosphor/camera behavior are retained.
