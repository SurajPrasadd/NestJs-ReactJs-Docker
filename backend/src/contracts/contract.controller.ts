import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateContractDto } from './dto/create-contract.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ContractService } from './contract.service';
import { UploadFiles } from '../common/upload-file.decorator';
import {
  MESSAGES,
  RESPONSE_CODE,
  UPLOAD_PATH,
} from '../common/constants/app.constants';
import { ResponseUtil } from '../common/utils/response.util';
import { GetContractsDto } from './dto/get-contracts.dto';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('createContracts')
  @UploadFiles('pdf', 'contracts')
  async createContractFromPR(
    @Body() dto: CreateContractDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imagePath = file ? UPLOAD_PATH.CONTRACT + file.filename : null;
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        this.contractService.createContractFromPR(dto, imagePath),
      );
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get()
  async getAllContracts(@Query() query: GetContractsDto) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        this.contractService.getAllContracts(query),
      );
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
