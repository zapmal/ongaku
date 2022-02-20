/* eslint-disable prettier/prettier */
import {
  FileInterceptor as NestFileInterceptor,
  FileFieldsInterceptor as NestFileFieldsInterceptor,
} from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

interface Options {
  fieldName?: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
  isMulti?: boolean;
  fields?: MulterField[];
}

export function FileInterceptor(options: Options): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor(private config: ConfigService) {
      const filesDestination = config.get('UPLOADED_FILES_DESTINATION');
      const destination = `${filesDestination}/${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      };

      if (options.isMulti) {
        this.fileInterceptor = new (NestFileFieldsInterceptor(
          options.fields,
          multerOptions,
        ));
      } else {
        this.fileInterceptor = new (NestFileInterceptor(options.fieldName, multerOptions));
      }
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}
