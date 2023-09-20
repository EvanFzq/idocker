import { fetch } from './fetch';
import type { Network } from '@common/types/network';

export const getNetworkList = async () => {
  return fetch.post<Network[]>('/network/list');
};
