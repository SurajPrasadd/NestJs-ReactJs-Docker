import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseUtil } from '../common/utils/response.util';
import { RESPONSE_CODE, UPLOAD_PATH } from '../common/constants/app.constants';
import { Public } from '../auth/guards/public.decorator';
import { ProductService } from './product.service';
import { CategoriesService } from './categories.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { MESSAGES } from '../common/constants/app.constants';
import { UploadFile } from '../common/upload-file.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@UseGuards(RolesGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Public()
  @Get('getAllCategories')
  async getAllCategories() {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.categoriesService.getAllCategories(),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.categoriesService.remove(id),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Roles('admin')
  @Post('createCategories')
  async createCategories(@Body() dto: CreateUpdateDto) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.categoriesService.create(dto),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Roles('admin')
  @Post('updateCategories/:id')
  async updateCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateUpdateDto,
  ) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.categoriesService.update(id, dto),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Public()
  @Post('getCategories')
  async getCategories(@Body() dto: QueryCategoryDto) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await await this.categoriesService.getCategories(dto),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('createProduct')
  @UploadFile('jpeg,jpg,png', 'products')
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body('dto') dtoString: string, // JSON string
  ) {
    try {
      const dto: CreateProductDto = JSON.parse(dtoString); // manually parse
      const imagePath = file ? UPLOAD_PATH.IMAGE + file.filename : null;
      if (imagePath) {
        return ResponseUtil.success(
          MESSAGES.SUCCESS,
          await await await this.productService.createProduct(dto, imagePath),
        );
      } else {
        return ResponseUtil.handleError(
          'Upload Fail',
          RESPONSE_CODE.INTERNAL_ERROR,
        );
      }
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Patch('updateProduct/:sku')
  @UploadFile('jpeg,jpg,png', 'products')
  async updateProduct(
    @Param('sku') sku: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('dto') dtoString: string,
  ) {
    try {
      const dto: Partial<CreateProductDto> = JSON.parse(dtoString);
      const imagePath = file ? UPLOAD_PATH.IMAGE + file.filename : null;

      const result = await this.productService.updateProductBySku(
        sku,
        dto,
        imagePath,
      );

      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Delete('deleteProduct/:sku')
  async deleteProduct(@Param('sku') sku: string) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.productService.deleteProductBySku(sku),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Public()
  @Post('getProduct')
  async getProduct(@Body() dto: QueryProductDto) {
    try {
      console.log('Received body:', dto);
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await await this.productService.getProducts(dto),
      );
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
