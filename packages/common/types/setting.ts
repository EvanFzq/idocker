import type { ContainerStatus, EmailType } from '../constants/enum';

export interface UserInfo {
  userName: string;
  passwordMaxRetryNum: number;
}

export interface AppInfo {
  name: string;
  url: string;
  icon?: string;
  status?: ContainerStatus;
  index?: number;
  type: 'container' | 'custom';
}

export interface EmailConfigOptions {
  host: string;
  port?: number;
  secure?: boolean;
  requireTLS?: boolean;
  ignoreTLS?: boolean;
}

interface Attachment {
  filename?: string;
  content?: string;
  path?: string;
  href?: string;
  httpHeaders?: Record<string, string>;
  contentType?: string;
  contentDisposition?: 'attachment' | 'inline';
  encoding?: string;
  headers?: Record<string, string>;
  raw?: string;
}

export interface EmailMessage {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

export interface NoticeInfo {
  emailType: EmailType;
  emailAccount: string;
  emailPassword: string;
  events: Record<string, string[]>;
}
