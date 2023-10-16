import type { ContainerActive } from '@common/constants/enum';
import { fetch } from './fetch';
import type { ContainerStats } from '@common/types/container';
import type {
  Container,
  CreateContainerParams,
  UpdateContainerParams,
  ContainerListParams,
} from '@common/types/container';

export const getContainerList = async (params?: ContainerListParams) => {
  return fetch.post<Container[]>('/container/list', params);
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
