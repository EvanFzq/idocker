import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker';
import { ImageOption } from '@common/types/image';

@Injectable()
export class ImageService {
    constructor(private readonly dockerService: DockerService) {}
    async searchImage(keyword: string, option?: ImageOption) {
        return this.dockerService.docker.searchImages({
            term: keyword,
            limit: option?.limit,
            official: option?.official,
            stars: option?.stars,
        });
    }
}
