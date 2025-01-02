/**
 * createCircularImage
 * 1. Loads an image from `src`.
 * 2. Clips a circular region centered on the object of interest.
 * 3. Draws the clipped region onto a canvas of the desired size.
 * 4. Returns a Promise<string> with the data URL of the circle-cropped image.
 */
export function createCircularImage(
  src: string,
  size: number,
  objectSize: number = 350 // Diameter of the object of interest in the source image
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous'; // Needed for external domain images

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Could not get 2D context');
        return;
      }

      // Center the circular region to clip from the source image
      const sourceX = (img.width - objectSize) / 2;
      const sourceY = (img.height - objectSize) / 2;

      // Draw a circle path and clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      // Draw the clipped region onto the canvas
      ctx.drawImage(
        img,
        sourceX, sourceY, objectSize, objectSize, // Source rectangle
        0, 0, size, size                        // Destination rectangle
      );

      // Convert to data URL
      const dataURL = canvas.toDataURL();
      resolve(dataURL);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}
