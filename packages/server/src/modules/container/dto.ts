import { IsString, IsEnum } from 'class-validator';
import { ContainerActive } from '@common/constants/enum';

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
