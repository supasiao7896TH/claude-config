# HANDOFF.md — สถานะงานล่าสุด

> ใช้ไฟล์นี้ส่งต่องานข้ามเครื่อง (บ้าน ↔ ที่ทำงาน) — อ่านไฟล์นี้ก่อนเริ่ม session ถัดไป

**อัปเดตล่าสุด:** 2026-08-27 (Claude Code on the web)

---

## ⚠️ สิ่งแรกที่ต้องทำที่ทุกเครื่อง (สำคัญที่สุด)

1. หาโฟลเดอร์ที่ clone `claude-config` ไว้ที่เครื่องนั้น
   (เครื่อง Office **ยังไม่ทราบ path แน่ชัด** รู้แค่ `.claude` อยู่ที่ `C:\Users\26007294\.claude\` ต้องหา/ยืนยันเอง)
2. รัน `git pull` ในโฟลเดอร์นั้น
3. หลัง pull เสร็จ ระบบจะใช้ **"Instrument Grade"** (design system ใหม่ถาวร — แทนที่ Tactile Plant UI)
   อัตโนมัติทันที เพราะเก็บอยู่ใน skill ระดับ user (`~/.claude/skills/vibe-coding-core/`) ไม่ต้องตั้งค่าเพิ่มต่อโปรเจกต์
4. **`USER.md` เปลี่ยนด้วย** — ถ้าเครื่องนั้นใช้วิธี copy (ไม่ใช่ symlink) ต้อง copy ทับใหม่ (ดูวิธีใน README.md)

---

## 🆕 สรุปงานล่าสุด (2026-08-27)

### 1. Design System ใหม่ถาวร — "Instrument Grade" (แทนที่ Tactile Plant UI)
พี่ A review ระบบเดิมแล้วพบปัญหา 4 ข้อ: ดูซ้ำกันทุกแอป · อ่านยาก contrast ต่ำ · มือถือยังไม่ดีพอ ·
**ยังไม่มีเอกลักษณ์ที่บ่งบอกตัวตน** → ตัดสินใจ**รื้อทำใหม่ทั้งหมด**

แนวคิดใหม่ *"อ่านค่าได้แม่นเหมือนเครื่องมือวัด"* — ดึงจากตัวตนวิศวกรกระบวนการ บุคลิกเรียบหรูมืออาชีพ
- **IG-01 ตัวเลขทุกตัวเป็น IBM Plex Mono + tabular-nums** ← ลายเซ็นของแบรนด์ แก้ปัญหา "ดูซ้ำ" ที่ต้นเหตุ
- IG-02 การ์ดมีแถบ tag บอกที่มาข้อมูล (ทางเลือก) · IG-03 ขอบคม 1px แทนเงานูน แต่ปุ่มยังกดแล้วยุบ
- IG-04 สีบอกสถานะ ไม่ใช่หมวดหมู่
- Font เปลี่ยนจาก Noto Sans Thai → **IBM Plex Sans Thai + IBM Plex Mono**
- Dark mode รองรับครบ 3 สถานะ (`:root` · `prefers-color-scheme` · `[data-theme]`) แทน `.dark` class เดิม
- ตัดถาวร: neumorphism · gradient-text · `.breathing` · `.pulse-dot`

ไฟล์ที่แก้: `USER.md` · `skills/vibe-coding-core/SKILL.md` · `references/design-system.md` ·
`references/layout-and-brand.md` · `agents/sa-architect.md` · `agents/sa-code-reviewer.md`
(สอง agent ยังค้าง "Neo-Glassmorphism" ซึ่งเก่ากว่า Tactile Plant UI อีกรุ่น — แก้พร้อมกันแล้ว)

> **แอปเดิมไม่ต้องรีบย้าย** — ตาราง Migration อยู่ท้าย `references/design-system.md`
> ย้ายเมื่อแอปนั้นถูกแก้ครั้งใหญ่อยู่แล้ว แต่**แอปใหม่ทุกตัวต้องใช้ Instrument Grade**

### 2. Subagent ใหม่ — `sa-summarizer`
รวมผลจาก subagent ประเภทเดียวกันที่รันขนาน (fan-out) ให้เป็นรายงานเดียว
พร้อมกติกา orchestration ใน `USER.md` (รันขนานได้เฉพาะ multi-file · ไม่เกิน 3-5 ตัวต่อรอบ · ต้องระบุขอบเขตก่อนเรียกเสมอ)

---

## ✅ สรุปงานวันนี้ (2026-08-13, เครื่องบ้าน)

### 1. โปรเจกต์ใหม่ — Condo Rental & Loan Management App
- Path: `D:\supasit\Leraning_for_vibe_coder\condo-rental-app`
- Repo: https://github.com/supasiao7896TH/Model-Vibe-Coding-Rental-Loan-Management-
- **URL ใช้งานจริง (deployed):** https://condo-rental-app.supasiao.workers.dev — Cloudflare Workers, auto-deploy ผ่าน GitHub Actions ทุกครั้งที่ push เข้า `main` (ตั้ง `CLOUDFLARE_API_TOKEN` secret ไว้ที่ repo นี้แล้ว)
  - ⚠️ ข้อมูลที่กรอกใน localhost:5174 (เครื่องบ้าน) กับข้อมูลใน URL จริงนี้ **คนละฐานข้อมูลกัน** (IndexedDB แยกตาม origin) — พิมพ์ข้อมูลจริงที่ URL production เท่านั้น อย่าสับสนว่าทำไมข้อมูลไม่ตรงกัน
- แอปติดตามค่าเช่า/ยอดผ่อนธนาคาร คอนโด 4 ห้อง
- **ข้อยกเว้นมาตรฐาน:** เขียนแบบ multi-file (Vite + ES Modules + Vitest) ไม่ใช่ single-HTML-file ตามมาตรฐานเดิม — ตัดสินใจใหม่เพื่อการเรียนรู้ ไม่ได้เปลี่ยนมาตรฐานภาพรวม
- git status: clean, push ครบแล้ว (`origin/main` up to date) — commit ล่าสุด `32f16f4`

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

### 4. Repo ใหม่ — Leraning_for_vibe_coder (workspace หลัก)
- Path: `D:\supasit\Leraning_for_vibe_coder` (root ของทั้ง workspace — เพิ่ง `git init` วันนี้ ก่อนหน้านี้ยังไม่เคยเป็น git repo เลย)
- Repo: https://github.com/supasiao7896TH/Leraning_for_vibe_coder (**private**)
- เก็บ: `CLAUDE.md` (คำแนะนำสำหรับ Claude Code เวลาเปิดโฟลเดอร์นี้) + `learning/dev-skills-roadmap.md` (log ความรู้สะสม)
- **`condo-rental-app/` ถูก `.gitignore` ไว้โดยตั้งใจ** — มี repo ของตัวเองแยกต่างหาก (ข้อ 1 ด้านบน) ไม่ต้อง track ซ้อนกันสองที่
- git status: clean, push ครบแล้ว — commit ล่าสุด `fbc2f2d`, branch `main`

---

## 🚧 ค้างอยู่ / ยังไม่ได้ทำ
- ยังไม่มี apple-touch-icon จริงของ condo-rental-app (รอไอคอนแอปจริง)
- ยังไม่ได้ integrate A(i)CODER badge เข้ากับแอปอื่นๆ ของพี่ A นอกจาก condo-rental-app

## 🎯 ขั้นตอนถัดไป
- ยังไม่ได้ตกลงกับพี่ A ว่าจะต่อยอดอะไรต่อ — เริ่มจาก pull `claude-config` ให้เรียบร้อยก่อน แล้วค่อยถามพี่ A

## 🔧 คำสั่งที่ต้องรันก่อนทำงานต่อ (ที่เครื่อง Office)
1. `git pull` ในโฟลเดอร์ `claude-config` (หา path ก่อน — ดูหัวข้อด้านบน)
2. ถ้ายังไม่เคย clone `Leraning_for_vibe_coder` ที่เครื่อง Office: `git clone https://github.com/supasiao7896TH/Leraning_for_vibe_coder` (repo private — ต้อง login gh/git ด้วย account ที่มีสิทธิ์เข้าถึง)
3. ถ้ายังไม่เคย clone `condo-rental-app` ที่เครื่อง Office: `git clone https://github.com/supasiao7896TH/Model-Vibe-Coding-Rental-Loan-Management-` (แนะนำให้ clone ไว้ *ข้างใน* โฟลเดอร์ `Leraning_for_vibe_coder` ให้ path ตรงกับเครื่องบ้าน)
   ถ้า clone ไว้แล้ว: `git pull` ในโฟลเดอร์นั้น
4. `npm install` ใน `condo-rental-app` (เป็น Vite project ต้อง install dependencies ก่อนรันได้)

## ⚠️ ข้อควรระวัง / สิ่งที่ต้องไม่ลืม
- ห้ามลืม pull `claude-config` ก่อนเริ่มงาน UI — ไม่งั้นเครื่อง Office จะยังใช้ design system เก่า/ผิด
- `condo-rental-app` เป็น multi-file (ต่างจากมาตรฐาน single-HTML เดิม) — เป็นข้อยกเว้นเฉพาะโปรเจกต์นี้เท่านั้น อย่าเข้าใจผิดว่ามาตรฐานเปลี่ยนทั้งหมด

---

## งานค้างจากรอบก่อน (2026-08-08) — เช็คว่าทำไปแล้วหรือยัง
รอบนั้นค้างไว้ว่า: ไปเครื่อง Office → `git pull` ที่ `claude-config` → copy `settings.json` ไปทับ `~/.claude/settings.json` (ควรทำแค่ครั้งเดียว) — ถ้ายังไม่ได้ทำตอนนั้น ให้ทำตอนนี้พร้อมกับรอบ pull ใหม่นี้เลย
