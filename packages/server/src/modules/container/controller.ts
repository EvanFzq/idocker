import { Body, Controller, Post, Put } from '@nestjs/common';
import { ContainerService } from './service';
import {
  ContainerStatsDto,
  ContainerActiveDto,
  ContainerDetailDto,
  CreateContainerDto,
  ContainerListDto,
} from './dto';

@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post('new')
  async createContainer(@Body() body: CreateContainerDto) {
    return this.containerService.createContainer(body);
  }

  @Post('list')
  async getContainerList(@Body() body: ContainerListDto) {
    let list = await this.containerService.getContainerList();
    list = list
      .filter(item => !body.imageId || item.ImageID === body.imageId)
      .filter(
        item =>
          !body.networkId ||
          Object.values(item.NetworkSettings.Networks).some(
            network => network.NetworkID === body.networkId,
          ),
      )
      .filter(
        item =>
          !body.volumeName ||
          item.Mounts.some(mount => mount.Type === 'volume' && mount.Name === body.volumeName),
      );

    return Promise.all(list.map(item => this.containerService.getContainerDetail(item.Id)));
  }
  @Post('detail')
  async getContainer(@Body() body: ContainerDetailDto) {
    return this.containerService.getContainerDetail(body.id);
  }
  @Post('stats')
  async getContainerStats(@Body() body: ContainerStatsDto) {
    return await this.containerService.getContainerStats(body.ids);
  }

  @Post('logs')
  async getContainerLogs(@Body() body: ContainerDetailDto) {
    return await this.containerService.getContainerLogs(body.id);
  }

  @Put('active')
  async activeContainer(@Body() body: ContainerActiveDto) {
    return await this.containerService.activeContainer(body.id, body.type);
  }
}
