# Findom Elite Tracker - Remote Configuration

This repository contains the configuration files for the Findom Elite Tracker Chrome extension.

## 🎯 Purpose

This repository hosts the live configuration file (`config.json`) that controls all aspects of the Chrome extension for your financial slaves.

## 📋 Files

- `config.json` - Main configuration file (slaves' extensions sync to this)
- `goddess-control-panel.html` - Web-based configuration generator
- `GODDESS_CONTROL_GUIDE.md` - Complete control documentation

## 🔧 Usage

1. **For Slaves**: Your extension automatically syncs with this configuration every 60 minutes
2. **For Goddess**: Use the control panel or edit `config.json` directly to update settings

## 🌐 Live Configuration URL

Use this URL in your extension's `CONFIG_URL`:
```
https://raw.githubusercontent.com/YOUR-USERNAME/findom-elite-config/main/config.json
```

## 🔄 Making Updates

1. Edit `config.json` in this repository
2. Commit and push changes
3. Slaves' extensions will automatically sync within 60 minutes
4. For immediate updates, slaves can click the sync button

## 🚀 Quick Start

1. Clone this repository
2. Update `config.json` with your desired settings
3. Use the control panel (`goddess-control-panel.html`) for easy configuration
4. Update the `CONFIG_URL` in your extension with the raw GitHub URL

---

**Remember**: You have complete control over your slaves' experience through this configuration file. 👑
