import React from 'react';
import { useVideo } from '../context/VideoContext';
import '../styles/TrimControls.css';

function TrimControls() {
  const { currentClip, playhead, updateClipTrim } = useVideo();

  const handleSetInPoint = () => {
    if (!currentClip) return;

    // Set in-point to current playhead position
    const newInPoint = playhead;

    // Ensure in-point doesn't exceed out-point
    const newOutPoint = Math.max(currentClip.outPoint, newInPoint);

    updateClipTrim(currentClip.id, newInPoint, newOutPoint);
  };

  const handleSetOutPoint = () => {
    if (!currentClip) return;

    // Set out-point to current playhead position
    const newOutPoint = playhead;

    // Ensure out-point doesn't go below in-point
    const newInPoint = Math.min(currentClip.inPoint, newOutPoint);

    updateClipTrim(currentClip.id, newInPoint, newOutPoint);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  if (!currentClip) {
    return (
      <div className="trim-controls-container">
        <div className="trim-controls-placeholder">
          <p>Load a video to set trim points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trim-controls-container">
      <div className="trim-controls-header">
        <h3>Trim Controls</h3>
      </div>

      <div className="trim-controls-content">
        <div className="trim-section">
          <div className="trim-info">
            <label>In Point:</label>
            <span className="trim-value">{formatTime(currentClip.inPoint)}</span>
          </div>
          <button
            className="trim-button set-in-button"
            onClick={handleSetInPoint}
            title="Set in-point at current playhead position"
          >
            Set In Point
          </button>
        </div>

        <div className="trim-section">
          <div className="trim-info">
            <label>Out Point:</label>
            <span className="trim-value">{formatTime(currentClip.outPoint)}</span>
          </div>
          <button
            className="trim-button set-out-button"
            onClick={handleSetOutPoint}
            title="Set out-point at current playhead position"
          >
            Set Out Point
          </button>
        </div>

        <div className="trim-duration">
          <label>Trimmed Duration:</label>
          <span className="duration-value">
            {formatTime(currentClip.outPoint - currentClip.inPoint)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TrimControls;
