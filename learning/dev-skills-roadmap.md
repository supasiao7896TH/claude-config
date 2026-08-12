# dev-skills-roadmap.md

สมุดจด roadmap การเรียนรู้พื้นฐานการเขียนโค้ด — เริ่มจากมือใหม่เกือบศูนย์ ค่อยๆ ไต่ไปถึงระดับ senior dev เก็บไว้อ่านย้อนหลัง/ทบทวนหากลืมเนื้อหา

**เริ่มเมื่อ:** 2026-08-12 (session แรกในโปรเจกต์ `Check Out of Range Log`)

**Baseline ตอนเริ่ม:** เขียนโค้ดเองแทบไม่เป็นเลย (ไม่รู้ syntax พื้นฐานภาษาไหนเลย) แม้จะสั่ง AI เขียนแทนแบบ Vibe Coding มานานแล้ว

**โหมดการเรียน — ปรับใหม่ 2026-08-12 (วันเดียวกับที่เริ่ม):** ทดลอง format "ให้โจทย์ฝึกเขียนเอง" ไปครั้งแรก (โจทย์ `myName` variable) แล้วพี่ A **ปฏิเสธทันที** — เหตุผล: สุดท้ายก็จะใช้ Vibe Coding (ให้ AI เขียนแทน) อยู่ดี ไม่อยากเขียนโค้ดเอง สิ่งที่ต้องการจริงคือ **เข้าใจ concept** ว่า AI กำลังทำอะไร ทำไมทำแบบนี้ ทำถูกไหม — เพื่อจะได้ไม่กด "OK/อนุมัติ" แบบไม่รู้อะไรเลย ต้องการเรียนไปพร้อมๆ กับตอนที่ AI กำลังเขียนโค้ดจริงให้ (explain-while-doing) ไม่ใช่ sandbox exercise แยกต่างหาก

→ **โหมดที่ใช้จริงตอนนี้:** ไม่มีโจทย์/แบบฝึกหัดอีกต่อไป Claude จะแทรกคำอธิบายสั้นๆ ระหว่างที่เขียน/แก้โค้ดให้ในงานจริง ว่ากำลังทำอะไร ทำไมเลือกวิธีนี้ มี trade-off อะไร เพื่อให้พี่ A ตามทันและประเมินได้

**เนื้อหาผูกกับ:** ทั้งทฤษฎีทั่วไป (JS/Git/HTTP fundamentals) และโค้ดจริงในโปรเจกต์ `Check Out of Range Log` (Plant Log Analyzer) + web tool อื่นๆ ในแบรนด์ A-Class WebCraft

---

## 🗺️ Roadmap ทั้งหมด

| Level | หัวข้อหลัก | ผูกกับ |
|---|---|---|
| 1. Foundation | HTML/CSS/JS syntax พื้นฐาน — variable, function, if/else, loop, array, object | ทฤษฎีล้วน + mini exercise |
| 2. DOM & Browser | เข้าใจ DOM, event, `querySelector`, form handling | ฝึกกับหน้าเว็บง่ายๆ |
| 3. Tooling พื้นฐาน | Git/GitHub (commit, branch, push/pull), terminal, npm คืออะไร | เชื่อมกับ workflow บ้าน↔ที่ทำงานที่ใช้ GitHub sync อยู่แล้ว |
| 4. JS ระดับกลาง | async/await, fetch, ES Modules (`import`/`export`), error handling | อ่านโค้ดจริงใน `src/modules/` ของโปรเจกต์ Check Out of Range Log |
| 5. โครงสร้างแอปจริง | State management, IndexedDB, module pattern | เดินโค้ด `STATE`, `STORAGE_ENGINE` ทีละส่วน |
| 6. Testing & Quality | Unit test คืออะไร ทำไมต้องมี, อ่าน/เขียน Vitest test เบื้องต้น | อ่าน `tests/excel-worker.test.js` จริง |
| 7. Senior mindset | Code review, root cause debugging, architecture trade-off, security basics | เทียบกับ `sa-code-reviewer`/`sa-debugger` ที่ใช้อยู่ |

---

## 📖 Log ความคืบหน้า

### 2026-08-12 — เริ่ม Level 1: Foundation

- อธิบาย `npm create vite@latest` คืออะไร (scaffold โปรเจกต์ frontend ด้วย Vite, ยังไม่ install dependencies ต้อง `npm install` เอง แล้ว `npm run dev` เพื่อเปิด dev server + HMR)
- เทียบให้เห็นว่าโปรเจกต์ `Check Out of Range Log` ก็ผ่านการ migrate มาเป็นโครงสร้าง Vite + ES Modules แบบเดียวกันนี้แล้ว (ตั้งแต่ V29.70)
- ลองให้โจทย์แรก (`myName` variable) → พี่ A ปฏิเสธ format แบบฝึกหัด ขอเปลี่ยนเป็น conceptual literacy แทน (ดูรายละเอียดด้านบน) ตั้งแต่นี้ไปจะไม่มีโจทย์ให้ทำแล้ว

---

*อัปเดตไฟล์นี้ทุกครั้งที่มี session เรียนใหม่ หรือขึ้น level ใหม่ — ไม่ต้องสร้างไฟล์แยกรายวัน ใช้ log ต่อท้ายในไฟล์นี้พอ*
