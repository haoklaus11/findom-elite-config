#!/bin/bash

# GitHub Setup Script for Findom Elite Tracker Configuration
# This script will set up your GitHub repository for hosting the configuration file

echo "🚀 Setting up GitHub repository for Findom Elite Tracker..."
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI not found. You can install it from: https://cli.github.com/"
    echo "   Or continue with manual setup..."
    read -p "Continue with manual setup? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get GitHub username
echo "📝 Enter your GitHub username:"
read -r GITHUB_USERNAME

# Get repository name
echo "📝 Enter repository name (default: findom-elite-config):"
read -r REPO_NAME
REPO_NAME=${REPO_NAME:-findom-elite-config}

# Configure Git
echo "🔧 Configuring Git..."
git config --global user.name "$GITHUB_USERNAME"
read -p "Enter your GitHub email: " GITHUB_EMAIL
git config --global user.email "$GITHUB_EMAIL"

# Add files to Git
echo "📦 Adding files to Git..."
git add .
git commit -m "Initial commit: Findom Elite Tracker configuration system"

# Create GitHub repository (if GitHub CLI is available)
if command -v gh &> /dev/null; then
    echo "🌟 Creating GitHub repository..."
    gh repo create "$REPO_NAME" --public --description "Configuration for Findom Elite Tracker Chrome Extension"
    git branch -M main
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    git push -u origin main
    
    echo "✅ Repository created successfully!"
    echo ""
    echo "🔗 Your repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "🔗 Config URL: https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/config.json"
else
    echo "📋 Manual setup required:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a repository named: $REPO_NAME"
    echo "3. Make it public"
    echo "4. Don't initialize with README (we already have files)"
    echo "5. Run these commands:"
    echo ""
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "   git push -u origin main"
    echo ""
    echo "6. Your config URL will be:"
    echo "   https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/config.json"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update popup-new.js with your CONFIG_URL"
echo "2. Set up Discord webhook (optional)"
echo "3. Use goddess-control-panel.html to manage your configuration"
echo "4. Share the extension with your slaves"
echo ""
echo "👑 You now have complete remote control over your financial slaves!"
