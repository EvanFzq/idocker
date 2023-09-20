import { fetch } from './fetch';
import type { Volume } from '@common/types/volume';

export const getVolumeList = async () => {
  return fetch.post<{ Volumes: Volume[] }>('/volume/list');
};
