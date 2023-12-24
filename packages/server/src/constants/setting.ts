import { EmailConfigOptions, DockerRegistry } from '@common/types/setting';
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

export const defaultDockerRegistrys: DockerRegistry[] = [
  {
    name: 'Docker Hub',
    url: 'hub.docker.com',
  },
  {
    name: '腾讯云',
    url: 'ccr.ccs.tencentyun.com',
  },
  {
    name: '南京大学',
    url: 'docker.nju.edu.cn',
  },
  {
    name: '上海交大',
    url: 'docker.mirrors.sjtug.sjtu.edu.cn',
  },
];
