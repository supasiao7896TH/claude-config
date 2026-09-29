# ARCHITECTURE.md — แผนผัง "ห้องเครื่อง" ของ skills/

> ไฟล์นี้อธิบายว่า skill แต่ละตัวใน `skills/` เรียกใช้/ส่งต่อกันอย่างไร
> **ไม่ใช่ skill** (ไม่มี frontmatter) — เป็นเอกสารอ้างอิงสำหรับคน + AI ที่ต้อง "เข้าใจระบบ" ก่อนแก้
> สร้าง 2569-09-29 จากการอ่านไฟล์จริง (ดู "ระดับความมั่นใจ" ท้ายไฟล์)
> ถ้าเพิ่ม/เปลี่ยนความสัมพันธ์ระหว่าง skill → อัปเดตไฟล์นี้ด้วย

---

## 1 · ภาพรวม 3 ชั้น

```
                        ┌────────────────────────────────────────────┐
  ชั้น 1  คำสั่ง         │  /ตรวจ   /preview   /deploy   /rollback  /พัง  │  พี่ A พิมพ์เอง
  (manual only)         │  disable-model-invocation: true ทุกตัว        │  Claude ไม่ trigger เอง
                        └───────────────┬────────────────────────────┘
                                        │ อ่าน checklist / runbook จาก ↓
  ชั้น 2  ความรู้        ┌───────────────▼────────────────────────────┐
  (auto-trigger)        │  vibe-coding-core ⇄ multifile ⇄ firebase     │
                        │        ⇅ workflow ⇄ quality                  │
                        │        cloudflare-workers-deploy             │
                        └───────────────┬────────────────────────────┘
                                        │ มอบงานลงมือให้ ↓
  ชั้น 3  ผู้ลงมือ       ┌───────────────▼────────────────────────────┐
  (subagent)            │ sa-git-manager · sa-code-reviewer            │
                        │ sa-handoff (ผ่าน where-we-stand.md)          │
                        └────────────────────────────────────────────┘
```

---

## 2 · แกน Vibe Coding

```
                    ┌──────────────────────────┐
   "สร้างแอปใหม่" ─►│    vibe-coding-core      │  ← ทางเข้าหลัก
                    │ §1 Step 0: เลือก stack   │
                    │ §2 9 IIFE (single-file)  │
                    │ §8 Security  §16 QA      │
                    │ §17 Deploy Checklist     │
                    └──┬────┬────┬────┬────────┘
       Multi-File      │    │    │    │  ต้อง real-time / หลาย user
       (ค่าเริ่มต้น)    │    │    │    └──────────────┐
                       ▼    │    │                   ▼
        ┌──────────────────┐│    │        ┌────────────────────┐
        │vibe-coding-      ││    │        │vibe-coding-firebase│
        │multifile §21     ││    │        │ §20 Firestore/Auth │
        │Vite+ESM+Vitest   ││    │        └─────────┬──────────┘
        └───┬──────────────┘│    │                  │
            │ เลือกที่ deploy│    │ Step 5a TDD      │
            ▼               │    ▼                  ▼
   ┌────────────────────┐   │ ┌─────────────────┐  ┌──────────────────────┐
   │cloudflare-workers- │◄──┼─┤vibe-coding-     │  │(ใช้ cloudflare ตัว   │
   │deploy              │   │ │quality §25      │  │ เดียวกัน)            │
   └────────────────────┘   │ │DoD, test, CI/CD │  └──────────────────────┘
                            │ │rollback-runbook │
   สร้างเสร็จ / แก้ต่อ       │ └─────────────────┘
                            ▼
                ┌──────────────────────┐
                │ vibe-coding-workflow │  §18 session hygiene · CLAUDE.md template
                │ แก้บัก / iterate      │  §19 keywords · §23 Loop Engineering
                │ (แอปที่มีอยู่แล้ว)     │  §24 context.md / agents.md template
                └──────────────────────┘
```

| Skill | ใช้เมื่อ | ไม่ใช้เมื่อ |
|---|---|---|
| `core` | สร้างแอปใหม่ · Blueprint · Design · Security | แก้บักแอปเดิม → `workflow` |
| `multifile` | stack ค่าเริ่มต้น (Vite + ES Modules) | เครื่องมือใช้ครั้งเดียวทิ้ง → `core` §2 |
| `firebase` | real-time / multi-user / FCM | แอป local-first ล้วน |
| `workflow` | iterate / debug ใน session | สร้างใหม่ → `core` |
| `quality` | test · CI · rollback · Definition of Done | ออกแบบ UI |
| `cloudflare-workers-deploy` | ขึ้น URL จริง | — |

### Step 0–7 ของ `core` §1 (flow เดียวกันทั้ง 2 stack)

```
Step 0  เลือก stack ─► Multi-File (ค่าเริ่มต้น) / Single HTML (ข้อยกเว้น: ใช้ครั้งเดียวทิ้ง)
Step 1  ถามอุปกรณ์เป้าหมาย
Step 2  ASCII Mockup
Step 3  Blueprint (references/blueprint-template.md)
Step 4  ⛔ รอคำว่า "อนุมัติ"
Step 5  5a เทสต์ก่อน (Red) → 5b เขียน logic (Green)      [quality §25.7]
Step 6  สร้าง context.md + agents.md + CLAUDE.md → sa-git-manager commit/push
Step 7  npm ci && npm run check ต้องเขียว
```

---

## 3 · Pipeline ไอเดีย → production

```
 ไอเดีย ─► [core §1 Step 0-4] ─► "อนุมัติ" ─► Step 5-7 (เขียนโค้ด/เทสต์)
                                                  │
        ┌─────────────────────────────────────────┘
        ▼
 ┌─────────┐  npm run check เขียว?   ┌──────────────────┐
 │ /ตรวจ   │ ───────── ✅ ─────────► │ sa-code-reviewer │  ต้องไม่เหลือ 🔴
 └─────────┘  ❌ แก้โค้ด ห้ามแก้เทสต์  └────────┬─────────┘
                                              ▼
 ┌──────────┐  sa-git-manager สร้าง branch+PR → URL เปิดบนมือถือจริง
 │ /preview │  (ไม่มี URL ถ้า check แดง — ไม่ใช่ทางลัดข้าม gate)
 └────┬─────┘
      ▼
 ┌──────────┐  ① /ตรวจ เขียว  ② เคย /preview แล้ว  ③ รู้คำสั่ง rollback แล้ว
 │ /deploy  │  ④ รัน core §17 (หรือ checklist ของ multifile / cloudflare)
 └────┬─────┘
      ▼
  PRODUCTION ── พัง? ─► /พัง (ไล่ root cause)   หรือ   /rollback
                                                          │
                     ┌────────────────────────────────────┘
                     ▼
        เช็ค DB_VERSION (bump แล้ว = ห้ามย้อน!) → wrangler deployments list
        → พี่ A ยืนยัน → ย้อน → เปิด GitHub issue → เขียนเทสต์กันเกิดซ้ำ
```

**ลูกโซ่บังคับ:** `/deploy` → ต้องผ่าน `/ตรวจ` → ต้องเคย `/preview` → ต้องอ่าน
`vibe-coding-quality/references/rollback-runbook.md` (ไฟล์เดียวกับที่ `/rollback` อ่าน)

---

## 4 · Subagent ที่ผูกกับ skill

| Agent | ถูกอ้างถึงใน | หน้าที่ |
|---|---|---|
| `sa-git-manager` | core (Step 6) · workflow (§18) · `/preview` · `/rollback` · rollback-runbook · quality | commit / branch / PR · สแกน secret · ห้าม force-push |
| `sa-code-reviewer` | `/ตรวจ` · `/deploy` · workflow · quality · blueprint-template | ตรวจสิ่งที่เทสต์ไม่ครอบคลุม |
| `sa-handoff` | `quality/references/where-we-stand.md` | ส่งต่องานข้ามเครื่อง |

`sa-architect` · `sa-debugger` · `sa-explore` · `sa-summarizer` **ไม่ถูกอ้างถึงในไฟล์ skill ใดเลย**
(อยู่ใน `CLAUDE.md`/`USER.md` เท่านั้น) และ `/พัง` ทำ Debug Mode เองโดยไม่เรียก `sa-debugger`

---

## 5 · สาย PTA (โรงงาน GC-M PTA) — แยกจากสาย Vibe Coding

```
                    ┌───────────────────────┐
                    │  pta-plant-reference  │ ◄── context กลาง (ทุกตัวชี้กลับมาที่นี่)
                    └───────────┬───────────┘
        ┌──────────┬────────────┼────────────┬───────────────┐
        ▼          ▼            ▼            ▼               ▼
  process-      exapilot-    pi-datalink-  industry-      safety-
  diagnostic    logic        excel         insight        observation
  (หน้างาน/DCS) (Logic)      (PI→Excel)    (ภาพใหญ่)      (Lotus Notes ≤5 บรรทัด)
        │                                     │                │
        └────────────► ส่งต่อเมื่อจะทำเป็น Kaizen ◄────────────┘
                              ▼
                   pta-kaizen-writer (Report Card 7 หัวข้อ)
                     ├──► pta-ips-writer   (IPS Before/After บน Lotus)
                     └──► star-kaizen      (STAR concept / ประกวด)
```

หลัก: `pta-plant-reference` เป็นฐาน · แต่ละ skill มีกฎ "ไม่ใช้กับ X → ไปใช้ Y" กันชนกัน
สายนี้ **ไม่เรียกสาย Vibe Coding** (คำว่า deploy/ตรวจ/พัง ที่ปรากฏใน skill พวกนี้เป็นคำทั่วไป ไม่ใช่การเรียก `/ตรวจ` `/พัง`)

## 6 · สายอิสระอื่นๆ

```
 vi-analysis ⇄ technical-timing   ต้องผ่าน VI Scorecard ก่อนจับจังหวะเข้าซื้อ ·
                                  technical-timing ห้ามใช้ตัดสินใจขาย
 thai-civil-criminal-law          เดี่ยว + references/ 3 ไฟล์ (แพ่ง · อาญา · ขั้นตอน/escalation)
 grill-with-docs ─► grilling + domain-modeling
                                  สัมภาษณ์เจาะแผน + จดศัพท์/ADR ไปด้วย
```

## 7 · สิ่งที่ไม่อยู่ใน git

`skills/synced/` = สำเนาที่ sync มาจาก claude.ai (46 โฟลเดอร์) — **ถูก ignore** ไม่ซิงค์ข้ามเครื่องผ่าน GitHub
ไม่ถือเป็นส่วนของแผนผังนี้

---

## 8 · ⚠️ Known Drift — เอกสารเก่ากับ default ใหม่ (Multi-File, 2569-09-02)

ตรวจเมื่อ 2569-09-29 โดยอ่าน `core` + `multifile` เต็ม และเทียบกับ `design-lab/starter-multifile/` จริง
**ยังไม่ได้แก้** — รอพี่ A อนุมัติ

### 🔴 กระทบการทำงานจริง (ขัดกับของจริง)

| # | ที่ | เขียนว่า | ความจริงใน `starter-multifile` |
|---|---|---|---|
| D1 | `rollback/SKILL.md:26` · `rollback-runbook.md` ข้อ 3 | ต้อง bump `CACHE_NAME` (v7→v8) ทุกครั้ง "ห้ามข้าม" | ไม่มี `sw.js`/`CACHE_NAME` เลย — `vite-plugin-pwa` (generateSW) สร้างให้เอง; `multifile` §21 บอกตรงๆ ว่า "ไม่ต้อง bump CACHE_NAME มือ" → ขั้นตอนนี้ใช้ได้เฉพาะ Single HTML |
| D2 | `core` §17 บรรทัด 423 · `cloudflare-workers-deploy` บรรทัด 195 · `firebase` บรรทัด 47 | bump `CACHE_NAME` ทุกครั้งที่แก้โค้ด | เหมือน D1 |
| D3 | `ตรวจ/SKILL.md:16` | ไม่มี `package.json` → copy จาก `design-lab/starter/` | `starter/` คือ single-file; ค่าเริ่มต้นคือ `starter-multifile/` |
| D4 | `core` บรรทัด 278, 396 · `core/references/design-system.md` · `layout-and-brand.md` · `workflow/references/context-templates.md` · `quality/SKILL.md` | "แอปใหม่ทุกตัวเริ่มจาก `design-lab/starter/`" | ขัดกับ `core` Step 5 + `multifile` ("copy `starter-multifile`") |
| D5 | `core` Step 7 บรรทัด 173 | ชุด quality "มาจาก `design-lab/starter/`" | multi-file มีชุดเทียบเท่าใน `starter-multifile/` |
| D6 | `core` Step 6 "ผลลัพธ์ที่พี่ A จะได้" (บรรทัด 185–192) | `index.html · manifest.webmanifest · sw.js` | Multi-File ได้ `src/ · package.json · vite.config.js · .github/workflows/` — ผังนี้เป็นของ Single HTML |

### 🟡 ไม่ตรงกันเอง / ตัวเลข

| # | ที่ | รายละเอียด |
|---|---|---|
| D7 | `พัง/SKILL.md:21` | "9 IIFE modules" — Multi-File เป็น ES module (ควรเขียนกลางๆ "9-module pattern") |
| D8 | `multifile` | ตาราง Tech Stack + Playbook + CLAUDE.md template เรียก job `build-and-test` แต่ตัวอย่าง ci.yml และไฟล์จริงชื่อ job `check` |
| D9 | `multifile` บรรทัด 90–91 | อ้าง "7 โมดูล ES" — ไฟล์จริงมี 8 ไฟล์ใน `src/modules/` (app-config, app-core, chart-theme, cloud-sync-manager, debug-module, state-store, storage-engine, ui-renderer) |
| D10 | `core` | header ระบุ v7.2 แต่ footer v7.1 · `multifile` header v1.3 แต่ footer v1.2 |
| D11 | `core` บรรทัด 28 | Related skills ระบุ `vi-analysis (§22)` — ไม่เกี่ยวกับ Vibe Coding และเนื้อ `core` ไม่ได้อ้างถึงจริง |

### ✅ ตรวจแล้ว "ไม่ใช่ปัญหา" (ข้อสังเกตข้อ 1 เดิม)

`core` §2 ระบุชัดว่า "Single HTML File เท่านั้น" และ Step 0 บอกว่า Multi-File ใช้ 9-module pattern แบบ ES module
→ การอ้าง IIFE ใน `core` ไม่ขัดกับ default ใหม่ · มีแค่ D7 ที่หลุดใน `/พัง`

### เหตุที่เป็นแบบนี้ (สมมติฐาน — ไม่ใช่ข้อเท็จจริงยืนยัน)

การพลิก default เมื่อ 2569-09-02 แก้ส่วน "ตัดสินใจเลือก stack" ครบ (Step 0, Decision Table, description)
แต่ส่วนลึกที่ยังอ้าง `starter/` และ `CACHE_NAME` ยังเขียนจากมุมของ single-file ทั้งหมด

---

## 9 · ระดับความมั่นใจ

| ส่วน | อ่านเต็ม | อ่านบางส่วน (description/หัวข้อ/grep) |
|---|---|---|
| `deploy` `preview` `rollback` `ตรวจ` `พัง` `grilling` `grill-with-docs` | ✅ | |
| `vibe-coding-core` · `vibe-coding-multifile` | ✅ | |
| `starter-multifile/` (โครงสร้างไฟล์) | | ✅ ดูรายชื่อไฟล์ + grep |
| `workflow` · `quality` · `firebase` · `cloudflare-workers-deploy` | | ✅ |
| skill สาย PTA · ลงทุน · กฎหมาย | | ✅ (ความสัมพันธ์มาจาก grep + description) |

ตัวเลขการอ้างอิงจาก grep บางส่วนเป็นคำทั่วไป (เช่น "ตรวจ" ใน `thai-civil-criminal-law`) ไม่นับเป็นการเรียก skill
