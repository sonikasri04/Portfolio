# Sonika Srinivas — Portfolio

A static, dependency-free site. No build step, no npm install — open it and go.

## Structure
```
portfolio/
├── index.html                 → page structure/content
├── css/style.css               → all styling (site + intro animation)
├── js/intro.js                 → the data → pipeline → headline intro sequence
├── js/script.js                → nav toggle + project image/doc lightbox
├── assets/images/<project>/    → screenshots per project (1.jpg, 2.jpg, 3.jpg…)
├── assets/images/placeholder.svg → shown automatically if an image is missing
└── Sonika_Srinivas_Resume.pdf  → served by the "Resume" download link
```

## The intro animation
On page load, `js/intro.js` plays a short sequence before revealing the site:
scattered data/code glyphs funnel into a 3-node pipeline (Raw → Engineer →
Clarity, appearing one at a time), then the headline scrambles into place.
It respects `prefers-reduced-motion` (skips entirely for users who have that
set) and has a "Skip ↓" button bottom-right. All timing constants
(`FUNNEL_START`, `NODE_STEP`, `PIPELINE_HOLD`, etc.) are near the top of
`intro.js` if you want to adjust pacing later. It currently plays on every
page load — search that file's bottom section if you'd rather it only play
once per browser session.


## Run it locally
Just opening `index.html` in a browser works for viewing, but the lightbox's
`fetch`-free image loading needs a local server (some browsers block local
`file://` image loads from JS). Easiest options in VS Code:
- Install the **Live Server** extension → right-click `index.html` → "Open with Live Server"
- Or from a terminal in this folder: `python3 -m http.server 8000`, then open `http://localhost:8000`

## Add your project screenshots
Each project has a folder under `assets/images/`:
`recommender`, `clickstream`, `insurance`, `parks`, `voicelink`, `portfolio`.

Each folder currently has 3 placeholder images named `1.jpg`, `2.jpg`, `3.jpg`.
**Just overwrite those files with your real screenshots, keeping the same
filenames** — nothing else needs to change.

Want more than 3, or a different file type (`.png`)? Open `js/script.js` and
edit that project's config, e.g.:
```js
recommender: {
  imageCount: 5,      // now looks for 1.jpg through 5.jpg
  imageExt: 'png',    // now looks for .png files
  ...
}
```

## Add your project write-ups
Still in `js/script.js`, each project has a `doc` field — replace the
placeholder string with your real write-up. Leave a blank line between
paragraphs and it'll render as separate paragraphs:
```js
doc: `First paragraph here.

Second paragraph here.`
```

## Notes
- All interactive behavior (nav menu, image gallery, doc modal) lives in
  `js/script.js` — no inline `onclick` handlers, so nothing gets blocked by
  strict content-security policies if you ever host this elsewhere.
- If an image file is missing or misnamed, the gallery falls back to
  `assets/images/placeholder.svg` automatically instead of breaking.
- Fonts (Space Grotesk / IBM Plex) load from Google Fonts via `<link>` tags
  in `index.html` — remove those and self-host if you need a fully offline copy.
