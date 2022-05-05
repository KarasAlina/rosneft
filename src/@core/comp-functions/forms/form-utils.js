import { cover, contain } from 'intrinsic-scale';

export const useInputImageRenderer = (file, callback, maxHeight, maxWidth, type) => {
  const compressImage = (base64, fileType) => {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');

    return new Promise((resolve, reject) => {
      img.onload = () => {
        let { width } = img;
        let { height } = img;
        let x = 0;
        let y = 0;
        const positionContain = contain(maxWidth, maxHeight, width, height);
        const positionCover = cover(maxWidth, maxHeight, width, height);

        if (type) { // нарезка cover или contain
          width = type === 'cover' ? positionCover.width : positionContain.width;
          height = type === 'cover' ? positionCover.height : positionContain.height;
          x = type === 'cover' ? positionCover.x : positionContain.x;
          y = type === 'cover' ? positionCover.y : positionContain.y;
          canvas.width = maxWidth;
          canvas.height = maxHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, x, y, width, height);
          resolve(canvas.toDataURL(fileType, 0.8));
        } else if (width > height) { // нарезка с сохранением пропорций
          if (width > maxWidth) {
            height = Math.round((height *= maxWidth / width));
            width = maxWidth;
          }
        } else if (height > maxHeight) { // нарезка с сохранением пропорций
          width = Math.round((width *= maxHeight / height));
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, x, y, width, height);
        resolve(canvas.toDataURL(fileType, 0.8));
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = base64;
    });
  };

  const inputImageRenderer = () => {
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      async () => {
        callback(await compressImage(reader.result, file.type));
      },
      false,
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return {
    inputImageRenderer,
  };
};

export const _ = null;
