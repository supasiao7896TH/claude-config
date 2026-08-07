/**
 * A(i)CODER mark renderer — standalone, no dependencies.
 *
 *   import { mark, favicon, NEON_CSS, TOKENS } from "./renderer.mjs";
 *   writeFileSync("logo.svg", mark({ mode: "night", ground: "glow" }));
 *
 * Also runs in a browser: drop the file in as a module and call the same
 * functions, or paste the body into a <script>.
 *
 * Colours come out as literal hex, not CSS variables, so a generated file
 * works anywhere — inside an <img>, in a README, in an email. Pass
 * `tokens: false` to `mark()` only if you are inlining into a page that
 * already defines the --sc-* custom properties.
 *
 * Kept in step with branding/src/mockups.template.html by a pixel-compare
 * in branding/tools/verify.mjs. If you change one, run that.
 */

/* ── The name ──────────────────────────────────────────────────────
   Renaming the brand is editing these. HEAD + TAIL must concatenate
   back to WORDMARK. */
export const WORDMARK = "A(i)CODER";
export const HEAD = "A(i)", TAIL = "CODER";
export const INITIAL = "A";
export const YEARMARK = "2025";

/* ── Palette ───────────────────────────────────────────────────────
   Fixed. These never respond to the viewer's light/dark setting: a logo
   that changes colour with an OS preference is not a logo. */
export const TOKENS = {
  "--sc-violet": "#B39DF3", "--sc-violet-hi": "#C4AFFF", "--sc-violet-deep": "#8C74E0",
  "--sc-pink": "#FF5C8A", "--sc-pink-hot": "#FF4D7E", "--sc-paw-pink": "#FF6FA5",
  "--sc-red": "#F4614B", "--sc-navy": "#3D4EA3", "--sc-paper": "#F7F5FB",
  "--sc-night": "#0D0B14", "--sc-hairline": "#C9D6D2", "--sc-ink": "#1B1533",
  "--sc-lilac": "#EFEAFB"
};

export const resolveTokens = (s) =>
  s.replace(/var\((--sc-[a-z-]+)\)/g, (whole, key) => TOKENS[key] ?? whole);

/* Element ids must be unique per document but stable across runs, so a
   regenerated asset is byte-identical and does not churn a git diff. */
let UID_N = 0;
const uid = (p) => p + (++UID_N).toString(36);
export const resetIds = () => { UID_N = 0; };

/* ── Glyphs ────────────────────────────────────────────────────────
   A 5 × 7 bitmap drawn as vector rectangles, not a font: no dependency,
   no licence to track, and identical crispness at 24 px and 2400 px.

   Widths vary. A bracket is 2 units and the lowercase i is 1, because
   padding them onto a 5-unit body would make the aside shout as loudly
   as the word it interrupts. Case is significant — i and I are different
   glyphs, so never uppercase text before rendering it. */
const GW = 5, GH = 7;

const GLYPHS = {
  A: ["01110","10001","10001","11111","10001","10001","10001"],
  S: ["01110","10001","10000","01110","00001","10001","01110"],
  O: ["01110","10001","10001","10001","10001","10001","01110"],
  I: ["11111","00100","00100","00100","00100","00100","11111"],
  C: ["01110","10001","10000","10000","10000","10001","01110"],
  D: ["11110","10001","10001","10001","10001","10001","11110"],
  E: ["11111","10000","10000","11110","10000","10000","11111"],
  R: ["11110","10001","10001","11110","10100","10010","10001"],
  0: ["01110","10001","10001","10001","10001","10001","01110"],
  1: ["00100","01100","00100","00100","00100","00100","01110"],
  2: ["01110","10001","00001","00110","01000","10000","11111"],
  3: ["11111","00010","00100","00010","00001","10001","01110"],
  4: ["00010","00110","01010","10010","11111","00010","00010"],
  5: ["11111","10000","11110","00001","00001","10001","01110"],
  6: ["00110","01000","10000","11110","10001","10001","01110"],
  7: ["11111","00001","00010","00100","01000","01000","01000"],
  8: ["01110","10001","10001","01110","10001","10001","01110"],
  9: ["01110","10001","10001","01111","00001","00010","01100"],
  "(": ["01","10","10","10","10","10","01"],
  ")": ["10","01","01","01","01","01","10"],
  i:   ["1","0","1","1","1","1","1"]
};

const glyphOf = (ch) => GLYPHS[ch] || GLYPHS[ch.toUpperCase()] || null;
const glyphWidth = (ch) => { const g = glyphOf(ch); return g ? g[0].length : GW; };

export function textWidth(text, tracking = 2) {
  let w = 0;
  for (const ch of String(text)) w += glyphWidth(ch) + tracking;
  return w - tracking;
}
export const wordmarkWidth = (text, px, tracking = 2) => textWidth(text, tracking) * px;

/* Merge each row's lit cells into single rects: fewer nodes, and no
   hairline seam between neighbouring pixels at fractional scale. */
function glyphRuns(text, tracking) {
  const rows = new Map();
  let cursor = 0;
  for (const ch of String(text)) {
    const g = glyphOf(ch);
    if (g) {
      g.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          if (row[x] === "1") {
            if (!rows.has(y)) rows.set(y, []);
            rows.get(y).push(cursor + x);
          }
        }
      });
    }
    cursor += glyphWidth(ch) + tracking;
  }
  const runs = [];
  for (const [y, xs] of rows) {
    xs.sort((a, b) => a - b);
    let start = xs[0], prev = xs[0];
    for (let i = 1; i < xs.length; i++) {
      if (xs[i] === prev + 1) { prev = xs[i]; continue; }
      runs.push([start, y, prev - start + 1]);
      start = prev = xs[i];
    }
    runs.push([start, y, prev - start + 1]);
  }
  return runs;
}

/* px = the size of one logical pixel in user units. */
export function wordmark(text, opts = {}) {
  const { px = 12, tracking = 2, fill = "#000", x = 0, y = 0, attrs = "" } = opts;
  const body = glyphRuns(text, tracking).map(([cx, cy, len]) =>
    `<rect x="${x + cx * px}" y="${y + cy * px}" width="${len * px}" height="${px}"/>`
  ).join("");
  return `<g fill="${fill}" shape-rendering="crispEdges" ${attrs}>${body}</g>`;
}

/* ── Paw ───────────────────────────────────────────────────────────
   Four toes on an arc and one pad, in a 0–100 box. Toes are placed to
   clear the pad so a die-cut keyline never crosses itself. */
const PAW_PAD = "M50 51C58 51 66 53 73 58C81 63 86 70 85 77C84 87 69 95 50 95C31 95 16 87 15 77C14 70 19 63 27 58C34 53 42 51 50 51Z";
const PAW_TOES = [
  [20, 41, 11, 13.5, -26], [41, 25, 11.5, 15, -9],
  [62, 25, 11.5, 15, 9],   [83, 41, 11, 13.5, 26]
];

export function pawShapes() {
  return PAW_TOES.map(([cx, cy, rx, ry, rot]) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})"/>`
  ).join("") + `<path d="${PAW_PAD}"/>`;
}

export function paw(opts = {}) {
  const { x = 0, y = 0, size = 100, fill = "#000", attrs = "" } = opts;
  return `<g transform="translate(${x} ${y}) scale(${size / 100})" fill="${fill}" ${attrs}>${pawShapes()}</g>`;
}

function pawCluster(H, trail, lead) {
  const sTrail = H * 0.28, sLead = H * 0.34;
  const x1 = Math.round(H * 0.26), y1 = Math.round(H * 0.50);
  return [
    paw({ x: x1, y: y1, size: sTrail, fill: trail }),
    paw({ x: x1 + Math.round(sTrail * 0.74), y: Math.round(H * 0.245), size: sLead, fill: lead })
  ];
}

/* ── Tricolour bar ─────────────────────────────────────────────────
   Segment ratios read off the original artwork. The one element that is
   not a light source — enamel, not neon. */
const BAR = [[0, 0.365, "var(--sc-red)"], [0.365, 0.25, "#F4F2F6"], [0.615, 0.385, "var(--sc-navy)"]];

export function bar(opts = {}) {
  const { x = 0, y = 0, w = 160, h = 20, white = "#FFFFFF", attrs = "" } = opts;
  const id = uid("clip");
  const segs = BAR.map(([o, len, c]) =>
    `<rect x="${x + o * w}" y="${y}" width="${len * w + 0.5}" height="${h}" fill="${c === "#F4F2F6" ? white : c}"/>`
  ).join("");
  return `<g ${attrs}><defs><clipPath id="${id}">` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/></clipPath></defs>` +
    `<g clip-path="url(#${id})">${segs}</g></g>`;
}

/* Two-pass bloom — a wide halo plus a tight core, merged back over the
   crisp artwork. An SVG filter rather than CSS blur, which breaks up
   when the result is rasterised at 2x. */
function bloomDef(id, far, near, doubled = true) {
  return `<filter id="${id}" x="-60%" y="-120%" width="220%" height="340%" color-interpolation-filters="sRGB">` +
    `<feGaussianBlur in="SourceGraphic" stdDeviation="${far}" result="far"/>` +
    `<feGaussianBlur in="SourceGraphic" stdDeviation="${near}" result="near"/>` +
    `<feMerge><feMergeNode in="far"/>${doubled ? '<feMergeNode in="far"/>' : ""}` +
    `<feMergeNode in="near"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}

const svgWrap = (w, h, inner) =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

/* ── Flicker ───────────────────────────────────────────────────────
   A Yaowarat sign at 2am does three things at once, so a tube stacks
   three animations on three nested groups. Nested, not listed: CSS lets
   only the last animation win a property, while nested opacities
   multiply.

   Infinite animations sit at full opacity at 0%, so a cancelled or
   disabled animation leaves the sign lit rather than dead. Warm-up may
   start dark because it ends lit.

   The filter goes on the element that animates opacity. Opacity
   composites after filtering, so the Gaussian is computed once and
   cached; animating a filtered group's child re-runs it every frame. */
export const NEON_CSS = `
.tube   { animation: sc-warm 2.6s steps(1, end) var(--wd, 0s) 1 both; }
.tube-s { animation: sc-stut var(--sp, 13s) steps(1, end) var(--sd, 0s) infinite; }
.tube-b { animation: sc-breathe var(--bp, 6s) ease-in-out var(--bd, 0s) infinite; }
@keyframes sc-warm {
  0% { opacity: 0; } 3% { opacity: 1; } 6% { opacity: .06; } 10% { opacity: .85; }
  13% { opacity: 0; } 21% { opacity: 1; } 25% { opacity: .1; } 28% { opacity: 1; }
  32% { opacity: .35; } 36% { opacity: 1; } 41% { opacity: .15; }
  46%, 100% { opacity: 1; }
}
@keyframes sc-stut {
  0%, 95.6% { opacity: 1; } 96% { opacity: .07; } 96.4% { opacity: 1; }
  97.2% { opacity: .14; } 97.6%, 100% { opacity: 1; }
}
@keyframes sc-breathe { 0%, 100% { opacity: 1; } 50% { opacity: .87; } }
@media (prefers-reduced-motion: reduce) {
  .tube, .tube-s, .tube-b { animation: none; opacity: 1; }
}
`;

/* Deterministic phase per tube. Signs that blink in unison read as a CSS
   animation; signs that don't read as neon. A seeded hash keeps them out
   of step without making the output random. */
function tubeVars(i) {
  const h = (salt) => {
    const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const r = (v) => Math.round(v * 100) / 100;
  const bp = 5 + h(1) * 2.6, sp = 9 + h(2) * 8;
  return `--wd:${r(h(3) * 0.5)}s;--bp:${r(bp)}s;--bd:${r(-h(4) * bp)}s;` +
         `--sp:${r(sp)}s;--sd:${r(-h(5) * sp)}s`;
}

function tube(i, inner, filterId, animated) {
  const f = filterId ? ` filter="url(#${filterId})"` : "";
  if (!animated) return `<g><g><g${f}>${inner}</g></g></g>`;
  return `<g class="tube" style="${tubeVars(i)}"><g class="tube-s">` +
         `<g class="tube-b"${f}>${inner}</g></g></g>`;
}

function wordmarkTubes(text, opts) {
  const { px, tracking = 2, x, y, filterId, seed, layers, animated } = opts;
  let cursor = 0;
  return [...String(text)].map((ch, i) => {
    const xo = x + cursor * px;
    cursor += glyphWidth(ch) + tracking;
    if (!glyphOf(ch)) return "";
    const art = layers.map(l => wordmark(ch, {
      px, tracking, fill: l.fill, x: xo + (l.dx || 0), y, attrs: l.attrs || ""
    })).join("");
    return tube(seed + i, art, filterId, animated);
  }).join("");
}

/* ── Layout ────────────────────────────────────────────────────────
   The wordmark, the year and the right padding are measured back from
   the right edge, so a lockup can never push its own content off the
   plate at any size. Do not hand-place a lockup. */
export function lockupGeometry(W, H, word = WORDMARK, year = YEARMARK) {
  const unitWord = textWidth(word, 2), unitYear = textWidth(year, 2);
  const px   = Math.max(2, Math.floor((W * 0.58) / unitWord));
  const yrPx = Math.max(1, Math.round(px / 2));
  const gap  = Math.round(W * 0.035);
  const pad  = Math.round(W * 0.045);
  const wmW  = unitWord * px, yrW = unitYear * yrPx;
  const wmX  = W - pad - yrW - gap - wmW;
  const wmY  = Math.round((H - GH * px) / 2);
  const yrX  = wmX + wmW + gap;
  const yrY  = wmY + GH * px - GH * yrPx;
  return {
    px, yrPx, wmW, yrW, wmX, wmY, yrX, yrY,
    barY: yrY + GH * yrPx + Math.round(H * 0.07),
    barH: Math.max(4, Math.round(H * 0.055))
  };
}

/* ── Modes ─────────────────────────────────────────────────────────
   light and night are one logo in two modes, not two logos. Pastel
   violet has too little contrast on near-black, which is why night
   lifts the wordmark and adds the misconvergence ghost. */
const MODES = {
  light: {
    bloom: [15, 2, true], pawBloom: [18, 4, true],
    paws: ["var(--sc-violet-deep)", "var(--sc-paw-pink)"], pawOpacity: ".92",
    core: "var(--sc-violet)", ghost: null,
    year: "var(--sc-pink)", barWhite: "#FFFFFF"
  },
  night: {
    bloom: [17, 2, false], pawBloom: [20, 4, false],
    paws: ["var(--sc-violet)", "var(--sc-paw-pink)"], pawOpacity: "1",
    core: "var(--sc-violet-hi)", ghost: "var(--sc-pink)",
    year: "var(--sc-pink-hot)", barWhite: "#E4DFF0"
  }
};

const scanPattern = (id, opacity) =>
  `<pattern id="${id}" width="3" height="3" patternUnits="userSpaceOnUse">` +
  `<rect width="3" height="1" fill="#FFFFFF" opacity="${opacity}"/></pattern>`;

/* ── Grounds ───────────────────────────────────────────────────────
     bare   nothing. Transparent, for a surface that has its own ground.
            This is what stops the mark reading as a bright slab.
     glow   a radial haze with no straight edge anywhere.
     plate  the opaque banner, for a card that wants a frame. */
function groundLayer(kind, W, H, mode) {
  const night = mode === "night";
  const fill = night ? "var(--sc-night)" : "var(--sc-paper)";
  if (kind === "bare") return { defs: "", back: "", front: "" };

  if (kind === "glow") {
    const gid = uid("gg"), mid = uid("gm"), sid = uid("gs");
    return {
      /* Four stops, not two. A straight white-to-black ramp leaves a
         visible ring where the falloff turns over, which is the one
         thing a glow ground exists to avoid. */
      defs:
        `<radialGradient id="${gid}" cx="50%" cy="52%" r="72%">` +
        `<stop offset="0%" stop-color="#FFFFFF"/>` +
        `<stop offset="38%" stop-color="#FFFFFF" stop-opacity=".94"/>` +
        `<stop offset="68%" stop-color="#FFFFFF" stop-opacity=".45"/>` +
        `<stop offset="88%" stop-color="#FFFFFF" stop-opacity=".12"/>` +
        `<stop offset="100%" stop-color="#000000"/></radialGradient>` +
        `<mask id="${mid}"><rect width="${W}" height="${H}" fill="url(#${gid})"/></mask>` +
        (night ? scanPattern(sid, ".055") : ""),
      back:
        `<g mask="url(#${mid})"><rect width="${W}" height="${H}" fill="${fill}"/>` +
        (night ? `<rect width="${W}" height="${H}" fill="url(#${sid})"/>` : "") + `</g>`,
      front: ""
    };
  }

  if (night) {
    const vid = uid("pv"), sid = uid("ps");
    return {
      defs:
        `<radialGradient id="${vid}" cx="45%" cy="50%" r="72%">` +
        `<stop offset="0%" stop-color="#241C3C" stop-opacity=".85"/>` +
        `<stop offset="60%" stop-color="#130F20" stop-opacity=".4"/>` +
        `<stop offset="100%" stop-color="#000000" stop-opacity=".55"/></radialGradient>` +
        scanPattern(sid, ".055"),
      back: `<rect width="${W}" height="${H}" fill="${fill}"/><rect width="${W}" height="${H}" fill="url(#${vid})"/>`,
      front:
        `<rect width="${W}" height="${H}" fill="url(#${sid})"/>` +
        `<line x1="0" y1="0.5" x2="${W}" y2="0.5" stroke="#3A2F55"/>` +
        `<line x1="0" y1="${H - 0.5}" x2="${W}" y2="${H - 0.5}" stroke="#3A2F55"/>`
    };
  }
  return {
    defs: "",
    back: `<rect width="${W}" height="${H}" fill="${fill}"/>`,
    front:
      `<line x1="0" y1="0.5" x2="${W}" y2="0.5" stroke="var(--sc-hairline)"/>` +
      `<line x1="0" y1="${H - 0.5}" x2="${W}" y2="${H - 0.5}" stroke="var(--sc-hairline)"/>`
  };
}

/**
 * The horizontal lockup: paws, wordmark, year, bar.
 *
 *   mode      "night" (dark surfaces) | "light" (light surfaces)
 *   ground    "bare" | "glow" | "plate"
 *   width     default 1200; height defaults to width / 4
 *   animated  default true — emits the flicker classes and <style>
 *   inline    default false — set true when pasting into a page that
 *             already carries NEON_CSS, to avoid a duplicate <style>
 *   tokens    default true — resolve --sc-* to hex literals
 */
export function mark(opts = {}) {
  const {
    mode = "night", ground = "glow",
    width = 1200, height = Math.round(width / 4),
    animated = true, inline = false, tokens = true
  } = opts;

  const m = MODES[mode];
  if (!m) throw new Error(`unknown mode "${mode}" — use "night" or "light"`);
  const W = width, H = height;
  const g = lockupGeometry(W, H);
  const gr = groundLayer(ground, W, H, mode);
  const bloom = uid("b"), pawB = uid("b");
  const [trail, lead] = pawCluster(H, m.paws[0], m.paws[1]);
  const k = H / 300;
  const bl = (v) => [v[0] * k, v[1] * k, v[2]];

  /* The ghost offset is a fraction of the pixel unit, so misconvergence
     stays proportional instead of smearing on a small plate. It rides
     inside its letter's tube — a ghost left glowing over a dead letter
     is the tell that gives away a fake. */
  const layers = m.ghost
    ? [{ fill: m.ghost, dx: -Math.max(1, Math.round(g.px * 0.42)), attrs: 'opacity=".5"' }, { fill: m.core }]
    : [{ fill: m.core }];

  const out = svgWrap(W, H,
    (animated && !inline ? `<style>${NEON_CSS}</style>` : "") +
    `<defs>${gr.defs}${bloomDef(bloom, ...bl(m.bloom))}${bloomDef(pawB, ...bl(m.pawBloom))}</defs>` +
    gr.back +
    `<g opacity="${m.pawOpacity}">${tube(20, trail, pawB, animated)}${tube(21, lead, pawB, animated)}</g>` +
    wordmarkTubes(WORDMARK, { px: g.px, x: g.wmX, y: g.wmY, filterId: bloom, seed: 0, layers, animated }) +
    wordmarkTubes(YEARMARK, { px: g.yrPx, x: g.yrX, y: g.yrY, filterId: bloom, seed: 30, layers: [{ fill: m.year }], animated }) +
    (animated ? `<g class="tube-b" style="${tubeVars(40)}">` : "<g>") +
      bar({ x: g.yrX, y: g.barY, w: g.yrW, h: g.barH, white: m.barWhite }) + "</g>" +
    gr.front
  );
  return tokens ? resolveTokens(out) : out;
}

/**
 * The square icon: paw over the initial, flat, keylined. No glow —
 * below roughly 64 px a bloom turns a mark into a smudge, so the icon
 * system is the flat one. Legible down to 16 px with `letter: false`.
 */
export function favicon(opts = {}) {
  const { size = 512, letter = true, ground = "var(--sc-lilac)", tokens = true } = opts;
  const S = 100, ink = "var(--sc-ink)";
  /* Drawn in a fixed 100-unit box and scaled by the viewBox, so the
     keyline stays proportional at every size instead of thinning out. */
  const out =
    `<svg viewBox="0 0 ${S} ${S}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="1.5" y="1.5" width="${S - 3}" height="${S - 3}" rx="21" fill="${ground}" stroke="${ink}" stroke-width="3"/>` +
    `<g transform="translate(20 ${letter ? 8 : 18}) scale(0.6)" fill="var(--sc-paw-pink)" ` +
    `stroke="${ink}" stroke-width="4" stroke-linejoin="round">${pawShapes()}</g>` +
    (letter ? wordmark(INITIAL, { px: 3, x: (S - wordmarkWidth(INITIAL, 3)) / 2, y: 70, fill: ink }) : "") +
    `</svg>`;
  return tokens ? resolveTokens(out) : out;
}
