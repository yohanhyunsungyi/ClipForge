# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClipForge is a desktop video editor built with Electron and React. The MVP focuses on core video editing: import, preview, trim, and export.

**MVP Deadline**: Tuesday, October 28th, 2025 at 10:59 PM CT

## RULES!!!!!!!!

- No Over-Engineering - Implement only what is planned, keep it simple
- Production Code Only - No mocks, stubs, placeholders, or temporary files. Everything must actually work and be connected
- No Fake Implementations - If not ready, let it error. Don't pretend with mock data
- Search First - Always check for existing reusable modules before creating new ones
- Minimal Changes - Only modify code related to current task. Don't touch unrelated code
- Research Unknown Code - Use Context7 MCP or web search. Never guess
- Ask When Unclear - Don't assume. Confirm with user if ambiguous
- First Build Mindset - NO fallbacks, backward compatibility, or migrations. Errors are expected if wrong
- Complete Tasks Properly - Update TODO and commit after each task
- Simple, clean, real. Production-level code only. 

## Development Commands

```bash
# Development (concurrent webpack dev server + Electron)
npm run dev

# Run webpack dev server only
npm start

# Launch Electron (requires webpack running)
npm run electron

# Production build
npm run build

# Create distributable package
npm run dist           # Current platform
npm run dist:mac       # macOS DMG
npm run dist:win       # Windows installer
```

## Architecture Overview

### Dual Process Model

ClipForge follows Electron's dual-process architecture:

**Main Process** (`electron/` directory):
- Window management and app lifecycle
- FFmpeg video processing operations
- File system access and native dialogs
- IPC handlers for renderer communication

**Renderer Process** (`src/` directory):
- React UI components
- HTML5 video playback
- Timeline visualization
- User interactions and state management

### Critical IPC Communication Pattern

All main ↔ renderer communication flows through IPC:

1. **Renderer → Main**: `window.electron.methodName()` (exposed via preload/contextBridge)
2. **Main → Renderer**: `event.sender.send('event-name', data)` for async updates
3. **Bidirectional**: Used for progress updates during export

### State Management: VideoContext

All application state lives in `src/context/VideoContext.jsx` using React Context API:
- `clips` array: All imported video clips with metadata
- `currentClip`: Active clip being edited
- `inPoint`/`outPoint`: Trim boundaries
- `playhead`: Current playback position
- State mutations: `addClip()`, `updateClipTrim()`, `setCurrentClip()`

Components consume state via `useContext(VideoContext)` - never prop drilling.

### FFmpeg Integration

Video processing occurs in `electron/videoProcessor.js`:
- Uses `fluent-ffmpeg` wrapper around FFmpeg binary
- `@ffmpeg-installer/ffmpeg` provides binary
- **Critical**: Binary path must use `process.resourcesPath` in production builds
- Trim operation uses `-c copy` for fast codec copy (no re-encode)

## Key Implementation Details

### Video Import Flow
1. User drags/drops file or uses file picker
2. ImportArea sends file path to main via IPC
3. Main process extracts metadata with FFmpeg (`ffprobe`)
4. Metadata returned to renderer
5. VideoContext updated with new clip
6. All components re-render with new state

### Trim Boundaries Enforcement
VideoPlayer component enforces trim during playback:
- On play: if `currentTime < inPoint`, seek to `inPoint`
- During playback: if `currentTime >= outPoint`, pause
- Progress bar visually shows trimmed region

### Export Pipeline
1. ExportModal triggers export via IPC
2. Main shows save dialog
3. `videoProcessor.exportVideo()` builds FFmpeg command:
   - `-ss` for start time (inPoint)
   - `-t` for duration (outPoint - inPoint)
   - `-c copy` for codec copy
4. Progress events sent back to renderer
5. Completion notification updates UI

## File Organization

```
electron/
  main.js          - Entry point, window creation
  ipcHandlers.js   - IPC event handlers
  videoProcessor.js - FFmpeg wrapper

src/
  App.jsx          - Root component
  index.jsx        - React entry point
  index.html       - HTML template
  components/      - All React components
  context/         - VideoContext state
  styles/          - Component CSS files
```

## Development Workflow (7 PRs)

The project is structured as 7 sequential pull requests:
1. **PR #1**: Project setup (Electron + React + webpack)
2. **PR #2**: File import + metadata extraction
3. **PR #3**: Video player with controls
4. **PR #4**: Timeline UI with playhead
5. **PR #5**: Trim functionality
6. **PR #6**: Export pipeline
7. **PR #7**: Application packaging

Each PR builds on the previous. Do not skip ahead.

## Testing Requirements

Before MVP submission, manually verify:
- Electron window launches successfully
- Drag-and-drop and file picker import MP4/MOV
- Timeline displays clips with accurate duration
- Video plays with synchronized audio
- Trim in/out points control playback boundaries
- Export produces valid MP4 at correct duration
- Packaged app (not dev mode) works with all features

## Critical FFmpeg Commands

**Trim video (codec copy)**:
```bash
ffmpeg -i input.mp4 -ss 00:00:05 -t 00:00:10 -c copy output.mp4
```

**Extract metadata**:
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4
```

## MVP Hard Requirements

These features MUST be completed for MVP:
- ✅ Desktop app launches (packaged, not dev only)
- ✅ Video import (drag-and-drop + file picker)
- ✅ Timeline with visual clips
- ✅ Video preview with play/pause
- ✅ Trim in/out points
- ✅ Export to MP4 with progress
- ✅ Packaged distributable (DMG/EXE)

## Out of Scope for MVP

Do NOT implement these (post-MVP only):
- Screen recording / webcam capture
- Multiple clip arrangement
- Clip splitting
- Multiple tracks
- Text overlays / transitions / effects
- Audio controls
- Keyboard shortcuts
- Undo/redo

## Performance Targets

- App launch: < 5 seconds
- Timeline: 60fps with 10+ clips
- Video preview: 30fps minimum
- Export: No crashes, smooth progress updates

## Packaging Notes

When building distributable:
1. Use `electron-builder.yml` for configuration
2. Bundle FFmpeg binary in `extraResources`
3. Update `videoProcessor.js` to use `process.resourcesPath` in production
4. Test packaged app (not dev mode) before submission
5. Include 512x512+ icon in `build/` directory
