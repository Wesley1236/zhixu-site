# V10 verification · 2026-08-27

- `npm run test:expression`: 7/7 passing (56 lessons, calendar boundaries, level-specific prompts, completion requirements, persistence schema, selection bounds, Markdown content).
- `npm run build`: passing. Existing Vite warnings remain: large main chunk and runtime-resolved self-hosted font URL; the font file exists in public assets and renders in the browser.
- Browser 1280×720: new integrated K image loads; it has exactly one child image and no separate K overlay. Before/after hover center remains approximately (717.477, 356.159), animation duration stays 18s. K opens AI 智识.
- Knowledge Base and Upload hover regression: both retain horizontal center X≈717.477, no sideways jump.
- Homepage expression card and sidebar entry open the module.
- Empty completion is rejected; synthetic three-field notes allow completion. Chinese progress becomes 1/28 while English stays 0/28.
- English B1 coach prompt copies correctly, including lesson topic, turn-taking and no invented pronunciation feedback.
- Reload preserves B1 selection and Chinese notes. No audio, user files or personal training data were sent to ChatGPT during testing.
- Timer visibly advances (10:00 → 09:00), pauses and resets to 10:00.
- Browser 390×844: no horizontal overflow (document width 382); language switch, level selector, input sizing and mobile navigation remain usable. Temporary viewport override reset afterward.
- No browser console errors observed.
- Export content is unit-tested and UI download action returns success; the embedded browser did not expose a download event, so an actual saved download file was not verified through that browser.
- Real microphone/ChatGPT voice sessions were intentionally not started. This is a guided external voice workflow, not an API integration or automatic transcript sync.
