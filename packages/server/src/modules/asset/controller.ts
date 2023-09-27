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
import { AssetService } from './service';
import { imgUploadDir } from '@/constants/fs';
import { mkdir } from '@/utils/fs';
import { UploadImgDto } from './dto';
import multer from 'multer';
import path from 'path';
import { createReadStream } from 'fs';
import { Public } from '@/decorators';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {
    mkdir(imgUploadDir);
  }

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

  @Public()
  @Get('img/:fileName')
  async getImage(@Param('fileName') fileName: string) {
    const file = createReadStream(path.join(imgUploadDir, fileName));
    return new StreamableFile(file);
  }
}
