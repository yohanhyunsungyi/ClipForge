import React from 'react';
import { VideoProvider } from './context/VideoContext';
import ImportArea from './components/ImportArea';
import VideoPlayer from './components/VideoPlayer';
import Timeline from './components/Timeline';
import './styles/App.css';

function App() {
  return (
    <VideoProvider>
      <div className="app-container">
        <h1>ClipForge</h1>
        <p>Desktop Video Editor</p>
        <ImportArea />
        <VideoPlayer />
        <Timeline />
      </div>
    </VideoProvider>
  );
}

export default App;
