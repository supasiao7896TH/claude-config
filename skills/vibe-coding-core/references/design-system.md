# Design System Reference — "Instrument Grade"

> ส่วนหนึ่งของ `vibe-coding-core` — โหลดไฟล์นี้เมื่อเขียน CSS หรือออกแบบ UI
> อัปเดต 2569-08-27: มาตรฐานถาวรของ Supasit.A — **แทนที่ "Tactile Plant UI" เดิมทั้งหมด**
> ที่มา: พี่ A review ระบบเดิมแล้วพบว่า (1) ดูซ้ำกันทุกแอป (2) อ่านยาก contrast ต่ำ
> (3) บนมือถือยังไม่ดีพอ (4) ยังไม่มีเอกลักษณ์ที่บ่งบอกตัวตน — จึงรื้อใหม่ทั้งหมด
> โดยยึดตัวตนจริง: **วิศวกรกระบวนการที่ตัดสินใจจากตัวเลข**
> Reference implementation: artifact "Instrument Grade" (สร้าง 2569-08-27)

---

## IG-0 · แนวคิด (อ่านก่อนใช้ token อื่น)

```
"อ่านค่าได้แม่นเหมือนเครื่องมือวัด" — UI ที่หน้าที่หลักคือทำให้ตัวเลขและสถานะ
อ่านถูกต้องในครั้งเดียว ไม่ใช่ทำให้หน้าจอสวย

4 กติกาที่เป็นเอกลักษณ์ (ทุกข้อแก้ปัญหาที่พี่ A ระบุเองตรงๆ):
  IG-01  ตัวเลขทุกตัวเป็น tabular monospace       → ลายเซ็นของแบรนด์
  IG-02  การ์ดมีแถบ tag บอกที่มาของข้อมูล          → ยืมจากป้ายอุปกรณ์หน้างานจริง
  IG-03  ขอบเส้นคมแทนเงานูน แต่ปุ่มยังกดแล้วยุบ    → เก็บ tactile ไว้ที่จังหวะกด
  IG-04  สีบอก "สถานะ" ไม่ใช่ "หมวดหมู่"           → เห็นสีแล้วรู้ว่าต้องทำอะไร

⚠️ ห้ามใช้ indigo/purple + gradient-text — เป็นสูตรที่ Gemini/Google AI Studio ใช้บ่อยที่สุด
   ทำให้แอปดูเหมือนคนอื่นทำ (บทเรียนจริงจาก Log-EQ-history)

⚠️ ห้ามใช้ neumorphism (เงานูน-บุ๋มสองทิศ) อีก — เป็นต้นเหตุของ contrast ต่ำในระบบเดิม
   ความรู้สึก "จับต้องได้" ย้ายไปอยู่ที่ press effect ของปุ่มแทน (ดู IG-6)

⚠️ ห้ามใช้ gradient-text — ตัดออกจากระบบใหม่ทั้งหมด ความหรูมาจาก
   ความลึกของสีและ typography ไม่ใช่จาก gradient
```

---

## IG-1 · Spacing — 4pt Grid

```
ค่าที่อนุญาต: 4 · 6 · 8 · 10 · 12 · 14 · 16 · 20 · 24 · 32 · 44 · 64px
Page padding : 16px (mobile) · 24px (tablet) · 24-32px (desktop)
Card padding : 16px (compact) · 20px (default) · 24px (spacious)
Section gap  : 48px (mobile) · 64px (desktop)
Grid gap     : 12px (mobile) · 14-16px (desktop)

หมายเหตุ: ระบบเดิมใช้ 8pt grid แต่ Instrument Grade ต้องการค่ากลาง (6/10/14)
เพราะขอบ 1px + padding เล็กทำให้การ์ดอยู่ชิดกันได้โดยไม่อึดอัด (แก้ปัญหามือถือ)
```

## IG-2 · Typography — IBM Plex

```
ตระกูลฟอนต์ (บังคับ — แทนที่ Noto Sans Thai เดิม):
  UI/Body : "IBM Plex Sans Thai", "Noto Sans Thai", system-ui, sans-serif
  Data    : "IBM Plex Mono", ui-monospace, Menlo, monospace

เหตุผลที่เลือก IBM Plex (ไม่ใช่แค่ความชอบ):
  - เป็นตระกูลเดียวที่มีทั้ง Thai และ Mono ที่วาดด้วยหลักการเดียวกัน ตัวเลขกับตัวหนังสือจึงเข้ากัน
  - ออกแบบมาเพื่อ "man and machine" ตรงกับตัวตน A(i)CODER และงานวิศวกรรม
  - ไม่ใช่ Noto Sans Thai ที่เว็บไทยเกือบทุกเว็บใช้ → แก้ปัญหา "ดูซ้ำๆ" ที่ต้นเหตุ

โหลดผ่าน Google Fonts (CSP ต้อง allow fonts.googleapis.com + fonts.gstatic.com):
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap">

Scale:
  display : clamp(34px, 5.2vw, 56px) / 600 / letter-spacing -.02em / line-height 1.12
  h2      : clamp(22px, 3vw, 30px)   / 600 / letter-spacing -.015em
  h3      : 22px / 600
  body    : 15.5-17px / 400 / line-height 1.65
  lede    : 17px / 300 (น้ำหนักบางกว่า body — สร้างความหรูโดยไม่ต้องใช้สี)
  caption : 13px / 400 / var(--ink-mid)
  label   : 11px / 500 / Mono / letter-spacing .12-.18em / UPPERCASE
  data    : Mono / 500 / font-variant-numeric: tabular-nums

RULES (บังคับ):
  ✓ ตัวเลข/เงิน/วันที่/รหัส/หน่วยวัด ต้องใช้ --font-data + tabular-nums เสมอ (IG-01)
  ✓ heading ทุกตัวใส่ text-wrap: balance
  ✓ ข้อความยาวจำกัดความกว้าง max-width: 62ch
  ✗ ห้ามใช้ font-weight 800/900 (หนาเกินไป ขัดกับ "เรียบหรู")
```

## IG-3 · Border Radius — คมกว่าเดิมมาก

```
--r-sm:  4px  (ปุ่มเล็ก · chip · badge)
--r-md:  6px  (ปุ่ม · input · การ์ดย่อย)
--r-lg: 10px  (การ์ดหลัก · modal · frame)
pill  : 999px (เฉพาะ status pill เท่านั้น)

เหตุผล: ระบบเดิมใช้ 10/12/20px ซึ่งมนเกินจนดูเป็น consumer app
ค่าใหม่คมขึ้นเพื่อให้ดูเป็นเครื่องมือมืออาชีพ — ห้ามใช้ rounded-2xl/3xl
```

## IG-4 · Color System (ห้าม hardcode hex นอกเหนือจากนี้)

**Light (ค่าเริ่มต้น — พี่ A เลือก Light-first)**
```
--ground:       #F7F8F7   พื้นหน้า (neutral เอียงเขียวเล็กน้อย ไม่ใช่เทาเปล่า)
--surface:      #FFFFFF   พื้นการ์ด — ต้องต่างจาก --ground เสมอ (แก้ปัญหาหลักของระบบเดิม)
--surface-sunk: #EFF2F1   พื้นที่บุ๋ม (input · table head)
--line:         #D8DEDC   เส้นขอบปกติ
--line-strong:  #B6C0BD   เส้นขอบเน้น · hover

--ink:          #16211F   ตัวหนังสือหลัก (near-black เอียง teal)
--ink-mid:      #4A5754   ตัวหนังสือรอง
--ink-soft:     #788481   caption · label

--teal-deep:    #0B4F4A   หัวเรื่อง · ปุ่มหลัก (เข้มกว่า #0d9488 เดิมมาก = หรูขึ้น)
--teal-signal:  #12857C   สถานะกดได้ · focus ring
--teal-wash:    #E6EFED   พื้นอ่อนของ teal
--brass:        #8A6D28   ข้อมูลอ้างอิง · eyebrow (ทองเหลืองเกจวัด — คู่ตัดของ teal)
--brass-wash:   #F3EEE0

--ok:    #2F7D4F  --ok-wash:   #E7F1EB   อยู่ในเกณฑ์
--warn:  #9A6410  --warn-wash: #F6EEDF   ต้องเฝ้าระวัง
--crit:  #A93226  --crit-wash: #F7E9E7   ต้องแก้ทันที

--press: rgba(11,79,74,.13)
--shadow: 0 1px 2px rgba(22,33,31,.05), 0 4px 14px rgba(22,33,31,.045)
```

**Dark (ออกแบบแยก ไม่ใช่ invert — พี่ A บังคับว่าต้องสวยเท่ากัน)**
```
--ground:       #0D1414
--surface:      #141D1C   สว่างกว่า ground (ตรงข้ามกับ light ที่ surface สว่างกว่าเช่นกัน)
--surface-sunk: #0A1010   มืดกว่า ground
--line:         #26332F
--line-strong:  #3A4A45

--ink:          #E4EAE8
--ink-mid:      #A3B0AC
--ink-soft:     #71807B

--teal-deep:    #4FC7BC   ← สว่างขึ้นเพื่อให้อ่านออกบนพื้นมืด (ไม่ใช่สีเดิม)
--teal-signal:  #35B3A7
--teal-wash:    #102624
--brass:        #D6B76A
--brass-wash:   #241E10

--ok:    #58BC82  --ok-wash:   #12241A
--warn:  #D9A441  --warn-wash: #241B0C
--crit:  #E2705F  --crit-wash: #2A1512

--press: rgba(79,199,188,.16)
--shadow: 0 1px 2px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.3)
```

**กติกาการใช้สี (IG-04):**
```
teal   = สิ่งที่กดได้ / สิ่งที่เป็น interactive
brass  = ข้อมูลอ้างอิง / eyebrow / metadata (ไม่ใช่สิ่งที่กดได้)
ok/warn/crit = สถานะเท่านั้น — ห้ามเอาไปใช้แยกหมวดหมู่ข้อมูล

❌ ผิด: การ์ด "รายรับ"=ฟ้า "ค่าใช้จ่าย"=เหลือง "กำไร"=เขียว  (สีบอกหมวดหมู่ — ระบบเดิมทำแบบนี้)
✅ ถูก: การ์ดทุกใบพื้นเดียวกัน แล้วใช้ ok/warn/crit บอกว่าค่านั้น "ปกติ/ต้องเฝ้า/ต้องแก้"
```

## IG-5 · Surface — การ์ดขอบคม (แทน .tactile เดิมทั้งหมด)

```css
.card {
  background: var(--surface);          /* ต่างจาก --ground เสมอ = อ่านออกโดยไม่ต้องพึ่งเส้นสี */
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 20px;
  transition: border-color .18s ease, box-shadow .18s ease;
}
.card:hover {
  border-color: var(--line-strong);
  box-shadow: var(--shadow);
}

/* IG-02 · แถบ tag บอกที่มาของข้อมูล — ยืมจากป้ายอุปกรณ์หน้างาน (FI-2104 / TI-3312) */
.tag-strip {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-data); font-size: 10.5px; font-weight: 500;
  letter-spacing: .12em; text-transform: uppercase;
  padding-bottom: 12px; margin-bottom: 14px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-soft);
}
.tag-strip .dot { width: 6px; height: 6px; border-radius: 50%; flex: none; }
.tag-strip .id { color: var(--ink-mid); }
.tag-strip .right { margin-left: auto; }
```

> **`.tag-strip` เป็น "ทางเลือก" ไม่ใช่ "บังคับ"** — ใช้เมื่อข้อมูลในการ์ดมีแหล่งที่มาจริงที่ระบุได้
> (tag อุปกรณ์, รหัสรายการ, ชื่อ sensor, เลขที่เอกสาร) สำหรับแอปที่ข้อมูลไม่มีรหัสกำกับ
> เช่น แอปส่วนตัว/แอปการเงิน ให้ใช้แค่หัวข้อธรรมดาแทน — อย่ายัดเยียดรหัสปลอมเข้าไป

## IG-6 · Tactile — ความรู้สึกจับต้องได้อยู่ที่ "จังหวะกด"

```css
.btn {
  font-family: var(--font-ui); font-size: 14px; font-weight: 500;
  padding: 10px 18px; border-radius: var(--r-md); cursor: pointer;
  border: 1px solid transparent; transition: all .14s ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn:focus-visible { outline: 2px solid var(--teal-signal); outline-offset: 2px; }

.btn-primary { background: var(--teal-deep); color: var(--ground); border-color: var(--teal-deep); }
.btn-primary:hover  { background: var(--teal-signal); border-color: var(--teal-signal); }
.btn-primary:active { transform: translateY(1px); box-shadow: inset 0 2px 5px rgba(0,0,0,.22); }

.btn-ghost { background: var(--surface); color: var(--ink); border-color: var(--line-strong); }
.btn-ghost:hover  { border-color: var(--teal-signal); color: var(--teal-deep); }
.btn-ghost:active { transform: translateY(1px); background: var(--surface-sunk); box-shadow: inset 0 2px 5px var(--press); }

.btn-brass { background: var(--brass-wash); color: var(--brass); border-color: color-mix(in srgb, var(--brass) 40%, transparent); }
.btn-brass:hover  { border-color: var(--brass); }
.btn-brass:active { transform: translateY(1px); box-shadow: inset 0 2px 5px rgba(0,0,0,.14); }

.btn-danger { background: var(--crit-wash); color: var(--crit); border-color: color-mix(in srgb, var(--crit) 35%, transparent); }
.btn-danger:hover  { border-color: var(--crit); }
.btn-danger:active { transform: translateY(1px); box-shadow: inset 0 2px 5px rgba(0,0,0,.14); }

/* input · บุ๋มลงในพื้นผิวจริง (นี่คือที่เดียวที่ยังใช้ inset shadow) */
.field input, .field select {
  width: 100%; font-family: var(--font-ui); font-size: 15px; color: var(--ink);
  background: var(--surface-sunk);
  border: 1px solid var(--line); border-radius: var(--r-md);
  padding: 10px 12px;
  box-shadow: inset 0 1px 3px var(--press);
  transition: border-color .15s, box-shadow .15s;
}
.field input.num { font-family: var(--font-data); font-variant-numeric: tabular-nums; }  /* IG-01 */
.field input:focus, .field select:focus {
  outline: none; border-color: var(--teal-signal);
  box-shadow: inset 0 1px 3px var(--press), 0 0 0 3px var(--teal-wash);
}
```

## IG-7 · Data Display — หัวใจของระบบ (IG-01)

```css
/* KPI tile */
.kpi .val {
  font-family: var(--font-data); font-variant-numeric: tabular-nums;
  font-size: 32px; font-weight: 500; letter-spacing: -.02em; line-height: 1.15;
}
.kpi .unit  { font-size: 14px; color: var(--ink-soft); font-weight: 400; margin-left: 4px; }
.kpi .label { font-size: 13px; color: var(--ink-mid); margin-top: 6px; }

/* ตาราง — ตัวเลขชิดขวา + tabular = จุดทศนิยมตรงกันทุกแถว */
.tbl-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: var(--r-lg); background: var(--surface); }
table { border-collapse: collapse; width: 100%; min-width: 560px; }
thead th {
  font-family: var(--font-data); font-size: 10.5px; font-weight: 500;
  letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft);
  text-align: left; padding: 12px 16px;
  background: var(--surface-sunk); border-bottom: 1px solid var(--line); white-space: nowrap;
}
tbody td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid var(--line); }
tbody tr:last-child td { border-bottom: 0; }
tbody tr:hover td { background: var(--surface-sunk); }
td.num {
  font-family: var(--font-data); font-variant-numeric: tabular-nums;
  text-align: right; font-size: 14px;
}

/* status pill — ใช้ ok/warn/crit เท่านั้น (IG-04) */
.pill {
  font-family: var(--font-data); font-size: 10.5px; font-weight: 500;
  letter-spacing: .08em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 999px; border: 1px solid; white-space: nowrap;
}
.p-ok   { color: var(--ok);   background: var(--ok-wash);   border-color: color-mix(in srgb, var(--ok) 30%, transparent); }
.p-warn { color: var(--warn); background: var(--warn-wash); border-color: color-mix(in srgb, var(--warn) 30%, transparent); }
.p-crit { color: var(--crit); background: var(--crit-wash); border-color: color-mix(in srgb, var(--crit) 30%, transparent); }
```

> **บังคับ:** ทุกที่ที่มีตัวเลขเรียงกันในแนวตั้ง (ตาราง · รายการ · KPI ที่วางข้างกัน)
> ต้องใส่ `font-variant-numeric: tabular-nums` เสมอ — นี่คือเอกลักษณ์ของแบรนด์

## IG-8 · Dark / Light Mode — ต้องรองรับ 3 สถานะ

```css
/* 1) LIGHT ชุดเต็ม อยู่บน :root เปล่า (ครอบคลุมกรณีเครื่องไม่ stamp อะไรเลย) */
:root { --ground: #F7F8F7; /* ...ชุดเต็มตาม IG-4 light... */ }

/* 2) DARK ตามระบบเครื่อง — guard ด้วย :not([data-theme="light"]) เพื่อให้ผู้ใช้ override ได้ */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --ground: #0D1414; /* ...ชุดเต็มตาม IG-4 dark... */ }
}

/* 3) DARK ที่ผู้ใช้เลือกเอง — ต้องชนะ prefers-color-scheme: light */
:root[data-theme="dark"] { --ground: #0D1414; /* ...ชุดเต็มตาม IG-4 dark... */ }
```

```
⚠️ กติกาบังคับ (ไม่ทำ = แอปพังในบางเครื่อง):
  ✓ body ต้องมี background: var(--ground) เสมอ — พื้นโปร่งใสจะยืมสีพื้นของ host
  ✓ ทุกสีต้องมาจาก token — ห้ามประกาศสีไว้ใน @media หรือ [data-theme] เท่านั้น
  ✓ เปลี่ยนจาก class strategy (.dark) เดิม → data-theme attribute
    เพราะรองรับ 3 สถานะได้ (light / dark / ตามระบบ) ส่วน .dark รองรับได้แค่ 2

JS toggle (เก็บค่าที่เลือกไว้):
  var root = document.documentElement;
  function current() {
    var s = root.getAttribute('data-theme');
    if (s) return s;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  // สลับ: root.setAttribute('data-theme', current() === 'dark' ? 'light' : 'dark')
  // อ่าน/เขียน localStorage ต้องอยู่ใน try/catch เสมอ (private window โยน error ได้)
```

## IG-9 · Motion — น้อยแต่มีเหตุผล

```css
/* อนุญาตเฉพาะ 3 อย่างนี้ */
@keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.animate-fade-in  { animation: fadeIn .3s ease-out forwards; }
.animate-slide-up { animation: slideUp .3s ease-out forwards; }
/* + press effect ของปุ่ม (IG-6) และ hover ของการ์ด (IG-5) */

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

```
❌ ตัดออกจากระบบใหม่ (เคยมีใน Tactile Plant UI):
   .breathing (ปุ่มเต้น)  ·  .pulse-dot (จุดกะพริบ)  ·  .gradient-text
   เหตุผล: ขัดกับ "เรียบหรู มืออาชีพ" ที่พี่ A เลือก และเป็นสัญญาณของ UI ที่พยายามเรียกร้องความสนใจ
   ถ้าต้องบอกว่า "เร่งด่วน" ให้ใช้สี crit + pill ก็พอแล้ว
```

## IG-10 · Icons — Lucide (คงเดิม)

```
ใช้ Lucide icon set เสมอ (ไม่ใช่ emoji) — vendor ไฟล์ไว้ที่ public/vendor/lucide.js
ติดตั้ง: npm install lucide → copy node_modules/lucide/dist/umd/lucide.min.js → public/vendor/lucide.js
ใช้: <i data-lucide="ชื่อไอคอน"></i> แล้วเรียก lucide.createIcons() ทุกครั้งหลัง innerHTML เปลี่ยน
ขนาดมาตรฐาน: 16px (ในปุ่ม/label) · 20px (nav) · stroke-width 1.75 (บางกว่า default = เรียบหรูขึ้น)
```

## IG-11 · PWA — บังคับทุกแอป (คงเดิม)

```
ทุกแอปต้องมี: public/manifest.json (name, icons, theme_color = --ground ของ light mode),
public/sw.js (cache-first สำหรับ app shell), <link rel="manifest">,
<meta name="theme-color" content="#F7F8F7"> + media dark variant "#0D1414",
apple-mobile-web-app-capable meta
```

## IG-12 · Chart — Chart.js (ปรับสีตามระบบใหม่)

```
ใช้ Chart.js เมื่อต้องแสดงข้อมูลย้อนหลัง/แนวโน้ม — vendor ไว้ที่ public/vendor/chart.js
สีเส้น/แท่ง: teal-deep เป็นเส้นหลัก, brass เป็นเส้นเปรียบเทียบ, ok/warn/crit สำหรับเส้นขีดจำกัด
ฟอนต์แกน: --font-data ขนาด 11px สี --ink-soft (ตัวเลขบนแกนต้องเป็น mono ตาม IG-01)
grid line: var(--line) เท่านั้น — จางกว่านี้จะอ่านไม่ออกบน dark mode
ต้องเก็บ Chart instance ไว้ใน state แล้วเรียก .destroy() ก่อนสร้างใหม่ทุกครั้งที่ re-render
```

---

## Migration — แอปเดิมที่ใช้ Tactile Plant UI

| ของเดิม | เปลี่ยนเป็น |
|---|---|
| `.tactile` (เงานูน) | `.card` (ขอบ 1px + surface ต่างจาก ground) |
| `.tactile-sm` | `.card` padding 16px |
| `.tactile-inset` | `.field input` (ยังใช้ inset shadow ได้) |
| `.tactile-btn` | `.btn-ghost` |
| `border-t-4` สีตามหมวดหมู่ | `.tag-strip` + `.pill` สถานะ (IG-02/IG-04) |
| `.gradient-text` | ตัดออก — ใช้ `color: var(--teal-deep)` แทน |
| `.breathing` / `.pulse-dot` | ตัดออกทั้งหมด |
| `--bg-card` = `--bg-page` | `--surface` ≠ `--ground` (สำคัญที่สุด) |
| Noto Sans Thai | IBM Plex Sans Thai + IBM Plex Mono |
| `.dark` class | `[data-theme="dark"]` attribute |

> ไม่บังคับให้ย้ายแอปเก่าทันที — ย้ายเมื่อแอปนั้นถูกแก้ครั้งใหญ่อยู่แล้ว
> แต่**แอปใหม่ทุกตัวต้องใช้ Instrument Grade เท่านั้น**
