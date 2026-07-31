# Design System Reference (Neo-Glassmorphism)

> ส่วนหนึ่งของ `vibe-coding-core` — โหลดไฟล์นี้เมื่อเขียน CSS หรือออกแบบ UI

---

## DS-1 · Spacing — 8pt Grid
```
ค่าที่อนุญาต: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64px
Page padding : 24px (mobile) · 32px (tablet) · 48px (desktop)
Card padding : 16px (compact) · 20px (default) · 24px (spacious)
```

## DS-2 · Typography Scale
```
display : clamp(28px, 4vw, 40px)   / 400 / Fraunces (hero เท่านั้น)
h1      : clamp(20px, 2.5vw, 22px) / 500 / Sarabun
h2      : clamp(16px, 2vw, 17px)   / 500 / Sarabun
body    : 15px                     / 400 / Sarabun · line-height 1.75
caption : 12px                     / 400 / Sarabun

RULES: ✗ ห้าม font-weight 700 · ✓ ทุก heading มี eyebrow นำก่อน
```

## DS-3 · Border Radius
```
--r-sm: 6px · --r-md: 10px · --r-lg: 14px · --r-xl: 20px · --r-full: 9999px
```

## DS-4 · Color System (Role-Based — ห้าม Hardcode Hex)
```
SURFACE: bg-page · bg-card · bg-raised · bg-overlay
TEXT:    text-primary (≥7:1) · text-secondary (≥4.5:1) · text-tertiary

SEMANTIC:
  success : #059669 / #34d399  → Online · Completed
  warning : #d97706 / #fbbf24  → Caution · High
  danger  : #dc2626 / #f87171  → Error · Critical
  info    : #2563eb / #60a5fa  → Syncing · Notice
  brand   : #7c3aed / #a78bfa  → CTA · Focus · Active
```

## DS-5 · Neo-Glassmorphism
```css
.glass {
  background: rgba(19,19,22,.70);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: var(--r-xl);
  box-shadow: 0 12px 40px rgba(0,0,0,.15), 0 4px 8px rgba(0,0,0,.08);
}
```

## DS-6 · Status Glow (บังคับ Brand Identity)
```css
/* Green=Online · Amber=Offline · Blue=Syncing */
.glow-online  { box-shadow: 0 0 0 3px rgba(5,150,105,.35); }
.glow-offline { box-shadow: 0 0 0 3px rgba(217,119,6,.35); }
.glow-syncing { animation: pulse-blue 2s infinite; }
```

## DS-7 · Dark / Light Mode (CSS Variables บังคับ)
```css
:root {
  --bg-page: #0f0f12; --bg-card: #1a1a1f; --bg-raised: #242429;
  --text-primary: #f4f4f5; --text-secondary: #a1a1aa; --text-tertiary: #52525b;
  --border: rgba(255,255,255,.08); --brand: #7c3aed;
}
[data-theme="light"] {
  --bg-page: #f8f8fb; --bg-card: #ffffff; --bg-raised: #f0f0f5;
  --text-primary: #18181b; --text-secondary: #52525b; --text-tertiary: #a1a1aa;
  --border: rgba(0,0,0,.08); --brand: #6d28d9;
}
```
