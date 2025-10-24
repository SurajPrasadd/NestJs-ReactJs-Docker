import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseUtil } from '../common/utils/response.util';
import { RESPONSE_CODE } from '../common/constants/app.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.usersService.create(body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  @Get('getAllUser')
  getAllUser() {
    try {
      return this.usersService.findAll();
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
