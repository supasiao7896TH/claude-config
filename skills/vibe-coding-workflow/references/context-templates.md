# context.md / agents.md Templates

> ส่วนหนึ่งของ `vibe-coding-workflow` §24 — โหลดไฟล์นี้เฉพาะตอนที่กำลังจะสร้าง
> `context.md` และ `agents.md` จริงๆ ให้พี่ A (ดู trigger ใน §24.1 ของ SKILL.md หลัก)

---

## 24.2 · context.md — ภาพรวมโปรเจกต์

> **หน้าที่:** เก็บ "บริบท" ของระบบทั้งหมด — AI อ่านแล้วเข้าใจโปรเจกต์ได้ทันที

**Template สำหรับพี่ A:**

```markdown
# context.md — [ชื่อ Project]
> อัปเดตล่าสุด: [วันที่] | เวอร์ชัน: [v1.0]

---

## 🎯 ภาพรวมและเป้าหมาย
- **ชื่อแอป:** [ชื่อ]
- **เป้าหมาย:** [แอปนี้ทำอะไร ใครใช้ ใช้ที่ไหน]
- **ผู้ใช้หลัก:** [พี่ A / ทีมงาน / etc.]
- **Status:** [Phase 1 / Phase 2 / Production]

---

## 🏗️ Architecture

### Stack
- **Frontend:** Single-File HTML · Tailwind CSS CDN · Vanilla JS
- **Storage:** IndexedDB (local-first) → Firestore (sync optional)
- **AI:** Gemini 2.5 Flash · BYOK · 24h Cache
- **Auth:** [Firebase Anonymous / None]
- **Deploy:** GitHub Pages
- **Repo:** github.com/supasiao7896TH/supasit-a-apps
- **Branch:** main

### JS Modules (9 IIFE Pattern — ใช้เท่าที่จำเป็น)
| Module | ใช้ | หน้าที่ |
|--------|-----|---------|
| APP_CONFIG | ✅ | Config, tokens, CDN |
| STATE_STORE | ✅ | Reactive Pub/Sub |
| STORAGE_ENGINE | ✅ | IndexedDB CRUD |
| CLOUD_SYNC_MANAGER | ⬜ | Firestore sync |
| AUTH_PROVIDER | ⬜ | Firebase Auth |
| GEMINI_AI_BRIDGE | ✅ | AI features |
| UI_RENDERER | ✅ | Components, Toast |
| DEBUG_MODULE | ✅ | Logs, audit |
| APP_CORE | ✅ | Init, routing |

### Data Schema (IndexedDB)
```
Store: [store_name]
  id         : string (PK · nanoid)
  [fields]   : [types]
  createdAt  : timestamp
  updatedAt  : timestamp
  _syncStatus: 'pending' | 'synced' | 'error'
```

---

## 🎨 Brand & Design Rules
- **Glass Badge** "by Supasit.A" → position: fixed bottom-right (บังคับ)
- **Status Glow:** Green=Online · Amber=Offline · Blue=Syncing
- **Font:** Sarabun (body) · Fraunces (hero/metric เท่านั้น)
- **Dark/Light Mode:** CSS variables บังคับ — ห้าม hardcode hex
- **Spacing:** 8pt grid เท่านั้น (4/8/12/16/20/24/32/40/48/64px)

---

## 📋 Pages / Features
| หน้า/Feature | Status | หมายเหตุ |
|-------------|--------|---------|
| [หน้า 1] | ✅ Done | |
| [หน้า 2] | 🔄 WIP | |
| [Feature X] | ⬜ Todo | |

---

## 🚧 Known Issues & TODO
- [ ] [Issue 1]
- [ ] [TODO 1]

---

## 📁 โครงสร้างไฟล์
```
project/
├── index.html          ← Single-file app (ทั้งหมดอยู่ที่นี่)
├── manifest.webmanifest
├── sw.js               ← Service Worker
├── CLAUDE.md           ← Claude Code instructions
├── context.md          ← ไฟล์นี้
└── agents.md           ← Agent rules
```

---

## 🔗 External Dependencies
- **Cloudflare Worker:** [URL ถ้ามี] — CORS Proxy (allowlist โดเมนปลายทางตาม
  `vibe-coding-core` → `references/tech-stack.md`)
- **Yahoo Finance:** [ticker].BK pattern สำหรับหุ้น SET
- **Firebase Project:** [project-id ถ้ามี]
```

---

## 24.3 · agents.md — กฎสำหรับ AI Agent

> **หน้าที่:** บอก AI ว่าต้องปฏิบัติตัวอย่างไร ก่อนลงมือเขียนโค้ด
> ใช้เมื่อเปลี่ยน model หรือเปิด session ใหม่ — AI อ่านแล้วทำงานต่อได้เลย

**Template สำหรับพี่ A:**

```markdown
# agents.md — [ชื่อ Project]
> คำแนะนำสำหรับ AI Agent ที่เข้ามาทำงานในโปรเจกต์นี้
> อ่านไฟล์นี้ก่อนลงมือเขียนโค้ดทุกครั้ง

---

## 🤖 ตัวตนและบทบาท
- **เรียกผู้ใช้ว่า:** "พี่ A"
- **AI แทนตัวเองว่า:** "หนู" พูดลงท้ายว่า "ค่ะ" (สุภาพ เป็นกันเอง)
- **บทบาท:** Senior Full-Stack Developer & Vibe Coding Mentor
- **ภาษา:** ตอบภาษาไทยเป็นหลัก มี code ภาษาอังกฤษตามปกติ

---

## ⚙️ Workflow บังคับ (ห้ามข้าม)
1. **อ่าน context.md ก่อนเสมอ** ก่อนแตะโค้ดใดๆ
2. **Blueprint → รอ "อนุมัติ"** → ค่อยเขียนโค้ด (ห้ามโค้ดก่อน)
3. **แตก task ย่อย** — ทำทีละชิ้น ไม่ทำรวดเดียวทั้งหมด
4. **Commit หลังเสร็จแต่ละ feature** — `git commit -m "feat: [X]"`
5. **บอกวิธี verify** หลังแก้ทุกครั้ง

---

## 📐 Architecture Rules (ห้ามเบี่ยง)
```
✅ Single-File HTML เสมอ — ห้ามแยกหลายไฟล์ JS/CSS
✅ JS อยู่ใน IIFE modules เท่านั้น — ห้าม Global function
✅ IndexedDB ก่อนเสมอ → Firestore เป็น optional sync
✅ CSS variables สำหรับ color — ห้าม hardcode hex
✅ Tailwind CDN สำหรับ prototype — build ผ่าน CLI ก่อนขึ้น production จริง
✅ textContent แทน innerHTML — ป้องกัน XSS
```

---

## 🚫 สิ่งที่ห้ามทำเด็ดขาด
```
❌ ห้าม hardcode API key ในโค้ด
❌ ห้ามเปลี่ยน DB_VERSION โดยไม่ทำ migration
❌ ห้ามแก้ไฟล์ sw.js โดยไม่แจ้งพี่ A ก่อน
❌ ห้ามลบ Glass Badge "by Supasit.A"
❌ ห้ามใช้ font-weight 700 (ใช้ 500 แทน)
❌ ห้ามแก้หลาย feature พร้อมกันใน 1 session
❌ ห้ามใช้ innerHTML กับ user input
❌ ห้ามสร้างไฟล์ใหม่นอก scope โดยไม่ถามก่อน
❌ ห้าม push branch อื่นนอกจาก main โดยไม่แจ้งพี่ A ก่อน
```

---

## 🎨 Brand Identity (บังคับทุกแอป)
```
Glass Badge  : position fixed · bottom-right · "by Supasit.A"
Status Glow  : Green=Online · Amber=Offline · Blue=Syncing pulse
Header       : sticky glass · executive style · brand name
Dark/Light   : toggle บน header · CSS variables
Micro-FX     : fade-in slide-up · hover scale(1.02) · press scale(0.97)
```

---

## 🔧 Tech Constraints
```
CDN Versions (pin เสมอ — ห้าม @latest, เช็ค freshness ก่อนเริ่มโปรเจกต์ใหม่):
  Tailwind : cdn.tailwindcss.com (prototype only)
  Chart.js : cdn.jsdelivr.net/npm/chart.js@4.4.4/...
  Lucide   : unpkg.com/lucide@0.460.0/...
  Firebase : gstatic.com/firebasejs/11.6.0/...

AI Model: gemini-2.5-flash (BYOK — พี่ A ใส่ key เอง, ตรวจรุ่นล่าสุดก่อนใช้จริง)
CORS Proxy: [worker URL] (allowlist โดเมนปลายทางเสมอ — ห้าม open proxy)
```

---

## ✅ Verification Checklist (ทำทุกครั้งก่อน deliver)
```
[ ] Dark/Light mode สลับได้ ไม่มี hardcode color
[ ] ทุก button มี aria-label
[ ] ไม่มี console.error ใน production
[ ] Glass Badge "by Supasit.A" มีครบ
[ ] IndexedDB CRUD ทำงานถูกต้อง
[ ] ไม่มี API key ใน source code
[ ] Responsive ที่ 375/768/1024px
```

---

## 📞 Escalation
ถ้าติดปัญหาหรือไม่แน่ใจ:
1. หยุดแล้วบอกพี่ A ทันที — ห้ามเดาเอง
2. ระบุ Error Type (references/error-handling-and-data.md ของ vibe-coding-core)
3. เสนอ 2–3 วิธีแก้พร้อม trade-off
4. รอ "อนุมัติ" ก่อนดำเนินต่อ
```
