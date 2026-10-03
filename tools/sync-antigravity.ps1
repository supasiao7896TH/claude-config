# tools/sync-antigravity.ps1 - Setup & Sync Antigravity CLI (Skills, Rules, User Profile)
#
# Usage:
#   cd <repo-folder>
#   powershell -ExecutionPolicy Bypass -File .\tools\sync-antigravity.ps1
#
param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Antigravity CLI Setup & Sync Tool    " -ForegroundColor Cyan
Write-Host "  Supasit.A Studio                     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Target Paths
$geminiDir = Join-Path $env:USERPROFILE ".gemini"
$configDir = Join-Path $geminiDir "config"
$skillsDir = Join-Path $configDir "skills"
$pluginsDir = Join-Path $configDir "plugins"
$userProfilePluginDir = Join-Path $pluginsDir "user-profile"
$userProfileRulesDir = Join-Path $userProfilePluginDir "rules"

# Ensure directories exist
$dirsToCreate = @($skillsDir, $userProfileRulesDir)
foreach ($d in $dirsToCreate) {
  if (-not (Test-Path $d)) {
    New-Item -ItemType Directory -Path $d -Force | Out-Null
  }
}

# 2. Disable broken datacloud telemetry plugin if present
$badPlugin = Join-Path $pluginsDir "googlecloudtools.datacloud_telemetry"
$badPluginDisabled = Join-Path $pluginsDir "googlecloudtools.datacloud_telemetry_disabled"
$movedLocation = Join-Path $geminiDir "googlecloudtools.datacloud_telemetry_disabled"

if (Test-Path $badPlugin) {
  Write-Host "[Fix] Moving broken telemetry plugin out of plugins directory..." -ForegroundColor Yellow
  Move-Item -Path $badPlugin -Destination $movedLocation -Force
}
if (Test-Path $badPluginDisabled) {
  Write-Host "[Fix] Moving disabled telemetry plugin out of plugins directory..." -ForegroundColor Yellow
  Move-Item -Path $badPluginDisabled -Destination $movedLocation -Force
}

# 3. Sync Skills
$srcSkills = Join-Path $RepoRoot "skills"
Write-Host "[Skills] Syncing skills from $srcSkills to $skillsDir..." -ForegroundColor Green
$skillFolders = Get-ChildItem -Directory -Path $srcSkills | Where-Object { $_.Name -ne "synced" }
$count = 0
foreach ($folder in $skillFolders) {
  Copy-Item -Path $folder.FullName -Destination $skillsDir -Recurse -Force
  $count++
}
Write-Host "[Skills] Synced $count skills successfully." -ForegroundColor Green

# 4. Sync Plugin Manifest & Rules
Write-Host "[Rules] Setting up user-profile plugin and global rules..." -ForegroundColor Green

$srcAgents = Join-Path $RepoRoot "AGENTS.md"
if (Test-Path $srcAgents) {
  Copy-Item -Path $srcAgents -Destination (Join-Path $userProfileRulesDir "AGENTS.md") -Force
  Copy-Item -Path $srcAgents -Destination (Join-Path $env:USERPROFILE "GEMINI.md") -Force
  Write-Host "[Rules] Synced AGENTS.md and GEMINI.md successfully." -ForegroundColor Green
}

$srcPluginJson = Join-Path $PSScriptRoot "antigravity-plugin.json"
if (Test-Path $srcPluginJson) {
  Copy-Item -Path $srcPluginJson -Destination (Join-Path $userProfilePluginDir "plugin.json") -Force
}

$srcHooksJson = Join-Path $PSScriptRoot "antigravity-hooks.json"
if (Test-Path $srcHooksJson) {
  Copy-Item -Path $srcHooksJson -Destination (Join-Path $configDir "hooks.json") -Force
  Copy-Item -Path $srcHooksJson -Destination (Join-Path $userProfilePluginDir "hooks.json") -Force
  Write-Host "[Hooks] Synced voice alert hooks (no-BOM UTF-8) successfully." -ForegroundColor Green
}

# 5. Sync VS Code Font & Editor Settings
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

# 6. Sync Global .geminiignore
$srcIgnore = Join-Path $RepoRoot ".geminiignore"
if (Test-Path $srcIgnore) {
  Write-Host "[Ignore] Syncing global .geminiignore..." -ForegroundColor Green
  Copy-Item $srcIgnore (Join-Path $geminiDir ".geminiignore") -Force
  Copy-Item $srcIgnore (Join-Path $configDir ".geminiignore") -Force
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup completed successfully!         " -ForegroundColor Green
Write-Host "  Ready for Antigravity CLI ('agy')     " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
