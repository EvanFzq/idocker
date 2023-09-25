import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker';
import { AddNetworkDto, AddContainerToNetworkDto } from './dto';

@Injectable()
export class NetworkService {
  constructor(private readonly dockerService: DockerService) {}
  async getNetworkList() {
    const networkList = await this.dockerService.docker.listNetworks();
    const containerList = await this.dockerService.docker.listContainers({
      all: true,
    });
    return networkList.map(network => {
      let containerNum = 0;
      containerList.forEach(container => {
        Object.values(container.NetworkSettings.Networks).forEach(item => {
          if (item.NetworkID === network.Id) {
            containerNum++;
          }
        });
      });
      return { ...network, Containers: containerNum };
    });
  }
  async addNetwork(data: AddNetworkDto) {
    const IPAMConfig: Record<string, string>[] = [];
    const labels: Record<string, string> = {};
    if (data.gateway && data.subnet) {
      IPAMConfig.push({
        Subnet: data.subnet,
        Gateway: data.gateway,
      });
      labels.Subnet = data.subnet;
    }
    if (data.enableIPv6 && data.IPv6gateway && data.IPv6subnet) {
      IPAMConfig.push({
        Subnet: data.IPv6subnet,
        Gateway: data.IPv6gateway,
      });
      labels.IPv6subnet = data.IPv6subnet;
    }
    return await this.dockerService.docker.createNetwork({
      Name: data.name,
      EnableIPv6: data.enableIPv6,
      Internal: data.internal,
      CheckDuplicate: true,
      IPAM: {
        Driver: 'default',
        Config: IPAMConfig,
      },
      Labels: labels,
    });
  }
  async removeNetwork(id: string) {
    return await this.dockerService.docker.getNetwork(id).remove();
  }
  async addContainerToNetwork(data: AddContainerToNetworkDto) {
    const network = this.dockerService.docker.getNetwork(data.networkId);
    await network.connect({
      Container: data.containerId,
      EndpointConfig: {
        IPAMConfig: {
          IPv4Address: data.ip,
          IPv6Address: data.ipv6,
        },
      },
    });
    return;
  }
  async removeContainerToNetwork(networkId: string, containerId: string) {
    const network = this.dockerService.docker.getNetwork(networkId);
    await network.disconnect({
      Container: containerId,
    });
    return;
  }
}
