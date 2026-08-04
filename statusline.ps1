$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json

$cwd = $inputJson.workspace.current_dir
$dirName = Split-Path $cwd -Leaf
$model = $inputJson.model.display_name

$branch = $null
try {
    $branch = git -C $cwd branch --show-current 2>$null
} catch {}

$esc = [char]27
$RED = "$esc[31m"; $YELLOW = "$esc[33m"; $GREEN = "$esc[32m"; $CYAN = "$esc[36m"; $RESET = "$esc[0m"

$FOLDER = [char]::ConvertFromUtf32(0x1F4C1)      # folder icon
$BRANCH_ICON = [char]::ConvertFromUtf32(0x1F33F) # herb/branch icon
$CLOCK = [char]0x23F1                            # clock icon

# Line 1: [Model] folder dirname | branch branch-name
$line1 = "$CYAN[$model]$RESET $FOLDER $dirName"
if ($branch) { $line1 += " | $BRANCH_ICON $branch" }
Write-Host $line1

# Line 2: color-coded context bar + pct + token count + cost + duration
$ctxPctRaw = $inputJson.context_window.used_percentage
if ($null -eq $ctxPctRaw) { $ctxPctRaw = 0 }
$pct = [int][math]::Floor([double]$ctxPctRaw)

$filled = [math]::Floor($pct / 10)
if ($filled -gt 10) { $filled = 10 }
if ($filled -lt 0) { $filled = 0 }
$bar = ("$([char]0x2588)" * $filled) + ("$([char]0x2591)" * (10 - $filled))

if ($pct -ge 90) { $barColor = $RED }
elseif ($pct -ge 70) { $barColor = $YELLOW }
else { $barColor = $GREEN }

function Format-TokenShort {
    param([double]$Tokens)
    if ($Tokens -ge 1000) {
        $k = $Tokens / 1000
        if ($k -eq [math]::Floor($k)) { return ("{0}k" -f [int]$k) }
        return ("{0:F1}k" -f $k)
    }
    return [string][int]$Tokens
}

$usedTokensRaw = $inputJson.context_window.total_input_tokens
if ($null -eq $usedTokensRaw) { $usedTokensRaw = 0 }
$limitTokensRaw = $inputJson.context_window.context_window_size
if ($null -eq $limitTokensRaw) { $limitTokensRaw = 0 }
$usedFmt = Format-TokenShort -Tokens ([double]$usedTokensRaw)
$limitFmt = Format-TokenShort -Tokens ([double]$limitTokensRaw)

$cost = $inputJson.cost.total_cost_usd
if ($null -eq $cost) { $cost = 0 }
$costFmt = '$' + ("{0:F2}" -f [double]$cost)

$durationMs = $inputJson.cost.total_duration_ms
if ($null -eq $durationMs) { $durationMs = 0 }
$totalSec = [math]::Floor([double]$durationMs / 1000)
$mins = [math]::Floor($totalSec / 60)
$secs = $totalSec % 60

$line2 = "$barColor$bar$RESET ${pct}% (${usedFmt}/${limitFmt}) | $YELLOW$costFmt$RESET | $CLOCK ${mins}m ${secs}s"
Write-Host $line2

function Format-LimitBar {
    param([double]$UsedPct)
    $p = [int][math]::Floor($UsedPct)
    if ($p -lt 0) { $p = 0 }
    if ($p -gt 100) { $p = 100 }
    $f = [math]::Floor($p / 10)
    if ($f -gt 10) { $f = 10 }
    if ($f -lt 0) { $f = 0 }
    $b = ("$([char]0x2588)" * $f) + ("$([char]0x2591)" * (10 - $f))
    if ($p -ge 90) { $c = $RED } elseif ($p -ge 70) { $c = $YELLOW } else { $c = $GREEN }
    return "$c$b$RESET $p%"
}

# Line 3: 5-hour rate limit
$fiveHour = $inputJson.rate_limits.five_hour
if ($null -ne $fiveHour -and $null -ne $fiveHour.used_percentage -and $null -ne $fiveHour.resets_at) {
    $nowEpoch = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $secsLeft = [double]$fiveHour.resets_at - $nowEpoch
    if ($secsLeft -lt 0) { $secsLeft = 0 }
    $hrsLeft = [math]::Floor($secsLeft / 3600)
    $minsLeft = [math]::Floor(($secsLeft % 3600) / 60)
    $bar3 = Format-LimitBar -UsedPct ([double]$fiveHour.used_percentage)
    Write-Host "5h $bar3 | Resets in $hrsLeft hr $minsLeft min"
}

# Line 4: weekly (7-day) rate limit
$sevenDay = $inputJson.rate_limits.seven_day
if ($null -ne $sevenDay -and $null -ne $sevenDay.used_percentage -and $null -ne $sevenDay.resets_at) {
    $resetLocal = [DateTimeOffset]::FromUnixTimeSeconds([int64]$sevenDay.resets_at).ToLocalTime()
    $resetFmt = $resetLocal.ToString("ddd h:mm tt")
    $bar4 = Format-LimitBar -UsedPct ([double]$sevenDay.used_percentage)
    Write-Host "7d $bar4 | Resets $resetFmt"
}
