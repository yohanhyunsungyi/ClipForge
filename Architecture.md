# ClipForge Architecture Documentation

## Overview

This document provides a comprehensive view of the ClipForge MVP architecture, including component relationships, data flow, and technology stack.

---

## System Architecture Diagram

This diagram shows the complete system architecture, including:
- **Electron Main Process**: Backend logic, FFmpeg processing, file system operations
- **Electron Renderer Process**: React frontend, UI components, user interactions
- **IPC Communication**: Bridge between main and renderer processes
- **External Dependencies**: FFmpeg binary, file system, Electron APIs

### Architecture Components

```mermaid
graph TB
    subgraph "User Interactions"
        USER[👤 User]
    end

    subgraph "Electron Renderer Process (Frontend)"
        subgraph "React Application"
            APP[App.jsx<br/>Main Container]
            
            subgraph "Components"
                IMPORT[ImportArea.jsx<br/>Drag & Drop<br/>File Picker]
                PLAYER[VideoPlayer.jsx<br/>HTML5 Video<br/>Play/Pause/Seek]
                TIMELINE[Timeline.jsx<br/>Visual Timeline<br/>Playhead]
                CLIP[TimelineClip.jsx<br/>Clip Blocks]
                TRIM[TrimControls.jsx<br/>Set In/Out Points]
                EXPORT[ExportModal.jsx<br/>Export UI<br/>Progress Bar]
            end
            
            subgraph "State Management"
                CONTEXT[VideoContext.jsx<br/>React Context<br/>- clips array<br/>- currentClip<br/>- inPoint/outPoint<br/>- playhead position]
            end
        end
        
        subgraph "IPC Bridge"
            PRELOAD[Preload Script<br/>Context Bridge<br/>Exposed APIs]
        end
    end

    subgraph "Electron Main Process (Backend)"
        MAIN[main.js<br/>Window Management<br/>App Lifecycle]
        
        IPC_HANDLER[ipcHandlers.js<br/>IPC Event Handlers<br/>- import-video<br/>- get-video-metadata<br/>- export-video]
        
        VIDEO_PROC[videoProcessor.js<br/>FFmpeg Operations<br/>- getVideoMetadata<br/>- exportVideo]
    end

    subgraph "External Dependencies"
        FFMPEG[FFmpeg Binary<br/>@ffmpeg-installer/ffmpeg<br/>Video Processing Engine]
        FS[File System<br/>Node.js fs module<br/>Read/Write Files]
        ELECTRON_DIALOG[Electron Dialog<br/>File Picker<br/>Save Dialog]
    end

    subgraph "Output"
        VIDEO_FILE[💾 Exported MP4 File]
    end

    %% User to UI Components
    USER -->|Drag & Drop Video| IMPORT
    USER -->|Click Import| IMPORT
    USER -->|Play/Pause| PLAYER
    USER -->|Scrub Timeline| TIMELINE
    USER -->|Set Trim Points| TRIM
    USER -->|Click Export| EXPORT

    %% Component to App
    IMPORT --> APP
    PLAYER --> APP
    TIMELINE --> APP
    TRIM --> APP
    EXPORT --> APP

    %% Timeline Relationships
    TIMELINE --> CLIP
    
    %% Components to Context
    IMPORT -.->|addClip| CONTEXT
    PLAYER -.->|currentTime<br/>playback state| CONTEXT
    TIMELINE -.->|read clips<br/>playhead position| CONTEXT
    TRIM -.->|updateClipTrim| CONTEXT
    EXPORT -.->|read currentClip| CONTEXT
    CONTEXT -.->|provide state| PLAYER
    CONTEXT -.->|provide state| TIMELINE
    CONTEXT -.->|provide state| TRIM
    CONTEXT -.->|provide state| EXPORT

    %% Renderer to Main (IPC)
    IMPORT -->|IPC: get-video-metadata| PRELOAD
    IMPORT -->|IPC: import-video| PRELOAD
    EXPORT -->|IPC: export-video| PRELOAD
    PRELOAD -->|Forward| IPC_HANDLER

    %% Main Process Flow
    MAIN --> IPC_HANDLER
    IPC_HANDLER -->|Call| VIDEO_PROC
    IPC_HANDLER -->|Show Dialog| ELECTRON_DIALOG
    
    %% Video Processing
    VIDEO_PROC -->|Execute| FFMPEG
    VIDEO_PROC -->|Read/Write| FS
    FFMPEG -->|Metadata| VIDEO_PROC
    FFMPEG -->|Encoded Video| VIDEO_PROC
    
    %% Return Path (IPC)
    VIDEO_PROC -.->|Return Metadata| IPC_HANDLER
    VIDEO_PROC -.->|Progress Updates| IPC_HANDLER
    IPC_HANDLER -.->|Send Events| PRELOAD
    PRELOAD -.->|Update UI| IMPORT
    PRELOAD -.->|Update Progress| EXPORT
    
    %% File System
    FS -.->|Read Video| PLAYER
    VIDEO_PROC -->|Write File| VIDEO_FILE

    %% Styling
    classDef userClass fill:#3498db,stroke:#2980b9,stroke-width:3px,color:#fff
    classDef reactClass fill:#61dafb,stroke:#21a1c4,stroke-width:2px,color:#000
    classDef contextClass fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff
    classDef electronClass fill:#47848f,stroke:#2c5f6a,stroke-width:2px,color:#fff
    classDef processingClass fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff
    classDef externalClass fill:#95a5a6,stroke:#7f8c8d,stroke-width:2px,color:#fff
    classDef outputClass fill:#27ae60,stroke:#229954,stroke-width:3px,color:#fff

    class USER userClass
    class APP,IMPORT,PLAYER,TIMELINE,CLIP,TRIM,EXPORT reactClass
    class CONTEXT contextClass
    class MAIN,IPC_HANDLER,PRELOAD electronClass
    class VIDEO_PROC processingClass
    class FFMPEG,FS,ELECTRON_DIALOG externalClass
    class VIDEO_FILE outputClass
```

### Component Responsibilities

#### Renderer Process (Frontend)
- **App.jsx**: Main container, layout coordination
- **ImportArea.jsx**: File import via drag-and-drop or file picker
- **VideoPlayer.jsx**: HTML5 video playback with controls
- **Timeline.jsx**: Visual timeline with playhead
- **TimelineClip.jsx**: Individual clip blocks on timeline
- **TrimControls.jsx**: UI for setting in/out points
- **ExportModal.jsx**: Export interface with progress tracking
- **VideoContext.jsx**: Centralized state management for all components

#### Main Process (Backend)
- **main.js**: Electron app initialization, window management
- **ipcHandlers.js**: IPC event handling between main and renderer
- **videoProcessor.js**: FFmpeg wrapper for metadata extraction and export

#### External Dependencies
- **FFmpeg**: Video encoding, decoding, metadata extraction
- **File System**: Reading video files, writing exports
- **Electron Dialog**: Native file picker and save dialogs

---

## Data Flow & Workflows

This diagram illustrates the step-by-step data flow for the four core operations: Import, Playback, Trim, and Export.

### Workflow Diagram

```mermaid
graph TB
    subgraph "Workflow 1: Video Import"
        A1[User drops video file<br/>or clicks Import button]
        A2[ImportArea component<br/>handles event]
        A3[Send file path via IPC<br/>window.electron.getVideoMetadata]
        A4[ipcHandlers receives request<br/>calls videoProcessor.getVideoMetadata]
        A5[FFmpeg extracts metadata<br/>duration, resolution, codec]
        A6[Return metadata to renderer<br/>via IPC response]
        A7[ImportArea adds clip<br/>to VideoContext]
        A8[VideoContext updates<br/>clips array state]
        A9[All components re-render<br/>with new clip data]
        
        A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7 --> A8 --> A9
    end

    subgraph "Workflow 2: Video Playback"
        B1[User clicks Play button<br/>in VideoPlayer]
        B2[VideoPlayer updates<br/>playback state]
        B3[Call videoRef.current.play<br/>on HTML5 video element]
        B4[Video plays<br/>onTimeUpdate fires]
        B5[Update currentTime<br/>in VideoContext]
        B6[Timeline reads currentTime<br/>updates playhead position]
        B7[Playhead moves across<br/>timeline in sync]
        
        B1 --> B2 --> B3 --> B4 --> B5 --> B6 --> B7
    end

    subgraph "Workflow 3: Trim Operations"
        C1[User scrubs to 5 seconds<br/>clicks Set In Point]
        C2[TrimControls reads<br/>currentTime from VideoContext]
        C3[Call updateClipTrim<br/>with inPoint = 5]
        C4[VideoContext updates<br/>currentClip.inPoint]
        C5[VideoPlayer re-renders<br/>respects new boundaries]
        C6[Timeline shows<br/>visual trim indicators]
        C7[User scrubs to 15 seconds<br/>clicks Set Out Point]
        C8[Repeat process for<br/>outPoint = 15]
        
        C1 --> C2 --> C3 --> C4 --> C5
        C4 --> C6
        C5 --> C7 --> C8
    end

    subgraph "Workflow 4: Video Export"
        D1[User clicks Export button<br/>in ExportModal]
        D2[Show save dialog<br/>via Electron dialog API]
        D3[User selects output path<br/>and filename]
        D4[Send export request via IPC<br/>with clip data and trim points]
        D5[ipcHandlers calls<br/>videoProcessor.exportVideo]
        D6[FFmpeg starts encoding<br/>with trim parameters]
        D7[Progress events sent<br/>back to renderer]
        D8[ExportModal updates<br/>progress bar 0-100%]
        D9[FFmpeg completes<br/>writes MP4 file]
        D10[Send export-complete<br/>event to renderer]
        D11[ExportModal shows<br/>success message]
        
        D1 --> D2 --> D3 --> D4 --> D5 --> D6
        D6 --> D7 --> D8
        D6 --> D9 --> D10 --> D11
    end

    subgraph "Technology Stack"
        STACK1[Electron 28+<br/>Desktop Framework]
        STACK2[React 18+<br/>UI Library]
        STACK3[FFmpeg via fluent-ffmpeg<br/>Video Processing]
        STACK4[HTML5 Video Element<br/>Playback Engine]
        STACK5[React Context API<br/>State Management]
        STACK6[IPC Main/Renderer<br/>Process Communication]
    end

    %% Connections between workflows and tech stack
    A3 -.-> STACK6
    A4 -.-> STACK3
    B3 -.-> STACK4
    B5 -.-> STACK5
    D4 -.-> STACK6
    D6 -.-> STACK3

    %% Styling
    classDef workflowClass fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    classDef techClass fill:#e67e22,stroke:#d35400,stroke-width:2px,color:#fff
    
    class A1,A2,A3,A4,A5,A6,A7,A8,A9 workflowClass
    class B1,B2,B3,B4,B5,B6,B7 workflowClass
    class C1,C2,C3,C4,C5,C6,C7,C8 workflowClass
    class D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11 workflowClass
    class STACK1,STACK2,STACK3,STACK4,STACK5,STACK6 techClass
```

### Workflow Details

#### 1. Video Import (A1-A9)
User imports a video file, which triggers metadata extraction via FFmpeg in the main process. The metadata is returned to the renderer and stored in VideoContext, causing all components to re-render with the new clip data.

#### 2. Video Playback (B1-B7)
User initiates playback, which controls the HTML5 video element. Time updates are captured and stored in VideoContext, allowing the timeline to synchronize its playhead position with the video.

#### 3. Trim Operations (C1-C8)
User sets trim points by scrubbing to specific times and clicking Set In/Out Point buttons. These values are stored in VideoContext, and the VideoPlayer respects these boundaries during playback.

#### 4. Video Export (D1-D11)
User triggers export, which sends the clip data and trim points to the main process. FFmpeg encodes the video with the specified trim parameters, sending progress updates back to the renderer for display.

---

## Technology Stack

### Core Technologies
- **Electron 28+**: Cross-platform desktop framework providing Node.js APIs and Chromium rendering
- **React 18+**: Component-based UI library with hooks for state management
- **FFmpeg**: Industry-standard video processing engine for encoding, decoding, and metadata extraction
- **fluent-ffmpeg**: Node.js wrapper for FFmpeg with promise-based API

### Supporting Libraries
- **webpack**: Module bundler for development and production builds
- **Babel**: JavaScript transpiler for JSX support
- **electron-builder**: Packaging tool for creating distributable executables

### Communication Patterns
- **IPC (Inter-Process Communication)**: Electron's mechanism for main/renderer process communication
- **React Context API**: Centralized state management without external dependencies
- **HTML5 Video Element**: Native browser API for video playback

---

## File Structure

```
clipforge/
├── electron/
│   ├── main.js              # Electron entry point, window management
│   ├── ipcHandlers.js       # IPC event handlers
│   └── videoProcessor.js    # FFmpeg wrapper functions
├── src/
│   ├── App.jsx              # Main React container
│   ├── index.jsx            # React entry point
│   ├── index.html           # HTML template
│   ├── components/
│   │   ├── ImportArea.jsx   # File import component
│   │   ├── VideoPlayer.jsx  # Video playback component
│   │   ├── Timeline.jsx     # Timeline visualization
│   │   ├── TimelineClip.jsx # Individual clip blocks
│   │   ├── TrimControls.jsx # Trim point controls
│   │   └── ExportModal.jsx  # Export interface
│   ├── context/
│   │   └── VideoContext.jsx # Global state management
│   └── styles/
│       ├── App.css
│       ├── ImportArea.css
│       ├── VideoPlayer.css
│       ├── Timeline.css
│       ├── TimelineClip.css
│       ├── TrimControls.css
│       └── ExportModal.css
├── build/
│   └── icon.png             # Application icon
├── package.json             # Dependencies and scripts
├── webpack.config.js        # Build configuration
├── electron-builder.yml     # Packaging configuration
└── README.md                # Setup instructions
```

---

## Key Design Decisions

### 1. Electron Architecture
**Decision**: Separate main and renderer processes with IPC communication  
**Rationale**: 
- Security: Isolates Node.js APIs from web content
- Performance: CPU-intensive FFmpeg operations run in main process
- Native access: File system and FFmpeg require Node.js

### 2. State Management
**Decision**: React Context API instead of Redux/MobX  
**Rationale**:
- Simplicity: Fewer dependencies and less boilerplate
- Performance: Sufficient for MVP scope (single video at a time)
- Development speed: Faster implementation within 72-hour deadline

### 3. Video Processing
**Decision**: FFmpeg via fluent-ffmpeg  
**Rationale**:
- Industry standard: Reliable, well-tested video processing
- Codec support: Handles MP4, MOV, WebM out of the box
- Performance: Fast encoding with `-c copy` for trim operations

### 4. Timeline Implementation
**Decision**: DOM-based with CSS positioning  
**Rationale**:
- Time constraint: Faster than Canvas-based implementation
- MVP sufficient: Handles single clip editing effectively
- Accessibility: Better keyboard and screen reader support

---

## Development Phases

### Phase 1: Foundation (PR #1)
- Project setup with Electron + React
- Webpack configuration
- Basic window and app structure

### Phase 2: Import (PR #2)
- File drag-and-drop
- FFmpeg metadata extraction
- VideoContext implementation

### Phase 3: Playback (PR #3)
- HTML5 video player
- Playback controls
- Time tracking

### Phase 4: Timeline (PR #4)
- Visual timeline UI
- Playhead synchronization
- Click-to-seek

### Phase 5: Trim (PR #5)
- In/out point controls
- Visual trim indicators
- Playback boundaries

### Phase 6: Export (PR #6)
- FFmpeg export pipeline
- Progress tracking
- File save dialog

### Phase 7: Package (PR #7)
- electron-builder configuration
- Distributable creation
- Cross-platform testing

---

## Testing Strategy

### Manual Testing
1. **Import**: Drag-and-drop and file picker with various video formats
2. **Playback**: Play/pause, seek, audio sync verification
3. **Timeline**: Playhead movement, click-to-seek accuracy
4. **Trim**: Set in/out points, verify playback respects boundaries
5. **Export**: Create trimmed video, verify output plays correctly

### Performance Metrics
- App launch: < 5 seconds
- Timeline responsiveness: 60fps with 10+ clips
- Video preview: 30fps minimum
- Export: No crashes, progress updates smooth

---

## Future Enhancements (Post-MVP)

1. **Screen Recording**: Native OS APIs for screen capture
2. **Multiple Tracks**: Support for overlay and picture-in-picture
3. **Effects & Transitions**: Text overlays, fade transitions
4. **Keyboard Shortcuts**: Spacebar for play/pause, arrow keys for frame-by-frame
5. **Auto-save**: Project state persistence
6. **Undo/Redo**: Action history management
7. **Cloud Upload**: Direct upload to YouTube, Google Drive

---

## Conclusion

This architecture provides a solid foundation for the ClipForge MVP while remaining flexible enough to accommodate future enhancements. The separation of concerns between Electron's main and renderer processes, combined with React's component model and Context API, creates a maintainable and scalable codebase suitable for rapid development within the 72-hour constraint.