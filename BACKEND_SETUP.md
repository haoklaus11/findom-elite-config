# KFD Task Tracker - Backend Setup Instructions

## 📋 Overview
This guide will help you set up the complete KFD Task Tracker system with backend API and admin dashboard.

## 🚀 Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start the Backend Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

### 3. Access Admin Dashboard
Open your browser and go to:
```
http://localhost:3000/admin?adminKey=goddess-admin-2025
```

## 🔧 Backend Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
PORT=3000
ADMIN_KEY=your-custom-admin-key-here
```

### Default Settings
- **Port**: 3000
- **Admin Key**: `goddess-admin-2025`
- **Data Storage**: Local JSON files in `backend/data/`

## 📱 Chrome Extension Integration

### Automatic Integration
The extension will automatically:
1. Register users on first consent
2. Submit completed tasks to the backend
3. Show sync status in proof submissions

### Manual Configuration
In `popup.js`, you can modify:
```javascript
const API_CONFIG = {
    baseUrl: 'http://localhost:3000/api',
    enabled: true // Set to false to disable backend
};
```

## 🛠️ API Endpoints

### Public Endpoints

#### Register Submissive
```
POST /api/register-sub
Content-Type: application/json

{
    "alias": "devoted_sub",
    "extensionId": "chrome-extension-id"
}

Response:
{
    "success": true,
    "subId": "uuid-here",
    "alias": "devoted_sub",
    "registeredAt": "2025-07-12T10:30:00.000Z"
}
```

#### Submit Task
```
POST /api/submit-task
Content-Type: application/json

{
    "subId": "uuid-here",
    "taskId": "daily-worship",
    "proofUrl": "https://example.com/proof.jpg",
    "proofType": "url",
    "notes": "Completed with devotion"
}

Response:
{
    "success": true,
    "submissionId": "uuid-here",
    "timestamp": "2025-07-12T10:30:00.000Z"
}
```

### Admin Endpoints (Require Admin Key)

#### Get All Submissions
```
GET /api/submissions
X-Admin-Key: goddess-admin-2025

Response:
{
    "success": true,
    "count": 5,
    "submissions": [...]
}
```

#### Get All Subs
```
GET /api/subs
X-Admin-Key: goddess-admin-2025

Response:
{
    "success": true,
    "count": 3,
    "subs": [...]
}
```

#### Review Submission
```
PATCH /api/submissions/:submissionId/review
X-Admin-Key: goddess-admin-2025
Content-Type: application/json

{
    "status": "approved",
    "reviewNotes": "Well done!"
}
```

#### Get Statistics
```
GET /api/stats
X-Admin-Key: goddess-admin-2025

Response:
{
    "success": true,
    "stats": {
        "totalSubs": 5,
        "activeSubs": 4,
        "totalSubmissions": 25,
        "pendingSubmissions": 3,
        "todaySubmissions": 2
    }
}
```

## 🎛️ Admin Dashboard Features

### Dashboard Overview
- **Real-time Statistics**: Sub counts, submission stats
- **Submission Management**: Review, approve, reject tasks
- **Sub Management**: View registered submissives
- **Auto-refresh**: Updates every 30 seconds

### Review Actions
- **Approve**: ✅ Mark task as approved
- **Reject**: ❌ Mark task as rejected
- **Proof Links**: Direct access to submitted proof

### Security Features
- **Admin Key Protection**: All admin endpoints require authentication
- **CORS Protection**: Secure cross-origin requests
- **Helmet Security**: Additional security headers

## 📊 Data Storage

### File Structure
```
backend/
├── data/
│   ├── subs.json        # Registered submissives
│   └── submissions.json # Task submissions
├── admin/
│   └── index.html       # Admin dashboard
└── server.js            # Main server
```

### Data Format

#### Subs Data
```json
{
    "subId": "uuid",
    "alias": "devoted_sub",
    "registeredAt": "2025-07-12T10:30:00.000Z",
    "lastActive": "2025-07-12T10:30:00.000Z",
    "totalTasks": 5,
    "status": "active"
}
```

#### Submissions Data
```json
{
    "submissionId": "uuid",
    "subId": "uuid",
    "subAlias": "devoted_sub",
    "taskId": "daily-worship",
    "timestamp": "2025-07-12T10:30:00.000Z",
    "proofUrl": "https://example.com/proof.jpg",
    "proofType": "url",
    "status": "pending",
    "reviewedAt": null,
    "reviewedBy": null
}
```

## 🔒 Security Considerations

### Privacy Protection
- **No Personal Data**: Only aliases and task completions stored
- **Local Storage**: All data stored locally on your server
- **Consent-Based**: Only tracks explicitly submitted tasks
- **No Tracking**: No behavior monitoring or analytics

### Access Control
- **Admin Key**: Required for all admin operations
- **CORS Protection**: Prevents unauthorized cross-origin requests
- **Input Validation**: All API inputs validated and sanitized

## 🚨 Troubleshooting

### Common Issues

#### Extension Not Connecting
1. Check if backend is running on port 3000
2. Verify `API_CONFIG.baseUrl` in popup.js
3. Check browser console for CORS errors

#### Admin Dashboard Not Loading
1. Verify admin key in URL
2. Check browser console for errors
3. Ensure backend is running

#### Data Not Saving
1. Check file permissions in `backend/data/`
2. Verify disk space availability
3. Check server logs for errors

### Debug Commands
```bash
# Check if server is running
curl http://localhost:3000/health

# Test API with admin key
curl -H "X-Admin-Key: goddess-admin-2025" http://localhost:3000/api/stats

# View server logs
npm run dev
```

## 📈 Production Deployment

### Environment Setup
1. Set strong admin key
2. Configure proper CORS origins
3. Set up SSL/HTTPS
4. Configure database (optional)

### Recommended Hosting
- **Heroku**: Easy deployment
- **Railway**: Simple Node.js hosting
- **VPS**: Full control and privacy

### Database Migration
To use a database instead of JSON files:
1. Install database driver (MongoDB, PostgreSQL, etc.)
2. Modify data functions in server.js
3. Update connection configuration

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Verify API endpoint responses
4. Test with curl commands

The system is designed to be privacy-focused and secure for consensual use.
