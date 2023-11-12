import {
  IsBoolean,
  IsInt,
  IsString,
  Max,
  Min,
  Length,
  IsEmail,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { EmailType } from '@common/constants/enum';

export class GetAppsDto {
  @IsBoolean()
  isLocal: boolean;
}

export class AppsPublicDto {
  @IsBoolean()
  isPublic: boolean;
}

export class UpdateUserInfoDto {
  @IsString()
  @Length(4, 32) //6-32位
  userName: string;

  @IsInt()
  @Max(100)
  @Min(1)
  passwordMaxRetryNum: number;
}

export class Events {
  @IsString({ each: true })
  container: string[];

  @IsString({ each: true })
  image: string[];

  @IsString({ each: true })
  volume: string[];

  @IsString({ each: true })
  network: string[];

  @IsString({ each: true })
  volumes: string[];

  @IsString({ each: true })
  service: string[];
}

export class UpdateNoticeInfoDto {
  @IsEnum(EmailType)
  emailType: EmailType;

  @IsEmail()
  emailAccount: string;

  @IsString()
  emailPassword: string;

  @ValidateNested()
  @Type(() => Events)
  events: Record<string, string[]>;
}
