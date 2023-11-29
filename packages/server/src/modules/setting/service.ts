import { promises as fs } from 'fs';
import path from 'path';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ContainerStatus, EmailType } from '@common/constants/enum';
import { AppInfo, NoticeInfo, UserInfo } from '@common/types/setting';
import { webUrlTemplateFormat } from '@common/utils/utils';

import { wallpaperDir } from '@/constants/fs';
import { DockerService } from '@/modules/docker';
import { ConfigService } from '@/modules/config';
import { EmailService } from '@/modules/email';
import { ContainerService } from '@/modules/container';

import { UpdateUserInfoDto } from './dto';

@Injectable()
export class SettingService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly containerService: ContainerService,
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
    if (imgList.length === 0) {
      throw new HttpException('无可更换壁纸', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const imgPath = imgList[Math.floor(Math.random() * imgList.length)];
    await this.configService.setUserConfig('appsPageWallpaperPath', imgPath);
    return {
      src: '/api/v1/asset/wallpaper' + imgPath.split(wallpaperDir)[1],
    };
  }
  async getApps(req: Request, isLocal: boolean): Promise<AppInfo[]> {
    const containerList = await this.dockerService.docker.listContainers({ all: true });

    const containerDetailList = await Promise.all(
      containerList.map(item => this.containerService.getContainerDetail(item.Id)),
    );

    const { hostname, protocol } = new URL(req.headers['referer']);

    return containerDetailList
      .map(container => ({
        name: container.name,
        url: isLocal
          ? webUrlTemplateFormat(container.localUrl, hostname, protocol, container)
          : webUrlTemplateFormat(container.internetUrl, hostname, protocol, container),
        icon: container.icon,
        status: container.status as ContainerStatus,
        index: container.created,
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
      email: {
        type: emailType,
        account: emailAccount,
        password: emailPassword,
      },
      events: events || {},
    };
  }
  async updateNoticeSetting(data: NoticeInfo) {
    if (data.email) {
      const { type, account, password } = data.email;
      try {
        await this.emailService.changeTransport(type, account, password);
        this.configService.setUserConfig('emailType', type);
        this.configService.setUserConfig('emailAccount', account);
        this.configService.setUserConfig('emailPassword', password);
      } catch (error) {
        console.error(error);
        throw new HttpException('邮件地址或密码（授权码）错误', HttpStatus.BAD_REQUEST);
      }
    }
    if (data.events) {
      this.configService.setUserConfig('noticeEvents', data.events);
    }
  }
}
