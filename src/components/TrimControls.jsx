import React from 'react';
import { useVideo } from '../context/VideoContext';
import '../styles/TrimControls.css';

function TrimControls() {
  const { currentClip, removeClip } = useVideo();

  const handleDeleteClip = () => {
    if (currentClip && window.confirm('Are you sure you want to remove this video?')) {
      removeClip(currentClip.id);
    }
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
          <p className="trim-hint">💡 Drag the green/red handles on the timeline to trim</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trim-controls-container">
      <div className="trim-controls-header">
        <div className="trim-controls-title">
          <h3>Trim Controls</h3>
          <span className="trim-help">Drag handles on timeline to trim</span>
        </div>
        <button
          className="delete-clip-button"
          onClick={handleDeleteClip}
          title="Remove this video"
        >
          🗑️ Remove Video
        </button>
      </div>

      <div className="trim-controls-content">
        <div className="trim-info">
          <label>◀ In Point:</label>
          <span className="trim-value">{formatTime(currentClip.inPoint)}</span>
        </div>

        <div className="trim-info">
          <label>▶ Out Point:</label>
          <span className="trim-value">{formatTime(currentClip.outPoint)}</span>
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
