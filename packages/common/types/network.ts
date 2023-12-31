export interface Network {
  Name: string;
  Id: string;
  Created: string;
  Scope: string;
  Driver: string;
  EnableIPv6: boolean;
  IPAM: Ipam;
  Internal: boolean;
  Attachable: boolean;
  Ingress: boolean;
  ConfigFrom: ConfigFrom;
  ConfigOnly: boolean;
  Containers: number;
  Options: Record<string, string>;
  Labels: Record<string, string>;
}

export interface Ipam {
  Driver: string;
  Options: unknown;
  Config: Config[];
}

export interface Config {
  Subnet: string;
  Gateway: string;
}

export interface ConfigFrom {
  Network: string;
}

export interface PortConfig {
  host: number;
  container: number;
  protocol: 'tcp' | 'udp';
}

export interface AddNetworkParams {
  name: string;
  gateway?: string;
  subnet?: string;
  enableIPv6?: boolean;
  IPv6gateway?: string;
  IPv6subnet?: string;
  internal?: boolean;
}

export interface NetworkConfig {
  name?: string;
  mac?: string;
  ip?: string;
  ipV6?: string;
}
