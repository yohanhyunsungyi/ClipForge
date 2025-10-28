import React from 'react';
import '../styles/TimelineClip.css';

function TimelineClip({ clip, pixelsPerSecond, onClick }) {
  const widthInPixels = clip.duration * pixelsPerSecond;

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
    </div>
  );
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default TimelineClip;
