import { test, expect } from "claude-code/testing";
import type { On } from "claude-code";

type Calls = { toasts: string[]; notices: string[] };

function world(on: On, opts: { handoff?: string; profile?: string; notifySent?: boolean }): Calls {
  const calls: Calls = { toasts: [], notices: [] };
  on("fs.exists", () => ({ value: opts.handoff !== undefined }));
  on("fs.read", () => ({ value: opts.handoff ?? "" }));
  on("env.get", () => ({ value: opts.profile }));
  on("ui.toast", (_$, e) => {
    calls.toasts.push(e.text);
    return { value: undefined };
  });
  on("ui.notify", (_$, e) => {
    calls.notices.push(e.text);
    return opts.notifySent === false
      ? { value: { isSent: false as const, reason: "disabled" as const } }
      : { value: { isSent: true as const, channel: "test" } };
  });
  on("session.start", () => ({ cwd: "/x" }));
  return calls;
}

const HANDOFF = "# H\n\n**อัปเดตล่าสุด:** 2026-10-11 (เครื่อง Office — แก้ gate)\n";
const turn = (durationMs: number, extra: object = {}) => ({
  answer: "ok",
  durationMs,
  isAborted: false,
  turnId: "t1",
  reason: "answered" as const,
  ...extra
});

test("handoff: เครื่องที่เขียนล่าสุดไม่ใช่เครื่องนี้ ต้องเตือนให้อ่านก่อน", async ($, on) => {
  const calls = world(on, { handoff: HANDOFF, profile: "C:\\Users\\PC 4000D" });
  await ($ as any).session.start({ cwd: "/x", surface: "terminal", isInteractive: true });
  expect(calls.toasts.join("\n")).toContain("อ่านก่อนเริ่ม");
  expect(calls.toasts.join("\n")).toContain("2026-10-11");
});

test("handoff: เครื่องเดียวกันไม่ต้องบอกให้อ่านก่อน", async ($, on) => {
  const calls = world(on, { handoff: HANDOFF, profile: "C:\\Users\\26007294" });
  await ($ as any).session.start({ cwd: "/x", surface: "terminal", isInteractive: true });
  expect(calls.toasts.join("\n")).not.toContain("อ่านก่อนเริ่ม");
});

test("handoff: ไม่มีไฟล์ ต้องเงียบ", async ($, on) => {
  const calls = world(on, {});
  await ($ as any).session.start({ cwd: "/x", surface: "terminal", isInteractive: true });
  expect(calls.toasts.length).toBe(0);
});

test("notify: turn ยาว ≥60 วินาที ต้องแจ้ง", async ($, on) => {
  const calls = world(on, {});
  on("turn.complete", () => ({ text: "ok" }));
  await ($ as any).turn.complete(turn(130_000));
  expect(calls.notices.length).toBe(1);
  expect(calls.notices[0]).toContain("2 นาที");
});

test("notify: turn สั้นต้องเงียบ", async ($, on) => {
  const calls = world(on, {});
  on("turn.complete", () => ({ text: "ok" }));
  await ($ as any).turn.complete(turn(5_000));
  expect(calls.notices.length).toBe(0);
});

test("notify: subagent turn ต้องเงียบ", async ($, on) => {
  const calls = world(on, {});
  on("turn.complete", () => ({ text: "ok" }));
  await ($ as any).turn.complete(turn(130_000, { agentId: "a1" }));
  expect(calls.notices.length).toBe(0);
});

test("notify: ส่งไม่ได้ ต้อง fallback เป็น toast", async ($, on) => {
  const calls = world(on, { notifySent: false });
  on("turn.complete", () => ({ text: "ok" }));
  await ($ as any).turn.complete(turn(90_000));
  expect(calls.toasts.some((t) => t.includes("เสร็จแล้ว"))).toBe(true);
});
