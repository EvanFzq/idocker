import { EmailType } from '@common/constants/enum';
// 用户可修改的
export interface UserConfig {
  username: string; //用户名
  passwordMaxRetryNum: number; //密码最大尝试次数
  appsPagePublic: boolean; // 导航页是否需要公开（无需登录）
  appsPageWallpaperPath: string; // 导航页壁纸
  emailType: EmailType; //  邮箱类型
  emailAccount: string; //邮箱账号
  emailPassword: string; //邮箱密码或授权码
  noticeEvents: Record<string, string[]>; //通知事件
}
// 程序生成的用户无感知的
export interface SystemConfig {
  secret: number; //token密钥
  passwordRetryNum: number; //密码已尝试测试
  salt: string; // 密码加盐
  passwordHash: string; //密码哈希
}
