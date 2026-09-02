<!-- โปรไฟล์ผู้ใช้งาน — โหลดทุก session เพื่อรู้จักพี่ A -->
@USER.md

# Global preferences (all projects)

## Communication style

Respond in a mix of roughly **70% Thai / 30% English**, not full English.

- Keep technical terms untranslated in English: file names, function/variable names, tool names, CLI commands, flags, error messages, code snippets.
- Use Thai for explanations, context, and conversational parts.
- Why: the user is a Thai speaker; Thai should carry most of the conversation, with English kept for technical terms and light practice exposure.
- Applies across every project/repo, not just one.

## Known Issues — Windows Plugin Install

**Symptom:** `/plugin marketplace add <repo>` fails with `EBUSY`/`EPERM: resource busy or locked` during the internal clone→rename step (e.g. `rename 'anthropics-skills' -> 'anthropic-agent-skills'`), even though `icacls` shows the user account has Full Control on the target folder.

**Root cause:** Race condition — the CLI clones the repo then immediately renames the folder. On a machine where Windows Defender real-time protection (`MsMpEng`) and/or a corporate OneDrive sync client (`OneDrive.Sync.Service`) briefly lock newly-written files before the rename completes, the rename throws EBUSY/EPERM. It is not a permissions problem — retrying the exact same CLI command usually fails again for the same reason. Not machine-specific: any Windows machine running Defender/OneDrive can hit this.

**Workaround (no admin/no VS Code-as-admin needed):**
1. Check `C:\Users\<username>\.claude\plugins\marketplaces\` for a leftover partially-cloned folder from the failed attempt; if empty/broken, delete it.
2. Manually `git clone <repo-url>` into that `marketplaces` folder under a temp name — this bypasses the CLI's internal race entirely and reliably succeeds.
3. Delete the `.git` folder from the clone (installed marketplaces in this CLI don't keep git metadata).
4. Rename the folder to match the `name` field inside its `.claude-plugin/marketplace.json` (this is the name the CLI expects, e.g. `anthropic-agent-skills` for repo `anthropics/skills`).
5. Add a matching entry to `C:\Users\<username>\.claude\plugins\known_marketplaces.json` by hand, following the existing `claude-plugins-official` entry's schema (`source.source: "github"`, `source.repo`, `installLocation`, `lastUpdated`).
6. Confirm with `/plugin marketplace list` — the marketplace should now show as configured, and `/plugin install <plugin>@<marketplace-name>` works normally from there.

## Code Review Gate (all projects, บังคับ)

**กติกา:** เป็น**ชั้นที่ 2 เพิ่มจาก `/ตรวจ` เดิม** (sa-code-reviewer ที่รันใน session เดียวกับที่เขียนโค้ด ระหว่างพัฒนา — ยังใช้ตามปกติ ไม่ได้ถูกแทนที่) ก่อน merge/push โค้ดที่แตะ production หรือข้อมูลจริง ต้องผ่าน **`/code-review` แบบ fresh session แยกต่างหาก** เพิ่มอีกชั้นเสมอ — ห้ามให้ชั้นนี้รันใน session เดียวกับที่เขียนโค้ด ถึงจะนับว่าผ่านกติกาข้อนี้ (งานใหญ่ใช้ effort level สูงสุด `/code-review ultra` — เป็น multi-agent cloud review, `/ultrareview` เป็นแค่ alias เดิมของคำสั่งเดียวกัน ไม่ใช่คำสั่งแยก)

- **ทำไม:** พี่ A ทำ vibe coding ล้วนๆ ยังไม่เขียน syntax เอง `/ตรวจ` ใน session เดิมช่วยจับข้อผิดพลาดระหว่างพัฒนาได้ดี แต่ยังมี blind spot เดิม: AI ตัวที่เขียนโค้ดเป็นคนตรวจเอง มักมองข้ามจุดบอดที่ตัวเองสร้าง (rationalize เหตุผลที่เลือกไปแล้ว) — ก่อนขึ้น production ต้องมี context ใหม่จริงๆ ที่ไม่มี bias จากการเขียนมาช่วยจับซ้ำอีกชั้น
- **ขอบเขต:** ชั้นที่ 2 นี้ใช้เฉพาะงานที่กระทบ production/ข้อมูลจริงเท่านั้น ไม่บังคับกับเครื่องมือทดลองเล็กๆ ที่ใช้ครั้งเดียวทิ้ง (กัน friction เกินจำเป็น) — `/ตรวจ` ระหว่างพัฒนายังทำตามปกติทุกกรณี
- **สิ่งที่พี่ A ตรวจเองได้โดยไม่ต้องอ่านโค้ด:** (1) รันแอปจริงเช็ค golden path + edge case, (2) อ่าน test description ที่เป็นประโยคอ่านออก (เช่น `it('ควรปฏิเสธการจองซ้ำ')`), (3) ให้ AI สรุป "ทำไมเลือกวิธีนี้" และ "เสี่ยง/trade-off อะไร" ก่อนขออนุมัติทุกครั้ง (ส่วนหนึ่งของ Explain-while-doing ใน USER.md)

Confirmed 2569-09-02 — ตอบข้อกังวลเรื่องความเสี่ยงเชิงโครงสร้างของ vibe coding ล้วนๆ (AI ตรวจงานตัวเองในบริบทเดิม) แก้ไข 2569-09-02 หลัง `/code-review` รอบแรกจับได้ว่าเวอร์ชันแรกขัดกับ `/ตรวจ` เดิมและอ้างคำสั่ง "ultrareview" ที่ไม่มีจริงใน repo
