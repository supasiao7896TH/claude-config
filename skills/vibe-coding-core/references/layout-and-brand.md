# Layout & Brand Identity Reference — "Tactile Plant UI"

> ส่วนหนึ่งของ `vibe-coding-core` — โหลดไฟล์นี้เมื่อออกแบบ layout หรือตรวจ brand compliance
> อัปเดต 2569-08-13: คู่กับ design-system.md (Tactile Plant UI) — มาตรฐานถาวร

---

## Layout Guide
```
Sidebar (PC/Desktop, บังคับ ≥768px):
  พื้นหลัง: --bg-page เดียวกับหน้า (ไม่ใช่สีขาว/glass แยก) — โลโก้แอป + gradient-text เหนือเมนู
  เมนู: icon (Lucide) + label ข้อความ, hover เปลี่ยนสีเป็น brand-teal

Bottom Nav (Mobile — บังคับ ≤768px):
  position: fixed; icon-only (ไม่มี label เพราะพื้นที่จำกัด) + ปุ่มหลัก (เช่น "+") ใช้ .tactile-btn
  + .breathing เด่นกว่าปุ่มอื่น — วางเหนือแถบ A(i)CODER badge เสมอ ไม่ทับกัน

KPI Tile (การ์ดสรุปตัวเลข):
  .tactile + border-t-4 สีตามความหมาย (DS-4) + ตัวเลขใหญ่ (text-2xl font-black สีเดียวกับ border)
  + ไอคอนชิป (.tactile-btn ขนาดเล็ก สีไอคอนตรงกับ border) มุมขวา
  ตัวเลขควร animate นับขึ้นจาก 0 ตอนโหลดหน้าครั้งแรก (เว้นแต่ prefers-reduced-motion)

Bento Grid (การ์ดทั่วไป):
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px (mobile) → 16px (desktop)
```

---

## Brand Identity (Supasit.A × Tactile Plant UI)

```
Header:
  - ไม่ใช้ background แยกจากพื้นหน้า (ต่างจาก glass header เดิม) — โปร่งใส กลมกลืนกับ --bg-page
  - ชื่อแอปใช้ .gradient-text (teal→cyan) ที่นี่จุดเดียวของทั้งแอป
  - Status indicator: จุดสีพร้อม pulse ถ้าจำเป็นจริง (เช่น กำลัง sync) — ถ้าไม่มีสถานะจริงให้แสดง
    จุดสีเขียวนิ่งๆ แทนคำว่า "พร้อมใช้งาน" (ไม่ใช้ .pulse-dot กับสถานะปกติ — เก็บไว้ให้ urgent เท่านั้น)
  - ปุ่ม Dark/Light toggle ใช้ .tactile-btn ทรงกลม/สี่เหลี่ยมมน

A(i)CODER Badge (บังคับทุกแอป — แทนที่ "by Supasit.A" text badge เดิมทั้งหมด):
  ที่มา: C:\Users\PC 4000D\claude-config\branding\ (README.md มีกติกาเต็ม)
  ใช้ D1 "bare" (`exports/d1-neon-arcade-bare.svg`) วางในแถบพื้นหลังสว่างคงที่ #F7F5FB เสมอ
  (ไม่ตามธีมแอป — D1 ต้องไม่อยู่บนพื้นมืดเด็ดขาด ตามกติกาในไฟล์ branding)
  ตำแหน่ง: มือถือ = แถบเต็มความกว้างด้านล่างสุด (เหนือ safe area, ใต้ bottom nav)
           PC = กล่องลอยมุมขวาล่าง fixed bottom-5 right-4
  วิธีติดตั้ง: copy `branding/exports/d1-neon-arcade-bare.svg` → `public/aicoder-badge.svg`
              ของแอปนั้นๆ แล้ว <img src="/aicoder-badge.svg" alt="A(i)CODER" />

Icons: Lucide เท่านั้น (ดู design-system.md DS-8) — ห้ามใช้ emoji เป็นไอคอนหลักของปุ่ม/nav

Micro-interactions (บังคับ — ดู design-system.md DS-6 สำหรับ CSS):
  - fade-in slide-up เมื่อการ์ด/รายการโหลด
  - hover การ์ด: เงาลดความนูนลงเล็กน้อย (.tactile:hover) — ไม่ใช้ scale ทั่วทั้งการ์ด
  - ปุ่มกด: บุ๋มเข้าไปจริงตอน :active (.tactile-btn:active) — ไม่ใช้ scale(0.97) แบบเดิม
  - .breathing เฉพาะปุ่ม floating action หลัก, .pulse-dot เฉพาะสถานะเร่งด่วนจริง — ห้ามใช้พร่ำเพรื่อ

PWA + Chart: ดู design-system.md DS-9/DS-10 — บังคับทุกแอปมี PWA, ใช้ Chart.js เมื่อมีข้อมูลย้อนหลัง
```

---

## Reference Implementation
ดูโค้ดจริงที่ใช้งานได้แล้วที่ `condo-rental-app` (repo: `Model-Vibe-Coding-Rental-Loan-Management-`)
โดยเฉพาะ `src/style.css` (token ทั้งหมด), `index.html` (โครง layout + badge), `src/modules/ui-renderer.js`
(KPI tile pattern, การใช้ Lucide icon ใน template string)
