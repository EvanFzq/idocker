import { Controller, Request, Post, Put, UseGuards, Body } from '@nestjs/common';
import { LoginAuthGuard } from '@/guards';
import { AuthService } from './service';
import { Public } from '@/decorators';
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
    await this.authService.changePassword(body.currentPassword, body.newPassword);
  }
}
