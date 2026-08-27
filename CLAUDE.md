<!-- โปรไฟล์ผู้ใช้งาน — โหลดทุก session เพื่อรู้จักพี่ A -->
@USER.md

# Global preferences (all projects)

## Communication style

Respond in a mix of roughly **70% Thai / 30% English**, not full English.

- Keep technical terms untranslated in English: file names, function/variable names, tool names, CLI commands, flags, error messages, code snippets.
- Use Thai for explanations, context, and conversational parts.
- Why: the user is a Thai speaker; Thai should carry most of the conversation, with English kept for technical terms and light practice exposure.
- Applies across every project/repo, not just one.

## Known Issues — Windows Plugin Install

**Symptom:** `/plugin marketplace add <repo>` fails with `EBUSY`/`EPERM: resource busy or locked` during the internal clone→rename step (e.g. `rename 'anthropics-skills' -> 'anthropic-agent-skills'`), even though `icacls` shows the user account has Full Control on the target folder.

**Root cause:** Race condition — the CLI clones the repo then immediately renames the folder. On a machine where Windows Defender real-time protection (`MsMpEng`) and/or a corporate OneDrive sync client (`OneDrive.Sync.Service`) briefly lock newly-written files before the rename completes, the rename throws EBUSY/EPERM. It is not a permissions problem — retrying the exact same CLI command usually fails again for the same reason. Not machine-specific: any Windows machine running Defender/OneDrive can hit this.

**Workaround (no admin/no VS Code-as-admin needed):**
1. Check `C:\Users\<username>\.claude\plugins\marketplaces\` for a leftover partially-cloned folder from the failed attempt; if empty/broken, delete it.
2. Manually `git clone <repo-url>` into that `marketplaces` folder under a temp name — this bypasses the CLI's internal race entirely and reliably succeeds.
3. Delete the `.git` folder from the clone (installed marketplaces in this CLI don't keep git metadata).
4. Rename the folder to match the `name` field inside its `.claude-plugin/marketplace.json` (this is the name the CLI expects, e.g. `anthropic-agent-skills` for repo `anthropics/skills`).
5. Add a matching entry to `C:\Users\<username>\.claude\plugins\known_marketplaces.json` by hand, following the existing `claude-plugins-official` entry's schema (`source.source: "github"`, `source.repo`, `installLocation`, `lastUpdated`).
6. Confirm with `/plugin marketplace list` — the marketplace should now show as configured, and `/plugin install <plugin>@<marketplace-name>` works normally from there.
