import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY, IS_CONFIG_PUBLIC_KEY, ConfigKey, ConfigType } from '@/decorators';
import { ConfigService, UserConfig, SystemConfig } from '@/modules/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // public接口不需要校验jwt
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // 配置判断接口，根据配置值决定是否需要校验jwt
    const config = this.reflector.getAllAndOverride<{ type: ConfigType; key: ConfigKey }>(
      IS_CONFIG_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (config) {
      const { type, key } = config;
      if (type === 'system') {
        const isPublic = this.configService.getSystemConfig(key as keyof SystemConfig);
        if (isPublic) {
          return true;
        }
      } else {
        const isPublic = this.configService.getUserConfig(key as keyof UserConfig);
        if (isPublic) {
          return true;
        }
      }
    }

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
