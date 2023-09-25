import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { NetworkService } from './service';
import { AddNetworkDto, AddContainerToNetworkDto, RemoveContainerToNetworkDto } from './dto';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('list')
  async getNetworkList() {
    return this.networkService.getNetworkList();
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
