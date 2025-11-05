import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApprovalConfigService } from './approval-config.service';
import { CreateApprovalConfigDto } from './dto/create-approval-config.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { RESPONSE_CODE, MESSAGES } from '../common/constants/app.constants';

@Controller('approval-config')
export class ApprovalConfigController {
  constructor(private readonly approvalConfigService: ApprovalConfigService) {}

  @Post()
  async create(@Body() dto: CreateApprovalConfigDto) {
    try {
      const config = await this.approvalConfigService.create(dto);
      return ResponseUtil.success(MESSAGES.SUCCESS, config);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const data = await this.approvalConfigService.findAll(
        Number(page),
        Number(limit),
      );
      return ResponseUtil.success(MESSAGES.SUCCESS, data);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const config = await this.approvalConfigService.findOne(id);
      return ResponseUtil.success(MESSAGES.SUCCESS, config);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateApprovalConfigDto,
  ) {
    try {
      const config = await this.approvalConfigService.update(id, dto);
      return ResponseUtil.success(MESSAGES.SUCCESS, config);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.approvalConfigService.remove(id);
      return ResponseUtil.success(MESSAGES.SUCCESS, null);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
