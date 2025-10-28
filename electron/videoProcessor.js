const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Extract video metadata using FFprobe
 * @param {string} filePath - Absolute path to video file
 * @returns {Promise<object>} Video metadata object
 */
function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');

      if (!videoStream) {
        reject(new Error('No video stream found in file'));
        return;
      }

      const result = {
        filename: filePath.split('/').pop(),
        duration: metadata.format.duration,
        width: videoStream.width,
        height: videoStream.height,
        codec: videoStream.codec_name,
        filePath: filePath
      };

      resolve(result);
    });
  });
}

/**
 * Export video with trim using FFmpeg
 * @param {string} inputPath - Absolute path to input video file
 * @param {string} outputPath - Absolute path to output video file
 * @param {number} inPoint - Start time in seconds
 * @param {number} outPoint - End time in seconds
 * @param {function} onProgress - Callback function for progress updates
 * @returns {Promise<void>}
 */
function exportVideo(inputPath, outputPath, inPoint, outPoint, onProgress) {
  return new Promise((resolve, reject) => {
    const duration = outPoint - inPoint;

    ffmpeg(inputPath)
      .setStartTime(inPoint)
      .setDuration(duration)
      .outputOptions('-c copy') // Codec copy for fast export
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        if (onProgress) {
          // Calculate percentage based on timemark
          const percent = progress.percent || 0;
          onProgress({
            percent: Math.min(100, Math.max(0, percent)),
            timemark: progress.timemark
          });
        }
      })
      .on('end', () => {
        console.log('Export completed successfully');
        resolve();
      })
      .on('error', (err) => {
        console.error('Export error:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

module.exports = {
  getVideoMetadata,
  exportVideo
};
