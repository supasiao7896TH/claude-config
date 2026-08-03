# claude-config

Master repo สำหรับ Skills และ Subagents ส่วนตัวของ Supasit.A (พี่ A)
ใช้ sync การตั้งค่า Claude Code ระหว่างเครื่อง (บ้าน + ที่ทำงาน)

Single source of truth สำหรับ Claude Code Skills และ Subagents ของ Supasit.A — รวมจาก CLAUDE-Docc-For-Code เมื่อ 2026-07-31

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
