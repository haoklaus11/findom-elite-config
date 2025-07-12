# Findom Elite Tracker - Chrome Extension

A gamified Chrome extension for financial domination task tracking and submission, allowing remote control through live JSON configuration.

## 🎯 Purpose

This extension is designed for submissives in a Findom/Femdom dynamic. It allows the Goddess (owner) to remotely control the behavior and content shown to the submissive through a live, external JSON configuration file.

## 🏗️ Architecture

The extension fetches configuration from a remote JSON file, allowing the Goddess to:
- Define custom tasks with XP and tribute requirements
- Set tier systems and progression
- Update daily messages
- Control task visibility per tier
- Receive Discord webhook notifications

## 📁 Files

- `popup-new.js` - Main extension logic with remote config fetching
- `popup-new.html` - Extension popup interface
- `background-new.js` - Service worker for background tasks
- `manifest-new.json` - Chrome extension manifest (V3)
- `style.css` - Dark glassmorphic theme styling
- `config-example.json` - Sample configuration file

## 🚀 Setup Instructions

### For the Goddess (Owner)

1. **Host Your Configuration File**
   - Upload `config-example.json` to GitHub, your website, or any public URL
   - Customize the tasks, tiers, and messages as desired
   - Update the `webhookURL` with your Discord webhook (optional)

2. **Share the Extension**
   - Package the extension files
   - Share with your submissives for installation

3. **Update Configuration**
   - Modify your hosted JSON file anytime
   - Changes will be fetched automatically every hour
   - Submissives can manually sync via the extension

### For Submissives (Users)

1. **Install the Extension**
   - Load the extension in Chrome Developer Mode
   - Enter your username and country on first launch

2. **Configure (if needed)**
   - Go to Settings to update configuration URL
   - Set Discord webhook URL if provided by your Goddess

3. **Complete Tasks**
   - View available tasks based on your tier
   - Submit proof via image upload or URL
   - Gain XP and progress through tiers

## 🔧 Configuration Structure

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task Name",
      "description": "Task description",
      "xp": 50,
      "tributeRequired": 100,
      "difficulty": "easy|medium|hard|extreme",
      "tierVisibility": ["novice", "eager", "devoted", "sacrificial", "elite"]
    }
  ],
  "tiers": {
    "novice": {
      "minXP": 0,
      "maxXP": 149,
      "multiplier": 1.0,
      "name": "Financial Novice"
    }
  },
  "goddessMessage": "Daily message to display",
  "emojiMap": {
    "novice": "🐷"
  },
  "webhookURL": "https://discord.com/api/webhooks/..."
}
```

## 🎮 Features

- **Remote Configuration**: Control extension behavior via live JSON
- **Tier System**: Progressive XP-based tier advancement
- **Task Management**: Difficulty-based tasks with XP/tribute rewards
- **Discord Integration**: Webhook notifications for task completion
- **Glassmorphic UI**: Dark theme with gold/red/black aesthetic
- **Offline Support**: Cached configuration for offline use
- **Progress Tracking**: XP bars, streaks, and statistics

## 🔐 Security

- CSP-compliant (no eval() or dynamic code execution)
- Only fetches JSON data, not executable code
- Manifest V3 service worker architecture
- Secure Discord webhook integration

## 🎨 Customization

The extension supports full customization through the JSON configuration:
- Custom tasks and rewards
- Tier names and thresholds
- Daily messages
- Emoji mappings
- Punishment systems
- Reward multipliers

## 📱 Discord Webhook Message Format

When a task is completed, the following is sent to Discord:

```json
{
  "embeds": [{
    "title": "🎯 Task Completed: Task Name",
    "description": "**Username** has completed a task!",
    "color": 16766720,
    "fields": [
      {"name": "👤 Submissive", "value": "Username (Country)"},
      {"name": "👑 Tier", "value": "🐷 Financial Novice"},
      {"name": "⭐ XP Gained", "value": "+50 XP"},
      {"name": "💰 Tribute Amount", "value": "$100"},
      {"name": "📊 Total XP", "value": "150 XP"},
      {"name": "💎 Total Tribute", "value": "$500"}
    ]
  }]
}
```

## 🔄 Auto-Refresh

The extension automatically:
- Fetches fresh configuration every 60 minutes
- Caches configuration for offline use
- Provides manual sync button for immediate updates
- Shows notification badge when configuration updates

## 🛠️ Development

To modify the extension:
1. Edit the configuration URL in `popup-new.js`
2. Customize styling in `style.css`
3. Test with Chrome Developer Mode
4. Update your hosted configuration file

## 📞 Support

For issues or customization requests, contact your Goddess or extension developer.

---

*This extension is designed for consensual adult roleplay and financial domination dynamics. All users must be 18+ and participating voluntarily.*
