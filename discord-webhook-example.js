// Complete Discord Webhook Integration for Chrome Extension
// This shows the exact code you need to add to your popup.js

// Discord Configuration
const DISCORD_CONFIG = {
    webhookUrl: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
    enabled: true
};

// Function to send Discord webhook with file attachment
async function sendDiscordWebhookWithFile(username, taskName, file, imageUrl = null) {
    try {
        const formData = new FormData();
        
        // Create the message content
        const messageContent = `**New Task Submission**\nUsername: ${username}\nTask: ${taskName}`;
        
        // Add the message content
        formData.append('content', messageContent);
        
        // If there's a file, add it as an attachment
        if (file) {
            formData.append('file', file, file.name);
        }
        
        // If there's an image URL, add it to the message
        if (imageUrl) {
            const embedContent = {
                embeds: [{
                    title: "New Task Submission",
                    fields: [
                        {
                            name: "Username",
                            value: username,
                            inline: true
                        },
                        {
                            name: "Task",
                            value: taskName,
                            inline: true
                        },
                        {
                            name: "Proof Image",
                            value: imageUrl,
                            inline: false
                        }
                    ],
                    image: {
                        url: imageUrl
                    },
                    color: 0x9C27B0,
                    timestamp: new Date().toISOString()
                }]
            };
            
            formData.append('payload_json', JSON.stringify(embedContent));
        }
        
        // Send the request
        const response = await fetch(DISCORD_CONFIG.webhookUrl, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`);
        }
        
        console.log('Discord webhook sent successfully');
        return true;
        
    } catch (error) {
        console.error('Error sending Discord webhook:', error);
        return false;
    }
}

// Function to send Discord webhook with just text/embed (no file)
async function sendDiscordWebhookText(username, taskName, imageUrl = null) {
    try {
        const payload = {
            content: `**New Task Submission**\nUsername: ${username}\nTask: ${taskName}`,
            embeds: [{
                title: "Task Completed",
                fields: [
                    {
                        name: "👤 Username",
                        value: username,
                        inline: true
                    },
                    {
                        name: "📋 Task",
                        value: taskName,
                        inline: true
                    },
                    {
                        name: "⏰ Completed",
                        value: new Date().toLocaleString(),
                        inline: true
                    }
                ],
                color: 0x4CAF50,
                timestamp: new Date().toISOString()
            }]
        };
        
        // Add image URL if provided
        if (imageUrl) {
            payload.embeds[0].fields.push({
                name: "🔗 Proof Image",
                value: imageUrl,
                inline: false
            });
            payload.embeds[0].image = {
                url: imageUrl
            };
        }
        
        const response = await fetch(DISCORD_CONFIG.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`);
        }
        
        console.log('Discord webhook sent successfully');
        return true;
        
    } catch (error) {
        console.error('Error sending Discord webhook:', error);
        return false;
    }
}

// Main function to handle proof submission
async function submitProofToDiscord(taskName, file, imageUrl) {
    try {
        // Get username from storage
        const result = await new Promise(resolve => {
            chrome.storage.local.get(['subAlias'], resolve);
        });
        
        const username = result.subAlias || 'Unknown User';
        
        // Send to Discord
        let success = false;
        if (file) {
            success = await sendDiscordWebhookWithFile(username, taskName, file, imageUrl);
        } else {
            success = await sendDiscordWebhookText(username, taskName, imageUrl);
        }
        
        return success;
        
    } catch (error) {
        console.error('Error submitting proof to Discord:', error);
        return false;
    }
}

// Example usage in your existing popup.js:
/*
// In your existing submitProof function, add this:
async function submitProof(taskId, fileInput, urlInput, submitBtn) {
    const file = fileInput.files[0];
    const url = urlInput.value.trim();
    
    // Your existing validation...
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Submit to Discord
        const success = await submitProofToDiscord(taskId, file, url);
        
        if (success) {
            showProofStatus(statusDiv, 'success', 'Proof submitted to Discord!');
        } else {
            showProofStatus(statusDiv, 'error', 'Failed to submit to Discord');
        }
        
    } catch (error) {
        showProofStatus(statusDiv, 'error', 'Submission failed: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Proof';
    }
}
*/
