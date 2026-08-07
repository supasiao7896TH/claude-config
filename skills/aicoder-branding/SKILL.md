---
name: aicoder-branding
description: >
  A(i)CODER Brand Kit — ใช้เมื่อพี่ A ขอ "ใส่ branding", "ใส่โลโก้", "ทำ header
  ให้แอปนี้", "ทำ favicon / PWA icon / splash screen", "ทำ banner ให้ README",
  "ทำ social card / OG image" หรือพูดถึง A(i)CODER, SOICODER (ชื่อเดิม), โลโก้
  นีออน, รอยเท้าหมา, wordmark พิกเซล ครอบคลุม palette · lockup · ground · การ
  กระพริบแบบนีออน · icon system · โค้ด renderer พร้อมใช้ ไม่ใช่ skill สำหรับ
  ออกแบบ UI ทั้งแอป (→ vibe-coding-core) หรือแก้บักโค้ดเดิม (→ vibe-coding-workflow)
---

# A(i)CODER — Brand Kit

> **Mark:** `A(i)CODER 2025` · paw · tricolour bar
> **Feel:** ป้ายนีออนเยาวราชตอนตีสอง — pixel arcade, soft neon, หมาซอย
> **Source of truth:** `branding/` ใน repo `claude-config`

| | |
|---|---|
| **Version** | 1.0 |
| **Renderer** | `references/renderer.mjs` — standalone, ไม่มี dependency |
| **Ready-made assets** | `branding/exports/` — 6 SVG (กระพริบได้) + 3 PNG (นิ่ง) |
| **Related skills** | `vibe-coding-core` (สร้างแอปใหม่) · `vibe-coding-firebase` |

**ก่อนเริ่มทุกครั้ง:** ถามว่าพื้นที่จะวางโลโก้เป็น**สว่างหรือมืด** ถ้ายังไม่รู้ ห้ามเดา —
มันเป็นตัวตัดสินว่าใช้ mode ไหน และเป็นความผิดพลาดที่เห็นชัดที่สุดถ้าเลือกผิด

---

## § 1 · เลือกให้ถูกก่อนอย่างอื่น

ตัดสิน 2 อย่างเสมอ: **mode** (ตามความสว่างของพื้น) และ **ground** (ตามว่าพื้นมีอยู่แล้วหรือยัง)

### Mode — ดูจากพื้นหลัง

| พื้น | Mode | Wordmark |
|---|---|---|
| สว่างกว่า `#E8E4F2` | `light` | `#B39DF3` |
| มืดกว่า `#1A1626` | `night` | `#C4AFFF` + ghost ชมพู |
| ระหว่างนั้น | ปรับพื้นให้เข้าโซนใดโซนหนึ่งก่อน | — |

> **`light` กับ `night` ไม่ใช่โลโก้ 2 อัน แต่คือโลโก้เดียว 2 โหมด**
> "เอา light ไปวางบนพื้นดำ" ไม่ใช่ปัญหาที่ต้องซ่อม — คำตอบคือใช้ `night`
> ม่วงพาสเทล `#B39DF3` มี contrast ไม่พอบน `#0D0B14` ซึ่งเป็นเหตุผลที่ `night`
> ยก wordmark ขึ้นเป็น `#C4AFFF` ตั้งแต่แรก

### Ground — ดูจากว่าพื้นมีอยู่แล้วหรือยัง

| Ground | วาดอะไร | ใช้ที่ |
|---|---|---|
| `bare` | ไม่วาดอะไรเลย โปร่งใส | **default สำหรับงานในแอป** — header, splash, README ที่มีพื้นอยู่แล้ว |
| `glow` | หมอกแสง radial ไม่มีขอบตรง | hero, landing, dark app |
| `plate` | พื้นทึบ + hairline | OG image, social card, งานพิมพ์ — ที่ที่ต้องมีกรอบจริง |

> **อย่าใช้ `plate` ในแอปเด็ดขาด** พื้นทึบขอบคมจะกลายเป็นแผ่นสว่างลากยาว
> สายตาจะจับกล่องก่อนจับโลโก้ ถ้าไม่แน่ใจให้ใช้ `bare`

---

## § 2 · Design tokens (คัดลอกไปวางได้เลย)

```css
:root {
  --sc-violet:      #B39DF3;  /* wordmark — light mode          */
  --sc-violet-hi:   #C4AFFF;  /* wordmark — night mode          */
  --sc-violet-deep: #8C74E0;  /* paw ตัวหลัง, A(i) ใน icon      */
  --sc-pink:        #FF5C8A;  /* ปี, badge, ghost               */
  --sc-pink-hot:    #FF4D7E;  /* ปี บนพื้นมืด                    */
  --sc-paw-pink:    #FF6FA5;  /* paw ตัวหน้า                     */
  --sc-red:         #F4614B;  /* แถบไตรรงค์ ช่อง 1               */
  --sc-navy:        #3D4EA3;  /* แถบไตรรงค์ ช่อง 3               */
  --sc-paper:       #F7F5FB;  /* พื้น light                      */
  --sc-night:       #0D0B14;  /* พื้น night                      */
  --sc-lilac:       #EFEAFB;  /* พื้น icon                       */
  --sc-ink:         #1B1533;  /* keyline + เงา ของ icon          */
  --sc-hairline:    #C9D6D2;  /* เส้นบน-ล่างของ plate            */
}
```

**สีแบรนด์ต้อง fix เสมอ ห้ามผูกกับ `prefers-color-scheme`** โลโก้ที่เปลี่ยนสีตาม
OS ของคนดูไม่ใช่โลโก้ — สิ่งที่เปลี่ยนตาม theme คือ *พื้นที่มันไปยืน* ไม่ใช่ตัวมัน

Semantic สำหรับ status glow (จาก Supasit.A standard): เขียว = Online ·
เหลือง = Offline · น้ำเงิน = Syncing — แยกจาก brand accent ไม่ปนกัน

---

## § 3 · ทางที่เร็วที่สุด — ใช้ไฟล์ที่ export ไว้แล้ว

ถ้าโปรเจกต์เข้าถึง repo `claude-config` ได้ ให้คัดลอกไฟล์ไปใช้เลย ไม่ต้อง generate ใหม่:

```
branding/exports/
├── d1-neon-arcade-{bare,glow,plate}.svg   ← light mode
├── d2-crt-night-{bare,glow,plate}.svg     ← night mode
├── d1-neon-arcade.png · d2-crt-night.png  ← นิ่ง สำหรับที่ที่ SVG ใช้ไม่ได้
└── d3-street-sticker.png                  ← icon system
```

แต่ละ SVG **self-contained และมี `<style>` ของตัวเอง** จึงกระพริบได้แม้โหลดผ่าน
`<img>` (script กับ external reference ไม่ทำงานใน image context แต่ CSS animation ทำงาน)

```markdown
<!-- README -->
![A(i)CODER](branding/exports/d2-crt-night-glow.svg)
```

```html
<!-- app header -->
<img src="/assets/aicoder-bare.svg" alt="A(i)CODER" height="40">
```

---

## § 4 · Generate ใหม่ด้วย renderer

ใช้เมื่อต้องการขนาด/สัดส่วนที่ไฟล์สำเร็จรูปไม่มี:

```js
import { mark, favicon } from "./references/renderer.mjs";
import { writeFileSync } from "node:fs";

// header ในแอป — โปร่งใส กระพริบได้
writeFileSync("logo.svg", mark({ mode: "night", ground: "bare", width: 640 }));

// OG image — ต้องมีกรอบ และต้องนิ่ง (crawler ไม่รอ animation)
writeFileSync("og.svg", mark({ mode: "night", ground: "plate", width: 1200, animated: false }));

// icon
writeFileSync("icon-512.svg", favicon({ size: 512 }));
writeFileSync("icon-16.svg",  favicon({ size: 16, letter: false }));
```

**`mark()` options:** `mode` `ground` `width` `height` (default `width/4`) `animated`
(default `true`) `inline` (ไม่ใส่ `<style>` ซ้ำเมื่อ paste ลงหน้าที่มี `NEON_CSS` แล้ว)
`tokens` (default `true` = แปลง `var(--sc-*)` เป็น hex)

**`favicon()` options:** `size` `letter` (ตัว `A` ใต้ paw — ปิดเมื่อ ≤ 32 px) `ground`

---

## § 5 · Recipe ต่องาน

| งาน | mode | ground | animated | หมายเหตุ |
|---|---|---|---|---|
| App header | ตามพื้น | `bare` | ✓ | สูง 32–48 px |
| Hero / landing | ตามพื้น | `glow` | ✓ | กว้าง ≥ 640 px |
| PWA splash | `night` | `bare` | ✓ | วางกลาง + แถบไตรรงค์เป็น loading |
| Favicon / PWA icon | — | — | ✗ | `favicon()` เท่านั้น |
| README banner | ตาม theme repo | `glow` | ✓ | ใช้ SVG สำเร็จรูป |
| OG / social card | `night` | `plate` | **✗** | crawler ไม่รอ animation ต้องใช้ PNG หรือ `animated:false` |
| Terminal / CLI | `night` | `bare` | ✓ | |
| งานพิมพ์ / เสื้อ | — | — | ✗ | ใช้ icon system แบน ไม่มี gradient/blur |

### ขนาดต่ำสุด

| แบบ | ต่ำสุด | เหตุผล |
|---|---|---|
| Lockup `light` | กว้าง 240 px | ต่ำกว่านี้ bloom กินรูในตัวอักษร |
| Lockup `night` | กว้าง 280 px | เหมือนกัน + scanline เริ่มไม่ resolve |
| Icon เต็ม | 120 px | |
| Icon paw อย่างเดียว | 16 px | แบน ไม่มี blur ให้เสีย |

**Clear space:** 2 pixel unit รอบด้าน สำหรับ lockup · 1 keyline สำหรับ icon
(1 pixel unit = `px` ที่ renderer ใช้ = ประมาณ `width × 0.58 ÷ 51`)

---

## § 6 · การกระพริบ

ถ้า paste SVG แบบ inline ลงหน้า ต้องใส่ `NEON_CSS` เข้าไปในหน้าครั้งเดียว:

```js
import { NEON_CSS } from "./references/renderer.mjs";
const s = document.createElement("style");
s.textContent = NEON_CSS;
document.head.appendChild(s);
```

แล้วเรียก `mark({ inline: true })` เพื่อไม่ให้มี `<style>` ซ้ำทุกก้อน

**กฎที่ห้ามแหก 3 ข้อ:**

1. **`filter` ต้องอยู่ element เดียวกับที่ animate `opacity`** — opacity composite
   *หลัง* filter ทำให้ Gaussian คำนวณครั้งเดียวแล้ว cache ถ้าเอา filter ไปครอบแล้ว
   animate opacity ของลูก จะ re-run blur ทุกเฟรม
2. **animation ที่ infinite ต้องอยู่ opacity เต็มที่ `0%`** — ตอน screenshot/export
   มันจะถูก cancel กลับไป base style ถ้า 0% เป็นตอนดับ ภาพที่ได้จะเป็นป้ายดับ
3. **`prefers-reduced-motion` ต้องดับ animation ทั้งหมดและทิ้งทุกหลอดไว้ที่สว่าง**
   ห้าม pause เพราะจะค้างกลางจังหวะดับ

**สิ่งที่ห้ามให้กระพริบ:** แถบไตรรงค์ — มันเป็นสีเคลือบ ไม่ใช่นีออน หน้าที่ของมันคือ
ยึดองค์ประกอบไว้ขณะที่ของอื่นกระพริบ (renderer จัดการให้แล้ว)

---

## § 7 · กฎที่ห้ามแหก

1. **Wordmark วาดจาก bitmap เท่านั้น ห้ามใช้ font แทน** — ไม่มีฟอนต์ตัวไหนตรง และ
   ถ้าใช้ฟอนต์จะได้ dependency + license มาฟรีๆ
2. **ห้าม uppercase ข้อความก่อน render** — `i` กับ `I` เป็นคนละ glyph (1 unit vs 5 unit)
   การ uppercase จะทำให้มาร์คกว้างกว่าที่ layout คำนวณไว้แล้วล้นทับของข้างๆ
3. **ห้ามวาง lockup เอง** — ใช้ `lockupGeometry()` เสมอ มันวัดถอยหลังจากขอบขวา
   ทำให้ไม่มีทางดันเนื้อหาตัวเองตกขอบไม่ว่าขนาดไหน
4. **ห้ามยืด/บีบ** — เปลี่ยน `width` แล้วให้ renderer คำนวณใหม่ ห้าม scale แบบไม่รักษาสัดส่วน
5. **ห้ามเปลี่ยนสีแบรนด์ตาม theme** (ดู §2)
6. **paw ต้องมาคู่กับ wordmark เสมอในงานเป็นทางการ** — ยกเว้น icon ≤ 32 px
   ที่ใช้ paw เดี่ยวได้
7. **เปลี่ยนชื่อแบรนด์ = แก้ `WORDMARK` / `HEAD` / `TAIL` / `INITIAL` ที่หัวไฟล์ renderer
   เท่านั้น** `HEAD + TAIL` ต้องต่อกลับเป็น `WORDMARK` ได้พอดี

---

## § 8 · เรื่องที่ยังค้าง — วงเล็บ

`A(i)CODER` มาจาก `A` (ชื่อเล่นพี่ A) + `(i)` ที่ทำให้อ่านเป็น *AI* ได้ด้วย
**หนูแนะนำให้ตัดวงเล็บออกเหลือ `AICODER` แล้วให้ `I` เป็นสีชมพูแทน** — ได้การอ่าน
สองชั้นเหมือนกันแต่มาจากสี:

| | `A(i)CODER` | `AICODER` เน้นสี `I` |
|---|---|---|
| อ่านได้ 2 ชั้น | ได้ | ได้ |
| พิมพ์เป็น handle/npm/domain ได้ | ✗ | ✓ |
| รอดใน URL | ✗ `%28` `%29` | ✓ |
| อ่านออกที่ 16 px | ✗ วงเล็บตัน | ✓ |

**ถ้าพี่ A ตัดสินใจเปลี่ยน:** แก้ `WORDMARK = "AICODER"`, `HEAD = "AI"` ที่
`references/renderer.mjs` และ `branding/src/mockups.template.html` แล้วรัน
`node branding/tools/build.mjs && node branding/tools/verify.mjs`

**ต้นทุนของการเปลี่ยนชื่อที่ต้องรู้:** ชื่อเดิม `SOI` = ซอย คือสิ่งที่ผูก paw เข้ากับชื่อ
(หมาซอย + coder อยู่ที่อยู่เดียวกัน) ตอนนี้ link นั้นหายไปแล้ว paw ยังจริงอยู่เพราะ
พี่ A ดูแลหมาจรจัดจริง แต่กลายเป็นข้อเท็จจริงเรื่องตัวบุคคล ไม่ใช่ตัวอักษรในชื่อ
ถ้าจะเลิกใช้ paw ในอนาคต นี่คือเหตุผลที่จะใช้อ้างได้

---

## § 9 · หลังแก้อะไรก็ตาม

```bash
node branding/tools/build.mjs     # HTML + 3 PNG + 6 SVG
node branding/tools/verify.mjs    # ต้องขึ้น "all checks passed"
```

`verify.mjs` มี check ที่ rasterise `references/renderer.mjs` เทียบพิกเซลกับ
`branding/exports/` — **ถ้าแก้ที่เดียวแล้วไม่แก้อีกที่ มันจะจับได้ทันที**

## Reference Library

| ไฟล์ | โหลดเมื่อ |
|---|---|
| `references/renderer.mjs` | ต้อง generate มาร์คในขนาดที่ไฟล์สำเร็จรูปไม่มี หรือจะแก้ตัวโลโก้เอง |
| `branding/README.md` (ใน repo) | ต้องรู้เหตุผลเบื้องหลัง — glyph grid, ground, flicker, กติกาชื่อ |
| `branding/aicoder-mockups.html` | อยากดูภาพเทียบทุกแบบในหน้าเดียว |
