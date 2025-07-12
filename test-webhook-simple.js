// Simple Discord webhook test for Node.js
const https = require('https');

const webhookURL = "https://discord.com/api/webhooks/1393583751921012798/My8s76OqTZacnnmopgLtF3-ulTaI2-iinGSvAZGer8guuCNCz-K7S_tzi4Sil65ZmStn";

const testMessage = {
    embeds: [{
        title: "🎯 Findom Elite Tracker - System Test",
        description: "**Test Successful!** Your Discord webhook is working perfectly.",
        color: 15844367, // Gold color
        fields: [
            {
                name: "👤 Test User",
                value: "TestSlave (USA)",
                inline: true
            },
            {
                name: "👑 Tier Status",
                value: "🐷 Financial Novice",
                inline: true
            },
            {
                name: "⭐ XP Gained",
                value: "+25 XP",
                inline: true
            },
            {
                name: "💰 Tribute Amount",
                value: "$50",
                inline: true
            },
            {
                name: "📊 Total XP",
                value: "125 XP",
                inline: true
            },
            {
                name: "💎 Total Tribute",
                value: "$500",
                inline: true
            }
        ],
        footer: {
            text: "Findom Elite Tracker • Remote Control System",
        },
        timestamp: new Date().toISOString()
    }]
};

const data = JSON.stringify(testMessage);

const url = new URL(webhookURL);
const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🎯 Testing Discord webhook...');
console.log('📡 Sending test message to Discord...');

const req = https.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    if (res.statusCode === 200 || res.statusCode === 204) {
        console.log('✅ SUCCESS! Discord webhook is working!');
        console.log('📱 Check your Discord channel for the test message.');
        console.log('🎮 Your slaves will now send notifications when they complete tasks!');
    } else {
        console.log('❌ Failed to send webhook message.');
        console.log('🔧 Please check your webhook URL in config.json');
    }
});

req.on('error', (error) => {
    console.log('❌ Error sending webhook:', error.message);
    console.log('🔧 Please verify your webhook URL is correct');
});

req.write(data);
req.end();
