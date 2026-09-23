/**
 * เทียบ skill ใน repo นี้ (skills/<name>/) กับสำเนาที่ Claude Code sync มาจากบัญชี claude.ai
 * (skills/synced/<id>/<name>/)
 *
 *   node tools/check-skill-drift.mjs
 *
 * เหตุผลที่มีไฟล์นี้: skill ส่วนใหญ่มี 2 สำเนา — ใน repo (ต้นฉบับ มี git history) และบน claude.ai
 * ถ้าแก้ฝั่งเดียวแล้วลืมอีกฝั่ง Claude จะเห็น skill ชื่อเดียวกัน 2 เวอร์ชันที่เนื้อหาไม่ตรงกัน
 * สคริปต์นี้บอกว่าตัวไหนต่างกัน / ตัวไหนมีแค่ฝั่งเดียว เพื่อให้รู้ว่าต้อง upload หรือ copy ตัวไหน
 *
 * ใช้บนเครื่อง local เท่านั้น (skills/synced/ ไม่ได้ commit จึงไม่มีบน CI) — ไม่ได้อยู่ใน `npm run check`
 * ความต่างแค่ CRLF/LF ไม่นับว่าต่าง
 *
 * Exit code 1 เมื่อมี skill ที่เนื้อหาต่างกันหรือมีแค่ฝั่งเดียว
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");
const SYNCED_ROOT = join(SKILLS_DIR, "synced");

/** skill ที่ตั้งใจให้ 2 ฝั่งไม่ตรงกัน — ไม่นับเป็นปัญหา แต่ยังแสดงให้เห็น */
const INTENTIONAL_DRIFT = {
  "pta-ips-writer":
    "repo เป็น public จึงตัดชื่อคน/เบอร์ต่อ/อัตราภายในออก — ฉบับเต็มอยู่บน claude.ai"
};

const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

/** skill ที่มี SKILL.md อยู่ใน dir นี้ (ชื่อโฟลเดอร์ → path) */
function skillsIn(dir, skip = []) {
  const out = new Map();
  if (!isDir(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (skip.includes(entry)) continue;
    const full = join(dir, entry);
    if (isDir(full) && existsSync(join(full, "SKILL.md"))) out.set(entry, full);
  }
  return out;
}

/** ไฟล์ทั้งหมดใต้ dir เป็น path แบบ relative → เนื้อหา (ตัด CR ทิ้ง) */
function snapshot(dir, base = dir, out = new Map()) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) snapshot(full, base, out);
    else
      out.set(
        relative(base, full).split("\\").join("/"),
        readFileSync(full, "utf8").replace(/\r/g, "")
      );
  }
  return out;
}

function diffFiles(a, b) {
  const problems = [];
  for (const [file, content] of a) {
    if (!b.has(file)) problems.push(`${file} — มีแค่ใน repo`);
    else if (b.get(file) !== content) problems.push(`${file} — เนื้อหาต่างกัน`);
  }
  for (const file of b.keys()) if (!a.has(file)) problems.push(`${file} — มีแค่บน claude.ai`);
  return problems;
}

// skills/synced/ มีโฟลเดอร์ย่อยตาม account id — ปกติมีอันเดียว
const syncedDirs = isDir(SYNCED_ROOT)
  ? readdirSync(SYNCED_ROOT)
      .map((e) => join(SYNCED_ROOT, e))
      .filter(isDir)
  : [];

if (syncedDirs.length === 0) {
  console.log("ไม่พบ skills/synced/ — เครื่องนี้ยังไม่ได้ sync skill จาก claude.ai ข้ามการตรวจ");
  process.exit(0);
}

const local = skillsIn(SKILLS_DIR, ["synced"]);
let issues = 0;

for (const syncedDir of syncedDirs) {
  const synced = skillsIn(syncedDir);
  console.log(`เทียบกับ ${relative(ROOT, syncedDir).split("\\").join("/")}\n`);

  for (const [name, dir] of [...local].sort()) {
    if (!synced.has(name)) {
      console.log(`  repo-only   ${name}`);
      continue; // ปกติ — skill แบบ /command ที่ใช้แค่ใน Claude Code ไม่จำเป็นต้องอยู่บน claude.ai
    }
    const problems = diffFiles(snapshot(dir), snapshot(synced.get(name)));
    if (problems.length === 0) console.log(`  ok          ${name}`);
    else if (INTENTIONAL_DRIFT[name]) {
      console.log(`  intended    ${name}  (${INTENTIONAL_DRIFT[name]})`);
    } else {
      console.log(`  DRIFT       ${name}`);
      for (const p of problems) console.log(`                ${p}`);
      issues++;
    }
  }

  // skill ที่ source = custom (พี่ A เขียนเอง) แต่ไม่มีใน repo = ไม่มี backup ใน git
  let manifest = { skills: [] };
  try {
    manifest = JSON.parse(readFileSync(join(syncedDir, "manifest.json"), "utf8"));
  } catch {
    /* ไม่มี manifest — ข้ามการแยก custom/example */
  }
  const custom = new Set(manifest.skills.filter((s) => s.source === "custom").map((s) => s.name));
  for (const name of [...synced.keys()].sort()) {
    if (local.has(name) || !custom.has(name)) continue;
    console.log(`  CLOUD-ONLY  ${name}  (skill ที่เขียนเอง แต่ไม่มีใน repo)`);
    issues++;
  }
}

console.log(issues === 0 ? "\nไม่มี drift" : `\nเจอ ${issues} รายการที่ต้องจัดการ`);
process.exit(issues === 0 ? 0 : 1);
