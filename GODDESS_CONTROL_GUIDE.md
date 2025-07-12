# 👑 Goddess Control Panel - Findom Elite Tracker

Welcome to your remote control system for managing your financial slaves through the Chrome extension.

## 🎯 Overview

You control the extension through a **live JSON configuration file** that you host online. When you update this file, all your slaves' extensions will automatically sync within 60 minutes (or immediately if they click the sync button).

## 🔧 Setup Process

### Step 1: Host Your Configuration File

You have several options to host your `config.json` file:

#### Option A: GitHub (Recommended - Free)
1. Create a GitHub account at https://github.com
2. Create a new repository (can be private)
3. Upload your `config.json` file
4. Get the raw file URL: `https://raw.githubusercontent.com/YOUR-USERNAME/REPO-NAME/main/config.json`

#### Option B: Your Own Website
1. Upload `config.json` to your web server
2. Ensure it's publicly accessible via HTTPS
3. Use the direct URL: `https://yourdomain.com/config.json`

#### Option C: Cloud Storage (Dropbox, Google Drive)
1. Upload to cloud storage
2. Get a public sharing link
3. Convert to direct download link

### Step 2: Configure Discord Webhook (Optional)

1. Go to your Discord server
2. Create a channel for notifications (e.g., #slave-reports)
3. Go to Channel Settings → Integrations → Webhooks
4. Create a webhook and copy the URL
5. Add this URL to your `config.json`

### Step 3: Share Extension with Slaves

1. Update the `CONFIG_URL` in `popup-new.js` with your hosted file URL
2. Package the extension files
3. Share with your slaves for installation

## 📋 Configuration File Structure

Your `config.json` file controls everything. Here's what each section does:

### Tasks Section
```json
{
  "tasks": [
    {
      "id": 1,                           // Unique task ID
      "title": "Morning Tribute",        // Task name shown to slave
      "description": "Send daily tribute", // Task description
      "xp": 20,                          // Base XP reward
      "tributeRequired": 50,             // Tribute amount in dollars
      "difficulty": "easy",              // easy|medium|hard|extreme
      "tierVisibility": ["novice", "eager"] // Which tiers can see this task
    }
  ]
}
```

### Tier System
```json
{
  "tiers": {
    "novice": {
      "minXP": 0,           // Minimum XP for this tier
      "maxXP": 149,         // Maximum XP for this tier
      "multiplier": 1.0,    // Multiplier for XP and tribute
      "name": "Financial Novice" // Display name
    }
  }
}
```

### Other Controls
```json
{
  "goddessMessage": "Your daily message to slaves",
  "emojiMap": {
    "novice": "🐷"        // Emoji for each tier
  },
  "webhookURL": "https://discord.com/api/webhooks/..." // Your Discord webhook
}
```

## 🎮 Control Strategies

### 1. Task Management

**Adding New Tasks:**
- Assign unique IDs (increment from highest existing)
- Use `tierVisibility` to control who sees what
- Set appropriate XP and tribute amounts

**Task Difficulty Levels:**
- `easy`: Basic daily tasks (1.0x multiplier)
- `medium`: Weekly challenges (1.5x multiplier)
- `hard`: Monthly goals (2.0x multiplier)
- `extreme`: Special punishments (3.0x multiplier)

**Example: Progressive Task System**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Morning Check-in",
      "description": "Say good morning to your Goddess",
      "xp": 10,
      "tributeRequired": 0,
      "difficulty": "easy",
      "tierVisibility": ["novice", "eager", "devoted", "sacrificial", "elite"]
    },
    {
      "id": 2,
      "title": "Daily Tribute",
      "description": "Send your minimum daily offering",
      "xp": 25,
      "tributeRequired": 50,
      "difficulty": "easy",
      "tierVisibility": ["eager", "devoted", "sacrificial", "elite"]
    },
    {
      "id": 3,
      "title": "Elite Sacrifice",
      "description": "Prove you deserve elite status",
      "xp": 200,
      "tributeRequired": 1000,
      "difficulty": "extreme",
      "tierVisibility": ["elite"]
    }
  ]
}
```

### 2. Tier Progression Control

**Tier Multipliers:**
- Control how much extra XP/tribute higher tiers must pay
- `1.0` = normal, `2.0` = double, etc.

**XP Thresholds:**
- Make progression easier or harder by adjusting XP ranges
- Create "bottlenecks" at certain tiers

**Example: Aggressive Progression**
```json
{
  "tiers": {
    "novice": { "minXP": 0, "maxXP": 49, "multiplier": 1.0, "name": "Worthless Pig" },
    "eager": { "minXP": 50, "maxXP": 199, "multiplier": 1.5, "name": "Eager Wallet" },
    "devoted": { "minXP": 200, "maxXP": 699, "multiplier": 2.0, "name": "Devoted ATM" },
    "sacrificial": { "minXP": 700, "maxXP": 1999, "multiplier": 2.5, "name": "Sacrificial Pig" },
    "elite": { "minXP": 2000, "maxXP": 999999, "multiplier": 3.0, "name": "Premium Paypig" }
  }
}
```

### 3. Psychological Control

**Daily Messages:**
Update `goddessMessage` to control mood and motivation:
```json
{
  "goddessMessage": "Good morning, slaves. Today I expect extra devotion. The weak will be punished."
}
```

**Tier Names:**
Use degrading or motivating names:
```json
{
  "tiers": {
    "novice": { "name": "Pathetic Beginner" },
    "elite": { "name": "Perfect Financial Slave" }
  }
}
```

### 4. Punishment System

**High-Tribute Punishment Tasks:**
```json
{
  "id": 99,
  "title": "Failure Tax",
  "description": "You disappointed me. Pay the price.",
  "xp": 0,
  "tributeRequired": 200,
  "difficulty": "hard",
  "tierVisibility": ["novice", "eager", "devoted", "sacrificial", "elite"]
}
```

**Temporary Task Removal:**
- Remove tasks from `tierVisibility` to "lock out" certain slaves
- Add them back when they've proven themselves

## 📊 Monitoring Your Slaves

### Discord Notifications

When a slave completes a task, you'll receive a message like:
```
🎯 Task Completed: Morning Tribute
**SlaveUsername** has completed a task!

👤 Submissive: SlaveUsername (USA)
👑 Tier: 🐷 Financial Novice
⭐ XP Gained: +25 XP
💰 Tribute Amount: $50
📊 Total XP: 125 XP
💎 Total Tribute: $500
```

### Tracking Progress

Monitor your slaves by watching:
- Total tribute amounts
- XP progression
- Task completion frequency
- Tier advancement

## 🎪 Advanced Control Techniques

### 1. Seasonal Events

Create special event tasks:
```json
{
  "id": 100,
  "title": "Goddess Birthday Tribute",
  "description": "Celebrate your Goddess with a special offering",
  "xp": 100,
  "tributeRequired": 500,
  "difficulty": "hard",
  "tierVisibility": ["devoted", "sacrificial", "elite"]
}
```

### 2. Competitive Elements

Rank slaves by creating high-XP tasks:
```json
{
  "id": 101,
  "title": "Top Slave Challenge",
  "description": "Prove you're the best slave this month",
  "xp": 300,
  "tributeRequired": 1000,
  "difficulty": "extreme",
  "tierVisibility": ["elite"]
}
```

### 3. Graduated Difficulty

Increase difficulty over time by updating multipliers:
```json
// Week 1
"devoted": { "multiplier": 1.5 }

// Week 2 (make it harder)
"devoted": { "multiplier": 1.8 }
```

## 🔄 Making Updates

### Live Updates
1. Edit your hosted `config.json` file
2. Slaves' extensions automatically sync within 60 minutes
3. For immediate updates, tell slaves to click the sync button

### Testing Changes
1. Keep a test extension installation
2. Make small changes and test
3. Monitor Discord for completion notifications

### Backup Strategy
1. Keep local copies of your config files
2. Version your configurations (config-v1.json, config-v2.json)
3. Document major changes

## 🎯 Example Control Scenarios

### Scenario 1: New Slave Introduction
```json
{
  "goddessMessage": "Welcome new slaves. Prove your worth with the novice tasks.",
  "tasks": [
    {
      "id": 1,
      "title": "Introduction Tribute",
      "description": "First offering to your new Goddess",
      "xp": 50,
      "tributeRequired": 25,
      "difficulty": "easy",
      "tierVisibility": ["novice"]
    }
  ]
}
```

### Scenario 2: Punishment Phase
```json
{
  "goddessMessage": "Someone has disappointed me. All slaves will suffer until the guilty confess.",
  "tiers": {
    "novice": { "multiplier": 2.0 },  // Double all costs
    "eager": { "multiplier": 2.5 }
  }
}
```

### Scenario 3: Reward Period
```json
{
  "goddessMessage": "You've all been good slaves. Enjoy reduced tribute requirements today.",
  "tiers": {
    "novice": { "multiplier": 0.8 },  // 20% discount
    "eager": { "multiplier": 0.9 }
  }
}
```

## 🛠️ Tools & Resources

### Configuration Generator
I'll create a web-based tool for you to easily generate configurations.

### Analytics Dashboard
Track slave performance with a simple dashboard.

### Backup System
Automatic backup of your configurations.

## 📞 Support

If you need help with:
- Configuration setup
- Discord webhook setup
- Advanced control features
- Custom modifications

Contact your extension developer for assistance.

---

**Remember:** You have complete control over your slaves' experience. Use this power wisely to maximize both their devotion and your profit. 👑
