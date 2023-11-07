import type { ContainerActive } from '@common/constants/enum';
import type { ContainerStats } from '@common/types/container';
import type {
  Container,
  CreateContainerParams,
  UpdateContainerParams,
  ContainerListParams,
  ContainerListItem,
  AppInfo,
} from '@common/types/container';

import { fetch } from './fetch';

export const getContainerList = async (params?: ContainerListParams) => {
  return fetch.post<ContainerListItem[]>('/container/list', params);
};

export const getContainerDetail = async (id: string) => {
  return fetch.post<Container>('/container/detail', { id });
};

export const getContainerStats = async (ids: string[]) => {
  return fetch.post<ContainerStats[]>('/container/stats', { ids });
};

export const getContainerLogs = async (id: string) => {
  return fetch.post<string>('/container/logs', { id });
};

export const activeContainer = async (id: string, type: ContainerActive) => {
  return fetch.put<void>('/container/active', { id, type });
};

export const createContainer = async (params: CreateContainerParams) => {
  return fetch.post<void>('/container', params, { timeout: 0 });
};

export const updateContainer = async (params: UpdateContainerParams) => {
  return fetch.put<void>('/container', params, { timeout: 0 });
};

export const updateContainerImage = async (id: string) => {
  return fetch.put<void>('/container/image', { id }, { timeout: 0 });
};

export const getApps = async (isLocal: boolean) => {
  return fetch.post<AppInfo[]>('/container/apps', { isLocal });
};
