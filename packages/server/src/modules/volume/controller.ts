import { Body, Controller, Post, Delete } from '@nestjs/common';

import { VolumeService } from './service';
import { CreateVolumeDto, RemoveVolumeDto } from './dto';

@Controller('volume')
export class VolumeController {
  constructor(private readonly volumeService: VolumeService) {}

  @Post('list')
  async getVolumeList() {
    let list = await this.volumeService.getVolumeList();
    list = list.sort((a, b) => a.Name.localeCompare(b.Name));
    return list;
  }
  @Post()
  async createVolume(@Body() body: CreateVolumeDto) {
    return this.volumeService.createVolume(body.name);
  }
  @Delete()
  async removeVolume(@Body() body: RemoveVolumeDto) {
    return this.volumeService.removeVolume(body.name);
  }
}
