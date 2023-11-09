import dayjs from 'dayjs';

import { AesEncrypt } from '@common/utils/crypto';
import {} from '@common/types/setting';

import { fetch } from './fetch';

export const login = async (username: string, password: string) => {
  return fetch.post<{ token: string }>('/auth/login', {
    username,
    password: AesEncrypt(password, username + dayjs().format('YYYY-MM-DD')),
  });
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const date = dayjs().format('YYYY-MM-DD');
  return fetch.put<void>('/auth/password', {
    currentPassword: AesEncrypt(currentPassword, date),
    newPassword: AesEncrypt(newPassword, date),
  });
};
