import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Docker, { PortBinding } from 'dockerode';
import dayjs from 'dayjs';

import { ContainerStats, ContainerDetail, Port } from '@common/types/container';
import { ContainerActive, RestartPolicy } from '@common/constants/enum';

import { commandFormat } from '@/utils/utils';

import { DockerService } from '../docker';
import { CreateContainerDto, UpdateContainerDto } from './dto';
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
      if (!portBindings[`${port.container}/${port.protocol}`]) {
        portBindings[`${port.container}/${port.protocol}`] = [{ HostPort: port.host }];
      } else {
        portBindings[`${port.container}/${port.protocol}`].push({ HostPort: port.host });
      }
    });
    const container = await this.dockerService.docker.createContainer({
      name: params.name,
      Labels: {
        'docker.idocker.icon': params.icon,
        'docker.idocker.localUrl': params.localUrl,
        'docker.idocker.internetUrl': params.internetUrl,
      },
      Env: params.envs?.map(env => `${env.key}=${env.value}`),
      Cmd: commandFormat(params.command),
      Image: imageTag,
      HostConfig: {
        NetworkMode: params.network,
        PortBindings: portBindings,
        RestartPolicy: {
          Name: params.restart,
          MaximumRetryCount: params.restart === RestartPolicy.OnFailure ? 5 : undefined,
        },
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

  async updateContainer(params: UpdateContainerDto) {
    const container = this.dockerService.docker.getContainer(params.id);
    const containerDetail = await container.inspect();
    try {
      await container.stop();
    } catch (error) {
      console.error(error);
    }
    await container.remove({ focus: true });
    const portBindings: Record<string, [{ HostPort: string }]> = {};
    params.ports?.forEach(port => {
      if (!portBindings[`${port.container}/${port.protocol}`]) {
        portBindings[`${port.container}/${port.protocol}`] = [{ HostPort: port.host }];
      } else {
        portBindings[`${port.container}/${port.protocol}`].push({ HostPort: port.host });
      }
    });
    const imageTag = params.image.indexOf(':') > 0 ? params.image : params.image + ':latest';

    const nextContainer = await this.dockerService.docker.createContainer({
      name: params.name,
      AttachStdin: containerDetail.Config.AttachStdin,
      AttachStdout: containerDetail.Config.AttachStdout,
      AttachStderr: containerDetail.Config.AttachStderr,
      Tty: containerDetail.Config.Tty,
      OpenStdin: containerDetail.Config.OpenStdin,
      StdinOnce: containerDetail.Config.StdinOnce,
      Env: params.envs?.map(env => `${env.key}=${env.value}`),
      Cmd: commandFormat(params.command),
      Entrypoint: containerDetail.Config.Entrypoint,
      Image: imageTag,
      Labels: {
        ...containerDetail.Config.Labels,
        'docker.idocker.icon': params.icon,
        'docker.idocker.localUrl': params.localUrl,
        'docker.idocker.internetUrl': params.internetUrl,
      },
      Volumes: containerDetail.Config.Volumes,
      WorkingDir: containerDetail.Config.WorkingDir,
      ExposedPorts: containerDetail.Config.ExposedPorts,
      HostConfig: {
        Links: containerDetail.HostConfig.Links,
        Memory: containerDetail.HostConfig.Memory,
        MemorySwap: containerDetail.HostConfig.MemorySwap,
        MemoryReservation: containerDetail.HostConfig.MemoryReservation,
        KernelMemory: containerDetail.HostConfig.KernelMemory,
        NanoCpus: containerDetail.HostConfig.NanoCpus,
        CpuPercent: containerDetail.HostConfig.CpuPercent,
        CpuShares: containerDetail.HostConfig.CpuShares,
        CpuPeriod: containerDetail.HostConfig.CpuPeriod,
        CpuRealtimePeriod: containerDetail.HostConfig.CpuRealtimePeriod,
        CpuRealtimeRuntime: containerDetail.HostConfig.CpuRealtimeRuntime,
        CpuQuota: containerDetail.HostConfig.CpuQuota,
        CpusetCpus: containerDetail.HostConfig.CpusetCpus,
        CpusetMems: containerDetail.HostConfig.CpusetMems,
        BlkioWeight: containerDetail.HostConfig.BlkioWeight,
        NetworkMode: params.network,
        PortBindings: portBindings,
        RestartPolicy: {
          Name: params.restart,
          MaximumRetryCount: params.restart === RestartPolicy.OnFailure ? 5 : undefined,
        },
        Mounts: params.mounts?.map(mount => ({
          Target: mount.container,
          Source: mount.type === 'bind' ? mount.hostBind : mount.volume,
          Type: mount.type,
          ReadOnly: mount.readonly,
        })),
      },
    });
    if (params.runAffterCreated) {
      await nextContainer.start();
    }
    return nextContainer;
  }

  async getContainerList() {
    return await this.dockerService.docker.listContainers({
      all: true,
    });
  }

  async getContainerDetail(id: string): Promise<ContainerDetail> {
    const detail = await this.dockerService.docker.getContainer(id).inspect();
    const ports: Port[] = [];
    if (detail.HostConfig.PortBindings) {
      Object.entries(detail.HostConfig.PortBindings).forEach(
        ([key, value]: [string, PortBinding[]]) => {
          const [containerPort, protocol] = key.split('/');
          value.forEach(item => {
            ports.push({
              hostPort: item.HostPort,
              hostIp: item.HostIp,
              containerPort,
              protocol: protocol as 'tcp' | 'udp',
            });
          });
        },
      );
    }

    return {
      id: detail.Id,
      name: detail.Name.slice(1),
      image: detail.Config.Image,
      status: detail.State.Status,
      startedAt: dayjs(detail.State.StartedAt).valueOf(),
      created: dayjs(detail.Created).valueOf(),
      labels: detail.Config.Labels,
      icon:
        detail.Config.Labels['docker.idocker.icon'] ||
        detail.Config.Labels['com.docker.desktop.extension.icon'] ||
        detail.Config.Labels['net.unraid.docker.icon'] ||
        null,
      localUrl: detail.Config.Labels['docker.idocker.localUrl'] || null,
      internetUrl: detail.Config.Labels['docker.idocker.internetUrl'] || null,
      isSelf: this.dockerService.currentContainerId === detail.Id,
      canUpdate: await this.dockerService.imageCanUpdate(detail.Config.Image, detail.Image),
      restartPolicyName: detail.HostConfig.RestartPolicy?.Name,
      restartPolicyMaximumRetryCount: detail.HostConfig.RestartPolicy?.MaximumRetryCount,
      cmd: detail.Config.Cmd,
      entrypoint: detail.Config.Entrypoint,
      mounts: (
        detail.Mounts as {
          Name?: string | undefined;
          Type: 'bind' | 'volume' | 'tmpfs';
          Source: string;
          Destination: string;
          Driver?: string | undefined;
          Mode: string;
          RW: boolean;
          Propagation: string;
        }[]
      )?.map(item => ({
        type: item.Type,
        source: item.Type === 'bind' ? item.Source : item.Name,
        target: item.Destination,
        rw: item.RW,
      })),
      ports,
      exposedPorts: detail.Config.ExposedPorts
        ? Object.keys(detail.Config.ExposedPorts).map(key => {
            const [port, protocol] = key.split('/');
            return { hostPort: port, protocol: protocol as 'tcp' | 'udp' };
          })
        : [],
      networks: detail.NetworkSettings.Networks
        ? Object.entries(detail.NetworkSettings.Networks).map(([type, value]) => ({
            id: value.NetworkID,
            type,
            ip: value.IPAddress,
            ipV6: value.GlobalIPv6Address,
            gateway: value.Gateway,
            gatewayV6: value.GlobalIPv6Address,
            prefixLen: value.IPPrefixLen,
            prefixLenV6: value.GlobalIPv6PrefixLen,
            mac: value.MacAddress,
          }))
        : [],
      envs: detail.Config.Env.map(item => {
        const [key, value] = item.split('=');
        return { key, value };
      }),
    };
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
        memoryUsage: memory_stats.usage,
        memoryLimit: memory_stats.limit,
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
        try {
          await container.stop();
        } catch (error) {
          console.error(error);
        }
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

  async updateContainerImage(id: string) {
    const container = this.dockerService.docker.getContainer(id);
    const containerDetail = await container.inspect();
    const imageTag = containerDetail.Config.Image;
    await this.dockerService.pullImage('local', imageTag);
    try {
      await container.stop();
    } catch (error) {
      console.error(error);
    }
    await container.remove({ focus: true });
    const nextContainer = await this.dockerService.docker.createContainer({
      name: containerDetail.Name.slice(1),
      AttachStdin: containerDetail.Config.AttachStdin,
      AttachStdout: containerDetail.Config.AttachStdout,
      AttachStderr: containerDetail.Config.AttachStderr,
      Tty: containerDetail.Config.Tty,
      OpenStdin: containerDetail.Config.OpenStdin,
      StdinOnce: containerDetail.Config.StdinOnce,
      Env: containerDetail.Config.Env,
      Cmd: containerDetail.Config.Cmd,
      Entrypoint: containerDetail.Config.Entrypoint,
      Image: imageTag,
      Labels: containerDetail.Config.Labels,
      Volumes: containerDetail.Config.Volumes,
      WorkingDir: containerDetail.Config.WorkingDir,
      ExposedPorts: containerDetail.Config.ExposedPorts,
      HostConfig: containerDetail.HostConfig,
    });
    await nextContainer.start();
    return { id: nextContainer.id };
  }
}
