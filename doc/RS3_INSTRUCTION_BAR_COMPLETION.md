# RS3 — Instruction-bar completion feedback

- Section 3 no longer displays a `STEP ACHIEVED` modal.
- Each successful Bright Field action writes its concise achievement statement directly into the existing instruction/status bar.
- The successful visual/output state remains visible for 2.5 seconds.
- After that consolidation pause, the simulator advances automatically to the next step.
- Other implemented sections use the same 2.5-second hold with a short generic completion message.
- Cleanup is deferred until after the hold so learners can inspect the completed state.
