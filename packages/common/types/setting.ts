import type { ContainerStatus } from '../constants/enum';

export interface UserInfo {
  userName: string;
  passwordMaxRetryNum: number;
}

export interface AppInfo {
  name: string;
  url: string;
  icon?: string;
  status?: ContainerStatus;
  index?: number;
  type: 'container' | 'custom';
}
