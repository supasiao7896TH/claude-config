/**
 * ตรวจความสอดคล้องภายในของ repo claude-config เอง
 *
 *   node tools/check-standards.mjs
 *
 * เหตุผลที่มีไฟล์นี้: กฎเกือบทั้งหมดใน repo นี้เป็นข้อความใน markdown ที่คน/AI ต้องจำเอง
 * พอ design system เปลี่ยน (มาแล้ว 4 รอบ) ข้อความเก่าจึงค้างอยู่ตามไฟล์ต่างๆ โดยไม่มีใครรู้
 * ไฟล์นี้เปลี่ยนกฎที่ "ตรวจได้ด้วยเครื่อง" ให้เป็นสิ่งที่ทำให้ CI แดงจริง
 *
 * Exit code 1 เมื่อเจอปัญหาข้อใดข้อหนึ่ง — ใช้ gate commit/CI ได้
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => relative(ROOT, p).split("\\").join("/");

let failures = 0;
const pass = (name) => console.log(`  ok  ${name}`);
const fail = (name, detail) => {
  console.log(`FAIL  ${name}`);
  for (const line of [].concat(detail)) console.log(`        ${line}`);
  failures++;
};
const check = (name, problems) => (problems.length === 0 ? pass(name) : fail(name, problems));

/** เดินไฟล์ทั้งหมดใต้ dir ที่นามสกุลตรงกับ exts */
function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.endsWith(e))) out.push(full);
  }
  return out;
}

const read = (p) => readFileSync(p, "utf8");

/* ── 1 · คำที่ตกยุค ห้ามค้างอยู่ในเอกสารที่ยัง "มีผลบังคับ" ───────────────
   REVIEW.md และ HANDOFF.md ถูกยกเว้นโดยตั้งใจ — สองไฟล์นั้นเป็นบันทึกประวัติ
   การเปลี่ยน design system การมีชื่อระบบเก่าอยู่ในนั้นคือความถูกต้อง ไม่ใช่ความผิด */
const STALE_TERMS = [
  ["Sarabun", "ฟอนต์เก่า — มาตรฐานปัจจุบันคือ Noto Sans Thai อย่างเดียว"],
  ["Fraunces", "ฟอนต์เก่า — มาตรฐานปัจจุบันคือ Noto Sans Thai อย่างเดียว"],
  ["Neo-Glassmorphism", "design system รอบที่ 1 — เลิกใช้แล้ว"],
  ["Tactile Plant UI", "design system รอบที่ 2 — เลิกใช้แล้ว"],
  ["Instrument Grade", "design system รอบที่ 3 — เลิกใช้แล้ว"],
  ["Glass Badge", "แบรนด์เก่า — ปัจจุบันคือ A(i)CODER brand dock ชุด Studio"],
  ["gradient-text", "ตัดออกถาวรตาม USER.md"],
  [".breathing", "ตัดออกถาวรตาม USER.md"],
  [".pulse-dot", "ตัดออกถาวรตาม USER.md"]
];
/* ไฟล์ที่ "พูดถึงของเก่า" คือหน้าที่ของมัน ไม่ใช่ความผิด — ยกเว้นทั้งไฟล์
   · REVIEW.md / HANDOFF.md  = บันทึกประวัติการเปลี่ยน design system
   · design-lab/README.md    = ตารางเทียบ 4 รอบที่ผ่านมา + เหตุผลที่ทิ้งแต่ละรอบ
   · design-lab/preview-kit.html = ห้องแล็บที่มีไว้ "เทียบฟอนต์ 5 ตัว" โดยเฉพาะ */
const HISTORY_FILES = [
  "REVIEW.md",
  "HANDOFF.md",
  "design-lab/README.md",
  "design-lab/preview-kit.html"
];

/* บรรทัดที่ *สั่งห้าม* หรือ *บอกว่าเลิกใช้แล้ว* ต้องเอ่ยชื่อของเก่าอยู่แล้ว
   ถ้าไล่ลบออกหมด กฎห้ามก็จะหายไปด้วย — ตรวจเฉพาะบรรทัดที่ยัง "สั่งให้ใช้" */
const INTENT_MARKERS = [
  "ห้าม",
  "ไม่มี",
  "ไม่ใช้",
  "เลิกใช้",
  "ตัดออก",
  "แทนที่",
  "หลงเหลือ",
  "ของเดิม",
  "ระบบเดิม",
  "Migration",
  "ทิ้ง",
  "❌"
];
{
  const files = [
    ...walk(join(ROOT, "skills"), [".md"]),
    ...walk(join(ROOT, "agents"), [".md"]),
    ...walk(join(ROOT, "design-lab"), [".md", ".html", ".js"])
  ].filter(
    (f) =>
      !HISTORY_FILES.some(
        (h) => rel(f) === h || rel(f).endsWith("/" + h) || rel(f) === h.split("/").pop()
      )
  );

  const problems = [];
  for (const file of files) {
    const lines = read(file).split("\n");
    for (const [term, why] of STALE_TERMS) {
      lines.forEach((line, i) => {
        if (!line.includes(term)) return;
        if (INTENT_MARKERS.some((m) => line.includes(m))) return; // เป็นกฎห้าม ไม่ใช่ของค้าง
        problems.push(`${rel(file)}:${i + 1} พบ "${term}" — ${why}`);
      });
    }
  }
  check("ไม่มีคำที่ตกยุคค้างอยู่ใน skills/ agents/ design-lab/", problems);
}

/* ── 2 · git add -A ห้ามอยู่ใน skills/ ────────────────────────────────────
   agents/sa-git-manager.md ห้ามใช้ `git add -A` ไว้ชัดเจน แต่ skill สองตัว
   เคยสั่งให้ใช้ — ความขัดแย้งนี้ต้องไม่กลับมาอีก */
{
  const problems = [];
  for (const file of walk(join(ROOT, "skills"), [".md"])) {
    read(file)
      .split("\n")
      .forEach((line, i) => {
        if (/git add\s+(-A|\.)(\s|$)/.test(line))
          problems.push(`${rel(file)}:${i + 1} — ใช้ sa-git-manager stage ทีละไฟล์แทน`);
      });
  }
  check("skills/ ไม่สั่ง `git add -A` (ขัดกับ sa-git-manager)", problems);
}

/* มี starter 2 ตัวขนานกัน (single-file / multi-file) ตั้งแต่ 2569-09-02 — ต้องตรวจทั้งคู่
   ไม่งั้นจะ drift ออกจากกันแบบเดียวกับที่ design system เคย drift มาแล้ว 4 รอบ */
const STARTERS = ["design-lab/starter/index.html", "design-lab/starter-multifile/index.html"];

/* ── 3 · ฟอนต์ใน starter ต้องตรงกับที่ USER.md ประกาศไว้ ─────────────── */
{
  const problems = [];
  for (const p of STARTERS) {
    const starter = join(ROOT, p);
    if (!existsSync(starter)) {
      problems.push(`ไม่พบ ${p}`);
      continue;
    }
    const m = read(starter).match(/--font-ui\s*:\s*([^;]+);/);
    if (!m) problems.push(`${p} ไม่ได้ประกาศ --font-ui`);
    else if (!m[1].includes("Noto Sans Thai"))
      problems.push(`${p} · --font-ui = ${m[1].trim()} แต่ USER.md ระบุ Noto Sans Thai`);
  }
  check("ฟอนต์ใน starter ตรงกับมาตรฐานใน USER.md", problems);
}

/* ── 4 · โทเคนธีมมืดต้องครบเท่ากันทั้ง 2 บล็อก และทุกโทเคนที่ใช้ต้องถูกนิยาม ──
   กฎ "Dark mode ครบ 3 สถานะ" ใน USER.md เคยเป็นแค่ข้อความ — ตรงนี้ทำให้เครื่องตรวจได้จริง */
{
  const problems = [];
  for (const p of STARTERS) {
    const starter = join(ROOT, p);
    if (!existsSync(starter)) continue; // rule 3 รายงานไฟล์หายไปแล้ว ไม่ต้องซ้ำ

    const css = read(starter);
    const tokensIn = (block) => new Set([...block.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

    const rootBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/);
    const mediaBlock = css.match(
      /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{([\s\S]*?)\n\s*\}/
    );
    const attrBlock = css.match(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);

    if (!rootBlock) problems.push(`${p} · ไม่พบบล็อก :root`);
    if (!mediaBlock) problems.push(`${p} · ไม่พบบล็อก @media (prefers-color-scheme: dark)`);
    if (!attrBlock) problems.push(`${p} · ไม่พบบล็อก :root[data-theme="dark"]`);

    if (rootBlock && mediaBlock && attrBlock) {
      const light = tokensIn(rootBlock[1]);
      const darkMedia = tokensIn(mediaBlock[1]);
      const darkAttr = tokensIn(attrBlock[1]);

      for (const t of darkMedia)
        if (!darkAttr.has(t))
          problems.push(`${p} · ${t} มีใน @media dark แต่ขาดใน [data-theme="dark"]`);
      for (const t of darkAttr)
        if (!darkMedia.has(t))
          problems.push(`${p} · ${t} มีใน [data-theme="dark"] แต่ขาดใน @media dark`);
      for (const t of darkMedia)
        if (!light.has(t)) problems.push(`${p} · ${t} นิยามในธีมมืด แต่ไม่มีค่าตั้งต้นใน :root`);

      /* ทุก var(--x) ที่ถูกใช้ ต้องมีนิยามอยู่จริง ไม่งั้นจะ render เป็นค่าว่าง */
      const used = new Set([...css.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]));
      for (const t of used)
        if (!light.has(t)) problems.push(`${p} · ใช้ var(${t}) แต่ไม่มีนิยามใน :root`);
    }
  }
  check("โทเคนธีมครบทั้ง 3 สถานะ และไม่มี var() ที่ไม่ถูกนิยาม", problems);
}

/* ── 5 · โครงสร้าง skill: ชื่อโฟลเดอร์ต้องตรงกับ frontmatter และต้องมี description ── */
const skillDirs = existsSync(join(ROOT, "skills"))
  ? readdirSync(join(ROOT, "skills")).filter((d) => statSync(join(ROOT, "skills", d)).isDirectory())
  : [];
{
  const problems = [];
  for (const dir of skillDirs) {
    const file = join(ROOT, "skills", dir, "SKILL.md");
    if (!existsSync(file)) {
      problems.push(`skills/${dir}/ ไม่มี SKILL.md`);
      continue;
    }
    const fm = read(file).match(/^---\n([\s\S]*?)\n---/);
    if (!fm) {
      problems.push(`skills/${dir}/SKILL.md ไม่มี frontmatter`);
      continue;
    }
    const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
    const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
    if (name !== dir) problems.push(`skills/${dir}/SKILL.md · name: "${name}" ไม่ตรงชื่อโฟลเดอร์`);
    if (!desc)
      problems.push(`skills/${dir}/SKILL.md ไม่มี description (Claude จะไม่รู้ว่าเรียกเมื่อไหร่)`);
  }
  check("ทุก skill มี SKILL.md · name ตรงโฟลเดอร์ · มี description", problems);
}

/* ── 6 · README ต้องตรงกับความจริงบนดิสก์ ─────────────────────────────── */
{
  const readme = read(join(ROOT, "README.md"));
  const problems = [];

  const declared = Number(readme.match(/รายการ Skills\s*\((\d+)\s*ตัว\)/)?.[1]);
  if (!declared) problems.push("README ไม่มีบรรทัด `## รายการ Skills (N ตัว)`");
  else if (declared !== skillDirs.length)
    problems.push(`README บอก ${declared} skills แต่บนดิสก์มี ${skillDirs.length}`);

  const onDisk = existsSync(join(ROOT, "agents"))
    ? readdirSync(join(ROOT, "agents"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""))
    : [];
  for (const a of onDisk)
    if (!readme.includes(a)) problems.push(`agents/${a}.md มีอยู่จริง แต่ไม่ถูกกล่าวถึงใน README`);
  for (const m of readme.matchAll(/\|\s*(sa-[\w-]+)\s*\|/g))
    if (!onDisk.includes(m[1])) problems.push(`README อ้างถึง ${m[1]} แต่ไม่มีไฟล์ใน agents/`);

  check("README ตรงกับจำนวน skill และรายชื่อ agent จริง", problems);
}

/* ── 7 · เวอร์ชันของ GitHub Action และ Node ต้องตรงกันทุกที่ ─────────────
   ตัวอย่าง YAML ในสกิลถูกคัดลอกไปใช้กับโปรเจกต์ใหม่จริง ถ้ามันตกยุคคนละที่กัน
   แอปใหม่แต่ละตัวจะได้ของไม่เหมือนกันโดยไม่มีใครรู้ — เจอมาแล้ว 2026-09-02
   (starter เป็น @v4 · claude-config เป็น @v7 · node-version มี 20/22/24 ปนกัน)

   จงใจไม่ตรึงเลขเวอร์ชันไว้ในไฟล์นี้ ตรวจแค่ว่า "ทุกที่ใช้เลขเดียวกัน"
   ไม่งั้นตัว linter เองจะกลายเป็นของที่ต้องไล่อัปเดตตามอีกที่หนึ่ง */
{
  const files = [
    ...walk(join(ROOT, ".github"), [".yml", ".yaml"]),
    ...walk(join(ROOT, "design-lab"), [".yml", ".yaml"]),
    ...walk(join(ROOT, "skills"), [".md"])
  ];
  const seen = {}; // key -> Map(value -> [ที่พบ])
  const track = (key, value, where) => {
    (seen[key] ??= new Map()).set(value, [...(seen[key].get(value) ?? []), where]);
  };

  for (const file of files) {
    read(file)
      .split("\n")
      .forEach((line, i) => {
        const where = `${rel(file)}:${i + 1}`;
        const action = line.match(/uses:\s*(actions\/[\w-]+)@(v[\w.]+)/);
        if (action) track(action[1], action[2], where);
        const node = line.match(/node-version:\s*'?([\d.]+)'?/);
        if (node) track("node-version", node[1], where);
      });
  }

  const problems = [];
  for (const [key, values] of Object.entries(seen)) {
    if (values.size <= 1) continue;
    const detail = [...values.entries()]
      .map(
        ([v, wheres]) =>
          `${v} (${wheres.length} จุด: ${wheres.slice(0, 2).join(", ")}${wheres.length > 2 ? " …" : ""})`
      )
      .join("  vs  ");
    problems.push(`${key} ใช้คนละเวอร์ชัน — ${detail}`);
  }
  check("GitHub Action และ node-version ใช้เวอร์ชันเดียวกันทุกที่", problems);
}

/* ── 8 · .gitattributes ต้องมีทั้ง root และ starter พร้อม eol=lf ────────
   ไม่มีไฟล์นี้ = เครื่อง Windows จะกลับไปเจอปัญหา CRLF vs LF ที่เจอจริง 2026-09-02
   (prettier แจ้งผิด format ทั้งที่โค้ดเหมือนกันทุกตัวอักษร เพราะ git ของ Windows
   แปลง LF → CRLF ตอน checkout ตามค่าเริ่มต้น core.autocrlf=true) */
{
  const problems = [];
  for (const path of [
    ".gitattributes",
    "design-lab/starter/.gitattributes",
    "design-lab/starter-multifile/.gitattributes"
  ]) {
    const full = join(ROOT, path);
    if (!existsSync(full)) problems.push(`ไม่พบ ${path}`);
    else if (!read(full).includes("eol=lf")) problems.push(`${path} มีอยู่ แต่ไม่ได้ตั้ง eol=lf`);
  }
  check(".gitattributes บังคับ eol=lf ทั้ง root และ starter ทั้ง 2 ตัว", problems);
}

console.log(
  failures === 0
    ? "\nผ่านทุกข้อ — repo สอดคล้องกับมาตรฐานตัวเอง"
    : `\nไม่ผ่าน ${failures} ข้อ — แก้ให้ครบก่อน commit`
);
process.exit(failures ? 1 : 0);
