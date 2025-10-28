const { ipcMain, dialog } = require('electron');
const { getVideoMetadata, exportVideo } = require('./videoProcessor');

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

  // Handle video export with trim
  ipcMain.handle('export-video', async (event, { inputPath, inPoint, outPoint }) => {
    try {
      // Show save dialog
      const result = await dialog.showSaveDialog({
        title: 'Export Video',
        defaultPath: 'exported-video.mp4',
        filters: [
          { name: 'MP4 Video', extensions: ['mp4'] }
        ]
      });

      if (result.canceled) {
        return { success: false, error: 'Export canceled by user' };
      }

      const outputPath = result.filePath;

      // Export video with progress updates
      await exportVideo(inputPath, outputPath, inPoint, outPoint, (progress) => {
        event.sender.send('export-progress', progress);
      });

      event.sender.send('export-complete', { outputPath });
      return { success: true, outputPath };
    } catch (error) {
      event.sender.send('export-error', { error: error.message });
      return { success: false, error: error.message };
    }
  });
}

module.exports = {
  registerIpcHandlers
};
