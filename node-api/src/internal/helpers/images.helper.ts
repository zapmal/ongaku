import { BadRequestException as BadRequest } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import * as hash from 'object-hash';
import { writeFile } from 'fs';

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

export const storeImages = (
  data: Express.Multer.File | Array<Express.Multer.File>,
  destination: string,
  multiple = false,
) => {
  let errorStoringImages = false;

  if (Object.keys(data).length === 0) {
    errorStoringImages = true;
    return [{}, errorStoringImages];
  }

  if (multiple) {
    const images = {};

    Object.keys(data).forEach((key) => {
      const image = data[key][0];
      const filename = hash(image.originalname);

      writeFile(`${destination}/${filename}`, image.buffer, (err) => {
        if (err) errorStoringImages = true;
      });

      images[key] = filename.concat(`-${image.mimetype}`);
    });

    return [images, errorStoringImages];
  } else {
    const image = data[0];
    const filename = hash(image.originalname);

    writeFile(`${destination}/${filename}`, image.buffer, (err) => {
      if (err) errorStoringImages = true;
    });

    return [filename.concat(`-${image.mimetype}`), errorStoringImages];
  }
};
