# HANDOFF.md — สถานะงานล่าสุด

> ใช้ไฟล์นี้ส่งต่องานข้ามเครื่อง (บ้าน ↔ ที่ทำงาน) — อ่านไฟล์นี้ก่อนเริ่ม session ถัดไป

**อัปเดตล่าสุด:** 2026-09-02 (session บนเว็บ — branch `claude/software-engineering-workflow-h8eqj3`)

---

## ⚠️ สิ่งแรกที่ต้องทำที่ทุกเครื่อง (สำคัญที่สุด)

1. หาโฟลเดอร์ที่ clone `claude-config` ไว้ที่เครื่องนั้น
   (เครื่อง Office **ยังไม่ทราบ path แน่ชัด** รู้แค่ `.claude` อยู่ที่ `C:\Users\26007294\.claude\` ต้องหา/ยืนยันเอง)
2. รัน `git pull` ในโฟลเดอร์นั้น
3. หลัง pull เสร็จ ระบบจะใช้ **"Supasit.A Studio"** (design system ใหม่ถาวร — แทนที่ Instrument Grade)
   อัตโนมัติทันที เพราะเก็บอยู่ใน skill ระดับ user (`~/.claude/skills/vibe-coding-core/`) ไม่ต้องตั้งค่าเพิ่มต่อโปรเจกต์
4. **`USER.md` เปลี่ยนด้วย** — ถ้าเครื่องนั้นใช้วิธี copy (ไม่ใช่ symlink) ต้อง copy ทับใหม่ (ดูวิธีใน README.md)
5. **`settings.json` ต้อง copy ทับด้วยมือเสมอ** (ไม่ auto-sync แบบ skill) — คำสั่ง:
   ```powershell
   Copy-Item "$env:USERPROFILE\claude-config\settings.json" "$env:USERPROFILE\.claude\settings.json" -Force
   ```
   รอบนี้มี deny-list secret ใหม่เพิ่ม (credentials.json, serviceAccount*.json, id_rsa/id_ed25519, .aws/**, *.p12/*.pfx ฯลฯ) — ถ้าไม่ copy จะไม่มีผล

   ⚠️ **ทันทีหลัง copy ทุกครั้ง ต้องแก้ placeholder ของ statusline ด้วย** — repo เก็บ `statusLine.command`
   เป็น `C:/Users/<ชื่อ user บนเครื่องนี้>/.claude/statusline.ps1` ไว้ตั้งใจ (portable ข้ามเครื่อง
   บ้าน/office ที่ username ต่างกัน) แปลว่า copy ทับแล้ว statusline จะหายทุกครั้งจนกว่าจะแก้
   `<ชื่อ user บนเครื่องนี้>` ให้เป็น username จริงของเครื่องนั้น (เครื่องบ้าน = `PC 4000D`, เครื่อง
   Office = `26007294`) — เพิ่งเจอ bug นี้จริงที่เครื่องบ้าน 2026-08-27 แก้แล้ว อย่าลืมซ้ำที่ Office
6. **เช็คไฟล์ `agents/*.md`** — ที่เครื่องบ้าน ไฟล์ใน `claude-config/agents/` กับ `~/.claude/agents/`
   เป็น**ไฟล์เดียวกัน** (hardlink) เลย sync อัตโนมัติ แต่**เครื่อง Office ยังไม่ยืนยันว่าเป็นแบบเดียวกัน**
   ต้องเช็คก่อน ถ้าไม่ใช่ hardlink/symlink ต้อง copy ทับเองด้วย:
   ```powershell
   Copy-Item "$env:USERPROFILE\claude-config\agents\*.md" "$env:USERPROFILE\.claude\agents\" -Force
   ```
7. **🆕 ขั้นตอนใหม่ 2026-09-02 — ต้องรัน `npm ci` หนึ่งครั้งต่อเครื่อง**
   ```powershell
   cd "$env:USERPROFILE\claude-config"
   npm ci
   npm run check        # ต้อง exit 0
   ```
   ทำแค่ครั้งเดียวต่อ clone · `npm ci` จะติดตั้ง git hook ให้อัตโนมัติ (ผ่าน `prepare`)
   ถ้าข้ามข้อนี้ hook จะไม่ทำงานและ `npm run check` จะรันไม่ได้ — **แต่ทุกอย่างอื่นยังใช้ได้ปกติ**
   (`node_modules/` อยู่ใน `.gitignore` แล้ว จึงไม่ทำให้ `git pull` ชนกัน)

---

## 🐛 บั๊กที่พี่ A เจอจริงหลัง merge (2026-09-02) — CRLF บน Windows

**อาการ:** pull โค้ดชุด Quality Gate มาที่เครื่องบ้าน (PowerShell) รัน `npm run check`
แล้ว prettier แจ้งว่า 10 ไฟล์ผิด format ทั้งที่ CI บน GitHub เพิ่งตรวจผ่านโค้ดชุดเดียวกันเป๊ะ

**สาเหตุที่ยืนยันแล้ว:** ทุกไฟล์ที่ commit ไว้เป็น LF ล้วน (ตรวจครบทุกไฟล์) แต่ Git for Windows
ตั้ง `core.autocrlf=true` เป็นค่าเริ่มต้น (ตัวติดตั้งแนะนำเอง) ซึ่งแปลง LF → CRLF ตอน checkout
prettier ที่บังคับ `endOfLine:"lf"` จึงมองว่าไฟล์ผิด format — **ไม่เกี่ยวกับโค้ดเลย เป็นเรื่องของ
git บนเครื่อง Windows ล้วนๆ**

**แก้แล้วด้วย `.gitattributes`** (ที่ root และ `design-lab/starter/`) บังคับ `eol=lf` ทุกเครื่อง
ไม่ว่า `core.autocrlf` จะตั้งไว้ยังไง — พิสูจน์แล้วด้วยการ clone จำลองด้วย `core.autocrlf=true`
ก่อนแก้เจอ CRLF 30 ตัวใน `package.json` ตรงกับที่พี่ A เจอเป๊ะ · หลังแก้ `npm run lint` ผ่านจริง

### ⚠️ ต้องทำที่เครื่องที่ pull โค้ดตัวแก้นี้ไปแล้ว (เครื่องบ้าน)

`.gitattributes` มีผลกับการ checkout **ครั้งใหม่** เท่านั้น — ไฟล์ที่แปลงเป็น CRLF ไปแล้ว
บนดิสก์จะไม่หายเองแค่ pull มา ต้องบังคับให้ git เช็คเอาท์ใหม่ 1 ครั้ง:

```powershell
cd ~/claude-config
git pull
git status              # ต้องขึ้นว่า "nothing to commit, working tree clean" ก่อนทำขั้นถัดไป
git rm -r --cached .
git reset --hard
npm run check            # ต้อง exit 0 คราวนี้
```

ถ้า `git status` ก่อนขั้นที่ 3 ไม่ clean (มีไฟล์ที่แก้ค้างอยู่) ให้หยุดแล้วบอกหนูก่อน
อย่ารัน `git reset --hard` ทับงานที่ยังไม่ได้ commit

**เครื่อง office** ยังไม่เคย pull โค้ดชุดนี้เลย → พอ `git clone`/`git pull` ครั้งแรกจะได้ LF ถูกต้อง
ตั้งแต่ต้น ไม่ต้องทำขั้นตอนพิเศษด้านบน

---

## 🆕 สรุปงานล่าสุด (2026-09-02) — Quality Gate + วิธี test Single HTML File

> อยู่บน branch `claude/software-engineering-workflow-h8eqj3` (ยังไม่ merge เข้า main)

### โจทย์
พี่ A ถามว่า workflow ปัจจุบันถูกหลัก software engineering ไหม เทียบกับมาตรฐานมืออาชีพ

### คำตอบสั้นๆ
กระบวนการที่มีอยู่แล้วดีกว่าที่คิด (Blueprint gate · Loop protocol · QA checklist ·
Git Safety Protocol · subagent 7 ตัว) — **ปัญหาคือทั้งหมดเป็นข้อความใน markdown
ที่ต้องจำเอง ไม่มีเครื่องบังคับสักตัว** ค้นจริงพบว่า repo ไม่มี CI · ไม่มี test ·
ไม่มี lint · ไม่มีแม้แต่ `.gitignore`

### ของใหม่ที่ใช้งานได้ทันที

| สิ่งที่เพิ่ม | ใช้ยังไง |
|---|---|
| `npm run check` ใน `claude-config` | lint + secret scan + ตรวจความสอดคล้องเอกสาร |
| `tools/check-standards.mjs` | ตรวจ 6 กฎที่เคยเป็นแค่ข้อความ · เจอ 5 ข้อผิดพลาดจริงตั้งแต่รันครั้งแรก |
| ชุดทดสอบใน `design-lab/starter/` | 15 unit (jsdom) + 16 e2e (Playwright) รันรวม ~15 วิ |
| skill `vibe-coding-quality` (§25) | เอกสารมาตรฐาน — Claude โหลดเองเมื่อพูดถึง test/CI/rollback |
| `/ตรวจ` `/preview` `/rollback` | slash command ใหม่ 3 ตัว |
| pre-commit hook | format + secret scan + unit test ก่อน commit อัตโนมัติ |

### บักจริงที่เทสต์เจอ (ไม่ได้เจอจากการอ่านโค้ด)
`STORAGE_ENGINE.open()` ใน starter ไม่มี `onblocked`/`onversionchange` →
เปิดแอปไว้ 2 แท็บแล้ว deploy ที่ bump `DB_VERSION` = แท็บที่สอง**ค้างถาวรโดยไม่มี error**
แก้แล้วและมีเทสต์คุมไว้

### ✅ ทำต่อจนครบแล้ว (2026-09-02 รอบบ่าย) — ปิด 3 ใน 4 ข้อที่เคยค้าง

1. ~~ยืนยันคำสั่ง `wrangler`~~ **เสร็จ** — รันจริงผ่าน GitHub Actions ของ `condo-rental-app`
   (`CLOUDFLARE_API_TOKEN` เป็น secret อยู่แล้วที่นั่น) ได้ syntax จริงจาก `wrangler 4.128.0`
2. ~~ซ้อม rollback จริง~~ **เสร็จ** — deploy ของผิดขึ้นจริง (เปลี่ยน `<title>` เป็นข้อความทดสอบ
   จุดเดียว ไม่แตะ logic/ข้อมูล) แล้ว rollback กลับสำเร็จ **รวมเวลา 1 นาที 31 วินาที**
   (เป้า < 5 นาที) เจอบั๊กจริงในตัว runbook เองด้วย (ลืมใส่ version-id เข้าคำสั่ง rollback)
   → รายละเอียดเต็มอยู่ที่ `vibe-coding-quality/references/rollback-runbook.md` § 7
3. ~~ลอง test harness กับแอปจริง~~ **เสร็จ** — ดูหัวข้อด้านบน (§25.0/`where-we-stand.md`)
4. **ยังไม่ได้ทำ:** ตั้ง repo variable `APP_URL` + ยืนยัน `CLOUDFLARE_API_TOKEN` ในแอปอื่นๆ
   นอกจาก `condo-rental-app` (ตัวนั้นมี secret อยู่แล้ว ยืนยันแล้วว่าใช้งานได้จริง)

**⚠️ เก็บกวาดที่ยังค้าง:** branch `claude/rollback-drill` บน repo
`Model-Vibe-Coding-Rental-Loan-Management-` ยังอยู่บน GitHub (มีแค่ workflow ทดลอง
ไม่กระทบแอปเลย) — ลบทิ้งได้จากหน้า GitHub ตอนสะดวก (session ลบเองไม่ได้ ติด permission)

---

## 📌 สรุปงานก่อนหน้า (2026-08-28) — Design System รอบที่ 4 "Supasit.A Studio"

> อยู่บน branch `claude/web-app-ui-redesign-8qzu2p` (ยังไม่ merge เข้า main)

### สิ่งที่เปลี่ยนวิธีคิด ไม่ใช่แค่เปลี่ยนสี

3 รอบก่อน (Neo-Glassmorphism → Tactile Plant UI → Instrument Grade) **อนุมัติจากเอกสาร spec ที่เป็นตัวหนังสือ**
พอเอาไปสร้างแอปจริงถึงเพิ่งรู้ว่าไม่ชอบ รอบนี้จึงสลับลำดับเป็น **เห็นของจริงก่อน แล้วค่อยเขียน spec**

**`design-lab/preview-kit.html`** — ไฟล์เดียว เปิดด้วยเบราว์เซอร์ได้เลย
เทียบ 4 ทิศทางบน markup ชุดเดียวกัน · สลับธีม 3 สถานะ · สลับฟอนต์ 5 ตัว · สลับโทนสีสำรอง · กรอบมือถือ 390px ในตัว

### ผลที่ได้ — "Supasit.A Studio"

สูตรผสมที่พี่ A เลือกจากหน้าจอจริง: **โครง/จังหวะจากเว็บทูลสมัยใหม่ (Linear/Notion/Vercel) ·
ปุ่มแคปซูลจาก Apple HIG · โทนน้ำเงินหมึก · Noto Sans Thai · ความแน่นสบายตา · สว่างเป็นหลัก**

- **ST-01 accent ต้องห่างจากสีสถานะ ≥50°** ← กติกาใหม่ที่สำคัญที่สุด
- ST-02 ความลึกจากเส้น 1px + เงาบางชั้นเดียว · ST-03 ปุ่มแคปซูล/การ์ด 13px · ST-04 วัด contrast ด้วยเครื่อง
- Font: IBM Plex Sans Thai + Mono → **Noto Sans Thai อย่างเดียว**
- Token: `--ground` → `--bg` · เพิ่ม `--on-crit` · teal → `#1D4ED8`

### 2 เรื่องที่เจอจากการวัด (เหตุผลที่ย้ายออกจากเขียว)

1. **สีแบรนด์ 3 ระบบติดกันเป็น teal hue 173-175°** (ห่างกัน 2° — ตาแยกไม่ออก) ทั้งที่รื้อโครง/ฟอนต์/เงาไปหมดแล้ว
   → นี่คือคำอธิบายว่าทำไม "แอปดูซ้ำกัน" ไม่เคยหาย
2. **teal เดิมห่างจากเขียว ok แค่ 25°** และเหลือ **5°** ในสายตาคนตาบอดสีเขียว-แดง (~8% ของผู้ชาย)
   → ปุ่ม "บันทึก" กับ chip "ปกติ" เป็นสีเดียวกัน ขัดกับกติกา "สีบอกสถานะ" ที่ตั้งไว้เอง

### ของใหม่ที่ใช้งานได้ทันที

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `design-lab/preview-kit.html` | ห้องแล็บ — ดู/เทียบ/จูน design system ก่อนแก้เอกสาร |
| `design-lab/starter/` | **ก๊อปไปเริ่มแอปใหม่ได้เลย** — token + 9 โมดูล IIFE + PWA + badge + ธีม Chart.js + CSP |
| `branding/exports/studio-*.svg` | A(i)CODER badge ชุด Studio (ของเดิมชุด neon เก็บไว้ ไม่ได้ลบ) |

### กติกาถาวรที่เพิ่มมา

> จะแก้ design system ต้องแก้ที่ `preview-kit.html` แล้วดูของจริงก่อนเสมอ — **ห้ามอนุมัติจากเอกสารเปล่าอีก**
> และแอปใหม่ทุกตัวเริ่มจาก `design-lab/starter/` ไม่ให้ AI สร้าง token ขึ้นใหม่ทุกครั้ง

---

## 📌 สรุปงานก่อนหน้า (2026-08-27)

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

> **หมายเหตุ:** ระบบนี้ถูกแทนที่ด้วย "Supasit.A Studio" แล้วเมื่อ 2026-08-28 (ดูหัวข้อด้านบน)
> ตาราง Migration จาก Instrument Grade → Studio อยู่ท้าย `references/design-system.md`

### 2. Subagent ใหม่ — `sa-summarizer`
รวมผลจาก subagent ประเภทเดียวกันที่รันขนาน (fan-out) ให้เป็นรายงานเดียว
พร้อมกติกา orchestration ใน `USER.md` (รันขนานได้เฉพาะ multi-file · ไม่เกิน 3-5 ตัวต่อรอบ · ต้องระบุขอบเขตก่อนเรียกเสมอ)

### 3. แก้ "PowerShell bug" ใน subagent frontmatter + เพิ่ม deny-list secret
พี่ A เจอว่า `tools:` field ของ subagent ใส่ชื่อ tool `PowerShell` ไปด้วย แต่ **Claude Code ไม่รู้จักชื่อ
tool นี้** (บน Windows ก็เรียกผ่านชื่อ `Bash` เหมือนกัน) — commit `2b78c29` เลยลบ `PowerShell` ออกจาก
`tools:` ของ 5 agents: `sa-code-reviewer` · `sa-debugger` · `sa-explore` · `sa-git-manager` · `sa-handoff`

พร้อมกันนั้น commit `8cadfc4` เพิ่ม deny-list ป้องกันไฟล์ secret ใน `settings.json` เพิ่มอีก 8 pattern
(`credentials.json` · `*serviceAccount*.json` · `*firebase-adminsdk*.json` · `.npmrc` · `id_rsa`/`id_ed25519`
· `.aws/**` · `*.p12`/`*.pfx`) และแก้ README ให้ตรงความจริงว่า `tools:`/`Write` ของ subagent **scope ราย
ไฟล์ไม่ได้** (เช่น `sa-handoff` ที่ห้ามแก้ไฟล์อื่นนอกจาก `HANDOFF.md` — กติกานั้นบังคับด้วย prompt +
permission prompt เท่านั้น ไม่ใช่ tool-level) — merge เป็น `137ce77`

**ที่เครื่องบ้านทำครบแล้ว:** pull + copy `settings.json` ทับ `~/.claude/settings.json` แล้ว (`diff` ยืนยันตรงกัน)
agent files sync อัตโนมัติเพราะเป็น hardlink

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

## 🔧 คำสั่งที่ต้องรันก่อนทำงานต่อ (ที่เครื่อง Office — user `26007294`)
0. **รอบนี้เพิ่ม:** หลัง `git pull` แล้วต้อง copy `settings.json` ทับ `C:\Users\26007294\.claude\settings.json`
   ด้วยมือทุกครั้ง (คำสั่งอยู่ในหัวข้อ "สิ่งแรกที่ต้องทำที่ทุกเครื่อง" ข้อ 5 ด้านบน) แล้วเช็คว่า
   `agents/*.md` ที่เครื่องนี้เป็น hardlink/symlink กับ `~/.claude/agents/` เหมือนเครื่องบ้านหรือไม่
   (`diff` เทียบไฟล์ดูได้) — ถ้าไม่ใช่ ต้อง copy ทับด้วยคำสั่งในข้อ 6 ด้วย ไม่งั้น 5 agents
   (`sa-code-reviewer`/`sa-debugger`/`sa-explore`/`sa-git-manager`/`sa-handoff`) จะยังมี bug
   `tools: ..., PowerShell` (ชื่อ tool ที่ไม่มีจริง) ค้างอยู่
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
