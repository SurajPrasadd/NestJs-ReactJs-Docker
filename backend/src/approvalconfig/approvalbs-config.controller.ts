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
import { ApprovalBSConfigService } from './approvalbs-config.service';
import { CreateApprovalConfigBusinessDto } from './dto/create-approval-config-business.dto';

@Controller('approval-bs-config')
export class ApprovalBSConfigController {
  constructor(
    private readonly approvalBSConfigService: ApprovalBSConfigService,
  ) {}

  @Post()
  async create(@Body() dto: CreateApprovalConfigBusinessDto) {
    try {
      const result = await this.approvalBSConfigService.create(dto);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const data = await this.approvalBSConfigService.findAll(
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
      const result = await this.approvalBSConfigService.findOne(id);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateApprovalConfigBusinessDto,
  ) {
    try {
      const result = await this.approvalBSConfigService.update(id, dto);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.approvalBSConfigService.remove(id);
      return ResponseUtil.success(MESSAGES.SUCCESS, null);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
