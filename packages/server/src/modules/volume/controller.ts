import { Body, Controller, Post, Delete } from '@nestjs/common';
import { VolumeService } from './service';
import { CreateVolumeDto, RemoveVolumeDto } from './dto';

@Controller('volume')
export class VolumeController {
  constructor(private readonly volumeService: VolumeService) {}

  @Post('list')
  async getVolumeList() {
    return this.volumeService.getVolumeList();
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
