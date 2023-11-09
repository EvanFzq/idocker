export interface UserConfig {
  username: string; //用户名
  passwordMaxRetryNum: number; //密码最大尝试次数
  appsPagePublic: boolean; // 导航页是否需要公开（无需登录）
}
export interface SystemConfig {
  secret: number;
  passwordRetryNum: number;
  salt: string;
  passwordHash: string;
  appsPageWallpaperPath: string;
}
