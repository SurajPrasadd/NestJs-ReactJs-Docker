import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Req,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { ContractService } from './contract.service';
import { UploadFile } from '../common/upload-file.decorator';
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
  @UploadFile('pdf', 'contracts')
  async createContractFromPR(
    @Body('dto') dtoString: string, // JSON string
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imagePath = file ? UPLOAD_PATH.CONTRACT + file.filename : null;
      const dto: CreateContractDto = JSON.parse(dtoString);
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.contractService.createContractFromPR(dto, imagePath),
      );
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('list')
  async getAllContracts(@Body() query: GetContractsDto) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.contractService.getAllContracts(query),
      );
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Get('getContractById/:id')
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.contractService.findOne(id);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
