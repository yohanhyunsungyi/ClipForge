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
        <h1>ClipForge</h1>
        <p>Desktop Video Editor</p>
        <ImportArea />
        <VideoPlayer />
        <TrimControls />
        <Timeline />
        <div className="export-section">
          <button
            className="export-trigger-button"
            onClick={() => setShowExportModal(true)}
          >
            Export Video
          </button>
        </div>
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      </div>
    </VideoProvider>
  );
}

export default App;
