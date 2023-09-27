import os from 'os';
import path from 'path';

export const rootDirPath =
  process.env.NODE_ENV === 'production'
    ? '/docker-mobile'
    : path.resolve(os.homedir(), 'docker-mobile');
export const configDirPath = path.resolve(rootDirPath, 'config');
export const userConfigFilePath = path.resolve(rootDirPath, 'config', 'userConfig.yml');
export const systemConfigFilePath = path.resolve(rootDirPath, 'config', 'systemConfig.yml');
export const imgUploadDir = path.join(rootDirPath, 'upload', 'img');
export const tempDir = path.join(rootDirPath, 'temp');
