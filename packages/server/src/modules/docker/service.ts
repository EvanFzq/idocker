import { execSync } from 'child_process';

import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import axios, { AxiosInstance } from 'axios';
import dayjs from 'dayjs';

import { EventAction, EventType, EventTypeName, EventActionName } from '@common/constants/enum';

import { DockerException, DockerErrorCode } from '@/constants/exception';
import { ConfigService } from '@/modules/config';
import { EmailService } from '@/modules/email';

import { Event } from './type';

interface Env {
  name: string;
  socketPath: string;
  fetch: AxiosInstance;
  timer?: NodeJS.Timeout;
}
@Injectable()
export class DockerService {
  private envs: Env[] = [];
  private imageLastVersion: Record<string, string> = {};
  public docker: Docker;
  public currentContainerId: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    // 实例化环境
    this.envs = [
      {
        name: 'local',
        socketPath: '/var/run/docker.sock',
        fetch: axios.create({
          socketPath: '/var/run/docker.sock',
          timeout: 5000,
        }),
      },
    ];
    this.envs.forEach(item =>
      item.fetch.interceptors.response.use(
        function (response) {
          // 2xx 范围内的状态码都会触发该函数。
          // 对响应数据做点什么
          return response;
        },
        function (error) {
          // 超出 2xx 范围的状态码都会触发该函数。
          // 对响应错误做点什么
          console.error(error);
          if (error.response) {
            return Promise.resolve(error.response);
          }
          return Promise.resolve({ status: 500, statusText: 'unknow error' });
        },
      ),
    );
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    try {
      this.currentContainerId = execSync('hostname', { timeout: 1000, encoding: 'utf-8' }).trim();
      console.info(this.currentContainerId);
    } catch (error) {
      console.error('获取容器本身ID失败，', error);
    }
    this.addEventListener();
  }
  private getFetch(env) {
    return this.envs.find(item => item.name === env)?.fetch;
  }
  private addEventListener() {
    // 添加事件监听
    this.envs.forEach(async env => {
      const getEvents = async () => {
        const noticeEvents = this.configService.getUserConfig<Record<
          EventType,
          EventAction[]
        > | null>('noticeEvents');
        try {
          const startTime = Math.floor(Date.now() / 1000);
          const endTime = startTime + 60;
          const res = await env.fetch.get(`/v1.37/events?since=${startTime}&until=${endTime}`, {
            timeout: 61000,
            responseType: 'stream',
          });
          const events: Event[] = [];
          res.data.on('data', (chunk: Buffer) => {
            try {
              // 处理流数据的逻辑
              const event: Event = JSON.parse(chunk.toString('utf-8'));
              if (
                event?.Type &&
                noticeEvents?.[event.Type] &&
                noticeEvents?.[event.Type].includes(event.Action)
              ) {
                events.push(event);
              }
            } catch (error) {
              console.error(error);
            }
          });
          res.data.on('error', error => {
            console.error('notice events error', error);
          });
          res.data.on('close', async () => {
            try {
              if (events.length > 0) {
                await this.sendEmail(env.name, events);
              }
              getEvents();
            } catch (error) {
              console.error(error);
            }
          });
        } catch (error) {
          console.error(error);
        }
      };
      getEvents();
    });
  }
  private async sendEmail(env: string, events: Event[]) {
    console.info('send email->', env, events);
    const emailAccount = this.configService.getUserConfig<string>('emailAccount');
    const containerList = await this.docker.listContainers({
      all: true,
    });
    const imagesList = await this.docker.listImages();
    const networkList = await this.docker.listNetworks();
    const volumesList = await this.docker.listVolumes();
    this.emailService.sendEmail({
      to: emailAccount,
      from: emailAccount,
      subject: 'Docker事件通知',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Docker事件通知</title>
      </head>
      <body><table style="text-align: center;border-spacing:0;border-width: 1px;border-style: solid;border-color: #ccc;">
      <tr style="background-color: #66f;color:#fff;height:48px">
          <td style="width: 50px;border-width: 1px;border-style: solid;border-color: #ccc;">序号</td>
          <td style="width: 130px;border-width: 1px;border-style: solid;border-color: #ccc;">类型</td>
          <td style="width: 150px;border-width: 1px;border-style: solid;border-color: #ccc;">对象</td>
          <td style="width: 80px;border-width: 1px;border-style: solid;border-color: #ccc;">事件</td>
          <td style="width: 100px;border-width: 1px;border-style: solid;border-color: #ccc;">环境</td>
          <td style="width: 180px;border-width: 1px;border-style: solid;border-color: #ccc;">发生时间</td>
      </tr>
      ${events
        .map((event, index) => {
          let name = '';
          switch (event.Type) {
            case EventType.Container:
              name = containerList.find(item => item.Id === event.Actor.ID)?.Names[0]?.slice(1);
              break;
            case EventType.Image:
              name = imagesList.find(item => item.Id === event.Actor.ID)?.RepoTags[0];
              break;
            case EventType.Network:
              name = networkList.find(item => item.Id === event.Actor.ID)?.Name;
              break;
            case EventType.Volume:
              name = volumesList.Volumes.find(item => item.Name === event.Actor.ID)?.Name;
              break;
            default:
              break;
          }
          return `<tr style="height:36px">
        <td style="border-width: 1px;border-style: solid;border-color: #ccc;">${index + 1}</td>
        <td style="border-width: 1px;border-style: solid;border-color: #ccc;">${
          EventTypeName[event.Type]
        }</td>
        <td style="border-width: 1px;border-style: solid;border-color: #ccc;max-width:150px;overflow: hidden;text-overflow: ellipsis;" title="${name}">${name}</td>
        <td style="border-width: 1px;border-style: solid;border-color: #ccc;">${
          EventActionName[event.Action]
        }</td>
        <td style="border-width: 1px;border-style: solid;border-color: #ccc;">${env}</td>
        <td style="border-width: 1px;border-style: solid;border-color: #ccc;">${dayjs
          .unix(event.time)
          .format('YYYY-MM-DD HH:mm:ss')}</td>
    </tr>`;
        })
        .join('')}
  </table></body>`,
    });
  }

  async pullImage(env: string, image: string, catchError?: boolean): Promise<void> {
    const fetch = this.getFetch(env);
    const tag = image.indexOf(':') > 0 ? image.split(':')[1] : 'latest';
    image = image.indexOf(':') > 0 ? image.split(':')[0] : image;
    const res = await fetch.post(`/v1.37/images/create?fromImage=${image}&tag=${tag}`, null, {
      timeout: 0,
    });

    if (res?.status === 404 && !catchError)
      throw new DockerException(DockerErrorCode.ImageNotExist);
    if (res?.status === 500 && res.data?.message?.indexOf('Timeout') > 0 && !catchError)
      throw new DockerException(DockerErrorCode.PullImageTimeout);
    if (res.status !== 200) {
      console.error(res);
      if (catchError) {
        return;
      } else {
        throw new DockerException();
      }
    }
  }
  async imageCanUpdate(tag: string, sha256: string) {
    const imagesList = await this.docker.listImages({ all: true });
    return imagesList.some(item => item.RepoTags.includes(tag) && item.Id !== sha256);
  }
}
