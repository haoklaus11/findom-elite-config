// Background.js - Service Worker for Findom Elite Tracker
// This handles background tasks and periodic config refreshes

const CONFIG_URL = 'https://raw.githubusercontent.com/YOUR-USERNAME/findom-config/main/config.json';
const CONFIG_CACHE_KEY = 'findom_config';
const LAST_FETCH_KEY = 'last_config_fetch';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Install event
chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 Findom Elite Tracker background service worker installed');
    
    // Set up periodic config refresh
    setupPeriodicRefresh();
});

// Startup event
chrome.runtime.onStartup.addListener(() => {
    console.log('🔄 Findom Elite Tracker background service worker started');
    setupPeriodicRefresh();
});

// Set up periodic configuration refresh
function setupPeriodicRefresh() {
    // Create alarm for periodic config refresh
    chrome.alarms.create('configRefresh', {
        delayInMinutes: 60, // First refresh after 1 hour
        periodInMinutes: 60 // Then every hour
    });
    
    console.log('⏰ Periodic config refresh alarm set');
}

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'configRefresh') {
        console.log('🔄 Background config refresh triggered');
        refreshConfiguration();
    }
});

// Refresh configuration in background
async function refreshConfiguration() {
    try {
        const response = await fetch(CONFIG_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const config = await response.json();
        
        // Validate configuration
        if (!validateConfig(config)) {
            throw new Error('Invalid configuration structure');
        }
        
        // Cache the new configuration
        await cacheConfig(config);
        await setLastFetchTime(Date.now());
        
        console.log('✅ Background configuration refresh successful');
        
        // Optional: Send notification to user about config update
        chrome.action.setBadgeText({
            text: '!'
        });
        
        chrome.action.setBadgeBackgroundColor({
            color: '#FFD700'
        });
        
        // Clear badge after 30 seconds
        setTimeout(() => {
            chrome.action.setBadgeText({
                text: ''
            });
        }, 30000);
        
    } catch (error) {
        console.error('❌ Background config refresh failed:', error);
    }
}

// Validate configuration structure
function validateConfig(config) {
    const required = ['tasks', 'tiers', 'goddessMessage', 'emojiMap'];
    return required.every(key => config.hasOwnProperty(key));
}

// Cache configuration
async function cacheConfig(config) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [CONFIG_CACHE_KEY]: config }, resolve);
    });
}

// Set last fetch time
async function setLastFetchTime(time) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [LAST_FETCH_KEY]: time }, resolve);
    });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'refreshConfig') {
        refreshConfiguration().then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'setBadge') {
        chrome.action.setBadgeText({
            text: request.text || ''
        });
        
        if (request.color) {
            chrome.action.setBadgeBackgroundColor({
                color: request.color
            });
        }
        
        sendResponse({ success: true });
    }
});

// Handle action clicks (when extension icon is clicked)
chrome.action.onClicked.addListener((tab) => {
    // This will only trigger if no popup is set
    console.log('Extension icon clicked');
});

// Monitor network requests if needed (optional)
chrome.webRequest?.onCompleted.addListener(
    (details) => {
        // Log successful webhook requests
        if (details.url.includes('discord.com/api/webhooks')) {
            console.log('✅ Discord webhook request completed:', details.statusCode);
        }
    },
    { urls: ['*://discord.com/*', '*://discordapp.com/*'] }
);

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener(() => {
    console.log('📦 Extension update available');
    // Optionally reload the extension
    // chrome.runtime.reload();
});

// Error handling for service worker
self.addEventListener('error', (event) => {
    console.error('❌ Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
});

// Keep service worker alive with periodic heartbeat
setInterval(() => {
    console.log('💓 Service worker heartbeat');
}, 25000); // Every 25 seconds

console.log('🔧 Background service worker loaded successfully');
