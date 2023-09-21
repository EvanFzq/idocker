import { fetch } from './fetch';
import type { Network, AddNetworkParams } from '@common/types/network';

export const getNetworkList = async () => {
  return fetch.post<Network[]>('/network/list');
};

export const addNetwork = async (params: AddNetworkParams) => {
  return fetch.post<{ Id: string }>('/network', params);
};

export const removeNetwork = async (id: string) => {
  return fetch.delete<void>('/network/' + id);
};
