import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseUtil } from '../common/utils/response.util';
import {
  MESSAGES,
  RESPONSE_CODE,
  VENDOR,
  APPROVER,
} from '../common/constants/app.constants';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from './guards/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      if (dto.role === VENDOR) {
        if (
          !dto.businessName?.trim() ||
          !dto.businessEmail?.trim() ||
          !dto.businessPhone?.trim() ||
          !dto.businessAddress?.trim()
        ) {
          return ResponseUtil.error(
            MESSAGES.USER.INVALID_BUSINESS,
            RESPONSE_CODE.BAD_REQUEST,
          );
        }
      } else if (dto.role === APPROVER) {
        if (!dto.designation?.trim() || !dto.department?.trim()) {
          return ResponseUtil.error(
            MESSAGES.USER.INVALID_APPROVER,
            RESPONSE_CODE.BAD_REQUEST,
          );
        }
      }
      return await this.authService.register(dto); // await the Promise
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    try {
      return await this.authService.refresh(dto.refreshToken);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
