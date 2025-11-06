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
import { PRService } from './pr.service';
import { QueryPurchaseRequestDto } from './dto/query-purchase-request.dto';

@Controller('pr')
@UseGuards(RolesGuard)
export class PRController {
  constructor(private readonly prService: PRService) {}

  @Get('create')
  async createPR(@Req() req) {
    try {
      const user = req.user; // from JWT guard
      const result = await this.prService.createPurchaseRequestsFromCart(user);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get('findAll')
  async findAll(@Query() query: QueryPurchaseRequestDto) {
    try {
      return this.prService.findAll(query);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get('findOne/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.prService.findOne(id);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
