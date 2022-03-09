import { BadRequestException as BadRequest } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import * as hash from 'object-hash';
import { writeFile, mkdirSync, existsSync } from 'fs';
import { extname } from 'path';

type MulterImageOptions = {
  fileFilter: MulterOptions['fileFilter'];
  limits: MulterOptions['limits'];
};

export const multerImageOptions: MulterImageOptions = {
  fileFilter: (request, file, callback) => {
    if (
      !file.mimetype.includes('image') ||
      !file.originalname.match(/\.(jpg|jpeg|png|webp)$/)
    ) {
      return callback(new BadRequest('You must provide a valid image'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(1024, 2), // 1MB
    files: 2,
  },
};

// export const multerImageOptions: MulterImageOptions = {
//   fileFilter: (request, file, callback) => {
//     if (
//       !file.mimetype.includes('image') ||
//       !file.originalname.match(/\.(jpg|jpeg|png|webp)$/)
//     ) {
//       return callback(new BadRequest('You must provide a valid image'), false);
//     }
//     callback(null, true);
//   },
//   limits: {
//     fileSize: Math.pow(1024, 2), // 1MB
//     files: 2,
//   },
// };

export const storeImages = (
  data: Express.Multer.File | Array<Express.Multer.File>,
  destination: string,
  multiple = false,
) => {
  let errorStoringImages = false;

  if (!existsSync(destination)) {
    mkdirSync(destination);
  }

  if (!data || Object.keys(data).length === 0) {
    errorStoringImages = true;
    return [{}, errorStoringImages];
  }

  if (multiple) {
    const images = {};

    Object.keys(data).forEach((key) => {
      const image = data[key][0];
      const filename = hash(image.originalname);
      const extension = extname(image.originalname);
      const file = `${filename}${extension}`;

      writeFile(`${destination}/${file}`, image.buffer, (err) => {
        if (err) {
          console.log('Error uploading images', err);
          errorStoringImages = true;
        }
      });

      images[key] = file;
    });

    return [images, errorStoringImages];
  } else {
    const image = data as Express.Multer.File;
    const filename = hash(image.originalname);
    const extension = extname(image.originalname);
    const file = `${filename}${extension}`;

    writeFile(`${destination}/${file}`, image.buffer, (err) => {
      if (err) {
        console.log('Error uploading image', err);
        errorStoringImages = true;
      }
    });

    return [file, errorStoringImages];
  }
};
