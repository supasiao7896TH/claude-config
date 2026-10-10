# security-gate.ps1 - PreToolUse hook for Claude Code (Bash / PowerShell / Write / Edit)
#
# Why: permissions.deny in settings.json only blocks the Read tool. It does not stop
# `cat .env` through Bash, or destructive commands (git reset --hard, DROP TABLE ...).
# This gate asks the user for confirmation before those run. It never hard-blocks:
# the decision is always "ask", so the user stays in control.
#
# Contract (Claude Code hooks): event JSON on stdin; to ask, print on stdout
#   {"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask",
#     "permissionDecisionReason":"..."}}
# No output + exit 0 = no opinion, normal permission flow continues.
#
# Fail-open on purpose: unparsable input must never brick a session. Run
# tools/test-security-gate.ps1 after any edit to prove the rules still fire.
#
# Keep this file ASCII-only: Windows PowerShell 5.1 reads BOM-less scripts as ANSI.

$ErrorActionPreference = 'Stop'

function Write-Ask([string]$Reason) {
  $out = @{
    hookSpecificOutput = @{
      hookEventName            = 'PreToolUse'
      permissionDecision       = 'ask'
      permissionDecisionReason = $Reason
    }
  } | ConvertTo-Json -Compress -Depth 5
  Write-Output $out
  exit 0
}

try {
  $raw = [Console]::In.ReadToEnd()
  if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }
  $evt = $raw | ConvertFrom-Json
  $tool = [string]$evt.tool_name
  $in = $evt.tool_input
  if ($null -eq $in) { exit 0 }

  $isShell = $tool -in @('Bash', 'PowerShell')
  $text = ''
  if ($isShell) { $text = [string]$in.command }
  elseif ($tool -in @('Write', 'Edit')) { $text = [string]$in.file_path }
  if ([string]::IsNullOrWhiteSpace($text)) { exit 0 }
} catch {
  exit 0
}

# --- 1. Secret files --------------------------------------------------------
# A path token must start at a boundary (start, slash, space, quote) and end at one,
# so ".environment" or "monkey.keyboard" do not match. Template files are allowed.
$b = '(?<![\w.-])'                         # left boundary: not inside a longer name
$e = '(?![\w.-])'                          # right boundary
$secretPatterns = @(
  "$b\.env(\.[A-Za-z0-9_-]+)?$e",
  'credentials\.json',
  'serviceAccount[^\s"''`]*\.json',
  'firebase-adminsdk[^\s"''`]*\.json',
  "${b}id_(rsa|ed25519|ecdsa)${e}",
  '\.(pem|p12|pfx|key)(?![\w.-])',
  "$b\.npmrc$e",
  '[\\/]\.aws[\\/]',
  '\.claude[\\/]\.credentials\.json'
)
$templateOk = '\.(example|sample|template|dist)(?![\w-])'

$hasSecret = $false
foreach ($p in $secretPatterns) {
  foreach ($m in [regex]::Matches($text, $p, 'IgnoreCase')) {
    if ($m.Value -notmatch $templateOk) { $hasSecret = $true; break }
  }
  if ($hasSecret) { break }
}
if ($hasSecret) {
  Write-Ask 'Security gate: this touches a secret/credential file (.env, key, token). Confirm before continuing.'
}

if (-not $isShell) { exit 0 }

# --- 2. Destructive / outward-facing commands ---------------------------------
$rules = @(
  @{ re = 'git\s+push\b[^\n;|&]*(--force\b|--force-with-lease\b|\s-f\b|\s\+\S)'; why = 'git force-push can overwrite remote history' },
  @{ re = 'git\s+reset\s+--hard';                                              why = 'git reset --hard discards uncommitted work' },
  @{ re = 'git\s+clean\s+-\S*f';                                               why = 'git clean -f deletes untracked files permanently' },
  @{ re = 'git\s+checkout\s+(--\s+)?\.(\s|$)';                                 why = 'git checkout . discards all working-tree changes' },
  @{ re = 'git\s+restore\s+\.(\s|$)';                                          why = 'git restore . discards all working-tree changes' },
  @{ re = 'git\s+branch\s+-D\b';                                               why = 'git branch -D deletes an unmerged branch' },
  @{ re = '\b(DROP\s+(TABLE|DATABASE|SCHEMA)|TRUNCATE\s+TABLE)\b';             why = 'destructive SQL' },
  @{ re = '\bDELETE\s+FROM\s+\w+\s*(;|"|''|$)';                                why = 'DELETE without WHERE removes every row' },
  @{ re = 'Remove-Item\b[^\n;|]*-Recurse';                                     why = 'recursive delete' },
  @{ re = '\b(rd|rmdir)\s+/s\b|\bdel\s+/[sfq]\b';                              why = 'recursive delete (cmd)' },
  @{ re = '\bformat\s+[A-Za-z]:';                                              why = 'disk format' },
  @{ re = 'firebase\s+firestore:delete\b';                                     why = 'deletes Firestore data' },
  @{ re = 'wrangler\s+(delete|secret\s+delete)\b';                             why = 'deletes a Cloudflare Worker/secret' },
  @{ re = 'gh\s+repo\s+(delete|edit\b[^\n;|]*--visibility)';                   why = 'changes or deletes a GitHub repo' },
  @{ re = 'npm\s+publish\b';                                                   why = 'npm publish is public and hard to undo' },
  @{ re = '\b(curl|wget|irm|iwr|Invoke-WebRequest|Invoke-RestMethod)\b[^\n;]*\|\s*(sh|bash|iex|Invoke-Expression)\b'; why = 'pipes a remote script straight into a shell' }
)
foreach ($r in $rules) {
  if ($text -match "(?i)$($r.re)") {
    Write-Ask ("Security gate: {0}. Confirm before running." -f $r.why)
  }
}

# rm with a recursive flag: ask, except plain build-output folders
if ($text -match '(?i)\brm\s+(-\S+\s+)*(-\S*[rR]\S*|--recursive)\b') {
  $safeTargets = '(?i)\brm\s+(-\S+\s+)+((\./)?(node_modules|dist|build|coverage|\.cache|\.vite|\.playwright|test-results)/?\s*)+$'
  if ($text.Trim() -notmatch $safeTargets) {
    Write-Ask 'Security gate: recursive rm can delete a whole folder tree. Confirm before running.'
  }
}

exit 0
