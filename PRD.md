ClipForge MVP

Product Requirements Document

**Desktop Video Editor - Electron + React**

**MVP Deadline: Tuesday, October 28th, 2025 at 10:59 PM CT**

# 1\. Executive Summary

ClipForge is a native desktop video editor built with Electron and React that enables creators to import, edit, and export professional videos. The MVP focuses on core functionality: video import, timeline editing with trim capabilities, real-time preview, and MP4 export. This document defines the minimum viable product requirements that must be completed by Tuesday, October 28th at 10:59 PM CT.

# 2\. Project Context

## 2.1 Problem Statement

Video creators need accessible desktop tools that handle the complete video editing workflow without complex software or steep learning curves. ClipForge provides a streamlined interface for essential editing tasks: import, trim, arrange, and export.

## 2.2 Success Criteria

The MVP will be considered successful when:

- A packaged desktop application launches successfully on macOS/Windows
- Users can import MP4/MOV files via drag-and-drop or file picker
- The timeline displays imported clips with visual representation
- Video preview player shows content with play/pause controls
- Users can set in/out points to trim a single clip
- Export produces a valid MP4 file with trimmed content

# 3\. Technical Stack

| **Component** | **Technology** |
| --- | --- |
| **Desktop Framework** | Electron 28+ (provides Node.js APIs and cross-platform desktop packaging) |
| **Frontend Framework** | React 18+ with functional components and hooks |
| **State Management** | React Context API or Zustand (lightweight, minimal setup) |
| **Video Processing** | FFmpeg via fluent-ffmpeg (Node.js wrapper for video encoding/transcoding) |
| **Video Player** | HTML5 &lt;video&gt; element with custom controls |
| **Timeline UI** | CSS-based with React components (drag-and-drop via react-beautiful-dnd or native HTML5) |
| **Build & Package** | electron-builder for creating distributable executables (DMG for macOS, EXE for Windows) |

# 4\. MVP Requirements (Hard Gate)

**The following requirements MUST be completed to pass the MVP checkpoint on Tuesday, October 28th at 10:59 PM CT. This is a hard gate - incomplete MVPs will not proceed to final submission.**

## 4.1 Desktop Application Launch

- Application must launch as a native desktop app using Electron
- Must be packaged as a distributable (not running in dev mode only)
- Window should have proper title, menu bar, and close/minimize/maximize controls

## 4.2 Video Import

- Support drag-and-drop of video files (MP4, MOV) into the application window
- Provide file picker dialog for importing videos from disk
- Display basic file metadata (filename, duration) after import
- Handle import errors gracefully with user-friendly error messages

## 4.3 Timeline View

- Display a horizontal timeline showing imported clips
- Show visual representation of clips (colored blocks with duration labels)
- Display playhead position indicator
- Show time markers for orientation (0:00, 0:10, 0:20, etc.)

## 4.4 Video Preview Player

- Display video preview window showing current clip
- Implement play/pause controls
- Show current playback time
- Audio playback synchronized with video

## 4.5 Basic Trim Functionality

- Allow users to set an in-point (start time) on a single clip
- Allow users to set an out-point (end time) on a single clip
- Visual indicators showing trim handles on timeline
- Preview reflects trimmed content (only plays between in/out points)

## 4.6 Export to MP4

- Export button triggers rendering process
- Generate valid MP4 file with trimmed content
- Show progress indicator during export
- Save file dialog allows user to choose export location and filename
- Success notification when export completes

# 5\. Architecture Overview

## 5.1 Application Structure

ClipForge follows a standard Electron architecture with separate main and renderer processes:

| **Process** | **Responsibilities** |
| --- | --- |
| **Main Process** | Window management, menu creation, file system operations, FFmpeg processing, IPC communication with renderer |
| **Renderer Process** | React UI components, video player, timeline visualization, user interactions, state management |

## 5.2 Key Components

### Main Process (Electron)

- main.js - Entry point, window creation, menu setup
- ipcHandlers.js - IPC event handlers for file operations and FFmpeg commands
- videoProcessor.js - FFmpeg wrapper for trim and export operations

### Renderer Process (React)

- App.jsx - Main application component and layout
- VideoPlayer.jsx - Video preview with playback controls
- Timeline.jsx - Visual timeline with clip representation
- ImportArea.jsx - Drag-and-drop and file picker interface
- TrimControls.jsx - In/out point setting interface
- ExportModal.jsx - Export configuration and progress display

## 5.3 Data Flow

- **Import:** User drops file → Renderer sends path via IPC → Main process validates and returns metadata → Renderer adds to state
- **Preview:** Renderer displays video using file:// protocol with security context
- **Trim:** User sets in/out points → State updates → Video player respects time boundaries
- **Export:** User clicks export → Renderer sends trim data via IPC → Main process invokes FFmpeg → Progress updates sent back → Completion notification

# 6\. Implementation Plan

## 6.1 Phase 1: Project Setup (2-3 hours)

- Initialize Electron + React project using electron-react-boilerplate or manual setup
- Install dependencies: electron, react, fluent-ffmpeg, electron-builder
- Configure webpack/vite for development and production builds
- Set up basic window creation in main process
- Create basic React component structure

## 6.2 Phase 2: Import & Preview (4-5 hours)

- Implement drag-and-drop file handling in renderer
- Add file picker dialog via IPC to main process
- Extract video metadata (duration, resolution) using FFmpeg probe
- Build VideoPlayer component with HTML5 video element
- Implement play/pause controls and time display
- Test playback with sample MP4/MOV files

## 6.3 Phase 3: Timeline UI (4-5 hours)

- Create Timeline component with CSS Grid or Flexbox layout
- Display imported clips as visual blocks with duration labels
- Add playhead indicator that syncs with video player time
- Implement time markers (0:00, 0:10, 0:20, etc.)
- Connect timeline clicks to video scrubbing

## 6.4 Phase 4: Trim Functionality (3-4 hours)

- Add in-point and out-point state to clip data model
- Create UI for setting trim handles on timeline (draggable or buttons)
- Visual feedback showing trimmed region
- Update video player to respect trim boundaries during playback

## 6.5 Phase 5: Export Pipeline (4-6 hours)

- Create export modal with save dialog
- Implement FFmpeg command builder for trim and export
- Set up IPC handlers for export requests and progress updates
- Display progress bar with percentage and estimated time
- Handle export completion and error cases
- Test exported videos play correctly in QuickTime/VLC

## 6.6 Phase 6: Packaging & Testing (3-4 hours)

- Configure electron-builder for DMG (macOS) and EXE (Windows) builds
- Test packaged app launches and all features work outside dev mode
- Verify FFmpeg binary is bundled correctly
- Test on both macOS and Windows if possible (or at minimum one platform)
- Document build instructions in README

# 7\. Success Metrics & Testing

## 7.1 Functional Testing

- Import a 30-second MP4 clip and verify it appears in timeline
- Play imported video and confirm audio/video sync
- Set trim in-point at 5 seconds and out-point at 15 seconds
- Export trimmed video and verify output is exactly 10 seconds
- Confirm exported MP4 plays in QuickTime/VLC without errors

## 7.2 Performance Targets

- App launches in under 5 seconds
- Timeline remains responsive with 3+ clips
- Video preview plays at 30 fps minimum (smooth playback)
- Export completes without crashes

## 7.3 User Experience

- Clear visual feedback for all actions (import, trim, export)
- Error messages are user-friendly, not technical stack traces
- UI is intuitive enough that first-time users can complete basic workflow

# 8\. Out of Scope for MVP

The following features are NOT required for MVP and should be postponed to the final submission or future iterations:

- Screen recording and webcam capture
- Multiple clip arrangement and sequencing
- Clip splitting at playhead
- Multiple timeline tracks
- Text overlays, transitions, or effects
- Audio controls (volume, fade)
- Resolution options beyond source quality
- Cloud storage uploads
- Keyboard shortcuts
- Undo/redo functionality

# 9\. Risk Mitigation

| **Risk** | **Impact** | **Mitigation** |
| --- | --- | --- |
| FFmpeg configuration issues | Export fails or produces corrupted files | Test FFmpeg integration early (Phase 2), use pre-built FFmpeg binaries, reference fluent-ffmpeg documentation |
| Timeline UI complexity | Timeline takes too long to build, delaying other features | Start simple: static clip blocks with CSS, no drag-and-drop initially, add interactions incrementally |
| Electron packaging failures | Cannot create distributable, fails MVP requirement | Test packaging early (Phase 6 start), use electron-builder templates, ensure FFmpeg binary paths are correct |
| Time constraint | Cannot complete all MVP features by deadline | Prioritize core workflow: import → preview → trim → export. Cut UI polish if needed, focus on functionality |

# 10\. Timeline & Milestones

| **Date** | **Milestone** | **Status** |
| --- | --- | --- |
| Mon, Oct 27 | Project kickoff, setup dev environment, complete Phases 1-2 | In Progress |
| Mon Evening | Import and preview working, Phase 3 timeline UI started | Pending |
| Tue, Oct 28 AM | Timeline complete, trim functionality implemented (Phase 4) | Pending |
| Tue Afternoon | Export pipeline working, basic testing complete (Phase 5) | Pending |
| Tue Evening | App packaged and tested, MVP submission ready (Phase 6) | Pending |
| **Tue 10:59 PM CT** | **MVP SUBMISSION DEADLINE** | **HARD GATE** |

# 11\. Appendix

## 11.1 Recommended NPM Packages

- **electron:** ^28.0.0
- **electron-builder:** ^24.0.0
- **react:** ^18.2.0
- **react-dom:** ^18.2.0
- **fluent-ffmpeg:** ^2.1.2
- **zustand:** ^4.4.0 (optional, for state management)
- **@ffmpeg-installer/ffmpeg:** ^1.1.0 (provides FFmpeg binary)

## 11.2 Useful Resources

- Electron Documentation: <https://www.electronjs.org/docs>
- Fluent-FFmpeg API: <https://github.com/fluent-ffmpeg/node-fluent-ffmpeg>
- Electron-Builder Configuration: <https://www.electron.build>
- React Hooks Guide: <https://react.dev/reference/react>

## 11.3 Sample FFmpeg Commands

**Trim video:**

ffmpeg -i input.mp4 -ss 00:00:05 -to 00:00:15 -c copy output.mp4

**Get video metadata:**

ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4

**Re-encode with quality:**

ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 -c:a aac output.mp4

_End of Document_

**Focus on the core loop: Import → Preview → Trim → Export**