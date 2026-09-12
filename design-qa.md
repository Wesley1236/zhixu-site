# V14 visual QA

Source: C:/Users/Wesle/AppData/Local/Temp/codex-clipboard-90a48c88-846f-4ad4-98d9-98fa56b20dc1.png (1672 × 941).
Wallpaper: D:/Wallpaper/橘子洲头 书房.png, used as supplied.
Implementation: http://127.0.0.1:4173/zhixu-site/, in-app browser tab 2. Screenshots are recorded inline in the task tool results; no separate image file was exported.

Desktop CSS viewport 1672 × 941, mobile 390 × 844. Full desktop captures and source were emitted in the same comparison call twice. States: home (Chinese/English), desktop and mobile bookshelf, mobile Explore, filtered bookshelf. Screenshot density was normalized by the browser display; no whole-canvas CSS scaling.

## Comparison and fixes
- Initial P1: legacy high-specificity light-theme text rules made portal and book labels dark on dark glass. Fixed scoped foreground rules. Post-fix desktop home/book screenshots show warm white text; mobile bookshelf rechecked after the quota reset.
- P2: search input retained an opaque inset background; now transparent. Portal spacing moved upward to match the reference lower-middle row.
- Fonts: self-hosted rounded Chinese; Georgia serif first for English headings/body where scoped, per latest rounded/serif request. Deliberate departure from reference sans-serif. Heading hierarchy preserved, long titles wrap on book covers rather than truncate.
- Layout: narrow open rail, greeting/search and four horizontal portals. Mobile two-column portals/books and persistent bottom navigation. Home scrollWidth 382 versus viewport 390: no horizontal overflow. Detail pages intentionally scroll.
- Tokens: blue-gray, warm ivory, restrained glass and source landscape. Reading surfaces remain more opaque for legibility. Actual supplied wallpaper, existing logo and Phosphor icons; no replacement decorative K asset.
- Content: all previous learning routes are reachable under Explore. Books retain original filenames and edition distinctions. Typographic covers are explicitly not original covers. Placeholder entry state clearly requires private connection.
- Focused inspection: desktop bookshelf labels and search control inspected in full-resolution screenshot; mobile title/tool layout inspected independently. No remaining observed P0/P1/P2 visual finding.

## Verification boundaries
- 17 Node tests passed: prior learning/expression/Mao data, private repository rejection, conflict propagation, base64, PDF validation and ordered chunk assembly.
- Actual private API verified: repository is private, 13 metadata entries, one complete original PDF downloaded and SHA-256 matched against imported identifier.
- Browser: home → Library, home → Explore, Chinese/English switch, mobile navigation and title filtering passed. Captured console errors: none.
- Browser filechooser automation timed out; local file selection and the authenticated reader/sync UI were not end-to-end exercised in this browser. No access token was entered for the user. Multi-device sign-in remains a user configuration step; live upload/note-sync semantics have unit coverage, not a claimed two-device test.
- Reduced-motion rules present; not manually emulated. Scanned originals have no claimed completed OCR or AI analysis.

final result: passed

Visual acceptance only; the explicit functional test gaps above remain documented.
