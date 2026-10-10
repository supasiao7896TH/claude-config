# new-vibe-project.ps1 - scaffold a new Supasit.A Multi-File (Vite + ES Modules) project
#
#   .\tools\new-vibe-project.ps1 my-app
#   .\tools\new-vibe-project.ps1 my-app -Path D:\work -OpenCode
#   New-VibeProject my-app            # same thing, via the profile snippet
#
# Copies design-lab/starter-multifile (without node_modules/dist/.git), renames the
# package, drops in a project CLAUDE.md + AGENTS.md, and makes the first git commit.
# Does NOT run npm install or deploy: those are separate, visible steps.
#
# Keep this file ASCII-only: Windows PowerShell 5.1 reads BOM-less scripts as ANSI.
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidatePattern('^[a-zA-Z0-9][a-zA-Z0-9_-]*$')]
  [string]$ProjectName,

  [Parameter(Position = 1)]
  [string]$Path = (Get-Location).Path,

  [switch]$NoGit,
  [switch]$OpenCode
)

$ErrorActionPreference = 'Stop'

# 1. Find the template (this repo first, then the usual clone locations)
$repoRoot = Split-Path -Parent $PSScriptRoot
$candidates = @(
  $repoRoot,
  (Join-Path $env:USERPROFILE 'A(i)CODER2025TH\claude-config'),
  (Join-Path $env:USERPROFILE 'claude-config')
)
$templateDir = $null
foreach ($c in $candidates) {
  $t = Join-Path $c 'design-lab\starter-multifile'
  if (Test-Path $t) { $repoRoot = $c; $templateDir = $t; break }
}
if (-not $templateDir) { throw "design-lab\starter-multifile not found. Tried: $($candidates -join '; ')" }

# 2. Refuse to touch an existing non-empty folder (no -Force on purpose: never overwrite work)
$targetDir = Join-Path $Path $ProjectName
if ((Test-Path $targetDir) -and (@(Get-ChildItem -Force $targetDir).Count -gt 0)) {
  throw "Target already exists and is not empty: $targetDir"
}

Write-Host "Scaffolding '$ProjectName' from $templateDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

# 3. Copy, including dot-files, excluding build output and git metadata
$null = robocopy $templateDir $targetDir /E /XD node_modules dist .git /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -ge 8) { throw "robocopy failed (exit $LASTEXITCODE)" }
$global:LASTEXITCODE = 0

# 4. Rename the package without reformatting the JSON (keeps the diff clean)
$utf8 = New-Object System.Text.UTF8Encoding($false)
$name = $ProjectName.ToLower()
foreach ($f in @('package.json', 'package-lock.json')) {
  $p = Join-Path $targetDir $f
  if (-not (Test-Path $p)) { continue }
  $t = [IO.File]::ReadAllText($p, [Text.Encoding]::UTF8)
  $t = $t.Replace('"name": "supasit-starter-multifile"', "`"name`": `"$name`"")
  if ($f -eq 'package.json') {
    $t = [regex]::new('"description":\s*"[^"]*"').Replace($t, "`"description`": `"$name - Supasit.A Studio web app`"", 1)
    $t = [regex]::new('"version":\s*"[^"]*"').Replace($t, '"version": "0.1.0"', 1)
  }
  [IO.File]::WriteAllText($p, $t, $utf8)
}
Write-Host "[+] package name -> $name" -ForegroundColor Green

# 5. Project CLAUDE.md (persona + global rules already come from ~/.claude/CLAUDE.md)
$claudeMd = @"
# $ProjectName

Supasit.A Studio web app. Standard = Multi-File (Vite + ES Modules), Local-First.
Global rules (persona, Blueprint -> approval -> code, review gate) live in ~/.claude/CLAUDE.md.

## Commands
- ``npm run dev``    local dev server
- ``npm test``       Vitest unit tests
- ``npm run check``  lint + secretlint + unit + e2e (run before every push)

## Rules for this project
- Use skill ``vibe-coding-multifile`` for structure; ``vibe-coding-quality`` for tests/CI.
- 9 modules live in ``src/modules/`` - do not collapse them into one file.
- Never commit secrets; Gemini key is BYOK + AES-GCM, never hardcoded.
"@
[IO.File]::WriteAllText((Join-Path $targetDir 'CLAUDE.md'), $claudeMd, $utf8)
$agents = Join-Path $repoRoot 'AGENTS.md'
if (Test-Path $agents) { Copy-Item $agents (Join-Path $targetDir 'AGENTS.md') -Force }
Write-Host '[+] CLAUDE.md + AGENTS.md added' -ForegroundColor Green

# 6. First commit
if (-not $NoGit) {
  Push-Location $targetDir
  try {
    git init -b main | Out-Null
    git add -A
    git commit -q -m "chore: scaffold $name from starter-multifile"
    Write-Host '[+] git repo initialised with first commit' -ForegroundColor Green
  } catch {
    Write-Warning "git step failed: $($_.Exception.Message)"
  } finally {
    Pop-Location
  }
}

if ($OpenCode) { Start-Process code -ArgumentList "`"$targetDir`"" }

Write-Host ''
Write-Host "Done: $targetDir" -ForegroundColor Green
Write-Host '  1. cd into it   2. npm install   3. npm run dev   4. claude' -ForegroundColor White
