import { accessSync, readFileSync, writeFileSync, constants, promises as fs } from 'fs';

import { Injectable } from '@nestjs/common';
import { parse, stringify } from 'yaml';

import { configDirPath, userConfigFilePath, systemConfigFilePath } from '@/constants/fs';
import { mkdirSync } from '@/utils/fs';

import { UserConfig, SystemConfig } from './type';

@Injectable()
export class ConfigService {
  private userConfig: Partial<UserConfig>;
  private systemConfig: Partial<SystemConfig>;
  constructor() {
    this.userConfig = {
      username: 'admin',
      passwordMaxRetryNum: 10,
      appsPageNeedLogin: true,
    };
    this.systemConfig = {};
    this.init();
  }
  private init() {
    // 建立config文件夹
    mkdirSync(configDirPath);
    // 建立用户配置文件或读取配置文件
    try {
      accessSync(userConfigFilePath, constants.W_OK);
      this.userConfig = {
        ...this.userConfig,
        ...parse(readFileSync(userConfigFilePath, { encoding: 'utf-8' })),
      };
    } catch (error) {
      writeFileSync(userConfigFilePath, stringify(this.userConfig));
    }
    // 建立系统配置文件或读取配置文件
    try {
      accessSync(systemConfigFilePath, constants.W_OK);
      this.systemConfig = {
        ...this.systemConfig,
        ...parse(readFileSync(systemConfigFilePath, { encoding: 'utf-8' })),
      };
    } catch (error) {
      writeFileSync(systemConfigFilePath, stringify(this.systemConfig));
    }
  }
  getUserConfig<T>(key: keyof UserConfig, defaultValue?: T): T {
    const value = this.userConfig[key];
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return value as any;
    }
    if (defaultValue !== undefined) {
      this.setUserConfig(key, defaultValue).catch(error => {
        console.error(error);
      });
      return defaultValue;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setUserConfig(key: keyof UserConfig, value: any) {
    const originalValue = this.userConfig[key];
    this.userConfig[key as string] = value;
    try {
      await fs.writeFile(userConfigFilePath, stringify(this.userConfig));
    } catch (error) {
      this.userConfig[key as string] = originalValue;
      return Promise.reject(error);
    }
  }
  getSystemConfig<T>(key: keyof SystemConfig, defaultValue?: T): T {
    const value = this.systemConfig[key];
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return value as any;
    }
    if (defaultValue !== undefined) {
      this.setSystemConfig(key, defaultValue).catch(error => {
        console.error(error);
      });
      return defaultValue;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setSystemConfig(key: keyof SystemConfig, value: any) {
    const originalValue = this.systemConfig[key];
    this.systemConfig[key as string] = value;
    try {
      await fs.writeFile(systemConfigFilePath, stringify(this.systemConfig));
    } catch (error) {
      this.systemConfig[key as string] = originalValue;
      return Promise.reject(error);
    }
  }
}
