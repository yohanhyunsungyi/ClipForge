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

1. Create a production webpack bundle:
```bash
npm run build
```

2. Package the application as a distributable:
```bash
npm run dist        # Current platform (macOS/Windows/Linux)
npm run dist:mac    # macOS DMG + ZIP
npm run dist:win    # Windows NSIS installer
npm run dist:linux  # Linux AppImage
```

The distributable files will be created in the `release/` directory:
- **macOS**: `ClipForge-1.0.0-arm64.dmg` and `ClipForge-1.0.0-arm64-mac.zip`
- **Windows**: `ClipForge Setup 1.0.0.exe`
- **Linux**: `ClipForge-1.0.0.AppImage`

### System Requirements

- **macOS**: macOS 10.13+ (High Sierra or later)
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: Minimum 4GB recommended
- **Disk Space**: 200MB for app + space for video files

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

## Features

### Core Functionality
- ✅ **Video Import**: Drag-and-drop or file picker support for MP4/MOV files
- ✅ **Video Preview**: Full playback controls with synchronized audio
- ✅ **Timeline Visualization**: Visual timeline with draggable clips
- ✅ **Drag-to-Trim**: Industry-standard trim functionality with visual handles
  - Green handle (◀) for in-point (start of trimmed region)
  - Red handle (▶) for out-point (end of trimmed region)
  - Real-time visual feedback with dimmed overlays
  - Automatic trim handles appear at clip start/end on load
- ✅ **Alternative Trim Controls**: Button-based trim controls for accessibility
- ✅ **Export to MP4**: Fast export with progress tracking using codec copy
- ✅ **Cross-Platform**: macOS, Windows, and Linux support

### User Experience
- Modern, professional video editor UI layout
- Real-time trim value updates as you drag
- Visual feedback with glow effects on hover/active states
- Helpful hints and tooltips for discoverability
- Dual control methods (drag handles OR buttons) for flexibility

## How to Use

### Import a Video
1. Drag and drop a video file (MP4/MOV) onto the import area
2. Or click "Choose File" to select a video from your computer
3. The video will appear on the timeline and in the preview player

### Trim Your Video
**Method 1: Drag Handles (Recommended)**
1. Look for the green (◀) and red (▶) handles on the timeline
2. Drag the **green handle** to set where your video starts (in-point)
3. Drag the **red handle** to set where your video ends (out-point)
4. Watch the trim values update in real-time in the Trim Controls panel
5. The dimmed areas show what will be trimmed out

**Method 2: Button Controls**
1. Move the playhead to your desired position using the progress bar
2. Click "Set In Point" to mark the start
3. Move the playhead to the end position
4. Click "Set Out Point" to mark the end

### Export Your Video
1. Click the "Export Video" button
2. Choose where to save your trimmed video
3. Wait for the export to complete (progress bar will show status)
4. Your trimmed video is ready!

## Tech Stack

- **Electron** 28.3.3 - Desktop app framework
- **React** 18.3.1 - UI framework with hooks
- **Webpack** 5.102.1 - Module bundler
- **FFmpeg** - Video processing engine (via fluent-ffmpeg)
- **electron-builder** 26.0.12 - App packaging and distribution

## Troubleshooting

### No Audio Playback
The app automatically enables audio when a video is loaded. If you experience no audio:
- Check your system volume settings
- Ensure the video file contains an audio track
- Try reloading the video file

### Trim Handles Not Visible
Trim handles automatically appear when a video is loaded:
- Green handle (◀) appears at the start (0:00)
- Red handle (▶) appears at the end (clip duration)
- Hover over the timeline edges to see the handles

### Export Not Working
- Ensure FFmpeg is properly installed (bundled with the app)
- Check that you have write permissions to the export location
- Verify you have enough disk space for the exported file
