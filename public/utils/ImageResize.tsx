import imageCompression from 'browser-image-compression';

export const imageResizing = (file: File[]) => {
  if (file) {
    const imageFile = file[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    };
    const resizedImage = imageCompression(imageFile, options);
    return resizedImage;
  }
};
