import { promises as fs } from 'fs';
import path from 'path';

import { Injectable } from '@nestjs/common';

import { ContainerStatus, EmailType } from '@common/constants/enum';
import { AppInfo, NoticeInfo, UserInfo } from '@common/types/setting';

import { wallpaperDir } from '@/constants/fs';
import { DockerService } from '@/modules/docker';
import { ConfigService } from '@/modules/config';
import { EmailService } from '@/modules/email';

import { UpdateUserInfoDto } from './dto';

@Injectable()
export class SettingService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}
  async getWallpaper() {
    const currentWallpaperPath = this.configService.getUserConfig<string>('appsPageWallpaperPath');
    if (!currentWallpaperPath) {
      return { src: null };
    }
    return {
      src: '/api/v1/asset/wallpaper' + currentWallpaperPath.split(wallpaperDir)[1],
    };
  }
  async switchWallpaper() {
    const dirList = [wallpaperDir];
    let imgList: string[] = [];
    // 遍历所有壁纸
    while (dirList.length > 0) {
      const dir = dirList.shift();
      const list = await fs.readdir(dir, { withFileTypes: true });
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.isDirectory()) {
          dirList.push(path.join(dir, item.name));
        } else if (
          item.isFile() &&
          ['.jpg', '.jpeg', '.png', '.bmp', '.webp', '.gif'].includes(
            path.parse(item.name).ext.toLowerCase(),
          )
        ) {
          imgList.push(path.join(dir, item.name));
        }
      }
    }
    // 随机除当前壁纸外的其他壁纸
    const currentWallpaperPath = this.configService.getUserConfig('appsPageWallpaperPath');
    imgList = imgList.filter(imgPath => imgPath !== currentWallpaperPath);
    const imgPath = imgList[Math.floor(Math.random() * imgList.length)];
    await this.configService.setUserConfig('appsPageWallpaperPath', imgPath);
    return {
      src: '/api/v1/asset/wallpaper' + imgPath.split(wallpaperDir)[1],
    };
  }
  async getApps(isLocal: boolean): Promise<AppInfo[]> {
    const containerList = await this.dockerService.docker.listContainers({ all: true });
    return containerList
      .map(container => ({
        name: container.Names[0].slice(1),
        url: isLocal
          ? container.Labels['docker.idocker.localUrl']
          : container.Labels['docker.idocker.internetUrl'],
        icon: container.Labels['docker.idocker.icon'],
        status: container.State as ContainerStatus,
        index: container.Created,
        type: 'container' as const,
      }))
      .filter(item => item.url);
  }
  getAppsPublic(): boolean {
    return !!this.configService.getUserConfig('appsPagePublic');
  }
  async updateAppsPublic(isPublic: boolean) {
    await this.configService.setUserConfig('appsPagePublic', isPublic);
  }
  async getUserInfo(): Promise<UserInfo> {
    const userName = this.configService.getUserConfig<string>('username');
    const passwordMaxRetryNum = this.configService.getUserConfig<number>('passwordMaxRetryNum');
    return {
      userName,
      passwordMaxRetryNum,
    };
  }
  async updateUserInfo(data: UpdateUserInfoDto) {
    const { userName, passwordMaxRetryNum } = data;
    if (userName) {
      this.configService.setUserConfig('username', userName);
    }
    if (passwordMaxRetryNum) {
      this.configService.setUserConfig('passwordMaxRetryNum', passwordMaxRetryNum);
    }
  }
  async getNoticeSetting(): Promise<NoticeInfo> {
    const emailType = this.configService.getUserConfig<EmailType>('emailType');
    const emailAccount = this.configService.getUserConfig<string>('emailAccount');
    const emailPassword = this.configService.getUserConfig<string>('emailPassword');
    const events = this.configService.getUserConfig<Record<string, string[]>>('noticeEvents');
    return {
      emailType,
      emailAccount,
      emailPassword,
      events,
    };
  }
  async updateNoticeSetting(data: NoticeInfo) {
    await this.emailService.changeTransport(data.emailType, data.emailAccount, data.emailPassword);
    this.configService.setUserConfig('emailType', data.emailType);
    this.configService.setUserConfig('emailAccount', data.emailAccount);
    this.configService.setUserConfig('emailPassword', data.emailPassword);
    this.configService.setUserConfig('noticeEvents', data.events);
  }
}
