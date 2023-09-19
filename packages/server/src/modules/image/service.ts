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
  async pullImage(image: string) {
    const imageTag = image.indexOf(':') > 0 ? image : image + ':latest';
    try {
      const image = this.dockerService.docker.getImage(imageTag);
      console.log(image);

      if (!image || !image.id) {
        return new Promise<void>((resolve, reject) => {
          this.dockerService.docker.pull(imageTag, (err, stream) => {
            if (err) {
              reject(err);
            } else {
              function onFinished(err, output) {
                resolve();
              }
              this.dockerService.docker.modem.followProgress(stream, onFinished);
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
