chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sync') {
        // In a real extension, you would fetch from GitHub here.
        // For now, we'll simulate a successful sync.
        console.log('Syncing with GitHub...');
        
        // Simulate network request
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            if (success) {
                sendResponse({success: true, tasks: [], announcements: []});
            } else {
                sendResponse({success: false});
            }
        }, 1000);

        return true; // Indicates that the response is sent asynchronously
    }
});
