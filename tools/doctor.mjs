// doctor — ตรวจว่าเครื่องนี้ตรงกับ repo (อ่านอย่างเดียว ไม่แก้อะไรทั้งสิ้น)
//
// ใช้: npm run doctor        (ออกด้วย code 1 ถ้าเจอ ❌)
//
// เทียบ ~/.claude กับ claude-config โดยข้ามสิ่งที่ต่างตามเครื่องโดยออกแบบ:
//   - settings.json: ข้าม statusLine (path ตาม username) และ model
//   - CLAUDE.md: ไม่เทียบ (ฉบับ repo ตัดข้อความเฉพาะเครื่องออกโดยตั้งใจ)
// และเทียบสำเนา skill บน claude.ai กับสมุดบัญชี claude-ai-skills.json (ดูหัวข้อ 5 ด้านล่าง)
// ปรับปรุงเมื่อ 2569-10-02 ตามที่ README บันทึกไว้ว่า settings.json/statusline.ps1 ต้อง copy มือ

import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const home = join(homedir(), ".claude");

const results = [];
const add = (level, label, detail = "") => results.push({ level, label, detail });

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
// ปลายบรรทัด CRLF/LF ไม่ใช่ความต่างจริง (.gitattributes บังคับ LF ใน repo)
const readText = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");

// 1) Junction/symlink ของ skills + agents ต้องชี้เข้า repo นี้จริง
for (const name of ["skills", "agents"]) {
  const link = join(home, name);
  if (!existsSync(link)) {
    add("fail", `${name}/`, `ไม่พบ ${link} — สร้าง Junction ตาม README วิธี B`);
    continue;
  }
  if (!lstatSync(link).isSymbolicLink()) {
    add(
      "fail",
      `${name}/`,
      "เป็นโฟลเดอร์ธรรมดา ไม่ใช่ Junction — แก้ใน repo แล้วเครื่องนี้ไม่เห็น"
    );
    continue;
  }
  const target = realpathSync(link);
  const expected = realpathSync(join(repo, name));
  if (target.toLowerCase() === expected.toLowerCase()) add("ok", `${name}/`, "ชี้เข้า repo นี้");
  else add("fail", `${name}/`, `ชี้ไปที่ ${target} แต่ repo นี้อยู่ที่ ${expected}`);
}

// 2) settings.json: เทียบแบบ key ต่อ key โดยข้ามฟิลด์เฉพาะเครื่อง
const SKIP_SETTINGS = new Set(["statusLine", "model"]);
const homeSettingsPath = join(home, "settings.json");
if (!existsSync(homeSettingsPath)) {
  add("fail", "settings.json", `ไม่พบ ${homeSettingsPath}`);
} else {
  const a = readJson(homeSettingsPath);
  const b = readJson(join(repo, "settings.json"));
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(
    (k) => !SKIP_SETTINGS.has(k)
  );
  const diffs = keys.filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
  if (diffs.length === 0) add("ok", "settings.json", "ตรงกับ repo (ข้าม statusLine, model)");
  else
    for (const k of diffs)
      add(
        "warn",
        `settings.json › ${k}`,
        "เครื่องนี้ต่างจาก repo — ตัดสินใจว่าฝั่งไหนถูกแล้วอัปเดตอีกฝั่ง"
      );

  // statusLine ต้องชี้ไฟล์ที่มีอยู่จริงบนเครื่องนี้ (placeholder จาก template ใช้ไม่ได้)
  const cmd = a.statusLine?.command ?? "";
  const m = cmd.match(/-File\s+"([^"]+)"/);
  if (!m) add("warn", "statusLine", 'ไม่พบ -File "…" ในคำสั่ง ตรวจเองว่าสถานะไลน์ขึ้นหรือไม่');
  else if (m[1].includes("<"))
    add("fail", "statusLine", "ยังเป็น placeholder จาก template — แก้ path ให้ตรง username");
  else if (!existsSync(m[1])) add("fail", "statusLine", `ไม่พบไฟล์ ${m[1]}`);
  else add("ok", "statusLine", "path ชี้ไฟล์ที่มีอยู่จริง");
}

// 3) statusline.ps1 (copy มือ) เทียบเนื้อหา
const homeStatus = join(home, "statusline.ps1");
if (!existsSync(homeStatus)) add("warn", "statusline.ps1", "ไม่มีในเครื่องนี้");
else if (readText(homeStatus) === readText(join(repo, "statusline.ps1")))
  add("ok", "statusline.ps1", "ตรงกับ repo");
else add("warn", "statusline.ps1", "เนื้อหาต่างจาก repo (ต้อง copy มือ — ดู README)");

// 4) USER.md ต้องไม่ใช่สำเนาเก่า (symlink หรือเนื้อหาตรงกัน)
const homeUser = join(home, "USER.md");
if (!existsSync(homeUser)) add("fail", "USER.md", "ไม่พบ");
else if (lstatSync(homeUser).isSymbolicLink()) add("ok", "USER.md", "เป็น symlink");
else if (readText(homeUser) === readText(join(repo, "USER.md")))
  add("ok", "USER.md", "สำเนาตรงกับ repo (ต้อง copy ใหม่ทุกครั้งที่แก้)");
else add("fail", "USER.md", "สำเนาเก่า ไม่ตรงกับ repo");

// 5) สำเนา skill บน claude.ai: อัปโหลดมือ จึงเทียบวัน commit ล่าสุดของ skill กับวันในสมุดบัญชี
//    (claude-ai-skills.json) — เตือนเมื่อ repo ใหม่กว่า แต่ไม่เห็นเนื้อหาฝั่ง claude.ai จริง
const ledgerPath = join(repo, "claude-ai-skills.json");
if (!existsSync(ledgerPath)) {
  add("warn", "claude.ai skills", "ไม่พบ claude-ai-skills.json");
} else {
  const ledger = readJson(ledgerPath);
  const lastCommitDay = (skill) => {
    try {
      const out = execFileSync(
        "git",
        ["-C", repo, "log", "-1", "--format=%cs", "--", `skills/${skill}`],
        { encoding: "utf8" }
      ).trim();
      return out || null;
    } catch {
      return null;
    }
  };
  const known = new Set([...Object.keys(ledger.skills), ...ledger.notOnClaudeAi]);
  let stale = 0;
  for (const [name, info] of Object.entries(ledger.skills)) {
    const day = lastCommitDay(name);
    if (day === null) {
      add("warn", `claude.ai › ${name}`, "อ่านวัน commit จาก git ไม่ได้");
    } else if (info.intentionalDiff) {
      add("ok", `claude.ai › ${name}`, `ตั้งใจให้ต่างจาก repo: ${info.intentionalDiff}`);
    } else if (day > (info.repoMatchedAt ?? info.uploadedAt)) {
      stale++;
      add(
        "warn",
        `claude.ai › ${name}`,
        `repo แก้ล่าสุด ${day} หลังวันที่ตรงกัน ${info.repoMatchedAt ?? info.uploadedAt} — อัปโหลดใหม่`
      );
    }
  }
  const repoSkills = readdirSync(join(repo, "skills"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "synced")
    .map((d) => d.name);
  for (const name of repoSkills) {
    if (!known.has(name))
      add("warn", `claude.ai › ${name}`, "ไม่อยู่ในสมุดบัญชี — เพิ่มใน claude-ai-skills.json");
  }
  if (stale === 0)
    add("ok", "claude.ai skills", `ไม่มี skill ที่ repo ใหม่กว่า (ตรวจเมื่อ ${ledger.checkedAt})`);
}

const icon = { ok: "✅", warn: "⚠️ ", fail: "❌" };
for (const r of results)
  console.log(`${icon[r.level]} ${r.label}${r.detail ? ` — ${r.detail}` : ""}`);

const fails = results.filter((r) => r.level === "fail").length;
const warns = results.filter((r) => r.level === "warn").length;
console.log(`\nสรุป: ❌ ${fails} · ⚠️  ${warns} · ✅ ${results.length - fails - warns}`);
process.exit(fails > 0 ? 1 : 0);
