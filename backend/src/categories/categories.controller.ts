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
import { CategoriesService } from './categories.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { MESSAGES } from '../common/constants/app.constants';

@UseGuards(RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
}
