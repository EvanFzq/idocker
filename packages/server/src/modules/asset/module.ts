import { Module } from '@nestjs/common';
import { AssetService } from './service';
import { AssetController } from './controller';

@Module({
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
