import type { Register } from "claude-code";

const PUSH = /\bgit\s+(?:-\S+\s+)*push\b([^\n;|&]*)/;
// Force pushes are already asked about by tools/security-gate.ps1; do not ask twice.
const FORCE = /(--force\b|--force-with-lease\b|\s-f\b|\s\+\S)/;
const MAIN_REF = /(?:^|[\s:/])(?:main|master)(?=\s|$|["'])/;

const SHELLS = ["Bash", "PowerShell"] as const;

type GitState = { branch: string; dirty: number; ahead: number };

function parseStatus(out: string): GitState {
  const lines = out.split("\n").filter((l) => l.length > 0);
  const head = lines.find((l) => l.startsWith("## ")) ?? "";
  const branch = head.slice(3).split("...")[0].split(" ")[0] || "?";
  const ahead = Number(/ahead (\d+)/.exec(head)?.[1] ?? 0);
  const dirty = lines.filter((l) => !l.startsWith("## ")).length;
  return { branch, dirty, ahead };
}

function machineLabel(profile: string | undefined): string {
  if (profile === undefined) return "";
  if (profile.includes("26007294")) return "🏭 ที่ทำงาน";
  if (profile.includes("PC 4000D")) return "🏠 บ้าน";
  return `💻 ${profile.split(/[\\/]/).pop() ?? ""}`;
}

export const register: Register = (on) => {
  for (const tool of SHELLS) {
    on("tool.check", { tool }, async ($, e, next) => {
      const command = (e.input as { command?: string }).command ?? "";
      const push = PUSH.exec(command);
      if (push === null || FORCE.test(command)) return next(e);

      const args = push[1]
        .trim()
        .split(/\s+/)
        .filter((a) => a.length > 0 && !a.startsWith("-"));
      let toMain = MAIN_REF.test(push[1]);
      if (!toMain && args.length <= 1) {
        // no explicit refspec: git pushes the current branch
        const r = await $.process.run(["git", "branch", "--show-current"]);
        toMain = r.exitCode === 0 && /^(main|master)$/.test(r.stdout.trim());
      }
      if (!toMain) return next(e);

      return {
        decision: "ask",
        reason:
          "a-guard: จะ push เข้า main/master โดยตรง — ผ่าน npm run check และ /code-review (ถ้างานแตะ production) แล้วหรือยัง?"
      };
    }).catch(($, e, next) => next(e));

    on("tool.call", { tool }, async ($, e, next) => {
      const ran = await next(e);
      try {
        const [st, home] = await Promise.all([
          $.process.run(["git", "status", "--porcelain=v1", "-b"]),
          $.env.get("USERPROFILE")
        ]);
        if (st.exitCode !== 0) {
          $.ui.status(undefined);
        } else {
          const g = parseStatus(st.stdout);
          const parts = [machineLabel(home), `${g.dirty > 0 ? "●" : "✓"} ${g.dirty} ไม่ commit`];
          if (g.ahead > 0) parts.push(`↑${g.ahead} ไม่ push`);
          $.ui.status(parts.filter((p) => p.length > 0).join(" · "));
        }
      } catch {
        $.ui.status(undefined);
      }
      return ran;
    }).catch(($, e, next) => next(e));
  }
};
