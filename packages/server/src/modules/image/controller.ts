import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';

import { ImageService } from './service';
import { SearchImageDto, ImageUpdateOrPullDto, CheckUpdateDto } from './dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @Put()
  async updateImage(@Body() body: ImageUpdateOrPullDto) {
    return this.imageService.pullImage(body.name);
  }
  @Post()
  async pullImage(@Body() body: ImageUpdateOrPullDto) {
    return this.imageService.pullImage(body.name);
  }
  @Delete('/:id')
  async removeImage(@Param('id') id: string) {
    return this.imageService.removeImage(id);
  }
  @Post('search')
  async searchImage(@Body() body: SearchImageDto) {
    return this.imageService.searchImage(body.keyword, {
      limit: body.limit,
      official: body.official,
      stars: body.stars,
    });
  }
  @Post('list')
  async getImageList() {
    return this.imageService.getImageList();
  }

  @Post('update/check')
  async checkImageUpdate(@Body() body: CheckUpdateDto) {
    return this.imageService.checkImageUpdate(body.names);
  }
}
