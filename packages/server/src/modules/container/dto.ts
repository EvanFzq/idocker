import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsNumberString,
  IsInt,
  IsIP,
  IsMACAddress,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ContainerActive, RestartPolicy, PortType, MountType } from '@common/constants/enum';

export class ContainerStatsDto {
  @IsString({
    each: true,
  })
  ids: string[];
}

export class ContainerDetailDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  untilNs?: string;

  @IsInt()
  @IsOptional()
  num?: number;
}

export class ContainerActiveDto {
  @IsString()
  id: string;

  @IsEnum(ContainerActive)
  type: ContainerActive;
}

export class ContainerListDto {
  @IsString()
  @IsOptional()
  imageId?: string;

  @IsString()
  @IsOptional()
  networkName?: string;

  @IsString()
  @IsOptional()
  volumeName?: string;

  @IsBoolean()
  @IsOptional()
  hasMetrics?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsBoolean()
  @IsOptional()
  sortAsc?: boolean;
}

export class NewPort {
  @IsNumberString()
  host: string;

  @IsNumberString()
  container: string;

  @IsEnum(PortType)
  protocol: 'tcp' | 'udp';
}

export class NewMount {
  @IsEnum(MountType)
  type: 'bind' | 'volume';

  @IsString()
  @IsOptional()
  hostBind: string;

  @IsString()
  @IsOptional()
  volume: string;

  @IsString()
  container: string;

  @IsBoolean()
  @IsOptional()
  readonly: boolean;
}

export class NewEnv {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class NewNetwork {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMACAddress()
  @IsOptional()
  mac?: string;

  @IsIP('4')
  @IsOptional()
  ip?: string;

  @IsIP('6')
  @IsOptional()
  ipV6?: string;
}

export class CreateContainerDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  image: string;

  @ValidateNested({ each: true })
  @Type(() => NewNetwork)
  networks: NewNetwork[];

  @IsEnum(RestartPolicy)
  @IsOptional()
  restart?: RestartPolicy;

  @IsBoolean()
  @IsOptional()
  runAffterCreated?: boolean;

  @IsString()
  @IsOptional()
  command?: string;

  @IsString()
  @IsOptional()
  hostname?: string;

  @IsString()
  @IsOptional()
  domainName?: string;

  @IsString()
  @IsOptional()
  extraHosts?: string;

  @ValidateNested({ each: true })
  @Type(() => NewPort)
  @IsOptional()
  ports: NewPort[];

  @ValidateNested({ each: true })
  @Type(() => NewMount)
  @IsOptional()
  mounts: NewMount[];

  @ValidateNested({ each: true })
  @Type(() => NewEnv)
  @IsOptional()
  envs: NewEnv[];

  @IsString()
  @IsOptional()
  localUrl?: string;

  @IsString()
  @IsOptional()
  internetUrl?: string;
}

export class UpdateContainerDto extends CreateContainerDto {
  @IsString()
  id: string;
}

export class UpdateContainerImageDto {
  @IsString()
  id: string;
}
