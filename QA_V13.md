# V13 checks

- Desktop 1720×1000 and mobile 390×844 browser screenshots checked. No mobile horizontal overflow (document width 382); fixed initially oversized language button and low-contrast inherited colors.
- Sidebar background and blur removed. Full-width adaptive layout distributes focus/orbit/stats. Warm gold smoky K replaces blue asset via CSS image presentation with polygon crop; generated source is RGB, not true alpha.
- Chinese/English navigation, homepage and common controls switch; reload retains English. Original lessons and user notes remain in their original language; this is not complete course translation.
- Reading navigation and retained existing note checked; no browser console errors.
- Build and 11 existing/content tests pass. Reduced motion is implemented in CSS and hooks; OS preference switch was not manually exercised. Scroll reveal uses IntersectionObserver; parallax is capped at 48px. Count uses React state and cancels its animation on unmount.
- Assets: public/juzizhou-sunlight.png supplied by user; public/k-core-champagne-v13.png generated using built-in imagegen. Prompt recorded in DESIGN_PROMPT_V13.md.
