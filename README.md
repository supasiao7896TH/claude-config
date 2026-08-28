# claude-config

Master repo สำหรับ Skills และ Subagents ส่วนตัวของ Supasit.A (พี่ A)
ใช้ sync การตั้งค่า Claude Code ระหว่างเครื่อง (บ้าน + ที่ทำงาน)

Single source of truth สำหรับ Claude Code Skills และ Subagents ของ Supasit.A — รวมจาก CLAUDE-Docc-For-Code เมื่อ 2026-07-31

> **Sync status:** skills/agents sync อัตโนมัติผ่าน Junction ทันทีที่ `git pull` — ส่วน
> `CLAUDE.md`/`settings.json`/`statusline.ps1` ต้อง copy มือ (ดูขั้นตอนด้านล่าง) เช็ควันที่/การ
> เปลี่ยนแปลงล่าสุดจริงด้วย `git log -1` แทนการพึ่งบรรทัดนี้ (เคยตกยุคมาแล้วเพราะต้องจำอัปเดตมือ)

## โครงสร้าง

```
claude-config/
├── skills/           → สำหรับ ~/.claude/skills/ (Personal scope, ใช้ได้ทุกโปรเจกต์)
│   ├── vibe-coding-core/references/       → deep-reference material (8 ไฟล์, โหลดตามความจำเป็น)
│   └── vibe-coding-workflow/references/   → deep-reference material (1 ไฟล์, โหลดตามความจำเป็น)
├── agents/           → สำหรับ ~/.claude/agents/ (Personal scope, ใช้ได้ทุกโปรเจกต์)
├── design-lab/       → ห้องแล็บ design system "Supasit.A Studio" (ไม่ต้องติดตั้ง — เปิดใช้จาก repo)
│   ├── preview-kit.html   → เปิดด้วยเบราว์เซอร์: ดู/เทียบ/จูน UI ก่อนแก้เอกสารทุกครั้ง
│   └── starter/           → ก๊อปทั้งโฟลเดอร์แล้วเริ่มแอปใหม่ได้เลย (token + 9 โมดูล + PWA + badge)
├── branding/         → A(i)CODER identity (ชุด Studio ใช้กับแอปปัจจุบัน · ชุด neon เก็บไว้สำหรับของเดิม)
├── statusline.ps1    → source of truth สำหรับ ~/.claude/statusline.ps1 (Multi-line statusline: model/dir/branch + context bar + 5-hour/weekly rate limit)
└── REVIEW.md         → audit trail ของการรีวิว SKILL.md 07/2026 (รวมมาจาก CLAUDE-Docc-For-Code)
```

## Reference Files

Skill ที่มีไฟล์ลึก (`vibe-coding-core`, `vibe-coding-workflow`) เก็บเนื้อหาเสริมไว้ใน `references/`
แยกจาก `SKILL.md` หลัก ตามหลัก **progressive disclosure**: Claude Code จะโหลดเฉพาะไฟล์ reference
ที่เกี่ยวกับงานที่กำลังทำจริงเท่านั้น (เช่น แก้ CSS ค่อยโหลด `design-system.md` — และดูของจริงที่ `design-lab/preview-kit.html` ก่อนเสมอ, ทำ AI feature ค่อยโหลด
`ai-integration.md`) ไม่โหลดทั้งโฟลเดอร์ทุกครั้งที่เรียก skill — ดูตาราง Reference Library ท้าย
`SKILL.md` ของแต่ละ skill ว่ามีไฟล์อะไรบ้างและใช้ตอนไหน

รายละเอียดที่มาและบั๊กที่แก้ไปแล้วของ SKILL.md ทั้ง 5 ไฟล์ (vibe-coding-core, vibe-coding-workflow,
vibe-coding-firebase, vi-analysis, technical-timing) ดูได้ที่ [`REVIEW.md`](./REVIEW.md) — audit
trail ของการรีวิว 07/2026

## วิธีติดตั้งบนเครื่องใหม่ (ทำครั้งเดียวต่อเครื่อง)

### วิธี A: Clone ตรง (ง่าย แต่ต้อง git pull เองเวลาอัปเดต)

```powershell
git clone https://github.com/supasiao7896TH/claude-config.git "$env:TEMP\claude-config"
Copy-Item "$env:TEMP\claude-config\skills\*" "$env:USERPROFILE\.claude\skills\" -Recurse -Force
Copy-Item "$env:TEMP\claude-config\agents\*" "$env:USERPROFILE\.claude\agents\" -Force
```

### วิธี B: Clone + Symlink (แนะนำ — แก้ในนี้แล้ว git pull ครั้งเดียวอัปเดตทุกที่)

```powershell
git clone https://github.com/supasiao7896TH/claude-config.git "$env:USERPROFILE\claude-config"
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\skills" -Target "$env:USERPROFILE\claude-config\skills"
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\agents" -Target "$env:USERPROFILE\claude-config\agents"
```
> หมายเหตุ: ถ้า `~/.claude/skills` หรือ `~/.claude/agents` มีไฟล์อยู่แล้ว ต้องลบ/ย้ายออกก่อนสร้าง Junction เพราะสร้างทับโฟลเดอร์ที่มีอยู่ไม่ได้

หลังตั้งค่าแล้ว ทุกครั้งที่อัปเดต skill/agent ใน repo นี้ → `git pull` ที่ `$env:USERPROFILE\claude-config` ก็พอ ไม่ต้อง copy ไฟล์ซ้ำอีก (เฉพาะวิธี B)

### วิธีติดตั้ง statusline.ps1 (Multi-line statusline)

`statusline.ps1` เป็น**ไฟล์เดี่ยว** ไม่ใช่โฟลเดอร์ — สร้าง Junction แบบ skills/agents ไม่ได้ (Junction ใช้ได้เฉพาะโฟลเดอร์) ส่วน Symbolic Link สำหรับไฟล์เดี่ยวต้องใช้สิทธิ์ Administrator/Developer Mode ซึ่งเครื่องที่ทำงานอาจไม่มีสิทธิ์ตั้งค่านี้ ดังนั้นใช้วิธี **copy ไฟล์** แทน (ไม่ auto-sync — ถ้าแก้ script ต้อง copy ใหม่ + commit ทั้งสองที่):

```powershell
git clone https://github.com/supasiao7896TH/claude-config.git "$env:USERPROFILE\claude-config"
Copy-Item "$env:USERPROFILE\claude-config\statusline.ps1" "$env:USERPROFILE\.claude\statusline.ps1" -Force
```

จากนั้นเพิ่ม (หรือแก้) `statusLine` block นี้ใน `$env:USERPROFILE\.claude\settings.json` — **ต้องแก้ path ให้ตรงกับ username ของเครื่องนั้นๆ เอง** (ห้าม copy path แบบ verbatim ข้ามเครื่อง เพราะ `~` shorthand ที่เอกสาร Claude Code บอกว่ารองรับ ทดสอบแล้วบนเครื่องนี้ไม่ทำงานจริง — สถานะไลน์ขึ้นว่างเปล่า):

```json
"statusLine": {
  "type": "command",
  "command": "powershell -NoProfile -File \"C:/Users/<ชื่อ user บนเครื่องนี้>/.claude/statusline.ps1\""
}
```

ทดสอบว่า script ทำงานถูกต้องก่อนใช้จริง:

```powershell
'{"model":{"display_name":"Test"},"workspace":{"current_dir":"C:\\test"},"cost":{"total_cost_usd":0.1,"total_duration_ms":60000},"context_window":{"used_percentage":10,"total_input_tokens":20000,"context_window_size":200000}}' | powershell -NoProfile -File "$env:USERPROFILE\.claude\statusline.ps1"
```

**บรรทัดที่ 2** โชว์ context bar สีไล่ตามระดับใช้งาน (เขียว/เหลือง/แดง) พร้อม `%` และจำนวน token ที่ใช้จริงเทียบกับ limit แบบย่อ `k` (มาจาก `context_window.total_input_tokens` / `context_window.context_window_size` — field เดียวกับที่ใช้คำนวณ `%` อยู่แล้ว จึงตรงกันเป๊ะ):

```
████░░░░░░ 45% (92.3k/200k) | $1.23 | ⏱ 12m 34s
```

### วิธีติดตั้ง CLAUDE.md (Global preferences)

`CLAUDE.md` เป็นไฟล์เดี่ยวเหมือน `statusline.ps1` — ใช้วิธี **copy** เช่นกัน (ไม่ auto-sync):

```powershell
Copy-Item "$env:USERPROFILE\claude-config\CLAUDE.md" "$env:USERPROFILE\.claude\CLAUDE.md" -Force
```

ไฟล์นี้เก็บ preference ที่ apply กับทุก project เช่น communication style (ตอนนี้คือ 70% Thai / 30% English) — Claude Code จะ load ไฟล์นี้อัตโนมัติทุก session ไม่ว่าจะเปิด project ไหนก็ตาม

### วิธีติดตั้ง USER.md (โปรไฟล์ผู้ใช้งาน — ต่างจาก CLAUDE.md ตรงที่ไม่มีเนื้อหาเฉพาะเครื่อง จึง sync แบบ symlink ได้เต็มที่)

**วิธี A: Symbolic Link (แนะนำ — แก้ที่ repo แล้ว `git pull` ครั้งเดียวอัปเดตทุกที่ ไม่ต้อง copy ซ้ำ)**

ต้องใช้สิทธิ์ Administrator หรือเปิด **Developer Mode** ไว้ก่อน (Settings → Privacy & security → For developers → Developer Mode) — เครื่องที่ทำงานอาจไม่มีสิทธิ์ตั้งค่านี้ ถ้าใช้ไม่ได้ให้ข้ามไปวิธี B:

```powershell
git clone https://github.com/supasiao7896TH/claude-config.git "$env:USERPROFILE\claude-config"
Remove-Item "$env:USERPROFILE\.claude\USER.md" -Force -ErrorAction SilentlyContinue
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\USER.md" -Target "$env:USERPROFILE\claude-config\USER.md"
```

ตรวจว่าเป็น symlink จริง (ต้องเห็น `LinkType : SymbolicLink`):

```powershell
Get-Item "$env:USERPROFILE\.claude\USER.md" | Select-Object LinkType, Target
```

**วิธี B: Copy (ถ้าเครื่องที่ทำงานไม่มีสิทธิ์สร้าง Symbolic Link) — ไม่ auto-sync ต้อง copy ใหม่ทุกครั้งที่ `USER.md` เปลี่ยน:**

```powershell
Copy-Item "$env:USERPROFILE\claude-config\USER.md" "$env:USERPROFILE\.claude\USER.md" -Force
```

ทั้งสองวิธีใช้ได้เพราะ `CLAUDE.md` มีบรรทัด `@USER.md` อยู่แล้ว (ดู "วิธีติดตั้ง CLAUDE.md" ด้านบน) — Claude Code จะโหลด `USER.md` อัตโนมัติทุก session ทุกโปรเจกต์บนเครื่องนั้น

### วิธีติดตั้ง settings.json (Hooks + Permissions + Plugins)

`settings.json` เป็น**ไฟล์เดี่ยว**เหมือน `statusline.ps1`/`CLAUDE.md` — ใช้วิธี **copy** เช่นกัน (ไม่ auto-sync ผ่าน Junction ได้ ต้อง copy ใหม่ + commit ทั้งสองที่ทุกครั้งที่แก้):

```powershell
Copy-Item "$env:USERPROFILE\claude-config\settings.json" "$env:USERPROFILE\.claude\settings.json" -Force
```

**ต้องแก้ทีหลังก่อนใช้จริง:** field `statusLine.command` มี placeholder `<ชื่อ user บนเครื่องนี้>` อยู่ — แก้ให้ตรงกับ username ของเครื่องนั้นๆ เอง (เหตุผลเดียวกับ statusline.ps1 ด้านบน — `~` shorthand ใช้ไม่ได้จริงบนเครื่องนี้)

ไฟล์นี้มีอะไรบ้าง:
- **`permissions.deny`** — กันไม่ให้ Claude อ่านไฟล์ secret โดยไม่ตั้งใจ (`.env`, `secrets/**`, `*.pem`, `*.key`) แม้จะสั่ง "อ่านทุกไฟล์ในโปรเจกต์" ก็ตาม
- **`hooks.SessionStart`** — `git pull --ff-only` อัตโนมัติที่ `claude-config` ทุกครั้งที่เปิด session ใหม่ กันลืม pull ก่อนเริ่มงาน (ถ้า offline หรือ pull ไม่ได้ hook จะเงียบๆ ผ่านไป ไม่ทำให้ session เปิดไม่ได้)
- **`hooks.Stop` / `UserPromptSubmit` / `Notification`** — เสียงแจ้งเตือน Start/Stop/ขออนุมัติ permission ผ่าน Windows TTS
- **`enabledPlugins` / `extraKnownMarketplaces`** — plugin ที่ติดตั้งไว้ (⚠️ ตัว plugin เองไม่ sync ผ่าน git ต้องรัน `/plugin install` ซ้ำที่เครื่องใหม่ — ดูหัวข้อด้านล่าง ไฟล์นี้แค่บันทึกว่าเปิดใช้ตัวไหนอยู่)

## รายการ Skills (20 ตัว)

- pta-exapilot-logic
- pta-industry-insight
- pta-kaizen-writer
- pta-pi-datalink-excel
- pta-plant-reference
- pta-process-diagnostic
- pta-safety-observation
- star-kaizen
- technical-timing
- vi-analysis
- vibe-coding-core
- vibe-coding-firebase
- vibe-coding-workflow
- vibe-coding-multifile
- cloudflare-workers-deploy
- domain-modeling
- grilling
- grill-with-docs
- พัง
- deploy

### Slash Commands จริง: /พัง, /deploy

เพิ่มเข้ามา 2026-08-08 — แปลงมาจาก keyword ใน `vibe-coding-workflow` §19 ที่เดิมพึ่งให้ Claude
"จับสัญญาณ" คำในประโยคเอง (ไม่การันตี trigger จริง) ทั้งคู่ตั้ง `disable-model-invocation: true`
เหมือน `grill-with-docs` — ต้องพิมพ์ `/พัง` หรือ `/deploy` ตรงๆ เท่านั้นถึงจะทำงาน:

| Skill | ทำหน้าที่อะไร | ทำไมต้องเป็น explicit command |
|---|---|---|
| `พัง` | เข้า Debug Mode 5 ขั้นตอน (ถาม error → ถามบริบท → root cause → fix พร้อม WHY → วิธี verify) | คำว่า "พัง" กำกวมกับบริบทโรงงาน PTA ของพี่ A (เช่น "เครื่อง Boiler พัง" ไม่เกี่ยวกับโค้ดเลย) |
| `deploy` | รัน Deployment Checklist ของ `vibe-coding-core` §17 (หรือ checklist เฉพาะ stack ถ้าเป็น multi-file/Cloudflare Workers) ทีละข้อ | ป้องกัน auto-trigger กลางบทสนทนาที่แค่ถามเรื่อง deploy แต่ยังไม่พร้อมลงมือจริง |

ส่วน 4 keyword ที่เหลือ (ปรับ/ลอง/เริ่มใหม่/สรุป) ยังปล่อยเป็น prose convention ต่อไป — เป็นคำไทย
ที่ใช้ในบทสนทนาทั่วไปบ่อยเกินกว่าจะบังคับเป็น explicit-only command ได้โดยไม่เพิ่มความยุ่งยาก

### Engineering Skills เพิ่มเติม: domain-modeling / grilling / grill-with-docs

เพิ่มเข้ามาเมื่อ 2026-08-03 ผ่าน `mattpocock/skills` (source: [`mattpocock/skills`](https://github.com/mattpocock/skills), ดู `skills-lock.json`) — เป็น skill ทั่วไป (ไม่เจาะจงโปรเจกต์ PTA) สำหรับงานออกแบบ/ตัดสินใจ:

| Skill | ทำหน้าที่อะไร |
|---|---|
| `domain-modeling` | สร้าง/ลับคม domain model ของโปรเจกต์ — ทักท้วงเมื่อใช้คำศัพท์กำกวมหรือขัดแย้งกับที่นิยามไว้ก่อน แล้วบันทึกลง `CONTEXT.md` (glossary, หรือ `CONTEXT-MAP.md` ถ้ามีหลาย context) พร้อมช่วยเขียน ADR สั้นๆ ลง `docs/adr/` เมื่อเจอการตัดสินใจที่ reverse ยาก + surprising + มี trade-off จริง |
| `grilling` | ซักถามอย่างเข้มข้น (interview) เพื่อ stress-test แผน/ไอเดีย/การตัดสินใจ — ถามทีละคำถามพร้อมข้อเสนอแนะ รอ feedback ก่อนถามข้อถัดไป ไม่ลงมือทำจนกว่าจะเข้าใจตรงกันครบทุกแขนงของ decision tree |
| `grill-with-docs` | ผสม `grilling` + `domain-modeling` — ซักถามพร้อมบันทึกผลเป็น ADR/glossary ไปด้วยระหว่างคุย (`disable-model-invocation: true` — ต้องพิมพ์ `/grill-with-docs` เรียกตรงๆ เท่านั้น ไม่ auto-trigger) |

**วิธีเรียกใช้ใน Claude Code (รวมถึง VS Code extension)**

VS Code extension เป็น UI wrapper ของ engine เดียวกับ terminal ดังนั้นเรียกใช้เหมือนกันทุกประการ:

1. เปิด Claude Code panel ใน VS Code (sidebar icon หรือ `Ctrl+Esc`)
2. พิมพ์ `/` ในช่อง prompt จะเห็น autocomplete list ของ skills ที่มี (personal-scope ใช้ได้ทุกโปรเจกต์บนเครื่องนี้ผ่าน junction)
3. เลือก/พิมพ์ต่อ เช่น `/grilling หัวข้อที่อยากซัก` แล้ว Enter
   - `/domain-modeling` และ `/grilling` เรียกตรงๆ ได้ หรือปล่อยให้ Claude auto-trigger เองถ้าบทสนทนาเข้าเงื่อนไข (เช่น พูดคำว่า "grill" หรือกำลังนิยามศัพท์ในโดเมน)
   - `/grill-with-docs` ต้องพิมพ์เรียกตรงๆ เท่านั้น

> หมายเหตุ: session ที่เปิดค้างไว้ตั้งแต่ก่อน `git pull` อัปเดต skill ใหม่ อาจยังไม่เห็นใน list — ต้องเปิด session ใหม่ในโปรเจกต์นั้นถึงจะ refresh

## Official Plugin Skills

นอกจาก skills ส่วนตัวในโฟลเดอร์ `skills/` ของ repo นี้ ยังติดตั้ง official plugin skills จาก Anthropic เพิ่มเติมแบบ **user scope** (ใช้ได้ทุกโปรเจกต์บนเครื่องนี้) ผ่านคำสั่ง:

```
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

> **หมายเหตุสำคัญ:** plugin ที่ติดตั้งแบบ user scope นี้ **ไม่ sync ผ่าน git** (ต่างจาก skills/agents ในโฟลเดอร์นี้ที่ sync อัตโนมัติผ่าน Junction) — ต้องรันคำสั่งชุดข้างต้นซ้ำใหม่ทุกเครื่องที่ต้องการใช้งาน

> **Root cause ที่เจอจริง (`example-skills`):** หลัง `/plugin install` แล้ว plugin บางตัวอาจอยู่ในสถานะ **"disabled"** โดยอัตโนมัติ — ไม่ปรากฏใน `/skills` แม้ `/reload-plugins` แล้วก็ตาม ต้องเข้า `/plugin` → `Installed` ค้นหาชื่อ plugin แล้วกด **Space** เพื่อ toggle เป็น enabled ด้วยตนเอง จากนั้นรัน `/reload-plugins` อีกครั้งถึงจะเห็น skills จริงใน `/skills` (ต่างจาก `document-skills` ที่ enabled อัตโนมัติหลังติดตั้ง)

### รายละเอียด `example-skills` (12 skills) — ประโยชน์และวิธีเรียกใช้

`example-skills` เป็นชุด reference skill ที่ Anthropic ทำไว้โชว์แนวทาง (best practice) การสร้างโปรดักต์ต่างๆ ผ่าน Claude ส่วนใหญ่ **auto-trigger เองได้** ถ้าคำขอเข้าเงื่อนไข ไม่ต้องพิมพ์ชื่อ skill ตรงๆ — ถ้าอยากบังคับเรียกตรงๆ พิมพ์ `/example-skills:ชื่อ-skill` ได้เลย

| Skill | ประโยชน์ | วิธีเรียกใช้ (พิมพ์แบบนี้ก็ trigger เอง) |
|---|---|---|
| `algorithmic-art` | สร้างงานศิลปะจาก code (p5.js) แบบ generative/flow field/particle system — ใช้ seeded randomness ให้ปรับ parameter ได้ | "สร้าง generative art แบบ..." / "อยากได้ flow field art" |
| `brand-guidelines` | ใส่สี/ฟอนต์ตาม official brand ของ Anthropic ลงในงานที่ทำ (เช่น slide, artifact) | "ทำตาม Anthropic brand guideline" |
| `canvas-design` | สร้างภาพ poster/ดีไซน์นิ่ง (.png/.pdf) แบบมีหลักการออกแบบ ไม่ใช่แค่ AI-generate มั่วๆ | "ทำโปสเตอร์ให้หน่อย" / "ออกแบบภาพนี้" |
| `doc-coauthoring` | ช่วยเขียนเอกสารแบบ structured (proposal, spec, decision doc) เป็นขั้นตอน วนซักถามจนเนื้อหาแน่นก่อนส่งจริง | "ช่วยร่าง proposal/spec เรื่อง..." |
| `frontend-design` | ช่วยออกแบบ UI ให้มีทิศทางสวยงามเฉพาะตัว ไม่ให้หน้าตา "เทมเพลตทั่วไป" | "ออกแบบ UI ให้ดูมีเอกลักษณ์" |
| `internal-comms` | เขียนเอกสารสื่อสารภายในองค์กร (status report, leadership update, incident report, FAQ) ตาม format ที่บริษัทนิยม | "เขียน status report ส่งหัวหน้า" |
| `mcp-builder` | คู่มือสร้าง MCP server คุณภาพดี (Python FastMCP / Node TS) เชื่อม API ภายนอกเข้ากับ Claude | "อยากสร้าง MCP server เชื่อม API..." |
| `skill-creator` | สร้าง/แก้/ทดสอบ skill ใหม่ + วัดประสิทธิภาพ (eval) | "สร้าง skill ใหม่ให้หน่อย" / "ปรับปรุง SKILL.md นี้" |
| `slack-gif-creator` | สร้าง GIF เคลื่อนไหวที่ optimize สำหรับโพสต์ใน Slack | "ทำ GIF สำหรับ Slack" |
| `theme-factory` | ใส่ธีมสำเร็จรูป (10 แบบ) ให้ artifact/slide/doc/HTML landing page | "เปลี่ยนธีมของ artifact นี้" |
| `web-artifacts-builder` | สร้าง artifact HTML ซับซ้อน (React + Tailwind + shadcn/ui) ที่มี state/routing — เหมาะกับ artifact ใหญ่ ไม่ใช่ single-file ง่ายๆ | "สร้าง dashboard/app ที่ซับซ้อนใน artifact" |
| `webapp-testing` | ทดสอบเว็บแอป local ด้วย Playwright — คลิก/screenshot/ดู console log อัตโนมัติ | "ช่วยทดสอบเว็บแอปนี้หน่อย" |

> ถ้าเรียกแล้วไม่ trigger ให้ตรวจว่า plugin ยัง enabled อยู่ผ่าน `/plugin` → `Installed` (ดู root cause ด้านบน)

## รายการ Subagents

| Subagent | บทบาท | Tools (`tools:` จริง) |
|---|---|---|
| sa-explore | ค้นหา/สรุปโครงสร้างโค้ด ประหยัด context | Read, Grep, Glob, Bash |
| sa-architect | ร่าง Architecture Blueprint ก่อนเขียนโค้ด (รออนุมัติก่อนเสมอ) | Read, Grep, Glob |
| sa-code-reviewer | รีวิวโค้ดตาม Security Checklist ก่อน commit | Read, Grep, Glob, Bash |
| sa-debugger | ไล่บั๊กด้วย Five Whys + แก้ไขจริง | Read, Edit, Bash, Grep, Glob |
| sa-handoff | สรุปสถานะงานข้ามเครื่องผ่าน HANDOFF.md | Read, Write, Bash, Grep, Glob |
| sa-git-manager | Commit message, merge conflict, branch, PR ตาม Git Safety Protocol เข้มงวด | Read, Edit, Bash, Grep, Glob |
| sa-summarizer | รวบรวมผลจาก subagent ประเภทเดียวกันที่รันขนานกัน (fan-out) ให้เป็นรายงานเดียว | Read |

> ⚠️ **ข้อจำกัดที่ต้องรู้ (ยืนยันจากเอกสารทางการแล้ว 2569-08-27):** field `tools:` ของ subagent
> จำกัดได้แค่ระดับ "อนุญาตทั้ง tool หรือไม่" เท่านั้น **ไม่รองรับการ scope เฉพาะไฟล์แบบ
> `Write(./HANDOFF.md)`** (syntax แบบนั้นใช้ได้เฉพาะใน `permissions.allow/deny` ของ settings.json)
> ดังนั้น `sa-explore`/`sa-code-reviewer` ที่มี Bash และ `sa-handoff` ที่มี Write แบบไม่ scope
> จึงพึ่งพา **คำสั่งในตัว prompt + permission prompt ที่ต้องกดอนุมัติก่อนรันจริง** เป็นเกราะป้องกัน
> ไม่ใช่การบังคับที่ tool level — อย่ารัน agent เหล่านี้ในโหมด auto-accept/bypass-permissions
> ถ้าต้องการให้ขอบเขตนี้เข้มงวดจริง

## Workflow แนะนำ

1. sa-explore → สำรวจโค้ดที่เกี่ยวข้องก่อน (โปรเจกต์ multi-file ที่ระบุขอบเขตชัดเจน รันขนานได้หลายตัว)
2. sa-summarizer → ถ้ารัน sa-explore ขนานกันตั้งแต่ 2 ชุดขึ้นไป ใช้รวมผลเป็นรายงานเดียวก่อนไปขั้นต่อไป
3. sa-architect → ร่าง Blueprint แล้วรอ "อนุมัติ"
4. Plan Mode (Opus) → วางแผนละเอียด
5. Accept Edits (Sonnet) → ลงมือเขียนโค้ด
6. sa-code-reviewer → รีวิวก่อน commit
7. sa-debugger → ถ้าเจอ Critical issue
8. sa-git-manager → commit/push/PR อย่างปลอดภัย
9. sa-handoff → ก่อนปิดเครื่อง/สลับเครื่อง
