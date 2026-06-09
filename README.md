# Penny's Patchwork Portfolio 🐾

A responsive, **quilted 90s-style** slidedeck showcasing six portraits of Penny,
a black-and-tan Cavalier King Charles Spaniel.

## View it

Open `index.html` in any browser, or serve the folder and visit it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

It also works as-is on **GitHub Pages** (Settings → Pages → deploy from the
`main` branch root).

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | Page shell, header/footer, deck mount point |
| `style.css`  | Quilted patchwork background, fabric "patch" slides, retro palette, responsive layout |
| `slides.js`  | Slide data (alt text + fun captions) and the carousel behavior |
| `music.js`   | Optional 8-bit background chiptune, synthesized live via the Web Audio API |
| `IMG_*.jpg` / `.jpeg` | The six photos |

## Features

- **Responsive** — mobile-first; image stacks above the caption on small screens
  and sits beside it on wide ones, respecting each photo's orientation.
- **Accessible** — real `alt` text on every image (distinct from the on-screen
  fun caption), keyboard navigation (`←` `→` `Home` `End`), focus rings, an
  `aria-live` announcer, a skip link, and `prefers-reduced-motion` support.
- **Navigation** — prev/next buttons, clickable dots, a slide counter, and
  touch swiping.
- **Quilted 90s aesthetic** — a tiled patchwork background, dashed-stitch
  borders, chunky beveled buttons, and a Memphis-ish palette — kept readable.
- **Background chiptune** — an optional looping 8-bit melody synthesized live
  in the browser (no audio files). It's **off by default** with a visible
  "Music: OFF/ON" toggle, so there's no surprise autoplay, and it hushes itself
  when the tab is hidden.
