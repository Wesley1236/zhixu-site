# Design QA — 知序 4.0

- source layout truth: `design/home-v4-layout-reference.png`
- generated background truth: `design/final-home-v4-background.png`
- implementation screenshot: `qa/implementation-v4-desktop.png`
- reading interaction screenshot: `qa/implementation-v4-reading.png`
- mobile screenshot: `qa/implementation-v4-mobile.png`
- combined comparison: `qa/comparison-v4-desktop.png`
- desktop viewport and pixels: 1488 × 1058 CSS px and image px, device scale factor 1
- mobile viewport: 390 × 844 CSS px; implementation scroll width 390px
- state: restrained dark glass homepage with static moon-ocean background

## Evidence and fidelity surfaces

- Full-view comparison: the side-by-side image confirms the selected three-module hierarchy, floating top Dock, top signature/greeting and bottom reflection bar. The quieter background and single-layer glass edge are intentional responses to the user's request to remove visual clutter.
- Focused evidence: the reading overlay was captured separately and retains the three-step reading and note workflow. No extra crop is required because desktop labels remain readable at native size.
- Typography: system and Songti-compatible Chinese stacks provide a clear display/body hierarchy; tracking and leading remain legible over the photographic background.
- Spacing and layout: the center reading module is dominant, side modules align symmetrically, and all desktop content fits the selected viewport without overflow.
- Color and tokens: low-saturation blue-gray, restrained teal status color, one cool glass edge and high-contrast text replace the prior neon palette.
- Image quality: the background is a dedicated high-resolution generated raster with correct 16:10 crop and clean UI-negative space; it contains no baked interface elements.
- Copy and content: specific action, book, chapter, reading method, AI uses and reflection prompt match the personal-growth brief; IBC is not central.

## Interaction and accessibility checks

- Tested: reading module open/close, knowledge-and-AI module → AI page → dashboard.
- Browser console: no errors or warnings.
- Mobile: no horizontal overflow; modules become one continuous vertical task path.
- Immediate press states, spring transitions, focus-visible, reduced motion, reduced transparency and increased contrast fallbacks remain implemented.

## Comparison history

1. P1 — the first light sunrise direction was rejected by the user as too decorative. It was fully discarded before implementation.
2. P2 — the initial 720px-height pass clipped the cards behind the reflection bar. Added a compact-height layout with shorter panels and tighter reading rhythm. The 1488 × 1058 final capture has no clipping.
3. P2 — the prior four-orbit structure did not match the chosen three-panel reference. Rebuilt the homepage as action / reading / knowledge-and-AI with concrete content and direct navigation.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- P3: keep the background static by default; optional video should only return after a separately approved restrained motion study.

final result: passed
