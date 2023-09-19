import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ContainerService } from './service';
import {
  ContainerStatsDto,
  ContainerActiveDto,
  ContainerDetailDto,
  CreateContainerDto,
} from './dto';

@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post('new')
  async createContainer(@Body() body: CreateContainerDto) {
    return this.containerService.createContainer(body)
  }

  @Post('list')
  async getContainerList() {
    const list = await this.containerService.getContainerList();
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
