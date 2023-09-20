import { Injectable } from '@nestjs/common';
import { accessSync, mkdirSync, readFileSync, writeFileSync, constants, promises as fs } from 'fs';
import { rootDirPath, configDirPath, configFilePath } from './contants';
import { Config } from './type';

@Injectable()
export class ConfigService {
  private config: Partial<Config>;
  constructor() {
    this.config = {
      passwordMaxRetryNum: 10,
      passwordRetryNum: 0,
    };
    this.init();
  }
  private init() {
    // 建立root文件夹
    try {
      accessSync(rootDirPath, constants.W_OK);
    } catch (error) {
      mkdirSync(rootDirPath);
    }
    // 建立config文件夹
    try {
      accessSync(configDirPath, constants.W_OK);
    } catch (error) {
      mkdirSync(configDirPath);
    }
    // 建立配置文件或读取配置文件
    try {
      accessSync(configFilePath, constants.W_OK);
      this.config = {
        ...this.config,
        ...JSON.parse(readFileSync(configFilePath, { encoding: 'utf-8' }) || '{}'),
      };
    } catch (error) {
      writeFileSync(configFilePath, JSON.stringify(this.config));
    }
  }
  getConfig<T>(key: keyof Config, defaultValue?: T): T {
    const value = this.config[key];
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return value as any;
    }
    if (defaultValue !== undefined) {
      this.setConfig(key, defaultValue).catch(error => {
        console.error(error);
      });
      return defaultValue;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setConfig(key: keyof Config, value: any) {
    const originalValue = this.config[key];
    this.config[key as string] = value;
    try {
      await fs.writeFile(configFilePath, JSON.stringify(this.config));
    } catch (error) {
      this.config[key as string] = originalValue;
      return Promise.reject(error);
    }
  }
}
