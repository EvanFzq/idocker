import type { Network, AddNetworkParams } from '@common/types/network';

import { fetch } from './fetch';

export const getNetworkList = async () => {
  return fetch.post<Network[]>('/network/list');
};

export const addNetwork = async (params: AddNetworkParams) => {
  return fetch.post<{ Id: string }>('/network', params);
};

export const removeNetwork = async (id: string) => {
  return fetch.delete<void>('/network/' + id);
};

export const addContainerToNetwork = async (params: {
  networkId: string;
  containerId: string;
  ip?: string;
  ipv6?: string;
}) => {
  return fetch.post<void>('/network/container', params);
};

export const removeContainerFormNetwork = async (networkId: string, containerId: string) => {
  return fetch.delete<void>('/network/container', {
    data: { containerId, networkId },
  });
};
