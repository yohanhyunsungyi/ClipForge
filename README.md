# ClipForge

Desktop video editor built with Electron and React for importing, trimming, and exporting videos.

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the application in development mode:
```bash
npm run dev
```

This will:
- Start webpack dev server on http://localhost:3000
- Launch Electron window with hot reload enabled

### Building for Production

Create a production build:
```bash
npm run build
```

Package the application (PR #7):
```bash
npm run dist        # Current platform
npm run dist:mac    # macOS DMG
npm run dist:win    # Windows installer
```

## Project Structure

```
clipforge/
├── electron/           # Electron main process
│   ├── main.js        # App entry point
│   └── preload.js     # IPC bridge
├── src/               # React renderer process
│   ├── App.jsx        # Main component
│   ├── index.jsx      # React entry point
│   ├── index.html     # HTML template
│   ├── components/    # UI components
│   ├── context/       # State management
│   └── styles/        # CSS files
├── package.json
└── webpack.config.js
```

## Features (MVP)

- ✅ Video import (drag-and-drop + file picker)
- ✅ Video preview with playback controls
- ✅ Timeline visualization
- ✅ Trim functionality (in/out points)
- ✅ Export to MP4 with progress tracking
- ✅ Cross-platform desktop app

## Tech Stack

- Electron 28+
- React 18+
- Webpack 5
- FFmpeg (via fluent-ffmpeg)
