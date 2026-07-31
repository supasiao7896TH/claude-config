# claude-config

Master repo สำหรับ Skills และ Subagents ส่วนตัวของ Supasit.A (พี่ A)
ใช้ sync การตั้งค่า Claude Code ระหว่างเครื่อง (บ้าน + ที่ทำงาน)

Single source of truth สำหรับ Claude Code Skills และ Subagents ของ Supasit.A — รวมจาก CLAUDE-Docc-For-Code เมื่อ 2026-07-31

## โครงสร้าง

```
claude-config/
├── skills/     → สำหรับ ~/.claude/skills/ (Personal scope, ใช้ได้ทุกโปรเจกต์)
│   ├── vibe-coding-core/references/       → deep-reference material (8 ไฟล์, โหลดตามความจำเป็น)
│   └── vibe-coding-workflow/references/   → deep-reference material (1 ไฟล์, โหลดตามความจำเป็น)
├── agents/     → สำหรับ ~/.claude/agents/ (Personal scope, ใช้ได้ทุกโปรเจกต์)
└── REVIEW.md   → audit trail ของการรีวิว SKILL.md 07/2026 (รวมมาจาก CLAUDE-Docc-For-Code)
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

## รายการ Skills (13 ตัว)

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

## รายการ Subagents

| Subagent | บทบาท | สิทธิ์ |
|---|---|---|
| sa-explore | ค้นหา/สรุปโครงสร้างโค้ด ประหยัด context | Read-only |
| sa-architect | ร่าง Architecture Blueprint ก่อนเขียนโค้ด (รออนุมัติก่อนเสมอ) | Read-only |
| sa-code-reviewer | รีวิวโค้ดตาม Security Checklist ก่อน commit | Read-only |
| sa-debugger | ไล่บั๊กด้วย Five Whys + แก้ไขจริง | Edit |
| sa-handoff | สรุปสถานะงานข้ามเครื่องผ่าน HANDOFF.md | Write (เฉพาะ HANDOFF.md) |

## Workflow แนะนำ

1. sa-explore → สำรวจโค้ดที่เกี่ยวข้องก่อน
2. sa-architect → ร่าง Blueprint แล้วรอ "อนุมัติ"
3. Plan Mode (Opus) → วางแผนละเอียด
4. Accept Edits (Sonnet) → ลงมือเขียนโค้ด
5. sa-code-reviewer → รีวิวก่อน commit
6. sa-debugger → ถ้าเจอ Critical issue
7. sa-handoff → ก่อนปิดเครื่อง/สลับเครื่อง
