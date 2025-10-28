import React, { useRef, useState, useEffect } from 'react';
import { useVideo } from '../context/VideoContext';
import '../styles/VideoPlayer.css';

function VideoPlayer() {
  const { currentClip, setPlayhead } = useVideo();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset playback state when clip changes
  useEffect(() => {
    if (currentClip && videoRef.current) {
      videoRef.current.load();
      videoRef.current.volume = 1.0; // Ensure volume is at maximum
      videoRef.current.muted = false; // Ensure not muted
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentClip]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // When starting playback, ensure we're within trim boundaries
      if (currentClip && videoRef.current.currentTime < currentClip.inPoint) {
        videoRef.current.currentTime = currentClip.inPoint;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      setPlayhead(time);

      // Enforce trim boundaries - pause when reaching out-point
      if (currentClip && time >= currentClip.outPoint) {
        videoRef.current.pause();
        setIsPlaying(false);
        // Keep playhead at out-point
        videoRef.current.currentTime = currentClip.outPoint;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentClip) {
    return (
      <div className="video-player-container">
        <div className="video-player-placeholder">
          <p>No video loaded. Import a video to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-element"
          src={currentClip.filePath}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnded}
        >
          Your browser does not support the video element.
        </video>
      </div>

      <div className="video-controls">
        <button
          className="play-pause-button"
          onClick={handlePlayPause}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <input
          type="range"
          className="progress-bar"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          step="0.1"
        />
      </div>
    </div>
  );
}

export default VideoPlayer;
