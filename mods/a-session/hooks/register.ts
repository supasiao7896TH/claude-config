import type { Register } from "claude-code";

const LONG_TURN_MS = 60_000;
const DAY_MS = 86_400_000;

type Machine = "home" | "office" | undefined;

function machineOf(text: string): Machine {
  if (/Office|ที่ทำงาน/i.test(text)) return "office";
  if (/Home|บ้าน/i.test(text)) return "home";
  return undefined;
}

function currentMachine(profile: string | undefined): Machine {
  if (profile === undefined) return undefined;
  if (profile.includes("26007294")) return "office";
  if (profile.includes("PC 4000D")) return "home";
  return undefined;
}

// **อัปเดตล่าสุด:** 2026-10-11 (เครื่อง Office — แก้ ... )
function parseHandoff(md: string): { date: string; writer: Machine } | undefined {
  const m = /\*\*อัปเดตล่าสุด:\*\*\s*(\d{4}-\d{2}-\d{2})\s*(?:\(([^)—]*))?/.exec(md);
  if (m === null) return undefined;
  return { date: m[1], writer: machineOf(m[2] ?? "") };
}

function ageText(date: string, now: number): string {
  const days = Math.floor((now - Date.parse(date)) / DAY_MS);
  if (Number.isNaN(days)) return "";
  if (days <= 0) return "วันนี้";
  return `${days} วันก่อน`;
}

function durationText(ms: number): string {
  const s = Math.round(ms / 1000);
  return s < 120 ? `${s} วินาที` : `${Math.round(s / 60)} นาที`;
}

export const register: Register = (on) => {
  on("session.start", async ($, e, next) => {
    try {
      if (e.isInteractive && (await $.fs.exists("HANDOFF.md"))) {
        const info = parseHandoff(await $.fs.read("HANDOFF.md"));
        if (info === undefined) {
          $.ui.toast("📌 มี HANDOFF.md (อ่านวันที่ไม่ได้)", { timeoutMs: 10000 });
        } else {
          const here = currentMachine(await $.env.get("USERPROFILE"));
          const foreign = here !== undefined && info.writer !== undefined && here !== info.writer;
          const parts = ["📌 HANDOFF", info.date, ageText(info.date, Date.now())];
          if (info.writer !== undefined)
            parts.push(`เขียนโดยเครื่อง${info.writer === "office" ? "ที่ทำงาน" : "บ้าน"}`);
          if (foreign) parts.push("— อ่านก่อนเริ่ม");
          $.ui.toast(parts.filter((p) => p.length > 0).join(" · "), { timeoutMs: 10000 });
        }
      }
    } catch {
      // never block session start for a note
    }
    return next(e);
  }).catch(($, e, next) => next(e));

  on("turn.complete", async ($, e, next) => {
    const result = await next(e);
    try {
      if (e.agentId === undefined && !e.isAborted && e.durationMs >= LONG_TURN_MS) {
        const text = `เสร็จแล้ว · ใช้เวลา ${durationText(e.durationMs)}`;
        const sent = await $.ui.notify(text, { title: "Claude Code" });
        if (!sent.isSent) $.ui.toast(text);
      }
    } catch {
      // a failed notification must not touch the answer
    }
    return result;
  }).catch(($, e, next) => next(e));
};
