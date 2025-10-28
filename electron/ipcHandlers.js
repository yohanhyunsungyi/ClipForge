const { ipcMain, dialog } = require('electron');
const { getVideoMetadata } = require('./videoProcessor');

/**
 * Register all IPC handlers for the application
 */
function registerIpcHandlers() {
  // Handle file picker dialog for video import
  ipcMain.handle('import-video', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv'] }
      ]
    });

    if (result.canceled) {
      return null;
    }

    return result.filePaths[0];
  });

  // Handle video metadata extraction
  ipcMain.handle('get-video-metadata', async (event, filePath) => {
    try {
      const metadata = await getVideoMetadata(filePath);
      return { success: true, data: metadata };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

module.exports = {
  registerIpcHandlers
};
