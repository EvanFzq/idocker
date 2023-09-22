export interface ContainerStats {
  id: string;
  cpu: number;
  memory_usage: number;
  memory_limit: number;
}

export interface Container {
  Id: string;
  disabled?: boolean;
  Created: string;
  Path: string;
  Args: string[];
  State: State;
  Image: string;
  ResolvConfPath: string;
  HostnamePath: string;
  HostsPath: string;
  LogPath: string;
  Name: string;
  RestartCount: number;
  Driver: string;
  Platform: string;
  MountLabel: string;
  ProcessLabel: string;
  AppArmorProfile: string;
  ExecIDs: unknown;
  HostConfig: HostConfig;
  GraphDriver: GraphDriver;
  Mounts: Mount[];
  Config: Config2;
  NetworkSettings: NetworkSettings;
}

export interface State {
  Status: string;
  Running: boolean;
  Paused: boolean;
  Restarting: boolean;
  OOMKilled: boolean;
  Dead: boolean;
  Pid: number;
  ExitCode: number;
  Error: string;
  StartedAt: string;
  FinishedAt: string;
}

export interface HostConfig {
  Binds: string[];
  ContainerIDFile: string;
  LogConfig: LogConfig;
  NetworkMode: string;
  PortBindings: PortBindings;
  RestartPolicy: RestartPolicy;
  AutoRemove: boolean;
  VolumeDriver: string;
  VolumesFrom: unknown;
  ConsoleSize: number[];
  CapAdd: unknown;
  CapDrop: unknown;
  CgroupnsMode: string;
  Dns: unknown[];
  DnsOptions: unknown[];
  DnsSearch: unknown[];
  ExtraHosts: unknown;
  GroupAdd: unknown;
  IpcMode: string;
  Cgroup: string;
  Links: unknown;
  OomScoreAdj: number;
  PidMode: string;
  Privileged: boolean;
  PublishAllPorts: boolean;
  ReadonlyRootfs: boolean;
  SecurityOpt: unknown;
  UTSMode: string;
  UsernsMode: string;
  ShmSize: number;
  Runtime: string;
  Isolation: string;
  CpuShares: number;
  Memory: number;
  NanoCpus: number;
  CgroupParent: string;
  BlkioWeight: number;
  BlkioWeightDevice: unknown[];
  BlkioDeviceReadBps: unknown[];
  BlkioDeviceWriteBps: unknown[];
  BlkioDeviceReadIOps: unknown[];
  BlkioDeviceWriteIOps: unknown[];
  CpuPeriod: number;
  CpuQuota: number;
  CpuRealtimePeriod: number;
  CpuRealtimeRuntime: number;
  CpusetCpus: string;
  CpusetMems: string;
  Devices: unknown[];
  DeviceCgroupRules: unknown;
  DeviceRequests: unknown;
  MemoryReservation: number;
  MemorySwap: number;
  MemorySwappiness: unknown;
  OomKillDisable: unknown;
  PidsLimit: unknown;
  Ulimits: unknown;
  CpuCount: number;
  CpuPercent: number;
  IOMaximumIOps: number;
  IOMaximumBandwidth: number;
  MaskedPaths: string[];
  ReadonlyPaths: string[];
}

export interface LogConfig {
  Type: string;
  Config: Config;
}

export interface Config {}

export interface PortBindings {
  [key: string]: N6379Tcp[];
}

export interface N6379Tcp {
  HostIp: string;
  HostPort: string;
}

export interface RestartPolicy {
  Name: string;
  MaximumRetryCount: number;
}

export interface GraphDriver {
  Data: Data2;
  Name: string;
}

export interface Data2 {
  LowerDir: string;
  MergedDir: string;
  UpperDir: string;
  WorkDir: string;
}

export interface Mount {
  Type: string;
  Source: string;
  Destination: string;
  Mode: string;
  RW: boolean;
  Name: string;
  Propagation: string;
}

export interface Config2 {
  Hostname: string;
  Domainname: string;
  User: string;
  AttachStdin: boolean;
  AttachStdout: boolean;
  AttachStderr: boolean;
  ExposedPorts: ExposedPorts;
  Tty: boolean;
  OpenStdin: boolean;
  StdinOnce: boolean;
  Env: string[];
  Cmd: string[];
  Image: string;
  Volumes: Volumes;
  WorkingDir: string;
  Entrypoint: string[];
  OnBuild: unknown;
  Labels: Labels;
}

export interface ExposedPorts {
  [key: string]: Record<string, string>;
}

export interface Volumes {
  [key: string]: Record<string, string>;
}

export type Labels = Record<string, string>;

export interface NetworkSettings {
  Bridge: string;
  SandboxID: string;
  HairpinMode: boolean;
  LinkLocalIPv6Address: string;
  LinkLocalIPv6PrefixLen: number;
  Ports: Ports;
  SandboxKey: string;
  SecondaryIPAddresses: unknown;
  SecondaryIPv6Addresses: unknown;
  EndpointID: string;
  Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  MacAddress: string;
  Networks: Networks;
}

export interface Ports {
  [key: string]: Port[];
}

export interface Port {
  HostIp: string;
  HostPort: string;
}

export interface Networks {
  bridge: Network;
  host: Network;
}

export interface Network {
  IPAMConfig: unknown;
  Links: unknown;
  Aliases: unknown;
  NetworkID: string;
  EndpointID: string;
  Gateway: string;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  MacAddress: string;
  DriverOpts: unknown;
}

export interface MountConfig {
  type: 'bind' | 'volume';
  hostBind?: string;
  volume?: string;
  container: string;
  readonly: boolean;
}

export interface CreateContainerParams {
  command: string;
  name: string;
  image: string;
  network: string;
  restart: string;
  runAffterCreated: boolean;
  ports: NewPort[];
  mounts: NewMount[];
  envs: NewEnv[];
}

export interface ContainerListParams {
  networkId?: string;
  imageId?: string;
}

export interface NewPort {
  host: string;
  container: string;
  protocol: string;
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
