import path from 'path';
import { createReadStream } from 'fs';

import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  Body,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

import { imgUploadDir } from '@/constants/fs';
import { mkdir } from '@/utils/fs';
import { Public } from '@/decorators';

import { AssetService } from './service';
import { UploadImgDto } from './dto';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {
    mkdir(imgUploadDir);
  }
  // 上传图片
  @Post('img')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, imgUploadDir);
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filePathObj = path.parse(file.originalname);
          cb(null, uniqueSuffix + '-' + filePathObj.name.slice(0, 50) + filePathObj.ext);
        },
      }),
    }),
  )
  async uploadImg(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1000 * 1000 }), //10MB
          new FileTypeValidator({ fileType: /^image/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadImgDto,
  ) {
    return this.assetService.uploadImg(file, body);
  }
  // 查看图片，不校验登录
  @Public()
  @Get('img/:fileName')
  async getImage(@Param('fileName') fileName: string) {
    const file = createReadStream(path.join(imgUploadDir, fileName));
    return new StreamableFile(file);
  }
}
