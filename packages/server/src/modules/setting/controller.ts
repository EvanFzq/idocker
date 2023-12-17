import { Controller, Post, Body, Put, Req } from '@nestjs/common';

import { AppInfo, UserInfo, NoticeInfo, SystemInfo } from '@common/types/setting';

import { wallpaperDir } from '@/constants/fs';
import { mkdir } from '@/utils/fs';
import { ConfigPublic } from '@/decorators';

import { SettingService } from './service';
import { GetAppsDto, AppsPublicDto, UpdateUserInfoDto, UpdateNoticeInfoDto } from './dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {
    mkdir(wallpaperDir);
  }
  @ConfigPublic('user', 'appsPagePublic')
  @Post('wallpaper')
  async getWallpaper() {
    return this.settingService.getWallpaper();
  }
  @ConfigPublic('user', 'appsPagePublic')
  @Post('switch/wallpaper')
  async switchWallpaper() {
    return this.settingService.switchWallpaper();
  }
  // 获取导航页配置
  @ConfigPublic('user', 'appsPagePublic')
  @Post('apps')
  async getApps(@Req() req: Request, @Body() body: GetAppsDto): Promise<AppInfo[]> {
    return this.settingService.getApps(req, body.isLocal);
  }

  @Post('apps/public')
  getAppsPublic(): boolean {
    return this.settingService.getAppsPublic();
  }

  @Put('apps/public')
  async updateAppsPublic(@Body() body: AppsPublicDto): Promise<void> {
    return this.settingService.updateAppsPublic(body.isPublic);
  }

  @Post('user')
  async getUserInfo(): Promise<UserInfo> {
    return this.settingService.getUserInfo();
  }

  @Put('user')
  async updateUserInfo(@Body() body: UpdateUserInfoDto): Promise<void> {
    return this.settingService.updateUserInfo(body);
  }

  @Post('notice')
  async getNoticeSetting(): Promise<NoticeInfo> {
    return this.settingService.getNoticeSetting();
  }
  @Put('notice')
  async updateNoticeSetting(@Body() body: UpdateNoticeInfoDto): Promise<void> {
    return this.settingService.updateNoticeSetting(body);
  }
  @Post('system/info')
  async getSystemInfo(): Promise<SystemInfo> {
    return this.settingService.getSystemInfo();
  }
}
