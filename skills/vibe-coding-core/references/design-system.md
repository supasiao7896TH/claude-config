# Design System Reference — "Tactile Plant UI"

> ส่วนหนึ่งของ `vibe-coding-core` — โหลดไฟล์นี้เมื่อเขียน CSS หรือออกแบบ UI
> อัปเดต 2569-08-13: มาตรฐานถาวรของ Supasit.A — สังเคราะห์จาก pattern ที่พี่ A เลือกเองซ้ำ
> โดยไม่ได้ตั้งใจใน 2 แอปจริงที่ทำมาก่อน (`Monitor-log-sheet-boardman`, `Log-EQ-history`) ไม่ใช่เทรนด์ดีไซน์ทั่วไป
> ยืนยันแล้วผ่านการสร้างจริง+ทดสอบใน `condo-rental-app` (ดู `src/style.css` เป็น reference implementation ที่ใช้งานได้จริง)

---

## DS-0 · แนวคิด (อ่านก่อนใช้ token อื่น)

```
"จับต้องได้" (Tactile) — ปุ่ม/การ์ดนูน-บุ๋มออกจากพื้นผิวจริง (neumorphism) ไม่ใช่ flat design
ผสมกับสีตามความหมายหลากหลาย (ไม่ใช่สีแบรนด์เดียวย้อมทั้งแอป) — แก้จุดอ่อน contrast ต่ำของ
neumorphism ล้วนๆ ด้วยเส้นขอบบนสี (border-t-4) ตามความหมายของแต่ละการ์ด

⚠️ ห้ามใช้ indigo/purple เป็นสีหลัก + gradient-text สีนี้ — เป็นสูตรที่ Gemini/Google AI Studio
   ใช้บ่อยที่สุดเวลาทำแดชบอร์ด ทำให้แอปดูเหมือนคนอื่นทำ (บทเรียนจริงจากการรีวิว Log-EQ-history
   ที่ footer เขียนไว้เองว่า "Code Architect (Gemini)") — ใช้ teal/cyan แทนเสมอ (สีที่พี่ A
   เลือกเองซ้ำ 2 ครั้งคนละแอป โดยไม่ได้ตั้งใจให้ซ้ำ)
```

## DS-1 · Spacing — 8pt Grid
```
ค่าที่อนุญาต: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64px
Page padding : 16px (mobile) · 24px (tablet) · 32px (desktop)
Card padding : 16px (compact) · 20px (default) · 24px (spacious)
```

## DS-2 · Typography Scale
```
display : clamp(28px, 4vw, 40px) / 800 / Noto Sans Thai + .gradient-text (teal→cyan)
          → ใช้ครั้งเดียวต่อหน้า (hero/ชื่อแอป) เท่านั้น — ไม่ใช่ตกแต่งทุก heading
h1/h2   : Noto Sans Thai / 700 (font-bold)
body    : Noto Sans Thai / 400
caption : Noto Sans Thai / 400 / text-xs

RULES: ✓ ตัวเลข/เงิน/วันที่ ใช้ font ปกติได้ (ไม่บังคับ mono แบบ Control Room เดิม — ทดลองแล้วไม่จำเป็น)
       ✓ Font มาตรฐาน: Noto Sans Thai (ตาม USER.md) — ไม่ใช่ Sarabun/Inter แม้แอปต้นแบบบางตัวจะใช้ตัวอื่น
```

## DS-3 · Border Radius
```
--r-sm: 10px (ปุ่ม/inset) · --r-md: 12px (การ์ดย่อย) · --r-lg: 20px (การ์ดหลัก/modal) · --r-full: 9999px (badge/pill)
```

## DS-4 · Color System (ห้าม Hardcode Hex นอกเหนือจากนี้)
```
SURFACE (ค่าเดียวกันทั้งคู่ — จำเป็นสำหรับภาพลวงตา neumorphism ที่ให้การ์ด "นูน" จากพื้น):
  --bg-page : light #eef2f9 / dark #131b2c
  --bg-card : light #eef2f9 / dark #131b2c   (เท่ากับ --bg-page เสมอ)

TEXT:
  --text-primary   : light #334155 / dark #e2e8f0
  --text-secondary : light #64748b / dark #94a3b8
  --text-tertiary  : light #94a3b8 / dark #64748b

NEUMORPHIC SHADOW PAIR (คู่เงาที่ทำให้ "นูน"/"บุ๋ม" — ต้องมีทั้งสว่างและมืดเสมอ):
  --shadow-light : light #ffffff / dark #1c2740
  --shadow-dark  : light #d1d9e6 / dark #0a0f1a

BRAND (แทนที่ indigo/purple/teal-แบบเดิมทั้งหมด — ดู DS-0):
  brand-teal : #0d9488 (600) / #14b8a6 (500)
  brand-cyan : #0891b2 (600) / #06b6d4 (500)   → คู่กับ teal ใน .gradient-text เสมอ

SEMANTIC (ใช้กับ border-t-4 ของการ์ด + ไอคอนชิป — สีต่างกันตามความหมายจริง ไม่ใช่สีเดียวทั้งแอป):
  blue-500/600, purple-500/600, amber-500/600, red-500/600, emerald-500/600
  → เลือกสีตามหมวดหมู่ข้อมูลจริง (เช่น รายรับ=blue, ผ่อน=purple, ค่าใช้จ่าย=amber, กำไร=teal/red)
```

## DS-5 · Tactile Surfaces (Neumorphism — แทนที่ Glass/Panel เดิมทั้งหมด)
```css
/* การ์ดหลัก — นูนออกจากพื้นผิว */
.tactile {
  background: var(--bg-card);
  border-radius: var(--r-lg, 20px);
  box-shadow: 8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light);
  transition: box-shadow .25s ease, transform .25s ease;
}
.tactile:hover {
  box-shadow: 4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light);
}

/* การ์ดย่อย/แถวรายการ — นูนเบากว่า */
.tactile-sm {
  background: var(--bg-card);
  border-radius: var(--r-md, 12px);
  box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
}

/* ช่อง input/select — บุ๋มเข้าไปในพื้นผิว */
.tactile-inset {
  background: var(--bg-card);
  border-radius: var(--r-md, 12px);
  box-shadow: inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light);
}

/* ปุ่มกดได้จริง — นูนตอนปกติ, บุ๋มตอนกด */
.tactile-btn {
  background: var(--bg-card);
  border-radius: var(--r-sm, 10px);
  box-shadow: 5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light);
  transition: box-shadow .15s ease;
}
.tactile-btn:hover  { box-shadow: 3px 3px 6px var(--shadow-dark), -3px -3px 6px var(--shadow-light); }
.tactile-btn:active { box-shadow: inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light); }
```

> **กติกาบังคับ:** การ์ดที่แสดงข้อมูลตามหมวดหมู่ (เช่น KPI tile) ต้องมี `border-t-4` สีตามความหมาย
> (DS-4 SEMANTIC) เสมอคู่กับ `.tactile` — ถ้าใช้ `.tactile` เปล่าๆ ไม่มีสีกำกับ จะอ่านยากเพราะพื้น
> การ์ดกับพื้นหน้าสีเดียวกัน (จุดอ่อนที่รู้แล้วของ neumorphism ล้วนๆ)

## DS-6 · Motion — บังคับใช้เฉพาะจุดที่มีความหมายจริง (ห้ามใช้ตกแต่งเฉยๆ)
```css
.gradient-text {
  background-image: linear-gradient(to right, #0d9488, #0891b2);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

@keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.breathing { animation: breathe 4s ease-in-out infinite; }
/* ใช้กับปุ่ม floating action หลักของหน้าเท่านั้น (เช่น "+" เพิ่มรายการ) — ไม่ใช่ทุกปุ่ม */

@keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(244,63,94,.4); } 70% { box-shadow: 0 0 0 5px rgba(244,63,94,0); } }
.pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
/* ใช้เฉพาะสถานะ "เร่งด่วนจริง" (เช่น เลยกำหนดชำระ) — ห้ามใช้เป็นของตกแต่ง */

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn .3s ease-out forwards; }
.animate-slide-up { animation: slideUp .3s ease-out forwards; }
```

## DS-7 · Dark / Light Mode
```css
/* ใช้ class strategy (.dark บน <html>) ให้ตรงกับ Tailwind CDN config — ไม่ใช่ [data-theme] attribute
   ตั้งค่า tailwind.config = { darkMode: 'class' } ผ่านไฟล์ .js แยก (ห้าม inline เพราะโดน CSP บล็อก) */
:root {
  --bg-page: #eef2f9; --bg-card: #eef2f9;
  --text-primary: #334155; --text-secondary: #64748b; --text-tertiary: #94a3b8;
  --shadow-light: #ffffff; --shadow-dark: #d1d9e6;
}
.dark {
  --bg-page: #131b2c; --bg-card: #131b2c;
  --text-primary: #e2e8f0; --text-secondary: #94a3b8; --text-tertiary: #64748b;
  --shadow-light: #1c2740; --shadow-dark: #0a0f1a;
}
```

## DS-8 · Icons — Lucide (บังคับ แทน emoji)
```
ใช้ Lucide icon set เสมอ (ไม่ใช่ emoji) — vendor ไฟล์ไว้ในเครื่องที่ public/vendor/lucide.js
(ไม่ใช้ CDN — CSP-friendly + offline-first ตรงกับแอปจริงทั้ง 2 ตัวของพี่ A)
วิธีติดตั้ง: npm install lucide → copy node_modules/lucide/dist/umd/lucide.min.js → public/vendor/lucide.js
วิธีใช้: <i data-lucide="ชื่อไอคอน"></i> แล้วเรียก lucide.createIcons() ทุกครั้งหลัง innerHTML เปลี่ยน
```

## DS-9 · PWA — บังคับทุกแอป (ใหม่)
```
ทุกแอปต้องมี: public/manifest.json (name, icons, theme_color ตรงกับ --bg-page),
public/sw.js (cache-first สำหรับ app shell), <link rel="manifest">,
<meta name="theme-color">, apple-mobile-web-app-capable meta — ให้ติดตั้งเป็นแอปบนมือถือได้
รายละเอียดเต็ม: ดู `Log-EQ-history` และ `Monitor-log-sheet-boardman` เป็นตัวอย่างจริงที่ใช้งานได้
```

## DS-10 · Chart — Chart.js เมื่อแอปต้องแสดงแนวโน้ม/ประวัติ
```
ใช้ Chart.js เสมอเมื่อต้องแสดงข้อมูลย้อนหลัง/แนวโน้ม — vendor ไฟล์ไว้ในเครื่องแบบเดียวกับ Lucide
(public/vendor/chart.js) สีกราฟใช้ตาม DS-4 SEMANTIC ให้ตรงกับความหมายของแต่ละเส้น/แท่ง
ต้องเก็บ Chart instance ไว้ใน state แล้วเรียก .destroy() ก่อนสร้างใหม่ทุกครั้งที่ re-render
(กัน memory leak จาก canvas ที่ถูกแทนที่ผ่าน innerHTML)
```
