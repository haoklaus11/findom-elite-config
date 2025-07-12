# KFD Task Tracker - GitHub Repository

This repository contains the task data for the KFD (Financial Domination) Task Tracker Chrome Extension.

## Files

### tasks.json
Contains the task data that the Chrome extension fetches. Each task has:
- `id`: Unique identifier for the task
- `title`: Display name of the task
- `description`: Detailed description of what needs to be done

### Structure
```json
[
  {
    "id": "unique-task-id",
    "title": "Task Title",
    "description": "Task description text"
  }
]
```

## Usage

The Chrome extension fetches task data from:
```
https://raw.githubusercontent.com/haoklaus11/Ktasks/main/tasks.json
```

## Updating Tasks

To update the tasks shown in the extension:
1. Edit the `tasks.json` file in this repository
2. Commit and push your changes
3. The extension will fetch the updated tasks on next sync

## Chrome Extension

The corresponding Chrome extension is located in your local development folder and includes:
- Consent-based access control
- Task completion tracking
- Local storage for user progress
- GitHub API integration for live task updates

## Security & Privacy

- All sensitive user data is stored locally in the browser
- No personal information is sent to GitHub
- Only task completion status is stored locally
- The extension operates with full user consent
