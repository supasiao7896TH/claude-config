# ไฟล์ตั้งต้น — Supasit.A Studio

ก๊อปโฟลเดอร์นี้ทั้งอัน แล้วเริ่มแอปใหม่ได้ทันที **ไม่ต้องให้ AI สร้าง token/โครงใหม่ทุกครั้ง**
ซึ่งเป็นสาเหตุที่ทำให้แต่ละแอปหน้าตาไม่ตรงกันมาตลอด

## เริ่มโปรเจกต์ใหม่ 5 ขั้นตอน

1. `cp -r design-lab/starter <ชื่อโปรเจกต์ใหม่>`
2. แก้ชื่อแอป 4 จุด: `<title>` · `.app-name` · `APP_CONFIG.APP_NAME` · `manifest.webmanifest`
3. แก้ `APP_CONFIG.DB_NAME` + `STORES` ให้ตรงกับข้อมูลของแอปนี้
4. ลบข้อมูลตัวอย่างใน `APP_CORE.init()` แล้วต่อกับ `STORAGE_ENGINE` ของจริง
5. bump `CACHE_NAME` ใน `sw.js` ทุกครั้งที่แก้ไฟล์ (ไม่งั้นเครื่องที่เคยเปิดจะเห็นของเก่า)

## มีอะไรมาให้แล้ว

| ไฟล์ | เนื้อหา |
|---|---|
| `index.html` | token Supasit.A Studio ครบ (สว่าง + มืด 3 สถานะ) · component พื้นฐาน · โครง 9 โมดูล IIFE · ปุ่มสลับธีม · badge · boot splash นีออนกระพริบ (D1/D2) · CSP · helper กัน XSS |
| `chart-theme.js` | ธีม Chart.js ที่อ่านสีจาก CSS variable — สลับธีมแล้วกราฟตามเอง |
| `sw.js` | Service Worker cache-first |
| `manifest.webmanifest` | PWA manifest |
| `assets/icon.svg` | ไอคอนแอป (A(i)CODER ชุด Studio) |
| `assets/d1-neon-arcade-bare.svg` · `assets/d2-crt-night-bare.svg` | นีออนกระพริบสำหรับ boot splash เท่านั้น (ดู `branding/README.md`) — ไม่มีพื้นหลังของตัวเอง ต้องวางบน `var(--bg)` เสมอ ห้ามเอาไปแทน `.logo`/`.aicoder-badge` เพราะเล็กกว่าขนาดต่ำสุดของมันมาก |

## กติกาที่ห้ามพลาด

- **ห้าม `innerHTML` กับข้อมูลจากผู้ใช้** — ใช้ `UI_RENDERER.el()` ที่เขียนด้วย `textContent` ให้แล้ว
- **`localStorage` ต้องอยู่ใน `try/catch` เสมอ** — โหมดส่วนตัวโยน error ได้ ถ้าไม่ดักหน้าจะพังทั้งหน้า
- **ธีมต้องครบ 3 สถานะ** — `:root` (สว่าง) · `prefers-color-scheme` (ตามระบบ) · `[data-theme]` (ผู้ใช้เลือก)
  การไม่ stamp `data-theme` เลยคือ "ตามระบบ" — อย่าเผลอ stamp ค่าเริ่มต้นทับ
- **ทุกสีต้องมาจาก token** — ห้าม hardcode hex ในโค้ดแอป (รวม badge ด้วย ยกเว้นจุดกลม `#F2B705` ที่คงที่ตั้งใจตาม studio-badge-*.svg)
- **เป้าแตะบนมือถืออย่างน้อย 44px** — `.btn` ตั้งไว้ให้แล้ว ปุ่มที่เขียนเพิ่มต้องรักษาเกณฑ์นี้
- **Chart.js** ต้อง `.destroy()` ก่อนสร้างใหม่ทุกครั้งที่ re-render ไม่งั้น instance ค้างจนหน่วยความจำบวม
