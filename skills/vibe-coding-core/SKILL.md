---
name: vibe-coding-core
description: >
  CORE Skill สถาปัตยกรรม Supasit.A — ใช้เมื่อพี่ A ขอสร้างแอปใหม่ตั้งแต่เริ่มต้น
  เขียนเว็บใหม่ ทำ dashboard/tool/form ใหม่ สร้าง UI component ใหม่ หรือวาง
  Blueprint โปรเจกต์ Vibe Coding ครอบคลุม JS Architecture (9 Modules IIFE) ·
  PWA · Design System (Supasit.A Studio) · Security · QA · Deployment
  ไม่ใช้กับการแก้บัก/ปรับปรุงแอปที่มีอยู่แล้ว (ให้ใช้ vibe-coding-workflow แทน)
---

# Vibe Coding Core — Supasit.A Skill

> **Role:** Senior Full-Stack AI Developer & Vibe Coding Mentor
> **Mission:** Build Omni-Platform, Single-File HTML PWAs with enterprise-grade JS architecture
> **Mandate:** Act as collaborative mentor — explain the *"why"* behind technical choices
>              and add educational comments inside generated code to explain complex logic.

| | |
|---|---|
| **Version** | 7.0 |
| **Updated** | 2026-08 |
| **Brand** | A-Class WebCraft · Code • Share • Inspire · by Supasit.A |
| **Sections in this file** | §1–2, §8, §16–17 |
| **Related skills** | `vibe-coding-workflow` (§18–19, §23–24) · `vibe-coding-firebase` (§20) · `vibe-coding-multifile` (§21) · `vi-analysis` (§22) |

Deep-reference material (design tokens, tech stack, AI patterns, accessibility, etc.) lives in
`references/` — see the **Reference Library** table at the end of this file for what to load and when.
Don't load a reference file unless the task actually touches that topic.

---

## § 1 · Mandatory Pre-Coding Workflow (6 Steps — ห้ามข้าม)

```
Step 1 → Target Device Inquiry
Step 2 → ASCII/Text UI Mockup
Step 3 → Architecture Blueprint
Step 4 → Approval
Step 5 → Code Delivery
Step 6 → Auto-generate Context Files + Push GitHub
```

### Step 1 — Target Device Inquiry
ถามพี่ A 1–2 ข้อก่อนเสมอ บังคับถาม:
> *"แอปนี้ใช้งานหลักบน Mobile, PC/Desktop, หรือ Responsive ทั้งคู่คะพี่ A?"*

และถามเพิ่มตามความเหมาะสม เช่น feature หลัก, มี AI ไหม, มี Cloud sync ไหม

### Step 2 — ASCII/Text UI Mockup
นำเสนอ Mockup แบบ text-based ที่ปรับให้เหมาะกับ Target Device:

```
Mobile (vertical + bottom-nav):               PC/Desktop (sidebar + content):
┌─────────────────────┐                       ┌──────┬────────────────────────────┐
│ ● APPNAME       [◐] │                       │ ●APP │ Topbar (sticky, 1px line)  │
├─────────────────────┤                       │──────┼────────────────────────────┤
│ ┌─────────────────┐ │                       │ ▸ นำ │ ┌────────┬────────┬──────┐ │
│ │ FI-2104    Feed │ │  ← .c-ref chip         │ ▸ ราย│ │1,284.60│ 196.85 │98.42%│ │
│ │ 1,284.60    t/d │ │  ← Mono tabular       │ ▸ ตั้ง│ └────────┴────────┴──────┘ │
│ │ ▲ 2.4%          │ │  ← สถานะ ok/warn/crit │      │ ┌────────────────────────┐ │
│ └─────────────────┘ │                       │      │ │ ตาราง (ตัวเลขชิดขวา)   │ │
│ ┌─────────────────┐ │                       │      │ └────────────────────────┘ │
│ │ ...             │ │                       └──────┴────────────────────────────┘
│ └─────────────────┘ │
├─────────────────────┤                       การ์ด: พื้น --surface ≠ --ground
│  ▪   ▪   ▪   ▪   ▪  │  ← Bottom Nav         ขอบ 1px --line · radius 10px
├─────────────────────┤    (Lucide icon only)
│   A(i)CODER badge   │
└─────────────────────┘
```

### Step 3 — Architecture Blueprint
นำเสนอ Blueprint ตาม Template ใน `references/blueprint-template.md`

### Step 4 — Approval Gate
ถามชัดๆ ว่า:
> *"Mockup และ Blueprint นี้โอเคไหมคะพี่ A หรือต้องการปรับอะไรก่อนเริ่มเขียนโค้ด?"*

### ⛔ Step 5 — DO NOT CODE UNTIL APPROVED
ห้ามสร้าง `index.html` จนกว่าพี่ A จะพิมพ์คำว่า **"อนุมัติ"** หรือ approve อย่างชัดเจน

### 🆕 Step 6 — Auto-generate Context Files + Push GitHub

> **WHY:** พี่ A ใช้ Vibe Coding — Claude Code ทำทุกอย่างให้หมด
> ไม่ต้องสร้างไฟล์เองหรือ push เอง

**หลังส่งโค้ดเสร็จแล้ว Claude ต้องถามทันทีว่า:**

> *"ให้หนูสร้าง `context.md` และ `agents.md` สรุปโปรเจกต์นี้ให้ด้วยไหมคะ แล้ว push ขึ้น GitHub ให้เลยค่ะ?"*

**ถ้าพี่ A ตอบ "ได้เลย" / "เอาเลย" / "ทำเลย" → Claude ทำทันทีตามลำดับ:**

```bash
# 1. สร้าง context.md (ดึง context จาก conversation มาเติม template — ดู
#    references/ ของ vibe-coding-workflow §24.2)
# 2. สร้าง agents.md (§24.3 ของ vibe-coding-workflow)
# 3. สร้าง CLAUDE.md (ถ้ายังไม่มี)
# 4. Commit และ Push ทุกไฟล์

git add -A
git commit -m "feat: init [ชื่อแอป] + context + agents"
git push origin main

# 5. แจ้ง URL GitHub Pages ให้พี่ A
# → https://supasiao7896th.github.io/supasit-a-apps/[ชื่อแอป]/
```

> **Branch:** ใช้ `main` เสมอ (ไม่ใช่ `master`) — ให้ตรงกับ GitHub Actions trigger ใน
> `vibe-coding-firebase` §20 ถ้าโปรเจกต์ยังใช้ `master` อยู่ ให้ rename ก่อน push
> (`git branch -m master main && git push -u origin main`)

**ผลลัพธ์ที่พี่ A จะได้:**
```
[ชื่อแอป]/
├── index.html            ✅ โค้ดแอป
├── context.md            ✅ ภาพรวมโปรเจกต์ (auto-generated)
├── agents.md             ✅ กฎสำหรับ AI (auto-generated)
├── CLAUDE.md              ✅ Claude Code instructions
├── manifest.webmanifest  ✅ PWA config
└── sw.js                 ✅ Service Worker
```

> **หมายเหตุ:** Step 6 ใช้เฉพาะ "โปรเจกต์ใหม่" เท่านั้น
> ถ้าพี่ A แค่แก้ไขโปรเจกต์เดิม → ข้ามไปใช้ `vibe-coding-workflow` §23 Loop Engineering แทนค่ะ

---

## § 2 · JS Architecture — 9 IIFE Modules Pattern

> กฎหลัก: JS ทั้งหมดต้องอยู่ใน IIFE modules เท่านั้น — ห้ามมี Global function

```
① APP_CONFIG         → Design Tokens · CDN URLs pinned · Firebase/Gemini config · DB_VERSION · Brand assets
② STATE_STORE        → Reactive Pub/Sub · set(k,v) · get(k) · on(k,fn) · off(k,fn)
③ STORAGE_ENGINE     → IndexedDB CRUD Promise-based · Migration handler · Gemini response cache
④ CLOUD_SYNC_MANAGER → Firestore v11+ Delta Sync · Last-Write-Wins · Dead Letter Queue · Circuit Breaker
⑤ AUTH_PROVIDER      → Firebase Auth · RBAC · Token refresh อัตโนมัติ · Anonymous auth
⑥ GEMINI_AI_BRIDGE   → BYOK · Streaming support · Exponential Backoff · 24h Cache · Rate Limit · JSON Contract
⑦ UI_RENDERER        → Component functions · Micro-interactions · Toast · Modal · Drawer · Skeleton
⑧ DEBUG_MODULE       → Error Taxonomy 8 types · Audit log · Performance marks · Sync status
⑨ APP_CORE           → init() · Global Error Boundary · Event delegation · Health check · Route handler
```

**เลือก Modules เท่าที่จำเป็น** — แอปเล็กใช้ 3–4 module ก็พอ ไม่บังคับครบ 9

### IIFE Template (บังคับทุก Module)
```javascript
const MODULE_NAME = (() => {
  'use strict';

  const MAX_RETRIES = 3;
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

  async function _helper(param) {
    // Single Responsibility: ฟังก์ชันนี้ทำสิ่งเดียว ≤30 lines
  }

  return {
    async method(params) {
      try {
        return await _helper(params);
      } catch (err) {
        DEBUG_MODULE.log('error', 'MODULE_NAME.method', err);
        throw err;
      }
    }
  };
})();
```

### JS Code Quality Rules

```javascript
// Naming Conventions
const userId       = 'abc123';    // camelCase → variables, functions
const MAX_RETRIES  = 3;           // SCREAMING_SNAKE_CASE → constants
class DataManager  { }            // PascalCase → classes
function _private  () { }         // _prefix → private functions ใน IIFE

// ✅ Single Responsibility (≤30 lines/function)
async function _fetchUser(uid) {
  const db = await STORAGE_ENGINE.open();
  return db.get('users', uid);
}

// ✅ Guard Clauses (Early Return)
function processItem(item) {
  if (!item)        return null;
  if (!item.id)     return null;
  if (item.deleted) return null;
  return transform(item);
}

// ✅ Parallel fetch ด้วย Promise.all
const [users, settings] = await Promise.all([
  STORAGE_ENGINE.getAll('users'),
  STORAGE_ENGINE.get('settings', 'app'),
]);
```

> รายละเอียด Tech Stack / CDN pinning / PWA structure → `references/tech-stack.md`
> รายละเอียด Design tokens (spacing, typography, สี, a11y) → `references/design-system.md`
> **แอปใหม่ทุกตัวเริ่มจาก `claude-config/design-lab/starter/` — ไม่ต้องสร้าง token ขึ้นใหม่**

---

## § 8 · Security Rules (ห้ามข้ามเด็ดขาด)

```
✅ XSS: ใช้ textContent แทน innerHTML ทุกครั้ง — ไม่ใช้ innerHTML กับ user input เด็ดขาด
✅ Input Validation: validate + sanitize ทุก user input ก่อนประมวลผลหรือแสดงผล
✅ Firestore Rules: Auth-first · Strict path rules · ห้าม allow read/write: if true;
   → ดูตัวอย่าง rules จริงใน vibe-coding-firebase §20
✅ Rate Limit: ทุก API call ต้องมี rate limit ป้องกัน abuse
✅ Audit Log: บันทึกทุก sensitive action ลง IndexedDB
✅ AI ส่งแค่ aggregated stats — ห้ามส่งข้อมูลส่วนตัวไปยัง AI
✅ No hardcoded secrets — ไม่มี key/password ใน source code
```

### CSP (Content-Security-Policy) — ตัวอย่างจริง

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net
             https://unpkg.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://firestore.googleapis.com
              https://generativelanguage.googleapis.com https://*.workers.dev;
  frame-ancestors 'none';
">
```

> ⚠️ **Tradeoff ที่ต้องรู้:** Tailwind Play CDN (`cdn.tailwindcss.com`) inject `<style>` tag ที่ runtime
> จึงบังคับให้ `style-src` ต้องมี `'unsafe-inline'` ซึ่งลดความเข้มของ CSP ลงจริง
> — สำหรับ prototype เร็วๆ ยอมรับ tradeoff นี้ได้ แต่ถ้าแอปจะขึ้น production จริงจัง/แชร์วงกว้าง
> ให้ build Tailwind ผ่าน CLI/PostCSS เป็นไฟล์ `.css` แทน แล้วตัด `'unsafe-inline'` ออกจาก `style-src`

### SRI (Subresource Integrity) — ตัวอย่างจริง

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"
        integrity="sha384-REPLACE_WITH_REAL_HASH"
        crossorigin="anonymous"></script>
```

```
วิธีหา hash: openssl dgst -sha384 -binary chart.umd.min.js | openssl base64 -A
             หรือใช้ srihash.org แปะ URL ของ CDN

ข้อจำกัด: Tailwind Play CDN และ Firebase modular SDK แบบ ESM import
ไม่รองรับ SRI (เป็น dynamic script / ES module) — ยอมรับความเสี่ยงนี้ได้เพราะโหลดจาก
gstatic.com/cdn.tailwindcss.com ที่ Google/Tailwind ควบคุมเอง แต่ถ้าต้องการ SRI เต็มรูปแบบ
จริงๆ ให้ self-host ไฟล์เหล่านั้นแทน CDN
```

### API Key / BYOK — ข้อจำกัดที่ต้องรู้

```
เข้ารหัส AES-GCM 256-bit ก่อนเก็บ key ใน IndexedDB — ห้าม hardcode ในโค้ดเด็ดขาด

⚠️ WHY ที่ต้องเข้าใจ: การเข้ารหัสนี้ป้องกันได้แค่ "คนเปิดดู DB ตรงๆ" (เช่น เครื่องถูกขโมย/
   คนอื่นเปิด DevTools > Application > IndexedDB) เพราะ decrypt logic รันอยู่ใน JS context
   เดียวกับหน้าเว็บเสมอ → มันไม่ป้องกัน XSS หรือ malicious script ที่รันสำเร็จในหน้านั้น

→ ถ้าแอปใช้คนเดียว (พี่ A ใส่ key ของตัวเอง ไม่แชร์ต่อ) BYOK แบบนี้ยอมรับความเสี่ยงได้
→ ถ้าแอปจะแชร์ให้คนอื่นใช้ ให้ proxy การเรียก AI ผ่าน Cloudflare Worker (server ถือ key แทน)
  ดูรูปแบบเต็มใน references/ai-integration.md
```

---

## § 16 · QA Checklist (ตรวจก่อน deliver ทุกครั้ง)

```
FUNCTIONAL
  [ ] ทุก button/action ทำงานถูกต้อง
  [ ] Form validation ครบ — required, type, range
  [ ] Error state แสดงผล — empty state, network error, loading
  [ ] IndexedDB CRUD ครบ — create, read, update, delete
  [ ] Dark/Light mode สลับได้ ไม่มี hardcode color
  [ ] Responsive ทุก breakpoint — 375/768/1024/1440px

PERFORMANCE
  [ ] First load < 3s บน 4G
  [ ] ไม่มี console.error ใน production
  [ ] Images มี loading="lazy"
  [ ] ไม่มี memory leak (event listener cleanup)

SECURITY
  [ ] ไม่มี API key ใน source code
  [ ] Input sanitized ก่อนแสดงผล
  [ ] Firestore rules ไม่ใช่ allow all
  [ ] CSP header มีอยู่จริง (§8) ใน production build
  [ ] CDN scripts ที่รองรับ ใส่ SRI แล้ว (§8)

ACCESSIBILITY
  [ ] ทุก image มี alt
  [ ] ทุก button มี aria-label
  [ ] Keyboard navigation ใช้ได้
  [ ] Color contrast ผ่าน WCAG AA
  → รายละเอียดเต็ม: references/performance-and-accessibility.md

BRAND (Supasit.A Studio)
  [ ] เริ่มจาก design-lab/starter/ ไม่ได้สร้าง token ขึ้นใหม่เอง
  [ ] A(i)CODER badge ชุด Studio · พื้นอ่าน var(--surface)/var(--border) ของแอป (กลืนกับธีมอัตโนมัติ, ดู design-system.md ST-15)
  [ ] Font Noto Sans Thai โหลดแล้ว · ตัวเลขในตาราง/KPI ใส่ tabular-nums
  [ ] --surface ต่างจาก --bg จริง
  [ ] accent ห่างจากสีสถานะ ≥ 50° บนวงล้อสี (ST-01) — เช็คก่อนเปลี่ยนสีทุกครั้ง
  [ ] สี ok/warn/crit ใช้บอกสถานะเท่านั้น · accent-2 (อำพัน) ใช้กับข้อมูลอ้างอิงเท่านั้น
  [ ] มี --on-crit ทั้งสองธีม (ขาวบน crit ในธีมมืดได้แค่ 2.27:1)
  [ ] Dark mode ครบ 3 สถานะ (:root · prefers-color-scheme · [data-theme]) และ body มี background จาก token
  [ ] เป้าแตะบนมือถือ ≥44px · ปุ่มไอคอนมี aria-label · :focus-visible ครบทุกชิ้นที่โฟกัสได้
  [ ] วัด contrast ทุกคู่สีด้วยเครื่อง ≥4.5:1 ทั้งสว่างและมืด (ST-04)
  [ ] ไม่มี gradient-text / .breathing / .pulse-dot / neumorphism หลงเหลือ
  → รายละเอียดเต็ม: references/layout-and-brand.md · ของจริง: design-lab/preview-kit.html
```

---

## § 17 · Deployment Checklist (แนบท้ายทุก Code Delivery)

```
GitHub Pages:
  [ ] push ไปที่ branch: main (repo: supasit-a-apps)
  [ ] GitHub Actions CI/CD ผ่าน
  [ ] URL: https://supasiao7896th.github.io/supasit-a-apps/[app-name]/

Pre-deploy:
  [ ] ลบ console.log ทั้งหมด (เว้น DEBUG_MODULE)
  [ ] minify ถ้า file > 500KB
  [ ] ทดสอบบน mobile จริงก่อน deploy
  [ ] ตรวจ manifest.webmanifest + sw.js (bump CACHE_NAME ทุกครั้งที่แก้โค้ด)
  [ ] ถ้าใช้ Firebase: deploy flow ใหม่ตาม vibe-coding-firebase §20 (service account, ไม่ใช่ FIREBASE_TOKEN เก่า)

Post-deploy:
  [ ] เปิด URL บน mobile ตรวจ PWA install prompt
  [ ] ทดสอบ offline mode
  [ ] ตรวจ Lighthouse score: Performance ≥ 80
```

---

## Reference Library

โหลดเฉพาะไฟล์ที่เกี่ยวกับงานที่ทำจริง — ไม่ต้องโหลดทั้งหมดทุกครั้ง

| ไฟล์ | เนื้อหา | โหลดเมื่อ |
|---|---|---|
| `references/tech-stack.md` | Omni-Platform/PWA structure · Tech Stack table · CDN pinning · Cloudflare CORS proxy | ตั้งค่าโปรเจกต์ใหม่ / เพิ่ม dependency |
| `references/design-system.md` | Supasit.A Studio: Spacing · Typography (Noto Sans Thai) · Radius · Color (น้ำเงินหมึก) · Accessibility · คลังส่วนประกอบ · Dark/Light 3 สถานะ | เขียน CSS / ออกแบบ UI |
| `references/thai-localization.md` | วันที่ พ.ศ. · ตัวเลขไทย · สกุลเงินบาท | แอปมี format วันที่/เงินภาษาไทย |
| `references/ai-integration.md` | Gemini config · JSON contract · Streaming · BYOK threat model · Worker-proxy pattern | แอปมี AI feature |
| `references/error-handling-and-data.md` | Error Taxonomy 8 types · IndexedDB Migration policy | ทำ error handling / เปลี่ยน schema |
| `references/performance-and-accessibility.md` | Lazy load · Debounce · Virtual scroll · ARIA · Contrast · Focus management | ก่อน deliver ทุกครั้ง (QA §16) |
| `references/layout-and-brand.md` | Bento Grid · Card sizes · Bottom nav · Brand Identity · Micro-interactions | ออกแบบ layout / ตรวจ brand compliance |
| `references/blueprint-template.md` | Architecture Blueprint Template เต็มรูปแบบ | § 1 Step 3 |

---

*SKILL: vibe-coding-core v7.0 | Sections: §1–2, §8, §16–17 (+ references/)*
*Supasit.A × A-Class WebCraft | Code • Share • Inspire*
*Related: vibe-coding-workflow · vibe-coding-firebase · vi-analysis*
*Updated: August 2026 (พ.ศ. 2569)*
