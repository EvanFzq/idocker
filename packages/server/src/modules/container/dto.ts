import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsNumberString,
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
  networkId?: string;

  @IsString()
  @IsOptional()
  volumeName?: string;
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

export class CreateContainerDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  network: string;

  @IsEnum(RestartPolicy)
  @IsOptional()
  restart?: RestartPolicy;

  @IsBoolean()
  @IsOptional()
  runAffterCreated?: boolean;

  @IsString()
  @IsOptional()
  command?: string;

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
}
