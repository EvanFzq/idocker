import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

import { NetworkService } from './service';
import { AddNetworkDto, AddContainerToNetworkDto, RemoveContainerToNetworkDto } from './dto';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('list')
  async getNetworkList() {
    let list = await this.networkService.getNetworkList();
    list = list.sort((a, b) => a.Name.localeCompare(b.Name));
    return list;
  }

  @Post()
  async addNetwork(@Body() body: AddNetworkDto) {
    return this.networkService.addNetwork(body);
  }

  @Post('container')
  async addContainerToNetwork(@Body() body: AddContainerToNetworkDto) {
    return this.networkService.addContainerToNetwork(body);
  }

  @Delete('container')
  async removeContainerToNetwork(@Body() body: RemoveContainerToNetworkDto) {
    return this.networkService.removeContainerToNetwork(body.networkId, body.containerId);
  }

  @Delete('/:id')
  async removeNetwork(@Param('id') id: string) {
    return this.networkService.removeNetwork(id);
  }
}
