import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseUtil } from '../common/utils/response.util';
import { RESPONSE_CODE } from '../common/constants/app.constants';
import { Public } from '../auth/guards/public.decorator';
import { ProductService } from './product.service';
import { CategoriesService } from './categories.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { MESSAGES } from '../common/constants/app.constants';

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
      return await this.categoriesService.update(id, dto);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Public()
  @Post('getParentCategories')
  async getParentCategories(@Body() dto: QueryCategoryDto) {
    try {
      return await this.categoriesService.getCategories(dto);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
