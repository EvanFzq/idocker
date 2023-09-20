import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './service';
import { UserInfo } from './type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<UserInfo> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('账户或密码错误！');
    }
    return user;
  }
}
