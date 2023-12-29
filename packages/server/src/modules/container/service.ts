import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Docker, { PortBinding } from 'dockerode';
import dayjs from 'dayjs';

import { ContainerStats, ContainerDetail, Port } from '@common/types/container';
import { parseImage } from '@common/utils/utils';
import { ContainerActive, RestartPolicy } from '@common/constants/enum';

import { BusinessErrorCode, BusinessException } from '@/constants/exception';
import { commandFormat } from '@/utils/utils';

import { DockerService } from '../docker';
import { CreateContainerDto, UpdateContainerDto } from './dto';
import { ImageService } from '../image';
import { NetworkService } from '../network';

@Injectable()
export class ContainerService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly imageService: ImageService,
    private readonly networkService: NetworkService,
  ) {}

  async createContainer(params: CreateContainerDto) {
    const imageTag = params.image.indexOf(':') > 0 ? params.image : params.image + ':latest';
    params.registry = params.registry === 'hub.docker.com' ? undefined : params.registry;
    const registryPrefix = params.registry ? params.registry + '/' : '';
    await this.imageService.pullImage(`${registryPrefix}${imageTag}`);

    const portBindings: Record<string, [{ HostPort: string }]> = {};
    // host网络不需要绑定端口
    if (!params.networks?.some(item => item.name === 'host')) {
      params.ports?.forEach(port => {
        if (!portBindings[`${port.container}/${port.protocol}`]) {
          portBindings[`${port.container}/${port.protocol}`] = [{ HostPort: port.host }];
        } else {
          portBindings[`${port.container}/${port.protocol}`].push({ HostPort: port.host });
        }
      });
    }
    const devices = params.mounts
      ?.filter(item => item.type === 'device')
      .map(item => ({
        PathOnHost: item.hostBind,
        PathInContainer: item.container,
        CgroupPermissions: item.readonly ? 'r' : 'rwm',
      }));
    const mounts = params.mounts
      ?.filter(item => item.type !== 'device')
      ?.map(mount => ({
        Target: mount.container,
        Source: mount.type === 'bind' ? mount.hostBind : mount.volume,
        Type: mount.type as 'bind' | 'volume',
        ReadOnly: mount.readonly,
      }));

    const container = await this.dockerService.docker.createContainer({
      name: params.name,
      Labels: {
        'docker.idocker.icon': params.icon,
        'docker.idocker.localUrl': params.localUrl,
        'docker.idocker.internetUrl': params.internetUrl,
      },
      Env: params.envs?.map(env => `${env.key}=${env.value}`),
      Cmd: commandFormat(params.command),
      Image: `${registryPrefix}${imageTag}`,
      Hostname: params.hostname,
      Domainname: params.domainName,
      HostConfig: {
        NetworkMode: params.networks?.[0]?.name || 'bridge',
        ExtraHosts: params.extraHosts?.split(/[,，\s]+/).filter(item => item),
        PortBindings: portBindings,
        RestartPolicy: {
          Name: params.restart,
          MaximumRetryCount: params.restart === RestartPolicy.OnFailure ? 5 : undefined,
        },
        Devices: devices,
        Mounts: mounts,
        Privileged: params.privileged,
        CapAdd: params.capAdd,
        CapDrop: params.capDrop,
        Memory: params.memory ? params.memory * 1024 * 1024 : undefined,
        NanoCpus: params.nanoCpus ? params.nanoCpus * 10 ** 9 : undefined,
      },
    });

    let networkError = null;
    const networkList = await this.networkService.getNetworkList();
    // 第一个网络如果是自定义网络先取消链接再附加ip、mac参数链接
    if (
      params.networks?.[0]?.name &&
      !['host', 'none', 'bridge'].includes(params.networks?.[0]?.name)
    ) {
      const firstNetworkId = networkList.find(item => item.Name === params.networks?.[0]?.name)?.Id;
      await this.networkService.removeContainerToNetwork(firstNetworkId, container.id);
    }

    // 链接网络
    if (params.networks?.length > 0) {
      for (let i = 0; i < params.networks.length; i++) {
        const network = params.networks[i];
        // host网络无法连接，链接其他网络后无法连接none网络
        if (network.name === 'host' || (network.name === 'none' && i !== 0)) {
          break;
        }
        if (network.name === 'bridge') {
          network.ip = undefined;
          network.ipV6 = undefined;
        }
        const networkInfo = networkList.find(item => item.Name === network.name);
        try {
          await this.networkService.addContainerToNetwork({
            containerId: container.id,
            networkId: networkInfo.Id,
            ip: network.ip,
            ipv6: network.ipV6,
            mac: network.mac,
          });
        } catch (error) {
          console.error(error);
          networkError = error;
        }
        if (network.name === 'none') {
          break;
        }
      }
    }
    // 创建容器只能
    if (params.runAffterCreated) {
      await this.dockerService.docker.getContainer(container.id).start();
    }
    if (networkError) {
      throw new BusinessException(BusinessErrorCode.NetworkConnectError, networkError);
    }
  }

  async updateContainer(params: UpdateContainerDto) {
    params.registry = params.registry === 'hub.docker.com' ? undefined : params.registry;
    const registryPrefix = params.registry ? params.registry + '/' : '';
    const imageTag = params.image.indexOf(':') > 0 ? params.image : params.image + ':latest';
    await this.imageService.pullImage(`${registryPrefix}${imageTag}`);
    const container = this.dockerService.docker.getContainer(params.id);
    const containerDetail = await container.inspect();
    if (['running', 'paused', 'restarting'].includes(containerDetail.State.Status)) {
      await container.stop();
    }

    await container.remove({ focus: true });
    const portBindings: Record<string, [{ HostPort: string }]> = {};
    // host网络不需要绑定端口
    if (!params.networks?.some(item => item.name === 'host')) {
      params.ports?.forEach(port => {
        if (!portBindings[`${port.container}/${port.protocol}`]) {
          portBindings[`${port.container}/${port.protocol}`] = [{ HostPort: port.host }];
        } else {
          portBindings[`${port.container}/${port.protocol}`].push({ HostPort: port.host });
        }
      });
    }

    const devices = params.mounts
      ?.filter(item => item.type === 'device')
      .map(item => ({
        PathOnHost: item.hostBind,
        PathInContainer: item.container,
        CgroupPermissions: item.readonly ? 'r' : 'rwm',
      }));
    const mounts = params.mounts
      ?.filter(item => item.type !== 'device')
      ?.map(mount => ({
        Target: mount.container,
        Source: mount.type === 'bind' ? mount.hostBind : mount.volume,
        Type: mount.type as 'bind' | 'volume',
        ReadOnly: mount.readonly,
      }));
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
      Image: `${registryPrefix}${imageTag}`,
      Labels: {
        ...containerDetail.Config.Labels,
        'docker.idocker.icon': params.icon,
        'docker.idocker.localUrl': params.localUrl,
        'docker.idocker.internetUrl': params.internetUrl,
      },
      Volumes: containerDetail.Config.Volumes,
      WorkingDir: containerDetail.Config.WorkingDir,
      ExposedPorts: containerDetail.Config.ExposedPorts,
      Hostname: params.hostname,
      Domainname: params.domainName,
      HostConfig: {
        Links: containerDetail.HostConfig.Links,
        MemorySwap: containerDetail.HostConfig.MemorySwap,
        MemoryReservation: containerDetail.HostConfig.MemoryReservation,
        KernelMemory: containerDetail.HostConfig.KernelMemory,
        CpuPercent: containerDetail.HostConfig.CpuPercent,
        CpuShares: containerDetail.HostConfig.CpuShares,
        CpuPeriod: containerDetail.HostConfig.CpuPeriod,
        CpuRealtimePeriod: containerDetail.HostConfig.CpuRealtimePeriod,
        CpuRealtimeRuntime: containerDetail.HostConfig.CpuRealtimeRuntime,
        CpuQuota: containerDetail.HostConfig.CpuQuota,
        CpusetCpus: containerDetail.HostConfig.CpusetCpus,
        CpusetMems: containerDetail.HostConfig.CpusetMems,
        BlkioWeight: containerDetail.HostConfig.BlkioWeight,
        NetworkMode: params.networks?.[0]?.name || 'bridge',
        ExtraHosts: params.extraHosts?.split(/[,，\s]+/).filter(item => item),
        PortBindings: portBindings,
        RestartPolicy: {
          Name: params.restart,
          MaximumRetryCount: params.restart === RestartPolicy.OnFailure ? 5 : undefined,
        },
        Devices: devices,
        Mounts: mounts,
        Privileged:
          params.privileged !== undefined
            ? params.privileged
            : containerDetail.HostConfig.Privileged,
        CapAdd: params.capAdd !== undefined ? params.capAdd : containerDetail.HostConfig.CapAdd,
        CapDrop: params.capDrop !== undefined ? params.capDrop : containerDetail.HostConfig.CapDrop,
        Memory:
          params.memory !== undefined
            ? params.memory * 1024 * 1024
            : containerDetail.HostConfig.Memory,
        NanoCpus:
          params.nanoCpus !== undefined
            ? params.nanoCpus * 10 ** 9
            : containerDetail.HostConfig.NanoCpus,
      },
    });
    // 链接网络
    let networkError = null;
    const networkList = await this.networkService.getNetworkList();
    // 第一个网络如果是自定义网络先取消链接再附加ip、mac参数链接
    if (
      params.networks?.[0]?.name &&
      !['host', 'none', 'bridge'].includes(params.networks?.[0]?.name)
    ) {
      const firstNetworkId = networkList.find(item => item.Name === params.networks?.[0]?.name)?.Id;
      await this.networkService.removeContainerToNetwork(firstNetworkId, nextContainer.id);
    }
    if (params.networks?.length > 0) {
      for (let i = 0; i < params.networks.length; i++) {
        const network = params.networks[i];
        // host网络无法连接，链接其他网络后无法连接none网络
        if (network.name === 'host' || (network.name === 'none' && i !== 0)) {
          break;
        }
        if (network.name === 'bridge') {
          network.ip = undefined;
          network.ipV6 = undefined;
        }
        const networkInfo = networkList.find(item => item.Name === network.name);
        try {
          // 先尝试指定IP
          await this.networkService.addContainerToNetwork({
            containerId: nextContainer.id,
            networkId: networkInfo.Id,
            ip: network.ip,
            ipv6: network.ipV6,
          });
        } catch (error) {
          console.error(error);
          // 再尝试不指定IP
          try {
            // 先尝试指定IP
            await this.networkService.addContainerToNetwork({
              containerId: nextContainer.id,
              networkId: networkInfo.Id,
            });
          } catch (error) {
            console.error(error);
            // 再尝试不指定IP
            networkError = error;
          }
        }
        // 链接none网络后无法连接其他网络
        if (network.name === 'none') {
          break;
        }
      }
    }
    if (params.runAffterCreated) {
      await nextContainer.start();
    }
    if (networkError) {
      throw new BusinessException(BusinessErrorCode.NetworkConnectError, networkError);
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

    const imageInfo = parseImage(detail.Config.Image);
    return {
      id: detail.Id,
      name: detail.Name.slice(1),
      image: imageInfo.imageTag,
      registry: imageInfo.repo,
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
      isSelf: detail.Id.startsWith(this.dockerService.currentContainerId),
      canUpdate: await this.dockerService.imageCanUpdate(detail.Config.Image, detail.Image),
      restartPolicyName: detail.HostConfig.RestartPolicy?.Name,
      restartPolicyMaximumRetryCount: detail.HostConfig.RestartPolicy?.MaximumRetryCount,
      cmd:
        detail.Config.Cmd?.map(item => (item.indexOf(' ') > 0 ? `"${item}"` : item))?.join(' ') ||
        '',
      entrypoint: detail.Config.Entrypoint,
      hostname: detail.Config.Hostname,
      domainName: detail.Config.Domainname,
      extraHosts: detail.HostConfig.ExtraHosts?.join('\n'),
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
      )
        ?.map(item => ({
          type: item.Type,
          source: item.Type === 'bind' ? item.Source : item.Name,
          target: item.Destination,
          rw: item.RW,
        }))
        .concat(
          detail.HostConfig.Devices?.map(device => ({
            type: 'device',
            source: device.PathOnHost,
            target: device.PathInContainer,
            rw: device.CgroupPermissions !== 'r',
          })) || [],
        ),
      ports,
      exposedPorts: detail.Config.ExposedPorts
        ? Object.keys(detail.Config.ExposedPorts).map(key => {
            const [port, protocol] = key.split('/');
            return { hostPort: port, protocol: protocol as 'tcp' | 'udp' };
          })
        : [],
      networks: detail.NetworkSettings.Networks
        ? Object.entries(detail.NetworkSettings.Networks).map(([name, value]) => ({
            id: value.NetworkID,
            name,
            ip: value.IPAddress || value.IPAMConfig?.IPv4Address,
            ipV6: value.GlobalIPv6Address || value.IPAMConfig?.IPv6Address,
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
      privileged: detail.HostConfig.Privileged,
      capAdd: detail.HostConfig.CapAdd,
      capDrop: detail.HostConfig.CapDrop,
      memory: detail.HostConfig.Memory
        ? Math.floor(detail.HostConfig.Memory / (1024 * 1024))
        : undefined,
      nanoCpus: detail.HostConfig.NanoCpus
        ? Math.floor(detail.HostConfig.NanoCpus / 10 ** 9)
        : undefined,
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
      if (!cpu_stats || !memory_stats) {
        return {
          id,
          cpu: 0,
          cpuNum: 1,
          memoryUsage: memory_stats?.usage || 0,
          memoryLimit: memory_stats?.limit || 0,
        };
      }
      const cpuDelta = cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
      const systemDelta = cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
      return {
        id,
        cpu: (cpuDelta / systemDelta) * cpu_stats.online_cpus * 100,
        cpuNum: cpu_stats.online_cpus,
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

  async getContainerLogs(id: string, untilNs?: string, num?: number) {
    const container = this.dockerService.docker.getContainer(id);

    const res = await container.logs({
      follow: false,
      tail: untilNs ? 10000 : num || 200,
      until: untilNs ? dayjs(untilNs).unix() + 1 : undefined,
      timestamps: true,
      stderr: true,
      stdout: true,
      details: true,
    });
    let texts = res
      .toString()
      .split('\n')
      // eslint-disable-next-line no-control-regex
      .map(item => item.replace(/(\x00|\x01|\x02|\x03|\x04|\x05|\x06|\x07)+.{1}/, '').trim())
      .filter(item => item)
      .reverse();

    // 去除同一秒内已获取的log
    if (untilNs) {
      texts = texts.filter(line => {
        const date = line.slice(0, 30).trim();
        // '2023-11-20T08:32:46.451962259Z'.localeCompare('2023-11-20T08:32:46.451962260Z') = -1
        return date.localeCompare(untilNs) < 0;
      });
    }
    // 限制条数
    if (num) {
      texts = texts.slice(0, num);
    }

    return texts.map(line => {
      const date = line.slice(0, 30).trim();
      const content = line.slice(31);
      return {
        date: date,
        text: content,
      };
    });
  }

  async updateContainerImage(id: string) {
    const container = this.dockerService.docker.getContainer(id);
    const containerDetail = await container.inspect();
    await this.dockerService.pullImage('local', containerDetail.Config.Image);
    try {
      await container.stop();
    } catch (error) {
      console.error(error);
    }
    await container.remove({ focus: true });
    const networks = Object.entries(containerDetail.NetworkSettings.Networks);
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
      Image: containerDetail.Config.Image,
      Labels: containerDetail.Config.Labels,
      Volumes: containerDetail.Config.Volumes,
      WorkingDir: containerDetail.Config.WorkingDir,
      ExposedPorts: containerDetail.Config.ExposedPorts,
      Hostname: containerDetail.Config.Hostname,
      Domainname: containerDetail.Config.Domainname,
      HostConfig: {
        ...containerDetail.HostConfig,
        NetworkMode: networks[0]?.[0] || 'bridge',
      },
    });
    // 链接网络
    let networkError = null;
    const networkList = await this.networkService.getNetworkList();
    // 第一个网络如果是自定义网络先取消链接再附加ip、mac参数链接
    if (networks[0]?.[0] && !['host', 'none', 'bridge'].includes(networks[0]?.[0])) {
      const firstNetworkId = networkList.find(item => item.Name === networks[0]?.[0])?.Id;
      await this.networkService.removeContainerToNetwork(firstNetworkId, container.id);
    }
    if (networks.length > 0) {
      for (let i = 0; i < networks.length; i++) {
        const [name, config] = networks[i];
        // host网络无法连接，链接其他网络后无法连接none网络
        if (name === 'host' || (name === 'none' && i !== 0)) {
          break;
        }
        if (name === 'bridge') {
          config.IPAddress = undefined;
          config.GlobalIPv6Address = undefined;
        }
        const networkInfo = networkList.find(item => item.Name === name);
        // 先尝试指定Ip
        try {
          await this.networkService.addContainerToNetwork({
            containerId: nextContainer.id,
            networkId: networkInfo.Id,
            ip: config.IPAddress,
            ipv6: config.GlobalIPv6Address,
          });
        } catch (error) {
          // 再尝试不指定ip
          try {
            await this.networkService.addContainerToNetwork({
              containerId: nextContainer.id,
              networkId: networkInfo.Id,
            });
          } catch (error) {
            console.error(error);
            networkError = error;
          }
        }
        // 链接none网络后无法连接其他网络
        if (name === 'none') {
          break;
        }
      }
    }
    await nextContainer.start();
    if (networkError) {
      throw new BusinessException(BusinessErrorCode.NetworkConnectError, networkError);
    }
    return { id: nextContainer.id };
  }
}
