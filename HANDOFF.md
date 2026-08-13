# HANDOFF.md — สถานะงานล่าสุด

> ใช้ไฟล์นี้ส่งต่องานข้ามเครื่อง (บ้าน ↔ ที่ทำงาน) — อ่านไฟล์นี้ก่อนเริ่ม session ถัดไป

**อัปเดตล่าสุด:** 2026-08-13 (เครื่องบ้าน)

---

## ⚠️ สิ่งแรกที่ต้องทำที่เครื่อง Office (สำคัญที่สุด)

`claude-config` เพิ่ง push commit ใหม่จากเครื่องบ้าน (`af0a4e0`) แต่เครื่อง Office ยังไม่มีการเปลี่ยนแปลงนี้เลย

1. หาโฟลเดอร์ที่ clone `claude-config` ไว้ที่เครื่อง Office — **ยังไม่ทราบ path แน่ชัด** (รู้แค่ `.claude` อยู่ที่ `C:\Users\26007294\.claude\`) ต้องหา/ยืนยันเอง
2. รัน `git pull` ในโฟลเดอร์นั้น
3. หลัง pull เสร็จ ระบบจะใช้ **"Tactile Plant UI"** (design system ใหม่ถาวร) อัตโนมัติทันที เพราะเก็บอยู่ใน skill ระดับ user (`~/.claude/skills/vibe-coding-core/`) — ไม่ต้องตั้งค่าเพิ่มต่อโปรเจกต์

---

## ✅ สรุปงานวันนี้ (2026-08-13, เครื่องบ้าน)

### 1. โปรเจกต์ใหม่ — Condo Rental & Loan Management App
- Path: `D:\supasit\Leraning_for_vibe_coder\condo-rental-app`
- Repo: https://github.com/supasiao7896TH/Model-Vibe-Coding-Rental-Loan-Management-
- แอปติดตามค่าเช่า/ยอดผ่อนธนาคาร คอนโด 4 ห้อง
- **ข้อยกเว้นมาตรฐาน:** เขียนแบบ multi-file (Vite + ES Modules + Vitest) ไม่ใช่ single-HTML-file ตามมาตรฐานเดิม — ตัดสินใจใหม่เพื่อการเรียนรู้ ไม่ได้เปลี่ยนมาตรฐานภาพรวม
- git status: clean, push ครบแล้ว (`origin/main` up to date) — commit ล่าสุด `e4ae0f6`

### 2. Design System ใหม่ถาวร — "Tactile Plant UI"
วันนี้ลองผิดลองถูกหลายรอบ: Neo-Glassmorphism เดิม → "Control Room" (ถูกปฏิเสธ) → กลับไป Neo-Glassmorphism (ถูกปฏิเสธอีก) → พี่ A เอาแอปจริงที่เคยทำเอง 2 ตัวมาให้ดู (`Monitor-log-sheet-boardman`, `Log-EQ-history`) → เจอ pattern ที่พี่ A เลือกซ้ำเองโดยไม่ตั้งใจ (teal/cyan, neumorphism สัมผัสได้, gradient-text) → สังเคราะห์เป็น **"Tactile Plant UI"** — พี่ A ยืนยันแล้วว่าใช่ ("ok แนวนี้ที่ใช่เลย")

ตอนนี้เป็น**มาตรฐานถาวร** เขียนลง skill `vibe-coding-core` ครบแล้ว:
- `SKILL.md`
- `references/design-system.md`
- `references/layout-and-brand.md`
- `references/tech-stack.md`

Commit `af0a4e0` — push ขึ้น https://github.com/supasiao7896TH/claude-config แล้ว (ยืนยันจาก git: `origin/main` up to date, working tree clean)

### 3. ฟีเจอร์ที่เพิ่มใน condo-rental-app วันนี้
- PWA (ติดตั้งได้/offline)
- กราฟแนวโน้มกระแสเงินสด 6 เดือน (Chart.js)
- ค้นหา/กรองธุรกรรม
- ตัวเลข KPI นับขึ้นตอนโหลดหน้า

ทั้งหมด commit + push แล้ว — commits ล่าสุด: `e4ae0f6`, `38208f0`, `aafcfc7`, `b635733`, `58d1f8c` (Tactile Plant UI applied)

---

## 🚧 ค้างอยู่ / ยังไม่ได้ทำ
- ยังไม่มี apple-touch-icon จริงของ condo-rental-app (รอไอคอนแอปจริง)
- ยังไม่ได้ integrate A(i)CODER badge เข้ากับแอปอื่นๆ ของพี่ A นอกจาก condo-rental-app

## 🎯 ขั้นตอนถัดไป
- ยังไม่ได้ตกลงกับพี่ A ว่าจะต่อยอดอะไรต่อ — เริ่มจาก pull `claude-config` ให้เรียบร้อยก่อน แล้วค่อยถามพี่ A

## 🔧 คำสั่งที่ต้องรันก่อนทำงานต่อ (ที่เครื่อง Office)
1. `git pull` ในโฟลเดอร์ `claude-config` (หา path ก่อน — ดูหัวข้อด้านบน)
2. ถ้ายังไม่เคย clone `condo-rental-app` ที่เครื่อง Office: `git clone https://github.com/supasiao7896TH/Model-Vibe-Coding-Rental-Loan-Management-`
   ถ้า clone ไว้แล้ว: `git pull` ในโฟลเดอร์นั้น
3. `npm install` ใน `condo-rental-app` (เป็น Vite project ต้อง install dependencies ก่อนรันได้)

## ⚠️ ข้อควรระวัง / สิ่งที่ต้องไม่ลืม
- ห้ามลืม pull `claude-config` ก่อนเริ่มงาน UI — ไม่งั้นเครื่อง Office จะยังใช้ design system เก่า/ผิด
- `condo-rental-app` เป็น multi-file (ต่างจากมาตรฐาน single-HTML เดิม) — เป็นข้อยกเว้นเฉพาะโปรเจกต์นี้เท่านั้น อย่าเข้าใจผิดว่ามาตรฐานเปลี่ยนทั้งหมด

---

## งานค้างจากรอบก่อน (2026-08-08) — เช็คว่าทำไปแล้วหรือยัง
รอบนั้นค้างไว้ว่า: ไปเครื่อง Office → `git pull` ที่ `claude-config` → copy `settings.json` ไปทับ `~/.claude/settings.json` (ควรทำแค่ครั้งเดียว) — ถ้ายังไม่ได้ทำตอนนั้น ให้ทำตอนนี้พร้อมกับรอบ pull ใหม่นี้เลย
