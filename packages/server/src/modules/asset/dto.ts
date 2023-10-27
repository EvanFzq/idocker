import { IsEnum, IsOptional, IsString, IsNumberString } from 'class-validator';

import { ImageFit } from '@common/constants/enum';

export class UploadImgDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumberString()
  @IsOptional()
  width?: string;

  @IsNumberString()
  @IsOptional()
  height?: string;

  @IsEnum(ImageFit)
  @IsOptional()
  fit?: ImageFit;
}
