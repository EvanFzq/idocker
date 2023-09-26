export interface UserConfig {
  username: string;
  passwordMaxRetryNum: number;
}
export interface SystemConfig {
  secret: number;
  passwordRetryNum: number;
  salt: string;
  passwordHash: string;
}
