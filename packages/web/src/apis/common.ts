import type { ImageFit } from '@common/constants/enum';
import { fetch } from './fetch';

export const uploadImg = async (
  file: File,
  options?: {
    name?: string;
    width?: number;
    height?: number;
    fit?: ImageFit;
  },
) => {
  const formData = new FormData();
  formData.append('file', file);
  const { name, width, height, fit } = options || {};

  name && formData.append('name', name);
  width && formData.append('width', width.toString());
  height && formData.append('height', height.toString());
  fit && formData.append('fit', fit);

  return fetch.post<string>('/asset/img', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
