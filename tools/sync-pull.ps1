# sync-pull.ps1 - SessionStart hook helper: git pull --ff-only the claude-config repo,
# append the result to ~/.claude/sync.log, and print a warning when the pull fails.
#
# Why: the old hook swallowed failures (try/catch {}), so a failed pull left skills/agents
# stale without anyone noticing. Output of this script is shown at session start; it is
# silent when already up to date. Always exits 0 so a failed pull never blocks the session.
#
# Keep this file ASCII-only: Windows PowerShell 5.1 reads BOM-less scripts as ANSI.
param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [string]$LogPath = (Join-Path $env:USERPROFILE '.claude\sync.log')
)

$maxLines = 200

try {
  $out = (git -C $Repo pull --ff-only 2>&1 | Out-String).Trim()
  $code = $LASTEXITCODE
} catch {
  $out = $_.Exception.Message
  $code = 127
}

$first = ($out -split "`r?`n" | Select-Object -First 1) -replace '^git : ', ''
$status = if ($code -eq 0) { 'OK' } else { 'FAIL' }
$stamp = Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz'
$line = '{0} {1} exit={2} repo={3} | {4}' -f $stamp, $status, $code, $Repo, $first

try {
  Add-Content -Path $LogPath -Value $line -Encoding ASCII
  $all = @(Get-Content -Path $LogPath)
  if ($all.Count -gt $maxLines) {
    $all | Select-Object -Last $maxLines | Set-Content -Path $LogPath -Encoding ASCII
  }
} catch {
  Write-Output "[sync-pull] could not write $LogPath : $($_.Exception.Message)"
}

if ($code -ne 0) {
  Write-Output "[sync-pull] git pull FAILED (exit $code) in $Repo - skills/agents may be out of date. Log: $LogPath"
  Write-Output "[sync-pull] $first"
} elseif ($out -notmatch 'Already up to date') {
  Write-Output "[sync-pull] updated: $first"
}

exit 0
