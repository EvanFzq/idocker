import { IsBoolean, IsInt, IsString, Max, Min, Length } from 'class-validator';

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
