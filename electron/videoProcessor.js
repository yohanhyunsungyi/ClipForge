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

module.exports = {
  getVideoMetadata
};
