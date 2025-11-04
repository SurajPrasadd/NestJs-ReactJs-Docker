import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './file-upload.config';

export function UploadFiles(
  allowed: string,
  folder: string,
  maxCount = 5, // default max files
) {
  const allowedTypes = allowed.split(',').map((t) => t.trim().toLowerCase());

  return applyDecorators(
    UseInterceptors(
      FilesInterceptor('files', maxCount, {
        storage: multerConfig.storage(folder),
        fileFilter: multerConfig.fileFilter(allowedTypes),
      }),
    ),
  );
}

// export function UploadFile(allowed: string, folder: string) {
//   // allowed: 'pdf' OR 'jpg,png' etc.
//   const allowedTypes = allowed.split(',').map((t) => t.trim().toLowerCase());

//   return applyDecorators(
//     UseInterceptors(
//       FileInterceptor('file', {
//         storage: multerConfig.storage(folder),
//         fileFilter: multerConfig.fileFilter(allowedTypes),
//       }),
//     ),
//   );
// }

//Single File upload
// @Post('createProduct')
// @UploadFile('jpeg,jpg,png', 'products')
// async createProduct(
//   @UploadedFile() file: Express.Multer.File,
//   @Body('dto') dtoString: string, // JSON string
// ) {
//   try {
//     const dto: CreateProductDto = JSON.parse(dtoString); // manually parse
//     const imagePath = file ? UPLOAD_PATH.IMAGE + file.filename : null;

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
