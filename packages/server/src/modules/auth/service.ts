import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidV4 } from 'uuid';
import { UserInfo } from './type';
import { ConfigService } from '../config';
import { hash } from '@/utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // 获取默认username 和 password ,没有则设置

    const username = this.configService.getUserConfig('username', 'admin');
    const passwordHash = this.configService.getSystemConfig('passwordHash');
    if (!passwordHash) {
      // 没有密码，生成初始密码
      const password = uuidV4().split('-').join('').slice(0, 8);
      const salt = uuidV4().split('-').join('').slice(0, 8);
      this.configService.setSystemConfig('passwordHash', hash(password + salt));
      this.configService.setSystemConfig('salt', salt);
      // 控制台打印初始账户密码
      console.info('username: ', username, ' password: ', password);
    }
  }

  async validateUser(username: string, password: string): Promise<UserInfo> {
    const _username = this.configService.getUserConfig('username');
    const passwordHash = this.configService.getSystemConfig('passwordHash');
    const salt = this.configService.getSystemConfig('salt');
    if (username === _username && hash(password + salt) === passwordHash) {
      // 重置密码尝试次数为0
      await this.configService.setSystemConfig('passwordRetryNum', 0);
      return { username };
    } else {
      const passwordRetryNum: number = this.configService.getSystemConfig('passwordRetryNum');
      const passwordMaxRetryNum: number = this.configService.getUserConfig('passwordMaxRetryNum');
      if (passwordRetryNum >= passwordMaxRetryNum) {
        // 密码尝试次数超出最大尝试次数，重置密码为随机密码
        const resetPassword = uuidV4().split('-').join('').slice(0, 8);
        console.info('resetPassword: ', resetPassword);
        this.configService.setSystemConfig('passwordHash', hash(resetPassword + salt));
      } else {
        // 密码尝试次数未超出最大尝试次数，尝试次数+1
        await this.configService.setSystemConfig('passwordRetryNum', passwordRetryNum + 1);
      }
    }
  }
  async jwt(user: UserInfo) {
    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }
  async changePassword(currentPassword: string, newPassword: string) {
    const passwordHash = this.configService.getSystemConfig('passwordHash');
    const salt = this.configService.getSystemConfig('salt');
    if (hash(currentPassword + salt) === passwordHash) {
      await this.configService.setSystemConfig('passwordHash', hash(newPassword + salt));
    } else {
      throw new HttpException('当前密码错误！', HttpStatus.FORBIDDEN);
    }
  }
}
