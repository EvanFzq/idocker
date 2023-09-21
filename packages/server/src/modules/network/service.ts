import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker';
import { AddNetworkDto } from './dto';

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
    return await this.dockerService.docker.createNetwork({
      Name: data.name,
      EnableIPv6: data.enableIPv6,
      Internal: data.internal,
      CheckDuplicate: true,
    });
  }
  async removeNetwork(id: string) {
    return await this.dockerService.docker.getNetwork(id).remove();
  }
}
