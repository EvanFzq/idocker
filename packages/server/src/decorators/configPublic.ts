import { SetMetadata } from '@nestjs/common';

import { UserConfig, SystemConfig } from '@/modules/config/type';

export type ConfigKey = keyof UserConfig | keyof SystemConfig;
export type ConfigType = 'user' | 'system';

export const IS_CONFIG_PUBLIC_KEY = 'isConfigPublic';
export const ConfigPublic = (type: ConfigType, key: ConfigKey) =>
  SetMetadata(IS_CONFIG_PUBLIC_KEY, { type, key });
