import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

import { EmailType } from '@common/constants/enum';
import { EmailMessage } from '@common/types/setting';

import { EmailConfig } from '@/constants/setting';
import { ConfigService } from '@/modules/config';

@Injectable()
export class EmailService {
  private transport?: Transporter;
  ready: boolean = false;
  constructor(private readonly configService: ConfigService) {
    const emailType = this.configService.getUserConfig<EmailType>('emailType');
    const emailAccount = this.configService.getUserConfig<string>('emailAccount');
    const emailPassword = this.configService.getUserConfig<string>('emailPassword');
    if (emailType !== undefined && emailAccount && emailPassword) {
      this.changeTransport(emailType, emailAccount, emailPassword);
    }
  }
  async changeTransport(
    emailType: EmailType,
    emailAccount: string,
    emailPassword: string,
  ): Promise<void> {
    this.transport = createTransport({
      ...EmailConfig[emailType],
      auth: {
        user: emailAccount,
        pass: emailPassword,
      },
    });
    this.ready = await this.transport.verify();
  }
  async sendEmail(message: EmailMessage) {
    await this.transport.verify();
    await this.transport.sendMail(message);
  }
}
