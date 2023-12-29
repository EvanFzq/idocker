import { IsBoolean, IsIP, IsOptional, IsString, IsMACAddress } from 'class-validator';

export class AddNetworkDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  gateway?: string;

  @IsString()
  @IsOptional()
  subnet?: string;

  @IsString()
  @IsOptional()
  IPv6gateway?: string;

  @IsString()
  @IsOptional()
  IPv6subnet?: string;

  @IsBoolean()
  @IsOptional()
  enableIPv6?: boolean;

  @IsBoolean()
  @IsOptional()
  internal?: boolean;
}

export class AddContainerToNetworkDto {
  @IsString()
  networkId: string;

  @IsString()
  containerId: string;

  @IsIP('4')
  @IsOptional()
  ip?: string;

  @IsIP('6')
  @IsOptional()
  ipv6?: string;

  @IsMACAddress()
  @IsOptional()
  mac?: string;
}

export class RemoveContainerToNetworkDto {
  @IsString()
  networkId: string;

  @IsString()
  containerId: string;
}
