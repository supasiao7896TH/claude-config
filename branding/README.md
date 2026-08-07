# SOICODER — Identity Study, Round 01

Three directions for the `SOICODER 2025` mark, built from the supplied banner
artwork. **Nothing here is final** — the round exists so one direction can be
picked before a full kit gets built.

Open `soicoder-mockups.html` in any browser, or look at `exports/*.png`.

---

## The three directions

| | Direction | Ground | Built for | Trade-off |
|---|---|---|---|---|
| **D1** | Neon Arcade | `#F7F5FB` paper | light README, web app header, social card | closest to the original; illegible below ~240 px |
| **D2** | CRT Night | `#0D0B14` night | terminal, dark README, PWA splash | needs its own dark plate — never sits on white |
| **D3** | Soi Sticker | `#EFEAFB` lilac | avatar, favicon, PWA icon, merch | re-composed to a stacked lockup; the only one legible at 16 px |

D1/D2 share one horizontal lockup and differ only in treatment, so choosing
between them is choosing a ground, not a logo. D3 is stacked because its job —
fitting a square and surviving 16 px — makes the horizontal lockup impossible.

These are not mutually exclusive. The usual resolution is **one primary plus one
utility**: D1 or D2 as the voice, D3 as the icon system underneath it.

---

## Ground: never ship the mark welded to a rectangle

A plate is a rectangle of light. Drop one into a dark interface and the eye finds
the box before it finds the logo. The fix is not a better rectangle — it is to
stop shipping the ground attached to the mark. Every lockup comes in three:

| Ground | What it draws | Use for |
|---|---|---|
| **bare** | nothing — transparent | header, README, splash: anywhere the surface already has a ground |
| **glow** | a radial haze, no straight edge anywhere | hero, dark app, social — what neon actually does to the air |
| **plate** | opaque banner + hairlines | OG image, card, print — where a frame is wanted |

### D1 and D2 are not two logos

They are **one logo with a light mode and a dark mode**. "D1 on a dark
background" is not a problem to be solved — the answer is **D2 bare**. Pastel
violet `#B39DF3` does not carry enough contrast on `#0D0B14`, which is exactly
why D2 lifts the wordmark to `#C4AFFF`.

- **D1** — grounds lighter than `#E8E4F2`
- **D2** — grounds darker than `#1A1626`
- **Never** — D1 on a dark ground

The glow gradient uses four stops, not two. A straight white-to-black ramp
leaves a visible ring where the falloff turns over, which is the one thing a
glow ground exists to avoid.

---

## Flicker

A Yaowarat sign at 2am does three things at once, so a tube stacks three
animations on three nested groups — nested rather than listed, because CSS lets
only the last animation win a property while nested opacities multiply.

| Layer | Class | Behaviour |
|---|---|---|
| Warm-up | `.tube` | fires once on load: hard, irregular strikes over 2.6 s |
| Stutter | `.tube-s` | a long quiet loop (9–17 s) broken by a ~60 ms dropout |
| Breathe | `.tube-b` | a slow swell, 5–7.6 s — the ballast hum |

**Every glyph and every paw is its own tube**, each on a phase from a seeded
hash of its index. Signs that blink in unison read as a CSS animation; signs
that don't read as neon. The seed is deterministic, so the build stays
byte-reproducible — `tools/verify.mjs` depends on that.

In D2 the pink ghost lives **inside the same tube as its letter**, so a dropout
takes both. A ghost left glowing over a dead letter is the tell that gives away
a fake.

The tricolour bar breathes but never stutters. It is the one element that isn't
a light source — enamel, not neon — so it anchors the composition while
everything around it misbehaves.

### Two rules that are easy to break

**Put the `filter` on the same element that animates `opacity`.** Opacity
composites *after* filtering, so the Gaussian is computed once and cached.
Wrapping a filter around a group and animating a child's opacity instead
re-runs the blur every frame.

**Infinite animations must sit at full opacity at `0%`.** Playwright's
`animations: "disabled"` fast-forwards finite animations but cancels infinite
ones to their base style. Warm-up may start dark because it *ends* lit; breathe
and stutter may not, or the exported PNG comes out as a dead sign.

`prefers-reduced-motion: reduce` drops all three animations and leaves every
tube lit — in the page **and** inside each standalone SVG.

---

## Palette

Brand colours are fixed — they never respond to the viewer's light/dark setting.

| Token | Hex | Role |
|---|---|---|
| `--sc-violet` | `#B39DF3` | wordmark, D1 |
| `--sc-violet-hi` | `#C4AFFF` | wordmark, D2 (lifted for a dark ground) |
| `--sc-violet-deep` | `#8C74E0` | trailing paw, `SOI` in D3 |
| `--sc-pink` | `#FF5C8A` | year mark, D3 badge |
| `--sc-pink-hot` | `#FF4D7E` | year mark on night ground |
| `--sc-paw-pink` | `#FF6FA5` | leading paw |
| `--sc-red` | `#F4614B` | tricolour bar, segment 1 |
| `--sc-navy` | `#3D4EA3` | tricolour bar, segment 3 |
| `--sc-paper` | `#F7F5FB` | D1 ground |
| `--sc-night` | `#0D0B14` | D2 ground |
| `--sc-lilac` | `#EFEAFB` | D3 ground |
| `--sc-ink` | `#1B1533` | D3 keyline and shadow |
| `--sc-hairline` | `#C9D6D2` | D1 top/bottom rules |

Tricolour bar segment ratios, left to right: **0.365 / 0.25 / 0.385**, on a full
round cap (`rx = height / 2`).

---

## The wordmark is drawn, not typed

`SOICODER` is a **5 × 7 bitmap rendered as vector rectangles**, not a font.
No font dependency, no licence to track, and it stays exactly as crisp at
2400 px as at 24. The glyph table lives in `src/mockups.template.html`
(`GLYPHS`) and covers `S O I C D E R` plus `0`–`9`, so the year is swappable.

- **Tracking:** 2 empty columns between glyphs.
- **One logical pixel** = the `px` argument. Wordmark width is
  `(len × 7 − 2) × px`; height is always `7 × px`.
- Row runs are merged into single rects before drawing, so neighbouring pixels
  never show a hairline seam at fractional scale.

### Layout rule

`lockupGeometry(W, H)` measures the wordmark, the year and the right padding
**back from the right edge**, so a lockup can never push its own content off the
plate at any size. Everything on the page routes through it — do not hand-place
a lockup.

- pixel unit = `floor(W × 0.58 / 54)`, year = half that
- gap = `W × 0.035`, right padding = `W × 0.045`

### Minimum sizes

| Direction | Minimum | Why |
|---|---|---|
| D1 | 240 px wide | below this the bloom fills the letter counters |
| D2 | 280 px wide | same, plus the scanline stops resolving |
| D3 | 16 px (paw only) · 120 px (full lockup) | flat colour, no blur to lose |

**Clear space:** 2 pixel units on all sides for D1/D2; 1 keyline width for D3.

---

## Direction-specific rules

**D1 / D2 bloom** is an SVG filter — a wide Gaussian for the halo plus a tight
one for the core, with the crisp artwork merged back on top. It is deliberately
*not* CSS `filter: blur()`, which breaks up when screenshotted at 2×.
D2 adds a pink ghost 5 units to the left at 50% opacity: real CRTs
misconverge, and the offset is what makes the plate read as a screen rather
than as a logo on a black rectangle.

**D3 carries no shadow on the letters.** The strokes are one unit wide, so any
offset copy lands inside the counters and closes them up. The solid shapes —
paw, badge, bar — take the 1-unit offset shadow instead. Five flat colours, no
gradients, which is also what makes D3 the printable and embroiderable one.

---

## Using the animated SVGs

Each `exports/*.svg` is self-contained and carries its own `<style>`, which is
what lets it flicker inside an `<img>` — scripts and external references do not
run in image context, but CSS animation does. Point a README straight at one:

```markdown
![SOICODER](branding/exports/d2-crt-night-glow.svg)
```

Pick by surface, not by taste: `d2-*` on dark, `d1-*` on light, `-bare` when the
page already has a ground, `-glow` for a hero, `-plate` when a frame is wanted.

The three PNGs are the plate variants, flattened and lit, for the places an SVG
can't go.

## Files

```
branding/
├── soicoder-mockups.html      generated — open this
├── src/mockups.template.html  source of truth; edit this
├── tools/build.mjs            inlines fonts, exports PNGs and SVGs
├── tools/verify.mjs           checks the build; non-zero exit on failure
├── fonts/                     Tektur · Instrument Sans · DM Mono (all OFL)
└── exports/                   3 PNG (static) · 6 SVG (animated)
```

`soicoder-mockups.html` is generated. **Edit `src/mockups.template.html`**, then
rebuild — direct edits to the generated file are overwritten.

## Build

```bash
node branding/tools/build.mjs          # HTML + PNGs at 2× + 6 animated SVGs
node branding/tools/build.mjs --html   # HTML only, no browser needed
node branding/tools/verify.mjs         # run after building
```

Step 1 inlines the four OFL fonts as data URIs, because the artifact CSP blocks
every external host and a linked webfont would fall back silently. Step 2
screenshots each hero. Step 3 pulls the standalone SVGs off the same renderer
the page uses — an exported file can never disagree with what was approved on
screen. Brand colours are CSS variables in the page but a standalone file has no
`:root` to read, so they are resolved to literals on the way out.

Playwright resolves from a local `node_modules` first, then from the global
install. Chromium is expected to be on disk already — do not run
`playwright install`.

`verify.mjs` covers: brand tokens resolved in every SVG, each SVG carrying its
own keyframes and reduced-motion rule, **the SVGs actually animating inside an
`<img>`**, no external requests, all three faces loaded, no horizontal scroll at
1280 px or 390 px, both themes resolving, and reduced motion leaving every tube
lit.

---

## Next round

Once a direction is named: full icon set at 512 / 192 / 64 / 32 / 16,
clear-space and minimum-size sheet, a monochrome lockup for stamps and
single-colour print, the app shell header in situ, and the exported asset pack.

Everything here composes from four primitives — the glyph table, a paw, a
tricolour bar, and a bloom filter — so extending it is composition, not
redrawing.
