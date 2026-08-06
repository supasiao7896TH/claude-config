---
name: vibe-coding-firebase
description: >
  Firebase Stack Skill สำหรับ Online Web App · Real-Time · Multi-User — ใช้ร่วมกับ
  vibe-coding-core เมื่อแอปที่กำลังสร้าง (ใหม่หรือเพิ่มฟีเจอร์) ต้องการ Firestore
  real-time, Firebase Auth, FCM Push Notification, LINE WebView, หรือ GitHub
  Actions CI/CD โดยเฉพาะ หรือพูดถึงคำว่า Firebase / Firestore / real-time /
  หลาย user ตรงๆ
---

# Vibe Coding Firebase — Supasit.A Skill

> **Scope:** Online Web App · Real-Time Firestore · Firebase Auth · FCM · GitHub Actions
> **ใช้เมื่อ:** แอปต้องการ real-time หลาย user / Push Notification / LINE WebView
> **ใช้ร่วมกับ:** vibe-coding-core เสมอ

| | |
|---|---|
| **Version** | 6.1 |
| **Updated** | 2026-08 |
| **Brand** | A-Class WebCraft · Code • Share • Inspire · by Supasit.A |
| **Sections in this file** | §20 |
| **Related skills** | `vibe-coding-core` (§1–17) — โหลดร่วมกันเสมอ |

---

## § 20 · Online Web App Stack (Real-Time / Firebase)

> **WHY:** Local-First IndexedDB เหมาะกับแอปใช้คนเดียว แต่เมื่อต้องการ Real-Time หลาย User
> หรือ Push Notification ต้องเปลี่ยนมาใช้ Firebase Stack นี้แทน

### Tech Stack มาตรฐาน

| หมวด | เทคโนโลยี | หมายเหตุ |
|---|---|---|
| Frontend | Single-File HTML + Tailwind CSS (CDN) + Vanilla JS | เหมือน Local-First |
| Database | **Firebase Firestore** (real-time `onSnapshot`) | Sync ทุก client อัตโนมัติ |
| Auth | **Firebase Anonymous Auth + `inMemoryPersistence`** | ⚠️ ห้ามใช้ default — LINE/FB WebView บล็อก IndexedDB |
| Push Notification | **Firebase Cloud Messaging (FCM)** + Cloud Functions v2 | ส่ง notification ข้าม device |
| Hosting | GitHub Pages *หรือ* Cloudflare Workers (static assets) | ดู §20 GitHub Actions Deploy Flow / Cloudflare Workers Deploy Flow |
| CI/CD | **GitHub Actions** | deploy Pages + Functions (หรือ Cloudflare Workers) อัตโนมัติเมื่อ push to `main` |
| PWA | Service Worker (`sw.js`) + `manifest.json` | เหมือนเดิม |

### กฎบังคับ (ห้ามข้าม)

```
1. bump CACHE_NAME ใน sw.js (vX → v(X+1)) ทุกครั้งที่แก้โค้ด
   WHY: ถ้าไม่ bump → browser ยังใช้ cache เก่า → user เห็นโค้ดเก่าโดยไม่รู้ตัว

2. Firestore Rules ต้อง deploy manual แยกต่างหาก (หรือผ่าน CI ด้านล่าง)
   คำสั่ง: npx firebase-tools deploy --only firestore:rules

3. ใช้ inMemoryPersistence เสมอ
   WHY: LINE / FB / IG WebView บล็อก IndexedDB → Firebase default auth จะ fail

4. ไม่มี rule ไหน allow read/write: if true; เด็ดขาด — ดูตัวอย่าง rules จริงด้านล่าง
```

### Firebase Auth — inMemoryPersistence (บังคับ)

```javascript
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import {
  getAuth, signInAnonymously,
  inMemoryPersistence, setPersistence
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

const auth = getAuth(app);
await setPersistence(auth, inMemoryPersistence); // ← set ก่อน signIn เสมอ
await signInAnonymously(auth);
```

### Firestore Schema

```
artifacts/{appId}/public/data/
├── {collection}/{docId}   ← ข้อมูลหลัก (ต้องมี ownerId ทุก document)
└── logs/{docId}           ← audit trail (create-only, immutable)
```

```javascript
// Real-Time onSnapshot Pattern
import { getFirestore, collection, onSnapshot } from '...firebase-firestore.js';

const db = getFirestore(app);
const colRef = collection(db, `artifacts/${APP_ID}/public/data/items`);

onSnapshot(colRef, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added')    UI_RENDERER.addItem(change.doc.data());
    if (change.type === 'modified') UI_RENDERER.updateItem(change.doc.data());
    if (change.type === 'removed')  UI_RENDERER.removeItem(change.doc.id);
  });
});
```

### Firestore Security Rules — ตัวอย่างจริง (auth-first, deny-by-default)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /artifacts/{appId}/public/data/{collection}/{docId} {
      allow read:   if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null
                    && resource.data.ownerId == request.auth.uid;
    }

    // audit trail — สร้างได้ แต่ห้ามแก้/ลบ แม้แต่เจ้าของเอง
    match /artifacts/{appId}/public/data/logs/{docId} {
      allow read:   if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }

    // deny-by-default — path ที่ไม่ได้ระบุไว้ข้างบน ปิดหมด
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

> **WHY deny-by-default block ท้ายสุด:** ถ้าลืมเขียน rule ให้ collection ใหม่ที่เพิ่มทีหลัง
> Firestore default คือ "ไม่มี rule ตรงกัน = ปฏิเสธ" อยู่แล้ว แต่การเขียน `{document=**}` ปิดชัดเจน
> ป้องกันคนอื่นมาเขียน rule ใหม่ทับโดยไม่ตั้งใจเปิดกว้างเกินไป

### LINE / WebView Handling

```javascript
function detectWebView() {
  const ua = navigator.userAgent;
  return {
    isLINE: /Line\//i.test(ua),
    isFB  : /FBAN|FBAV/i.test(ua),
    isIG  : /Instagram/i.test(ua),
  };
}

function showWebViewWarning() {
  const wv = detectWebView();
  if (!wv.isLINE && !wv.isFB && !wv.isIG) return;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const msg = isIOS
    ? '⚠️ กรุณาเปิดใน Safari เพื่อประสบการณ์ที่ดีที่สุด'
    : '⚠️ กรุณาเปิดใน Chrome เพื่อประสบการณ์ที่ดีที่สุด';
  UI_RENDERER.showBanner(msg, {
    action: 'คัดลอกลิงก์',
    onClick: () => navigator.clipboard.writeText(location.href)
  });
}
```

### GitHub Actions Deploy Flow

> ⚠️ **อัปเดตสำคัญ:** เวอร์ชันก่อนหน้าของ skill นี้ใช้ `firebase login:ci` เพื่อสร้าง
> `FIREBASE_TOKEN` แบบ long-lived — Firebase เริ่มเลิกแนะนำวิธีนี้เพราะ token ผูกกับบัญชี
> ส่วนตัวและมีสิทธิ์กว้างเกินความจำเป็น ให้ใช้ **Service Account + Workload Identity
> Federation** แทน (ไม่มี long-lived secret หลุดออกไปเลย)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./

  deploy-firebase:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write   # จำเป็นสำหรับ Workload Identity Federation
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci --prefix functions

      - id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}

      - name: Deploy Firebase (Functions + Rules)
        run: |
          npx firebase-tools deploy --only functions,firestore:rules \
            --project ${{ secrets.FIREBASE_PROJECT_ID }}
```

```
Setup ครั้งเดียวต่อโปรเจกต์ (นอก CI):
  1. สร้าง Service Account ใน Google Cloud Console ที่มีสิทธิ์แค่ที่จำเป็น
     (Firebase Admin ของ project นี้เท่านั้น ไม่ใช่ Owner ทั้ง org)
  2. ตั้ง Workload Identity Federation ผูกกับ repo GitHub นี้โดยเฉพาะ
     (ดูขั้นตอนที่ google-github-actions/auth README) — ไม่มี key file ให้ต้องเก็บ/หมุนเวียนเลย
  3. ถ้า setup WIF ยังไม่สะดวก ทางเลือกรองคือ service-account JSON key เก็บใน
     GitHub Secrets (`credentials_json:`) + ตั้งเตือน rotate ทุก 90 วัน —
     แคบกว่า FIREBASE_TOKEN เดิมมาก แต่ยังต้อง manage key file เอง
```

### Cloudflare Workers Deploy Flow (ทางเลือกแทน GitHub Pages)

> **WHY:** ใช้ทางเลือกนี้เมื่อ hosting เป็น Cloudflare Workers (static assets) แทน GitHub Pages
> — เจอเคสจริงที่โปรเจกต์ตั้งค่า Worker ผูกกับ GitHub repo ไว้ใน Cloudflare dashboard แล้ว
> แต่ deploy ยังเป็นแบบ **"Manually deployed"** (ต้องกด "New deployment" → อัปโหลดไฟล์เอง
> ทุกครั้ง) ทำให้ push ขึ้น `main` ไม่ทำให้ production อัปเดตจริง — โค้ด fix ที่ push ไปแล้ว
> ค้างอยู่ ไม่ได้ใช้งานจริงจนกว่าจะจำได้ว่าต้องมา deploy manual ซ้ำ (PM-500 Runtime Tracker
> เจอเคสนี้ตรงๆ เมื่อ 2569-08-06 — บั๊กที่ "แก้แล้วในโค้ดแต่ยังไม่หาย" กลายเป็นปัญหา
> deploy ไม่ใช่ปัญหาโค้ด) วิธีข้างล่างนี้ทำให้ push = deploy จริง ไม่ต้องพึ่งความจำอีก
>
> **ข้อดีสำคัญ:** ทั้ง `wrangler deploy` และ Node.js รันบน GitHub-hosted runner (cloud)
> ทั้งหมด — เครื่อง PC ของผู้ใช้ (บ้าน/ที่ทำงาน) **ไม่ต้องติดตั้ง Node.js เลย** เหมาะกับ
> เครื่องที่ฝ่าย IT บล็อกการติดตั้งซอฟต์แวร์เพิ่มด้วย

`wrangler.jsonc` (วางไว้ที่ root repo, commit เข้า git ปกติ — ไม่ใช่ความลับ):

```jsonc
{
  "name": "ชื่อ-worker-ตรงกับใน-cloudflare-dashboard",
  "account_id": "account-id-จาก-cloudflare-dashboard",  // ไม่ใช่ความลับ เห็นได้ใน URL ของ dashboard
  "compatibility_date": "2026-08-06",
  "assets": {
    "directory": "./"          // path ไปยังโฟลเดอร์ที่มี index.html — ปกติคือ root
  },
  "observability": {
    "enabled": false,
    "head_sampling_rate": 1,
    "logs": {
      "enabled": true,          // เปิด Workers Logs ให้ค่านี้ "เป็นโค้ด" จะได้ไม่หายตอน deploy รอบหน้า
      "head_sampling_rate": 1,
      "persist": true,
      "invocation_logs": true
    },
    "traces": { "enabled": false, "persist": true, "head_sampling_rate": 1 }
  }
}
```

`.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

```
Setup ครั้งเดียวต่อโปรเจกต์ (นอก CI, ต้องทำเองเสมอ — ห้าม AI แตะ credential):
  1. สร้าง Cloudflare API Token ที่ https://dash.cloudflare.com/profile/api-tokens
     → "Create Token" → เลือก permission "Edit Cloudflare Workers" เท่านั้น
     (scope แคบสุด ไม่ใช้ Global API Key) → จำกัดให้เหลือแค่ account ที่ต้องการ
  2. เอา token ไปตั้งเป็น GitHub Secret ของ repo นี้:
     Settings → Secrets and variables → Actions → New repository secret
     → ชื่อ CLOUDFLARE_API_TOKEN
  3. ยืนยันค่าใน wrangler.jsonc (name, account_id, compatibility_date) ให้ตรงกับที่
     เห็นจริงในหน้า Cloudflare dashboard ของ Worker นั้นก่อน push ครั้งแรก
```

> **⚠️ อย่าลืม:** ถ้า Worker เดิมเคย deploy แบบ manual upload มาก่อน (ผ่านปุ่ม
> "New deployment" → "file") ให้เช็ค observability settings (Workers Logs/Traces)
> ในหน้า dashboard เทียบกับ `wrangler.jsonc` ก่อน push ครั้งแรกด้วย — ค่าที่เคยตั้งไว้ผ่าน
> dashboard อย่างเดียว (ไม่ได้เขียนลง `wrangler.jsonc`) มีโอกาสถูก deploy ผ่าน CI ทับ/รีเซ็ต
> กลับเป็นค่า default ได้

### Decision Table — ใช้ Stack ไหน?

```
คำถาม                                       → Stack
──────────────────────────────────────────────────────────
ใช้คนเดียว, offline-first                  → Local-First (IndexedDB) — vibe-coding-core §2–3
หลาย user ดูข้อมูลเดียวกัน real-time       → Firebase Stack (§ 20 นี้)
ต้องการ Push Notification                  → Firebase Stack (§ 20 นี้)
เปิดใน LINE / แชร์ Link                    → Firebase Stack (§ 20 นี้)
ต้องการ Auth (login email/google)          → Firebase Stack + Auth Provider
```

---

*SKILL: vibe-coding-firebase v6.1 | Section: §20*
*Supasit.A × A-Class WebCraft | Code • Share • Inspire*
*Related: vibe-coding-core (โหลดร่วมกันเสมอ)*
*Updated: August 2026 (พ.ศ. 2569)*
