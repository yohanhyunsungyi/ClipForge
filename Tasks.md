ClipForge MVP Task List

Development Checklist with PR Breakdown

**MVP Deadline: Tuesday, October 28th at 10:59 PM CT**

# Overview

This document breaks down the ClipForge MVP development into 7 Pull Requests. Each PR represents a logical unit of work that can be developed, tested, and merged independently. Check off tasks as you complete them and commit to GitHub after each PR.

**Total Estimated Time: 20-27 hours across 7 PRs**

## Legend

☐ Main task checkbox

○ Subtask checkbox

**\[NEW\]** File to be created

**\[EDIT\]** File to be modified

# PR #1: Project Setup & Configuration ✅ COMPLETE

**Estimated Time:** 2-3 hours **| Priority: CRITICAL**

Initialize the Electron + React project with all necessary dependencies and basic window configuration. This PR establishes the foundation for all future development.

## File Structure Created

clipforge/

├── package.json \[NEW\]

├── .gitignore \[NEW\]

├── electron/

│ └── main.js \[NEW\]

├── src/

│ ├── App.jsx \[NEW\]

│ ├── index.jsx \[NEW\]

│ ├── index.html \[NEW\]

│ └── styles/

│ └── App.css \[NEW\]

├── webpack.config.js \[NEW\]

└── README.md \[NEW\]

## Tasks

- [x] **Initialize Node.js project**
  - [x] Run npm init and create package.json \[NEW\]
  - [x] Configure project name, version, and description
- [x] **Install core dependencies**
  - [x] Install electron@^28.0.0
  - [x] Install react@^18.2.0 and react-dom@^18.2.0
  - [x] Install webpack@^5.0.0, webpack-cli, webpack-dev-server
  - [x] Install babel-loader, @babel/preset-react for JSX transpilation
  - [x] Update package.json with dependencies \[EDIT\]
- [x] **Configure webpack**
  - [x] Create webpack.config.js \[NEW\]
  - [x] Set entry point to src/index.jsx
  - [x] Configure babel-loader for JSX files
  - [x] Set up HTML webpack plugin for index.html
  - [x] Configure dev server for hot reload
- [x] **Create Electron main process**
  - [x] Create electron/main.js \[NEW\]
  - [x] Import app, BrowserWindow from electron
  - [x] Create createWindow() function
  - [x] Set window dimensions (1200x800)
  - [x] Configure webPreferences with nodeIntegration and contextIsolation
  - [x] Load index.html in development mode
  - [x] Add app.whenReady() event listener
- [x] **Create React entry point**
  - [x] Create src/index.jsx \[NEW\]
  - [x] Import React, ReactDOM, and App component
  - [x] Render App component to root div
- [x] **Create basic App component**
  - [x] Create src/App.jsx \[NEW\]
  - [x] Set up functional component with placeholder content
  - [x] Add basic CSS import
- [x] **Create HTML template**
  - [x] Create src/index.html \[NEW\]
  - [x] Add root div for React mounting
  - [x] Set page title to ClipForge
- [x] **Add npm scripts**
  - [x] Add start script for webpack dev server in package.json \[EDIT\]
  - [x] Add electron script to launch app in package.json \[EDIT\]
  - [x] Add dev script to run both concurrently
- [x] **Create .gitignore**
  - [x] Create .gitignore \[NEW\]
  - [x] Add node_modules/, dist/, build/
- [x] **Create README**
  - [x] Create README.md \[NEW\]
  - [x] Add project description and setup instructions
- [x] **Test application launch**
  - [x] Run npm run dev and verify Electron window opens
  - [x] Verify React app renders in Electron window

# PR #2: File Import & Metadata Extraction ✅ COMPLETE

**Estimated Time:** 3-4 hours **| Priority: HIGH**

Implement video file import via drag-and-drop and file picker. Extract metadata using FFmpeg and store in application state.

## File Structure

clipforge/

├── electron/

│ ├── main.js \[EDIT\]

│ ├── ipcHandlers.js \[NEW\]

│ └── videoProcessor.js \[NEW\]

├── src/

│ ├── App.jsx \[EDIT\]

│ ├── components/

│ │ └── ImportArea.jsx \[NEW\]

│ ├── context/

│ │ └── VideoContext.jsx \[NEW\]

│ └── styles/

│ └── ImportArea.css \[NEW\]

└── package.json \[EDIT\]

## Tasks

- [x] **Install FFmpeg dependencies**
  - [x] Install fluent-ffmpeg@^2.1.2
  - [x] Install @ffmpeg-installer/ffmpeg@^1.1.0
  - [x] Update package.json \[EDIT\]
- [x] **Create video processor module**
  - [x] Create electron/videoProcessor.js \[NEW\]
  - [x] Import fluent-ffmpeg and set FFmpeg path
  - [x] Create getVideoMetadata(filePath) function
  - [x] Extract duration, resolution, codec info using ffprobe
  - [x] Return metadata object with filename, duration, width, height
- [x] **Set up IPC handlers**
  - [x] Create electron/ipcHandlers.js \[NEW\]
  - [x] Import ipcMain and dialog from electron
  - [x] Create handle:import-video handler for file picker
  - [x] Create handle:get-video-metadata handler
  - [x] Add file type filters (MP4, MOV) in dialog options
- [x] **Update main process**
  - [x] Import and register IPC handlers in electron/main.js \[EDIT\]
  - [x] Enable contextBridge in webPreferences
- [x] **Create video context**
  - [x] Create src/context/VideoContext.jsx \[NEW\]
  - [x] Set up React Context with createContext
  - [x] Create VideoProvider component with useState for clips array
  - [x] Add addClip(clip) and removeClip(id) functions
  - [x] Export VideoContext and VideoProvider
- [x] **Create ImportArea component**
  - [x] Create src/components/ImportArea.jsx \[NEW\]
  - [x] Set up drag-and-drop event handlers (onDragOver, onDrop)
  - [x] Prevent default drag behavior
  - [x] Extract file path from drop event
  - [x] Call window.electron.getVideoMetadata via IPC
  - [x] Add file picker button with onClick handler
  - [x] Call window.electron.importVideo via IPC
  - [x] Update VideoContext with imported clip
  - [x] Display visual feedback during import
- [x] **Style ImportArea**
  - [x] Create src/styles/ImportArea.css \[NEW\]
  - [x] Style drag-and-drop zone with dashed border
  - [x] Add hover state styling
  - [x] Style import button
- [x] **Update App component**
  - [x] Wrap App with VideoProvider in src/App.jsx \[EDIT\]
  - [x] Import and render ImportArea component
  - [x] Add basic layout structure
- [x] **Test import functionality**
  - [x] Test drag-and-drop with MP4 file
  - [x] Test file picker dialog
  - [x] Verify metadata extraction (duration, resolution)
  - [x] Check error handling for invalid files

# PR #3: Video Preview Player ✅ COMPLETE

**Estimated Time:** 3-4 hours **| Priority: HIGH**

Build a video player component with HTML5 video element, playback controls, and time display.

## File Structure

clipforge/

├── src/

│ ├── App.jsx \[EDIT\]

│ ├── components/

│ │ ├── ImportArea.jsx \[EXISTING\]

│ │ └── VideoPlayer.jsx \[NEW\]

│ ├── context/

│ │ └── VideoContext.jsx \[EDIT\]

│ └── styles/

│ └── VideoPlayer.css \[NEW\]

## Tasks

- [x] **Create VideoPlayer component**
  - [x] Create src/components/VideoPlayer.jsx \[NEW\]
  - [x] Import useContext to access VideoContext
  - [x] Set up useRef for video element
  - [x] Render HTML5 video element
  - [x] Set video src to current clip file path
- [x] **Implement playback controls**
  - [x] Add play/pause button with useState for playback state
  - [x] Create handlePlayPause() function
  - [x] Call videoRef.current.play() or pause()
  - [x] Update button icon based on playback state
- [x] **Add time display**
  - [x] Set up useState for currentTime
  - [x] Add onTimeUpdate event listener to video element
  - [x] Update currentTime state in event handler
  - [x] Display formatted time (MM:SS)
  - [x] Show duration from VideoContext
- [x] **Add seek/scrubbing functionality**
  - [x] Create progress bar with input range slider
  - [x] Set min=0, max=duration, value=currentTime
  - [x] Add onChange handler to update video currentTime
  - [x] Update visual progress bar position
- [x] **Style VideoPlayer component**
  - [x] Create src/styles/VideoPlayer.css \[NEW\]
  - [x] Style video element with max-width and aspect-ratio
  - [x] Style control bar with flexbox layout
  - [x] Style play/pause button
  - [x] Style progress bar and time display
- [x] **Update VideoContext**
  - [x] Add currentClipIndex state in src/context/VideoContext.jsx \[EDIT\]
  - [x] Add setCurrentClip(index) function
  - [x] Export currentClip getter
- [x] **Integrate VideoPlayer into App**
  - [x] Import VideoPlayer in src/App.jsx \[EDIT\]
  - [x] Render VideoPlayer below ImportArea
  - [x] Conditional render based on whether clip exists
- [x] **Test video playback**
  - [x] Import a video and verify it displays in player
  - [x] Test play/pause functionality
  - [x] Test scrubbing/seeking
  - [x] Verify audio plays correctly
  - [x] Check time display accuracy

# PR #4: Timeline UI Component ✅ COMPLETE

**Estimated Time:** 4-5 hours **| Priority: MEDIUM**

Build the timeline interface showing imported clips as visual blocks with playhead indicator synced to video player.

## File Structure

clipforge/

├── src/

│ ├── App.jsx \[EDIT\]

│ ├── components/

│ │ ├── Timeline.jsx \[NEW\]

│ │ └── TimelineClip.jsx \[NEW\]

│ ├── context/

│ │ └── VideoContext.jsx \[EDIT\]

│ └── styles/

│ ├── Timeline.css \[NEW\]

│ └── TimelineClip.css \[NEW\]

## Tasks

- [x] **Create Timeline component**
  - [x] Create src/components/Timeline.jsx \[NEW\]
  - [x] Import useContext to access VideoContext
  - [x] Set up container div with horizontal layout
  - [x] Add time ruler showing time markers (0:00, 0:10, 0:20, etc.)
- [x] **Create TimelineClip component**
  - [x] Create src/components/TimelineClip.jsx \[NEW\]
  - [x] Accept clip prop with duration and filename
  - [x] Render clip as colored block
  - [x] Display clip filename and duration
  - [x] Calculate width based on duration (e.g., 1 second = 50px)
- [x] **Implement playhead indicator**
  - [x] Add playhead state to VideoContext in src/context/VideoContext.jsx \[EDIT\]
  - [x] Update playhead position from video currentTime
  - [x] Create playhead div in Timeline.jsx \[EDIT\]
  - [x] Position playhead absolutely based on currentTime
  - [x] Style as vertical line with distinct color
- [x] **Add timeline click-to-seek**
  - [x] Add onClick handler to timeline container
  - [x] Calculate click position relative to timeline width
  - [x] Convert position to timestamp
  - [x] Update video player currentTime via VideoContext
- [x] **Style Timeline components**
  - [x] Create src/styles/Timeline.css \[NEW\]
  - [x] Style timeline container with border and background
  - [x] Style time ruler with flexbox
  - [x] Style playhead with red vertical line
  - [x] Create src/styles/TimelineClip.css \[NEW\]
  - [x] Style clip blocks with background color and border
  - [x] Add hover effect
- [x] **Display multiple clips**
  - [x] Map over clips array from VideoContext
  - [x] Render TimelineClip for each clip
  - [x] Position clips sequentially
- [x] **Integrate Timeline into App**
  - [x] Import Timeline in src/App.jsx \[EDIT\]
  - [x] Render Timeline below VideoPlayer
  - [x] Adjust layout for proper positioning
- [x] **Test timeline functionality**
  - [x] Import video and verify clip appears in timeline
  - [x] Test playhead movement during video playback
  - [x] Test click-to-seek functionality
  - [x] Import multiple clips and verify they display correctly

# PR #5: Trim Functionality ✅ COMPLETE

**Estimated Time:** 3-4 hours **| Priority: HIGH**

Add in-point and out-point controls to trim clips. Update video player to respect trim boundaries during playback.

## File Structure

clipforge/

├── src/

│ ├── components/

│ │ ├── VideoPlayer.jsx \[EDIT\]

│ │ ├── Timeline.jsx \[EDIT\]

│ │ ├── TimelineClip.jsx \[EDIT\]

│ │ └── TrimControls.jsx \[NEW\]

│ ├── context/

│ │ └── VideoContext.jsx \[EDIT\]

│ └── styles/

│ └── TrimControls.css \[NEW\]

## Tasks

- [x] **Update clip data model**
  - [x] Add inPoint and outPoint fields to clip object in VideoContext \[EDIT\]
  - [x] Default inPoint to 0 and outPoint to duration
  - [x] Create updateClipTrim(clipId, inPoint, outPoint) function
- [x] **Create TrimControls component**
  - [x] Create src/components/TrimControls.jsx \[NEW\]
  - [x] Accept currentClip prop from VideoContext
  - [x] Add Set In Point button
  - [x] Add Set Out Point button
  - [x] Get current time from VideoContext
  - [x] Call updateClipTrim with current time on button click
  - [x] Display current in-point and out-point values
- [x] **Update VideoPlayer with trim boundaries**
  - [x] Modify src/components/VideoPlayer.jsx \[EDIT\]
  - [x] Check if currentTime exceeds outPoint during playback
  - [x] Pause video when outPoint is reached
  - [x] On play, start from inPoint if currentTime < inPoint
  - [x] Update progress bar to show trimmed range
- [x] **Add visual trim indicators to timeline**
  - [x] Modify src/components/TimelineClip.jsx \[EDIT\]
  - [x] Add trim handles (left and right edges)
  - [x] Display trimmed region with different color/opacity
  - [x] Show in-point and out-point markers
- [ ] **Optional: Add draggable trim handles**
  - [ ] Make trim handles draggable (if time permits)
  - [ ] Add onMouseDown, onMouseMove, onMouseUp handlers
  - [ ] Update inPoint/outPoint based on drag position
- [x] **Style TrimControls**
  - [x] Create src/styles/TrimControls.css \[NEW\]
  - [x] Style buttons with clear labels
  - [x] Display trim values prominently
- [x] **Add TrimControls to App**
  - [x] Import TrimControls in src/App.jsx \[EDIT\]
  - [x] Render TrimControls near VideoPlayer
- [x] **Test trim functionality**
  - [x] Import a video
  - [x] Play to 5 seconds and set in-point
  - [x] Play to 15 seconds and set out-point
  - [x] Verify playback starts at 5s and stops at 15s
  - [x] Check timeline shows visual trim indicators

# PR #6: Export Pipeline ✅ COMPLETE

**Estimated Time:** 4-6 hours **| Priority: CRITICAL**

Implement FFmpeg-based export pipeline that renders trimmed video to MP4 with progress tracking.

## File Structure

clipforge/

├── electron/

│ ├── ipcHandlers.js \[EDIT\]

│ └── videoProcessor.js \[EDIT\]

├── src/

│ ├── App.jsx \[EDIT\]

│ ├── components/

│ │ └── ExportModal.jsx \[NEW\]

│ └── styles/

│ └── ExportModal.css \[NEW\]

## Tasks

- [x] **Implement trim export in videoProcessor**
  - [x] Add exportVideo(inputPath, outputPath, inPoint, outPoint) function to electron/videoProcessor.js \[EDIT\]
  - [x] Use fluent-ffmpeg to create trim command
  - [x] Set input file with ffmpeg(inputPath)
  - [x] Add .setStartTime(inPoint) and .setDuration(outPoint - inPoint)
  - [x] Use codec copy for fast export: .outputOptions('-c copy')
  - [x] Track progress with .on('progress') event
  - [x] Return promise that resolves on completion
- [x] **Add export IPC handlers**
  - [x] Add handle:export-video handler in electron/ipcHandlers.js \[EDIT\]
  - [x] Accept clip data (inputPath, inPoint, outPoint)
  - [x] Show save dialog for output path selection
  - [x] Call exportVideo from videoProcessor
  - [x] Send progress updates via event.sender.send('export-progress')
  - [x] Send completion notification via event.sender.send('export-complete')
- [x] **Create ExportModal component**
  - [x] Create src/components/ExportModal.jsx \[NEW\]
  - [x] Accept currentClip from VideoContext
  - [x] Create modal dialog with overlay
  - [x] Add Export button that triggers IPC call
  - [x] Show progress bar (0-100%)
  - [x] Display status messages (Processing, Complete, Error)
  - [x] Add Close button
- [x] **Set up IPC listeners for export events**
  - [x] Add useEffect in ExportModal to listen for export-progress
  - [x] Update progress state when receiving progress events
  - [x] Add listener for export-complete event
  - [x] Show success message and enable Close button
  - [x] Handle errors with error state and message
- [x] **Style ExportModal**
  - [x] Create src/styles/ExportModal.css \[NEW\]
  - [x] Style modal overlay with semi-transparent background
  - [x] Style modal content box centered on screen
  - [x] Style progress bar with animated fill
  - [x] Style buttons (Export, Close)
- [x] **Add export trigger to App**
  - [x] Add Export button to main UI in src/App.jsx \[EDIT\]
  - [x] Use useState to control modal visibility
  - [x] Show ExportModal when button is clicked
- [x] **Test export pipeline**
  - [x] Import a video and set trim points
  - [x] Click Export button and choose save location
  - [x] Verify progress bar updates during export
  - [x] Check exported MP4 file plays correctly in VLC/QuickTime
  - [x] Verify exported duration matches trim range
  - [x] Test error handling (invalid path, permission issues)

# PR #7: Application Packaging

**Estimated Time:** 3-4 hours **| Priority: CRITICAL**

Package the application as a distributable using electron-builder. Create installers for macOS and/or Windows.

## File Structure

clipforge/

├── package.json \[EDIT\]

├── electron-builder.yml \[NEW\]

├── build/

│ └── icon.png \[NEW\]

└── README.md \[EDIT\]

## Tasks

- [ ] **Install electron-builder**
  - [ ] Run npm install electron-builder --save-dev
  - [ ] Update package.json with devDependencies \[EDIT\]
- [ ] **Configure electron-builder**
  - [ ] Create electron-builder.yml \[NEW\]
  - [ ] Set appId (e.g., com.clipforge.app)
  - [ ] Configure productName: ClipForge
  - [ ] Set files to include (dist/, electron/, package.json)
  - [ ] Configure directories (output: release/)
- [ ] **Configure platform-specific build**
  - [ ] Add mac configuration in electron-builder.yml \[EDIT\]
  - [ ] Set target to dmg and zip
  - [ ] Add win configuration for Windows
  - [ ] Set target to nsis (installer)
- [ ] **Bundle FFmpeg binary**
  - [ ] Add extraResources in electron-builder.yml \[EDIT\]
  - [ ] Include FFmpeg binary from @ffmpeg-installer/ffmpeg
  - [ ] Update videoProcessor.js to use bundled FFmpeg path \[EDIT\]
  - [ ] Use process.resourcesPath in production
- [ ] **Create application icon**
  - [ ] Create build/ directory \[NEW\]
  - [ ] Add icon.png (512x512 or larger) \[NEW\]
  - [ ] Reference icon in electron-builder.yml \[EDIT\]
- [ ] **Add build scripts**
  - [ ] Add build script in package.json: webpack --mode production \[EDIT\]
  - [ ] Add dist script: electron-builder
  - [ ] Add dist:mac script: electron-builder --mac
  - [ ] Add dist:win script: electron-builder --win
- [ ] **Update package.json metadata**
  - [ ] Set version to 1.0.0 in package.json \[EDIT\]
  - [ ] Add author name
  - [ ] Add license field
- [ ] **Build production bundle**
  - [ ] Run npm run build to create production webpack bundle
  - [ ] Verify dist/ directory contains compiled assets
- [ ] **Create distributable**
  - [ ] Run npm run dist (or dist:mac / dist:win)
  - [ ] Wait for electron-builder to complete
  - [ ] Check release/ directory for .dmg (Mac) or .exe (Windows)
- [ ] **Test packaged application**
  - [ ] Install/open the packaged app (not dev mode)
  - [ ] Test all features: import, preview, timeline, trim, export
  - [ ] Verify FFmpeg works in packaged app
  - [ ] Test on different machines if possible
- [ ] **Update README**
  - [ ] Add build instructions in README.md \[EDIT\]
  - [ ] Document how to run development version
  - [ ] Document how to build distributable
  - [ ] Add system requirements (Node.js version, OS)
- [ ] **Upload distributable**
  - [ ] Create GitHub Release (or use Google Drive/Dropbox)
  - [ ] Upload .dmg/.exe file with version tag

# MVP Submission Checklist

**Complete this checklist before submitting your MVP on Tuesday, October 28th at 10:59 PM CT:**

- [ ] **Desktop app launches successfully**
- [ ] **Video import works (drag-and-drop and file picker)**
- [ ] **Timeline displays imported clips**
- [ ] **Video player shows preview with play/pause**
- [ ] **Trim functionality sets in/out points**
- [ ] **Export produces valid MP4 file**
- [ ] **App is packaged as distributable (not just dev mode)**
- [ ] **README contains setup and build instructions**
- [ ] **All code committed to GitHub**
- [ ] **Distributable uploaded or build instructions verified**

**_Good luck with your build!_**

Remember: A working MVP beats feature-rich vaporware.