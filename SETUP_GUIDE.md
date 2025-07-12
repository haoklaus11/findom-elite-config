# KFD Task Tracker - Setup Instructions

## Step 1: Upload Files to Your GitHub Repository

1. Go to your GitHub repository: https://github.com/haoklaus11/Ktasks
2. Upload these files to your repository:
   - `tasks.json` (rename `github-tasks.json` to `tasks.json`)
   - `README.md` (optional documentation)

## Step 2: Verify Your Repository Structure

Your repository should have this structure:
```
Ktasks/
├── tasks.json
├── README.md
└── (any other files you have)
```

## Step 3: Test the Extension

1. Load the extension in Chrome:
   - Open Chrome
   - Go to chrome://extensions/
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select your KFD folder

2. Test the extension:
   - Click the extension icon
   - Accept consent
   - Click "Sync Tasks" to load from GitHub
   - You should see the tasks from your repository

## Step 4: Customize Your Tasks

Edit the `tasks.json` file in your GitHub repository to customize the tasks:

```json
[
  {
    "id": "your-task-id",
    "title": "Your Task Title",
    "description": "Your task description"
  }
]
```

## Troubleshooting

**If sync fails:**
- Check that `tasks.json` exists in your repository
- Verify the JSON format is valid
- Make sure the repository is public
- The extension will use offline backup tasks if GitHub is unavailable

**If extension doesn't load:**
- Check Chrome Developer Console for errors
- Verify all files are in the correct location
- Make sure manifest.json is properly formatted

## Repository URL
Your tasks are loaded from:
```
https://raw.githubusercontent.com/haoklaus11/Ktasks/main/tasks.json
```

## Next Steps

1. Upload `tasks.json` to your Ktasks repository
2. Test the extension
3. Customize tasks as needed
4. The extension will automatically fetch updates when you modify the GitHub file

The extension is now configured to work with your GitHub account!
