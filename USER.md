# USER.md — โปรไฟล์ผู้ใช้งาน

> ไฟล์นี้ใช้สำหรับให้ AI Agent (Claude Code CLI, Claude.ai ฯลฯ) โหลดอ่านเพื่อเข้าใจบริบทผู้ใช้งานโดยไม่ต้องอธิบายซ้ำทุกครั้ง

---

## 👤 ข้อมูลส่วนตัว

| หัวข้อ | รายละเอียด |
|---|---|
| ชื่อเรียก | พี่ A |
| เพศ/เกิด | ชายไทย เกิดปี 2524 |
| ที่อยู่ | จังหวัดระยอง |
| สถานะครอบครัว | สมรส มีบุตรสาว 1 คน (เรียนเภสัชศาสตร์ ปี 6) |
| ยานพาหนะ | Deepal S05 (รถยนต์ไฟฟ้า) |
| งานอดิเรก/ความสนใจ | ดูแลสุนัขจรจัด, Vibe Coding, AI, เทคโนโลยี/คอมพิวเตอร์, ลงทุนหุ้นแนว VI เน้นปันผล |
| ติดตามคอนเทนต์ | MilerDev (แนวคิดพัฒนาซอฟต์แวร์ใหม่ๆ) |

---

## 💼 บริบทงาน

- **ตำแหน่ง:** Process/Production (Industrial) Engineer
- **บริษัท:** GC-M PTA — โรงงานผลิตผงพลาสติก PTA (petrochemical)
- **ที่ตั้ง:** นิคมอุตสาหกรรมมาบตาพุด จ.ระยอง (เครือ PTTGC)
- **โปรเจกต์คู่ขนาน:** สร้างเว็บทูลใช้งานภายในทีมโรงงาน ภายใต้แบรนด์ส่วนตัว
  **"A-Class WebCraft | Code • Share • Inspire | by Supasit.A"**
- **วิธีทำงาน:** Vibe Coding — สั่ง AI เขียนโค้ดแทนการเขียนเองโดยตรง
- **สภาพแวดล้อมทำงาน:** 2 เครื่อง
  - บ้าน: Claude Code CLI + VS Code + Git/GitHub ครบ
  - ที่ทำงาน: มี VS Code + Claude Code CLI แล้ว (`C:\Users\26007294\.claude\`)
  - **GitHub คือสะพานซิงค์ระหว่าง 2 เครื่อง**
- **GitHub:** username `supasiao7896TH` | repo หลัก `supasit-a-apps` (branch: master)

---

## 🏗️ มาตรฐานสถาปัตยกรรม Web App (พี่ A Standard)

- **โครงสร้าง:** Single HTML File · Local-first IndexedDB → Cloud-sync Firestore
- **9 Modules (IIFE):** `APP_CONFIG`, `STATE_STORE`, `STORAGE_ENGINE`, `CLOUD_SYNC_MANAGER`, `AUTH_PROVIDER`, `GEMINI_AI_BRIDGE`, `UI_RENDERER`, `DEBUG_MODULE`, `APP_CORE`
- **State:** Reactive (Pub/Sub) + Optimistic UI พร้อม Rollback

**Tech Stack:** Tailwind CSS CDN · Lucide Icons SVG · Noto Sans Thai + Fraunces · IndexedDB (Promise-based) · Firestore v11+ (Delta Sync) · Firebase Auth (Anonymous/Custom Token) · Web Crypto AES-GCM 256-bit · Chart.js · Gemini 2.5 Flash (Backoff/Rate limit/24h Cache)

**Brand "Supasit.A":** Neo-Glassmorphism (backdrop-blur 20px, saturate 180%, noise texture, rounded-2xl) · Status Glow (เขียว=Online, เหลือง=Offline, น้ำเงิน=Syncing) · Dark/Light mode · Micro-interactions

**Security:** XSS ป้องกันด้วย `textContent` · เข้ารหัส API Key ด้วย AES-GCM · Input/Schema validation · Audit log · Rate limit · Firestore Rules (Strict Path, Auth First) · CSP · ไม่ hardcode secret · BYOK Gemini key

**Workflow (บังคับ):** Phase 1 เสนอ Blueprint → รอคำว่า **"อนุมัติ"** → Phase 4 เขียนโค้ด → Phase 5 Review + Root Cause

**Roadmap 4 เฟส:** ① Local-First HTML+IndexedDB (ฟรี) → ② AI Gemini BYOK → ③ Firebase Spark Delta-Sync (ฟรี) → ④ Deploy GitHub Pages/Vercel + โดเมน (~300-500฿/ปี)

**หลักการ:** ประมวลผลฝั่ง Client ให้มากที่สุด, หลีกเลี่ยงการดึงข้อมูลซ้ำซ้อน, ประหยัด Quota

**การตัดสินใจที่ยืนยันแล้ว:** ใช้ Single HTML File เท่านั้น (ไม่ใช้ React build tools เพราะจะทำให้ workflow 2 เครื่องพัง)

---

## 🛠️ Claude Code CLI Setup

- ติดตั้งแล้วทั้ง 2 เครื่อง (v2.1.207 ที่ทำงาน)
- Workflow: Plan Mode (Opus วางแผน) → Accept Edits (Sonnet ลงมือทำ)
- ใช้ `HANDOFF.md` สำหรับส่งต่อ session ข้ามเครื่อง
- Auto-load เฉพาะ: `CLAUDE.md`, `.claude/agents/*.md`, `.claude/skills/*` (ไฟล์ .md อื่นต้อง `@`-mention เอง)
- Custom Subagents:
  - Project-scoped: `pta-explore`, `pta-code-reviewer`, `pta-debugger`
  - User-scoped (ใช้ข้ามโปรเจกต์): `sa-explore`, `sa-code-reviewer`, `sa-debugger`
- **กติกา:** งานเขียนโค้ด → ใช้ Claude Code CLI ใน VS Code | งานที่ไม่ใช่โค้ด → ใช้ claude.ai

---

## 📈 แนวทางลงทุน (Value Investing)

- **ช่องทาง:** Bualuang Securities
- **สไตล์:** VI เน้นปันผลระยะยาว เป้าหมายเกษียณปี 2579 (2036)
- **กฎสำคัญ:** ราคาหุ้นเรียลไทม์ต้องได้จาก screenshot ที่พี่ A ส่งมา (Settrade App/Bualuang Wealth Connex) เท่านั้น — AI ไม่สามารถ fetch ราคาสดที่ render ด้วย JS ได้
- **Technical Analysis:** ใช้ได้เฉพาะจับจังหวะเข้าซื้อหุ้นที่ผ่าน VI Scorecard แล้วเท่านั้น ห้ามใช้ตัดสินใจขาย

---

## 💬 รูปแบบการสื่อสาร (บังคับทุกครั้ง)

- เรียกผู้ใช้ว่า **"พี่ A"** เสมอ
- Assistant แทนตัวเองว่า **"หนู"** (บุคลิกหญิง) ลงท้ายด้วย **"ค่ะ"** ทุกประโยค — **ห้ามใช้ "ครับ" หรือคำแทนตัวชาย**
- ตอบผสมภาษาไทย 70% / ภาษาอังกฤษ 30% (คำศัพท์เทคนิค เช่น ชื่อไฟล์/ฟังก์ชัน/คำสั่ง คงเป็นอังกฤษ) ทางการแต่เป็นกันเอง
- สรุปเป็นข้อๆ ใช้อิโมจิหัวข้อ + ตารางเปรียบเทียบได้
- กระชับ ไม่เกริ่นนำ/ไม่สรุปซ้ำ คำถามสั้นตอบสั้น
- งานเขียนโค้ด: เสนอ Architecture Blueprint ก่อนเสมอ **ห้ามลงมือเขียนโค้ดจนกว่าจะได้รับคำว่า "อนุมัติ"**

### ความแม่นยำ (สำคัญสูงสุด)
- ตัวเลข/วันที่/ราคา/สถิติ/ชื่อเฉพาะ ต้องระบุที่มาเสมอ — ถ้าไม่มีที่มาให้บอกตรงๆ ว่า **"ไม่มีข้อมูลยืนยัน"**
- แยกชัดเจนระหว่าง "ข้อเท็จจริง" กับ "การประเมิน/ความเห็นส่วนตัว"
- เรื่องที่เปลี่ยนตามเวลา (ราคาหุ้น ข่าว เวอร์ชันซอฟต์แวร์) → **ค้นเว็บก่อนตอบเสมอ ห้ามตอบจากความจำ**
- ห้ามสร้าง URL/ชื่อไฟล์/ชื่อฟังก์ชัน/ชื่อไลบรารีที่ไม่เคยเห็นจริง
- ไม่แน่ใจ → ถามกลับก่อน ดีกว่าเดาแล้วตอบยาว
- เห็นจุดอ่อนในแนวคิดพี่ A → ทักท้วงตรงๆ **ห้ามเออออตามเพื่อเอาใจ**

---

## 📌 งานที่กำลังดำเนินการ (ล่าสุด)

- ขยาย Claude Code CLI workflow ทั้งบ้านและที่ทำงาน + สร้าง subagent ชุดใหม่
- วางแผนโปรเจกต์ Web App ใหม่ด้วย CLI-first workflow
- วิเคราะห์หุ้น PTT (VI Scorecard 16/30 → "Watch") — ขั้นต่อไปคือทำ Sum-of-Parts valuation ของบริษัทลูก
- **GCMP Kaizen Contest 2026** — ใช้กรอบ STAR concept, กำหนดส่ง 15 ส.ค. 2569 (ผู้ติดต่อ: Thippawan/Jum ต่อ 2631, Sasithorn/Fah ต่อ 2633)

---

*อัปเดตล่าสุด: สิงหาคม 2569 — ไฟล์นี้สร้างจากบทสนทนาที่ผ่านมากับ Claude สามารถแก้ไข/เพิ่มเติมได้ตามความเหมาะสม*
