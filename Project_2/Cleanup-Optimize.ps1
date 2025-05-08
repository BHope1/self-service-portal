# ----------------------------------------
# Microsoft Cleanup & Optimization Script
# Author: Bendrick | Hospital IT
# ----------------------------------------

Write-Host "Starting cleanup..."

# Clear Temp Files
$tempPaths = @("$env:TEMP", "$env:windir\Temp")
foreach ($path in $tempPaths) {
    if (Test-Path $path) {
        Get-ChildItem $path -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
        Write-Host "Temp cleared: $path"
    }
}

# Empty Recycle Bin silently
try {
    Clear-RecycleBin -Force -ErrorAction SilentlyContinue
    Write-Host "Recycle Bin emptied"
} catch {
    Write-Host "Recycle Bin cleanup failed"
}

# Clean Windows Update Cache
$wuCache = "C:\Windows\SoftwareDistribution\Download"
if (Test-Path $wuCache) {
    Get-ChildItem $wuCache -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    Write-Host "Windows Update cache cleaned"
}

# Disk Cleanup
cleanmgr /sagerun:1 > $null 2>&1
Write-Host "Disk Cleanup initiated"

# Optional: Clear Teams Cache
$teamsCache = "$env:APPDATA\Microsoft\Teams\Cache"
if (Test-Path $teamsCache) {
    Remove-Item "$teamsCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Teams cache cleared"
}

# Optional: Clear Office Cache
$officeCache = "$env:LOCALAPPDATA\Microsoft\Office\16.0\OfficeFileCache"
if (Test-Path $officeCache) {
    Remove-Item "$officeCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Office file cache cleared"
}

# Logging
"Cleanup ran at $(Get-Date)" | Out-File -FilePath "$env:USERPROFILE\cleanup_log.txt" -Append

Write-Host "Cleanup complete!"