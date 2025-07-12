const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'goddess-admin-2025';

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const SUBS_FILE = path.join(DATA_DIR, 'subs.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Initialize data storage
async function initializeStorage() {
    try {
        await fs.ensureDir(DATA_DIR);
        
        // Initialize subs file
        if (!await fs.pathExists(SUBS_FILE)) {
            await fs.writeJson(SUBS_FILE, []);
        }
        
        // Initialize submissions file
        if (!await fs.pathExists(SUBMISSIONS_FILE)) {
            await fs.writeJson(SUBMISSIONS_FILE, []);
        }
        
        console.log('✅ Data storage initialized');
    } catch (error) {
        console.error('❌ Error initializing storage:', error);
    }
}

// Helper functions
async function loadSubs() {
    try {
        return await fs.readJson(SUBS_FILE);
    } catch (error) {
        console.error('Error loading subs:', error);
        return [];
    }
}

async function saveSubs(subs) {
    try {
        await fs.writeJson(SUBS_FILE, subs, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error saving subs:', error);
        return false;
    }
}

async function loadSubmissions() {
    try {
        return await fs.readJson(SUBMISSIONS_FILE);
    } catch (error) {
        console.error('Error loading submissions:', error);
        return [];
    }
}

async function saveSubmissions(submissions) {
    try {
        await fs.writeJson(SUBMISSIONS_FILE, submissions, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error saving submissions:', error);
        return false;
    }
}

// Middleware for admin authentication
function authenticateAdmin(req, res, next) {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    
    if (adminKey !== ADMIN_KEY) {
        return res.status(401).json({ 
            error: 'Unauthorized - Invalid admin key' 
        });
    }
    
    next();
}

// API Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'KFD Task Tracker API'
    });
});

// Register a new submissive
app.post('/api/register-sub', async (req, res) => {
    try {
        const { alias, extensionId } = req.body;
        
        // Validate input
        if (!alias || alias.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Alias is required' 
            });
        }
        
        // Generate unique sub ID
        const subId = uuidv4();
        const timestamp = new Date().toISOString();
        
        // Load existing subs
        const subs = await loadSubs();
        
        // Check if alias already exists
        const existingAlias = subs.find(sub => sub.alias.toLowerCase() === alias.toLowerCase());
        if (existingAlias) {
            return res.status(400).json({ 
                error: 'Alias already exists' 
            });
        }
        
        // Create new sub record
        const newSub = {
            subId,
            alias: alias.trim(),
            extensionId: extensionId || null,
            registeredAt: timestamp,
            lastActive: timestamp,
            totalTasks: 0,
            status: 'active'
        };
        
        // Add to subs list
        subs.push(newSub);
        
        // Save to file
        const saved = await saveSubs(subs);
        
        if (saved) {
            console.log(`📝 New sub registered: ${alias} (${subId})`);
            res.status(201).json({
                success: true,
                subId,
                alias,
                registeredAt: timestamp,
                message: 'Sub registered successfully'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to save sub registration' 
            });
        }
        
    } catch (error) {
        console.error('Error registering sub:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Submit a completed task
app.post('/api/submit-task', async (req, res) => {
    try {
        const { subId, taskId, proofUrl, proofType, notes } = req.body;
        
        // Validate input
        if (!subId || !taskId) {
            return res.status(400).json({ 
                error: 'subId and taskId are required' 
            });
        }
        
        // Load existing data
        const subs = await loadSubs();
        const submissions = await loadSubmissions();
        
        // Find the sub
        const sub = subs.find(s => s.subId === subId);
        if (!sub) {
            return res.status(404).json({ 
                error: 'Sub not found' 
            });
        }
        
        // Create submission record
        const submissionId = uuidv4();
        const timestamp = new Date().toISOString();
        
        const newSubmission = {
            submissionId,
            subId,
            subAlias: sub.alias,
            taskId,
            timestamp,
            proofUrl: proofUrl || null,
            proofType: proofType || null,
            notes: notes || null,
            status: 'pending',
            reviewedAt: null,
            reviewedBy: null
        };
        
        // Add to submissions
        submissions.push(newSubmission);
        
        // Update sub's last active and task count
        sub.lastActive = timestamp;
        sub.totalTasks = (sub.totalTasks || 0) + 1;
        
        // Save both files
        const submissionsSaved = await saveSubmissions(submissions);
        const subsSaved = await saveSubs(subs);
        
        if (submissionsSaved && subsSaved) {
            console.log(`✅ Task submitted: ${sub.alias} completed ${taskId}`);
            res.status(201).json({
                success: true,
                submissionId,
                timestamp,
                message: 'Task submitted successfully'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to save task submission' 
            });
        }
        
    } catch (error) {
        console.error('Error submitting task:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get all submissions (Admin only)
app.get('/api/submissions', authenticateAdmin, async (req, res) => {
    try {
        const submissions = await loadSubmissions();
        
        // Sort by timestamp (newest first)
        const sortedSubmissions = submissions.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        res.json({
            success: true,
            count: sortedSubmissions.length,
            submissions: sortedSubmissions
        });
        
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get all subs (Admin only)
app.get('/api/subs', authenticateAdmin, async (req, res) => {
    try {
        const subs = await loadSubs();
        
        // Sort by registration date (newest first)
        const sortedSubs = subs.sort((a, b) => 
            new Date(b.registeredAt) - new Date(a.registeredAt)
        );
        
        res.json({
            success: true,
            count: sortedSubs.length,
            subs: sortedSubs
        });
        
    } catch (error) {
        console.error('Error fetching subs:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Mark submission as reviewed (Admin only)
app.patch('/api/submissions/:submissionId/review', authenticateAdmin, async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { status, reviewNotes } = req.body;
        
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status. Must be approved, rejected, or pending' 
            });
        }
        
        const submissions = await loadSubmissions();
        const submissionIndex = submissions.findIndex(s => s.submissionId === submissionId);
        
        if (submissionIndex === -1) {
            return res.status(404).json({ 
                error: 'Submission not found' 
            });
        }
        
        // Update submission
        submissions[submissionIndex].status = status;
        submissions[submissionIndex].reviewedAt = new Date().toISOString();
        submissions[submissionIndex].reviewedBy = 'Admin';
        submissions[submissionIndex].reviewNotes = reviewNotes || null;
        
        const saved = await saveSubmissions(submissions);
        
        if (saved) {
            console.log(`📋 Submission ${submissionId} marked as ${status}`);
            res.json({
                success: true,
                message: `Submission marked as ${status}`,
                submission: submissions[submissionIndex]
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to update submission' 
            });
        }
        
    } catch (error) {
        console.error('Error reviewing submission:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get stats (Admin only)
app.get('/api/stats', authenticateAdmin, async (req, res) => {
    try {
        const subs = await loadSubs();
        const submissions = await loadSubmissions();
        
        const stats = {
            totalSubs: subs.length,
            activeSubs: subs.filter(s => s.status === 'active').length,
            totalSubmissions: submissions.length,
            pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
            approvedSubmissions: submissions.filter(s => s.status === 'approved').length,
            rejectedSubmissions: submissions.filter(s => s.status === 'rejected').length,
            todaySubmissions: submissions.filter(s => {
                const today = new Date().toDateString();
                return new Date(s.timestamp).toDateString() === today;
            }).length
        };
        
        res.json({
            success: true,
            stats,
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error generating stats:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Admin dashboard route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found' 
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error' 
    });
});

// Start server
async function startServer() {
    await initializeStorage();
    
    app.listen(PORT, () => {
        console.log(`🚀 KFD Task Tracker API running on port ${PORT}`);
        console.log(`📱 Health check: http://localhost:${PORT}/health`);
        console.log(`👑 Admin dashboard: http://localhost:${PORT}/admin?adminKey=${ADMIN_KEY}`);
        console.log(`🔑 Admin key: ${ADMIN_KEY}`);
    });
}

startServer().catch(console.error);
