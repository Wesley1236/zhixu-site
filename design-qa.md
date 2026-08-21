# Design QA — 知序 5.0

- background source: `design/home-v5-background.png`
- interface reference: `design/home-v5-interface-reference.png`
- desktop implementation: `qa/implementation-v5-desktop.png`
- light library implementation: `qa/implementation-v5-library.png`
- mobile implementation: `qa/implementation-v5-mobile.png`
- side-by-side comparison: `qa/comparison-v5-desktop.png`
- desktop viewport/image: 1488 × 1058 CSS px / 1488 × 1058 px
- mobile viewport: 390 × 844 CSS px; measured page width 382 px within 390 px viewport, no horizontal overflow
- state: dashboard loaded with all overlays closed

## Same-state comparison

The source reference and implementation were combined at native, matching dimensions. The final page preserves the same background crop, full-height left navigation, centered growth hub, left focus/quick-access stack, right statistics/activity stack, top search, and bottom knowledge query field. The implementation intentionally removes the reference's decorative holographic orbit and replaces it with restrained translucent modules so the supplied office photograph remains the visual anchor.

## Visual evidence

- Typography: dark navy system type remains readable over the bright sky; Songti is limited to the small brand mark.
- Materials: every primary frame uses the same light translucent glass recipe with a white edge, soft inner highlight, background blur, and neutral blue-gray shadow. There are no opaque dark panels.
- Spacing: desktop content fits the 1488 × 1058 viewport exactly with no scrollbars or clipped cards.
- Color: cool blue-gray ink and one restrained blue action color harmonize with the lake, sky, and glass architecture.
- Background: the exact user-provided lake-view office image is used as the full-page background; no baked UI or text was added to it.
- Copy: the focus task, knowledge statistics, concrete deep-reading task, uploads, AI entry, goals, and review all serve personal growth; IBC is not presented as a core goal.

## Interaction and accessibility checks

- Verified navigation: dashboard → knowledge library → dashboard; dashboard → AI workspace → dashboard.
- Verified overlays: reading task opens and closes; categorized upload sheet opens and closes.
- All dashboard cards and modules are buttons, forms, or contain direct actionable controls with hover, press, and spring feedback.
- Knowledge library remains functional with classification, search, sorting, grid/list controls, selection, favorites, details, archive, and local upload flow.
- Browser console: 0 warnings and 0 errors.
- Mobile: 31 visible interactive controls; no horizontal overflow; content becomes a single scrollable vertical workflow.
- Reduced-motion, reduced-transparency, and increased-contrast fallbacks remain available.

## Findings and fixes

1. P1 — earlier dark/neon treatment conflicted with the supplied bright background. Replaced the entire dashboard material system with light glass and dark navy typography.
2. P1 — earlier homepage hierarchy felt abrupt. Rebuilt it around one central growth hub with six surrounding destination modules and balanced support cards.
3. P2 — route transitions take approximately 3 seconds because the existing spring/blur exit completes before the next page enters. Verified that each tested destination resolves correctly and remains interruptible.
4. P2 — mobile content exceeds one viewport vertically by design; it is a continuous scroll with no horizontal overflow or hidden functionality.

No actionable P0, P1, or P2 findings remain.

final result: passed
