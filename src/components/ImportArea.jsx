import React, { useState } from 'react';
import { useVideo } from '../context/VideoContext';
import '../styles/ImportArea.css';

function ImportArea() {
  const { addClip } = useVideo();
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const filePath = files[0].path;
      await importVideo(filePath);
    }
  };

  const handleFilePickerClick = async () => {
    if (!window.electron) {
      setError('File import is only available in Electron app');
      return;
    }
    const filePath = await window.electron.importVideo();
    if (filePath) {
      await importVideo(filePath);
    }
  };

  const importVideo = async (filePath) => {
    if (!window.electron) {
      setError('Video import is only available in Electron app');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const result = await window.electron.getVideoMetadata(filePath);

      if (result.success) {
        addClip(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to import video');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="import-area-container">
      <div
        className={`import-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isImporting ? (
          <div className="import-status">
            <p>Importing video...</p>
          </div>
        ) : (
          <>
            <div className="import-icon">📹</div>
            <p className="import-text">Drag and drop video files here</p>
            <p className="import-subtext">or</p>
            <button
              className="import-button"
              onClick={handleFilePickerClick}
            >
              Choose File
            </button>
            <p className="import-formats">Supported: MP4, MOV, AVI, MKV</p>
          </>
        )}
      </div>
      {error && (
        <div className="import-error">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default ImportArea;
