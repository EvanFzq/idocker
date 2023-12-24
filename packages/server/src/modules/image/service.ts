import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Dockerode from 'dockerode';

import { ImageOption, ImageItem } from '@common/types/image';

import { DockerService } from '../docker';

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
      if (!image || !image.id) {
        await this.dockerService.pullImage('local', imageTag);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async getImageList(): Promise<ImageItem[]> {
    const imageList: Dockerode.ImageInfo[] = await this.dockerService.docker.listImages();
    const containerList = await this.dockerService.docker.listContainers({
      all: true,
    });
    const list: ImageItem[] = imageList.map(image => {
      let containerNum = 0;
      const [imageName] = image.RepoDigests?.[0]?.split('@') || [''];
      containerList.forEach(container => {
        if (image.Id === container.ImageID) {
          containerNum++;
        }
      });
      return {
        ...image,
        Containers: containerNum,
        Name: imageName,
      };
    });
    return list;
  }
  async removeImage(id: string) {
    const image = this.dockerService.docker.getImage(id);
    const containerList = await this.dockerService.docker.listContainers({
      all: true,
    });
    containerList.forEach(container => {
      if (id === container.ImageID) {
        throw new HttpException(
          '镜像存在容器实例，无法删除，请先移除容器',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    await image.remove({ force: true });
    return;
  }
  async checkImageUpdate(names: string[]) {
    return await Promise.all(
      names.map(name => {
        return this.dockerService.pullImage('local', name, true);
      }),
    );
  }
}
