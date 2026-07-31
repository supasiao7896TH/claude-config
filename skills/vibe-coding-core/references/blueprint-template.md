# Architecture Blueprint Template

> ส่วนหนึ่งของ `vibe-coding-core` — ใช้ใน § 1 Step 3 (Architecture Blueprint)

```markdown
## 🏗️ Architecture Blueprint — [ชื่อแอป]

### Target & Platform
- Device  : [Mobile / PC / Responsive]
- Network : [Online-only / Offline-first / Hybrid]
- Auth    : [Anonymous / Firebase Auth / None]

### Modules (เลือกเท่าที่ใช้)
| Module | ใช้ | หน้าที่ |
|--------|-----|---------|
| APP_CONFIG | ✅ | Config, CDN, tokens |
| STATE_STORE | ✅ | Reactive state |
| STORAGE_ENGINE | ✅ | IndexedDB |
| CLOUD_SYNC_MANAGER | ⬜ | Firestore sync |
| AUTH_PROVIDER | ⬜ | Login system |
| GEMINI_AI_BRIDGE | ✅ | AI features |
| UI_RENDERER | ✅ | Components |
| DEBUG_MODULE | ✅ | Logging |
| APP_CORE | ✅ | Init + routing |

### Data Schema (IndexedDB)
```
Store: [store_name]
  id        : string (PK)
  [field]   : type
  createdAt : timestamp
  updatedAt : timestamp
  _syncStatus: 'pending' | 'synced' | 'error'
```

### Pages / Views
1. [หน้าหลัก] — [คำอธิบาย]
2. [หน้าที่ 2]  — [คำอธิบาย]

### Key Features
- [ ] [Feature 1]
- [ ] [Feature 2]

### Roadmap Phases
① Local-First HTML+IndexedDB
② AI Intelligence (Gemini BYOK)
③ Cloud Sync (Firebase)
④ Deploy GitHub Pages
```
