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
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { EmailType } from '@common/constants/enum';
import { DockerRegistry } from '@common/types/setting';

export class GetAppsDto {
  @IsBoolean()
  isLocal: boolean;
}

export class AppsPublicDto {
  @IsBoolean()
  isPublic: boolean;
}

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  @Length(4, 32) //6-32位
  userName: string;

  @IsOptional()
  @IsInt()
  @Max(100)
  @Min(1)
  passwordMaxRetryNum: number;
}

export class Events {
  @IsOptional()
  @IsString({ each: true })
  container: string[];

  @IsOptional()
  @IsString({ each: true })
  image: string[];

  @IsOptional()
  @IsString({ each: true })
  volume: string[];

  @IsOptional()
  @IsString({ each: true })
  network: string[];

  @IsOptional()
  @IsString({ each: true })
  volumes: string[];

  @IsOptional()
  @IsString({ each: true })
  service: string[];
}

export class NoticeEmail {
  @IsEnum(EmailType)
  type: EmailType;

  @IsEmail()
  account: string;

  @IsString()
  password: string;
}

export class UpdateNoticeInfoDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => NoticeEmail)
  email: NoticeEmail;

  @IsOptional()
  @ValidateNested()
  @Type(() => Events)
  events: Record<string, string[]>;
}

export class Registry {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateRegistryDto {
  @ValidateNested({ each: true })
  @Type(() => Registry)
  registrys: DockerRegistry[];
}
