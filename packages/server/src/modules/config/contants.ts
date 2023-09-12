import os from 'os';
import path from 'path';
console.log(os.type());
console.log(os.platform());

const platform = os.type();
export const isLinux = platform === 'Linux';
export const rootDirPath = isLinux ? '/docker-mobile' : path.resolve(os.homedir(), 'docker-mobile');
export const configDirPath = path.resolve(rootDirPath, 'config');
export const configFilePath = path.resolve(rootDirPath, 'config', 'config.json');
