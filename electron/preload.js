const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  importVideo: () => ipcRenderer.invoke('import-video'),
  getVideoMetadata: (filePath) => ipcRenderer.invoke('get-video-metadata', filePath)
});
