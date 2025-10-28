import React, { useRef } from 'react';
import { useVideo } from '../context/VideoContext';
import TimelineClip from './TimelineClip';
import '../styles/Timeline.css';

function Timeline() {
  const { clips, currentClip, playhead, setCurrentClip } = useVideo();
  const timelineRef = useRef(null);

  // Pixels per second - scale for timeline visualization
  const pixelsPerSecond = 50;

  // Calculate total timeline duration
  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);
  const timelineWidth = Math.max(totalDuration * pixelsPerSecond, 800);

  // Generate time markers (every 10 seconds)
  const timeMarkers = [];
  const markerInterval = 10; // seconds
  for (let i = 0; i <= totalDuration; i += markerInterval) {
    timeMarkers.push(i);
  }

  const handleTimelineClick = (e) => {
    if (!timelineRef.current || !currentClip) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickedTime = clickX / pixelsPerSecond;

    // Find which clip was clicked and set seek time
    let accumulatedTime = 0;
    for (const clip of clips) {
      if (clickedTime >= accumulatedTime && clickedTime < accumulatedTime + clip.duration) {
        // Clicked within this clip
        const timeInClip = clickedTime - accumulatedTime;

        // If this is the current clip, seek to the position
        if (clip.id === currentClip.id) {
          // Trigger seek by updating playhead - VideoPlayer will handle the actual seeking
          const videoElement = document.querySelector('.video-element');
          if (videoElement) {
            videoElement.currentTime = timeInClip;
          }
        } else {
          // Switch to this clip
          setCurrentClip(clip);
        }
        break;
      }
      accumulatedTime += clip.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate playhead position
  const playheadPosition = playhead * pixelsPerSecond;

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3>Timeline</h3>
      </div>

      <div className="timeline-wrapper">
        <div className="time-ruler">
          {timeMarkers.map((time) => (
            <div
              key={time}
              className="time-marker"
              style={{ left: `${time * pixelsPerSecond}px` }}
            >
              <div className="time-marker-label">{formatTime(time)}</div>
            </div>
          ))}
        </div>

        <div
          ref={timelineRef}
          className="timeline-track"
          style={{ width: `${timelineWidth}px` }}
          onClick={handleTimelineClick}
        >
          {clips.map((clip) => (
            <TimelineClip
              key={clip.id}
              clip={clip}
              pixelsPerSecond={pixelsPerSecond}
              onClick={() => setCurrentClip(clip)}
            />
          ))}

          {/* Playhead indicator */}
          <div
            className="playhead"
            style={{ left: `${playheadPosition}px` }}
          >
            <div className="playhead-line"></div>
            <div className="playhead-handle"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
