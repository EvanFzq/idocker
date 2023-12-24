import type { NetworkConfig } from './network';

export interface ContainerStats {
  id: string;
  cpu: number;
  cpuNum?: number;
  memoryUsage: number;
  memoryLimit: number;
}

export interface MountConfig {
  type: 'bind' | 'volume' | 'device';
  hostBind?: string;
  volume?: string;
  container: string;
  readonly: boolean;
}

export interface NewPort {
  host: string;
  container: string;
  protocol: 'tcp' | 'udp';
}

export interface NewMount {
  type: string;
  hostBind?: string;
  container: string;
  readonly: boolean;
  volume?: string;
}

export interface NewEnv {
  key: string;
  value: string;
}

export interface CreateContainerParams {
  command?: string;
  name: string;
  icon: string;
  image: string;
  networks: NetworkConfig[];
  restart: string;
  localUrl?: string;
  internetUrl?: string;
  runAffterCreated: boolean;
  hostname?: string;
  domainName?: string;
  extraHosts?: string;
  ports: NewPort[];
  mounts: NewMount[];
  envs: NewEnv[];
  privileged?: boolean;
  capAdd?: string[];
  capDrop?: string[];
  memory?: number;
  nanoCpus?: number;
}

export type UpdateContainerParams = CreateContainerParams & { id: string };

export interface ContainerListParams {
  networkName?: string;
  imageId?: string;
  volumeName?: string;
  hasMetrics?: boolean;
}

export interface ContainerListItem {
  id: string;
  name: string;
  image: string;
  registry?: string;
  status: string;
  startedAt: number;
  created: number;
  labels: Record<string, string>;
  icon?: string;
  localUrl?: string;
  internetUrl?: string;
  cpu?: number;
  cpuNum?: number;
  memoryLimit?: number;
  memoryUsage?: number;
  isSelf?: boolean;
  canUpdate?: boolean;
}

export interface Mount {
  type: 'volume' | 'bind' | 'tmpfs' | 'device';
  source: string;
  target: string;
  rw: boolean;
}
export interface Port {
  hostPort: string;
  hostIp?: string;
  containerPort: string;
  protocol: 'udp' | 'tcp';
}

export interface Network {
  name: string;
  id: string;
  ip?: string;
  ipV6?: string;
  gateway?: string;
  gatewayV6?: string;
  prefixLen?: number;
  prefixLenV6?: number;
  mac?: string;
}
export interface Env {
  key: string;
  value: string;
}
export interface ContainerDetail extends ContainerListItem {
  restartPolicyName: string;
  restartPolicyMaximumRetryCount: number;
  cmd?: string;
  entrypoint?: string | string[];
  mounts?: Mount[];
  ports?: Port[];
  hostname?: string;
  domainName?: string;
  extraHosts?: string;
  exposedPorts?: Pick<Port, 'hostPort' | 'protocol'>[];
  networks: Network[];
  envs: Env[];
  privileged?: boolean;
  capAdd?: string[];
  capDrop?: string[];
  memory?: number;
  nanoCpus?: number;
}
