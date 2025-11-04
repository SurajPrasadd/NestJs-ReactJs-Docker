import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseUtil } from '../common/utils/response.util';
import { RESPONSE_CODE, MESSAGES } from '../common/constants/app.constants';
import { Public } from '../auth/guards/public.decorator';
import { BusinessProductsService } from './business-products.service';
import { CreateBusinessProductDto } from './dto/create-business-product.dto';
import { QueryBusinessProductDto } from './dto/query-business-product.dto';

@UseGuards(RolesGuard)
@Controller('business-product')
export class BusinessProductsController {
  constructor(
    private readonly businessProductService: BusinessProductsService,
  ) {}

  /** ✅ Create Business Product */
  @Post('create')
  async create(@Body() dto: CreateBusinessProductDto) {
    try {
      const result = await this.businessProductService.create(dto);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  /** ✅ Update Business Product */
  @Patch('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateBusinessProductDto,
  ) {
    try {
      const result = await this.businessProductService.update(id, dto);
      return ResponseUtil.success(MESSAGES.UPDATED, result);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  /** ✅ Delete Business Product */
  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.businessProductService.remove(id);
      return ResponseUtil.success(result.message, null);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  /** ✅ Get One Business Product */
  @Public()
  @Get('getById/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.businessProductService.findOne(id);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  /** ✅ Get All Business Products (with relations) */
  @Post('getAll')
  async findAll(@Body() query: QueryBusinessProductDto) {
    try {
      const result = await this.businessProductService.findAll(query);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
