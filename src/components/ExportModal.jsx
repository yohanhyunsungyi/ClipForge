import React, { useState, useEffect } from 'react';
import { useVideo } from '../context/VideoContext';
import '../styles/ExportModal.css';

function ExportModal({ isOpen, onClose }) {
  const { currentClip } = useVideo();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, processing, complete, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !window.electron) {
      return;
    }

    // Set up IPC listeners for export events
    window.electron.onExportProgress((data) => {
      setProgress(data.percent);
    });

    window.electron.onExportComplete((data) => {
      setStatus('complete');
      setProgress(100);
    });

    window.electron.onExportError((data) => {
      setStatus('error');
      setErrorMessage(data.error);
    });

    // Cleanup listeners on unmount or when modal closes
    return () => {
      window.electron.removeExportListeners();
    };
  }, [isOpen]);

  const handleExport = async () => {
    if (!window.electron) {
      setStatus('error');
      setErrorMessage('Export is only available in Electron app');
      return;
    }

    if (!currentClip) {
      setStatus('error');
      setErrorMessage('No clip selected');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    try {
      const result = await window.electron.exportVideo({
        inputPath: currentClip.filePath,
        inPoint: currentClip.inPoint,
        outPoint: currentClip.outPoint
      });

      if (!result.success) {
        setStatus('error');
        setErrorMessage(result.error);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="export-modal-overlay" onClick={handleClose}>
      <div className="export-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Export Video</h2>

        {currentClip && (
          <div className="export-info">
            <p><strong>File:</strong> {currentClip.filename}</p>
            <p><strong>Duration:</strong> {(currentClip.outPoint - currentClip.inPoint).toFixed(2)}s</p>
            <p><strong>From:</strong> {currentClip.inPoint.toFixed(2)}s <strong>To:</strong> {currentClip.outPoint.toFixed(2)}s</p>
          </div>
        )}

        {status === 'idle' && (
          <div className="export-actions">
            <button className="export-button" onClick={handleExport}>
              Export Video
            </button>
            <button className="close-button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className="export-progress">
            <p>Processing...</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="progress-text">{Math.round(progress)}%</p>
          </div>
        )}

        {status === 'complete' && (
          <div className="export-complete">
            <p className="success-message">Export completed successfully!</p>
            <button className="close-button" onClick={handleClose}>
              Close
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="export-error">
            <p className="error-message">Error: {errorMessage}</p>
            <button className="close-button" onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExportModal;
