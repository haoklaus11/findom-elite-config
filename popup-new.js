// Popup.js - Findom Elite Tracker Chrome Extension
// Configuration URL - Update this to your live JSON config file
const CONFIG_URL = 'https://raw.githubusercontent.com/YOUR-USERNAME/findom-config/main/config.json';
const CONFIG_CACHE_KEY = 'findom_config';
const USER_DATA_KEY = 'findom_user_data';
const LAST_FETCH_KEY = 'last_config_fetch';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Global variables
let currentConfig = null;
let userData = {
    username: '',
    country: '',
    xp: 0,
    totalTribute: 0,
    currentStreak: 0,
    tier: 'novice',
    completedTasks: [],
    lastActivity: null
};

// Initialize extension when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Findom Elite Tracker initialized');
    initializeExtension();
});

// Main initialization function
async function initializeExtension() {
    try {
        // Load user data from storage
        await loadUserData();
        
        // Load configuration (cache or fetch)
        await loadConfiguration();
        
        // Check if user setup is complete
        if (!userData.username || !userData.country) {
            showUserInfoSection();
        } else {
            showMainInterface();
            updateProfilePanel();
            displayTasks();
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Set up background config refresh
        setupBackgroundRefresh();
        
    } catch (error) {
        console.error('❌ Error initializing extension:', error);
        showErrorMessage('Failed to initialize extension. Please try again.');
    }
}

// Load user data from Chrome storage
async function loadUserData() {
    return new Promise((resolve) => {
        chrome.storage.local.get([USER_DATA_KEY], function(result) {
            if (result[USER_DATA_KEY]) {
                userData = { ...userData, ...result[USER_DATA_KEY] };
                console.log('📊 User data loaded:', userData);
            }
            resolve();
        });
    });
}

// Save user data to Chrome storage
async function saveUserData() {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [USER_DATA_KEY]: userData }, function() {
            console.log('💾 User data saved');
            resolve();
        });
    });
}

// Load configuration from cache or fetch from remote
async function loadConfiguration() {
    try {
        const cachedData = await getCachedConfig();
        const lastFetch = await getLastFetchTime();
        const now = Date.now();
        
        // Check if we have valid cached data
        if (cachedData && lastFetch && (now - lastFetch) < CACHE_DURATION) {
            console.log('📦 Using cached configuration');
            currentConfig = cachedData;
            return;
        }
        
        // Fetch fresh configuration
        console.log('🌐 Fetching fresh configuration...');
        const response = await fetch(CONFIG_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const config = await response.json();
        
        // Validate configuration structure
        if (!validateConfig(config)) {
            throw new Error('Invalid configuration structure');
        }
        
        // Cache the new configuration
        await cacheConfig(config);
        await setLastFetchTime(now);
        
        currentConfig = config;
        console.log('✅ Configuration loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading configuration:', error);
        
        // Try to use cached data as fallback
        const cachedData = await getCachedConfig();
        if (cachedData) {
            console.log('⚠️ Using cached configuration as fallback');
            currentConfig = cachedData;
        } else {
            // Use default configuration
            console.log('🔧 Using default configuration');
            currentConfig = getDefaultConfig();
        }
    }
}

// Validate configuration structure
function validateConfig(config) {
    const required = ['tasks', 'tiers', 'goddessMessage', 'emojiMap'];
    return required.every(key => config.hasOwnProperty(key));
}

// Get default configuration
function getDefaultConfig() {
    return {
        tasks: [
            {
                id: 1,
                title: "Morning Tribute",
                description: "Send your daily tribute to show devotion",
                xp: 15,
                tributeRequired: 25,
                difficulty: "easy",
                tierVisibility: ["novice", "eager", "devoted", "sacrificial", "elite"]
            },
            {
                id: 2,
                title: "Worship Session",
                description: "Spend 30 minutes in worship and meditation",
                xp: 25,
                tributeRequired: 0,
                difficulty: "medium",
                tierVisibility: ["eager", "devoted", "sacrificial", "elite"]
            },
            {
                id: 3,
                title: "Financial Sacrifice",
                description: "Make a significant financial offering",
                xp: 50,
                tributeRequired: 100,
                difficulty: "hard",
                tierVisibility: ["devoted", "sacrificial", "elite"]
            }
        ],
        tiers: {
            novice: { minXP: 0, maxXP: 99, multiplier: 1.0, name: "Financial Novice" },
            eager: { minXP: 100, maxXP: 299, multiplier: 1.2, name: "Eager Pig" },
            devoted: { minXP: 300, maxXP: 699, multiplier: 1.5, name: "Devoted Slave" },
            sacrificial: { minXP: 700, maxXP: 1499, multiplier: 1.8, name: "Sacrificial Pig" },
            elite: { minXP: 1500, maxXP: 999999, multiplier: 2.0, name: "Elite Slave" }
        },
        goddessMessage: "Welcome to your financial servitude, pig. Today you will prove your devotion.",
        emojiMap: {
            novice: "🐷",
            eager: "🐽",
            devoted: "💰",
            sacrificial: "👑",
            elite: "💎"
        },
        webhookURL: ""
    };
}

// Cache configuration
async function cacheConfig(config) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [CONFIG_CACHE_KEY]: config }, resolve);
    });
}

// Get cached configuration
async function getCachedConfig() {
    return new Promise((resolve) => {
        chrome.storage.local.get([CONFIG_CACHE_KEY], function(result) {
            resolve(result[CONFIG_CACHE_KEY] || null);
        });
    });
}

// Set last fetch time
async function setLastFetchTime(time) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [LAST_FETCH_KEY]: time }, resolve);
    });
}

// Get last fetch time
async function getLastFetchTime() {
    return new Promise((resolve) => {
        chrome.storage.local.get([LAST_FETCH_KEY], function(result) {
            resolve(result[LAST_FETCH_KEY] || 0);
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    // Save user info
    const saveInfoBtn = document.getElementById('save-info');
    if (saveInfoBtn) {
        saveInfoBtn.addEventListener('click', saveUserInfo);
    }
    
    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('hidden');
        });
    }
    
    // Modal buttons
    const saveSettingsBtn = document.getElementById('save-settings');
    const cancelSettingsBtn = document.getElementById('cancel-settings');
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    if (cancelSettingsBtn) {
        cancelSettingsBtn.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
        });
    }
    
    // Sync button
    const syncBtn = document.getElementById('sync-btn');
    if (syncBtn) {
        syncBtn.addEventListener('click', syncConfiguration);
    }
}

// Set up background refresh
function setupBackgroundRefresh() {
    // Refresh configuration every hour
    setInterval(async () => {
        console.log('🔄 Background configuration refresh');
        await loadConfiguration();
        if (userData.username) {
            displayTasks();
        }
    }, CACHE_DURATION);
}

// Show user info section
function showUserInfoSection() {
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('main-interface').classList.add('hidden');
}

// Show main interface
function showMainInterface() {
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('main-interface').classList.remove('hidden');
}

// Save user information
async function saveUserInfo() {
    const username = document.getElementById('username').value.trim();
    const country = document.getElementById('country').value.trim();
    
    if (!username || !country) {
        showErrorMessage('Please fill in all required fields');
        return;
    }
    
    userData.username = username;
    userData.country = country;
    
    await saveUserData();
    showMainInterface();
    updateProfilePanel();
    displayTasks();
    
    showSuccessMessage('Profile saved successfully!');
}

// Update profile panel
function updateProfilePanel() {
    if (!currentConfig) return;
    
    // Update user info
    const usernameEl = document.getElementById('display-username');
    const countryEl = document.getElementById('display-country');
    
    if (usernameEl) usernameEl.textContent = userData.username;
    if (countryEl) countryEl.textContent = userData.country;
    
    // Update tier information
    const currentTier = getCurrentTier();
    const tierData = currentConfig.tiers[currentTier];
    
    // Update tier badge
    const tierBadge = document.querySelector('.tier-badge');
    if (tierBadge) {
        const emoji = currentConfig.emojiMap[currentTier] || '🐷';
        tierBadge.innerHTML = `<span>${emoji}</span> ${tierData.name}`;
    }
    
    // Update XP display
    const xpDisplay = document.querySelector('.xp-display');
    if (xpDisplay) {
        xpDisplay.textContent = `${userData.xp} XP`;
    }
    
    // Update level number
    const levelNumber = document.querySelector('.level-number');
    if (levelNumber) {
        levelNumber.textContent = Object.keys(currentConfig.tiers).indexOf(currentTier) + 1;
    }
    
    // Update progress bar
    updateProgressBar();
    
    // Update stats
    updateStats();
    
    // Update goddess message
    const goddessMessage = document.querySelector('.goddess-message');
    if (goddessMessage) {
        goddessMessage.textContent = currentConfig.goddessMessage;
    }
}

// Get current tier based on XP
function getCurrentTier() {
    if (!currentConfig) return 'novice';
    
    for (const [tierKey, tierData] of Object.entries(currentConfig.tiers)) {
        if (userData.xp >= tierData.minXP && userData.xp <= tierData.maxXP) {
            return tierKey;
        }
    }
    return 'novice';
}

// Update progress bar
function updateProgressBar() {
    const currentTier = getCurrentTier();
    const tierData = currentConfig.tiers[currentTier];
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const nextTierInfo = document.querySelector('.next-tier-info');
    
    if (progressFill && tierData) {
        const progress = ((userData.xp - tierData.minXP) / (tierData.maxXP - tierData.minXP)) * 100;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
        
        if (progressText) {
            progressText.textContent = `${userData.xp} / ${tierData.maxXP} XP`;
        }
        
        if (nextTierInfo) {
            const nextTierXP = tierData.maxXP + 1;
            const xpNeeded = nextTierXP - userData.xp;
            if (xpNeeded > 0) {
                nextTierInfo.textContent = `${xpNeeded} XP to next tier`;
            } else {
                nextTierInfo.textContent = 'Max tier reached!';
            }
        }
    }
}

// Update stats display
function updateStats() {
    const stats = {
        'tribute-total': `$${userData.totalTribute}`,
        'tasks-completed': userData.completedTasks.length,
        'current-streak': userData.currentStreak,
        'xp-total': userData.xp
    };
    
    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    });
}

// Display tasks based on current tier
function displayTasks() {
    if (!currentConfig) return;
    
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    const currentTier = getCurrentTier();
    const availableTasks = currentConfig.tasks.filter(task => 
        task.tierVisibility.includes(currentTier)
    );
    
    availableTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Create task element
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-card glassmorphic';
    
    const isCompleted = userData.completedTasks.includes(task.id);
    const currentTier = getCurrentTier();
    const multiplier = currentConfig.tiers[currentTier].multiplier;
    const adjustedXP = Math.round(task.xp * multiplier);
    const adjustedTribute = Math.round(task.tributeRequired * multiplier);
    
    taskDiv.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <span class="task-difficulty difficulty-${task.difficulty}">${task.difficulty}</span>
        </div>
        <p class="task-description">${task.description}</p>
        <div class="task-rewards">
            <div class="task-reward xp">
                <span>⭐</span>
                <span>+${adjustedXP} XP</span>
            </div>
            ${task.tributeRequired > 0 ? `
                <div class="task-reward tribute">
                    <span>💰</span>
                    <span>$${adjustedTribute}</span>
                </div>
            ` : ''}
        </div>
        <button class="task-button ${isCompleted ? 'complete' : 'incomplete'}" 
                ${isCompleted ? 'disabled' : ''} 
                onclick="toggleTask(${task.id})">
            ${isCompleted ? '✅ Completed' : '🎯 Accept Task'}
        </button>
        <div class="proof-section" id="proof-${task.id}">
            <h4>Submit Proof</h4>
            <div class="proof-input-group">
                <label for="proof-file-${task.id}">Upload Image:</label>
                <input type="file" id="proof-file-${task.id}" class="proof-file-input" accept="image/*">
            </div>
            <div class="proof-input-group">
                <label for="proof-url-${task.id}">Or provide URL:</label>
                <input type="url" id="proof-url-${task.id}" class="proof-url-input" placeholder="https://example.com/proof.jpg">
            </div>
            <button class="proof-submit-btn" onclick="submitProof(${task.id})">Submit Proof</button>
            <div class="proof-status" id="proof-status-${task.id}"></div>
        </div>
    `;
    
    return taskDiv;
}

// Toggle task proof section
function toggleTask(taskId) {
    const proofSection = document.getElementById(`proof-${taskId}`);
    if (proofSection) {
        proofSection.classList.toggle('visible');
    }
}

// Submit proof for task
async function submitProof(taskId) {
    const fileInput = document.getElementById(`proof-file-${taskId}`);
    const urlInput = document.getElementById(`proof-url-${taskId}`);
    const statusDiv = document.getElementById(`proof-status-${taskId}`);
    
    if (!fileInput || !urlInput || !statusDiv) return;
    
    // Validate input
    if (fileInput.files.length === 0 && !urlInput.value.trim()) {
        showProofStatus(statusDiv, 'Please provide either an image file or URL', 'error');
        return;
    }
    
    const task = currentConfig.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Show loading state
    showProofStatus(statusDiv, 'Submitting proof...', 'loading');
    
    try {
        // Prepare proof data
        const proofData = {
            taskId: taskId,
            taskTitle: task.title,
            username: userData.username,
            country: userData.country,
            tier: getCurrentTier(),
            imageUrl: urlInput.value.trim() || null,
            hasFile: fileInput.files.length > 0,
            timestamp: new Date().toISOString()
        };
        
        // Send to Discord webhook if configured
        if (currentConfig.webhookURL) {
            await sendDiscordWebhook(task, proofData);
        }
        
        // Update user data
        const currentTier = getCurrentTier();
        const multiplier = currentConfig.tiers[currentTier].multiplier;
        const xpGained = Math.round(task.xp * multiplier);
        const tributeAmount = Math.round(task.tributeRequired * multiplier);
        
        // Store old tier for level up check
        const oldTier = getCurrentTier();
        
        userData.xp += xpGained;
        userData.totalTribute += tributeAmount;
        userData.completedTasks.push(taskId);
        userData.lastActivity = new Date().toISOString();
        
        // Save data first
        await saveUserData();
        
        // Check for level up
        const newTier = getCurrentTier();
        if (newTier !== oldTier) {
            showLevelUpAnimation();
        }
        
        // Update UI
        updateProfilePanel();
        displayTasks();
        
        showProofStatus(statusDiv, 'Proof submitted successfully! 🎉', 'success');
        
        // Hide proof section after delay
        setTimeout(() => {
            const proofSection = document.getElementById(`proof-${taskId}`);
            if (proofSection) {
                proofSection.classList.remove('visible');
            }
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error submitting proof:', error);
        showProofStatus(statusDiv, 'Failed to submit proof. Please try again.', 'error');
    }
}

// Show proof status
function showProofStatus(statusDiv, message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `proof-status ${type}`;
    statusDiv.style.display = 'block';
}

// Send Discord webhook
async function sendDiscordWebhook(task, proofData) {
    if (!currentConfig.webhookURL) return;
    
    const currentTier = getCurrentTier();
    const tierData = currentConfig.tiers[currentTier];
    const emoji = currentConfig.emojiMap[currentTier] || '🐷';
    
    const webhookPayload = {
        embeds: [{
            title: `🎯 Task Completed: ${task.title}`,
            description: `**${userData.username}** has completed a task!`,
            color: 0xFFD700, // Gold color
            fields: [
                {
                    name: "👤 Submissive",
                    value: `${userData.username} (${userData.country})`,
                    inline: true
                },
                {
                    name: "👑 Tier",
                    value: `${emoji} ${tierData.name}`,
                    inline: true
                },
                {
                    name: "⭐ XP Gained",
                    value: `+${Math.round(task.xp * tierData.multiplier)} XP`,
                    inline: true
                },
                {
                    name: "💰 Tribute Amount",
                    value: `$${Math.round(task.tributeRequired * tierData.multiplier)}`,
                    inline: true
                },
                {
                    name: "📊 Total XP",
                    value: `${userData.xp} XP`,
                    inline: true
                },
                {
                    name: "💎 Total Tribute",
                    value: `$${userData.totalTribute}`,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Findom Elite Tracker"
            }
        }]
    };
    
    if (proofData.imageUrl) {
        webhookPayload.embeds[0].image = { url: proofData.imageUrl };
    }
    
    const response = await fetch(currentConfig.webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
    });
    
    if (!response.ok) {
        throw new Error(`Discord webhook failed: ${response.status}`);
    }
}

// Show level up animation
function showLevelUpAnimation() {
    const levelUpDiv = document.createElement('div');
    levelUpDiv.className = 'level-up-effect';
    levelUpDiv.textContent = '🎉 LEVEL UP! 🎉';
    
    document.body.appendChild(levelUpDiv);
    
    setTimeout(() => {
        levelUpDiv.remove();
    }, 2000);
}

// Sync configuration manually
async function syncConfiguration() {
    const syncBtn = document.getElementById('sync-btn');
    const syncStatus = document.getElementById('sync-status');
    
    if (!syncBtn || !syncStatus) return;
    
    syncBtn.disabled = true;
    syncStatus.textContent = 'Syncing configuration...';
    syncStatus.className = 'sync-status loading';
    
    try {
        // Force refresh by clearing cache timestamp
        await setLastFetchTime(0);
        await loadConfiguration();
        
        if (userData.username) {
            updateProfilePanel();
            displayTasks();
        }
        
        syncStatus.textContent = 'Configuration updated successfully!';
        syncStatus.className = 'sync-status success';
        
    } catch (error) {
        console.error('❌ Sync failed:', error);
        syncStatus.textContent = 'Sync failed. Please try again.';
        syncStatus.className = 'sync-status error';
    } finally {
        syncBtn.disabled = false;
        
        // Clear status after delay
        setTimeout(() => {
            syncStatus.textContent = '';
            syncStatus.className = 'sync-status';
        }, 3000);
    }
}

// Save settings
function saveSettings() {
    // Add settings saving logic here
    document.getElementById('settings-modal').classList.add('hidden');
    showSuccessMessage('Settings saved successfully!');
}

// Show success message
function showSuccessMessage(message) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = message;
        status.className = 'status success';
        setTimeout(() => {
            status.textContent = '';
            status.className = 'status';
        }, 3000);
    }
}

// Show error message
function showErrorMessage(message) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = message;
        status.className = 'status error';
        setTimeout(() => {
            status.textContent = '';
            status.className = 'status';
        }, 3000);
    }
}

// Expose functions to global scope for onclick handlers
window.toggleTask = toggleTask;
window.submitProof = submitProof;
