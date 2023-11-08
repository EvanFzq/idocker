import type { AppInfo } from '@common/types/container';

import { fetch } from './fetch';

export const getApps = async (isLocal: boolean) => {
  return fetch.post<AppInfo[]>('/setting/apps', { isLocal });
};

export const getWallpaper = async () => {
  return fetch.post<{ src: string }>('/setting/wallpaper');
};

export const switchWallpaper = async () => {
  return fetch.post<{ src: string }>('/setting/switch/wallpaper');
};

export const getAppsNeedLogin = async () => {
  return fetch.post<boolean>('/setting/apps/login');
};

export const setAppsNeedLogin = async (needLogin: boolean) => {
  return fetch.put<void>('/setting/apps/login', { needLogin });
};
