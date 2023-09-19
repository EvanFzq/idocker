import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class SearchVolumeDto {
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
