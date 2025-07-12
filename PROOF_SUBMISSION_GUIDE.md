# KFD Task Tracker - Proof Submission Setup Guide

## Overview
The extension now supports multiple methods for submitting task proofs:
- **Console Only** (default - logs to browser console)
- **Email** (opens email client)
- **Telegram Bot** (sends to Telegram chat)
- **Discord Webhook** (sends to Discord channel)

## Setup Instructions

### 1. Email Integration (Easiest)

**How it works:**
- Opens default email client with pre-filled proof details
- User can review and send manually

**Setup:**
1. Click "Settings" in the extension
2. Select "Email" option
3. Enter recipient email address
4. Save settings

**No additional setup required!**

---

### 2. Telegram Bot Integration

**How it works:**
- Sends proof messages directly to Telegram chat
- Can upload files up to 50MB
- Rich formatting with emojis and structure

**Setup:**
1. **Create a Telegram Bot:**
   - Message @BotFather on Telegram
   - Send `/newbot`
   - Choose a name and username
   - Copy the bot token (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Get Chat ID:**
   - Add your bot to a chat or message it directly
   - Send a message to the bot
   - Visit: `https://api.telegram.org/bot[BOT_TOKEN]/getUpdates`
   - Find the `chat.id` in the response

3. **Configure Extension:**
   - Click "Settings" in extension
   - Select "Telegram Bot"
   - Enter Bot Token
   - Enter Chat ID
   - Save settings

**Example:**
- Bot Token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
- Chat ID: `987654321` (or `-100987654321` for groups)

---

### 3. Discord Webhook Integration

**How it works:**
- Sends rich embed messages to Discord channel
- Professional formatting with timestamps
- Immediate delivery

**Setup:**
1. **Create Discord Webhook:**
   - Go to your Discord server
   - Right-click on target channel → "Edit Channel"
   - Go to "Integrations" → "Webhooks"
   - Click "New Webhook"
   - Copy the webhook URL

2. **Configure Extension:**
   - Click "Settings" in extension
   - Select "Discord Webhook"
   - Paste webhook URL
   - Save settings

**Example Webhook URL:**
```
https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz
```

---

## Message Examples

### Telegram Message:
```
🔹 Task Proof Submitted

📋 Task: daily-worship
⏰ Time: 7/12/2025, 10:30:00 AM
📎 Type: file

📄 File: meditation_photo.jpg
```

### Discord Embed:
```
🔹 Task Proof Submitted
📋 Task: daily-worship
⏰ Time: 7/12/2025, 10:30:00 AM  
📎 Type: url
🔗 URL: https://example.com/proof
```

### Email Subject/Body:
```
Subject: KFD Task Proof - daily-worship

Task: daily-worship
Timestamp: 2025-07-12T10:30:00.000Z
Proof Type: file
Proof: {
  "fileName": "meditation_photo.jpg",
  "fileSize": 245760,
  "fileType": "image/jpeg"
}
```

---

## Security Notes

### Telegram Bot Security:
- Keep bot token private
- Use private chats or groups
- Bot only sends, doesn't receive sensitive data

### Discord Security:
- Webhook URLs should be kept private
- Consider using private channels
- Webhooks can be regenerated if compromised

### Email Security:
- Uses local email client
- No data sent through extension servers
- Most secure option for privacy

---

## Troubleshooting

### Telegram Issues:
- **"Telegram submission failed"**: Check bot token and chat ID
- **Bot not responding**: Make sure bot is started (`/start` command)
- **File not sending**: Check file size (50MB limit)

### Discord Issues:
- **"Discord submission failed"**: Verify webhook URL
- **Channel not showing messages**: Check webhook permissions
- **Webhook deleted**: Regenerate webhook URL

### Email Issues:
- **Email not opening**: Check default email client setup
- **Missing content**: Email client may not support pre-filled body

---

## Testing Your Setup

1. Complete a task in the extension
2. Submit proof (file or URL)
3. Check your configured destination:
   - **Telegram**: Look for bot message
   - **Discord**: Check webhook channel
   - **Email**: Review draft in email client

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify API tokens/webhooks are correct
3. Test with console method first
4. Ensure file sizes are within limits

The extension will always fall back to console logging if external services fail.
