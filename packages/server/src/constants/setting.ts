import { EmailConfigOptions } from '@common/types/setting';
import { EmailType } from '@common/constants/enum';

export const EmailConfig: Record<string, EmailConfigOptions> = {
  [EmailType.QQ]: {
    host: 'smtp.qq.com',
    port: 587,
    secure: false,
    requireTLS: true,
  },
  [EmailType.Outlook]: {
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    requireTLS: true,
  },
  [EmailType.WangYi163]: {
    host: 'smtp.163.com',
    port: 587,
    secure: false,
    requireTLS: true,
  },
};
