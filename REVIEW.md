# SKILL.md Review — 2026-07

Full professional review of Supasit.A's 5 personal `SKILL.md` files (`vibe-coding-core`,
`vibe-coding-workflow`, `vibe-coding-firebase`, `vi-analysis`, `technical-timing`), requested to
bring them up to a modern, secure, production-grade standard. All 5 files were read in full before
any change was made; the issues below were confirmed by reading, not inferred.

All 5 skills were bumped to a synchronized version (`6.0` for the 3 vibe-coding skills and
`vi-analysis`, `1.1` for `technical-timing` since it only got a bug fix, not a restructure) and
updated date `2026-07`. **Persona, Thai language, and brand identity (Glass Badge, Neo-Glassmorphism,
"พี่ A"/"หนู") were intentionally left unchanged** — those are Supasit.A's deliberate creative
choices, not quality or security defects.

---

## 1. Cross-file bugs (found by reading all 5 files together)

| # | Bug | Where | Fix |
|---|---|---|---|
| 1 | Git branch mismatch — `vibe-coding-core`/`vibe-coding-workflow` pushed/pulled `master`, but `vibe-coding-firebase`'s GitHub Actions only triggers on `main`. Deploy would silently never fire. | core §17, workflow §18.1/§18.4 | Standardized on `main` everywhere, added an explicit rename note in workflow §18.1 for old projects still on `master`. |
| 2 | Scorecard mismatch — `technical-timing`'s output template referenced "VI Scorecard __/35", but `vi-analysis` §22.5 sums to **/30** (10+10+6+4). | technical-timing output template | Fixed to `/30`, added an explicit note in `vi-analysis` §22.5 flagging `/35` as wrong wherever seen. |
| 3 | Broken cross-references — `technical-timing` cites `vi-analysis §22.9.2 Falsification Test` and `§22.0` (real-time data limitations), but neither section existed in `vi-analysis` (it only went up to §22.8). | technical-timing rules 3 & 4 | Wrote the missing sections into `vi-analysis`: **§22.0** (data-limitation disclaimer) and **§22.9** (Exit Criteria, with §22.9.1 principle, §22.9.2 Falsification Test checklist, §22.9.3 what does *not* count as a sell reason). |
| 4 | Dangling related-skill — `vibe-coding-core`'s frontmatter metadata referenced `vibe-coding-ai-video (§21)`, a skill that does not exist anywhere in `~/.claude/skills/`. | core frontmatter `related-skills` | Removed the reference; only skills that actually exist are listed now. |
| 5 | Version drift — core/workflow were at v5.7 while firebase/vi-analysis lagged at v5.6. | all 5 files | Synchronized (see above). |

## 2. Security hardening (concrete additions, not just warnings)

| Area | Before | After |
|---|---|---|
| CSP | §8 said "CSP required, no unsafe-inline" with no example | Real `Content-Security-Policy` meta tag example, plus an explicit tradeoff note: Tailwind Play CDN injects `<style>` at runtime and forces `style-src 'unsafe-inline'` — acceptable for a prototype, called out as a blocker for a CSP-strict production app (with the CLI-build alternative). |
| Subresource Integrity | No SRI on any CDN script example | Added `integrity=`/`crossorigin=` example for Chart.js, with a note on which CDNs (Tailwind Play CDN, Firebase ESM imports) can't use SRI and why. |
| BYOK API key threat model | Doc said "encrypt with AES-GCM" with no caveat, implying at-rest encryption is sufficient | New explicit threat model: AES-GCM in IndexedDB stops disk-level inspection only, **not XSS**, since decrypt logic runs in the same JS context. Added a full Cloudflare Worker proxy pattern (`references/ai-integration.md`) as the recommended alternative for any app that will be shared beyond a single user. |
| Firestore rules | Prose only ("no `allow read/write: if true`") | Full example ruleset for the `artifacts/{appId}/public/data/...` schema: auth-required, per-document `ownerId` check, immutable audit log, explicit deny-by-default fallback. |
| Firebase CI/CD | Deploy workflow used `firebase login:ci` / `FIREBASE_TOKEN`, a long-lived personal-account token Firebase has moved away from recommending | Rewrote the GitHub Actions workflow to use `google-github-actions/auth` with Workload Identity Federation (no long-lived secret at all), with a documented fallback to a narrowly-scoped service-account key if WIF isn't set up yet. |
| CORS proxy (Cloudflare Worker) | Accepted any target URL — an open proxy | Added a destination-host allowlist to the example Worker code, with a WHY note on abuse risk. |
| Dependency freshness | Pinned CDN versions with no re-check process | Added a "check for newer/patched versions before starting a new project" note next to the pinned-version table. |

## 3. Structural changes (Anthropic Skill authoring format)

Per `~/.claude/skills/skill-creator/SKILL.md`'s guidance (frontmatter needs only `name` +
`description`; SKILL.md body should stay under ~500 lines; move deep reference material into
`references/`, loaded on demand):

- **`vibe-coding-core`** (was 686 lines, single file) → now a 354-line `SKILL.md` (workflow, JS
  module pattern, security, QA/deployment checklists) + 8 files under `references/` (tech stack &
  PWA, design system, Thai localization, AI integration, error handling & IndexedDB migration,
  performance & accessibility, layout & brand, blueprint template).
- **`vibe-coding-workflow`** (was 584 lines) → now a 383-line `SKILL.md` (session hygiene,
  iteration keywords, Loop Engineering protocol) + `references/context-templates.md` for the long
  `context.md`/`agents.md` templates.
- **`vibe-coding-firebase`**, **`vi-analysis`**, **`technical-timing`** were already under the
  size guideline — kept as single files, content fixes applied in place.
- All 5 files' YAML frontmatter was trimmed to just `name` + `description` (the fields the skill
  loader actually reads); the version/updated/brand/related-skills metadata that used to live in a
  nested YAML block now sits in a plain markdown table right under the H1 title, where it's
  unambiguous and human-readable without relying on undocumented frontmatter keys.

## 4. Verification performed

- YAML frontmatter of all 5 `SKILL.md` files parses cleanly (checked with Python's `yaml` loader).
- Every `§x.y` cross-reference between the 5 files was grepped and confirmed to resolve to a
  section that actually exists post-edit (this is what caught bug #3 in the first place).
- Main `SKILL.md` line counts confirmed under the ~500-line guideline: core 354, workflow 383,
  firebase ~205, vi-analysis 326, technical-timing ~130.
- `vi-analysis` and `technical-timing` were re-read together after editing to confirm the
  Scorecard and Falsification Test references now line up.
- The repo copy under `skills/` and the live copy under `~/.claude/skills/` were diffed to confirm
  they're identical after sync.

---

## Follow-up spot-check — 2026-08-08

The repo grew from 5 to 18 skill folders since the July review above (7 `pta-*` skills,
`star-kaizen`, `domain-modeling`, `grilling`, `grill-with-docs`, `cloudflare-workers-deploy`,
`vibe-coding-multifile`). Prompted by a broader Claude Code config audit against the official docs
(permissions, hooks, skills structure), spot-checked the 12 skills that had never gone through the
structural pass above:

| Skill | Lines | Frontmatter keys |
|---|---|---|
| pta-exapilot-logic | 86 | name, description |
| pta-industry-insight | 76 | name, description |
| pta-kaizen-writer | 126 | name, description |
| pta-pi-datalink-excel | 91 | name, description |
| pta-plant-reference | 94 | name, description |
| pta-process-diagnostic | 118 | name, description |
| pta-safety-observation | 98 | name, description |
| star-kaizen | 290 | name, description |
| domain-modeling | 74 | name, description |
| grilling | 12 | name, description |
| grill-with-docs | 7 | name, description, disable-model-invocation |
| cloudflare-workers-deploy | 188 | name, description |

**Result: no fixes needed.** All 12 already carry minimal frontmatter (no dangling `related-skills`
metadata like bug #4 above), all sit well under the ~500-line guideline, and none are long/deep
enough to warrant splitting content into `references/` (the threshold that triggered it for
`vibe-coding-core`/`vibe-coding-workflow` at 350-380 lines with 8-9 sub-topics). `vibe-coding-multifile`
(added 2026-08-08, not in this table) was built following this same standard from the start.
