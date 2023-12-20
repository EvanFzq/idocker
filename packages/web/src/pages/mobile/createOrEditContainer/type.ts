import type { MountConfig, Env } from '@common/types/container';
import type { PortConfig, NetworkConfig } from '@common/types/network';

import type { UploaderFileListItem } from 'vant';

export interface ContainerFormData {
  id?: string;
  name: string;
  icon: (UploaderFileListItem & { svg?: string })[];
  image: string;
  networks: NetworkConfig[];
  runAffterCreated: boolean;
  command?: string;
  envs: Env[];
  mounts: MountConfig[];
  ports: PortConfig[];
  restart: string;
  localUrl: string;
  internetUrl: string;
}
