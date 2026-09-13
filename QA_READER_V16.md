# Reading workspace QA

- 24 Node tests passed, including normalized geometry and old-note compatibility. Production build passed.
- Browser: imported the user-supplied local Mao quotations PDF (283 pages), without entering or retrieving the encryption passphrase. Full-window desktop PDF/notebook layout rendered.
- Drew a region underline on page 1; annotation count incremented, thought text accepted, page 2 navigation retained the annotation. Delete and undo restored both mark and thought.
- At 390 x 844, reading/notebook pane switching retained the annotation. Temporary viewport restored and agent-created annotation deleted afterward.
- Encryption/closed-book access unchanged. Actual password-protected download was not repeated because the passphrase is user-only. The shared reader was tested through local PDF input.
- Scan marks are normalized page regions, not OCR-based text selection. Extracted text, when present, supports quote capture. Notes/marks remain local and unencrypted; Markdown export includes page numbers and region coordinates. No cloud sync or PDF annotation embedding claimed.
- Apple-design guidance used for brief opening/page transitions, direct pointer feedback, readable controls and reduced-motion support.
