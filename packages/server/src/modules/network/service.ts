import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker';

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
}
