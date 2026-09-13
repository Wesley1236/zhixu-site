# Prototype Instructions

## V16 reading workspace
Fullscreen viewport reader, desktop PDF left and notebook right; mobile switches panes without losing reading state. Opening and page-render transitions are brief and reduced-motion aware. Scan annotations use normalized rectangles, not invented OCR text selection; underline/highlight/thought and local undo/export must retain prior notes. Keep password protections and distinguish local unencrypted notes from encrypted original books.

## V15 encrypted reading (latest user decision)
Only encrypted copies of the 13 supplied books may be published; plaintext originals remain private. User sets a long passphrase via the local-only setup page, never through chat or an agent-entered credential. Click a book to unlock using native Web Crypto; do not persist the passphrase or derived key. Titles/catalog remain public and offline password guessing is possible. Preserve local notes; explicitly disclose that notes are unencrypted and not synced. Use rounded fonts throughout; scanned PDF glyphs are unchanged. Do not claim the whole website is private or encryption is unbreakable.

## Clear glass and private-site direction
Align homepage hero/search and portal grid on one left edge. Use transparent, unblurred glass for module controls; retain readable document pages and accessibility contrast overrides. User approved migrating to an authenticated private website, but hosting identity/configuration is not yet provided. Never publish original books or claim the existing GitHub Pages frontend is private.

## Authorized device persistence
User explicitly approved remembering library authorization on each personal device. Opt-in checkbox (selected for this user's requested workflow), localStorage token scoped to a private repo, automatic verification on library entry, and sign out/forget are allowed. Explain same-origin-script/shared-device risks; do not describe this as encrypted storage. Never embed existing CLI credentials in the site. This supersedes prior memory-only requirements.

## V14 current decision (supersedes prior homepage geometry/palette)
Use the user-supplied juzizhou-study.png and the selected four-card homepage reference: slim open text rail, generous greeting/search, Library/Write/Learn/Progress entry cards. No K orbit. Preserve all existing learning routes under Explore. Use rounded Chinese typography and restrained translucent materials; readable longform surfaces may be more opaque. Books are private in Wesley1236/zhixu-library-private, never in public assets. Credentials must stay in memory. Reading notes use explicit optimistic-concurrency sync with recoverable local drafts. No claim of completed OCR, full-text indexing, AI book analysis, or automatic ChatGPT voice integration. Private collection contains 13 supplied originals; preserve filename/version distinctions.

## V13 current visual decision
Use supplied juzizhou-sunlight.png background with midnight navy, warm gold and ivory text. Sidebar must have no frosted panel or profile-card backing. Expand fluid desktop width and distribute orbit/focus/stats; preserve mobile reading size. Add persistent Chinese/English interface switching without rewriting original study materials or personal notes. Motion: restrained reveal, parallax, hover elevation, letter greeting and real counters; respect reduced motion. Preserve all prior functionality and private data. GitHub publishing remains authorized.

## Current V12 decision (supersedes V11 homepage geometry)

Restore the supplied airy lake-office orbit homepage: left navigation, daily focus, central unified K with six functional modules, right real statistics and recent notes, bottom question entry. Keep responsive grids (no whole-canvas scaling) and all V11 detailed learning pages. Add original Mao study guides for volumes 1–5 and private local text import; never claim complete text coverage or publish unlicensed full books. Distinguish 1977 volume V and original modern applications from historical source claims.

## Previous V11 decision (detail pages remain applicable)

The user now prioritizes a usable, content-first mature learning app over the strict orbit mockup. Use a centered responsive learning workbench, readable rounded typography, a light lake background and restrained translucent panels. Prioritize daily reading, English, vocabulary, notes and real progress. Keep the unified slowly rotating K as a secondary knowledge entry. Do not uniformly scale a fixed canvas. Preserve existing knowledge and expression records. Original learning content must be identified; external source links must not imply embedded voice or automatic coaching. Deploy through GitHub Pages.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Product Decisions For 知序 2.0

- The selected visual target is the fused dark aurora dashboard with Apple-inspired liquid glass, a whole-person growth constellation, a knowledge-flow ribbon, and a cited knowledge-to-action assistant.
- Whole-person growth is the homepage focus: professional capability, AI and automation, English expression, knowledge output, and health/life. IBC is only an ordinary work-knowledge example and must never be the central goal.
- The deliverable is GitHub-first and GitHub Pages-compatible. Do not rely on OpenAI Sites, ChatGPT hosting, server-only rendering, private runtime headers, or browser-exposed model keys.
- Uploads, organization state, theme preferences, and text knowledge content should persist locally in the browser. Text and Markdown content must participate in local retrieval and citations; unsupported binary parsing must be represented honestly.
- Motion should feel spatial and spring-based: gliding active glass lenses, refractive sheets, shared-element-like page transitions, magnetic buttons, hover spotlights, and flowing knowledge energy. Respect `prefers-reduced-motion`.
- Current visual source of truth: use the user-provided bright lake-office photograph as the full-site background and the user-provided light knowledge-hub screenshot as the layout/material reference.
- All visible homepage frames must be functional, light translucent glass with dark navy text. Avoid dark opaque cards, neon overload, and decorative effects that do not communicate state.
- The current homepage source of truth is the user-selected airy three-column reference: a slim left rail, open Daily Focus area, six glass modules orbiting a faceted K knowledge core, right-side quote/stats/activity, top search, and bottom AI prompt. The K core is the primary interactive affordance and rotates slowly; it must stop under `prefers-reduced-motion`.
- On wide and ultrawide desktop displays, keep the strict reference canvas centered and scale it uniformly to use the available height. Never anchor the dashboard to one side or leave a large one-sided empty region; prioritize readable type, balanced margins, and compact visual density.
- Use the self-hosted SIL OFL 1.1 rounded Chinese typeface in `public/fonts/` across the entire product. On ultrawide displays, expand the reference canvas horizontally and enlarge the glass frames instead of leaving scenic dead space around a small dashboard.
- V10: The K and its glass body must be a single raster asset, never separate letter/glow overlays. Use a gentle whole-object turn; hover must not restart or change the animation duration. Retain centered Knowledge Base / Upload transforms.
- Expression training has independent Chinese/English 28-day plans, adjustable levels, concrete daily topics, manual coaching notes, and local persistence/export. ChatGPT voice is an explicitly external, user-started session, not an embedded integration. Never expose API keys, imply automatic microphone access, fabricate feedback/scores, or claim transcript synchronization.
