import { Body, Controller, Post } from '@nestjs/common';
import { NetworkService } from './service';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('list')
  async getNetworkList() {
    return this.networkService.getNetworkList();
  }
}
