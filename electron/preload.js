const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  importVideo: () => ipcRenderer.invoke('import-video'),
  getVideoMetadata: (filePath) => ipcRenderer.invoke('get-video-metadata', filePath),
  exportVideo: (data) => ipcRenderer.invoke('export-video', data),
  onExportProgress: (callback) => ipcRenderer.on('export-progress', (event, data) => callback(data)),
  onExportComplete: (callback) => ipcRenderer.on('export-complete', (event, data) => callback(data)),
  onExportError: (callback) => ipcRenderer.on('export-error', (event, data) => callback(data)),
  removeExportListeners: () => {
    ipcRenderer.removeAllListeners('export-progress');
    ipcRenderer.removeAllListeners('export-complete');
    ipcRenderer.removeAllListeners('export-error');
  }
});
