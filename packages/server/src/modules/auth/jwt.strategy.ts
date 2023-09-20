import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { v4 as uuidV4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret: string = configService.getConfig('secret', uuidV4());
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { account: string; sub: number }) {
    return { userId: payload.sub, account: payload.account };
  }
}
