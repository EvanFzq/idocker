import type { Volume } from '@common/types/volume';

import { fetch } from './fetch';

export const getVolumeList = async () => {
  return fetch.post<Volume[]>('/volume/list');
};

export const createVolume = async (name: string) => {
  return fetch.post<void>('/volume', { name });
};

export const removeVolume = async (name: string) => {
  return fetch.delete<void>('/volume', { data: { name } });
};
