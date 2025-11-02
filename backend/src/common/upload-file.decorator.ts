import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './file-upload.config';

export function UploadFile(allowed: string, folder: string) {
  // allowed: 'pdf' OR 'jpg,png' etc.
  const allowedTypes = allowed.split(',').map((t) => t.trim().toLowerCase());

  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: multerConfig.storage(folder),
        fileFilter: multerConfig.fileFilter(allowedTypes),
      }),
    ),
  );
}

//Mutiple File upload
// @Post('createProduct')
// @UploadFiles('jpeg,jpg,png', 'products', 10) // allows up to 10 images
// async createProduct(
//   @UploadedFiles() files: Express.Multer.File[],
//   @Body('dto') dtoString: string,
// ) {
//   const dto = JSON.parse(dtoString);

//   // Example: store paths
//   const imagePaths = files.map((file) => `products/${file.filename}`);
// }

// export function UploadFiles(
//   allowed: string,
//   folder: string,
//   maxCount = 5, // default max files
// ) {
//   const allowedTypes = allowed.split(',').map((t) => t.trim().toLowerCase());

//   return applyDecorators(
//     UseInterceptors(
//       FilesInterceptor('files', maxCount, {
//         storage: multerConfig.storage(folder),
//         fileFilter: multerConfig.fileFilter(allowedTypes),
//       }),
//     ),
//   );
// }
