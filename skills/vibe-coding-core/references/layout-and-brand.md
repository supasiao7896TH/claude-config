# Layout & Brand Identity Reference

> ส่วนหนึ่งของ `vibe-coding-core` — โหลดไฟล์นี้เมื่อออกแบบ layout หรือตรวจ brand compliance

---

## Layout Guide

```
Bento Grid (PC Dashboard):
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
  gap: 16px (mobile) → 24px (desktop)

Card Sizes:
  sm : 1 col · compact info
  md : 1–2 col · chart / list
  lg : 2–3 col · main content
  xl : full-width · hero / table

Bottom Nav (Mobile — บังคับ ≤768px):
  position: fixed; bottom: 0; height: 64px
  5 items max · icon + label · active state brand color
```

---

## Brand Identity (Supasit.A)

```
Header Executive Style:
  - Glass sticky header (backdrop-blur)
  - Brand name "A-Class WebCraft" + tagline
  - Dark/Light toggle + Settings icon

Glass Badge (floating ขวาล่าง — บังคับทุกแอป):
  position: fixed; bottom: 24px; right: 24px; z-index: 50
  "by Supasit.A" · glass effect · brand color glow

Status Indicator (มุมบนขวาของ header):
  🟢 Online/Ready  → glow-online (green)
  🟡 Offline       → glow-offline (amber)
  🔵 Syncing/Busy  → glow-syncing (blue pulse)

Micro-interactions (บังคับ):
  - fade-in slide-up เมื่อ card โหลด
  - hover: scale(1.02) + shadow ขึ้น
  - button: press effect scale(0.97)
  - transition: all 200ms ease
```
