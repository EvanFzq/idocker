import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidV4 } from 'uuid';
import { UserInfo } from './type';
import { ConfigService } from '../config';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        // 获取默认username 和 password ,没有则设置
        const defaultPassword = uuidV4().split('-').join('').slice(0, 8);
        const username = this.configService.getConfig('username', 'admin');
        const password = this.configService.getConfig('password', defaultPassword);
        // 控制台打印初始账户密码
        console.log('username: ', username, ' password: ', password);
    }

    async validateUser(username: string, password: string): Promise<UserInfo> {
        const _username = this.configService.getConfig('username');
        const _password = this.configService.getConfig('password');
        if (username === _username && password === _password) {
            // 重置密码尝试次数为0
            await this.configService.setConfig('passwordRetryNum', 0);
            return { username };
        } else {
            const passwordRetryNum: number = this.configService.getConfig('passwordRetryNum');
            const passwordMaxRetryNum: number = this.configService.getConfig('passwordMaxRetryNum');
            if (passwordRetryNum >= passwordMaxRetryNum) {
                // 密码尝试次数超出最大尝试次数，重置密码为随机密码
                const resetPassword = uuidV4().split('-').join('').slice(0, 8);
                console.log('resetPassword: ', resetPassword);
                this.configService.setConfig('password', resetPassword);
            } else {
                // 密码尝试次数未超出最大尝试次数，尝试次数+1
                await this.configService.setConfig('passwordRetryNum', passwordRetryNum + 1);
            }
        }
    }
    async jwt(user: UserInfo) {
        const payload = { username: user.username };
        return this.jwtService.sign(payload);
    }
    async changePassword(currentPassword: string, newPassword: string) {
        const password = this.configService.getConfig<string>('password');
        if (password === currentPassword) {
            await this.configService.setConfig('password', newPassword);
        } else {
            throw new HttpException('当前密码错误！', HttpStatus.FORBIDDEN);
        }
    }
}
