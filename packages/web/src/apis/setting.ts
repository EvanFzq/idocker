import type { AppInfo, UserInfo } from '@common/types/setting';

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

export const getAppsPublic = async () => {
  return fetch.post<boolean>('/setting/apps/public');
};

export const setAppsPublic = async (isPublic: boolean) => {
  return fetch.put<void>('/setting/apps/public', { isPublic });
};

export const getUserInfo = () => {
  return fetch.post<UserInfo>('/setting/user');
};

export const updateUserInfo = (info: UserInfo) => {
  return fetch.put<UserInfo>('/setting/user', info);
};
