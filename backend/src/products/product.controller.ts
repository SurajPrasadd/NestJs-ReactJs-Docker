import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Patch,
  UploadedFiles,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseUtil } from '../common/utils/response.util';
import { RESPONSE_CODE, UPLOAD_PATH } from '../common/constants/app.constants';
import { Public } from '../auth/guards/public.decorator';
import { ProductService } from './product.service';
import { MESSAGES } from '../common/constants/app.constants';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UploadFiles } from '../common/upload-file.decorator';

@UseGuards(RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('createProduct')
  @UploadFiles('jpeg,jpg,png', 'products', 5) // allows up to 5 images
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('dto') dtoString: string, // JSON string
  ) {
    try {
      const dto: CreateProductDto = JSON.parse(dtoString);
      const imagePaths =
        files?.map((file) => UPLOAD_PATH.IMAGE + file.filename) || [];
      return ResponseUtil.success(
        await await await this.productService.createProduct(dto, imagePaths),
        null,
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Patch('updateProduct/:id')
  @UploadFiles('jpeg,jpg,png', 'products', 5) // allows up to 5 images
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('dto') dtoString: string,
  ) {
    try {
      const dto: Partial<CreateProductDto> = JSON.parse(dtoString);
      const imagePaths =
        files?.map((file) => UPLOAD_PATH.IMAGE + file.filename) || [];

      const result = await this.productService.updateProductBySku(
        id,
        dto,
        imagePaths,
      );

      return ResponseUtil.success(result, null);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Delete('deleteProduct/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      return ResponseUtil.success(
        (await this.productService.deleteProductBySku(id)).message,
        null,
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('getProduct')
  async getProduct(@Req() req, @Body() dto: QueryProductDto) {
    try {
      const userId = req.user.id;
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await await this.productService.getProducts(dto, userId),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get('getProductById/:id')
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    try {
      const userId = req.user.id;
      const result = await this.productService.findOne(id, userId);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
