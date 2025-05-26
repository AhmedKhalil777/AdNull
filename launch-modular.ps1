# AdNull Modular Extension Launcher

Write-Host "AdNull Modular Extension Test" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

$srcPath = Join-Path (Get-Location) "src"
$tempProfile = "$env:TEMP\adnull_modular_test"

# Check if src directory exists
if (-not (Test-Path $srcPath)) {
    Write-Host "Error: src directory not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the correct directory." -ForegroundColor Yellow
    exit 1
}

# Clean up old profile
if (Test-Path $tempProfile) {
    Remove-Item $tempProfile -Recurse -Force
}
New-Item -ItemType Directory -Path $tempProfile -Force | Out-Null

# Find Chrome
$chromeExe = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $chromeExe) {
    Write-Host "Chrome not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Launching Chrome with modular extension..." -ForegroundColor Yellow

$arguments = @(
    "--user-data-dir=`"$tempProfile`"",
    "--load-extension=`"$srcPath`"",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
)

Start-Process -FilePath $chromeExe -ArgumentList $arguments

Write-Host ""
Write-Host "Chrome launched! Testing checklist:" -ForegroundColor Cyan
Write-Host "1. Video should be visible and playing normally" -ForegroundColor White
Write-Host "2. Extension icon should appear in toolbar" -ForegroundColor White
Write-Host "3. Open console (F12) and look for '[AdNull] Initializing extension'" -ForegroundColor White
Write-Host "4. Click extension icon to open popup with new UI" -ForegroundColor White
Write-Host "5. Test settings toggles and buttons" -ForegroundColor White
Write-Host ""
Write-Host "Console test commands:" -ForegroundColor Yellow
Write-Host "window.adnullSkipAds()       // Test skip function" -ForegroundColor Gray
Write-Host "window.adnullAggressiveSkip() // Test aggressive skip methods" -ForegroundColor Gray
Write-Host "window.adnullStatus()        // Check status" -ForegroundColor Gray
Write-Host "window.adnullDebug()         // Enhanced debugging" -ForegroundColor Gray
Write-Host "window.adnullTestDetection() // Test ad detection" -ForegroundColor Gray
Write-Host "window.adnullTestArabic()    // Test Arabic language support" -ForegroundColor Gray
Write-Host "window.adnullTestStrategies() // Test all skip strategies" -ForegroundColor Gray
Write-Host "window.adnullMonitor()       // Monitor ads in real-time" -ForegroundColor Gray
Write-Host "window.AdNull                // Access all modules" -ForegroundColor Gray
Write-Host ""
Write-Host "Extension features (v1.0.3):" -ForegroundColor Magenta
Write-Host "- Enhanced skip strategies with multiple simultaneous methods" -ForegroundColor Green
Write-Host "- Aggressive retry logic for stubborn ads" -ForegroundColor Green
Write-Host "- Faster detection (250ms intervals)" -ForegroundColor Green
Write-Host "- 15 max skip attempts (increased from 10)" -ForegroundColor Green
Write-Host "- Multiple click methods (mouse, touch, keyboard)" -ForegroundColor Green
Write-Host "- Video fast-forward with event dispatching" -ForegroundColor Green
Write-Host "- Text-based skip button search in all languages" -ForegroundColor Green
Write-Host "- Generic area clicking for hidden buttons" -ForegroundColor Green
Write-Host "- Arabic language support (تخطي, تخطى, تجاوز)" -ForegroundColor Green
Write-Host "- Multilingual support (10+ languages)" -ForegroundColor Green
Write-Host "- Real-time ad monitoring and debugging tools" -ForegroundColor Green
Write-Host "- Enhanced button detection with visibility checks" -ForegroundColor Green 