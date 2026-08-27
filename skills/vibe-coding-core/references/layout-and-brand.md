# Layout & Brand Identity Reference — "Instrument Grade"

> ส่วนหนึ่งของ `vibe-coding-core` — โหลดไฟล์นี้เมื่อออกแบบ layout หรือตรวจ brand compliance
> อัปเดต 2569-08-27: คู่กับ `design-system.md` (Instrument Grade) — **แทนที่ Tactile Plant UI เดิม**

---

## Layout Guide

พี่ A ตอบว่าอุปกรณ์ **"แล้วแต่โปรเจกต์"** — ระบบนี้จึงไม่บังคับ mobile-first หรือ desktop-first
แต่กำหนด **โครงกลางโครงเดียวที่พลิกได้ทั้งสองทาง** โดยไม่ต้องออกแบบใหม่

```
Topbar (บังคับทุกขนาดจอ):
  sticky top-0 · พื้น = --ground ที่ blur (color-mix 88% + backdrop-filter: blur(10px))
  border-bottom: 1px solid var(--line)
  ซ้าย: ชื่อแอปเป็น Mono UPPERCASE letter-spacing .14em สี --teal-deep
        นำหน้าด้วยจุดสถานะ 9px (box-shadow: 0 0 0 3px var(--teal-wash))
  ขวา: ปุ่มสลับธีม (.theme-btn — Mono 11px UPPERCASE)
  ❌ ห้ามใช้ gradient-text ที่ชื่อแอปอีก (ตัดออกจากระบบแล้ว)

Sidebar (PC/Desktop ≥768px):
  พื้น = --ground เดียวกับหน้า · border-right: 1px solid var(--line)
  เมนู: Lucide icon 20px + label · สถานะ active = สี --teal-deep + พื้น --teal-wash
  hover = --line-strong

Bottom Nav (Mobile ≤768px):
  position: fixed · พื้น --surface · border-top: 1px solid var(--line)
  icon-only 20px · active = --teal-signal
  ต้องเผื่อ safe-area: padding-bottom: env(safe-area-inset-bottom)
  วางเหนือแถบ A(i)CODER badge เสมอ ไม่ทับกัน

KPI Tile:
  .card + .tag-strip (ถ้าข้อมูลมีรหัสกำกับจริง) + .val แบบ Mono tabular
  + .delta (chip เล็กบอกการเปลี่ยนแปลง ใช้สี ok/warn/crit)
  ❌ ไม่ใช้ border-t-4 สีตามหมวดหมู่อีกแล้ว (ระบบเดิม) — สีสงวนไว้ให้สถานะ

Grid:
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px
  การ์ดเนื้อหาทั่วไปใช้ minmax(280px, 1fr)

Section:
  padding: 48px 0 (mobile) → 64px 0 (desktop)
  คั่นด้วย border-bottom: 1px solid var(--line) — ไม่ใช้พื้นสีสลับ

Content width:
  max-width: 1080px · padding: 0 24px
  ข้อความยาว max-width: 62ch
```

---

## Brand Identity (Supasit.A × Instrument Grade)

```
Eyebrow (ป้ายกำกับเหนือหัวเรื่อง):
  --font-data · 11px · 500 · letter-spacing .18em · UPPERCASE · สี --brass
  ใช้บอกประเภทของหน้า/ส่วน เช่น "DESIGN SYSTEM · ฉบับเสนอเพื่อพิจารณา"

Section tag (เลขลำดับหัวข้อ):
  --font-data · 11px · letter-spacing .16em · UPPERCASE · สี --teal-deep
  ใช้เลขลำดับ (01 · 02 · 03) เฉพาะเมื่อเนื้อหาเป็นลำดับจริงเท่านั้น
  ถ้าไม่ใช่ลำดับ ให้ใช้ชื่อหมวดแทนตัวเลข

Header ของแอป:
  โปร่งใส กลมกลืนกับ --ground (คงหลักการเดิม)
  Status indicator: จุดสีนิ่งๆ — ห้ามกะพริบ (.pulse-dot ตัดออกจากระบบแล้ว)
  ปุ่ม Dark/Light toggle ใช้ .theme-btn (ขอบ 1px + Mono label)

A(i)CODER Badge (บังคับทุกแอป — คงเดิม):
  ที่มา: claude-config/branding/ (README.md มีกติกาเต็ม)
  ใช้ D1 "bare" (exports/d1-neon-arcade-bare.svg) วางบนพื้นสว่างคงที่ #F7F5FB เสมอ
  (ไม่ตามธีมแอป — D1 ต้องไม่อยู่บนพื้นมืดเด็ดขาด)
  ตำแหน่ง: มือถือ = แถบเต็มความกว้างล่างสุด (ใต้ bottom nav เหนือ safe area)
           PC = กล่องลอยมุมขวาล่าง fixed bottom-5 right-4
  ติดตั้ง: copy branding/exports/d1-neon-arcade-bare.svg → public/aicoder-badge.svg

Icons: Lucide เท่านั้น stroke-width 1.75 — ห้าม emoji เป็นไอคอนของปุ่ม/nav

Micro-interactions (ดู design-system.md IG-9):
  - fade-in / slide-up เมื่อการ์ดโหลดครั้งแรก
  - hover การ์ด: border เข้มขึ้น + เงาบางๆ (ไม่ใช้ scale)
  - ปุ่มกด: translateY(1px) + inset shadow (นี่คือที่เดียวที่เก็บความรู้สึก tactile ไว้)
  - ❌ ห้าม: breathing, pulse, gradient, parallax, ambient animation
```

---

## Voice & Copy (ส่วนของแบรนด์ที่ไม่ใช่ภาพ)

```
เขียนจากฝั่งผู้ใช้ ไม่ใช่ฝั่งระบบ:
  ❌ "Sync config ล้มเหลว (error 503)"
  ✅ "บันทึกขึ้นคลาวด์ไม่สำเร็จ — ข้อมูลยังอยู่ในเครื่อง ลองใหม่อีกครั้งได้เลย"

ปุ่มบอกสิ่งที่จะเกิดขึ้นจริง: "บันทึกค่า" → toast "บันทึกแล้ว"
ข้อความ error บอกว่าเกิดอะไรและแก้ยังไง — ไม่ขอโทษ ไม่คลุมเครือ
หน่วยวัดเขียนแยกจากตัวเลขเสมอ (196.85 °C ไม่ใช่ 196.85°C ติดกัน)
```

---

## Reference Implementation

Artifact **"Instrument Grade"** (สร้าง 2569-08-27) — มี token ครบทั้ง light/dark
พร้อม component จริงที่กดได้: KPI tile · ปุ่ม 4 แบบ · form · ตาราง · layout diagram
และส่วนเทียบกับ Tactile Plant UI เดิม

ดู URL ล่าสุดได้จาก `/artifacts` ใน Claude Code CLI หรือ claude.ai/code/artifacts
