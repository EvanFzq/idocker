import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { NetworkService } from './service';
import { AddNetworkDto } from './dto';

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

  @Delete('/:id')
  async removeNetwork(@Param('id') id: string) {
    return this.networkService.removeNetwork(id);
  }
}
