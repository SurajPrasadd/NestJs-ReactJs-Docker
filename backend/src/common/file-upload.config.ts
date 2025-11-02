import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: (folder: string) =>
    diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = `./uploads/${folder}`;
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${folder}-${uniqueSuffix}${ext}`);
      },
    }),

  /**
   * File filter by extensions
   */
  fileFilter: (allowedTypes: string[]) => {
    return (req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase().replace('.', '');
      if (!allowedTypes.includes(ext)) {
        return cb(
          new BadRequestException(
            `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
          ),
          false,
        );
      }
      cb(null, true);
    };
  },
};
