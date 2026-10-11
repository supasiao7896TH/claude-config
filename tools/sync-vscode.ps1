# tools/sync-vscode.ps1 - apply vscode-settings.json + keybindings.json to this machine's VS Code
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File ./tools/sync-vscode.ps1
#
# Gemini/Antigravity setup moved to the standalone gemini-config repo (setup-junctions.ps1).
# This script keeps only the VS Code part, which has no other home.
#
# Keep this file ASCII-only: Windows PowerShell 5.1 reads BOM-less scripts as ANSI.
param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

# 1. VS Code font & editor settings
$vscodeUserDir = Join-Path $env:APPDATA "Code\User"
$vscodeSettingsFile = Join-Path $vscodeUserDir "settings.json"
$srcVscodeSettings = Join-Path $RepoRoot "vscode-settings.json"

if (Test-Path $srcVscodeSettings) {
  Write-Host "[VSCode] Syncing font and editor settings to $vscodeSettingsFile..." -ForegroundColor Green
  if (Test-Path $vscodeSettingsFile) {
    try {
      $currentJson = Get-Content $vscodeSettingsFile -Raw | ConvertFrom-Json
      $newJson = Get-Content $srcVscodeSettings -Raw | ConvertFrom-Json
      foreach ($prop in $newJson.PSObject.Properties) {
        $currentJson | Add-Member -MemberType NoteProperty -Name $prop.Name -Value $prop.Value -Force
      }
      $currentJson | ConvertTo-Json -Depth 10 | Set-Content $vscodeSettingsFile -Encoding UTF8
      Write-Host "[VSCode] Merged font settings into existing VS Code settings.json" -ForegroundColor Green
    } catch {
      Write-Host "[VSCode] Warning: Could not merge, copying directly..." -ForegroundColor Yellow
      Copy-Item $srcVscodeSettings $vscodeSettingsFile -Force
    }
  } else {
    if (-not (Test-Path $vscodeUserDir)) { New-Item -ItemType Directory -Path $vscodeUserDir -Force | Out-Null }
    Copy-Item $srcVscodeSettings $vscodeSettingsFile -Force
  }

  # Sync keybindings.json
  $srcKeybindings = Join-Path $RepoRoot "keybindings.json"
  $vscodeKeybindingsFile = Join-Path $vscodeUserDir "keybindings.json"
  if (Test-Path $srcKeybindings) {
    Copy-Item $srcKeybindings $vscodeKeybindingsFile -Force
    Write-Host "[VSCode] Synced keybindings (Alt+A toggle, Shift+Enter) successfully." -ForegroundColor Green
  }
}

Write-Host "VS Code settings synced." -ForegroundColor Cyan
