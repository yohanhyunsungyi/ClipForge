import React, { createContext, useState, useContext } from 'react';

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [clips, setClips] = useState([]);
  const [currentClip, setCurrentClip] = useState(null);
  const [playhead, setPlayhead] = useState(0);

  const addClip = (clip) => {
    const newClip = {
      id: Date.now(),
      ...clip,
      inPoint: 0,
      outPoint: clip.duration
    };
    setClips(prevClips => [...prevClips, newClip]);
    setCurrentClip(newClip);
  };

  const removeClip = (id) => {
    setClips(prevClips => prevClips.filter(clip => clip.id !== id));
    if (currentClip?.id === id) {
      setCurrentClip(null);
    }
  };

  const updateClipTrim = (clipId, inPoint, outPoint) => {
    setClips(prevClips =>
      prevClips.map(clip =>
        clip.id === clipId ? { ...clip, inPoint, outPoint } : clip
      )
    );
    if (currentClip?.id === clipId) {
      setCurrentClip(prev => ({ ...prev, inPoint, outPoint }));
    }
  };

  const value = {
    clips,
    currentClip,
    setCurrentClip,
    addClip,
    removeClip,
    updateClipTrim,
    playhead,
    setPlayhead
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}
