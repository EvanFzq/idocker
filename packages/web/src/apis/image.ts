import { fetch } from './fetch';
import { Image } from '@common/types/image';
import { ImageOption } from '@common/types/image';

export const searchImage = async (keyword: string, option?: ImageOption) => {
    return fetch.post<Image[]>('/image/search', { keyword, ...option });
};
