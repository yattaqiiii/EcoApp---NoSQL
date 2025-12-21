# Quick Start Script untuk EcoScan (Windows PowerShell)

Write-Host "🌱 EcoScan - Quick Setup Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if in Frontend directory
if (-not (Test-Path "package.json")) {
    Write-Host "📁 Navigating to Frontend directory..." -ForegroundColor Yellow
    Set-Location Frontend
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "⚠️  IMPORTANT: Model Setup Required!" -ForegroundColor Red
Write-Host "====================================" -ForegroundColor Red
Write-Host ""
Write-Host "Before running, you need to setup the AI model:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1 (RECOMMENDED):" -ForegroundColor Cyan
Write-Host "  1. Open your Teachable Machine project"
Write-Host "  2. Click 'Export Model' → 'Upload (Shareable Link)'"
Write-Host "  3. Copy the URL"
Write-Host "  4. Copy modelUtils.teachablemachine.js to modelUtils.js"
Write-Host "  5. Edit src/utils/modelUtils.js"
Write-Host "  6. Replace MODEL_URL with your URL"
Write-Host ""
Write-Host "Option 2:" -ForegroundColor Cyan
Write-Host "  1. Export model as 'TensorFlow.js' from Teachable Machine"
Write-Host "  2. Download and extract files"
Write-Host "  3. Copy all files to public/model/"
Write-Host ""
Write-Host "📖 See MODEL_SETUP.md for detailed instructions" -ForegroundColor Magenta
Write-Host ""

$response = Read-Host "Have you setup the model? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host ""
    Write-Host "❌ Please setup the model first before running the app." -ForegroundColor Red
    Write-Host "📖 Read: MODEL_SETUP.md" -ForegroundColor Yellow
    exit 1
}
