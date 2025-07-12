// Gamified Chrome Extension popup script for Findom Task Tracker
console.log('Findom Slave Tracker loaded');

// XP and Tier System Configuration
const TIER_SYSTEM = {
    1: { name: 'Financial Novice', icon: '🔰', xpRequired: 0, xpNext: 500, tributeMultiplier: 1.0, color: '#909090' },
    2: { name: 'Eager Submissive', icon: '🌟', xpRequired: 500, xpNext: 1500, tributeMultiplier: 1.2, color: '#32CD32' },
    3: { name: 'Devoted Pet', icon: '💎', xpRequired: 1500, xpNext: 3500, tributeMultiplier: 1.5, color: '#1E90FF' },
    4: { name: 'Sacrificial Paypig', icon: '🐷', xpRequired: 3500, xpNext: 7000, tributeMultiplier: 2.0, color: '#8B008B' },
    5: { name: 'Elite Financial Slave', icon: '👑', xpRequired: 7000, xpNext: 999999, tributeMultiplier: 3.0, color: '#FFD700' }
};

const XP_CONFIG = {
    baseTaskXP: 50,
    tributeXPMultiplier: 5 // 1 dollar = 5 XP base
};

// Task difficulty multipliers
const DIFFICULTY_MULTIPLIERS = {
    'easy': 1.0,
    'medium': 1.5,
    'hard': 2.0,
    'extreme': 3.0
};

// Praise messages by tier
const PRAISE_MESSAGES = {
    1: ["Good start, novice!", "You're learning your place.", "Keep going, little one."],
    2: ["Very good, eager pet!", "You're showing promise.", "Your dedication is noticed."],
    3: ["Excellent work, devoted one!", "You serve beautifully.", "Your loyalty is appreciated."],
    4: ["Outstanding sacrifice, paypig!", "You understand your purpose.", "Your devotion is exemplary."],
    5: ["Perfect submission, elite slave!", "You are truly owned.", "Your service is divine."]
};

// Goddess Commands for elite tiers
const GODDESS_COMMANDS = [
    "Send tribute now, slave!",
    "Kneel and worship your Goddess!",
    "You exist only to serve me!",
    "Your money belongs to me!",
    "Prove your devotion immediately!"
];

// Backend API configuration
const API_CONFIG = {
    baseUrl: 'http://localhost:3000/api',
    enabled: false // Set to false to disable backend integration
};

// Discord-only configuration
const DISCORD_CONFIG = {
    enabled: true,
    defaultWebhook: 'https://discord.com/api/webhooks/1393583751921012798/My8s76OqTZacnnmopgLtF3-ulTaI2-iinGSvAZGer8guuCNCz-K7S_tzi4Sil65ZmStn'
};

// Gamification Functions
async function calculateXP(baseTaskXP, difficulty, tributeAmount, userTier) {
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
    const tierInfo = TIER_SYSTEM[userTier] || TIER_SYSTEM[1];
    const tributeMultiplier = tierInfo.tributeMultiplier;
    
    const taskXP = baseTaskXP * difficultyMultiplier;
    const tributeXP = tributeAmount * XP_CONFIG.tributeXPMultiplier * tributeMultiplier;
    
    return Math.floor(taskXP + tributeXP);
}

async function updateUserTier(currentXP) {
    for (let tier = 5; tier >= 1; tier--) {
        if (currentXP >= TIER_SYSTEM[tier].xpRequired) {
            return tier;
        }
    }
    return 1;
}

async function updateProfilePanel(userStats) {
    const profilePanel = document.getElementById('profile-panel');
    if (!profilePanel) return;
    
    const currentTier = await updateUserTier(userStats.totalXP || 0);
    const tierInfo = TIER_SYSTEM[currentTier];
    const nextTierInfo = TIER_SYSTEM[currentTier + 1];
    
    // Update tier display
    document.getElementById('tier-icon').textContent = tierInfo.icon;
    document.getElementById('tier-name').textContent = tierInfo.name;
    document.getElementById('current-xp').textContent = userStats.totalXP || 0;
    
    // Update progress bar
    const progressBar = document.getElementById('xp-progress');
    const xpCurrent = document.getElementById('xp-current');
    const xpNext = document.getElementById('xp-next');
    
    if (nextTierInfo) {
        const currentProgress = (userStats.totalXP || 0) - tierInfo.xpRequired;
        const maxProgress = nextTierInfo.xpRequired - tierInfo.xpRequired;
        const progressPercent = (currentProgress / maxProgress) * 100;
        
        progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
        xpCurrent.textContent = userStats.totalXP || 0;
        xpNext.textContent = nextTierInfo.xpRequired;
    } else {
        progressBar.style.width = '100%';
        xpCurrent.textContent = userStats.totalXP || 0;
        xpNext.textContent = 'MAX';
    }
    
    // Update stats
    document.getElementById('total-tribute').textContent = `$${(userStats.totalTribute || 0).toFixed(2)}`;
    document.getElementById('total-tasks').textContent = userStats.totalTasks || 0;
    document.getElementById('tribute-streak').textContent = userStats.tributeStreak || 0;
    document.getElementById('tribute-multiplier').textContent = `${tierInfo.tributeMultiplier.toFixed(1)}x`;
    
    // Update tier styling
    profilePanel.className = `profile-panel tier-${tierInfo.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Show/hide Goddess Commands for elite tiers
    const goddessCommands = document.getElementById('goddess-commands');
    if (currentTier >= 4) {
        goddessCommands.classList.remove('hidden');
    } else {
        goddessCommands.classList.add('hidden');
    }
}

async function showPraiseMessage(tier, xpGained) {
    const tierMessages = PRAISE_MESSAGES[tier] || PRAISE_MESSAGES[1];
    const randomMessage = tierMessages[Math.floor(Math.random() * tierMessages.length)];
    
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `
        <div style="color: #FFD700; font-weight: bold; text-align: center; background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 15px; border-radius: 10px; border: 2px solid #FFD700;">
            <div style="font-size: 16px; margin-bottom: 8px;">${randomMessage}</div>
            <div style="font-size: 14px; color: #4ECDC4;">+${xpGained} XP Gained!</div>
        </div>
    `;
    statusDiv.classList.remove('hidden');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 4000);
}

async function checkTributeStreak(userStats) {
    const today = new Date().toDateString();
    const lastTributeDate = userStats.lastTributeDate;
    
    if (lastTributeDate === today) {
        return userStats.tributeStreak || 0;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastTributeDate === yesterday.toDateString()) {
        return (userStats.tributeStreak || 0) + 1;
    } else {
        return 1;
    }
}

async function showGoddessCommand() {
    const randomCommand = GODDESS_COMMANDS[Math.floor(Math.random() * GODDESS_COMMANDS.length)];
    
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #8B008B, #4B0082); color: white; padding: 15px; border-radius: 10px; text-align: center; font-weight: bold; font-size: 16px; box-shadow: 0 0 20px rgba(139, 0, 139, 0.6);">
            👑 ${randomCommand} 👑
        </div>
    `;
    statusDiv.classList.remove('hidden');
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 6000);
}

// Enhanced Discord webhook functions with gamification
async function sendDiscordWebhookWithFile(username, taskName, file, imageUrl = null) {
    try {
        const formData = new FormData();
        
        // Get additional data for enhanced message
        const taskDescription = await getTaskDescription(taskName);
        const tributeAmount = await getTributeAmount();
        const nationality = await getUserNationality();
        const timestamp = new Date().toISOString();
        
        // Create the enhanced message content
        const messageContent = `**New Task Submission**\nUsername: ${username}\nTask: ${taskName}\nTribute: $${tributeAmount}\nNationality: ${nationality}`;
        formData.append('content', messageContent);
        
        // Add file if provided
        if (file) {
            formData.append('file', file, file.name);
        }
        
        // Create enhanced embed for task submission
        const embedData = {
            embeds: [{
                title: "✅ Task Completed Successfully",
                description: `**${username}** has completed their assignment`,
                fields: [
                    { name: "👤 Submissive", value: username, inline: true },
                    { name: "💰 Tribute", value: `**$${tributeAmount}**`, inline: true },
                    { name: "🌍 Location", value: nationality, inline: true },
                    { name: "� Task", value: taskName, inline: false },
                    { name: "📝 Details", value: taskDescription || "Task completed successfully", inline: false },
                    { name: "📄 Proof", value: file ? `${file.name} (${Math.round(file.size/1024)} KB)` : 'No file attachment', inline: false },
                    { name: "⏰ Submitted", value: new Date().toLocaleString(), inline: false }
                ],
                color: 0x4CAF50,
                timestamp: timestamp,
                footer: {
                    text: "KFD Task Tracker • Submission Confirmed"
                }
            }]
        };
        
        // Add image URL if provided
        if (imageUrl) {
            embedData.embeds[0].fields.push({
                name: "🔗 Additional URL",
                value: imageUrl,
                inline: false
            });
        }
        
        formData.append('payload_json', JSON.stringify(embedData));
        
        const response = await fetch(DISCORD_CONFIG.defaultWebhook, {
            method: 'POST',
            body: formData
        });
        
        console.log('Discord webhook response:', response.status);
        return response.ok;
        
    } catch (error) {
        console.error('Error sending Discord webhook with file:', error);
        return false;
    }
}

async function sendDiscordWebhookText(username, taskName, imageUrl = null) {
    try {
        // Get additional data for enhanced message
        const taskDescription = await getTaskDescription(taskName);
        const tributeAmount = await getTributeAmount();
        const nationality = await getUserNationality();
        const timestamp = new Date().toISOString();
        
        const payload = {
            content: `**Task Submission** • ${username} has completed their assignment`,
            embeds: [{
                title: "✅ Task Completed Successfully",
                description: `**${username}** has completed their assignment`,
                fields: [
                    { name: "👤 Submissive", value: username, inline: true },
                    { name: "💰 Tribute", value: `**$${tributeAmount}**`, inline: true },
                    { name: "🌍 Location", value: nationality, inline: true },
                    { name: "📋 Task", value: taskName, inline: false },
                    { name: "� Details", value: taskDescription || "Task completed successfully", inline: false },
                    { name: "⏰ Submitted", value: new Date().toLocaleString(), inline: false }
                ],
                color: 0x4CAF50,
                timestamp: timestamp,
                footer: {
                    text: "KFD Task Tracker • Submission Confirmed"
                }
            }]
        };
        
        if (imageUrl) {
            payload.embeds[0].fields.push({
                name: "🔗 Proof Image",
                value: imageUrl,
                inline: false
            });
            payload.embeds[0].image = { url: imageUrl };
        }
        
        const response = await fetch(DISCORD_CONFIG.defaultWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Discord webhook response:', response.status);
        return response.ok;
        
    } catch (error) {
        console.error('Error sending Discord webhook text:', error);
        return false;
    }
}

// Helper functions for enhanced Discord integration
async function getTaskDescription(taskName) {
    try {
        // First try to get from current tasks
        const task = currentTasks.find(t => t.title === taskName);
        if (task && task.description) {
            return task.description;
        }
        
        // If not found, return a default description
        return `Task: ${taskName}`;
    } catch (error) {
        console.error('Error getting task description:', error);
        return `Task: ${taskName}`;
    }
}

async function getTributeAmount() {
    try {
        // Check for the specific tribute amount input field
        const tributeInput = document.getElementById('tribute-amount');
        if (tributeInput && tributeInput.value) {
            return parseFloat(tributeInput.value) || 0;
        }
        
        // Check if there's a tribute amount input field by name or placeholder
        const tributeInputAlt = document.querySelector('input[name="tribute"], input[placeholder*="tribute"], input[placeholder*="amount"]');
        if (tributeInputAlt && tributeInputAlt.value) {
            return parseFloat(tributeInputAlt.value) || 0;
        }
        
        // Check storage for last tribute amount
        const result = await chrome.storage.local.get(['lastTributeAmount']);
        if (result.lastTributeAmount) {
            return result.lastTributeAmount;
        }
        
        // Default tribute amount
        return 0;
    } catch (error) {
        console.error('Error getting tribute amount:', error);
        return 0;
    }
}

async function getUserNationality() {
    try {
        // Check if nationality is already cached
        const result = await chrome.storage.local.get(['userNationality', 'nationalityTimestamp']);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // If we have cached nationality and it's less than 24 hours old, use it
        if (result.userNationality && result.nationalityTimestamp && 
            (now - result.nationalityTimestamp) < oneDay) {
            return result.userNationality;
        }
        
        // Fetch nationality from IP geolocation API
        const response = await fetch('https://ipinfo.io/json');
        if (response.ok) {
            const data = await response.json();
            const nationality = data.country || 'Unknown';
            
            // Cache the result
            await chrome.storage.local.set({
                userNationality: nationality,
                nationalityTimestamp: now
            });
            
            return nationality;
        }
        
        // Fallback to cached value even if old
        return result.userNationality || 'Unknown';
        
    } catch (error) {
        console.error('Error getting user nationality:', error);
        // Try to return cached value
        try {
            const result = await chrome.storage.local.get(['userNationality']);
            return result.userNationality || 'Unknown';
        } catch (e) {
            return 'Unknown';
        }
    }
}

async function updateUserStatsWithGameification(username, taskName, tributeAmount, nationality) {
    try {
        // Get existing stats
        const result = await chrome.storage.local.get(['userStats']);
        let userStats = result.userStats || {};
        
        // Initialize user stats if not exists
        if (!userStats[username]) {
            userStats[username] = {
                totalXP: 0,
                totalTasks: 0,
                totalTribute: 0,
                nationality: nationality,
                firstTask: new Date().toISOString(),
                lastTask: new Date().toISOString(),
                tasksToday: 0,
                lastTaskDate: null,
                tributeStreak: 0,
                lastTributeDate: null,
                taskHistory: []
            };
        }
        
        // Calculate XP for this task
        const currentTier = await updateUserTier(userStats[username].totalXP);
        const task = currentTasks.find(t => t.title === taskName);
        const difficulty = task?.difficulty || 'easy';
        const baseTaskXP = task?.baseTaskXP || XP_CONFIG.baseTaskXP;
        const xpGained = await calculateXP(baseTaskXP, difficulty, tributeAmount, currentTier);
        
        // Update stats
        const userStat = userStats[username];
        userStat.totalXP += xpGained;
        userStat.totalTasks += 1;
        userStat.totalTribute += tributeAmount;
        userStat.nationality = nationality;
        userStat.lastTask = new Date().toISOString();
        
        // Update tasks today
        const today = new Date().toDateString();
        if (userStat.lastTaskDate !== today) {
            userStat.tasksToday = 1;
            userStat.lastTaskDate = today;
        } else {
            userStat.tasksToday += 1;
        }
        
        // Update tribute streak
        if (tributeAmount > 0) {
            userStat.tributeStreak = await checkTributeStreak(userStat);
            userStat.lastTributeDate = today;
        }
        
        // Add to task history (keep last 50 tasks)
        userStat.taskHistory.push({
            taskName: taskName,
            tributeAmount: tributeAmount,
            xpGained: xpGained,
            difficulty: difficulty,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 tasks
        if (userStat.taskHistory.length > 50) {
            userStat.taskHistory = userStat.taskHistory.slice(-50);
        }
        
        // Save updated stats
        await chrome.storage.local.set({ userStats: userStats });
        
        // Update profile panel
        await updateProfilePanel(userStat);
        
        console.log(`Updated gamified stats for ${username}:`, userStat);
        
    } catch (error) {
        console.error('Error updating user stats with gamification:', error);
    }
}

async function updateUserStats(username, taskName, tributeAmount, nationality) {
    try {
        // Get existing stats
        const result = await chrome.storage.local.get(['userStats']);
        let userStats = result.userStats || {};
        
        // Initialize user stats if not exists
        if (!userStats[username]) {
            userStats[username] = {
                totalTasks: 0,
                totalTribute: 0,
                nationality: nationality,
                firstTask: new Date().toISOString(),
                lastTask: new Date().toISOString(),
                tasksToday: 0,
                lastTaskDate: null,
                taskHistory: []
            };
        }
        
        // Update stats
        const userStat = userStats[username];
        userStat.totalTasks += 1;
        userStat.totalTribute += tributeAmount;
        userStat.nationality = nationality; // Update nationality
        userStat.lastTask = new Date().toISOString();
        
        // Update tasks today
        const today = new Date().toDateString();
        if (userStat.lastTaskDate !== today) {
            userStat.tasksToday = 1;
            userStat.lastTaskDate = today;
        } else {
            userStat.tasksToday += 1;
        }
        
        // Add to task history (keep last 50 tasks)
        userStat.taskHistory.push({
            taskName: taskName,
            tributeAmount: tributeAmount,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 tasks
        if (userStat.taskHistory.length > 50) {
            userStat.taskHistory = userStat.taskHistory.slice(-50);
        }
        
        // Save updated stats
        await chrome.storage.local.set({ userStats: userStats });
        
        console.log(`Updated stats for ${username}:`, userStat);
        
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

async function sendStatsSupmary(username) {
    try {
        // Get user stats
        const result = await chrome.storage.local.get(['userStats']);
        const userStats = result.userStats || {};
        const userStat = userStats[username];
        
        if (!userStat) {
            console.log('No stats found for user:', username);
            return;
        }
        
        // Calculate key metrics for findom relationship
        const firstTaskDate = new Date(userStat.firstTask);
        const lastTaskDate = new Date(userStat.lastTask);
        const daysSinceFirst = Math.ceil((lastTaskDate - firstTaskDate) / (1000 * 60 * 60 * 24)) || 1;
        const avgTributePerTask = userStat.totalTasks > 0 ? (userStat.totalTribute / userStat.totalTasks).toFixed(2) : 0;
        
        // Calculate this week's tribute
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeekTribute = userStat.taskHistory
            .filter(task => new Date(task.timestamp) >= weekAgo)
            .reduce((sum, task) => sum + task.tributeAmount, 0);
        
        // Calculate dedication level based on consistency
        let dedicationLevel = "🔰 Novice";
        if (userStat.totalTasks >= 50 && userStat.totalTribute >= 500) {
            dedicationLevel = "👑 Elite";
        } else if (userStat.totalTasks >= 20 && userStat.totalTribute >= 200) {
            dedicationLevel = "💎 Premium";
        } else if (userStat.totalTasks >= 10 && userStat.totalTribute >= 100) {
            dedicationLevel = "⭐ Committed";
        } else if (userStat.totalTasks >= 5) {
            dedicationLevel = "🌟 Dedicated";
        }
        
        // Create optimized stats summary embed
        const statsPayload = {
            embeds: [{
                title: "� Submissive Performance Report",
                description: `**${username}** • ${dedicationLevel}`,
                fields: [
                    { name: "� Total Tribute", value: `**$${userStat.totalTribute.toFixed(2)}**`, inline: true },
                    { name: "� Tasks Today", value: `**${userStat.tasksToday}**`, inline: true },
                    { name: "🌍 Location", value: userStat.nationality, inline: true },
                    { name: "� This Week", value: `$${thisWeekTribute.toFixed(2)}`, inline: true },
                    { name: "� Per Task Avg", value: `$${avgTributePerTask}`, inline: true },
                    { name: "🎯 Total Tasks", value: `${userStat.totalTasks}`, inline: true },
                    { name: "⏰ Serving Since", value: firstTaskDate.toLocaleDateString(), inline: false },
                    { name: "� Dedication Level", value: dedicationLevel, inline: false }
                ],
                color: 0xFFD700, // Gold color for premium stats
                timestamp: new Date().toISOString(),
                footer: {
                    text: "KFD Performance Tracker • Elite Findom Analytics"
                }
            }]
        };
        
        // Send stats summary to Discord
        const response = await fetch(DISCORD_CONFIG.defaultWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(statsPayload)
        });
        
        if (response.ok) {
            console.log('Stats summary sent successfully for:', username);
        } else {
            console.error('Failed to send stats summary:', response.status);
        }
        
    } catch (error) {
        console.error('Error sending stats summary:', error);
    }
}

// GitHub configuration
const GITHUB_CONFIG = {
    owner: 'haoklaus11',  // Your GitHub username
    repo: 'Ktasks',  // Your repository name
    branch: 'main',
    filePath: 'tasks.json'
};

// Fallback mock task data with gamification (used if GitHub fetch fails)
const mockTasks = [
    {
        id: 'task-1',
        title: 'Daily Tribute',
        description: 'Send your daily tribute to prove your devotion.',
        difficulty: 'easy',
        baseTaskXP: 50
    },
    {
        id: 'task-2', 
        title: 'Weekly Tribute Goal',
        description: 'Complete your weekly tribute requirement of $100.',
        difficulty: 'medium',
        baseTaskXP: 75
    },
    {
        id: 'task-3',
        title: 'Humiliation Task',
        description: 'Complete a humiliation task of your Goddess\'s choosing.',
        difficulty: 'hard',
        baseTaskXP: 100
    },
    {
        id: 'task-4',
        title: 'Financial Sacrifice',
        description: 'Make a significant financial sacrifice to demonstrate your submission.',
        difficulty: 'extreme',
        baseTaskXP: 150
    },
    {
        id: 'task-5',
        title: 'Worship Session',
        description: 'Complete a 30-minute worship session for your Goddess.',
        difficulty: 'easy',
        baseTaskXP: 40
    }
];

let currentTasks = [];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    
    // Get UI elements
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');
    const buttonGroup = document.getElementById('button-group');
    const statusDiv = document.getElementById('status');
    const taskSection = document.getElementById('task-section');
    const taskList = document.getElementById('task-list');
    const syncBtn = document.getElementById('sync-btn');
    const syncStatus = document.getElementById('sync-status');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const saveSettingsBtn = document.getElementById('save-settings');
    const cancelSettingsBtn = document.getElementById('cancel-settings');
    const goddessBtn = document.getElementById('goddess-cmd-btn');
    const profilePanel = document.getElementById('profile-panel');
    
    // Verify buttons exist
    if (!acceptBtn || !declineBtn || !buttonGroup || !statusDiv || !taskSection || !taskList || !syncBtn || !syncStatus || !settingsBtn) {
        console.error('Required elements not found!');
        return;
    }
    
    // Setup Goddess Commands button
    if (goddessBtn) {
        goddessBtn.addEventListener('click', function() {
            showGoddessCommand();
        });
    }
    
    console.log('Elements found, setting up consent flow');
    
    // Check if consent was previously given
    chrome.storage.local.get(['consent'], function(result) {
        console.log('Checking existing consent:', result);
        
        if (result.consent === 'accepted') {
            showAcceptedState();
            setupDiscordIntegration();
            loadTasksFromGitHub();
        } else if (result.consent === 'declined') {
            showDeclinedState();
        } else {
            showConsentButtons();
        }
    });
    
    // Attach consent click handlers
    acceptBtn.addEventListener('click', function() {
        console.log('Accept button clicked');
        
        // Get the user's name/alias
        const aliasInput = document.getElementById('sub-alias');
        const alias = aliasInput.value.trim();
        
        if (!alias) {
            alert('Please enter your name or alias before accepting.');
            return;
        }
        
        // Store consent and alias in Chrome storage
        chrome.storage.local.set({
            consent: 'accepted',
            subAlias: alias
        }, function() {
            console.log('Consent accepted and alias stored:', alias);
            showAcceptedState();
            setupDiscordIntegration();
            loadTasksFromGitHub();
        });
    });
    
    declineBtn.addEventListener('click', function() {
        console.log('Decline button clicked');
        
        // Store decline in Chrome storage
        chrome.storage.local.set({consent: 'declined'}, function() {
            console.log('Consent declined and stored');
            showDeclinedState();
        });
    });
    
    // Attach sync button handler
    syncBtn.addEventListener('click', function() {
        console.log('Sync button clicked');
        loadTasksFromGitHub();
    });
    
    // Attach settings button handler
    settingsBtn.addEventListener('click', function() {
        console.log('Settings button clicked');
        showSettingsModal();
    });
    
    // Attach settings modal handlers
    saveSettingsBtn.addEventListener('click', function() {
        saveProofSettings();
    });
    
    cancelSettingsBtn.addEventListener('click', function() {
        hideSettingsModal();
    });
    
    // Close modal when clicking outside
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            hideSettingsModal();
        }
    });
    
    // Function to show consent buttons
    function showConsentButtons() {
        console.log('Showing consent buttons');
        buttonGroup.style.display = 'flex';
        statusDiv.textContent = '';
        statusDiv.style.color = '';
        taskSection.classList.add('hidden');
    }
    
    // Function to show accepted state
    function showAcceptedState() {
        console.log('Showing accepted state');
        buttonGroup.style.display = 'none';
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.style.display = 'none';
        statusDiv.textContent = 'Consent already accepted. Welcome to Findom Slave Tracker!';
        statusDiv.style.color = '#4CAF50';
        statusDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        statusDiv.style.border = '1px solid #4CAF50';
        taskSection.classList.remove('hidden');
        
        // Show profile panel and initialize gamification
        const profilePanel = document.getElementById('profile-panel');
        if (profilePanel) {
            profilePanel.classList.remove('hidden');
            initializeGameification();
        }
    }
    
    // Function to initialize gamification
    async function initializeGameification() {
        try {
            // Get current user stats and username from storage
            const result = await chrome.storage.local.get(['userStats', 'subAlias']);
            const userStats = result.userStats || {};
            const username = result.subAlias || 'DefaultUser';
            
            // Initialize user stats if not exists
            if (!userStats[username]) {
                userStats[username] = {
                    totalXP: 0,
                    totalTasks: 0,
                    totalTribute: 0,
                    nationality: 'Unknown',
                    firstTask: new Date().toISOString(),
                    lastTask: new Date().toISOString(),
                    tasksToday: 0,
                    lastTaskDate: null,
                    tributeStreak: 0,
                    lastTributeDate: null,
                    taskHistory: []
                };
                await chrome.storage.local.set({ userStats: userStats });
            }
            
            // Update profile panel with current stats
            await updateProfilePanel(userStats[username]);
            
        } catch (error) {
            console.error('Error initializing gamification:', error);
        }
    }
    
    // Helper function to refresh profile panel
    async function refreshProfilePanel() {
        try {
            const result = await chrome.storage.local.get(['userStats', 'subAlias']);
            const userStats = result.userStats || {};
            const username = result.subAlias || 'DefaultUser';
            
            if (userStats[username]) {
                await updateProfilePanel(userStats[username]);
            }
        } catch (error) {
            console.error('Error refreshing profile panel:', error);
        }
    }
    
    // Function to show declined state
    function showDeclinedState() {
        console.log('Showing declined state');
        buttonGroup.style.display = 'none';
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.style.display = 'none';
        statusDiv.textContent = 'Consent previously declined. Extension functionality is limited.';
        statusDiv.style.color = '#f44336';
        statusDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        statusDiv.style.border = '1px solid #f44336';
        taskSection.classList.add('hidden');
    }
    
    // Function to load tasks from GitHub
    async function loadTasksFromGitHub() {
        console.log('Loading tasks from GitHub');
        
        // Show loading state
        syncStatus.textContent = 'Syncing with GitHub...';
        syncStatus.className = 'sync-status loading';
        syncBtn.disabled = true;
        syncBtn.textContent = 'Syncing...';
        
        try {
            // Construct GitHub raw URL
            const githubUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.filePath}`;
            console.log('Fetching from URL:', githubUrl);
            
            // Fetch tasks from GitHub
            const response = await fetch(githubUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const tasks = await response.json();
            console.log('Tasks loaded from GitHub:', tasks);
            
            // Validate task structure
            if (!Array.isArray(tasks)) {
                throw new Error('Invalid task data format - expected array');
            }
            
            // Update current tasks
            currentTasks = tasks;
            
            // Show success state
            syncStatus.textContent = 'Sync successful!';
            syncStatus.className = 'sync-status success';
            
            // Display tasks
            displayTasks(tasks);
            
            // Refresh profile panel with current stats
            refreshProfilePanel();
            
        } catch (error) {
            console.error('Error loading tasks from GitHub:', error);
            
            // Show error state
            syncStatus.textContent = 'Sync Failed - using offline tasks';
            syncStatus.className = 'sync-status error';
            
            // Fall back to mock data
            currentTasks = mockTasks;
            displayTasks(mockTasks);
            
            // Refresh profile panel even on error
            refreshProfilePanel();
        } finally {
            // Reset sync button
            syncBtn.disabled = false;
            syncBtn.textContent = 'Sync Tasks';
        }
    }
    
    // Function to display tasks
    function displayTasks(tasks) {
        console.log('Displaying tasks:', tasks);
        
        // Get completed tasks from storage
        chrome.storage.local.get(['completedTasks'], function(result) {
            const completedTasks = result.completedTasks || [];
            console.log('Completed tasks:', completedTasks);
            
            // Clear existing tasks
            taskList.innerHTML = '';
            
            // Create task elements
            tasks.forEach(task => {
                const taskElement = createTaskElement(task, completedTasks.includes(task.id));
                taskList.appendChild(taskElement);
            });
        });
    }
    
    // Function to create a task element
    function createTaskElement(task, isCompleted) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'task-title';
        titleDiv.textContent = task.title;
        
        const descDiv = document.createElement('div');
        descDiv.className = 'task-description';
        descDiv.textContent = task.description;
        
        const button = document.createElement('button');
        button.className = 'task-button';
        button.dataset.taskId = task.id;
        
        // Create proof section
        const proofSection = createProofSection(task.id, isCompleted);
        
        if (isCompleted) {
            button.textContent = 'Completed';
            button.classList.add('complete');
            button.disabled = true;
            proofSection.classList.add('visible');
        } else {
            button.textContent = 'Mark as Complete';
            button.classList.add('incomplete');
            button.addEventListener('click', function() {
                markTaskComplete(task.id, button, proofSection);
            });
        }
        
        // Add difficulty badge
        const difficultyBadge = document.createElement('div');
        difficultyBadge.className = `task-difficulty difficulty-${task.difficulty || 'easy'}`;
        difficultyBadge.textContent = (task.difficulty || 'easy').toUpperCase();
        
        // Add XP reward display
        const xpRewardDiv = document.createElement('div');
        xpRewardDiv.className = 'task-xp-reward';
        const baseXP = task.baseTaskXP || XP_CONFIG.baseTaskXP;
        const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[task.difficulty || 'easy'];
        const maxXP = Math.floor(baseXP * difficultyMultiplier);
        xpRewardDiv.textContent = `${maxXP}+ XP Reward`;
        
        taskDiv.appendChild(difficultyBadge);
        taskDiv.appendChild(titleDiv);
        taskDiv.appendChild(descDiv);
        taskDiv.appendChild(xpRewardDiv);
        taskDiv.appendChild(button);
        taskDiv.appendChild(proofSection);
        
        return taskDiv;
    }
    
    // Function to create proof submission section
    function createProofSection(taskId, isCompleted) {
        const proofDiv = document.createElement('div');
        proofDiv.className = 'proof-section';
        proofDiv.id = `proof-${taskId}`;
        
        const proofTitle = document.createElement('h4');
        proofTitle.textContent = 'Submit Proof of Completion';
        
        // File upload section
        const fileGroup = document.createElement('div');
        fileGroup.className = 'proof-input-group';
        
        const fileLabel = document.createElement('label');
        fileLabel.textContent = 'Upload File (Image/PDF):';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.className = 'proof-file-input';
        fileInput.accept = 'image/*,application/pdf';
        fileInput.id = `file-${taskId}`;
        
        fileGroup.appendChild(fileLabel);
        fileGroup.appendChild(fileInput);
        
        // URL input section
        const urlGroup = document.createElement('div');
        urlGroup.className = 'proof-input-group';
        
        const urlLabel = document.createElement('label');
        urlLabel.textContent = 'Or Enter URL:';
        
        const urlInput = document.createElement('input');
        urlInput.type = 'url';
        urlInput.className = 'proof-url-input';
        urlInput.placeholder = 'https://example.com/proof';
        urlInput.id = `url-${taskId}`;
        
        urlGroup.appendChild(urlLabel);
        urlGroup.appendChild(urlInput);
        
        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.className = 'proof-submit-btn';
        submitBtn.textContent = 'Submit Proof';
        submitBtn.addEventListener('click', function() {
            submitProof(taskId, fileInput, urlInput, submitBtn);
        });
        
        // Status display
        const statusDiv = document.createElement('div');
        statusDiv.className = 'proof-status';
        statusDiv.id = `status-${taskId}`;
        
        proofDiv.appendChild(proofTitle);
        proofDiv.appendChild(fileGroup);
        proofDiv.appendChild(urlGroup);
        proofDiv.appendChild(submitBtn);
        proofDiv.appendChild(statusDiv);
        
        return proofDiv;
    }
    
    // Function to submit proof
    async function submitProof(taskId, fileInput, urlInput, submitBtn) {
        console.log('Submitting proof for task:', taskId);
        
        const file = fileInput.files[0];
        const url = urlInput.value.trim();
        const statusDiv = document.getElementById(`status-${taskId}`);
        
        // Validate that at least one proof method is provided
        if (!file && !url) {
            showProofStatus(statusDiv, 'error', 'Please provide either a file or URL');
            return;
        }
        
        // Disable submit button during processing
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            // Get proof submission settings
            const result = await new Promise(resolve => {
                chrome.storage.local.get(['proofSettings'], resolve);
            });
            
            const settings = result.proofSettings || { method: 'console' };
            
            let proofData = {
                taskId: taskId,
                timestamp: new Date().toISOString(),
                proofType: file ? 'file' : 'url',
                proofValue: file ? {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type
                } : url
            };
            
            // For file uploads, try to read file content for preview
            if (file) {
                try {
                    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
                        // Read text files
                        const fileContent = await readFileAsText(file);
                        proofData.proofValue.content = fileContent.substring(0, 1000) + (fileContent.length > 1000 ? '...' : '');
                    } else if (file.type.startsWith('image/')) {
                        // Read image files as base64 for preview
                        const base64 = await readFileAsDataURL(file);
                        proofData.proofValue.preview = base64;
                    }
                } catch (error) {
                    console.log('Could not read file content:', error);
                }
            }
            
            // ALWAYS submit to Discord with the new webhook system
            const userResult = await new Promise(resolve => {
                chrome.storage.local.get(['subAlias'], resolve);
            });
            
            const username = userResult.subAlias || 'Unknown User';
            let discordSuccess = false;
            
            if (file) {
                // Send with file attachment
                discordSuccess = await sendDiscordWebhookWithFile(username, taskId, file, url);
            } else if (url) {
                // Send with URL only
                discordSuccess = await sendDiscordWebhookText(username, taskId, url);
            }
            
            if (discordSuccess) {
                success = true;
                message = 'Proof submitted to Discord successfully!';
                
                // Update gamification stats for the completed task
                const tributeAmount = await getTributeAmount();
                const nationality = await getUserNationality();
                
                // Update stats with gamification
                await updateUserStatsWithGameification(username, taskId, tributeAmount, nationality);
                
                // Get updated stats after gamification update
                const updatedStats = await chrome.storage.local.get(['userStats']);
                const currentTier = await updateUserTier(updatedStats.userStats?.[username]?.totalXP || 0);
                const task = currentTasks.find(t => t.title === taskId);
                const difficulty = task?.difficulty || 'easy';
                const baseTaskXP = task?.baseTaskXP || XP_CONFIG.baseTaskXP;
                const xpGained = await calculateXP(baseTaskXP, difficulty, tributeAmount, currentTier);
                
                // Show praise message and update UI with fresh stats
                await showPraiseMessage(currentTier, xpGained);
                await updateProfilePanel(updatedStats.userStats[username]);
                
            } else {
                success = false;
                message = 'Failed to submit proof to Discord';
            }
            
            if (success) {
                // Store proof submission in local storage
                const submissions = result.proofSubmissions || [];
                submissions.push(proofData);
                
                chrome.storage.local.set({proofSubmissions: submissions});
                
                console.log('Discord submission successful');
                showProofStatus(statusDiv, 'success', 'Proof submitted and sent to Discord!');
                
                // Refresh the task list to show updated completion status
                setTimeout(() => {
                    loadTasksFromGitHub();
                }, 1000);
                
                // Reset form
                fileInput.value = '';
                urlInput.value = '';
            } else {
                console.log('Proof submission failed:', message);
                showProofStatus(statusDiv, 'error', message);
            }
            
        } catch (error) {
            console.error('Error submitting proof:', error);
            showProofStatus(statusDiv, 'error', 'Submission failed: ' + error.message);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Proof';
        }
    }
    
    // Helper function to read file as text
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    // Helper function to read file as data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    // Function to submit proof via email
    async function submitToEmail(proofData, settings) {
        const subject = `KFD Task Proof - ${proofData.taskId}`;
        const body = `Task: ${proofData.taskId}\nTimestamp: ${proofData.timestamp}\nProof Type: ${proofData.proofType}\nProof: ${JSON.stringify(proofData.proofValue, null, 2)}`;
        
        const mailtoUrl = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.open(mailtoUrl);
        return true;
    }
    
    // Function to submit proof to Telegram
    async function submitToTelegram(proofData, file, settings) {
        try {
            const message = `🔹 Task Proof Submitted\n\n📋 Task: ${proofData.taskId}\n⏰ Time: ${new Date(proofData.timestamp).toLocaleString()}\n📎 Type: ${proofData.proofType}\n\n${proofData.proofType === 'url' ? '🔗 URL: ' + proofData.proofValue : '📄 File: ' + proofData.proofValue.fileName}`;
            
            const telegramUrl = `https://api.telegram.org/bot${settings.telegramToken}/sendMessage`;
            
            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: settings.telegramChatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (response.ok) {
                // If it's a file, try to send it as well
                if (file && file.size < 50 * 1024 * 1024) { // 50MB limit
                    const formData = new FormData();
                    formData.append('chat_id', settings.telegramChatId);
                    formData.append('document', file);
                    formData.append('caption', `Proof for task: ${proofData.taskId}`);
                    
                    await fetch(`https://api.telegram.org/bot${settings.telegramToken}/sendDocument`, {
                        method: 'POST',
                        body: formData
                    });
                }
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Telegram submission error:', error);
            return false;
        }
    }
    
    // Function to submit proof to Discord
    async function submitToDiscord(proofData, file, settings) {
        try {
            // Get user's alias for display
            const result = await new Promise(resolve => {
                chrome.storage.local.get(['subAlias'], resolve);
            });
            
            const alias = result.subAlias || 'Unknown Sub';
            
            const embed = {
                title: "� Task Proof Submitted",
                color: 0x9C27B0,
                fields: [
                    {
                        name: "� Submissive",
                        value: alias,
                        inline: true
                    },
                    {
                        name: "📋 Task",
                        value: proofData.taskId,
                        inline: true
                    },
                    {
                        name: "⏰ Time",
                        value: new Date(proofData.timestamp).toLocaleString(),
                        inline: true
                    }
                ],
                timestamp: proofData.timestamp
            };
            
            if (proofData.proofType === 'url') {
                embed.fields.push({
                    name: "🔗 Proof URL",
                    value: proofData.proofValue,
                    inline: false
                });
            } else if (proofData.proofType === 'file') {
                // Add detailed file information
                embed.fields.push({
                    name: "📄 File Details",
                    value: `**Name:** ${proofData.proofValue.fileName}\n**Size:** ${Math.round(proofData.proofValue.fileSize / 1024)} KB\n**Type:** ${proofData.proofValue.fileType}`,
                    inline: false
                });
                
                // Add file content preview if available
                if (proofData.proofValue.content) {
                    embed.fields.push({
                        name: "📝 File Content",
                        value: `\`\`\`\n${proofData.proofValue.content}\n\`\`\``,
                        inline: false
                    });
                }
                
                // Add image preview if available
                if (proofData.proofValue.preview) {
                    embed.image = {
                        url: proofData.proofValue.preview
                    };
                }
            }
            
            console.log('Submitting proof to Discord for user:', alias);
            console.log('Proof data:', proofData);
            
            // Direct webhook call - back to the simple working version
            const response = await fetch(DISCORD_CONFIG.defaultWebhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });
            
            console.log('Discord response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Discord error:', errorText);
            }
            
            return response.ok;
            
        } catch (error) {
            console.error('Discord submission error:', error);
            return false;
        }
    }
    
    // Function to show settings modal
    function showSettingsModal() {
        // Load current settings
        chrome.storage.local.get(['proofSettings'], function(result) {
            const settings = result.proofSettings || { method: 'console' };
            
            // Set radio button
            const radioBtn = document.querySelector(`input[name="proofMethod"][value="${settings.method}"]`);
            if (radioBtn) radioBtn.checked = true;
            
            // Set input values
            if (settings.email) document.getElementById('email-address').value = settings.email;
            if (settings.telegramToken) document.getElementById('telegram-token').value = settings.telegramToken;
            if (settings.telegramChatId) document.getElementById('telegram-chatid').value = settings.telegramChatId;
            if (settings.discordWebhook) document.getElementById('discord-webhook').value = settings.discordWebhook;
            
            settingsModal.classList.remove('hidden');
        });
    }
    
    // Function to hide settings modal
    function hideSettingsModal() {
        settingsModal.classList.add('hidden');
    }
    
    // Function to save proof settings
    function saveProofSettings() {
        const selectedMethod = document.querySelector('input[name="proofMethod"]:checked').value;
        
        const settings = {
            method: selectedMethod,
            email: document.getElementById('email-address').value,
            telegramToken: document.getElementById('telegram-token').value,
            telegramChatId: document.getElementById('telegram-chatid').value,
            discordWebhook: document.getElementById('discord-webhook').value
        };
        
        chrome.storage.local.set({proofSettings: settings}, function() {
            console.log('Proof settings saved:', settings);
            hideSettingsModal();
        });
    }
    
    // Discord Integration Functions
    
    // Setup Discord integration
    async function setupDiscordIntegration() {
        if (!DISCORD_CONFIG.enabled) {
            console.log('Discord integration disabled');
            return;
        }
        
        // Check if webhook is configured
        const result = await new Promise(resolve => {
            chrome.storage.local.get(['discordWebhook', 'subAlias'], resolve);
        });
        
        if (!result.discordWebhook && DISCORD_CONFIG.defaultWebhook !== 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL_HERE') {
            // Set default webhook
            chrome.storage.local.set({
                discordWebhook: DISCORD_CONFIG.defaultWebhook
            });
            console.log('Default Discord webhook configured');
        }
        
        // Create or get user alias
        let alias = result.subAlias;
        if (!alias) {
            alias = 'sub_' + Math.random().toString(36).substr(2, 8);
            chrome.storage.local.set({ subAlias: alias });
            
            // Send registration message to Discord
            await sendDiscordMessage({
                title: "🆕 New Sub Registered",
                description: `Welcome ${alias}! Ready to serve and complete tasks.`,
                color: 0x9C27B0,
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('Discord integration ready for:', alias);
    }
    
    // Send message to Discord
    async function sendDiscordMessage(embed) {
        try {
            const webhook = DISCORD_CONFIG.defaultWebhook;
            
            console.log('Sending Discord message...');
            console.log('Webhook URL:', webhook);
            
            const response = await fetch(webhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Discord webhook error:', response.status, errorText);
                return false;
            }
            
            console.log('Discord message sent successfully');
            return true;
        } catch (error) {
            console.error('Discord message error:', error);
            return false;
        }
    }
    
    // Send task completion to Discord
    async function sendTaskCompletionToDiscord(taskId, proofData, proofType) {
        const result = await new Promise(resolve => {
            chrome.storage.local.get(['subAlias'], resolve);
        });
        
        const alias = result.subAlias || 'Unknown Sub';
        
        const embed = {
            title: "✅ Task Completed",
            color: 0x4CAF50,
            fields: [
                {
                    name: "👤 Submissive",
                    value: alias,
                    inline: true
                },
                {
                    name: "📋 Task",
                    value: taskId,
                    inline: true
                },
                {
                    name: "⏰ Completed",
                    value: new Date().toLocaleString(),
                    inline: true
                }
            ],
            timestamp: new Date().toISOString()
        };
        
        if (proofType === 'url') {
            embed.fields.push({
                name: "🔗 Proof URL",
                value: proofData,
                inline: false
            });
        } else if (proofType === 'file' && proofData) {
            // Add file information
            embed.fields.push({
                name: "📄 File Details",
                value: `**Name:** ${proofData.fileName}\n**Size:** ${Math.round(proofData.fileSize / 1024)} KB\n**Type:** ${proofData.fileType}`,
                inline: false
            });
            
            // Add file content preview if available
            if (proofData.content) {
                embed.fields.push({
                    name: "� File Content Preview",
                    value: `\`\`\`\n${proofData.content}\n\`\`\``,
                    inline: false
                });
            }
            
            // Add image preview if available
            if (proofData.preview) {
                embed.image = {
                    url: proofData.preview
                };
            }
        }
        
        // Direct webhook call for task completion
        const response = await fetch(DISCORD_CONFIG.defaultWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });
        
        console.log('Task completion Discord response:', response.status);
        return response.ok;
    }
    
    // Function to show proof status
    function showProofStatus(statusDiv, type, message) {
        statusDiv.textContent = message;
        statusDiv.className = `proof-status ${type}`;
        
        // Hide status after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    // Function to mark a task as complete
    function markTaskComplete(taskId, buttonElement, proofSection) {
        console.log('Marking task as complete:', taskId);
        
        // Get current completed tasks
        chrome.storage.local.get(['completedTasks'], function(result) {
            const completedTasks = result.completedTasks || [];
            
            // Add this task to completed list
            if (!completedTasks.includes(taskId)) {
                completedTasks.push(taskId);
                
                // Save updated completed tasks
                chrome.storage.local.set({completedTasks: completedTasks}, function() {
                    console.log('Task completion saved');
                    
                    // Update button appearance
                    buttonElement.textContent = 'Completed';
                    buttonElement.classList.remove('incomplete');
                    buttonElement.classList.add('complete');
                    buttonElement.disabled = true;
                    buttonElement.style.cursor = 'not-allowed';
                    
                    // Show proof section
                    proofSection.classList.add('visible');
                });
            }
        });
    }
});

// Test that script is running
console.log('KFD Task Tracker script initialized');
