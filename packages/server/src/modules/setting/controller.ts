import { Controller, Post, Body, Put } from '@nestjs/common';

import { AppInfo } from '@common/types/container';

import { wallpaperDir } from '@/constants/fs';
import { mkdir } from '@/utils/fs';
import { ConfigPublic } from '@/decorators';

import { SettingService } from './service';
import { GetAppsDto, AppsNeedLoginDto } from './dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {
    mkdir(wallpaperDir);
  }
  @ConfigPublic('user', 'appsPageNeedLogin')
  @Post('wallpaper')
  async getWallpaper() {
    return this.settingService.getWallpaper();
  }
  @ConfigPublic('user', 'appsPageNeedLogin')
  @Post('switch/wallpaper')
  async switchWallpaper() {
    return this.settingService.switchWallpaper();
  }
  // 获取导航页配置
  @ConfigPublic('user', 'appsPageNeedLogin')
  @Post('apps')
  async getApps(@Body() body: GetAppsDto): Promise<AppInfo[]> {
    return this.settingService.getApps(body.isLocal);
  }

  @Post('apps/login')
  getAppsNeedLogin(): boolean {
    return this.settingService.getAppsNeedLogin();
  }

  @Put('apps/login')
  async updateAppsNeedLogin(@Body() body: AppsNeedLoginDto): Promise<void> {
    return this.settingService.updateAppsNeedLogin(body.needLogin);
  }
}
