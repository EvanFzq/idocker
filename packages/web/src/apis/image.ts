import { fetch } from './fetch';
import type { Image, ImageItem } from '@common/types/image';
import type { ImageOption } from '@common/types/image';

export const searchImage = async (keyword: string, option?: ImageOption) => {
  return fetch.post<Image[]>('/image/search', { keyword, ...option });
};

export const getImageList = async () => {
  return fetch.post<ImageItem[]>('/image/list');
};

export const removeImage = async (id: string) => {
  return fetch.delete<void>('/image/' + id);
};

export const updateImage = async (name: string) => {
  return fetch.put<void>('/image', { name }, { timeout: 0 });
};

export const pullImage = async (name: string) => {
  return fetch.post<void>('/image', { name }, { timeout: 0 });
};
