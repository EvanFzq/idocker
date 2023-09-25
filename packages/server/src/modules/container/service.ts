import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { ContainerStats } from '@common/types/container';
import { ContainerActive } from '@common/constants/enum';
import { DockerService } from '../docker';
import { CreateContainerDto } from './dto';
import { ImageService } from '../image';

@Injectable()
export class ContainerService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly imageService: ImageService,
  ) {}
  async createContainer(params: CreateContainerDto) {
    const imageTag = params.image.indexOf(':') > 0 ? params.image : params.image + ':latest';

    await this.imageService.pullImage(imageTag);

    const portBindings: Record<string, [{ HostPort: string }]> = {};
    params.ports?.forEach(port => {
      portBindings[`${port.container}/${port.protocol}`] = [{ HostPort: port.host }];
    });
    const container = await this.dockerService.docker.createContainer({
      name: params.name,
      Env: params.envs?.map(env => `${env.key}=${env.value}`),
      Cmd: [params.command],
      Image: imageTag,
      HostConfig: {
        NetworkMode: params.network,
        PortBindings: portBindings,
        RestartPolicy: { Name: params.restart, MaximumRetryCount: 5 },
        Mounts: params.mounts?.map(mount => ({
          Target: mount.container,
          Source: mount.type === 'bind' ? mount.hostBind : mount.volume,
          Type: mount.type,
          ReadOnly: mount.readonly,
        })),
      },
    });
    if (params.runAffterCreated) {
      await this.dockerService.docker.getContainer(container.id).start();
    }
  }
  async getContainerList() {
    return await this.dockerService.docker.listContainers({
      all: true,
    });
  }
  async getContainerDetail(id: string) {
    return await this.dockerService.docker.getContainer(id).inspect();
  }

  async getContainerStats(ids: string[]): Promise<ContainerStats[]> {
    const statsList = await Promise.all(
      ids.map(id => this.dockerService.docker.getContainer(id).stats({ stream: false })),
    );
    return statsList.map(item => {
      const { cpu_stats, precpu_stats, memory_stats, id } = item as Docker.ContainerStats & {
        id: string;
      };
      const cpuDelta = cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
      const systemDelta = cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
      return {
        id,
        cpu: (cpuDelta / systemDelta) * cpu_stats.online_cpus * 100,
        memory_usage: memory_stats.usage,
        memory_limit: memory_stats.limit,
      };
    });
  }

  async activeContainer(id: string, type: ContainerActive) {
    const container = this.dockerService.docker.getContainer(id);
    if (id.startsWith(this.dockerService.currentContainerId)) {
      throw new HttpException('禁止操作提供容器管理的容器本身', HttpStatus.FORBIDDEN);
    }
    switch (type) {
      case ContainerActive.start:
        await container.start();
        break;
      case ContainerActive.stop:
        await container.stop();
        break;
      case ContainerActive.restart:
        await container.restart();
        break;
      case ContainerActive.remove:
        await container.remove();
        break;
      case ContainerActive.pause:
        await container.pause();
        break;
      case ContainerActive.unpause:
        await container.unpause();
        break;
      default:
        break;
    }
  }

  async getContainerLogs(id: string) {
    const container = this.dockerService.docker.getContainer(id);
    const res = await container.logs({
      follow: false,
      tail: 200,
      timestamps: true,
      stderr: true,
      stdout: true,
    });
    return res.toString();
  }
}
