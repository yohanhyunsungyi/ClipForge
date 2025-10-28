import React from 'react';
import { VideoProvider } from './context/VideoContext';
import ImportArea from './components/ImportArea';
import VideoPlayer from './components/VideoPlayer';
import './styles/App.css';

function App() {
  return (
    <VideoProvider>
      <div className="app-container">
        <h1>ClipForge</h1>
        <p>Desktop Video Editor</p>
        <ImportArea />
        <VideoPlayer />
      </div>
    </VideoProvider>
  );
}

export default App;
