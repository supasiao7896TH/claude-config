---
name: vibe-coding-workflow
description: >
  Workflow Skill สำหรับ Claude Code Session · Iteration Protocol · Loop Engineering
  ใช้เมื่อพี่ A ขอแก้บักในแอปที่มีอยู่แล้ว ปรับปรุง/iterate โค้ดเดิม หรือทำงาน
  วนซ้ำใน Claude Code Session ไม่ใช้กับการสร้างแอปใหม่ (ให้ใช้ vibe-coding-core
  แทน) trigger keyword ต้องมีบริบทกำกับ เช่น "โค้ดพังอีกแล้ว", "ลองรันดูใหม่",
  "ปรับโค้ดตรงนี้", "วนลูปแก้บั๊ก", "เริ่มใหม่จากจุดนี้" — ไม่ใช่คำเดี่ยวๆ
  ทั่วไปอย่าง "ลอง" หรือ "ปรับ" ที่อาจหมายถึงเรื่องอื่น
---

# Vibe Coding Workflow — Supasit.A Skill

> **Scope:** Claude Code Session Hygiene · Iteration Protocol · Loop Engineering
> **ใช้เมื่อ:** แก้บัก / iterate / ปรับปรุงแอปที่มีอยู่ / Claude Code session
> **ใช้ร่วมกับ:** vibe-coding-core เสมอ

| | |
|---|---|
| **Version** | 6.0 |
| **Updated** | 2026-07 |
| **Brand** | A-Class WebCraft · Code • Share • Inspire · by Supasit.A |
| **Sections in this file** | §18–19, §23–24 |
| **Related skills** | `vibe-coding-core` (§1–17) — โหลดร่วมกันเสมอ |

Template เต็มของ `context.md` / `agents.md` (§24.2–24.3) ยาวมาก แยกไปอยู่ที่
`references/context-templates.md` — โหลดเฉพาะตอนที่พี่ A ขอให้สร้างไฟล์เหล่านี้จริงๆ

---

## § 18 · Claude Code Session Hygiene

### 18.1 · Session Startup (ทำทุกครั้งที่เปิด Claude Code)

```bash
# 1. ตรวจสอบ branch ก่อนเสมอ
git status
git branch

# 2. ดึง code ล่าสุด
git pull origin main

# 3. เช็ค CLAUDE.md มีไหม
cat CLAUDE.md   # Claude จะอ่านไฟล์นี้อัตโนมัติ

# 4. ตรวจ dependencies
npm install     # หรือ bun install
```

> **Branch:** โปรเจกต์ใหม่ทุกโปรเจกต์ใช้ `main` (ดู `vibe-coding-core` §17) ถ้าเจอโปรเจกต์เก่า
> ที่ยังใช้ `master` ให้ถามพี่ A ก่อนว่าจะ rename เป็น `main` หรือใช้ชื่อเดิมต่อไป — อย่าสมมติเอง

### 18.2 · CLAUDE.md Structure (บังคับทุก Project)

```markdown
# CLAUDE.md — [ชื่อ Project]

## Project Context
- ชื่อแอป: [ชื่อ]
- Stack: Single HTML · IndexedDB · [Firebase/Gemini optional]
- Deploy: GitHub Pages / Vercel
- Branch: main (repo: supasit-a-apps)

## Architecture
- Pattern: 9 IIFE Modules (เลือกเท่าที่ใช้)
- State: Reactive Pub/Sub via STATE_STORE
- Storage: IndexedDB first → Firestore delta sync

## Brand Rules
- Glass Badge "by Supasit.A" ต้องมีทุกแอป
- Status glow: Green=Online · Amber=Offline · Blue=Syncing
- Font: Sarabun (body) · Fraunces (hero/metric)
- Dark/Light mode: CSS variables บังคับ

## Current Phase
- [ ] Phase 1: Local-First HTML
- [ ] Phase 2: AI (Gemini BYOK)
- [ ] Phase 3: Cloud Sync
- [ ] Phase 4: Deploy

## Known Issues
- [รายการ bug หรือ TODO ที่รู้อยู่แล้ว]

## DO NOT
- ❌ ห้ามแก้ไฟล์ sw.js โดยไม่แจ้ง
- ❌ ห้าม hardcode API key
- ❌ ห้ามเปลี่ยน DB_VERSION โดยไม่ทำ migration
```

### 18.3 · Claude Code Modes

```
Auto Mode        → Claude ตัดสินใจเองทั้งหมด (เร็วที่สุด แต่ควบคุมน้อย)
Accept Edits     → Claude เสนอ → พี่ A กด Accept/Reject ทีละไฟล์ (แนะนำ)
Plan Mode        → Claude วางแผนก่อน → พี่ A อนุมัติ → ค่อย execute

Pattern แนะนำสำหรับพี่ A:
  งานใหม่ / ใหญ่  → Plan Mode (Opus) → Accept Edits (Sonnet)
  แก้บัก เล็กน้อย → Accept Edits (Sonnet) ตรงๆ
  Explore idea    → Auto Mode ดูก่อน แล้ว review
```

### 18.4 · Session Commit Pattern

```bash
# Commit message format (บังคับ)
git add -A
git commit -m "feat: [สิ่งที่เพิ่ม]"
git commit -m "fix: [สิ่งที่แก้]"
git commit -m "refactor: [สิ่งที่ปรับโครงสร้าง]"
git commit -m "style: [สิ่งที่ปรับ UI]"
git commit -m "docs: [สิ่งที่เพิ่มใน docs]"

# Push
git push origin main

# ถ้า GitHub Actions ทำงาน CI/CD → deploy อัตโนมัติ
```

### 18.5 · Token Efficiency Tips

```
ประหยัด Token:
  ✅ ใช้ Plan Mode ก่อน — Claude วางแผนก่อน ไม่ลงมือผิดทิศ
  ✅ ระบุไฟล์ที่ต้องแก้ตรงๆ — "แก้แค่ index.html บรรทัด 120–150"
  ✅ ใช้ CLAUDE.md เป็น context — ไม่ต้องอธิบาย project ซ้ำทุก session
  ✅ Commit บ่อย — checkpoint ป้องกัน rollback ใหญ่
  ❌ อย่าส่ง file ใหญ่ทั้งไฟล์ถ้าแก้แค่ส่วนเดียว
  ❌ อย่า copy-paste error message ยาวๆ — สรุปสั้นๆ แล้วแนบ stack trace
```

---

## § 19 · Iteration Protocol — Vibe Coding Keywords

> เมื่อพี่ A พิมพ์ keyword ด้านล่าง Claude ต้องตอบสนองทันทีตาม pattern ที่กำหนด

| Keyword | Claude ต้องทำ |
|---------|--------------|
| **"ปรับ"** | แก้เล็กน้อย ไม่เปลี่ยน architecture · อธิบายสิ่งที่เปลี่ยน |
| **"ลอง"** | ทำ experimental version · บอกว่านี่คือ prototype · ไม่ commit |
| **"พัง"** | เริ่ม debug mode · ถาม error message · วิเคราะห์ root cause |
| **"เริ่มใหม่"** | ถาม scope ก่อน — แค่ feature นี้ หรือทั้งแอป · อย่า wipe โดยไม่ยืนยัน |
| **"สรุป"** | สรุปสิ่งที่ทำไปใน session นี้ · ไฟล์ที่แก้ · สิ่งที่ยังค้าง |
| **"deploy"** | รัน Deployment Checklist (`vibe-coding-core` §17) ทีละข้อ · รายงานผล |

### Debug Mode ("พัง")
```
เมื่อพี่ A พิมพ์ "พัง" Claude ทำตามลำดับ:
  1. ถาม: "Error message คืออะไรคะ?"
  2. ถาม: "เกิดขึ้นตอนไหน? (คลิกอะไร / หน้าไหน)"
  3. วิเคราะห์ Root Cause (ระบุ Error Type ตาม references/error-handling-and-data.md
     ของ vibe-coding-core)
  4. เสนอ Fix พร้อม WHY อธิบาย
  5. หลังแก้: บอกวิธี verify ว่าหายแล้ว
```

---

## § 23 · Loop Engineering Protocol (MilerDev Method)

> **WHY:** Loop Engineering คือ pattern ที่ทำให้ AI ทำงานแบบ **วนลูปอัตโนมัติ** อย่างมีระเบียบ
> แทนที่จะสั่งครั้งเดียวแล้วรอ — AI จะ Read → Plan → Execute → Verify → Report แบบวนซ้ำ
> อ้างอิงจาก: MilerDev YouTube · "ทำไม Loop Engineering ถึงยอดนิยม"

### 23.1 · Trigger Keywords

| Keyword | Claude ต้องทำ |
|---------|--------------|
| `"loop"` หรือ `"loop mode"` | เริ่ม Loop Engineering Protocol ทันที |
| `"แก้แบบ loop"` | เริ่ม Loop Engineering Protocol ทันที |
| `"วนลูป"` | เริ่ม Loop Engineering Protocol ทันที |
| `"fix loop"` | เริ่ม Loop Engineering Protocol ทันที |

### 23.2 · The 5-Step Loop Cycle (บังคับทุก Loop)

```
╔══════════════════════════════════════════════════════╗
║          LOOP ENGINEERING — 5-STEP CYCLE             ║
╠══════════════════════════════════════════════════════╣
║  STEP 1 → READ     อ่านโครงสร้างโปรเจกต์ก่อนเสมอ   ║
║  STEP 2 → CONFIRM  สรุปสิ่งที่เข้าใจ + ขอ confirm   ║
║  STEP 3 → PLAN     วางแผนเป็น task ย่อย ทีละชิ้น    ║
║  STEP 4 → EXECUTE  ลงมือแก้ไปทีละอย่าง              ║
║  STEP 5 → VERIFY   บอกวิธีตรวจสอบ + สรุปไฟล์ที่แก้  ║
╚══════════════════════════════════════════════════════╝
```

**STEP 1 — READ**
```
✅ อ่าน README.md / CLAUDE.md ก่อนแตะโค้ดใดๆ
✅ ดู structure ของ project (files, folders)
✅ ระบุไฟล์ที่เกี่ยวข้องกับ task นี้
WHY: Context ไม่ครบ = แก้ผิดจุด = เสียเวลามากขึ้น
```

**STEP 2 — CONFIRM**
```
✅ "หนูเข้าใจว่า task นี้คือ [X]"
✅ "ไฟล์ที่จะแก้คือ [A, B, C]"
✅ ถามถ้าไม่แน่ใจ — "ถ้าไม่แน่ใจ ให้ถามก่อน"
WHY: Confirm ก่อน = ป้องกันการแก้ผิดทิศ
```

**STEP 3 — PLAN**
```
📋 Task Plan:
  [ ] 1. [task ย่อยที่ 1]
  [ ] 2. [task ย่อยที่ 2]
  [ ] 3. [task ย่อยที่ 3]

กฎ:
  ✅ แต่ละ task ทำสิ่งเดียว (Single Responsibility)
  ✅ เรียงลำดับ dependency ให้ถูก
  ❌ อย่าแก้หลายเรื่องพร้อมกัน
WHY: task ย่อย = debug ง่าย + rollback ง่าย
```

**STEP 4 — EXECUTE**
```
✅ tick [x] task ที่ทำเสร็จแล้ว
✅ แก้ทีละ task ตามลำดับ
✅ ถ้าเจอ error → ใช้ error message เป็น feedback แล้วแก้ซ้ำ
✅ ถ้าเจอ security risk → แจ้งพี่ A ทันที

Error Loop (max 3 รอบ):
  เจอ error → วิเคราะห์ → แก้ → test → ถ้ายังเจอ → วิเคราะห์ใหม่
  ถ้าแก้ 3 รอบยังไม่ผ่าน → หยุดแล้ว report ให้พี่ A
WHY: วนลูปซ้ำอัตโนมัติ ไม่ต้องรอพี่ A สั่งใหม่ทุกครั้ง
```

**STEP 5 — VERIFY**
```
✅ สรุปไฟล์ที่แก้:
   - แก้ไข: [file] → [สิ่งที่เปลี่ยน]
   - เพิ่ม: [file] → [สิ่งที่เพิ่ม]

✅ วิธีตรวจสอบ:
   → npm run build / npm test / npm run dev
   → "เปิดหน้า [X] แล้วลองทำ [Y] ดูนะคะพี่ A"

✅ Security flag (ถ้ามี):
   ⚠️ "พบความเสี่ยง: [อธิบาย] แนะนำให้ [แก้อย่างไร]"
```

### 23.3 · Loop Engineering Rules

```
❌ ห้ามแก้หลายเรื่องพร้อมกัน (Single Task Per Loop)
❌ ห้าม assume โดยไม่ถาม เมื่อ requirement ไม่ชัด
❌ ห้ามข้าม Step ใดๆ ใน 5-Step Cycle
❌ ห้ามเปลี่ยน architecture กลางคัน โดยไม่แจ้ง
❌ ห้ามวน loop เกิน 3 รอบต่อ error เดิม — ให้ escalate

✅ ถ้าไม่แน่ใจ ให้ถามก่อน
✅ ถ้าเจอ security risk ให้แจ้งทันที
✅ เมื่อ Loop เสร็จ ถามพี่ A ว่า "ต้องการให้วน Loop ต่อไหมคะ? 🔄"
```

### 23.4 · Loop Output Template

```markdown
## 🔄 Loop Engineering — [ชื่อ task]

### 📖 STEP 1: READ
- Tech Stack: [...]
- ไฟล์ที่เกี่ยวข้อง: [...]

### ✅ STEP 2: CONFIRM
> [สรุปเป้าหมายในประโยคเดียว]
ไฟล์ที่จะแก้: [A], [B]

### 📋 STEP 3: PLAN
- [ ] 1. [task 1]
- [ ] 2. [task 2]

### ⚙️ STEP 4: EXECUTE
- [x] 1. ✅ เสร็จแล้ว
- [x] 2. ✅ เสร็จแล้ว

### 🧪 STEP 5: VERIFY
| ไฟล์ | การเปลี่ยนแปลง |
|------|----------------|
| index.html | เพิ่ม [X] |

วิธีตรวจสอบ: เปิดหน้า [X] แล้วลอง [Y] ดูนะคะพี่ A

**Loop เสร็จแล้วค่ะ ต้องการให้วน Loop ต่อไหมคะ? 🔄**
```

### 23.5 · Integration กับ § 1 (vibe-coding-core) และ § 19

```
§ 1  (vibe-coding-core, Pre-Coding Workflow) = สร้างแอปใหม่ → Blueprint → อนุมัติ → Code
§ 19 (Iteration Protocol)                     = keyword shortcuts: ปรับ/ลอง/พัง/เริ่มใหม่/สรุป/deploy
§ 23 (Loop Engineering)                       = แก้/iterate แบบ structured loop: READ→CONFIRM→PLAN→EXECUTE→VERIFY

ใช้ร่วมกันได้: สร้างด้วย § 1 → iterate ด้วย § 23
```

---

## § 24 · Project Context Files (MilerDev Super Power Method)

> **WHY:** ไฟล์ `context.md` และ `agents.md` คือ "คู่มือ" ให้ AI เข้าใจโปรเจกต์ทันที
> เมื่อเปลี่ยน model, เปิด session ใหม่, หรือให้ AI อื่นเข้ามาทำงานต่อ
> AI จะอ่านไฟล์เหล่านี้ก่อน → ไม่ต้องอธิบาย context ซ้ำทุกครั้ง
> อ้างอิงจาก: MilerDev YouTube · "Super Power Method"

### 24.1 · Trigger — เมื่อไหร่ต้องสร้างไฟล์เหล่านี้

```
✅ เริ่มโปรเจกต์ใหม่ทุกครั้ง (หลัง Blueprint อนุมัติ)
✅ เมื่อ session ยาวและมี context เยอะ → สั่ง Claude สรุปใส่ไฟล์
✅ ก่อน deploy หรือส่งต่อโปรเจกต์ให้คนอื่น
✅ เมื่อจะเปลี่ยนไปใช้ AI model อื่น (Claude → Gemini ฯลฯ)

วิธีสั่ง Claude (ไม่ต้องเขียนเอง):
  "ช่วยเขียน context.md สำหรับโปรเจกต์นี้ให้หน่อยนะคะ"
  "ช่วยเขียน agents.md ด้วยค่ะ"
  Claude จะดึง context ทั้งหมดจาก conversation มาสรุปให้ทันที
```

> Template เต็มของ `context.md` (§24.2) และ `agents.md` (§24.3) อยู่ที่
> `references/context-templates.md` — โหลดตอนที่กำลังจะสร้างไฟล์จริงเท่านั้น

### 24.4 · Super Power Workflow — สั่ง Claude เขียนให้อัตโนมัติ

```
เมื่อ Blueprint อนุมัติแล้ว → สั่ง Claude ดังนี้:

  พี่ A: "ช่วยสร้าง context.md และ agents.md สำหรับโปรเจกต์นี้ให้หน่อยนะคะ"

Claude จะ:
  1. ดึง context ทั้งหมดจาก conversation
  2. สรุปเป็น context.md ตาม template ใน references/context-templates.md
  3. สร้าง agents.md ตาม template เดียวกัน
  4. วางไว้ที่ root project พร้อม CLAUDE.md

ผลลัพธ์:
  project/
  ├── CLAUDE.md    ← Claude Code auto-read
  ├── context.md   ← Project overview
  └── agents.md    ← AI rules & constraints
```

### 24.5 · Verification Loop (ห้ามเชื่อ AI 100%)

> **WHY:** AI เก่งแค่ไหนก็ยังพังได้ — ต้องมีระบบตรวจสอบเสมอ

```
╔══════════════════════════════════════════════════════╗
║            VERIFICATION LOOP PROTOCOL                ║
╠══════════════════════════════════════════════════════╣
║  1. CODE    → Claude เขียนโค้ด                      ║
║  2. BUILD   → npm run build / ไม่มี error?           ║
║  3. TEST    → เปิดจริง ลองใช้จริง ทุก flow          ║
║  4. VERIFY  → ✅ ผ่าน → commit │ ❌ พัง → loop back ║
╚══════════════════════════════════════════════════════╝

Manual Verify (บังคับทุกครั้ง):
  [ ] เปิดแอปบน Mobile จริง (ไม่ใช่แค่ DevTools)
  [ ] ทดสอบ Happy Path — flow หลักใช้งานได้
  [ ] ทดสอบ Edge Case — กด cancel / ปิดระหว่างทาง
  [ ] เปิด Console — ไม่มี error สีแดง
  [ ] ทดสอบ Offline — ปิด network แล้วเปิดใหม่

คำสั่ง verify มาตรฐาน:
  npm run build   → ไม่มี compile error
  npm run dev     → เปิด localhost ทดสอบ
  Lighthouse      → Performance ≥ 80 · A11y ≥ 90

หลักการ MilerDev:
  "โมเดลที่ถูกกว่า + Verification Loop ที่ดี
   ให้ผลลัพธ์ดีกว่าโมเดลแพงที่ไม่มีการตรวจสอบ"
```

---

*SKILL: vibe-coding-workflow v6.0 | Sections: §18–19, §23–24 (+ references/)*
*Supasit.A × A-Class WebCraft | Code • Share • Inspire*
*Related: vibe-coding-core (โหลดร่วมกันเสมอ)*
*Updated: July 2026 (พ.ศ. 2569)*
