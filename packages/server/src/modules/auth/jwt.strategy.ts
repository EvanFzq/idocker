import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { v4 as uuidV4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret: string = configService.getSystemConfig('secret', uuidV4());
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { username: string; iat: number; exp: number }) {
    return { username: payload.username };
  }
}
