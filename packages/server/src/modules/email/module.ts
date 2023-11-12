import { Module } from '@nestjs/common';

import { ConfigModule } from '@/modules/config';

import { EmailService } from './service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
