@echo off
echo 🚀 GitHub Repository Setup for Findom Elite Tracker
echo.

REM Get GitHub username
set /p GITHUB_USERNAME=Enter your GitHub username: 

REM Get repository name
set /p REPO_NAME=Enter repository name (default: findom-elite-config): 
if "%REPO_NAME%"=="" set REPO_NAME=findom-elite-config

echo.
echo 📋 Instructions:
echo 1. Go to https://github.com/new
echo 2. Repository name: %REPO_NAME%
echo 3. Make it PUBLIC
echo 4. DO NOT initialize with README
echo 5. Click "Create repository"
echo.
echo Press any key after creating the repository...
pause >nul

echo.
echo 🔗 Connecting to GitHub...
git branch -M main
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
git push -u origin main

echo.
echo ✅ Repository connected!
echo.
echo 🔗 Your config URL: https://raw.githubusercontent.com/%GITHUB_USERNAME%/%REPO_NAME%/main/config.json
echo.
echo 📝 Next steps:
echo 1. Update popup-new.js with your config URL
echo 2. Open goddess-control-panel.html to manage your configuration
echo 3. Set up Discord webhook
echo 4. Share extension with your slaves
echo.
echo 👑 You now have complete remote control!
pause
