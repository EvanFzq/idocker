import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LoginAuthGuard } from '@/guards';
import { AuthService } from './service';
import { Public } from '@/decorators';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LoginAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() req) {
        const token = await this.authService.jwt(req.user);
        console.log(token);
        return {
            token,
        };
    }
}
