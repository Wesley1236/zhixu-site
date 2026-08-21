# Prototype Instructions

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
