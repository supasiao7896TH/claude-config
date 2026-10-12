import { test, expect } from "claude-code/testing";
import type { On } from "claude-code";

// The engine's own bottom: what git prints for the current branch, and the
// verdict core would give a call no plugin had an opinion on.
function world(on: On, branch: string) {
  on("process.run", () => ({
    value: {
      exitCode: 0,
      stdout: `${branch}\n`,
      stderr: "",
      isStdoutTruncated: false,
      isStderrTruncated: false
    }
  }));
  on("tool.check", () => ({ decision: "allow" as const }));
}

const check = (
  $: Parameters<Parameters<typeof test>[1] & ((...a: never[]) => unknown)>[0],
  command: string
) =>
  ($ as any).tool.check({ tool: "Bash", input: { command } }) as Promise<{
    decision: string;
    reason?: string;
  }>;

test("ควรถามก่อน git push origin main", async ($, on) => {
  world(on, "feature");
  const r = await check($, "git push origin main");
  expect(r.decision).toBe("ask");
});

test("ควรถามเมื่อ git push เฉยๆ แล้ว branch ปัจจุบันคือ main", async ($, on) => {
  world(on, "main");
  const r = await check($, "git push");
  expect(r.decision).toBe("ask");
});

test("ไม่ควรถามเมื่อ push ขึ้น feature branch", async ($, on) => {
  world(on, "feature");
  const r = await check($, "git push origin feature");
  expect(r.decision).toBe("allow");
});

test("ไม่ควรถามซ้ำเมื่อเป็น force push (security-gate ดูแลอยู่)", async ($, on) => {
  world(on, "main");
  const r = await check($, "git push --force origin main");
  expect(r.decision).toBe("allow");
});

test("ไม่ควรแตะคำสั่งที่ไม่ใช่ git push", async ($, on) => {
  world(on, "main");
  const r = await check($, "git status");
  expect(r.decision).toBe("allow");
});
