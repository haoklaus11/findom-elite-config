// Test file for Discord webhook integration
// Copy this into your browser console to test the webhook

// Test configuration
const TEST_WEBHOOK_URL = 'https://discord.com/api/webhooks/1393583751921012798/My8s76OqTZacnnmopgLtF3-ulTaI2-iinGSvAZGer8guuCNCz-K7S_tzi4Sil65ZmStn';

// Test 1: Simple text message
async function testSimpleMessage() {
    console.log('Testing simple Discord message...');
    
    const payload = {
        content: "**New Task Submission**\nUsername: test_user\nTask: test_task"
    };
    
    try {
        const response = await fetch(TEST_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Simple message response:', response.status, response.ok);
        return response.ok;
    } catch (error) {
        console.error('Simple message error:', error);
        return false;
    }
}

// Test 2: Rich embed message
async function testRichEmbed() {
    console.log('Testing rich embed message...');
    
    const payload = {
        content: "**New Task Submission**\nUsername: test_user\nTask: test_task",
        embeds: [{
            title: "📋 Task Completed",
            fields: [
                { name: "👤 Username", value: "test_user", inline: true },
                { name: "📋 Task", value: "test_task", inline: true },
                { name: "⏰ Completed", value: new Date().toLocaleString(), inline: true }
            ],
            color: 0x4CAF50,
            timestamp: new Date().toISOString()
        }]
    };
    
    try {
        const response = await fetch(TEST_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Rich embed response:', response.status, response.ok);
        return response.ok;
    } catch (error) {
        console.error('Rich embed error:', error);
        return false;
    }
}

// Test 3: Message with image URL
async function testImageUrl() {
    console.log('Testing message with image URL...');
    
    const payload = {
        content: "**New Task Submission**\nUsername: test_user\nTask: test_task",
        embeds: [{
            title: "📋 Task Completed",
            fields: [
                { name: "👤 Username", value: "test_user", inline: true },
                { name: "📋 Task", value: "test_task", inline: true },
                { name: "⏰ Completed", value: new Date().toLocaleString(), inline: true },
                { name: "🔗 Proof Image", value: "https://via.placeholder.com/300x200", inline: false }
            ],
            image: {
                url: "https://via.placeholder.com/300x200"
            },
            color: 0x4CAF50,
            timestamp: new Date().toISOString()
        }]
    };
    
    try {
        const response = await fetch(TEST_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Image URL response:', response.status, response.ok);
        return response.ok;
    } catch (error) {
        console.error('Image URL error:', error);
        return false;
    }
}

// Test 4: File upload simulation (you'd need to create a file input for this)
async function testFileUpload() {
    console.log('Testing file upload...');
    
    // Create a simple test file
    const testFileContent = new Blob(['This is a test file for Discord webhook'], { type: 'text/plain' });
    const testFile = new File([testFileContent], 'test-proof.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('content', '**New Task Submission**\nUsername: test_user\nTask: test_task');
    formData.append('file', testFile, testFile.name);
    
    // Add embed data
    const embedData = {
        embeds: [{
            title: "📋 Task Completed",
            fields: [
                { name: "👤 Username", value: "test_user", inline: true },
                { name: "📋 Task", value: "test_task", inline: true },
                { name: "⏰ Completed", value: new Date().toLocaleString(), inline: true },
                { name: "📄 File", value: `${testFile.name} (${Math.round(testFile.size)} bytes)`, inline: true }
            ],
            color: 0x4CAF50,
            timestamp: new Date().toISOString()
        }]
    };
    
    formData.append('payload_json', JSON.stringify(embedData));
    
    try {
        const response = await fetch(TEST_WEBHOOK_URL, {
            method: 'POST',
            body: formData
        });
        
        console.log('File upload response:', response.status, response.ok);
        return response.ok;
    } catch (error) {
        console.error('File upload error:', error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('=== Starting Discord Webhook Tests ===');
    
    const results = {
        simple: await testSimpleMessage(),
        embed: await testRichEmbed(),
        image: await testImageUrl(),
        file: await testFileUpload()
    };
    
    console.log('=== Test Results ===');
    console.log('Simple message:', results.simple ? '✅ PASS' : '❌ FAIL');
    console.log('Rich embed:', results.embed ? '✅ PASS' : '❌ FAIL');
    console.log('Image URL:', results.image ? '✅ PASS' : '❌ FAIL');
    console.log('File upload:', results.file ? '✅ PASS' : '❌ FAIL');
    
    const passCount = Object.values(results).filter(r => r).length;
    console.log(`\n${passCount}/4 tests passed`);
    
    return results;
}

// Auto-run tests when loaded
console.log('Discord webhook test functions loaded. Run runAllTests() to test all functions.');

// Export for manual testing
window.discordTests = {
    testSimpleMessage,
    testRichEmbed,
    testImageUrl,
    testFileUpload,
    runAllTests
};
