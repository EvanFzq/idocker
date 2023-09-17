import { fetch } from './fetch';
import { Network } from '@common/types/network';

export const getNetworkList = async () => {
  return fetch.post<Network[]>('/network/list');
};
