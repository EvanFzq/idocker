import type { ContainerActive } from '@common/constants/enum';
import { fetch } from './fetch';
import type { ContainerStats } from '@common/types/container';
import type { Container, CreateContainerParams } from '@common/types/container';

export const getContainerList = async () => {
  return fetch.post<Container[]>('/container/list');
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
  return fetch.post<void>('/container/new', params, { timeout: 0 });
};
