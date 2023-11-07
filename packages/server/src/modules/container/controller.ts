import { Body, Controller, Post, Put } from '@nestjs/common';
import dayjs from 'dayjs';

import { ContainerListItem, AppInfo } from '@common/types/container';

import { Public } from '@/decorators';

import { ContainerService } from './service';
import {
  ContainerStatsDto,
  ContainerActiveDto,
  ContainerDetailDto,
  CreateContainerDto,
  ContainerListDto,
  UpdateContainerDto,
  UpdateContainerImageDto,
  GetAppsDto,
} from './dto';

@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}
  // 创建容器
  @Post()
  async createContainer(@Body() body: CreateContainerDto) {
    return this.containerService.createContainer(body);
  }
  //更新容器设置
  @Put()
  async updateContainer(@Body() body: UpdateContainerDto) {
    return this.containerService.updateContainer(body);
  }
  // 获取容器列表
  @Post('list')
  async getContainerList(@Body() body: ContainerListDto): Promise<ContainerListItem[]> {
    let containerList = await this.containerService.getContainerList();
    // 条件过滤
    containerList = containerList
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
    // 获取详细信息及格式转换
    const containerDetailList = await Promise.all(
      containerList.map(item => this.containerService.getContainerDetail(item.Id)),
    );
    let list: ContainerListItem[] = containerDetailList.map(item => {
      return {
        id: item.Id,
        name: item.Name.slice(1),
        image: item.Config.Image,
        status: item.State.Status,
        startedAt: dayjs(item.State.StartedAt).valueOf(),
        created: dayjs(item.Created).valueOf(),
        labels: item.Config.Labels,
        icon:
          item.Config.Labels['docker.idocker.icon'] ||
          item.Config.Labels['com.docker.desktop.extension.icon'] ||
          item.Config.Labels['net.unraid.docker.icon'],
        localUrl: item.Config.Labels['docker.idocker.localUrl'],
        internetUrl: item.Config.Labels['docker.idocker.internetUrl'],
        isSelf: item.isSelf,
        canUpdate: item.canUpdate,
      };
    });
    // 获取容器资源消耗指标
    if (body.hasMetrics) {
      const statsList = await this.containerService.getContainerStats(list.map(item => item.id));
      list = list.map(item => {
        const stats = statsList.find(stats => stats.id === item.id);
        return { ...item, ...stats };
      });
    }
    return list;
  }
  // 获取容器配置详情
  @Post('detail')
  async getContainer(@Body() body: ContainerDetailDto) {
    return this.containerService.getContainerDetail(body.id);
  }
  // 获取容器资源消耗
  @Post('stats')
  async getContainerStats(@Body() body: ContainerStatsDto) {
    return await this.containerService.getContainerStats(body.ids);
  }
  // 获取容器log
  @Post('logs')
  async getContainerLogs(@Body() body: ContainerDetailDto) {
    return await this.containerService.getContainerLogs(body.id);
  }
  // 操作容器，启动、停止、暂停、恢复、移除
  @Put('active')
  async activeContainer(@Body() body: ContainerActiveDto) {
    return await this.containerService.activeContainer(body.id, body.type);
  }
  //更新容器镜像
  @Put('image')
  async updateContainerImage(@Body() body: UpdateContainerImageDto) {
    return await this.containerService.updateContainerImage(body.id);
  }
  // 获取导航页配置
  @Public()
  @Post('apps')
  async getApps(@Body() body: GetAppsDto): Promise<AppInfo[]> {
    return this.containerService.getApps(body.isLocal);
  }
}
