import type { AppInfo, UserInfo, NoticeInfo, SystemInfo } from '@common/types/setting';

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

export const getNoticeInfo = () => {
  return fetch.post<NoticeInfo>('/setting/notice');
};

export const updateNoticeInfo = (info: NoticeInfo) => {
  return fetch.put<void>('/setting/notice', info);
};

export const getSystemInfo = () => {
  return fetch.post<SystemInfo>('/setting/system/info');
};
