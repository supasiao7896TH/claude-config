# claude-config — กฎเฉพาะ repo นี้

> กฎส่วนตัวทุกโปรเจกต์ (persona หนู/ค่ะ, สไตล์การสื่อสาร, Code Review Gate, Known Issues)
> อยู่ที่ `global/CLAUDE.md` → copy ไป `~/.claude/CLAUDE.md` แล้ว **ไม่ต้องซ้ำที่นี่**
> (ถ้าซ้ำ Claude จะโหลดเนื้อหาเดียวกัน 2 รอบทุก session ใน repo นี้)

## repo นี้คืออะไร

มาตรฐานกลางของ Supasit.A: `skills/` · `agents/` · `design-lab/` · `settings.json` · `tools/`
เครื่องมือของ Gemini/Antigravity อยู่ที่ repo แยก `gemini-config` — ไม่เก็บที่นี่

## ก่อน commit ทุกครั้ง

- `npm run check` (prettier + secretlint + `check:standards`) ต้องผ่าน
- แก้กฎใน `tools/security-gate.ps1` → รัน `tools/test-security-gate.ps1` ด้วย
- `tools/*.ps1` ต้องเป็น **ASCII ล้วน** (Windows PowerShell 5.1 อ่านไฟล์ไม่มี BOM เป็น ANSI)
- แก้ `global/CLAUDE.md` / `USER.md` / `settings.json` แล้ว **ต้อง copy ไป `~/.claude/` ด้วย**
  (ไม่ auto-sync) — `npm run doctor` จะบอกว่าเครื่องนี้ยังตรงกับ repo หรือไม่

## กับดักที่เจอจริงแล้ว

- ใน `settings.json` ห้ามเขียน path แบบ `\tools\…` ตรงๆ — JSON ตีความ `\t` เป็น TAB (เคยทำให้ security gate เงียบไปทั้งตัว)
  ใช้ `Join-Path` หรือ `/` แทน
- `settings.json` ใน repo เป็น template: `statusLine` ยังเป็น placeholder `<ชื่อ user บนเครื่องนี้>` โดยตั้งใจ
