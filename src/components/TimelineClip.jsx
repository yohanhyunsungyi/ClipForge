import React from 'react';
import '../styles/TimelineClip.css';

function TimelineClip({ clip, pixelsPerSecond, onClick }) {
  const widthInPixels = clip.duration * pixelsPerSecond;

  // Calculate trim indicator positions
  const inPointPosition = clip.inPoint * pixelsPerSecond;
  const outPointPosition = clip.outPoint * pixelsPerSecond;
  const trimmedWidth = (clip.outPoint - clip.inPoint) * pixelsPerSecond;

  return (
    <div
      className="timeline-clip"
      style={{ width: `${widthInPixels}px` }}
      onClick={onClick}
    >
      <div className="timeline-clip-content">
        <div className="timeline-clip-name">{clip.fileName}</div>
        <div className="timeline-clip-duration">
          {formatDuration(clip.duration)}
        </div>
      </div>

      {/* Visual trim indicators */}
      {clip.inPoint > 0 && (
        <div
          className="trim-overlay trim-overlay-left"
          style={{ width: `${inPointPosition}px` }}
        />
      )}
      {clip.outPoint < clip.duration && (
        <div
          className="trim-overlay trim-overlay-right"
          style={{
            left: `${outPointPosition}px`,
            width: `${(clip.duration - clip.outPoint) * pixelsPerSecond}px`
          }}
        />
      )}

      {/* Trim handles */}
      <div
        className="trim-handle trim-handle-in"
        style={{ left: `${inPointPosition}px` }}
      />
      <div
        className="trim-handle trim-handle-out"
        style={{ left: `${outPointPosition}px` }}
      />
    </div>
  );
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default TimelineClip;
