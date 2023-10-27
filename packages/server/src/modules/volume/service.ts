import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DockerService } from '../docker';

@Injectable()
export class VolumeService {
  constructor(private readonly dockerService: DockerService) {}
  async getVolumeList() {
    const volumeRes = await this.dockerService.docker.df();
    return volumeRes.Volumes;
  }
  async createVolume(name: string) {
    const volumesRes = await this.dockerService.docker.listVolumes();
    if (volumesRes.Volumes.some(volume => volume.Name === name)) {
      throw new HttpException('数据卷已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.dockerService.docker.createVolume({
      Name: name,
    });
  }
  async removeVolume(name: string) {
    const volume = this.dockerService.docker.getVolume(name);
    await volume.remove();
  }
}
