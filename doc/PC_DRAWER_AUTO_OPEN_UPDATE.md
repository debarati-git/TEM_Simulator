# PC Drawer Auto-Open Update

The Module 2 PC drawer now follows the guided step context:

- Steps with `pcDrawer: 'tem'` automatically open the JEOL TEM control interface.
- Steps with `pcDrawer: 'cam'` automatically open the camera software interface.
- Steps without a `pcDrawer` target begin with the drawer collapsed.
- The drawer handle remains visible, allowing the learner to open or close the PC drawer manually at any time.
- Manually closing the drawer during a PC-targeted step is still allowed; it opens automatically again only when another PC-targeted step is activated.
