import { Module } from '@nestjs/common';
import { ConfigService } from './service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
