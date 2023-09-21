import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AddNetworkDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  enableIPv6?: boolean;

  @IsBoolean()
  @IsOptional()
  internal?: boolean;
}
