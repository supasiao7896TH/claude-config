# powershell-profile-snippet.ps1 - convenience commands for Claude Code. NOT auto-loaded.
#
# Install once per machine (appends a dot-source line to your profile):
#   $line = '. "$env:USERPROFILE\A(i)CODER2025TH\claude-config\tools\powershell-profile-snippet.ps1"'
#   if (-not (Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force | Out-Null }
#   Add-Content -Path $PROFILE -Value $line
#
# Keep this file ASCII-only: Windows PowerShell 5.1 reads BOM-less scripts as ANSI.

function Get-ClaudeConfigRepo {
  foreach ($p in @(
      (Join-Path $env:USERPROFILE 'A(i)CODER2025TH\claude-config'),
      (Join-Path $env:USERPROFILE 'claude-config'))) {
    if (Test-Path (Join-Path $p '.git')) { return $p }
  }
  Write-Warning 'claude-config repo not found'
  return $null
}

Set-Alias -Name c -Value claude -ErrorAction SilentlyContinue

# Pull the latest skills/agents/settings and show what is out of sync on this machine.
function Sync-Claude {
  $repo = Get-ClaudeConfigRepo
  if (-not $repo) { return }
  git -C $repo pull --ff-only
  node (Join-Path $repo 'tools\doctor.mjs')
}

# Health check: junctions, settings drift, statusline, sync log.
function Doctor-Claude {
  $repo = Get-ClaudeConfigRepo
  if ($repo) { node (Join-Path $repo 'tools\doctor.mjs') }
}

# Prove the PreToolUse security gate still asks/allows the right commands.
function Test-ClaudeGate {
  $repo = Get-ClaudeConfigRepo
  if ($repo) { powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repo 'tools\test-security-gate.ps1') }
}

# New-VibeProject my-app [-Path D:\work] [-NoGit] [-OpenCode]
function New-VibeProject {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory = $true, Position = 0)][string]$ProjectName,
    [Parameter(Position = 1)][string]$Path = (Get-Location).Path,
    [switch]$NoGit,
    [switch]$OpenCode
  )
  $repo = Get-ClaudeConfigRepo
  if (-not $repo) { return }
  & (Join-Path $repo 'tools\new-vibe-project.ps1') @PSBoundParameters
}
