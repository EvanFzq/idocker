import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class SearchImageDto {
  @IsString()
  keyword: string;

  @IsInt()
  @IsOptional()
  limit?: number;

  @IsBoolean()
  @IsOptional()
  official?: boolean;

  @IsInt()
  @IsOptional()
  stars?: number;
}

export class ImageUpdateOrPullDto {
  @IsString()
  name: string;
}

export class CheckUpdateDto {
  @IsString({ each: true })
  names: string[];
}
