import { IsString } from 'class-validator';

export class CreateVolumeDto {
  @IsString()
  name: string;
}
export class RemoveVolumeDto {
  @IsString()
  name: string;
}
