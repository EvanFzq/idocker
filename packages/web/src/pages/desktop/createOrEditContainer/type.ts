import type { PortConfig, NetworkConfig } from '@common/types/network';
import type { MountConfig } from '@common/types/container';

import type { UploadFile } from 'ant-design-vue';

export interface FormData {
  id?: string;
  name: string;
  icon: (UploadFile & { svg?: string })[];
  image?: string;
  tag: string;
  networks: NetworkConfig[];
  runAffterCreated: boolean;
  command?: string;
  hostname?: string;
  domainName?: string;
  extraHosts?: string;
  envs: { envKey: string; envValue: string }[];
  mounts: MountConfig[];
  ports: PortConfig[];
  restart: string;
  localUrl?: string;
  internetUrl?: string;
  privileged?: boolean;
  capAdd?: string[];
  capDrop?: string[];
  memory?: number;
  nanoCpus?: number;
}
