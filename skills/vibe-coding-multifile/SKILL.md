---
name: vibe-coding-multifile
description: >
  Multi-File Stack Skill สำหรับ Vibe Coding ของ Supasit.A — ใช้เมื่อพี่ A ต้องการ
  ย้ายโปรเจกต์เดิมจาก Single HTML File ไปเป็นหลายไฟล์ (Vite + ES Modules +
  Vitest + GitHub Actions CI/CD), ต้องการเริ่มโปรเจกต์ใหม่เป็น multi-file ตั้งแต่
  แรก, หรือพูดถึงคำว่า "แยกไฟล์", "แยกโค้ด", "Vite", "ES Modules", "npm run dev",
  "unit test"/"Vitest", "CI/CD" ตรงๆ กับโปรเจกต์ที่เป็น web app ก็ใช้ skill นี้
  ก่อนเสมอเพื่อเช็คว่าจำเป็นต้องย้ายจริงไหม (ดู Decision Table) แล้วค่อยวางแผน
  ย้าย — ไม่ใช้กับโปรเจกต์ที่จะคงเป็น Single HTML File ต่อ (ให้ใช้
  vibe-coding-core ตามมาตรฐานเดิม)
---

# Vibe Coding Multi-File — Supasit.A Skill

> **Scope:** Vite + ES Modules · Vitest · GitHub Actions CI/CD · Single-File → Multi-File Migration
> **ใช้เมื่อ:** จะย้ายโปรเจกต์เดิมออกจาก Single HTML File, หรือเริ่มโปรเจกต์ใหม่แบบ multi-file ตั้งแต่ต้น
> **ใช้ร่วมกับ:** vibe-coding-core (§2 module pattern ยังใช้ได้ แค่เปลี่ยน "1 IIFE" เป็น "1 ไฟล์") · vibe-coding-workflow (§18 session hygiene) · cloudflare-workers-deploy (deploy จริง)

| | |
|---|---|
| **Version** | 1.0 |
| **Updated** | 2026-08 |
| **Brand** | A-Class WebCraft · Code • Share • Inspire · by Supasit.A |
| **Sections in this file** | §21 |
| **Related skills** | `vibe-coding-core` (§1–17) · `vibe-coding-workflow` (§18–19, §23–24) · `cloudflare-workers-deploy` |
| **Derived from** | Migration จริงของโปรเจกต์ `Monitor-Quality-PTA` (2026-08-08) — ดู `README.md` "Session Log" ของโปรเจกต์นั้นสำหรับเคสอ้างอิงเต็ม |

---

## § 21 · Multi-File Stack (Vite + ES Modules)

> **WHY มี skill นี้แยก:** มาตรฐานเดิมของพี่ A คือ **Single HTML File เท่านั้น** (ดู USER.md) — ตัดสินใจแบบนี้เพราะทำให้ workflow 2 เครื่อง (บ้าน/ที่ทำงาน) ง่าย ไม่ต้องมี build step
> แต่เมื่อโค้ดยาวเกิน ~1,000 บรรทัดในไฟล์เดียว หรือพี่ A อยากมี automated test คุ้มครอง business logic ที่เคยพังมาก่อน มาตรฐานเดิมเริ่มไม่พอ — skill นี้คือทางเลือกที่ยัง**ใช้ได้ที่เครื่อง Office ที่ไม่มีสิทธิ์ admin ติดตั้ง Node.js** เพราะให้ GitHub Actions เป็นคนรัน `npm`/`vite`/`wrangler` แทน ไม่ใช่เครื่อง local

### Decision Table — ยังใช้ Single HTML File อยู่ หรือย้ายมา Multi-File?

```
คำถาม                                              → Stack
─────────────────────────────────────────────────────────────────────
โค้ดยังสั้น (< ~800 บรรทัด), แอปใช้คนเดียว/ทีมเล็ก  → Single HTML File (vibe-coding-core มาตรฐานเดิม)
ไม่มีแผนจะเขียน automated test                      → Single HTML File
โค้ดยาวจนแก้ยาก / หา bug ยาก ในไฟล์เดียว             → Multi-File (skill นี้)
เคยมี bug จริงใน business logic ที่อยากกัน regression → Multi-File + Vitest (skill นี้)
อยากมี CI ตรวจ build/test อัตโนมัติก่อน deploy       → Multi-File + GitHub Actions (skill นี้)
เครื่องที่ใช้งานไม่มีสิทธิ์ install Node.js เอง        → ยังทำได้! ดู "ข้อจำกัด No-Admin" ด้านล่าง
```

> **ข้อควรรู้:** การย้ายมา multi-file เพิ่มความซับซ้อนของ workflow จริง (ต้อง `npm install`, เข้าใจ build step, อ่าน error จาก CI แทนเปิด browser ตรงๆ) — เป็น **tradeoff ที่ต้องแลกกับ code quality** ไม่ใช่ default ที่ควรทำทุกโปรเจกต์ ถ้าพี่ A ไม่แน่ใจว่าคุ้มไหม ให้ถามก่อนเริ่มย้าย

### ข้อจำกัด "No-Admin" ที่ทำให้ stack นี้ยังใช้ที่ Office ได้

```
ปัญหา: เครื่อง Office ไม่มีสิทธิ์ admin → ติดตั้ง Node.js/npm ในเครื่องไม่ได้ (เจอ UAC popup)

ทางแก้: ให้ GitHub Actions รัน npm/vite/vitest/wrangler บน cloud runner แทนทั้งหมด
        เครื่อง Office มีแค่ Git + Claude Code CLI ก็พอ — แค่ git push ก็จบ

ผลคือ:
  - เครื่องบ้าน (มี Node.js): ใช้ npm run dev ทดสอบ local ได้ตามปกติ
  - เครื่อง Office (ไม่มี Node.js): แก้โค้ดผ่าน Claude Code ตรงๆ, push ขึ้น GitHub,
    แล้วดูผล build/test จากแท็บ "Actions" บน GitHub แทนการรันเองในเครื่อง
  - GitHub คือสะพานซิงค์เหมือนเดิม (ตาม USER.md) — ไม่มีอะไรเปลี่ยนตรงนี้
```

### Tech Stack มาตรฐาน

| หมวด | เทคโนโลยี | หมายเหตุ |
|---|---|---|
| Build tool | **Vite** | dev server + hot reload + production build |
| Module system | **ES Modules** (`import`/`export`) | ไม่ใช้ TypeScript — ใช้ JSDoc comment แทนถ้าต้องการ type hint |
| Unit test | **Vitest** | เขียนเทสต์เฉพาะ business logic ที่เคยมี bug จริง หรือมี logic ซับซ้อนพอจะพังเงียบๆ ได้ — ไม่ต้อง 100% coverage |
| CI | **GitHub Actions** (`build-and-test` job) | รันทุก push/PR: `npm ci` → `npm run build` → `npm test` |
| CD | **GitHub Actions** (`deploy` job) | รันเฉพาะ push เข้า `main` **และ** ต่อเมื่อ `build-and-test` ผ่านเท่านั้น |
| Deploy target | Cloudflare Workers *หรือ* GitHub Pages | ดู `cloudflare-workers-deploy` skill สำหรับ setup เต็ม |
| Third-party libs | ยังโหลดผ่าน CDN `<script>` ใน `index.html` เหมือนเดิมได้ | ไม่บังคับย้ายเป็น npm import — ดู "สิ่งที่ไม่ต้องแตะ" ด้านล่าง |

### โครงสร้างไฟล์มาตรฐาน

```
project/
├── index.html              # markup/modal ทั้งหมด — CDN <script> tags อยู่ตรงนี้
├── src/
│   ├── main.js              # entry point — เดิมคือ APP_CORE ใน Single HTML File
│   └── modules/
│       ├── app-config.js    # 1 module = 1 ไฟล์ = 1 exported const-object namespace
│       ├── storage-engine.js
│       ├── ui-renderer.js
│       └── ...               # เลือกเท่าที่ใช้ ไม่บังคับครบ 9 (เหมือน vibe-coding-core §2)
├── tests/
│   └── *.test.js            # Vitest — เฉพาะ business logic ที่เคยพัง/ซับซ้อน
├── package.json
├── vite.config.js           # ถ้าต้องปรับ default (ส่วนใหญ่ไม่ต้องมีไฟล์นี้เลยก็ได้)
├── wrangler.jsonc           # ถ้า deploy ขึ้น Cloudflare Workers
└── .github/workflows/ci.yml
```

### IIFE Module → ES Module — วิธีแปลง

> หลักการ 1 module = 1 namespace ยังเหมือน `vibe-coding-core` §2 ทุกอย่าง เปลี่ยนแค่ "1 IIFE ในไฟล์เดียว" เป็น "1 `export const` ในไฟล์ของตัวเอง" — ไม่ต้องคิด pattern ใหม่

```javascript
// ❌ เดิม (Single HTML File, รวมกันใน app.js)
const STORAGE_ENGINE = (() => {
  'use strict';
  async function _open() { /* ... */ }
  return {
    async get(key) { return _open().then(db => db.get(key)); }
  };
})();

// ✅ ใหม่ (src/modules/storage-engine.js — แยกไฟล์)
async function _open() { /* ... */ }

export const StorageEngine = {
  async get(key) {
    const db = await _open();
    return db.get(key);
  }
};
```

```javascript
// src/main.js — import โมดูลที่ต้องใช้ตรงๆ (ไม่มี DI container/build-time magic)
import { StorageEngine } from './modules/storage-engine.js';
import { UIRenderer } from './modules/ui-renderer.js';

// index.html ยังใช้ inline onclick="..." แบบเดิมได้ — ES module ไม่ auto-global
// ต้อง attach function ที่ HTML เรียกใช้ลง window เอง ท้าย main.js:
window.saveAction = ActionLogUI.save;
```

> **จุดที่ต้องระวังเสมอ:** ES module ไม่ expose ตัวแปรออกไป global scope โดยอัตโนมัติเหมือน `<script>` ธรรมดา ถ้า `index.html` ยังมี `onclick`/`onchange` inline attribute อ้างชื่อฟังก์ชัน ต้องแนบ `window.foo = ...` ท้าย `main.js` ให้ครบ ไม่งั้นปุ่มจะกดไม่ทำงานเงียบๆ

### สิ่งที่ไม่ต้องแตะตอนย้าย (ลดความเสี่ยง)

```
✅ CDN libraries เดิม (Tailwind, SheetJS/XLSX, Chart.js, Lucide, html2pdf.js ฯลฯ)
   ยังโหลดผ่าน <script> ใน index.html เหมือนเดิมได้ — module ที่ใช้ต้องประกาศ
   /* global XLSX, lucide */ แทนการ import จาก npm
   WHY: ย้าย CDN libs เป็น npm import พร้อมกับแยกไฟล์ = เปลี่ยน 2 อย่างพร้อมกัน
        ถ้าพัง จะแยกไม่ออกว่าพังเพราะแยกไฟล์หรือเพราะเปลี่ยน import — ทำทีละอย่าง

✅ IndexedDB schema / DB_VERSION เดิม — ไม่ต้อง migrate ข้อมูลผู้ใช้เดิม
   การแยกไฟล์เป็นเรื่อง "โค้ดจัดยังไง" ไม่ใช่เรื่อง "ข้อมูลเก็บยังไง"
```

### Migration Playbook — ย้ายจาก Single HTML File มา Multi-File

```
1. READ ก่อนแตะโค้ด
   - อ่านไฟล์ app.js/index.html เดิมทั้งหมด ระบุ IIFE module ที่มีอยู่กี่ตัว
   - list business logic ที่เคยมี bug จริงมาก่อน (จาก PROGRESS.md/HANDOFF.md ถ้ามี)
     → นี่คือ candidate อันดับแรกสำหรับเขียน Vitest

2. ตั้ง tooling ก่อนแยกไฟล์
   - npm init, ติดตั้ง vite + vitest (devDependencies)
   - เพิ่ม scripts ใน package.json: dev / build / preview / test / test:watch
   - ยืนยัน `npm run dev` เปิดแอปเดิมได้ปกติ ก่อนเริ่มแยกไฟล์จริง

3. แยกทีละ module ไม่ใช่ทีเดียวหมด
   - เริ่มจาก module ที่ dependency น้อยสุด (เช่น APP_CONFIG) ไล่ไปจนถึง APP_CORE
   - แยกเสร็จแต่ละไฟล์ → npm run dev เช็คว่ายังพังไหมทันที อย่ารอแยกครบก่อนเทส

4. เขียน Vitest เฉพาะจุดเสี่ยง (ไม่ต้อง 100% coverage)
   - เจาะจง business logic ที่ "เคยพังจริง" หรือ "logic ซับซ้อนจนพังเงียบๆ ได้"
   - ตัวอย่างจริงจาก Monitor-Quality-PTA: baseline drift calculation (self-referential
     bug), spec/warning band parsing (หลาย format ไม่สม่ำเสมอ), success/fail
     determination ของ action log

5. ตั้ง GitHub Actions CI ก่อน deploy
   - job build-and-test รันทุก push/PR (ดู ci.yml ตัวอย่างด้านล่าง)
   - job deploy รันเฉพาะ push เข้า main และต้องรอ build-and-test ผ่านก่อน (needs:)

6. Manual verify ผ่าน browser จริงก่อนลบไฟล์เดิม
   - ทดสอบทุก flow หลักที่แอปมี (ไม่ใช่แค่ที่มี Vitest คุ้มครอง)
   - เปิด Console เช็คไม่มี error สีแดง
   - ต่อเมื่อผ่านครบ ค่อยลบ app.js เดิมทิ้ง — ห้ามลบก่อนยืนยัน

7. อัปเดต CLAUDE.md ของโปรเจกต์ให้ตรงความจริงใหม่
   - commands (npm run dev/test/build แทนการเปิด index.html ตรงๆ)
   - architecture section อธิบายว่าไฟล์ไหนอยู่ตรงไหน ทำหน้าที่อะไร
   - เพิ่ม "History note" อธิบายว่าทำไมย้าย (เช่นเดียวกับที่ทำใน Monitor-Quality-PTA)
```

### GitHub Actions CI/CD — ตัวอย่างจริง (build-and-test + deploy)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm test

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build

      # ถ้า deploy ขึ้น Cloudflare Workers (ดู cloudflare-workers-deploy skill สำหรับ setup เต็ม)
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

> **WHY `needs: build-and-test`:** กัน deploy โค้ดที่ test ไม่ผ่านขึ้น production โดยไม่ตั้งใจ — เป็นจุดที่ Single HTML File เดิมไม่มีทางทำได้เลยเพราะไม่มี test ให้รอผ่าน

### package.json — ตัวอย่างจริง

```json
{
  "name": "project-name",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

### CLAUDE.md — ส่วนที่ต่างจาก Single HTML File (§18.2 ของ vibe-coding-workflow)

```markdown
## Commands
npm install
npm run dev          # Vite dev server with hot reload
npm test             # run all Vitest tests once
npm run build         # production build -> dist/

## Architecture
- src/main.js = entry point (เดิมคือ APP_CORE)
- src/modules/*.js = 1 module ต่อ 1 ไฟล์ (namespace pattern เดิมจาก vibe-coding-core §2)
- CDN libs (Tailwind/XLSX/ฯลฯ) ยังโหลดใน index.html — module ที่ใช้ประกาศ /* global X */

## CI/CD
- build-and-test รันทุก push/PR
- deploy รันเฉพาะ push → main และต้องรอ test ผ่านก่อน (ดู .github/workflows/ci.yml)
- งานที่ push ตรงเข้า main = ขึ้น production อัตโนมัติเมื่อ test ผ่าน ไม่มี staging แยก
```

### Decision Table — Deploy ไปที่ไหน?

```
คำถาม                                    → ทางเลือก
──────────────────────────────────────────────────────
อยากได้ URL แชร์ให้ทีมใช้ง่ายๆ ไม่ผูก repo → Cloudflare Workers (ดู cloudflare-workers-deploy)
Static site ล้วน ไม่มี server-side logic  → Cloudflare Workers หรือ GitHub Pages ก็ได้
มี Firebase Functions ร่วมด้วย             → ดู vibe-coding-firebase §20 GitHub Actions flow แทน
```

---

*SKILL: vibe-coding-multifile v1.0 | Section: §21*
*Supasit.A × A-Class WebCraft | Code • Share • Inspire*
*Related: vibe-coding-core · vibe-coding-workflow · cloudflare-workers-deploy*
*Derived from: Monitor-Quality-PTA migration (August 2026 / พ.ศ. 2569)*
*Updated: August 2026 (พ.ศ. 2569)*
