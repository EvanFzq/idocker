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
  Containers: Record<string, string>;
  Options: Record<string, string>;
  Labels: Record<string, string>;
}

export interface Ipam {
  Driver: string;
  Options: any;
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
  host?: number;
  container?: number;
  type: 'tcp' | 'udp';
}
