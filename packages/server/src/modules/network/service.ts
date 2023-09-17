import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker';

@Injectable()
export class NetworkService {
  constructor(private readonly dockerService: DockerService) {}
  async getNetworkList() {
    return this.dockerService.docker.listNetworks();
  }
}
