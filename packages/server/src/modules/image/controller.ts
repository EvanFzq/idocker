import { Body, Controller, Post } from '@nestjs/common';
import { ImageService } from './service';
import { SearchImageDto } from './dto';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post('search')
    async searchImage(@Body() body: SearchImageDto) {
        return this.imageService.searchImage(body.keyword, {
            limit: body.limit,
            official: body.official,
            stars: body.stars,
        });
    }
}
