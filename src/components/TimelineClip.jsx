import React, { useState, useRef } from 'react';
import { useVideo } from '../context/VideoContext';
import '../styles/TimelineClip.css';

function TimelineClip({ clip, pixelsPerSecond, onClick }) {
  const { updateClipTrim } = useVideo();
  const [isDragging, setIsDragging] = useState(null);
  const clipRef = useRef(null);

  const widthInPixels = clip.duration * pixelsPerSecond;

  // Calculate trim indicator positions
  const inPointPosition = clip.inPoint * pixelsPerSecond;
  const outPointPosition = clip.outPoint * pixelsPerSecond;
  const trimmedWidth = (clip.outPoint - clip.inPoint) * pixelsPerSecond;

  const handleMouseDown = (e, handleType) => {
    e.stopPropagation();
    setIsDragging(handleType);

    const startX = e.clientX;
    const startInPoint = clip.inPoint;
    const startOutPoint = clip.outPoint;

    const handleMouseMove = (moveEvent) => {
      if (!clipRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / pixelsPerSecond;

      if (handleType === 'in') {
        // Drag in-point (left handle)
        const newInPoint = Math.max(0, Math.min(startInPoint + deltaTime, clip.outPoint - 0.1));
        updateClipTrim(clip.id, newInPoint, clip.outPoint);
      } else if (handleType === 'out') {
        // Drag out-point (right handle)
        const newOutPoint = Math.max(clip.inPoint + 0.1, Math.min(startOutPoint + deltaTime, clip.duration));
        updateClipTrim(clip.id, clip.inPoint, newOutPoint);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={clipRef}
      className={`timeline-clip ${isDragging ? 'dragging' : ''}`}
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

      {/* Draggable Trim handles */}
      <div
        className={`trim-handle trim-handle-in ${isDragging === 'in' ? 'active' : ''}`}
        style={{ left: `${inPointPosition}px` }}
        onMouseDown={(e) => handleMouseDown(e, 'in')}
      >
        <div className="trim-handle-icon">◀</div>
      </div>
      <div
        className={`trim-handle trim-handle-out ${isDragging === 'out' ? 'active' : ''}`}
        style={{ left: `${outPointPosition}px` }}
        onMouseDown={(e) => handleMouseDown(e, 'out')}
      >
        <div className="trim-handle-icon">▶</div>
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
