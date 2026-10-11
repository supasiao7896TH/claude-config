# tools/sync-vscode.ps1 - apply vscode-settings.json + keybindings.json to this machine's VS Code
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File ./tools/sync-vscode.ps1            # apply
#   powershell -ExecutionPolicy Bypass -File ./tools/sync-vscode.ps1 -WhatIf    # show only
#
# Safety rules (a user's editor settings are not ours to lose):
#   * every file is copied to <name>.bak-<time> before it is touched
#   * if the existing file cannot be parsed (VS Code files are JSONC: comments, trailing commas)
#     it is NOT touched - the script says which keys to add by hand instead of overwriting it
#   * settings.json: only the keys of vscode-settings.json are set, everything else is kept
#   * keybindings.json: entries from the repo are appended when not already present
#
# Gemini/Antigravity setup moved to the standalone gemini-config repo (setup-junctions.ps1).
#
# Keep this file ASCII-only: Windows PowerShell 5.1 reads BOM-less scripts as ANSI.
param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
  [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$noBom = New-Object System.Text.UTF8Encoding($false)

$userDir = Join-Path $env:APPDATA 'Code\User'
$srcSettings = Join-Path $RepoRoot 'vscode-settings.json'
$srcKeys = Join-Path $RepoRoot 'keybindings.json'
$dstSettings = Join-Path $userDir 'settings.json'
$dstKeys = Join-Path $userDir 'keybindings.json'

function Read-Json([string]$Path) {
  # $null when the file is not strict JSON (comments / trailing commas / BOM-less garbage)
  try { return (Get-Content -Path $Path -Raw -Encoding UTF8 | ConvertFrom-Json) } catch { return $null }
}
function Backup([string]$Path) {
  $b = "$Path.bak-$stamp"
  Copy-Item -Path $Path -Destination $b -Force
  Write-Host "  [backup] $b" -ForegroundColor Gray
}

if (-not $WhatIf -and -not (Test-Path $userDir)) { New-Item -ItemType Directory -Path $userDir -Force | Out-Null }

# ---- settings.json ----------------------------------------------------------------
if (Test-Path $srcSettings) {
  Write-Host "[VSCode] settings.json -> $dstSettings" -ForegroundColor Green
  $new = Read-Json $srcSettings
  if ($null -eq $new) { Write-Warning "  repo file vscode-settings.json is not valid JSON - skipped" }
  elseif (-not (Test-Path $dstSettings)) {
    if ($WhatIf) { Write-Host "  [dry] would create it from the repo file" }
    else { Copy-Item $srcSettings $dstSettings; Write-Host "  [ok] created" -ForegroundColor Green }
  } else {
    $cur = Read-Json $dstSettings
    if ($null -eq $cur) {
      Write-Warning "  existing settings.json has comments or trailing commas, so it was NOT changed."
      Write-Warning ("  add these keys by hand: " + (($new.PSObject.Properties | ForEach-Object { $_.Name }) -join ', '))
    } elseif ($WhatIf) {
      Write-Host ("  [dry] would set keys: " + (($new.PSObject.Properties | ForEach-Object { $_.Name }) -join ', '))
    } else {
      Backup $dstSettings
      foreach ($p in $new.PSObject.Properties) {
        $cur | Add-Member -MemberType NoteProperty -Name $p.Name -Value $p.Value -Force
      }
      [IO.File]::WriteAllText($dstSettings, ($cur | ConvertTo-Json -Depth 10), $noBom)
      Write-Host "  [ok] merged (other settings kept)" -ForegroundColor Green
    }
  }
}

# ---- keybindings.json --------------------------------------------------------------
if (Test-Path $srcKeys) {
  Write-Host "[VSCode] keybindings.json -> $dstKeys" -ForegroundColor Green
  $newKeys = @(Read-Json $srcKeys)
  if ($newKeys.Count -eq 0) { Write-Warning "  repo file keybindings.json is empty or not valid JSON - skipped" }
  elseif (-not (Test-Path $dstKeys)) {
    if ($WhatIf) { Write-Host "  [dry] would create it from the repo file" }
    else { Copy-Item $srcKeys $dstKeys; Write-Host "  [ok] created" -ForegroundColor Green }
  } else {
    $curRaw = Read-Json $dstKeys
    if ($null -eq $curRaw) {
      Write-Warning "  existing keybindings.json has comments or trailing commas, so it was NOT changed."
      Write-Warning "  add the entries of the repo keybindings.json by hand."
    } else {
      $curKeys = @($curRaw)
      $sig = { param($k) ('{0}|{1}|{2}' -f $k.key, $k.command, $k.when) }
      $have = @{}
      foreach ($k in $curKeys) { $have[(& $sig $k)] = $true }
      $toAdd = @($newKeys | Where-Object { -not $have.ContainsKey((& $sig $_)) })
      if ($toAdd.Count -eq 0) { Write-Host "  [ok] already present" -ForegroundColor Green }
      elseif ($WhatIf) { Write-Host "  [dry] would append $($toAdd.Count) entr(ies)" }
      else {
        Backup $dstKeys
        $all = @($curKeys) + @($toAdd)
        [IO.File]::WriteAllText($dstKeys, (ConvertTo-Json -InputObject $all -Depth 10), $noBom)
        Write-Host "  [ok] appended $($toAdd.Count) entr(ies); existing ones kept" -ForegroundColor Green
      }
    }
  }
}

Write-Host "VS Code sync finished." -ForegroundColor Cyan
