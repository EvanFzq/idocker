import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import type { Volume } from '@common/types/volume';

import { DockerService } from '../docker';

@Injectable()
export class VolumeService {
  constructor(private readonly dockerService: DockerService) {}
  async getVolumeList() {
    const volumeRes = await this.dockerService.docker.listVolumes();
    const containerList = await this.dockerService.docker.listContainers({
      all: true,
    });
    const list: Volume[] = volumeRes.Volumes.map(volume => {
      let containerNum = 0;

      containerList.forEach(container => {
        if (container.Mounts.some(item => item.Name === volume.Name)) {
          containerNum++;
        }
      });
      return {
        ...volume,
        CreatedAt: (volume as unknown as Record<string, string>).CreatedAt,
        ContainerNum: containerNum,
      };
    });
    return list;
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
