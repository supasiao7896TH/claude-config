# bootstrap.ps1 - rebuild the Claude Code environment on a fresh Windows PC.
#
#   powershell -ExecutionPolicy Bypass -File .\tools\bootstrap.ps1            # real run
#   powershell -ExecutionPolicy Bypass -File .\tools\bootstrap.ps1 -DryRun    # show only
#
# Safe by design:
#   * idempotent - run it twice, nothing breaks
#   * never deletes: a real ~/.claude/skills or agents folder is MOVED to *.bak-<date>
#   * never overwrites an existing ~/.claude/settings.json (it may hold per-machine
#     settings and plugin state) - it tells you to compare instead
#   * installs nothing without winget/npm being present; every failure is a warning
#
# Keep this file ASCII-only: Windows PowerShell 5.1 reads BOM-less scripts as ANSI.
[CmdletBinding()]
param(
  [switch]$DryRun,
  [switch]$SkipWinget,
  [switch]$InstallExtensions,
  [string]$RepoUrl = 'https://github.com/supasiao7896TH/claude-config.git'
)

$ErrorActionPreference = 'Continue'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$script:warnings = 0

function Step([string]$m) { Write-Host "`n== $m" -ForegroundColor Cyan }
function Ok([string]$m) { Write-Host "  [ok]   $m" -ForegroundColor Green }
function Note([string]$m) { Write-Host "  [..]   $m" -ForegroundColor Gray }
function Warn([string]$m) { $script:warnings++; Write-Host "  [warn] $m" -ForegroundColor Yellow }
function Do-It([string]$what, [scriptblock]$act) {
  if ($DryRun) { Note "dry-run: would $what"; return }
  try { & $act } catch { Warn "$what failed: $($_.Exception.Message)" }
}
function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
    [Environment]::GetEnvironmentVariable('Path', 'User')
}

$home_ = $env:USERPROFILE
$workspace = Join-Path $home_ 'A(i)CODER2025TH'
$repo = Join-Path $workspace 'claude-config'
$claudeHome = Join-Path $home_ '.claude'

# 1. Workspace ---------------------------------------------------------------
Step '1/7 workspace'
if (-not (Test-Path $workspace)) { Do-It "create $workspace" { New-Item -ItemType Directory -Path $workspace -Force | Out-Null } }
Ok $workspace

# 2. Core tools --------------------------------------------------------------
Step '2/7 core tools (git, node, vscode)'
$tools = @(
  @{ cmd = 'git'; id = 'Git.Git' },
  @{ cmd = 'node'; id = 'OpenJS.NodeJS.LTS' },
  @{ cmd = 'code'; id = 'Microsoft.VisualStudioCode' }
)
foreach ($t in $tools) {
  if (Get-Command $t.cmd -ErrorAction SilentlyContinue) { Ok "$($t.cmd) present"; continue }
  if ($SkipWinget -or -not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Warn "$($t.cmd) missing - install $($t.id) manually (winget skipped/unavailable)"; continue
  }
  Do-It "winget install $($t.id)" {
    winget install $t.id -e --silent --accept-package-agreements --accept-source-agreements
    Refresh-Path
  }
}
Refresh-Path

# 3. Git identity (only if unset) -------------------------------------------------
Step '3/7 git identity'
if (Get-Command git -ErrorAction SilentlyContinue) {
  if (-not (git config --global user.name)) { Do-It 'set git user.name' { git config --global user.name 'Supasit Aoothai' } }
  if (-not (git config --global user.email)) { Do-It 'set git user.email' { git config --global user.email 'supasiao@gmail.com' } }
  Ok ("{0} <{1}>" -f (git config --global user.name), (git config --global user.email))
}

# 4. Claude Code CLI ---------------------------------------------------------------
Step '4/7 Claude Code CLI'
if (Get-Command claude -ErrorAction SilentlyContinue) {
  Ok "claude present: $(claude --version 2>$null)"
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
  Do-It 'npm install -g @anthropic-ai/claude-code' { npm install -g '@anthropic-ai/claude-code' }
} else {
  Warn 'claude missing and npm unavailable - open a new terminal after Node installs, then re-run'
}

# 5. Repo --------------------------------------------------------------------------
Step '5/7 claude-config repo'
if (Test-Path (Join-Path $repo '.git')) {
  Do-It 'git pull --ff-only' { git -C $repo pull --ff-only }
  Ok "repo at $repo"
} elseif (Get-Command git -ErrorAction SilentlyContinue) {
  Do-It "git clone $RepoUrl" { git clone $RepoUrl $repo }
} else {
  Warn 'git missing - cannot clone'
}

# 6. ~/.claude wiring ----------------------------------------------------------------
Step '6/7 wire ~/.claude'
if (-not (Test-Path $claudeHome)) { Do-It "create $claudeHome" { New-Item -ItemType Directory -Path $claudeHome -Force | Out-Null } }

foreach ($name in @('skills', 'agents')) {
  $link = Join-Path $claudeHome $name
  $src = Join-Path $repo $name
  if (-not (Test-Path $src)) { Warn "$src not found (repo not cloned yet?)"; continue }
  $item = Get-Item $link -Force -ErrorAction SilentlyContinue
  if ($item -and ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) { Ok "$name already a link"; continue }
  if ($item) {
    $bak = "$link.bak-$stamp"
    Do-It "move existing $name -> $bak" { Move-Item $link $bak }
    Warn "existing $name moved to $bak (nothing deleted)"
  }
  Do-It "junction $link -> $src" { New-Item -ItemType Junction -Path $link -Target $src | Out-Null }
  Ok "$name -> repo"
}

foreach ($f in @('CLAUDE.md', 'USER.md', 'statusline.ps1')) {
  $src = Join-Path $repo $f
  if (-not (Test-Path $src)) { continue }
  $dst = Join-Path $claudeHome $f
  if ((Test-Path $dst) -and ((Get-FileHash $src).Hash -eq (Get-FileHash $dst).Hash)) { Ok "$f already up to date"; continue }
  if (Test-Path $dst) { Do-It "back up $f -> $f.bak-$stamp" { Copy-Item $dst "$dst.bak-$stamp" } }
  Do-It "copy $f" { Copy-Item $src $dst -Force }
  if (-not $DryRun) { Ok "$f copied" }
}

$settingsSrc = Join-Path $repo 'settings.json'
$settingsDst = Join-Path $claudeHome 'settings.json'
if (-not (Test-Path $settingsDst) -and (Test-Path $settingsSrc)) {
  Do-It 'install settings.json (statusLine path set for this user)' {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    $t = [IO.File]::ReadAllText($settingsSrc, [Text.Encoding]::UTF8)
    $t = [regex]::Replace($t, '<[^>"]+>', $env:USERNAME)
    [IO.File]::WriteAllText($settingsDst, $t, $utf8)
  }
  if (-not $DryRun) { Ok 'settings.json installed (hooks incl. security-gate)' }
} elseif (Test-Path $settingsDst) {
  Warn 'settings.json already exists - NOT overwritten. Compare "hooks" with the repo copy (PreToolUse security-gate!)'
}

# 7. Repo dependencies + health --------------------------------------------------------
Step '7/7 dependencies + doctor'
if ((Test-Path (Join-Path $repo 'package.json')) -and (Get-Command npm -ErrorAction SilentlyContinue)) {
  Do-It 'npm ci' { Push-Location $repo; npm ci --no-audit --no-fund; Pop-Location }
}
if ($InstallExtensions -and (Get-Command code -ErrorAction SilentlyContinue)) {
  foreach ($e in @('anthropic.claude-code', 'ms-vscode.powershell', 'vitest.explorer', 'bradlc.vscode-tailwindcss', 'davidanson.vscode-markdownlint')) {
    Do-It "code --install-extension $e" { code --install-extension $e 2>$null | Out-Null }
  }
}
$doctor = Join-Path $repo 'tools\doctor.mjs'
if ((Test-Path $doctor) -and (Get-Command node -ErrorAction SilentlyContinue) -and -not $DryRun) {
  node $doctor
}
$gateTest = Join-Path $repo 'tools\test-security-gate.ps1'
if ((Test-Path $gateTest) -and -not $DryRun) {
  powershell -NoProfile -ExecutionPolicy Bypass -File $gateTest | Select-Object -Last 2
}

Write-Host ''
if ($script:warnings -gt 0) { Write-Host "Finished with $script:warnings warning(s) - read the [warn] lines above." -ForegroundColor Yellow }
else { Write-Host 'Finished - environment ready. Open a new terminal and run: claude' -ForegroundColor Green }
