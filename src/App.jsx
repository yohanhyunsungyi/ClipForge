import React, { useState } from 'react';
import { VideoProvider } from './context/VideoContext';
import ImportArea from './components/ImportArea';
import VideoPlayer from './components/VideoPlayer';
import TrimControls from './components/TrimControls';
import Timeline from './components/Timeline';
import ExportModal from './components/ExportModal';
import './styles/App.css';

function App() {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <VideoProvider>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1>ClipForge</h1>
            <p>Desktop Video Editor</p>
          </div>
          <ImportArea />
        </header>

        <main className="app-main">
          <div className="video-section">
            <VideoPlayer />
          </div>

          <div className="controls-section">
            <div className="controls-left">
              <TrimControls />
            </div>
            <div className="controls-right">
              <button
                className="export-trigger-button"
                onClick={() => setShowExportModal(true)}
              >
                Export Video
              </button>
            </div>
          </div>

          <div className="timeline-section">
            <Timeline />
          </div>
        </main>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      </div>
    </VideoProvider>
  );
}

export default App;
