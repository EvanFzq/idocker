import { execSync } from 'child_process';

import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import axios, { AxiosInstance } from 'axios';

import { DockerException, DockerErrorCode } from '@/constants/exception';

interface Env {
  name: string;
  socketPath: string;
  fetch: AxiosInstance;
}
@Injectable()
export class DockerService {
  private envs: Env[] = [];
  private imageLastVersion: Record<string, string> = {};
  public docker: Docker;
  public currentContainerId: string;
  constructor() {
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
          if (error.response) {
            return Promise.resolve(error.response);
          }
          return Promise.resolve({ status: 500, statusText: 'unknow error' });
        },
      ),
    );
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    try {
      this.currentContainerId = execSync('hostname', { timeout: 1000, encoding: 'utf-8' });
      console.info(this.currentContainerId);
    } catch (error) {
      console.error('获取容器本身ID失败，', error);
    }
  }
  private getFetch(env) {
    return this.envs.find(item => item.name === env)?.fetch;
  }

  async pullImage(
    env: string,
    image: string,
    catchError?: boolean,
  ): Promise<{
    image: string;
    tag: string;
    sha256: string;
  }> {
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
    const msgArr: Record<string, string>[] = res.data.split('\n').map(str => {
      try {
        return JSON.parse(str);
      } catch (error) {
        console.info(str, error);
        return {};
      }
    });
    const sha256 = msgArr.find(item => item.status?.startsWith('Digest: sha256'))?.status;
    this.imageLastVersion[image + ':' + tag] = sha256;
    return {
      image,
      tag,
      sha256,
    };
  }
  async imageCanUpdate(tag: string, sha256: string) {
    const imagesList = await this.docker.listImages({ all: true });
    return imagesList.some(item => item.RepoTags.includes(tag) && item.Id !== sha256);
  }
}
