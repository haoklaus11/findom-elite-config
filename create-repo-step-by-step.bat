@echo off
echo.
echo 🚀 STEP-BY-STEP REPOSITORY CREATION
echo ===================================
echo.
echo STEP 1: Check if you're logged into GitHub
echo Visit: https://github.com/haoklaus11
echo You should see your profile with "Ktasks" and "tasks" repositories
echo.
pause

echo.
echo STEP 2: Create New Repository
echo Click the GREEN "New" button on your repositories page
echo OR visit: https://github.com/new
echo.
pause

echo.
echo STEP 3: Fill the form EXACTLY like this:
echo Repository name: findom-elite-config
echo Description: Configuration for Findom Elite Tracker Chrome Extension
echo Visibility: PUBLIC (very important!)
echo Initialize this repository: LEAVE ALL UNCHECKED
echo.
pause

echo.
echo STEP 4: Click "Create repository"
echo You should see an empty repository page with setup instructions
echo.
pause

echo.
echo STEP 5: Come back here and press any key to push files...
pause

echo.
echo 🚀 Pushing files to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS! Your repository is now live!
    echo.
    echo 🔗 Repository: https://github.com/haoklaus11/findom-elite-config
    echo 🔗 Config URL: https://raw.githubusercontent.com/haoklaus11/findom-elite-config/main/config.json
    echo.
    echo 🎮 Next steps:
    echo 1. Open goddess-control-panel.html to customize your configuration
    echo 2. Set up Discord webhook for notifications
    echo 3. Share the extension with your slaves
    echo.
    echo 👑 You now have complete remote control!
) else (
    echo.
    echo ❌ Error pushing files. Make sure the repository was created properly.
    echo Try the steps again or check if you're logged into GitHub.
)

echo.
pause
