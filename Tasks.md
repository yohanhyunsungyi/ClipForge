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

# PR #1: Project Setup & Configuration

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

- **Initialize Node.js project**
- Run npm init and create package.json \[NEW\]
- Configure project name, version, and description
- **Install core dependencies**
- Install electron@^28.0.0
- Install react@^18.2.0 and react-dom@^18.2.0
- Install webpack@^5.0.0, webpack-cli, webpack-dev-server
- Install babel-loader, @babel/preset-react for JSX transpilation
- Update package.json with dependencies \[EDIT\]
- **Configure webpack**
- Create webpack.config.js \[NEW\]
- Set entry point to src/index.jsx
- Configure babel-loader for JSX files
- Set up HTML webpack plugin for index.html
- Configure dev server for hot reload
- **Create Electron main process**
- Create electron/main.js \[NEW\]
- Import app, BrowserWindow from electron
- Create createWindow() function
- Set window dimensions (1200x800)
- Configure webPreferences with nodeIntegration and contextIsolation
- Load index.html in development mode
- Add app.whenReady() event listener
- **Create React entry point**
- Create src/index.jsx \[NEW\]
- Import React, ReactDOM, and App component
- Render App component to root div
- **Create basic App component**
- Create src/App.jsx \[NEW\]
- Set up functional component with placeholder content
- Add basic CSS import
- **Create HTML template**
- Create src/index.html \[NEW\]
- Add root div for React mounting
- Set page title to ClipForge
- **Add npm scripts**
- Add start script for webpack dev server in package.json \[EDIT\]
- Add electron script to launch app in package.json \[EDIT\]
- Add dev script to run both concurrently
- **Create .gitignore**
- Create .gitignore \[NEW\]
- Add node_modules/, dist/, build/
- **Create README**
- Create README.md \[NEW\]
- Add project description and setup instructions
- **Test application launch**
- Run npm run dev and verify Electron window opens
- Verify React app renders in Electron window

# PR #2: File Import & Metadata Extraction

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

- **Install FFmpeg dependencies**
- Install fluent-ffmpeg@^2.1.2
- Install @ffmpeg-installer/ffmpeg@^1.1.0
- Update package.json \[EDIT\]
- **Create video processor module**
- Create electron/videoProcessor.js \[NEW\]
- Import fluent-ffmpeg and set FFmpeg path
- Create getVideoMetadata(filePath) function
- Extract duration, resolution, codec info using ffprobe
- Return metadata object with filename, duration, width, height
- **Set up IPC handlers**
- Create electron/ipcHandlers.js \[NEW\]
- Import ipcMain and dialog from electron
- Create handle:import-video handler for file picker
- Create handle:get-video-metadata handler
- Add file type filters (MP4, MOV) in dialog options
- **Update main process**
- Import and register IPC handlers in electron/main.js \[EDIT\]
- Enable contextBridge in webPreferences
- **Create video context**
- Create src/context/VideoContext.jsx \[NEW\]
- Set up React Context with createContext
- Create VideoProvider component with useState for clips array
- Add addClip(clip) and removeClip(id) functions
- Export VideoContext and VideoProvider
- **Create ImportArea component**
- Create src/components/ImportArea.jsx \[NEW\]
- Set up drag-and-drop event handlers (onDragOver, onDrop)
- Prevent default drag behavior
- Extract file path from drop event
- Call window.electron.getVideoMetadata via IPC
- Add file picker button with onClick handler
- Call window.electron.importVideo via IPC
- Update VideoContext with imported clip
- Display visual feedback during import
- **Style ImportArea**
- Create src/styles/ImportArea.css \[NEW\]
- Style drag-and-drop zone with dashed border
- Add hover state styling
- Style import button
- **Update App component**
- Wrap App with VideoProvider in src/App.jsx \[EDIT\]
- Import and render ImportArea component
- Add basic layout structure
- **Test import functionality**
- Test drag-and-drop with MP4 file
- Test file picker dialog
- Verify metadata extraction (duration, resolution)
- Check error handling for invalid files

# PR #3: Video Preview Player

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

- **Create VideoPlayer component**
- Create src/components/VideoPlayer.jsx \[NEW\]
- Import useContext to access VideoContext
- Set up useRef for video element
- Render HTML5 video element
- Set video src to current clip file path
- **Implement playback controls**
- Add play/pause button with useState for playback state
- Create handlePlayPause() function
- Call videoRef.current.play() or pause()
- Update button icon based on playback state
- **Add time display**
- Set up useState for currentTime
- Add onTimeUpdate event listener to video element
- Update currentTime state in event handler
- Display formatted time (MM:SS)
- Show duration from VideoContext
- **Add seek/scrubbing functionality**
- Create progress bar with input range slider
- Set min=0, max=duration, value=currentTime
- Add onChange handler to update video currentTime
- Update visual progress bar position
- **Style VideoPlayer component**
- Create src/styles/VideoPlayer.css \[NEW\]
- Style video element with max-width and aspect-ratio
- Style control bar with flexbox layout
- Style play/pause button
- Style progress bar and time display
- **Update VideoContext**
- Add currentClipIndex state in src/context/VideoContext.jsx \[EDIT\]
- Add setCurrentClip(index) function
- Export currentClip getter
- **Integrate VideoPlayer into App**
- Import VideoPlayer in src/App.jsx \[EDIT\]
- Render VideoPlayer below ImportArea
- Conditional render based on whether clip exists
- **Test video playback**
- Import a video and verify it displays in player
- Test play/pause functionality
- Test scrubbing/seeking
- Verify audio plays correctly
- Check time display accuracy

# PR #4: Timeline UI Component

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

- **Create Timeline component**
- Create src/components/Timeline.jsx \[NEW\]
- Import useContext to access VideoContext
- Set up container div with horizontal layout
- Add time ruler showing time markers (0:00, 0:10, 0:20, etc.)
- **Create TimelineClip component**
- Create src/components/TimelineClip.jsx \[NEW\]
- Accept clip prop with duration and filename
- Render clip as colored block
- Display clip filename and duration
- Calculate width based on duration (e.g., 1 second = 50px)
- **Implement playhead indicator**
- Add playhead state to VideoContext in src/context/VideoContext.jsx \[EDIT\]
- Update playhead position from video currentTime
- Create playhead div in Timeline.jsx \[EDIT\]
- Position playhead absolutely based on currentTime
- Style as vertical line with distinct color
- **Add timeline click-to-seek**
- Add onClick handler to timeline container
- Calculate click position relative to timeline width
- Convert position to timestamp
- Update video player currentTime via VideoContext
- **Style Timeline components**
- Create src/styles/Timeline.css \[NEW\]
- Style timeline container with border and background
- Style time ruler with flexbox
- Style playhead with red vertical line
- Create src/styles/TimelineClip.css \[NEW\]
- Style clip blocks with background color and border
- Add hover effect
- **Display multiple clips**
- Map over clips array from VideoContext
- Render TimelineClip for each clip
- Position clips sequentially
- **Integrate Timeline into App**
- Import Timeline in src/App.jsx \[EDIT\]
- Render Timeline below VideoPlayer
- Adjust layout for proper positioning
- **Test timeline functionality**
- Import video and verify clip appears in timeline
- Test playhead movement during video playback
- Test click-to-seek functionality
- Import multiple clips and verify they display correctly

# PR #5: Trim Functionality

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

- **Update clip data model**
- Add inPoint and outPoint fields to clip object in VideoContext \[EDIT\]
- Default inPoint to 0 and outPoint to duration
- Create updateClipTrim(clipId, inPoint, outPoint) function
- **Create TrimControls component**
- Create src/components/TrimControls.jsx \[NEW\]
- Accept currentClip prop from VideoContext
- Add Set In Point button
- Add Set Out Point button
- Get current time from VideoContext
- Call updateClipTrim with current time on button click
- Display current in-point and out-point values
- **Update VideoPlayer with trim boundaries**
- Modify src/components/VideoPlayer.jsx \[EDIT\]
- Check if currentTime exceeds outPoint during playback
- Pause video when outPoint is reached
- On play, start from inPoint if currentTime < inPoint
- Update progress bar to show trimmed range
- **Add visual trim indicators to timeline**
- Modify src/components/TimelineClip.jsx \[EDIT\]
- Add trim handles (left and right edges)
- Display trimmed region with different color/opacity
- Show in-point and out-point markers
- **Optional: Add draggable trim handles**
- Make trim handles draggable (if time permits)
- Add onMouseDown, onMouseMove, onMouseUp handlers
- Update inPoint/outPoint based on drag position
- **Style TrimControls**
- Create src/styles/TrimControls.css \[NEW\]
- Style buttons with clear labels
- Display trim values prominently
- **Add TrimControls to App**
- Import TrimControls in src/App.jsx \[EDIT\]
- Render TrimControls near VideoPlayer
- **Test trim functionality**
- Import a video
- Play to 5 seconds and set in-point
- Play to 15 seconds and set out-point
- Verify playback starts at 5s and stops at 15s
- Check timeline shows visual trim indicators

# PR #6: Export Pipeline

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

- **Implement trim export in videoProcessor**
- Add exportVideo(inputPath, outputPath, inPoint, outPoint) function to electron/videoProcessor.js \[EDIT\]
- Use fluent-ffmpeg to create trim command
- Set input file with ffmpeg(inputPath)
- Add .setStartTime(inPoint) and .setDuration(outPoint - inPoint)
- Use codec copy for fast export: .outputOptions('-c copy')
- Track progress with .on('progress') event
- Return promise that resolves on completion
- **Add export IPC handlers**
- Add handle:export-video handler in electron/ipcHandlers.js \[EDIT\]
- Accept clip data (inputPath, inPoint, outPoint)
- Show save dialog for output path selection
- Call exportVideo from videoProcessor
- Send progress updates via event.sender.send('export-progress')
- Send completion notification via event.sender.send('export-complete')
- **Create ExportModal component**
- Create src/components/ExportModal.jsx \[NEW\]
- Accept currentClip from VideoContext
- Create modal dialog with overlay
- Add Export button that triggers IPC call
- Show progress bar (0-100%)
- Display status messages (Processing, Complete, Error)
- Add Close button
- **Set up IPC listeners for export events**
- Add useEffect in ExportModal to listen for export-progress
- Update progress state when receiving progress events
- Add listener for export-complete event
- Show success message and enable Close button
- Handle errors with error state and message
- **Style ExportModal**
- Create src/styles/ExportModal.css \[NEW\]
- Style modal overlay with semi-transparent background
- Style modal content box centered on screen
- Style progress bar with animated fill
- Style buttons (Export, Close)
- **Add export trigger to App**
- Add Export button to main UI in src/App.jsx \[EDIT\]
- Use useState to control modal visibility
- Show ExportModal when button is clicked
- **Test export pipeline**
- Import a video and set trim points
- Click Export button and choose save location
- Verify progress bar updates during export
- Check exported MP4 file plays correctly in VLC/QuickTime
- Verify exported duration matches trim range
- Test error handling (invalid path, permission issues)

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

- **Install electron-builder**
- Run npm install electron-builder --save-dev
- Update package.json with devDependencies \[EDIT\]
- **Configure electron-builder**
- Create electron-builder.yml \[NEW\]
- Set appId (e.g., com.clipforge.app)
- Configure productName: ClipForge
- Set files to include (dist/, electron/, package.json)
- Configure directories (output: release/)
- **Configure platform-specific build**
- Add mac configuration in electron-builder.yml \[EDIT\]
- Set target to dmg and zip
- Add win configuration for Windows
- Set target to nsis (installer)
- **Bundle FFmpeg binary**
- Add extraResources in electron-builder.yml \[EDIT\]
- Include FFmpeg binary from @ffmpeg-installer/ffmpeg
- Update videoProcessor.js to use bundled FFmpeg path \[EDIT\]
- Use process.resourcesPath in production
- **Create application icon**
- Create build/ directory \[NEW\]
- Add icon.png (512x512 or larger) \[NEW\]
- Reference icon in electron-builder.yml \[EDIT\]
- **Add build scripts**
- Add build script in package.json: webpack --mode production \[EDIT\]
- Add dist script: electron-builder
- Add dist:mac script: electron-builder --mac
- Add dist:win script: electron-builder --win
- **Update package.json metadata**
- Set version to 1.0.0 in package.json \[EDIT\]
- Add author name
- Add license field
- **Build production bundle**
- Run npm run build to create production webpack bundle
- Verify dist/ directory contains compiled assets
- **Create distributable**
- Run npm run dist (or dist:mac / dist:win)
- Wait for electron-builder to complete
- Check release/ directory for .dmg (Mac) or .exe (Windows)
- **Test packaged application**
- Install/open the packaged app (not dev mode)
- Test all features: import, preview, timeline, trim, export
- Verify FFmpeg works in packaged app
- Test on different machines if possible
- **Update README**
- Add build instructions in README.md \[EDIT\]
- Document how to run development version
- Document how to build distributable
- Add system requirements (Node.js version, OS)
- **Upload distributable**
- Create GitHub Release (or use Google Drive/Dropbox)
- Upload .dmg/.exe file with version tag

# MVP Submission Checklist

**Complete this checklist before submitting your MVP on Tuesday, October 28th at 10:59 PM CT:**

- **Desktop app launches successfully**
- **Video import works (drag-and-drop and file picker)**
- **Timeline displays imported clips**
- **Video player shows preview with play/pause**
- **Trim functionality sets in/out points**
- **Export produces valid MP4 file**
- **App is packaged as distributable (not just dev mode)**
- **README contains setup and build instructions**
- **All code committed to GitHub**
- **Distributable uploaded or build instructions verified**

**_Good luck with your build!_**

Remember: A working MVP beats feature-rich vaporware.