/**
 * createCircularImage
 * 1. Loads an image from `src`.
 * 2. Draws it onto an offscreen canvas, clipped to a circle.
 * 3. Returns a Promise<string> with the data URL of the circle-cropped image.
 */
export function createCircularImage(src: string, size: number = 64): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous'; // needed if you're loading from external domain
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Could not get 2D context');
        return;
      }

      // Draw a circle path and clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      
      // Draw the image into the clipped circle
      ctx.drawImage(img, 0, 0, size, size);
      
      // Convert to data URL
      const dataURL = canvas.toDataURL();
      resolve(dataURL);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}
