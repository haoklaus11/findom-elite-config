# GitHub Setup Script for Findom Elite Tracker Configuration
# PowerShell version for Windows

Write-Host "🚀 Setting up GitHub repository for Findom Elite Tracker..." -ForegroundColor Green
Write-Host ""

# Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if GitHub CLI is installed
$hasGitHubCLI = Get-Command gh -ErrorAction SilentlyContinue
if (!$hasGitHubCLI) {
    Write-Host "⚠️  GitHub CLI not found. You can install it from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "   Or continue with manual setup..." -ForegroundColor Yellow
    $continue = Read-Host "Continue with manual setup? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Get GitHub username
$GITHUB_USERNAME = Read-Host "📝 Enter your GitHub username"

# Get repository name
$REPO_NAME = Read-Host "📝 Enter repository name (default: findom-elite-config)"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "findom-elite-config"
}

# Configure Git
Write-Host "🔧 Configuring Git..." -ForegroundColor Cyan
git config --global user.name $GITHUB_USERNAME
$GITHUB_EMAIL = Read-Host "Enter your GitHub email"
git config --global user.email $GITHUB_EMAIL

# Add files to Git
Write-Host "📦 Adding files to Git..." -ForegroundColor Cyan
git add .
git commit -m "Initial commit: Findom Elite Tracker configuration system"

# Create GitHub repository (if GitHub CLI is available)
if ($hasGitHubCLI) {
    Write-Host "🌟 Creating GitHub repository..." -ForegroundColor Cyan
    gh repo create $REPO_NAME --public --description "Configuration for Findom Elite Tracker Chrome Extension"
    git branch -M main
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    git push -u origin main
    
    Write-Host "✅ Repository created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Your repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Green
    Write-Host "🔗 Config URL: https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/config.json" -ForegroundColor Green
} else {
    Write-Host "📋 Manual setup required:" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Create a repository named: $REPO_NAME" -ForegroundColor White
    Write-Host "3. Make it public" -ForegroundColor White
    Write-Host "4. Don't initialize with README (we already have files)" -ForegroundColor White
    Write-Host "5. Run these commands:" -ForegroundColor White
    Write-Host ""
    Write-Host "   git branch -M main" -ForegroundColor Gray
    Write-Host "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" -ForegroundColor Gray
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "6. Your config URL will be:" -ForegroundColor White
    Write-Host "   https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/config.json" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Update popup-new.js with your CONFIG_URL" -ForegroundColor White
Write-Host "2. Set up Discord webhook (optional)" -ForegroundColor White
Write-Host "3. Use goddess-control-panel.html to manage your configuration" -ForegroundColor White
Write-Host "4. Share the extension with your slaves" -ForegroundColor White
Write-Host ""
Write-Host "👑 You now have complete remote control over your financial slaves!" -ForegroundColor Yellow

# Create a quick config URL updater
Write-Host ""
Write-Host "📝 Creating config URL updater..." -ForegroundColor Cyan
$configURL = "https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/config.json"

# Update popup-new.js with the correct URL
if (Test-Path "popup-new.js") {
    $content = Get-Content "popup-new.js" -Raw
    $content = $content -replace "const CONFIG_URL = '.*?';", "const CONFIG_URL = '$configURL';"
    Set-Content "popup-new.js" -Value $content
    Write-Host "✅ Updated popup-new.js with your config URL!" -ForegroundColor Green
} else {
    Write-Host "⚠️  popup-new.js not found. You'll need to update CONFIG_URL manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup complete! Your configuration is now hosted on GitHub." -ForegroundColor Green
