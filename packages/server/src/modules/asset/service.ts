import path from 'path';
import { unlink } from 'fs/promises';

import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { v4 as uuidV4 } from 'uuid';

import { imgUploadDir } from '@/constants/fs';

import { UploadImgDto } from './dto';

@Injectable()
export class AssetService {
  async uploadImg(file: Express.Multer.File, option?: UploadImgDto) {
    const uuid = uuidV4().split('-').join('');
    const fileName = uuid + (option?.name ? path.parse(option.name).name : '') + '.webp';
    const imgPath = path.join(imgUploadDir, fileName);
    if (option?.height || option?.width) {
      await sharp(file.path)
        .rotate()
        .resize({
          width: option?.width ? Number(option.width) : undefined,
          height: option?.height ? Number(option.height) : undefined,
          fit: option?.fit,
          background: {
            r: 255,
            g: 255,
            b: 255,
            alpha: 1,
          },
        })
        .webp()
        .toFile(imgPath);
    } else {
      await sharp(file.path).rotate().webp().toFile(imgPath);
    }
    await unlink(file.path);
    return '/api/v1/asset/img/' + fileName;
  }
}
