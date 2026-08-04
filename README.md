# claude-config

Master repo สำหรับ Skills และ Subagents ส่วนตัวของ Supasit.A (พี่ A)
ใช้ sync การตั้งค่า Claude Code ระหว่างเครื่อง (บ้าน + ที่ทำงาน)

Single source of truth สำหรับ Claude Code Skills และ Subagents ของ Supasit.A — รวมจาก CLAUDE-Docc-For-Code เมื่อ 2026-07-31

> **Last sync:** 2026-08-04 — pull ที่เครื่องที่ทำงาน (agents 6 ไฟล์ / skills 16 โฟลเดอร์)

## โครงสร้าง

```
claude-config/
├── skills/           → สำหรับ ~/.claude/skills/ (Personal scope, ใช้ได้ทุกโปรเจกต์)
│   ├── vibe-coding-core/references/       → deep-reference material (8 ไฟล์, โหลดตามความจำเป็น)
│   └── vibe-coding-workflow/references/   → deep-reference material (1 ไฟล์, โหลดตามความจำเป็น)
├── agents/           → สำหรับ ~/.claude/agents/ (Personal scope, ใช้ได้ทุกโปรเจกต์)
├── statusline.ps1    → source of truth สำหรับ ~/.claude/statusline.ps1 (Multi-line statusline: model/dir/branch + context bar + 5-hour/weekly rate limit)
└── REVIEW.md         → audit trail ของการรีวิว SKILL.md 07/2026 (รวมมาจาก CLAUDE-Docc-For-Code)
```

## Reference Files

Skill ที่มีไฟล์ลึก (`vibe-coding-core`, `vibe-coding-workflow`) เก็บเนื้อหาเสริมไว้ใน `references/`
แยกจาก `SKILL.md` หลัก ตามหลัก **progressive disclosure**: Claude Code จะโหลดเฉพาะไฟล์ reference
ที่เกี่ยวกับงานที่กำลังทำจริงเท่านั้น (เช่น แก้ CSS ค่อยโหลด `design-system.md`, ทำ AI feature ค่อยโหลด
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
'{"model":{"display_name":"Test"},"workspace":{"current_dir":"C:\\test"},"cost":{"total_cost_usd":0.1,"total_duration_ms":60000},"context_window":{"used_percentage":10}}' | powershell -NoProfile -File "$env:USERPROFILE\.claude\statusline.ps1"
```

### วิธีติดตั้ง CLAUDE.md (Global preferences)

`CLAUDE.md` เป็นไฟล์เดี่ยวเหมือน `statusline.ps1` — ใช้วิธี **copy** เช่นกัน (ไม่ auto-sync):

```powershell
Copy-Item "$env:USERPROFILE\claude-config\CLAUDE.md" "$env:USERPROFILE\.claude\CLAUDE.md" -Force
```

ไฟล์นี้เก็บ preference ที่ apply กับทุก project เช่น communication style (ตอนนี้คือ 30% Thai / 70% English) — Claude Code จะ load ไฟล์นี้อัตโนมัติทุก session ไม่ว่าจะเปิด project ไหนก็ตาม

### วิธีติดตั้ง Sound Hooks (Start / Stop / Approve)

เสียงแจ้งเตือนตอน Claude Code เริ่ม session / ตอบจบ / ขอ permission — ตั้งค่าผ่าน `hooks` key ใน `settings.json` **ไม่ sync ผ่าน git** (เหมือน Official Plugin Skills ด้านล่าง) ต้อง copy ไปวางเองทุกเครื่อง

| ที่เรียก | Hook Event จริง | ไฟล์เสียงที่ใช้ | หมายเหตุ |
|---|---|---|---|
| Start | `SessionStart` | `Windows Navigation Start.wav` | เล่นตอนเปิด session ใหม่ |
| Stop | `Stop` | `tada.wav` | เล่นตอน Claude ตอบจบ/หยุดทำงาน |
| Approve | `PermissionRequest` | `Windows User Account Control.wav` | เล่นก่อนขึ้น permission prompt |

ไฟล์เสียงทั้ง 3 เป็นไฟล์มาตรฐานที่มีอยู่แล้วใน `C:\Windows\Media\` ของทุกเครื่อง Windows ไม่ต้องพึ่งไฟล์เสียง custom เพิ่ม

เพิ่ม (หรือ merge เข้ากับ `hooks` เดิมถ้ามี) ใน `$env:USERPROFILE\.claude\settings.json`:

```json
"hooks": {
  "SessionStart": [
    {
      "hooks": [
        {
          "type": "command",
          "shell": "powershell",
          "command": "(New-Object System.Media.SoundPlayer 'C:\\Windows\\Media\\Windows Navigation Start.wav').PlaySync()",
          "async": true,
          "timeout": 10
        }
      ]
    }
  ],
  "Stop": [
    {
      "hooks": [
        {
          "type": "command",
          "shell": "powershell",
          "command": "(New-Object System.Media.SoundPlayer 'C:\\Windows\\Media\\tada.wav').PlaySync()",
          "async": true,
          "timeout": 10
        }
      ]
    }
  ],
  "PermissionRequest": [
    {
      "hooks": [
        {
          "type": "command",
          "shell": "powershell",
          "command": "(New-Object System.Media.SoundPlayer 'C:\\Windows\\Media\\Windows User Account Control.wav').PlaySync()",
          "async": true,
          "timeout": 10
        }
      ]
    }
  ]
}
```

> **หมายเหตุสำคัญ:** ต้องระบุ `"shell": "powershell"` ให้ครบทุก hook — เครื่องที่มี Git Bash ติดตั้งด้วย (ใช้กับ Claude Code's Bash tool) จะ default การรัน hook ไปที่ bash แทน ซึ่ง syntax `New-Object` ของ PowerShell รันไม่ได้ผ่าน bash

หลังแก้ `settings.json` แล้ว ต้องพิมพ์ `/hooks` หนึ่งครั้งใน session เพื่อให้ settings watcher โหลด config hooks ใหม่ (แก้ไฟล์เฉยๆ ไม่พอ ต้องสั่ง reload ด้วย)

## รายการ Skills (16 ตัว)

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
- domain-modeling
- grilling
- grill-with-docs

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

| Subagent | บทบาท | สิทธิ์ |
|---|---|---|
| sa-explore | ค้นหา/สรุปโครงสร้างโค้ด ประหยัด context | Read-only |
| sa-architect | ร่าง Architecture Blueprint ก่อนเขียนโค้ด (รออนุมัติก่อนเสมอ) | Read-only |
| sa-code-reviewer | รีวิวโค้ดตาม Security Checklist ก่อน commit | Read-only |
| sa-debugger | ไล่บั๊กด้วย Five Whys + แก้ไขจริง | Edit |
| sa-handoff | สรุปสถานะงานข้ามเครื่องผ่าน HANDOFF.md | Write (เฉพาะ HANDOFF.md) |
| sa-git-manager | Commit message, merge conflict, branch, PR ตาม Git Safety Protocol เข้มงวด | Edit + Bash (git) |

## Workflow แนะนำ

1. sa-explore → สำรวจโค้ดที่เกี่ยวข้องก่อน
2. sa-architect → ร่าง Blueprint แล้วรอ "อนุมัติ"
3. Plan Mode (Opus) → วางแผนละเอียด
4. Accept Edits (Sonnet) → ลงมือเขียนโค้ด
5. sa-code-reviewer → รีวิวก่อน commit
6. sa-debugger → ถ้าเจอ Critical issue
7. sa-git-manager → commit/push/PR อย่างปลอดภัย
8. sa-handoff → ก่อนปิดเครื่อง/สลับเครื่อง
