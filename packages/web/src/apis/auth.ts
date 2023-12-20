import dayjs from 'dayjs';

import { AesEncrypt } from '@common/utils/crypto';
import {} from '@common/types/setting';

import { fetch } from './fetch';

export const login = async (username: string, password: string) => {
  return fetch.post<{ token: string }>('/auth/login', {
    username,
    password: AesEncrypt(password, username + Math.floor(dayjs().unix() / 3600)),
  });
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const hours = Math.floor(dayjs().unix() / 3600).toString();
  return fetch.put<void>('/auth/password', {
    currentPassword: AesEncrypt(currentPassword, hours),
    newPassword: AesEncrypt(newPassword, hours),
  });
};
