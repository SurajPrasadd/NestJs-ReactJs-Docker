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
  Req,
} from '@nestjs/common';
import { ApprovalConfigService } from './approval-config.service';
import { CreateApprovalConfigDto } from './dto/create-approval-config.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { RESPONSE_CODE, MESSAGES } from '../common/constants/app.constants';
import { GetApprovalGroupsDto } from './dto/get-approval-group-dto';
import { FilterApprovalConfigDto } from './dto/filter-approval-config.dto';

@Controller('approval-config')
export class ApprovalConfigController {
  constructor(private readonly approvalConfigService: ApprovalConfigService) {}

  @Get('groups')
  async getGroupNames(@Query() query: GetApprovalGroupsDto) {
    try {
      const groups = await this.approvalConfigService.getUniqueGroupNames(
        query.search,
        query.sort,
        query.page,
        query.limit,
      );
      return ResponseUtil.success(MESSAGES.SUCCESS, groups);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('create')
  async create(@Req() req, @Body() dto: CreateApprovalConfigDto) {
    try {
      const userId = req.user.id;
      const config = await this.approvalConfigService.create(dto, userId);
      return ResponseUtil.success(MESSAGES.CREATED, config);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('find')
  async findAll(@Body() query: FilterApprovalConfigDto) {
    try {
      const data = await this.approvalConfigService.findAll(query);
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
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateApprovalConfigDto,
  ) {
    try {
      const userId = req.user.id;
      const config = await this.approvalConfigService.update(id, dto, userId);
      return ResponseUtil.success(MESSAGES.UPDATED, null);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.approvalConfigService.remove(id);
      return ResponseUtil.success(MESSAGES.DELETED, null);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
