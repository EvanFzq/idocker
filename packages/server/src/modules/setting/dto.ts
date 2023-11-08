import { IsBoolean } from 'class-validator';

export class GetAppsDto {
  @IsBoolean()
  isLocal: boolean;
}

export class AppsNeedLoginDto {
  @IsBoolean()
  needLogin: boolean;
}
