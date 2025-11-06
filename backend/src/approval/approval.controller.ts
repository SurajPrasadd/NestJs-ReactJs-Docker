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
import { GetApprovalsQueryDto } from './dto/query-approval.dto';

@Controller('approval')
@UseGuards(RolesGuard)
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Get('all')
  async getAllApprovals(@Query() query: GetApprovalsQueryDto) {
    try {
      const result = await this.approvalService.getAllApprovals(query);
      return ResponseUtil.success('All approvals fetched successfully', result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get('allByUser')
  async getAllByUserApprovals(
    @Req() req,
    @Query() query: GetApprovalsQueryDto,
  ) {
    try {
      query.approvedBy = req.user.id;
      const result = await this.approvalService.getAllApprovals(query);
      return ResponseUtil.success('All approvals fetched successfully', result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get('findOne/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.approvalService.findOne(id);
  }

  @Patch('action')
  async approveOrReject(@Req() req, @Body() dto: UpdateApprovalStatusDto) {
    try {
      const userId = req.user.id;
      const result = await this.approvalService.approveOrReject(dto, userId);
      return ResponseUtil.success(result.message, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
