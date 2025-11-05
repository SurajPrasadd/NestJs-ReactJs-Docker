import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseUtil } from '../common/utils/response.util';
import { MESSAGES, RESPONSE_CODE } from '../common/constants/app.constants';
import { ApprovalService } from './approval.service';
import { UpdateApprovalStatusDto } from './dto/update-approval-status.dto';
import { QueryApprovalDto } from './dto/query-approval.dto';

@Controller('approval')
@UseGuards(RolesGuard)
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Patch(':id')
  async approveOrRejectBatch(@Req() req, @Body() dto: UpdateApprovalStatusDto) {
    try {
      const userId = req.user.id;
      const result = await this.approvalService.approveOrReject(dto, userId);
      return ResponseUtil.success(result.message, null);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get('findAll')
  async findAll(@Query() query: QueryApprovalDto) {
    return this.approvalService.findAll(query);
  }

  @Get('findOne/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.approvalService.findOne(id);
  }
}
