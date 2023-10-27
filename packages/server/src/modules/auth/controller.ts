import { Controller, Request, Post, Put, UseGuards, Body } from '@nestjs/common';
import dayjs from 'dayjs';

import { AesDecrypt } from '@common/utils/crypto';

import { LoginAuthGuard } from '@/guards';
import { Public } from '@/decorators';

import { AuthService } from './service';
import { ChangePasswordDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.jwt(req.user);
    console.info(token);
    return {
      token,
    };
  }

  @Put('password')
  async changePassword(@Body() body: ChangePasswordDto) {
    const date = dayjs().format('YYYY-MM-DD');
    await this.authService.changePassword(
      AesDecrypt(body.currentPassword, date),
      AesDecrypt(body.newPassword, date),
    );
  }
}
