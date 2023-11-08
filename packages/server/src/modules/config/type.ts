export interface UserConfig {
  username: string;
  passwordMaxRetryNum: number;
  appsPageNeedLogin: boolean;
}
export interface SystemConfig {
  secret: number;
  passwordRetryNum: number;
  salt: string;
  passwordHash: string;
  appsPageWallpaperPath: string;
}
