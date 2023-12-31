import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { v4 as uuidV4 } from 'uuid';

import { ConfigModule, ConfigService } from '@/modules/config';

import { AuthService } from './service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './controller';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const secret: string = configService.getSystemConfig('secret', uuidV4());
        return {
          secret,
          signOptions: {
            expiresIn: 24 * 60 * 60 + 's',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
