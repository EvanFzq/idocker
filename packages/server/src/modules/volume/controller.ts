import { Body, Controller, Post } from '@nestjs/common';
import { VolumeService } from './service';

@Controller('volume')
export class VolumeController {
  constructor(private readonly volumeService: VolumeService) {}

  @Post('list')
  async getVolumeList() {
    return this.volumeService.getVolumeList();
  }
}
