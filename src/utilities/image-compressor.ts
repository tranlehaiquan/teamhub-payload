import Compressor from 'compressorjs';

export const compressorPromise = async (
  file: File,
  options: Compressor.Options,
): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      ...options,
      success: resolve,
      error: reject,
    });
  });
};

export default compressorPromise;
