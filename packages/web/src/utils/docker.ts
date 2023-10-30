import type { Container } from '@common/types/container';

export const isSelf = (container: Partial<Container>) => {
  const index = container.Config?.Image?.indexOf('evanfzq/idocker');
  return typeof index === 'number' && index >= 0;
};
